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
  {
    key: 'walking-lunge',
    name: 'Walking Lunge',
    position: 'Standing',
    steps: [
      'Stand tall with dumbbells at your sides.',
      'Step forward with one leg and lower the back knee toward the floor.',
      'Push off the back foot and bring it forward to step into the next lunge.',
      'Continue walking forward for the prescribed reps on each leg.',
    ],
    cues: [
      'Front knee stays above the ankle — not caving in',
      'Torso upright throughout — resist the urge to lean forward',
      'Smooth, controlled movement — not a hop or a rush',
    ],
    mistake: 'Taking too short a step so the front knee shoots past the toes — lengthen your stride so the front shin stays near-vertical',
  },
  {
    key: 'reverse-lunge',
    name: 'Reverse Lunge',
    position: 'Standing',
    steps: [
      'Stand tall with dumbbells at your sides, feet hip-width.',
      'Step one foot back and lower that knee toward the floor.',
      'Front shin stays vertical — knee stays above the ankle.',
      'Push through the front heel to return to standing.',
    ],
    cues: [
      'Power comes from the front leg — the back leg just guides the movement',
      'Keep torso upright — don\'t lean forward over the front knee',
      'Controlled descent — 2–3 seconds down',
    ],
    mistake: 'Letting the front knee drift forward past the toes — step back further so the front shin stays vertical',
  },
  {
    key: 'curtsy-lunge',
    name: 'Curtsy Lunge',
    position: 'Standing',
    steps: [
      'Stand tall, feet hip-width. Hold a dumbbell at chest height or by your sides.',
      'Step one foot diagonally behind and across your body, as if curtsying.',
      'Lower the back knee toward the floor, keeping hips facing forward.',
      'Push through the front foot to return to standing.',
    ],
    cues: [
      'Hips stay square and facing forward throughout — don\'t twist',
      'Front knee tracks over the toes — don\'t let it cave inward',
      'Feel the side of the front glute loading — that\'s the target muscle',
    ],
    mistake: 'Rotating the hips toward the stepping leg — keep them square to the front throughout the whole movement',
  },
  {
    key: 'hip-thrust',
    name: 'Hip Thrust',
    position: 'Lying/elevated',
    steps: [
      'Sit with your upper back against a sofa or bench, knees bent, feet flat on the floor hip-width apart.',
      'Drive through both heels to push your hips up off the floor.',
      'Squeeze your glutes hard at the top — hold 2–3 seconds.',
      'Lower under control — hips don\'t need to touch the floor between reps.',
    ],
    cues: [
      'Full extension at the top — hips, knees, and shoulders in a straight line',
      'Drive through heels, not toes — you should be able to wiggle toes at the top',
      'Squeeze the glutes, not the lower back',
    ],
    mistake: 'Overextending the lower back to get the hips higher — the movement ends when your glutes are fully squeezed, not when your back arches',
  },
  {
    key: 'dumbbell-floor-press',
    name: 'Dumbbell Floor Press',
    position: 'Lying',
    steps: [
      'Lie on your back with knees bent. Hold dumbbells at chest height, elbows at 45° to the body.',
      'Press the dumbbells straight up until arms are fully extended.',
      'Lower slowly until elbows lightly touch the floor.',
      'Pause briefly at the bottom — no bounce — then press again.',
    ],
    cues: [
      'Elbows at 45° — not flared straight out to the sides',
      'Keep the back flat on the floor throughout',
      'Controlled lowering — take 2–3 seconds on the way down',
    ],
    mistake: 'Bouncing the elbows off the floor to get momentum — pause at the bottom and press from a dead stop each rep',
  },
  {
    key: 'arnold-press',
    name: 'Arnold Press',
    position: 'Standing',
    steps: [
      'Hold dumbbells at shoulder height with palms facing toward you, elbows close together in front of your face.',
      'As you press upward, rotate your palms outward so they face forward at the top.',
      'At full extension, arms are straight overhead with palms facing forward.',
      'Reverse the rotation as you lower back to the start position.',
    ],
    cues: [
      'Brace your core throughout — don\'t let the ribs flare',
      'The rotation should be smooth and continuous — not two separate movements',
      'Control the lowering phase fully — 2 seconds down',
    ],
    mistake: 'Rushing the rotation and losing shoulder position — keep it slow and deliberate through the full range of motion',
  },
  {
    key: 'bird-dog',
    name: 'Bird Dog',
    position: 'On all fours',
    steps: [
      'Start on hands and knees — wrists under shoulders, knees under hips. Back flat.',
      'Slowly extend your right arm forward and left leg back simultaneously.',
      'Hold for 2–3 seconds — both limbs parallel to the floor.',
      'Return to start without letting the back round. Repeat on the other side.',
    ],
    cues: [
      'Back stays absolutely flat throughout — imagine a glass of water on your lower back',
      'Don\'t let the hip of the raised leg rotate up toward the ceiling',
      'Move slowly — this is a stability exercise, not a speed exercise',
    ],
    mistake: 'Arching the lower back or rotating the hip to get the leg higher — only go as high as you can with a perfectly flat back',
  },
  {
    key: 'renegade-row',
    name: 'Renegade Row',
    position: 'Press-up position',
    steps: [
      'Start in a high press-up position with a dumbbell in each hand, feet wide apart.',
      'Keeping hips square and level, pull one dumbbell up to hip height by driving the elbow back.',
      'Hold 1 second at the top, then lower under full control.',
      'Repeat on the other side. That\'s one rep.',
    ],
    cues: [
      'Wide feet give a much better base — use them, don\'t go narrow',
      'Hips must stay level — don\'t let them rotate toward the rowing side',
      'The pulling arm does all the work — the rest of the body stays rigid',
    ],
    mistake: 'Rotating the hips to help the weight up — if this is happening, the dumbbells are too heavy; drop the weight',
  },
  {
    key: 'side-plank',
    name: 'Side Plank',
    position: 'Side-lying',
    steps: [
      'Lie on your side with your forearm on the floor, elbow directly under your shoulder.',
      'Stack your feet on top of each other or stagger them slightly.',
      'Lift your hips off the floor so your body forms a straight line from head to feet.',
      'Hold for the prescribed time, then lower under control and switch sides.',
    ],
    cues: [
      'Don\'t let the hips sag toward the floor — actively push them up throughout',
      'Top arm stays on your hip or extended straight up — don\'t let it drop forward',
      'Neck in line with spine — look straight ahead, not down at the floor',
    ],
    mistake: 'Hips sagging down during the hold — if you can\'t maintain position, drop to your knees and keep the torso rigid from knee to shoulder',
  },
  {
    key: 'copenhagen-plank',
    name: 'Copenhagen Plank',
    position: 'Side-lying',
    steps: [
      'Lie on your side. Place the top foot on a bench or step, laces up.',
      'Push through the top foot and your side forearm to lift your hips off the floor.',
      'Bottom leg is free-hanging — do not rest it on the floor.',
      'Hold for the prescribed time. Lower under control and switch sides.',
    ],
    cues: [
      'Don\'t let the hips sag or pike — body in a straight line',
      'Feel the inner thigh of the top leg working — that\'s the target',
      'Breathe steadily and don\'t hold your breath',
    ],
    mistake: 'Letting the free-hanging leg touch the floor for support — it must stay free throughout; if too hard, bend the bottom knee rather than rest it',
  },
  {
    key: 'superman-hold',
    name: 'Superman Hold',
    position: 'Face down',
    steps: [
      'Lie face down with arms extended overhead and legs straight — full length.',
      'Simultaneously lift your arms, chest, and legs off the floor.',
      'Hold the raised position for 2–3 seconds — squeeze glutes and back muscles hard.',
      'Lower slowly back to the floor. That\'s one rep.',
    ],
    cues: [
      'Squeeze the glutes as you lift — this protects the lower back',
      'Look at the floor, not forward — keep the neck in line with the spine',
      'Quality over height — lift only as high as you can control with good form',
    ],
    mistake: 'Jerking up quickly and immediately lowering — the hold is the whole point; perform it slowly and deliberately with a full squeeze at the top',
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
]

export function findExercise(line: string): ExerciseDef | null {
  const lower = line.toLowerCase().replace(/-/g, ' ')
  return EXERCISE_LIBRARY.find(ex => {
    const keyNorm = ex.key.replace(/-/g, ' ')
    if (lower.includes(keyNorm)) return true
    const nameNorm = ex.name.toLowerCase().replace(/-/g, ' ')
    if (lower.includes(nameNorm)) return true
    const words = ex.name.toLowerCase().replace(/-/g, ' ').split(' ').filter(w => w.length > 4)
    return words.filter(w => lower.includes(w)).length >= 2
  }) ?? null
}
