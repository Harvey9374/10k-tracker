import { useState, useCallback } from 'react'
import type { StravaTokens, StravaActivity } from '../types'

const STORAGE_KEY = 'stravaTokens'
const ACTIVITIES_KEY = 'stravaActivities'

function loadTokens(): StravaTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StravaTokens) : null
  } catch { return null }
}

function saveTokens(t: StravaTokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(t))
}

function loadActivities(): StravaActivity[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY)
    return raw ? (JSON.parse(raw) as StravaActivity[]) : []
  } catch { return [] }
}

async function getValidToken(): Promise<string | null> {
  const t = loadTokens()
  if (!t) return null
  if (t.expires_at > Date.now() / 1000 + 60) return t.access_token
  try {
    const res = await fetch('/.netlify/functions/strava-refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: t.refresh_token }),
    })
    const data = await res.json()
    if (data.access_token) {
      saveTokens({ ...t, ...data })
      return data.access_token as string
    }
  } catch { /* fall through */ }
  return null
}

export function useStrava() {
  const [tokens, setTokens] = useState<StravaTokens | null>(loadTokens)
  const [activities, setActivities] = useState<StravaActivity[]>(loadActivities)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exchangeCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/.netlify/functions/strava-exchange', {
        method: 'POST',
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (data.access_token) {
        saveTokens(data as StravaTokens)
        setTokens(data as StravaTokens)
        return true
      }
    } catch { /* fall through */ }
    return false
  }, [])

  const syncActivities = useCallback(async () => {
    const token = await getValidToken()
    if (!token) return
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const runs = Array.isArray(data) ? (data as StravaActivity[]).filter(a => a.type === 'Run') : []
      setActivities(runs)
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(runs))
    } catch {
      setError('Could not fetch activities from Strava')
    } finally {
      setSyncing(false)
    }
  }, [])

  const fetchDetail = useCallback(async (id: number): Promise<StravaActivity | null> => {
    const token = await getValidToken()
    if (!token) return null
    try {
      const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.json() as Promise<StravaActivity>
    } catch { return null }
  }, [])

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ACTIVITIES_KEY)
    setTokens(null)
    setActivities([])
  }, [])

  return {
    isConnected: !!tokens,
    athlete: tokens?.athlete,
    activities,
    syncing,
    error,
    exchangeCode,
    syncActivities,
    fetchDetail,
    disconnect,
  }
}
