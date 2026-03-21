'use client'

import Image from 'next/image'
import type { Sabor } from '@/lib/types'
import type { CartLinea } from './EncargoWizard'
import { TortillaLineaCard } from './TortillaLineaCard'

// ─── Complementos y bebidas (datos estáticos) ─────────────────────────────────

const COMPLEMENTOS_BASE = [
  { id: 'croquetas-6',  nombre: 'Croquetas de jamón', descripcion: '6 unidades · Caseras, crujientes y cremosas', precio: 6.00,  imagen: '/carta/croquetas.webp' },
  { id: 'croquetas-12', nombre: 'Croquetas de jamón', descripcion: '12 unidades · Ideal para grupos',             precio: 12.00, imagen: '/carta/croquetas.webp' },
  { id: 'pan-barra',    nombre: 'Barra de pan',        descripcion: 'Barra de pan del día',                        precio: 1.50,  imagen: '/carta/pan.webp' },
]

const COMPLEMENTOS_TORRIJAS = [
  { id: 'torrijas-2',  nombre: 'Torrijas de Semana Santa', descripcion: '2 unidades · Edición especial temporada', precio: 5.00,  imagen: '/tortillas/torrijas.webp' },
  { id: 'torrijas-4',  nombre: 'Torrijas de Semana Santa', descripcion: '4 unidades · Ideal para compartir',       precio: 10.00, imagen: '/tortillas/torrijas.webp' },
]

const BEBIDAS = [
  { id: 'agua',     nombre: 'Agua',                   descripcion: 'Botella 50cl',              precio: 1.00,  imagen: null },
  { id: 'refresco', nombre: 'Refresco',                descripcion: 'Lata 33cl · Variedad según stock', precio: 1.50, imagen: '/carta/refrescos.webp' },
  { id: 'zumo',     nombre: 'Zumo de naranja natural', descripcion: 'Exprimido al momento',      precio: 2.50,  imagen: '/carta/zumo-y-cafe.webp' },
]

// ─── Stepper reutilizable ─────────────────────────────────────────────────────

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
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
      >−</button>
      <span
        className="w-6 text-center font-bold text-sm tabular-nums"
        style={{ color: value > 0 ? '#FAF0DC' : 'rgba(250,240,220,0.35)' }}
      >{value}</span>
      <button
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold transition-all duration-150 select-none"
        style={{
          background: 'rgba(196,120,50,0.18)',
          color: '#EAB85A',
          border: '1px solid rgba(196,120,50,0.28)',
        }}
        aria-label="Añadir uno"
      >+</button>
    </div>
  )
}

// ─── Card genérica para complementos / bebidas ────────────────────────────────

function ItemCard({
  item,
  linea,
  onSetCantidad,
}: {
  item: { id: string; nombre: string; descripcion: string; precio: number; imagen: string | null }
  linea?: CartLinea
  onSetCantidad: (cantidad: number) => void
}) {
  const cantidad = linea?.cantidad ?? 0
  const tieneItems = cantidad > 0

  return (
    <div
      className="rounded-2xl overflow-hidden flex items-center gap-3 p-4 transition-all duration-200"
      style={{
        background: tieneItems ? 'rgba(196,120,50,0.08)' : 'rgba(26,14,5,0.7)',
        border: `1px solid ${tieneItems ? 'rgba(196,120,50,0.38)' : 'rgba(196,120,50,0.14)'}`,
      }}
    >
      {item.imagen && (
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <Image src={item.imagen} alt={item.nombre} width={56} height={56} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-snug" style={{ color: '#FAF0DC' }}>{item.nombre}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.45)' }}>{item.descripcion}</p>
        <p className="text-sm font-bold mt-1" style={{ color: '#EAB85A' }}>{item.precio.toFixed(2)} €</p>
      </div>
      <Stepper value={cantidad} onChange={onSetCantidad} />
    </div>
  )
}

// ─── Cabecera de sección ──────────────────────────────────────────────────────

function SeccionHeader({ titulo, subtitulo }: { titulo: string; subtitulo: string }) {
  return (
    <div className="mb-4 mt-10">
      <h2 className="font-display font-black italic text-3xl" style={{ color: '#FAF0DC' }}>
        {titulo}
      </h2>
      <p className="text-sm mt-1" style={{ color: 'rgba(250,240,220,0.45)' }}>
        {subtitulo}
      </p>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  sabores: Sabor[]
  lineas: Record<string, CartLinea>
  esTemporadaTorrijas?: boolean
  onSetCantidad: (
    saborId: string,
    nombre: string,
    tamano: 'mediana' | 'grande' | 'unidad',
    cantidad: number,
    precio: number
  ) => void
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CatalogoPedido({ sabores, lineas, onSetCantidad, esTemporadaTorrijas = false }: Props) {
  const complementos = esTemporadaTorrijas
    ? [...COMPLEMENTOS_BASE, ...COMPLEMENTOS_TORRIJAS]
    : COMPLEMENTOS_BASE
  return (
    <div>
      {/* ── Tortillas ── */}
      <SeccionHeader
        titulo="Elige tus tortillas"
        subtitulo="Puedes pedir varias unidades de cada sabor y tamaño"
      />

      {sabores.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(196,120,50,0.14)' }}>
          <p className="text-sm" style={{ color: 'rgba(250,240,220,0.4)' }}>
            No hay sabores configurados. Añade tortillas en Edge Config.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sabores.map((sabor) => (
            <TortillaLineaCard
              key={sabor.id}
              sabor={sabor}
              lineaMediana={lineas[`${sabor.id}_mediana`]}
              lineaGrande={lineas[`${sabor.id}_grande`]}
              onSetCantidad={(tamano, cantidad) => {
                const precio = tamano === 'grande'
                  ? (sabor.precioGrande ?? sabor.precio * 1.8)
                  : sabor.precio
                onSetCantidad(sabor.id, sabor.nombre, tamano, cantidad, precio)
              }}
            />
          ))}
        </div>
      )}

      {/* ── Complementos ── */}
      <SeccionHeader
        titulo="Elige tus complementos"
        subtitulo="Croquetas caseras elaboradas en el local"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {complementos.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            linea={lineas[`${item.id}_unidad`]}
            onSetCantidad={(cantidad) =>
              onSetCantidad(item.id, item.nombre + ' · ' + item.descripcion, 'unidad', cantidad, item.precio)
            }
          />
        ))}
      </div>

      {/* ── Bebidas ── */}
      <SeccionHeader
        titulo="Elige tus bebidas"
        subtitulo="Para acompañar tu encargo"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {BEBIDAS.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            linea={lineas[`${item.id}_unidad`]}
            onSetCantidad={(cantidad) =>
              onSetCantidad(item.id, item.nombre, 'unidad', cantidad, item.precio)
            }
          />
        ))}
      </div>
    </div>
  )
}
