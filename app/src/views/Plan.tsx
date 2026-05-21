import { useState } from 'react'
import { PHASES, getWeekNumber, getPhase, PACE_GUIDE } from '../data/plan'
import type { Phase } from '../types'

function DaySection({ day, title, items, type, defaultOpen }: {
  day: string; title: string; items: string[]; type: string; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="day-row">
      <div className="day-header" onClick={() => setOpen(o => !o)}>
        <div className={`day-dot ${type}`} />
        <div className="day-name">{day}</div>
        <div className="day-subtitle" style={{ maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div className={`day-chevron ${open ? 'open' : ''}`}>▼</div>
      </div>
      {open && (
        <div className="day-body">
          <ul className="session-items">
            {items.map((item, i) => (
              <li key={i} style={item === '' ? { padding: '4px 0', border: 'none' } : {}}>
                {item || <>&nbsp;</>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PhaseCard({ phase, isCurrent }: { phase: Phase; isCurrent: boolean }) {
  const [showStrength, setShowStrength] = useState(false)
  const dayTypes: Record<string, string> = {
    monday: 'run', tuesday: 'strength', wednesday: 'conditioning',
    thursday: 'recovery', friday: 'run', weekend: 'run',
  }
  const days = [
    { key: 'monday', label: 'Monday', session: phase.monday },
    { key: 'tuesday', label: 'Tuesday', session: phase.tuesday },
    { key: 'wednesday', label: 'Wednesday', session: phase.wednesday },
    { key: 'thursday', label: 'Thursday', session: phase.thursday },
    { key: 'friday', label: 'Friday', session: phase.friday },
    { key: 'weekend', label: 'Weekend', session: phase.weekend },
  ]

  return (
    <div>
      {/* Phase header */}
      <div className={`phase-hero ${isCurrent ? 'accent-border' : ''}`}>
        <div className="ph-top">
          <div className="ph-number">{phase.number}</div>
          <div className="ph-info">
            <div className="ph-name">{phase.name}</div>
            <div className="ph-date">{phase.dateRange} · {phase.weeks}</div>
          </div>
          {isCurrent && <span className="badge badge-green">Current</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{phase.focus}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Target: {phase.weeklyTarget}</div>
      </div>

      {/* Pace guide */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div className="card-title">Pace Guide</div>
        {phase.paceGuide.map(p => (
          <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>{p.label}</span>
            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{p.pace}</span>
          </div>
        ))}
      </div>

      {/* Weekly sessions */}
      <div style={{ marginBottom: 10 }}>
        {days.map(({ key, label, session }) => (
          <DaySection
            key={key}
            day={label}
            title={session.title}
            items={session.items}
            type={dayTypes[key]}
          />
        ))}
      </div>

      {/* Strength circuit */}
      {phase.strengthCircuit && phase.strengthCircuit.length > 0 && (
        <div className="card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setShowStrength(s => !s)}
          >
            <div className="card-title" style={{ marginBottom: 0 }}>💪 Strength Circuit</div>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{showStrength ? '▲ Hide' : '▼ Show'}</span>
          </div>
          {showStrength && (
            <div style={{ marginTop: 12 }}>
              {phase.strengthCircuit.map((line, i) => (
                <div key={i} style={{
                  fontSize: 13,
                  color: line.startsWith('A.') || line.startsWith('B.') ? 'var(--text)' : line === '' ? 'transparent' : 'var(--text-muted)',
                  fontWeight: line.startsWith('A.') || line.startsWith('B.') ? 700 : 400,
                  padding: line === '' ? '4px 0' : '3px 0',
                  letterSpacing: line.startsWith('A.') || line.startsWith('B.') ? '0.3px' : 0,
                }}>
                  {line || ' '}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Phase notes */}
      {phase.notes && phase.notes.length > 0 && (
        <div className="card">
          <div className="card-title">Phase Notes</div>
          {phase.notes.map((note, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
              {note}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Plan() {
  const week = getWeekNumber()
  const currentPhase = getPhase(week)
  const [selectedPhase, setSelectedPhase] = useState(currentPhase?.number ?? 1)

  const phase = PHASES.find(p => p.number === selectedPhase)!
  const isCurrent = currentPhase?.number === selectedPhase

  return (
    <div className="view">
      {/* Phase selector */}
      <div className="phase-tabs">
        {PHASES.map(p => (
          <button
            key={p.number}
            className={`phase-tab ${selectedPhase === p.number ? 'active' : ''}`}
            onClick={() => setSelectedPhase(p.number)}
          >
            Phase {p.number}: {p.name}
          </button>
        ))}
      </div>

      <PhaseCard phase={phase} isCurrent={isCurrent} />

      {/* Full pace guide table */}
      <div className="card">
        <div className="card-title">Full Pace Guide (All Phases)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Session', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: h === 'Session' ? 'left' : 'center', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Easy', key: 'easy' as const },
                { label: 'Tempo', key: 'tempo' as const },
                { label: 'Intervals', key: 'interval' as const },
                { label: 'Race pace', key: 'racePace' as const },
              ].map(row => (
                <tr key={row.key}>
                  <td style={{ padding: '8px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}</td>
                  {PACE_GUIDE.map(pg => (
                    <td key={pg.phase} style={{ padding: '8px 8px', textAlign: 'center', color: pg[row.key] === '—' ? 'var(--text-dim)' : 'var(--accent)', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>
                      {pg[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key principles */}
      <div className="card">
        <div className="card-title">Key Principles</div>
        {[
          'Easy runs must actually be easy. Most people run them too fast.',
          'Strength work is not optional. Single-leg stability reduces re-injury risk.',
          'Sleep and nutrition matter as much as the sessions. Recovery is slower at 42.',
          'Consistency over any individual session. A 40-min run beats a skipped 70-min run.',
          'Never try to make up a missed session. Move to the next scheduled session.',
          'Aim for 150–160g protein/day. Don\'t run fasted for Phase 3 & 4 quality sessions.',
        ].map((p, i) => (
          <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
