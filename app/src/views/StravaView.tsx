import { useState, useEffect, useRef } from 'react'
import { useStrava } from '../hooks/useStrava'
import { getWeekNumber, getPhase, formatTime } from '../data/plan'
import type { StravaActivity, StravaSplit, CalibratedZones, WorkoutLog, TimeTrial } from '../types'

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
  2: { easy: '5:50–6:20/km', tempo: '5:05–5:20/km', interval: '4:45–5:00/km' },
  3: { easy: '5:30–6:00/km', tempo: '4:55–5:10/km', interval: '4:25–4:40/km', race: '4:30/km' },
  4: { easy: '5:30–6:00/km', tempo: '4:45–5:00/km', interval: '4:10–4:25/km', race: '4:30/km' },
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

type CoachSectionType = 'positive' | 'warning' | 'info' | 'tip'

interface CoachSection {
  title: string
  icon: string
  lines: string[]
  type: CoachSectionType
}

interface CoachReport {
  headline: string
  grade: string
  gradeBg: string
  gradeColor: string
  sections: CoachSection[]
}

function generateCoachReport(
  activity: StravaActivity,
  splits: StravaSplit[],
  phaseNum: number,
  calibrated: CalibratedZones | null | undefined,
  historicalRuns: StravaActivity[]
): CoachReport {
  const paces = splits.map(s => speedToPace(s.average_speed))
  const elevs = splits.map(s => s.elevation_difference ?? 0)
  const hrs = splits.map(s => s.average_heartrate).filter((h): h is number => h != null)
  const avgPace = speedToPace(activity.average_speed)
  const distKm = activity.distance / 1000
  const totalClimb = elevs.filter(e => e > 0).reduce((a, b) => a + b, 0)

  const midPt = Math.ceil(paces.length / 2)
  const firstHalfAvg = paces.slice(0, midPt).reduce((a, b) => a + b, 0) / midPt
  const secondHalfAvg = paces.slice(midPt).reduce((a, b) => a + b, 0) / (paces.length - midPt || 1)
  const splitDiff = secondHalfAvg - firstHalfAvg
  const isNegSplit = splitDiff < -5 && paces.length >= 4
  const isPosSplit = splitDiff > 8 && paces.length >= 4
  const firstKmFast = paces.length >= 3 && paces[0] < avgPace * 0.93 && (elevs[0] ?? 0) < 8

  let fadeKm = -1
  for (let i = 1; i < paces.length; i++) {
    if ((paces[i] - paces[i - 1]) / paces[i - 1] > 0.07 && (elevs[i] ?? 0) < 15) {
      fadeKm = splits[i].split; break
    }
  }

  const variance = paces.reduce((sum, p) => sum + Math.pow(p - avgPace, 2), 0) / paces.length
  const cv = Math.sqrt(variance) / avgPace * 100
  const elevExplainsPace = totalClimb > 35

  const sortedPaces = [...paces].sort((a, b) => a - b)
  const bestSplitPace = sortedPaces[0]
  const worstSplitPace = sortedPaces[sortedPaces.length - 1]
  const bestSplitKm = splits[paces.indexOf(bestSplitPace)].split
  const worstSplitKm = splits[paces.indexOf(worstSplitPace)].split

  const last3 = paces.slice(-Math.min(3, paces.length))
  const last3Avg = last3.reduce((a, b) => a + b, 0) / last3.length
  const strongFinish = last3Avg < avgPace * 0.97 && !isNegSplit && paces.length >= 4

  const splitZones = splits.map(s => getZone(speedToPace(s.average_speed), phaseNum, calibrated))
  const easyCount = splitZones.filter(z => z.label.startsWith('Easy')).length
  const tempoCount = splitZones.filter(z => z.label === 'Tempo').length
  const tooFastCount = splitZones.filter(z => z.label === 'Too fast').length
  const recoveryCount = splitZones.filter(z => z.label === 'Recovery').length
  const sessionType = inferSessionType(activity, phaseNum, calibrated)
  const isEasyDay = sessionType === 'Easy Run' || sessionType === 'Long Run'
  const isTempoDay = sessionType === 'Tempo Run'

  const historicalSimilar = historicalRuns
    .filter(r => (r.type === 'Run' || r.sport_type === 'Run') && r.id !== activity.id)
    .filter(r => Math.abs(r.distance - activity.distance) / activity.distance < 0.25)
    .sort((a, b) => b.start_date_local.localeCompare(a.start_date_local))
    .slice(0, 6)

  const last30Days = historicalRuns.filter(r => {
    const diff = (new Date(activity.start_date_local).getTime() - new Date(r.start_date_local).getTime()) / 86400000
    return diff > 0 && diff <= 30 && (r.type === 'Run' || r.sport_type === 'Run')
  })

  const recentPaces = historicalSimilar.map(r => speedToPace(r.average_speed))
  const fastestRecentPace = recentPaces.length > 0 ? Math.min(...recentPaces) : null
  const lastRunPace = recentPaces.length > 0 ? recentPaces[0] : null
  const avgRecentPace = recentPaces.length > 0 ? recentPaces.reduce((a, b) => a + b, 0) / recentPaces.length : null
  const isPB = fastestRecentPace !== null && avgPace < fastestRecentPace - 5

  let hrDrift = 0, earlyHr = 0, lateHr = 0, avgHr = 0
  if (hrs.length >= 4) {
    const third = Math.max(1, Math.floor(hrs.length / 3))
    earlyHr = hrs.slice(0, third).reduce((a, b) => a + b, 0) / third
    lateHr = hrs.slice(-third).reduce((a, b) => a + b, 0) / third
    hrDrift = lateHr - earlyHr
    avgHr = hrs.reduce((a, b) => a + b, 0) / hrs.length
  }

  const sections: CoachSection[] = []
  let issueCount = 0
  let positiveCount = 0

  // ── SECTION 1: PACING & STRATEGY ──────────────────────────────────────────
  {
    const lines: string[] = []
    let type: CoachSectionType = 'positive'

    if (isNegSplit) {
      lines.push(`Negative split — first half at ${fmtPace(firstHalfAvg)}, second half at ${fmtPace(secondHalfAvg)}, ${Math.round(-splitDiff)}s/km faster in the back end. That's controlled running. Most people blow up or drift to even splits by accident. You saved something and used it.`)
      positiveCount++
    } else if (isPosSplit) {
      type = 'warning'; issueCount++
      if (fadeKm > 0) {
        lines.push(`The run came undone at km ${fadeKm} (${fmtPace(paces[fadeKm - 1])}). First half averaged ${fmtPace(firstHalfAvg)}, second half ${fmtPace(secondHalfAvg)} — a ${Math.round(splitDiff)}s/km fade.${firstKmFast ? ` You opened km 1 at ${fmtPace(paces[0])}, which is ${Math.round((avgPace - paces[0]) / avgPace * 100)}% quicker than your overall average. That's where the race was lost.` : ''}`)
      } else {
        lines.push(`Positive split of ${Math.round(splitDiff)}s/km — the back half cost you. First half ${fmtPace(firstHalfAvg)}, second half ${fmtPace(secondHalfAvg)}. The energy ran out before the route did.`)
      }
    } else {
      lines.push(`Even pacing — first half ${fmtPace(firstHalfAvg)}, second half ${fmtPace(secondHalfAvg)}. Clean execution. Harder to do than it sounds.`)
      positiveCount++
    }

    if (firstKmFast && !isPosSplit) {
      lines.push(`Km 1 at ${fmtPace(paces[0])} was ${Math.round((avgPace - paces[0]) / avgPace * 100)}% faster than your overall average. Classic adrenaline start. You got away with it this time, but on a harder session that opener will cost you in the final km.`)
      if (type !== 'warning') { type = 'warning'; issueCount++ }
    }

    if (paces.length >= 4 && worstSplitPace - bestSplitPace > 40) {
      lines.push(elevExplainsPace
        ? `Km ${bestSplitKm} was your quickest at ${fmtPace(bestSplitPace)}, km ${worstSplitKm} the slowest at ${fmtPace(worstSplitPace)}. The ${Math.round(worstSplitPace - bestSplitPace)}s/km spread is large but the ${Math.round(totalClimb)}m of climbing on this route accounts for most of it.`
        : `Km ${bestSplitKm} was your quickest at ${fmtPace(bestSplitPace)}, km ${worstSplitKm} the slowest at ${fmtPace(worstSplitPace)} — ${Math.round(worstSplitPace - bestSplitPace)}s/km between best and worst.`)
    }

    if (strongFinish) {
      lines.push(`Finished well — last ${last3.length} km at ${fmtPace(last3Avg)}, which is ${Math.round(avgPace - last3Avg)}s/km quicker than your run average. You had something left. The next step is finding that gear 2 km earlier.`)
      positiveCount++
    }

    if (cv < 3.5 && !isPosSplit && paces.length >= 4) {
      lines.push(`Pacing variance: ±${cv.toFixed(1)}% across all km splits — very consistent effort regulation.`)
      positiveCount++
    }

    sections.push({ title: 'Pacing & Strategy', icon: '📊', lines, type })
  }

  // ── SECTION 2: EFFORT & SESSION FIT ───────────────────────────────────────
  {
    const lines: string[] = []
    let type: CoachSectionType = 'info'

    if (isEasyDay) {
      if (tooFastCount > paces.length * 0.35) {
        lines.push(`${tooFastCount} of ${paces.length} km splits were above easy zone. On easy days the goal is aerobic base building, not proving fitness. The adaptation comes from the recovery, not the effort. If it feels almost embarrassingly slow, you're probably in the right zone.`)
        type = 'warning'; issueCount++
      } else if (easyCount >= paces.length * 0.6) {
        lines.push(`${easyCount}/${paces.length} km splits in the easy zone — exactly what an easy run should look like. These sessions quietly build the aerobic base your tempo and interval work relies on. Don't underestimate them.`)
        type = 'positive'; positiveCount++
      } else if (recoveryCount >= paces.length * 0.5) {
        lines.push(`This ran at genuine recovery pace — slower than the easy zone. Fine if the body needed it, but on easy run days you want to be in the easy zone, not below it.`)
      }
    } else if (isTempoDay) {
      if (tempoCount >= paces.length * 0.5) {
        lines.push(`${tempoCount}/${paces.length} km splits in the tempo zone. Sustained tempo effort is where lactate threshold improves — the harder thing is to hold it, not to hit it once.`)
        type = 'positive'; positiveCount++
      } else if (easyCount > paces.length * 0.4) {
        lines.push(`Only ${tempoCount}/${paces.length} splits at tempo effort — this ran more like an easy session. Tempo pace should feel comfortably uncomfortable: words are possible, full sentences are not. Find that threshold and hold it for blocks of 10–15 minutes.`)
        type = 'warning'; issueCount++
      }
    }

    if (distKm >= 9) {
      lines.push(`${distKm.toFixed(1)} km — proper long run territory. At this stage, time on feet at easy effort is your most valuable training currency. The aerobic engine you're building here is what everything else runs on.`)
    } else if (distKm < 4 && paces.length <= 4) {
      lines.push(`At ${distKm.toFixed(1)} km this was a short run. Volume matters at this stage — look to extend duration gradually alongside the quality sessions.`)
    }

    if (totalClimb > 25) {
      const gradeAdj = Math.max(avgPace - 50, avgPace - (totalClimb / distKm) * 0.5)
      lines.push(`${Math.round(totalClimb)}m of climbing on this route. Flat-equivalent pace is roughly ${fmtPace(gradeAdj)} — use that number for zone comparison, not the raw splits.`)
    }

    if (lines.length > 0) sections.push({ title: 'Effort & Session Type', icon: '🎯', lines, type })
  }

  // ── SECTION 3: CARDIAC RESPONSE ───────────────────────────────────────────
  if (hrs.length >= 4) {
    const lines: string[] = []
    let type: CoachSectionType = 'info'

    lines.push(`Average HR ${Math.round(avgHr)} bpm · Max ${Math.round(Math.max(...hrs))} bpm.`)

    if (hrDrift > 12 && cv < 9) {
      lines.push(`Cardiac drift of ${Math.round(hrDrift)} bpm at steady pace (${Math.round(earlyHr)} → ${Math.round(lateHr)} bpm). When HR climbs at constant effort it usually signals dehydration, heat load, or fatigue carried from earlier sessions. On runs over 40 minutes, drink before you feel thirsty.`)
      type = 'warning'; issueCount++
    } else if (hrDrift < -8 && cv < 9) {
      lines.push(`HR settled ${Math.round(-hrDrift)} bpm across the run at consistent effort (${Math.round(earlyHr)} → ${Math.round(lateHr)} bpm). That's aerobic efficiency — your heart working less to sustain the same output. A sign of fitness improving.`)
      type = 'positive'; positiveCount++
    } else {
      lines.push(`HR was stable throughout — good effort regulation, no signs of dehydration or heat stress.`)
      type = 'positive'; positiveCount++
    }

    sections.push({ title: 'Cardiac Response', icon: '❤️', lines, type })
  }

  // ── SECTION 4: HOW THIS COMPARES ──────────────────────────────────────────
  if (historicalSimilar.length >= 1) {
    const lines: string[] = []
    let type: CoachSectionType = 'info'

    if (lastRunPace !== null) {
      const lastRun = historicalSimilar[0]
      const diff = lastRunPace - avgPace
      if (Math.abs(diff) < 6) {
        lines.push(`Within 5s/km of your ${fmtDate(lastRun.start_date_local)} run (${fmtDist(lastRun.distance)} at ${fmtPace(lastRunPace)}) — consistent form across sessions.`)
      } else if (diff > 5) {
        lines.push(`${Math.round(diff)}s/km quicker than your ${fmtDate(lastRun.start_date_local)} run of ${fmtDist(lastRun.distance)}. That's meaningful progress — fitness is moving in the right direction.`)
        type = 'positive'; positiveCount++
      } else {
        lines.push(`${Math.round(-diff)}s/km slower than your ${fmtDate(lastRun.start_date_local)} run (${fmtDist(lastRun.distance)} at ${fmtPace(lastRunPace)}). One slower session isn't a trend — could be fatigue, conditions, or just a hard day. Watch the next 2–3 runs.`)
      }
    }

    if (isPB) {
      lines.push(`This looks like a personal best for this distance in your recent activity. File it as a fitness marker.`)
      type = 'positive'; positiveCount++
    } else if (avgRecentPace !== null && Math.abs(avgRecentPace - avgPace) > 8) {
      const vs = avgRecentPace - avgPace
      lines.push(`${Math.round(Math.abs(vs))}s/km ${vs > 0 ? 'faster' : 'slower'} than your recent average for this distance (${fmtPace(avgRecentPace)} over ${historicalSimilar.length} similar runs). ${vs > 0 ? 'The trend is up.' : 'Worth monitoring if it continues.'}`)
    }

    const sessCount = last30Days.length
    lines.push(`${sessCount} run${sessCount !== 1 ? 's' : ''} in the last 30 days. ${sessCount < 3 ? 'Frequency is the biggest lever you have right now — three sessions a week consistently will outperform two harder ones.' : sessCount >= 6 ? 'Strong regularity this month — that consistency is where adaptation comes from.' : 'Decent frequency — each session compounds on the last.'}`)

    sections.push({ title: 'How This Compares', icon: '📈', lines, type })
  }

  // ── SECTION 5: COACH'S NOTES ──────────────────────────────────────────────
  {
    const lines: string[] = []

    if (isPosSplit && firstKmFast) {
      lines.push(`The fix is simple and hard: restrain km 1. Target ${fmtPace(Math.round(avgPace * 1.04))} for the opening km — it will feel slow. That's the point. Pace for the final km, not the first.`)
    } else if (isPosSplit) {
      lines.push(`The fade suggests the overall effort was slightly above where your current fitness sits. Nudge back 5–8 seconds per km and you'll hold form all the way through — and recover faster for the next session.`)
    } else if (isNegSplit) {
      lines.push(`You ran the negative split — a skill most runners take years to develop. If that came from genuine pacing control rather than a conservative start, you're building real race-day execution. Repeat it next session and it becomes a habit.`)
    } else if (isEasyDay && tooFastCount > paces.length * 0.3) {
      const easyTarget = calibrated ? fmtPace(calibrated.easy.max + 10) : 'easy zone target'
      lines.push(`Next easy run: set a pace alert at ${easyTarget} and stay behind it for the first 20 minutes. It's not about going slow — it's about directing the stimulus to the aerobic system, not the anaerobic one.`)
    }

    if (totalClimb > 50) {
      lines.push(`${Math.round(totalClimb)}m of climbing is significant. For a clean pace benchmark, repeat this session on a flat route and you'll get a truer read on where your fitness is.`)
    }

    if (activity.moving_time > 40 * 60 && last30Days.length < 4) {
      lines.push(`You're running, which is what matters most. But to hit the 10K target, the Wednesday and Thursday sessions need to be in the mix — the strength and skip work directly supports the running and protects against the hamstring issues.`)
    }

    if (lines.length === 0) {
      lines.push(`Solid session. Nothing glaring to fix. The compounding effect of runs like this, repeated consistently, is exactly how fitness builds. Keep stacking them.`)
    }

    sections.push({ title: "Coach's Notes", icon: '📝', lines, type: 'tip' })
  }

  // ── GRADE & HEADLINE ──────────────────────────────────────────────────────
  let grade: string, gradeBg: string, gradeColor: string, headline: string

  if (isNegSplit && tooFastCount === 0) {
    grade = 'A'; gradeBg = 'rgba(34,197,94,0.12)'; gradeColor = 'var(--accent)'
    headline = 'Excellent execution — negative split with clean zone compliance'
  } else if (isPosSplit && firstKmFast && issueCount >= 2) {
    grade = 'C'; gradeBg = 'rgba(245,158,11,0.12)'; gradeColor = '#f59e0b'
    headline = fadeKm > 0 ? `Fast start, run unravelled at km ${fadeKm} — classic pacing trap` : 'Fast start, slow finish — pacing needs work'
  } else if (isEasyDay && tooFastCount > paces.length * 0.4) {
    grade = 'C'; gradeBg = 'rgba(245,158,11,0.12)'; gradeColor = '#f59e0b'
    headline = 'Too hard for an easy day — aerobic base builds at lower effort than this'
  } else if (isPB) {
    grade = 'A'; gradeBg = 'rgba(34,197,94,0.12)'; gradeColor = 'var(--accent)'
    headline = 'Personal best for this distance — fitness trending in the right direction'
  } else if (positiveCount > issueCount) {
    grade = 'B+'; gradeBg = 'rgba(34,197,94,0.08)'; gradeColor = 'var(--accent)'
    headline = strongFinish ? 'Solid run — good finish, right way to train' : 'Solid run — consistent effort, minor things to sharpen'
  } else if (issueCount <= 1) {
    grade = 'B'; gradeBg = 'rgba(107,125,160,0.08)'; gradeColor = 'var(--text-muted)'
    headline = 'Decent session — a few areas to tighten, noted below'
  } else {
    grade = 'C+'; gradeBg = 'rgba(245,158,11,0.08)'; gradeColor = '#f59e0b'
    headline = 'Run completed — focus on the execution points below for next time'
  }

  return { headline, grade, gradeBg, gradeColor, sections }
}

function fmtDist(m: number) { return (m / 1000).toFixed(2) + ' km' }

// Returns the nearest standard trial distance if the run is close enough, else null
function nearestTrialDist(distKm: number): number | null {
  if (distKm >= 2.7 && distKm <= 3.3) return 3
  if (distKm >= 4.75 && distKm <= 5.25) return 5
  if (distKm >= 9.5 && distKm <= 10.5) return 10
  return null
}

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
  const hr = split.average_heartrate
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36 }}>km {split.split}</span>
      {elevStr && (
        <span style={{ fontSize: 11, color: elev! > 0 ? '#f97316' : 'var(--accent)', minWidth: 34 }}>{elevStr}</span>
      )}
      <span style={{ fontSize: 14, fontWeight: 700, flex: 1, textAlign: elevStr ? 'center' : 'left' }}>{fmtPace(pace)}</span>
      {hr != null && (
        <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 48, textAlign: 'right' }}>{Math.round(hr)} bpm</span>
      )}
      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: zone.bg, color: zone.color, marginLeft: 6 }}>{zone.label}</span>
    </div>
  )
}

