'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StockBadge } from './StockBadge'
import type { Sabor } from '@/lib/types'

interface Props {
  sabor: Sabor
  disponible: number
  total: number
  abierto: boolean
}

export function TortillaCard({ sabor, disponible, total, abierto }: Props) {
  const sinStock = disponible <= 0
  const puedaReservar = abierto && !sinStock

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex items-center gap-4 ${
        sinStock ? 'opacity-60' : ''
      }`}
    >
      {/* Emoji / imagen */}
      <div className="text-4xl w-14 h-14 flex items-center justify-center bg-amber-50 rounded-xl shrink-0">
        {sabor.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-800 truncate">{sabor.nombre}</h3>
          <StockBadge disponible={disponible} total={total} />
        </div>
        <p className="text-sm text-stone-500 mt-0.5 line-clamp-2">{sabor.descripcion}</p>
        <p className="text-sm font-medium text-amber-700 mt-1">
          {sabor.precio.toFixed(2)} €
        </p>
      </div>

      {/* CTA */}
      <div className="shrink-0">
        {puedaReservar ? (
          <Link
            href={`/reservar?sabor=${sabor.id}`}
            className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Reservar
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center bg-stone-100 text-stone-400 text-sm font-medium px-4 py-2 rounded-xl cursor-not-allowed">
            {sinStock ? 'Agotado' : 'Cerrado'}
          </span>
        )}
      </div>
    </motion.div>
  )
}
