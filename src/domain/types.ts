export type Category = 'Fuerza' | 'Sabiduría' | 'Vitalidad';
export type Frequency = 'daily' | 'weekly';
export type Mood = 'orgulloso' | 'normal' | 'cansado';
export type Rarity = 'común' | 'raro' | 'épico' | 'legendario';
export type Slot = 'casco' | 'armadura' | 'arma' | 'escudo' | 'capa' | 'accesorio';

export interface Habit {
  id: string;
  nombre: string;
  emoji: string;
  color: string;
  categoria: Category;
  frecuencia: Frequency;
  diasSemana?: number[];
  archivado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Completion {
  habitId: string;
  fecha: string;
  marcadoEn: string;
}

export interface Character {
  id: string;
  nombre: string;
  tonoPiel: string;
  peinado: string;
  colorPelo: string;
  equipado: Record<Slot, string | null>;
  mood: Mood;
}

export interface RachaPorHabito {
  actual: number;
  mejor: number;
}

export interface PlayerState {
  xp: number;
  nivel: number;
  rango: string;
  atributos: Record<Category, number>;
  rachaGlobal: number;
  rachaGlobalMax: number;
  amuletos: number;
  rachasPorHabito: Record<string, RachaPorHabito>;
  ultimaActualizacion: string;
}

export interface SaveData {
  version: number;
  habits: Habit[];
  completions: Completion[];
  character: Character;
  playerState: PlayerState;
}

export interface UnlockCondition {
  tipo: 'nivel' | 'racha' | 'atributo';
  valor: number;
  atributo?: Category;
}

export interface EquipmentItem {
  id: string;
  nombre: string;
  descripcion: string;
  ranura: Slot;
  rareza: Rarity;
  condicion: UnlockCondition;
}
