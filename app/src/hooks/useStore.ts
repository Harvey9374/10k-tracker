import { useState, useCallback } from 'react'
import type { WorkoutLog, TimeTrial } from '../types'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useWorkoutLogs() {
  const [logs, setLogs] = useState<WorkoutLog[]>(() => load('workoutLogs', []))

  const addLog = useCallback((log: Omit<WorkoutLog, 'id'>) => {
    setLogs(prev => {
      const next = [{ ...log, id: crypto.randomUUID() }, ...prev]
      save('workoutLogs', next)
      return next
    })
  }, [])

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => {
      const next = prev.filter(l => l.id !== id)
      save('workoutLogs', next)
      return next
    })
  }, [])

  return { logs, addLog, deleteLog }
}

export function useTimeTrials() {
  const [trials, setTrials] = useState<TimeTrial[]>(() => load('timeTrials', []))

  const addTrial = useCallback((trial: Omit<TimeTrial, 'id'>) => {
    setTrials(prev => {
      const next = [{ ...trial, id: crypto.randomUUID() }, ...prev]
      save('timeTrials', next)
      return next
    })
  }, [])

  const deleteTrial = useCallback((id: string) => {
    setTrials(prev => {
      const next = prev.filter(t => t.id !== id)
      save('timeTrials', next)
      return next
    })
  }, [])

  return { trials, addTrial, deleteTrial }
}
