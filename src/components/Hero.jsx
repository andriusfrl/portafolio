import { useEffect, useRef } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import AsciiCanvas from './AsciiCanvas'
import styles from './Hero.module.css'
import characterImg from '../assets/character.png'

// Same formula used in AsciiCanvas — keeps both in sync
function glowHue(t) {
  return 268 + Math.sin(t * 0.011) * 58 + Math.cos(t * 0.007) * 20
}

export default function Hero() {
  const { displayed, done } = useTypewriter("Hola, soy Andrés", 72, 600)
  const cvBtnRef = useRef(null)

  // Pick CV language based on browser locale
  const isSpanish = navigator.language?.startsWith('es')
  const cvHref     = isSpanish ? '/CV%20Andres%20ES.pdf' : '/CV%20Andres%20EN.pdf'
  const cvFilename = isSpanish ? 'CV Andres ES.pdf'      : 'CV Andres EN.pdf'

  // Drive CV button color with the same clock as the ASCII canvas glow
  useEffect(() => {
    let t = 0
    let raf
    function tick() {
      const hue = glowHue(t)
      const btn = cvBtnRef.current
      if (btn) {
        const color = `hsl(${hue.toFixed(1)}, 88%, 58%)`
        btn.style.borderColor = color
        btn.style.color = color
        btn.style.boxShadow = `0 0 10px 0 hsla(${hue.toFixed(1)}, 88%, 58%, 0.28)`
      }
      t++
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <AsciiCanvas className={styles.particles} />

      <div className={styles.content}>
        <div className={styles.photoWrap}>
          <div className={styles.photo}>
            {/* Coloca tu foto en public/avatar.png */}
            <img src={characterImg} alt="Andrés" />
          </div>
        </div>

        <div className={styles.text}>
          <h1 className={styles.greeting}>
            {displayed}
            <span className={`${styles.cursor} ${done ? styles.cursorBlink : ''}`}>|</span>
          </h1>
          <p className={`${styles.subtitle} ${done ? styles.subtitleVisible : ''}`}>
            Developer junior
          </p>
          <div className={`${styles.ctaRow} ${done ? styles.ctaRowVisible : ''}`}>
            <button
              className={styles.cta}
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver mi trabajo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <a ref={cvBtnRef} href={cvHref} download={cvFilename} className={styles.cvBtn}>
              {isSpanish ? 'Descargar CV' : 'Download CV'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.divider} />
    </section>
  )
}
