import type { Habit, Completion, PlayerState } from './types'
import { hoyLocal } from './fechas'
import { calcularPlayerStateDesdeHistorial } from './progresion'

export function recalcularEstado(
  habits: Habit[],
  completions: Completion[],
  fechaReferencia: string = hoyLocal()
): PlayerState {
  const base = calcularPlayerStateDesdeHistorial(
    completions,
    habits,
    fechaReferencia
  )

  return {
    ...base,
    ultimaActualizacion: fechaReferencia,
  }
}

export function estadoInicial(
  habits: Habit[],
  completions: Completion[]
): PlayerState {
  return recalcularEstado(habits, completions, hoyLocal())
}
