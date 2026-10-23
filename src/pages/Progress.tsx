import React, { useState } from 'react'
import {
  useAppStore,
  useTodayHabits,
  isHabitCompletedToday,
  useRachaGlobal,
  useAmuletos,
} from '../store'
import {
  hoyLocal,
  sumarDias,
  habitoCorresponde,
} from '../domain'
import type { Habit } from '../domain/types'

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function Progress(): React.ReactElement {
  const {
    habits,
    completions,
    playerState,
    toggleCompletion,
  } = useAppStore()
  const todayHabits = useTodayHabits()
  const today = hoyLocal()
  const rachaGlobal = useRachaGlobal()
  const amuletos = useAmuletos()

  const [anoMes, setAnoMes] = useState<string>(today.slice(0, 7))

  const [ano, mes] = anoMes.split('-').map(Number)
  const fechaMesInicio = `${ano}-${String(mes).padStart(2, '0')}-01`

  const diasDelMes: string[] = []
  let actual = fechaMesInicio
  while (actual.startsWith(anoMes)) {
    diasDelMes.push(actual)
    actual = sumarDias(actual, 1)
  }

  const primerDia = new Date(`${anoMes}-01`)
  const diaSemanaPrimer = primerDia.getDay()

  const diasPrevios: number[] = []
  for (let i = 0; i < diaSemanaPrimer; i++) {
    diasPrevios.push(i)
  }

  const estaEnRangoCorreccion = (fecha: string): boolean => {
    const haceSieteDias = sumarDias(today, -7)
    return fecha >= haceSieteDias && fecha <= today
  }

  const estaCumplidoEn = (habitId: string, fecha: string): boolean => {
    return completions.some((c) => c.habitId === habitId && c.fecha === fecha)
  }

  const habitsParaFecha = (fecha: string): Habit[] => {
    return habits.filter((h) => !h.archivado && habitoCorresponde(h, fecha))
  }

  const cumplimientosEnFecha = (fecha: string): number => {
    const hs = habitsParaFecha(fecha)
    return hs.filter((h) => estaCumplidoEn(h.id, fecha)).length
  }

  const totalHabitsEnFecha = (fecha: string): number => {
    return habitsParaFecha(fecha).length
  }

  const rachasPorHabito = Object.entries(playerState.rachasPorHabito).map(
    ([habitId, racha]) => {
      const habit = habits.find((h) => h.id === habitId)
      return {
        id: habitId,
        nombre: habit?.nombre ?? 'Desconocido',
        emoji: habit?.emoji ?? '?',
        categoria: habit?.categoria ?? 'Fuerza',
        ...racha,
      }
    }
  )

  const xpProgreso = playerState.xp % 100

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Progreso</h1>
          <p className="text-slate-400">Tu evolución como aventurero</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const [a, m] = anoMes.split('-').map(Number)
              const nuevoMes = m - 1 <= 0 ? 12 : m - 1
              const nuevoAno = m - 1 <= 0 ? a - 1 : a
              setAnoMes(`${nuevoAno}-${String(nuevoMes).padStart(2, '0')}`)
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            ←
          </button>
          <span className="text-slate-400 text-sm">{anoMes}</span>
          <button
            onClick={() => {
              const [a, m] = anoMes.split('-').map(Number)
              const nuevoMes = m + 1 > 12 ? 1 : m + 1
              const nuevoAno = m + 1 > 12 ? a + 1 : a
              setAnoMes(`${nuevoAno}-${String(nuevoMes).padStart(2, '0')}`)
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Nivel</div>
          <div className="text-2xl font-bold text-white">{playerState.nivel}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Rango</div>
          <div className="text-xl font-bold text-blue-400">{playerState.rango}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Racha global</div>
          <div className="text-2xl font-bold text-white">{rachaGlobal} días</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Amuletos</div>
          <div className="text-2xl font-bold text-yellow-400">{amuletos}</div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Experiencia</span>
          <span>{playerState.xp} XP</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, xpProgreso)}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {xpProgreso}/100 al siguiente nivel
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Atributos</div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(playerState.atributos).map(([categoria, valor]) => (
            <div key={categoria} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                <span className="text-xs font-bold">
                  {categoria === 'Fuerza' ? '💪' : categoria === 'Sabiduría' ? '📚' : '💧'}
                </span>
              </div>
              <div className="text-sm font-medium text-white">{categoria}</div>
              <div className="text-xs text-slate-400">{valor} pt</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Rachas por hábito</h3>
          <span className="text-xs text-slate-400">Actual / Mejor</span>
        </div>
        {rachasPorHabito.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No hay rachas registradas.</p>
        ) : (
          <div className="space-y-3">
            {rachasPorHabito.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r.emoji}</span>
                  <div>
                    <div className="text-sm text-white font-medium">{r.nombre}</div>
                    <div className="text-xs text-slate-500 capitalize">{r.categoria}</div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm font-mono">
                  <span className="text-green-400">{r.actual}</span>
                  <span className="text-slate-400">/ {r.mejor}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Calendario mensual</h3>
          <span className="text-xs text-slate-400">
            Hacé clic en un día para marcar/desmarcar (últimos 7 días)
          </span>
        </div>

        <div className="grid grid-cols-7 text-center mb-2">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="text-xs text-slate-500 font-medium">{dia}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {diasPrevios.map((_, i) => (
            <div key={`prev-${i}`} className="aspect-square" />
          ))}

          {diasDelMes.map((fecha) => {
            const diaNum = parseInt(fecha.slice(8), 10)
            const totalHabits = totalHabitsEnFecha(fecha)
            const cumplidos = cumplimientosEnFecha(fecha)
            const esHoy = fecha === today
            const enRangoCorreccion = estaEnRangoCorreccion(fecha)
            const porcentaje = totalHabits > 0 ? (cumplidos / totalHabits) * 100 : 0

            return (
              <div
                key={fecha}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                  esHoy ? 'ring-2 ring-blue-500' : ''
                } ${porcentaje === 100 && totalHabits > 0 ? 'bg-green-500/20' : ''} ${porcentaje > 0 && porcentaje < 100 ? 'bg-blue-500/10' : ''} ${!enRangoCorreccion ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}`}
                onClick={
                  enRangoCorreccion
                    ? () => {
                        const hs = habitsParaFecha(fecha)
                        hs.forEach((h) => {
                          toggleCompletion(h.id, fecha)
                        })
                      }
                    : undefined
                }
                aria-label={`Día ${diaNum}: ${cumplidos}/${totalHabits} hábitos cumplidos`}
              >
                <div className="text-xs font-medium text-white">{diaNum}</div>
                {totalHabits > 0 && (
                  <div className="w-2 h-2 rounded-full mt-1">
                    {porcentaje === 100 ? (
                      <div className="bg-green-400" />
                    ) : porcentaje > 0 ? (
                      <div className="bg-blue-400" />
                    ) : (
                      <div className="bg-slate-700" />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-3 text-xs text-slate-400">
          🟢 Completado • 🔵 Parcial • ⚪ Sin hábitos • Solo los últimos 7 días se pueden editar
        </div>
      </div>

      <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Hábitos de hoy</h3>
        {todayHabits.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No hay hábitos programados para hoy.</p>
        ) : (
          <div className="space-y-3">
            {todayHabits.map((habit) => {
              const done = isHabitCompletedToday(habit.id)
              return (
                <div
                  key={habit.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    done ? 'bg-slate-700/50 border-green-500/30' : 'bg-slate-800 border-slate-700'
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
    </div>
  )
}

