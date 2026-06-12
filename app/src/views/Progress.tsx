import { useState } from 'react'
import type { WorkoutLog, TimeTrial, CalibratedZones } from '../types'
import { BENCHMARKS, getWeekNumber, formatTime, calcPaceSeconds, formatPace } from '../data/plan'

interface Props {
  logs: WorkoutLog[]
  trials: TimeTrial[]
  onAddTrial: (t: Omit<TimeTrial, 'id'>) => void
  onDeleteTrial: (id: string) => void
  calibratedZones?: CalibratedZones | null
  onClearZones?: () => void
}

function fmtPaceRange(min: number, max: number): string {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
  return `${fmt(min)}–${fmt(max)}/km`
}

const GOAL_SECONDS = 50 * 60

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

function parseTimeInput(mm: string, ss: string): number | null {
  const m = parseInt(mm)
  const s = parseInt(ss)
  if (isNaN(m) || isNaN(s) || s >= 60) return null
  return m * 60 + s
}

function PaceTrendChart({ logs }: { logs: WorkoutLog[] }) {
  const runLogs = logs
    .filter(l => l.distanceKm && l.durationMins && l.distanceKm > 0 && l.durationMins > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20)

  if (runLogs.length < 3) return (
    <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '12px 0', textAlign: 'center' }}>
      Log 3+ sessions with distance & duration to see your pace trend.
    </div>
  )

  const paces = runLogs.map(l => calcPaceSeconds(l.distanceKm!, l.durationMins!))
  const minPace = Math.min(...paces)
  const maxPace = Math.max(...paces)
  const range = maxPace - minPace || 30

  const W = 300, H = 80, padX = 10, padY = 10

  const pts = runLogs.map((l, i) => {
    const pace = calcPaceSeconds(l.distanceKm!, l.durationMins!)
    const x = padX + (i / (runLogs.length - 1)) * (W - padX * 2)
    const y = padY + (pace - minPace) / range * (H - padY * 2)
    return { x, y, pace, date: l.date }
  })

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const improving = paces[paces.length - 1] < paces[0] - 5

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
          Run Pace Trend
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: improving ? 'var(--accent)' : 'var(--text-muted)' }}>
          {improving ? '↑ Getting faster' : '→ Consistent'}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 70, overflow: 'visible' }}>
        <defs>
          <linearGradient id="paceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="none" stroke="url(#paceGrad)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5}
            fill={i === pts.length - 1 ? 'var(--accent)' : 'var(--accent-2)'} />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
        <span>{fmtDate(pts[0].date)} · {formatPace(paces[0])}</span>
        <span style={{ color: improving ? 'var(--accent)' : 'var(--text-muted)', fontWeight: improving ? 700 : 400 }}>
          {fmtDate(pts[pts.length - 1].date)} · {formatPace(paces[paces.length - 1])}
        </span>
      </div>
    </div>
  )
}

