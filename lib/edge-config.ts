import { get } from '@vercel/edge-config'
import type { AppConfig, Sabor, ConfigHorario } from './types'

let configCache: AppConfig | null = null

export async function getConfig(): Promise<AppConfig> {
  if (configCache) return configCache

  // Si no hay EDGE_CONFIG configurado (desarrollo local), devolvemos defaults
  if (!process.env.EDGE_CONFIG) {
    configCache = {
      horario: { apertura: '07:00', cierre: '14:00', zona: 'Europe/Madrid' },
      stockDiario: 8,
      diasReservaVentana: 7,
      diasReservaCupon: 14,
      sabores: [],
    }
    return configCache
  }

  const [horario, stockDiario, diasReservaVentana, diasReservaCupon, sabores] =
    await Promise.all([
      get<ConfigHorario>('horario'),
      get<number>('stockDiario'),
      get<number>('diasReservaVentana'),
      get<number>('diasReservaCupon'),
      get<Sabor[]>('sabores'),
    ])

  configCache = {
    horario: horario ?? { apertura: '07:00', cierre: '14:00', zona: 'Europe/Madrid' },
    stockDiario: stockDiario ?? 8,
    diasReservaVentana: diasReservaVentana ?? 7,
    diasReservaCupon: diasReservaCupon ?? 14,
    sabores: (sabores ?? []).filter((s) => s.activo),
  }

  return configCache
}

export async function getSabores(): Promise<Sabor[]> {
  const config = await getConfig()
  return config.sabores
}

export async function getSabor(id: string): Promise<Sabor | undefined> {
  const sabores = await getSabores()
  return sabores.find((s) => s.id === id)
}
