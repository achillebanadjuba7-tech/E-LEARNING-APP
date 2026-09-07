import styles from './About.module.css'

const FEATURES = [
  {
    n: '01',
    title: 'Innovation',
    text: "Des outils modernes comme les classes virtuelles et le suivi par IA.",
  },
  {
    n: '02',
    title: 'Communauté',
    text: "Un réseau d'apprenants et d'experts connectés pour s'entraider.",
  },
  {
    n: '03',
    title: 'Excellence',
    text: 'Des certifications reconnues pour booster votre carrière.',
  },
]

export default function About() {
  return (
    <>
      <section className={styles.hero}>
        <div className="oo-container">
          <div className={styles.heroGrid}>
            <div>
              <span className="oo-eyebrow">Qui sommes-nous</span>
              <h1 className={styles.title}>Notre <span className={styles.accent}>mission</span></h1>
              <p className={styles.lead}>
                OpenEduVerse est née d'une vision simple : rendre l'éducation de haute qualité
                accessible à tous, partout. Nous croyons que le savoir est le moteur du
                changement et que chaque étudiant mérite les meilleurs outils pour réussir.
              </p>
            </div>
            <div className={styles.heroImg}>
              <img src="/static/images/a-1.jpg" alt="Mission OpenEduVerse" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="oo-container">
          <div className={styles.list}>
            {FEATURES.map((f) => (
              <div className={styles.item} key={f.n}>
                <div className={styles.index}>{f.n}</div>
                <div className={styles.itemBody}>
                  <h5>{f.title}</h5>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.findUs}>
            <h2>Où nous <span className={styles.accent}>trouver</span> ?</h2>
            <p>Retrouvez nos bureaux au cœur de Lomé pour tout accompagnement physique.</p>
          </div>
        </div>
      </section>
    </>
  )
}
