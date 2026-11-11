export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Local date as YYYY-MM-DD. */
export function today(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function pct(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100)
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(h ? 2 : 1, '0')
  return `${h ? h + ':' : ''}${mm}:${String(sec).padStart(2, '0')}`
}

/** Turns snake_case keys into readable labels. */
export function labelFor(key: string): string {
  const special: Record<string, string> = {
    cpe_requirement: 'CPE requirement',
    options_per_question: 'Options per question',
    retake_included: 'Retake included in fee',
    pass_mark_percent: 'Pass mark (%)',
    duration_minutes: 'Duration (minutes)',
    recertification_cycle_years: 'Recertification cycle (years)',
    general_experience_years: 'General experience (years)',
    specific_experience_years: 'Specific experience (years)',
  }
  if (special[key]) return special[key]
  const s = key.replace(/_/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function stripNew(summary: string): string {
  return summary.replace(/^NEW\.\s*/, '')
}
