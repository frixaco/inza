import Dexie, { type EntityTable } from 'dexie'
import { createEmptyCard, type Card } from 'ts-fsrs'
import type { DeckNote } from './notes'

export type GlobalSettings = {
  id: 'global'
  newCardsPerDay: number
  maxReviewsPerDay: number
  autoSync: boolean
}

export const defaultGlobalSettings: GlobalSettings = {
  id: 'global',
  newCardsPerDay: 24,
  maxReviewsPerDay: 120,
  autoSync: true,
}

type StoredDeck = {
  id: string
  name: string
  importStatus: 'importing' | 'ready'
  importedBytes: number
  totalBytes: number
  studyDay: number
  newStudied: number
  reviewsStudied: number
  newCardsPerDay?: number
  maxReviewsPerDay?: number
  downloadOffline?: boolean
}

export type StoredNote = DeckNote & {
  noteId: string
  deckId: string
}

export type StoredCard = {
  id: string
  noteId: string
  deckId: string
  variantId: string
  fsrsCard: Card
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
  cards: EntityTable<StoredCard, 'id'>
  media: EntityTable<StoredMedia, 'id'>
  settings: EntityTable<GlobalSettings, 'id'>
}

db.version(1).stores({
  decks: 'id',
  notes: 'id, deckId',
  cards: 'id, deckId, [deckId+fsrsCard.state], [deckId+fsrsCard.due]',
  media: 'id, deckId',
  settings: 'id',
})

export function createStoredCards(note: StoredNote): StoredCard[] {
  // A cloze ID can appear more than once; create one card variant for each unique {{id::content}} ID.
  const variantIds =
    note.type === 'prompt_response'
      ? ['']
      : note.type === 'cloze'
        ? [...new Set([...note.text.matchAll(/\{\{([^:}]+)::[^}]+\}\}/g)].map((match) => match[1]))]
        : note.masks.map(({ id }) => id)

  return variantIds.map((variantId) => ({
    id: JSON.stringify([note.deckId, note.noteId, variantId]),
    noteId: note.id,
    deckId: note.deckId,
    variantId,
    fsrsCard: createEmptyCard(),
  }))
}

export async function deleteDeck(deckId: string) {
  await db.transaction('rw', db.decks, db.notes, db.cards, db.media, async () => {
    await db.notes.where('deckId').equals(deckId).delete()
    await db.cards.where('deckId').equals(deckId).delete()
    await db.media.where('deckId').equals(deckId).delete()
    await db.decks.delete(deckId)
  })
}

export const dbReady = db.open().then(async () => {
  if (!(await db.settings.get('global'))) await db.settings.add(defaultGlobalSettings)
  for (const deck of await db.decks.toArray()) {
    // TODO: handle better
    if (deck.importStatus === 'importing') await deleteDeck(deck.id)
  }
})
