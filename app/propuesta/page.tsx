import Link from 'next/link'

// ─── Ajusta estos valores antes de la reunión ─────────────────────────────────
const PRECIO_FASE1          = 450   // € Landing
const PRECIO_FASE2_ADD      = 150   // € añadido por encargos
const PRECIO_FASE3_ADD      = 100   // € añadido por emails
const PRECIO_MANTENIMIENTO  = 80    // € / mes opcional
const SESIONES_INCLUIDAS    = 2     // sesiones de modificaciones gratuitas
const HORAS_POR_SESION      = 2     // horas por sesión
const PRECIO_MOD_EXTRA      = 50    // € por modificación adicional

// Precios promocionales (precio de lanzamiento — primer proyecto)
const PROMO_FASE1  = 390
const PROMO_FASE2  = 490
const PROMO_FASE3  = 570
// ─────────────────────────────────────────────────────────────────────────────

const FASE2 = PRECIO_FASE1 + PRECIO_FASE2_ADD
const FASE3 = FASE2 + PRECIO_FASE3_ADD

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
            Solo falta publicarla. Elige el plan que mejor se adapta a lo que necesitas ahora — y ampliás cuando quieras.
          </p>
        </div>

        {/* ── Planes ── */}
        <Section titulo="Elige tu plan" subtitulo="Paga solo por lo que necesitas hoy">

          {/* Banner promo */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
            style={{ background: 'rgba(212,137,58,0.10)', border: '1px solid rgba(212,137,58,0.28)' }}
          >
            <span className="text-lg">🎁</span>
            <p className="text-sm" style={{ color: '#EAB85A' }}>
              <strong>Precio especial de lanzamiento</strong>
              <span style={{ color: 'rgba(250,240,220,0.55)' }}> · Válido solo para este primer proyecto</span>
            </p>
          </div>

          <div className="grid gap-4">

            {/* Fase 1 */}
            <PlanCard
              fase="Fase 1"
              titulo="Solo la Landing"
              descripcion="Tu negocio en internet. Presencia profesional, catálogo completo y SEO local optimizado."
              precio={PRECIO_FASE1}
              promo={PROMO_FASE1}
              destacado={false}
              incluye={[
                'Página principal con Hero animado y logo',
                'Catálogo completo de tortillas con fotos',
                'Sección carta (croquetas, bollería, pan, bebidas)',
                'Mapa Google Maps integrado',
                'CTA reseñas Google + WhatsApp',
                'SEO local completo (geo tags, JSON-LD, OG)',
                'Diseño responsive móvil y escritorio',
                'Velocidad de carga < 1 segundo',
              ]}
            />

            {/* Fase 2 */}
            <PlanCard
              fase="Fase 2"
              titulo="Landing + Encargos"
              descripcion="Tus clientes hacen pedidos grandes directamente desde la web, con fecha y hora de recogida."
              precio={FASE2}
              promo={PROMO_FASE2}
              destacado={false}
              incluye={[
                'Todo lo de la Fase 1',
                'Wizard de encargos en 4 pasos',
                'Selección de tortillas, complementos y bebidas',
                'Validación de 48h de antelación',
                'Elección de fecha y franja horaria de recogida',
                'Activación/desactivación sin redeploy (< 5 seg)',
                'Torrijas automáticas en Semana Santa',
              ]}
            />

            {/* Fase 3 — recomendada */}
            <PlanCard
              fase="Fase 3"
              titulo="Completa — con Emails"
              descripcion="La experiencia completa: el cliente recibe confirmación automática, evento en su calendario y enlace a WhatsApp."
              precio={FASE3}
              promo={PROMO_FASE3}
              destacado={true}
              incluye={[
                'Todo lo de las Fases 1 y 2',
                'Email automático al cliente con resumen del pedido',
                'Email automático al negocio con cada encargo',
                'Descarga de evento en calendario (.ics)',
                'Enlace directo a WhatsApp con el pedido redactado',
                'Sin llamadas, sin errores, sin papel',
              ]}
            />

          </div>
        </Section>

        {/* ── Incluido en todos ── */}
        <Section titulo="Incluido en todos los planes" subtitulo="Sin costes ocultos">
          <div className="grid gap-3">
            <GarantiaRow
              emoji="🛠️"
              titulo={`${SESIONES_INCLUIDAS} sesiones de ${HORAS_POR_SESION}h de modificaciones`}
              desc={`Después de entregar la web, tienes ${SESIONES_INCLUIDAS} sesiones gratuitas de ${HORAS_POR_SESION} horas cada una para ajustar textos, precios, fotos o cualquier detalle.`}
            />
            <GarantiaRow
              emoji="➕"
              titulo={`Modificaciones adicionales a ${PRECIO_MOD_EXTRA} €/modificación`}
              desc="Una vez consumidas las sesiones incluidas, cualquier cambio adicional se factura a precio fijo por modificación. Sin sorpresas."
            />
            <GarantiaRow
              emoji="🔐"
              titulo="El código es tuyo"
              desc="Recibes acceso completo al repositorio. No dependes de ningún proveedor ni plataforma propietaria."
            />
            <GarantiaRow
              emoji="🚀"
              titulo="Publicación incluida"
              desc="Me encargo de configurar el dominio, el hosting y dejarlo todo funcionando en producción."
            />
          </div>
        </Section>

        {/* ── Costes recurrentes ── */}
        <Section titulo="Costes de mantenimiento" subtitulo="Lo que pagas mensual o anualmente">
          <div className="grid gap-3">
            {COSTES.map((c) => (
              <CosteRow key={c.concepto} {...c} />
            ))}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(212,137,58,0.07)', border: '1px solid rgba(212,137,58,0.18)' }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: '#EAB85A' }}>
                💡 Coste real para empezar: entre 5 y 12 €/año
              </p>
              <p className="text-xs" style={{ color: 'rgba(250,240,220,0.50)' }}>
                El hosting es gratuito. Buscamos el dominio más económico disponible. Si el negocio crece y necesitas más capacidad, se escala en minutos sin cambiar nada más.
              </p>
            </div>

            {/* Stripe add-on */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(26,14,5,0.6)', border: '1px solid rgba(99,91,255,0.25)' }}
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <StripeLogoSVG />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#FAF0DC' }}>Integración con Stripe</p>
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(99,91,255,0.7)' }}>Add-on opcional</p>
                  </div>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: 'rgba(250,240,220,0.55)' }}>+200 €</span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'rgba(250,240,220,0.50)' }}>
                Cobra los encargos online directamente desde la web. Tarjeta, Bizum y Apple Pay. Integración completa incluida.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Visa / Mastercard', 'Apple Pay', 'Google Pay', 'Bizum'].map((m) => (
                  <span key={m} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,91,255,0.12)', border: '1px solid rgba(99,91,255,0.25)', color: 'rgba(180,175,255,0.8)' }}>{m}</span>
                ))}
              </div>
              <div
                className="px-3 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(255,150,50,0.07)', border: '1px solid rgba(255,150,50,0.18)', color: 'rgba(250,210,150,0.60)' }}
              >
                ⚠️ Stripe cobra sus propias comisiones por transacción (~1,5 % + 0,25 € en Europa), ajenas a este presupuesto.
              </div>
            </div>

            {/* Mantenimiento opcional */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(26,14,5,0.6)', border: '1px solid rgba(196,120,50,0.12)' }}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#FAF0DC' }}>Mantenimiento mensual · Opcional</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(250,240,220,0.42)' }}>
                    Actualizaciones de carta y precios, soporte técnico, mejoras menores y copias de seguridad.
                  </p>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: 'rgba(234,184,90,0.7)' }}>
                  {PRECIO_MANTENIMIENTO} €/mes
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Qué vas a conseguir ── */}
        <Section titulo="Lo que cambia en tu día a día" subtitulo="Impacto real desde el primer día">
          <div className="grid sm:grid-cols-2 gap-3">
            {BENEFICIOS.map((b) => (
              <BeneficioCard key={b.titulo} {...b} />
            ))}
          </div>
        </Section>

        {/* ── Mes de prueba ── */}
        <div
          className="rounded-2xl p-6 mb-12"
          style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.22)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-bold text-sm" style={{ color: '#4ade80' }}>1 mes de prueba gratuita</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(74,222,128,0.55)' }}>Sin compromisos · Sin letra pequeña</p>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'rgba(250,240,220,0.60)' }}>
            Una vez entregada la web, tienes <strong style={{ color: '#FAF0DC' }}>30 días completos para probarla</strong> con clientes reales, detectar cualquier fallo y pedir los ajustes que necesites — todo incluido, sin coste adicional. Solo pagas si estás satisfecho con el resultado.
          </p>
        </div>

        {/* ── Canales de contacto ── */}
        <Section titulo="Cómo llegan los pedidos" subtitulo="Tú eliges el canal">
          <div className="grid gap-3">
            <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.2)' }}>
              <span className="text-2xl shrink-0">💬</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>WhatsApp directo</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.50)' }}>
                  La web puede generar un enlace directo a WhatsApp con el pedido ya redactado. El cliente hace clic y te llega el encargo en un mensaje listo para confirmar. Sin apps intermedias, sin plataformas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(212,137,58,0.06)', border: '1px solid rgba(212,137,58,0.14)' }}>
              <span className="text-2xl shrink-0">📞</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>Llamada con un clic</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.50)' }}>
                  El teléfono del negocio aparece visible y clicable en toda la web. En móvil, un toque inicia la llamada directamente. Ideal para clientes que prefieren hablar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(66,133,244,0.07)', border: '1px solid rgba(66,133,244,0.2)' }}>
              <span className="text-2xl shrink-0">📧</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>Email automático (Fase 3)</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.50)' }}>
                  Con la Fase 3 activada, cada encargo genera dos emails automáticos: uno al cliente con el resumen del pedido y uno al negocio con todos los datos. Sin tocar nada, sin perderse ningún encargo.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Escalabilidad ── */}
        <Section titulo="Preparada para crecer" subtitulo="Sin límites técnicos">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: '📦', titulo: 'Nuevos productos', desc: 'Añadir productos a la carta o al catálogo de encargos es cuestión de minutos.' },
              { icon: '🗓️', titulo: 'Reservas de mesa', desc: 'Si en el futuro queréis gestionar reservas de mesa, la arquitectura ya lo soporta.' },
              { icon: '📊', titulo: 'Panel de gestión', desc: 'Se puede añadir un panel interno para ver pedidos, stock y estadísticas sin tocar código.' },
              { icon: '🌍', titulo: 'Más idiomas', desc: 'La web puede traducirse al inglés u otros idiomas si Montes crece en audiencia.' },
              { icon: '💳', titulo: 'Pagos online', desc: 'Stripe se integra en cualquier momento sobre la infraestructura existente, sin rehacer nada.' },
              { icon: '📱', titulo: 'App móvil', desc: 'Si un día hace falta una app nativa, el backend que ya existe sirve de base directamente.' },
            ].map((item) => (
              <div key={item.titulo} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(212,137,58,0.05)', border: '1px solid rgba(212,137,58,0.10)' }}>
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>{item.titulo}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.42)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-4 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(212,137,58,0.08)', border: '1px solid rgba(212,137,58,0.18)', color: 'rgba(250,240,220,0.60)' }}
          >
            🧱 Construida sobre <strong style={{ color: '#EAB85A' }}>Next.js + Vercel</strong> — la misma infraestructura que usan empresas como Airbnb, GitHub y OpenAI. Escala desde 0 hasta millones de visitas sin cambiar de plataforma.
          </div>
        </Section>

        {/* ── CTA final ── */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(212,137,58,0.12) 0%, rgba(61,28,0,0.4) 100%)', border: '1px solid rgba(212,137,58,0.25)' }}
        >
          <p className="font-display font-black italic text-3xl mb-2" style={{ color: '#FAF0DC' }}>
            ¿Lo publicamos hoy?
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(250,240,220,0.55)' }}>
            La web ya está hecha. Elegís plan, acordamos el precio y en menos de 24h estáis en internet.
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

        <p className="text-center text-xs mt-10 opacity-25">
          Propuesta válida 30 días · Elaborada a medida para Café &amp; Tortilla Montes
        </p>

      </div>
    </main>
  )
}

