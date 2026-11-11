import type { Card, StudyPack } from '../types'
import { stripNew } from './util'

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

/** JSON flashcards plus forward and reverse cards generated from Annex A. */
export function buildDeck(pack: StudyPack): Card[] {
  const deck: Card[] = pack.flashcards.map((c) => ({
    id: 'pack:' + norm(c.front),
    front: c.front,
    back: c.back,
    source: 'pack',
  }))
  const seen = new Set(deck.map((c) => norm(c.front)))
  const isNew = new Set(pack.annex_a.new_in_2022)

  for (const theme of pack.annex_a.themes) {
    for (const ctl of theme.controls) {
      const summary = stripNew(ctl.summary)
      const tag = isNew.has(ctl.id) ? ' (new in 2022)' : ''
      const fwd = `Control ${ctl.id} is?`
      if (!seen.has(norm(fwd))) {
        seen.add(norm(fwd))
        deck.push({
          id: 'ctl:' + ctl.id,
          front: fwd,
          back: ctl.name + tag,
          detail: summary,
          source: 'control',
          theme: theme.theme,
        })
      }
      const rev = `Which control covers this? ${summary}`
      if (!seen.has(norm(rev))) {
        seen.add(norm(rev))
        deck.push({
          id: 'rev:' + ctl.id,
          front: rev,
          back: `${ctl.id} ${ctl.name}${tag}`,
          source: 'reverse',
          theme: theme.theme,
        })
      }
    }
  }
  return deck
}
