import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, MagnifyingGlass, PencilSimple, Pause, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { browse, decks, fmt, reviewLog, type BrowseItem } from '@inza/sample'
import { ClozeFace, KaishiFace, KanaFace } from './faces'
import { go } from './router'
import { Dialog, ease, Segmented, Tag, usePhone } from './ui'

type Filter = 'all' | BrowseItem['state']
const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'learning', label: 'Learning' },
  { value: 'review', label: 'Review' },
  { value: 'suspended', label: 'Suspended' },
]

export function Browse({ id, deckParam }: { id?: string; deckParam?: string | null }) {
  const [q, setQ] = useState('')
  const [deck, setDeck] = useState(deckParam ?? 'all')
  const [filter, setFilter] = useState<Filter>('all')
  const phone = usePhone()
  const reduce = useReducedMotion()

  const inDeck = useMemo(() => browse.filter((n) => deck === 'all' || n.deckId === deck), [deck])
  const rows = inDeck.filter(
    (n) =>
      (filter === 'all' || n.state === filter) &&
      (!q ||
        `${n.title} ${n.subtitle} ${n.kaishi?.reading ?? ''}`
          .toLowerCase()
          .includes(q.toLowerCase())),
  )
  const selected = browse.find((n) => n.id === id) ?? (phone ? undefined : rows[0])
  const base = `/browse${deck !== 'all' ? `?deck=${deck}` : ''}`

  return (
    <div className="browse">
      <div className="browse-list">
        <div className="browse-tools">
          <h1>Browse</h1>
          <div className="row">
            <label className="search" style={{ flex: 1 }}>
              <MagnifyingGlass size={16} />
              <input
                className="input"
                type="search"
                placeholder="Word, reading or meaning"
                value={q}
                enterKeyHint="search"
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search notes"
              />
            </label>
          </div>
          <select
            className="select"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
            aria-label="Deck"
          >
            <option value="all">All decks</option>
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="chips" role="group" aria-label="Card state">
            {filters.map((f) => (
              <button
                key={f.value}
                className="chip"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                <span className="num">
                  {f.value === 'all'
                    ? inDeck.length
                    : inDeck.filter((n) => n.state === f.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="browse-count">
          {rows.length === inDeck.length
            ? `${rows.length} notes`
            : `${rows.length} of ${inDeck.length} notes`}
        </div>
        <div className="browse-scroll">
          {rows.map((n) => (
            <button
              key={n.id}
              className="note-row"
              aria-current={selected?.id === n.id}
              onClick={() =>
                go(`/browse/${encodeURIComponent(n.id)}${deck !== 'all' ? `?deck=${deck}` : ''}`)
              }
            >
              <span className="t" lang="ja">
                {n.title}
              </span>
              <Tag state={n.state} />
              <span className="s">{n.subtitle}</span>
              <span className="d">{n.due}</span>
            </button>
          ))}
          {rows.length === 0 && (
            <p className="muted" style={{ padding: 20 }}>
              No notes match “{q}”. Search looks at the word, its reading and its meaning.
            </p>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            key={phone ? selected.id : 'detail'}
            className="browse-detail"
            initial={phone && !reduce ? { x: '100%' } : false}
            animate={{ x: 0 }}
            exit={phone && !reduce ? { x: '100%' } : { opacity: 1 }}
            transition={{ duration: 0.3, ease: ease.drawer }}
            drag={phone ? 'x' : false}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 1 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100 || info.velocity.x > 500) go(base)
            }}
          >
            <Detail note={selected} onBack={() => go(base)} />
          </motion.div>
        ) : (
          !phone && (
            <div className="browse-detail">
              <div className="empty-detail">No note selected.</div>
            </div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

function Detail({ note, onBack }: { note: BrowseItem; onBack: () => void }) {
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [confirm, setConfirm] = useState(false)
  const phone = usePhone()
  const deck = decks.find((d) => d.id === note.deckId)!
  return (
    <article className="detail">
      {phone && (
        <button className="back" onClick={onBack}>
          <ArrowLeft size={16} /> Browse
        </button>
      )}
      <header className="detail-head">
        <div>
          <h2 lang="ja">{note.title}</h2>
          <p>
            {note.subtitle} · {deck.name}
          </p>
        </div>
        <div className="detail-actions">
          <button
            className="btn btn-icon"
            aria-label="Edit note"
            onClick={() => go(`/edit/${encodeURIComponent(note.id)}`)}
          >
            <PencilSimple size={18} />
          </button>
          <button
            className="btn btn-icon"
            aria-label="Suspend note"
            onClick={() =>
              toast(`Suspended ${note.title}`, { action: { label: 'Undo', onClick: () => {} } })
            }
          >
            <Pause size={18} />
          </button>
          <button
            className="btn btn-icon"
            aria-label="Delete note"
            onClick={() => setConfirm(true)}
          >
            <Trash size={18} />
          </button>
        </div>
      </header>

      <section className="preview" aria-label="Card preview">
        <div className="preview-bar">
          <span>Preview</span>
          <Segmented
            label="Side"
            value={side}
            onChange={setSide}
            options={[
              { value: 'front', label: 'Front' },
              { value: 'back', label: 'Back' },
            ]}
          />
        </div>
        {note.kaishi && <KaishiFace key={side} note={note.kaishi} revealed={side === 'back'} />}
        {note.cloze && <ClozeFace key={side} note={note.cloze} revealed={side === 'back'} />}
        {note.type === 'occlusion' && <KanaFace key={side} revealed={side === 'back'} />}
      </section>

      <h3 className="section-title" style={{ marginTop: 32 }}>
        Scheduling
      </h3>
      <dl className="sched">
        <div>
          <dt>State</dt>
          <dd style={{ fontFamily: 'var(--font)', fontSize: 16, paddingTop: 4 }}>
            <Tag state={note.state} />
          </dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd style={{ fontFamily: 'var(--font)', fontSize: 18 }}>{note.due}</dd>
        </div>
        <div>
          <dt>Retrievability</dt>
          <dd>{note.retrievability === null ? '—' : fmt.pct(note.retrievability, 0)}</dd>
        </div>
        <div>
          <dt>Stability</dt>
          <dd>
            {note.stability ?? '—'}
            {note.stability !== null && <small>days</small>}
          </dd>
        </div>
        <div>
          <dt>Difficulty</dt>
          <dd>
            {note.difficulty ?? '—'}
            {note.difficulty !== null && <small>/ 10</small>}
          </dd>
        </div>
        <div>
          <dt>Reviews · lapses</dt>
          <dd>
            {note.reps} · {note.lapses}
          </dd>
        </div>
      </dl>

      {note.reps > 0 && (
        <>
          <h3 className="section-title" style={{ marginTop: 32 }}>
            History
          </h3>
          <ol className="log">
            {reviewLog.map((r) => (
              <li key={r.date}>
                <span className="num muted">{r.date}</span>
                <span className={r.grade === 'again' ? 'grade-again' : undefined}>
                  {r.grade[0].toUpperCase() + r.grade.slice(1)}
                </span>
                <span className="num">{r.interval}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      <Dialog
        open={confirm}
        title={`Delete ${note.title}?`}
        body="The note and its cards are removed from this deck, along with their review history."
        confirm="Delete note"
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false)
          toast(`Deleted ${note.title}`, { action: { label: 'Undo', onClick: () => {} } })
        }}
      />
    </article>
  )
}
