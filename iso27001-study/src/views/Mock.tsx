import { useCallback, useEffect, useState } from 'react'
import type { Question, StudyPack } from '../types'
import { useProgress, type MockResult } from '../lib/progress'
import { drawMock, weightedScore } from '../lib/mock'
import { formatTime, pct, shuffle, today } from '../lib/util'
import { QuestionCard, type Shuffled } from './Question'

interface ActiveMock {
  ids: string[]
  orders: number[][]
  answers: (number | null)[]
  flags: boolean[]
  endsAt: number
  minutes: number
}

const ACTIVE_KEY = 'iso27001-li-mock-active'

export function loadActiveMock(): ActiveMock | null {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY)
    return raw ? (JSON.parse(raw) as ActiveMock) : null
  } catch {
    return null
  }
}

function saveActive(m: ActiveMock | null) {
  if (m) localStorage.setItem(ACTIVE_KEY, JSON.stringify(m))
  else localStorage.removeItem(ACTIVE_KEY)
}

interface Finished {
  result: MockResult
  items: Shuffled[]
  answers: (number | null)[]
}

export function Mock({ pack, onActiveChange }: { pack: StudyPack; onActiveChange: (a: boolean) => void }) {
  const { recordMock } = useProgress()
  const fmt = pack.meta.exam_format
  const realQ = Number(fmt.questions ?? 150)
  const realMin = Number(fmt.duration_minutes ?? 180)
  const secsPerQ = (realMin * 60) / realQ
  const passMark = Number(fmt.pass_mark_percent ?? 60)
  const total = pack.questions.length
  const sizes = [...new Set([25, 50].filter((n) => n < total).concat(total))]

  const [active, setActive] = useState<ActiveMock | null>(loadActiveMock)
  const [index, setIndex] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [showGrid, setShowGrid] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [finished, setFinished] = useState<Finished | null>(null)
  const [wrongOnly, setWrongOnly] = useState(false)

  // Drop a saved exam whose questions no longer exist in the JSON.
  const byId = new Map(pack.questions.map((q) => [q.id, q]))
  const items: Shuffled[] | null = active
    ? active.ids.map((id, i) => ({ ...(byId.get(id) as Question), order: active.orders[i] }))
    : null
  const broken = !!active && active.ids.some((id) => !byId.has(id))

  useEffect(() => {
    if (broken) {
      saveActive(null)
      setActive(null)
    }
  }, [broken])

  useEffect(() => {
    onActiveChange(!!active && !broken)
  }, [active, broken, onActiveChange])

  const update = (m: ActiveMock | null) => {
    saveActive(m)
    setActive(m)
  }

  function start(size: number) {
    const qs = drawMock(pack.questions, pack.exam_domains, size)
    const secs = Math.round(qs.length * secsPerQ)
    setIndex(0)
    setFinished(null)
    setConfirm(false)
    update({
      ids: qs.map((q) => q.id),
      orders: qs.map((q) => shuffle(q.options.map((_, i) => i))),
      answers: qs.map(() => null),
      flags: qs.map(() => false),
      endsAt: Date.now() + secs * 1000,
      minutes: secs / 60,
    })
  }

  const submit = useCallback(() => {
    if (!active || !items) return
    const byDomain: Record<string, { c: number; t: number }> = {}
    let correct = 0
    items.forEach((q, i) => {
      const ok = active.answers[i] === q.answer
      if (ok) correct++
      const d = (byDomain[q.domain] ??= { c: 0, t: 0 })
      d.t++
      if (ok) d.c++
    })
    const raw = pct(correct, items.length)
    const result: MockResult = {
      date: today(),
      size: items.length,
      correct,
      raw,
      weighted: weightedScore(byDomain, pack.exam_domains),
      passed: raw >= passMark,
      byDomain,
    }
    recordMock(result)
    setFinished({ result, items, answers: active.answers })
    update(null)
    window.scrollTo(0, 0)
  }, [active, items, pack.exam_domains, passMark, recordMock])

  const remaining = active ? Math.round((active.endsAt - now) / 1000) : 0

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [active])

  useEffect(() => {
    if (active && !broken && remaining <= 0) submit()
  }, [active, broken, remaining, submit])

  // Active exam
  if (active && items && !broken) {
    const q = items[index]
    const answered = active.answers.filter((a) => a !== null).length
    const setAnswer = (orig: number) => {
      const answers = [...active.answers]
      answers[index] = orig
      update({ ...active, answers })
    }
    const toggleFlag = () => {
      const flags = [...active.flags]
      flags[index] = !flags[index]
      update({ ...active, flags })
    }
    return (
      <>
        <header className="exam-bar">
          <span className={remaining < 300 ? 'timer low' : 'timer'}>{formatTime(remaining)}</span>
          <span className="muted small">{answered}/{items.length} answered</span>
          <button className="btn small" onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? 'Hide grid' : 'All questions'}
          </button>
        </header>

        {showGrid && (
          <div className="qgrid">
            {items.map((_, i) => (
              <button
                key={i}
                className={[
                  'qcell',
                  active.answers[i] !== null ? 'answered' : '',
                  active.flags[i] ? 'flagged' : '',
                  i === index ? 'current' : '',
                ].join(' ')}
                onClick={() => {
                  setIndex(i)
                  setShowGrid(false)
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        <QuestionCard
          q={q}
          chosen={active.answers[index] ?? undefined}
          reveal={false}
          onChoose={setAnswer}
          label={`Question ${index + 1} of ${items.length}`}
        />

        <div className="exam-nav">
          <button className="btn" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</button>
          <button className={active.flags[index] ? 'btn flag on' : 'btn flag'} onClick={toggleFlag}>
            {active.flags[index] ? 'Flagged' : 'Flag'}
          </button>
          {index + 1 < items.length ? (
            <button className="btn primary" onClick={() => setIndex(index + 1)}>Next</button>
          ) : (
            <button className="btn primary" onClick={() => setConfirm(true)}>Finish</button>
          )}
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setConfirm(true)}>Submit exam</button>
        </div>
        <div className="thumb-spacer" />

        {confirm && (
          <div className="modal-back" onClick={() => setConfirm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Submit exam?</h2>
              <p>
                {items.length - answered} unanswered, {active.flags.filter(Boolean).length} flagged. There is no penalty for
                guessing, so answer every question.
              </p>
              <div className="answer-buttons">
                <button className="btn" onClick={() => setConfirm(false)}>Keep going</button>
                <button className="btn primary" onClick={submit}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Results
  if (finished) {
    const { result, items: done, answers } = finished
    return (
      <>
        <header className="page-head">
          <h1>Mock result</h1>
        </header>
        <section className={result.passed ? 'panel result pass' : 'panel result fail'}>
          <p className="big-score">{result.raw}%</p>
          <p><strong>{result.passed ? 'Pass' : 'Fail'}</strong> · pass mark {passMark}%</p>
          <p>{result.correct} of {result.size} correct</p>
          <p>Weighted domain score: <strong>{result.weighted}%</strong></p>
          <p className="muted small">The weighted score averages your domain results using each domain's weight_percent.</p>
        </section>
        <section className="panel">
          <h2>Score by domain</h2>
          <table className="table">
            <thead>
              <tr><th>Domain</th><th>Weight</th><th>Score</th><th>%</th></tr>
            </thead>
            <tbody>
              {pack.exam_domains.filter((d) => result.byDomain[d.id]).map((d) => {
                const r = result.byDomain[d.id]
                const p = pct(r.c, r.t)
                return (
                  <tr key={d.id}>
                    <td><strong>{d.id}</strong> {d.name}</td>
                    <td>{d.weight_percent}%</td>
                    <td>{r.c}/{r.t}</td>
                    <td className={p >= passMark ? 'good' : 'bad'}>{p}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        <div className="actions">
          <button className="btn primary" onClick={() => setFinished(null)}>New mock exam</button>
        </div>
        <section>
          <div className="row-between">
            <h2 className="section-title">Review answers</h2>
            <button className={wrongOnly ? 'chip active' : 'chip'} onClick={() => setWrongOnly(!wrongOnly)}>
              Wrong only
            </button>
          </div>
          {done.map((q, i) =>
            wrongOnly && answers[i] === q.answer ? null : (
              <div key={q.id} className="panel">
                <QuestionCard
                  q={q}
                  chosen={answers[i] ?? undefined}
                  reveal
                  onChoose={() => {}}
                  label={`Question ${i + 1} · ${q.domain}`}
                />
              </div>
            ),
          )}
        </section>
      </>
    )
  }

  // Setup
  return (
    <>
      <header className="page-head">
        <h1>Mock exam</h1>
        <p className="muted small">
          The real exam has {realQ} questions in {realMin} minutes. That is {(secsPerQ / 60).toFixed(1)} minutes per
          question, and the timer here scales the same way. Closed book: Learn and the tab bar are hidden until you submit.
          Questions are drawn in proportion to each domain's weight. Four options, no penalty for guessing. Pass mark{' '}
          {passMark}%.
        </p>
      </header>
      {sizes.map((n) => (
        <button key={n} className="big-choice" onClick={() => start(n)}>
          <span className="big-choice-title">{n === total ? `All ${n} questions` : `${n} questions`}</span>
          <span className="muted">{formatTime(Math.round(n * secsPerQ))} time limit</span>
        </button>
      ))}
    </>
  )
}
