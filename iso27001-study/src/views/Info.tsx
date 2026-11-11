import type { StudyPack } from '../types'
import { useProgress } from '../lib/progress'
import { InfoList } from './Learn'

export function Info({ pack }: { pack: StudyPack }) {
  const { reset } = useProgress()
  const { meta } = pack
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{meta.title}</p>
        <h1>Exam information</h1>
        {meta.target_exam && <p className="muted">{meta.target_exam}</p>}
      </header>
      <section className="panel">
        <h2>Exam format and fees</h2>
        <InfoList data={meta.exam_format} />
      </section>
      {meta.eligibility && (
        <section className="panel">
          <h2>Eligibility</h2>
          <InfoList data={meta.eligibility} />
        </section>
      )}
      {pack.exam_domain_weight_note && (
        <section className="panel">
          <h2>Domain weights</h2>
          <p className="muted small">{pack.exam_domain_weight_note}</p>
          <ul className="list">
            {pack.exam_domains.map((d) => (
              <li key={d.id}>{d.id} {d.name}: {d.weight_percent}%</li>
            ))}
          </ul>
        </section>
      )}
      {meta.copyright_note && (
        <section className="panel">
          <h2>About this content</h2>
          <p className="small">{meta.copyright_note}</p>
        </section>
      )}
      {meta.sources && (
        <section className="panel">
          <h2>Sources</h2>
          <ul className="list small">
            {meta.sources.map((s) => {
              const url = s.match(/^https?:\/\/\S+/)?.[0]
              return (
                <li key={s} className="wrap">
                  {url ? <a className="source-link" href={url} target="_blank" rel="noreferrer">{s}</a> : s}
                </li>
              )
            })}
          </ul>
        </section>
      )}
      <section className="panel">
        <h2>Your data</h2>
        <p className="muted small">Progress is stored on this device only.</p>
        <button
          className="btn bad-btn"
          onClick={() => {
            if (confirm('Delete all flashcard, quiz and mock progress on this device?')) reset()
          }}
        >
          Reset progress
        </button>
      </section>
    </>
  )
}
