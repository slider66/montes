import { redirect } from 'next/navigation'
import { isEncargosEnabled } from '@/lib/features'
import { getSabores } from '@/lib/edge-config'
import { esTiempoTorrijas } from '@/lib/temporada'
import { EncargoWizard } from '@/components/encargo/EncargoWizard'
import type { Sabor } from '@/lib/types'

export const revalidate = 30

// Fallback cuando Edge Config no está configurado (desarrollo local)
const SABORES_DEMO: Sabor[] = [
  {
    id: 'clasica-con',
    nombre: 'Clásica con Cebolla',
    descripcion: 'La receta de siempre. Huevo, patata y cebolla pochada a fuego lento.',
    emoji: '🥚',
    precio: 8.0,
    precioGrande: 14.5,
    activo: true,
    imagenUrl: '/tortillas/clasica-abierta.webp',
  },
  {
    id: 'clasica-sin',
    nombre: 'Clásica sin Cebolla',
    descripcion: 'La pureza del huevo y la patata. Sabor más directo y tradicional.',
    emoji: '🍳',
    precio: 8.0,
    precioGrande: 14.5,
    activo: true,
    imagenUrl: '/tortillas/clasica-sin-cebolla.webp',
  },
  {
    id: 'jamon-queso',
    nombre: 'Jamón York y Queso',
    descripcion: 'Rellena con jamón york y queso fundido en el centro.',
    emoji: '🧀',
    precio: 10.0,
    precioGrande: 18.5,
    activo: true,
    imagenUrl: '/tortillas/jamon-queso.webp',
  },
  {
    id: 'chorizo',
    nombre: 'Chorizo',
    descripcion: 'Rellena de chorizo casero. Sabor intenso y tradicional en cada corte.',
    emoji: '🌶️',
    precio: 10.0,
    precioGrande: 18.5,
    activo: true,
    imagenUrl: '/tortillas/chorizo.webp',
  },
  {
    id: 'morcilla',
    nombre: 'Morcilla',
    descripcion: 'Rellena de morcilla. Sabor profundo y contundente.',
    emoji: '🫙',
    precio: 10.0,
    precioGrande: 18.5,
    activo: true,
    imagenUrl: '/tortillas/morcilla.webp',
  },
  {
    id: 'atun',
    nombre: 'Atún',
    descripcion: 'Rellena de atún en aceite de oliva. Suave y jugosa.',
    emoji: '🐟',
    precio: 10.0,
    precioGrande: 18.5,
    activo: true,
    imagenUrl: '/tortillas/atun.webp',
  },
]

export default async function EncargoPage() {
  const activo = await isEncargosEnabled()
  if (!activo) redirect('/')

  const saboresRaw = await getSabores()

  // Usar demo si Edge Config no devuelve sabores
  // Filtrar esTemporada: no son encargables (solo en local durante Semana Santa)
  const sabores = (saboresRaw.length > 0 ? saboresRaw : SABORES_DEMO).filter(
    (s) => s.activo && !s.esTemporada
  )

  return <EncargoWizard sabores={sabores} esTemporadaTorrijas={esTiempoTorrijas()} />
}
