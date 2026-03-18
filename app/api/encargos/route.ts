import { type NextRequest, NextResponse } from 'next/server'
import { crearEncargo } from '@/lib/encargos'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const resultado = await crearEncargo(body)

    if (!resultado.ok) {
      const statusMap = {
        FECHA_INVALIDA: 422,
        VALIDACION: 400,
        INTERNO: 500,
        // heredados de ErrorResponse pero no usados en encargos:
        FUERA_HORARIO: 423,
        SIN_STOCK: 409,
        CUPON_INVALIDO: 403,
      }
      const status = statusMap[resultado.code] ?? 400
      return NextResponse.json(resultado, { status })
    }

    return NextResponse.json(resultado, { status: 201 })
  } catch (error) {
    console.error('[POST /api/encargos]', error)
    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor', code: 'INTERNO' },
      { status: 500 }
    )
  }
}
