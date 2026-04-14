import styles from './Section.module.css'
import comiasImg from '../assets/comias.png'
import koalaImg from '../assets/koalapp.png'
import treatsImg from '../assets/treats.png'

const projects = [
  {
    name: "Comia's",
    type: 'Aplicación web',
    desc: 'Arquitectura de microservicios contenerizada con Docker; backend Flask + SQLite consumiendo APIs externas para sincronización de inventarios en tiempo real.',
    tech: ['Docker', 'Flask', 'SQLite', 'REST APIs'],
    image: comiasImg,
    preview: 'https://comias-home.onrender.com/',
    code: 'https://github.com/andriusfrl/Restaurante_Micro',
  },
  {
    name: 'Koala',
    type: 'Aplicación móvil',
    desc: 'Librería digital para PDFs con persistencia de datos; lógica CRUD robusta, gestión de favoritos y personalización de perfiles de usuario.',
    tech: ['Mobile', 'CRUD', 'Data Persistence'],
    image: koalaImg,
    preview: null,
    code: 'https://github.com/CamiloxX/KoalaApp',
  },
  {
    name: 'Treats',
    type: 'Aplicación web',
    desc: 'Clasificación de imágenes con Deep Learning (InceptionV3/Keras), desplegado y operacionalizado mediante backend Flask.',
    tech: ['Python', 'Keras', 'InceptionV3', 'Flask'],
    image: treatsImg,
    preview: 'https://treats-nine.vercel.app/',
    code: 'https://github.com/andriusfrl/Treats',
  },
]

export default function Projects() {
  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.right}>
          <h2 className={styles.title}>Cosas que he construido</h2>
          <div className={styles.projects}>
            {projects.map((item, i) => (
              <div key={i} className={styles.projectCard}>
                <div className={styles.projectImageWrap}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.projectImage}
                  />
                </div>
                <div className={styles.projectBody}>
                  <p className={styles.projectType}>{item.type}</p>
                  <h3 className={styles.projectName}>{item.name}</h3>
                  <p className={styles.projectDesc}>{item.desc}</p>
                  <div className={styles.tech}>
                    {item.tech.map((tag) => (
                      <span key={tag} className={styles.techTag}>{tag}</span>
                    ))}
                  </div>
                  <div className={styles.projectActions}>
                    {item.preview && (
                      <a href={item.preview} className={styles.projectLink} target="_blank" rel="noreferrer">
                        Ver preview
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                    <a href={item.code} className={styles.projectLink} target="_blank" rel="noreferrer">
                      Ver código
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.divider} />
    </section>
  )
}
