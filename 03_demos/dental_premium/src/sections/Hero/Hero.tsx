import { useRef } from 'react'
import styles from './Hero.module.css'
import { Hero3DCanvas } from '../../components/Hero3DCanvas/Hero3DCanvas'

export type HeroProps = {
  clinicName?: string
}

export function Hero({ clinicName = 'Aurora Dental' }: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  const whatsappNumber = '51987654321'
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola, quiero agendar una evaluación. ¿Me pueden compartir horarios disponibles?',
  )}`

  return (
    <section ref={heroRef} className={styles.hero} aria-label={`${clinicName} portada`}>
      <div className={styles.stageWrap} aria-hidden="true">
        <Hero3DCanvas
          presentation="background"
          mode="auto"
          interactionTargetRef={heroRef}
          fallbackAlt="Fondo 3D premium"
          canvasAriaLabel="Fondo 3D del hero"
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{clinicName}</p>
          <h1 className={styles.title}>Odontología boutique, pensada para sentirte en calma.</h1>
          <p className={styles.lede}>
            Estética y rehabilitación con un enfoque premium: diagnóstico digital, planes claros y
            atención sin apuro.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.primaryCta} href={whatsappHref} target="_blank" rel="noreferrer">
              Agenda por WhatsApp
            </a>
            <a className={styles.secondaryCta} href="#services">
              Ver tratamientos
            </a>
          </div>
          <ul className={styles.proof} aria-label="Confianza">
            <li className={styles.proofItem}>4.9★ en Google</li>
            <li className={styles.proofItem}>Atención sin apuro</li>
            <li className={styles.proofItem}>Odontología digital</li>
            <li className={styles.proofItem}>Miraflores · Lima</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
