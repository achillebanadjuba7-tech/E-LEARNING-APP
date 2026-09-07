import { useEffect, useState } from 'react'

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function getCsrfToken() {
  return getCookie('csrftoken') || ''
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error('request_failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// Session courante (auth/rôle) — utilisée par la Nav et les pages pour
// adapter les liens (connexion / tableau de bord / déconnexion).
export function useSession() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    let alive = true
    fetchJson('/api/public/session/')
      .then((data) => { if (alive) setSession(data) })
      .catch(() => { if (alive) setSession({ authenticated: false, login_url: '/dashboard/admin/login/', register_url: '/register/' }) })
    return () => { alive = false }
  }, [])

  return session
}
