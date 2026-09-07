import { useSession } from '../../shared/api'
import styles from './Home.module.css'

export default function Home() {
  const session = useSession()

  return (
    <>
      <section className={styles.hero}>
        <div className="oo-container">
          <div className={styles.heroGrid}>
            <div>
              <span className="oo-eyebrow">OpenEduVerse</span>
              <h1 className={styles.title}>
                Une éducation{' '}
                <span className={styles.accent}>
                  de qualité
                  <svg viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2,10 C60,2 160,2 218,9" stroke="#e1442d" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                , accessible à tous
              </h1>
              <p className={styles.lead}>
                Rejoignez la révolution numérique et transformez votre avenir avec des
                formations certifiantes de haut niveau.
              </p>
              <div className={styles.ctaRow}>
                <a href="/courses/" className="oo-btn oo-btn-gold">Explorer les cours</a>
                <a href="/apropos/" className="oo-btn oo-btn-outline">En savoir plus</a>
              </div>
            </div>
            <div className={styles.heroPhoto}>
              <div className={styles.frame}>
                <img src="/static/images/hero-laptop.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="oo-container">
          <div className={styles.about}>
            <div className={styles.aboutPhoto}>
              <img src="/static/images/a-1.jpg" alt="" />
            </div>
            <div className={styles.aboutText}>
              <span className="oo-eyebrow">Notre approche</span>
              <h2>À propos d'OpenEduVerse</h2>
              <p>
                Nous offrons un environnement d'apprentissage conçu pour aider les étudiants à
                réaliser leur plein potentiel grâce à des ressources modernes, des suivis
                personnalisés et une flexibilité totale.
              </p>
              <a href="/apropos/" className="oo-btn oo-btn-outline">Découvrir notre mission</a>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className="oo-container">
          <div className={styles.ctaGrid}>
            <div>
              <span className="oo-eyebrow">Rejoignez-nous</span>
              <h3>Accédez à des cours gratuits</h3>
              <p>
                Créez votre compte dès aujourd'hui et rejoignez une communauté d'apprenants
                passionnés. Accédez à des centaines de ressources pédagogiques sans frais.
              </p>
              {session && session.authenticated ? (
                <a href={session.dashboard_url} className="oo-btn oo-btn-gold">Mon tableau de bord</a>
              ) : (
                <a href={(session && session.register_url) || '/register/'} className="oo-btn oo-btn-gold">
                  S'inscrire gratuitement
                </a>
              )}
            </div>
            <div className={styles.ctaImg}>
              <img src="/static/images/event-img.jpg" alt="E-learning" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
