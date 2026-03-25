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
  encargosActivo?: boolean
}

function StockIndicator({ disponible }: { disponible: number }) {
  const pct = disponible / MAX_TORTILLAS_DIA
  const col = pct === 0 ? '#f87171' : pct <= 0.38 ? '#fb923c' : '#4ade80'
  const label = pct === 0
    ? 'Sin tortillas disponibles hoy'
    : pct <= 0.38
    ? `¡Solo quedan ${disponible} tortillas para hoy!`
    : `${disponible} tortillas disponibles para hoy`

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-1 flex-1 rounded-full overflow-hidden bento-stock-track">
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
      className={`group relative overflow-hidden rounded-3xl flex flex-col ${featured ? 'col-span-2' : ''} ${sinStock ? 'opacity-50' : ''}`}
    >
      {/* Imagen */}
      <div className={`relative w-full overflow-hidden [transform:translateZ(0)] ${featured ? 'h-52' : 'h-36'}`}>
        {sabor.imagenUrl ? (
          <Image
            src={sabor.imagenUrl}
            alt={sabor.nombre}
            fill
            priority={featured}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={featured ? '(max-width: 640px) 100vw, 672px' : '(max-width: 640px) 50vw, 336px'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl bento-emoji-bg" aria-label={sabor.nombre}>
            {sabor.emoji}
          </div>
        )}
        <div className="absolute inset-0 bento-img-gradient" />

        {sabor.esTemporada && (
          <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm badge-season">
            ⏳ Temporada
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm badge-price">
            {sabor.precio.toFixed(2)} €
          </span>
          {sabor.precioGrande && (
            <span className="text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm badge-price-large">
              grande {sabor.precioGrande.toFixed(2)} €
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className={`flex flex-col gap-2 p-4 flex-1 bento-card-body ${featured ? 'featured' : ''} ${sinStock ? 'no-stock' : ''}`}>
        {sabor.nota && (
          <p className="text-[9px] uppercase tracking-[0.2em] text-[rgba(212,137,58,0.65)]">
            {sabor.nota}
          </p>
        )}
        <h3 className={`font-display font-bold italic leading-tight text-[#FAF0DC] ${featured ? 'text-lg' : 'text-sm'}`}>
          {sabor.nombre}
        </h3>
        {featured && (
          <p className="text-xs leading-snug line-clamp-2 text-[rgba(250,240,220,0.44)]">
            {sabor.descripcion}
          </p>
        )}
        {sabor.esTemporada ? (
          <span className="self-start text-[11px] font-bold px-4 py-2 rounded-xl mt-auto bento-btn-season">
            Disponible en local
          </span>
        ) : puedaReservar ? (
          <Link
            href={`/reservar?sabor=${sabor.id}&fecha=${fecha}`}
            className={`self-start inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl mt-auto bento-btn-reserve ${featured ? 'featured' : ''}`}
          >
            Reservar
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        ) : (
          <span className="self-start text-[11px] font-medium px-4 py-2 rounded-xl mt-auto bento-btn-disabled">
            {sinStock ? 'Sin stock' : 'Cerrado'}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function BentoCatalogo({ sabores, stockDia, fecha, abierto, encargosActivo }: Props) {
  const d = new Date(fecha + 'T12:00:00')
  const fechaLabel = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`

  return (
    <section className="w-full max-w-2xl mx-auto px-5 pt-10 pb-24">
      <div className="flex flex-col gap-2 mb-6">
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.25em] font-bold text-[rgba(242,226,192,0.38)]"
        >
          Catálogo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display font-bold italic capitalize text-[#F2E2C0]"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}
        >
          {fechaLabel}
        </motion.h2>
        {encargosActivo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <StockIndicator disponible={stockDia} />
            </motion.div>
            <p className="text-[10px] leading-snug mt-1" style={{ color: 'rgba(250,240,220,0.28)' }}>
              ⚠ Stock orientativo — solo refleja reservas online. Los pedidos en local pueden reducir la disponibilidad real. Te confirmaremos al recoger.
            </p>
          </>
        )}
      </div>

      {stockDia === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-20 text-center rounded-3xl border border-white/[0.06] bg-white/[0.02]"
        >
          <span className="text-6xl opacity-60">🌙</span>
          <p className="font-display italic text-xl text-[rgba(242,226,192,0.52)]">
            Cupo agotado para hoy
          </p>
          <p className="text-sm text-[rgba(242,226,192,0.32)]">
            Llámanos al 633 77 11 63
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
