'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Sabor } from '@/lib/types'

interface Props {
  sabor: Sabor
  stockDia: number
  fecha: string
  abierto: boolean
  encargosActivo?: boolean
  index?: number
}

export function TortillaCard({ sabor, stockDia, fecha, abierto, encargosActivo = false, index = 0 }: Props) {
  const sinStock = stockDia <= 0
  const puedaReservar = abierto && !sinStock

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!sinStock ? { scale: 1.018, rotateY: 1.5, z: 10 } : {}}
      className={`
        relative overflow-hidden rounded-2xl border transition-colors duration-300
        ${sinStock
          ? 'bg-white/[0.02] border-white/5 opacity-50'
          : 'bg-white/[0.06] border-white/[0.12] hover:border-amber-500/40 hover:bg-white/[0.09]'
        }
      `}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Shimmer on hover */}
      {!sinStock && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.06) 50%, transparent 60%)',
          }}
        />
      )}

      <div className="flex items-center gap-4 p-4">
        {/* Emoji / thumbnail */}
        <div
          className="shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
          style={{
            background: sinStock
              ? 'rgba(255,255,255,0.03)'
              : 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(180,80,0,0.08) 100%)',
            border: '1px solid rgba(245,158,11,0.12)',
          }}
        >
          {sabor.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-bold text-amber-50 truncate leading-tight">{sabor.nombre}</h3>
            <span
              className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                sinStock
                  ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
              }`}
            >
              {sinStock ? 'Agotado' : `${sabor.precio.toFixed(2)} €`}
            </span>
          </div>
          <p className="text-sm text-amber-100/40 line-clamp-2 leading-snug">
            {sabor.descripcion}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="text-xs text-amber-400/30 font-medium">
          {!sinStock && `${sabor.precio.toFixed(2)} € · unidad`}
        </span>

        {puedaReservar && encargosActivo ? (
          <Link
            href="/encargo"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 text-sm font-bold px-5 py-2 rounded-xl transition-colors duration-150 shadow-[0_0_16px_rgba(245,158,11,0.25)]"
          >
            Reservar
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ) : sinStock || !abierto ? (
          <span className="inline-flex items-center justify-center bg-white/5 text-white/20 text-sm font-medium px-5 py-2 rounded-xl cursor-not-allowed border border-white/5">
            {sinStock ? 'Sin stock' : 'Cerrado'}
          </span>
        ) : null}
      </div>
    </motion.div>
  )
}
