import { getCsrfToken } from '../../shared/api'
import styles from './Courses.module.css'

export default function CourseCard({ course, meta }) {
  const { authenticated, is_etudiant: isEtudiant, login_url: loginUrl, dashboard_url: dashboardUrl, mes_courses_url: mesCoursesUrl } = meta

  return (
    <div className={styles.card}>
      <div className={styles.cardImg}>
        <img
          src={course.image_url || '/static/images/algorithme.jpeg'}
          alt={course.titre}
        />
      </div>
      <div className={styles.cardBody}>
        <h5 className={styles.cardTitle}>{course.titre}</h5>
        <p className={styles.cardAuthor}>Par {course.enseignant_nom}</p>

        <div className={styles.badgeRow}>
          <span className={`${styles.badge} ${course.est_premium ? styles.badgePremium : styles.badgeFree}`}>
            {course.est_premium ? 'PREMIUM' : 'GRATUIT'}
          </span>
        </div>

        {!authenticated && (
          <a href={loginUrl} className={styles.actionBtn}>Connexion</a>
        )}

        {authenticated && !isEtudiant && (
          <a href={dashboardUrl} className={styles.actionBtn}>Dashboard</a>
        )}

        {authenticated && isEtudiant && course.deja_inscrit && (
          <a href={mesCoursesUrl} className={styles.actionBtn}>Accéder</a>
        )}

        {authenticated && isEtudiant && !course.deja_inscrit && (
          <form
            className={styles.actionForm}
            method="POST"
            action={course.est_premium ? course.achat_url : course.inscription_url}
          >
            <input type="hidden" name="csrfmiddlewaretoken" value={getCsrfToken()} />
            <button type="submit" className={styles.actionBtn}>
              {course.est_premium ? 'Acheter' : "S'inscrire"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
