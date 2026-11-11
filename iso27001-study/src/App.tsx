import { useEffect, useMemo, useState } from 'react'
import type { StudyPack } from './types'
import { ProgressProvider } from './lib/progress'
import { buildDeck } from './lib/cards'
import { Home } from './views/Home'
import { Learn } from './views/Learn'
import { Flashcards } from './views/Flashcards'
import { Quiz } from './views/Quiz'
import { Mock, loadActiveMock } from './views/Mock'
import { Info } from './views/Info'

export type Route = 'home' | 'learn' | 'cards' | 'quiz' | 'mock' | 'info'
const ROUTES: Route[] = ['home', 'learn', 'cards', 'quiz', 'mock', 'info']

function parseHash(): { route: Route; params: URLSearchParams } {
  const [path, query] = window.location.hash.replace(/^#\/?/, '').split('?')
  const route = (ROUTES as string[]).includes(path) ? (path as Route) : 'home'
  return { route, params: new URLSearchParams(query ?? '') }
}

export function go(route: Route, params?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params).toString() : ''
  window.location.hash = `/${route}${q}`
}

const NAV: { route: Route; label: string; icon: string }[] = [
  { route: 'home', label: 'Home', icon: '⌂' },
  { route: 'learn', label: 'Learn', icon: '☰' },
  { route: 'cards', label: 'Cards', icon: '❐' },
  { route: 'quiz', label: 'Quiz', icon: '?' },
  { route: 'mock', label: 'Mock', icon: '⏱' },
]

export default function App() {
  const [pack, setPack] = useState<StudyPack | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loc, setLoc] = useState(parseHash)
  const [examActive, setExamActive] = useState(() => loadActiveMock() !== null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}study-pack.json`, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setPack)
      .catch((e) => setError(String(e)))
  }, [])

  useEffect(() => {
    const onHash = () => {
      setLoc(parseHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // During a mock exam, keep you on the exam screen. Closed book.
  useEffect(() => {
    if (examActive && loc.route !== 'mock') go('mock')
  }, [examActive, loc.route])

  const deck = useMemo(() => (pack ? buildDeck(pack) : []), [pack])

  if (error) return <div className="screen center">Could not load the study pack: {error}</div>
  if (!pack) return <div className="screen center">Loading…</div>

  const route = examActive ? 'mock' : loc.route

  return (
    <ProgressProvider>
      <main className={examActive ? 'screen exam' : 'screen'}>
        {route === 'home' && <Home pack={pack} deck={deck} />}
        {route === 'learn' && <Learn pack={pack} initialTab={loc.params.get('tab')} />}
        {route === 'cards' && <Flashcards pack={pack} deck={deck} />}
        {route === 'quiz' && <Quiz pack={pack} preset={loc.params.get('d')} />}
        {route === 'mock' && <Mock pack={pack} onActiveChange={setExamActive} />}
        {route === 'info' && <Info pack={pack} />}
      </main>
      {!examActive && (
        <nav className="tabbar" aria-label="Main">
          {NAV.map((n) => (
            <button
              key={n.route}
              className={route === n.route ? 'tab active' : 'tab'}
              onClick={() => go(n.route)}
              aria-current={route === n.route ? 'page' : undefined}
            >
              <span className="tab-icon" aria-hidden>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      )}
    </ProgressProvider>
  )
}
