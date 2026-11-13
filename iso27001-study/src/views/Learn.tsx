import { useMemo, useState } from 'react'
import type { InfoValue, StudyPack } from '../types'
import { useProgress } from '../lib/progress'
import { labelFor, stripNew } from '../lib/util'
import { go } from '../App'
import { LessonList, LessonView } from './Lessons'

const TABS = [
  { id: 'lessons', label: 'Lessons' },
  { id: 'domains', label: 'Domains' },
  { id: 'phases', label: 'Phases' },
  { id: 'clauses', label: 'Clauses' },
  { id: 'annex', label: 'Annex A' },
  { id: 'docs', label: 'Documents' },
  { id: 'glossary', label: 'Glossary' },
] as const
type Tab = (typeof TABS)[number]['id']

export function Learn({
  pack,
  initialTab,
  lessonId,
}: {
  pack: StudyPack
  initialTab: string | null
  lessonId: string | null
}) {
  const valid = TABS.some((t) => t.id === initialTab)
  const [tab, setTab] = useState<Tab>(valid ? (initialTab as Tab) : 'lessons')
  const [lastTabParam, setLastTabParam] = useState(initialTab)
  if (initialTab !== lastTabParam) {
    setLastTabParam(initialTab)
    if (valid) setTab(initialTab as Tab)
  }

  const lesson = lessonId ? pack.lessons?.find((l) => l.id === lessonId) : undefined
  if (lesson) return <LessonView key={lesson.id} pack={pack} lesson={lesson} />

  return (
    <>
      <header className="page-head">
        <h1>Learn</h1>
      </header>
      <div className="segmented" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'seg active' : 'seg'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'lessons' && <LessonList pack={pack} />}
      {tab === 'domains' && <Domains pack={pack} />}
      {tab === 'phases' && <Phases pack={pack} />}
      {tab === 'clauses' && <Clauses pack={pack} />}
      {tab === 'annex' && <AnnexA pack={pack} />}
      {tab === 'docs' && <Documents pack={pack} />}
      {tab === 'glossary' && <Glossary pack={pack} />}
    </>
  )
}

