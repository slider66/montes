import { getSabores } from '@/lib/edge-config'
import { getStockDia, getStockSemana, MAX_TORTILLAS_DIA } from '@/lib/kv'
import { getDiasDisponibles, getEstadoHorario } from '@/lib/horario'
import { esTiempoTorrijas } from '@/lib/temporada'
import { isEncargosEnabled } from '@/lib/features'
import { EncargosCTA } from '@/components/encargo/EncargosCTA'
import { DemoSwitch } from '@/components/ui/DemoSwitch'
import { Hero3D }          from '@/components/ui/Hero3D'
import { MarqueeTicker }   from '@/components/ui/MarqueeTicker'
import { CalendarioSemana } from '@/components/ui/CalendarioSemana'
import { BentoCatalogo }   from '@/components/ui/BentoCatalogo'
import { Footer }          from '@/components/ui/Footer'
import { CartaSection }    from '@/components/ui/CartaSection'

export const revalidate = 30

interface Props {
  searchParams: Promise<{ fecha?: string }>
}

const SABORES_DEMO = [
  {
    id: 'clasica-con',
    nombre: 'Clásica con Cebolla',
    descripcion: 'La receta de siempre. Huevo, patata y cebolla pochada a fuego lento. Jugosa por dentro, dorada por fuera.',
    emoji: '🥚',
    precio: 8.00,
    precioGrande: 14.50,
    nota: '6 huevos · 12 huevos disponible',
    activo: true,
    imagenUrl: '/tortillas/clasica-abierta.webp',
  },
  {
    id: 'clasica-sin',
    nombre: 'Clásica sin Cebolla',
    descripcion: 'La pureza del huevo y la patata. Para los que prefieren el sabor más directo y tradicional.',
    emoji: '🍳',
    precio: 8.00,
    precioGrande: 14.50,
    nota: '6 huevos · 12 huevos disponible',
    activo: true,
    imagenUrl: '/tortillas/clasica-sin-cebolla.webp',
  },
  {
    id: 'jamon-queso',
    nombre: 'Jamón York y Queso',
    descripcion: 'Tortilla de patata rellena con jamón york y queso fundido en el centro. Un clásico que nunca falla.',
    emoji: '🧀',
    precio: 10.00,
    precioGrande: 18.50,
    nota: 'Rellena · 6 huevos · 12 huevos disponible',
    activo: true,
    imagenUrl: '/tortillas/jamon-queso.webp',
  },
  {
    id: 'chorizo',
    nombre: 'Chorizo',
    descripcion: 'Rellena de chorizo casero. Sabor intenso y tradicional en cada corte.',
    emoji: '🌶️',
    precio: 10.00,
    precioGrande: 18.50,
    nota: 'Rellena · 6 huevos · 12 huevos disponible',
    activo: true,
    imagenUrl: '/tortillas/chorizo.webp',
  },
  {
    id: 'morcilla',
    nombre: 'Morcilla',
    descripcion: 'Tortilla rellena de morcilla. Sabor profundo y contundente, ideal para los paladares más atrevidos.',
    emoji: '🫙',
    precio: 10.00,
    precioGrande: 18.50,
    nota: 'Rellena · 6 huevos · 12 huevos disponible',
    activo: true,
    imagenUrl: '/tortillas/morcilla.webp',
  },
  {
    id: 'atun',
    nombre: 'Atún',
    descripcion: 'Rellena de atún en aceite de oliva. Suave, jugosa y con todo el sabor del mar en cada bocado.',
    emoji: '🐟',
    precio: 10.00,
    precioGrande: 18.50,
    nota: 'Rellena · 6 huevos · 12 huevos disponible',
    activo: true,
    imagenUrl: '/tortillas/atun.webp',
  },
]

const SABOR_TORRIJAS = {
  id: 'torrijas',
  nombre: 'Torrijas de Semana Santa',
  descripcion: 'Edición especial de temporada. Pan brioche empapado en leche, huevo y canela, dorado en aceite de oliva. Solo disponibles en Semana Santa.',
  emoji: '🍞',
  precio: 2.50,
  nota: '⏳ Tiempo limitado · Solo Semana Santa',
  activo: true,
  esTemporada: true,
  imagenUrl: '/tortillas/torrijas.webp',
} as const

export default async function HomePage({ searchParams }: Props) {
  const { fecha: fechaParam } = await searchParams
  const diasDisponibles = getDiasDisponibles(false)
  const estado = getEstadoHorario()

  const fechaSeleccionada =
    fechaParam && diasDisponibles.includes(fechaParam)
      ? fechaParam
      : diasDisponibles[0]

  const [sabores, stockSemana, stockDia, encargosActivo] = await Promise.all([
    getSabores(),
    getStockSemana(diasDisponibles),
    getStockDia(fechaSeleccionada),
    isEncargosEnabled(),
  ])

  const saboresBase    = sabores.length > 0 ? sabores : SABORES_DEMO
  const saboresFinales = esTiempoTorrijas()
    ? [...saboresBase, SABOR_TORRIJAS]
    : saboresBase
  const stockFinal       = sabores.length > 0 ? stockDia : MAX_TORTILLAS_DIA
  const stockSemanaFinal = sabores.length > 0
    ? stockSemana
    : Object.fromEntries(diasDisponibles.map((d) => [d, MAX_TORTILLAS_DIA]))

  return (
    <main>
      {/* Switch demo — visible solo para el desarrollador/vendedor */}
      <DemoSwitch encargosActivo={encargosActivo} />

      {/* ── Primer viewport: Hero 3D ──────────────────────────────────────── */}
      <Hero3D estado={estado} />

      {/* ── Contenido que scrollea ────────────────────────────────────────── */}
      <div className="relative z-10 bg-[#1A0E05]">
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
        {encargosActivo && <EncargosCTA />}
        <CartaSection />
        <Footer encargosActivo={encargosActivo} />
      </div>
    </main>
  )
}
