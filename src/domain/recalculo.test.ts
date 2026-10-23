import { describe, it, expect } from 'vitest'
import { recalcularEstado, estadoInicial } from './recalculo'
import type { Habit, Completion } from './types'

const habitDiario: Habit = {
  id: 'h1',
  nombre: 'Leer',
  emoji: '📖',
  color: '#3b82f6',
  categoria: 'Sabiduría',
  frecuencia: 'daily',
  archivado: false,
  creadoEn: '2026-01-01',
  actualizadoEn: '2026-01-01',
}

function completions(habitId: string, fechas: string[]): Completion[] {
  return fechas.map((f) => ({
    habitId,
    fecha: f,
    marcadoEn: `${f}T10:00:00.000Z`,
  }))
}

describe('recalcularEstado', () => {
  it('recalcula desde historial vacío', () => {
    const state = recalcularEstado([], [], '2026-01-01')
    expect(state.xp).toBe(0)
    expect(state.nivel).toBe(1)
    expect(state.ultimaActualizacion).toBe('2026-01-01')
  })

  it('desmarcar un hábito revierte XP y efectos', () => {
    const estadoCon = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01', '2026-01-03', '2026-01-05']),
      '2026-01-05'
    )
    const estadoSin = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01']),
      '2026-01-05'
    )
    expect(estadoSin.xp).toBe(estadoCon.xp - 20) // se revirtieron 2 cumplimientos
    expect(estadoSin.atributos.Sabiduría).toBe(estadoCon.atributos.Sabiduría - 2)
  })

  it('nunca se pierde nivel por fallar', () => {
    const estadoCon = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01', '2026-01-02', '2026-01-03']),
      '2026-01-03'
    )
    const estadoSin = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01']),
      '2026-01-03'
    )
    expect(estadoSin.nivel).toBeGreaterThanOrEqual(1)
    expect(estadoSin.xp).toBeGreaterThanOrEqual(0)
    expect(estadoSin.xp).toBeLessThanOrEqual(estadoCon.xp)
  })

  it('corrigir hasta 7 días atrás se refleja en el recálculo', () => {
    const estado = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01', '2026-01-08']),
      '2026-01-08'
    )
    expect(estado.xp).toBe(20)
  })

  it('estado derivado siempre recalculable desde historial', () => {
    const h1 = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01']),
      '2026-01-01'
    )
    const h2 = recalcularEstado(
      [habitDiario],
      completions('h1', ['2026-01-01']),
      '2026-01-01'
    )
    expect(h1).toEqual(h2)
  })
})

describe('estadoInicial', () => {
  it('usa hoyLocal como fecha de referencia', () => {
    const state = estadoInicial([], [])
    expect(state.ultimaActualizacion).toBeDefined()
    expect(typeof state.ultimaActualizacion).toBe('string')
  })
})
