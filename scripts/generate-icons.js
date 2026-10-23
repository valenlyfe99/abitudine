const { createCanvas, registerFont } = require('canvas')
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, 'public')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const BG_COLOR = '#0f172a' // slate-900
const ACCENT_COLOR = '#3b82f6' // blue-500
const ACCENT_LIGHT = '#60a5fa' // blue-400
const WHITE = '#ffffff'

// Dibuja un ícono de aventurero en un canvas dado
function drawAdventurer(ctx, width, height, safe = false) {
  const cx = width / 2
  const cy = height / 2
  const s = Math.min(width, height)

  // Fondo
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, width, height)

  // Círculo de fondo suave
  ctx.fillStyle = '#1e293b' // slate-800
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.42, 0, Math.PI * 2)
  ctx.fill()

  // Capa (detrás del cuerpo)
  ctx.fillStyle = ACCENT_COLOR
  ctx.beginPath()
  ctx.arc(cx, cy + s * 0.08, s * 0.22, Math.PI * 0.4, Math.PI * 1.6)
  ctx.lineTo(cx - s * 0.08, cy + s * 0.35)
  ctx.lineTo(cx + s * 0.08, cy + s * 0.35)
  ctx.closePath()
  ctx.fill()

  // Cuerpo / túnica
  ctx.fillStyle = ACCENT_LIGHT
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.13, cy - s * 0.02)
  ctx.lineTo(cx - s * 0.13, cy + s * 0.22)
  ctx.lineTo(cx + s * 0.13, cy + s * 0.22)
  ctx.lineTo(cx + s * 0.13, cy - s * 0.02)
  ctx.closePath()
  ctx.fill()

  // Cabeza
  ctx.fillStyle = '#f6ede4' // tono de piel claro
  ctx.beginPath()
  ctx.arc(cx, cy - s * 0.14, s * 0.11, 0, Math.PI * 2)
  ctx.fill()

  // Pelo (corto)
  ctx.fillStyle = '#3e2723'
  ctx.beginPath()
  ctx.arc(cx, cy - s * 0.145, s * 0.125, Math.PI * 0.2, Math.PI * 0.8)
  ctx.fill()

  // Sombrero de aventurero
  ctx.fillStyle = '#78350f' // amber-800
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.17, cy - s * 0.28)
  ctx.lineTo(cx + s * 0.17, cy - s * 0.28)
  ctx.lineTo(cx + s * 0.12, cy - s * 0.20)
  ctx.lineTo(cx - s * 0.12, cy - s * 0.20)
  ctx.closePath()
  ctx.fill()

  // Ala del sombrero
  ctx.beginPath()
  ctx.ellipse(cx, cy - s * 0.22, s * 0.20, s * 0.04, 0, 0, Math.PI * 2)
  ctx.fill()

  // Letra A en el centro
  ctx.fillStyle = WHITE
  ctx.font = `bold ${s * 0.30}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('A', cx, cy + s * 0.02)

  // Borde decorativo
  ctx.strokeStyle = ACCENT_COLOR
  ctx.lineWidth = s * 0.025
  ctx.strokeRect(s * 0.06, s * 0.06, width - s * 0.12, height - s * 0.12)
}

// Genera un PNG
function generatePng(size, filename, maskable = false) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  if (maskable) {
    // Para maskable: diseño centrado dentro del safe zone (80%)
    drawAdventurer(ctx, size, size, true)
    // Círculo de safe zone para referencia visual (no se muestra al usuario)
    // Pero dibujamos el contenido más pequeño para que quepa en el círculo
    ctx.save()
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = WHITE
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size * 0.73, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  } else {
    drawAdventurer(ctx, size, size)
  }

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(OUT_DIR, filename), buffer)
  console.log(`Generado: ${filename} (${size}x${size})`)
}

generatePng(192, 'pwa-192x192.png')
generatePng(512, 'pwa-512x512.png')
generatePng(512, 'maskable-icon.png', true)

// Favicon SVG
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0f172a"/>
  <circle cx="50" cy="50" r="42" fill="#1e293b"/>
  <path d="M 50 35 L 58 50 L 50 65 L 42 50 Z" fill="#3b82f6"/>
  <circle cx="50" cy="42" r="8" fill="#f6ede4"/>
</svg>
`.trim()
fs.writeFileSync(path.join(OUT_DIR, 'favicon.svg'), faviconSvg)
console.log('Generado: favicon.svg')

// Apple touch icon (misma que 192)
fs.copyFileSync(
  path.join(OUT_DIR, 'pwa-192x192.png'),
  path.join(OUT_DIR, 'apple-touch-icon.png')
)
console.log('Generado: apple-touch-icon.png')

console.log('Todos los íconos generados correctamente.')
