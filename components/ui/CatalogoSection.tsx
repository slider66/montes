'use client'

import { motion } from 'framer-motion'
import { TortillaCard } from './TortillaCard'
import { MAX_TORTILLAS_DIA } from '@/lib/kv'
import type { Sabor } from '@/lib/types'

const DIAS_LARGO = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

interface Props {
  sabores: Sabor[]
  stockDia: number
  fecha: string
  abierto: boolean
  encargosActivo?: boolean
}

function StockBar({ disponible }: { disponible: number }) {
  const pct = Math.max(0, disponible / MAX_TORTILLAS_DIA)
  const color = pct === 0 ? '#ef4444' : pct <= 0.375 ? '#f97316' : '#22c55e'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}88` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {disponible}/{MAX_TORTILLAS_DIA}
      </span>
    </div>
  )
}

export function CatalogoSection({ sabores, stockDia, fecha, abierto, encargosActivo = false }: Props) {
  const d = new Date(fecha + 'T12:00:00')
  const fechaLegible = `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`

  return (
    <section className="max-w-2xl mx-auto px-4 pb-20">
      {/* Header sección */}
      <div className="flex flex-col gap-2 mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-amber-50 text-2xl font-bold capitalize"
        >
          {fechaLegible}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <StockBar disponible={stockDia} />
        </motion.div>
      </div>

      {/* Estado vacío */}
      {stockDia === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <span className="text-5xl">😔</span>
          <p className="text-amber-100/60 font-medium">El cupo de este día está completo</p>
          <p className="text-amber-400/40 text-sm">
            Elige otro día o introduce un cupón para ver más fechas
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-3">
          {sabores.map((sabor, i) => (
            <TortillaCard
              key={sabor.id}
              sabor={sabor}
              stockDia={stockDia}
              fecha={fecha}
              abierto={abierto}
              encargosActivo={encargosActivo}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  )
}
