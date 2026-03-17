/**
 * Feature flags — Café & Tortilla Montes
 *
 * Los flags se leen de Vercel Edge Config en producción.
 * En desarrollo local (sin EDGE_CONFIG) se usan variables de entorno.
 *
 * Para activar un flag en producción:
 *   Dashboard Vercel → Storage → Edge Config → Editar JSON
 *   Añadir: { "featureEncargos": true }
 *   ✅ Sin redeploy. Activo en segundos.
 *
 * Para testing local:
 *   .env.local → FEATURE_ENCARGOS=true
 */

import { get } from '@vercel/edge-config'
import { cookies } from 'next/headers'
import { cache } from 'react'

// ─── Feature: Sistema de Encargos ────────────────────────────────────────────
// Prioridad de activación (de mayor a menor):
//   1. Cookie demo_encargos=1  → activa para esa sesión (demo al cliente)
//   2. Edge Config featureEncargos=true → activa en producción (pagó la fase)
//   3. FEATURE_ENCARGOS=true en .env.local → activa en desarrollo local

export const isEncargosEnabled = cache(async (): Promise<boolean> => {
  // 1. Cookie de demo (override rápido para mostrar al cliente)
  try {
    const jar = await cookies()
    if (jar.get('demo_encargos')?.value === '1') return true
  } catch {
    // En contextos sin cookies (middleware, etc.) ignorar
  }

  // 2. Sin Edge Config → variable de entorno local
  if (!process.env.EDGE_CONFIG) {
    return process.env.FEATURE_ENCARGOS === 'true'
  }

  // 3. Edge Config (producción real)
  try {
    const flag = await get<boolean>('featureEncargos')
    return flag === true
  } catch {
    return false
  }
})
