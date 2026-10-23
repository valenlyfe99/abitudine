# Etapa 2: almacenamiento, store, pantallas y navegación

## Objetivo y qué quedó hecho

Implementar la capa de persistencia con StorageAdapter (localStorage), versionado
de datos con migración, manejo de errores (cuota/bloqueado/corrupto), store de
Zustand conectado a la lógica pura de src/domain, y las pantallas principales
con navegación responsive. Incluye detección de cambio de día con la app
abierta y 10 tests de storage/migración (56 tests totales pasando).

## Archivos creados o modificados

- `src/domain/storage.ts` — StorageAdapter interface, LocalStorageAdapter,
  StorageError (códigos: quota, blocked, corrupt, unknown), DATA_VERSION,
  función de migración de v0 a v1, createEmptySaveData.
- `src/store/index.ts` — Store de Zustand con estado (habits, completions,
  character, playerState), acciones (add/edit/archive/delete/restore hábito,
  toggleCompletion, setCharacter, recalculate, init, save), hooks helpers
  (useTodayHabits, isHabitCompletedToday, useHabitStreak).
- `src/components/Nav.tsx` — Navegación responsive: barra inferior en móvil
  (max-width < 768px) y barra lateral fija en escritorio. Enlaces: Hoy,
  Hábitos, Progreso, Inventario, Ajustes.
- `src/pages/Onboarding.tsx` — Pantalla de bienvenida en 2 pasos: (1) nombre,
  tono de piel, peinado, color de pelo; (2) primer hábito (nombre, emoji, color,
  categoría, frecuencia diaria/semanal con días de la semana).
- `src/pages/Today.tsx` — Pantalla principal: placeholder de personaje, barra
  de XP y nivel, racha global, contador de amuletos, checklist de hábitos del
  día con marcar/desmarcar.
- `src/pages/Habits.tsx` — CRUD de hábitos: crear, editar, archivar, borrar,
  restaurar archivados, formulario con validación, selector de días para
  frecuencia semanal.
- `src/pages/Progress.tsx` — Placeholder (próxima etapa).
- `src/pages/Inventory.tsx` — Placeholder (próxima etapa).
- `src/pages/Settings.tsx` — Placeholder (próxima etapa).
- `src/App.tsx` — Router con react-router-dom (BrowserRouter, Routes, Route),
  redirección a onboarding si no hay personaje, manejo de error de storage.
- `src/main.tsx` — Sin cambios funcionales (mantiene React.StrictMode).
- `src/domain/index.ts` — Exporta LocalStorageAdapter, DATA_VERSION,
  StorageError, createEmptySaveData.
- `src/domain/storage.test.ts` — 10 tests: guardar/cargar, null sin datos,
  limpiar, migración v0→v1, migración sin campo version, no re-migrar,
  datos corruptos, StorageError codes.
- `package.json` — Añadidas dependencias zustand, react-router-dom,
  @types/react-router-dom.
- `PROGRESS.md` — Actualizado: etapas 0-7 y 13 hechas, etapa 8 pendiente.
- `docs/etapas/etapa-2.md` — Este documento.

## Decisiones técnicas y por qué

- **Zustand** elegido sobre Context + reducer por simplicidad y bajo boilerplate.
  El store orquesta las llamadas a src/domain (lógica pura) y a StorageAdapter
  (persistencia), sin mezclar responsabilidades.
- **StorageAdapter como interfaz separada** permite reemplazar localStorage por
  Supabase/Firebase sin tocar la UI ni el dominio, como exige la SPEC.
- **Versionado con DATA_VERSION = 1** y función `migrate()` que actualiza datos
  legacy (v0 o sin versión) al formato actual. Siempre se recalcula el
  playerState desde historial al cargar.
- **Manejo de errores de storage**: `StorageError` con códigos específicos y
  mensajes claros en español rioplatense. La app muestra un botón "Empezar de
  nuevo" que limpia localStorage y recarga.
- **Detección de cambio de día**: `useEffect` con `setInterval` (60s) que
  compara `playerState.ultimaActualizacion` con `hoyLocal()` y llama a
  `recalculate()` si cambiaron.
- **Navegación react-router-dom** con rutas: `/` y `/hoy` → Today, `/habitos`
  → Habits, `/progreso` → Progress, `/inventario` → Inventory, `/ajustes`
  → Settings.
- **CSS responsive**: `hidden md:flex` para nav lateral, `md:hidden` para nav
  inferior, sin depender de `window.innerWidth` en JS.

## Cómo probarlo

- `npm test` — ejecuta los 56 tests de Vitest (45 de dominio + 11 de storage),
  todos deben pasar.
- `npm run lint` — ESLint limpio (solo warning informativo de React version).
- `npx tsc --noEmit` — verificación de tipos sin errores.
- `npm run dev` — levanta la app en http://localhost:5173. Al abrir por primera
  vez se muestra el onboarding; al completarlo se navega a Hoy.

## Problemas conocidos y pendientes

- `postcss.config.js` muestra warning como ES module en consola de Vite; no
  afecta funcionalidad.
- Las páginas Progreso, Inventario y Ajustes son placeholders (etapas 8, 10, 11).
- El personaje es un placeholder rectangular (dibujo SVG por capas en etapa 9).
- PWA (vite-plugin-pwa) aún no configurado.
- Las pantallas placeholders no tienen navegación de regreso específica.

## Próximo paso concreto

Etapa 8: Pantalla Progreso con calendario y corrección de cumplimientos hasta
7 días atrás. O Etapa 9: Dibujo del personaje en SVG por capas.
