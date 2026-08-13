import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'
import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { createEmptyCard, Rating, State, type Grade } from 'ts-fsrs'
import { db, dbReady, type StoredCard } from './db'
import { importDeck } from './import-deck'
import { Note, NoteContent } from './note'
import { useFsrs } from './use-fsrs'

type Tab = 'decks' | 'study' | 'settings' | 'browse' | 'edit'
type NavContextValue = {
  tab: Tab
  setTab: Dispatch<SetStateAction<Tab>>
}

type GlobalSettings = {
  newCardsPerDay: number
  maxReviewsPerDay: number
  autoSync: boolean
}

const NavContext = createContext<NavContextValue | null>(null)
const useNav = () => {
  const nav = useContext(NavContext)

  if (!nav) {
    throw new Error('useNav must be used inside NavContext')
  }

  return nav
}

const defaultGlobalSettings: GlobalSettings = {
  newCardsPerDay: 24,
  maxReviewsPerDay: 120,
  autoSync: true,
}

function App() {
  const { tab, setTab } = useNav()
  const scheduler = useFsrs()
  const decks = useLiveQuery(
    async () => {
      await dbReady
      return db.decks.toArray()
    },
    [],
    [],
  )
  const [toggledDeckID, setToggledDeckID] = useState<string | null>(null)
  const [selectedDeckID, setSelectedDeckID] = useState<string | null>(null)
  const [globalSettings, setGlobalSettings] = useState(defaultGlobalSettings)
  const [studyCards, setStudyCards] = useState<StoredCard[]>([])
  const [front, setFront] = useState(true)
  const [cardIndex, setCardIndex] = useState(0)
  const [reviewComplete, setReviewComplete] = useState(false)
  const [dirty, setDirty] = useState(true)
  const [showAddDeck, setShowAddDeck] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const isActive = (id: string) => toggledDeckID === id
  const selectedDeck = decks.find((deck) => deck.id === selectedDeckID) ?? decks[0]

  const updateGlobalSetting = <Key extends keyof GlobalSettings>(
    key: Key,
    value: GlobalSettings[Key],
  ) => {
    setGlobalSettings((current) => ({ ...current, [key]: value }))
  }

  const resetDeckProgress = async (deckID: string) => {
    const todo = await db.cards.where('deckId').equals(deckID).count()
    await db.transaction('rw', db.decks, db.cards, async () => {
      await db.cards.where('deckId').equals(deckID).modify({ fsrsCard: createEmptyCard() })
      await db.decks.update(deckID, {
        done: 0,
        due: 0,
        todo,
        studyDay: 0,
        newStudied: 0,
        reviewsStudied: 0,
      })
    })
  }

  const loadDeck = async (input: HTMLInputElement) => {
    setImportError(null)
    setImporting(true)
    input.setCustomValidity('')

    try {
      await importDeck(Array.from(input.files ?? []))
      input.value = ''
      setShowAddDeck(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setImportError(message)
      input.setCustomValidity(message)
      input.reportValidity()
    } finally {
      setImporting(false)
    }
  }

  const startStudy = async (deckID: string) => {
    const now = new Date()
    const studyDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const deck = await db.decks.get(deckID)
    if (!deck) throw new Error(`Deck ${deckID} does not exist`)
    const newStudied = deck.studyDay === studyDay ? deck.newStudied : 0
    const reviewsStudied = deck.studyDay === studyDay ? deck.reviewsStudied : 0
    const reviewLimit = Math.max(
      0,
      Math.floor(globalSettings.maxReviewsPerDay) - newStudied - reviewsStudied,
    )
    const newLimit = Math.max(0, Math.floor(globalSettings.newCardsPerDay) - newStudied)
    const dueCards = await db.cards
      .where('[deckId+fsrsCard.due]')
      .between([deckID, Dexie.minKey], [deckID, now], true, true)
      .filter(({ fsrsCard }) => fsrsCard.state !== State.New)
      .limit(reviewLimit)
      .toArray()
    const newCards = await db.cards
      .where('[deckId+fsrsCard.state]')
      .equals([deckID, State.New])
      .limit(Math.min(newLimit, reviewLimit - dueCards.length))
      .toArray()

    // Match Anki's default by spreading new cards evenly through the review queue.
    const cards: StoredCard[] = []
    const ratio = (dueCards.length + 1) / (newCards.length + 1)
    let dueIndex = 0
    let newIndex = 0
    while (dueIndex < dueCards.length || newIndex < newCards.length) {
      const takeNew =
        newIndex < newCards.length &&
        (dueIndex === dueCards.length || (newIndex + 1) * ratio < dueIndex + 1)
      cards.push(takeNew ? newCards[newIndex++] : dueCards[dueIndex++])
    }

    setStudyCards(cards)
    setFront(true)
    setCardIndex(0)
    setReviewComplete(cards.length === 0)
    setSelectedDeckID(deckID)
    setTab('study')
  }

  const devReset = async () => {
    localStorage.clear()
    sessionStorage.clear()
    await db.delete()
    await Promise.all((await caches.keys()).map((name) => caches.delete(name)))
    await Promise.all(
      (await navigator.serviceWorker.getRegistrations()).map((registration) =>
        registration.unregister(),
      ),
    )
    location.reload()
  }

  const NumberSetting = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: number
    onChange: (value: number) => void
  }) => (
    <div className="flex min-h-12 items-center justify-between gap-4 py-2">
      <span className="flex-1 text-sm">{label}</span>
      <input
        className="no-spinner w-20 border border-gray-300 px-2 py-1 text-right text-sm"
        min="0"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )

  const ToggleSetting = ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked: boolean
    onChange: (value: boolean) => void
  }) => (
    <div className="flex min-h-12 items-center justify-between gap-4 py-2">
      <span className="flex-1 text-sm">{label}</span>
      <input
        checked={checked}
        className="size-5"
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )

  const Browse = () => {
    const notes = useLiveQuery(
      () => (selectedDeckID ? db.notes.where('deckId').equals(selectedDeckID).toArray() : []),
      [selectedDeckID],
      [],
    )
    const [toggledNoteID, setToggledNoteID] = useState<string | null>(null)
    return (
      <>
        <div className="flex items-center justify-between gap-4 font-semibold">
          <button
            className="border border-gray-300 px-6 py-4 text-sm"
            onClick={(e) => {
              e.stopPropagation()
              setTab('decks')
            }}
          >
            Back
          </button>
          <button className="border border-gray-300 px-6 py-4 text-sm">Delete</button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-none">
          {notes.map((n) => (
            <Note
              key={n.id}
              isOpen={toggledNoteID === n.id}
              setToggledNoteID={setToggledNoteID}
              note={n}
            />
          ))}
        </div>
      </>
    )
  }

  const Settings = () => (
    <>
      <div className="flex items-center gap-4 font-semibold">
        <button
          className="border border-gray-300 px-6 py-4 text-sm"
          onClick={(e) => {
            e.stopPropagation()
            setTab('decks')
          }}
        >
          Back
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        <h1 className="pb-4 text-lg font-semibold">Settings</h1>
        <NumberSetting
          label="New cards per day"
          value={globalSettings.newCardsPerDay}
          onChange={(value) => updateGlobalSetting('newCardsPerDay', value)}
        />
        <NumberSetting
          label="Max reviews per day"
          value={globalSettings.maxReviewsPerDay}
          onChange={(value) => updateGlobalSetting('maxReviewsPerDay', value)}
        />
        <ToggleSetting
          checked={globalSettings.autoSync}
          label="Auto-sync"
          onChange={(value) => updateGlobalSetting('autoSync', value)}
        />
        <button
          className="border border-red-300 px-6 py-4 text-sm text-red-700"
          onClick={() => void devReset()}
        >
          Dev Reset
        </button>
      </div>
    </>
  )

  const Edit = () => {
    type DeckSettings = {
      newCardsPerDay: number
      maxReviewsPerDay: number
      downloadOffline: boolean
    }

    const defaultDeckSettings: DeckSettings = {
      newCardsPerDay: 24,
      maxReviewsPerDay: 120,
      downloadOffline: false,
    }

    const [deckSettings, setDeckSettings] = useState<Record<string, DeckSettings>>(() =>
      Object.fromEntries(decks.map((deck) => [deck.id, { ...defaultDeckSettings }])),
    )
    const settings = deckSettings[selectedDeck.id] ?? defaultDeckSettings

    const updateDeckSetting = <Key extends keyof DeckSettings>(
      deckID: string,
      key: Key,
      value: DeckSettings[Key],
    ) => {
      setDeckSettings((current) => ({
        ...current,
        [deckID]: {
          ...defaultDeckSettings,
          ...current[deckID],
          [key]: value,
        },
      }))
    }

    return (
      <>
        <div className="flex items-center gap-4 font-semibold">
          <button
            className="border border-gray-300 px-6 py-4 text-sm"
            onClick={(e) => {
              e.stopPropagation()
              setTab('decks')
            }}
          >
            Back
          </button>
        </div>

        <div className="flex flex-1 flex-col">
          <h1 className="pb-4 text-lg font-semibold">{selectedDeck.name}</h1>
          <NumberSetting
            label="New cards per day"
            value={settings.newCardsPerDay}
            onChange={(value) => updateDeckSetting(selectedDeck.id, 'newCardsPerDay', value)}
          />
          <NumberSetting
            label="Max reviews per day"
            value={settings.maxReviewsPerDay}
            onChange={(value) => updateDeckSetting(selectedDeck.id, 'maxReviewsPerDay', value)}
          />
          <ToggleSetting
            checked={settings.downloadOffline}
            label="Download for offline"
            onChange={(value) => updateDeckSetting(selectedDeck.id, 'downloadOffline', value)}
          />
          <button
            className="mt-6 border border-red-300 px-6 py-4 text-sm text-red-700"
            onClick={(e) => {
              e.stopPropagation()
              resetDeckProgress(selectedDeck.id)
            }}
          >
            Reset deck progress
          </button>
        </div>
      </>
    )
  }

  const Study = () => {
    const card = studyCards[cardIndex]
    const note = useLiveQuery(() => (card ? db.notes.get(card.noteId) : undefined), [card?.noteId])

    const review = async (card: StoredCard, grade: Grade) => {
      const now = new Date()
      const studyDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const { card: fsrsCard } = scheduler.next(card.fsrsCard, now, grade)
      await db.transaction('rw', db.cards, db.decks, async () => {
        await db.cards.update(card.id, { fsrsCard })
        await db.decks
          .where('id')
          .equals(card.deckId)
          .modify((deck) => {
            if (deck.studyDay !== studyDay) {
              deck.studyDay = studyDay
              deck.newStudied = 0
              deck.reviewsStudied = 0
            }
            if (card.fsrsCard.state === State.New) {
              deck.newStudied++
            } else {
              deck.reviewsStudied++
            }
          })
      })

      if (cardIndex === studyCards.length - 1) {
        setReviewComplete(true)
      } else {
        setCardIndex((current) => current + 1)
        setFront(true)
      }
    }

    return (
      <>
        <div className="flex items-center gap-4 font-semibold">
          <button
            className="border border-gray-300 px-6 py-4 text-sm"
            onClick={(e) => {
              e.stopPropagation()
              setTab('decks')
            }}
          >
            Back
          </button>
        </div>

        {reviewComplete ? (
          <div className="flex flex-1 items-center justify-center">Review complete</div>
        ) : note ? (
          <NoteContent note={note} revealed={!front} />
        ) : null}

        {!reviewComplete && card && note ? (
          <div className="flex flex-col gap-4">
            {front ? (
              <button
                className="flex-1 border border-gray-300 px-6 py-4 text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFront(false)
                }}
              >
                Show back
              </button>
            ) : (
              <div className="flex flex-nowrap gap-2">
                <button
                  className="flex-1 bg-red-300 px-6 py-4 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Again)
                  }}
                >
                  Again
                </button>
                <button
                  className="flex-1 bg-orange-300 px-6 py-4 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Hard)
                  }}
                >
                  Hard
                </button>
                <button
                  className="flex-1 bg-blue-300 px-6 py-4 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Good)
                  }}
                >
                  Good
                </button>
                <button
                  className="flex-1 bg-green-300 px-6 py-4 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Easy)
                  }}
                >
                  Easy
                </button>
              </div>
            )}
          </div>
        ) : null}
      </>
    )
  }

  const Deck = () => (
    <>
      <div className="flex items-center gap-4 font-semibold">
        <button className="border border-gray-300 px-6 py-4 text-sm">Account</button>
        <button
          className="border border-gray-300 px-6 py-4 text-sm"
          onClick={(e) => {
            e.stopPropagation()
            setTab('settings')
          }}
        >
          Settings
        </button>
        <button
          className="border border-gray-300 px-6 py-4 text-sm"
          onClick={(e) => {
            e.stopPropagation()
            setShowAddDeck((p) => !p)
          }}
        >
          +
        </button>
      </div>

      {showAddDeck ? (
        <div className="flex flex-col gap-2 border border-dashed border-gray-300 px-6 py-4">
          <input
            {...{ webkitdirectory: '' }}
            disabled={importing}
            id="dirInput"
            name="dirInput"
            type="file"
            onChange={(event) => void loadDeck(event.currentTarget)}
          />
          {importError ? <p className="text-sm text-red-700">{importError}</p> : null}
        </div>
      ) : null}

      {/* Only this middle panel scrolls; the page shell stays fixed. */}
      <div className="flex min-h-0 flex-1 scrollbar-thin flex-col gap-2 overflow-y-auto overscroll-none">
        {decks.map((d) => (
          <div
            key={d.id}
            className="flex flex-col gap-4 border border-gray-300 px-6 py-4"
            onClick={(e) => {
              e.stopPropagation()
              setToggledDeckID((p) => (p === d.id ? null : d.id))
            }}
          >
            <div className="flex min-h-8 items-center gap-4">
              <div className="flex-1 select-none">
                <p className="w-fit select-text">{d.name}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-10 text-end text-green-700">{d.done}</span>
                <span className="w-10 text-end text-blue-700">{d.due}</span>
                <span className="w-10 text-end text-red-700">{d.todo}</span>
              </div>
            </div>

            {d.importStatus === 'importing' ? (
              <div className="flex items-center gap-3">
                <progress
                  aria-label={`Importing ${d.name}`}
                  className="flex-1"
                  max={d.totalBytes}
                  value={d.importedBytes}
                />
                <span className="text-sm">
                  {d.totalBytes ? Math.round((d.importedBytes / d.totalBytes) * 100) : 0}%
                </span>
              </div>
            ) : null}

            {isActive(d.id) && d.importStatus === 'ready' ? (
              <div className="flex items-center justify-between gap-2">
                <button
                  className="bg-primary px-8 py-2 text-sm text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    void startStudy(d.id)
                  }}
                >
                  Study
                </button>

                <div className="flex items-center gap-2">
                  <button
                    className={`border border-gray-300 px-4 py-2 text-sm ${dirty ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDirty(false)
                    }}
                  >
                    Sync
                  </button>
                  <button
                    className="border border-gray-300 px-4 py-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDeckID(d.id)
                      setTab('edit')
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="border border-gray-300 px-4 py-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDeckID(d.id)
                      setTab('browse')
                    }}
                  >
                    Browse
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  )

  let content = null
  switch (tab) {
    case 'decks': {
      content = <Deck />
      break
    }
    case 'study': {
      content = <Study />
      break
    }
    case 'edit': {
      content = <Edit />
      break
    }
    case 'browse': {
      content = <Browse />
      break
    }
    case 'settings': {
      content = <Settings />
      break
    }
  }

  return (
    <main className="mx-auto flex h-dvh max-w-xl flex-col overflow-hidden px-3 md:pt-4">
      <div className="flex min-h-0 flex-1 flex-col gap-4">{content}</div>
      <div className="flex h-[calc(env(safe-area-inset-bottom)+var(--bottom-corner-clearance))] items-center justify-center">
        <span className="text-sm">~13 min to clear</span>{' '}
      </div>
    </main>
  )
}

function Root() {
  const [tab, setTab] = useState<Tab>('decks')

  return (
    <NavContext value={{ tab, setTab }}>
      <App />
    </NavContext>
  )
}

export default Root
