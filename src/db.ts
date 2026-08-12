import Dexie, { type EntityTable } from 'dexie'
import { DECKS, type Deck } from './decks'
import { NOTES, type DeckNote } from './notes'

export type StoredNote = DeckNote & { deckId: Deck['id'] }

export const db = new Dexie('inza') as Dexie & {
  decks: EntityTable<Deck, 'id'>
  notes: EntityTable<StoredNote, 'id'>
}

db.version(1).stores({
  decks: 'id',
  notes: 'id, deckId',
})

export const dbReady = db.open().then(async () => {
  if ((await db.decks.count()) > 0) return

  await db.transaction('rw', db.decks, db.notes, () =>
    Promise.all([
      db.decks.bulkAdd(DECKS),
      db.notes.bulkAdd(NOTES.map((note) => ({ ...note, deckId: DECKS[0].id }))),
    ]),
  )
})
