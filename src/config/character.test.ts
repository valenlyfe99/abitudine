import { describe, it, expect } from 'vitest'
import { CHARACTER_LAYERS, HAIRSTYLES, DEFAULT_EQUIPMENT, layerZIndex } from './character'
import type { Slot } from '../domain/types'

describe('character config', () => {
  it('CHARACTER_LAYERS tiene 10 capas en orden correcto', () => {
    expect(CHARACTER_LAYERS).toHaveLength(10)
    const ids = CHARACTER_LAYERS.map((l) => l.id)
    expect(ids[0]).toBe('cuerpo')
    expect(ids[9]).toBe('accesorio')
  })

  it('las capas tienen zIndex único y ascendente', () => {
    const zIndexes = CHARACTER_LAYERS.map((l) => l.zIndex)
    const sorted = [...zIndexes].sort((a, b) => a - b)
    expect(zIndexes).toEqual(sorted)
    expect(new Set(zIndexes).size).toBe(zIndexes.length)
  })

  it('layerZIndex devuelve el zIndex correcto', () => {
    expect(layerZIndex('cuerpo')).toBe(1)
    expect(layerZIndex('accesorio')).toBe(10)
  })

  it('HAIRSTYLES tiene al menos 4 peinados', () => {
    const ids = Object.keys(HAIRSTYLES)
    expect(ids.length).toBeGreaterThanOrEqual(4)
    expect(ids).toContain('corto')
    expect(ids).toContain('largo')
    expect(ids).toContain('rizado')
    expect(ids).toContain('rapado')
  })

  it('DEFAULT_EQUIPMENT tiene una pieza por ranura', () => {
    const slots: Slot[] = ['casco', 'armadura', 'arma', 'escudo', 'capa', 'accesorio']
    slots.forEach((slot) => {
      expect(DEFAULT_EQUIPMENT[slot]).toBeDefined()
      expect(DEFAULT_EQUIPMENT[slot].id).toBeDefined()
      expect(DEFAULT_EQUIPMENT[slot].nombre).toBeDefined()
      expect(DEFAULT_EQUIPMENT[slot].rareza).toBeDefined()
      expect(DEFAULT_EQUIPMENT[slot].color).toBeDefined()
    })
  })

  it('rarezas válidas en DEFAULT_EQUIPMENT', () => {
    const validRarities = ['común', 'raro', 'épico', 'legendario']
    Object.values(DEFAULT_EQUIPMENT).forEach((eq) => {
      expect(validRarities).toContain(eq.rareza)
    })
  })
})
