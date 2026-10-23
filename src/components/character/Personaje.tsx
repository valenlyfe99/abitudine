import React from 'react'
import type { Character, Mood, Slot } from '../../domain/types'
import {
  CHARACTER_LAYERS,
  CHARACTER_CX,
  CHARACTER_CY,
  DEFAULT_EQUIPMENT,
} from '../../config/character'

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

function helmet(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY - 28
  return (
    <g id="casco" className="layer-casco">
      <path
        d={`M ${cx - 20} ${cy - 2} Q ${cx} ${cy - 24} ${cx + 20} ${cy - 2} L ${cx + 20} ${cy + 12} L ${cx - 20} ${cy + 12} Z`}
        fill={slotColor}
        stroke="#334155"
        strokeWidth="2"
      />
      <path
        d={`M ${cx - 6} ${cy - 6} Q ${cx} ${cy - 14} ${cx + 6} ${cy - 6}`}
        fill="none"
        stroke="#334155"
        strokeWidth="2"
      />
    </g>
  )
}

function armor(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="armadura" className="layer-armadura">
      <path
        d={`M ${cx - 22} ${cy - 6} L ${cx + 22} ${cy - 6} L ${cx + 18} ${cy + 34} L ${cx - 18} ${cy + 34} Z`}
        fill={slotColor}
        stroke="#334155"
        strokeWidth="2"
      />
      <circle cx={cx} cy={cy + 2} r={10} fill="#334155" />
    </g>
  )
}

function cloak(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="capa" className="layer-capa">
      <path
        d={`M ${cx - 8} ${cy - 10} Q ${cx - 26} ${cy + 10} ${cx - 22} ${cy + 40} L ${cx - 16} ${cy + 40} Q ${cx - 18} ${cy + 20} ${cx - 8} ${cy - 10} Z M ${cx + 8} ${cy - 10} Q ${cx + 26} ${cy + 10} ${cx + 22} ${cy + 40} L ${cx + 16} ${cy + 40} Q ${cx + 18} ${cy + 20} ${cx + 8} ${cy - 10} Z`}
        fill={slotColor}
        opacity={0.85}
      />
    </g>
  )
}

function baseClothing(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="ropa" className="layer-ropa">
      <path
        d={`M ${cx - 18} ${cy - 4} L ${cx + 18} ${cy - 4} L ${cx + 14} ${cy + 36} L ${cx - 14} ${cy + 36} Z`}
        fill={slotColor}
      />
      <rect x={cx - 14} y={cy - 4} width={28} height={12} fill={slotColor} opacity={0.8} />
    </g>
  )
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

function weapon(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="arma" className="layer-arma">
      <line x1={cx + 16} y1={cy + 6} x2={cx + 34} y2={cy + 24} stroke={slotColor} strokeWidth="6" strokeLinecap="round" />
      <rect x={cx + 28} y={cy + 18} width={10} height={14} fill={slotColor} />
    </g>
  )
}

function shield(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="escudo" className="layer-escudo">
      <path
        d={`M ${cx - 30} ${cy + 10} Q ${cx - 30} ${cy + 30} ${cx - 16} ${cy + 38} Q ${cx - 14} ${cy + 42} ${cx - 14} ${cy + 38} Q ${cx - 14} ${cy + 30} ${cx - 30} ${cy + 10} Z`}
        fill={slotColor}
        stroke="#334155"
        strokeWidth="2"
      />
      <circle cx={cx - 22} cy={cy + 24} r={4} fill="#334155" />
    </g>
  )
}

function accessory(slotColor: string): React.ReactNode {
  const cx = CHARACTER_CX
  const cy = CHARACTER_CY
  return (
    <g id="accesorio" className="layer-accesorio">
      <circle cx={cx} cy={cy + 2} r={5} fill={slotColor} stroke="#334155" strokeWidth="2" />
      <path d={`M ${cx - 3} ${cy - 1} L ${cx + 3} ${cy - 1} L ${cx} ${cy + 5} Z`} fill="#334155" />
    </g>
  )
}

function renderLayer(
  layerId: string,
  character: Character,
  mood: Mood
): React.ReactNode {
  const slotColors: Record<Slot, string> = {
    casco: DEFAULT_EQUIPMENT.casco.color,
    armadura: DEFAULT_EQUIPMENT.armadura.color,
    arma: DEFAULT_EQUIPMENT.arma.color,
    escudo: DEFAULT_EQUIPMENT.escudo.color,
    capa: DEFAULT_EQUIPMENT.capa.color,
    accesorio: DEFAULT_EQUIPMENT.accesorio.color,
  }

  const equipped = character.equipado
  const colorPelo = character.colorPelo
  const peinado = character.peinado

  switch (layerId) {
    case 'cuerpo':
      return body(character.tonoPiel)
    case 'capa':
      return cloak(slotColors.capa)
    case 'ropa':
      return baseClothing(slotColors.armadura)
    case 'armadura':
      return equipped.armadura ? armor(slotColors.armadura) : null
    case 'casco':
      return equipped.casco ? helmet(slotColors.casco) : null
    case 'pelo':
      return hairPath(peinado, colorPelo)
    case 'cara':
      return face(mood, character.tonoPiel)
    case 'arma':
      return equipped.arma ? weapon(slotColors.arma) : null
    case 'escudo':
      return equipped.escudo ? shield(slotColors.escudo) : null
    case 'accesorio':
      return equipped.accesorio ? accessory(slotColors.accesorio) : null
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
      {sortedLayers.map((layer) => (
        <g
          key={layer.id}
          id={`layer-${layer.id}`}
          className="layer"
          style={{
            transformOrigin: `${CX_STR} ${CY_STR}`,
          }}
        >
          {renderLayer(layer.id, character, mood)}
        </g>
      ))}
    </svg>
  )
}
