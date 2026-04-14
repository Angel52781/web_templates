import styles from './Footer.module.css'

export type FooterProps = {
  clinicName: string
}

export function Footer({ clinicName }: FooterProps) {
  const whatsappNumber = '51987654321'
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola, quisiera agendar una evaluación. ¿Me pueden confirmar disponibilidad?',
  )}`

  return (
    <footer className={styles.footer} id="contact" aria-label="Contacto">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Agenda</p>
            <h2 className={styles.title}>Reserva tu evaluación.</h2>
            <p className={styles.sub}>
              Una experiencia premium empieza con un plan claro. Escríbenos por WhatsApp y te
              compartimos horarios disponibles.
            </p>
          </div>
          <div className={styles.actions} aria-label="Acciones principales">
            <a className={styles.primary} href={whatsappHref} target="_blank" rel="noreferrer">
              Agenda por WhatsApp
            </a>
            <a className={styles.secondary} href="mailto:citas@auroradental.pe">
              citas@auroradental.pe
            </a>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true" />
            <span className={styles.brandName}>{clinicName}</span>
          </div>
          <div className={styles.details}>
            <span>Av. José Pardo 123, Miraflores, Lima</span>
            <span>Lun–Sáb 9:00–19:00</span>
            <span id="reviews">4.9★ en Google</span>
            <span className={styles.attribution}>Diseño y desarrollo: Orbital Frameworks</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
