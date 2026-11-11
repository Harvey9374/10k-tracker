import type { Domain, Question } from '../types'
import { shuffle } from './util'

/**
 * Picks `size` questions so each domain's share follows its weight_percent.
 * Weights are normalised, so they need not add up to 100.
 * If a domain has too few questions, the shortfall goes to the others by weight.
 */
export function drawMock(questions: Question[], domains: Domain[], size: number): Question[] {
  const pools = new Map<string, Question[]>()
  for (const q of shuffle(questions)) {
    if (!pools.has(q.domain)) pools.set(q.domain, [])
    pools.get(q.domain)!.push(q)
  }
  const n = Math.min(size, questions.length)
  const weightOf = (id: string) => domains.find((d) => d.id === id)?.weight_percent ?? 0
  const ids = [...pools.keys()]
  const totalW = ids.reduce((s, id) => s + weightOf(id), 0)

  // Largest remainder rounding of the ideal counts.
  const ideal = ids.map((id) => ({ id, exact: totalW ? (n * weightOf(id)) / totalW : n / ids.length }))
  const counts = new Map(ideal.map((x) => [x.id, Math.floor(x.exact)]))
  let left = n - [...counts.values()].reduce((a, b) => a + b, 0)
  for (const x of [...ideal].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left <= 0) break
    counts.set(x.id, counts.get(x.id)! + 1)
    left--
  }

  // Cap at availability, then redistribute.
  let shortfall = 0
  for (const id of ids) {
    const avail = pools.get(id)!.length
    if (counts.get(id)! > avail) {
      shortfall += counts.get(id)! - avail
      counts.set(id, avail)
    }
  }
  while (shortfall > 0) {
    const open = ids
      .filter((id) => counts.get(id)! < pools.get(id)!.length)
      .sort((a, b) => weightOf(b) - weightOf(a))
    if (!open.length) break
    for (const id of open) {
      if (shortfall <= 0) break
      counts.set(id, counts.get(id)! + 1)
      shortfall--
    }
  }

  const picked = ids.flatMap((id) => pools.get(id)!.slice(0, counts.get(id)!))
  return shuffle(picked)
}

/** Average of domain percentages, each weighted by weight_percent. */
export function weightedScore(
  byDomain: Record<string, { c: number; t: number }>,
  domains: Domain[],
): number {
  let num = 0
  let den = 0
  for (const [id, r] of Object.entries(byDomain)) {
    if (!r.t) continue
    const w = domains.find((d) => d.id === id)?.weight_percent ?? 0
    num += w * (r.c / r.t)
    den += w
  }
  return den ? Math.round((num / den) * 100) : 0
}
