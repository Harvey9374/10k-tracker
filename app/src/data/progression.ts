// Equipment: 2 × 15kg dumbbells, skip rope, foam roller, step/box, bodyweight
import type { WorkoutLog } from '../types'

export type ExerciseUnit = 'reps' | 'reps each leg' | 'reps each side' | 'reps each direction' | 'sec' | 'sec each side'

export type Exercise = {
  name: string
  reps: number          // target reps or seconds for time-based
  unit: ExerciseUnit
  weight?: string
  note?: string
}

export type CircuitVariation = {
  label: string
  focus: string
  lower: Exercise[]
  upper: Exercise[]
  rounds: string
}

export type SkipVariation = {
  label: string
  structure: string[]
}

export type ProgressionAdvice = {
  direction: 'up' | 'hold' | 'consolidate' | 'down'
  icon: string
  color: string
  message: string
  specifics: string[]
}

// ─── FORMAT HELPER ────────────────────────────────────────────────────────────

export function exerciseToString(e: Exercise): string {
  const isTime = e.unit.startsWith('sec')
  const repStr = isTime ? `${e.reps}${e.unit === 'sec each side' ? ' sec each side' : ' sec'}` : `${e.reps} ${e.unit}`
  const weightStr = e.weight ? ` × ${e.weight}` : ''
  const noteStr = e.note ? ` (${e.note})` : ''
  return `${e.name} — ${repStr}${weightStr}${noteStr}`
}

// ─── REP PROGRESSION ADJUSTMENTS ─────────────────────────────────────────────

const REP_ADJ_KEY = 'repAdjustments'

function loadAdjustments(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(REP_ADJ_KEY) ?? '{}') } catch { return {} }
}

export function getRepAdjustment(name: string): number {
  return loadAdjustments()[name] ?? 0
}

export function adjustedReps(e: Exercise): number {
  return Math.max(1, e.reps + getRepAdjustment(e.name))
}

export function applyRepProgressionAdjustment(exercises: Exercise[], direction: 'up' | 'down'): void {
  try {
    const stored = loadAdjustments()
    const delta = direction === 'up' ? 2 : -2
    for (const e of exercises) {
      stored[e.name] = Math.max(1 - e.reps, (stored[e.name] ?? 0) + delta)
    }
    localStorage.setItem(REP_ADJ_KEY, JSON.stringify(stored))
  } catch {}
}

// ─── PHASE 1 CIRCUITS ─────────────────────────────────────────────────────────

const PHASE1_CIRCUITS: CircuitVariation[] = [
  {
    label: 'A',
    focus: 'Compound strength',
    lower: [
      { name: 'Bulgarian split squat',       reps: 10, unit: 'reps each leg',       weight: '15kg',          note: '3-sec lower' },
      { name: 'Single-leg Romanian deadlift', reps: 10, unit: 'reps each leg',       weight: '15kg' },
      { name: 'Lateral lunge',               reps: 12, unit: 'reps each direction', weight: 'bodyweight' },
      { name: 'Single-leg calf raise on step', reps: 20, unit: 'reps each leg',    weight: '15kg' },
    ],
    upper: [
      { name: 'Bent-over row',    reps: 12, unit: 'reps', weight: '15kg each hand' },
      { name: 'Overhead press',   reps: 10, unit: 'reps', weight: '15kg each' },
      { name: 'Plank',            reps: 50, unit: 'sec',  note: 'aim for 45–60 sec' },
    ],
    rounds: '1–2 rounds post-run · Rest 60–90 sec between rounds',
  },
  {
    label: 'B',
    focus: 'Power + explosiveness',
    lower: [
      { name: 'Explosive step-up',        reps: 12, unit: 'reps each leg', weight: '15kg',        note: 'drive hard' },
      { name: 'Goblet squat',             reps: 15, unit: 'reps',          weight: '15kg',        note: 'explosive up, slow down' },
      { name: 'Glute bridge',             reps: 12, unit: 'reps',          weight: 'bodyweight',  note: '3-sec hold at top' },
      { name: 'Single-leg glute bridge',  reps: 10, unit: 'reps each leg', weight: 'bodyweight',  note: '2-sec hold' },
    ],
    upper: [
      { name: 'Press-ups',     reps: 10, unit: 'reps',          weight: 'bodyweight', note: 'aim for max — pause at bottom' },
      { name: 'Renegade row',  reps: 8,  unit: 'reps each side', weight: '15kg' },
      { name: 'Dead bug',      reps: 10, unit: 'reps each side', weight: 'bodyweight', note: 'slow and controlled' },
    ],
    rounds: '1–2 rounds post-run · Rest 60–90 sec between rounds',
  },
  {
    label: 'C',
    focus: 'Balance + stability',
    lower: [
      { name: 'Walking lunge',               reps: 12, unit: 'reps each leg',  weight: '15kg' },
      { name: 'Sumo squat',                  reps: 15, unit: 'reps',           weight: '15kg',       note: 'pause at bottom' },
      { name: 'Single-leg Romanian deadlift', reps: 10, unit: 'reps each leg', weight: '15kg' },
      { name: 'Single-leg calf raise',       reps: 20, unit: 'reps each leg',  weight: 'bodyweight', note: 'slow eccentric' },
    ],
    upper: [
      { name: 'Bent-over row',   reps: 12, unit: 'reps',          weight: '15kg each hand' },
      { name: 'Side plank',      reps: 40, unit: 'sec each side' },
      { name: 'Superman hold',   reps: 10, unit: 'reps',           weight: 'bodyweight', note: '3-sec hold each rep' },
    ],
    rounds: '1–2 rounds post-run · Rest 60–90 sec between rounds',
  },
]

