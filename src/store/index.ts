import { create } from 'zustand'
import type {
  Habit,
  Completion,
  Character,
  PlayerState,
  SaveData,
  Slot,
  CelebrationEvent,
} from '../domain/types'
import { LocalStorageAdapter, DATA_VERSION } from '../domain/storage'
import {
  estadoInicial,
  recalcularEstado,
  habitoCorresponde,
  hoyLocal,
  calcularRachaHabito,
  calcularRachaGlobal,
} from '../domain'
import { puedeDesbloquear } from '../domain/unlocks'
import { EQUIPMENT, getEquipmentById } from '../data/equipment'

export type Tema = 'claro' | 'oscuro'

export interface AmuletoOferta {
  habitId: string
  fecha: string
}

interface AppState {
  habits: Habit[]
  completions: Completion[]
  character: Character | null
  playerState: PlayerState
  unlockedEquipment: string[]
  equipped: Record<Slot, string | null>
  tema: Tema
  isLoading: boolean
  error: string | null
  celebration: CelebrationEvent | null
  pendingAmuleto: AmuletoOferta | null

  init: () => void
  save: () => void

  addHabit: (habit: Omit<Habit, 'id' | 'creadoEn' | 'actualizadoEn'>) => void
  editHabit: (id: string, data: Partial<Omit<Habit, 'id'>>) => void
  archiveHabit: (id: string) => void
  deleteHabit: (id: string) => void
  restoreHabit: (id: string) => void

  toggleCompletion: (habitId: string, fecha: string) => void

  setCharacter: (data: Partial<Character>) => void

  recalculate: () => void

  equipItem: (slot: Slot, itemId: string) => void
  unequipItem: (slot: Slot) => void

  showCelebration: (event: CelebrationEvent) => void
  hideCelebration: () => void
  checkUnlocksAndCelebrate: (prevLevel?: number, prevRank?: string) => void

  usarAmuleto: () => void
  rechazarAmuleto: () => void

  toggleTema: () => void

