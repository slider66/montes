import { NextResponse, type NextRequest } from 'next/server'
import { getEstadoHorario } from '@/lib/horario'

export const config = {
  matcher: ['/reservar/:path*', '/api/reservas/:path*'],
}

export function middleware(request: NextRequest) {
  // Permitir siempre las llamadas GET (consulta de stock, confirmaciones)
  if (request.method === 'GET') {
    return NextResponse.next()
  }

  const estado = getEstadoHorario()

  // Si es una llamada a la API, devolver 423 Locked
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!estado.abierto) {
      return NextResponse.json(
        {
          ok: false,
          error: estado.mensaje,
          code: 'FUERA_HORARIO',
          proximaApertura: estado.proximaApertura,
        },
        { status: 423 }
      )
    }
    return NextResponse.next()
  }

  // Para páginas del frontend, añadir header informativo y dejar pasar
  // (el componente HorarioAlert lo manejará visualmente)
  const response = NextResponse.next()
  response.headers.set('x-horario-abierto', estado.abierto ? '1' : '0')
  response.headers.set('x-horario-mensaje', estado.mensaje)
  return response
}
