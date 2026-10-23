import type { Rarity, Slot } from '../domain/types'

export const CHARACTER_SIZE = 200
export const CHARACTER_CX = 100
export const CHARACTER_CY = 100

export const CHARACTER_LAYERS = [
  { id: 'cuerpo', label: 'Cuerpo / Piel', zIndex: 1 },
  { id: 'capa', label: 'Capa', zIndex: 2 },
  { id: 'ropa', label: 'Ropa base', zIndex: 3 },
  { id: 'armadura', label: 'Armadura', zIndex: 4 },
  { id: 'casco', label: 'Casco', zIndex: 5 },
  { id: 'pelo', label: 'Pelo', zIndex: 6 },
  { id: 'cara', label: 'Cara', zIndex: 7 },
  { id: 'arma', label: 'Arma', zIndex: 8 },
  { id: 'escudo', label: 'Escudo', zIndex: 9 },
  { id: 'accesorio', label: 'Accesorio', zIndex: 10 },
] as const

export type CharacterLayerId = (typeof CHARACTER_LAYERS)[number]['id']

export const HAIRSTYLES: Record<string, { label: string }> = {
  corto: { label: 'Corto' },
  largo: { label: 'Largo' },
  rizado: { label: 'Rizado' },
  rapado: { label: 'Rapado' },
} as const

export type HairstyleId = keyof typeof HAIRSTYLES

export const DEFAULT_EQUIPMENT: Record<Slot, { id: string; nombre: string; rareza: Rarity; color: string }> = {
  casco: { id: 'eq_casco_1', nombre: 'Caperuza de lona', rareza: 'común', color: '#94a3b8' },
  armadura: { id: 'eq_armadura_1', nombre: 'Túnica de viajero', rareza: 'común', color: '#64748b' },
  arma: { id: 'eq_arma_1', nombre: 'Bastón de inicio', rareza: 'común', color: '#78350f' },
  escudo: { id: 'eq_escudo_1', nombre: 'Escudo de madera', rareza: 'común', color: '#a16207' },
  capa: { id: 'eq_capa_1', nombre: 'Capa sencilla', rareza: 'común', color: '#be185d' },
  accesorio: { id: 'eq_accesorio_1', nombre: 'Amuleto de estaño', rareza: 'común', color: '#94a3b8' },
} as const

export const SLOT_DISPLAY_NAMES: Record<Slot, string> = {
  casco: 'Casco',
  armadura: 'Armadura',
  arma: 'Arma',
  escudo: 'Escudo',
  capa: 'Capa',
  accesorio: 'Accesorio',
}

export function layerZIndex(layerId: CharacterLayerId): number {
  const layer = CHARACTER_LAYERS.find((l) => l.id === layerId)
  return layer?.zIndex ?? 0
}
