import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/hoy', label: 'Hoy', icon: '☀️' },
  { path: '/habitos', label: 'Hábitos', icon: '📋' },
  { path: '/progreso', label: 'Progreso', icon: '📊' },
  { path: '/inventario', label: 'Inventario', icon: '🎒' },
  { path: '/ajustes', label: 'Ajustes', icon: '⚙️' },
]

export default function Nav(): React.ReactElement {
  const location = useLocation()

  const isActive = (path: string): boolean => {
    if (path === '/hoy') return location.pathname === '/' || location.pathname === '/hoy'
    return location.pathname === path
  }

  return (
    <>
      {/* Nav lateral (escritorio) */}
      <nav className="hidden md:flex fixed inset-y-0 left-0 w-64 border-r border-slate-700 bg-slate-900 z-40 flex-col">
        <div className="p-6 flex-shrink-0">
          <div className="text-xl font-bold text-white mb-8 tracking-tight">Abitudine</div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Nav inferior (celular) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-700 bg-slate-900/95 backdrop-blur-md z-40">
        <div className="flex justify-around px-2 py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
