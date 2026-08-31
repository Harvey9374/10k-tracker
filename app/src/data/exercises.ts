export interface ExerciseDef {
  key: string
  name: string
  position: string   // badge shown top-right
  steps: string[]    // numbered how-to
  cues: string[]     // ✓ form points
  mistake: string    // ⚠ most common error
}

export const EXERCISE_LIBRARY: ExerciseDef[] = [
  {
    key: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    position: 'Standing',
    steps: [
      'Stand 2–3 ft in front of a bench. Rest one foot on it behind you, laces down.',
      'Lower straight down until front thigh is parallel to the floor.',
      'Push through the front heel to stand back up.',
    ],
    cues: [
      'Front knee stays in line with toes — don\'t let it cave inward',
      'Torso upright, chest tall — resist the urge to hunch forward',
      '3-second lowering phase — feel the front glute and quad working',
    ],
    mistake: 'Front shin near-vertical with foot too close to bench — move front foot further forward so the knee doesn\'t travel past the toes',
  },
  {
    key: 'single-leg-rdl',
    name: 'Single-Leg Romanian Deadlift',
    position: 'Standing',
    steps: [
      'Stand on one leg, slight bend in the knee. Hold a dumbbell in the opposite hand.',
      'Hinge at the hip, pushing your bum backwards and up. The free leg rises behind you as a counterbalance.',
      'Lower the weight toward the floor, keeping your back flat the whole way.',
      'Drive the hips forward to return to standing.',
    ],
    cues: [
      'Feel the hamstring of the standing leg stretch and load — that\'s the target',
      'Back stays neutral — imagine a broomstick along your spine',
      'Free leg, torso, and head move as one unit',
    ],
    mistake: 'Rotating the hips open to the side of the free leg — keep both hips square to the floor throughout',
  },
  {
    key: 'goblet-squat',
    name: 'Goblet Squat',
    position: 'Standing',
    steps: [
      'Hold a dumbbell vertically at chest height with both hands, elbows pointing down.',
      'Feet shoulder-width apart, toes turned out slightly.',
      'Push knees out and sit down between your heels — elbows push inside the knees at the bottom.',
      'Drive through the whole foot to stand. Squeeze glutes at the top.',
    ],
    cues: [
      'Heels stay flat on the floor throughout — widen stance if they rise',
      'Chest stays tall — the weight at your chest helps with this',
      'Explosive up, slow and controlled down',
    ],
    mistake: 'Knees collapsing inward — actively push them out with your elbows at the bottom of each rep',
  },
  {
    key: 'calf-raise',
    name: 'Single-Leg Calf Raise',
    position: 'Standing',
    steps: [
      'Stand on one foot on the edge of a step. Heel hanging off the edge.',
      'Drop the heel below step level until you feel a full calf stretch.',
      'Rise up slowly through the full range of motion.',
      'Pause 1 second at the top, then lower under control over 3 seconds.',
    ],
    cues: [
      'Full range: heel below step at the bottom, high on toes at the top',
      'The lowering (eccentric) phase is where most of the benefit comes from — go slowly',
      'Hold something for balance only — don\'t lean on it',
    ],
    mistake: 'Short range of motion with momentum — if you\'re bouncing, slow down and go through full range',
  },
  {
    key: 'glute-bridge',
    name: 'Glute Bridge',
    position: 'Lying',
    steps: [
      'Lie on your back, knees bent, feet flat on the floor hip-width apart, arms by your sides.',
      'Press through your heels to lift your hips off the floor.',
      'Squeeze your glutes hard at the top. Hold 2 seconds.',
      'Lower slowly — don\'t let hips drop to the floor between reps.',
    ],
    cues: [
      'Drive through heels, not toes — you should be able to wiggle your toes at the top',
      'Hips, knees, and shoulders in a straight line at the top',
      'Squeeze the bum — not the lower back',
    ],
    mistake: 'Hyperextending the lower back to get the hips higher — the movement should end when glutes are fully squeezed, not when your back arches',
  },
  {
    key: 'dead-bug',
    name: 'Dead Bug',
    position: 'Lying',
    steps: [
      'Lie on your back. Arms point straight up to the ceiling. Knees bent at 90° in the air (tabletop).',
      'Press your lower back flat into the floor and hold it there throughout.',
      'Slowly lower your right arm and left leg toward the floor together (3–4 seconds).',
      'Return to start without letting the lower back lift. Repeat on the other side.',
    ],
    cues: [
      'Lower back must stay pressed to the floor — this is the whole point of the exercise',
      'Breathe out as you lower the arm and leg',
      'Move slowly and with control — speed ruins the exercise',
    ],
    mistake: 'Lower back arching off the floor — reduce how far you lower the arm/leg until your core is strong enough to keep it flat',
  },
  {
    key: 'press-up',
    name: 'Press-Up',
    position: 'Face down',
    steps: [
      'Hands slightly wider than shoulders, fingers forward. Up on toes, body in a straight line.',
      'Lower your chest toward the floor. Elbows travel at 45° to the body — not flared wide.',
      'Chest just above the floor at the bottom.',
      'Press back up until arms are almost fully extended.',
    ],
    cues: [
      'Body stays rigid throughout — squeeze glutes and brace core like a plank',
      'Elbows at 45°, not pointing straight out to the sides',
      'Full range each rep — chest near the floor, arms near-straight at top',
    ],
    mistake: 'Hips sagging toward the floor — if this happens, drop to knees and keep perfect form rather than grinding out bad reps',
  },
  {
    key: 'bent-over-row',
    name: 'Bent-Over Row',
    position: 'Hinged',
    steps: [
      'Hold dumbbells, feet hip-width. Hinge forward at the hip until torso is roughly 45° to the floor.',
      'Let the arms hang straight down — this is the start position.',
      'Pull the elbows back and up, squeezing the shoulder blades together at the top.',
      'Hold 1 second, then lower all the way back to a full arm hang.',
    ],
    cues: [
      'Back stays flat — no rounding the upper back to "help" the weight up',
      'Squeeze shoulder blades together at the top of every rep',
      'Full stretch at the bottom — arms hang straight, feel the lats stretch',
    ],
    mistake: 'Jerking the weight up with momentum and a rounding back — if this is happening, the weight is too heavy',
  },
  {
    key: 'overhead-press',
    name: 'Overhead Press',
    position: 'Standing',
    steps: [
      'Hold dumbbells at shoulder height, elbows slightly in front of the body.',
      'Brace your core and squeeze your glutes before you press.',
      'Press straight up. At the top, lean slightly forward so the weights are over your base.',
      'Lower slowly back to shoulder height.',
    ],
    cues: [
      'No leg drive — this is a strict press, legs stay still',
      'Core stays braced throughout — don\'t let the ribs flare up',
      'Think about pressing your head through your arms at the top',
    ],
    mistake: 'Arching the lower back to get the weight overhead — squeeze glutes hard and tuck the ribs slightly before each rep',
  },
  {
    key: 'step-up',
    name: 'Explosive Step-Up',
    position: 'Standing',
    steps: [
      'Stand facing a box or step. Place one foot fully on top.',
      'Drive through the heel of the foot on the box to push yourself up.',
      'Stand tall at the top — hips fully extended, glute squeezed.',
      'Step down with the free leg under control. Repeat all reps on one leg then switch.',
    ],
    cues: [
      'All the power comes from the box leg — don\'t push off the back foot',
      'Full extension at the top — don\'t cut it short',
      'Controlled step down — don\'t drop or jump down',
    ],
    mistake: 'Using the back foot to push off the floor — cover the back foot with a towel to feel if you\'re cheating',
  },
  {
    key: 'plank',
    name: 'Plank',
    position: 'Face down',
    steps: [
      'Forearms on the floor, elbows directly under shoulders. Up on toes.',
      'Body in a straight line from head to heels — no sagging, no piking.',
      'Squeeze everything: glutes, quads, core all actively engaged.',
      'Breathe steadily. Hold for the prescribed time.',
    ],
    cues: [
      'Imagine someone pressing down on your hips — actively resist it',
      'Neck in line with spine — look at the floor, not forward',
      'If form breaks, stop and rest rather than holding a bad plank',
    ],
    mistake: 'Hips either sagging down or piking up — film yourself from the side once to check your position',
  },
  {
    key: 'lateral-lunge',
    name: 'Lateral Lunge',
    position: 'Standing',
    steps: [
      'Stand with feet together, toes pointing forward.',
      'Take a wide step directly to one side. Toes stay pointing forward on both feet.',
      'Sit into the hip of the bent leg — knee tracks over toes, pushed outward.',
      'Push through the heel of the bent leg to return to standing.',
    ],
    cues: [
      'Keep the straight leg fully straight — feel it stretching the inner thigh',
      'Chest stays tall — don\'t collapse forward',
      'Toes point forward on both feet throughout',
    ],
    mistake: 'Toes turning outward on the lunge leg — this reduces the lateral hip benefit; keep them pointing straight ahead',
  },
]

export function findExercise(line: string): ExerciseDef | null {
  const lower = line.toLowerCase()
  return EXERCISE_LIBRARY.find(ex => {
    if (lower.includes(ex.key.replace(/-/g, ' '))) return true
    const words = ex.name.toLowerCase().split(' ').filter(w => w.length > 4)
    return words.filter(w => lower.includes(w)).length >= 2
  }) ?? null
}
