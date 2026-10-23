import type { Category, Slot } from '../domain/types'

export const RANGOS = [
  { nombre: 'Aldeano', umbralXp: 0 },
  { nombre: 'Aprendiz', umbralXp: 100 },
  { nombre: 'Aventurero', umbralXp: 250 },
  { nombre: 'Caballero', umbralXp: 450 },
  { nombre: 'Héroe', umbralXp: 700 },
  { nombre: 'Leyenda', umbralXp: 1000 },
] as const;

export const XP_POR_HABITO = 10;

export const BONUS_RACHA_HABITO = [
  { dias: 3, bonus: 5 },
  { dias: 7, bonus: 15 },
  { dias: 14, bonus: 30 },
  { dias: 30, bonus: 60 },
] as const;

export const XP_POR_NIVEL_ADICIONAL = 800;

export const AMULETOS_POR_DIAS_RACHA_GLOBAL = 7;
export const AMULETOS_MAX = 3;

export const CATEGORIA_POR_RANURA: Record<Slot, Category | null> = {
  casco: null,
  armadura: 'Fuerza',
  arma: 'Fuerza',
  escudo: null,
  capa: 'Vitalidad',
  accesorio: 'Sabiduría',
};

export type RangoNombre = typeof RANGOS[number]['nombre'];

export function umbralXpParaNivel(nivel: number): number {
  if (nivel <= 1) return 0;
  if (nivel <= 6) {
    const umbrales = [0, 100, 250, 450, 700, 1000];
    return umbrales[nivel - 1];
  }
  return 1000 + (nivel - 6) * XP_POR_NIVEL_ADICIONAL;
}

export function rangoParaXp(xp: number): RangoNombre {
  let rango: RangoNombre = RANGOS[0].nombre;
  for (const r of RANGOS) {
    if (xp >= r.umbralXp) rango = r.nombre;
  }
  return rango;
}

export function nivelParaXp(xp: number): number {
  let nivel = 1;
  while (umbralXpParaNivel(nivel + 1) <= xp) {
    nivel += 1;
  }
  return nivel;
}
