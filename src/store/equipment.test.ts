import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store'
import { EQUIPMENT } from '../data/equipment'
import { puedeDesbloquear } from '../domain/unlocks'
import type { EquipmentItem, PlayerState, Slot } from '../domain/types'

function basePlayerState(overrides: Partial<PlayerState> = {}): PlayerState {
  const attrs = {
    Fuerza: 0,
    Sabiduría: 0,
    Vitalidad: 0,
    ...(overrides.atributos ?? {}),
  }
  return {
    xp: 0,
    nivel: 1,
    rango: 'Aldeano',
    rachaGlobal: 0,
    rachaGlobalMax: 0,
    amuletos: 0,
    rachasPorHabito: {},
    ultimaActualizacion: '2026-01-01',
    ...overrides,
    atributos: attrs,
  } as PlayerState
}

function resetStore(): void {
  localStorage.clear()
  const init = useAppStore.getState().init
  init()
}

describe('unlocks domain', () => {
  it('puedeDesbloquear por nivel', () => {
    const item: EquipmentItem = {
      id: 'test1',
      nombre: 'Test',
      descripcion: '',
      ranura: 'casco',
      rareza: 'común',
      condicion: { tipo: 'nivel', valor: 5 },
      svgPath: 'M 0 0 L 10 10',
    }
    expect(puedeDesbloquear(item, basePlayerState({ nivel: 4 }))).toBe(false)
    expect(puedeDesbloquear(item, basePlayerState({ nivel: 5 }))).toBe(true)
  })

  it('puedeDesbloquear por racha', () => {
    const item: EquipmentItem = {
      id: 'test2',
      nombre: 'Test',
      descripcion: '',
      ranura: 'capa',
      rareza: 'raro',
      condicion: { tipo: 'racha', valor: 7 },
      svgPath: 'M 0 0 L 10 10',
    }
    expect(puedeDesbloquear(item, basePlayerState({ rachaGlobal: 6 }))).toBe(false)
    expect(puedeDesbloquear(item, basePlayerState({ rachaGlobal: 7 }))).toBe(true)
  })

  it('puedeDesbloquear por atributo', () => {
    const item: EquipmentItem = {
      id: 'test3',
      nombre: 'Test',
      descripcion: '',
      ranura: 'accesorio',
      rareza: 'raro',
      condicion: { tipo: 'atributo', valor: 10, atributo: 'Sabiduría' },
      svgPath: 'M 0 0 L 10 10',
    }
    expect(
      puedeDesbloquear(
        item,
        basePlayerState({ atributos: { Sabiduría: 9 } as Record<string, number> })
      )
    ).toBe(false)
    expect(
      puedeDesbloquear(
        item,
        basePlayerState({ atributos: { Sabiduría: 10 } as Record<string, number> })
      )
    ).toBe(true)
  })
})

describe('store equipamiento', () => {
  beforeEach(() => {
    resetStore()
  })

  it('desbloquea items de nivel 1 al iniciar', () => {
    const { unlockedEquipment } = useAppStore.getState()
    const nivel1Items = EQUIPMENT.filter(
      (i) => i.condicion.tipo === 'nivel' && i.condicion.valor === 1
    )
    nivel1Items.forEach((item) => {
      expect(unlockedEquipment).toContain(item.id)
    })
  })

  it('equipar un item desbloqueado funciona', () => {
    const cascoItem = EQUIPMENT.find(
      (i) =>
        i.ranura === 'casco' &&
        i.condicion.tipo === 'nivel' &&
        i.condicion.valor === 1
    )
    expect(cascoItem).toBeDefined()

    const { equipItem } = useAppStore.getState()
    equipItem('casco', cascoItem!.id)
    const { equipped } = useAppStore.getState()
    expect(equipped.casco).toBe(cascoItem!.id)
  })

  it('no equipar un item bloqueado', () => {
    const { equipItem } = useAppStore.getState()
    const nivel30Item = EQUIPMENT.find(
      (i) => i.condicion.tipo === 'nivel' && i.condicion.valor === 30
    )
    expect(nivel30Item).toBeDefined()

    equipItem(nivel30Item!.ranura as Slot, nivel30Item!.id)
    const { equipped } = useAppStore.getState()
    expect(equipped[nivel30Item!.ranura]).toBeNull()
  })

  it('desequipar un item funciona', () => {
    const { equipItem, unequipItem } = useAppStore.getState()
    const cascoItem = EQUIPMENT.find(
      (i) =>
        i.ranura === 'casco' &&
        i.condicion.tipo === 'nivel' &&
        i.condicion.valor === 1
    )
    expect(cascoItem).toBeDefined()

    equipItem('casco', cascoItem!.id)
    expect(useAppStore.getState().equipped.casco).toBe(cascoItem!.id)

    unequipItem('casco')
    expect(useAppStore.getState().equipped.casco).toBeNull()
  })

  it('celebración se puede mostrar y ocultar', () => {
    const { showCelebration, hideCelebration } = useAppStore.getState()
    showCelebration({ type: 'level', level: 2 })
    expect(useAppStore.getState().celebration).toEqual({ type: 'level', level: 2 })

    hideCelebration()
    expect(useAppStore.getState().celebration).toBeNull()
  })
})
