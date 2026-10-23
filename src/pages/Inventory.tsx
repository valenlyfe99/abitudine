import React, { useState } from 'react'
import { useAppStore, useIsItemUnlocked } from '../store'
import {
  EQUIPMENT,
  getEquipmentById,
  getEquipmentBySlot,
  rarityColor,
  rarityLabel,
} from '../data/equipment'
import { puedeDesbloquear } from '../domain/unlocks'
import type { Slot } from '../domain/types'

const SLOTS: Slot[] = ['casco', 'armadura', 'arma', 'escudo', 'capa', 'accesorio']
const SLOT_LABELS: Record<Slot, string> = {
  casco: 'Casco',
  armadura: 'Armadura',
  arma: 'Arma',
  escudo: 'Escudo',
  capa: 'Capa',
  accesorio: 'Accesorio',
}

export default function Inventory(): React.ReactElement {
  const { equipped, unequipItem, equipItem, playerState } = useAppStore()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const conditionText = (item: { condicion: { tipo: string; valor: number; atributo?: string } }): string => {
    const { condicion } = item
    switch (condicion.tipo) {
      case 'nivel':
        return `Nivel ${condicion.valor}`
      case 'racha':
        return `Racha global ${condicion.valor} días`
      case 'atributo':
        return `${condicion.atributo} ${condicion.valor}+`
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventario</h1>
          <p className="text-slate-400">
            Tu equipamiento. Equipá lo que hayas desbloqueado.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-slate-400 text-sm">Nivel {playerState.nivel}</div>
          <div className="text-white font-bold">{playerState.rango}</div>
        </div>
      </div>

      {selectedSlot && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSelectedSlot(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Volver al inventario
            </button>
            <h2 className="text-xl font-semibold text-white">
              {SLOT_LABELS[selectedSlot]}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getEquipmentBySlot(selectedSlot).map((item) => {
              const isUnlocked = useIsItemUnlocked(item.id)
              const isEquipped = equipped[selectedSlot] === item.id
              const canUnlock = puedeDesbloquear(item, playerState)

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isEquipped
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : isUnlocked
                        ? 'bg-slate-700/50 border-slate-500 hover:border-blue-400 hover:bg-slate-700 cursor-pointer'
                        : 'bg-slate-800/30 border-slate-700/50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={
                    isUnlocked && !isEquipped
                      ? () => equipItem(selectedSlot, item.id)
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${rarityColor(item.rareza)}`}
                    />
                    {isEquipped && (
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        equipado
                      </span>
                    )}
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center mb-2">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 200 200"
                      className="drop-shadow-md"
                    >
                      <path d={item.svgPath} fill={item.svgFill ?? rarityColor(item.rareza)} />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">
                    {item.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mb-2 capitalize">
                    {rarityLabel(item.rareza)}
                  </p>
                  {isUnlocked ? (
                    <p className="text-xs text-green-400">
                      {isEquipped ? 'Equipado' : 'Hacé clic para equipar'}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[10px]">
                        🔒
                      </span>
                      <span className="text-xs text-slate-400">
                        {conditionText(item)}
                        {!canUnlock ? ' · pronto' : ' · listo para desbloquear'}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!selectedSlot && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SLOTS.map((slot) => {
            const equippedId = equipped[slot]
            const equippedItem = equippedId ? getEquipmentById(equippedId) : null
            const unlockedItems = EQUIPMENT.filter(
              (i) => i.ranura === slot && useIsItemUnlocked(i.id)
            )
            const lockedItems = EQUIPMENT.filter(
              (i) => i.ranura === slot && !useIsItemUnlocked(i.id)
            )

            return (
              <div
                key={slot}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => setSelectedSlot(slot)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    {SLOT_LABELS[slot]}
                  </h3>
                  {equippedItem && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        rarityColor(equippedItem.rareza)
                      }/20 text-${rarityColor(equippedItem.rareza)}`}
                    >
                      {rarityLabel(equippedItem.rareza)}
                    </span>
                  )}
                </div>

                <div className="h-20 flex items-center justify-center mb-3">
                  {equippedItem ? (
                    <svg width="40" height="40" viewBox="0 0 200 200" className="drop-shadow-lg">
                      <path d={equippedItem.svgPath} fill={equippedItem.svgFill ?? rarityColor(equippedItem.rareza)} />
                    </svg>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-xs">
                      —
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  {equippedItem ? (
                    <>
                      <div className="text-xs text-white font-medium truncate">
                        {equippedItem.nombre}
                      </div>
                      <button
                        onClick={() => unequipItem(slot)}
                        className="mt-1 text-xs text-slate-400 hover:text-red-400 transition-colors underline"
                      >
                        Desequipar
                      </button>
                    </>
                  ) : unlockedItems.length > 0 ? (
                    <>
                      <div className="text-xs text-green-400 font-medium">
                        {unlockedItems.length} disponible(s)
                      </div>
                      <button
                        onClick={() => {
                          const first = unlockedItems[0]
                          if (first) equipItem(slot, first.id)
                        }}
                        className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors underline"
                      >
                        Equipar
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500">Sin items</div>
                  )}

                  {lockedItems.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-slate-500 mb-1">Bloqueados:</div>
                      {lockedItems.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-1 text-xs text-slate-500">
                          <span className="w-3 h-3 rounded-full bg-slate-600 flex items-center justify-center text-[10px]">
                            🔒
                          </span>
                          <span className="truncate">{item.nombre}</span>
                        </div>
                      ))}
                      {lockedItems.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{lockedItems.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
