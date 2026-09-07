import { useEffect, useState } from 'react'
import { fetchJson } from '../../shared/api'
import CourseCard from './CourseCard'
import Pagination from './Pagination'
import styles from './Courses.module.css'

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const page = parseInt(params.get('page'), 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

export default function Courses() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const page = getPageFromUrl()

  useEffect(() => {
    let alive = true
    setData(null)
    setError(false)
    fetchJson(`/api/public/courses/?page=${page}`)
      .then((d) => { if (alive) setData(d) })
      .catch(() => { if (alive) setError(true) })
    return () => { alive = false }
  }, [page])

  return (
    <>
      <section className={styles.hero}>
        <div className="oo-container">
          <span className="oo-eyebrow">Catalogue</span>
          <h1 className={styles.title}>Des formations pour <span className={styles.accent}>apprendre vraiment</span></h1>
          <p className={styles.lead}>
            Choisissez parmi nos formations et commencez votre transformation aujourd'hui.
            Des ressources pédagogiques de qualité, pensées pour une communauté d'apprenants engagés.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="oo-container">
          {error && <p className={styles.state}>Impossible de charger les cours pour le moment.</p>}

          {!error && !data && <p className={styles.state}>Chargement des cours...</p>}

          {!error && data && data.results.length === 0 && (
            <p className={styles.state}>Aucun cours disponible.</p>
          )}

          {!error && data && data.results.length > 0 && (
            <>
              <div className={styles.grid}>
                {data.results.map((course) => (
                  <CourseCard key={course.id} course={course} meta={data} />
                ))}
              </div>

              <Pagination
                page={data.page}
                numPages={data.num_pages}
                hasPrevious={data.has_previous}
                hasNext={data.has_next}
              />
            </>
          )}
        </div>
      </section>
    </>
  )
}