// ─── Datos ────────────────────────────────────────────────────────────────────

const COSTES = [
  { concepto: 'Hosting',                  precio: 'Gratis',       nota: 'Vercel Hobby — hasta ~10.000 visitas/mes. Más que suficiente para un negocio local.',  highlight: true },
  { concepto: 'Dominio .es',              precio: '5 – 12 €/año', nota: 'cafetortillamontes.es o similar. Buscamos la mejor opción disponible.',                highlight: false },
  { concepto: 'Emails transaccionales',   precio: 'Gratis',       nota: 'Hasta 3.000 emails/mes. Cubre todos los encargos y confirmaciones.',                  highlight: true },
  { concepto: 'Base de datos (stock)',     precio: 'Gratis',       nota: 'Incluido en Vercel — gestión de stock y reservas en tiempo real.',                   highlight: true },
]

const BENEFICIOS = [
  { emoji: '📞', titulo: 'Menos llamadas',           desc: 'Los pedidos llegan solos. Tú te concentras en cocinar.' },
  { emoji: '🌐', titulo: 'Visible en Google 24h',    desc: '"Tortilla San Agustín de Guadalix" — apareces tú.', badge: 'google-search' },
  { emoji: '⭐', titulo: 'Más reseñas en Google',    desc: 'El CTA directo convierte clientes en reseñadores con un clic.', badge: 'stars' },
  { emoji: '✅', titulo: 'Pedidos sin errores',      desc: 'Todo por escrito. Sin malentendidos al teléfono.' },
  { emoji: '🕐', titulo: 'Pedidos fuera de horario', desc: 'Los encargos se hacen cuando el cliente quiere.' },
  { emoji: '💼', titulo: 'Imagen premium',           desc: 'Una web así diferencia a Montes de cualquier competencia local.' },
]

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Section({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: 'rgba(234,184,90,0.5)' }}>{subtitulo}</p>
        <h2 className="font-display font-black italic text-3xl" style={{ color: '#FAF0DC' }}>{titulo}</h2>
      </div>
      {children}
    </div>
  )
}

