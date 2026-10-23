declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    immediate?: boolean
    onRegisterError?: (err: Error) => void
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onUpdated?: (sw: ServiceWorker) => void
  }): (opts: { needRefresh: boolean }) => void
}
