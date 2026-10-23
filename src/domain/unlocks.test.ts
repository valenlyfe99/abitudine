import { describe, it, expect } from 'vitest'
import { puedeDesbloquear, equipoDesbloqueado } from './unlocks'
import type { EquipmentItem, PlayerState } from './types'

const itemNivel5: EquipmentItem = {
  id: 'item1',
  nombre: 'Yelmo de bronce',
  descripcion: '',
  ranura: 'casco',
  rareza: 'raro',
  condicion: { tipo: 'nivel', valor: 5 },
  svgPath: 'M 0 0 L 10 10',
}

const itemRacha7: EquipmentItem = {
  id: 'item2',
  nombre: 'Capa de viaje',
  descripcion: '',
  ranura: 'capa',
  rareza: 'raro',
  condicion: { tipo: 'racha', valor: 7 },
  svgPath: 'M 0 0 L 10 10',
}

const itemAtributo10: EquipmentItem = {
  id: 'item3',
  nombre: 'Libro de notas',
  descripcion: '',
  ranura: 'accesorio',
  rareza: 'raro',
  condicion: { tipo: 'atributo', valor: 10, atributo: 'Sabiduría' },
  svgPath: 'M 0 0 L 10 10',
}

function playerState(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    xp: 0,
    nivel: 1,
    rango: 'Aldeano',
    atributos: { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 },
    rachaGlobal: 0,
    rachaGlobalMax: 0,
    amuletos: 0,
    rachasPorHabito: {},
    ultimaActualizacion: '2026-01-01',
    ...overrides,
  }
}

describe('puedeDesbloquear', () => {
  it('condición de nivel', () => {
    expect(puedeDesbloquear(itemNivel5, playerState({ nivel: 4 }))).toBe(false)
    expect(puedeDesbloquear(itemNivel5, playerState({ nivel: 5 }))).toBe(true)
    expect(puedeDesbloquear(itemNivel5, playerState({ nivel: 10 }))).toBe(true)
  })

  it('condición de racha', () => {
    expect(puedeDesbloquear(itemRacha7, playerState({ rachaGlobal: 6 }))).toBe(false)
    expect(puedeDesbloquear(itemRacha7, playerState({ rachaGlobal: 7 }))).toBe(true)
    expect(puedeDesbloquear(itemRacha7, playerState({ rachaGlobal: 10 }))).toBe(true)
  })

  it('condición de atributo', () => {
    const baseAttrs = { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 }
    expect(
      puedeDesbloquear(
        itemAtributo10,
        playerState({ atributos: { ...baseAttrs, Sabiduría: 9 } })
      )
    ).toBe(false)
    expect(
      puedeDesbloquear(
        itemAtributo10,
        playerState({ atributos: { ...baseAttrs, Sabiduría: 10 } })
      )
    ).toBe(true)
    expect(
      puedeDesbloquear(
        itemAtributo10,
        playerState({ atributos: { ...baseAttrs, Sabiduría: 15 } })
      )
    ).toBe(true)
  })

  it('condición de atributo sin atributo definido es false', () => {
    const itemSinAttr: EquipmentItem = {
      ...itemAtributo10,
      condicion: { tipo: 'atributo', valor: 10 },
    }
    const baseAttrs = { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 }
    expect(puedeDesbloquear(itemSinAttr, playerState({ atributos: { ...baseAttrs, Sabiduría: 99 } }))).toBe(false)
  })
})

describe('equipoDesbloqueado', () => {
  it('devuelve lista de ids desbloqueados', () => {
    const items = [itemNivel5, itemRacha7, itemAtributo10]
    const ps = playerState({
      nivel: 5,
      rachaGlobal: 7,
      atributos: { Fuerza: 0, Sabiduría: 10, Vitalidad: 0 },
    })
    const ids = equipoDesbloqueado(items, ps)
    expect(ids).toEqual(['item1', 'item2', 'item3'])
  })

  it('devuelve lista vacía si nada está desbloqueado', () => {
    const items = [itemNivel5, itemRacha7]
    const ps = playerState({ nivel: 1, rachaGlobal: 0 })
    const ids = equipoDesbloqueado(items, ps)
    expect(ids).toEqual([])
  })
})
