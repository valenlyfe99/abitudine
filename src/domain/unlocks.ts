import type { EquipmentItem, PlayerState } from './types'

export function puedeDesbloquear(
  item: EquipmentItem,
  playerState: PlayerState
): boolean {
  const { condicion } = item

  switch (condicion.tipo) {
    case 'nivel':
      return playerState.nivel >= condicion.valor
    case 'racha':
      return playerState.rachaGlobal >= condicion.valor
    case 'atributo':
      if (!condicion.atributo) return false
      return (playerState.atributos[condicion.atributo] ?? 0) >= condicion.valor
    default:
      return false
  }
}

export function equipoDesbloqueado(
  items: EquipmentItem[],
  playerState: PlayerState
): string[] {
  return items
    .filter((item) => puedeDesbloquear(item, playerState))
    .map((item) => item.id)
}
