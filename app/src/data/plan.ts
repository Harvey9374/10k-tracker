import type { Phase, CalibratedZones } from '../types'

export const PLAN_START = new Date('2026-05-25')
export const RACE_DATE = new Date('2027-05-15')
export const TOTAL_WEEKS = 52

export const BENCHMARKS = [
  { week: 8,  label: 'First 5km time trial',  target: 'Under 25:30', distanceKm: 5,  targetSeconds: 25 * 60 + 30 },
  { week: 20, label: '5km time trial',         target: 'Under 23:00', distanceKm: 5,  targetSeconds: 23 * 60 },
  { week: 30, label: 'Solo 10km (flat)',        target: 'Under 48:00', distanceKm: 10, targetSeconds: 48 * 60 },
  { week: 40, label: 'Solo 10km (flat)',        target: 'Under 45:00', distanceKm: 10, targetSeconds: 45 * 60 },
  { week: 46, label: 'Race pace test (3km)',    target: '13:30 or under', distanceKm: 3, targetSeconds: 13 * 60 + 30 },
  { week: 52, label: 'TARGET RACE',             target: 'Sub-45:00',  distanceKm: 10, targetSeconds: 45 * 60 },
]

export const GOAL_SECONDS = 45 * 60

export const PACE_GUIDE = [
  {
    phase: 1,
    easy: '6:30–7:00/km',
    tempo: '—',
    interval: '—',
    racePace: '—',
  },
  {
    phase: 2,
    easy: '5:50–6:20/km',
    tempo: '5:05–5:20/km',
    interval: '4:45–5:00/km',
    racePace: '—',
  },
  {
    phase: 3,
    easy: '5:30–6:00/km',
    tempo: '4:55–5:10/km',
    interval: '4:25–4:40/km',
    racePace: '4:30/km',
  },
  {
    phase: 4,
    easy: '5:30–6:00/km',
    tempo: '4:45–5:00/km',
    interval: '4:10–4:25/km',
    racePace: '4:30/km',
  },
]

