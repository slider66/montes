'use client'

/**
 * EncargosCTA — Banner CTA para el sistema de encargos.
 * Solo se renderiza cuando featureEncargos = true en Edge Config.
 *
 * FASE 2 — Sistema de Encargos
 * @see lib/features.ts para activar/desactivar el flag
 */

import Link from 'next/link'
import { motion } from 'framer-motion'

export function EncargosCTA() {
  return (
    <section className="w-full max-w-2xl mx-auto px-5 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(196,120,50,0.12) 0%, rgba(139,90,52,0.06) 100%)',
          border: '1px solid rgba(196,120,50,0.28)',
        }}
      >
        {/* Glow decorativo */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,137,58,0.12) 0%, transparent 70%)' }}
        />

        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] uppercase tracking-[0.25em] font-bold mb-1"
            style={{ color: 'rgba(212,137,58,0.65)' }}
          >
            Eventos · Reuniones · Celebraciones
          </p>
          <h3
            className="font-display font-bold italic text-xl leading-tight mb-1"
            style={{ color: '#FAF0DC' }}
          >
            ¿Organizas algo especial?
          </h3>
          <p className="text-sm leading-snug" style={{ color: 'rgba(250,240,220,0.50)' }}>
            Haz un encargo grande con antelación. Elige sabores, tamaños y cantidad — te lo tenemos listo a la hora que necesites.
          </p>
        </div>

        <Link
          href="/encargo"
          className="shrink-0 inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-2xl transition-all duration-150"
          style={{
            background: 'rgba(196,120,50,0.18)',
            color: '#EAB85A',
            border: '1px solid rgba(196,120,50,0.35)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(196,120,50,0.28)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(196,120,50,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(196,120,50,0.18)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Hacer un encargo
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}
