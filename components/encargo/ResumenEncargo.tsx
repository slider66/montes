'use client'

import type { CartLinea } from './EncargoWizard'

interface Props {
  lineas: CartLinea[]
  total: number
  onSiguiente: () => void
  onEditar?: () => void
  esSidebar?: boolean
}

export function ResumenEncargo({ lineas, total, onSiguiente, onEditar, esSidebar }: Props) {
  const totalUds = lineas.reduce((s, l) => s + l.cantidad, 0)
  const vacio = lineas.length === 0

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(26,14,5,0.95)',
        border: '1px solid rgba(196,120,50,0.28)',
      }}
    >
      {/* Título */}
      <h3
        className="font-display font-bold italic text-xl mb-4"
        style={{ color: '#FAF0DC' }}
      >
        {esSidebar ? 'Tu pedido' : 'Resumen del pedido'}
      </h3>

      {/* Líneas */}
      {vacio ? (
        <p
          className="text-sm text-center py-8"
          style={{ color: 'rgba(250,240,220,0.3)' }}
        >
          Añade tortillas desde el catálogo
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {lineas.map((l) => (
              <div
                key={`${l.saborId}_${l.tamano}`}
                className="flex justify-between items-start gap-3"
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: '#FAF0DC' }}
                  >
                    {l.nombreSabor}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(250,240,220,0.4)' }}>
                    {l.tamano === 'grande' ? 'Grande (12 h.)' : 'Mediana (6 h.)'} × {l.cantidad}
                    {' · '}
                    {l.precioUnitario.toFixed(2)} € c/u
                  </p>
                </div>
                <span
                  className="text-sm font-bold shrink-0 tabular-nums"
                  style={{ color: '#EAB85A' }}
                >
                  {l.subtotal.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex justify-between items-center py-3 mb-4 border-t border-b"
            style={{ borderColor: 'rgba(196,120,50,0.18)' }}
          >
            <span className="text-sm" style={{ color: 'rgba(250,240,220,0.55)' }}>
              {totalUds} {totalUds === 1 ? 'unidad' : 'unidades'}
            </span>
            <span className="font-bold text-xl tabular-nums" style={{ color: '#FAF0DC' }}>
              {total.toFixed(2)} €
            </span>
          </div>
        </>
      )}

      {/* CTA Continuar */}
      <button
        onClick={onSiguiente}
        disabled={vacio}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
        style={{
          background: vacio
            ? 'rgba(196,120,50,0.08)'
            : 'linear-gradient(135deg, #D4893A 0%, #EAB85A 100%)',
          color: vacio ? 'rgba(196,120,50,0.3)' : '#1A0E05',
          cursor: vacio ? 'not-allowed' : 'pointer',
          boxShadow: vacio ? 'none' : '0 4px 20px rgba(212,137,58,0.3)',
        }}
      >
        {vacio ? 'Añade tortillas para continuar' : 'Continuar con el pedido →'}
      </button>

      {/* Volver al catálogo (solo en vista resumen, no en sidebar) */}
      {!esSidebar && onEditar && !vacio && (
        <button
          onClick={onEditar}
          className="w-full text-center text-xs mt-3 py-1 underline transition-opacity hover:opacity-70"
          style={{ color: 'rgba(234,184,90,0.55)' }}
        >
          ← Editar pedido
        </button>
      )}

      {/* Info regla 48h */}
      {!vacio && (
        <p
          className="text-[10px] text-center mt-4 leading-relaxed"
          style={{ color: 'rgba(250,240,220,0.28)' }}
        >
          Los encargos necesitan 48h de antelación mínimo.
          <br />
          Recibirás confirmación por email.
        </p>
      )}
    </div>
  )
}
