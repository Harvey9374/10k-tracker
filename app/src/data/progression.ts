// Equipment: 2 × 15kg dumbbells, skip rope, foam roller, step/box, bodyweight
import type { WorkoutLog } from '../types'

export type CircuitVariation = {
  label: string
  focus: string
  lower: string[]
  upper: string[]
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

// ─── STRENGTH CIRCUITS ────────────────────────────────────────────────────────
// 3 variations per phase: A = Compound, B = Power/Explosive, C = Stability/Balance
// Rotates A→B→C→A based on session count so it never repeats back-to-back.

const PHASE1_CIRCUITS: CircuitVariation[] = [
  {
    label: 'A',
    focus: 'Compound strength',
    lower: [
      'Bulgarian split squat — 10 reps each leg × 15kg (3-sec lower)',
      'Single-leg Romanian deadlift — 10 reps each leg × 15kg',
      'Lateral lunge — 12 reps each direction (bodyweight)',
      'Single-leg calf raise on step — 20 reps each leg × 15kg',
    ],
    upper: [
      'Bent-over row — 12 reps × 15kg each hand',
      'Overhead press — 10 reps × 15kg each',
      'Plank — 45–60 sec hold',
    ],
    rounds: '1–2 rounds post-run · Rest 60–90 sec between rounds',
  },
  {
    label: 'B',
    focus: 'Power + explosiveness',
    lower: [
      'Explosive step-up — 12 reps each leg × 15kg (drive hard)',
      'Goblet squat — 15 reps × 15kg, explosive up, slow down',
      'Glute bridge — 12 reps, 3-sec hold at top',
      'Single-leg glute bridge — 10 reps each leg, 2-sec hold',
    ],
    upper: [
      'Press-ups — max controlled reps (pause at bottom)',
      'Renegade row — 8 reps each side × 15kg',
      'Dead bug — 10 reps each side, slow',
    ],
    rounds: '1–2 rounds post-run · Rest 60–90 sec between rounds',
  },
  {
    label: 'C',
    focus: 'Balance + stability',
    lower: [
      'Walking lunge — 12 reps each leg × 15kg',
      'Sumo squat — 15 reps × 15kg, pause at bottom',
      'Single-leg Romanian deadlift — 10 reps each leg × 15kg',
      'Single-leg calf raise — 20 reps each leg (slow, bodyweight)',
    ],
    upper: [
      'Bent-over row — 12 reps × 15kg each hand',
      'Side plank — 40 sec each side',
      'Superman hold — 10 reps, 3-sec hold',
    ],
    rounds: '1–2 rounds post-run · Rest 60–90 sec between rounds',
  },
]

const PHASE2_CIRCUITS: CircuitVariation[] = [
  {
    label: 'A',
    focus: 'Compound strength',
    lower: [
      'Bulgarian split squat — 12 reps each leg × 15kg (3-sec lower)',
      'Single-leg RDL — 10 reps each leg × 15kg each hand',
      'Explosive step-up — 12 reps each leg × 15kg',
      'Single-leg calf raise on step — 20 reps each leg × 15kg',
    ],
    upper: [
      'Bent-over row — 12 reps × 15kg each hand',
      'Overhead press — 10 reps × 15kg each',
      'Plank — 60 sec hold',
    ],
    rounds: '3–4 rounds · Rest 60–90 sec between rounds',
  },
  {
    label: 'B',
    focus: 'Power + explosiveness',
    lower: [
      'Goblet squat — 15 reps × 15kg, explosive up',
      'Explosive step-up — 12 reps each leg × 15kg',
      'Lateral lunge — 12 reps each direction (bodyweight)',
      'Sumo squat — 15 reps × 15kg, pause at bottom',
    ],
    upper: [
      'Press-ups — max reps (aim to beat last session)',
      'Renegade row — 8 reps each side × 15kg',
      'Dead bug — 10 reps each side',
    ],
    rounds: '3–4 rounds · Rest 60–90 sec between rounds',
  },
  {
    label: 'C',
    focus: 'Balance + control',
    lower: [
      'Walking lunge — 12 reps each leg × 15kg',
      'Single-leg glute bridge — 10 reps each leg, 3-sec hold',
      'Single-leg RDL — 10 reps each leg × 15kg',
      'Single-leg calf raise on step — 20 reps each leg × 15kg',
    ],
    upper: [
      'Bent-over row — 12 reps × 15kg each hand',
      'Side plank — 45 sec each side',
      'Overhead press — 10 reps × 15kg each',
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
  rounds: '2 rounds, reduced load · Taper phase — maintain sharpness',
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
      structure: [
        'Easy steady skip: 15 mins',
        'Focus: light on feet, consistent rhythm, relaxed shoulders',
      ],
    },
    {
      label: 'B — Intervals',
      structure: [
        'Easy warm-up: 4 mins',
        '4 × 1-min faster pace, 90-sec easy recovery between',
        'Easy cool-down: 3 mins',
      ],
    },
    {
      label: 'C — Pyramid build',
      structure: [
        '3 min easy → 2 min moderate → 1 min fast',
        '→ 2 min moderate → 3 min easy',
        'Repeat once — ~22 mins total',
      ],
    },
  ]
  if (phaseNum === 2) return [
    {
      label: 'A — Steady pace',
      structure: [
        'Easy skip: 5 mins',
        'Moderate steady pace: 10 mins',
        'Easy cool-down: 5 mins — total 20 mins',
      ],
    },
    {
      label: 'B — Intervals',
      structure: [
        'Easy warm-up: 4 mins',
        '5 × 1-min hard effort, 60-sec easy between',
        'Easy cool-down: 4 mins — total ~19 mins',
      ],
    },
    {
      label: 'C — Progressive build',
      structure: [
        '5 min easy → 5 min moderate → 3 min hard',
        '→ 3 min moderate → 4 min easy — total 20 mins',
      ],
    },
  ]
  return [
    {
      label: 'A — Steady',
      structure: ['Easy-moderate skip: 25 mins at controlled rhythm'],
    },
    {
      label: 'B — Intervals',
      structure: [
        'Easy warm-up: 5 mins',
        '6 × 1-min hard, 60-sec easy between',
        'Easy cool-down: 4 mins',
      ],
    },
    {
      label: 'C — Mixed pace',
      structure: [
        '5 min easy → 4 × (2 min hard + 90 sec easy) → 5 min easy',
        'Total ~25 mins',
      ],
    },
  ]
}

// ─── SELECTION FUNCTIONS ──────────────────────────────────────────────────────

export function isStrengthLog(sessionType: string) {
  return /strength/i.test(sessionType)
}

export function isSkipLog(sessionType: string) {
  return /skip|mobility/i.test(sessionType)
}

export function getCircuitVariation(strengthSessionCount: number, phaseNum: number): CircuitVariation {
  const pool = getPhaseCircuits(phaseNum)
  return pool[strengthSessionCount % 3]
}

export function getSkipVariation(skipSessionCount: number, phaseNum: number): SkipVariation {
  const pool = getSkipPool(phaseNum)
  return pool[skipSessionCount % 3]
}

// ─── PROGRESSION ADVICE ───────────────────────────────────────────────────────

function strengthSpecifics(dir: 'up' | 'down'): string[] {
  if (dir === 'up') return [
    'Add 2 reps to every exercise, OR',
    'Add 1 extra round (e.g. 2 → 3 rounds), OR',
    'Increase to 17.5–20kg if form is solid on all reps',
  ]
  return [
    'Drop to 2 rounds this session',
    'Reduce reps by 2 per exercise, OR',
    'Drop weight by ~10%',
  ]
}

function skipSpecifics(dir: 'up' | 'down'): string[] {
  if (dir === 'up') return [
    'Add 2 mins to total session time, OR',
    'Add 1 extra interval, OR',
    'Increase hard interval from 1 min → 90 sec',
  ]
  return [
    'Drop all intervals — steady pace only today',
    'Reduce total session by 5 mins',
  ]
}

export function getProgressionAdvice(logs: WorkoutLog[], sessionType: string): ProgressionAdvice | null {
  const isStrength = isStrengthLog(sessionType)
  const isSkip = isSkipLog(sessionType)

  const recent = logs
    .filter(l => (isStrength ? isStrengthLog(l.sessionType) : isSkip ? isSkipLog(l.sessionType) : false)
      && typeof l.perceivedEffort === 'number')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  if (recent.length === 0) return null

  const avgRPE = recent.reduce((s, l) => s + (l.perceivedEffort ?? 0), 0) / recent.length
  const count = recent.length
  const label = `RPE avg ${avgRPE.toFixed(1)}/10 (last ${count} session${count > 1 ? 's' : ''})`

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
