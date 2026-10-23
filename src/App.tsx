import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Today from './pages/Today'
import Habits from './pages/Habits'
import Progress from './pages/Progress'
import Inventory from './pages/Inventory'
import DevPersonaje from './pages/DevPersonaje'
import Settings from './pages/Settings'
import Nav from './components/Nav'
import InstallPrompt from './components/InstallPrompt'
import UpdateAvailable from './components/UpdateAvailable'
import { useAppStore } from './store'

function App(): React.ReactElement {
  const { character, isLoading, error, init } = useAppStore()

  React.useEffect(() => {
    init()
  }, [init])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-red-400 font-bold mb-2">Error de almacenamiento</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Empezar de nuevo
        </button>
      </div>
    )
  }

  if (!character) {
    return (
      <>
        <Onboarding />
        <InstallPrompt />
        <UpdateAvailable />
      </>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Nav />
        <main className="flex-1 md:pl-64 pb-20 md:pb-0 relative z-10">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/hoy" element={<Today />} />
            <Route path="/habitos" element={<Habits />} />
            <Route path="/progreso" element={<Progress />} />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/ajustes" element={<Settings />} />
            <Route path="/dev/personaje" element={<DevPersonaje />} />
          </Routes>
        </main>
        <InstallPrompt />
        <UpdateAvailable />
      </div>
    </BrowserRouter>
  )
}

export default App
