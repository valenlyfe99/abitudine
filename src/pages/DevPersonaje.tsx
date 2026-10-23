import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Personaje from '../components/character/Personaje'
import { calcularMood } from '../domain/mood'
import type { Character, Mood, PlayerState, Slot } from '../domain/types'
import { HAIRSTYLES } from '../config/character'

const TONOS_PIEL = ['#f6ede4', '#e0ac69', '#c68642', '#7f4f24', '#4a2f23']
const COLORES_PELO = ['#000000', '#3e2723', '#5d4037', '#ffeb3b', '#ff9800', '#795548']
const MOODS: Mood[] = ['orgulloso', 'normal', 'cansado']

const SLOTS: Slot[] = ['casco', 'armadura', 'arma', 'escudo', 'capa', 'accesorio']

function defaultCharacter(): Character {
  return {
    id: 'char_1',
    nombre: 'Aventurero',
    tonoPiel: '#d4a373',
    peinado: 'corto',
    colorPelo: '#000000',
    equipado: { casco: null, armadura: null, arma: null, escudo: null, capa: null, accesorio: null },
    mood: 'normal',
  }
}

export default function DevPersonaje(): React.ReactElement {
  const [character, setCharacter] = useState<Character>(defaultCharacter())
  const [mood, setMood] = useState<Mood>('normal')
  const [size, setSize] = useState(200)

  const playerState: PlayerState = {
    xp: mood === 'orgulloso' ? 500 : mood === 'cansado' ? 10 : 100,
    nivel: mood === 'orgulloso' ? 6 : mood === 'cansado' ? 1 : 3,
    rango: mood === 'orgulloso' ? 'Héroe' : mood === 'cansado' ? 'Aldeano' : 'Aprendiz',
    atributos: { Fuerza: 0, Sabiduría: 0, Vitalidad: 0 },
    rachaGlobal: mood === 'orgulloso' ? 10 : mood === 'cansado' ? 0 : 5,
    rachaGlobalMax: 10,
    amuletos: 0,
    rachasPorHabito: {},
    ultimaActualizacion: '',
  }

  const calculatedMood = calcularMood(playerState)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🎨 Dev: Personaje</h1>
          <p className="text-slate-400 text-sm">Probá combinaciones de capas, peinados, colores y estados de ánimo.</p>
        </div>
        <Link to="/hoy" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Volver a Hoy
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Personaje</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nombre</label>
                  <input
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                    value={character.nombre}
                    onChange={(e) => setCharacter({ ...character, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tono de piel</label>
                  <div className="flex gap-2">
                    {TONOS_PIEL.map((tono) => (
                      <button
                        key={tono}
                        onClick={() => setCharacter({ ...character, tonoPiel: tono })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          character.tonoPiel === tono ? 'ring-2 ring-white' : ''
                        } bg-[${tono}]`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Peinado</label>
                  <div className="flex gap-2">
                    {Object.entries(HAIRSTYLES).map(([id, { label }]) => (
                      <button
                        key={id}
                        onClick={() => setCharacter({ ...character, peinado: id })}
                        className={`px-3 py-1.5 rounded text-xs transition-all ${
                          character.peinado === id ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Color de pelo</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORES_PELO.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCharacter({ ...character, colorPelo: color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          character.colorPelo === color ? 'ring-2 ring-white' : ''
                        } bg-[${color}]`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Estado de ánimo</h3>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 rounded text-xs transition-all ${
                      mood === m ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Calculado: <span className="text-white font-mono">{calculatedMood}</span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Equipamiento</h3>
              <div className="space-y-3">
                {SLOTS.map((slot: Slot) => {
                  const equipped = character.equipado[slot]
                  return (
                    <div key={slot} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{slot}</span>
                      <button
                        onClick={() => {
                          const newEquipado = { ...character.equipado, [slot]: equipped ? null : `eq_${slot}_1` }
                          setCharacter({ ...character, equipado: newEquipado })
                        }}
                        className={`w-6 h-6 rounded border transition-all ${
                          equipped ? 'bg-blue-500 border-blue-500' : 'bg-slate-900 border-slate-600'
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Tamaño</h3>
              <input
                type="range"
                min="100"
                max="400"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <span className="text-xs text-slate-500 block mt-1 text-center">{size}px</span>
            </div>

            <button
              onClick={() => {
                setCharacter(defaultCharacter())
                setMood('normal')
                setSize(200)
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg transition-colors"
            >
              Resetear
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-9 flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-xs">Estado calculado:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-mono ${
                calculatedMood === 'orgulloso'
                  ? 'bg-green-900/30 text-green-400 border border-green-700'
                  : calculatedMood === 'cansado'
                    ? 'bg-orange-900/30 text-orange-400 border border-orange-700'
                    : 'bg-slate-900/30 text-slate-400 border border-slate-700'
              }`}
            >
              {calculatedMood}
            </span>
          </div>
          <div className="mt-8 bg-slate-900/50 border border-slate-700 rounded-2xl p-4">
            <Personaje character={character} mood={calculatedMood} size={size} />
          </div>
          <div className="mt-4 text-slate-500 text-sm text-center">
            Capas renderizadas: casco, armadura, arma, escudo, capa, accesorio
          </div>
        </div>
      </div>
    </div>
  )
}
