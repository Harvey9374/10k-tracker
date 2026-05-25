import { useState, useEffect } from 'react'
import { useStrava } from '../hooks/useStrava'
import { getWeekNumber, getPhase } from '../data/plan'
import type { StravaActivity, StravaSplit } from '../types'

const CLIENT_ID = '250705'

function fmtPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${s.toString().padStart(2, '0')}/km`
}

function speedToPace(mps: number): number {
  return 1000 / mps
}

function parsePaceRange(str: string): { min: number; max: number } | null {
  const m = str.match(/(\d+):(\d+)[–\-](\d+):(\d+)/)
  if (!m) return null
  return { min: parseInt(m[1]) * 60 + parseInt(m[2]), max: parseInt(m[3]) * 60 + parseInt(m[4]) }
}

function parseSinglePace(str: string): number | null {
  const m = str.match(/(\d+):(\d+)/)
  if (!m) return null
  return parseInt(m[1]) * 60 + parseInt(m[2])
}

type Zone = { label: string; color: string; bg: string }

const PHASE_ZONES: Record<number, { easy: string; tempo?: string; interval?: string; race?: string }> = {
  1: { easy: '6:30–7:00/km' },
  2: { easy: '6:15–6:45/km', tempo: '5:40–5:55/km', interval: '5:10–5:25/km' },
  3: { easy: '6:00–6:30/km', tempo: '5:20–5:35/km', interval: '4:55–5:10/km', race: '5:05/km' },
  4: { easy: '6:00–6:30/km', tempo: '5:10–5:20/km', interval: '4:45–5:00/km', race: '5:00/km' },
}

function getZone(paceSecPerKm: number, phaseNum: number): Zone {
  const z = PHASE_ZONES[phaseNum] ?? PHASE_ZONES[1]
  const easy = parsePaceRange(z.easy)
  const tempo = z.tempo ? parsePaceRange(z.tempo) : null
  const interval = z.interval ? parsePaceRange(z.interval) : null
  const race = z.race ? parseSinglePace(z.race) : null

  if (race && paceSecPerKm <= race + 10)
    return { label: 'Race pace', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' }
  if (interval && paceSecPerKm <= interval.max + 10)
    return { label: 'Interval', color: 'var(--accent-2)', bg: 'var(--accent-2-dim)' }
  if (tempo && paceSecPerKm <= tempo.max + 10)
    return { label: 'Tempo', color: 'var(--warn)', bg: 'var(--warn-dim)' }
  if (easy && paceSecPerKm >= easy.min - 20 && paceSecPerKm <= easy.max + 30)
    return { label: 'Easy ✓', color: 'var(--accent)', bg: 'var(--accent-dim)' }
  if (easy && paceSecPerKm < easy.min - 20)
    return { label: 'Too fast', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' }
  return { label: 'Recovery', color: 'var(--text-muted)', bg: 'rgba(107,125,160,0.12)' }
}

function fmtDist(m: number) { return (m / 1000).toFixed(2) + ' km' }

function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function SplitRow({ split, phaseNum }: { split: StravaSplit; phaseNum: number }) {
  const pace = speedToPace(split.average_speed)
  const zone = getZone(pace, phaseNum)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36 }}>km {split.split}</span>
      <span style={{ fontSize: 14, fontWeight: 700 }}>{fmtPace(pace)}</span>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: zone.bg, color: zone.color }}>{zone.label}</span>
    </div>
  )
}

function ActivityCard({ activity, phaseNum, onExpand }: {
  activity: StravaActivity
  phaseNum: number
  onExpand: () => Promise<StravaActivity | null>
}) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<StravaActivity | null>(null)
  const [loading, setLoading] = useState(false)

  const pace = speedToPace(activity.average_speed)
  const zone = getZone(pace, phaseNum)

  async function toggle() {
    if (!open && !detail) {
      setLoading(true)
      const d = await onExpand()
      setDetail(d)
      setLoading(false)
    }
    setOpen(o => !o)
  }

  const tooFast = zone.label === 'Too fast'

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={toggle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activity.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {fmtDate(activity.start_date_local)} · {fmtDist(activity.distance)} · {fmtTime(activity.moving_time)}
          </div>
          {tooFast && (
            <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 4 }}>⚠ Faster than easy pace target — check your zones</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{fmtPace(pace)}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: zone.color, marginTop: 2 }}>{zone.label}</div>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 11, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ marginTop: 10, paddingTop: 4 }}>
          {loading ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>Loading splits...</div>
          ) : detail?.splits_metric && detail.splits_metric.length > 0 ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Km Splits</div>
              {detail.splits_metric.map(s => <SplitRow key={s.split} split={s} phaseNum={phaseNum} />)}
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>No split data available for this activity.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function StravaView() {
  const week = getWeekNumber()
  const phase = getPhase(week)
  const phaseNum = phase?.number ?? 1

  const { isConnected, athlete, activities, syncing, error, exchangeCode, syncActivities, fetchDetail, disconnect } = useStrava()

  const redirectUri = window.location.origin + '/'
  const connectUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=auto&scope=activity:read_all`

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.history.replaceState({}, '', '/')
      exchangeCode(code).then(ok => { if (ok) syncActivities() })
    } else if (isConnected && activities.length === 0) {
      syncActivities()
    }
  }, [])

  if (!isConnected) {
    return (
      <div className="view">
        <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏃</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Connect Strava</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
            Sync your runs automatically and see each km split colour-coded against your Phase {phaseNum} pace targets.
          </div>
          <a
            href={connectUrl}
            style={{
              display: 'inline-block',
              background: '#fc4c02',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 28px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Connect with Strava
          </a>
        </div>

        <div className="card">
          <div className="card-title">What you'll get</div>
          {[
            'Runs sync automatically — no manual entry',
            'Each km split colour-coded vs your phase targets',
            'Instant flag if you ran an easy run too fast',
            'Overall pace zone shown per activity',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="view">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            {athlete ? `${athlete.firstname} ${athlete.lastname}` : 'Strava Connected'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Phase {phaseNum} targets active</div>
        </div>
        <button
          className="btn btn-ghost"
          style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
          onClick={syncActivities}
          disabled={syncing}
        >
          {syncing ? 'Syncing…' : '↻ Sync'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Pace legend */}
      <div className="card">
        <div className="card-title">Pace Zones — Phase {phaseNum}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { label: 'Easy ✓', color: 'var(--accent)', bg: 'var(--accent-dim)' },
            { label: 'Tempo', color: 'var(--warn)', bg: 'var(--warn-dim)' },
            ...(phaseNum >= 2 ? [{ label: 'Interval', color: 'var(--accent-2)', bg: 'var(--accent-2-dim)' }] : []),
            ...(phaseNum >= 3 ? [{ label: 'Race pace', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' }] : []),
            { label: 'Too fast', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
            { label: 'Recovery', color: 'var(--text-muted)', bg: 'rgba(107,125,160,0.12)' },
          ].map(z => (
            <span key={z.label} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: z.bg, color: z.color }}>
              {z.label}
            </span>
          ))}
        </div>
      </div>

      {/* Activity list */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Recent Runs</div>
          <button
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', padding: 0 }}
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>

        {syncing && activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            Syncing from Strava…
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <p>No runs found. Tap ↻ Sync to refresh.</p>
          </div>
        ) : (
          activities.map(a => (
            <ActivityCard
              key={a.id}
              activity={a}
              phaseNum={phaseNum}
              onExpand={() => fetchDetail(a.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