  exportarDatos: () => string
  importarDatos: (json: string, reemplazar: boolean) => void
  reiniciarProgreso: () => void
}

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`

function initialUnlocked(): string[] {
  return EQUIPMENT.filter((item) => puedeDesbloquear(item, estadoInicial([], []))).map((item) => item.id)
}

function detectarTemaGuardado(): Tema {
  if (typeof localStorage !== 'undefined') {
    const guardado = localStorage.getItem('abitudine_tema')
    if (guardado === 'claro' || guardado === 'oscuro') return guardado
  }
  return 'claro'
}

export const useAppStore = create<AppState>((set, get) => ({
  habits: [],
  completions: [],
  character: null,
  playerState: estadoInicial([], []),
  unlockedEquipment: [],
  equipped: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
  tema: detectarTemaGuardado(),
  isLoading: true,
  error: null,
  celebration: null,
  pendingAmuleto: null,

  init: () => {
    const adapter = new LocalStorageAdapter()
    let loaded: SaveData | null = null
    try {
      loaded = adapter.load()
    } catch (e) {
      const err = e as Error & { code?: string; message?: string }
      if (err.code === 'corrupt') {
        set({ error: err.message || 'Datos corruptos.', isLoading: false })
        return
      }
      set({ error: 'No se pudo leer el almacenamiento local.', isLoading: false })
      return
    }

    const temaGuardado = detectarTemaGuardado()

    if (!loaded) {
      const unlocked = initialUnlocked()
      set({
        habits: [],
        completions: [],
        character: null,
        playerState: estadoInicial([], []),
        unlockedEquipment: unlocked,
        equipped: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
        tema: temaGuardado,
        isLoading: false,
        error: null,
        celebration: null,
        pendingAmuleto: null,
      })
      return
    }

    const recalculated = recalcularEstado(loaded.habits, loaded.completions)
    const unlocked = loaded.unlockedEquipment || initialUnlocked()
    const equipped = loaded.character?.equipado || {
      casco: null,
      armadura: null,
      arma: null,
      escudo: null,
      capa: null,
      accesorio: null,
    }

    set({
      habits: loaded.habits,
      completions: loaded.completions,
      character: loaded.character,
      playerState: recalculated,
      unlockedEquipment: unlocked,
      equipped,
      tema: ((loaded as SaveData & { tema?: string }).tema as Tema) ?? temaGuardado,
      isLoading: false,
      error: null,
      celebration: null,
      pendingAmuleto: null,
    })
  },

  save: () => {
    const { habits, completions, character, playerState, unlockedEquipment, equipped } = get()
    const { tema } = get()
    if (!character) return
    const adapter = new LocalStorageAdapter()
    const data: SaveData = {
      version: DATA_VERSION,
      habits,
      completions,
      character: { ...character, equipado: equipped },
      playerState,
      unlockedEquipment,
    }
    try {
      adapter.save(data)
    } catch (e) {
      const err = e as Error & { code?: string }
      if (err.code) {
        set({ error: err.message })
      } else {
        set({ error: 'No se pudieron guardar los datos.' })
      }
    }
    try {
      localStorage.setItem('abitudine_tema', tema)
    } catch {
      // Ignorar errores al guardar tema
    }
  },

  addHabit: (habit) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      creadoEn: hoyLocal(),
      actualizadoEn: hoyLocal(),
    }
    set((state) => {
      const habits = [...state.habits, newHabit]
      const playerState = recalcularEstado(habits, state.completions)
      return { habits, playerState }
    })
    get().checkUnlocksAndCelebrate()
    get().save()
  },

  editHabit: (id, data) => {
    set((state) => {
      const habits = state.habits.map((h) =>
        h.id === id ? { ...h, ...data, actualizadoEn: hoyLocal() } : h
      )
      const playerState = recalcularEstado(habits, state.completions)
      return { habits, playerState }
    })
    get().checkUnlocksAndCelebrate()
    get().save()
  },

  archiveHabit: (id) => {
    set((state) => {
      const habits = state.habits.map((h) =>
        h.id === id ? { ...h, archivado: true, actualizadoEn: hoyLocal() } : h
      )
      const playerState = recalcularEstado(habits, state.completions)
      return { habits, playerState }
    })
    get().checkUnlocksAndCelebrate()
    get().save()
  },

  deleteHabit: (id) => {
    set((state) => {
      const habits = state.habits.filter((h) => h.id !== id)
      const completions = state.completions.filter((c) => c.habitId !== id)
      const playerState = recalcularEstado(habits, completions)
      return { habits, completions, playerState }
    })
    get().checkUnlocksAndCelebrate()
    get().save()
  },

  restoreHabit: (id) => {
    set((state) => {
      const habits = state.habits.map((h) =>
        h.id === id ? { ...h, archivado: false, actualizadoEn: hoyLocal() } : h
      )
      const playerState = recalcularEstado(habits, state.completions)
      return { habits, playerState }
    })
    get().checkUnlocksAndCelebrate()
    get().save()
  },

  toggleCompletion: (habitId, fecha) => {
    const { playerState: prevState, completions } = get()
    const prevLevel = prevState.nivel
    const prevRank = prevState.rango
    const prevRachaGlobal = prevState.rachaGlobal

    const existing = completions.some(
      (c) => c.habitId === habitId && c.fecha === fecha
    )

    if (existing) {
      const completionsSinEsta = completions.filter(
        (c) => !(c.habitId === habitId && c.fecha === fecha)
      )
      const rachaSinEsta = calcularRachaGlobal(
        completionsSinEsta,
        get().habits,
        hoyLocal()
      )

      const rompeRacha = rachaSinEsta < prevRachaGlobal
      const hayAmuletos = prevState.amuletos > 0

      if (rompeRacha && hayAmuletos) {
        set({ pendingAmuleto: { habitId, fecha } })
        return
      }

      set((state) => {
        const completions2 = state.completions.filter(
          (c) => !(c.habitId === habitId && c.fecha === fecha)
        )
        const playerState = recalcularEstado(state.habits, completions2)
        return { completions: completions2, playerState }
      })
      get().checkUnlocksAndCelebrate(prevLevel, prevRank)
      get().save()
      return
    }

    set((state) => {
      const completions2 = [
        ...state.completions,
        { habitId, fecha, marcadoEn: new Date().toISOString() },
      ]
      const playerState = recalcularEstado(state.habits, completions2)
      return { completions: completions2, playerState }
    })
    get().checkUnlocksAndCelebrate(prevLevel, prevRank)
    get().save()
  },

  usarAmuleto: () => {
    const { pendingAmuleto } = get()
    if (!pendingAmuleto) return
    const { amuletos } = get().playerState
    if (amuletos <= 0) return

    set((state) => {
      const amuletos = Math.max(0, state.playerState.amuletos - 1)
      const nuevoPlayerState = { ...state.playerState, amuletos }
      return { playerState: nuevoPlayerState, pendingAmuleto: null }
    })

    get().showCelebration({ type: 'rank', rank: get().playerState.rango })
    get().save()
  },

  rechazarAmuleto: () => {
    const { pendingAmuleto } = get()
    if (!pendingAmuleto) return

    set({ pendingAmuleto: null })

    set((state) => {
      const completions2 = state.completions.filter(
        (c) =>
          !(c.habitId === pendingAmuleto.habitId && c.fecha === pendingAmuleto.fecha)
      )
      const playerState = recalcularEstado(state.habits, completions2)
      return { completions: completions2, playerState }
    })
    get().save()
  },

  setCharacter: (data) => {
    set((state) => {
      if (!state.character) {
        const character: Character = {
          id: 'char_1',
          nombre: data.nombre || '',
          tonoPiel: data.tonoPiel || '#d4a373',
          peinado: data.peinado || 'corto',
          colorPelo: data.colorPelo || '#000000',
          equipado: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
          mood: 'normal',
        }
        return { character }
      }
      return {
        character: { ...state.character, ...data },
      }
    })
    get().save()
  },

  recalculate: () => {
    const { habits, completions } = get()
    const playerState = recalcularEstado(habits, completions)
    set({ playerState })
  },

  equipItem: (slot, itemId) => {
    const item = getEquipmentById(itemId)
    if (!item) return
    const { unlockedEquipment } = get()
    if (!unlockedEquipment.includes(itemId)) return

    set((state) => {
      const equipped = { ...state.equipped, [slot]: itemId }
      const character = state.character
        ? { ...state.character, equipado: equipped }
        : null
      return { equipped, character }
    })
    get().save()
  },

  unequipItem: (slot) => {
    set((state) => {
      const equipped = { ...state.equipped, [slot]: null }
      const character = state.character
        ? { ...state.character, equipado: equipped }
        : null
      return { equipped, character }
    })
    get().save()
  },

  showCelebration: (event) => {
    set({ celebration: event })
  },

  hideCelebration: () => {
    set({ celebration: null })
  },

  checkUnlocksAndCelebrate: (prevLevel?: number, prevRank?: string) => {
    const { playerState, unlockedEquipment, celebration } = get()
    const newlyUnlocked = EQUIPMENT.filter(
      (item) => puedeDesbloquear(item, playerState) && !unlockedEquipment.includes(item.id)
    )

    if (newlyUnlocked.length > 0) {
      const newIds = newlyUnlocked.map((item) => item.id)
      set({
        unlockedEquipment: [...unlockedEquipment, ...newIds],
      })
      if (!celebration) {
        set({
          celebration: {
            type: 'unlock',
            itemId: newIds[0],
          },
        })
      }
      get().save()
      return
    }

    if (prevLevel !== undefined && playerState.nivel > prevLevel) {
      set({
        celebration: {
          type: 'level',
          level: playerState.nivel,
        },
      })
      return
    }

    if (prevRank !== undefined && playerState.rango !== prevRank) {
      set({
        celebration: {
          type: 'rank',
          rank: playerState.rango,
        },
      })
    }
  },

  toggleTema: () => {
    set((state) => {
      const nuevoTema: Tema = state.tema === 'claro' ? 'oscuro' : 'claro'
      if (typeof document !== 'undefined') {
        if (nuevoTema === 'oscuro') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      return { tema: nuevoTema }
    })
    get().save()
  },

  exportarDatos: () => {
    const { habits, completions, character, playerState, unlockedEquipment, tema } = get()
    const data = {
      version: DATA_VERSION,
      exportadoEn: new Date().toISOString(),
      tema,
      habits,
      completions,
      character,
      playerState,
      unlockedEquipment,
    }
    return JSON.stringify(data, null, 2)
  },

  importarDatos: (json: string, reemplazar: boolean) => {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(json) as Record<string, unknown>
    } catch {
      set({ error: 'El archivo no es un JSON válido.' })
      return
    }

    if (!parsed) {
      set({ error: 'El archivo no tiene un formato válido.' })
      return
    }

    const version = (parsed as { version: unknown }).version
    if (typeof version !== 'number' || version > DATA_VERSION) {
      set({ error: `Versión de esquema no soportada (${version}).` })
      return
    }

    const data = parsed as unknown as SaveData
    const habits: Habit[] = Array.isArray(data.habits) ? data.habits : []
    const completions: Completion[] = Array.isArray(data.completions)
      ? data.completions
      : []
    const character = data.character as Character | null
    const unlockedEquipment = Array.isArray(data.unlockedEquipment)
      ? data.unlockedEquipment
      : initialUnlocked()

    if (reemplazar) {
      set({
        habits,
        completions,
        character,
        playerState: recalcularEstado(habits, completions),
        unlockedEquipment,
        equipped: character?.equipado || {
          casco: null,
          armadura: null,
          arma: null,
          escudo: null,
          capa: null,
          accesorio: null,
        },
        tema: ((data as SaveData & { tema?: string }).tema as Tema) ?? 'claro',
        error: null,
      })
    } else {
      const { habits: existentes, completions: existCompletions } = get()
      const idsExistentes = new Set(existentes.map((h) => h.id))
      const habitsNuevos = habits.filter((h) => !idsExistentes.has(h.id))

      const fechasExistentes = new Set(
        existCompletions.map((c) => `${c.habitId}|${c.fecha}`)
      )
      const completionsNuevas = completions.filter(
        (c) => !fechasExistentes.has(`${c.habitId}|${c.fecha}`)
      )

      set({
        habits: [...existentes, ...habitsNuevos],
        completions: [...existCompletions, ...completionsNuevas],
        playerState: recalcularEstado(
          [...existentes, ...habitsNuevos],
          [...existCompletions, ...completionsNuevas]
        ),
        error: null,
      })
    }

    get().save()
  },

  reiniciarProgreso: () => {
    set({
      habits: [],
      completions: [],
      character: null,
      playerState: estadoInicial([], []),
      unlockedEquipment: initialUnlocked(),
      equipped: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
      celebration: null,
      pendingAmuleto: null,
      error: null,
    })
    get().save()
  },
}))

export function useTodayHabits() {
  const { habits } = useAppStore()
  const today = hoyLocal()
  return habits.filter((h) => !h.archivado && habitoCorresponde(h, today))
}

export function isHabitCompletedToday(habitId: string) {
  const { completions } = useAppStore.getState()
  const today = hoyLocal()
  return completions.some((c) => c.habitId === habitId && c.fecha === today)
}

export function useHabitStreak(habitId: string) {
  const { habits, completions } = useAppStore()
  const habit = habits.find((h) => h.id === habitId)
  if (!habit) return { actual: 0, mejor: 0 }
  return calcularRachaHabito(completions, habit, hoyLocal())
}

export function useIsItemUnlocked(itemId: string) {
  const { unlockedEquipment } = useAppStore()
  return unlockedEquipment.includes(itemId)
}

export function useEquippedItem(slot: Slot) {
  const { equipped } = useAppStore()
  return equipped[slot]
}

export function useFechaCumplida(habitId: string, fecha: string) {
  const { completions } = useAppStore.getState()
  return completions.some((c) => c.habitId === habitId && c.fecha === fecha)
}

export function useRachaGlobal() {
  const { playerState } = useAppStore()
  return playerState.rachaGlobal
}

export function useAmuletos() {
  const { playerState } = useAppStore()
  return playerState.amuletos
}

export function usePendingAmuleto() {
  const { pendingAmuleto } = useAppStore()
  return pendingAmuleto
}