function Domains({ pack }: { pack: StudyPack }) {
  return (
    <>
      {pack.exam_domain_weight_note && <p className="muted small">{pack.exam_domain_weight_note}</p>}
      {pack.exam_domains.map((d) => {
        const count = pack.questions.filter((q) => q.domain === d.id).length
        return (
          <section key={d.id} className="panel">
            <div className="row-between">
              <h2>
                <span className="pill">{d.id}</span> {d.name}
              </h2>
              <span className="weight">{d.weight_percent}%</span>
            </div>
            <ul className="list">
              {d.covers.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <button className="btn small" onClick={() => go('quiz', { d: d.id })}>
              Practise {count} question{count === 1 ? '' : 's'}
            </button>
          </section>
        )
      })}
    </>
  )
}

function Phases({ pack }: { pack: StudyPack }) {
  return (
    <ol className="timeline">
      {pack.implementation_phases.map((p, i) => (
        <li key={p.phase} className="timeline-item">
          <div className="timeline-num">{i + 1}</div>
          <div className="panel flat">
            <h2>{p.phase}</h2>
            <ol className="list numbered">
              {p.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Clauses({ pack }: { pack: StudyPack }) {
  const domainName = (id?: string) => pack.exam_domains.find((d) => d.id === id)?.name
  return (
    <>
      {pack.clauses.map((c) => (
        <details key={c.clause} className="panel disclosure">
          <summary>
            <span className="pill">{c.clause}</span> {c.title}
            {c.domain && <span className="muted small block">{c.domain} {domainName(c.domain)}</span>}
          </summary>
          {c.subclauses.map((s) => (
            <div key={s.id} className="item">
              <h3>
                {s.id} {s.title}
                {/new in 2022/i.test(s.summary) && <span className="badge">NEW in 2022</span>}
              </h3>
              <p>{s.summary}</p>
            </div>
          ))}
        </details>
      ))}
    </>
  )
}

function AnnexA({ pack }: { pack: StudyPack }) {
  const [theme, setTheme] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [newOnly, setNewOnly] = useState(false)
  const isNew = useMemo(() => new Set(pack.annex_a.new_in_2022), [pack])
  const q = query.trim().toLowerCase()

  const themes = pack.annex_a.themes.filter((t) => theme === 'all' || t.theme === theme)
  const total = pack.annex_a.themes.reduce((s, t) => s + t.controls.length, 0)

  return (
    <>
      <p className="muted small">
        {total} controls in {pack.annex_a.themes.length} {pack.annex_a.group_label ?? 'themes'}.
        {pack.annex_a.new_in_2022.length > 0 && ` ${pack.annex_a.new_in_2022.length} are new in 2022.`}
      </p>
      <input
        className="search"
        type="search"
        placeholder="Search by control number or keyword"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="chips">
        <button className={theme === 'all' ? 'chip active' : 'chip'} onClick={() => setTheme('all')}>All</button>
        {pack.annex_a.themes.map((t) => (
          <button
            key={t.theme}
            className={theme === t.theme ? 'chip active' : 'chip'}
            onClick={() => setTheme(t.theme)}
          >
            {t.clause} {t.theme.replace(/ controls$/i, '')} ({t.controls.length})
          </button>
        ))}
        {isNew.size > 0 && (
          <button className={newOnly ? 'chip active' : 'chip'} onClick={() => setNewOnly(!newOnly)}>
            New in 2022 only
          </button>
        )}
      </div>
      {themes.map((t) => {
        const controls = t.controls.filter(
          (c) =>
            (!newOnly || isNew.has(c.id)) &&
            (!q || `${c.id} ${c.name} ${c.summary}`.toLowerCase().includes(q)),
        )
        if (!controls.length) return null
        return (
          <section key={t.theme}>
            <h2 className="section-title">
              {t.clause} {t.theme} <span className="muted">({t.controls.length})</span>
            </h2>
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
        )
      })}
      {pack.annex_a.attributes_iso27002 && (
        <section className="panel">
          <h2>{pack.annex_a.attributes_title ?? 'ISO/IEC 27002 control attributes'}</h2>
          <InfoList data={pack.annex_a.attributes_iso27002} />
        </section>
      )}
    </>
  )
}

function Documents({ pack }: { pack: StudyPack }) {
  const { progress, toggleCheck } = useProgress()
  const items = pack.mandatory_documented_information
  const done = items.filter((i) => progress.checklist[i.item]).length
  return (
    <>
      <p className="muted small">
        Mandatory documented information. Tick each item once you can name it and its clause from memory. {done} of {items.length} ticked.
      </p>
      <ul className="checklist">
        {items.map((i) => (
          <li key={i.item}>
            <label className={progress.checklist[i.item] ? 'check done' : 'check'}>
              <input
                type="checkbox"
                checked={!!progress.checklist[i.item]}
                onChange={() => toggleCheck(i.item)}
              />
              <span>
                <strong>{i.item}</strong>
                <span className="muted small block">Clause {i.ref}</span>
                {i.note && <span className="muted small block">{i.note}</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </>
  )
}

function Glossary({ pack }: { pack: StudyPack }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const concepts = pack.key_concepts.filter((k) => !q || `${k.term} ${k.definition}`.toLowerCase().includes(q))
  const family = pack.standards_family.filter((s) => !q || `${s.id} ${s.summary}`.toLowerCase().includes(q))
  return (
    <>
      <input
        className="search"
        type="search"
        placeholder="Search terms and standards"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {concepts.length > 0 && <h2 className="section-title">Key concepts</h2>}
      {concepts.map((k) => (
        <div key={k.term} className="control">
          <div className="control-name">{k.term}</div>
          <p>{k.definition}</p>
        </div>
      ))}
      {family.length > 0 && <h2 className="section-title">Standards family</h2>}
      {family.map((s) => (
        <div key={s.id} className="control">
          <div className="control-name">{s.id}</div>
          <p>{s.summary}</p>
        </div>
      ))}
    </>
  )
}

export function InfoList({ data }: { data: Record<string, InfoValue> }) {
  return (
    <dl className="info">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="info-row">
          <dt>{labelFor(k)}</dt>
          <dd>
            {Array.isArray(v) ? (
              <span className="chips static">
                {v.map((x) => <span key={String(x)} className="chip">{String(x)}</span>)}
              </span>
            ) : typeof v === 'boolean' ? (
              v ? 'Yes' : 'No'
            ) : (
              String(v)
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
