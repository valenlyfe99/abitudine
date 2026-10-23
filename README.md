# Abitudine

App de registro de hábitos con un personaje aventurero que evoluciona y gana
equipamiento según tus rachas. PWA instalable en Android, iPhone y Windows.
Interfaz en español rioplatense (voseo).

---

## 📱 ¿Qué es Abitudine?

Abitudine te ayuda a crear y mantener hábitos mientras tu personaje aventurero
evoluciona y gana equipamiento según tus rachas de cumplimiento. Cada hábito
cumplido suma experiencia (XP), atributos y rachas que desbloquean nuevo equipo
para tu personaje.

### Características principales

- **Registro de hábitos**: crear, editar, archivar y borrar hábitos con
  nombre, emoji, color, categoría y frecuencia (diario o días específicos).
- **Pantalla Hoy**: checklist de hábitos del día con marcar/desmarcar y
  corrección de hasta 7 días atrás desde el calendario.
- **Progreso**: nivel, XP, rango, atributos, rachas por hábito y racha global,
  calendario mensual con días cumplidos.
- **Personaje aventurero**: dibujado en SVG por capas (casco, armadura, arma,
  escudo, capa, accesorio), con estados de ánimo (orgulloso, normal, cansado)
  y animación idle.
- **Inventario**: equipamiento desbloqueable por nivel, racha o atributos,
  con equipar/desequipar y vista previa en el personaje.
- **Celebración**: animación y modal al subir de nivel, cambiar de rango o
  desbloquear equipamiento.
- **Ajustes**: tema claro/oscuro, exportar/importar datos (JSON), reiniciar
  progreso.
- **PWA**: instalable en Android, iPhone y Windows, funciona offline.

---

## 🛠 Stack

- React + Vite + TypeScript (strict)
- Tailwind CSS
- Zustand (estado global)
- vite-plugin-pwa (PWA, service worker, manifiesto)
- Vitest + ESLint + Prettier (tests, lint, formateo)
- localStorage (persistencia con StorageAdapter intercambiable)

---

## 🚀 Comienzo rápido

### Requisitos

- Node.js 18 o superior
- npm (incluido con Node.js)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/abitudine.git
cd abitudine

# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev

# La app estará disponible en http://localhost:5173
```

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción (TypeScript + Vite) |
| `npm run build:gh-pages` | Build para GitHub Pages (base path `/abitudine/`) |
| `npm test` | Ejecutar tests de Vitest |
| `npm run test:watch` | Modo observador de tests |
| `npm run lint` | Ejecutar ESLint |
| `npm run lint:fix` | Corregir automáticamente problemas de lint |
| `npm run format` | Formatear código con Prettier |
| `npm run format:check` | Verificar formateo con Prettier |

---

## 🧪 Pruebas

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo observador
npm run test:watch
```

Los tests cubren:
- Fechas locales (cambio de día, zonas horarias, verano)
- Rachas por hábito y racha global (incluyendo hábitos semanales y creados a mitad de semana)
- XP, niveles, rangos, atributos y amuletos
- Desbloqueo de equipamiento
- Almacenamiento y migración de datos
- Exportar/importar datos JSON (incluyendo archivos inválidos)

---

## 📦 Despliegue

### GitHub Pages (recomendado)

1. Sube tu código a un repositorio de GitHub llamado `abitudine`.
2. Ve a **Settings → Pages** en tu repositorio.
3. En "Build and deployment", selecciona **GitHub Actions** como origen.
4. El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente en cada push a `master` o `main`.
5. Tu sitio estará disponible en `https://tu-usuario.github.io/abitudine/`.

El workflow:
- Instala dependencias con `npm ci`
- Ejecuta lint y tests
- Construye con `npm run build:gh-pages` (base path `/abitudine/`)
- Despliega a GitHub Pages automáticamente

### Netlify

1. Conecta tu repositorio de GitHub a Netlify.
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Netlify detecta automáticamente el `netlify.toml` incluido.
4. Tu sitio estará disponible en la URL que te asigne Netlify.

### Vercel

1. Conecta tu repositorio de GitHub a Vercel.
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Vercel detecta automáticamente el `vercel.json` incluido.
4. Tu sitio estará disponible en la URL que te asigne Vercel.

### Despliegue manual (cualquier servidor estático)

```bash
npm run build
# Sube el contenido de la carpeta dist/ a tu servidor
```

---

## 📲 Instalación como PWA

Abitudine es una Progressive Web App. Puedes instalarla en tu dispositivo para usarla como una app nativa.

### En Android (Chrome)

1. Abre la app en Chrome.
2. Verás un botón "Instalar app" en la parte inferior de la pantalla.
3. Toca el botón y confirma la instalación.
4. La app aparecerá en tu cajón de aplicaciones y pantalla de inicio.

Alternativamente:
1. Toca los tres puntos (⋮) en Chrome.
2. Selecciona "Agregar a pantalla de inicio".
3. Confirma la instalación.

### En iPhone (Safari)

1. Abre la app en Safari.
2. Toca el botón de compartir (⬆️) en la parte inferior.
3. Desplázate y toca **"Agregar a pantalla de inicio"**.
4. Confirma el nombre y toca "Agregar".
5. La app aparecerá en tu pantalla de inicio.

> **Nota**: En iOS, la app también muestra un aviso automático después de 3 segundos recordándote cómo instalarla.

