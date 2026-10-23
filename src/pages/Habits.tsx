import React, { useState } from 'react'
import { useAppStore } from '../store'
import type { Category, Frequency, Habit } from '../domain/types'

export default function Habits(): React.ReactElement {
  const { habits, addHabit, editHabit, archiveHabit, deleteHabit, restoreHabit } = useAppStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    nombre: string
    emoji: string
    color: string
    categoria: Category
    frecuencia: Frequency
    diasSemana: number[]
  }>({
    nombre: '',
    emoji: '🎯',
    color: '#3b82f6',
    categoria: 'Fuerza',
    frecuencia: 'daily',
    diasSemana: [],
  })

  const openCreate = () => {
    setEditingId(null)
    setFormData({
      nombre: '',
      emoji: '🎯',
      color: '#3b82f6',
      categoria: 'Fuerza',
      frecuencia: 'daily',
      diasSemana: [],
    })
    setFormOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditingId(habit.id)
    setFormData({
      nombre: habit.nombre,
      emoji: habit.emoji,
      color: habit.color,
      categoria: habit.categoria,
      frecuencia: habit.frecuencia,
      diasSemana: habit.diasSemana || [],
    })
    setFormOpen(true)
  }

  const toggleDia = (dia: number) => {
    setFormData((prev) =>
      prev.diasSemana.includes(dia)
        ? { ...prev, diasSemana: prev.diasSemana.filter((d) => d !== dia) }
        : { ...prev, diasSemana: [...prev.diasSemana, dia] }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre.trim()) return
    if (formData.frecuencia === 'weekly' && formData.diasSemana.length === 0) return

    if (editingId) {
      editHabit(editingId, {
        nombre: formData.nombre,
        emoji: formData.emoji,
        color: formData.color,
        categoria: formData.categoria,
        frecuencia: formData.frecuencia,
        diasSemana: formData.frecuencia === 'weekly' ? formData.diasSemana : undefined,
      })
    } else {
      addHabit({
        nombre: formData.nombre,
        emoji: formData.emoji,
        color: formData.color,
        categoria: formData.categoria,
        frecuencia: formData.frecuencia,
        diasSemana: formData.frecuencia === 'weekly' ? formData.diasSemana : undefined,
        archivado: false,
      })
    }
    setFormOpen(false)
  }

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const activeHabits = habits.filter((h) => !h.archivado)
  const archivedHabits = habits.filter((h) => h.archivado)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Hábitos</h1>
        <button
          onClick={openCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nuevo hábito
        </button>
      </div>

      {activeHabits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Activos</h2>
          <div className="space-y-3">
            {activeHabits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{habit.nombre}</div>
                  <div className="text-xs text-slate-400 truncate">
                    {habit.categoria} • {habit.frecuencia === 'daily' ? 'Diario' : 'Semanal'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(habit)}
                    className="text-slate-300 hover:text-blue-400 p-1"
                    aria-label="Editar hábito"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => archiveHabit(habit.id)}
                    className="text-slate-500 hover:text-orange-400 p-1"
                    aria-label="Archivar hábito"
                  >
                    📦
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    aria-label="Eliminar hábito"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {archivedHabits.length > 0 && (
        <div className="border-t border-slate-700 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Archivados</h2>
          <div className="space-y-3">
            {archivedHabits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 opacity-70">
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-300 truncate">{habit.nombre}</div>
                  <div className="text-xs text-slate-500">Archivado</div>
                </div>
                <button
                  onClick={() => restoreHabit(habit.id)}
                  className="text-slate-300 hover:text-blue-400 p-1"
                  aria-label="Restaurar hábito"
                >
                  ♻️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeHabits.length === 0 && archivedHabits.length === 0) && (
        <div className="text-center py-20">
          <p className="text-slate-400">No tenés hábitos aún. Creá tu primero.</p>
        </div>
      )}

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Editar hábito' : 'Nuevo hábito'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nombre</label>
                  <input
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm text-slate-400 mb-1">Emoji</label>
                    <input
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-slate-400 mb-1">Color</label>
                    <input
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Categoría</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as Category })}
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
                    value={formData.frecuencia}
                    onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value as Frequency })}
                  >
                    <option value="daily">Todos los días</option>
                    <option value="weekly">Días específicos</option>
                  </select>
                </div>
                {formData.frecuencia === 'weekly' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Días de la semana</label>
                    <div className="flex gap-2 justify-center">
                      {diasSemana.map((nombre, idx) => {
                        const selected = formData.diasSemana.includes(idx)
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
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
