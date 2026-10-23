# Etapa 0: cimientos y plan

## Objetivo y qué quedó hecho

Inicializar el repositorio y dejar toda la especificación, el plan y las
convenciones escritas en archivos del proyecto para que cualquier modelo pueda
retomar el trabajo sin ver esta conversación. No se escribió código de la app.

## Archivos creados o modificados

- `.gitignore` — excluye node_modules, dist, .env y .env.* (además de IDE, logs y PWA).
- `docs/SPEC.md` — especificación general completa (stack, hábitos, pantallas,
  progresión, personaje y equipo, arquitectura y calidad), copiada íntegra.
- `AGENTS.md` — descripción del proyecto, stack y convenciones, instrucción de
  arranque, instrucción de trabajar solo en la etapa pedida y REGLA DE CIERRE
  DE ETAPA.
- `PROGRESS.md` — tabla de etapas (solo la 0 hecha, resto pendiente), comandos
  clave vacíos y próximo paso.
- `docs/PLAN.md` — propuesta de estructura de carpetas, modelo de datos en
  TypeScript, catálogo inicial de equipo (4 piezas por ranura con rareza y
  condición de desbloqueo) y curva de niveles inicial con umbrales de rangos.
- `docs/etapas/etapa-0.md` — este documento, cierra la etapa 0.

## Decisiones técnicas y por qué

- Stack fijo por SPEC: React + Vite + TS strict + Tailwind + vite-plugin-pwa +
  Vitest + ESLint + Prettier.
- El estado y la persistencia (Zustand o Context + reducer, StorageAdapter)
  quedan para justificar en PLAN.md / etapa 2; aquí solo se declara la
  intención.
- Fechas en día local (YYYY-MM-DD), nunca UTC; modelo versionado con migración.
- Commits por etapa con formato "Etapa N: <resumen>", sin push salvo pedido
  explícito.

## Cómo probarlo

No hay app aún. Comandos de verificación del estado del repositorio:

- `git status` — debería mostrar los archivos listos para commitear.
- `git log --oneline -5` — debería mostrar el commit "Etapa 0: cimientos y plan".

## Problemas conocidos y pendientes

- Pendiente: etapa 1 (scaffold Vite + React + TS + Tailwind + PWA + lint).
- Los comandos clave de PROGRESS.md están vacíos; se completan en la etapa 1.

## Próximo paso concreto

Etapa 1: scaffold Vite + React + TS + Tailwind + PWA + lint.
