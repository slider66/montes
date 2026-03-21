import Link from 'next/link'

// ─── Ajusta estos valores antes de la reunión ─────────────────────────────────
const PRECIO_DESARROLLO  = 1_800   // € coste de desarrollo
const PRECIO_AGENCIA_REF = 5_000   // € precio medio en agencia digital
const PRECIO_MANTENIMIENTO = 80    // € / mes (opcional, soporte + actualizaciones)
// ─────────────────────────────────────────────────────────────────────────────

export default function PropuestaPage() {
  return (
    <main
      className="min-h-screen py-16 px-5"
      style={{ background: '#1A0E05', color: '#FAF0DC', fontFamily: 'var(--font-dm-sans)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ── Volver ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs mb-10 opacity-50 hover:opacity-80 transition-opacity"
          style={{ color: '#EAB85A' }}
        >
          ← Volver al sitio
        </Link>

        {/* ── Cabecera ── */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(234,184,90,0.6)' }}>
            Propuesta comercial · Café &amp; Tortilla Montes
          </p>
          <h1
            className="font-display font-black italic leading-none mb-4"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5rem)',
              background: 'linear-gradient(135deg, #F2D06E 0%, #D4893A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Tu web ya existe.
          </h1>
          <p className="text-lg" style={{ color: 'rgba(250,240,220,0.65)' }}>
            Solo falta publicarla. Todo lo que ves aquí está construido, probado y listo para salir hoy mismo.
          </p>
        </div>

        {/* ── Sección 1: Qué incluye ── */}
        <Section titulo="Lo que ya tienes" subtitulo="Construido, probado y funcionando">
          <div className="grid gap-2">
            {FEATURES.map((f) => (
              <FeatureRow key={f.label} emoji={f.emoji} label={f.label} desc={f.desc} />
            ))}
          </div>
        </Section>

        {/* ── Sección 2: Qué vas a conseguir ── */}
        <Section titulo="Lo que vas a conseguir" subtitulo="Impacto real desde el primer día">
          <div className="grid sm:grid-cols-2 gap-3">
            {BENEFICIOS.map((b) => (
              <BeneficioCard key={b.titulo} emoji={b.emoji} titulo={b.titulo} desc={b.desc} />
            ))}
          </div>
        </Section>

        {/* ── Sección 3: Costes recurrentes ── */}
        <Section titulo="Costes de mantenimiento" subtitulo="Sin sorpresas — pagas solo lo que usas">
          <div className="grid gap-3">
            {COSTES.map((c) => (
              <CosteRow key={c.concepto} concepto={c.concepto} precio={c.precio} nota={c.nota} highlight={c.highlight} />
            ))}
            <div
              className="rounded-xl p-4 mt-2"
              style={{ background: 'rgba(212,137,58,0.08)', border: '1px solid rgba(212,137,58,0.22)' }}
            >
              <p className="text-sm" style={{ color: 'rgba(250,240,220,0.55)' }}>
                💡 <strong style={{ color: '#EAB85A' }}>Para empezar</strong>, el plan gratuito de Vercel es suficiente.
                Si el tráfico crece o necesitas garantías de disponibilidad, se salta al Pro en 5 minutos.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Sección 4: Inversión ── */}
        <Section titulo="Inversión" subtitulo="Lo que cuesta tu nueva presencia digital">
          <div className="grid gap-4">

            {/* Precio desarrollo */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(212,137,58,0.07)', border: '1px solid rgba(212,137,58,0.28)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(234,184,90,0.55)' }}>
                    Desarrollo completo
                  </p>
                  <p className="font-display font-black italic text-4xl" style={{ color: '#EAB85A' }}>
                    {PRECIO_DESARROLLO.toLocaleString('es-ES')} €
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(250,240,220,0.40)' }}>
                    Pago único · IVA no incluido
                  </p>
                </div>
                <div
                  className="text-right shrink-0 px-3 py-1.5 rounded-full text-xs"
                  style={{ background: 'rgba(212,137,58,0.12)', border: '1px solid rgba(212,137,58,0.25)', color: 'rgba(234,184,90,0.7)' }}
                >
                  vs {PRECIO_AGENCIA_REF.toLocaleString('es-ES')} € en agencia
                </div>
              </div>
              <ul className="space-y-1.5">
                {INCLUIDO.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(250,240,220,0.70)' }}>
                    <span style={{ color: '#DFA855' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mantenimiento opcional */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(26,14,5,0.6)', border: '1px solid rgba(196,120,50,0.14)' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(234,184,90,0.45)' }}>
                    Mantenimiento mensual · Opcional
                  </p>
                  <p className="font-display font-black italic text-2xl" style={{ color: 'rgba(234,184,90,0.75)' }}>
                    {PRECIO_MANTENIMIENTO} € / mes
                  </p>
                </div>
              </div>
              <p className="text-xs mt-3" style={{ color: 'rgba(250,240,220,0.40)' }}>
                Incluye: actualizaciones de contenido (carta, precios, sabores), soporte técnico prioritario, copias de seguridad de datos y mejoras menores.
              </p>
            </div>

          </div>
        </Section>

        {/* ── CTA final ── */}
        <div
          className="rounded-2xl p-8 text-center mt-4"
          style={{ background: 'linear-gradient(135deg, rgba(212,137,58,0.12) 0%, rgba(61,28,0,0.4) 100%)', border: '1px solid rgba(212,137,58,0.25)' }}
        >
          <p className="font-display font-black italic text-3xl mb-2" style={{ color: '#FAF0DC' }}>
            ¿Lo publicamos hoy?
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(250,240,220,0.55)' }}>
            El dominio, el hosting y el primer mes corren de mi cuenta. Tú solo decides cuándo quieres aparecer en Google.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #EAB85A 0%, #C47832 100%)',
              color: '#1A0E05',
              boxShadow: '0 4px 24px rgba(212,137,58,0.35)',
            }}
          >
            Ver el sitio en directo
          </Link>
        </div>

        {/* ── Footer propuesta ── */}
        <p className="text-center text-xs mt-10 opacity-30">
          Propuesta válida durante 30 días · Elaborada a medida para Café &amp; Tortilla Montes
        </p>

      </div>
    </main>
  )
}

// ─── Datos ────────────────────────────────────────────────────────────────────

const FEATURES = [
  { emoji: '🌟', label: 'Landing profesional con Hero animado',       desc: 'Primera impresión de marca premium. Logo, nombre, stats en tiempo real.' },
  { emoji: '🥚', label: 'Catálogo de tortillas con fotos reales',      desc: 'Cada sabor con imagen WebP, descripción y precio. Actualizable sin tocar código.' },
  { emoji: '📅', label: 'Reservas online con stock en tiempo real',     desc: 'Máximo 8 tortillas al día. Stock atómico — nunca se sobrevende.' },
  { emoji: '📦', label: 'Sistema de encargos grandes (wizard 4 pasos)', desc: 'Tortillas, complementos, bebidas. Fecha, hora y datos de contacto validados.' },
  { emoji: '📧', label: 'Emails automáticos de confirmación',           desc: 'Al cliente y al negocio. Con tabla de pedido, dirección y referencia.' },
  { emoji: '📆', label: 'Descarga de evento en calendario (.ics)',      desc: 'El cliente añade la recogida a su móvil en un clic.' },
  { emoji: '💬', label: 'Enlace directo a WhatsApp',                   desc: 'Desde la confirmación, con el pedido ya redactado.' },
  { emoji: '🍂', label: 'Productos de temporada automáticos',          desc: 'Las torrijas aparecen solas en Semana Santa y desaparecen sin intervención.' },
  { emoji: '🗺️', label: 'Mapa Google Maps integrado',                  desc: 'Estilo oscuro a medida, pin dorado, enlace directo a navegación.' },
  { emoji: '⭐', label: 'CTA para dejar reseña en Google',             desc: 'Un clic lleva al cliente al formulario de reseña. Más reseñas = mejor posición.' },
  { emoji: '🔍', label: 'SEO local completo',                          desc: 'Geo tags, schema LocalBusiness, Open Graph, Twitter Card. Listo para indexar.' },
  { emoji: '⚡', label: 'Velocidad de carga extrema',                  desc: 'Edge Runtime, imágenes WebP, caché estático. Carga en menos de 1 segundo.' },
  { emoji: '📱', label: 'Responsive — móvil y escritorio',             desc: 'Diseño adaptado a cualquier pantalla. El 80% de tus clientes entran desde el móvil.' },
  { emoji: '🔀', label: 'Activación de funciones sin redeploy',        desc: 'Encargos on/off en 5 segundos desde el panel. Sin tocar código.' },
]

const BENEFICIOS = [
  { emoji: '📞', titulo: 'Menos llamadas al local',      desc: 'Los pedidos llegan por web. Tú te concentras en cocinar.' },
  { emoji: '🌐', titulo: 'Visible en Google las 24h',    desc: 'Cuando alguien busca "tortilla San Agustín de Guadalix" tu web aparece.' },
  { emoji: '⭐', titulo: 'Más reseñas en Google',        desc: 'El CTA directo en el footer convierte clientes satisfechos en reseñadores.' },
  { emoji: '✅', titulo: 'Pedidos sin errores',          desc: 'Todo queda por escrito. El cliente confirma y tú tienes la referencia.' },
  { emoji: '🕐', titulo: 'Disponible cuando estás cerrado', desc: 'Los encargos se hacen a cualquier hora. Tú los preparas cuando abres.' },
  { emoji: '💼', titulo: 'Imagen de marca premium',      desc: 'Una web así diferencia a Montes de cualquier competencia local.' },
]

const COSTES = [
  { concepto: 'Vercel Hobby (hosting)',    precio: 'Gratis',      nota: 'Hasta ~10.000 visitas/mes. Suficiente para empezar.',           highlight: true },
  { concepto: 'Vercel Pro (si crece)',     precio: '20 $/mes',    nota: '~18 €/mes. SLA 99.99%, soporte prioritario, más recursos.',     highlight: false },
  { concepto: 'Dominio .es',              precio: '~12 €/año',   nota: 'cafetortillamontes.es o similar. Renovación anual.',            highlight: false },
  { concepto: 'Resend (emails)',           precio: 'Gratis',      nota: 'Hasta 3.000 emails/mes. Más que suficiente.',                  highlight: true },
  { concepto: 'Vercel KV (base de datos)', precio: 'Gratis',     nota: '30 MB · 30.000 peticiones/mes. Cubre el stock de tortillas.',   highlight: true },
]

const INCLUIDO = [
  'Diseño y desarrollo completo desde cero',
  'Sistema de reservas + encargos + emails automáticos',
  'SEO local configurado y listo para indexar',
  'Integración Google Maps y reseñas',
  'Imágenes optimizadas (WebP) y configuración de dominio',
  '1 mes de soporte post-lanzamiento incluido',
  'Panel de control para activar/desactivar funciones sin ayuda técnica',
]

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Section({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: 'rgba(234,184,90,0.5)' }}>
          {subtitulo}
        </p>
        <h2 className="font-display font-black italic text-3xl" style={{ color: '#FAF0DC' }}>
          {titulo}
        </h2>
      </div>
      {children}
    </div>
  )
}

