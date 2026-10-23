import React, { useState } from 'react'
import { useAppStore, useRachaGlobal, useAmuletos } from '../store'
import { calcularMood } from '../domain'

export default function Settings(): React.ReactElement {
  const {
    tema,
    toggleTema,
    exportarDatos,
    importarDatos,
    reiniciarProgreso,
    character,
    playerState,
  } = useAppStore()
  const rachaGlobal = useRachaGlobal()
  const amuletos = useAmuletos()

  const [modalImportar, setModalImportar] = useState<boolean>(false)
  const [modalReiniciar, setModalReiniciar] = useState<boolean>(false)
  const [archivoImportar, setArchivoImportar] = useState<File | null>(null)
  const [errorImportar, setErrorImportar] = useState<string | null>(null)

  const mood = character ? calcularMood(playerState) : 'normal'

  const handleExportar = () => {
    const json = exportarDatos()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `abitudine_export_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleArchivoCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setArchivoImportar(file)
    setErrorImportar(null)
    if (!file) return
    if (!file.name.endsWith('.json')) {
      setErrorImportar('El archivo debe tener extensión .json')
      setArchivoImportar(null)
      return
    }
  }

  const handleImportar = async () => {
    if (!archivoImportar) return
    setErrorImportar(null)
    try {
      const text = await archivoImportar.text()
      importarDatos(text, true)
      setModalImportar(false)
      setArchivoImportar(null)
    } catch {
      setErrorImportar('No se pudo importar el archivo.')
    }
  }

  const handleReiniciar = () => {
    reiniciarProgreso()
    setModalReiniciar(false)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ajustes</h1>
        <p className="text-slate-400">Configuración de tu aventura</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Tema de la app</h2>
            <p className="text-sm text-slate-400">
              Elige entre modo claro u oscuro
            </p>
          </div>
          <button
            onClick={toggleTema}
            className={`w-14 h-7 rounded-full relative transition-colors ${
              tema === 'oscuro' ? 'bg-blue-500' : 'bg-slate-600'
            }`}
            aria-label={tema === 'oscuro' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                tema === 'oscuro' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="text-xs text-slate-500">
          {tema === 'oscuro' ? 'Modo oscuro activado' : 'Modo claro activado'}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Tu personaje</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h3 className="text-white font-medium">{character?.nombre || 'Sin nombre'}</h3>
            <p className="text-sm text-slate-400">
              Nivel {playerState.nivel} — {playerState.rango}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estado de ánimo: {mood}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Racha y amuletos</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Racha global</div>
            <div className="text-2xl font-bold text-white">{rachaGlobal} días</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Amuletos</div>
            <div className="text-2xl font-bold text-yellow-400">{amuletos}</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Respaldar y restaurar</h2>
        <div className="space-y-4">
          <button
            onClick={handleExportar}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            📥 Exportar datos a JSON
          </button>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleArchivoCambio}
              className="hidden"
              id="importar-archivo"
            />
            <button
              onClick={() => {
                setErrorImportar(null)
                setModalImportar(true)
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              📤 Importar desde JSON
            </button>
          </div>
          {errorImportar && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
              {errorImportar}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Zona de peligro</h2>
        <button
          onClick={() => setModalReiniciar(true)}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-medium transition-colors"
        >
          🗑️ Reiniciar todo el progreso
        </button>
      </div>

      {modalImportar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalImportar(false)} />
          <div className="relative z-20 bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Importar datos</h3>
            <p className="text-sm text-slate-400 mb-4">
              Esto reemplazará todo tu progreso actual con los datos del archivo.
            </p>
            {errorImportar && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 mb-4">
                {errorImportar}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setModalImportar(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportar}
                disabled={!archivoImportar}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Importar y reemplazar
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {archivoImportar?.name || 'Ningún archivo seleccionado'}
            </p>
          </div>
        </div>
      )}

      {modalReiniciar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalReiniciar(false)} />
          <div className="relative z-20 bg-slate-900 border-2 border-red-500/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Reiniciar progreso</h3>
            <p className="text-sm text-slate-400 mb-4">
              Se eliminarán todos tus hábitos, cumplimientos, rachas y equipo.
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalReiniciar(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReiniciar}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Sí, reiniciar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


