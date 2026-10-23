import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LocalStorageAdapter, DATA_VERSION, StorageError, createEmptySaveData } from './storage'
import type { SaveData, Character } from './types'

const TEST_KEY = 'abitudine_data'

function clearStorage(): void {
  localStorage.removeItem(TEST_KEY)
}

const mockCharacter: Character = {
  id: 'char_1',
  nombre: 'Valen',
  tonoPiel: '#d4a373',
  peinado: 'corto',
  colorPelo: '#000000',
  equipado: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
  mood: 'normal',
}

function makeSaveData(overrides: Partial<SaveData> = {}): SaveData {
  return {
    version: DATA_VERSION,
    habits: [],
    completions: [],
    character: mockCharacter,
    playerState: {
      xp: 0,
      nivel: 1,
      rango: 'Aldeano',
      atributos: { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 },
      rachaGlobal: 0,
      rachaGlobalMax: 0,
      amuletos: 0,
      rachasPorHabito: {},
      ultimaActualizacion: '2026-01-01',
    },
    ...overrides,
  }
}

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    clearStorage()
  })

  afterEach(() => {
    clearStorage()
  })

  it('guarda y carga datos correctamente', () => {
    const adapter = new LocalStorageAdapter()
    const data = makeSaveData()
    adapter.save(data)
    const loaded = adapter.load()
    expect(loaded).not.toBeNull()
    expect(loaded!.character.nombre).toBe('Valen')
    expect(loaded!.version).toBe(DATA_VERSION)
  })

  it('devuelve null cuando no hay datos', () => {
    const adapter = new LocalStorageAdapter()
    expect(adapter.load()).toBeNull()
  })

  it('limpia los datos', () => {
    const adapter = new LocalStorageAdapter()
    adapter.save(makeSaveData())
    adapter.clear()
    expect(adapter.load()).toBeNull()
  })

  it('StorageError se puede crear con código quota', () => {
    const err = new StorageError('quota', 'El almacenamiento está lleno.')
    expect(err.code).toBe('quota')
    expect(err.message).toContain('lleno')
    expect(err.name).toBe('StorageError')
  })

  it('StorageError se puede crear con código blocked', () => {
    const err = new StorageError('blocked', 'Acceso bloqueado.')
    expect(err.code).toBe('blocked')
    expect(err.message).toContain('bloqueado')
  })

  it('StorageError se puede crear con código corrupt', () => {
    const err = new StorageError('corrupt', 'Datos corruptos.')
    expect(err.code).toBe('corrupt')
    expect(err.message).toContain('corruptos')
  })

  it('migra datos sin versión (versión 0) a la versión actual', () => {
    const adapter = new LocalStorageAdapter()
    const legacyData = {
      version: 0,
      habits: [],
      completions: [],
      character: mockCharacter,
      playerState: {
        xp: 0,
        nivel: 1,
        rango: 'Aldeano',
        atributos: { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 },
        rachaGlobal: 0,
        rachaGlobalMax: 0,
        amuletos: 0,
        rachasPorHabito: {},
        ultimaActualizacion: '2026-01-01',
      },
    }
    localStorage.setItem(TEST_KEY, JSON.stringify(legacyData))

    const loaded = adapter.load()
    expect(loaded!.version).toBe(DATA_VERSION)
  })

  it('migra datos sin campo version', () => {
    const adapter = new LocalStorageAdapter()
    const legacyData = {
      habits: [],
      completions: [],
      character: mockCharacter,
    }
    localStorage.setItem(TEST_KEY, JSON.stringify(legacyData))

    const loaded = adapter.load()
    expect(loaded!.version).toBe(DATA_VERSION)
  })

  it('no migra datos que ya están en la versión actual', () => {
    const adapter = new LocalStorageAdapter()
    const currentData = makeSaveData()
    localStorage.setItem(TEST_KEY, JSON.stringify(currentData))

    const loaded = adapter.load()
    expect(loaded!.version).toBe(DATA_VERSION)
    expect(loaded!.habits).toEqual([])
  })

  it('lanza StorageError con código corrupt cuando los datos son JSON inválido', () => {
    const adapter = new LocalStorageAdapter()
    localStorage.setItem(TEST_KEY, 'not valid json{{{')

    expect(() => adapter.load()).toThrow(StorageError)
    try {
      adapter.load()
    } catch (e) {
      const err = e as StorageError
      expect(err.code).toBe('corrupt')
    }
  })
})

describe('createEmptySaveData', () => {
  it('crea datos iniciales con versión correcta', () => {
    const data = createEmptySaveData(mockCharacter)
    expect(data.version).toBe(DATA_VERSION)
    expect(data.habits).toEqual([])
    expect(data.completions).toEqual([])
    expect(data.character).toBe(mockCharacter)
    expect(data.playerState.xp).toBe(0)
    expect(data.playerState.nivel).toBe(1)
  })
})
