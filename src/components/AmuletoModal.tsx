import React from 'react'
import { useAppStore } from '../store'

export default function AmuletoModal(): React.ReactElement | null {
  const { pendingAmuleto, usarAmuleto, rechazarAmuleto } = useAppStore()
  const { amuletos: amuletosActuales } = useAppStore().playerState

  if (!pendingAmuleto) return null

  const amuletosRestantes = Math.max(0, amuletosActuales - 1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={rechazarAmuleto} />
      <div className="relative z-20 bg-slate-900 border-2 border-orange-500/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">ðŸ”®</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Â¿Usar un amuleto de racha?
          </h2>
          <p className="text-slate-400 mb-6">
            Al desmarcar este hÃ¡bito se romperÃ­a tu racha global. TenÃ©s
            <span className="text-white font-bold">{amuletosActuales}</span>
            amulete{amuletosActuales !== 1 ? 's' : ''}. Â¿QuerÃ©s usar uno para
            mantener la racha?
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">Amuletos despuÃ©s de usar:</span>
              <span className="text-sm font-mono text-white">{amuletosRestantes}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={rechazarAmuleto}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              No, dejar que se rompa
            </button>
            <button
              onClick={usarAmuleto}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              SÃ­, usar amuleto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
