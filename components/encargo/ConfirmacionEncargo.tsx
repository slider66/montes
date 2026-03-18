'use client'

import { motion } from 'framer-motion'
import type { Encargo } from '@/lib/types'

const D_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const M_LARGO = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function fechaLegible(iso: string, hora: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${D_LARGO[d.getDay()]} ${d.getDate()} de ${M_LARGO[d.getMonth()]} a las ${hora}`
}

function descargarICS(encargo: Encargo) {
  const [y, mo, da] = encargo.fechaRecogida.split('-').map(Number)
  const [hh, mm] = encargo.horaRecogida.split(':').map(Number)
  const pad = (n: number) => String(n).padStart(2, '0')
  const dtStart = `${y}${pad(mo)}${pad(da)}T${pad(hh)}${pad(mm)}00`
  const dtEnd = `${y}${pad(mo)}${pad(da)}T${pad(hh + 1 > 23 ? 23 : hh + 1)}${pad(mm)}00`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cafe Montes//Encargo//ES',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Recogida encargo — Café & Tortilla Montes`,
    `DESCRIPTION:Encargo ${encargo.id}. Total: ${encargo.total.toFixed(2)} €`,
    `LOCATION:C/ Real\\, 72\\, San Agustín de Guadalix`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `encargo-montes-${encargo.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

function urlWhatsApp(encargo: Encargo): string {
  const texto = `Hola, tengo el encargo ${encargo.id} para recoger el ${fechaLegible(encargo.fechaRecogida, encargo.horaRecogida)}.`
  return `https://wa.me/34633771163?text=${encodeURIComponent(texto)}`
}

interface Props {
  encargo: Encargo
}

export function ConfirmacionEncargo({ encargo }: Props) {
  return (
    <div className="space-y-6">
      {/* Header éxito */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="text-center py-6"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(196,120,50,0.25), rgba(223,168,85,0.15))',
            border: '2px solid rgba(196,120,50,0.45)',
          }}
        >
          ✓
        </div>
        <h2
          className="font-display font-black italic text-3xl mb-1"
          style={{ color: '#FAF0DC' }}
        >
          ¡Encargo confirmado!
        </h2>
        <p className="text-sm" style={{ color: 'rgba(250,240,220,0.5)' }}>
          {fechaLegible(encargo.fechaRecogida, encargo.horaRecogida)}
        </p>
        <p
          className="text-[10px] uppercase tracking-widest mt-2 font-mono"
          style={{ color: 'rgba(212,137,58,0.55)' }}
        >
          {encargo.id}
        </p>
      </motion.div>

      {/* Tabla resumen */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(196,120,50,0.2)' }}
      >
        <div
          className="px-4 py-2.5"
          style={{ background: 'rgba(196,120,50,0.1)', borderBottom: '1px solid rgba(196,120,50,0.15)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#EAB85A' }}>
            Detalle del pedido
          </p>
        </div>
        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
          {encargo.lineas.map((l) => (
            <div
              key={`${l.saborId}_${l.tamano}`}
              className="flex justify-between items-center px-4 py-3"
              style={{ borderColor: 'rgba(196,120,50,0.1)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#FAF0DC' }}>
                  {l.nombreSabor}
                </p>
                <p className="text-xs" style={{ color: 'rgba(250,240,220,0.4)' }}>
                  {l.tamano === 'grande' ? 'Grande (12 h.)' : 'Mediana (6 h.)'} × {l.cantidad}
                </p>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: '#EAB85A' }}>
                {l.subtotal.toFixed(2)} €
              </span>
            </div>
          ))}
          {/* Total */}
          <div
            className="flex justify-between items-center px-4 py-3"
            style={{ background: 'rgba(196,120,50,0.06)', borderColor: 'rgba(196,120,50,0.15)' }}
          >
            <span className="font-bold text-sm" style={{ color: 'rgba(250,240,220,0.7)' }}>
              Total
            </span>
            <span className="font-black text-lg tabular-nums" style={{ color: '#FAF0DC' }}>
              {encargo.total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Info recogida */}
      <div
        className="rounded-xl px-4 py-4 space-y-1.5 text-sm"
        style={{ background: 'rgba(196,120,50,0.06)', border: '1px solid rgba(196,120,50,0.14)' }}
      >
        <p style={{ color: 'rgba(250,240,220,0.65)' }}>
          📍 <span style={{ color: '#FAF0DC' }}>C/ Real, 72</span> · San Agustín de Guadalix
        </p>
        <p style={{ color: 'rgba(250,240,220,0.65)' }}>
          🕐 Recogida:{' '}
          <span style={{ color: '#FAF0DC' }}>
            {fechaLegible(encargo.fechaRecogida, encargo.horaRecogida)}
          </span>
        </p>
        <p style={{ color: 'rgba(250,240,220,0.65)' }}>
          💳 Pago en el local el día de la recogida
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        {/* WhatsApp */}
        <a
          href={urlWhatsApp(encargo)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-150"
          style={{
            background: 'rgba(37,211,102,0.12)',
            color: '#25d366',
            border: '1px solid rgba(37,211,102,0.25)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contactar por WhatsApp
        </a>

        {/* Descarga .ics */}
        <button
          onClick={() => descargarICS(encargo)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-150"
          style={{
            background: 'rgba(196,120,50,0.07)',
            color: 'rgba(250,240,220,0.55)',
            border: '1px solid rgba(196,120,50,0.16)',
          }}
        >
          📅 Añadir al calendario (.ics)
        </button>

        {/* Volver */}
        <a
          href="/"
          className="w-full text-center text-xs py-2 underline transition-opacity hover:opacity-70"
          style={{ color: 'rgba(234,184,90,0.45)' }}
        >
          ← Volver al inicio
        </a>
      </div>
    </div>
  )
}
