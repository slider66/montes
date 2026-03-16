import { get } from '@vercel/edge-config'
import type { AppConfig, Sabor, ConfigHorario } from './types'

// Cache en memoria para la duración del request (Edge Runtime no tiene fs cache)
let configCache: AppConfig | null = null

export async function getConfig(): Promise<AppConfig> {
  if (configCache) return configCache

  const [horario, stockDiarioPorSabor, diasReservaAntelacion, sabores] =
    await Promise.all([
      get<ConfigHorario>('horario'),
      get<number>('stockDiarioPorSabor'),
      get<number>('diasReservaAntelacion'),
      get<Sabor[]>('sabores'),
    ])

  configCache = {
    horario: horario!,
    stockDiarioPorSabor: stockDiarioPorSabor!,
    diasReservaAntelacion: diasReservaAntelacion!,
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

export async function getStockDiario(): Promise<number> {
  const config = await getConfig()
  return config.stockDiarioPorSabor
}
