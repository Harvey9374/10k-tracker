import { useState, useEffect, useRef } from 'react'
import { useStrava } from '../hooks/useStrava'
import { getWeekNumber, getPhase, formatTime } from '../data/plan'
import type { StravaActivity, StravaSplit, CalibratedZones, WorkoutLog } from '../types'

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

function getZone(paceSecPerKm: number, phaseNum: number, calibrated?: CalibratedZones | null): Zone {
  if (calibrated) {
    if (paceSecPerKm <= calibrated.racePace + 10)
      return { label: 'Race pace', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' }
    if (paceSecPerKm <= calibrated.interval.max + 10)
      return { label: 'Interval', color: 'var(--accent-2)', bg: 'var(--accent-2-dim)' }
    if (paceSecPerKm <= calibrated.tempo.max + 10)
      return { label: 'Tempo', color: 'var(--warn)', bg: 'var(--warn-dim)' }
    if (paceSecPerKm >= calibrated.easy.min - 20 && paceSecPerKm <= calibrated.easy.max + 30)
      return { label: 'Easy ✓', color: 'var(--accent)', bg: 'var(--accent-dim)' }
    if (paceSecPerKm < calibrated.easy.min - 20)
      return { label: 'Too fast', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' }
    return { label: 'Recovery', color: 'var(--text-muted)', bg: 'rgba(107,125,160,0.12)' }
  }
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

type RunInsight = { icon: string; text: string; positive: boolean }
type RunAssessment = { verdict: string; verdictColor: string; insights: RunInsight[]; tip: string }

function inferSessionType(activity: StravaActivity, phaseNum: number, calibrated?: CalibratedZones | null): string {
  if (activity.workout_type === 1) return 'Time Trial'
  const pace = speedToPace(activity.average_speed)
  const zone = getZone(pace, phaseNum, calibrated)
  if (zone.label === 'Race pace') return 'Race Pace Session'
  if (zone.label === 'Interval') return 'Interval Session'
  if (zone.label === 'Tempo') return 'Tempo Run'
  if (activity.distance >= 12000) return 'Long Run'
  return 'Easy Run'
}

function assessRun(splits: StravaSplit[], phaseNum: number, calibrated?: CalibratedZones | null): RunAssessment {
  const paces = splits.map(s => speedToPace(s.average_speed))
  const elevs = splits.map(s => s.elevation_difference ?? 0)
  const totalClimb = elevs.filter(e => e > 0).reduce((a, b) => a + b, 0)
  const avgPace = paces.reduce((a, b) => a + b, 0) / paces.length
  const firstPace = paces[0]
  const lastPace = paces[paces.length - 1]
  const insights: RunInsight[] = []

  // 1. Pacing strategy
  const splitDiffPct = ((lastPace - firstPace) / firstPace) * 100
  if (splitDiffPct > 10) {
    let fadeKm = -1
    let fadeElev = 0
    for (let i = 1; i < paces.length; i++) {
      if ((paces[i] - paces[i - 1]) / paces[i - 1] > 0.07) { fadeKm = i + 1; fadeElev = elevs[i] ?? 0; break }
    }
    if (fadeKm > 0 && fadeElev > 15) {
      insights.push({ icon: '↗', text: `Pace dropped at km ${fadeKm} (+${Math.round(fadeElev)}m climb) — elevation explains this split, not a fitness issue.`, positive: true })
    } else if (fadeKm > 0) {
      insights.push({ icon: '⚠', text: `Pace dropped sharply at km ${fadeKm} — you went out ${Math.round((paces[0] - avgPace) / avgPace * 100)}% faster than your average. Start slower next time.`, positive: false })
    } else {
      insights.push({ icon: '⚠', text: `Positive split: finished ${Math.round(splitDiffPct)}% slower than you started — energy ran out before the end.`, positive: false })
    }
  } else if (splitDiffPct < -8) {
    insights.push({ icon: '✓', text: `Negative split — finished ${Math.round(-splitDiffPct)}% faster than you started. Excellent pacing discipline.`, positive: true })
  } else {
    insights.push({ icon: '✓', text: `Even pacing throughout — consistent effort, good control.`, positive: true })
  }

  // 2. First km relative to average (ignore if km 1 was a significant downhill)
  if (firstPace < avgPace * 0.93 && (elevs[0] ?? 0) < 10) {
    insights.push({ icon: '⚡', text: `Km 1 (${fmtPace(firstPace)}) was ${Math.round((avgPace - firstPace) / avgPace * 100)}% faster than your run average — classic fast start, dial it back.`, positive: false })
  }

  // 3. Consistency (elevation-aware)
  const variance = paces.reduce((sum, p) => sum + Math.pow(p - avgPace, 2), 0) / paces.length
  const cv = Math.sqrt(variance) / avgPace * 100
  if (cv < 3) {
    insights.push({ icon: '✓', text: `Excellent consistency — splits varied by only ±${cv.toFixed(1)}%.`, positive: true })
  } else if (cv > 9) {
    if (totalClimb > 40) {
      insights.push({ icon: '↗', text: `Pace varied ±${Math.round(cv)}% — the ${Math.round(totalClimb)}m of elevation on this route explains the spread.`, positive: true })
    } else {
      insights.push({ icon: '⚠', text: `Erratic pacing — splits varied by ±${Math.round(cv)}%. Aim for a steadier effort.`, positive: false })
    }
  }

  // 4. Strong finish
  if (paces.length >= 3) {
    const last3 = paces.slice(-Math.min(3, paces.length))
    const last3Avg = last3.reduce((a, b) => a + b, 0) / last3.length
    if (last3Avg < avgPace * 0.95 && splitDiffPct >= -4) {
      insights.push({ icon: '✓', text: `Finished strong — last ${Math.min(3, paces.length)} km averaged ${fmtPace(last3Avg)}, ${Math.round((avgPace - last3Avg) / avgPace * 100)}% faster than your overall pace.`, positive: true })
    }
  }

  // 5. Zone compliance
  const zones = PHASE_ZONES[phaseNum] ?? PHASE_ZONES[1]
  const easyRange = calibrated
    ? { min: calibrated.easy.min - 20, max: calibrated.easy.max + 30 }
    : (() => { const r = parsePaceRange(zones.easy); return r ? { min: r.min - 20, max: r.max + 30 } : null })()
  if (easyRange) {
    const tooFast = paces.filter(p => p < easyRange!.min).length
    if (tooFast > paces.length * 0.4) {
      insights.push({ icon: '⚠', text: `${tooFast}/${paces.length} km splits above easy zone — accumulating unnecessary fatigue. Slow down on easy days.`, positive: false })
    }
  }

  // 6. Elevation summary
  if (totalClimb > 30) {
    insights.push({ icon: '↗', text: `Route included ${Math.round(totalClimb)}m of climbing — factor this in when comparing to flat run paces.`, positive: true })
  }

  const pos = insights.filter(i => i.positive).length
  const neg = insights.filter(i => !i.positive).length
  let verdict: string, verdictColor: string, tip: string
  if (neg === 0) {
    verdict = 'Excellent run'; verdictColor = 'var(--accent)'
    tip = 'Well-paced and consistent — exactly the kind of run that builds fitness.'
  } else if (splitDiffPct > 10 && neg > pos) {
    verdict = 'Started too fast'; verdictColor = 'var(--warn)'
    tip = `Next run: start ${Math.round(splitDiffPct / 2)}% slower in km 1. Your fade suggests you had more in the tank — save it for a negative split.`
  } else if (pos >= neg) {
    verdict = 'Solid effort'; verdictColor = 'var(--accent)'
    tip = 'Good run overall. Small pacing tweaks will unlock consistent improvement.'
  } else {
    verdict = 'Room to improve'; verdictColor = 'var(--warn)'
    tip = 'Focus on km 1 discipline — start conversationally easy. The first km sets the tone for everything after.'
  }
  return { verdict, verdictColor, insights, tip }
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

function SplitRow({ split, phaseNum, calibrated }: { split: StravaSplit; phaseNum: number; calibrated?: CalibratedZones | null }) {
  const pace = speedToPace(split.average_speed)
  const zone = getZone(pace, phaseNum, calibrated)
  const elev = split.elevation_difference
  const elevStr = elev != null && Math.abs(elev) >= 5 ? `${elev > 0 ? '+' : ''}${Math.round(elev)}m` : null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36 }}>km {split.split}</span>
      {elevStr && (
        <span style={{ fontSize: 11, color: elev! > 0 ? '#f97316' : 'var(--accent)', minWidth: 34 }}>{elevStr}</span>
      )}
      <span style={{ fontSize: 14, fontWeight: 700, flex: 1, textAlign: elevStr ? 'center' : 'left' }}>{fmtPace(pace)}</span>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: zone.bg, color: zone.color }}>{zone.label}</span>
    </div>
  )
}

