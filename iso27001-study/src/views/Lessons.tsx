import { useState } from 'react'
import type { Lesson, StudyPack } from '../types'
import { useProgress } from '../lib/progress'
import { shuffle, stripNew } from '../lib/util'
import { go } from '../App'
import { QuestionCard, withShuffledOptions, type Shuffled } from './Question'

export function nextLesson(pack: StudyPack, done: Record<string, string>): Lesson | undefined {
  const lessons = pack.lessons ?? []
  return lessons.find((l) => !done[l.id])
}

export function LessonList({ pack }: { pack: StudyPack }) {
  const { progress } = useProgress()
  const lessons = pack.lessons ?? []
  const done = lessons.filter((l) => progress.lessons[l.id]).length
  const next = nextLesson(pack, progress.lessons)

  if (!lessons.length) return <p className="muted">No lessons in the study pack yet.</p>

  return (
    <>
      <section className="panel">
        <div className="row-between">
          <h2>Course</h2>
          <span className="muted small">{done} of {lessons.length} complete</span>
        </div>
        <div className="bar"><div className="bar-fill good-bg" style={{ width: `${(done / lessons.length) * 100}%` }} /></div>
        <p className="muted small">
          Work through the lessons in order. Each one teaches the topic, gives an example and exam tips, then checks your
          understanding with a few questions.
        </p>
        {next && (
          <button className="btn primary full" onClick={() => go('learn', { lesson: next.id })}>
            {done ? 'Continue' : 'Start'}: {next.title}
          </button>
        )}
      </section>
      {pack.exam_domains.map((d) => {
        const items = lessons.filter((l) => l.domain === d.id)
        if (!items.length) return null
        return (
          <section key={d.id}>
            <h2 className="section-title">
              <span className="pill">{d.id}</span> {d.name}
            </h2>
            {items.map((l) => (
              <button key={l.id} className="lesson-row" onClick={() => go('learn', { lesson: l.id })}>
                <span className={progress.lessons[l.id] ? 'lesson-num done' : 'lesson-num'}>
                  {progress.lessons[l.id] ? '✓' : lessons.indexOf(l) + 1}
                </span>
                <span className="lesson-title">
                  {l.title}
                  {l.minutes && <span className="muted small block">{l.minutes} min read</span>}
                </span>
                <span className="muted" aria-hidden>›</span>
              </button>
            ))}
          </section>
        )
      })}
      {pack.lessons_note && <p className="muted small">{pack.lessons_note}</p>}
    </>
  )
}

export function LessonView({ pack, lesson }: { pack: StudyPack; lesson: Lesson }) {
  const { progress, recordAnswer, completeLesson } = useProgress()
  const lessons = pack.lessons ?? []
  const index = lessons.indexOf(lesson)
  const following = lessons[index + 1]
  const domain = pack.exam_domains.find((d) => d.id === lesson.domain)
  const isNew = new Set(pack.annex_a.new_in_2022)
  const allControls = pack.annex_a.themes.flatMap((t) => t.controls)

  const [checks] = useState<Shuffled[]>(() =>
    (lesson.check_questions ?? [])
      .map((id) => pack.questions.find((q) => q.id === id))
      .filter((q) => q !== undefined)
      .map((q) => withShuffledOptions(q, shuffle)),
  )
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const answered = Object.keys(answers).length
  const correct = checks.filter((q) => answers[q.id] === q.answer).length

  function choose(q: Shuffled, orig: number) {
    if (answers[q.id] !== undefined) return
    setAnswers({ ...answers, [q.id]: orig })
    recordAnswer(q.domain, orig === q.answer)
  }

  function finish() {
    completeLesson(lesson.id)
    if (following) go('learn', { lesson: following.id })
    else go('learn', { tab: 'lessons' })
  }

  const clauses = (lesson.related?.clauses ?? [])
    .map((id) => pack.clauses.find((c) => c.clause === id))
    .filter((c) => c !== undefined)
  const controls = (lesson.related?.controls ?? [])
    .map((id) => allControls.find((c) => c.id === id))
    .filter((c) => c !== undefined)

  return (
    <article className="lesson">
      <header className="page-head">
        <button className="btn ghost small" onClick={() => go('learn', { tab: 'lessons' })}>‹ All lessons</button>
        <p className="eyebrow">
          Lesson {index + 1} of {lessons.length} · {lesson.domain} {domain?.name}
        </p>
        <h1>{lesson.title}</h1>
        {progress.lessons[lesson.id] && <span className="badge done-badge">Completed</span>}
      </header>

      <p className="lead">{lesson.intro}</p>

      {lesson.sections.map((s) => (
        <section key={s.heading} className="lesson-section">
          <h2>{s.heading}</h2>
          {s.body?.map((p) => <p key={p}>{p}</p>)}
          {s.points && (
            <ul className="list">
              {s.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          )}
        </section>
      ))}

      {lesson.example && (
        <aside className="callout example">
          <h3>Example: {lesson.example.title}</h3>
          <p>{lesson.example.text}</p>
        </aside>
      )}

      {!!lesson.exam_tips?.length && (
        <aside className="callout tips">
          <h3>Exam tips</h3>
          <ul className="list">
            {lesson.exam_tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </aside>
      )}

      {(clauses.length > 0 || controls.length > 0) && (
        <section className="lesson-section">
          <h2>Related reference</h2>
          {clauses.map((c) => (
            <details key={c.clause} className="panel disclosure">
              <summary>
                <span className="pill">{c.clause}</span> {c.title}
              </summary>
              {c.subclauses.map((s) => (
                <div key={s.id} className="item">
                  <h3>{s.id} {s.title}</h3>
                  <p>{s.summary}</p>
                </div>
              ))}
            </details>
          ))}
          {controls.map((c) => (
            <div key={c.id} className="control">
              <div className="control-head">
                <span className="control-id">{c.id}</span>
                <span className="control-name">{c.name}</span>
                {isNew.has(c.id) && <span className="badge">NEW in 2022</span>}
              </div>
              <p>{stripNew(c.summary)}</p>
            </div>
          ))}
        </section>
      )}

      {checks.length > 0 && (
        <section className="lesson-section">
          <h2>Check your understanding</h2>
          <p className="muted small">
            {answered < checks.length
              ? `${checks.length} questions. Answer each to see the explanation.`
              : `${correct} of ${checks.length} correct.${correct < checks.length ? ' Reread the sections above, then try the quiz for this domain.' : ''}`}
          </p>
          {checks.map((q, i) => (
            <div key={q.id} className="panel">
              <QuestionCard
                q={q}
                chosen={answers[q.id]}
                reveal={answers[q.id] !== undefined}
                onChoose={(o) => choose(q, o)}
                label={`Question ${i + 1}`}
              />
            </div>
          ))}
        </section>
      )}

      <div className="thumb">
        <button className="btn primary full" onClick={finish}>
          {following ? 'Complete and go to next lesson' : 'Complete course'}
        </button>
      </div>
      <div className="thumb-spacer" />
    </article>
  )
}
