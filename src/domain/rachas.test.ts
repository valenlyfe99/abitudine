import { describe, it, expect } from 'vitest'
import {
  habitoCorresponde,
  calcularRachaHabito,
  calcularTodasRachasHabito,
  calcularRachaGlobal,
  calcularRachaGlobalMax,
} from './rachas'
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

const habitSemanalLunesMiercoles: Habit = {
  id: 'h2',
  nombre: 'Gimnasio',
  emoji: '💪',
  color: '#10b981',
  categoria: 'Fuerza',
  frecuencia: 'weekly',
  diasSemana: [1, 3],
  archivado: false,
  creadoEn: '2026-01-01',
  actualizadoEn: '2026-01-01',
}

function completions(
  habitId: string,
  fechas: string[]
): Completion[] {
  return fechas.map((f) => ({
    habitId,
    fecha: f,
    marcadoEn: `${f}T10:00:00.000Z`,
  }))
}

describe('habitoCorresponde', () => {
  it('diario corresponde todos los días', () => {
    expect(habitoCorresponde(habitDiario, '2026-01-01')).toBe(true)
    expect(habitoCorresponde(habitDiario, '2026-01-05')).toBe(true)
  })

  it('semanal corresponde solo días configurados', () => {
    // 2026-01-05 es lunes
    expect(habitoCorresponde(habitSemanalLunesMiercoles, '2026-01-05')).toBe(true)
    // 2026-01-07 es miércoles
    expect(habitoCorresponde(habitSemanalLunesMiercoles, '2026-01-07')).toBe(true)
    // 2026-01-06 es martes
    expect(habitoCorresponde(habitSemanalLunesMiercoles, '2026-01-06')).toBe(false)
  })
})

describe('calcularRachaHabito', () => {
  it('racha 0 sin completions', () => {
    const r = calcularRachaHabito([], habitDiario, '2026-01-10')
    expect(r.actual).toBe(0)
    expect(r.mejor).toBe(0)
  })

  it('racha actual cuenta hacia atrás desde hoy', () => {
    const comps = completions('h1', ['2026-01-08', '2026-01-09', '2026-01-10'])
    const r = calcularRachaHabito(comps, habitDiario, '2026-01-10')
    expect(r.actual).toBe(3)
  })

  it('racha se rompe si falta un día', () => {
    const comps = completions('h1', ['2026-01-08', '2026-01-10'])
    const r = calcularRachaHabito(comps, habitDiario, '2026-01-10')
    expect(r.actual).toBe(1)
    expect(r.mejor).toBe(1)
  })

  it('mejor racha registra el máximo histórico', () => {
    const comps = completions('h1', [
      '2026-01-01', '2026-01-02', '2026-01-03', // racha 3
      '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', // racha 4
    ])
    const r = calcularRachaHabito(comps, habitDiario, '2026-01-10')
    expect(r.mejor).toBe(4)
  })

  it('hábito semanal no se rompe en días que no corresponden', () => {
    // Lunes 5, miércoles 7, viernes 9 (no corresponde), lunes 12
    const comps = completions('h2', ['2026-01-05', '2026-01-07', '2026-01-12'])
    const r = calcularRachaHabito(comps, habitSemanalLunesMiercoles, '2026-01-12')
    // 12(lunes, ok), 11(domingo, no corr, saltar), 10(sábado, no corr), 9(viernes, no corr), 8(jueves, no corr), 7(miércoles, ok), 6(martes, no corr), 5(lunes, ok)
    // racha hacia atrás: 12=ok(1), 11=no corr, 10=no corr, 9=no corr, 8=no corr, 7=ok(2), 6=no corr, 5=ok(3)
    expect(r.actual).toBe(3)
  })

  it('hábito creado a mitad de semana solo cuenta desde su creación', () => {
    const habitMitadSemana: Habit = {
      ...habitSemanalLunesMiercoles,
      id: 'h3',
      creadoEn: '2026-01-07', // miércoles
    }
    // completion antes de creación no debería contar (pero no lo validamos aquí, solo la racha)
    const comps = completions('h3', ['2026-01-07', '2026-01-12'])
    const r = calcularRachaHabito(comps, habitMitadSemana, '2026-01-12')
    expect(r.actual).toBe(2)
  })
})

describe('calcularTodasRachasHabito', () => {
  it('devuelve rachas para todos los hábitos activos', () => {
    const habits = [habitDiario, habitSemanalLunesMiercoles]
    const comps = completions('h1', ['2026-01-10'])
    const rachas = calcularTodasRachasHabito(comps, habits, '2026-01-10')
    expect(rachas['h1'].actual).toBe(1)
    expect(rachas['h2'].actual).toBe(0)
  })

  it('ignora hábitos archivados', () => {
    const habitArchivado: Habit = { ...habitDiario, id: 'h4', archivado: true }
    const habits = [habitDiario, habitArchivado]
    const comps = completions('h1', ['2026-01-10'])
    const rachas = calcularTodasRachasHabito(comps, habits, '2026-01-10')
    expect(rachas['h1']).toBeDefined()
    expect(rachas['h4']).toBeUndefined()
  })
})

describe('calcularRachaGlobal', () => {
  it('racha global 0 si no se cumplió todo hoy', () => {
    const habits = [habitDiario, habitSemanalLunesMiercoles]
    const comps = completions('h1', ['2026-01-05']) // lunes, solo diario
    // lunes 5: diario ok, semanal(lunes) ok -> cumple todo
    // martes 6: diario no completado -> rompe
    const r = calcularRachaGlobal(comps, habits, '2026-01-06')
    expect(r).toBe(0)
  })

  it('racha global cuenta días consecutivos cumplidos', () => {
    const habits = [habitDiario]
    const comps = completions('h1', ['2026-01-08', '2026-01-09', '2026-01-10'])
    const r = calcularRachaGlobal(comps, habits, '2026-01-10')
    expect(r).toBe(3)
  })

  it('días sin hábitos que correspondan no rompen la racha global', () => {
    const habits = [habitSemanalLunesMiercoles]
    const comps = completions('h2', ['2026-01-05', '2026-01-07'])
    // 7(miércoles, ok=1), 6(martes, no corr), 5(lunes, ok=2)
    const r = calcularRachaGlobal(comps, habits, '2026-01-07')
    expect(r).toBe(2)
  })
})

describe('calcularRachaGlobalMax', () => {
  it('devuelve 0 sin completions', () => {
    const r = calcularRachaGlobalMax([], [habitDiario], '2026-01-10')
    expect(r).toBe(0)
  })

  it('encuentra la racha máxima histórica', () => {
    const habits = [habitDiario]
    const comps = completions('h1', [
      '2026-01-01', '2026-01-02', '2026-01-03', // 3
      '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', // 4
    ])
    const r = calcularRachaGlobalMax(comps, habits, '2026-01-10')
    expect(r).toBe(4)
  })
})
