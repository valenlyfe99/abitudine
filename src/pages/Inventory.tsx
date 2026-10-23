import React from 'react'

export default function Inventory(): React.ReactElement {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Inventario</h1>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-400">Tu equipamiento próximamente</p>
      </div>
    </div>
  )
}
