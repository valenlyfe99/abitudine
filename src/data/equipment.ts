import type { Category, Rarity, Slot, UnlockCondition } from '../domain/types'

export const RARITY_COLORS: Record<Rarity, string> = {
  común: '#64748b',
  raro: '#3b82f6',
  épico: '#a855f7',
  legendario: '#f59e0b',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  común: 'Común',
  raro: 'Raro',
  épico: 'Épico',
  legendario: 'Legendario',
}

// ---------- SVG paths por capa (viewBox 200x200, centro ~100,100) ----------

const CASCO_SVG: Record<Rarity, string> = {
  común: 'M 80 72 Q 100 55 120 72 L 120 90 L 80 90 Z',
  raro: 'M 78 70 Q 100 48 122 70 L 122 92 L 78 92 Z',
  épico: 'M 75 68 Q 100 45 125 68 L 125 95 L 75 95 Z',
  legendario: 'M 72 65 Q 100 40 128 65 L 128 98 L 72 98 Z',
}

const ARMADURA_SVG: Record<Rarity, string> = {
  común: 'M 82 84 L 118 84 L 114 110 L 86 110 Z',
  raro: 'M 80 82 L 120 82 L 116 112 L 84 112 Z',
  épico: 'M 78 80 L 122 80 L 118 114 L 82 114 Z',
  legendario: 'M 75 78 L 125 78 L 120 116 L 80 116 Z',
}

const ARMA_SVG: Record<Rarity, string> = {
  común: 'M 116 90 L 130 105 L 126 115 L 112 100 Z',
  raro: 'M 118 88 L 134 108 L 128 118 L 110 98 Z',
  épico: 'M 120 86 L 138 110 L 130 120 L 108 96 Z',
  legendario: 'M 122 84 L 142 112 L 132 122 L 106 94 Z',
}

const ESCUDO_SVG: Record<Rarity, string> = {
  común: 'M 70 90 Q 70 108 84 116 Q 84 112 70 90 Z',
  raro: 'M 68 88 Q 68 112 88 120 Q 88 114 68 88 Z',
  épico: 'M 66 86 Q 66 116 92 124 Q 92 118 66 86 Z',
  legendario: 'M 64 84 Q 64 120 96 128 Q 96 122 64 84 Z',
}

const CAPA_SVG: Record<Rarity, string> = {
  común: 'M 92 82 Q 78 95 82 118 L 88 118 Q 86 98 92 82 Z M 108 82 Q 122 95 118 118 L 112 118 Q 114 98 108 82 Z',
  raro: 'M 90 80 Q 76 96 80 122 L 92 122 Q 90 98 96 80 Z M 110 80 Q 124 96 120 122 L 108 122 Q 106 98 110 80 Z',
  épico: 'M 88 78 Q 74 98 78 126 L 96 126 Q 94 98 100 78 Z M 112 78 Q 126 98 122 126 L 104 126 Q 102 98 112 78 Z',
  legendario: 'M 86 76 Q 72 100 76 130 L 100 130 Q 98 98 104 76 Z M 114 76 Q 128 100 124 130 L 108 130 Q 106 98 114 76 Z',
}

const ACCESORIO_SVG: Record<Rarity, string> = {
  común: 'M 100 100 Q 100 94 104 94 Q 104 94 104 100 Q 104 106 100 106 Q 96 106 96 100 Q 96 94 100 94 Z',
  raro: 'M 100 98 Q 100 92 106 92 Q 106 92 106 98 Q 106 104 100 104 Q 94 104 94 98 Q 94 92 100 98 Z',
  épico: 'M 100 96 Q 100 90 108 90 Q 108 90 108 96 Q 108 102 100 100 Q 92 100 92 96 Q 92 90 100 96 Z',
  legendario: 'M 100 94 Q 100 88 110 88 Q 110 88 110 94 Q 110 100 100 98 Q 90 98 90 94 Q 90 88 100 94 Z',
}

function condicionNivel(valor: number): UnlockCondition {
  return { tipo: 'nivel', valor }
}

function condicionRacha(valor: number): UnlockCondition {
  return { tipo: 'racha', valor }
}

function condicionAtributo(valor: number, atributo: Category): UnlockCondition {
  return { tipo: 'atributo', valor, atributo }
}

export const EQUIPMENT_CATALOG: {
  casco: Record<Rarity, string>
  armadura: Record<Rarity, string>
  arma: Record<Rarity, string>
  escudo: Record<Rarity, string>
  capa: Record<Rarity, string>
  accesorio: Record<Rarity, string>
} = {
  casco: CASCO_SVG,
  armadura: ARMADURA_SVG,
  arma: ARMA_SVG,
  escudo: ESCUDO_SVG,
  capa: CAPA_SVG,
  accesorio: ACCESORIO_SVG,
}

