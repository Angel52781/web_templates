import styles from './Services.module.css'

export function Services() {
  return (
    <section className={styles.section} id="services" aria-label="Tratamientos">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Tratamientos</p>
          <h2 className={styles.title}>Calidad premium, enfocada en lo esencial.</h2>
          <p className={styles.sub}>
            Un portafolio claro y moderno que cubre los objetivos más comunes sin sentirse como un
            menú interminable.
          </p>
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Estética dental</h3>
            <p className={styles.cardText}>
              Carillas, blanqueamiento y diseño de sonrisa con resultados naturales y proporciones
              cuidadas.
            </p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Rehabilitación</h3>
            <p className={styles.cardText}>
              Coronas, incrustaciones y planes de restauración pensados para durar y verse bien.
            </p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Implantes y reposiciones</h3>
            <p className={styles.cardText}>
              Planificación clara, diagnóstico digital y un proceso ordenado desde la evaluación
              hasta la entrega final.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
