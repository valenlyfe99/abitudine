import React from 'react'
import { usePWA } from '../hooks/usePWA'

export default function InstallPrompt(): React.ReactElement | null {
  const { deferredPrompt, isInstalled, isSafariIOS, install, dismissIosHint } = usePWA()

  if (isInstalled) return null

  const handleInstall = async () => {
    await install()
  }

  return (
    <>
      {!isSafariIOS && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-50">
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg font-medium transition-colors"
          >
            <span>??</span>
            <span>Instalar app</span>
          </button>
        </div>
      )}
      {isSafariIOS && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-50">
          <div className="bg-amber-500/90 text-white px-4 py-3 rounded-xl shadow-lg font-medium flex items-center gap-2">
            <span>??</span>
            <span>Compartir ? Agregar a pantalla de inicio</span>
            <button
              onClick={dismissIosHint}
              className="ml-auto text-white/80 hover:text-white"
              aria-label="Cerrar aviso"
            >
              ?
            </button>
          </div>
        </div>
      )}
    </>
  )
}
