# Especificación general — Abitudine

App de registro de hábitos con un personaje aventurero que evoluciona y gana
equipamiento según las rachas. PWA instalable en celular (Android e iPhone) y
en Windows. Interfaz en español rioplatense (voseo).

---

## STACK

- React + Vite + TypeScript (strict), Tailwind CSS, vite-plugin-pwa, Vitest,
  ESLint + Prettier.
- Estado con Zustand o Context + reducer (elegí uno y justificalo en PLAN.md).
- Persistencia en localStorage detrás de una interfaz abstracta StorageAdapter,
  para poder cambiarla luego por Supabase/Firebase sin tocar la UI ni la lógica.

---

## HÁBITOS

- Crear, editar, archivar y borrar. Campos: nombre, emoji, color, categoría
  (Fuerza, Sabiduría o Vitalidad) y frecuencia (todos los días o días
  específicos de la semana).
- Los archivados conservan historial pero no aparecen en "Hoy".
- Marcar y desmarcar el día actual, y corregir hasta 7 días atrás desde el
  calendario.

---

## PANTALLAS

Hoy, Hábitos, Progreso, Inventario, Ajustes y un onboarding inicial (creación
del personaje: nombre, tono de piel, peinado, color de pelo, y carga del primer
hábito).

---

## PROGRESIÓN

- 10 XP por hábito cumplido. Bonus por racha del hábito, una sola vez al
  alcanzar cada hito: +5 a los 3 días, +15 a los 7, +30 a los 14, +60 a los 30.
- Curva de niveles, bonus, rangos y umbrales en src/config/progression.ts.
- Rangos: Aldeano, Aprendiz, Aventurero, Caballero, Héroe, Leyenda.
- Racha por hábito (actual y mejor) y racha global (días en que cumplí todo lo
  que tocaba). Los días en que un hábito no corresponde por su frecuencia no
  cortan la racha.
- Cada hábito cumplido suma al atributo de su categoría.
- Amuleto de racha: 1 cada 7 días de racha global, máximo 3 acumulables
  (configurable). Si falto un día, la app me ofrece usarlo (con confirmación).
- Al desmarcar un hábito se revierte el XP y los efectos derivados. El estado
  derivado (nivel, rachas, atributos) siempre debe poder recalcularse desde el
  historial de cumplimientos.
- Nunca se pierde nivel, XP ni equipo por fallar. Fallar solo corta la racha,
  salvo que use amuleto.

---

## PERSONAJE Y EQUIPO

- Humano/aventurero dibujado en SVG por capas (una por ranura), estilo flat
  geométrico simple. Ranuras: casco, armadura, arma, escudo, capa, accesorio.
  Rarezas: común, raro, épico, legendario.
- Estados de ánimo: orgulloso, normal, cansado. Animación idle suave
  respetando prefers-reduced-motion.
- Catálogo de equipo en src/data/equipment.ts con id, nombre, descripción,
  ranura, rareza y condición de desbloqueo (nivel, racha o atributo mínimo).
  Armas y armaduras ligadas a Fuerza, libros y accesorios a Sabiduría, capas y
  amuletos a Vitalidad.

---

## ARQUITECTURA Y CALIDAD

- Lógica pura (rachas, XP, niveles, amuletos, desbloqueos, atributos) en
  src/domain, separada de la UI.
- Fechas por día local del usuario (YYYY-MM-DD local), nunca UTC. Contemplar
  cambio de día con la app abierta, zonas horarias y horario de verano.
- Modelo de datos versionado con función de migración.
- Tests con Vitest, incluyendo casos borde.
- Accesibilidad: contraste, botones de mínimo 44px, labels, navegación por
  teclado.
- Manejo de errores del storage (lleno o bloqueado).
