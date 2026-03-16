import { type NextRequest, NextResponse } from 'next/server'
import { getStockDia } from '@/lib/kv'
import { MAX_TORTILLAS_DIA } from '@/lib/kv'
import { getDiasDisponibles } from '@/lib/horario'
import { getCupon } from '@/lib/kv'

export const runtime = 'edge'

// GET /api/stock/[fecha]?cupon=XXXX
// GET /api/stock/semana?cupon=XXXX  → stock de todos los días de la ventana
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sabor: string }> }
) {
  const { sabor: segmento } = await params
  const { searchParams } = new URL(request.url)
  const codigoCupon = searchParams.get('cupon')

  // Validar cupón si se pasa
  let conCupon = false
  if (codigoCupon) {
    const cupon = await getCupon(codigoCupon)
    conCupon = !!(cupon?.activo)
  }

  const headers = {
    'Cache-Control': 's-maxage=10, stale-while-revalidate=5',
  }

  // GET /api/stock/semana → devuelve el stock de toda la ventana disponible
  if (segmento === 'semana') {
    const fechas = getDiasDisponibles(conCupon)
    const stockMap: Record<string, { disponible: number; total: number; completo: boolean }> = {}

    await Promise.all(
      fechas.map(async (fecha) => {
        const disponible = await getStockDia(fecha)
        stockMap[fecha] = {
          disponible,
          total: MAX_TORTILLAS_DIA,
          completo: disponible === 0,
        }
      })
    )

    return NextResponse.json({ fechas, stock: stockMap }, { headers })
  }

  // GET /api/stock/[fecha] → stock de un día concreto
  const fecha = segmento
  const disponible = await getStockDia(fecha)

  return NextResponse.json(
    {
      fecha,
      disponible,
      total: MAX_TORTILLAS_DIA,
      completo: disponible === 0,
    },
    { headers }
  )
}
