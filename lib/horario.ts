import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { addDays, format, isWeekend, parseISO, isBefore, isAfter } from 'date-fns'

const ZONA = 'Europe/Madrid'
const HORA_APERTURA = 7   // 07:00
const HORA_CIERRE = 14    // 14:00

/**
 * Devuelve si el negocio está abierto AHORA para aceptar nuevas reservas.
 */
export function estaAbierto(): boolean {
  const ahora = toZonedTime(new Date(), ZONA)
  const hora = ahora.getHours()
  const minutos = ahora.getMinutes()
  const horaDecimal = hora + minutos / 60

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
      proximaApertura: format(ahora, "yyyy-MM-dd") + 'T07:00:00',
    }
  }

  // Después de las 14:00 → siguiente día laborable
  const manana = addDays(ahora, 1)
  return {
    abierto: false,
    mensaje: `Cerramos a las 14:00 — Reservas disponibles mañana desde las 07:00`,
    proximaApertura: format(manana, 'yyyy-MM-dd') + 'T07:00:00',
  }
}

/**
 * Genera los próximos N días hábiles disponibles para reservar.
 * (Montes abre L-D, excluye solo días marcados en Edge Config como festivos)
 */
export function getDiasDisponibles(diasAntelacion = 14): string[] {
  const dias: string[] = []
  const hoy = toZonedTime(new Date(), ZONA)
  // Si ya pasaron las 14:00, el primer día disponible es mañana
  const esHoyDisponible = estaAbierto()
  const inicio = esHoyDisponible ? hoy : addDays(hoy, 1)

  for (let i = 0; i < diasAntelacion; i++) {
    const dia = addDays(inicio, i)
    dias.push(format(dia, 'yyyy-MM-dd'))
  }

  return dias
}

/**
 * Valida que una fecha dada sea válida para reservar.
 */
export function esFechaValida(fecha: string): { valida: boolean; error?: string } {
  const diasDisponibles = getDiasDisponibles(14)

  if (!diasDisponibles.includes(fecha)) {
    return {
      valida: false,
      error: 'La fecha seleccionada no está disponible para reservas.',
    }
  }

  return { valida: true }
}
