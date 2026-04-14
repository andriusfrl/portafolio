import styles from './Section.module.css'

const jobs = [
  {
    role: 'Cybersecurity Analyst Intern',
    company: 'Minsait — Indra Colombia',
    period: '02/2025 — 08/2025',
    location: 'Bogotá, Colombia',
    desc: 'Desarrollé lógica de alertas automatizadas en Splunk para tráfico anómalo, reduciendo tiempos de detección y agilizando el escalamiento al cliente. Ejecuté contención de amenazas analizando correos de phishing y gestionando listas de IOCs. Restablecí conectividad de redes seguras ajustando parámetros de VPN Fase 2.',
  },
  {
    role: 'Agente de Atención al Cliente Bilingüe',
    company: 'Sitel',
    period: '06/2022 — 12/2022',
    location: 'Bogotá, Colombia',
    desc: 'Manejé el ciclo completo de tickets de soporte desde el problema inicial hasta la resolución. Aseguré documentación precisa para mejorar la trazabilidad. Utilicé habilidades avanzadas de inglés para desescalar situaciones críticas y traducir información técnica compleja en soluciones claras.',
  },
]

export default function Experience() {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.right}>
          <h2 className={styles.title}>Dónde he trabajado</h2>
          <div className={styles.jobs}>
            {jobs.map((job, i) => (
              <div key={i} className={`${styles.job} ${i === 0 ? styles.jobCurrent : ''}`}>
                <div className={styles.jobDot} />
                <div className={styles.jobInfo}>
                  <p className={styles.role}>{job.role}</p>
                  <div className={styles.roleAccent} />
                  <span className={styles.company}>{job.company}</span>
                  <span className={styles.period}>{job.period} · {job.location}</span>
                  <p className={styles.desc}>{job.desc}</p>
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
