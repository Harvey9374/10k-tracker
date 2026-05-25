import { useState, useCallback } from 'react'
import type { WorkoutLog, TimeTrial, CalibratedZones } from '../types'

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

export function useCalibratedZones() {
  const [zones, setZones] = useState<CalibratedZones | null>(() => load('calibratedZones', null))
  const saveZones = useCallback((z: CalibratedZones) => {
    setZones(z)
    save('calibratedZones', z)
  }, [])
  const clearZones = useCallback(() => {
    setZones(null)
    localStorage.removeItem('calibratedZones')
  }, [])
  return { zones, saveZones, clearZones }
}

export function useSessionCompletions() {
  const [completions, setCompletions] = useState<string[]>(() => load('sessionCompletions', []))

  const toggleCompletion = useCallback((date: string) => {
    setCompletions(prev => {
      const next = prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
      save('sessionCompletions', next)
      return next
    })
  }, [])

  return { completions, toggleCompletion }
}
