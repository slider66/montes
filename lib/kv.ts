import type { Reserva, Cupon } from './types'

export const MAX_TORTILLAS_DIA = 8

// ─── Claves KV ────────────────────────────────────────────────────────────────

export const KEYS = {
  stockDia: (fecha: string) => `stock:dia:${fecha}`,
  reserva: (id: string) => `reserva:${id}`,
  reservasPorFecha: (fecha: string) => `reservas:fecha:${fecha}`,
  reservasPorCliente: (email: string) => `reservas:cliente:${email}`,
  cupon: (codigo: string) => `cupon:${codigo.toUpperCase()}`,
  visitas: 'visitas:total',
}

// ─── Cliente KV (lazy, evita crash si no hay credenciales) ────────────────────

function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null
  }
  // Importación dinámica síncrona: el módulo ya está resuelto en Node.js
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@vercel/kv').kv as typeof import('@vercel/kv').kv
}

// ─── Stock diario ─────────────────────────────────────────────────────────────

async function inicializarStockDia(fecha: string): Promise<void> {
  const kv = getKV()
  if (!kv) return
  await kv.set(KEYS.stockDia(fecha), MAX_TORTILLAS_DIA, {
    nx: true,
    ex: 60 * 60 * 24 * 9,
  })
}

export async function getStockDia(fecha: string): Promise<number> {
  const kv = getKV()
  if (!kv) return MAX_TORTILLAS_DIA
  const valor = await kv.get<number>(KEYS.stockDia(fecha))
  return valor ?? MAX_TORTILLAS_DIA
}

export async function getStockSemana(
  fechas: string[]
): Promise<Record<string, number>> {
  const kv = getKV()
  if (!kv) {
    return Object.fromEntries(fechas.map((f) => [f, MAX_TORTILLAS_DIA]))
  }

  const valores = await Promise.all(
    fechas.map((fecha) => kv.get<number>(KEYS.stockDia(fecha)))
  )

  return Object.fromEntries(
    fechas.map((fecha, i) => [fecha, valores[i] ?? MAX_TORTILLAS_DIA])
  )
}

export async function decrementarStockDia(
  fecha: string,
  cantidad: number
): Promise<number | null> {
  const kv = getKV()
  if (!kv) return MAX_TORTILLAS_DIA - cantidad // modo dev: siempre hay stock

  await inicializarStockDia(fecha)
  const nuevoStock = await kv.decrby(KEYS.stockDia(fecha), cantidad)

  if (nuevoStock < 0) {
    await kv.incrby(KEYS.stockDia(fecha), cantidad)
    return null
  }

  return nuevoStock
}

// ─── CRUD Reservas ────────────────────────────────────────────────────────────

export async function guardarReserva(reserva: Reserva): Promise<void> {
  const kv = getKV()
  if (!kv) return // en dev solo log
  await Promise.all([
    kv.set(KEYS.reserva(reserva.id), reserva, { ex: 60 * 60 * 24 * 30 }),
    kv.sadd(KEYS.reservasPorFecha(reserva.fecha), reserva.id),
    kv.sadd(KEYS.reservasPorCliente(reserva.cliente.email), reserva.id),
  ])
}

export async function getReserva(id: string): Promise<Reserva | null> {
  const kv = getKV()
  if (!kv) return null
  return kv.get<Reserva>(KEYS.reserva(id))
}

export async function getReservasPorFecha(fecha: string): Promise<Reserva[]> {
  const kv = getKV()
  if (!kv) return []
  const ids = await kv.smembers<string[]>(KEYS.reservasPorFecha(fecha))
  if (!ids.length) return []
  const resultados = await Promise.all(ids.map((id) => kv.get<Reserva>(KEYS.reserva(id))))
  return resultados.filter(Boolean) as Reserva[]
}

export async function cancelarReserva(id: string): Promise<boolean> {
  const kv = getKV()
  if (!kv) return false
  const reserva = await getReserva(id)
  if (!reserva || reserva.estado === 'cancelada') return false
  await Promise.all([
    kv.incrby(KEYS.stockDia(reserva.fecha), reserva.cantidad),
    kv.set(KEYS.reserva(id), { ...reserva, estado: 'cancelada' }),
  ])
  return true
}

// ─── Visitas ──────────────────────────────────────────────────────────────────

export async function incrementarVisitas(): Promise<number> {
  const kv = getKV()
  if (!kv) return 0
  return kv.incr(KEYS.visitas)
}

export async function getVisitas(): Promise<number> {
  const kv = getKV()
  if (!kv) return 0
  return (await kv.get<number>(KEYS.visitas)) ?? 0
}

// ─── Cupones ──────────────────────────────────────────────────────────────────

export async function getCupon(codigo: string): Promise<Cupon | null> {
  const kv = getKV()
  if (!kv) return null
  return kv.get<Cupon>(KEYS.cupon(codigo))
}

export async function setCupon(cupon: Cupon): Promise<void> {
  const kv = getKV()
  if (!kv) return
  await kv.set(KEYS.cupon(cupon.codigo), cupon)
}
