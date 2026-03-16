export function MarqueeTicker() {
  const items = [
    '🥚 Tortilla Artesanal',
    '✦ Stock Limitado',
    '🫒 Aceite Virgen Extra',
    '✦ Recogida 07:00–14:00',
    '🧅 Cebolla Caramelizada',
    '✦ San Agustín de Guadalix',
    '🌿 Producto de Temporada',
    '✦ 8 Sabores Únicos',
  ]

  const repeated = [...items, ...items]

  return (
    <div
      className="relative w-full overflow-hidden py-3 border-y"
      style={{
        borderColor: 'rgba(255,200,80,0.10)',
        background: 'rgba(255,200,80,0.025)',
      }}
    >
      <div className="ticker-track flex whitespace-nowrap gap-0">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-8 text-xs font-semibold uppercase tracking-widest shrink-0"
            style={{ color: 'rgba(240,230,208,0.38)' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
