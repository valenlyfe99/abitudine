import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import type { Category, Frequency } from '../domain/types'

const TONOS_PIEL = ['#f6ede4', '#e0ac69', '#c68642', '#7f4f24', '#4a2f23']
const PEINADOS = ['corto', 'largo', 'rizado', 'rapado', 'trenza']
const COLORES_PELO = ['#000000', '#3e2723', '#5d4037', '#ffeb3b', '#ff9800', '#795548']

export default function Onboarding(): React.ReactElement {
  const navigate = useNavigate()
  const { setCharacter, addHabit } = useAppStore()
  const [step, setStep] = useState<number>(1)
  const [nombre, setNombre] = useState('')
  const [tonoPiel, setTonoPiel] = useState('#d4a373')
  const [peinado, setPeinado] = useState('corto')
  const [colorPelo, setColorPelo] = useState('#000000')
  const [habitNombre, setHabitNombre] = useState('')
  const [habitEmoji, setHabitEmoji] = useState('🎯')
  const [habitColor, setHabitColor] = useState('#3b82f6')
  const [habitCategoria, setHabitCategoria] = useState<Category>('Fuerza')
  const [habitFrecuencia, setHabitFrecuencia] = useState<Frequency>('daily')
  const [habitDias, setHabitDias] = useState<number[]>([])

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const isWeekly = habitFrecuencia === 'weekly'

  const toggleDia = (dia: number) => {
    setHabitDias((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    )
  }

  const goNext = () => {
    if (step === 1) {
      if (!nombre.trim()) return
      setCharacter({ nombre, tonoPiel, peinado, colorPelo })
      setStep(2)
    } else {
      if (!habitNombre.trim()) return
      if (isWeekly && habitDias.length === 0) return
      addHabit({
        nombre: habitNombre,
        emoji: habitEmoji,
        color: habitColor,
        categoria: habitCategoria,
        frecuencia: habitFrecuencia,
        diasSemana: isWeekly ? habitDias : undefined,
        archivado: false,
      })
      navigate('/hoy')
    }
  }

  const step1 = (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Creá tu personaje</h1>
      <p className="text-slate-400 mb-8">Cómo te llamás?</p>

      <div className="mb-8">
        <input
          className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500 mx-auto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-5 gap-3 justify-center mb-8">
        {TONOS_PIEL.map((tono) => (
          <button
            key={tono}
            onClick={() => setTonoPiel(tono)}
            className={`w-12 h-12 rounded-full border-2 transition-all ${
              tonoPiel === tono ? 'ring-2 ring-blue-400' : ''
            } bg-[${tono}]`}
            aria-label={`Tono de piel ${tono}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm text-slate-400">Peinado:</span>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PEINADOS.map((p) => (
            <button
              key={p}
              onClick={() => setPeinado(p)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                peinado === p ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm text-slate-400">Color de pelo:</span>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {COLORES_PELO.map((c) => (
            <button
              key={c}
              onClick={() => setColorPelo(c)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                colorPelo === c ? 'ring-2 ring-white' : ''
              } bg-[${c}]`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={goNext}
        disabled={!nombre.trim()}
        className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
      >
        Continuar
      </button>
    </div>
  )

  const step2 = (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Tu primer hábito</h2>
        <p className="text-slate-400">¿Qué hábito querés empezar a registrar?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Nombre del hábito</label>
          <input
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            value={habitNombre}
            onChange={(e) => setHabitNombre(e.target.value)}
            placeholder="Ej: Leer 10 páginas"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-1">Emoji</label>
            <input
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-xl focus:outline-none focus:border-blue-500"
              value={habitEmoji}
              onChange={(e) => setHabitEmoji(e.target.value)}
              maxLength={2}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-1">Color</label>
            <input
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer"
              type="color"
              value={habitColor}
              onChange={(e) => setHabitColor(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Categoría</label>
          <select
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            value={habitCategoria}
            onChange={(e) => setHabitCategoria(e.target.value as Category)}
          >
            <option value="Fuerza">Fuerza</option>
            <option value="Sabiduría">Sabiduría</option>
            <option value="Vitalidad">Vitalidad</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Frecuencia</label>
          <select
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            value={habitFrecuencia}
            onChange={(e) => setHabitFrecuencia(e.target.value as Frequency)}
          >
            <option value="daily">Todos los días</option>
            <option value="weekly">Días específicos</option>
          </select>
        </div>

        {isWeekly && (
          <div>
            <label className="block text-sm text-slate-400 mb-1">Días de la semana</label>
            <div className="flex gap-2 justify-center">
              {diasSemana.map((nombre, idx) => {
                const selected = habitDias.includes(idx)
                return (
                  <button
                    key={idx}
                    onClick={() => toggleDia(idx)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
                      selected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 border border-slate-600 text-slate-300 hover:text-white'
                    }`}
                  >
                    {nombre}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium"
        >
          Atrás
        </button>
        <button
          onClick={goNext}
          disabled={!habitNombre.trim() || (isWeekly && habitDias.length === 0)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          Empezar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
        {step === 1 ? step1 : step2}
      </div>
    </div>
  )
}
