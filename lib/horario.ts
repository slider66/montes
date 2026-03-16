import { toZonedTime } from 'date-fns-tz'
import { addDays, format } from 'date-fns'

const ZONA = 'Europe/Madrid'
const HORA_APERTURA = 7   // 07:00
const HORA_CIERRE = 14    // 14:00

export const VENTANA_ESTANDAR = 7   // días sin cupón
export const VENTANA_CUPON = 14     // días totales con cupón (7 extra)

/**
 * Devuelve si el negocio está abierto AHORA para aceptar nuevas reservas.
 */
export function estaAbierto(): boolean {
  const ahora = toZonedTime(new Date(), ZONA)
  const horaDecimal = ahora.getHours() + ahora.getMinutes() / 60
  return horaDecimal >= HORA_APERTURA && horaDecimal < HORA_CIERRE
}

/**
 * Devuelve el estado actual del horario con información detallada.
 */
export function getEstadoHorario(): {
  abierto: boolean
  mensaje: string
  proximaApertura?: string
} {
  const ahora = toZonedTime(new Date(), ZONA)
  const hora = ahora.getHours()

  if (hora >= HORA_APERTURA && hora < HORA_CIERRE) {
    const minutosParaCierre = (HORA_CIERRE - hora - 1) * 60 + (60 - ahora.getMinutes())
    return {
      abierto: true,
      mensaje: `Abierto — cerramos en ${minutosParaCierre} min (a las 14:00)`,
    }
  }

  if (hora < HORA_APERTURA) {
    return {
      abierto: false,
      mensaje: `Abrimos hoy a las 07:00`,
      proximaApertura: format(ahora, 'yyyy-MM-dd') + 'T07:00:00',
    }
  }

  // Después de las 14:00 → siguiente día
  const manana = addDays(ahora, 1)
  return {
    abierto: false,
    mensaje: `Cerramos a las 14:00 — Reservas disponibles mañana desde las 07:00`,
    proximaApertura: format(manana, 'yyyy-MM-dd') + 'T07:00:00',
  }
}

/**
 * Genera los días disponibles para reservar.
 * - Sin cupón: 7 días vista.
 * - Con cupón válido: hasta VENTANA_CUPON días vista.
 */
export function getDiasDisponibles(conCupon = false): string[] {
  const dias: string[] = []
  const ahora = toZonedTime(new Date(), ZONA)
  // Si ya pasaron las 14:00, el primer día disponible es mañana
  const inicio = estaAbierto() ? ahora : addDays(ahora, 1)
  const ventana = conCupon ? VENTANA_CUPON : VENTANA_ESTANDAR

  for (let i = 0; i < ventana; i++) {
    dias.push(format(addDays(inicio, i), 'yyyy-MM-dd'))
  }

  return dias
}

/**
 * Valida que una fecha esté dentro de la ventana permitida.
 * conCupon = true amplía la ventana.
 */
export function esFechaValida(
  fecha: string,
  conCupon = false
): { valida: boolean; error?: string } {
  const diasDisponibles = getDiasDisponibles(conCupon)

  if (!diasDisponibles.includes(fecha)) {
    const limite = conCupon ? VENTANA_CUPON : VENTANA_ESTANDAR
    return {
      valida: false,
      error: `Solo se pueden reservar los próximos ${limite} días.`,
    }
  }

  return { valida: true }
}
