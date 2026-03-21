// ─── Cálculo de Pascua (algoritmo Gregoriano Anónimo) ────────────────────────

function calcularPascua(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

// ─── Temporada Torrijas ───────────────────────────────────────────────────────
// Activa desde 30 días antes del Domingo de Ramos (= Pascua − 37)
// hasta 7 días después del Domingo de Resurrección (= Pascua + 7)

export function esTiempoTorrijas(ahora: Date = new Date()): boolean {
  const year = ahora.getFullYear()
  const pascua = calcularPascua(year)

  const inicio = new Date(pascua)
  inicio.setDate(inicio.getDate() - 37) // 30 días antes de Semana Santa
  inicio.setHours(0, 0, 0, 0)

  const fin = new Date(pascua)
  fin.setDate(fin.getDate() + 7)
  fin.setHours(23, 59, 59, 999)

  return ahora >= inicio && ahora <= fin
}

// Útil para mostrar info de temporada en UI
export function infoTemporadaTorrijas(ahora: Date = new Date()): {
  activa: boolean
  inicioPascua: Date
  fin: Date
} {
  const year = ahora.getFullYear()
  const pascua = calcularPascua(year)
  const fin = new Date(pascua)
  fin.setDate(fin.getDate() + 7)
  fin.setHours(23, 59, 59, 999)
  return { activa: esTiempoTorrijas(ahora), inicioPascua: pascua, fin }
}
