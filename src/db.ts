import Dexie, { type EntityTable } from 'dexie'
import type { DeckNote } from './notes'

type StoredDeck = {
  id: string
  name: string
  done: number
  due: number
  todo: number
  importStatus: 'importing' | 'ready'
  importedBytes: number
  totalBytes: number
}

type StoredNote = DeckNote & {
  noteId: string
  deckId: string
}

type StoredMedia = {
  id: string
  deckId: string
  path: string
  blob: Blob
}

export const db = new Dexie('inza') as Dexie & {
  decks: EntityTable<StoredDeck, 'id'>
  notes: EntityTable<StoredNote, 'id'>
  media: EntityTable<StoredMedia, 'id'>
}

db.version(1).stores({
  decks: 'id',
  notes: 'id, deckId',
  media: 'id, deckId',
})

export async function deleteDeck(deckId: string) {
  await db.transaction('rw', db.decks, db.notes, db.media, async () => {
    await db.notes.where('deckId').equals(deckId).delete()
    await db.media.where('deckId').equals(deckId).delete()
    await db.decks.delete(deckId)
  })
}

export const dbReady = db.open().then(async () => {
  for (const deck of await db.decks.toArray()) {
    if (deck.importStatus === 'importing') await deleteDeck(deck.id)
  }
})
