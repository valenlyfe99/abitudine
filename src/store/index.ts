import { create } from 'zustand'
import type { Habit, Completion, Character, PlayerState, SaveData } from '../domain/types'
import { LocalStorageAdapter, DATA_VERSION } from '../domain/storage'
import {
  estadoInicial,
  recalcularEstado,
  habitoCorresponde,
  hoyLocal,
  calcularRachaHabito,
} from '../domain'

interface AppState {
  habits: Habit[]
  completions: Completion[]
  character: Character | null
  playerState: PlayerState
  isLoading: boolean
  error: string | null

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
}

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const useAppStore = create<AppState>((set, get) => ({
  habits: [],
  completions: [],
  character: null,
  playerState: estadoInicial([], []),
  isLoading: true,
  error: null,

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

    if (!loaded) {
      set({
        habits: [],
        completions: [],
        character: null,
        playerState: estadoInicial([], []),
        isLoading: false,
        error: null,
      })
      return
    }

    const recalculated = recalcularEstado(loaded.habits, loaded.completions)

    set({
      habits: loaded.habits,
      completions: loaded.completions,
      character: loaded.character,
      playerState: recalculated,
      isLoading: false,
      error: null,
    })
  },

  save: () => {
    const { habits, completions, character, playerState } = get()
    if (!character) return
    const adapter = new LocalStorageAdapter()
    const data: SaveData = {
      version: DATA_VERSION,
      habits,
      completions,
      character,
      playerState,
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
    get().save()
  },

  deleteHabit: (id) => {
    set((state) => {
      const habits = state.habits.filter((h) => h.id !== id)
      const completions = state.completions.filter((c) => c.habitId !== id)
      const playerState = recalcularEstado(habits, completions)
      return { habits, completions, playerState }
    })
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
    get().save()
  },

  toggleCompletion: (habitId, fecha) => {
    set((state) => {
      const existing = state.completions.some(
        (c) => c.habitId === habitId && c.fecha === fecha
      )
      let completions: Completion[]
      if (existing) {
        completions = state.completions.filter(
          (c) => !(c.habitId === habitId && c.fecha === fecha)
        )
      } else {
        completions = [
          ...state.completions,
          { habitId, fecha, marcadoEn: new Date().toISOString() },
        ]
      }
      const playerState = recalcularEstado(state.habits, completions)
      return { completions, playerState }
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
