import React, { useCallback, useEffect, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

export default function UpdateAvailable(): React.ReactElement | null {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  const registerSWCallback = useCallback(
    ({ needRefresh }: { needRefresh: boolean }) => {
      setUpdateAvailable(needRefresh)
    },
    []
  )

  useEffect(() => {
    registerSW({
      immediate: true,
      onRegisterError: (err: Error) => {
        console.warn('Error registrando service worker:', err)
      },
      onNeedRefresh: () => {
        setUpdateAvailable(true)
      },
      onOfflineReady: () => {},
    })
  }, [registerSWCallback])

  const handleUpdate = () => {
    registerSWCallback({ needRefresh: true })
    window.location.reload()
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-50">
      <div className="bg-green-500/90 text-white px-4 py-3 rounded-xl shadow-lg font-medium flex items-center gap-2">
        <span>??</span>
        <span>Nueva versión disponible</span>
        <button
          onClick={handleUpdate}
          className="ml-auto bg-white text-green-600 px-3 py-1 rounded text-sm font-bold hover:bg-green-100"
        >
          Actualizar
        </button>
      </div>
    </div>
  )
}
