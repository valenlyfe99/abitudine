import React, { useEffect } from 'react'
import { useAppStore } from '../store'
import { getEquipmentById, rarityColor, rarityLabel } from '../data/equipment'
import type { CelebrationEvent, Slot } from '../domain/types'

interface CelebrationModalProps {
  open: boolean
  onClose: () => void
}

const CONFETTI_COLORS = ['#f59e0b', '#a855f7', '#3b82f6', '#10b981', '#ef4444']

function Confetti(): React.ReactNode {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) return null

  const pieces = Array.from({ length: 30 }, (_, i) => i)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {pieces.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - i * 2}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animation: `confetti-fall ${3 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          to { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
    </div>
  )
}

function getCelebrationTitle(event: CelebrationEvent): string {
  switch (event.type) {
    case 'level':
      return `¡Subiste al nivel ${event.level}!`
    case 'rank':
      return `¡Nuevo rango: ${event.rank}!`
    case 'unlock':
      return '¡Desbloqueaste un nuevo objeto!'
    default:
      return '¡Logro desbloqueado!'
  }
}

function getCelebrationSubtitle(event: CelebrationEvent): string {
  switch (event.type) {
    case 'level':
      return 'Tu personaje se vuelve más fuerte.'
    case 'rank':
      return 'Tu reputación crece en el mundo.'
    case 'unlock':
      return 'Ya podés equiparlo desde el inventario.'
    default:
      return ''
  }
}

export default function CelebrationModal({ open, onClose }: CelebrationModalProps): React.ReactElement | null {
  const { celebration, hideCelebration } = useAppStore()
  const event = celebration

  useEffect(() => {
    if (!open) {
      hideCelebration()
    }
  }, [open, hideCelebration])

  if (!open || !event) return null

  const item = event.itemId ? getEquipmentById(event.itemId) : null
  const isUnlock = event.type === 'unlock' && item
  const canEquip = isUnlock && item

  const isEquipped =
    canEquip &&
    (() => {
      const { equipped } = useAppStore.getState()
      return Object.values(equipped).includes(event.itemId ?? '')
    })()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-20 bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <Confetti />

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-4xl">🎉</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {getCelebrationTitle(event)}
          </h2>
          <p className="text-slate-400 mb-6">{getCelebrationSubtitle(event)}</p>

          {event.type === 'level' && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>Nivel alcanzado</span>
                <span className="text-white font-bold">{event.level}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          )}

          {event.type === 'rank' && (
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl px-4 py-3 mb-6">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Nuevo rango</span>
                <span className="text-purple-400 font-bold">{event.rank}</span>
              </div>
            </div>
          )}

          {isUnlock && item && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded flex-shrink-0 ${rarityColor(item.rareza)}`}
                />
                <div>
                  <div className="text-sm font-medium text-white">{item.nombre}</div>
                  <div className="text-xs text-slate-400 capitalize">
                    {rarityLabel(item.rareza)} • {item.ranura}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {canEquip && !isEquipped && (
              <button
                onClick={() => {
                  const slot = item.ranura
                  const { equipItem, hideCelebration: hide } = useAppStore.getState()
                  equipItem(slot as Slot, item.id)
                  hide()
                  onClose()
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Equipar ahora
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Seguir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
