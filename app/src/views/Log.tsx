import { useState } from 'react'
import type { WorkoutLog } from '../types'
import { formatPace, calcPaceSeconds, formatTime } from '../data/plan'

interface Props {
  logs: WorkoutLog[]
  onAdd: (log: Omit<WorkoutLog, 'id'>) => void
  onDelete: (id: string) => void
}

const STRENGTH_SESSION_TYPES = new Set(['Strength + Conditioning'])

function getStrengthSuggestion(rounds: number, rpe: number): { text: string; color: string } {
  if (rpe <= 4) {
    if (rounds >= 3) return { text: 'Very manageable — add 1–2 reps per exercise next session', color: 'var(--accent)' }
    return { text: 'Light effort — try adding an extra round or 1–2 reps next session', color: 'var(--accent)' }
  }
  if (rpe <= 6) {
    if (rounds >= 3) return { text: 'Spot on — maintain current reps and load', color: 'var(--accent)' }
    return { text: 'Good effort — work towards completing full rounds before adding reps', color: 'var(--warn)' }
  }
  if (rpe <= 8) {
    if (rounds >= 3) return { text: 'Strong effort — hold reps for 1–2 more sessions before increasing', color: 'var(--warn)' }
    return { text: 'Solid work — aim to complete target rounds at current reps next session', color: 'var(--warn)' }
  }
  return { text: 'Very hard — reduce reps by ~10% to maintain form and aid recovery', color: '#ef4444' }
}

const SESSION_TYPES = [
  'Easy Run',
  'Tempo Run',
  'Interval Session',
  'Race Pace Session',
  'Strength + Conditioning',
  'Long Run',
  'Skip + Mobility',
  'Recovery / Mobility',
  'Time Trial',
  'Other',
]

const SESSION_ICONS: Record<string, string> = {
  'Easy Run': '🏃',
  'Tempo Run': '⚡',
  'Interval Session': '🔥',
  'Race Pace Session': '🎯',
  'Strength + Conditioning': '💪',
  'Long Run': '🛣️',
  'Skip + Mobility': '🦘',
  'Recovery / Mobility': '🧘',
  'Time Trial': '⏱️',
  'Other': '📝',
}

function sessionIcon(type: string) {
  return SESSION_ICONS[type] ?? '📝'
}

