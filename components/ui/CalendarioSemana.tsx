'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MAX_TORTILLAS_DIA } from '@/lib/kv'

interface Props {
  dias: string[]
  stockSemana: Record<string, number>
  fechaSeleccionada: string
}

const D = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const M = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function RingStock({ pct, sel }: { pct: number; sel: boolean }) {
  const r = 18, c = 2 * Math.PI * r
  const color = pct === 0 ? '#f87171' : pct <= 0.38 ? '#C45820' : sel ? '#EAC96A' : '#C47832'
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" strokeWidth="2.5" stroke="rgba(255,255,255,0.07)" />
      <circle
        cx="24" cy="24" r={r} fill="none" strokeWidth="2.5"
        stroke={color}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="24" y="29" textAnchor="middle" fontSize="12" fontWeight="800" fill={color} fontFamily="inherit">
        {pct === 0 ? '✕' : Math.round(pct * MAX_TORTILLAS_DIA)}
      </text>
    </svg>
  )
}

export function CalendarioSemana({ dias, stockSemana, fechaSeleccionada }: Props) {
  const router = useRouter()

  return (
    <section className="w-full max-w-2xl mx-auto px-5 py-10">
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-[10px] uppercase tracking-[0.25em] font-bold mb-5"
        style={{ color: 'rgba(242,226,192,0.38)' }}
      >
        Elige tu día
      </motion.p>

      {/* Cards row */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
        {dias.map((fecha, i) => {
          const d = new Date(fecha + 'T12:00:00')
          const stock = stockSemana[fecha] ?? MAX_TORTILLAS_DIA
          const pct = stock / MAX_TORTILLAS_DIA
          const completo = stock === 0
          const sel = fecha === fechaSeleccionada
          const esHoy = i === 0

          return (
            <motion.button
              key={fecha}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.055 }}
              whileHover={!completo ? { y: -4, scale: 1.03 } : {}}
              whileTap={!completo ? { scale: 0.96 } : {}}
              onClick={() => !completo && router.push(`/?fecha=${fecha}`)}
              disabled={completo}
              className="snap-start shrink-0 flex flex-col items-center gap-1.5 min-w-[76px] px-2.5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: sel
                  ? 'linear-gradient(145deg, rgba(196,120,50,0.22), rgba(223,168,85,0.10))'
                  : completo
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(196,120,50,0.05)',
                borderColor: sel
                  ? 'rgba(196,120,50,0.55)'
                  : completo
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(196,120,50,0.14)',
                boxShadow: sel ? '0 0 24px rgba(196,120,50,0.28)' : 'none',
                opacity: completo ? 0.38 : 1,
                backdropFilter: 'blur(12px)',
              }}
            >
              {esHoy && (
                <span
                  className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(196,120,50,0.18)', color: '#DFA855' }}
                >
                  hoy
                </span>
              )}
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: sel ? '#EAC96A' : 'rgba(242,226,192,0.42)' }}
              >
                {D[d.getDay()]}
              </span>
              <span
                className="font-display font-black text-2xl leading-none"
                style={{ color: sel ? '#F2E2C0' : 'rgba(242,226,192,0.88)' }}
              >
                {d.getDate()}
              </span>
              <span
                className="text-[9px] uppercase tracking-wider"
                style={{ color: sel ? 'rgba(242,226,192,0.55)' : 'rgba(242,226,192,0.26)' }}
              >
                {M[d.getMonth()]}
              </span>
              <RingStock pct={pct} sel={sel} />
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
