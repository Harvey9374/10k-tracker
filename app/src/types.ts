export interface WorkoutLog {
  id: string
  date: string
  sessionType: string
  distanceKm?: number
  durationMins?: number
  perceivedEffort?: number
  notes?: string
  completed: boolean
}

export interface TimeTrial {
  id: string
  date: string
  distanceKm: number
  timeSeconds: number
  notes?: string
}

export interface PhaseSession {
  title: string
  items: string[]
}

export interface DayTemplate {
  day: string
  type: 'run' | 'strength' | 'conditioning' | 'recovery' | 'rest'
  label: string
  session: PhaseSession
}

export interface Phase {
  number: number
  name: string
  weeks: string
  weekRange: [number, number]
  dateRange: string
  weeklyTarget: string
  focus: string
  paceGuide: { label: string; pace: string }[]
  monday: PhaseSession
  tuesday: PhaseSession
  wednesday: PhaseSession
  thursday: PhaseSession
  friday: PhaseSession
  weekend: PhaseSession
  strengthCircuit?: string[]
  notes?: string[]
}

export type ViewName = 'today' | 'log' | 'progress' | 'plan'
