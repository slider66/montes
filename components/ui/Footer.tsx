import Image from 'next/image'
import { ContadorVisitas } from './ContadorVisitas'

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
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{ width: 56, height: 56, background: '#1A0E05', filter: 'drop-shadow(0 0 12px rgba(212,137,58,0.35))' }}
          >
            <Image
              src="/logo.png"
              alt="Mr Tortilla"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
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
              Mr Tortilla
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.42)' }}>
              La mejor tortilla artesanal
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 items-stretch">

          {/* Columna izquierda — datos */}
          <div className="flex flex-col gap-5 justify-center">
            <InfoItem
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.9.9a7.1 7.1 0 01-3.6-3.6l.9-.9a1 1 0 000-1.4l-2-2A1 1 0 003.1 3l-.6.6C1.6 4.5 2 7 4.5 9.5S11.5 14.4 12.4 13.5l.6-.6a1 1 0 00.5-1.4z" fill="currentColor"/>
                </svg>
              }
              label="Teléfono / WhatsApp"
              value="600 36 72 17"
              href="tel:+34600367217"
            />
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
                <Chip label="Para llevar" ok />
                <Chip label="Encargos online" ok />
                <Chip label="A domicilio" ok={false} />
              </div>
            </div>
          </div>

          {/* Columna derecha — mapa placeholder o info */}
          <div
            className="flex flex-col items-center justify-center p-8 rounded-2xl text-center"
            style={{ border: '1px solid rgba(212,137,58,0.18)', background: 'rgba(212,137,58,0.03)' }}
          >
             <p className="text-sm font-medium mb-1" style={{ color: '#FAF0DC' }}>Punto de recogida</p>
             <p className="text-xs" style={{ color: 'rgba(250,240,220,0.4)' }}>Consúltanos para conocer tu punto de recogida más cercano</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <p className="text-[11px]" style={{ color: 'rgba(250,240,220,0.25)' }}>
              © {new Date().getFullYear()} Mr Tortilla
            </p>
            <ContadorVisitas />
          </div>
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
            <a
              href="https://webpc.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] transition-opacity hover:opacity-70"
              style={{ color: 'rgba(250,240,220,0.28)' }}
            >
              Desarrollado por webpc.es
            </a>
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
