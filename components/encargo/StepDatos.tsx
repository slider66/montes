'use client'

import { useState } from 'react'
import type { CartLinea } from './EncargoWizard'
import type { Encargo } from '@/lib/types'
import { FormDatosContacto, type DatosContacto } from './FormDatosContacto'
import { PickerFechaEncargo } from './PickerFechaEncargo'
import { PickerHoraEncargo } from './PickerHoraEncargo'

interface Props {
  lineas: CartLinea[]
  total: number
  onSuccess: (encargo: Encargo) => void
  onBack: () => void
}

type Errores = Partial<
  Record<keyof DatosContacto | 'fechaRecogida' | 'horaRecogida', string>
>

function validar(
  datos: DatosContacto,
  fechaRecogida: string,
  horaRecogida: string
): Errores {
  const e: Errores = {}
  if (datos.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) e.email = 'Email no válido'
  if (!/^\+?[\d\s\-]{9,15}$/.test(datos.telefono)) e.telefono = 'Teléfono no válido'
  if (!fechaRecogida) e.fechaRecogida = 'Selecciona una fecha'
  if (!horaRecogida) e.horaRecogida = 'Selecciona un horario'
  return e
}

export function StepDatos({ lineas, total, onSuccess, onBack }: Props) {
  const [datos, setDatos] = useState<DatosContacto>({
    nombre: '',
    email: '',
    telefono: '',
    notas: '',
  })
  const [fechaRecogida, setFechaRecogida] = useState('')
  const [horaRecogida, setHoraRecogida] = useState('')
  const [errores, setErrores] = useState<Errores>({})
  const [errorApi, setErrorApi] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof DatosContacto, value: string) => {
    setDatos((d) => ({ ...d, [field]: value }))
    if (errores[field]) setErrores((e) => ({ ...e, [field]: undefined }))
  }

  const handleSubmit = async () => {
    const e = validar(datos, fechaRecogida, horaRecogida)
    if (Object.keys(e).length > 0) {
      setErrores(e)
      return
    }

    setSubmitting(true)
    setErrorApi('')

    try {
      const res = await fetch('/api/encargos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: {
            nombre: datos.nombre.trim(),
            email: datos.email.trim(),
            telefono: datos.telefono.trim(),
          },
          lineas: lineas.map((l) => ({
            saborId: l.saborId,
            tamano: l.tamano,
            cantidad: l.cantidad,
          })),
          fechaRecogida,
          horaRecogida,
          notas: datos.notas.trim() || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.ok) {
        setErrorApi(json.error ?? 'Error al enviar el encargo. Inténtalo de nuevo.')
        return
      }

      onSuccess(json.encargo as Encargo)
    } catch {
      setErrorApi('Error de conexión. Comprueba tu internet e inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Resumen compacto del pedido */}
      <div
        className="rounded-xl px-4 py-3 flex justify-between items-center"
        style={{ background: 'rgba(196,120,50,0.08)', border: '1px solid rgba(196,120,50,0.18)' }}
      >
        <span className="text-sm" style={{ color: 'rgba(250,240,220,0.55)' }}>
          {lineas.length} {lineas.length === 1 ? 'línea' : 'líneas'} ·{' '}
          {lineas.reduce((s, l) => s + l.cantidad, 0)} uds
        </span>
        <span className="font-bold text-base tabular-nums" style={{ color: '#EAB85A' }}>
          {total.toFixed(2)} €
        </span>
      </div>

      {/* Formulario datos */}
      <FormDatosContacto values={datos} errors={errores} onChange={handleChange} />

      {/* Fecha */}
      <PickerFechaEncargo
        value={fechaRecogida}
        onChange={(f) => {
          setFechaRecogida(f)
          setErrores((e) => ({ ...e, fechaRecogida: undefined }))
        }}
        error={errores.fechaRecogida}
      />

      {/* Hora */}
      <PickerHoraEncargo
        value={horaRecogida}
        onChange={(h) => {
          setHoraRecogida(h)
          setErrores((e) => ({ ...e, horaRecogida: undefined }))
        }}
        error={errores.horaRecogida}
      />

      {/* Error API */}
      {errorApi && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }}
        >
          {errorApi}
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-200"
          style={{
            background: submitting
              ? 'rgba(196,120,50,0.2)'
              : 'linear-gradient(135deg, #D4893A 0%, #EAB85A 100%)',
            color: submitting ? 'rgba(196,120,50,0.5)' : '#1A0E05',
            boxShadow: submitting ? 'none' : '0 4px 20px rgba(212,137,58,0.3)',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Enviando encargo…' : 'Confirmar encargo →'}
        </button>

        <button
          onClick={onBack}
          disabled={submitting}
          className="w-full text-center text-xs py-2 underline transition-opacity hover:opacity-70"
          style={{ color: 'rgba(234,184,90,0.5)' }}
        >
          ← Volver al resumen
        </button>
      </div>

      <p
        className="text-[10px] text-center leading-relaxed"
        style={{ color: 'rgba(250,240,220,0.25)' }}
      >
        Al confirmar recibirás un email con los detalles del encargo.
        <br />
        Pago en el local el día de la recogida.
      </p>
    </div>
  )
}
