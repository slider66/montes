import Image from 'next/image'

export function Footer({ encargosActivo = false }: { encargosActivo?: boolean }) {
  return (
    <footer
      className="relative w-full border-t"
      style={{ borderColor: 'rgba(212,137,58,0.16)', background: 'rgba(26,14,5,0.95)' }}
    >
      {/* Divisor decorativo */}
      <div className="divider-tortilla" />

      <div className="max-w-2xl mx-auto px-5 py-12">
        {/* Logo / nombre */}
        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/logo.webp"
            alt="Café & Tortilla Montes"
            width={56}
            height={56}
            className="rounded-xl"
            style={{ mixBlendMode: 'multiply', filter: 'drop-shadow(0 0 12px rgba(212,137,58,0.35))' }}
          />
          <div>
            <h2
              className="font-display font-black italic leading-none"
              style={{
                fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                background: 'linear-gradient(135deg, #F2D06E 0%, #D4893A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Montes
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.42)' }}>
              Café &amp; Tortilla · Artesanal desde siempre
            </p>
          </div>
        </div>

        {/* Grid de info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">

          {/* Dirección y contacto */}
          <div className="flex flex-col gap-4">
            <InfoItem
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6.125a1.625 1.625 0 110-3.25 1.625 1.625 0 010 3.25z" fill="currentColor"/>
                </svg>
              }
              label="Dirección"
              value="C. Postas, 2"
              sub="28750 San Agustín del Guadalix, Madrid"
              href="https://maps.google.com/?q=C.+Postas+2+San+Agustín+del+Guadalix"
            />
            <InfoItem
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.9.9a7.1 7.1 0 01-3.6-3.6l.9-.9a1 1 0 000-1.4l-2-2A1 1 0 003.1 3l-.6.6C1.6 4.5 2 7 4.5 9.5S11.5 14.4 12.4 13.5l.6-.6a1 1 0 00.5-1.4z" fill="currentColor"/>
                </svg>
              }
              label="Teléfono"
              value="633 77 11 63"
              href="tel:+34633771163"
            />
          </div>

          {/* Horario y servicios */}
          <div className="flex flex-col gap-4">
            <InfoItem
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M8 4.5V8.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              }
              label="Horario"
              value="07:00 – 14:00"
              sub="Lunes a domingo"
            />
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(250,240,220,0.35)' }}>
                Servicios
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Comer aquí" ok />
                <Chip label="Para llevar" ok />
                <Chip label="A domicilio" ok={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl mb-10"
          style={{
            background: 'rgba(212,137,58,0.07)',
            border: '1px solid rgba(212,137,58,0.18)',
          }}
        >
          <div className="flex flex-col">
            <span className="font-display font-bold text-3xl leading-none" style={{ color: '#D4893A' }}>
              4,7
            </span>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill={s <= 4 ? '#D4893A' : 'none'}>
                  <path
                    d="M6 1l1.3 2.6L10 4l-2 2 .5 2.8L6 7.5 3.5 8.8 4 6 2 4l2.7-.4L6 1z"
                    fill={s <= 4 ? '#D4893A' : 'none'}
                    stroke="#D4893A"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className="h-8 w-px" style={{ background: 'rgba(212,137,58,0.2)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#FAF0DC' }}>199 reseñas en Google</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.38)' }}>Cafetería · 1–10 € por persona</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[11px]" style={{ color: 'rgba(250,240,220,0.25)' }}>
            © {new Date().getFullYear()} Café &amp; Tortilla Montes · San Agustín de Guadalix
          </p>
          <div className="flex items-center gap-4">
            {encargosActivo && (
              <a
                href="/encargo"
                className="text-[11px] transition-opacity hover:opacity-70"
                style={{ color: 'rgba(212,137,58,0.65)' }}
              >
                Encargos
              </a>
            )}
            <p className="text-[11px]" style={{ color: 'rgba(250,240,220,0.18)' }}>
              Hecho con cariño 🥚
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Subcomponentes ─────────────────────────────────────────────────────── */

function InfoItem({
  icon, label, value, sub, href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0" style={{ color: '#D4893A' }}>{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(250,240,220,0.35)' }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: '#FAF0DC' }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.40)' }}>{sub}</p>}
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    )
  }
  return <div>{content}</div>
}

function Chip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: ok ? 'rgba(212,137,58,0.10)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${ok ? 'rgba(212,137,58,0.25)' : 'rgba(255,255,255,0.08)'}`,
        color: ok ? '#EAB85A' : 'rgba(250,240,220,0.28)',
      }}
    >
      <span>{ok ? '✓' : '✗'}</span>
      {label}
    </span>
  )
}
