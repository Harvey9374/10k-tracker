import { useMemo, useState } from 'react'
import type { Card, StudyPack } from '../types'
import { INTERVALS, isDue, useProgress } from '../lib/progress'
import { shuffle } from '../lib/util'

type Source = 'all' | Card['source']
const SOURCES: { id: Source; label: string }[] = [
  { id: 'all', label: 'All cards' },
  { id: 'pack', label: 'Study pack' },
  { id: 'control', label: 'Control → name' },
  { id: 'reverse', label: 'Summary → control' },
]
const SESSION_SIZES = [10, 20, 40]

export function Flashcards({ pack, deck }: { pack: StudyPack; deck: Card[] }) {
  const { progress, reviewCard } = useProgress()
  const [source, setSource] = useState<Source>('all')
  const [theme, setTheme] = useState('all')
  const [size, setSize] = useState(20)
  const [queue, setQueue] = useState<Card[] | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [stats, setStats] = useState({ right: 0, wrong: 0 })
  const [retried, setRetried] = useState<Set<string>>(new Set())

  const filtered = useMemo(
    () =>
      deck.filter(
        (c) =>
          (source === 'all' || c.source === source) &&
          (theme === 'all' || c.theme === theme),
      ),
    [deck, source, theme],
  )
  const due = filtered.filter((c) => progress.cards[c.id] && isDue(progress.cards[c.id]))
  const fresh = filtered.filter((c) => !progress.cards[c.id])
  const later = filtered.filter((c) => !isDue(progress.cards[c.id]))

  const boxCounts = [1, 2, 3, 4, 5].map((b) => filtered.filter((c) => progress.cards[c.id]?.box === b).length)

  function start(ahead = false) {
    const byDue = (a: Card, b: Card) => progress.cards[a.id].due.localeCompare(progress.cards[b.id].due)
    const pool = ahead
      ? [...later].sort(byDue)
      : [...shuffle(due).sort(byDue), ...shuffle(fresh)]
    setQueue(pool.slice(0, size))
    setFlipped(false)
    setStats({ right: 0, wrong: 0 })
    setRetried(new Set())
  }

  function answer(correct: boolean) {
    if (!queue) return
    const [card, ...rest] = queue
    // Only the first answer in a session moves the card between boxes.
    if (!retried.has(card.id)) reviewCard(card.id, correct)
    setStats((s) => (correct ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }))
    if (!correct) {
      setRetried((r) => new Set(r).add(card.id))
      setQueue([...rest, card]) // see it again at the end of this session
    } else {
      setQueue(rest)
    }
    setFlipped(false)
  }

  if (queue && queue.length > 0) {
    const card = queue[0]
    const box = progress.cards[card.id]?.box
    return (
      <>
        <header className="row-between page-head">
          <button className="btn ghost small" onClick={() => setQueue(null)}>End</button>
          <span className="muted">{queue.length} left · {stats.right} right · {stats.wrong} again</span>
        </header>
        <button
          className={flipped ? 'flashcard flipped' : 'flashcard'}
          onClick={() => setFlipped(!flipped)}
          aria-label={flipped ? 'Show question' : 'Show answer'}
        >
          <span className="muted small">
            {card.source === 'pack' ? 'Study pack' : card.theme} {box ? `· box ${box}` : '· new'}
          </span>
          <span className="flash-front">{card.front}</span>
          {flipped ? (
            <span className="flash-back">
              {card.back}
              {card.detail && <span className="muted small block">{card.detail}</span>}
            </span>
          ) : (
            <span className="muted small">Tap to show the answer</span>
          )}
        </button>
        {flipped && (
          <div className="answer-buttons thumb">
            <button className="btn bad-btn" onClick={() => answer(false)}>Again</button>
            <button className="btn good-btn" onClick={() => answer(true)}>Got it</button>
          </div>
        )}
        <div className="thumb-spacer" />
      </>
    )
  }

  return (
    <>
      <header className="page-head">
        <h1>Flashcards</h1>
        <p className="muted small">
          Leitner boxes. Got it moves a card up a box. Again sends it back to box 1. Boxes 1 to 5 come back after{' '}
          {INTERVALS.join(', ')} days.
        </p>
      </header>

      {queue && (
        <section className="panel">
          <h2>Session complete</h2>
          <p>{stats.right} right, {stats.wrong} to repeat.</p>
        </section>
      )}

      <section className="panel">
        <h2>Deck</h2>
        <div className="chips">
          {SOURCES.map((s) => (
            <button key={s.id} className={source === s.id ? 'chip active' : 'chip'} onClick={() => setSource(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="chips">
          <button className={theme === 'all' ? 'chip active' : 'chip'} onClick={() => setTheme('all')}>Any theme</button>
          {pack.annex_a.themes.map((t) => (
            <button key={t.theme} className={theme === t.theme ? 'chip active' : 'chip'} onClick={() => setTheme(t.theme)}>
              {t.theme.replace(/ controls$/i, '')}
            </button>
          ))}
        </div>
        <div className="boxes">
          {boxCounts.map((n, i) => (
            <div key={i} className="box">
              <span className="stat-num small-num">{n}</span>
              <span className="muted small">Box {i + 1}</span>
            </div>
          ))}
        </div>
        <p className="muted small">
          {filtered.length} cards · {due.length} due for review · {fresh.length} new
        </p>
      </section>

      <section className="panel">
        <h2>Session length</h2>
        <div className="chips">
          {SESSION_SIZES.map((n) => (
            <button key={n} className={size === n ? 'chip active' : 'chip'} onClick={() => setSize(n)}>
              {n} cards
            </button>
          ))}
        </div>
      </section>

      <div className="actions">
        <button className="btn primary" disabled={!due.length && !fresh.length} onClick={() => start()}>
          {due.length || fresh.length ? `Start (${Math.min(size, due.length + fresh.length)} cards)` : 'Nothing due today'}
        </button>
        {!due.length && !fresh.length && later.length > 0 && (
          <button className="btn" onClick={() => start(true)}>Study ahead</button>
        )}
      </div>
    </>
  )
}
