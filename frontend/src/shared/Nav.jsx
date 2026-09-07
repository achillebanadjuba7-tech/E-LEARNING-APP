import { useState } from 'react'
import { useSession } from './api'
import styles from './Nav.module.css'

const LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/courses/', label: 'Cours' },
  { href: '/apropos/', label: 'À propos' },
  { href: '/contact/', label: 'Contact' },
]

export default function Nav() {
  const session = useSession()
  const [open, setOpen] = useState(false)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <header className={`${styles.header} ${open ? styles.navOpen : ''}`}>
      <div className={styles.bar}>
        <a className={styles.brand} href="/" aria-label="OpenEduVerse — Accueil">
          <img className={styles.logo} src="/static/images/logo.png" alt="Logo OpenEduVerse" />
          <span className={styles.brandName}>
            <span className={styles.brandOpen}>Open</span>
            <span className={styles.brandEduverse}>Eduverse</span>
          </span>
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <i className="fas fa-bars" />
        </button>

        <div className={styles.menu}>
          <nav className={styles.links}>
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${styles.link} ${path === link.href ? styles.active : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            {session && session.authenticated ? (
              <>
                <a href={session.logout_url} className={styles.textLink}>Déconnexion</a>
                <a href={session.dashboard_url} className={styles.primaryBtn}>Tableau de bord</a>
              </>
            ) : (
              <>
                <a href={(session && session.register_url) || '/register/'} className={styles.textLink}>
                  Créer un compte
                </a>
                <a href={(session && session.login_url) || '/dashboard/admin/login/'} className={styles.primaryBtn}>
                  Se connecter
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
