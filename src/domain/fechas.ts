export function hoyLocal(): string {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60 * 1000
  const local = new Date(now.getTime() - offsetMs)
  return local.toISOString().split('T')[0]
}

export function esMismaFecha(a: string, b: string): boolean {
  return a === b
}

export function sumarDias(fecha: string, dias: number): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const date = new Date(y, m - 1, d + dias)
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  const local = new Date(date.getTime() - offsetMs)
  return local.toISOString().split('T')[0]
}

export function diaSemana(fecha: string): number {
  const [y, m, d] = fecha.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

export function esFechaValida(fecha: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(fecha)) return false
  const [y, m, d] = fecha.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  )
}

export function estaEnRango(fecha: string, desde: string, hasta: string): boolean {
  return fecha >= desde && fecha <= hasta
}

export function obtenerDiasEntre(fechaDesde: string, fechaHasta: string): string[] {
  const dias: string[] = []
  let actual = fechaDesde
  while (actual <= fechaHasta) {
    dias.push(actual)
    actual = sumarDias(actual, 1)
  }
  return dias
}

export function fechaHaceDias(fecha: string, dias: number): string {
  return sumarDias(fecha, -dias)
}
