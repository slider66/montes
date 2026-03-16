// ─── Sabores ─────────────────────────────────────────────────────────────────

export interface Sabor {
  id: string
  nombre: string
  descripcion: string
  emoji: string
  precio: number
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
}

export interface CrearReservaResponse {
  ok: true
  reserva: Reserva
  stockRestante: number
}

export interface ErrorResponse {
  ok: false
  error: string
  code: 'SIN_STOCK' | 'FUERA_HORARIO' | 'FECHA_INVALIDA' | 'VALIDACION' | 'INTERNO'
}

// ─── Stock ────────────────────────────────────────────────────────────────────

export interface StockPorSabor {
  sabor: string
  fecha: string
  disponible: number
  total: number
}

// ─── Edge Config ──────────────────────────────────────────────────────────────

export interface ConfigHorario {
  apertura: string   // "07:00"
  cierre: string     // "14:00"
  zona: string       // "Europe/Madrid"
}

export interface AppConfig {
  horario: ConfigHorario
  stockDiarioPorSabor: number
  diasReservaAntelacion: number
  sabores: Sabor[]
}