function ActivityCard({ activity, phaseNum, onExpand, calibrated, onAddLog, isLogged, onAddTrial, allActivities }: {
  activity: StravaActivity
  phaseNum: number
  onExpand: () => Promise<StravaActivity | null>
  calibrated?: CalibratedZones | null
  onAddLog?: (log: Omit<WorkoutLog, 'id'>) => void
  isLogged?: boolean
  onAddTrial?: (t: Omit<TimeTrial, 'id'>) => void
  allActivities?: StravaActivity[]
}) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<StravaActivity | null>(null)
  const [loading, setLoading] = useState(false)
  const [justLogged, setJustLogged] = useState(false)
  const [justLoggedTrial, setJustLoggedTrial] = useState(false)
  const [showRpeModal, setShowRpeModal] = useState(false)
  const [showTempModal, setShowTempModal] = useState(false)
  const [pendingTrial, setPendingTrial] = useState<Omit<TimeTrial, 'id'> | null>(null)
  const [tempInput, setTempInput] = useState('')
  const [rpe, setRpe] = useState(5)

  const trialDist = nearestTrialDist(activity.distance / 1000)

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

  async function handleLogTrial(e: React.MouseEvent) {
    e.stopPropagation()
    if (!onAddTrial || !trialDist || justLoggedTrial) return
    let d = detail
    if (!d) d = await onExpand()
    const trial: Omit<TimeTrial, 'id'> = {
      date: activity.start_date_local.slice(0, 10),
      distanceKm: trialDist,
      timeSeconds: activity.moving_time,
      elevationGainM: activity.total_elevation_gain > 0 ? Math.round(activity.total_elevation_gain) : undefined,
      temperatureC: d?.average_temp ?? undefined,
      notes: activity.name,
    }
    if (trial.temperatureC == null) {
      // Watch has no temp sensor — ask user
      setPendingTrial(trial)
      setTempInput('')
      setShowTempModal(true)
    } else {
      onAddTrial(trial)
      setJustLoggedTrial(true)
    }
  }

  function confirmTrial(skipTemp: boolean) {
    if (!onAddTrial || !pendingTrial) return
    const parsed = !skipTemp && tempInput !== '' ? parseFloat(tempInput) : undefined
    onAddTrial({ ...pendingTrial, temperatureC: isNaN(parsed ?? NaN) ? undefined : parsed })
    setShowTempModal(false)
    setPendingTrial(null)
    setJustLoggedTrial(true)
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
      {/* Temperature modal for trial logging */}
      {showTempModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}
          onClick={() => confirmTrial(true)}
        >
          <div
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 20px', width: '100%', maxWidth: 360 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>What was the temperature?</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>
              Your watch doesn't record temperature. Enter it for an accurate flat/cool equivalent time.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <input
                type="number"
                placeholder="e.g. 27"
                value={tempInput}
                onChange={e => setTempInput(e.target.value)}
                min="-10" max="50"
                style={{ flex: 1, fontSize: 24, fontWeight: 700, textAlign: 'center', padding: '10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                autoFocus
              />
              <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 600 }}>°C</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => confirmTrial(true)}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Skip
              </button>
              <button
                onClick={() => confirmTrial(false)}
                style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Save with temp
              </button>
            </div>
          </div>
        </div>
      )}
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
          {activity.average_heartrate != null && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              ❤ {Math.round(activity.average_heartrate)}{activity.max_heartrate != null ? `/${Math.round(activity.max_heartrate)}` : ''} bpm
            </div>
          )}
        </div>
        {onAddTrial && trialDist && (
          <button
            onClick={handleLogTrial}
            style={{
              flexShrink: 0,
              background: justLoggedTrial ? 'var(--accent-dim)' : 'var(--surface)',
              border: `1px solid ${justLoggedTrial ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 6,
              color: justLoggedTrial ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 9px',
              cursor: justLoggedTrial ? 'default' : 'pointer',
              lineHeight: 1,
            }}
          >
            {justLoggedTrial ? '✓' : '⏱ Trial'}
          </button>
        )}
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
            const report = generateCoachReport(detail, detail.splits_metric, phaseNum, calibrated, allActivities ?? [])
            const sectionBorder = (t: CoachSectionType) =>
              t === 'positive' ? 'var(--accent)' : t === 'warning' ? '#f59e0b' : t === 'tip' ? '#a78bfa' : 'var(--border)'
            return (
              <div style={{ marginTop: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ background: report.gradeBg, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    background: report.gradeColor, color: '#fff', fontWeight: 900, fontSize: 15,
                    width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, letterSpacing: '-0.5px',
                  }}>
                    {report.grade}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: report.gradeColor, opacity: 0.85 }}>Coach's Analysis</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.35, marginTop: 2 }}>{report.headline}</div>
                  </div>
                </div>
                {report.sections.map((sec, si) => (
                  <div key={si} style={{
                    borderLeft: `3px solid ${sectionBorder(sec.type)}`,
                    background: si % 2 === 0 ? 'var(--surface)' : 'var(--card)',
                    padding: '10px 14px',
                    borderTop: si === 0 ? 'none' : '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: sectionBorder(sec.type), marginBottom: 7 }}>
                      {sec.icon} {sec.title}
                    </div>
                    {sec.lines.map((line, li) => (
                      <div key={li} style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: li < sec.lines.length - 1 ? 8 : 0 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default function StravaView({ calibratedZones, logs, onAddLog, onAddTrial }: {
  calibratedZones?: CalibratedZones | null
  logs?: WorkoutLog[]
  onAddLog?: (log: Omit<WorkoutLog, 'id'>) => void
  onAddTrial?: (t: Omit<TimeTrial, 'id'>) => void
}) {
  const week = getWeekNumber()
  const phase = getPhase(week)
  const phaseNum = phase?.number ?? 1

  const { isConnected, athlete, activities, syncing, error, debugInfo, exchangeCode, syncActivities, fetchDetail, disconnect } = useStrava()

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
  const connectUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read,activity:read_all`

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
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 12, textAlign: 'left' }}>
              {error}
            </div>
          )}
          {debugInfo && (
            <div style={{ background: 'rgba(107,125,160,0.1)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'left' }}>
              {debugInfo}
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
      {debugInfo && (
        <div style={{ background: 'rgba(107,125,160,0.1)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {debugInfo}
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
              onAddTrial={onAddTrial}
              allActivities={activities}
            />
          ))
        )}
      </div>
    </div>
  )
}
