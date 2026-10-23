# Deploy a GitHub Pages

## Objetivo

Publicar el repositorio de Abitudine en GitHub y dejarlo listo para publicarse
en GitHub Pages mediante GitHub Actions.

## Qué se hizo

1. Verificación de `git init` y `.gitignore` (excluye `node_modules`, `dist`,
   `.env`, `.*`).
2. Verificación de secretos: no se encontraron API keys, tokens, contraseñas ni
   archivos `.env` versionados en el código ni en el historial.
3. Ajuste de configuración para el repositorio `/abitudine/`:
   - `vite.config.ts`: `base: process.env.VITE_BASE_PATH || '/'`
   - `package.json`: script `build:gh-pages` con `VITE_BASE_PATH=/abitudine/`
   - `.github/workflows/deploy.yml`: usa `build:gh-pages` y despliega a Pages
   - `README.md`: URLs y ejemplos actualizados
4. Verificación de calidad: lint, tests y build pasan sin errores.
5. Commit de cambios pendientes.
6. Configuración del remoto y push:
   - `git branch -M main`
   - `git remote add origin https://github.com/valenlyfe99/abitudine.git`
   - `git push -u origin main`
   - `git tag v1.0` y `git push --tags`
7. Verificación final: `git status` y `git log --oneline -5` confirman que todo
   está subido.

## Qué tenés que hacer en GitHub

1. Ir a **Settings > Pages** del repositorio.
2. En **Build and deployment > Source**, seleccionar **GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente en
   cada push a `main`.
4. Ver el estado del deploy en la pestaña **Actions** del repositorio.
5. Una vez completo, el sitio estará disponible en
   `https://valenlyfe99.github.io/abitudine/`.

## Archivos creados o modificados

- `.github/workflows/deploy.yml` — pipeline de CI/CD para GitHub Pages
- `vite.config.ts` — base path condicional para GitHub Pages
- `package.json` — script `build:gh-pages`
- `netlify.toml` — configuración para Netlify
- `vercel.json` — configuración para Vercel
- `README.md` — documentación completa de despliegue e instalación
- `docs/etapas/deploy-github.md` — este documento
- `PROGRESS.md` — actualizado con etapa de despliegue como hecha