function TrialForm({ onAdd }: { onAdd: (t: Omit<TimeTrial, 'id'>) => void }) {
  const _d = new Date()
  const today = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`
  const [date, setDate] = useState(today)
  const [distance, setDistance] = useState('10')
  const [mm, setMm] = useState('')
  const [ss, setSs] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const timeSeconds = parseTimeInput(mm, ss)

  function handleSave() {
    if (!timeSeconds) return
    const dist = parseFloat(distance)
    if (isNaN(dist) || dist <= 0) return
    onAdd({ date, distanceKm: dist, timeSeconds, notes: notes.trim() || undefined })
    setMm(''); setSs(''); setNotes(''); setDate(today)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card">
      <div className="card-title">Log Time Trial</div>
      {saved && (
        <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: '10px', marginBottom: 12, color: 'var(--accent)', fontWeight: 600, fontSize: 13, textAlign: 'center' }}>
          ✓ Time trial saved!
        </div>
      )}
      <div className="form-row form-group">
        <div>
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Distance (km)</label>
          <select className="form-select" value={distance} onChange={e => setDistance(e.target.value)}>
            <option value="3">3 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Time (min : sec)</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" className="form-input" placeholder="MM" value={mm} onChange={e => setMm(e.target.value)} min="0" max="99" style={{ textAlign: 'center' }} />
          <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: 20 }}>:</span>
          <input type="number" className="form-input" placeholder="SS" value={ss} onChange={e => setSs(e.target.value)} min="0" max="59" style={{ textAlign: 'center' }} />
        </div>
        {timeSeconds && (
          <div className="pace-display" style={{ marginTop: 8 }}>
            {formatTime(timeSeconds)} · {formatPace(calcPaceSeconds(parseFloat(distance), timeSeconds / 60))}
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea className="form-textarea" placeholder="Route, conditions, how it felt..." value={notes} onChange={e => setNotes(e.target.value)} style={{ minHeight: 60 }} />
      </div>
      <button className="btn btn-secondary" onClick={handleSave} disabled={!timeSeconds}>
        Save Time Trial
      </button>
    </div>
  )
}

function MiniChart({ trials, distanceKm }: { trials: TimeTrial[], distanceKm: number }) {
  const filtered = trials.filter(t => t.distanceKm === distanceKm).slice().reverse()
  if (filtered.length < 2) return null
  const times = filtered.map(t => t.timeSeconds)
  const min = Math.min(...times)
  const max = Math.max(...times)
  const range = max - min || 1
  const w = 100, h = 50
  const pts = filtered.map((t, i) => {
    const x = (i / (filtered.length - 1)) * w
    const y = h - ((t.timeSeconds - min) / range) * (h - 10) - 5
    return `${x},${y}`
  }).join(' ')

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trend ({distanceKm}km)</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 56, overflow: 'visible' }}>
        <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {filtered.map((t, i) => {
          const x = (i / (filtered.length - 1)) * w
          const y = h - ((t.timeSeconds - min) / range) * (h - 10) - 5
          return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" />
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
        <span>{fmtDate(filtered[0].date)}</span>
        <span>{fmtDate(filtered[filtered.length - 1].date)}</span>
      </div>
    </div>
  )
}

export default function Progress({ logs, trials, onAddTrial, onDeleteTrial, calibratedZones, onClearZones }: Props) {
  const week = getWeekNumber()
  const [tab, setTab] = useState<'overview' | 'timetrials'>('overview')

  const totalSessions = logs.length
  const totalKm = logs.reduce((acc, l) => acc + (l.distanceKm ?? 0), 0)
  const totalMins = logs.reduce((acc, l) => acc + (l.durationMins ?? 0), 0)

  const latestTrial10k = trials.filter(t => t.distanceKm === 10).sort((a, b) => b.date.localeCompare(a.date))[0]
  const pb10k = trials.filter(t => t.distanceKm === 10).sort((a, b) => a.timeSeconds - b.timeSeconds)[0]
  const gapToGoal = pb10k ? pb10k.timeSeconds - GOAL_SECONDS : null
  const flaggedLogs = logs.filter(l => l.injuryFlag)

  return (
    <div className="view">
      <div className="seg-control">
        <button className={`seg-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`seg-btn ${tab === 'timetrials' ? 'active' : ''}`} onClick={() => setTab('timetrials')}>Time Trials</button>
      </div>

      {tab === 'overview' && (
        <>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-value green">{totalSessions}</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="stat-box">
              <div className="stat-value blue">{totalKm.toFixed(1)}</div>
              <div className="stat-label">km Run</div>
            </div>
            <div className="stat-box">
              <div className="stat-value warn">{Math.round(totalMins / 60)}</div>
              <div className="stat-label">Hours</div>
            </div>
          </div>

          <div className="card">
            <PaceTrendChart logs={logs} />
          </div>

          {calibratedZones && (
            <div className="card" style={{ borderColor: 'var(--accent-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div className="card-title" style={{ color: 'var(--accent-2)', marginBottom: 0 }}>↑ Pace Zones Recalibrated</div>
                <button
                  onClick={onClearZones}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', padding: 0 }}
                >
                  Reset to phase defaults
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                Based on your {calibratedZones.basedOnDistanceKm}km trial ({formatTime(calibratedZones.basedOnTimeMins * 60)}) · Predicted 10K: {formatTime(calibratedZones.predicted10KMins * 60)}
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                {[
                  { label: 'Easy',      value: fmtPaceRange(calibratedZones.easy.min, calibratedZones.easy.max),         color: 'var(--accent)' },
                  { label: 'Tempo',     value: fmtPaceRange(calibratedZones.tempo.min, calibratedZones.tempo.max),       color: 'var(--warn)' },
                  { label: 'Interval',  value: fmtPaceRange(calibratedZones.interval.min, calibratedZones.interval.max), color: 'var(--accent-2)' },
                  { label: 'Race Pace', value: formatPace(calibratedZones.racePace),                                     color: '#f472b6' },
                ].map(p => (
                  <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{p.label}</span>
                    <span style={{ fontWeight: 700, color: p.color }}>{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pb10k ? (
            <div className="card accent-border">
              <div className="card-title">10km Personal Best</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-2px' }}>
                  {formatTime(pb10k.timeSeconds)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {formatPace(calcPaceSeconds(10, pb10k.timeSeconds / 60))} avg pace
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{fmtDate(pb10k.date)}</div>
                </div>
              </div>
              {gapToGoal !== null && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Progress to sub-50:00</span>
                    <span style={{ color: gapToGoal <= 0 ? 'var(--accent)' : 'var(--warn)' }}>
                      {gapToGoal <= 0 ? '🎉 Goal achieved!' : `${formatTime(gapToGoal)} to go`}
                    </span>
                  </div>
                  {gapToGoal > 0 && (
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{
                        width: `${Math.min(100, Math.max(5, 100 - (gapToGoal / (pb10k.timeSeconds - GOAL_SECONDS + gapToGoal)) * 100))}%`
                      }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <div className="card-title">10km Best</div>
              <div className="empty-state" style={{ padding: '16px 0' }}>
                <div className="empty-icon">⏱️</div>
                <p>Log a 10km time trial to track progress towards sub-50:00</p>
              </div>
            </div>
          )}

          {latestTrial10k && latestTrial10k !== pb10k && (
            <div className="card">
              <div className="card-title">Last 10km Time Trial</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{formatTime(latestTrial10k.timeSeconds)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{fmtDate(latestTrial10k.date)}</div>
            </div>
          )}

          {flaggedLogs.length > 0 && (
            <div className="card" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
              <div className="card-title" style={{ color: 'var(--danger)' }}>⚠️ Injury Flags ({flaggedLogs.length})</div>
              {flaggedLogs.slice(0, 6).map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span>{log.sessionType}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(log.date)}</span>
                </div>
              ))}
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                {flaggedLogs.length > 1
                  ? 'Multiple flags — consider reducing load or seeing a physio.'
                  : 'Monitor closely. Rest if pain persists beyond 24 hours.'}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-title">Training Benchmarks</div>
            {BENCHMARKS.map(bm => {
              const relevantTrials = trials.filter(t => t.distanceKm === bm.distanceKm)
              const best = relevantTrials.sort((a, b) => a.timeSeconds - b.timeSeconds)[0]
              const achieved = best && best.timeSeconds <= bm.targetSeconds
              const isCurrent = bm.week === Math.max(...BENCHMARKS.filter(b => b.week <= (week || 1)).map(b => b.week))
              const isPast = week > bm.week
              return (
                <div key={bm.week} className="benchmark-item">
                  <div className={`bm-check ${achieved ? 'done' : isCurrent ? 'current' : ''}`}>
                    {achieved ? '✓' : isPast && !achieved ? '○' : '·'}
                  </div>
                  <div className="bm-info">
                    <div className="bm-label">{bm.label}</div>
                    <div className="bm-week">Week {bm.week}{best ? ` · PB: ${formatTime(best.timeSeconds)}` : ''}</div>
                  </div>
                  <div className="bm-target">{bm.target}</div>
                </div>
              )
            })}
          </div>

          {logs.length > 0 && (
            <div className="card">
              <div className="card-title">Recent Sessions</div>
              {logs.slice(0, 5).map(log => {
                const pace = log.distanceKm && log.durationMins
                  ? formatPace(calcPaceSeconds(log.distanceKm, log.durationMins))
                  : null
                return (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {log.injuryFlag && <span style={{ marginRight: 4 }}>⚠️</span>}
                        {log.sessionType}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(log.date)}{log.distanceKm ? ` · ${log.distanceKm}km` : ''}</div>
                    </div>
                    {pace && <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{pace}</div>}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'timetrials' && (
        <>
          <TrialForm onAdd={onAddTrial} />
          {[10, 5, 3].map(d => {
            const dTrials = trials.filter(t => t.distanceKm === d)
            return dTrials.length > 0 ? (
              <div key={d} className="card">
                <div className="card-title">{d}km Results</div>
                {dTrials.sort((a, b) => b.date.localeCompare(a.date)).map(t => {
                  const pace = formatPace(calcPaceSeconds(d, t.timeSeconds / 60))
                  const beatTarget = d === 10 && t.timeSeconds < GOAL_SECONDS
                  return (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: beatTarget ? 'var(--accent)' : 'var(--text)' }}>
                          {formatTime(t.timeSeconds)} {beatTarget && '🎉'}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(t.date)} · {pace}</div>
                        {t.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>{t.notes}</div>}
                      </div>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 18, padding: '2px 4px', lineHeight: 1 }} onClick={() => onDeleteTrial(t.id)}>×</button>
                    </div>
                  )
                })}
                <MiniChart trials={trials} distanceKm={d} />
              </div>
            ) : null
          })}
          {trials.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">⏱️</div>
              <p>No time trials yet. Log one above to start tracking your race progress.</p>
            </div>
          )}
          <div className="card blue-border">
            <div className="card-title">Target Pace</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-2)' }}>5:00</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>/km</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Sub-50:00 requires:</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>5:00/km average</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>50 min ÷ 10 km = 5:00/km</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
