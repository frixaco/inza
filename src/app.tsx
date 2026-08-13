import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, dbReady } from './db'
import { importDeck } from './import-deck'
import { Note, NoteContent } from './note'

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

  const resetDeckProgress = (deckID: string) => {
    const deck = decks.find((item) => item.id === deckID)
    if (!deck) return

    void db.decks.update(deckID, {
      done: 0,
      due: 0,
      todo: deck.done + deck.due + deck.todo,
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
    const [front, setFront] = useState(true)
    const [noteIndex, setNoteIndex] = useState(0)
    const note = useLiveQuery(
      () =>
        selectedDeckID
          ? db.notes.where('deckId').equals(selectedDeckID).offset(noteIndex).first()
          : undefined,
      [selectedDeckID, noteIndex],
    )

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

        {note ? (
          <NoteContent note={note} revealed={!front} />
        ) : (
          <div className="flex flex-1 items-center justify-center">No notes</div>
        )}

        {note ? (
          <div className="flex flex-col gap-4">
            {front ? (
              <button
                className="flex-1 bg-gray-300 px-6 py-4 text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFront(false)
                }}
              >
                Show back
              </button>
            ) : (
              <button
                className="flex-1 bg-blue-300 px-6 py-4 text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setNoteIndex((current) => (current + 1) % selectedDeck.todo)
                  setFront(true)
                }}
              >
                Next
              </button>
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
                    setSelectedDeckID(d.id)
                    setTab('study')
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