function PlanCard({
  fase, titulo, descripcion, precio, promo, destacado, incluye,
}: {
  fase: string; titulo: string; descripcion: string
  precio: number; promo: number; destacado: boolean; incluye: string[]
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: destacado ? 'rgba(212,137,58,0.09)' : 'rgba(26,14,5,0.5)',
        border: `1px solid ${destacado ? 'rgba(212,137,58,0.38)' : 'rgba(196,120,50,0.14)'}`,
      }}
    >
      {destacado && (
        <div
          className="px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest"
          style={{ background: 'rgba(212,137,58,0.18)', color: '#EAB85A' }}
        >
          ⭐ Recomendado — Experiencia completa
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(234,184,90,0.55)' }}>{fase}</p>
            <h3 className="font-bold text-lg leading-snug" style={{ color: '#FAF0DC' }}>{titulo}</h3>
            <p className="text-xs mt-1" style={{ color: 'rgba(250,240,220,0.45)' }}>{descripcion}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs line-through" style={{ color: 'rgba(250,240,220,0.28)' }}>{precio} €</p>
            <p className="font-display font-black italic text-3xl leading-none" style={{ color: destacado ? '#EAB85A' : '#DFA855' }}>
              {promo} €
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(234,184,90,0.45)' }}>precio especial</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {incluye.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(250,240,220,0.65)' }}>
              <span style={{ color: '#DFA855' }}>✓</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function GarantiaRow({ emoji, titulo, desc }: { emoji: string; titulo: string; desc: string }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ border: '1px solid rgba(196,120,50,0.12)', background: 'rgba(26,14,5,0.4)' }}
    >
      <span className="text-xl shrink-0">{emoji}</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#FAF0DC' }}>{titulo}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(250,240,220,0.42)' }}>{desc}</p>
      </div>
    </div>
  )
}

