'use client'

import Image from 'next/image'
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
      whileHover={!sinStock ? { scale: 1.018 } : {}}
      className={`group relative overflow-hidden rounded-3xl flex flex-col ${featured ? 'col-span-2' : ''}`}
      style={{ opacity: sinStock ? 0.5 : 1 }}
    >
      {/* Imagen */}
      <div className={`relative w-full overflow-hidden ${featured ? 'h-52' : 'h-36'}`} style={{ transform: 'translateZ(0)' }}>
        {sabor.imagenUrl ? (
          <Image
            src={sabor.imagenUrl}
            alt={sabor.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={featured ? '(max-width: 640px) 100vw, 672px' : '(max-width: 640px) 50vw, 336px'}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-6xl"
            style={{ background: 'radial-gradient(circle, rgba(196,120,50,0.18) 0%, rgba(139,90,52,0.07) 100%)' }}
          >
            {sabor.emoji}
          </div>
        )}
        {/* Gradiente sobre imagen */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(18,10,4,0.92) 0%, rgba(18,10,4,0.3) 50%, transparent 100%)' }}
        />
        {/* Badge temporada */}
        {sabor.esTemporada && (
          <div
            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(245,200,66,0.18)', color: '#F5C842', border: '1px solid rgba(245,200,66,0.45)' }}
          >
            ⏳ Temporada
          </div>
        )}
        {/* Badge precio */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span
            className="text-[12px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(18,10,4,0.65)', color: '#EAB85A', border: '1px solid rgba(212,137,58,0.35)' }}
          >
            {sabor.precio.toFixed(2)} €
          </span>
          {sabor.precioGrande && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm"
              style={{ background: 'rgba(18,10,4,0.50)', color: 'rgba(250,240,220,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              grande {sabor.precioGrande.toFixed(2)} €
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div
        className="flex flex-col gap-2 p-4 flex-1"
        style={{
          background: sinStock ? 'rgba(255,255,255,0.02)' : featured ? 'linear-gradient(145deg, rgba(196,120,50,0.10), rgba(139,90,52,0.06))' : 'rgba(196,120,50,0.05)',
          borderLeft: `1px solid ${sinStock ? 'rgba(255,255,255,0.05)' : featured ? 'rgba(196,120,50,0.28)' : 'rgba(196,120,50,0.14)'}`,
          borderRight: `1px solid ${sinStock ? 'rgba(255,255,255,0.05)' : featured ? 'rgba(196,120,50,0.28)' : 'rgba(196,120,50,0.14)'}`,
          borderBottom: `1px solid ${sinStock ? 'rgba(255,255,255,0.05)' : featured ? 'rgba(196,120,50,0.28)' : 'rgba(196,120,50,0.14)'}`,
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
        }}
      >
        {sabor.nota && (
          <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(212,137,58,0.65)' }}>
            {sabor.nota}
          </p>
        )}
        <h3
          className={`font-display font-bold italic leading-tight ${featured ? 'text-lg' : 'text-sm'}`}
          style={{ color: '#FAF0DC' }}
        >
          {sabor.nombre}
        </h3>
        {featured && (
          <p className="text-xs leading-snug line-clamp-2" style={{ color: 'rgba(250,240,220,0.44)' }}>
            {sabor.descripcion}
          </p>
        )}
        {sabor.esTemporada ? (
          <span
            className="self-start text-[11px] font-bold px-4 py-2 rounded-xl mt-auto"
            style={{ color: '#F5C842', border: '1px solid rgba(245,200,66,0.35)', background: 'rgba(245,200,66,0.08)' }}
          >
            Disponible en local
          </span>
        ) : puedaReservar ? (
          <Link
            href={`/reservar?sabor=${sabor.id}&fecha=${fecha}`}
            className="self-start inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl mt-auto transition-all duration-150"
            style={{ background: featured ? 'rgba(196,120,50,0.15)' : 'transparent', color: '#DFA855', border: '1px solid rgba(196,120,50,0.28)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(196,120,50,0.25)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(196,120,50,0.22)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = featured ? 'rgba(196,120,50,0.15)' : 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Reservar
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        ) : (
          <span className="self-start text-[11px] font-medium px-4 py-2 rounded-xl mt-auto" style={{ color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sinStock ? 'Sin stock' : 'Cerrado'}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function BentoCatalogo({ sabores, stockDia, fecha, abierto }: Props) {
  const d = new Date(fecha + 'T12:00:00')
  const fechaLabel = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`

  return (
    <section className="w-full max-w-2xl mx-auto px-5 pb-24">
      <div className="flex flex-col gap-2 mb-6">
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.25em] font-bold"
          style={{ color: 'rgba(242,226,192,0.38)' }}
        >
          Catálogo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display font-bold italic capitalize"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: '#F2E2C0' }}
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

      {stockDia === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-20 text-center rounded-3xl border"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <span className="text-6xl opacity-60">🌙</span>
          <p className="font-display italic text-xl" style={{ color: 'rgba(242,226,192,0.52)' }}>
            Cupo agotado para este día
          </p>
          <p className="text-sm" style={{ color: 'rgba(242,226,192,0.32)' }}>
            Elige otro día en el calendario
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sabores.map((sabor, i) => (
            <BentoCard
              key={sabor.id}
              sabor={sabor}
              stockDia={stockDia}
              fecha={fecha}
              abierto={abierto}
              featured={i % 3 === 0}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  )
}