function ActivityCard({ activity, phaseNum, onExpand, calibrated, onAddLog, isLogged }: {
  activity: StravaActivity
  phaseNum: number
  onExpand: () => Promise<StravaActivity | null>
  calibrated?: CalibratedZones | null
  onAddLog?: (log: Omit<WorkoutLog, 'id'>) => void
  isLogged?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<StravaActivity | null>(null)
  const [loading, setLoading] = useState(false)
  const [justLogged, setJustLogged] = useState(false)
  const [showRpeModal, setShowRpeModal] = useState(false)
  const [rpe, setRpe] = useState(5)

  const pace = speedToPace(activity.average_speed)
  const zone = getZone(pace, phaseNum, calibrated)

  async function toggle() {
    if (!open && !detail) {
      setLoading(true)
      const d = await onExpand()
      setDetail(d)
      setLoading(false)
    }
    setOpen(o => !o)
  }

  function handleLog(e: React.MouseEvent) {
    e.stopPropagation()
    if (!onAddLog || isLogged || justLogged) return
    setShowRpeModal(true)
  }

  function confirmLog() {
    if (!onAddLog) return
    onAddLog({
      date: activity.start_date_local.slice(0, 10),
      sessionType: inferSessionType(activity, phaseNum, calibrated),
      distanceKm: parseFloat((activity.distance / 1000).toFixed(2)),
      durationMins: parseFloat((activity.moving_time / 60).toFixed(1)),
      perceivedEffort: rpe,
      notes: activity.name,
      completed: true,
      stravaId: activity.id,
    })
    setJustLogged(true)
    setShowRpeModal(false)
  }

  const logged = isLogged || justLogged
  const tooFast = zone.label === 'Too fast'

  const rpeLabel = rpe <= 3 ? 'Very easy — conversational'
    : rpe <= 5 ? 'Comfortable — easy breathing'
    : rpe <= 7 ? 'Moderate — focused effort'
    : rpe <= 9 ? 'Hard — limited conversation'
    : 'Maximum effort'

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
      {/* RPE modal */}
      {showRpeModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}
          onClick={() => setShowRpeModal(false)}
        >
          <div
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 20px', width: '100%', maxWidth: 360 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Log Run</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>
              {activity.name} · {fmtDist(activity.distance)} · {fmtTime(activity.moving_time)} · {fmtPace(pace)}
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
              How did it feel? — RPE {rpe}/10
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => setRpe(i + 1)}
                  style={{
                    flex: 1, height: 28, borderRadius: 4, cursor: 'pointer',
                    background: i < rpe
                      ? (i < 3 ? 'var(--accent)' : i < 7 ? 'var(--warn)' : '#ef4444')
                      : 'var(--border)',
                    transition: 'background 0.1s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>{rpeLabel}</div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowRpeModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLog}
                style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Save to Log
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={toggle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activity.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {fmtDate(activity.start_date_local)} · {fmtDist(activity.distance)} · {fmtTime(activity.moving_time)}
            {activity.total_elevation_gain > 10 && <span style={{ color: '#f97316' }}> · ↗{Math.round(activity.total_elevation_gain)}m</span>}
          </div>
          {tooFast && (
            <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 4 }}>⚠ Faster than easy pace target — check your zones</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{fmtPace(pace)}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: zone.color, marginTop: 2 }}>{zone.label}</div>
        </div>
        {onAddLog && (
          <button
            onClick={handleLog}
            style={{
              flexShrink: 0,
              background: logged ? 'var(--accent-dim)' : 'var(--surface)',
              border: `1px solid ${logged ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 6,
              color: logged ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 9px',
              cursor: logged ? 'default' : 'pointer',
              lineHeight: 1,
            }}
          >
            {logged ? '✓' : '＋ Log'}
          </button>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: 11, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ marginTop: 10, paddingTop: 4 }}>
          {loading ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>Loading splits...</div>
          ) : detail?.splits_metric && detail.splits_metric.length > 0 ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Km Splits</div>
              {detail.splits_metric.map(s => <SplitRow key={s.split} split={s} phaseNum={phaseNum} calibrated={calibrated} />)}
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>No split data available for this activity.</div>
          )}
          {detail?.splits_metric && detail.splits_metric.length >= 2 && (() => {
            const a = assessRun(detail.splits_metric, phaseNum, calibrated)
            return (
              <div style={{ marginTop: 12, background: 'var(--surface)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Run Assessment</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: a.verdictColor, marginLeft: 'auto' }}>{a.verdict}</span>
                </div>
                {a.insights.map((ins, i) => (
                  <div key={i} style={{ fontSize: 12, color: ins.positive ? 'var(--text-muted)' : '#fca5a5', padding: '4px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6 }}>
                    <span style={{ color: ins.positive ? 'var(--accent)' : 'var(--warn)', flexShrink: 0 }}>{ins.icon}</span>
                    <span>{ins.text}</span>
                  </div>
                ))}
                <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 8, paddingTop: 4 }}>
                  💡 {a.tip}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default function StravaView({ calibratedZones, logs, onAddLog }: {
  calibratedZones?: CalibratedZones | null
  logs?: WorkoutLog[]
  onAddLog?: (log: Omit<WorkoutLog, 'id'>) => void
}) {
  const week = getWeekNumber()
  const phase = getPhase(week)
  const phaseNum = phase?.number ?? 1

  const { isConnected, athlete, activities, syncing, error, exchangeCode, syncActivities, fetchDetail, disconnect } = useStrava()

  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const [pullProgress, setPullProgress] = useState(0) // 0–1

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
  }
  function handleTouchMove(e: React.TouchEvent) {
    const scrollTop = scrollRef.current?.scrollTop ?? 0
    if (scrollTop > 0) return
    const diff = e.touches[0].clientY - touchStartY.current
    if (diff > 0) setPullProgress(Math.min(diff / 72, 1))
  }
  function handleTouchEnd() {
    if (pullProgress >= 1 && !syncing) syncActivities()
    setPullProgress(0)
  }

  const redirectUri = window.location.origin + '/'
  const connectUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read_all`

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
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 16, textAlign: 'left' }}>
              {error}
            </div>
          )}
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
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.6 }}>
            On the Strava screen, make sure <strong style={{ color: 'var(--text)' }}>View data about your activities</strong> is checked before tapping Authorise.
          </div>
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
    <div
      className="view"
      ref={scrollRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullProgress > 0 || syncing) && (
        <div style={{
          textAlign: 'center',
          padding: '6px 0 10px',
          fontSize: 12,
          color: 'var(--text-muted)',
          transition: 'opacity 0.2s',
          opacity: syncing ? 1 : pullProgress,
        }}>
          {syncing ? '↻ Refreshing…' : pullProgress >= 1 ? '↑ Release to refresh' : '↓ Pull to refresh'}
        </div>
      )}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            {calibratedZones ? 'Your Calibrated Zones' : `Pace Zones — Phase ${phaseNum}`}
          </div>
          {calibratedZones && (
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-2)' }}>
              ↑ {calibratedZones.basedOnDistanceKm}km trial · {formatTime(calibratedZones.predicted10KMins * 60)} 10K
            </span>
          )}
        </div>
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
              calibrated={calibratedZones}
              onAddLog={onAddLog}
              isLogged={logs?.some(l => l.stravaId === a.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
