'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Usar nuestro TortillaScene (plain Three.js, ya instalado)
const TortillaScene = dynamic(
  () => import('@/components/three/TortillaScene').then((m) => m.TortillaScene),
  { ssr: false }
)

interface Props {
  estado?: { abierto: boolean; mensaje: string; proximaApertura?: string }
}

export function Hero3D({ estado }: Props = {}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Canvas fijo al fondo — persiste mientras el usuario scrollea */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% 35%, #2a1000 0%, #050200 65%)',
        }}
      >
        <TortillaScene />
        {/* Vignette perimetral */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      {/* ── Hero overlay — primer viewport ─────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center items-start min-h-screen px-6 md:px-16 lg:px-24 pb-16 pt-24 max-w-3xl">

        {/* Pill badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
          style={{
            border: estado?.abierto === false
              ? '1px solid rgba(239,68,68,0.28)'
              : '1px solid rgba(232,160,32,0.28)',
            background: estado?.abierto === false
              ? 'rgba(239,68,68,0.08)'
              : 'rgba(232,160,32,0.08)',
            color: estado?.abierto === false ? '#f87171' : '#e8a020',
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${estado?.abierto === false ? 'bg-red-400' : 'bg-amber-400 animate-pulse'}`} />
          {estado?.abierto === false ? 'Cerrado ahora' : 'San Agustín de Guadalix'}
        </motion.span>

        {/* Título serif */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 55, damping: 16, delay: 0.1 }}
            className="font-display font-black italic leading-[0.88] tracking-tight select-none"
            style={{
              fontSize: 'clamp(5rem, 16vw, 9.5rem)',
              background:
                'linear-gradient(145deg, #f0c040 0%, #e8a020 42%, #b06808 100%)',
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
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl font-light mb-10 max-w-sm leading-relaxed"
          style={{ color: 'rgba(240,230,208,0.5)' }}
        >
          La mejor tortilla artesanal.<br />
          Reserva la tuya antes de que se agote.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-8 mb-12"
        >
          {[
            ['8', 'sabores'],
            ['7', 'días vista'],
            ['07–14h', 'horario'],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col">
              <span
                className="font-display font-black text-3xl leading-none"
                style={{ color: '#e8a020' }}
              >
                {v}
              </span>
              <span
                className="text-[10px] uppercase tracking-widest mt-1"
                style={{ color: 'rgba(240,230,208,0.3)' }}
              >
                {l}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator — desaparece al scrollear */}
        <motion.div
          animate={{ opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-1.5 pointer-events-none"
          style={{ color: 'rgba(240,230,208,0.22)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
            className="w-4 h-7 rounded-full border flex items-start justify-center pt-1"
            style={{ borderColor: 'rgba(240,230,208,0.14)' }}
          >
            <div className="w-0.5 h-1.5 rounded-full bg-current" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-widest">scroll</span>
        </motion.div>
      </div>
    </>
  )
}
