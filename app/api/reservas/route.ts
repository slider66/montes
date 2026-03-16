import { type NextRequest, NextResponse } from 'next/server'
import { crearReserva } from '@/lib/reservas'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const resultado = await crearReserva(body)

    if (!resultado.ok) {
      const statusMap = {
        FUERA_HORARIO: 423,   // Locked
        SIN_STOCK: 409,       // Conflict
        FECHA_INVALIDA: 422,  // Unprocessable Entity
        VALIDACION: 400,      // Bad Request
        INTERNO: 500,
      }
      const status = statusMap[resultado.code] ?? 400
      return NextResponse.json(resultado, { status })
    }

    return NextResponse.json(resultado, { status: 201 })
  } catch (error) {
    console.error('[POST /api/reservas]', error)
    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor', code: 'INTERNO' },
      { status: 500 }
    )
  }
}
