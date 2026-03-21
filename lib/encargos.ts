import { nanoid } from 'nanoid'
import { z } from 'zod'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { addDays, differenceInHours } from 'date-fns'
import { Resend } from 'resend'

import { getSabores } from './edge-config'
import { guardarEncargo } from './kv'
import type {
  CrearEncargoInput,
  CrearEncargoResponse,
  ErrorResponse,
  Encargo,
  LineaEncargo,
} from './types'

// ─── Constantes ───────────────────────────────────────────────────────────────

const ZONA = 'Europe/Madrid'
const MIN_HORAS_ANTELACION = 48
const MAX_DIAS_FUTURO = 30

export const HORAS_RECOGIDA = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '13:30',
] as const

// ─── Schema Zod ───────────────────────────────────────────────────────────────

const LineaSchema = z.object({
  saborId: z.string().min(1).max(50),
  tamano: z.enum(['mediana', 'grande']),
  cantidad: z.number().int().min(1).max(20),
})

const EncargoSchema = z.object({
  cliente: z.object({
    nombre: z.string().min(2).max(100),
    email: z.string().email(),
    telefono: z.string().regex(/^\+?[\d\s\-]{9,15}$/),
  }),
  lineas: z.array(LineaSchema).min(1).max(20),
  fechaRecogida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horaRecogida: z.enum(HORAS_RECOGIDA),
  notas: z.string().max(400).optional(),
})

// ─── Validación de fecha y hora ───────────────────────────────────────────────

function validarFechaHora(
  fechaRecogida: string,
  horaRecogida: string
): { valida: true } | { valida: false; error: string } {
  const ahoraMadrid = toZonedTime(new Date(), ZONA)
  const [hh, mm] = horaRecogida.split(':').map(Number)

  // Construir el datetime de recogida en zona Madrid
  const recogidaUTC = fromZonedTime(
    new Date(
      parseInt(fechaRecogida.slice(0, 4)),
      parseInt(fechaRecogida.slice(5, 7)) - 1,
      parseInt(fechaRecogida.slice(8, 10)),
      hh,
      mm,
      0
    ),
    ZONA
  )

  // Mínimo 48h de antelación
  const horasAntelacion = differenceInHours(recogidaUTC, ahoraMadrid)
  if (horasAntelacion < MIN_HORAS_ANTELACION) {
    return {
      valida: false,
      error: `Los encargos necesitan al menos 48 horas de antelación. La fecha más próxima disponible es el ${addDays(ahoraMadrid, 2).toLocaleDateString('es-ES')}.`,
    }
  }

  // Máximo 30 días
  const maxFecha = addDays(ahoraMadrid, MAX_DIAS_FUTURO)
  if (recogidaUTC > maxFecha) {
    return {
      valida: false,
      error: `No se pueden hacer encargos con más de ${MAX_DIAS_FUTURO} días de antelación.`,
    }
  }

  return { valida: true }
}

// ─── Cálculo de totales (servidor) ────────────────────────────────────────────

type SaborMap = Record<string, { nombre: string; precio: number; precioGrande?: number }>

function calcularLineas(
  lineasInput: CrearEncargoInput['lineas'],
  saboresMap: SaborMap
): { lineas: LineaEncargo[]; total: number } | null {
  const lineas: LineaEncargo[] = []
  let total = 0

  for (const l of lineasInput) {
    const sabor = saboresMap[l.saborId]
    if (!sabor) return null

    const precioUnitario =
      l.tamano === 'grande' ? (sabor.precioGrande ?? sabor.precio * 1.8) : sabor.precio
    const subtotal = precioUnitario * l.cantidad

    lineas.push({
      saborId: l.saborId,
      nombreSabor: sabor.nombre,
      tamano: l.tamano,
      cantidad: l.cantidad,
      precioUnitario,
      subtotal,
    })

    total += subtotal
  }

  return { lineas, total: Math.round(total * 100) / 100 }
}