function BeneficioCard({ emoji, titulo, desc, badge }: { emoji: string; titulo: string; desc: string; badge?: string }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: 'rgba(212,137,58,0.06)', border: '1px solid rgba(212,137,58,0.12)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-2xl">{emoji}</p>
        {badge === 'stars' && (
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l1.3 2.6L10 4l-2 2 .5 2.8L6 7.5 3.5 8.8 4 6 2 4l2.7-.4L6 1z" fill="#DFA855" stroke="#DFA855" strokeWidth="0.5"/></svg>
            ))}
          </div>
        )}
        {badge === 'google-search' && <GoogleLogoSVG />}
      </div>
      <p className="font-bold text-sm mb-1" style={{ color: '#FAF0DC' }}>{titulo}</p>
      <p className="text-xs" style={{ color: 'rgba(250,240,220,0.45)' }}>{desc}</p>
    </div>
  )
}

function StripeLogoSVG() {
  return (
    <svg width="42" height="18" viewBox="0 0 60 25" fill="none" aria-label="Stripe">
      <path d="M27.0 9.1c-1.8-.7-2.7-1.2-2.7-2 0-.7.6-1.1 1.7-1.1 2 0 4 .8 5.4 1.5l.8-4.8C30.6 2 28.5 1.5 26.1 1.5c-4.2 0-7 2.2-7 5.6 0 3.7 2.6 5 6 6.3 1.7.6 2.5 1.2 2.5 2 0 .8-.7 1.3-1.9 1.3-1.8 0-4.2-.8-6-1.8l-.8 4.8c1.7.9 4.4 1.7 7.1 1.7 4.3 0 7.2-2.1 7.2-5.6.1-3.9-2.5-5.2-6.2-6.7zm13.3-7.1l-5.6 0-5 23h5.9l5-23zm7.4 8.5c0-.8.7-1.2 1.9-1.2 1.7 0 3.8.5 5.4 1.4l.8-4.7C54.1 5 52 4.5 49.6 4.5c-4.3 0-7.1 2.3-7.1 5.9 0 5.5 7.3 4.5 7.3 6.8 0 .9-.8 1.3-2 1.3-1.9 0-4.3-.8-6.2-1.9l-.8 4.8c1.9 1 4.6 1.6 7.2 1.6 4.4 0 7.3-2.2 7.3-5.8 0-5.5-7.4-4.8-7.4-6.7zM14 4.5c-2 0-3.6.9-4.5 2.4L9.2 5H4.7L.7 28h6l1.5-9.7c.5 1.5 1.8 2.5 3.5 2.5 3.5 0 6.3-4.4 6.3-9.7C18 7.4 16.4 4.5 14 4.5zm-2.1 13.4c-.9 0-1.5-.6-1.8-1.6l.8-5.3c.4-1.6 1.4-2.7 2.4-2.7 1.2 0 1.9 1 1.9 2.7-.1 3.4-1.6 6.9-3.3 6.9z" fill="#635BFF"/>
    </svg>
  )
}

function GoogleLogoSVG() {
  return (
    <svg width="44" height="15" viewBox="0 0 272 92" fill="none" aria-label="Google">
      <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
      <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
      <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.67-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.26zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
      <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
      <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
      <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
    </svg>
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
      <span className="shrink-0 text-sm font-bold" style={{ color: highlight ? '#DFA855' : 'rgba(250,240,220,0.55)' }}>
        {precio}
      </span>
    </div>
  )
}
