import type { Habit, Completion, RachaPorHabito } from './types'
import {
  hoyLocal,
  sumarDias,
  diaSemana,
  obtenerDiasEntre,
  esFechaValida,
} from './fechas'

export function habitoCorresponde(habit: Habit, fecha: string): boolean {
  if (!esFechaValida(fecha)) return false
  if (habit.frecuencia === 'daily') return true
  const dia = diaSemana(fecha)
  return (habit.diasSemana || []).includes(dia)
}

export function completionsDeHabito(
  completions: Completion[],
  habitId: string
): string[] {
  return completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.fecha)
    .filter((fecha, idx, arr) => arr.indexOf(fecha) === idx)
    .sort()
}

function rachaActualHabito(
  fechasCompletadas: Set<string>,
  habit: Habit,
  fechaReferencia: string
): number {
  let racha = 0
  let fecha = fechaReferencia
  let vueltas = 0
  const maxVueltas = 400

  while (vueltas < maxVueltas) {
    if (!habitoCorresponde(habit, fecha)) {
      fecha = sumarDias(fecha, -1)
      vueltas += 1
      continue
    }
    if (fechasCompletadas.has(fecha)) {
      racha += 1
      fecha = sumarDias(fecha, -1)
    } else {
      break
    }
    vueltas += 1
  }

  return racha
}

function mejorRachaHabito(fechasCompletadas: string[], habit: Habit): number {
  const fechasValidas = fechasCompletadas.filter((f) =>
    habitoCorresponde(habit, f)
  )

  let mejor = 0
  let actual = 0
  let anterior: string | null = null

  for (const fecha of fechasValidas) {
    if (anterior && fecha === sumarDias(anterior, 1)) {
      actual += 1
    } else {
      actual = 1
    }
    if (actual > mejor) mejor = actual
    anterior = fecha
  }

  return mejor
}

export function calcularRachaHabito(
  completions: Completion[],
  habit: Habit,
  fechaReferencia: string = hoyLocal()
): RachaPorHabito {
  const fechas = completionsDeHabito(completions, habit.id)
  const setFechas = new Set(fechas)

  return {
    actual: rachaActualHabito(setFechas, habit, fechaReferencia),
    mejor: mejorRachaHabito(fechas, habit),
  }
}

export function calcularTodasRachasHabito(
  completions: Completion[],
  habits: Habit[],
  fechaReferencia: string = hoyLocal()
): Record<string, RachaPorHabito> {
  const rachas: Record<string, RachaPorHabito> = {}
  for (const habit of habits) {
    if (habit.archivado) continue
    rachas[habit.id] = calcularRachaHabito(completions, habit, fechaReferencia)
  }
  return rachas
}

export function calcularRachaGlobal(
  completions: Completion[],
  habits: Habit[],
  fechaReferencia: string = hoyLocal()
): number {
  const habitsActivos = habits.filter((h) => !h.archivado)
  const fechasPorHabito: Record<string, Set<string>> = {}
  for (const c of completions) {
    if (!fechasPorHabito[c.habitId]) fechasPorHabito[c.habitId] = new Set()
    fechasPorHabito[c.habitId].add(c.fecha)
  }

  let racha = 0
  let fecha = fechaReferencia
  let vueltas = 0
  const maxVueltas = 400

  while (vueltas < maxVueltas) {
    const habitsHoy = habitsActivos.filter((h) => habitoCorresponde(h, fecha))
    if (habitsHoy.length === 0) {
      fecha = sumarDias(fecha, -1)
      vueltas += 1
      continue
    }
    const todosCumplidos = habitsHoy.every((h) =>
      fechasPorHabito[h.id]?.has(fecha)
    )
    if (todosCumplidos) {
      racha += 1
      fecha = sumarDias(fecha, -1)
    } else {
      break
    }
    vueltas += 1
  }

  return racha
}

export function calcularRachaGlobalMax(
  completions: Completion[],
  habits: Habit[],
  fechaReferencia: string = hoyLocal()
): number {
  const habitsActivos = habits.filter((h) => !h.archivado)
  const fechasPorHabito: Record<string, Set<string>> = {}
  for (const c of completions) {
    if (!fechasPorHabito[c.habitId]) fechasPorHabito[c.habitId] = new Set()
    fechasPorHabito[c.habitId].add(c.fecha)
  }

  const fechaMasAntigua = obtenerFechaMasAntigua(
    completions,
    fechaReferencia
  )
  const todosLosDias = obtenerDiasEntre(fechaMasAntigua, fechaReferencia)

  let maxRacha = 0
  let rachaActual = 0

  for (const fecha of todosLosDias) {
    const habitsHoy = habitsActivos.filter((h) => habitoCorresponde(h, fecha))
    if (habitsHoy.length === 0) continue

    const todosCumplidos = habitsHoy.every((h) =>
      fechasPorHabito[h.id]?.has(fecha)
    )
    if (todosCumplidos) {
      rachaActual += 1
      if (rachaActual > maxRacha) maxRacha = rachaActual
    } else {
      rachaActual = 0
    }
  }

  return maxRacha
}

function obtenerFechaMasAntigua(
  completions: Completion[],
  fechaReferencia: string
): string {
  if (completions.length === 0) return fechaReferencia
  const fechas = completions.map((c) => c.fecha)
  return fechas.reduce((min, f) => (f < min ? f : min), fechas[0])
}