// ─── Emails ───────────────────────────────────────────────────────────────────

function filasTabla(lineas: LineaEncargo[]): string {
  return lineas
    .map(
      (l) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #2a1800">${l.nombreSabor}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:center">${l.tamano === 'grande' ? 'Grande (12 huevos)' : 'Mediana (6 huevos)'}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:center">${l.cantidad}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:right">${l.precioUnitario.toFixed(2)} €</td>
          <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:right">${l.subtotal.toFixed(2)} €</td>
        </tr>`
    )
    .join('')
}

function htmlEmailAdmin(encargo: Encargo): string {
  return `
    <div style="font-family:sans-serif;background:#1A0E05;color:#FAF0DC;padding:32px;border-radius:12px;max-width:600px">
      <h2 style="color:#EAB85A;margin-top:0">Nuevo encargo recibido</h2>
      <p><strong>ID:</strong> ${encargo.id}</p>
      <p><strong>Cliente:</strong> ${encargo.cliente.nombre}</p>
      <p><strong>Email:</strong> ${encargo.cliente.email}</p>
      <p><strong>Teléfono:</strong> <a href="tel:${encargo.cliente.telefono}" style="color:#EAB85A">${encargo.cliente.telefono}</a></p>
      <p><strong>Recogida:</strong> ${encargo.fechaRecogida} a las ${encargo.horaRecogida}</p>
      ${encargo.notas ? `<p><strong>Notas:</strong> ${encargo.notas}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr style="background:rgba(196,120,50,0.2)">
            <th style="padding:8px 12px;text-align:left">Producto</th>
            <th style="padding:8px 12px;text-align:center">Tamaño</th>
            <th style="padding:8px 12px;text-align:center">Uds</th>
            <th style="padding:8px 12px;text-align:right">Precio</th>
            <th style="padding:8px 12px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>${filasTabla(encargo.lineas)}</tbody>
      </table>
      <p style="text-align:right;font-size:1.2em;margin-top:12px"><strong style="color:#EAB85A">Total: ${encargo.total.toFixed(2)} €</strong></p>
    </div>
  `
}

function htmlEmailCliente(encargo: Encargo): string {
  return `
    <div style="font-family:sans-serif;background:#1A0E05;color:#FAF0DC;padding:32px;border-radius:12px;max-width:600px">
      <h2 style="color:#EAB85A;margin-top:0">¡Encargo confirmado!</h2>
      <p>Hola ${encargo.cliente.nombre}, hemos recibido tu encargo. Te lo tendremos listo para recoger el <strong>${encargo.fechaRecogida} a las ${encargo.horaRecogida}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr style="background:rgba(196,120,50,0.2)">
            <th style="padding:8px 12px;text-align:left">Producto</th>
            <th style="padding:8px 12px;text-align:center">Tamaño</th>
            <th style="padding:8px 12px;text-align:center">Uds</th>
            <th style="padding:8px 12px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${encargo.lineas
            .map(
              (l) =>
                `<tr>
                  <td style="padding:6px 12px;border-bottom:1px solid #2a1800">${l.nombreSabor}</td>
                  <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:center">${l.tamano === 'grande' ? 'Grande' : 'Mediana'}</td>
                  <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:center">${l.cantidad}</td>
                  <td style="padding:6px 12px;border-bottom:1px solid #2a1800;text-align:right">${l.subtotal.toFixed(2)} €</td>
                </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <p style="text-align:right;font-size:1.2em;margin-top:12px"><strong style="color:#EAB85A">Total: ${encargo.total.toFixed(2)} €</strong></p>
      <hr style="border-color:rgba(196,120,50,0.2);margin:24px 0"/>
      <p style="color:rgba(250,240,220,0.6);font-size:0.85em">
        📍 C. Postas, 2 · San Agustín de Guadalix<br/>
        📞 <a href="tel:+34633771163" style="color:#EAB85A">633 77 11 63</a><br/>
        🕐 Recogida: ${encargo.fechaRecogida} a las ${encargo.horaRecogida}<br/>
        🆔 Referencia: ${encargo.id}
      </p>
    </div>
  `
}

async function enviarEmails(encargo: Encargo): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const resend = new Resend(process.env.RESEND_API_KEY)
  const adminEmail = process.env.ADMIN_EMAIL ?? 'hola@cafemontes.es'
  const fromEmail = process.env.FROM_EMAIL ?? 'encargos@cafemontes.es'

  const fechaFormato = new Date(encargo.fechaRecogida).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  await Promise.allSettled([
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `Nuevo encargo — ${encargo.cliente.nombre} · ${fechaFormato} ${encargo.horaRecogida}`,
      html: htmlEmailAdmin(encargo),
    }),
    resend.emails.send({
      from: fromEmail,
      to: encargo.cliente.email,
      subject: `¡Encargo confirmado! — Recogida el ${fechaFormato}`,
      html: htmlEmailCliente(encargo),
    }),
  ])
}

// ─── Precios fallback (modo demo sin Edge Config) ────────────────────────────

const SABORES_DEMO_MAP: SaborMap = {
  'clasica-con': { nombre: 'Clásica con Cebolla',  precio: 8.00,  precioGrande: 14.50 },
  'clasica-sin': { nombre: 'Clásica sin Cebolla',  precio: 8.00,  precioGrande: 14.50 },
  'jamon-queso': { nombre: 'Jamón York y Queso',   precio: 10.00, precioGrande: 18.50 },
  'chorizo':     { nombre: 'Chorizo',              precio: 10.00, precioGrande: 18.50 },
  'morcilla':    { nombre: 'Morcilla',             precio: 10.00, precioGrande: 18.50 },
  'atun':        { nombre: 'Atún',                 precio: 10.00, precioGrande: 18.50 },
}

// ─── Función principal ─────────────────────────────────────────────────────────

export async function crearEncargo(
  input: unknown
): Promise<CrearEncargoResponse | ErrorResponse> {
  // 1. Validar schema
  const parsed = EncargoSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
      code: 'VALIDACION',
    }
  }

  const data = parsed.data as CrearEncargoInput

  // 2. Validar fecha y hora (regla 48h + máx 30 días)
  const validacion = validarFechaHora(data.fechaRecogida, data.horaRecogida)
  if (!validacion.valida) {
    return { ok: false, error: validacion.error, code: 'FECHA_INVALIDA' }
  }

  // 3. Obtener sabores y calcular total en servidor (no confiar en el cliente)
  // Si no hay Edge Config (demo local), usar precios hardcodeados
  const sabores = await getSabores()
  const saboresMap: SaborMap = sabores.length > 0
    ? Object.fromEntries(
        sabores.map((s) => [s.id, { nombre: s.nombre, precio: s.precio, precioGrande: s.precioGrande }])
      )
    : SABORES_DEMO_MAP

  const calculo = calcularLineas(data.lineas, saboresMap)
  if (!calculo) {
    return { ok: false, error: 'Uno o más sabores no están disponibles', code: 'VALIDACION' }
  }

  // 4. Crear y persistir el encargo
  const encargo: Encargo = {
    id: `enc_${nanoid(10)}`,
    cliente: data.cliente,
    lineas: calculo.lineas,
    total: calculo.total,
    fechaRecogida: data.fechaRecogida,
    horaRecogida: data.horaRecogida,
    notas: data.notas,
    estado: 'pendiente',
    creadoEn: new Date().toISOString(),
  }

  await guardarEncargo(encargo)

  // 5. Emails (fire & forget — no bloqueamos la respuesta si falla)
  enviarEmails(encargo).catch((err) =>
    console.error('[encargos] Error enviando emails:', err)
  )

  return { ok: true, encargo }
}
