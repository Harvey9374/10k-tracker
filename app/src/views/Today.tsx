import { useState } from 'react'
import { getWeekNumber, getPhase, getDaySession, PLAN_START, RACE_DATE, BENCHMARKS, PACE_GUIDE } from '../data/plan'
import type { WorkoutLog } from '../types'

interface Props {
  logs: WorkoutLog[]
  onGoLog: () => void
}

export default function Today({ logs, onGoLog }: Props) {
  const today = new Date()
  const week = getWeekNumber(today)
  const phase = getPhase(week)
  const [expandedSession, setExpandedSession] = useState(true)

  const daysToRace = Math.ceil((RACE_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const planStarted = today >= PLAN_START
  const daysUntilStart = Math.ceil((PLAN_START.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const todayStr = today.toISOString().slice(0, 10)
  const loggedToday = logs.filter(l => l.date === todayStr)

  const daySession = phase ? getDaySession(phase, week, today) : null

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = dayNames[today.getDay()]

  const totalWeeksElapsed = week > 0 ? week - 1 : 0
  const planProgress = Math.min(Math.round((totalWeeksElapsed / 52) * 100), 100)

  const nextBenchmark = BENCHMARKS.find(b => b.week >= week)
  const paceInfo = phase ? PACE_GUIDE.find(p => p.phase === phase.number) : null

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
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>days until plan starts (26 May 2026)</div>
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

          {daySession ? (
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
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                <div style={{ marginTop: 14 }}>
                  <button className="btn btn-primary" onClick={onGoLog}>
                    + Log This Session
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

          {paceInfo && (
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
          )}

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
          <li>Calf raises every Wed &amp; Thu — non-negotiable</li>
          <li>Shin pain? Drop volume 50%, substitute skip/bike</li>
        </ul>
      </div>
    </div>
  )
}
