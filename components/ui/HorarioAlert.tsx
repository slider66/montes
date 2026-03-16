interface EstadoHorario {
  abierto: boolean
  mensaje: string
  proximaApertura?: string
}

interface Props {
  estado: EstadoHorario
}

export function HorarioAlert({ estado }: Props) {
  if (estado.abierto) {
    return (
      <div className="bg-green-50 border-b border-green-100 px-4 py-2 text-center">
        <p className="text-sm text-green-700 font-medium">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          {estado.mensaje}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 text-center">
      <p className="text-sm text-amber-800 font-medium">{estado.mensaje}</p>
      <p className="text-xs text-amber-600 mt-0.5">
        Puedes ver el catálogo y preparar tu reserva para cuando abramos.
      </p>
    </div>
  )
}
