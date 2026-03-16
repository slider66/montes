'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { getEstadoHorario } from '@/lib/horario'

const TortillaScene = dynamic(
  () => import('@/components/three/TortillaScene').then((m) => m.TortillaScene),
  { ssr: false }
)

type EstadoHorario = ReturnType<typeof getEstadoHorario>

interface Props {
  estado: EstadoHorario
}

const spring = { type: 'spring', stiffness: 60, damping: 18 }

export function HeroSection({ estado }: Props) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden aurora flex flex-col">
      {/* ── Left column ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-6 pt-20 pb-8 md:px-16 lg:px-24 max-w-[680px]">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 self-start"
        >
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border ${
              estado.abierto
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/25 bg-red-500/08 text-red-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${estado.abierto ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            {estado.abierto ? 'Abierto ahora' : 'Cerrado'}
          </span>
        </motion.div>

        {/* Main title — serif editorial */}
        <div className="overflow-hidden mb-3">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="font-display font-black italic leading-[0.88] tracking-tight select-none"
            style={{
              fontSize: 'clamp(5.5rem, 15vw, 10rem)',
              background: 'linear-gradient(145deg, #f0c040 0%, #e8a020 35%, #b87010 70%, #e8a020 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 48px rgba(232,160,32,0.3))',
            }}
          >
            Montes
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-base md:text-lg font-light tracking-wide mb-10"
          style={{ color: 'rgba(240,230,208,0.55)' }}
        >
          La mejor tortilla artesanal<br />
          de San Agustín de Guadalix
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-6"
        >
          {[
            { value: '8', label: 'sabores' },
            { value: '7', label: 'días vista' },
            { value: '07–14h', label: 'recogida' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span
                className="font-display font-black text-3xl leading-none"
                style={{ color: '#e8a020' }}
              >
                {value}
              </span>
              <span className="text-[11px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(240,230,208,0.35)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex items-center gap-3"
          style={{ color: 'rgba(240,230,208,0.25)' }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: 'rgba(240,230,208,0.15)' }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-0.5 h-1.5 rounded-full bg-current"
            />
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest">Reservar</span>
        </motion.div>
      </div>

      {/* ── 3D Scene — right / top on mobile ──────────────────────────────── */}
      <div
        className="absolute inset-0 lg:left-1/2 pointer-events-none"
        style={{ opacity: 0.7 }}
      >
        <TortillaScene />
      </div>

      {/* ── Bottom gradient fade into content ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #050200)' }}
      />
    </section>
  )
}
