import { type NextRequest, NextResponse } from 'next/server'
import { getStock, getStockTodos } from '@/lib/kv'
import { getSabores, getStockDiario } from '@/lib/edge-config'
import { getDiasDisponibles } from '@/lib/horario'

export const runtime = 'edge'

// GET /api/stock/[sabor]?fecha=2026-03-20
// GET /api/stock/todos?fecha=2026-03-20
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sabor: string }> }
) {
  const { sabor } = await params
  const { searchParams } = new URL(_request.url)
  const fecha = searchParams.get('fecha') ?? getDiasDisponibles(1)[0]

  if (sabor === 'todos') {
    const sabores = await getSabores()
    const stockTotal = await getStockDiario()
    const stockMap = await getStockTodos(fecha, sabores.map((s) => s.id))

    // Inicializa a stockTotal los sabores sin valor en KV
    const resultado = Object.fromEntries(
      sabores.map((s) => [
        s.id,
        {
          disponible: stockMap[s.id] === -1 ? stockTotal : (stockMap[s.id] ?? stockTotal),
          total: stockTotal,
        },
      ])
    )

    return NextResponse.json(
      { fecha, stock: resultado },
      {
        headers: {
          // Revalidar cada 10 segundos en el Edge
          'Cache-Control': 's-maxage=10, stale-while-revalidate=5',
        },
      }
    )
  }

  const stockTotal = await getStockDiario()
  const disponible = await getStock(fecha, sabor)

  return NextResponse.json(
    {
      sabor,
      fecha,
      disponible: disponible === -1 ? stockTotal : disponible,
      total: stockTotal,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=5',
      },
    }
  )
}
