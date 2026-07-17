import React, { useState, useEffect } from 'react'
import { useWorkoutLogs, useTimeTrials, useCalibratedZones, useInjuryMode } from './hooks/useStore'
import { calcCalibratedZones, calcAdjustedTime } from './data/plan'
import Today from './views/Today'
import Log from './views/Log'
import Progress from './views/Progress'
import Plan from './views/Plan'
import StravaView from './views/StravaView'
import type { ViewName } from './types'

function IconToday() {
  return (
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  )
}
function IconLog() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  )
}
function IconProgress() {
  return (
    <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  )
}
function IconStrava() {
  return (
    <svg viewBox="0 0 24 24"><path d="M10.5 3L6 13.5h3.75L10.5 3zm3 10.5L12 17.25 10.5 13.5H6.75L12 24l5.25-10.5H13.5z"/></svg>
  )
}
function IconPlan() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  )
}

const NAV: { id: ViewName; label: string; icon: () => React.ReactElement }[] = [
  { id: 'today',    label: 'Today',    icon: IconToday },
  { id: 'log',      label: 'Log',      icon: IconLog },
  { id: 'progress', label: 'Progress', icon: IconProgress },
  { id: 'strava',   label: 'Strava',   icon: IconStrava },
  { id: 'plan',     label: 'Plan',     icon: IconPlan },
]

const TITLES: Record<ViewName, string> = {
  today:    '10K Sub-45 Tracker',
  log:      'Log Session',
  progress: 'Progress',
  strava:   'Strava',
  plan:     'Training Plan',
}

function getInitialTheme(): 'dark' | 'light' {
  try { return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark' }
  catch { return 'dark' }
}

const NAV_ORDER = NAV.map(n => n.id)

export default function App() {
  const [view, setView] = useState<ViewName>('today')
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right')
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme)
  const { logs, addLog, deleteLog } = useWorkoutLogs()
  const { trials, addTrial: addTrialBase, deleteTrial } = useTimeTrials()
  const { zones: calibratedZones, saveZones, clearZones } = useCalibratedZones()
  const { injuryMode, toggleInjuryMode } = useInjuryMode()

  function addTrial(trial: Parameters<typeof addTrialBase>[0]) {
    addTrialBase(trial)
    const rawSecs = trial.timeSeconds
    const adjSecs = calcAdjustedTime(rawSecs, trial.temperatureC, trial.elevationGainM)
    saveZones(calcCalibratedZones(trial.distanceKm, adjSecs / 60, rawSecs / 60))
  }

  // Auto-migrate stored zones saved before heat/elevation adjustment was applied
  useEffect(() => {
    if (!calibratedZones || calibratedZones.basedOnRawTimeMins !== undefined) return
    const sourceTrial = trials.find(t =>
      t.distanceKm === calibratedZones.basedOnDistanceKm &&
      Math.abs(t.timeSeconds / 60 - calibratedZones.basedOnTimeMins) < 1 &&
      (t.temperatureC != null || t.elevationGainM != null)
    )
    if (sourceTrial) {
      const adjSecs = calcAdjustedTime(sourceTrial.timeSeconds, sourceTrial.temperatureC, sourceTrial.elevationGainM)
      saveZones(calcCalibratedZones(sourceTrial.distanceKm, adjSecs / 60, sourceTrial.timeSeconds / 60))
    }
  }, [trials, calibratedZones])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('code')) setView('strava')
  }, [])

  function navigate(next: ViewName) {
    const from = NAV_ORDER.indexOf(view)
    const to = NAV_ORDER.indexOf(next)
    setSlideDir(to >= from ? 'right' : 'left')
    setView(next)
  }
  function goToLog() { navigate('log') }
  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }

  return (
    <>
      <header className="header">
        <h1>{TITLES[view]}</h1>
        {view === 'today' && <span className="header-badge">🎯 Sub-45</span>}
        {view === 'strava' && <span className="header-badge" style={{ background: 'rgba(252,76,2,0.15)', color: '#fc4c02' }}>🏃 Strava</span>}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <div key={view} className={`view-anim slide-${slideDir}`}>
        {view === 'today' && <Today logs={logs} onGoLog={goToLog} calibratedZones={calibratedZones} injuryMode={injuryMode} onToggleInjuryMode={toggleInjuryMode} />}
        {view === 'log' && <Log logs={logs} onAdd={addLog} onDelete={deleteLog} />}
        {view === 'progress' && <Progress logs={logs} trials={trials} onAddTrial={addTrial} onDeleteTrial={deleteTrial} calibratedZones={calibratedZones} onClearZones={clearZones} />}
        {view === 'strava' && <StravaView calibratedZones={calibratedZones} logs={logs} onAddLog={addLog} onAddTrial={addTrial} />}
        {view === 'plan' && <Plan />}
      </div>

      <nav className="bottom-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-btn ${view === id ? 'active' : ''}`}
            onClick={() => navigate(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}