// ─── PHASE 2 CIRCUITS ─────────────────────────────────────────────────────────

const PHASE2_CIRCUITS: CircuitVariation[] = [
  {
    label: 'A',
    focus: 'Compound strength',
    lower: [
      { name: 'Bulgarian split squat',        reps: 12, unit: 'reps each leg',  weight: '15kg',          note: '3-sec lower' },
      { name: 'Single-leg RDL',               reps: 10, unit: 'reps each leg',  weight: '15kg each hand' },
      { name: 'Explosive step-up',            reps: 12, unit: 'reps each leg',  weight: '15kg' },
      { name: 'Single-leg calf raise on step', reps: 20, unit: 'reps each leg', weight: '15kg' },
    ],
    upper: [
      { name: 'Bent-over row',  reps: 12, unit: 'reps', weight: '15kg each hand' },
      { name: 'Overhead press', reps: 10, unit: 'reps', weight: '15kg each' },
      { name: 'Plank',          reps: 60, unit: 'sec' },
    ],
    rounds: '3–4 rounds · Rest 60–90 sec between rounds',
  },
  {
    label: 'B',
    focus: 'Power + explosiveness',
    lower: [
      { name: 'Goblet squat',    reps: 15, unit: 'reps',          weight: '15kg',       note: 'explosive up' },
      { name: 'Explosive step-up', reps: 12, unit: 'reps each leg', weight: '15kg' },
      { name: 'Lateral lunge',   reps: 12, unit: 'reps each direction', weight: 'bodyweight' },
      { name: 'Sumo squat',      reps: 15, unit: 'reps',          weight: '15kg',       note: 'pause at bottom' },
    ],
    upper: [
      { name: 'Press-ups',    reps: 12, unit: 'reps',           weight: 'bodyweight', note: 'aim for max' },
      { name: 'Renegade row', reps: 8,  unit: 'reps each side', weight: '15kg' },
      { name: 'Dead bug',     reps: 10, unit: 'reps each side', weight: 'bodyweight' },
    ],
    rounds: '3–4 rounds · Rest 60–90 sec between rounds',
  },
  {
    label: 'C',
    focus: 'Balance + control',
    lower: [
      { name: 'Walking lunge',              reps: 12, unit: 'reps each leg',  weight: '15kg' },
      { name: 'Single-leg glute bridge',    reps: 10, unit: 'reps each leg',  weight: 'bodyweight', note: '3-sec hold' },
      { name: 'Single-leg RDL',             reps: 10, unit: 'reps each leg',  weight: '15kg' },
      { name: 'Single-leg calf raise on step', reps: 20, unit: 'reps each leg', weight: '15kg' },
    ],
    upper: [
      { name: 'Bent-over row',  reps: 12, unit: 'reps',          weight: '15kg each hand' },
      { name: 'Side plank',     reps: 45, unit: 'sec each side' },
      { name: 'Overhead press', reps: 10, unit: 'reps',          weight: '15kg each' },
    ],
    rounds: '3–4 rounds · Rest 60–90 sec between rounds',
  },
]

const PHASE3_CIRCUITS: CircuitVariation[] = PHASE2_CIRCUITS.map(c => ({
  ...c,
  rounds: c.rounds.replace('3–4', '3') + ' · Maintain load — do not increase',
}))

const PHASE4_CIRCUITS: CircuitVariation[] = PHASE2_CIRCUITS.map(c => ({
  ...c,
  rounds: '2 rounds, reduced load · Taper phase',
}))

function getPhaseCircuits(phaseNum: number): CircuitVariation[] {
  if (phaseNum <= 1) return PHASE1_CIRCUITS
  if (phaseNum === 2) return PHASE2_CIRCUITS
  if (phaseNum === 3) return PHASE3_CIRCUITS
  return PHASE4_CIRCUITS
}

// ─── SKIP VARIATIONS ─────────────────────────────────────────────────────────

