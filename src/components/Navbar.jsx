import styles from './Navbar.module.css'

export default function Navbar({ scrollProgress }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const p = scrollProgress
  const innerStyle = {
    borderColor:          `rgba(10,10,10,${p.toFixed(3)})`,
    backgroundColor:      `rgba(255,255,255,${(p * 0.9).toFixed(3)})`,
    backdropFilter:       p > 0.05 ? `blur(${(p * 16).toFixed(1)}px)` : 'none',
    WebkitBackdropFilter: p > 0.05 ? `blur(${(p * 16).toFixed(1)}px)` : 'none',
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner} style={innerStyle}>
        <ul className={styles.links}>
          <li><button onClick={() => scrollTo('hero')}>Inicio</button></li>
          <li><button onClick={() => scrollTo('about')}>Sobre mí</button></li>
          <li><button onClick={() => scrollTo('experience')}>Experiencia</button></li>
          <li><button onClick={() => scrollTo('projects')}>Proyectos</button></li>
          <li><button onClick={() => scrollTo('contact')}>Contacto</button></li>
        </ul>
      </div>
    </nav>
  )
}
