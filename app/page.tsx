import { getSabores } from '@/lib/edge-config'
import { getStockDia, getStockSemana, MAX_TORTILLAS_DIA } from '@/lib/kv'
import { getDiasDisponibles, getEstadoHorario } from '@/lib/horario'
import { Hero3D }          from '@/components/ui/Hero3D'
import { MarqueeTicker }   from '@/components/ui/MarqueeTicker'
import { CalendarioSemana } from '@/components/ui/CalendarioSemana'
import { BentoCatalogo }   from '@/components/ui/BentoCatalogo'

export const revalidate = 30

interface Props {
  searchParams: Promise<{ fecha?: string }>
}

const SABORES_DEMO = [
  { id: 'clasica',   nombre: 'La Clásica',         descripcion: 'Huevo, patata y cebolla caramelizada al punto justo. La receta de siempre.',  emoji: '🥚', precio: 8.50,  activo: true },
  { id: 'jamon',     nombre: 'Jamón Ibérico',       descripcion: 'Con jamón ibérico de bellota loncheado en el momento.',                        emoji: '🐖', precio: 11.00, activo: true },
  { id: 'atun',      nombre: 'Atún y Pimiento',     descripcion: 'Atún en aceite de oliva con pimientos asados de la huerta.',                   emoji: '🐟', precio: 9.50,  activo: true },
  { id: 'bacalao',   nombre: 'Bacalao',             descripcion: 'Bacalao desalado con pisto y aceite de oliva virgen extra.',                    emoji: '🧆', precio: 10.50, activo: true },
  { id: 'espinacas', nombre: 'Espinacas',           descripcion: 'Espinacas frescas salteadas con ajo negro y queso de rulo.',                   emoji: '🌿', precio: 9.00,  activo: true },
  { id: 'chorizo',   nombre: 'Chorizo y Queso',     descripcion: 'Chorizo ibérico y queso manchego curado de la Sierra.',                        emoji: '🧀', precio: 10.00, activo: true },
  { id: 'setas',     nombre: 'Setas de Temporada',  descripcion: 'Mezcla de setas silvestres salteadas con trufa negra y romero.',               emoji: '🍄', precio: 10.50, activo: true },
  { id: 'vegetal',   nombre: 'Vegetal',             descripcion: 'Pisto de verduras de temporada, tomate cherry y hierbas aromáticas.',           emoji: '🥗', precio: 8.50,  activo: true },
]

export default async function HomePage({ searchParams }: Props) {
  const { fecha: fechaParam } = await searchParams
  const diasDisponibles = getDiasDisponibles(false)
  const estado = getEstadoHorario()

  const fechaSeleccionada =
    fechaParam && diasDisponibles.includes(fechaParam)
      ? fechaParam
      : diasDisponibles[0]

  const [sabores, stockSemana, stockDia] = await Promise.all([
    getSabores(),
    getStockSemana(diasDisponibles),
    getStockDia(fechaSeleccionada),
  ])

  const saboresFinales   = sabores.length > 0 ? sabores : SABORES_DEMO
  const stockFinal       = sabores.length > 0 ? stockDia : MAX_TORTILLAS_DIA
  const stockSemanaFinal = sabores.length > 0
    ? stockSemana
    : Object.fromEntries(diasDisponibles.map((d) => [d, MAX_TORTILLAS_DIA]))

  return (
    <main>
      {/* ── Primer viewport: Hero 3D ──────────────────────────────────────── */}
      <Hero3D estado={estado} />

      {/* ── Contenido que scrollea sobre el canvas fijo ───────────────────── */}
      <div className="relative z-10" style={{ background: '#050200' }}>
        <MarqueeTicker />
        <CalendarioSemana
          dias={diasDisponibles}
          stockSemana={stockSemanaFinal}
          fechaSeleccionada={fechaSeleccionada}
        />
        <BentoCatalogo
          sabores={saboresFinales}
          stockDia={stockFinal}
          fecha={fechaSeleccionada}
          abierto={estado.abierto}
        />
      </div>
    </main>
  )
}