function getSkipPool(phaseNum: number): SkipVariation[] {
  if (phaseNum <= 1) return [
    {
      label: 'A — Steady rhythm',
      structure: ['Easy steady skip: 15 mins', 'Focus: light on feet, consistent rhythm, relaxed shoulders'],
    },
    {
      label: 'B — Intervals',
      structure: ['Easy warm-up: 4 mins', '4 × 1-min faster pace, 90-sec easy recovery between', 'Easy cool-down: 3 mins'],
    },
    {
      label: 'C — Pyramid build',
      structure: ['3 min easy → 2 min moderate → 1 min fast', '→ 2 min moderate → 3 min easy', 'Repeat once — ~22 mins total'],
    },
  ]
  if (phaseNum === 2) return [
    {
      label: 'A — Steady pace',
      structure: ['Easy skip: 5 mins', 'Moderate steady pace: 10 mins', 'Easy cool-down: 5 mins — total 20 mins'],
    },
    {
      label: 'B — Intervals',
      structure: ['Easy warm-up: 4 mins', '5 × 1-min hard effort, 60-sec easy between', 'Easy cool-down: 4 mins'],
    },
    {
      label: 'C — Progressive build',
      structure: ['5 min easy → 5 min moderate → 3 min hard', '→ 3 min moderate → 4 min easy — total 20 mins'],
    },
  ]
  return [
    {
      label: 'A — Steady',
      structure: ['Easy-moderate skip: 25 mins at controlled rhythm'],
    },
    {
      label: 'B — Intervals',
      structure: ['Easy warm-up: 5 mins', '6 × 1-min hard, 60-sec easy between', 'Easy cool-down: 4 mins'],
    },
    {
      label: 'C — Mixed pace',
      structure: ['5 min easy → 4 × (2 min hard + 90 sec easy) → 5 min easy', 'Total ~25 mins'],
    },
  ]
}

// ─── SELECTION ────────────────────────────────────────────────────────────────

export function isStrengthLog(sessionType: string) { return /strength/i.test(sessionType) }
export function isSkipLog(sessionType: string) { return /skip|mobility/i.test(sessionType) }

export function getCircuitVariation(strengthSessionCount: number, phaseNum: number): CircuitVariation {
  return getPhaseCircuits(phaseNum)[strengthSessionCount % 3]
}

export function getSkipVariation(skipSessionCount: number, phaseNum: number): SkipVariation {
  return getSkipPool(phaseNum)[skipSessionCount % 3]
}

// ─── PROGRESSION ADVICE ───────────────────────────────────────────────────────

function strengthSpecifics(dir: 'up' | 'down'): string[] {
  if (dir === 'up') return [
    'Add 2 reps to every exercise, OR',
    'Add 1 extra round (e.g. 2 → 3 rounds), OR',
    'Increase to 17.5–20kg if form is solid on all reps',
  ]
  return ['Drop to 2 rounds this session', 'Reduce reps by 2 per exercise']
}

function skipSpecifics(dir: 'up' | 'down'): string[] {
  if (dir === 'up') return [
    'Add 2 mins to total session time, OR',
    'Add 1 extra interval, OR',
    'Increase hard interval from 1 min → 90 sec',
  ]
  return ['Drop all intervals — steady pace only today', 'Reduce total session by 5 mins']
}

export function getProgressionAdvice(logs: WorkoutLog[], sessionType: string): ProgressionAdvice | null {
  const isStrength = isStrengthLog(sessionType)
  const isSkip = isSkipLog(sessionType)

  const recent = logs
    .filter(l =>
      (isStrength ? isStrengthLog(l.sessionType) : isSkip ? isSkipLog(l.sessionType) : false)
      && typeof l.perceivedEffort === 'number')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  if (recent.length === 0) return null

  const avgRPE = recent.reduce((s, l) => s + (l.perceivedEffort ?? 0), 0) / recent.length
  const count = recent.length

  // Check if exercise targets were consistently hit (for strength sessions)
  const recentWithExercises = recent.filter(l => l.exerciseLogs && l.exerciseLogs.length > 0)
  const notHittingTargets = recentWithExercises.length > 0 &&
    recentWithExercises.some(l => l.exerciseLogs!.some(e => e.actualReps < e.targetReps))

  const label = `RPE avg ${avgRPE.toFixed(1)}/10 (last ${count} session${count > 1 ? 's' : ''})`

  if (notHittingTargets && avgRPE >= 6) {
    return {
      direction: 'consolidate',
      icon: '⏸',
      color: 'var(--warn)',
      message: `${label} — still building to target reps, hold this load`,
      specifics: ['Focus on hitting all target reps before increasing weight or rounds'],
    }
  }
  if (avgRPE <= 3.5) {
    return {
      direction: 'up',
      icon: '⬆',
      color: 'var(--accent)',
      message: `${label} — ready to progress`,
      specifics: isStrength ? strengthSpecifics('up') : isSkip ? skipSpecifics('up') : [],
    }
  }
  if (avgRPE <= 6) {
    return {
      direction: 'hold',
      icon: '→',
      color: 'var(--accent-2)',
      message: `${label} — ideal training zone, maintain load`,
      specifics: [],
    }
  }
  if (avgRPE <= 8) {
    return {
      direction: 'consolidate',
      icon: '⏸',
      color: 'var(--warn)',
      message: `${label} — solid effort, repeat this load before stepping up`,
      specifics: [],
    }
  }
  return {
    direction: 'down',
    icon: '⬇',
    color: '#ef4444',
    message: `${label} — too taxing, ease back`,
    specifics: isStrength ? strengthSpecifics('down') : isSkip ? skipSpecifics('down') : [],
  }
}