export const EQUIPMENT: {
  id: string
  nombre: string
  descripcion: string
  ranura: Slot
  rareza: Rarity
  condicion: UnlockCondition
  svgPath: string
  svgFill?: string
}[] = [
  // ---------- CASCO (ninguna categoría) ----------
  {
    id: 'eq_casco_comun',
    nombre: 'Caperuza de lona',
    descripcion: 'Una caperuza sencilla para empezar la aventura.',
    ranura: 'casco',
    rareza: 'común',
    condicion: condicionNivel(1),
    svgPath: CASCO_SVG.común,
    svgFill: RARITY_COLORS.común,
  },
  {
    id: 'eq_casco_raro',
    nombre: 'Yelmo de bronce',
    descripcion: 'Protección metálica para la cabeza.',
    ranura: 'casco',
    rareza: 'raro',
    condicion: condicionNivel(5),
    svgPath: CASCO_SVG.raro,
    svgFill: RARITY_COLORS.raro,
  },
  {
    id: 'eq_casco_epico',
    nombre: 'Corona de hojas',
    descripcion: 'Un símbolo de comunión con la naturaleza.',
    ranura: 'casco',
    rareza: 'épico',
    condicion: condicionNivel(15),
    svgPath: CASCO_SVG.épico,
    svgFill: RARITY_COLORS.épico,
  },
  {
    id: 'eq_casco_legendario',
    nombre: 'Yelmo del dragón',
    descripcion: 'Forjado con escamas de dragón antiguo.',
    ranura: 'casco',
    rareza: 'legendario',
    condicion: condicionNivel(30),
    svgPath: CASCO_SVG.legendario,
    svgFill: RARITY_COLORS.legendario,
  },

  // ---------- ARMADURA (Fuerza) ----------
  {
    id: 'eq_armadura_comun',
    nombre: 'Túnica de viajero',
    descripcion: 'Ropa cómoda para caminar largos caminos.',
    ranura: 'armadura',
    rareza: 'común',
    condicion: condicionNivel(1),
    svgPath: ARMADURA_SVG.común,
    svgFill: RARITY_COLORS.común,
  },
  {
    id: 'eq_armadura_raro',
    nombre: 'Cuero endurecido',
    descripcion: 'Armadura de cuero tratado que resiste golpes.',
    ranura: 'armadura',
    rareza: 'raro',
    condicion: condicionAtributo(5, 'Fuerza'),
    svgPath: ARMADURA_SVG.raro,
    svgFill: RARITY_COLORS.raro,
  },
  {
    id: 'eq_armadura_epico',
    nombre: 'Cota de malla',
    descripcion: 'Entretejido de anillos de acero brillante.',
    ranura: 'armadura',
    rareza: 'épico',
    condicion: condicionAtributo(15, 'Fuerza'),
    svgPath: ARMADURA_SVG.épico,
    svgFill: RARITY_COLORS.épico,
  },
  {
    id: 'eq_armadura_legendario',
    nombre: 'Placa de aventurero',
    descripcion: 'Placas reforzadas para los más valientes.',
    ranura: 'armadura',
    rareza: 'legendario',
    condicion: condicionAtributo(30, 'Fuerza'),
    svgPath: ARMADURA_SVG.legendario,
    svgFill: RARITY_COLORS.legendario,
  },

  // ---------- ARMA (Fuerza) ----------
  {
    id: 'eq_arma_comun',
    nombre: 'Bastón de inicio',
    descripcion: 'Un bastón simple de madera.',
    ranura: 'arma',
    rareza: 'común',
    condicion: condicionNivel(1),
    svgPath: ARMA_SVG.común,
    svgFill: RARITY_COLORS.común,
  },
  {
    id: 'eq_arma_raro',
    nombre: 'Espada corta',
    descripcion: 'Hoja afilada para combate cercano.',
    ranura: 'arma',
    rareza: 'raro',
    condicion: condicionAtributo(5, 'Fuerza'),
    svgPath: ARMA_SVG.raro,
    svgFill: RARITY_COLORS.raro,
  },
  {
    id: 'eq_arma_epico',
    nombre: 'Lanza de hierro',
    descripcion: 'Punta de hierro para mantener distancia.',
    ranura: 'arma',
    rareza: 'épico',
    condicion: condicionAtributo(15, 'Fuerza'),
    svgPath: ARMA_SVG.épico,
    svgFill: RARITY_COLORS.épico,
  },
  {
    id: 'eq_arma_legendario',
    nombre: 'Hoja del alba',
    descripcion: 'Una espada que brilla con luz propia.',
    ranura: 'arma',
    rareza: 'legendario',
    condicion: condicionAtributo(30, 'Fuerza'),
    svgPath: ARMA_SVG.legendario,
    svgFill: RARITY_COLORS.legendario,
  },

  // ---------- ESCUDO (ninguna categoría) ----------
  {
    id: 'eq_escudo_comun',
    nombre: 'Escudo de madera',
    descripcion: 'Protección básica para los comienzos.',
    ranura: 'escudo',
    rareza: 'común',
    condicion: condicionNivel(1),
    svgPath: ESCUDO_SVG.común,
    svgFill: RARITY_COLORS.común,
  },
  {
    id: 'eq_escudo_raro',
    nombre: 'Escudo reforzado',
    descripcion: 'Madera con refuerzos metálicos.',
    ranura: 'escudo',
    rareza: 'raro',
    condicion: condicionNivel(5),
    svgPath: ESCUDO_SVG.raro,
    svgFill: RARITY_COLORS.raro,
  },
  {
    id: 'eq_escudo_epico',
    nombre: 'Escudo de acero',
    descripcion: 'Un escudo sólido de acero templado.',
    ranura: 'escudo',
    rareza: 'épico',
    condicion: condicionNivel(15),
    svgPath: ESCUDO_SVG.épico,
    svgFill: RARITY_COLORS.épico,
  },
  {
    id: 'eq_escudo_legendario',
    nombre: 'Aegis',
    descripcion: 'El escudo legendario de los dioses.',
    ranura: 'escudo',
    rareza: 'legendario',
    condicion: condicionNivel(30),
    svgPath: ESCUDO_SVG.legendario,
    svgFill: RARITY_COLORS.legendario,
  },

  // ---------- CAPA (Vitalidad) ----------
  {
    id: 'eq_capa_comun',
    nombre: 'Capa sencilla',
    descripcion: 'Una capa para protegernos del frío.',
    ranura: 'capa',
    rareza: 'común',
    condicion: condicionNivel(1),
    svgPath: CAPA_SVG.común,
    svgFill: RARITY_COLORS.común,
  },
  {
    id: 'eq_capa_raro',
    nombre: 'Capa de viaje',
    descripcion: 'Resistente al viento y la lluvia.',
    ranura: 'capa',
    rareza: 'raro',
    condicion: condicionRacha(7),
    svgPath: CAPA_SVG.raro,
    svgFill: RARITY_COLORS.raro,
  },
  {
    id: 'eq_capa_epico',
    nombre: 'Capa de viento',
    descripcion: 'Se mueve incluso cuando no hay brisa.',
    ranura: 'capa',
    rareza: 'épico',
    condicion: condicionRacha(14),
    svgPath: CAPA_SVG.épico,
    svgFill: RARITY_COLORS.épico,
  },
  {
    id: 'eq_capa_legendario',
    nombre: 'Capa de sombras',
    descripcion: 'Oculta al portador de la vista enemiga.',
    ranura: 'capa',
    rareza: 'legendario',
    condicion: condicionRacha(30),
    svgPath: CAPA_SVG.legendario,
    svgFill: RARITY_COLORS.legendario,
  },

  // ---------- ACCESORIO (Sabiduría) ----------
  {
    id: 'eq_accesorio_comun',
    nombre: 'Amuleto de estaño',
    descripcion: 'Un amuleto simple con una piedra.',
    ranura: 'accesorio',
    rareza: 'común',
    condicion: condicionNivel(1),
    svgPath: ACCESORIO_SVG.común,
    svgFill: RARITY_COLORS.común,
  },
  {
    id: 'eq_accesorio_raro',
    nombre: 'Libro de notas',
    descripcion: 'Registra sabiduría acumulada.',
    ranura: 'accesorio',
    rareza: 'raro',
    condicion: condicionAtributo(10, 'Sabiduría'),
    svgPath: ACCESORIO_SVG.raro,
    svgFill: RARITY_COLORS.raro,
  },
  {
    id: 'eq_accesorio_epico',
    nombre: 'Grimoire',
    descripcion: 'Un libro de conocimientos ocultos.',
    ranura: 'accesorio',
    rareza: 'épico',
    condicion: condicionAtributo(25, 'Sabiduría'),
    svgPath: ACCESORIO_SVG.épico,
    svgFill: RARITY_COLORS.épico,
  },
  {
    id: 'eq_accesorio_legendario',
    nombre: 'Tomo ancestral',
    descripcion: 'Sabiduría de épocas pasadas.',
    ranura: 'accesorio',
    rareza: 'legendario',
    condicion: condicionAtributo(50, 'Sabiduría'),
    svgPath: ACCESORIO_SVG.legendario,
    svgFill: RARITY_COLORS.legendario,
  },
]

export function getEquipmentById(id: string): {
  id: string
  nombre: string
  descripcion: string
  ranura: Slot
  rareza: Rarity
  condicion: UnlockCondition
  svgPath: string
  svgFill?: string
} | undefined {
  return EQUIPMENT.find((item) => item.id === id)
}

export function getEquipmentBySlot(slot: Slot): {
  id: string
  nombre: string
  descripcion: string
  ranura: Slot
  rareza: Rarity
  condicion: UnlockCondition
  svgPath: string
  svgFill?: string
}[] {
  return EQUIPMENT.filter((item) => item.ranura === slot)
}

export function rarityColor(rareza: Rarity): string {
  return RARITY_COLORS[rareza]
}

export function rarityLabel(rareza: Rarity): string {
  return RARITY_LABELS[rareza]
}
