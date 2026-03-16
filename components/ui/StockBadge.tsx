interface Props {
  disponible: number
  total: number
}

export function StockBadge({ disponible, total }: Props) {
  const porcentaje = total > 0 ? disponible / total : 0

  if (disponible <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Agotado
      </span>
    )
  }

  if (porcentaje <= 0.25) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        Últimas {disponible}
      </span>
    )
  }

  if (porcentaje <= 0.5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Quedan {disponible}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      Disponible
    </span>
  )
}
