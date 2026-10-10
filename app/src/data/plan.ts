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
        'Warm-up: 5 min walk + 5 min dynamic movement — no pace target yet',
        'First 5 mins running: even slower than easy zone — just shuffle, let the body wake up',
        'Main run at easy zone 6:30–7:00/km — hold a full conversation the whole time',
        '  Weeks 1–6: 40–50 mins total · Weeks 7–12: 50–60 mins total',
        'Final 5 mins: slow to a walk — heart rate should drop back quickly',
        'Strength circuit — 1–2 rounds post-run: 15–20 mins',
        'Cool-down: 5 min calf + hamstring stretch',
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
        'First 5 mins: walk then very easy jog — even slower than easy zone, no rush',
        'Mins 5–15: settle into easy zone 6:30–7:00/km — conversational, full sentences',
        'Mins 15–35: maintain easy zone 6:30–7:00/km — stay here, don\'t drift faster',
        'Final 5 mins: slow back to walk pace',
        'This is a low-key session — do not turn it into a test run',
      ],
    },
    weekend: {
      title: 'Bonus Long Run (alternate weeks)',
      items: [
        'First 5 mins: walk + gentle easy jog — no pace target, just get moving',
        'Main body at easy zone 6:30–7:00/km — time on feet is the goal, not pace',
        'If you feel strong at 35 mins, resist the urge to accelerate — fitness builds from restraint',
        'Final 5 mins: walk, let heart rate settle before stopping',
        '40–50 mins total',
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
        'Warm-up: 10 mins easy jog at easy zone 5:50–6:20/km — slow start, settle the breathing',
        'Build 3–5 mins: lift pace steadily from easy toward tempo — no abrupt jump into hard effort',
        'Tempo block: 20–30 mins at 5:05–5:20/km — comfortably hard, short sentences only',
        '  First 2 weeks: aim for slower end (5:20/km). Build toward 5:05/km across Phase 2.',
        '  If you can\'t hold the pace, back off 10s/km and sustain that for the full block',
        'Cool-down: 10 mins easy jog at easy zone 5:50–6:20/km — this is part of the session, don\'t skip it',
        'Optional: strength accessory work 1–2 rounds post-run (15 mins)',
        '⚡ From Week 18: replace with intervals twice/month',
        '   6 × 800m at 4:45–5:00/km, 90-sec easy jog recovery between each rep',
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
      title: 'Skip Intervals + Calf & Glute (home)',
      items: [
        'Skip intervals: 20 mins (3 × 3-min moderate, 2 × 1-min hard)',
        'Calf & glute circuit — 3 rounds, 45 sec rest between:',
        '  • Single-leg calf raise on step: 20 each leg (bodyweight; hold 15kg once easy)',
        '  • Glute bridge: 15 reps, 2-sec hold at top (bodyweight)',
        '  • Single-leg glute bridge: 12 each leg, 2-sec hold (bodyweight)',
        '  • Hip thrust (back against sofa): 15 reps, 3-sec squeeze at top (bodyweight)',
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
        'First 5 mins: walk then easy jog — start slower than feels necessary',
        'Mins 1–15: easy zone 5:50–6:20/km — fully conversational, controlled effort',
        'Mins 15–30: stay in easy zone 5:50–6:20/km — let pace drift toward the faster end naturally',
        'Mins 30–40: build to steady effort — approaching tempo zone 5:05–5:20/km, short sentences only',
        'Final 5 mins: slow back to easy or walk — full cool-down',
        'The last 10 mins should feel like a genuine push — if it doesn\'t, you\'re not building the zone',
      ],
    },
    weekend: {
      title: 'Long Run (alternate weeks)',
      items: [
        'First 5 mins: walk + very easy jog — no pace target',
        'Main body at easy zone 5:50–6:20/km — time on feet, never push',
        'If you feel good after 45 mins, keep the pace the same — the fitness is the run, not the speed',
        'Final 5 mins: slow to walk',
        '55–70 mins total',
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
        'Warm-up: 10 mins easy jog at easy zone 5:30–6:00/km',
        'Build 5 mins: lift pace toward interval effort — body knows what\'s coming',
        'Work reps — rotate weekly (pick one):',
        '  • 8 × 1km interval at 4:25–4:35/km — hit the target from 200m in, not a build-in',
        '  • 5 × 1.5km interval effort at 4:35–4:40/km — steady power, rep to rep consistency',
        '  • 12 × 400m at 4:15–4:25/km — short and sharp, controlled sprint',
        'Recovery between reps: 90-sec easy jog — keep moving, don\'t stop dead',
        'Cool-down: 10 mins easy jog at easy zone 5:30–6:00/km',
      ],
    },
    tuesday: {
      title: 'Strength + Easy Run (90 mins)',
      items: [
        'Strength — 3 rounds (maintain, do not increase load): 45 mins',
        'Easy run: 20–25 mins at easy zone 5:30–6:00/km — on tired legs intentionally, this builds specific conditioning',
        '  Start slow — you won\'t feel sharp. Just keep moving at easy zone pace.',
      ],
    },
    wednesday: {
      title: 'Skip Intervals + Stability (home)',
      items: [
        'Skip intervals: 25 mins including 6 × 1-min hard efforts',
        'Lower body stability circuit — 3 rounds, 45 sec rest:',
        '  • Single-leg calf raise on step: 20 each leg × 15kg',
        '  • Copenhagen plank: 25 sec each side (bodyweight)',
        '  • Single-leg glute bridge: 12 each leg, 3-sec hold (bodyweight)',
        '  • Bird dog: 12 each side, 3-sec hold (bodyweight)',
      ],
    },
    thursday: {
      title: 'Mobility (home)',
      items: [
        'Mobility and soft tissue work: 20–25 mins',
      ],
    },
    friday: {
      title: 'Steady Run (60 mins)',
      items: [
        'Warm-up: 5 mins easy jog — start slow, don\'t rush into the target pace',
        'Build 5 mins: lift pace from easy toward steady — 2–3 mins to settle in',
        'Weeks 25–28: steady block at 5:00–5:10/km for 35 mins — comfortably hard, sustainable',
        'Weeks 29–32: steady block at 4:50–5:00/km for 35 mins — this should challenge you now',
        'Weeks 33–36: steady block at 4:40–4:50/km for 40 mins — benchmark pace approaching race effort',
        'Cool-down: 5 mins walk or easy jog',
        'These runs are your fitness yardstick — controlled at 4:50/km means sub-45 is on track',
      ],
    },
    weekend: {
      title: 'Long Run (alternate weeks)',
      items: [
        'First 5 mins: walk + very easy jog — genuinely slow start',
        'Main body at easy zone 5:30–6:00/km — time on feet builds base, never push',
        'If legs feel heavy from Monday\'s intervals, keep toward the slower end of easy',
        'Final 5 mins: walk',
        '65–75 mins total',
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
        'Warm-up: 10 mins — start easy, build to top of easy zone by the last 2 mins',
        'Build-in: 2 mins at 5:00/km — prime the engine before snapping to race effort',
        'Main set — alternate each week:',
        '  • 3 × 3km at race pace 4:30–4:35/km — the exact pace you need on race day, 3-min easy jog recovery',
        '  • 2 × 4km at race pace 4:30/km — full race-specific effort, 4-min easy jog recovery',
        'Hold even splits rep to rep — a faster last rep means you went out too easy',
        'Cool-down: 10 mins easy jog — non-negotiable after race pace work',
      ],
    },
    tuesday: {
      title: 'Reduced Strength + Easy Run (90 mins)',
      items: [
        'Strength — 2 rounds, reduced load: 35 mins',
        'Easy run: 30 mins at easy zone 5:30–6:00/km — genuinely easy, this is recovery not fitness work',
        '  Keep heart rate low — if you feel flat after strength, that\'s normal and expected',
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
        'Warm-up: 5 mins easy jog',
        'Build 3 mins: lift from easy toward steady — settle before you commit to pace',
        'Steady block: 40 mins at 4:45–5:00/km — aim for the middle (4:52/km) and hold it evenly',
        '  No building at the end — even effort is the goal',
        '  If this feels controlled, your race pacing is where it needs to be',
        'Cool-down: 5 mins walk',
      ],
    },
    weekend: {
      title: 'Easy Long Run (alternate weeks)',
      items: [
        'First 5 mins: walk + easy jog — deliberately slow start',
        'Main body at easy zone 5:30–6:00/km — recovery volume, not fitness testing',
        'If you feel flat from the week\'s work, honour that — stay at the slower end of easy',
        'Final 5 mins: walk',
        '60 mins total',
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

export function getWeekNumber(today = new Date(), weekOffset = 0, pausedAt?: string | null): number {
  const effectiveDate = (pausedAt ? new Date(pausedAt) : today)
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const diff = effectiveDate.getTime() - PLAN_START.getTime()
  if (diff < 0) return 0
  return Math.min(Math.max(0, Math.floor(diff / msPerWeek) + 1 - weekOffset), TOTAL_WEEKS)
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

export function calcAdjustedTime(timeSeconds: number, tempC?: number, elevGainM?: number): number {
  let adj = timeSeconds
  if (tempC != null && tempC > 10) {
    adj = adj / (1 + (tempC - 10) * 0.003)
  }
  if (elevGainM != null && elevGainM > 0) {
    adj = adj - elevGainM * 0.6
  }
  return Math.max(adj, 0)
}

export function calcCalibratedZones(distanceKm: number, timeMins: number, rawTimeMins?: number): CalibratedZones {
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
    basedOnRawTimeMins: rawTimeMins !== timeMins ? rawTimeMins : undefined,
  }
}
