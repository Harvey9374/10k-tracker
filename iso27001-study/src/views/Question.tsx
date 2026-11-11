import type { Question } from '../types'

export interface Shuffled extends Question {
  order: number[] // order[i] = index into original options
}

export function withShuffledOptions(q: Question, shuffleFn: (a: number[]) => number[]): Shuffled {
  return { ...q, order: shuffleFn(q.options.map((_, i) => i)) }
}

const LETTERS = 'ABCDEFGH'

/** Renders one question. `chosen` is an original option index. */
export function QuestionCard({
  q,
  chosen,
  reveal,
  onChoose,
  label,
}: {
  q: Shuffled
  chosen: number | undefined
  reveal: boolean
  onChoose: (original: number) => void
  label?: string
}) {
  return (
    <div className="question">
      {label && <p className="muted small">{label}</p>}
      <h2 className="q-text">{q.question}</h2>
      <div className="options">
        {q.order.map((orig, i) => {
          let cls = 'option'
          if (chosen === orig) cls += ' chosen'
          if (reveal && orig === q.answer) cls += ' correct'
          if (reveal && chosen === orig && orig !== q.answer) cls += ' wrong'
          return (
            <button key={orig} className={cls} disabled={reveal} onClick={() => onChoose(orig)}>
              <span className="opt-letter">{LETTERS[i]}</span>
              <span>{q.options[orig]}</span>
            </button>
          )
        })}
      </div>
      {reveal && (
        <div className={chosen === q.answer ? 'feedback good-border' : 'feedback bad-border'}>
          <strong>{chosen === undefined ? 'Not answered.' : chosen === q.answer ? 'Correct.' : 'Incorrect.'}</strong>{' '}
          {chosen !== q.answer && <>The answer is {q.options[q.answer]}. </>}
          {q.explanation}
        </div>
      )}
    </div>
  )
}
