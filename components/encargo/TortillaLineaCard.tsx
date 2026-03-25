'use client'

import Image from 'next/image'
import type { Sabor } from '@/lib/types'
import type { CartLinea } from './EncargoWizard'

// ─── Stepper ─────────────────────────────────────────────────────────────────

function Stepper({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold transition-all duration-150 select-none"
        style={{
          background: value > 0 ? 'rgba(196,120,50,0.22)' : 'rgba(196,120,50,0.06)',
          color: value > 0 ? '#EAB85A' : 'rgba(234,184,90,0.25)',
          border: '1px solid rgba(196,120,50,0.28)',
        }}
        aria-label="Quitar uno"
      >
        −
      </button>
      <span
        className="w-6 text-center font-bold text-sm tabular-nums"
        style={{ color: value > 0 ? '#FAF0DC' : 'rgba(250,240,220,0.35)' }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold transition-all duration-150 select-none"
        style={{
          background: 'rgba(196,120,50,0.18)',
          color: '#EAB85A',
          border: '1px solid rgba(196,120,50,0.28)',
        }}
        aria-label="Añadir uno"
      >
        +
      </button>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface Props {
  sabor: Sabor
  lineaMediana?: CartLinea
  lineaGrande?: CartLinea
  onSetCantidad: (tamano: 'mediana' | 'grande', cantidad: number) => void
}

export function TortillaLineaCard({ sabor, lineaMediana, lineaGrande, onSetCantidad }: Props) {
  const cantMediana = lineaMediana?.cantidad ?? 0
  const cantGrande = lineaGrande?.cantidad ?? 0
  const tieneItems = cantMediana > 0 || cantGrande > 0
  const subtotalTotal =
    (lineaMediana?.subtotal ?? 0) + (lineaGrande?.subtotal ?? 0)

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: tieneItems ? 'rgba(196,120,50,0.08)' : 'rgba(26,14,5,0.7)',
        border: `1px solid ${tieneItems ? 'rgba(196,120,50,0.38)' : 'rgba(196,120,50,0.14)'}`,
      }}
    >
      {/* ── Cabecera sabor ── */}
      <div className="flex gap-3 p-4 pb-3">
        {sabor.imagenUrl && (
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <Image
              src={sabor.imagenUrl}
              alt={sabor.nombre}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-snug" style={{ color: '#FAF0DC' }}>
            {sabor.nombre}
          </h3>
          <p
            className="text-xs leading-snug mt-0.5 line-clamp-2"
            style={{ color: 'rgba(250,240,220,0.45)' }}
          >
            {sabor.descripcion}
          </p>
        </div>
      </div>

      {/* ── Filas de tamaño ── */}
      <div className="px-4 pb-4 space-y-2.5">
        {/* Mediana */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs font-semibold" style={{ color: 'rgba(250,240,220,0.75)' }}>
              Mediana
            </span>
            <span className="text-[10px]" style={{ color: 'rgba(250,240,220,0.35)' }}>
              6 huevos
            </span>
            <span className="text-sm font-bold" style={{ color: '#EAB85A' }}>
              {sabor.precio.toFixed(2)} €
            </span>
          </div>
          <Stepper value={cantMediana} onChange={(n) => onSetCantidad('mediana', n)} />
        </div>

        {/* Grande (solo si tiene precio configurado) */}
        {sabor.precioGrande && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs font-semibold" style={{ color: 'rgba(250,240,220,0.75)' }}>
                Grande
              </span>
              <span className="text-[10px]" style={{ color: 'rgba(250,240,220,0.35)' }}>
                12 huevos
              </span>
              <span className="text-sm font-bold" style={{ color: '#EAB85A' }}>
                {sabor.precioGrande.toFixed(2)} €
              </span>
            </div>
            <Stepper value={cantGrande} onChange={(n) => onSetCantidad('grande', n)} />
          </div>
        )}

        {/* Subtotal cuando hay algo en carrito */}
        {tieneItems && (
          <div
            className="flex justify-end items-center gap-1.5 pt-2 border-t"
            style={{ borderColor: 'rgba(196,120,50,0.15)' }}
          >
            <span className="text-[10px]" style={{ color: 'rgba(250,240,220,0.4)' }}>
              subtotal
            </span>
            <span className="text-sm font-bold" style={{ color: '#DFA855' }}>
              {subtotalTotal.toFixed(2)} €
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
