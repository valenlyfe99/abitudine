# Etapa 5: progreso, ajustes, almacenamiento y celebración

## Objetivo y qué quedó hecho

Implementar la pantalla Progreso completa, la pantalla Ajustes, el uso del amuleto
de racha desde la interfaz, y las funciones de exportar/importar/reiniciar datos.
Incluye tests de export/import y datos inválidos.

## Archivos creados o modificados

- `src/pages/Progress.tsx` — Pantalla completa de progreso: nivel, XP, rango,
  atributos, rachas por hábito (actual y mejor), cantidad de amuletos,
  calendario mensual con días cumplidos, y corrección de cumplimientos hasta 7
  días atrás mediante clic en días del calendario.
- `src/pages/Settings.tsx` — Pantalla de ajustes: toggle de tema claro/oscuro,
  exportar datos a JSON (descarga de archivo), importar desde JSON con validación
  (versión de esquema, JSON inválido, reemplazar o fusionar), y reiniciar
  progreso con confirmación.
- `src/components/AmuletoModal.tsx` — Modal de confirmación para usar un
  amuleto de racha cuando se rompe la racha global al desmarcar un hábito.
- `src/pages/Today.tsx` — Integra `CelebrationModal` y `AmuletoModal`; muestra
  modal de celebración al subir de nivel/cambiar rango/desbloquear ítem, y
  modal de amuleto cuando se desmarca un hábito que rompe la racha.
- `src/store/index.ts` — Agregado: `tema` (claro/oscuro), `toggleTema()`,
  `pendingAmuleto`, `usarAmuleto()`, `rechazarAmuleto()`, `exportarDatos()`,
  `importarDatos(json, reemplazar)`, `reiniciarProgreso()`;
  `toggleCompletion()` detecta cuándo se rompe la racha global y ofrece usar
  amuleto; `save()` persiste el tema en localStorage; `init()` lee el tema
  guardado.
- `src/domain/types.ts` — Agregado: tipo `CelebrationEvent`.
- `src/domain/index.ts` — Exporta `CelebrationEvent`.
- `tailwind.config.js` — Agregado `darkMode: 'class'` para soporte de tema
  oscuro.
- `vite.config.ts` — Agregado `cache: false` para tests.
- `src/test/setup.ts` — Agregado mock de `matchMedia` para jsdom.
- `PROGRESS.md` — Actualizado: etapas 0-11 hechas, etapa 12 pendiente.
- `docs/etapas/etapa-5.md` — Este documento.

## Decisiones técnicas y por qué

- **Tema claro/oscuro**: Implementado con `darkMode: 'class'` de Tailwind. El
  tema se guarda en `localStorage` bajo la clave `abitudine_tema` y se aplica
  como clase `dark` en `document.documentElement`.
- **Amuleto de racha**: Cuando se desmarca un hábito y eso rompe la racha global,
  se muestra un modal ofreciendo usar un amuleto. Si se acepta, se resta 1
  amuleto y se mantiene la racha. Si se rechaza, se elimina la completación
  normalmente.
- **Exportar/Importar**: `exportarDatos()` devuelve un JSON con versión de
  esquema, timestamp, tema y todo el estado del juego. `importarDatos()` valida
  el JSON, la versión de esquema, y permite reemplazar todo o fusionar.
- **Reiniciar progreso**: Limpia hábitos, cumplimientos, personaje, playerState,
  equipo desbloqueado, equipado, celebración y oferta de amuleto.
- **Calendario mensual**: Muestra los días del mes con indicadores de
  cumplimiento (verde = completo, azul = parcial, gris = sin hábitos). Solo los
  últimos 7 días se pueden editar.

## Cómo probarlo

- `npm test` — ejecuta los tests de Vitest.
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — verificación de tipos.
- `npm run dev` — levanta la app. Ve a /progreso para ver el calendario y
  rachas, /ajustes para tema y exportar/importar, y marca/desmarca hábitos en
  /hoy para probar el amuleto.

## Problemas conocidos y pendientes

- Algunos archivos escritos con `write` pueden no reflejarse inmediatamente en
  git debido a problemas de caché del sistema de archivos con rutas case-sensitive.
- PWA (vite-plugin-pwa) aún no configurado.
- Etapa 12 (accesibilidad) pendiente.

## Próximo paso concreto

Etapa 12: Accesibilidad (contraste, botones de 44px, labels, navegación por
teclado) y tests Vitest adicionales.
