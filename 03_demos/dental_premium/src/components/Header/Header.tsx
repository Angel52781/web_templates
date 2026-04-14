import styles from './Header.module.css'

export type HeaderProps = {
  clinicName: string
  phone?: string
}

export function Header({ clinicName, phone }: HeaderProps) {
  const whatsappNumber = phone ? phone.replace(/\D/g, '') : ''
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola, me gustaría agendar una evaluación. ¿Tienen disponibilidad esta semana?',
      )}`
    : ''

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label={`${clinicName} inicio`}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandName}>{clinicName}</span>
        </a>

        <nav className={styles.nav} aria-label="Principal">
          <a className={styles.navLink} href="#services">
            Tratamientos
          </a>
          <a className={styles.navLink} href="#reviews">
            Reseñas
          </a>
          <a className={styles.navLink} href="#contact">
            Contacto
          </a>
        </nav>

        <div className={styles.actions}>
          {phone && whatsappHref ? (
            <a className={styles.phone} href={whatsappHref} target="_blank" rel="noreferrer">
              {phone}
            </a>
          ) : null}
          <a className={styles.cta} href={whatsappHref || '#contact'} target={whatsappHref ? '_blank' : undefined} rel={whatsappHref ? 'noreferrer' : undefined}>
            Agenda por WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
