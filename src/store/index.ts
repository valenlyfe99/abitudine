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
} from '../domain'
import { puedeDesbloquear } from '../domain/unlocks'
import { EQUIPMENT, getEquipmentById } from '../data/equipment'

interface AppState {
  habits: Habit[]
  completions: Completion[]
  character: Character | null
  playerState: PlayerState
  unlockedEquipment: string[]
  equipped: Record<Slot, string | null>
  isLoading: boolean
  error: string | null
  celebration: CelebrationEvent | null

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
}

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`

function initialUnlocked(): string[] {
  // Siempre desbloquear items de nivel 1 al inicio
  return EQUIPMENT.filter((item) => puedeDesbloquear(item, estadoInicial([], []))).map((item) => item.id)
}

export const useAppStore = create<AppState>((set, get) => ({
  habits: [],
  completions: [],
  character: null,
  playerState: estadoInicial([], []),
  unlockedEquipment: [],
  equipped: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
  isLoading: true,
  error: null,
  celebration: null,

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
      const unlocked = initialUnlocked()
      set({
        habits: [],
        completions: [],
        character: null,
        playerState: estadoInicial([], []),
        unlockedEquipment: unlocked,
        equipped: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
        isLoading: false,
        error: null,
        celebration: null,
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
      isLoading: false,
      error: null,
      celebration: null,
    })
  },

  save: () => {
    const { habits, completions, character, playerState, unlockedEquipment, equipped } = get()
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
    const { playerState: prevState } = get()
    const prevLevel = prevState.nivel
    const prevRank = prevState.rango

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
    get().checkUnlocksAndCelebrate(prevLevel, prevRank)
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
      // Mostrar celebración del primer desbloqueo
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

    // Detectar subida de nivel
    if (prevLevel !== undefined && playerState.nivel > prevLevel) {
      set({
        celebration: {
          type: 'level',
          level: playerState.nivel,
        },
      })
      return
    }

    // Detectar cambio de rango
    if (prevRank !== undefined && playerState.rango !== prevRank) {
      set({
        celebration: {
          type: 'rank',
          rank: playerState.rango,
        },
      })
    }
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
