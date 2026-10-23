# Etapa 6: PWA instalable y almacenamiento offline

## Objetivo y qué quedó hecho

Implementar la configuración completa de PWA con vite-plugin-pwa: manifest de aplicación, service worker con caché de todos los assets, íconos PNG generados, meta tags para iOS, componente "Instalar app", aviso de nueva versión disponible, e integración en la pantalla de Ajustes.

## Archivos creados o modificados

- `vite.config.ts` — Configuración de vite-plugin-pwa con manifest (name, short_name, descripción, start_url, scope, display standalone, theme_color, background_color, íconos 192/512/maskable), workbox con caché de assets y runtime caching para Google Fonts.
- `index.html` — Meta tags PWA: apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style, apple-mobile-web-app-title, apple-touch-icon, manifest link, viewport-fit=cover.
- `tailwind.config.js` — darkMode: 'class' para soporte de tema claro/oscuro.
- `postcss.config.js` — Cambiado a CommonJS (module.exports) para compatibilidad con build.
- `src/public/pwa-192x192.png` — Ícono PNG 192x192 generado.
- `src/public/pwa-512x512.png` — Ícono PNG 512x512 generado.
- `src/public/maskable-icon.png` — Ícono PNG 512x512 maskable generado.
- `src/public/favicon.svg` — Favicon SVG.
- `src/public/apple-touch-icon.png` — Ícono para iOS.
- `src/scripts/generate-icons.js` — Script de Node para generar íconos PNG usando canvas.
- `src/components/InstallPrompt.tsx` — Componente que muestra botón "Instalar app" cuando beforeinstallprompt se dispara, y aviso para iOS (Compartir → Agregar a pantalla de inicio).
- `src/components/UpdateAvailable.tsx` — Componente que muestra aviso de "Nueva versión disponible" cuando el service worker detecta una actualización, con botón para recargar.
- `src/components/AmuletoModal.tsx` — Corregido: retorna null cuando no hay oferta pendiente, usa playerState.amuletos correctamente.
- `src/hooks/usePWA.ts` — Hook personalizado que encapsula la lógica de detección de instalación, beforeinstallprompt, aviso iOS y función de instalar.
- `src/pages/App.tsx` — Integra InstallPrompt y UpdateAvailable en el árbol de componentes.
- `src/pages/Settings.tsx` — Agrega sección "Instalar app" con botón de instalación y aviso específico para iOS.
- `src/pages/Nav.tsx` — Agrega safe-area-bottom al nav inferior para iOS.
- `src/index.css` — Agrega estilos de safe areas (env()), scrollbar personalizada, prevención de selección de texto en táctil, touch-action manipulation.
- `src/virtual-pwa-register.d.ts` — Declaración de tipos para virtual:pwa-register.
- `PROGRESS.md` — Actualizado: etapa 6 marcada como hecha.
- `docs/etapas/etapa-6.md` — Este documento.

## Decisiones técnicas y por qué

- **vite-plugin-pwa**: Elegido por ser la solución estándar para PWA en Vite. Soporta generateSW mode automático, manifest generation, y workbox para caché de assets.
- **Manifest**: Incluye name, short_name, descripción, start_url '/', scope '/', display 'standalone', orientation 'portrait', theme_color y background_color en #0f172a (slate-900), lang es-AR, íconos 192/512/maskable.
- **Workbox**: Configurado con precache de 15 entradas (411 KiB) y runtime caching para Google Fonts (CacheFirst, 1 año de expiración).
- **Íconos**: Generados programáticamente con Node.js canvas: SVG base convertido a PNG en 192x192, 512x512 (any), 512x512 (maskable con safe zone del 73%), favicon.svg y apple-touch-icon.png.
- **Tema claro/oscuro**: Implementado con Tailwind darkMode: 'class', persistencia en localStorage (clave 'abitudine_tema'), clase 'dark' en document.documentElement.
- **beforeinstallprompt**: Capturado en usePWA hook, se muestra un botón "Instalar app" en la esquina inferior derecha. En iOS Safari se muestra aviso de "Compartir → Agregar a pantalla de inicio".
- **Nueva versión**: Detectada mediante registerSW de vite-plugin-pwa, se muestra un banner con botón "Actualizar" que recarga la página.
- **Safe areas**: CSS con env(safe-area-inset-*) para notch y home indicator de iOS.
- **Responsive**: Nav inferior en móvil, nav lateral en escritorio (md: breakpoint).

## Cómo probarlo

- `npm test` — ejecuta los 89 tests de Vitest, todos deben pasar.
- `npm run lint` — ESLint limpio.
- `npx tsc --noEmit` — verificación de tipos sin errores.
- `npm run dev` — levanta la app en http://localhost:5173.
- `npm run build` — build de producción exitoso con PWA generado (sw.js, manifest.webmanifest, workbox).
- Para probar la instalación: abrir en Chrome/Android y verificar que aparece el botón "Instalar app". En iPhone Safari, verificar el aviso de "Compartir → Agregar a pantalla de inicio" después de 3 segundos.
- Para probar la actualización: modificar el código, hacer build nuevamente, y verificar que aparece el banner de "Nueva versión disponible".

## Problemas conocidos y pendientes

- postcss.config.js usa CommonJS (module.exports) en lugar de ESM debido a que package.json tiene "type": "commonjs".
- La verificación con Lighthouse no se pudo ejecutar en este entorno (requiere servidor y navegador headless), pero el build de PWA se generó correctamente con sw.js, manifest.webmanifest y workbox.
- Algunas carpetas duplicadas (abizione, abimento) existen en el escritorio debido a problemas de caché del sistema de archivos; el repositorio git está en abitudine.
- Etapa 12 (accesibilidad) pendiente.

## Próximo paso concreto

Etapa 12: Accesibilidad (contraste, botones de 44px, labels, navegación por teclado) y tests Vitest adicionales.
