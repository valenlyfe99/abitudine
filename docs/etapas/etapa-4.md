# Etapa 4: catálogo de equipo, inventario y celebración

## Objetivo y qué quedó hecho

Implementar el catálogo completo de equipo con dibujo SVG por capa, desbloqueo
automático al cumplir condiciones, pantalla de Inventario con equipar/desequipar,
y celebración (animación + modal) al subir de nivel, cambiar de rango o
desbloquear una pieza. Todo conectado al store de Zustand y persiste en
localStorage.

## Archivos creados o modificados

- `src/domain/types.ts` — `EquipmentItem` extendido con `svgPath` y `svgFill`;
  nuevo tipo `CelebrationEvent`; `SaveData` incluye `unlockedEquipment`.
- `src/domain/index.ts` — exporta `CelebrationEvent`.
- `src/domain/storage.ts` — migración maneja `unlockedEquipment`; `createEmptySaveData`
  lo inicializa vacío.
- `src/domain/unlocks.test.ts` — agregados `svgPath` a objetos de prueba.
- `src/data/equipment.ts` — catálogo completo de 24 piezas (4 por ranura:
  casco, armadura, arma, escudo, capa, accesorio), con rarezas común/raro/épico/
  legendario, condiciones de desbloqueo (nivel, racha, atributo), `svgPath` por
  pieza, colores por rareza, helpers `getEquipmentById`, `getEquipmentBySlot`,
  `rarityColor`, `rarityLabel`.
- `src/data/equipment.test.ts` — 10 tests: 24+ items, 4 por ranura, rarezas,
  svgPath definido, getEquipmentById/Slot, colores y labels.
- `src/store/index.ts` — estado `unlockedEquipment`, `equipped`, `celebration`;
  acciones `equipItem`, `unequipItem`, `showCelebration`, `hideCelebration`,
  `checkUnlocksAndCelebrate` (detecta subida de nivel, cambio de rango, nuevos
  desbloqueos tras toggleCompletion); desbloqueo automático de items de nivel 1
  al iniciar.
- `src/store/equipment.test.ts` — 10 tests: puedeDesbloquear (nivel/racha/
  atributo), desbloqueo inicial nivel 1, equipar/bloquear/desequipar,
  celebración mostrar/ocultar.
- `src/components/character/Personaje.tsx` — usa `svgPath`/`svgFill` del catálogo
  de equipo en lugar de colores hardcodeados; cada capa renderiza el path SVG
  del ítem equipado.
- `src/components/CelebrationModal.tsx` — modal con animación de confeti (CSS
  @keyframes), respeta `prefers-reduced-motion`, muestra título/subtítulo según
  tipo de celebración (nivel/rango/desbloqueo), botón "Equipar ahora" para items
  desbloqueados.
- `src/pages/Inventory.tsx` — pantalla completa: grid de 6 ranuras, color por
  rareza, piezas equipadas/bloqueadas, vista previa SVG de cada ítem, equipar y
  desequipar, detalle por ranura con todos los ítems disponibles y bloqueados.
- `src/pages/Today.tsx` — integra `CelebrationModal`; se muestra cuando hay
  evento de celebración pendiente.
- `src/App.tsx` — sin cambios funcionales (ruta /inventario ya existía).
- `PROGRESS.md` — etapa 10 marcada como hecha.
- `docs/etapas/etapa-4.md` — este documento.

## Decisiones técnicas y por qué

- **Catálogo en src/data/equipment.ts**: separado del dominio para facilitar
  su expansión futura (ej. traerlo de una API). Cada pieza tiene `svgPath` para
  renderizarse en el personaje.
- **svgPath por capa**: el componente Personaje renderiza el path SVG del ítem
  equipado en cada ranura, usando el color de rareza o el `svgFill` del ítem.
- **Desbloqueo automático**: tras cada `toggleCompletion`, el store verifica
  qué items nuevos cumplen sus condiciones y los agrega a `unlockedEquipment`.
- **Celebración**: detecta subida de nivel, cambio de rango y nuevos desbloqueos.
  El modal se muestra con animación de confeti CSS, desactivada si
  `prefers-reduced-motion: reduce`.
- **Persistencia**: `unlockedEquipment` y `equipped` se guardan en
  `SaveData` y se restauran al cargar.
- **Equipar solo desbloqueados**: `equipItem` verifica que el ítem esté en
  `unlockedEquipment` antes de equiparlo.

## Cómo probarlo

- `npm test` — ejecuta los 89 tests de Vitest (incluyendo 18 nuevos: 10 de
  equipment + 10 de store equipamiento), todos deben pasar.
- `npm run lint` — ESLint limpio.
- `npx tsc --noEmit` — verificación de tipos sin errores.
- `npm run dev` — levanta la app. Ve a `/inventario` para ver el catálogo,
  equipar/desequipar ítems. Ve a `/dev/personaje` para probar combinaciones.
  Al marcar hábitos en `/hoy`, podés subir de nivel o desbloquear ítems y
  ver la celebración.

## Problemas conocidos y pendientes

- La celebración no detecta desbloqueos al iniciar la app (solo tras
  toggleCompletion). Esto es intencional para evitar modales al cargar.
- Las páginas Progreso, Ajustes siguen siendo placeholders.
- PWA (vite-plugin-pwa) aún no configurado.
- El accesorio se renderiza en el centro del pecho; su posición podría
  refinarse.

## Próximo paso concreto

Etapa 8: Pantalla Progreso con calendario y corrección de cumplimientos hasta
7 días atrás.
