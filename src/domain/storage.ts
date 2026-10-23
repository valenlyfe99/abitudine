import type { SaveData, Character, PlayerState } from './types'
import { estadoInicial } from './recalculo'

export const DATA_VERSION = 1

export interface StorageAdapter {
  save(data: SaveData): void
  load(): SaveData | null
  clear(): void
}

export class StorageError extends Error {
  constructor(
    public readonly code: 'quota' | 'blocked' | 'corrupt' | 'unknown',
    message: string
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

function isQuotaError(e: unknown): boolean {
  if (e instanceof DOMException) {
    return e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22
  }
  if (e instanceof Error) {
    return /quota|exceeded|full/i.test(e.message)
  }
  return false
}

function isBlockedError(e: unknown): boolean {
  if (e instanceof DOMException) {
    return e.name === 'SecurityError' || e.name === 'NotAllowedError'
  }
  return false
}

export class LocalStorageAdapter implements StorageAdapter {
  private readonly key = 'abitudine_data'

  save(data: SaveData): void {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(this.key, serialized)
    } catch (e) {
      if (isQuotaError(e)) {
        throw new StorageError(
          'quota',
          'El almacenamiento del dispositivo está lleno. Borrá archivos o datos de otras apps e intentalo de nuevo.'
        )
      }
      if (isBlockedError(e)) {
        throw new StorageError(
          'blocked',
          'No se puede escribir en el almacenamiento local. Revisá la configuración de privacidad del navegador.'
        )
      }
      throw new StorageError('unknown', 'No se pudieron guardar los datos.')
    }
  }

  load(): SaveData | null {
    try {
      const raw = localStorage.getItem(this.key)
      if (!raw) return null

      const parsed = JSON.parse(raw)
      return this.migrate(parsed)
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new StorageError(
          'corrupt',
          'Los datos guardados están corruptos. Se iniciarán desde cero.'
        )
      }
      if (e instanceof StorageError) throw e
      throw new StorageError('unknown', 'No se pudo leer el almacenamiento local.')
    }
  }

  clear(): void {
    localStorage.removeItem(this.key)
  }

  private migrate(data: unknown): SaveData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = data
    const versionValue = raw?.version
    const version = typeof versionValue === 'number' ? versionValue : 0

    if (version >= DATA_VERSION) {
      return raw
    }

    let migrated = raw
    if (version === 0) {
      migrated = {
        ...migrated,
        version: DATA_VERSION,
        habits: Array.isArray(migrated?.habits) ? migrated.habits : [],
        completions: Array.isArray(migrated?.completions)
          ? migrated.completions
          : [],
        character: migrated?.character || this.defaultCharacter(),
        playerState: migrated?.playerState || this.defaultPlayerState(),
      }
    }

    return migrated
  }

  private defaultCharacter(): Character {
    return {
      id: 'char_1',
      nombre: '',
      tonoPiel: '#d4a373',
      peinado: 'corto',
      colorPelo: '#000000',
      equipado: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
      mood: 'normal',
    }
  }

  private defaultPlayerState(): PlayerState {
    return {
      xp: 0,
      nivel: 1,
      rango: 'Aldeano',
      atributos: { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 },
      rachaGlobal: 0,
      rachaGlobalMax: 0,
      amuletos: 0,
      rachasPorHabito: {},
      ultimaActualizacion: '',
    }
  }
}

export function createEmptySaveData(character: Character): SaveData {
  return {
    version: DATA_VERSION,
    habits: [],
    completions: [],
    character,
    playerState: estadoInicial([], []),
  }
}
