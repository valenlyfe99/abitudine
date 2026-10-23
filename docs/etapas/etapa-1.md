# Etapa 1: scaffold y dominio puro

## Objetivo y qué quedó hecho

Configurar el proyecto base (Vite + React + TypeScript strict + Tailwind +
Vitest + ESLint + Prettier) e implementar toda la lógica pura de dominio:
tipos de datos, constantes de progresión, funciones de fechas, rachas, XP,
niveles, rangos, atributos, amuletos, desbloqueos y recálculo de estado desde
el historial. Incluye 45 tests Vitest todos pasando y lint limpio.

## Archivos creados o modificados

- `package.json` — dependencias y scripts (dev, build, test, lint, format).
- `tsconfig.json`, `tsconfig.node.json` — configuración TypeScript strict.
- `vite.config.ts` — Vite + plugin React + configuración de Vitest.
- `tailwind.config.js`, `postcss.config.js` — Tailwind CSS.
- `.eslintrc.cjs`, `.prettierrc` — lint y formateo.
- `index.html` — entrada de la aplicación.
- `src/vite-env.d.ts` — tipos de Vite.
- `src/index.css` — estilos base con directivas de Tailwind.
- `src/main.tsx` — punto de entrada de React.
- `src/App.tsx` — componente raíz placeholder.
- `src/domain/types.ts` — tipos de dominio (Habit, Completion, Character,
  PlayerState, SaveData, EquipmentItem, etc.).
- `src/domain/fechas.ts` — funciones puras de fechas locales (YYYY-MM-DD).
- `src/domain/rachas.ts` — rachas por hábito, racha global, racha global max.
- `src/domain/progresion.ts` — XP, atributos, amuletos, recálculo de estado.
- `src/domain/unlocks.ts` — condiciones de desbloqueo de equipo.
- `src/domain/recalculo.ts` — recálculo completo del estado desde historial.
- `src/domain/index.ts` — exportaciones del dominio.
- `src/config/progression.ts` — constantes: rangos, XP, bonus de racha,
  umbrales, amuletos, categoría por ranura.
- `src/test/setup.ts` — setup de Vitest.
- `src/domain/fechas.test.ts` — tests de fechas locales (10 tests).
- `src/domain/rachas.test.ts` — tests de rachas (15 tests).
- `src/domain/progresion.test.ts` — tests de XP, atributos, amuletos (11 tests).
- `src/domain/unlocks.test.ts` — tests de desbloqueos (6 tests).
- `src/domain/recalculo.test.ts` — tests de recálculo (6 tests).
- `PROGRESS.md` — actualizado: etapa 1 hecha, etapa 2 en curso, comandos clave.
- `docs/etapas/etapa-1.md` — este documento.

## Decisiones técnicas y por qué

- TypeScript strict con `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`.
- Fechas en día local (YYYY-MM-DD), nunca UTC. Se usa `getTimezoneOffset` para
  convertir a hora local antes de formatear.
- El estado derivado (nivel, rachas, atributos, amuletos) se recalcula siempre
  desde el historial de cumplimientos, nunca se guarda como fuente de verdad.
- El bonus de hito de racha se otorga una sola vez basado en la *mejor racha*
  histórica del hábito, no en la actual, evitando duplicados al desmarcar y
  volver a marcar.
- Los días en que un hábito no corresponde por su frecuencia no cuentan ni
  rompen la racha.
- ESLint v8 (flat config no usada por compatibilidad con plugins disponibles).
- Vitest con entorno jsdom, aunque los tests son de lógica pura sin DOM.

## Cómo probarlo

- `npm test` — ejecuta los 45 tests de Vitest, todos deben pasar.
- `npm run lint` — ejecuta ESLint, debe salir limpio (solo warning de React
  version, no bloqueante).
- `npx tsc --noEmit` — verificación de tipos, debe salir sin errores.
- `npm run dev` — levanta el servidor de desarrollo en http://localhost:5173.

## Problemas conocidos y pendientes

- El warning de `postcss.config.js` como ES module es solo informativo, no
  afecta la ejecución.
- El placeholder de `src/App.tsx` es temporal; las pantallas reales se
  implementarán en etapas posteriores.
- La etapa 2 (StorageAdapter + localStorage + migración) aún no está
  implementada.
- PWA (vite-plugin-pwa) aún no está configurado; se hará en una etapa posterior.

## Próximo paso concreto

Etapa 2: implementar StorageAdapter con localStorage, modelo versionado con
función de migración, y manejo de errores de storage (lleno o bloqueado).
