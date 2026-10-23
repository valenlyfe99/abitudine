# Etapa 3: personaje SVG por capas y estados de ánimo

## Objetivo y qué quedó hecho

Implementar el personaje aventurero dibujado en SVG por capas, con personalización
(tono de piel, peinados, color de pelo), estados de ánimo (orgulloso, normal,
cansado) calculados desde la lógica de progresión, animación idle suave
respetando prefers-reduced-motion, integración en la pantalla Hoy y una ruta de
desarrollo (/dev/personaje) para probar combinaciones.

## Archivos creados o modificados

- `src/config/character.ts` — configuración única del personaje: orden de capas
  (CHARACTER_LAYERS con zIndex), puntos de anclaje (CHARACTER_CX/CY), 4
  peinados (HAIRSTYLES), equipo de ejemplo por ranura (DEFAULT_EQUIPMENT),
  nombres de ranura (SLOT_DISPLAY_NAMES), helper layerZIndex.
- `src/domain/mood.ts` — lógica pura: calcularMood() (orgulloso si racha>=7 o
  nivel>=5, cansado si racha===0, normal en otro caso) y
  actualizarMoodPersonaje() que devuelve un Character con el mood actualizado
  sin mutar el original.
- `src/components/character/Personaje.tsx` — componente SVG principal. Renderiza
  las 10 capas ordenadas por zIndex (cuerpo, capa, ropa, armadura, casco, pelo,
  cara, arma, escudo, accesorio). Cada capa usa los colores del personaje y el
  equipo equipado. Expresión y postura varían según el mood. Animación idle
  (idle-bob) con CSS @keyframes, desactivada si prefers-reduced-motion: reduce.
- `src/pages/DevPersonaje.tsx` — ruta de desarrollo /dev/personaje. Controles
  para cambiar nombre, tono de piel, peinado, color de pelo, mood, tamaño y
  equipamiento por ranura. Vista previa en tiempo real.
- `src/pages/Today.tsx` — placeholder del personaje reemplazado por el
  componente Personaje real, mostrando nombre, nivel, rango y mood.
- `src/App.tsx` — nueva ruta /dev/personaje que renderiza DevPersonaje.
- `src/domain/index.ts` — exporta calcularMood y actualizarMoodPersonaje.
- `src/domain/mood.test.ts` — 8 tests: mood por racha y nivel, límites (7, 0,
  5, 4, intermedios), actualizarMoodPersonaje sin mutación.
- `src/config/character.test.ts` — 7 tests: 10 capas en orden, zIndex únicos,
  layerZIndex, 4+ peinados, equipo por ranura con rarezas válidas.
- `PROGRESS.md` — etapa 9 (personaje) marcada como hecha, próximo paso: etapa 8.
- `docs/etapas/etapa-3.md` — este documento.

## Decisiones técnicas y por qué

- **Archivo único de configuración** (src/config/character.ts): el orden de
  capas y puntos de anclaje viven en un solo lugar, fácil de ajustar sin tocar
  el componente. Cumple con el requisito de la etapa.
- **SVG inline en React**: cada capa es un grupo <g> con id único
  (layer-cuerpo, layer-capa, etc.), posicionado sobre un viewBox 200x200
  centrado en (100, 100). Estilo flat geométrico simple con caminos y formas
  básicas.
- **Orden de capas (back to front)**: cuerpo → capa → ropa → armadura → casco →
  pelo → cara → arma → escudo → accesorio. Garantiza que lo más cercano al
  espectador se renderiza último.
- **Mood desde playerState**: calcularMood() usa rachaGlobal y nivel de
  PlayerState, no se guarda en el personaje como fuente de verdad. Se calcula
  al renderizar. Esto mantiene la lógica pura separada de la UI.
- **Animación idle CSS**: transform translateY + scale en @keyframes, 3s ciclo,
  respetando prefers-reduced-motion (si el usuario tiene reducción de movimiento
  activada, no se aplica la animación).
- **Equipo de ejemplo**: cada ranura tiene una pieza DEFAULT_EQUIPMENT con id,
  nombre, rareza (común) y color. Se renderiza una forma geométrica simple por
  ranura (casco=yelmo, armadura=pechera, arma=bastón, escudo=escudo, capa=capa,
  accesorio=amuleto).
- **Ruta de desarrollo separada**: /dev/personaje no está en el Nav principal,
  solo accesible por URL, para ajustar el dibujo sin afectar la producción.

## Cómo probarlo

- `npm test` — ejecuta los 71 tests de Vitest (incluyendo 15 nuevos: 8 de mood
  + 7 de config de personaje), todos deben pasar.
- `npm run lint` — ESLint limpio.
- `npx tsc --noEmit` — verificación de tipos sin errores.
- `npm run dev` — levanta la app. Ve a /dev/personaje para probar combinaciones
  de piel, pelo, mood y equipamiento. La pantalla Hoy muestra el personaje con
  el mood calculado del jugador.

## Problemas conocidos y pendientes

- El personaje usa colores de DEFAULT_EQUIPMENT (hardcodeados) porque el
  catálogo de equipo real (src/data/equipment.ts) se implementará en la etapa
  10. Cuando exista, Personaje debería leer los colores del ítem equipado.
- Las páginas Progreso, Inventario y Ajustes siguen siendo placeholders.
- PWA (vite-plugin-pwa) aún no configurado.
- El accesorio se renderiza en el centro del pecho; su posición podría
  refinarse según el tipo de accesorio.

## Próximo paso concreto

Etapa 8: Pantalla Progreso con calendario y corrección de cumplimientos hasta
7 días atrás.
