export function MarqueeTicker() {
  const items = [
    '🥚 Tortilla Artesanal',
    '✦ Ingredientes de proximidad',
    '📍 Consulta tu punto de recogida',
    '✦ Recogida 07:00–14:00',
    '🧅 8 Sabores Únicos',
    '✦ Para llevar · Encargos Online',
    '🫒 Aceite Virgen Extra',
    '✦ Máxima Calidad',
    '🌿 Producto de Temporada',
    '✦ Mr Tortilla',
  ]

  const repeated = [...items, ...items]

  return (
    <div
      className="relative w-full overflow-hidden py-3 border-y"
      style={{
        borderColor: 'rgba(196,120,50,0.14)',
        background: 'rgba(196,120,50,0.04)',
      }}
    >
      <div className="ticker-track flex whitespace-nowrap gap-0">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-8 text-xs font-semibold uppercase tracking-widest shrink-0"
            style={{ color: 'rgba(242,226,192,0.40)' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
