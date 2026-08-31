export interface ExerciseDef {
  key: string
  name: string
  cues: string[]
  mistake: string
  svg: string  // inline SVG content (just the inner SVG elements, no wrapper)
}

export const EXERCISE_LIBRARY: ExerciseDef[] = [
  {
    key: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    cues: ['Back foot elevated, front foot far enough forward that knee stays over toes', 'Lower slowly (3 sec down) — feel it in the glute and quad of the front leg', 'Keep chest tall, core tight — don\'t lean forward'],
    mistake: 'Front knee diving inward — actively push it outward throughout',
    svg: `<circle cx="50" cy="12" r="8" fill="currentColor" opacity="0.8"/>
<line x1="50" y1="20" x2="50" y2="48" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="48" x2="32" y2="72" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="48" x2="62" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="32" y1="72" x2="32" y2="90" stroke="currentColor" stroke-width="2"/>
<line x1="62" y1="70" x2="70" y2="88" stroke="currentColor" stroke-width="2"/>
<rect x="65" y="85" width="20" height="4" rx="2" fill="currentColor" opacity="0.4"/>
<line x1="50" y1="32" x2="35" y2="44" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="32" x2="65" y2="44" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'single-leg-rdl',
    name: 'Single-Leg Romanian Deadlift',
    cues: ['Hinge at the hip — push your bum back, not down', 'Keep the back leg in line with your torso as you hinge forward', 'Feel the hamstring of the standing leg loading — that\'s the target muscle'],
    mistake: 'Rounding the lower back — keep a neutral spine throughout the hinge',
    svg: `<circle cx="50" cy="12" r="8" fill="currentColor" opacity="0.8"/>
<line x1="50" y1="20" x2="38" y2="52" stroke="currentColor" stroke-width="3"/>
<line x1="38" y1="52" x2="30" y2="80" stroke="currentColor" stroke-width="3"/>
<line x1="38" y1="52" x2="20" y2="60" stroke="currentColor" stroke-width="3"/>
<line x1="30" y1="80" x2="30" y2="95" stroke="currentColor" stroke-width="2"/>
<line x1="50" y1="20" x2="72" y2="28" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="28" x2="36" y2="34" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="28" x2="64" y2="22" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'goblet-squat',
    name: 'Goblet Squat',
    cues: ['Hold weight at chest height, elbows down', 'Sit between your heels — push knees out with elbows at the bottom', 'Drive through the whole foot to stand — squeeze glutes at the top'],
    mistake: 'Heels rising off the ground — widen stance or raise heels slightly until ankle mobility improves',
    svg: `<circle cx="50" cy="10" r="8" fill="currentColor" opacity="0.8"/>
<rect x="40" y="22" width="20" height="10" rx="3" fill="currentColor" opacity="0.4"/>
<line x1="50" y1="32" x2="50" y2="52" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="52" x2="30" y2="75" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="52" x2="70" y2="75" stroke="currentColor" stroke-width="3"/>
<line x1="30" y1="75" x2="25" y2="90" stroke="currentColor" stroke-width="2"/>
<line x1="70" y1="75" x2="75" y2="90" stroke="currentColor" stroke-width="2"/>
<line x1="50" y1="38" x2="35" y2="46" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="38" x2="65" y2="46" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'calf-raise',
    name: 'Single-Leg Calf Raise',
    cues: ['Stand on edge of step — start with heel dropped below step level', 'Rise up slowly through full range — pause at top', 'Lower under control (2–3 sec) — the eccentric phase is the work'],
    mistake: 'Using momentum to bounce up — slow and controlled throughout, especially the lowering',
    svg: `<circle cx="50" cy="10" r="8" fill="currentColor" opacity="0.8"/>
<line x1="50" y1="18" x2="50" y2="50" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="50" x2="50" y2="78" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="78" x2="42" y2="92" stroke="currentColor" stroke-width="2"/>
<line x1="50" y1="30" x2="35" y2="42" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="30" x2="65" y2="42" stroke="currentColor" stroke-width="2.5"/>
<rect x="30" y="88" width="40" height="5" rx="2" fill="currentColor" opacity="0.35"/>
<line x1="42" y1="82" x2="35" y2="70" stroke="currentColor" stroke-width="2" opacity="0.4"/>`,
  },
  {
    key: 'glute-bridge',
    name: 'Glute Bridge',
    cues: ['Feet flat, hip-width apart — drive through heels to lift', 'Squeeze glutes hard at the top — hold 2 sec', 'Hips, knees, shoulders in a straight line — don\'t hyperextend the lower back'],
    mistake: 'Pushing through the lower back instead of the glutes — focus on squeezing the bum, not arching',
    svg: `<line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" stroke-width="2" opacity="0.3"/>
<circle cx="20" cy="50" r="8" fill="currentColor" opacity="0.8"/>
<line x1="20" y1="58" x2="30" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="30" y1="70" x2="55" y2="55" stroke="currentColor" stroke-width="3"/>
<line x1="55" y1="55" x2="75" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="75" y1="70" x2="80" y2="75" stroke="currentColor" stroke-width="2"/>
<line x1="20" y1="58" x2="12" y2="68" stroke="currentColor" stroke-width="2.5"/>
<line x1="30" y1="62" x2="20" y2="50" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'dead-bug',
    name: 'Dead Bug',
    cues: ['Press lower back flat into the floor — maintain this throughout', 'Lower opposite arm and leg slowly together — 3–4 sec', 'Breathe out as you lower — don\'t hold your breath'],
    mistake: 'Lower back arching off the floor — reduce range of motion until you can keep it pressed down',
    svg: `<line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" stroke-width="2" opacity="0.3"/>
<circle cx="50" cy="30" r="8" fill="currentColor" opacity="0.8"/>
<line x1="50" y1="38" x2="50" y2="58" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="58" x2="30" y2="68" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="58" x2="70" y2="68" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="44" x2="25" y2="38" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="44" x2="75" y2="50" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'press-up',
    name: 'Press-Up',
    cues: ['Hands slightly wider than shoulders — elbows track back at 45°, not flared', 'Body in a straight line from head to heels — squeeze glutes and core', 'Full range: chest just above floor at the bottom, arms almost straight at top'],
    mistake: 'Hips sagging or piking — keep your body rigid like a plank throughout',
    svg: `<circle cx="18" cy="32" r="7" fill="currentColor" opacity="0.8"/>
<line x1="18" y1="39" x2="45" y2="48" stroke="currentColor" stroke-width="3"/>
<line x1="45" y1="48" x2="75" y2="48" stroke="currentColor" stroke-width="3"/>
<line x1="75" y1="48" x2="82" y2="55" stroke="currentColor" stroke-width="2"/>
<line x1="25" y1="42" x2="20" y2="58" stroke="currentColor" stroke-width="2.5"/>
<line x1="38" y1="46" x2="35" y2="60" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'bent-over-row',
    name: 'Bent-Over Row',
    cues: ['Hinge forward about 45° — keep back flat, core braced', 'Pull elbows back and up — squeeze shoulder blades together at the top', 'Let arms hang straight down at the bottom — full stretch each rep'],
    mistake: 'Using momentum / jerking the weight — control the movement, especially on the way down',
    svg: `<circle cx="22" cy="22" r="8" fill="currentColor" opacity="0.8"/>
<line x1="22" y1="30" x2="35" y2="55" stroke="currentColor" stroke-width="3"/>
<line x1="35" y1="55" x2="55" y2="55" stroke="currentColor" stroke-width="3"/>
<line x1="55" y1="55" x2="65" y2="65" stroke="currentColor" stroke-width="2"/>
<line x1="30" y1="40" x2="18" y2="55" stroke="currentColor" stroke-width="2.5"/>
<line x1="40" y1="45" x2="48" y2="38" stroke="currentColor" stroke-width="2.5"/>
<circle cx="18" cy="60" r="4" fill="currentColor" opacity="0.4"/>
<circle cx="48" cy="33" r="4" fill="currentColor" opacity="0.4"/>`,
  },
  {
    key: 'overhead-press',
    name: 'Overhead Press',
    cues: ['Start at shoulder height — elbows slightly in front, not flared wide', 'Press straight up — think about pressing your head through your arms at the top', 'Lower slowly to shoulders — don\'t use leg drive'],
    mistake: 'Arching the lower back as you press — squeeze glutes and brace core before each rep',
    svg: `<circle cx="50" cy="10" r="8" fill="currentColor" opacity="0.8"/>
<line x1="50" y1="18" x2="50" y2="52" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="52" x2="35" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="52" x2="65" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="28" x2="30" y2="20" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="28" x2="70" y2="20" stroke="currentColor" stroke-width="2.5"/>
<line x1="30" y1="20" x2="22" y2="8" stroke="currentColor" stroke-width="2.5"/>
<line x1="70" y1="20" x2="78" y2="8" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'step-up',
    name: 'Explosive Step-Up',
    cues: ['Drive through the heel of the foot on the box — not the toes', 'Extend fully at the top — hips through, standing tall', 'Step down under control — don\'t drop down'],
    mistake: 'Pushing off the back foot — all the work should come from the leg on the box',
    svg: `<circle cx="45" cy="10" r="8" fill="currentColor" opacity="0.8"/>
<line x1="45" y1="18" x2="45" y2="48" stroke="currentColor" stroke-width="3"/>
<line x1="45" y1="48" x2="28" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="45" y1="48" x2="55" y2="65" stroke="currentColor" stroke-width="3"/>
<line x1="55" y1="65" x2="55" y2="80" stroke="currentColor" stroke-width="2"/>
<line x1="28" y1="70" x2="22" y2="80" stroke="currentColor" stroke-width="2"/>
<rect x="45" y="76" width="35" height="6" rx="2" fill="currentColor" opacity="0.35"/>
<line x1="45" y1="30" x2="32" y2="42" stroke="currentColor" stroke-width="2.5"/>
<line x1="45" y1="30" x2="58" y2="42" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'plank',
    name: 'Plank',
    cues: ['Elbows under shoulders — body in a straight line', 'Squeeze everything: glutes, quads, core all engaged', 'Breathe steadily — don\'t hold your breath'],
    mistake: 'Hips too high or sagging — check your position in a mirror or film yourself',
    svg: `<circle cx="15" cy="38" r="7" fill="currentColor" opacity="0.8"/>
<line x1="15" y1="45" x2="75" y2="55" stroke="currentColor" stroke-width="3"/>
<line x1="75" y1="55" x2="85" y2="62" stroke="currentColor" stroke-width="2"/>
<line x1="22" y1="52" x2="18" y2="65" stroke="currentColor" stroke-width="2.5"/>
<line x1="40" y1="55" x2="36" y2="68" stroke="currentColor" stroke-width="2.5"/>`,
  },
  {
    key: 'lateral-lunge',
    name: 'Lateral Lunge',
    cues: ['Step wide to the side — sit into the hip of the bent leg', 'Keep toes forward on both feet throughout', 'Push through the heel of the bent leg to return'],
    mistake: 'Letting the knee cave inward — push it out in line with the toes',
    svg: `<circle cx="50" cy="10" r="8" fill="currentColor" opacity="0.8"/>
<line x1="50" y1="18" x2="50" y2="45" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="45" x2="20" y2="70" stroke="currentColor" stroke-width="3"/>
<line x1="50" y1="45" x2="75" y2="60" stroke="currentColor" stroke-width="3"/>
<line x1="20" y1="70" x2="15" y2="88" stroke="currentColor" stroke-width="2"/>
<line x1="75" y1="60" x2="78" y2="78" stroke="currentColor" stroke-width="2"/>
<line x1="50" y1="28" x2="36" y2="38" stroke="currentColor" stroke-width="2.5"/>
<line x1="50" y1="28" x2="64" y2="38" stroke="currentColor" stroke-width="2.5"/>`,
  },
]

export function findExercise(line: string): ExerciseDef | null {
  const lower = line.toLowerCase()
  return EXERCISE_LIBRARY.find(ex => {
    const keyParts = ex.key.split('-')
    return keyParts.some(p => lower.includes(p)) ||
      ex.name.split(' ').filter(w => w.length > 4).every(w => lower.includes(w.toLowerCase()))
  }) ?? null
}
