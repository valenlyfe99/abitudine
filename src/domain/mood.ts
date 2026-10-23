import type { Character, Mood, PlayerState } from './types'

export function calcularMood(playerState: PlayerState): Mood {
  if (playerState.rachaGlobal >= 7 || playerState.nivel >= 5) {
    return 'orgulloso'
  }
  if (playerState.rachaGlobal === 0) {
    return 'cansado'
  }
  return 'normal'
}

export function actualizarMoodPersonaje(
  character: Character,
  playerState: PlayerState
): Character {
  return { ...character, mood: calcularMood(playerState) }
}
