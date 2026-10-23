# PLAN.md — Propuesta de arquitectura y contenido

Este documento es un plan escrito, sin implementar. Sirve de referencia para las
etapas siguientes.

## (a) Estructura de carpetas

```
abitudine/
├─ docs/
│  ├─ SPEC.md
│  ├─ PLAN.md
│  └─ etapas/
│     ├─ etapa-0.md
│     └─ …
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ routes.tsx
│  ├─ config/
│  │  ├─ progression.ts      # curva de XP, bonus de racha, rangos, umbrales
│  │  └─ storage.ts          # StorageAdapter, clave de localStorage, versión
│  ├─ domain/
│  │  ├─ types.ts            # tipos de dominio (Habit, Completion, Character, …)
│  │  ├─ migration.ts        # versión del modelo + función de migración
│  │  ├─ habits.ts           # lógica pura de hábitos
│  │  ├─ streaks.ts          # rachas por hábito y globales
│  │  ├─ progression.ts      # XP, niveles, rangos, atributos, amuletos
│  │  ├─ unlocks.ts          # condiciones de desbloqueo de equipo
│  │  └─ storage.ts          # StorageAdapter interface + localStorage adapter
│  ├─ data/
│  │  └─ equipment.ts        # catálogo de equipo (id, nombre, descripción, ranura,
│  │                        # rareza, condición de desbloqueo)
│  ├─ components/
│  │  ├─ character/          # SVG por capas, estados de ánimo, idle
│  │  ├─ habits/
│  │  ├─ inventory/
│  │  ├─ progress/
│  │  ├─ settings/
│  │  └─ ui/                 # botones, inputs, modales accesibles
│  ├─ hooks/
│  ├─ store/                 # Zustand (estado global)
│  ├─ lib/
│  ├─ pages/
│  │  ├─ Onboarding.tsx
│  │  ├─ Today.tsx
│  │  ├─ Habits.tsx
│  │  ├─ Progress.tsx
│  │  ├─ Inventory.tsx
│  │  └─ Settings.tsx
│  └─ locales/
│     └─ es-AR.ts            # voseo
├─ tests/
├─ vite.config.ts
├─ tailwind.config.js
├─ tsconfig.json
└─ index.html
```

## (b) Modelo de datos en TypeScript

```ts
// src/domain/types.ts
export type Category = "Fuerza" | "Sabiduría" | "Vitalidad";
export type Frequency = "daily" | "weekly";
export type Mood = "orgulloso" | "normal" | "cansado";
export type Rarity = "común" | "raro" | "épico" | "legendario";
export type Slot =
  | "casco" | "armadura" | "arma" | "escudo" | "capa" | "accesorio";

export interface Habit {
  id: string;
  nombre: string;
  emoji: string;
  color: string;
  categoria: Category;
  frecuencia: Frequency;
  diasSemana?: number[]; // 0=domingo … 6=sábado, solo si semanal
  archivado: boolean;
  creadoEn: string; // YYYY-MM-DD
  actualizadoEn: string;
}

export interface Completion {
  habitId: string;
  fecha: string; // YYYY-MM-DD local
  marcadoEn: string; // ISO timestamp
}

export interface Character {
  id: string;
  nombre: string;
  tonoPiel: string;
  peinado: string;
  colorPelo: string;
  equipado: Record<Slot, string | null>; // ids de equipo
  mood: Mood;
}

export interface PlayerState {
  xp: number;
  nivel: number;
  rango: string;
  atributos: Record<Category, number>;
  rachaGlobal: number;      // actual
  rachaGlobalMax: number;
  amuletos: number;         // acumulables, max 3
  rachasPorHabito: Record<string, { actual: number; mejor: number }>;
  ultimaActualizacion: string; // YYYY-MM-DD
}

export interface SaveData {
  version: number;
  habits: Habit[];
  completions: Completion[];
  character: Character;
  playerState: PlayerState;
}
```

Estado derivado: nivel, rachas, atributos, amuletos, rangos y desbloqueos se
recalculan siempre desde `habits` + `completions` + `character`. `playerState`
es una caché materializada que nunca es fuente de verdad.

## (c) Catálogo inicial de equipo

Al menos 4 piezas por ranura, con rareza y condición de desbloqueo.

| Ranura | Pieza | Rareza | Condición de desbloqueo | Atributo |
|--------|-------|--------|-------------------------|----------|
| casco | Caperuza de lona | común | nivel 1 | — |
| casco | Yelmo de bronce | raro | nivel 5 | — |
| casco | Corona de hojas | épico | nivel 15 | — |
| casco | Yelmo del dragón | legendario | nivel 30 | — |
| armadura | Túnica de viajero | común | nivel 1 | — |
| armadura | Cuero endurecido | raro | nivel 5 | Fuerza |
| armadura | Cota de malla | épico | nivel 15 | Fuerza |
| armadura | Placa de aventurero | legendario | nivel 30 | Fuerza |
| arma | Bastón de inicio | común | nivel 1 | — |
| arma | Espada corta | raro | nivel 5 | Fuerza |
| arma | Lanza de hierro | épico | nivel 15 | Fuerza |
| arma | Hoja del alba | legendario | nivel 30 | Fuerza |
| escudo | Escudo de madera | común | nivel 1 | — |
| escudo | Escudo reforzado | raro | nivel 5 | — |
| escudo | Escudo de acero | épico | nivel 15 | — |
| escudo | Aegis | legendario | nivel 30 | — |
| capa | Capa sencilla | común | nivel 1 | Vitalidad |
| capa | Capa de viaje | raro | racha global 7 | Vitalidad |
| capa | Capa de viento | épico | racha global 14 | Vitalidad |
| capa | Capa de sombras | legendario | racha global 30 | Vitalidad |
| accesorio | Amuleto de estaño | común | nivel 1 | Sabiduría |
| accesorio | Libro de notas | raro | atributo Sabiduría 10 | Sabiduría |
| accesorio | Grimoire | épico | atributo Sabiduría 25 | Sabiduría |
| accesorio | Tomo ancestral | legendario | atributo Sabiduría 50 | Sabiduría |

Armas y armaduras → Fuerza. Libros y accesorios → Sabiduría. Capas y amuletos
→ Vitalidad.

## (d) Curva de niveles inicial y umbrales de rangos

Rangos (en orden): Aldeano, Aprendiz, Aventurero, Caballero, Héroe, Leyenda.

Umbrales de XP acumulado por nivel (propuesta inicial):

| Nivel | XP requerido | Rango |
|-------|--------------|-------|
| 1 | 0 | Aldeano |
| 2 | 100 | Aldeano |
| 3 | 250 | Aldeano |
| 4 | 450 | Aprendiz |
| 5 | 700 | Aprendiz |
| 6 | 1000 | Aventurero |
| 7 | 1350 | Aventurero |
| 8 | 1750 | Aventurero |
| 9 | 2200 | Caballero |
| 10 | 2700 | Caballero |
| 11 | 3250 | Héroe |
| 12 | 3850 | Héroe |
| 13 | 4500 | Leyenda |
| 14+ | +800 por nivel | Leyenda |

Bonus de racha por hábito (una sola vez por hito): 3 días +5, 7 días +15,
14 días +30, 30 días +60.

10 XP por hábito cumplido. Cada cumplimiento suma 1 punto al atributo de la
categoría del hábito.

Amuleto de racha: 1 cada 7 días de racha global, máximo 3 acumulables.
