import { redirect } from 'next/navigation'
import { isEncargosEnabled } from '@/lib/features'

/**
 * Página de encargos — FASE 2
 *
 * Redirige a home si el flag no está activo.
 * Para activar: Edge Config → { "featureEncargos": true }
 *
 * TODO Fase 2: sustituir el placeholder por <EncargoWizard />
 */
export default async function EncargoPage() {
  const activo = await isEncargosEnabled()
  if (!activo) redirect('/')

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#1A0E05' }}
    >
      <div className="text-center max-w-sm">
        <p
          className="text-[11px] uppercase tracking-[0.25em] font-bold mb-3"
          style={{ color: 'rgba(212,137,58,0.55)' }}
        >
          Próximamente
        </p>
        <h1
          className="font-display font-black italic text-4xl mb-4"
          style={{ color: '#FAF0DC' }}
        >
          Encargos
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(250,240,220,0.45)' }}>
          Aquí podrás hacer encargos grandes para eventos y celebraciones.
          Mientras tanto, llámanos al{' '}
          <a
            href="tel:+34633771163"
            className="underline"
            style={{ color: '#EAB85A' }}
          >
            633 77 11 63
          </a>
          .
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl"
          style={{
            background: 'rgba(196,120,50,0.15)',
            color: '#DFA855',
            border: '1px solid rgba(196,120,50,0.28)',
          }}
        >
          ← Volver al inicio
        </a>
      </div>
    </main>
  )
}
