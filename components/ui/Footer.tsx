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
            src="/logo.png"
            alt="Café & Tortilla Montes"
            width={56}
            height={56}
            unoptimized
            className="rounded-xl"
            style={{ filter: 'drop-shadow(0 0 12px rgba(212,137,58,0.35))' }}
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

        {/* Info + Mapa */}
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

          {/* Columna derecha — mapa */}
          <a
            href="https://maps.app.goo.gl/QHTq71Unv4gcpj6b9"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden group"
            style={{ border: '1px solid rgba(212,137,58,0.18)', minHeight: 220 }}
            aria-label="Ver ubicación en Google Maps"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d800!2d-3.6188079222245966!3d40.67792493969806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd43d197e8f5f68f%3A0x48b5f64482687d4b!2sCAF%C3%89%20Y%20TORTILLA%20MONTES!5e0!3m2!1ses!2ses!4v1774076479941!5m2!1ses!2ses&maptype=roadmap"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                border: 'none',
                filter: 'invert(1) hue-rotate(180deg) saturate(0.55) sepia(0.25) brightness(0.82)',
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Café & Tortilla Montes"
            />
            {/* Pin dorado — tip anclado al centro exacto del iframe */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Blur para tapar el pin de Google */}
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

        {/* Rating */}
        <a
          href="https://www.google.com/maps/place/CAF%C3%89+Y+TORTILLA+MONTES/@40.6779209,-3.616233,17z/data=!4m8!3m7!1s0xd43d197e8f5f68f:0x48b5f64482687d4b!8m2!3d40.6779209!4d-3.616233!9m1!1b1!16s%2Fg%2F11gr63kts5"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-2xl mb-10 group transition-colors"
          style={{
            background: 'rgba(212,137,58,0.07)',
            border: '1px solid rgba(212,137,58,0.18)',
          }}
        >
          <div className="flex flex-col shrink-0">
            <span className="font-display font-bold text-3xl leading-none" style={{ color: '#D4893A' }}>
              4,7
            </span>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="12" height="12" viewBox="0 0 12 12">
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
          <div className="h-8 w-px shrink-0" style={{ background: 'rgba(212,137,58,0.2)' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: '#FAF0DC' }}>199 reseñas en Google</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.38)' }}>Cafetería · 1–10 € por persona</p>
          </div>
          <span
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors group-hover:bg-[rgba(212,137,58,0.25)]"
            style={{
              background: 'rgba(212,137,58,0.10)',
              border: '1px solid rgba(212,137,58,0.28)',
              color: '#EAB85A',
            }}
          >
            Deja tu reseña ↗
          </span>
        </a>

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
