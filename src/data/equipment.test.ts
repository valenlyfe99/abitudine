import { describe, it, expect } from 'vitest'
import {
  EQUIPMENT,
  getEquipmentById,
  getEquipmentBySlot,
  rarityColor,
  rarityLabel,
} from './equipment'
import type { Slot, Rarity } from '../domain/types'

describe('equipment catalog', () => {
  it('tiene al menos 24 items (4 por ranura)', () => {
    expect(EQUIPMENT.length).toBeGreaterThanOrEqual(24)
  })

  const slots: Slot[] = ['casco', 'armadura', 'arma', 'escudo', 'capa', 'accesorio']
  const rarities: Rarity[] = ['común', 'raro', 'épico', 'legendario']

  it('cada ranura tiene al menos 4 piezas', () => {
    slots.forEach((slot) => {
      const items = getEquipmentBySlot(slot)
      expect(items.length).toBeGreaterThanOrEqual(4)
    })
  })

  it('cada ranura tiene una pieza de cada rareza', () => {
    slots.forEach((slot) => {
      const items = getEquipmentBySlot(slot)
      const itemRarities = items.map((i) => i.rareza)
      rarities.forEach((r) => {
        expect(itemRarities).toContain(r)
      })
    })
  })

  it('todas las piezas tienen svgPath definido', () => {
    EQUIPMENT.forEach((item) => {
      expect(item.svgPath).toBeDefined()
      expect(typeof item.svgPath).toBe('string')
      expect(item.svgPath.length).toBeGreaterThan(0)
    })
  })

  it('getEquipmentById devuelve el item correcto', () => {
    const item = getEquipmentById('eq_casco_comun')
    expect(item).toBeDefined()
    expect(item!.id).toBe('eq_casco_comun')
    expect(item!.nombre).toBe('Caperuza de lona')
  })

  it('getEquipmentById devuelve undefined para id inexistente', () => {
    expect(getEquipmentById('no_existe')).toBeUndefined()
  })

  it('rarityColor devuelve color válido para cada rareza', () => {
    rarities.forEach((r) => {
      const color = rarityColor(r)
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })

  it('rarityLabel devuelve texto para cada rareza', () => {
    rarities.forEach((r) => {
      expect(rarityLabel(r)).toBeDefined()
      expect(typeof rarityLabel(r)).toBe('string')
    })
  })

  it('armaduras y armas están ligadas a Fuerza', () => {
    const fuerzaItems = EQUIPMENT.filter(
      (i) => i.ranura === 'armadura' || i.ranura === 'arma'
    )
    // Verificar que las condiciones de atributo usan Fuerza cuando corresponde
    fuerzaItems.forEach((item) => {
      if (item.condicion.tipo === 'atributo') {
        expect(item.condicion.atributo).toBe('Fuerza')
      }
    })
  })

  it('capas y amuletos están ligados a Vitalidad/Sabiduría', () => {
    const capas = EQUIPMENT.filter((i) => i.ranura === 'capa')
    capas.forEach((item) => {
      if (item.condicion.tipo === 'atributo') {
        expect(item.condicion.atributo).toBe('Vitalidad')
      }
    })

    const accesorios = EQUIPMENT.filter((i) => i.ranura === 'accesorio')
    accesorios.forEach((item) => {
      if (item.condicion.tipo === 'atributo') {
        expect(item.condicion.atributo).toBe('Sabiduría')
      }
    })
  })
})
