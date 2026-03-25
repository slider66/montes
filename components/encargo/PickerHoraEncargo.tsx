'use client'

import { HORAS_RECOGIDA } from '@/lib/encargos'

interface Props {
  value: string
  onChange: (hora: string) => void
  error?: string
}

export function PickerHoraEncargo({ value, onChange, error }: Props) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3"
        style={{ color: 'rgba(242,226,192,0.38)' }}
      >
        Hora de recogida
      </p>

      <div className="flex flex-wrap gap-2">
        {HORAS_RECOGIDA.map((hora) => {
          const sel = hora === value
          return (
            <button
              key={hora}
              type="button"
              onClick={() => onChange(hora)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
              style={{
                background: sel
                  ? 'linear-gradient(135deg, #D4893A, #EAB85A)'
                  : 'rgba(196,120,50,0.07)',
                color: sel ? '#1A0E05' : 'rgba(250,240,220,0.65)',
                border: sel ? 'none' : '1px solid rgba(196,120,50,0.18)',
                boxShadow: sel ? '0 2px 12px rgba(212,137,58,0.35)' : 'none',
              }}
            >
              {hora}
            </button>
          )
        })}
      </div>

      {error && (
        <p className="text-xs mt-2" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
