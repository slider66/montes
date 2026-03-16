'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MAX_TORTILLAS_DIA } from '@/lib/kv'
import type { Sabor } from '@/lib/types'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

interface Props {
  sabores: Sabor[]
  stockDia: number
  fecha: string
  abierto: boolean
}

// ── Stock bar indicator ──────────────────────────────────────────────────────
function StockIndicator({ disponible }: { disponible: number }) {
  const pct = disponible / MAX_TORTILLAS_DIA
  const col = pct === 0 ? '#f87171' : pct <= 0.38 ? '#fb923c' : '#4ade80'
  const label = pct === 0 ? 'Sin plazas' : pct <= 0.38 ? `${disponible} últimas` : `${disponible} / ${MAX_TORTILLAS_DIA}`

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: col, boxShadow: `0 0 8px ${col}60` }}
        />
      </div>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: col }}>{label}</span>
    </div>
  )
}

// ── Individual bento card ────────────────────────────────────────────────────
interface CardProps {
  sabor: Sabor
  stockDia: number
  fecha: string
  abierto: boolean
  featured?: boolean
  index: number
}

function BentoCard({ sabor, stockDia, fecha, abierto, featured = false, index }: CardProps) {
  const sinStock = stockDia <= 0
  const puedaReservar = abierto && !sinStock

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: 0.6, delay: index * 0.065, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!sinStock ? { scale: 1.015 } : {}}
      className={`group relative overflow-hidden rounded-3xl border flex flex-col transition-all duration-300 ${
        featured ? 'col-span-2 min-h-[200px]' : 'min-h-[180px]'
      }`}
      style={{
        background: sinStock
          ? 'rgba(255,255,255,0.02)'
          : featured
          ? 'linear-gradient(145deg, rgba(232,160,32,0.08), rgba(255,107,32,0.05))'
          : 'rgba(255,200,80,0.04)',
        borderColor: sinStock
          ? 'rgba(255,255,255,0.05)'
          : featured
          ? 'rgba(232,160,32,0.22)'
          : 'rgba(255,200,80,0.10)',
        backdropFilter: 'blur(14px)',
        opacity: sinStock ? 0.5 : 1,
      }}
    >
      {/* Shimmer highlight on hover */}
      {!sinStock && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,200,80,0.05) 50%, transparent 65%)',
          }}
        />
      )}

      {/* Featured top banner */}
      {featured && !sinStock && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.5), transparent)' }}
        />
      )}

      <div className={`flex flex-1 ${featured ? 'flex-row items-center gap-5 p-5' : 'flex-col p-4'}`}>
        {/* Emoji area */}
        <div
          className={`flex items-center justify-center rounded-2xl shrink-0 ${
            featured ? 'w-20 h-20 text-5xl' : 'w-12 h-12 text-3xl mb-3'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(232,160,32,0.15) 0%, rgba(180,80,0,0.06) 100%)',
            border: '1px solid rgba(232,160,32,0.12)',
          }}
        >
          {sabor.emoji}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3
                className={`font-display font-bold italic leading-tight ${featured ? 'text-xl' : 'text-base'}`}
                style={{ color: '#f0e6d0' }}
              >
                {sabor.nombre}
              </h3>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: 'rgba(232,160,32,0.12)', color: '#e8a020', border: '1px solid rgba(232,160,32,0.2)' }}
              >
                {sabor.precio.toFixed(2)} €
              </span>
            </div>
            {featured && (
              <p className="text-sm mt-1 line-clamp-2 leading-snug" style={{ color: 'rgba(240,230,208,0.42)' }}>
                {sabor.descripcion}
              </p>
            )}
          </div>

          {/* CTA */}
          {puedaReservar ? (
            <Link
              href={`/reservar?sabor=${sabor.id}&fecha=${fecha}`}
              className="self-start inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                background: featured ? 'rgba(232,160,32,0.15)' : 'transparent',
                color: '#e8a020',
                border: '1px solid rgba(232,160,32,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232,160,32,0.25)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(232,160,32,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = featured ? 'rgba(232,160,32,0.15)' : 'transparent'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Reservar
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ) : (
            <span className="self-start text-[11px] font-medium px-4 py-2 rounded-xl" style={{ color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {sinStock ? 'Sin stock' : 'Cerrado'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export function BentoCatalogo({ sabores, stockDia, fecha, abierto }: Props) {
  const d = new Date(fecha + 'T12:00:00')
  const fechaLabel = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`

  return (
    <section className="w-full max-w-2xl mx-auto px-5 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.25em] font-bold"
          style={{ color: 'rgba(240,230,208,0.35)' }}
        >
          Catálogo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display font-bold italic capitalize"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: '#f0e6d0' }}
        >
          {fechaLabel}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <StockIndicator disponible={stockDia} />
        </motion.div>
      </div>

      {/* Empty state */}
      {stockDia === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-20 text-center rounded-3xl border"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <span className="text-6xl opacity-60">🌙</span>
          <p className="font-display italic text-xl" style={{ color: 'rgba(240,230,208,0.5)' }}>
            Cupo agotado para este día
          </p>
          <p className="text-sm" style={{ color: 'rgba(240,230,208,0.3)' }}>
            Elige otro día en el calendario
          </p>
        </motion.div>
      ) : (
        /* Bento grid: alternating featured (col-span-2) + normal */
        <div className="grid grid-cols-2 gap-3">
          {sabores.map((sabor, i) => {
            // Pattern: 0=featured, 1=small, 2=small, 3=featured, 4=small, 5=small...
            const pos = i % 3
            const featured = pos === 0
            return (
              <BentoCard
                key={sabor.id}
                sabor={sabor}
                stockDia={stockDia}
                fecha={fecha}
                abierto={abierto}
                featured={featured}
                index={i}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
