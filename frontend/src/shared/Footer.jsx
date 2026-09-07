import { useSession } from './api'
import styles from './Footer.module.css'

export default function Footer() {
  const session = useSession()

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <img className={styles.logo} src="/static/images/logo.png" alt="Logo OpenEduVerse" />
          <span className={styles.brandName}>OPENEDUVERSE</span>
          <span className={styles.brandUnderline} aria-hidden="true" />
        </div>

        <div>
          <h5 className={styles.heading}>Liens</h5>
          <ul className={styles.list}>
            <li><a href="/">Accueil</a></li>
            <li><a href="/courses/">Cours</a></li>
            <li><a href="/apropos/">À propos</a></li>
            <li><a href="/contact/">Contact</a></li>
          </ul>
        </div>

        <div>
          <h5 className={styles.heading}>Nos programmes</h5>
          <ul className={styles.list}>
            <li className={styles.plainItem}>Visioconférences</li>
            <li className={styles.plainItem}>Quiz &amp; évaluations</li>
            <li className={styles.plainItem}>Suivi de progression</li>
            <li className={styles.plainItem}>Certifications</li>
          </ul>
        </div>

        <div>
          <h5 className={styles.heading}>Aide &amp; Support</h5>
          <div className={styles.contacts}>
            <a href="mailto:support@openeduverse.com">support@openeduverse.com</a>
            <a href="tel:+22890443504">+228 90 44 35 04</a>
            <a href="tel:+22893558668">+228 93 55 86 68</a>
          </div>
        </div>

        <div className={styles.actions}>
          {session && session.authenticated ? (
            <>
              <a href={session.dashboard_url} className={styles.btnPrimary}>Tableau de bord</a>
              <a href={session.logout_url} className={styles.btnOutline}>Se déconnecter</a>
            </>
          ) : (
            <>
              <a href={(session && session.login_url) || '/dashboard/admin/login/'} className={styles.btnPrimary}>
                Se connecter
              </a>
              <a href={(session && session.register_url) || '/register/'} className={styles.btnOutline}>
                Créer un compte
              </a>
            </>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        © 2026 Tous droits réservés par OpenEduVerse
      </div>
    </footer>
  )
}
