# Etapa 12: despliegue, CI/CD y documentación

## Objetivo y qué quedó hecho

Configurar el despliegue de la aplicación en múltiples plataformas (GitHub Pages,
Netlify, Vercel), crear el pipeline de CI/CD con GitHub Actions, escribir el
README con instrucciones completas, y realizar la revisión final de calidad.

## Archivos creados o modificados

- `vite.config.ts` — Agregado `base: process.env.VITE_BASE_PATH || '/'` para
  permitir base path personalizado en GitHub Pages.
- `package.json` — Agregado script `build:gh-pages` que usa
  `VITE_BASE_PATH=/abitudine/` para el build de GitHub Pages.
- `netlify.toml` — Configuración de despliegue para Netlify (build command,
  publish directory, redirección SPA, headers del service worker).
- `vercel.json` — Configuración de despliegue para Vercel (build command,
  output directory, redirecciones, headers del service worker).
- `.github/workflows/deploy.yml` — Workflow de GitHub Actions que hace checkout,
  setup Node.js, install dependencies, lint, tests, build con base path de
  GitHub Pages, y despliegue automático a GitHub Pages.
- `README.md` — Documentación completa con descripción del proyecto,
  características, stack, scripts, pruebas, despliegue en GitHub Pages/Netlify/
  Vercel, instalación como PWA en Android/iPhone/Windows, estructura del
  proyecto, modelo de datos, accesibilidad y cómo contribuir.
- `PROGRESS.md` — Actualizado: etapa 12 (despliegue) marcada como hecha,
  próximo paso: etapa 13 (accesibilidad).
- `docs/etapas/etapa-12.md` — Este documento.

## Decisiones técnicas y por qué

- **Base path condicional**: `base: process.env.VITE_BASE_PATH || '/'` permite
  que la app funcione en la raíz para desarrollo local, Netlify y Vercel, y en
  `/abitudine/` para GitHub Pages (project page).
- **Script `build:gh-pages`**: Separa el build de GitHub Pages del build
  genérico, inyectando la variable de entorno para el base path correcto.
- **GitHub Actions**: Usa `actions/upload-pages-artifact@v3` y
  `actions/deploy-pages@v4`, los actions oficiales de GitHub para Pages.
  Requiere permisos `contents: read`, `pages: write`, `id-token: write`.
- **Redirección SPA**: Tanto Netlify como Vercel redirigen todas las rutas a
  `/index.html` para que el router de React funcione correctamente en recargas
  de página.
- **Headers del service worker**: `Cache-Control: no-cache` y
  `Service-Worker-Allowed: "/"` para asegurar que el SW se actualice
  correctamente.

## Cómo probarlo

- `npm run lint` — ESLint limpio (solo warning informativo de React version).
- `npm test` — 89 tests de Vitest pasando en 10 archivos de test.
- `npx tsc --noEmit` — Verificación de tipos sin errores.
- `npm run build` — Build de producción exitoso con PWA generado
  (sw.js, manifest.webmanifest, workbox, 72 módulos transformados).
- `npm run build:gh-pages` — Build con base path `/abitudine/` para GitHub Pages.
- Para probar el despliegue: pushear a `master` o `main` y el workflow de
  GitHub Actions se ejecutará automáticamente.

## Problemas conocidos y pendientes

- `postcss.config.js` usa CommonJS (`module.exports`) en lugar de ESM debido a
  que `package.json` tiene `"type": "commonjs"`.
- `tailwind.config.js` muestra warning como ES module en Vite; no afecta la
  ejecución.
- La verificación con Lighthouse no se pudo ejecutar en este entorno
  (requiere servidor y navegador headless), pero el build de PWA se generó
  correctamente con sw.js, manifest.webmanifest y workbox.
- Etapa 13 (accesibilidad) pendiente.

## Próximo paso concreto

Etapa 13: Accesibilidad (contraste, botones de 44px, labels, navegación por
teclado) y tests Vitest adicionales.
