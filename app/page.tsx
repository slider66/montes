import { getSabores, getStockDiario } from '@/lib/edge-config'
import { getStockTodos } from '@/lib/kv'
import { getDiasDisponibles, getEstadoHorario } from '@/lib/horario'
import { TortillaCard } from '@/components/ui/TortillaCard'
import { HorarioAlert } from '@/components/ui/HorarioAlert'

// Revalidar cada 30 segundos
export const revalidate = 30

export default async function HomePage() {
  const [sabores, stockDiario] = await Promise.all([getSabores(), getStockDiario()])
  const proximaFecha = getDiasDisponibles(1)[0]
  const stockHoy = await getStockTodos(proximaFecha, sabores.map((s) => s.id))
  const estado = getEstadoHorario()

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-amber-600 text-white px-4 py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Montes</h1>
        <p className="text-amber-100 text-lg">
          La mejor tortilla de San Agustín de Guadalix
        </p>
        <p className="mt-2 text-amber-200 text-sm">
          Lunes a Domingo · 07:00 – 14:00
        </p>
      </section>

      {/* Alerta de horario */}
      <HorarioAlert estado={estado} />

      {/* Catálogo */}
      <section className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6 text-stone-700">
          Tortillas disponibles · {proximaFecha}
        </h2>

        <div className="grid gap-4">
          {sabores.map((sabor) => {
            const disponible =
              stockHoy[sabor.id] === -1
                ? stockDiario
                : (stockHoy[sabor.id] ?? stockDiario)

            return (
              <TortillaCard
                key={sabor.id}
                sabor={sabor}
                disponible={disponible}
                total={stockDiario}
                abierto={estado.abierto}
              />
            )
          })}
        </div>
      </section>
    </main>
  )
}
