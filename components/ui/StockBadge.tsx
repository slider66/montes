import { MAX_TORTILLAS_DIA } from '@/lib/kv'

interface Props {
  disponible: number   // tortillas restantes ese día (de un total de 8)
}

export function StockBadge({ disponible }: Props) {
  const total = MAX_TORTILLAS_DIA
  const porcentaje = disponible / total

  if (disponible <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Cupo completo
      </span>
    )
  }

  if (porcentaje <= 0.25) {
    // ≤ 2 tortillas restantes
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        ¡Solo {disponible} left!
      </span>
    )
  }

  if (porcentaje <= 0.5) {
    // ≤ 4 tortillas restantes
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Quedan {disponible}/{total}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      {disponible}/{total} disponibles
    </span>
  )
}
