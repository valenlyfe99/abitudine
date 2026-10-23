import { describe, it, expect } from 'vitest'
import { calcularMood, actualizarMoodPersonaje } from './mood'
import type { PlayerState, Character } from './types'

function basePlayerState(overrides: Partial<PlayerState> = {}): PlayerState {
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

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'char_1',
    nombre: 'Valen',
    tonoPiel: '#d4a373',
    peinado: 'corto',
    colorPelo: '#000000',
    equipado: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
    mood: 'normal',
    ...overrides,
  }
}

describe('calcularMood', () => {
  it('devuelve orgulloso cuando rachaGlobal >= 7', () => {
    const ps = basePlayerState({ rachaGlobal: 7, nivel: 1 })
    expect(calcularMood(ps)).toBe('orgulloso')
  })

  it('devuelve orgulloso cuando rachaGlobal > 7', () => {
    const ps = basePlayerState({ rachaGlobal: 14, nivel: 1 })
    expect(calcularMood(ps)).toBe('orgulloso')
  })

  it('devuelve orgulloso cuando nivel >= 5', () => {
    const ps = basePlayerState({ rachaGlobal: 0, nivel: 5 })
    expect(calcularMood(ps)).toBe('orgulloso')
  })

  it('devuelve cansado cuando rachaGlobal === 0 y nivel < 5', () => {
    const ps = basePlayerState({ rachaGlobal: 0, nivel: 1 })
    expect(calcularMood(ps)).toBe('cansado')
  })

  it('devuelve cansado cuando rachaGlobal === 0 y nivel 4', () => {
    const ps = basePlayerState({ rachaGlobal: 0, nivel: 4 })
    expect(calcularMood(ps)).toBe('cansado')
  })

  it('devuelve normal cuando rachaGlobal entre 1 y 6 y nivel < 5', () => {
    const ps = basePlayerState({ rachaGlobal: 3, nivel: 2 })
    expect(calcularMood(ps)).toBe('normal')
  })

  it('devuelve normal cuando rachaGlobal = 6 y nivel = 4', () => {
    const ps = basePlayerState({ rachaGlobal: 6, nivel: 4 })
    expect(calcularMood(ps)).toBe('normal')
  })
})

describe('actualizarMoodPersonaje', () => {
  it('actualiza el mood del personaje según playerState', () => {
    const char = baseCharacter({ mood: 'cansado' })
    const ps = basePlayerState({ rachaGlobal: 10, nivel: 1 })
    const updated = actualizarMoodPersonaje(char, ps)
    expect(updated.mood).toBe('orgulloso')
    expect(char.mood).toBe('cansado') // original no mutado
  })

  it('no muta el personaje original', () => {
    const char = baseCharacter({ mood: 'normal' })
    const ps = basePlayerState({ rachaGlobal: 0, nivel: 1 })
    actualizarMoodPersonaje(char, ps)
    expect(char.mood).toBe('normal')
  })
})
