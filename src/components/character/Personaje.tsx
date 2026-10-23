import React from 'react'
import type { Character, Mood, Slot } from '../../domain/types'
import {
  CHARACTER_LAYERS,
  CHARACTER_CX,
  CHARACTER_CY,
} from '../../config/character'
import { getEquipmentById } from '../../data/equipment'

interface PersonajeProps {
  character: Character
  mood: Mood
  size?: number
  className?: string
}

interface MoodVisuals {
  offsetY: number
  eyeOpen: boolean
  smile: boolean
}

function moodVisuals(mood: Mood): MoodVisuals {
  switch (mood) {
    case 'orgulloso':
      return { offsetY: -4, eyeOpen: true, smile: true }
    case 'cansado':
      return { offsetY: 2, eyeOpen: false, smile: false }
    default:
      return { offsetY: 0, eyeOpen: true, smile: false }
  }
}

function hairPath(peinado: string, colorPelo: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY - 28

  switch (peinado) {
    case 'corto':
      return (
        <g id="pelo" className="layer-pelo">
          <path
            d={`M ${cx - 24} ${cy - 2} Q ${cx - 12} ${cy - 20} ${cx} ${cy - 14} Q ${cx + 12} ${cy - 20} ${cx + 24} ${cy - 2} L ${cx + 24} ${cy + 10} L ${cx - 24} ${cy + 10} Z`}
            fill={colorPelo}
          />
          <path
            d={`M ${cx - 6} ${cy - 16} Q ${cx} ${cy - 26} ${cx + 6} ${cy - 16}`}
            fill={colorPelo}
          />
        </g>
      )
    case 'largo':
      return (
        <g id="pelo" className="layer-pelo">
          <path
            d={`M ${cx - 20} ${cy - 4} Q ${cx - 8} ${cy - 22} ${cx} ${cy - 16} Q ${cx + 8} ${cy - 22} ${cx + 20} ${cy - 4} L ${cx + 20} ${cy + 40} Q ${cx + 10} ${cy + 44} ${cx} ${cy + 40} Q ${cx - 10} ${cy + 44} ${cx - 20} ${cy + 40} L ${cx - 20} ${cy - 4} Z`}
            fill={colorPelo}
          />
        </g>
      )
    case 'rizado':
      return (
        <g id="pelo" className="layer-pelo">
          <path
            d={`M ${cx - 22} ${cy - 2} Q ${cx - 10} ${cy - 18} ${cx} ${cy - 14} Q ${cx + 10} ${cy - 18} ${cx + 22} ${cy - 2} L ${cx + 22} ${cy + 8} L ${cx - 22} ${cy + 8} Z`}
            fill={colorPelo}
          />
          <circle cx={cx - 10} cy={cy - 10} r={6} fill={colorPelo} />
          <circle cx={cx + 10} cy={cy - 10} r={6} fill={colorPelo} />
          <circle cx={cx} cy={cy - 16} r={6} fill={colorPelo} />
        </g>
      )
    case 'rapado':
      return (
        <g id="pelo" className="layer-pelo">
          <path
            d={`M ${cx - 14} ${cy + 4} Q ${cx} ${cy - 6} ${cx + 14} ${cy + 4} L ${cx + 14} ${cy + 10} L ${cx - 14} ${cy + 10} Z`}
            fill={colorPelo}
          />
        </g>
      )
    default:
      return (
        <g id="pelo" className="layer-pelo">
          <path
            d={`M ${cx - 20} ${cy} Q ${cx} ${cy - 16} ${cx + 20} ${cy} L ${cx + 20} ${cy + 8} L ${cx - 20} ${cy + 8} Z`}
            fill={colorPelo}
          />
        </g>
      )
  }
}

function body(tonoPiel: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="cuerpo" className="layer-cuerpo">
      <circle cx={cx} cy={cy - 32} r={22} fill={tonoPiel} />
      <path
        d={`M ${cx - 18} ${cy - 12} Q ${cx - 18} ${cy - 28} ${cx} ${cy - 30} Q ${cx + 18} ${cy - 28} ${cx + 18} ${cy - 12} L ${cx + 14} ${cy + 34} L ${cx - 14} ${cy + 34} Z`}
        fill={tonoPiel}
      />
    </g>
  )
}

