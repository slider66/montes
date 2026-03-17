'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

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
      {/* Fondo fijo atmosférico */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 70% 40%, #3D1C00 0%, #1A0E05 60%)',
        }}
      />

      {/* Hero — primer viewport */}
      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-14 lg:px-20 pb-10 pt-20">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Columna izquierda: texto ─────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Pill badge */}
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{
                border: estado?.abierto === false
                  ? '1px solid rgba(239,68,68,0.28)'
                  : '1px solid rgba(212,137,58,0.38)',
                background: estado?.abierto === false
                  ? 'rgba(239,68,68,0.08)'
                  : 'rgba(212,137,58,0.12)',
                color: estado?.abierto === false ? '#f87171' : '#EAB85A',
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${estado?.abierto === false ? 'bg-red-400' : 'bg-amber-400 animate-pulse'}`} />
              {estado?.abierto === false ? 'Cerrado ahora' : 'San Agustín de Guadalix'}
            </motion.span>

            {/* Logo + título */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center gap-4 mb-5"
            >
              <Image
                src="/logo.webp"
                alt="Café & Tortilla Montes"
                width={80}
                height={80}
                className="rounded-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(212,137,58,0.45))' }}
                priority
              />
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 55, damping: 16, delay: 0.15 }}
                  className="font-display font-black italic leading-[0.88] tracking-tight select-none"
                  style={{
                    fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                    background: 'linear-gradient(145deg, #F2D06E 0%, #D4893A 45%, #A06838 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 56px rgba(212,137,58,0.4))',
                  }}
                >
                  Montes
                </motion.h1>
                <p className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'rgba(212,137,58,0.7)' }}>
                  Café &amp; Tortilla
                </p>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg md:text-xl font-light mb-10 max-w-sm leading-relaxed"
              style={{ color: 'rgba(250,240,220,0.55)' }}
            >
              La mejor tortilla artesanal en San Agustín de Guadalix.<br />
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
                    style={{ color: '#D4893A' }}
                  >
                    {v}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-widest mt-1"
                    style={{ color: 'rgba(250,240,220,0.35)' }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ opacity: scrolled ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 pointer-events-none"
              style={{ color: 'rgba(250,240,220,0.22)' }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
                className="w-4 h-7 rounded-full border flex items-start justify-center pt-1"
                style={{ borderColor: 'rgba(250,240,220,0.14)' }}
              >
                <div className="w-0.5 h-1.5 rounded-full bg-current" />
              </motion.div>
              <span className="text-[9px] uppercase tracking-widest">scroll</span>
            </motion.div>
          </div>

          {/* ── Columna derecha: imagen tortilla ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Glow detrás de la imagen */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, #D4893A 0%, #A06838 50%, transparent 75%)',
                transform: 'scale(0.85)',
              }}
            />

            {/* Contenedor imagen */}
            <div
              className="relative w-full aspect-square max-w-[520px] rounded-[2.5rem] overflow-hidden"
              style={{
                boxShadow:
                  '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,137,58,0.18)',
              }}
            >
              <Image
                src="/tortilla-hero.webp"
                alt="Tortilla artesanal Montes"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: 'center' }}
              />

              {/* Overlay degradado sutil en el borde inferior */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(26,14,5,0.6) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* Chip flotante — precio medio */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute bottom-6 -left-4 lg:-left-8 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(34,20,8,0.90)',
                border: '1px solid rgba(212,137,58,0.28)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(250,240,220,0.4)' }}>
                Desde
              </p>
              <p className="font-display font-bold text-xl leading-none" style={{ color: '#EAB85A' }}>
                8.50 €
              </p>
            </motion.div>

            {/* Chip flotante — stock */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute top-6 -right-4 lg:-right-8 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(34,20,8,0.90)',
                border: '1px solid rgba(212,137,58,0.28)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-[11px] font-semibold" style={{ color: '#EAB85A' }}>
                  Stock limitado
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </>
  )
}
