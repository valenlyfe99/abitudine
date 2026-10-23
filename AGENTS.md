# AGENTS.md — Abitudine

## Descripción del proyecto

App de registro de hábitos con un personaje aventurero que evoluciona y gana
equipamiento según las rachas. PWA instalable en Android, iPhone y Windows.
Interfaz en español rioplatense (voseo). Estado en localStorage con adapter
intercambiable, lógica pura de progresión separada de la UI, y tests con Vitest.

## Stack y convenciones

React + Vite + TypeScript (strict), Tailwind CSS, vite-plugin-pwa, Vitest,
ESLint + Prettier. Lógica pura en src/domain. Fechas en día local (YYYY-MM-DD),
nunca UTC. Modelo de datos versionado con migración. Commits por etapa:
"Etapa N: <resumen>". No hacer push salvo que el usuario lo pida.

## Instrucción de arranque

Antes de hacer nada, leé PROGRESS.md, docs/SPEC.md y el último archivo de
docs/etapas/.

## Trabajar solo en la etapa pedida

No te adelantes a las siguientes etapas. Implementá solo lo que pide la etapa
actual y dejá el resto pendiente.

## REGLA DE CIERRE DE ETAPA

Al terminar cada etapa, antes de pedirme confirmación:

1. Creá docs/etapas/etapa-N.md con: objetivo y qué quedó hecho; archivos creados
   o modificados (una línea de para qué sirve cada uno); decisiones técnicas y
   por qué; cómo probarlo (comandos exactos y qué debería verse o pasar);
   problemas conocidos y pendientes; próximo paso concreto.
2. Actualizá PROGRESS.md: etapa actual, tabla de etapas (hecha / en curso /
   pendiente), comandos clave y próximo paso.
3. Hacé un commit de git "Etapa N: <resumen>". No hagas push.
El documento tiene que alcanzar para que otro modelo, sin ver esta conversación,
retome el trabajo leyendo solo esos archivos y el código.
Si te quedás sin cupo o tenés que cortar a mitad de etapa, hacé un commit
"WIP etapa N" y anotá en PROGRESS.md qué quedó a medias.