export const PHASES: Phase[] = [
  {
    number: 1,
    name: 'Base Building',
    weeks: 'Weeks 1–12',
    weekRange: [1, 12],
    dateRange: 'June – August 2026',
    weeklyTarget: '18–28 km/week by end of phase',
    focus: 'Rebuild consistent volume, repair deconditioning, protect shins. No hard sessions until Week 7.',
    paceGuide: [
      { label: 'Easy run', pace: '6:30–7:00/km' },
    ],
    monday: {
      title: 'Key Run + Strength (90 mins)',
      items: [
        'Warm-up: 5 min walk + 5 min dynamic movement',
        'Easy run: 40–50 mins (Weeks 1–6) / 50–60 mins (Weeks 7–12)',
        'Strength circuit — 1–2 rounds post-run: 15–20 mins',
        'Cool-down: 5 min walk + calf stretch',
      ],
    },
    tuesday: {
      title: 'Strength + Conditioning (90 mins)',
      items: [
        'Warm-up: 5 min ropeless skip at easy pace',
        'Strength session — 3 rounds full circuit: 50–60 mins',
        'Skip finisher: 10 mins varied pace',
        'Cool-down and stretch: 10 mins',
      ],
    },
    wednesday: {
      title: 'Light Conditioning (home)',
      items: [
        'Ropeless skip: 15 mins steady',
        'Calf raises: 3 × 20 bodyweight',
        'Glute bridges: 3 × 15',
        'Mobility: 10 mins hip flexors, hamstrings, calves',
      ],
    },
    thursday: {
      title: 'Recovery (home)',
      items: [
        'Foam roll or static stretch: 15–20 mins',
        'Breathing and recovery focus',
      ],
    },
    friday: {
      title: 'Easy Run (60 mins)',
      items: [
        'Warm-up: 5 mins',
        'Easy run: 30–40 mins',
        'Cool-down: 5 mins',
      ],
    },
    weekend: {
      title: 'Bonus Long Run (alternate weeks)',
      items: [
        'Easy run: 40–50 mins at genuinely easy effort',
      ],
    },
    strengthCircuit: [
      'A. LOWER BODY (injury prevention)',
      '  Single-leg Romanian deadlift: 10 reps each leg × 15kg',
      '  Bulgarian split squat: 10 reps each leg × 15kg (3-sec lower)',
      '  Single-leg calf raise: 15 reps each leg (add 15kg for progression)',
      '  Lateral lunge: 12 reps each direction (bodyweight)',
      '  Glute bridge with hold: 10 reps, 2-sec hold at top',
      '',
      'B. UPPER BODY + CORE (running posture)',
      '  Dumbbell bent-over row: 12 reps × 15kg each',
      '  Press-ups: max reps, controlled',
      '  Dumbbell overhead press: 10 reps × 15kg each',
      '  Plank: 45–60 second hold',
      '  Dead bug: 10 reps each side',
      '',
      'Tuesday (full session): 3 rounds. Monday (post-run finisher): 1–2 rounds. Rest 60–90 sec between rounds.',
    ],
    mobilityCircuit: [
      'Hip flexor stretch (kneeling lunge): 60 sec each side',
      'Standing hamstring stretch: 60 sec each side',
      'Calf stretch against wall — straight leg: 60 sec each leg',
      'Calf stretch against wall — bent knee: 45 sec each leg',
      'Ankle circles: 10 slow reps each direction',
    ],
    recoveryCircuit: [
      'FOAM ROLLING (60 sec each — roll slowly, pause on tight spots)',
      '  Calves: ankle to back of knee',
      '  Shins: knuckles or edge of roller, shin to knee',
      '  Quads: hip to knee, front of thigh',
      '  IT band: outer thigh, side-lying position',
      '',
      'STATIC STRETCHES (hold still — no bouncing)',
      '  Seated hamstring stretch: 60 sec each side',
      '  Pigeon pose (glutes/hip flexors): 90 sec each side',
      '  Standing quad stretch: 45 sec each side',
      '',
      'BREATHING (5 mins)',
      '  Lie flat, hands on belly',
      '  Box breathing: 4 sec in — 4 hold — 4 out — 4 hold',
      '  Repeat 5–8 cycles. Focus on belly rising, not chest.',
    ],
    notes: [
      'Weeks 1–4 skip: 15 mins steady',
      'Weeks 5–8 skip: 15 mins with 3 × 1-min faster intervals',
      'Weeks 9–12 skip: 20 mins with 5 × 1-min faster intervals',
    ],
  },
  {
    number: 2,
    name: 'Development',
    weeks: 'Weeks 13–24',
    weekRange: [13, 24],
    dateRange: 'September – November 2026',
    weeklyTarget: '28–38 km/week by end of phase',
    focus: 'Introduce quality sessions. Two key runs per week. Fitness begins to shift noticeably.',
    paceGuide: [
      { label: 'Easy run',   pace: '5:50–6:20/km' },
      { label: 'Tempo',      pace: '5:05–5:20/km' },
      { label: 'Intervals',  pace: '4:45–5:00/km' },
    ],
    monday: {
      title: 'Tempo Run (90 mins)',
      items: [
        'Warm-up: 10 mins easy jog',
        'Tempo run: 20–30 mins at 5:05–5:20/km',
        'Cool-down jog: 10 mins easy',
        'Optional: strength accessory work 1–2 rounds post-run (15 mins)',
        '⚡ From Week 18: replace with intervals twice/month',
        '   6 × 800m at 4:45–5:00/km, 90-sec easy jog recovery',
        '   Progress to 8 × 800m by end of Phase 2',
      ],
    },
    tuesday: {
      title: 'Strength + Skip (90 mins)',
      items: [
        'Full strength session — 3–4 rounds: 60 mins',
        'Skip finisher: 15 mins including 5 × 1-min hard efforts',
      ],
    },
    wednesday: {
      title: 'Skip Intervals (home)',
      items: [
        'Skip intervals: 20 mins (3 × 3-min moderate, 2 × 1-min hard)',
        'Single-leg calf raises and glute work: 15 mins',
      ],
    },
    thursday: {
      title: 'Mobility (home)',
      items: [
        'Mobility and stretching: 20 mins',
      ],
    },
    friday: {
      title: 'Easy to Steady Run (60 mins)',
      items: [
        'Warm-up: 5 mins',
        'Easy to steady run: 40–45 mins',
        'Cool-down: 5 mins',
      ],
    },
    weekend: {
      title: 'Long Run (alternate weeks)',
      items: [
        'Long run: 55–70 mins at easy pace',
      ],
    },
    strengthCircuit: [
      'Bulgarian split squat: 12 reps each leg × 15kg (3-sec lower)',
      'Single-leg RDL: 10 reps each leg × 15kg each hand',
      'Goblet squat: 15 reps × 15kg, explosive up',
      'Explosive step-up: 12 reps each leg, 15kg optional',
      'Single-leg calf raise on step: 20 reps each leg, 15kg held',
      'Bent-over row: 12 reps × 15kg each',
      'Press-ups: max controlled reps',
      'Plank variations: 3 × 45–60 sec',
      '',
      'Tuesday (full session): 3–4 rounds. Monday (optional, post-run): 1–2 rounds. Rest 60–90 sec between rounds.',
    ],
    mobilityCircuit: [
      'Hip flexor stretch (kneeling lunge): 60 sec each side',
      'Deep pigeon pose (glutes/hip flexors): 90 sec each side',
      'Standing hamstring stretch: 60 sec each side',
      'Lying IT band cross-body stretch: 60 sec each side',
      'Calf stretch against wall — straight leg: 60 sec each leg',
      'Calf stretch against wall — bent knee: 45 sec each leg',
      'Hip circle rotations (standing): 10 reps each direction',
    ],
    recoveryCircuit: [
      'FOAM ROLLING (60–90 sec each — spend longer on sore spots)',
      '  Calves: ankle to back of knee',
      '  Shins: knuckles or edge of roller',
      '  Quads: hip to knee',
      '  IT band: outer thigh, side-lying',
      '  Glutes: seated on roller, cross one leg over',
      '',
      'STATIC STRETCHES',
      '  Seated hamstring: 60 sec each side',
      '  Pigeon pose: 90 sec each side',
      '  Hip flexor lunge stretch: 60 sec each side',
      '',
      'BREATHING (5 mins)',
      '  Box breathing: 4 sec in — 4 hold — 4 out — 4 hold',
      '  5–8 cycles lying flat, focus on belly rising',
    ],
  },
  {
    number: 3,
    name: 'Specific Conditioning',
    weeks: 'Weeks 25–36',
    weekRange: [25, 36],
    dateRange: 'December 2026 – February 2027',
    weeklyTarget: '32–42 km/week',
    focus: 'Sessions target 10km race conditions. Build ability to sustain race pace (4:30/km) for increasing durations.',
    paceGuide: [
      { label: 'Easy run',   pace: '5:30–6:00/km' },
      { label: 'Steady',     pace: '4:55–5:10/km' },
      { label: 'Intervals',  pace: '4:25–4:40/km' },
      { label: 'Race pace',  pace: '4:30/km' },
    ],
    monday: {
      title: 'Interval Session (90 mins)',
      items: [
        'Warm-up: 10 mins easy jog',
        'Rotate weekly (pick one):',
        '  • 8 × 1km at 4:25–4:35/km, 90-sec recovery',
        '  • 5 × 1.5km at 4:35–4:40/km, 2-min recovery',
        '  • 12 × 400m at 4:15–4:25/km, 60-sec recovery',
        'Cool-down: 10 mins easy jog',
      ],
    },
    tuesday: {
      title: 'Strength + Easy Run (90 mins)',
      items: [
        'Strength — 3 rounds (maintain, do not increase load): 45 mins',
        'Easy run: 20–25 mins after strength',
      ],
    },
    wednesday: {
      title: 'Skip Intervals + Stability (home)',
      items: [
        'Skip intervals: 25 mins including 6 × 1-min hard efforts',
        'Lower body stability work: 15 mins',
      ],
    },
    thursday: {
      title: 'Mobility (home)',
      items: [
        'Mobility and soft tissue work: 20–25 mins',
        'Focus: calves, hip flexors, hamstrings',
      ],
    },
    friday: {
      title: 'Steady Run (60 mins)',
      items: [
        'Warm-up: 5 mins',
        'Weeks 25–28: 35 mins at 5:00–5:10/km',
        'Weeks 29–32: 35 mins at 4:50–5:00/km',
        'Weeks 33–36: 40 mins at 4:40–4:50/km',
        'Cool-down: 5 mins',
      ],
    },
    weekend: {
      title: 'Long Run (alternate weeks)',
      items: [
        'Long run: 65–75 mins at easy pace',
      ],
    },
    strengthCircuit: [
      'Maintain Phase 2 circuit — do not increase load.',
      '',
      'Bulgarian split squat: 12 reps each leg × 15kg (3-sec lower)',
      'Single-leg RDL: 10 reps each leg × 15kg each hand',
      'Goblet squat: 15 reps × 15kg, explosive up',
      'Explosive step-up: 12 reps each leg, 15kg optional',
      'Single-leg calf raise on step: 20 reps each leg, 15kg held',
      'Bent-over row: 12 reps × 15kg each',
      'Press-ups: max controlled reps',
      'Plank variations: 3 × 45–60 sec',
      '',
      '3 rounds. Rest 60–90 sec between rounds.',
    ],
    mobilityCircuit: [
      'SOFT TISSUE WORK',
      '  Foam roll calves and shins: 60–90 sec each',
      '  Lacrosse ball or roller on glutes: 2 mins each side',
      '',
      'MOBILITY STRETCHES',
      '  Deep pigeon pose: 90 sec each side',
      '  Hip flexor lunge with rotation: 60 sec each side',
      '  Standing hamstring stretch: 60 sec each side',
      '  Calf stretch — straight leg + bent knee: 60 sec each, each leg',
      '  Child\'s pose with side reach: 45 sec each side',
    ],
    notes: [
      'Friday steady runs are your key benchmark — comfortable at 4:50/km means sub-45 is on track.',
    ],
  },
  {
    number: 4,
    name: 'Peak & Taper',
    weeks: 'Weeks 37–52',
    weekRange: [37, 52],
    dateRange: 'March – May 2027',
    weeklyTarget: '35–45 km/week (Weeks 37–46), tapering to 10km race week',
    focus: 'Race-specific pace work. Sharp sessions, then taper to arrive sharp not flat.',
    paceGuide: [
      { label: 'Easy run',   pace: '5:30–6:00/km' },
      { label: 'Steady',     pace: '4:45–5:00/km' },
      { label: 'Intervals',  pace: '4:10–4:25/km' },
      { label: 'Race pace',  pace: '4:30/km' },
    ],
    monday: {
      title: 'Race Pace Session (90 mins)',
      items: [
        'Warm-up: 10 mins',
        'Main set (alternate):',
        '  • 3 × 3km at 4:30–4:35/km, 3-min recovery',
        '  • 2 × 4km at 4:30/km, 4-min recovery',
        'Cool-down: 10 mins',
      ],
    },
    tuesday: {
      title: 'Reduced Strength + Easy Run (90 mins)',
      items: [
        'Strength — 2 rounds, reduced load: 35 mins',
        'Easy run: 30 mins',
      ],
    },
    wednesday: {
      title: 'Easy Skip + Mobility (home)',
      items: [
        'Skip: 20 mins easy',
        'Mobility: 15 mins',
      ],
    },
    thursday: {
      title: 'Rest + Mobility (home)',
      items: [
        'Mobility and rest focus',
      ],
    },
    friday: {
      title: 'Steady Run (60 mins)',
      items: [
        'Warm-up: 5 mins',
        'Steady run: 40 mins at 4:45–5:00/km',
        'Cool-down: 5 mins',
      ],
    },
    weekend: {
      title: 'Easy Long Run (alternate weeks)',
      items: [
        'Easy long run: 60 mins',
      ],
    },
    mobilityCircuit: [
      'Gentle hip flexor stretch: 60 sec each side',
      'Standing hamstring stretch: 45 sec each side',
      'Calf stretch — straight leg: 60 sec each leg',
      'Child\'s pose: 60 sec',
      'Keep it gentle — maintenance only, not deep tissue work',
    ],
    notes: [
      'Weeks 47–48: Cut volume 30%. Keep all sessions, shorten runs 20–25%. Maintain intensity.',
      'Week 49: Cut volume 50%. Easy runs only (30 min max). One short interval: 5 × 400m at race pace.',
      'Week 50: Three easy runs of 20–25 mins. No strength.',
      'Race week: Two easy 15-min jogs Mon/Tue. Rest Thu/Fri. RACE Sat or Sun.',
      'Nothing new in race week — no new stretches, diet changes, or kit.',
    ],
  },
]

