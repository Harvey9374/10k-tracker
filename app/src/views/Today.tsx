import { useState } from 'react'
import { getWeekNumber, getPhase, getDaySession, PLAN_START, RACE_DATE, BENCHMARKS, PACE_GUIDE, formatPace, formatTime } from '../data/plan'
import { useSessionCompletions } from '../hooks/useStore'
import type { WorkoutLog, Phase, CalibratedZones } from '../types'

interface Props {
  logs: WorkoutLog[]
  onGoLog: () => void
  calibratedZones?: CalibratedZones | null
  injuryMode: boolean
  onToggleInjuryMode: () => void
}

function fmtPaceRange(min: number, max: number): string {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
  return `${fmt(min)}–${fmt(max)}/km`
}

function isStrengthItem(item: string) {
  return /strength/i.test(item)
}

function StrengthCircuitInline({ circuit }: { circuit: string[] }) {
  return (
    <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: '2px solid var(--accent-2)' }}>
      {circuit.map((line, i) => (
        <div key={i} style={{
          fontSize: 13,
          color: line.startsWith('A.') || line.startsWith('B.') ? 'var(--text)' : line === '' ? 'transparent' : 'var(--text-muted)',
          fontWeight: line.startsWith('A.') || line.startsWith('B.') ? 700 : 400,
          padding: line === '' ? '3px 0' : '2px 0',
        }}>
          {line || ' '}
        </div>
      ))}
    </div>
  )
}

function SessionItem({ item, phase }: { item: string; phase: Phase | null }) {
  const [open, setOpen] = useState(false)
  const hasCircuit = isStrengthItem(item) && phase?.strengthCircuit && phase.strengthCircuit.length > 0

  if (!hasCircuit) return <li>{item}</li>

  return (
    <li style={{ flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
        <span style={{ flex: 1 }}>{item}</span>
        <span style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, flexShrink: 0 }}>
          {open ? '▲ hide' : '▼ show exercises'}
        </span>
      </div>
      {open && <StrengthCircuitInline circuit={phase!.strengthCircuit!} />}
    </li>
  )
}

const INJURY_SESSIONS: Record<string, { title: string; items: string[] }> = {
  monday:    { title: 'Gentle Recovery — Injury Mode', items: ['Easy walk or stationary bike: 20–30 mins (no impact)', 'Seated calf raises: 3 × 20 each leg', 'Hip flexor & hamstring stretches: 10 mins', 'Ice any sore area: 10–15 mins', 'No running or high-impact activity'] },
  tuesday:   { title: 'Upper Body Only — Injury Mode', items: ['Upper body strength session: 40 mins', 'No lower-body loading exercises', 'Gentle core work (dead bug, plank): 10 mins', 'Foam roll calves and shins: 10 mins'] },
  wednesday: { title: 'Light Conditioning — Injury Mode', items: ['Gentle flat walk: 20–30 mins', 'Resistance band glute work: 15 mins', 'Seated calf raises: 3 × 20 each leg', 'Hip mobility circuit: 10 mins'] },
  thursday:  { title: 'Rest & Assess — Injury Mode', items: ['Full rest or gentle yoga/stretching: 20 mins', 'Foam roll full lower body: 10 mins', 'Rate pain level 1–10. Improving? Plan gradual return.', 'If pain above 3/10 consult a physio'] },
  friday:    { title: 'Test Run — Injury Mode', items: ['5-min walk warm-up', 'Attempt 5-min easy jog — stop immediately at any pain', 'If pain-free: continue 10–15 mins at very easy pace', 'If any pain: rest and book physio'] },
  weekend:   { title: 'Active Recovery — Injury Mode', items: ['Swimming or cycling (low impact): 30–40 mins if available', 'No running until pain-free for 48 hrs', 'Gentle walk alternative: 30 mins flat', 'Reassess Monday — plan return-to-run if improving'] },
}

