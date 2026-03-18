'use client'

import type { Sabor } from '@/lib/types'
import type { CartLinea } from './EncargoWizard'
import { TortillaLineaCard } from './TortillaLineaCard'

interface Props {
  sabores: Sabor[]
  lineas: Record<string, CartLinea>
  onSetCantidad: (
    saborId: string,
    nombre: string,
    tamano: 'mediana' | 'grande',
    cantidad: number,
    precio: number
  ) => void
}

export function CatalogoPedido({ sabores, lineas, onSetCantidad }: Props) {
  if (sabores.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ border: '1px solid rgba(196,120,50,0.14)' }}
      >
        <p className="text-sm" style={{ color: 'rgba(250,240,220,0.4)' }}>
          No hay sabores configurados. Añade tortillas en Edge Config.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h2
          className="font-display font-black italic text-3xl"
          style={{ color: '#FAF0DC' }}
        >
          Elige tus tortillas
        </h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(250,240,220,0.45)' }}>
          Puedes pedir varias unidades de cada sabor y tamaño
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sabores.map((sabor) => (
          <TortillaLineaCard
            key={sabor.id}
            sabor={sabor}
            lineaMediana={lineas[`${sabor.id}_mediana`]}
            lineaGrande={lineas[`${sabor.id}_grande`]}
            onSetCantidad={(tamano, cantidad) => {
              const precio =
                tamano === 'grande'
                  ? (sabor.precioGrande ?? sabor.precio * 1.8)
                  : sabor.precio
              onSetCantidad(sabor.id, sabor.nombre, tamano, cantidad, precio)
            }}
          />
        ))}
      </div>
    </div>
  )
}
