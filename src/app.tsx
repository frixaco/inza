import * as stylex from '@stylexjs/stylex'
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
  const [globalSettings, setGlobalSettings] = useState(defaultGlobalSettings)
  const decks = useLiveQuery(
    async () => {
      await dbReady
      const now = new Date()
      const studyDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

      return Promise.all(
        (await db.decks.toArray()).map(async (deck) => {
          const newStudied = deck.studyDay === studyDay ? deck.newStudied : 0
          const reviewsStudied = deck.studyDay === studyDay ? deck.reviewsStudied : 0
          const reviewLimit = Math.max(
            0,
            Math.floor(globalSettings.maxReviewsPerDay) - newStudied - reviewsStudied,
          )
          const newLimit = Math.max(0, Math.floor(globalSettings.newCardsPerDay) - newStudied)
          const dueCards = await db.cards
            .where('[deckId+fsrsCard.due]')
            .between([deck.id, Dexie.minKey], [deck.id, now], true, true)
            .filter(({ fsrsCard }) => fsrsCard.state !== State.New)
            .limit(reviewLimit)
            .toArray()
          const newCards = await db.cards
            .where('[deckId+fsrsCard.state]')
            .equals([deck.id, State.New])
            .limit(Math.min(newLimit, reviewLimit - dueCards.length))
            .count()

          return {
            ...deck,
            learn: dueCards.filter(
              ({ fsrsCard }) =>
                fsrsCard.state === State.Learning || fsrsCard.state === State.Relearning,
            ).length,
            new: newCards,
            review: dueCards.filter(({ fsrsCard }) => fsrsCard.state === State.Review).length,
          }
        }),
      )
    },
    [globalSettings],
    [],
  )
  const [toggledDeckID, setToggledDeckID] = useState<string | null>(null)
  const [selectedDeckID, setSelectedDeckID] = useState<string | null>(null)
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
    await db.transaction('rw', db.decks, db.cards, async () => {
      await db.cards.where('deckId').equals(deckID).modify({ fsrsCard: createEmptyCard() })
      await db.decks.update(deckID, {
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
    <div {...stylex.props(styles.settingRow)}>
      <span {...stylex.props(styles.grow, styles.textSmall)}>{label}</span>
      <input
        {...stylex.props(styles.numberInput)}
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
    <div {...stylex.props(styles.settingRow)}>
      <span {...stylex.props(styles.grow, styles.textSmall)}>{label}</span>
      <input
        checked={checked}
        {...stylex.props(styles.checkbox)}
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
        <div {...stylex.props(styles.row, styles.spaceBetween, styles.semibold)}>
          <button
            {...stylex.props(styles.button)}
            onClick={(e) => {
              e.stopPropagation()
              setTab('decks')
            }}
          >
            Back
          </button>
          <button {...stylex.props(styles.button)}>Delete</button>
        </div>

        <div {...stylex.props(styles.scrollPanel)}>
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
      <div {...stylex.props(styles.row, styles.semibold)}>
        <button
          {...stylex.props(styles.button)}
          onClick={(e) => {
            e.stopPropagation()
            setTab('decks')
          }}
        >
          Back
        </button>
      </div>

      <div {...stylex.props(styles.pane)}>
        <h1 {...stylex.props(styles.heading)}>Settings</h1>
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
        <button {...stylex.props(styles.button, styles.danger)} onClick={() => void devReset()}>
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
        <div {...stylex.props(styles.row, styles.semibold)}>
          <button
            {...stylex.props(styles.button)}
            onClick={(e) => {
              e.stopPropagation()
              setTab('decks')
            }}
          >
            Back
          </button>
        </div>

        <div {...stylex.props(styles.pane)}>
          <h1 {...stylex.props(styles.heading)}>{selectedDeck.name}</h1>
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
            {...stylex.props(styles.button, styles.danger, styles.topMargin)}
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
    const variantId = card?.variantId
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
        <div {...stylex.props(styles.row, styles.semibold)}>
          <button
            {...stylex.props(styles.button)}
            onClick={(e) => {
              e.stopPropagation()
              setTab('decks')
            }}
          >
            Back
          </button>
        </div>

        {reviewComplete ? (
          <div {...stylex.props(styles.centered)}>Review complete</div>
        ) : note ? (
          <NoteContent note={note} revealed={!front} variantId={variantId} />
        ) : null}

        {!reviewComplete && card && note ? (
          <div {...stylex.props(styles.studyActions)}>
            {front ? (
              <button
                {...stylex.props(styles.button, styles.grow)}
                onClick={(e) => {
                  e.stopPropagation()
                  setFront(false)
                }}
              >
                Show back
              </button>
            ) : (
              <div {...stylex.props(styles.ratingRow)}>
                <button
                  {...stylex.props(styles.ratingButton, styles.again)}
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Again)
                  }}
                >
                  Again
                </button>
                <button
                  {...stylex.props(styles.ratingButton, styles.hard)}
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Hard)
                  }}
                >
                  Hard
                </button>
                <button
                  {...stylex.props(styles.ratingButton, styles.good)}
                  onClick={(e) => {
                    e.stopPropagation()
                    void review(card, Rating.Good)
                  }}
                >
                  Good
                </button>
                <button
                  {...stylex.props(styles.ratingButton, styles.easy)}
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
      <div {...stylex.props(styles.row, styles.semibold)}>
        <button {...stylex.props(styles.button)}>Account</button>
        <button
          {...stylex.props(styles.button)}
          onClick={(e) => {
            e.stopPropagation()
            setTab('settings')
          }}
        >
          Settings
        </button>
        <button
          {...stylex.props(styles.button)}
          onClick={(e) => {
            e.stopPropagation()
            setShowAddDeck((p) => !p)
          }}
        >
          +
        </button>
      </div>

      {showAddDeck ? (
        <div {...stylex.props(styles.addDeck)}>
          <input
            {...{ webkitdirectory: '' }}
            disabled={importing}
            id="dirInput"
            name="dirInput"
            type="file"
            onChange={(event) => void loadDeck(event.currentTarget)}
          />
          {importError ? <p {...stylex.props(styles.error)}>{importError}</p> : null}
        </div>
      ) : null}

      {/* Only this middle panel scrolls; the page shell stays fixed. */}
      <div {...stylex.props(styles.scrollPanel, styles.thinScrollbar)}>
        {decks.map((d) => (
          <div
            key={d.id}
            {...stylex.props(styles.card)}
            onClick={(e) => {
              e.stopPropagation()
              setToggledDeckID((p) => (p === d.id ? null : d.id))
            }}
          >
            <div {...stylex.props(styles.deckHeader)}>
              <div {...stylex.props(styles.deckNameWrap)}>
                <p {...stylex.props(styles.deckName)}>{d.name}</p>
              </div>

              <div {...stylex.props(styles.row)}>
                <span {...stylex.props(styles.count, styles.greenText)} title="Due reviews">
                  {d.review}
                </span>
                <span {...stylex.props(styles.count, styles.blueText)} title="New">
                  {d.new}
                </span>
                <span {...stylex.props(styles.count, styles.redText)} title="Learning">
                  {d.learn}
                </span>
              </div>
            </div>

            {d.importStatus === 'importing' ? (
              <div {...stylex.props(styles.importRow)}>
                <progress
                  aria-label={`Importing ${d.name}`}
                  {...stylex.props(styles.grow)}
                  max={d.totalBytes}
                  value={d.importedBytes}
                />
                <span {...stylex.props(styles.textSmall)}>
                  {d.totalBytes ? Math.round((d.importedBytes / d.totalBytes) * 100) : 0}%
                </span>
              </div>
            ) : null}

            {isActive(d.id) && d.importStatus === 'ready' ? (
              <div {...stylex.props(styles.deckActions)}>
                <button
                  {...stylex.props(styles.primaryButton)}
                  onClick={(e) => {
                    e.stopPropagation()
                    void startStudy(d.id)
                  }}
                >
                  Study
                </button>

                <div {...stylex.props(styles.buttonGroup)}>
                  <button
                    {...stylex.props(styles.smallButton, dirty && styles.primary)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDirty(false)
                    }}
                  >
                    Sync
                  </button>
                  <button
                    {...stylex.props(styles.smallButton)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDeckID(d.id)
                      setTab('edit')
                    }}
                  >
                    Edit
                  </button>
                  <button
                    {...stylex.props(styles.smallButton)}
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
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.content)}>{content}</div>
      <div {...stylex.props(styles.safeArea)}>
        <span {...stylex.props(styles.textSmall)}>~13 min to clear</span>{' '}
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

const styles = stylex.create({
  addDeck: {
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBlock: '1rem',
    paddingInline: '1.5rem',
  },
  again: {
    backgroundColor: '#fca5a5',
  },
  blueText: {
    color: '#1d4ed8',
  },
  button: {
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: '0.875rem',
    paddingBlock: '1rem',
    paddingInline: '1.5rem',
  },
  buttonGroup: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  card: {
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingBlock: '1rem',
    paddingInline: '1.5rem',
  },
  centered: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  checkbox: {
    height: '1.25rem',
    width: '1.25rem',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '1rem',
    minHeight: 0,
  },
  count: {
    textAlign: 'end',
    width: '2.5rem',
  },
  danger: {
    borderColor: '#fca5a5',
    color: '#b91c1c',
  },
  deckActions: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'space-between',
  },
  deckHeader: {
    alignItems: 'center',
    display: 'flex',
    gap: '1rem',
    minHeight: '2rem',
  },
  deckName: {
    userSelect: 'text',
    width: 'fit-content',
  },
  deckNameWrap: {
    flex: 1,
    userSelect: 'none',
  },
  easy: {
    backgroundColor: '#86efac',
  },
  error: {
    color: '#b91c1c',
    fontSize: '0.875rem',
  },
  good: {
    backgroundColor: '#93c5fd',
  },
  greenText: {
    color: '#15803d',
  },
  grow: {
    flex: 1,
  },
  hard: {
    backgroundColor: '#fdba74',
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    paddingBottom: '1rem',
  },
  importRow: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.75rem',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    marginInline: 'auto',
    maxWidth: '36rem',
    overflow: 'hidden',
    paddingInline: '0.75rem',
    paddingTop: {
      default: 0,
      '@media (min-width: 768px)': '1rem',
    },
  },
  numberInput: {
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: '0.875rem',
    paddingBlock: '0.25rem',
    paddingInline: '0.5rem',
    textAlign: 'right',
    width: '5rem',
  },
  pane: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  primary: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  },
  primaryButton: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    fontSize: '0.875rem',
    paddingBlock: '0.5rem',
    paddingInline: '2rem',
  },
  ratingButton: {
    flex: 1,
    fontSize: '0.875rem',
    paddingBlock: '1rem',
    paddingInline: '1.5rem',
  },
  ratingRow: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '0.5rem',
  },
  redText: {
    color: '#b91c1c',
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '1rem',
  },
  safeArea: {
    alignItems: 'center',
    display: 'flex',
    height: 'calc(env(safe-area-inset-bottom) + var(--bottom-corner-clearance))',
    justifyContent: 'center',
  },
  scrollPanel: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '0.5rem',
    minHeight: 0,
    overflowY: 'auto',
    overscrollBehavior: 'none',
  },
  semibold: {
    fontWeight: 600,
  },
  settingRow: {
    alignItems: 'center',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
    minHeight: '3rem',
    paddingBlock: '0.5rem',
  },
  smallButton: {
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: '0.875rem',
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  studyActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  textSmall: {
    fontSize: '0.875rem',
  },
  thinScrollbar: {
    scrollbarWidth: 'thin',
  },
  topMargin: {
    marginTop: '1.5rem',
  },
})

export default Root
