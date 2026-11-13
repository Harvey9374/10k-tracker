import { useCallback, useEffect, useMemo, useState } from 'react'
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

export interface Course {
  id: string
  title: string
  short: string
  file: string
  storage: string
}

const COURSE_KEY = 'study-current-course'

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

const base = import.meta.env.BASE_URL

export default function App() {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [courseId, setCourseId] = useState<string | null>(() => localStorage.getItem(COURSE_KEY))
  const [pack, setPack] = useState<{ id: string; data: StudyPack } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loc, setLoc] = useState(parseHash)
  const [examActive, setExamActive] = useState(false)

  useEffect(() => {
    fetch(`${base}courses.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((list: Course[]) => setCourses(list))
      .catch((e) => setError(String(e)))
  }, [])

  const course = courses ? (courses.find((c) => c.id === courseId) ?? courses[0]) : null

  useEffect(() => {
    if (!course) return
    let cancelled = false
    setExamActive(loadActiveMock(course.storage) !== null)
    fetch(`${base}${course.file}`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: StudyPack) => {
        if (cancelled) return
        setPack({ id: course.id, data })
        document.title = data.meta.title
      })
      .catch((e) => setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [course])

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

  const switchCourse = useCallback((id: string) => {
    localStorage.setItem(COURSE_KEY, id)
    setCourseId(id)
    go('home')
  }, [])

  const data = pack && course && pack.id === course.id ? pack.data : null
  const deck = useMemo(() => (data ? buildDeck(data) : []), [data])

  if (error) return <div className="screen center">Could not load the study pack: {error}</div>
  if (!course || !data || !courses) return <div className="screen center">Loading…</div>

  const route = examActive ? 'mock' : loc.route

  return (
    <ProgressProvider key={course.id} storage={course.storage}>
      <main className={examActive ? 'screen exam' : 'screen'}>
        {route === 'home' && <Home pack={data} deck={deck} courses={courses} course={course} onSwitch={switchCourse} />}
        {route === 'learn' && <Learn pack={data} initialTab={loc.params.get('tab')} lessonId={loc.params.get('lesson')} />}
        {route === 'cards' && <Flashcards pack={data} deck={deck} />}
        {route === 'quiz' && <Quiz pack={data} preset={loc.params.get('d')} />}
        {route === 'mock' && <Mock pack={data} onActiveChange={setExamActive} />}
        {route === 'info' && <Info pack={data} />}
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
