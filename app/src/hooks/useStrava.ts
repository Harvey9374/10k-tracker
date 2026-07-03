import { useState, useCallback } from 'react'
import type { StravaTokens, StravaActivity } from '../types'

const CLIENT_ID = '250705'
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET as string

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

async function stravaTokenRequest(body: Record<string, string>): Promise<Record<string, unknown>> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, ...body }),
  })
  return res.json() as Promise<Record<string, unknown>>
}

async function getValidToken(): Promise<string | null> {
  const t = loadTokens()
  if (!t) return null
  if (t.expires_at > Date.now() / 1000 + 60) return t.access_token
  try {
    const data = await stravaTokenRequest({ grant_type: 'refresh_token', refresh_token: t.refresh_token })
    if (data.access_token) {
      saveTokens({ ...t, ...data } as StravaTokens)
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
      if (!CLIENT_SECRET) {
        setError('VITE_STRAVA_CLIENT_SECRET not set — add it to Netlify environment variables')
        return false
      }
      const data = await stravaTokenRequest({ grant_type: 'authorization_code', code })
      if (data.access_token) {
        const scope = (data.scope as string) || ''
        if (!scope.includes('activity:read')) {
          setError(`Connected but wrong permissions (scope: "${scope}"). Go to strava.com/settings/apps → revoke this app → reconnect`)
          return false
        }
        saveTokens(data as unknown as StravaTokens)
        setTokens(data as unknown as StravaTokens)
        setError(null)
        return true
      }
      setError(`Strava: ${(data.message as string) || 'Exchange failed'} — check your client secret`)
    } catch {
      setError('Could not reach Strava — check your internet connection')
    }
    return false
  }, [])

  const syncActivities = useCallback(async () => {
    const token = await getValidToken()
    if (!token) {
      setError('Session expired — tap Disconnect then reconnect Strava')
      return
    }
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!Array.isArray(data)) {
        setError(`Strava error: ${data.message || JSON.stringify(data)}`)
        return
      }
      const runs = (data as StravaActivity[]).filter(a => a.type === 'Run')
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
    setError(null)
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
