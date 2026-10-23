import React, { useEffect } from 'react'
import { useAppStore, useTodayHabits, isHabitCompletedToday } from '../store'
import { hoyLocal, calcularMood } from '../domain'
import Personaje from '../components/character/Personaje'
import CelebrationModal from '../components/CelebrationModal'

export default function Today(): React.ReactElement {
  const { character, playerState, toggleCompletion, celebration, hideCelebration } = useAppStore()
  const todayHabits = useTodayHabits()
  const today = hoyLocal()

  const completedCount = todayHabits.filter((h) => isHabitCompletedToday(h.id)).length
  const totalCount = todayHabits.length

  const mood = character ? calcularMood(playerState) : 'normal'

  useEffect(() => {
    const checkDayChange = () => {
      const store = useAppStore.getState()
      if (store.playerState.ultimaActualizacion && store.playerState.ultimaActualizacion !== today) {
        store.recalculate()
      }
    }
    checkDayChange()
    const interval = setInterval(checkDayChange, 60000)
    return () => clearInterval(interval)
  }, [today])

  const xpProgress = playerState.xp % 100

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="p-4 border-b border-slate-700 bg-slate-900/80 backdrop-blur">
        <h1 className="text-2xl font-bold text-white">Hoy</h1>
        <p className="text-slate-400">{today}</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Personaje + info */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-40 h-56 flex-shrink-0">
          {character && <Personaje character={character} mood={mood} size={180} className="mx-auto" />}
        </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{character?.nombre || 'Aventurero'}</h2>
            <p className="text-slate-400">Nivel {playerState.nivel} — {playerState.rango}</p>
            <p className="text-xs text-slate-500 mt-1">Estado de ánimo: {mood}</p>
          </div>
        </div>

        {/* Barra de XP */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Experiencia</span>
            <span>{playerState.xp} XP</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, xpProgress)}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {xpProgress}/100 al siguiente nivel
          </div>
        </div>

        {/* Racha global */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Racha global</div>
            <div className="text-2xl font-bold text-white">{playerState.rachaGlobal} días</div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-slate-400">
            <span>{playerState.amuletos}</span>
            <span>amuletos</span>
          </div>
        </div>

        {/* Checklist de hábitos */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Hábitos de hoy</h3>
            <span className="text-sm text-slate-400">{completedCount} / {totalCount}</span>
          </div>

          {totalCount === 0 ? (
            <p className="text-slate-400 text-center py-8">No tenés hábitos programados para hoy.</p>
          ) : (
            <div className="space-y-3">
              {todayHabits.map((habit) => {
                const done = isHabitCompletedToday(habit.id)
                return (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      done
                        ? 'bg-slate-700/50 border-green-500/30'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{habit.emoji}</span>
                    <div className="flex-1">
                      <div className={`text-white font-medium ${done ? 'line-through text-slate-500' : ''}`}>
                        {habit.nombre}
                      </div>
                      <div className="text-xs text-slate-500">{habit.categoria}</div>
                    </div>
                    <button
                      onClick={() => toggleCompletion(habit.id, today)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        done
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                      }`}
                      aria-label={done ? 'Desmarcar cumplimiento' : 'Marcar cumplimiento'}
                    >
                      {done ? '✔' : '○'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {celebration && (
        <CelebrationModal open={true} onClose={() => hideCelebration()} />
      )}
    </div>
  )
}
