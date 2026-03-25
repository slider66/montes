'use client'

import { useEffect, useState } from 'react'

export function ContadorVisitas() {
  const [visitas, setVisitas] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/visitas', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setVisitas(d.total))
      .catch(() => {})
  }, [])

  if (!visitas) return null

  return (
    <div className="flex items-center gap-2">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(212,137,58,0.55)', flexShrink: 0 }}>
        <path d="M8 3C4.5 3 1.5 8 1.5 8s3 5 6.5 5 6.5-5 6.5-5-3-5-6.5-5z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="1.8" fill="currentColor"/>
      </svg>
      <span className="text-[11px]" style={{ color: 'rgba(250,240,220,0.28)' }}>
        {visitas.toLocaleString('es-ES')} visitas
      </span>
    </div>
  )
}
