import { useEffect, useRef } from 'react'

/* Best density-to-legibility characters for ASCII art shapes:
   space = totalmente vacío → @ = completamente lleno
   Elegidos por peso visual progresivo, sin ambigüedad de densidad        */
const CHARS = [' ', ' ', '.', '·', ':', ';', '+', '-', '=', 'o', '*', 'x', '#', 'O', '@']
const N = CHARS.length

/* ── Wave field ──────────────────────────────────────────────────────
   Base: tres ondas diagonales (igual que el original con óvalos).
   Shape mod: capas angulares que van ciclando para producir
   estrella-5, estrella-6 / flor, corazón / cardioid, y anillos.
   Cada forma tiene su propio peso que oscila entre 0 y 1 lentamente,
   así el campo evoluciona: óvalo → estrella → corazón → anillo → óvalo.
   El peso 'r' hace que la modulación crezca lejos del centro para que
   los "brazos" de la estrella sean visibles y no colapsados al centro. */
function field(nx, ny, t) {
  const r     = Math.sqrt(nx * nx + ny * ny)
  const theta = Math.atan2(ny, nx)
  const cy    = t * 0.00095   // slow master cycle

  /* Base diagonal (produce óvalos moviéndose en diagonal — como el original) */
  const base =
    Math.sin(t * 0.007 + nx * 2.9 + ny * 2.0) * 0.42 +
    Math.cos(t * 0.005 + ny * 3.4 - nx * 1.3) * 0.26 +
    Math.sin(t * 0.009 + nx * 1.3 + ny * 3.9) * 0.14

  /* Estrella 5 puntas — coseno del ángulo multiplicado por 5 */
  const w5  = Math.max(0, Math.sin(cy))
  const s5  = Math.cos(5 * theta + t * 0.002) * 0.32 * w5

  /* Flor / estrella 6 */
  const w6  = Math.max(0, Math.sin(cy + 1.6))
  const s6  = Math.cos(6 * theta - t * 0.0016) * 0.28 * w6

  /* Cardioid / heart-like: (x²+y²−1)³ − x²y³ ≈ 0 en su contorno.
     Usamos la distancia a esa superficie como onda para que el patrón
     reproduzca curvas tipo corazón en el campo de densidad.           */
  const wH  = Math.max(0, Math.sin(cy + 3.1))
  const hx  = nx * 1.2,  hy = -ny * 1.2 + 0.1
  const hf  = Math.pow(hx*hx + hy*hy - 1, 3) - hx*hx * Math.pow(hy, 3)
  const heart = Math.sin(hf * 2.5 + t * 0.006) * 0.24 * wH

  /* Anillos concéntricos */
  const wR  = Math.max(0, Math.sin(cy + 4.7))
  const ring = Math.sin(r * 7.5 - t * 0.010) * 0.22 * wR

  /* Blend: las formas tienen más peso lejos del centro */
  const shapeMod = (s5 + s6 + heart + ring) * Math.min(r * 1.6, 1.0)
  return base + shapeMod * 0.55
}

/* ── Glow hue: azul → morado → rosa ────────────────────────────────── */
function glowHue(t) {
  return 268 + Math.sin(t * 0.011) * 58 + Math.cos(t * 0.007) * 20
}

/* ── Stable hash per cell ──────────────────────────────────────────── */
function cellHash(c, r) {
  return Math.abs(Math.sin(c * 127.1 + r * 311.7) * 43758.5) % 1
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function AsciiCanvas({ className }) {
  const canvasRef = useRef(null)
  const stateRef  = useRef({
    raf: null, t: 0, mx: -9999, my: -9999,
    glowMap: null, cols: 0, rows: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx   = canvas.getContext('2d')
    const state = stateRef.current

    const FS   = 19
    const FONT = `${FS}px 'Courier New', Courier, monospace`
    ctx.font = FONT
    const CW   = ctx.measureText('M').width   // monospace: all chars same width

    const HOVER_R = 115
    const DECAY   = 0.87

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      state.cols    = Math.ceil(canvas.width  / CW) + 1
      state.rows    = Math.ceil(canvas.height / FS) + 1
      state.glowMap = new Float32Array(state.cols * state.rows)
    }

    function frame() {
      const { t, mx, my } = state
      const W = canvas.width, H = canvas.height
      const COLS = state.cols, ROWS = state.rows
      const gmap = state.glowMap
      if (!W || !H || !gmap) { state.raf = requestAnimationFrame(frame); return }

      /* ── Glow map update ── */
      const hasMouse = mx > -500
      const hue = glowHue(t)
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          let g = gmap[r * COLS + c] * DECAY
          if (hasMouse) {
            const dx = c * CW - mx, dy = r * FS - my
            const d  = Math.sqrt(dx*dx + dy*dy)
            if (d < HOVER_R) g = Math.max(g, 1 - d / HOVER_R)
          }
          gmap[r * COLS + c] = g
        }
      }

      /* ── Draw ── */
      ctx.clearRect(0, 0, W, H)
      ctx.font         = FONT
      ctx.textBaseline = 'top'

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          /* Normalized coords −1 … +1 */
          const nx = c / (COLS - 1) * 2 - 1
          const ny = r / (ROWS - 1) * 2 - 1

          /* Field value → 0…1. Range tightened to increase contrast:
             mapping [-0.88, 0.88] → [0,1] instead of [-1.05,1.05]
             pushes more cells to the extremes (empty or dense)         */
          const z  = field(nx, ny, t)
          const n  = Math.max(0, Math.min(1, (z + 0.88) / 1.76))
          const idx = Math.round(n * (N - 1))
          const char = CHARS[idx]
          if (char === ' ') continue

          const sx = c * CW
          const sy = r * FS
          const g  = gmap[r * COLS + c]

          /* Glow background */
          if (g > 0.02) {
            ctx.fillStyle   = `hsl(${hue.toFixed(0)},88%,58%)`
            ctx.globalAlpha = g * 0.76
            ctx.fillRect(sx, sy, CW + 0.5, FS)
            ctx.globalAlpha = 1
          }

          /* Text color */
          ctx.fillStyle = g > 0.28
            ? `rgba(255,255,255,${Math.min(1, g * 1.4).toFixed(2)})`
            : `rgba(10,10,10,${(0.06 + n * 0.86).toFixed(2)})`

          ctx.fillText(char, sx, sy)
        }
      }

      state.t++
      state.raf = requestAnimationFrame(frame)
    }

    resize()
    state.raf = requestAnimationFrame(frame)

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      state.mx = e.clientX - rect.left
      state.my = e.clientY - rect.top
    }

    function onTouchMove(e) {
      const touch = e.touches[0]
      const rect  = canvas.getBoundingClientRect()
      state.mx = touch.clientX - rect.left
      state.my = touch.clientY - rect.top
    }

    // clearMouse sets coords off-screen → glow decays naturally via DECAY each frame
    function clearMouse() { state.mx = -9999; state.my = -9999 }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', clearMouse)
    // Touch: track finger, fade on lift
    window.addEventListener('touchmove',   onTouchMove, { passive: true })
    window.addEventListener('touchend',    clearMouse)
    window.addEventListener('touchcancel', clearMouse)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(state.raf)
      window.removeEventListener('mousemove',   onMouseMove)
      window.removeEventListener('mouseleave',  clearMouse)
      window.removeEventListener('touchmove',   onTouchMove)
      window.removeEventListener('touchend',    clearMouse)
      window.removeEventListener('touchcancel', clearMouse)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
