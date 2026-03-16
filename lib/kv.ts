import { kv } from '@vercel/kv'

// ─── Claves KV ────────────────────────────────────────────────────────────────

export const KEYS = {
  stock: (fecha: string, sabor: string) => `stock:${fecha}:${sabor}`,
  reserva: (id: string) => `reserva:${id}`,
  reservasPorFecha: (fecha: string) => `reservas:fecha:${fecha}`,
  reservasPorCliente: (email: string) => `reservas:cliente:${email}`,
}

// ─── Stock ────────────────────────────────────────────────────────────────────

/**
 * Inicializa el stock de un sabor para una fecha si no existe.
 * Se llama al crear la primera reserva del día o al abrir el día.
 */
export async function inicializarStock(
  fecha: string,
  sabor: string,
  stockTotal: number
): Promise<void> {
  const key = KEYS.stock(fecha, sabor)
  // NX = solo si no existe
  await kv.set(key, stockTotal, { nx: true, ex: 60 * 60 * 24 * 16 }) // expira en 16 días
}

/**
 * Obtiene el stock actual de un sabor para una fecha.
 */
export async function getStock(fecha: string, sabor: string): Promise<number> {
  const key = KEYS.stock(fecha, sabor)
  const valor = await kv.get<number>(key)
  return valor ?? -1 // -1 indica que no ha sido inicializado
}

/**
 * Obtiene el stock de todos los sabores para una fecha en paralelo.
 */
export async function getStockTodos(
  fecha: string,
  sabores: string[]
): Promise<Record<string, number>> {
  const pipeline = kv.pipeline()
  for (const sabor of sabores) {
    pipeline.get(KEYS.stock(fecha, sabor))
  }
  const resultados = await pipeline.exec()

  return Object.fromEntries(
    sabores.map((sabor, i) => [sabor, (resultados[i] as number) ?? 0])
  )
}

// ─── Reserva atómica (decremento + rollback) ──────────────────────────────────

/**
 * Intenta decrementar el stock de forma atómica.
 * Si el resultado sería negativo, hace rollback y devuelve false.
 *
 * @returns El stock restante tras la operación, o null si no hay stock.
 */
export async function decrementarStock(
  fecha: string,
  sabor: string,
  cantidad: number,
  stockTotal: number
): Promise<number | null> {
  const key = KEYS.stock(fecha, sabor)

  // Asegura que el stock existe antes de decrementar
  await inicializarStock(fecha, sabor, stockTotal)

  // Decremento atómico con Redis DECRBY
  const nuevoStock = await kv.decrby(key, cantidad)

  if (nuevoStock < 0) {
    // Rollback: restauramos las unidades que acabamos de restar
    await kv.incrby(key, cantidad)
    return null
  }

  return nuevoStock
}

// ─── CRUD Reservas ────────────────────────────────────────────────────────────

import type { Reserva } from './types'

export async function guardarReserva(reserva: Reserva): Promise<void> {
  const pipeline = kv.pipeline()

  pipeline.set(KEYS.reserva(reserva.id), reserva, {
    ex: 60 * 60 * 24 * 30, // expira en 30 días
  })
  pipeline.sadd(KEYS.reservasPorFecha(reserva.fecha), reserva.id)
  pipeline.sadd(KEYS.reservasPorCliente(reserva.cliente.email), reserva.id)

  await pipeline.exec()
}

export async function getReserva(id: string): Promise<Reserva | null> {
  return kv.get<Reserva>(KEYS.reserva(id))
}

export async function getReservasPorFecha(fecha: string): Promise<Reserva[]> {
  const ids = await kv.smembers<string[]>(KEYS.reservasPorFecha(fecha))
  if (!ids.length) return []

  const pipeline = kv.pipeline()
  for (const id of ids) {
    pipeline.get(KEYS.reserva(id))
  }

  const resultados = await pipeline.exec()
  return resultados.filter(Boolean) as Reserva[]
}

export async function cancelarReserva(
  id: string,
  stockTotal: number
): Promise<boolean> {
  const reserva = await getReserva(id)
  if (!reserva || reserva.estado === 'cancelada') return false

  // Devolver stock
  await kv.incrby(KEYS.stock(reserva.fecha, reserva.sabor), reserva.cantidad)

  // Actualizar estado
  await kv.set(KEYS.reserva(id), { ...reserva, estado: 'cancelada' })

  return true
}