const DAY_TO_SESSION_KEY = ['weekend', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekend']

function loadStravaWeekKm(weekStartStr: string, weekEndStr: string): number {
  try {
    const raw = localStorage.getItem('stravaActivities')
    if (!raw) return 0
    const acts: Array<{ start_date_local: string; distance: number }> = JSON.parse(raw)
    return acts
      .filter(a => {
        const d = a.start_date_local.slice(0, 10)
        return d >= weekStartStr && d <= weekEndStr
      })
      .reduce((sum, a) => sum + a.distance / 1000, 0)
  } catch { return 0 }
}

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function parseWeeklyKmTarget(target: string): { min: number; max: number } | null {
  const m = target.match(/(\d+)[–\-](\d+)/)
  if (m) return { min: parseInt(m[1]), max: parseInt(m[2]) }
  return null
}

export default function Today({ logs, onGoLog, calibratedZones, injuryMode, onToggleInjuryMode }: Props) {
  const today = new Date()
  const week = getWeekNumber(today)
  const phase = getPhase(week)
  const [expandedSession, setExpandedSession] = useState(true)
  const { completions, toggleCompletion } = useSessionCompletions()

  const daysToRace = Math.ceil((RACE_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const planStarted = today >= PLAN_START
  const daysUntilStart = Math.ceil((PLAN_START.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const todayStr = toLocalDateStr(today)
  const loggedToday = logs.filter(l => l.date === todayStr)
  const todayMarkedComplete = completions.includes(todayStr)

  const daySession = phase ? getDaySession(phase, week, today) : null
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = dayNames[today.getDay()]

  const totalWeeksElapsed = week > 0 ? week - 1 : 0
  const planProgress = Math.min(Math.round((totalWeeksElapsed / 52) * 100), 100)
  const nextBenchmark = BENCHMARKS.find(b => b.week >= week)
  const paceInfo = phase ? PACE_GUIDE.find(p => p.phase === phase.number) : null

  // Weekly km + adherence
  const weekStart = getWeekStart(today)
  const weekStartStr = toLocalDateStr(weekStart)
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6)
  const weekEndStr = toLocalDateStr(weekEnd)
  const weekLogs = logs.filter(l => l.date >= weekStartStr && l.date <= weekEndStr)
  const weekManualKm = weekLogs.reduce((acc, l) => acc + (l.distanceKm ?? 0), 0)
  const weekStravaKm = loadStravaWeekKm(weekStartStr, weekEndStr)
  const weekKm = weekManualKm + weekStravaKm
  const weekTarget = phase ? parseWeeklyKmTarget(phase.weeklyTarget) : null

  const injurySessionKey = DAY_TO_SESSION_KEY[today.getDay()]
  const injuryDaySession = INJURY_SESSIONS[injurySessionKey]

  // RPE-based time trial prompt
  const last3EasyRuns = logs
    .filter(l => l.sessionType === 'Easy Run' && typeof l.perceivedEffort === 'number')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
  const recentlyCalibrated = calibratedZones &&
    (Date.now() - new Date(calibratedZones.calibratedAt).getTime()) < 28 * 24 * 60 * 60 * 1000
  const showTimeTrialPrompt =
    !recentlyCalibrated &&
    last3EasyRuns.length >= 3 &&
    last3EasyRuns.every(l => (l.perceivedEffort ?? 10) <= 3)
  const avgEasyRPE = last3EasyRuns.length === 3
    ? Math.round(last3EasyRuns.reduce((s, l) => s + (l.perceivedEffort ?? 0), 0) / 3 * 10) / 10
    : null

  // Day dots for the week (Mon–Sun)
  const weekDots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    const dateStr = toLocalDateStr(d)
    return {
      dateStr,
      label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
      isDone: completions.includes(dateStr),
    }
  })

  return (
    <div className="view">
      <div className="race-hero">
        <div className="rh-label">Race Day Countdown</div>
        <div className="rh-days">{daysToRace}</div>
        <div className="rh-unit">days to go</div>
        <div className="rh-date">Target: Sub-50:00 · 15 May 2027</div>
      </div>

      {!planStarted ? (
        <div className="card">
          <div className="card-title">Plan Status</div>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--warn)' }}>{daysUntilStart}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>days until plan starts (25 May 2026)</div>
          </div>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-value green">{week}</div>
              <div className="stat-label">of 52 Weeks</div>
            </div>
            <div className="stat-box">
              <div className="stat-value blue">{phase?.number ?? '—'}</div>
              <div className="stat-label">{phase?.name.split(' ')[0] ?? 'Phase'}</div>
            </div>
            <div className="stat-box">
              <div className="stat-value warn">{planProgress}%</div>
              <div className="stat-label">Complete</div>
            </div>
          </div>

          <div className="card" style={{ paddingBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Plan progress</span>
              <span>Week {week} / 52</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${planProgress}%` }} />
            </div>
            {phase && (
              <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                <span className="badge badge-green" style={{ marginRight: 6 }}>{phase.name}</span>
                {phase.dateRange}
              </div>
            )}
          </div>

          {/* Weekly summary card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>This Week</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {weekDots.filter(d => d.isDone).length}/{weekDots.filter(d => !d.isFuture).length} sessions
              </div>
            </div>

            {/* Day dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', marginBottom: 14 }}>
              {weekDots.map((dot, i) => (
                <button
                  key={i}
                  onClick={() => !dot.isFuture && toggleCompletion(dot.dateStr)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    background: 'none',
                    border: 'none',
                    cursor: dot.isFuture ? 'default' : 'pointer',
                    padding: 0,
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: dot.isDone ? 'var(--accent)' : dot.isToday ? 'var(--accent-dim)' : 'transparent',
                    border: `2px solid ${dot.isDone ? 'var(--accent)' : dot.isToday ? 'var(--accent)' : 'var(--border)'}`,
                    fontSize: 13,
                    fontWeight: 700,
                    color: dot.isDone ? '#fff' : dot.isFuture ? 'var(--text-dim)' : 'var(--text)',
                    transition: 'all 0.15s',
                  }}>
                    {dot.isDone ? '✓' : dot.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Weekly km bar */}
            {weekTarget && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {weekKm.toFixed(1)} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>km</span>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>target {weekTarget.min}–{weekTarget.max} km</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (weekKm / weekTarget.max) * 100)}%` }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  {weekKm === 0 ? 'No km logged yet this week'
                    : weekKm < weekTarget.min ? `${(weekTarget.min - weekKm).toFixed(1)} km to minimum target`
                    : weekKm <= weekTarget.max ? '✓ On target this week'
                    : `${(weekKm - weekTarget.max).toFixed(1)} km over weekly ceiling`}
                  {weekStravaKm > 0 && <span style={{ marginLeft: 6, color: '#fc4c02', fontWeight: 600 }}>· {weekStravaKm.toFixed(1)} km via Strava</span>}
                </div>
              </>
            )}
          </div>

          {/* Injury mode toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button
              onClick={onToggleInjuryMode}
              style={{
                background: injuryMode ? 'rgba(239,68,68,0.1)' : 'var(--card)',
                border: `1.5px solid ${injuryMode ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 20,
                color: injuryMode ? 'var(--danger)' : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              {injuryMode ? '🩹 Injury Mode ON — tap to resume' : '🩹 Pause for Injury'}
            </button>
          </div>

          {injuryMode && (
            <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>⚠ Training Paused — Injury Mode</div>
              <div style={{ fontSize: 13, color: '#f87171' }}>Normal sessions replaced with recovery work. Tap the button above when ready to resume training.</div>
            </div>
          )}

          {showTimeTrialPrompt && (
            <div className="card" style={{ borderColor: 'var(--accent-2)', borderWidth: 2 }}>
              <div className="card-title" style={{ color: 'var(--accent-2)', marginBottom: 4 }}>⏱ Time Trial Recommended</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
                Your last 3 easy runs averaged RPE {avgEasyRPE}/10. Your aerobic fitness has improved — a time trial will recalibrate all your pace zones.
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 8 }}>How to run it</div>
              {[
                { icon: '📏', label: 'Distance', value: `5km or 10km${week < 20 ? ' (5km recommended before Week 20)' : ' (10km gives the most accurate result)'}` },
                { icon: '💥', label: 'Effort', value: '100% — treat it as a race from the gun, not a time trial jog' },
                { icon: '🗺️', label: 'Route', value: 'Flat, measured route — no traffic stops, no hills' },
                { icon: '🔥', label: 'Warm-up first', value: '10 min easy jog, then 4 × 100m strides with full recovery, rest 5 min' },
                { icon: '⚡', label: 'Pacing', value: 'Start controlled — aim for even or slightly negative splits, not a fast first km' },
                { icon: '📊', label: 'Afterwards', value: 'Log it in Progress → Time Trials — your pace zones will update automatically' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <div>
                    <span style={{ fontWeight: 700 }}>{label}:</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {injuryMode && injuryDaySession ? (
            <div className="today-session-card" style={{ borderColor: 'var(--danger)' }}>
              <div className="tsc-header" style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
                <span style={{ fontSize: 16 }}>🩹</span>
                <span className="tsc-day" style={{ color: 'var(--danger)' }}>{todayName}'s Recovery</span>
                {loggedToday.length > 0 && (
                  <span className="badge badge-green" style={{ marginLeft: 'auto' }}>✓ Logged</span>
                )}
              </div>
              <div className="tsc-title">{injuryDaySession.title}</div>
              <div className="tsc-body">
                <ul className="session-items">
                  {injuryDaySession.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-primary" onClick={onGoLog} style={{ flex: 1 }}>
                    + Log Session
                  </button>
                  <button
                    onClick={() => toggleCompletion(todayStr)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 50, border: `2px solid ${todayMarkedComplete ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)', background: todayMarkedComplete ? 'var(--accent-dim)' : 'var(--card)',
                      color: todayMarkedComplete ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: 20, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                    }}
                    title={todayMarkedComplete ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todayMarkedComplete ? '✓' : '○'}
                  </button>
                </div>
              </div>
            </div>
          ) : daySession ? (
            <div className="today-session-card">
              <div className="tsc-header">
                <span style={{ fontSize: 16 }}>{['🏃', '💪', '⚡', '🧘', '🏃', '🏃', '🏃'][today.getDay()]}</span>
                <span className="tsc-day">{todayName}'s Session</span>
                {loggedToday.length > 0 && (
                  <span className="badge badge-green" style={{ marginLeft: 'auto' }}>✓ Logged</span>
                )}
              </div>
              <div className="tsc-title">{daySession.session.title}</div>
              <div className="tsc-body">
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, marginBottom: 10, padding: 0 }}
                  onClick={() => setExpandedSession(e => !e)}
                >
                  {expandedSession ? '▲ Hide details' : '▼ Show details'}
                </button>
                {expandedSession && (
                  <ul className="session-items">
                    {daySession.session.items.map((item, i) => (
                      <SessionItem key={i} item={item} phase={phase} />
                    ))}
                  </ul>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-primary" onClick={onGoLog} style={{ flex: 1 }}>
                    + Log Session
                  </button>
                  <button
                    onClick={() => toggleCompletion(todayStr)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      border: `2px solid ${todayMarkedComplete ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      background: todayMarkedComplete ? 'var(--accent-dim)' : 'var(--card)',
                      color: todayMarkedComplete ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: 20,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    title={todayMarkedComplete ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todayMarkedComplete ? '✓' : '○'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{ textAlign: 'center', padding: '8px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>😴</div>
                <div>Rest day — recovery is part of training</div>
              </div>
            </div>
          )}


          {calibratedZones ? (
            <div className="card" style={{ borderColor: 'var(--accent-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div className="card-title" style={{ marginBottom: 0 }}>Your Pace Zones</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-2)' }}>↑ Recalibrated</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                From your {calibratedZones.basedOnDistanceKm}km trial · Predicted 10K: {formatTime(calibratedZones.predicted10KMins * 60)}
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { label: 'Easy Run',  value: fmtPaceRange(calibratedZones.easy.min, calibratedZones.easy.max),         color: 'var(--accent)' },
                  { label: 'Tempo',     value: fmtPaceRange(calibratedZones.tempo.min, calibratedZones.tempo.max),       color: 'var(--warn)' },
                  { label: 'Intervals', value: fmtPaceRange(calibratedZones.interval.min, calibratedZones.interval.max), color: 'var(--accent-2)' },
                  { label: 'Race Pace', value: formatPace(calibratedZones.racePace),                                     color: '#f472b6' },
                ].map(p => (
                  <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : paceInfo ? (
            <div className="card">
              <div className="card-title">Phase {phase?.number} Pace Guide</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { label: 'Easy Run', value: paceInfo.easy, color: 'var(--accent)' },
                  ...(paceInfo.tempo !== '—' ? [{ label: 'Tempo', value: paceInfo.tempo, color: 'var(--warn)' }] : []),
                  ...(paceInfo.interval !== '—' ? [{ label: 'Intervals', value: paceInfo.interval, color: 'var(--accent-2)' }] : []),
                  ...(paceInfo.racePace !== '—' ? [{ label: 'Race Pace', value: paceInfo.racePace, color: '#f472b6' }] : []),
                ].map(p => (
                  <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {nextBenchmark && (
            <div className="card blue-border">
              <div className="card-title">Next Benchmark</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28 }}>🎯</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{nextBenchmark.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Week {nextBenchmark.week} · {nextBenchmark.target}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-2)' }}>{nextBenchmark.week - week}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>weeks away</div>
                </div>
              </div>
            </div>
          )}

          {loggedToday.length > 0 && (
            <div className="card">
              <div className="card-title">Logged Today</div>
              {loggedToday.map(log => (
                <div key={log.id} className="log-item" style={{ marginBottom: 6 }}>
                  <div className="log-icon">🏃</div>
                  <div className="log-meta">
                    <div className="log-title">{log.sessionType}</div>
                    <div className="log-sub">
                      {log.distanceKm ? `${log.distanceKm} km` : ''}
                      {log.distanceKm && log.durationMins ? ' · ' : ''}
                      {log.durationMins ? `${log.durationMins} min` : ''}
                    </div>
                  </div>
                  {log.injuryFlag && (
                    <span style={{ fontSize: 18 }} title="Injury flag">⚠️</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="shin-warning">
        <div className="sw-title">Shin Splint Protocol</div>
        <ul>
          <li>Never increase weekly distance by more than 10%</li>
          <li>Calf raises every Wed & Thu — non-negotiable</li>
          <li>Shin pain? Drop volume 50%, substitute skip/bike</li>
        </ul>
      </div>
    </div>
  )
}
