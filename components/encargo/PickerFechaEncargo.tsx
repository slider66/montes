'use client'

import { motion } from 'framer-motion'

const D = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const M = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Genera fechas desde hoy+2 hasta hoy+30
function getDiasEncargo(): string[] {
  const dias: string[] = []
  const hoy = new Date()
  for (let i = 2; i <= 30; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    dias.push(d.toISOString().slice(0, 10))
  }
  return dias
}

interface Props {
  value: string
  onChange: (fecha: string) => void
  error?: string
}

export function PickerFechaEncargo({ value, onChange, error }: Props) {
  const dias = getDiasEncargo()

  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3"
        style={{ color: 'rgba(242,226,192,0.38)' }}
      >
        Fecha de recogida
      </p>

      <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
        {dias.map((fecha, i) => {
          const d = new Date(fecha + 'T12:00:00')
          const sel = fecha === value

          return (
            <motion.button
              key={fecha}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.4) }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(fecha)}
              className="snap-start shrink-0 flex flex-col items-center gap-1 min-w-[68px] px-2.5 py-3 rounded-2xl border transition-all duration-200"
              style={{
                background: sel
                  ? 'linear-gradient(145deg, rgba(196,120,50,0.22), rgba(223,168,85,0.10))'
                  : 'rgba(196,120,50,0.05)',
                borderColor: sel ? 'rgba(196,120,50,0.55)' : 'rgba(196,120,50,0.14)',
                boxShadow: sel ? '0 0 20px rgba(196,120,50,0.25)' : 'none',
              }}
            >
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
            </motion.button>
          )
        })}
      </div>

      {error && (
        <p className="text-xs mt-2" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