function face(mood: Mood, tonoPiel: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY - 32
  const v = moodVisuals(mood)

  const eyeY = v.eyeOpen ? cy - 2 : cy + 1
  const eyeHeight = v.eyeOpen ? 6 : 2
  const mouthY = v.smile ? cy + 6 : cy + 4
  const mouthD = v.smile
    ? `M ${cx - 4} ${mouthY} Q ${cx} ${mouthY + 4} ${cx + 4} ${mouthY}`
    : !v.eyeOpen
      ? `M ${cx - 4} ${mouthY} Q ${cx} ${mouthY + 2} ${cx + 4} ${mouthY}`
      : `M ${cx - 3} ${mouthY} L ${cx + 3} ${mouthY}`

  return (
    <g id="cara" className="layer-cara" transform={`translate(0, ${v.offsetY})`}>
      <circle cx={cx} cy={cy - 30} r={22} fill={tonoPiel} stroke="#334155" strokeWidth="1" />
      <ellipse cx={cx - 7} cy={eyeY} rx={3} ry={eyeHeight / 2} fill="#1e293b" />
      <ellipse cx={cx + 7} cy={eyeY} rx={3} ry={eyeHeight / 2} fill="#1e293b" />
      <path d={mouthD} stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx={cx - 8} cy={cy - 24} r={1.5} fill="#d97706" />
      <circle cx={cx + 8} cy={cy - 24} r={1.5} fill="#d97706" />
    </g>
  )
}

function renderEquipmentLayer(
  slot: Slot,
  equippedId: string | null
): React.ReactNode {
  if (!equippedId) return null
  const item = getEquipmentById(equippedId)
  if (!item) return null

  const fill = item.svgFill ?? '#64748b'

  switch (slot) {
    case 'casco':
      return (
        <g id="casco" className="layer-casco">
          <path d={item.svgPath} fill={fill} stroke="#334155" strokeWidth="2" />
        </g>
      )
    case 'armadura':
      return (
        <g id="armadura" className="layer-armadura">
          <path d={item.svgPath} fill={fill} stroke="#334155" strokeWidth="2" />
        </g>
      )
    case 'arma':
      return (
        <g id="arma" className="layer-arma">
          <path d={item.svgPath} fill={fill} stroke="#334155" strokeWidth="2" />
        </g>
      )
    case 'escudo':
      return (
        <g id="escudo" className="layer-escudo">
          <path d={item.svgPath} fill={fill} stroke="#334155" strokeWidth="2" />
        </g>
      )
    case 'capa':
      return (
        <g id="capa" className="layer-capa">
          <path d={item.svgPath} fill={fill} opacity={0.85} />
        </g>
      )
    case 'accesorio':
      return (
        <g id="accesorio" className="layer-accesorio">
          <path d={item.svgPath} fill={fill} stroke="#334155" strokeWidth="2" />
        </g>
      )
    default:
      return null
  }
}

const CX_STR = `${CHARACTER_CX}px`
const CY_STR = `${CHARACTER_CY}px`

export default function Personaje({ character, mood, size = 200, className }: PersonajeProps): React.ReactElement {
  const viewBox = `0 0 ${CHARACTER_CX * 2} ${CHARACTER_CY * 2}`

  const sortedLayers = [...CHARACTER_LAYERS].sort((a, b) => a.zIndex - b.zIndex)

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className={`block w-full h-auto max-w-full ${className ?? ''}`}
      viewBox={viewBox}
      style={{ width: size, height: size }}
    >
      <defs>
        <style>{`
          .layer {
            transform-origin: ${CX_STR} ${CY_STR};
            will-change: transform;
          }
          @keyframes idle-bob {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-4px) scale(1.005); }
            100% { transform: translateY(0) scale(1); }
          }
          ${!prefersReducedMotion ? `.layer { animation: idle-bob 3s ease-in-out infinite; }` : ''}
        `}</style>
      </defs>
      {sortedLayers.map((layer) => {
        const equippedId = character.equipado[layer.id as Slot]
        return (
          <g
            key={layer.id}
            id={`layer-${layer.id}`}
            className="layer"
            style={{
              transformOrigin: `${CX_STR} ${CY_STR}`,
            }}
          >
            {layer.id === 'cuerpo' ? (
              body(character.tonoPiel)
            ) : layer.id === 'pelo' ? (
              hairPath(character.peinado, character.colorPelo)
            ) : layer.id === 'cara' ? (
              face(mood, character.tonoPiel)
            ) : (
              renderEquipmentLayer(layer.id as Slot, equippedId)
            )}
          </g>
        )
      })}
    </svg>
  )
}