### En Windows (Edge o Chrome)

1. Abre la app en Edge o Chrome.
2. Verás un icono de instalación en la barra de direcciones o un botón "Instalar app".
3. Haz clic en él y confirma.
4. La app se instalará como una aplicación de Windows independiente.

---

## 🏗 Estructura del proyecto

```
abitudine/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions para GitHub Pages
├── docs/
│   ├── SPEC.md                 # Especificación general
│   ├── PLAN.md                 # Plan de arquitectura y contenido
│   └── etapas/
│       └── etapa-N.md          # Cierre de cada etapa
├── public/
│   ├── favicon.svg             # Favicon
│   ├── apple-touch-icon.png    # Ícono para iOS
│   ├── pwa-192x192.png         # Ícono PWA 192px
│   ├── pwa-512x512.png         # Ícono PWA 512px
│   └── maskable-icon.png       # Ícono maskable PWA
├── scripts/
│   └── generate-icons.js       # Script para generar íconos
├── src/
│   ├── components/
│   │   ├── character/          # Personaje SVG por capas
│   │   │   └── Personaje.tsx
│   │   ├── AmuletoModal.tsx    # Modal de uso de amuleto
│   │   ├── CelebrationModal.tsx # Modal de celebración
│   │   ├── InstallPrompt.tsx   # Botón de instalación PWA
│   │   ├── Nav.tsx             # Navegación responsive
│   │   └── UpdateAvailable.tsx # Aviso de nueva versión
│   ├── config/
│   │   ├── character.ts        # Configuración de capas y equipo
│   │   └── progression.ts      # Constantes de progresión (XP, rangos)
│   ├── data/
│   │   └── equipment.ts        # Catálogo de equipamiento
│   ├── domain/
│   │   ├── fechas.ts           # Funciones de fechas locales
│   │   ├── index.ts            # Exportaciones del dominio
│   │   ├── mood.ts             # Cálculo de estados de ánimo
│   │   ├── progresion.ts       # XP, atributos, amuletos, recálculo
│   │   ├── rachas.ts           # Rachas por hábito y globales
│   │   ├── recalculo.ts        # Recalcular estado desde historial
│   │   ├── storage.ts          # StorageAdapter y migración
│   │   ├── types.ts            # Tipos de dominio
│   │   └── unlocks.ts          # Desbloqueo de equipamiento
│   ├── domain/*.test.ts        # Tests de dominio
│   ├── hooks/
│   │   └── usePWA.ts           # Hook de PWA e instalación
│   ├── pages/
│   │   ├── Habits.tsx          # CRUD de hábitos
│   │   ├── Home.tsx / Today.tsx # Pantalla Hoy
│   │   ├── Inventory.tsx       # Inventario de equipamiento
│   │   ├── Onboarding.tsx      # Creación de personaje
│   │   ├── Progress.tsx        # Pantalla de progreso
│   │   ├── Settings.tsx        # Ajustes (tema, export/import)
│   │   └── DevPersonaje.tsx    # Ruta de desarrollo /dev/personaje
│   ├── store/
│   │   └── index.ts            # Store de Zustand
│   ├── App.tsx                 # Componente raíz con router
│   ├── index.css               # Estilos base y Tailwind
│   ├── main.tsx                # Punto de entrada
│   └── vite-env.d.ts           # Tipos de Vite
├── .github/workflows/
├── index.html                  # Punto de entrada HTML con meta tags PWA
├── netlify.toml                # Configuración para Netlify
├── vercel.json                 # Configuración para Vercel
├── package.json                # Dependencias y scripts
├── postcss.config.js           # Configuración de PostCSS
├── tailwind.config.js          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
├── vite.config.ts              # Configuración de Vite y PWA
└── README.md                   # Este archivo
```

---

## 📊 Modelo de datos

Los datos se guardan en `localStorage` bajo la clave `abitudine_data`. El modelo es versionado (versión 1) con función de migración para actualizar datos de versiones anteriores.

Entidades principales:
- **Habit**: nombre, emoji, color, categoría, frecuencia, días de la semana, archivado
- **Completion**: habitId, fecha, marcadoEn
- **Character**: nombre, tono de piel, peinado, color de pelo, equipado, estado de ánimo
- **PlayerState**: XP, nivel, rango, atributos, racha global, amuletos, rachas por hábito
- **SaveData**: versión, hábitos, cumplimientos, personaje, estado del jugador, equipamiento desbloqueado

---

## ♿ Accesibilidad

- Contraste de colores según WCAG
- Botones mínimos de 44px
- Labels en todos los controles
- Navegación por teclado
- Soporte para `prefers-reduced-motion`
- Soporte para `prefers-color-scheme` (tema claro/oscuro)

---

## 🗺 Próximos pasos

- Pantalla de calendario de progreso con corrección hasta 7 días atrás
- Dibujo del personaje en SVG por capas (etapa en curso)
- Pantallas de progreso, inventario y ajustes
- Personaje SVG con estados de ánimo y animación idle

---

## 📄 Licencia

ISC

---

## 🤝 Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nombre`)
3. Haz commit de tus cambios (`git commit -m 'Etapa N: descripción'`)
4. Push a tu rama (`git push origin feature/nombre`)
5. Abre un Pull Request

---

## 📞 Soporte

Si tienes problemas o preguntas, abre un issue en GitHub.