export function getWeekNumber(today = new Date()): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const diff = today.getTime() - PLAN_START.getTime()
  if (diff < 0) return 0
  return Math.min(Math.floor(diff / msPerWeek) + 1, TOTAL_WEEKS)
}

export function getPhase(week: number): Phase | null {
  if (week <= 0) return null
  return PHASES.find(p => week >= p.weekRange[0] && week <= p.weekRange[1]) ?? PHASES[PHASES.length - 1]
}

export function getDaySession(phase: Phase, weekNumber: number, date = new Date()) {
  const day = date.getDay() // 0=Sun, 1=Mon...6=Sat
  const dayMap: Record<number, { key: keyof Phase; label: string; type: string }> = {
    1: { key: 'monday',    label: 'Monday',    type: 'run' },
    2: { key: 'tuesday',   label: 'Tuesday',   type: 'strength' },
    3: { key: 'wednesday', label: 'Wednesday', type: 'conditioning' },
    4: { key: 'thursday',  label: 'thursday',  type: 'recovery' },
    5: { key: 'friday',    label: 'Friday',    type: 'run' },
    6: { key: 'weekend',   label: 'Saturday',  type: 'run' },
    0: { key: 'weekend',   label: 'Sunday',    type: 'run' },
  }
  const info = dayMap[day]
  if (!info) return null
  const session = phase[info.key] as { title: string; items: string[] }
  return { ...info, session, weekNumber, phase }
}

export function formatPace(paceSecondsPerKm: number): string {
  const mins = Math.floor(paceSecondsPerKm / 60)
  const secs = Math.round(paceSecondsPerKm % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}/km`
}

export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.round(totalSeconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function calcPaceSeconds(distanceKm: number, durationMins: number): number {
  return (durationMins * 60) / distanceKm
}

export function riegelPredict10K(distanceKm: number, timeMins: number): number {
  return timeMins * Math.pow(10 / distanceKm, 1.06)
}

export function calcCalibratedZones(distanceKm: number, timeMins: number): CalibratedZones {
  const predicted10KMins = riegelPredict10K(distanceKm, timeMins)
  const rp = (predicted10KMins * 60) / 10
  return {
    easy:     { min: Math.round(rp + 70), max: Math.round(rp + 90) },
    tempo:    { min: Math.round(rp + 15), max: Math.round(rp + 25) },
    interval: { min: Math.round(rp - 10), max: Math.round(rp - 5) },
    racePace: Math.round(rp),
    predicted10KMins,
    calibratedAt: new Date().toISOString(),
    basedOnDistanceKm: distanceKm,
    basedOnTimeMins: timeMins,
  }
}
