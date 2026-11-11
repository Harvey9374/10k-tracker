import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { today } from './util'

export const INTERVALS = [1, 2, 4, 7, 14] // days for Leitner boxes 1 to 5

export interface CardState {
  box: number
  due: string
}

export interface MockResult {
  date: string
  size: number
  correct: number
  raw: number
  weighted: number
  passed: boolean
  byDomain: Record<string, { c: number; t: number }>
}

export interface Progress {
  cards: Record<string, CardState>
  domains: Record<string, { c: number; t: number }>
  mocks: MockResult[]
  days: string[]
  checklist: Record<string, boolean>
}

const KEY = 'iso27001-li-progress-v1'
const empty: Progress = { cards: {}, domains: {}, mocks: [], days: [], checklist: {} }

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

interface Ctx {
  progress: Progress
  reviewCard: (id: string, correct: boolean) => void
  recordAnswer: (domain: string, correct: boolean) => void
  recordMock: (r: MockResult) => void
  toggleCheck: (key: string) => void
  reset: () => void
}

const ProgressContext = createContext<Ctx | null>(null)

function markDay(days: string[]): string[] {
  const d = today()
  return days.includes(d) ? days : [...days, d].slice(-400)
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  const reviewCard = useCallback((id: string, correct: boolean) => {
    setProgress((p) => {
      const box = correct ? Math.min((p.cards[id]?.box ?? 0) + 1, INTERVALS.length) : 1
      const due = today(correct ? INTERVALS[box - 1] : 1)
      return { ...p, cards: { ...p.cards, [id]: { box, due } }, days: markDay(p.days) }
    })
  }, [])

  const recordAnswer = useCallback((domain: string, correct: boolean) => {
    setProgress((p) => {
      const cur = p.domains[domain] ?? { c: 0, t: 0 }
      return {
        ...p,
        domains: { ...p.domains, [domain]: { c: cur.c + (correct ? 1 : 0), t: cur.t + 1 } },
        days: markDay(p.days),
      }
    })
  }, [])

  const recordMock = useCallback((r: MockResult) => {
    setProgress((p) => {
      const domains = { ...p.domains }
      for (const [id, v] of Object.entries(r.byDomain)) {
        const cur = domains[id] ?? { c: 0, t: 0 }
        domains[id] = { c: cur.c + v.c, t: cur.t + v.t }
      }
      return { ...p, domains, mocks: [...p.mocks, r].slice(-50), days: markDay(p.days) }
    })
  }, [])

  const toggleCheck = useCallback((key: string) => {
    setProgress((p) => ({ ...p, checklist: { ...p.checklist, [key]: !p.checklist[key] } }))
  }, [])

  const reset = useCallback(() => setProgress(empty), [])

  return (
    <ProgressContext.Provider value={{ progress, reviewCard, recordAnswer, recordMock, toggleCheck, reset }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress outside provider')
  return ctx
}

export function isDue(state: CardState | undefined): boolean {
  return !state || state.due <= today()
}

/** Consecutive study days ending today, or yesterday if you have not studied yet today. */
export function streak(days: string[]): number {
  const set = new Set(days)
  let offset = set.has(today()) ? 0 : -1
  let n = 0
  while (set.has(today(offset))) {
    n++
    offset--
  }
  return n
}