function sessionClass(type: string) {
  if (type.includes('Strength')) return 'strength'
  if (type.includes('Recovery') || type.includes('Mobility')) return 'recovery'
  return ''
}

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Log({ logs, onAdd, onDelete }: Props) {
  const d = new Date()
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const [tab, setTab] = useState<'add' | 'history'>('add')

  const [date, setDate] = useState(today)
  const [sessionType, setSessionType] = useState(SESSION_TYPES[0])
  const [distanceKm, setDistanceKm] = useState('')
  const [durationMins, setDurationMins] = useState('')
  const [effort, setEffort] = useState(5)
  const [notes, setNotes] = useState('')
  const [injuryFlag, setInjuryFlag] = useState(false)
  const [roundsCompleted, setRoundsCompleted] = useState<number | ''>('')
  const [saved, setSaved] = useState(false)

  const isStrengthSession = STRENGTH_SESSION_TYPES.has(sessionType)

  const dist = parseFloat(distanceKm)
  const dur = parseFloat(durationMins)
  const hasPace = !isNaN(dist) && !isNaN(dur) && dist > 0 && dur > 0
  const paceSeconds = hasPace ? calcPaceSeconds(dist, dur) : null
  const paceLabel = paceSeconds ? formatPace(paceSeconds) : null

  function handleSave() {
    onAdd({
      date,
      sessionType,
      distanceKm: dist || undefined,
      durationMins: dur || undefined,
      perceivedEffort: effort,
      roundsCompleted: isStrengthSession && roundsCompleted !== '' ? roundsCompleted : undefined,
      notes: notes.trim() || undefined,
      injuryFlag: injuryFlag || undefined,
      completed: true,
    })
    setDistanceKm('')
    setDurationMins('')
    setNotes('')
    setEffort(5)
    setRoundsCompleted('')
    setInjuryFlag(false)
    setDate(today)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setTab('history')
  }

  return (
    <div className="view">
      <div className="seg-control">
        <button className={`seg-btn ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>+ Log Session</button>
        <button className={`seg-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History ({logs.length})</button>
      </div>

      {tab === 'add' && (
        <div>
          {saved && (
            <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 14, color: 'var(--accent)', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
              ✓ Session logged!
            </div>
          )}

          <div className="card">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Session Type</label>
              <select className="form-select" value={sessionType} onChange={e => setSessionType(e.target.value)}>
                {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-row form-group">
              <div>
                <label className="form-label">Distance (km)</label>
                <input type="number" className="form-input" placeholder="e.g. 5.2" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} step="0.1" min="0" />
              </div>
              <div>
                <label className="form-label">Duration (min)</label>
                <input type="number" className="form-input" placeholder="e.g. 28" value={durationMins} onChange={e => setDurationMins(e.target.value)} step="1" min="0" />
              </div>
            </div>

            {hasPace && paceLabel && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Average Pace</div>
                <div className="pace-display">{paceLabel}</div>
                <div className="form-hint">{formatTime(dur * 60)} · {dist} km</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Perceived Effort — {effort}/10</label>
              <div className="effort-row" style={{ marginTop: 8 }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`effort-pip ${i < effort ? 'filled' : ''}`}
                    onClick={() => setEffort(i + 1)}
                  />
                ))}
              </div>
              <div className="form-hint" style={{ marginTop: 6 }}>
                {effort <= 3 ? 'Very easy — conversational' : effort <= 5 ? 'Comfortable — easy breathing' : effort <= 7 ? 'Moderate — focused effort' : effort <= 9 ? 'Hard — limited conversation' : 'Maximum effort'}
              </div>
            </div>

            {isStrengthSession && (
              <div className="form-group">
                <label className="form-label">Rounds completed</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoundsCompleted(roundsCompleted === r ? '' : r)}
                      style={{
                        width: 52, height: 52, borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${roundsCompleted === r ? 'var(--accent-2)' : 'var(--border)'}`,
                        background: roundsCompleted === r ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
                        color: roundsCompleted === r ? 'var(--accent-2)' : 'var(--text)',
                        fontSize: 18, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {roundsCompleted !== '' && (
                  <div style={{
                    marginTop: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${getStrengthSuggestion(roundsCompleted, effort).color}40`,
                    background: `${getStrengthSuggestion(roundsCompleted, effort).color}0d`,
                    fontSize: 13,
                  }}>
                    <div style={{ fontWeight: 700, color: getStrengthSuggestion(roundsCompleted, effort).color, marginBottom: 2 }}>
                      Recommendation
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {getStrengthSuggestion(roundsCompleted, effort).text}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea className="form-textarea" placeholder="How did it feel? Any shin discomfort? Weather?" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Injury / Niggle</label>
              <button
                type="button"
                onClick={() => setInjuryFlag(f => !f)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${injuryFlag ? 'var(--danger)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  background: injuryFlag ? 'rgba(239,68,68,0.08)' : 'var(--surface)',
                  color: injuryFlag ? 'var(--danger)' : 'var(--text-muted)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {injuryFlag ? '⚠️ Niggle flagged — tap to clear' : '⚑ Flag injury / niggle'}
              </button>
              {injuryFlag && (
                <div className="form-hint" style={{ color: '#f87171', marginTop: 6 }}>Session will appear in your injury log on the Progress tab.</div>
              )}
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              Save Session
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No sessions logged yet.<br />Hit "Log Session" to get started.</p>
            </div>
          ) : (
            logs.map(log => {
              const pace = log.distanceKm && log.durationMins
                ? formatPace(calcPaceSeconds(log.distanceKm, log.durationMins))
                : null
              return (
                <div key={log.id} className="log-item" style={log.injuryFlag ? { borderColor: 'rgba(239,68,68,0.4)' } : undefined}>
                  <div className={`log-icon ${sessionClass(log.sessionType)}`} style={log.injuryFlag ? { background: 'rgba(239,68,68,0.12)' } : undefined}>
                    {log.injuryFlag ? '⚠️' : sessionIcon(log.sessionType)}
                  </div>
                  <div className="log-meta">
                    <div className="log-title">{log.sessionType}</div>
                    <div className="log-sub">
                      {fmtDate(log.date)}
                      {log.distanceKm ? ` · ${log.distanceKm} km` : ''}
                      {log.durationMins ? ` · ${log.durationMins} min` : ''}
                    </div>
                    {log.notes && <div className="log-sub" style={{ marginTop: 2, fontStyle: 'italic' }}>{log.notes}</div>}
                  </div>
                  <div className="log-right">
                    {pace && <div className="log-pace">{pace}</div>}
                    {log.roundsCompleted && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.roundsCompleted} round{log.roundsCompleted !== 1 ? 's' : ''}</div>
                    )}
                    {log.perceivedEffort && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>RPE {log.perceivedEffort}/10</div>
                    )}
                    <button className="btn-danger" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 18, padding: '2px 4px', lineHeight: 1 }} onClick={() => onDelete(log.id)}>×</button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
