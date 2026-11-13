import type { Card, StudyPack } from '../types'
import { isDue, streak, useProgress } from '../lib/progress'
import { pct } from '../lib/util'
import { go, type Course } from '../App'
import { nextLesson } from './Lessons'

export function Home({
  pack,
  deck,
  courses,
  course,
  onSwitch,
}: {
  pack: StudyPack
  deck: Card[]
  courses: Course[]
  course: Course
  onSwitch: (id: string) => void
}) {
  const { progress } = useProgress()
  const reviewsDue = deck.filter((c) => progress.cards[c.id] && isDue(progress.cards[c.id])).length
  const unseen = deck.filter((c) => !progress.cards[c.id]).length
  const mastered = deck.filter((c) => (progress.cards[c.id]?.box ?? 0) >= 5).length
  const days = streak(progress.days)
  const passMark = Number(pack.meta.exam_format.pass_mark_percent ?? 60)

  const domainRows = pack.exam_domains
    .map((d) => {
      const r = progress.domains[d.id] ?? { c: 0, t: 0 }
      return { ...d, ...r, acc: pct(r.c, r.t) }
    })
    .sort((a, b) => {
      if (!a.t !== !b.t) return a.t ? -1 : 1 // attempted first
      return a.acc - b.acc // weakest first
    })
  const lastMock = progress.mocks[progress.mocks.length - 1]
  const lessons = pack.lessons ?? []
  const lessonsDone = lessons.filter((l) => progress.lessons[l.id]).length
  const next = nextLesson(pack, progress.lessons)

  return (
    <>
      <header className="page-head">
        {courses.length > 1 && (
          <div className="course-switch" role="radiogroup" aria-label="Course">
            {courses.map((c) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={c.id === course.id}
                className={c.id === course.id ? 'seg active' : 'seg'}
                onClick={() => c.id !== course.id && onSwitch(c.id)}
              >
                {c.short}
              </button>
            ))}
          </div>
        )}
        <p className="eyebrow">{pack.meta.target_exam}</p>
        <h1>Your study</h1>
      </header>

      {lessons.length > 0 && (
        <button
          className="continue"
          onClick={() => go('learn', next ? { lesson: next.id } : { tab: 'lessons' })}
        >
          <span className="eyebrow">{next ? (lessonsDone ? 'Continue learning' : 'Start here') : 'Course complete'}</span>
          <span className="continue-title">
            {next ? `Lesson ${lessons.indexOf(next) + 1}: ${next.title}` : 'Review any lesson'}
          </span>
          <span className="muted small">{lessonsDone} of {lessons.length} lessons complete</span>
          <span className="bar"><span className="bar-fill good-bg" style={{ width: `${(lessonsDone / lessons.length) * 100}%` }} /></span>
        </button>
      )}

      <section className="stats">
        <div className="stat">
          <span className="stat-num">{reviewsDue}</span>
          <span className="stat-label">Cards due today</span>
        </div>
        <div className="stat">
          <span className="stat-num">{days}</span>
          <span className="stat-label">Day streak</span>
        </div>
        <div className="stat">
          <span className="stat-num">{unseen}</span>
          <span className="stat-label">New cards</span>
        </div>
        <div className="stat">
          <span className="stat-num">{mastered}</span>
          <span className="stat-label">Mastered (box 5)</span>
        </div>
      </section>

      <div className="actions">
        <button className="btn" onClick={() => go('cards')}>Study flashcards</button>
        <button className="btn" onClick={() => go('quiz')}>Practice quiz</button>
        <button className="btn" onClick={() => go('mock')}>Mock exam</button>
        <button className="btn ghost" onClick={() => go('info')}>Exam information</button>
      </div>

      <section className="panel">
        <h2>Accuracy by domain</h2>
        <p className="muted small">Weakest first. Quiz and mock answers count. Pass mark {passMark}%.</p>
        {domainRows.map((d) => (
          <button key={d.id} className="domain-row" onClick={() => go('quiz', { d: d.id })}>
            <div className="domain-row-top">
              <span><strong>{d.id}</strong> {d.name}</span>
              <span className={d.t ? (d.acc >= passMark ? 'good' : 'bad') : 'muted'}>
                {d.t ? `${d.acc}%` : 'Not tried'}
              </span>
            </div>
            <div className="bar">
              <div
                className={d.acc >= passMark ? 'bar-fill good-bg' : 'bar-fill bad-bg'}
                style={{ width: `${d.t ? d.acc : 0}%` }}
              />
              <div className="bar-mark" style={{ left: `${passMark}%` }} />
            </div>
            <span className="muted small">{d.c} of {d.t} correct · tap to practise</span>
          </button>
        ))}
      </section>

      {lastMock && (
        <section className="panel">
          <h2>Last mock exam</h2>
          <p>
            <span className={lastMock.passed ? 'good' : 'bad'}>
              <strong>{lastMock.raw}%</strong> {lastMock.passed ? 'Pass' : 'Fail'}
            </span>{' '}
            · weighted {lastMock.weighted}% · {lastMock.size} questions · {lastMock.date}
          </p>
          {progress.mocks.length > 1 && (
            <p className="muted small">
              History: {progress.mocks.slice(-6).map((m) => `${m.raw}%`).join(', ')}
            </p>
          )}
        </section>
      )}
    </>
  )
}
