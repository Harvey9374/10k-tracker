const BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises'

// Images from the open-licensed free-exercise-db (CC0).
// Each URL is a real photo verified against the exercise database.
// Exercises not listed here fall back to the inline SVG diagram.
export const EXERCISE_IMAGES: Record<string, string> = {
  'bulgarian-split-squat': `${BASE}/Split_Squat_with_Dumbbells/0.jpg`,
  'goblet-squat':          `${BASE}/Goblet_Squat/0.jpg`,
  'glute-bridge':          '/images/exercises/glute-bridge.jpg',
  'dead-bug':              `${BASE}/Dead_Bug/0.jpg`,
  'press-up':              `${BASE}/Pushups/0.jpg`,
  'bent-over-row':         `${BASE}/Bent_Over_Two-Dumbbell_Row/0.jpg`,
  'overhead-press':        `${BASE}/Dumbbell_Shoulder_Press/0.jpg`,
  'step-up':               `${BASE}/Dumbbell_Step_Ups/0.jpg`,
  'walking-lunge':         `${BASE}/Bodyweight_Walking_Lunge/0.jpg`,
  'reverse-lunge':         `${BASE}/Dumbbell_Rear_Lunge/0.jpg`,
  'hip-thrust':            `${BASE}/Barbell_Hip_Thrust/0.jpg`,
  'dumbbell-floor-press':  `${BASE}/Dumbbell_Floor_Press/0.jpg`,
  'arnold-press':          `${BASE}/Arnold_Dumbbell_Press/0.jpg`,
  'renegade-row':          '/images/exercises/renegade-row.jpg',
  'superman-hold':         '/images/exercises/superman-hold.jpg',
  'plank':                 `${BASE}/Plank/0.jpg`,
  'calf-raise':            `${BASE}/Standing_Dumbbell_Calf_Raise/0.jpg`,
  // User-provided photos for exercises not in the open database
  'single-leg-rdl':        '/images/exercises/single-leg-rdl.jpg',
  'lateral-lunge':         '/images/exercises/lateral-lunge.jpg',
  'curtsy-lunge':          '/images/exercises/curtsy-lunge.jpg',
  'bird-dog':              '/images/exercises/bird-dog.jpg',
  'side-plank':            '/images/exercises/side-plank.jpg',
  'copenhagen-plank':      '/images/exercises/copenhagen-plank.jpg',
}
