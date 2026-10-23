import { useEffect, useState, useCallback } from 'react'

export interface InstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIosHint, setShowIosHint] = useState(false)

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as Record<string, unknown>)['standalone'] === true)
  const isSafariIOS =
    isIOS && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)

  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as InstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  // Mostrar aviso iOS después de 3 segundos
  useEffect(() => {
    if (!isSafariIOS || isStandalone) return

    const timer = setTimeout(() => setShowIosHint(true), 3000)
    return () => clearTimeout(timer)
  }, [isSafariIOS, isStandalone])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    const accepted = outcome === 'accepted'
    if (accepted) setIsInstalled(true)
    setDeferredPrompt(null)
    return accepted
  }, [deferredPrompt])

  const dismissIosHint = useCallback(() => {
    setShowIosHint(false)
  }, [])

  return {
    deferredPrompt,
    isInstalled,
    showIosHint,
    isIOS,
    isSafariIOS,
    install,
    dismissIosHint,
  }
}
