import type { Completion, Habit, PlayerState } from './types'
import { hoyLocal } from './fechas'
import {
  calcularTodasRachasHabito,
  calcularRachaGlobal,
  calcularRachaGlobalMax,
} from './rachas'
import {
  XP_POR_HABITO,
  BONUS_RACHA_HABITO,
  AMULETOS_POR_DIAS_RACHA_GLOBAL,
  AMULETOS_MAX,
  nivelParaXp,
  rangoParaXp,
} from '../config/progression'

export function calcularXpTotal(
  completions: Completion[],
  rachasPorHabito: Record<string, { actual: number; mejor: number }>
): number {
  const xpBase = completions.length * XP_POR_HABITO

  let xpBonus = 0
  for (const racha of Object.values(rachasPorHabito)) {
    for (const hito of BONUS_RACHA_HABITO) {
      if (racha.mejor >= hito.dias) {
        xpBonus += hito.bonus
      }
    }
  }

  return xpBase + xpBonus
}

export function calcularAtributos(
  completions: Completion[],
  habits: Habit[]
): PlayerState['atributos'] {
  const habitMap: Record<string, Habit> = {}
  for (const h of habits) habitMap[h.id] = h

  const atributos: PlayerState['atributos'] = {
    Fuerza: 0,
    Sabiduría: 0,
    Vitalidad: 0,
  }

  for (const c of completions) {
    const habit = habitMap[c.habitId]
    if (habit) {
      atributos[habit.categoria] += 1
    }
  }

  return atributos
}

export function calcularAmuletos(rachaGlobal: number): number {
  return Math.min(Math.floor(rachaGlobal / AMULETOS_POR_DIAS_RACHA_GLOBAL), AMULETOS_MAX)
}

export function calcularPlayerStateDesdeHistorial(
  completions: Completion[],
  habits: Habit[],
  fechaReferencia: string = hoyLocal()
): Omit<PlayerState, 'ultimaActualizacion'> {
  const rachasPorHabito = calcularTodasRachasHabito(
    completions,
    habits,
    fechaReferencia
  )

  const xp = calcularXpTotal(completions, rachasPorHabito)
  const atributos = calcularAtributos(completions, habits)
  const rachaGlobal = calcularRachaGlobal(completions, habits, fechaReferencia)
  const rachaGlobalMax = calcularRachaGlobalMax(
    completions,
    habits,
    fechaReferencia
  )
  const amuletos = calcularAmuletos(rachaGlobal)
  const nivel = nivelParaXp(xp)
  const rango = rangoParaXp(xp)

  return {
    xp,
    nivel,
    rango,
    atributos,
    rachaGlobal,
    rachaGlobalMax,
    amuletos,
    rachasPorHabito,
  }
}
