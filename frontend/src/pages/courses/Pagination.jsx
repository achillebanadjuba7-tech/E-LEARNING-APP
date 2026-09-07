import styles from './Courses.module.css'

export default function Pagination({ page, numPages, hasPrevious, hasNext }) {
  if (numPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Pagination des cours">
      {hasPrevious && (
        <>
          <a className={styles.pageLink} href="?page=1">&laquo;</a>
          <a className={styles.pageLink} href={`?page=${page - 1}`}>Précédent</a>
        </>
      )}

      <span className={styles.pageCurrent}>Page {page} sur {numPages}</span>

      {hasNext && (
        <>
          <a className={styles.pageLink} href={`?page=${page + 1}`}>Suivant</a>
          <a className={styles.pageLink} href={`?page=${numPages}`}>&raquo;</a>
        </>
      )}
    </nav>
  )
}
