export type Scalar = string | number | boolean
export type InfoValue = Scalar | Scalar[]

export interface Domain {
  id: string
  name: string
  covers: string[]
  weight_percent: number
}

export interface Phase {
  phase: string
  steps: string[]
}

export interface Subclause {
  id: string
  title: string
  summary: string
}

export interface Clause {
  clause: string
  title: string
  domain?: string
  subclauses: Subclause[]
}

export interface Control {
  id: string
  name: string
  summary: string
}

export interface Theme {
  theme: string
  clause: string
  count?: number
  controls: Control[]
}

export interface Question {
  id: string
  domain: string
  question: string
  options: string[]
  answer: number
  explanation?: string
}

export interface Flashcard {
  front: string
  back: string
}

export interface Lesson {
  id: string
  domain: string
  title: string
  minutes?: number
  intro: string
  sections: { heading: string; body?: string[]; points?: string[] }[]
  example?: { title: string; text: string }
  exam_tips?: string[]
  related?: { clauses?: string[]; controls?: string[] }
  check_questions?: string[]
}

export interface StudyPack {
  meta: {
    title: string
    target_exam?: string
    exam_format: Record<string, InfoValue>
    eligibility?: Record<string, InfoValue>
    copyright_note?: string
    sources?: string[]
  }
  exam_domains: Domain[]
  implementation_phases: Phase[]
  standards_family: { id: string; summary: string }[]
  clauses: Clause[]
  mandatory_documented_information: { item: string; ref: string; note?: string }[]
  annex_a: {
    total_controls?: number
    new_in_2022: string[]
    attributes_iso27002?: Record<string, InfoValue>
    themes: Theme[]
  }
  lessons?: Lesson[]
  lessons_note?: string
  key_concepts: { term: string; definition: string }[]
  flashcards: Flashcard[]
  questions: Question[]
  exam_domain_weight_note?: string
}

export interface Card {
  id: string
  front: string
  back: string
  detail?: string
  source: 'pack' | 'control' | 'reverse'
  theme?: string
}
