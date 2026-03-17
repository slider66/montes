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

// ─── Feature: Sistema de Encargos ────────────────────────────────────────────
// Fase 2 del proyecto — visible solo cuando el cliente ha pagado esta fase.
// Controla: CTA en homepage, página /encargo, link en footer.

export async function isEncargosEnabled(): Promise<boolean> {
  // Sin Edge Config (dev local) → leer variable de entorno
  if (!process.env.EDGE_CONFIG) {
    return process.env.FEATURE_ENCARGOS === 'true'
  }

  try {
    const flag = await get<boolean>('featureEncargos')
    return flag === true
  } catch {
    // Si Edge Config falla, NO activar el flag por defecto
    return false
  }
}
