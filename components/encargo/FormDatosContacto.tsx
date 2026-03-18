'use client'

export interface DatosContacto {
  nombre: string
  email: string
  telefono: string
  notas: string
}

type Errores = Partial<Record<keyof DatosContacto, string>>

interface Props {
  values: DatosContacto
  errors: Errores
  onChange: (field: keyof DatosContacto, value: string) => void
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
        style={{ color: 'rgba(250,240,220,0.55)' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}

const inputStyle = {
  background: 'rgba(196,120,50,0.06)',
  border: '1px solid rgba(196,120,50,0.22)',
  color: '#FAF0DC',
  outline: 'none',
} as const

export function FormDatosContacto({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3
        className="font-display font-bold italic text-xl mb-1"
        style={{ color: '#FAF0DC' }}
      >
        Tus datos
      </h3>

      <Field label="Nombre" error={errors.nombre}>
        <input
          type="text"
          value={values.nombre}
          onChange={(e) => onChange('nombre', e.target.value)}
          placeholder="Tu nombre completo"
          autoComplete="name"
          className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150"
          style={{
            ...inputStyle,
            borderColor: errors.nombre ? '#f87171' : 'rgba(196,120,50,0.22)',
          }}
        />
      </Field>

      <Field label="Teléfono" error={errors.telefono}>
        <input
          type="tel"
          value={values.telefono}
          onChange={(e) => onChange('telefono', e.target.value)}
          placeholder="612 345 678"
          autoComplete="tel"
          className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150"
          style={{
            ...inputStyle,
            borderColor: errors.telefono ? '#f87171' : 'rgba(196,120,50,0.22)',
          }}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150"
          style={{
            ...inputStyle,
            borderColor: errors.email ? '#f87171' : 'rgba(196,120,50,0.22)',
          }}
        />
      </Field>

      <Field label="Notas (opcional)" error={errors.notas}>
        <textarea
          value={values.notas}
          onChange={(e) => onChange('notas', e.target.value)}
          placeholder="Alergias, preferencias, instrucciones especiales…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all duration-150"
          style={inputStyle}
        />
      </Field>
    </div>
  )
}
