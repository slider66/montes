const CROQUETAS = [
  { cantidad: '6 unidades', precio: '6,00 €' },
  { cantidad: '12 unidades', precio: '12,00 €' },
]

const OTROS = [
  { categoria: 'Café', items: ['Café solo', 'Cortado', 'Café con leche', 'Cappuccino', 'Descafeinado'] },
  { categoria: 'Bollería', items: ['Croissant', 'Napolitana', 'Palmera', 'Donut', 'Magdalena'] },
  { categoria: 'Pan', items: ['Tostada con mantequilla', 'Tostada con tomate', 'Bocadillo'] },
  { categoria: 'Bebidas', items: ['Refresco', 'Cerveza', 'Zumo de naranja natural', 'Agua'] },
]

export function CartaSection() {
  return (
    <section className="w-full max-w-2xl mx-auto px-5 pb-16">

      {/* Divisor */}
      <div className="divider-tortilla mb-10" />

      {/* Label sección */}
      <p
        className="text-[10px] uppercase tracking-[0.25em] font-bold mb-5"
        style={{ color: 'rgba(250,240,220,0.38)' }}
      >
        También en carta
      </p>

      {/* Croquetas */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{
          background: 'rgba(212,137,58,0.06)',
          border: '1px solid rgba(212,137,58,0.16)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧆</span>
          <div>
            <h3 className="font-display font-bold italic text-lg" style={{ color: '#FAF0DC' }}>
              Croquetas Caseras de Jamón
            </h3>
            <p className="text-xs" style={{ color: 'rgba(250,240,220,0.40)' }}>
              Elaboradas en casa, crujientes por fuera y cremosas por dentro
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {CROQUETAS.map(({ cantidad, precio }) => (
            <div
              key={cantidad}
              className="flex items-center justify-between gap-4 px-4 py-2 rounded-xl flex-1 min-w-[140px]"
              style={{ background: 'rgba(212,137,58,0.08)', border: '1px solid rgba(212,137,58,0.14)' }}
            >
              <span className="text-sm" style={{ color: 'rgba(250,240,220,0.60)' }}>{cantidad}</span>
              <span className="font-display font-bold text-base" style={{ color: '#EAB85A' }}>{precio}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Café, bollería y bebidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OTROS.map(({ categoria, items }) => (
          <div
            key={categoria}
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(212,137,58,0.04)',
              border: '1px solid rgba(212,137,58,0.12)',
            }}
          >
            <p
              className="text-[10px] uppercase tracking-widest font-bold mb-3"
              style={{ color: '#D4893A' }}
            >
              {categoria}
            </p>
            <ul className="flex flex-col gap-1.5">
              {items.map((item) => (
                <li
                  key={item}
                  className="text-sm flex items-center gap-2"
                  style={{ color: 'rgba(250,240,220,0.55)' }}
                >
                  <span style={{ color: 'rgba(212,137,58,0.50)' }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        className="text-center text-xs mt-6"
        style={{ color: 'rgba(250,240,220,0.22)' }}
      >
        Precios de bebidas y bollería consultar en local · C. Postas, 2
      </p>
    </section>
  )
}
