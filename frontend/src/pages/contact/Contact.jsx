import { useState } from 'react'
import { fetchJson, getCsrfToken } from '../../shared/api'
import styles from './Contact.module.css'

const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126906.91771146317!2d1.1390453303643764!3d6.192135081075677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c5324e44f9%3A0x13009772ba6e1b6c!2sLom%C3%A9!5e0!3m2!1sfr!2stg!4v1715694000000!5m2!1sfr!2stg'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErrors({})
    setStatus('sending')
    try {
      await fetchJson('/api/public/contact/', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrfToken() },
        body: JSON.stringify(form),
      })
      setStatus('sent')
      setForm({ nom: '', email: '', message: '' })
    } catch (err) {
      if (err.status === 400 && err.data && err.data.errors) {
        setErrors(err.data.errors)
      }
      setStatus('error')
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.formPane}>
        <div className={styles.formInner}>
          <span className="oo-eyebrow">Contact</span>
          <h1 className={styles.title}>Parlons de <span className={styles.accent}>votre projet</span></h1>
          <p className={styles.subtitle}>
            Une question ? Un besoin d'accompagnement ? Notre équipe vous répond dans les
            plus brefs délais.
          </p>

          {status === 'sent' && (
            <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
              Votre message a bien été envoyé. Nous vous répondrons rapidement.
            </div>
          )}
          {status === 'error' && !Object.keys(errors).length && (
            <div className={`${styles.alert} ${styles.alertError}`} role="alert">
              Une erreur est survenue, merci de réessayer.
            </div>
          )}

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="id_nom">Votre nom</label>
              <input
                id="id_nom"
                className={styles.input}
                type="text"
                placeholder="Entrez votre nom complet"
                value={form.nom}
                onChange={(e) => update('nom', e.target.value)}
                required
              />
              {errors.nom && <p className={styles.errorText}>{errors.nom}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="id_email">Votre email</label>
              <input
                id="id_email"
                className={styles.input}
                type="email"
                placeholder="exemple@domaine.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="id_message">Votre message</label>
              <textarea
                id="id_message"
                className={styles.textarea}
                rows={4}
                placeholder="Comment pouvons-nous vous aider ?"
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                required
              />
              {errors.message && <p className={styles.errorText}>{errors.message}</p>}
            </div>

            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            <p className={styles.hint}>
              En envoyant ce message, vous acceptez d'être contacté par OpenEduVerse.
            </p>
          </form>
        </div>
      </div>

      <div className={styles.coordPane}>
        <h2 className={styles.coordTitle}>Nos <span className={styles.accent}>coordonnées</span></h2>

        <div className={styles.coordList}>
          <div className={styles.coordItem}>
            <i className={`fas fa-map-marker-alt ${styles.coordIcon}`} />
            <div>
              <div className={styles.coordLabel}>Adresse</div>
              <div className={styles.coordValue}>Lomé, Togo</div>
            </div>
          </div>
          <div className={styles.coordItem}>
            <i className={`fas fa-phone-alt ${styles.coordIcon}`} />
            <div>
              <div className={styles.coordLabel}>Téléphone</div>
              <div className={styles.coordValue}>+228 90 44 35 04 / 93 55 86 68</div>
            </div>
          </div>
          <div className={styles.coordItem}>
            <i className={`fas fa-envelope ${styles.coordIcon}`} />
            <div>
              <div className={styles.coordLabel}>Email support</div>
              <div className={styles.coordValue}>support@openeduverse.com</div>
            </div>
          </div>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            src={MAP_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte Lomé - Togo"
          />
        </div>

        <div className={styles.linksRow}>
          <a href="tel:+22890443504">Appeler</a>
          <span>•</span>
          <a href="mailto:support@openeduverse.com">Écrire</a>
        </div>
      </div>
    </div>
  )
}
