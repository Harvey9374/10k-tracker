import { useState } from 'react'
import type { StudyPack } from '../types'
import { useProgress } from '../lib/progress'
import { pct, shuffle } from '../lib/util'
import { QuestionCard, withShuffledOptions, type Shuffled } from './Question'

const SIZES = [10, 20, 0] // 0 = all

export function Quiz({ pack, preset }: { pack: StudyPack; preset: string | null }) {
  const { recordAnswer } = useProgress()
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(preset && pack.exam_domains.some((d) => d.id === preset) ? [preset] : []),
  )
  const [size, setSize] = useState(10)
  const [items, setItems] = useState<Shuffled[] | null>(null)
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<number | undefined>()
  const [score, setScore] = useState(0)

  const pool = pack.questions.filter((q) => selected.size === 0 || selected.has(q.domain))

  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function start() {
    const qs = shuffle(pool).slice(0, size || pool.length)
    setItems(qs.map((q) => withShuffledOptions(q, shuffle)))
    setIndex(0)
    setChosen(undefined)
    setScore(0)
  }

  function choose(orig: number) {
    if (!items || chosen !== undefined) return
    const q = items[index]
    setChosen(orig)
    const ok = orig === q.answer
    if (ok) setScore((s) => s + 1)
    recordAnswer(q.domain, ok)
  }

  if (items && index < items.length) {
    const q = items[index]
    const domain = pack.exam_domains.find((d) => d.id === q.domain)
    return (
      <>
        <header className="row-between page-head">
          <button className="btn ghost small" onClick={() => setItems(null)}>End</button>
          <span className="muted">Question {index + 1} of {items.length} · score {score}</span>
        </header>
        <div className="progress-bar"><div style={{ width: `${(index / items.length) * 100}%` }} /></div>
        <QuestionCard
          q={q}
          chosen={chosen}
          reveal={chosen !== undefined}
          onChoose={choose}
          label={`${q.domain} ${domain?.name ?? ''}`}
        />
        {chosen !== undefined && (
          <div className="actions sticky">
            <button
              className="btn primary"
              onClick={() => {
                setIndex(index + 1)
                setChosen(undefined)
              }}
            >
              {index + 1 < items.length ? 'Next question' : 'See result'}
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="page-head">
        <h1>Practice quiz</h1>
        <p className="muted small">Questions and options are shuffled. You see the explanation after each answer.</p>
      </header>

      {items && (
        <section className="panel">
          <h2>Quiz complete</h2>
          <p className="big-score">{score} / {items.length} ({pct(score, items.length)}%)</p>
        </section>
      )}

      <section className="panel">
        <h2>Domains</h2>
        <p className="muted small">Pick none to include all domains.</p>
        <div className="chip-col">
          {pack.exam_domains.map((d) => {
            const n = pack.questions.filter((q) => q.domain === d.id).length
            return (
              <button key={d.id} className={selected.has(d.id) ? 'chip wide active' : 'chip wide'} onClick={() => toggle(d.id)}>
                <strong>{d.id}</strong> {d.name} <span className="muted">({n})</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <h2>Number of questions</h2>
        <div className="chips">
          {SIZES.map((n) => (
            <button key={n} className={size === n ? 'chip active' : 'chip'} onClick={() => setSize(n)}>
              {n ? n : `All (${pool.length})`}
            </button>
          ))}
        </div>
      </section>

      <div className="actions">
        <button className="btn primary" disabled={!pool.length} onClick={start}>
          Start quiz ({Math.min(size || pool.length, pool.length)} questions)
        </button>
      </div>
    </>
  )
}
