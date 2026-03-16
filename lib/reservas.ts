import { nanoid } from 'nanoid'
import { decrementarStockDia, guardarReserva, getCupon } from './kv'
import { getSabor } from './edge-config'
import { estaAbierto, esFechaValida } from './horario'
import type {
  CrearReservaInput,
  CrearReservaResponse,
  ErrorResponse,
  Reserva,
} from './types'
import { z } from 'zod'

// ─── Validación de entrada ─────────────────────────────────────────────────────

const ReservaSchema = z.object({
  cliente: z.object({
    nombre: z.string().min(2).max(100),
    email: z.string().email(),
    telefono: z.string().regex(/^\+?[\d\s\-]{9,15}$/),
  }),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sabor: z.string().min(1).max(50),
  cantidad: z.number().int().min(1).max(4),
  notas: z.string().max(300).optional(),
  cupon: z.string().max(50).optional(),
})

// ─── Lógica Principal ─────────────────────────────────────────────────────────

export async function crearReserva(
  input: unknown
): Promise<CrearReservaResponse | ErrorResponse> {
  // 1. Validar horario
  if (!estaAbierto()) {
    return {
      ok: false,
      error: 'Las reservas solo se aceptan de 07:00 a 14:00 (hora de Madrid)',
      code: 'FUERA_HORARIO',
    }
  }

  // 2. Validar schema de entrada
  const parsed = ReservaSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
      code: 'VALIDACION',
    }
  }

  const data = parsed.data as CrearReservaInput

  // 3. Validar cupón (si se proporcionó)
  let conCupon = false
  if (data.cupon) {
    const cupon = await getCupon(data.cupon)
    if (!cupon || !cupon.activo) {
      return {
        ok: false,
        error: 'El cupón introducido no es válido o ha expirado.',
        code: 'CUPON_INVALIDO',
      }
    }
    conCupon = true
  }

  // 4. Validar fecha dentro de la ventana permitida
  const { valida, error: errorFecha } = esFechaValida(data.fecha, conCupon)
  if (!valida) {
    return {
      ok: false,
      error: errorFecha ?? 'Fecha no válida',
      code: 'FECHA_INVALIDA',
    }
  }

  // 5. Validar que el sabor existe
  const sabor = await getSabor(data.sabor)
  if (!sabor) {
    return {
      ok: false,
      error: 'El sabor seleccionado no está disponible',
      code: 'VALIDACION',
    }
  }

  // 6. Decrementar el contador diario total de forma atómica (máx 8 tortillas/día)
  const stockRestante = await decrementarStockDia(data.fecha, data.cantidad)

  if (stockRestante === null) {
    return {
      ok: false,
      error: `Lo sentimos, no quedan tortillas disponibles para el ${data.fecha}. El cupo diario (8 unidades) está completo.`,
      code: 'SIN_STOCK',
    }
  }

  // 7. Persistir la reserva
  const reserva: Reserva = {
    id: `res_${nanoid(10)}`,
    cliente: data.cliente,
    fecha: data.fecha,
    sabor: data.sabor,
    cantidad: data.cantidad,
    estado: 'confirmada',
    notas: data.notas,
    creadaEn: new Date().toISOString(),
  }

  await guardarReserva(reserva)

  return {
    ok: true,
    reserva,
    stockRestante,
  }
}
