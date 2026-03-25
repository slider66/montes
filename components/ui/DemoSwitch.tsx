'use client'

/**
 * DemoSwitch — Toggle sutil para demostrar las fases al cliente.
 * Visible pero discreto: esquina inferior derecha, baja opacidad.
 *
 * NO se muestra en producción cuando featureEncargos ya está activo en Edge Config.
 * Solo sirve para demos en vivo: activa/desactiva el sistema de encargos
 * mediante una cookie de sesión (24h).
 */

import { useTransition } from 'react'
import Link from 'next/link'
import { toggleDemoEncargos } from '@/app/actions/toggleDemo'

interface Props {
  encargosActivo: boolean
}

export function DemoSwitch({ encargosActivo }: Props) {
  const [pending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(() => {
      toggleDemoEncargos(!encargosActivo)
    })
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Propuesta comercial */}
      <Link
        href="/propuesta"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          opacity: 0.18,
          background: 'rgba(212,137,58,0.15)',
          border: '1px solid rgba(212,137,58,0.3)',
          color: '#EAB85A',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.18' }}
      >
        💼 Propuesta comercial
      </Link>

      {/* Toggle encargos */}
      <button
        onClick={handleToggle}
        disabled={pending}
        title={encargosActivo ? 'Desactivar encargos (demo)' : 'Activar encargos (demo)'}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          opacity: 0.18,
          background: encargosActivo ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${encargosActivo ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.12)'}`,
          color: encargosActivo ? '#4ade80' : 'rgba(250,240,220,0.5)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.18' }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: encargosActivo ? '#4ade80' : 'rgba(250,240,220,0.3)' }}
        />
        {pending ? '...' : encargosActivo ? 'Encargos ON' : 'Encargos OFF'}
      </button>
    </div>
  )
}
