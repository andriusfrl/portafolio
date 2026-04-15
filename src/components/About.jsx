import styles from './Section.module.css'
import andresImg from '../assets/andresphoto.jpg'

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.right}>
          <div className={styles.aboutRow}>
            <div className={styles.aboutContent}>
              <h2 className={styles.title}>Un poco sobre mí</h2>
              <p className={styles.body}>
                Ingeniero de Sistemas Junior enfocado en DevOps y Backend.
                Experiencia en ciberseguridad y redes, desarrollando lógica de alertas automatizadas
                en Splunk y gestionando contención de amenazas. Sólida base en administración Linux,
                contenedorización con Docker y servicios en la nube (AWS).
              </p>
              <p className={styles.body}>
                Disfruto trabajar en todo el stack — desde scripts de automatización hasta despliegue
                de backends. Busco aplicar conocimientos de CI/CD y nube para agilizar ciclos
                de desarrollo y despliegue de software.
              </p>
            </div>
            <div className={styles.aboutPhotoWrap}>
              {/* Coloca tu foto en public/photo.jpg */}
              <img src={andresImg} alt="Andrés Rodriguez" className={styles.aboutPhoto} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
    </section>
  )
}
