import { describe, it, expect } from 'vitest'
import {
  hoyLocal,
  sumarDias,
  diaSemana,
  esFechaValida,
  estaEnRango,
  obtenerDiasEntre,
  fechaHaceDias,
} from './fechas'

describe('fechas locales', () => {
  it('hoyLocal devuelve YYYY-MM-DD válido', () => {
    const fecha = hoyLocal()
    expect(esFechaValida(fecha)).toBe(true)
    expect(fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('sumarDias avanza correctamente', () => {
    expect(sumarDias('2026-01-01', 1)).toBe('2026-01-02')
    expect(sumarDias('2026-01-31', 1)).toBe('2026-02-01')
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01')
    expect(sumarDias('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('diaSemana devuelve 0 para domingo', () => {
    // 2026-01-04 es domingo
    expect(diaSemana('2026-01-04')).toBe(0)
    // 2026-01-05 es lunes
    expect(diaSemana('2026-01-05')).toBe(1)
  })

  it('esFechaValida rechaza fechas inválidas', () => {
    expect(esFechaValida('2026-02-30')).toBe(false)
    expect(esFechaValida('not-a-date')).toBe(false)
    expect(esFechaValida('2026-13-01')).toBe(false)
    expect(esFechaValida('2026-01-01')).toBe(true)
  })

  it('estaEnRango compara correctamente', () => {
    expect(estaEnRango('2026-01-05', '2026-01-01', '2026-01-10')).toBe(true)
    expect(estaEnRango('2026-01-01', '2026-01-01', '2026-01-10')).toBe(true)
    expect(estaEnRango('2026-01-10', '2026-01-01', '2026-01-10')).toBe(true)
    expect(estaEnRango('2026-01-00', '2026-01-01', '2026-01-10')).toBe(false)
    expect(estaEnRango('2026-01-11', '2026-01-01', '2026-01-10')).toBe(false)
  })

  it('obtenerDiasEntre devuelve todos los días inclusive', () => {
    const dias = obtenerDiasEntre('2026-01-01', '2026-01-03')
    expect(dias).toEqual(['2026-01-01', '2026-01-02', '2026-01-03'])
  })

  it('fechaHaceDias resta correctamente', () => {
    expect(fechaHaceDias('2026-01-10', 3)).toBe('2026-01-07')
  })
})