function FeatureRow({ emoji, label, desc }: { emoji: string; label: string; desc: string }) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ border: '1px solid rgba(196,120,50,0.10)', background: 'rgba(26,14,5,0.4)' }}
    >
      <span className="text-lg shrink-0 mt-0.5">{emoji}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.42)' }}>{desc}</p>
      </div>
    </div>
  )
}

function BeneficioCard({ emoji, titulo, desc }: { emoji: string; titulo: string; desc: string }) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{ background: 'rgba(212,137,58,0.06)', border: '1px solid rgba(212,137,58,0.14)' }}
    >
      <p className="text-2xl mb-2">{emoji}</p>
      <p className="font-bold text-sm mb-1" style={{ color: '#FAF0DC' }}>{titulo}</p>
      <p className="text-xs" style={{ color: 'rgba(250,240,220,0.45)' }}>{desc}</p>
    </div>
  )
}

function CosteRow({ concepto, precio, nota, highlight }: { concepto: string; precio: string; nota: string; highlight: boolean }) {
  return (
    <div
      className="flex items-start justify-between gap-4 p-4 rounded-xl"
      style={{
        background: highlight ? 'rgba(212,137,58,0.06)' : 'rgba(26,14,5,0.4)',
        border: `1px solid ${highlight ? 'rgba(212,137,58,0.18)' : 'rgba(196,120,50,0.10)'}`,
      }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>{concepto}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.40)' }}>{nota}</p>
      </div>
      <span
        className="shrink-0 text-sm font-bold tabular-nums"
        style={{ color: highlight ? '#DFA855' : 'rgba(250,240,220,0.55)' }}
      >
        {precio}
      </span>
    </div>
  )
}
