// ─── Sabores ─────────────────────────────────────────────────────────────────

export interface Sabor {
  id: string
  nombre: string
  descripcion: string
  emoji: string
  precio: number        // precio mediana (6 huevos)
  precioGrande?: number // precio grande (12 huevos)
  nota?: string         // ej: "Con cebolla · Sin cebolla"
  activo: boolean
  imagenUrl?: string
}

// ─── Reservas ─────────────────────────────────────────────────────────────────

export type EstadoReserva = 'confirmada' | 'cancelada' | 'completada'

export interface Cliente {
  nombre: string
  email: string
  telefono: string
}

export interface Reserva {
  id: string
  cliente: Cliente
  fecha: string        // ISO date string: "2026-03-20"
  sabor: string        // id del sabor
  cantidad: number     // número de tortillas (1-4 max por reserva)
  estado: EstadoReserva
  notas?: string
  creadaEn: string     // ISO datetime string
}

// ─── API Request/Response ─────────────────────────────────────────────────────

export interface CrearReservaInput {
  cliente: Cliente
  fecha: string
  sabor: string
  cantidad: number
  notas?: string
  cupon?: string       // desbloquea reservas más allá de los 7 días estándar
}

export interface CrearReservaResponse {
  ok: true
  reserva: Reserva
  stockRestante: number  // tortillas totales restantes ese día
}

export interface ErrorResponse {
  ok: false
  error: string
  code:
    | 'SIN_STOCK'
    | 'FUERA_HORARIO'
    | 'FECHA_INVALIDA'
    | 'VALIDACION'
    | 'CUPON_INVALIDO'
    | 'INTERNO'
}

// ─── Stock ────────────────────────────────────────────────────────────────────

export interface StockDia {
  fecha: string
  disponible: number   // tortillas restantes ese día (máx 8)
  total: number        // siempre 8
  completo: boolean    // true si disponible === 0
}

// ─── Cupones ──────────────────────────────────────────────────────────────────

export interface Cupon {
  codigo: string
  diasExtra: number    // días adicionales que desbloquea (ej: 7 → hasta 14 días)
  activo: boolean
  descripcion?: string
}

// ─── Edge Config ──────────────────────────────────────────────────────────────

export interface ConfigHorario {
  apertura: string   // "07:00"
  cierre: string     // "14:00"
  zona: string       // "Europe/Madrid"
}

export interface AppConfig {
  horario: ConfigHorario
  stockDiario: number              // 8 tortillas totales por día
  diasReservaVentana: number       // 7 días estándar
  diasReservaCupon: number         // días extra con cupón
  sabores: Sabor[]
}
