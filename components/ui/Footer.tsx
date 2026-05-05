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
                  <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6.125a1.625 1.625 0 110-3.25 1.625 1.625 0 010 3.25z" fill="currentColor"/>
                </svg>
              }
              label="Dirección"
              value="Av. de Madrid"
              sub="San Agustín de Guadalix, Madrid"
              href="https://www.google.com/maps/search/?api=1&query=Av.+de+Madrid,+San+Agustin+de+Guadalix,+Madrid"
            />
            <div className="flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(250,240,220,0.35)' }}>
                Contacto
              </p>
              <p className="text-sm font-medium mb-1.5" style={{ color: '#FAF0DC' }}>600 36 72 17</p>
              <div className="flex gap-2">
                <a
                  href="tel:+34600367217"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  style={{ background: 'rgba(212,137,58,0.12)', border: '1px solid rgba(212,137,58,0.2)', color: '#EAB85A' }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.9.9a7.1 7.1 0 01-3.6-3.6l.9-.9a1 1 0 000-1.4l-2-2A1 1 0 003.1 3l-.6.6C1.6 4.5 2 7 4.5 9.5S11.5 14.4 12.4 13.5l.6-.6a1 1 0 00.5-1.4z"/>
                  </svg>
                  Llamar
                </a>
                <a
                  href="https://wa.me/34600367217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
                </a>
              </div>
            </div>
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

          {/* Columna derecha — mapa */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+de+Madrid,+San+Agustin+de+Guadalix,+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden group"
            style={{ border: '1px solid rgba(212,137,58,0.18)', minHeight: 220 }}
            aria-label="Ver ubicación en Google Maps"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1500!2d-3.614!3d40.677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1774076479941!5m2!1ses!2ses&maptype=roadmap"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                border: 'none',
                filter: 'invert(1) hue-rotate(180deg) saturate(0.55) sepia(0.25) brightness(0.82)',
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Mr Tortilla"
            />
            {/* Pin dorado */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute" style={{
                left: '50%', top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                width: 22, height: 22,
                background: 'rgba(26,14,5,0.9)',
                borderRadius: '50%',
                filter: 'blur(5px)',
              }} />
              <svg
                width="26" height="34" viewBox="0 0 26 34" fill="none"
                className="absolute"
                style={{ left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-100%)' }}
              >
                <path d="M13 0C5.82 0 0 5.82 0 13c0 8.667 13 21 13 21S26 21.667 26 13C26 5.82 20.18 0 13 0z" fill="#DFA855"/>
                <circle cx="13" cy="13" r="5.5" fill="#1A0E05"/>
                <circle cx="13" cy="13" r="3" fill="#EAB85A"/>
              </svg>
            </div>

            {/* CTA bottom */}
            <div
              className="absolute inset-0 flex items-end justify-end p-3"
              style={{ background: 'linear-gradient(to top, rgba(26,14,5,0.75) 0%, transparent 45%)' }}
            >
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors group-hover:bg-[rgba(212,137,58,0.25)]"
                style={{
                  background: 'rgba(212,137,58,0.12)',
                  border: '1px solid rgba(212,137,58,0.32)',
                  color: '#EAB85A',
                }}
              >
                Ver en Google Maps ↗
              </span>
            </div>
          </a>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <p className="text-[11px]" style={{ color: 'rgba(250,240,220,0.25)' }}>
              © {new Date().getFullYear()} Mr Tortilla
            </p>
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
