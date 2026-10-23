import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { ArrowCounterClockwise, ArrowRight, X } from '@phosphor-icons/react'
import {
  cloze,
  decks,
  fmt,
  history,
  intervals,
  kaishi,
  month,
  queueFor,
  today,
  type Grade,
  type QueueItem,
} from './sample'
import { ClozeFace, KaishiFace, KanaFace } from './faces'
import { allQueue } from './today'
import { ease, printEase, Queue } from './ui'
import { FlickPad, type Dir } from './flick'

const grades: { g: Grade; label: string; key: string }[] = [
  { g: 'again', label: 'Again', key: '1' },
  { g: 'hard', label: 'Hard', key: '2' },
  { g: 'good', label: 'Good', key: '3' },
  { g: 'easy', label: 'Easy', key: '4' },
]

// Which note a queue position shows: each deck walks through its own notes.
function contentAt(queue: QueueItem[], i: number) {
  const item = queue[i]
  const n = queue.slice(0, i).filter((q) => q.deckId === item.deckId).length
  return { item, n }
}

function Face({ item, n, revealed }: { item: QueueItem; n: number; revealed: boolean }) {
  if (item.deckId === 'particles')
    return <ClozeFace note={cloze[n % cloze.length]} revealed={revealed} />
  if (item.deckId === 'hiragana') return <KanaFace revealed={revealed} />
  return <KaishiFace note={kaishi[n % kaishi.length]} revealed={revealed} />
}

const flyOut = {
  left: { x: '-115%', rotate: -3, transition: { duration: 0.22, ease: ease.out } },
  right: { x: '115%', rotate: 3, transition: { duration: 0.22, ease: ease.out } },
  up: { y: '-112%', transition: { duration: 0.22, ease: ease.out } },
  down: { y: '18%', scale: 0.94, opacity: 0, transition: { duration: 0.2, ease: ease.out } },
}

// Phones grade with the flick pad; tablets and desktops get the bar and keys.
const phoneQuery = matchMedia('(max-width: 699px)')
const usePhone = () =>
  useSyncExternalStore(
    (on) => (
      phoneQuery.addEventListener('change', on),
      () => phoneQuery.removeEventListener('change', on)
    ),
    () => phoneQuery.matches,
  )

const kindLabel = { new: 'New', learning: 'Learning', review: 'Review' }

export function Study({ deckId, onClose }: { deckId: string; onClose: () => void }) {
  const queue =
    deckId === 'all' || deckId === 'done' ? allQueue : queueFor(decks.find((d) => d.id === deckId)!)
  const title =
    deckId === 'all' || deckId === 'done' ? 'All decks' : decks.find((d) => d.id === deckId)!.name
  const [index, setIndex] = useState(deckId === 'done' ? queue.length : 0)
  const [revealed, setRevealed] = useState(false)
  const [dir, setDir] = useState(1)
  const [instant, setInstant] = useState(false)
  const [tear, setTear] = useState(false)
  const [startedAt] = useState(() => Date.now())
  const phone = usePhone()
  const [fly, setFly] = useState<Dir | null>(null)
  const reduce = useReducedMotion()
  const stage = useRef<HTMLDivElement>(null)
  const [squash, setSquash] = useState({ x: 1, y: 1 })
  // Make room for the open flick options: squash the card from its top edge
  // until its foot clears them, and shrink it a little so it reads as depth.
  const onRoom = useCallback((limit: number | null) => {
    const card = stage.current?.querySelector('.study-card:not(.under)')
    if (limit === null || !card) return setSquash({ x: 1, y: 1 })
    const r = card.getBoundingClientRect()
    const y = Math.max(0.8, Math.min(1, (limit - r.top) / r.height))
    setSquash({ x: 1 - (1 - y) * 0.45, y })
  }, [])

  const grade = useCallback((g: Grade, via: 'key' | 'tap' | 'drag' | Dir = 'tap') => {
    setFly(via === 'up' || via === 'down' || via === 'left' || via === 'right' ? via : null)
    setInstant(via === 'key')
    setTear(via === 'tap')
    setDir(g === 'again' ? -1 : 1)
    setRevealed(false)
    setIndex((i) => i + 1)
  }, [])
  const reveal = (fromKey = false) => {
    setInstant(fromKey)
    setRevealed(true)
  }
  const done = index >= queue.length

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (done) return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (revealed) grade('good', 'key')
        else reveal(true)
      }
      const hit = grades.find((x) => x.key === e.key)
      if (hit && revealed) grade(hit.g, 'key')
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  })

  const left = queue.slice(index)
  const count = (k: string) => left.filter((q) => q.kind === k).length

  return (
    <motion.div
      className="study"
      role="dialog"
      aria-modal
      aria-label={`Study ${title}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.24, ease: ease.inOut } }}
      transition={{ duration: 0.42, ease: printEase }}
    >
      <div className="study-top">
        <button className="btn btn-ghost btn-icon" aria-label="End session" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="title">{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            className="num"
            aria-label="Cards left by state"
            style={{ display: 'flex', gap: 10 }}
          >
            <span style={{ color: 'var(--faded)' }}>{count('new')}</span>
            <span style={{ color: 'var(--warning)' }}>{count('learning')}</span>
            <span>{count('review')}</span>
          </span>
          <button
            className="btn btn-ghost btn-icon"
            aria-label="Undo last grade"
            disabled={index === 0 || done}
            style={{ border: 0 }}
            onClick={() => {
              setDir(-1)
              setRevealed(false)
              setIndex((i) => Math.max(0, i - 1))
            }}
          >
            <ArrowCounterClockwise size={18} />
          </button>
        </div>
      </div>
      <Queue items={queue} position={index} />

      {done ? (
        <Done
          queue={queue}
          reviewed={deckId === 'done' ? queue.length : index}
          seconds={(Date.now() - startedAt) / 1000}
          onClose={onClose}
        />
      ) : (
        <>
          <motion.div
            className="study-stage"
            ref={stage}
            style={{ transformOrigin: '50% 16px' }}
            animate={{ scaleX: squash.x, scaleY: squash.y }}
            transition={
              reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 40, mass: 0.8 }
            }
          >
            <AnimatePresence initial={false} custom={{ dir, instant, tear, fly }}>
              {[index + 1, index]
                .filter((i) => i < queue.length)
                .map((i) => (
                  <Card
                    key={i}
                    top={i === index}
                    queue={queue}
                    i={i}
                    revealed={i === index && revealed}
                    onReveal={() => reveal()}
                    onGrade={grade}
                  />
                ))}
            </AnimatePresence>
          </motion.div>
          <div className="study-bar">
            {revealed && phone ? (
              <FlickPad iv={intervals[queue[index].kind]} onGrade={grade} onRoom={onRoom} />
            ) : revealed ? (
              <motion.div
                className="grades"
                role="group"
                aria-label="Grade"
                initial={instant ? false : { clipPath: 'inset(0 0 0 100%)' }}
                animate={{ clipPath: 'inset(0 0 0 0%)' }}
                transition={{ duration: 0.22, ease: ease.out }}
              >
                {grades.map(({ g, label, key }) => (
                  <button key={g} className={`grade grade-${g}`} onClick={() => grade(g)}>
                    <span className="kbd">{key}</span>
                    <span className="num">{intervals[queue[index].kind][g]}</span>
                    <span className="g-label">{label}</span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <button className="btn btn-primary reveal" onClick={() => reveal()}>
                Show answer <span className="kbd">Space</span>
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}

function Card({
  top,
  queue,
  i,
  revealed,
  onReveal,
  onGrade,
}: {
  top: boolean
  queue: QueueItem[]
  i: number
  revealed: boolean
  onReveal: () => void
  onGrade: (g: Grade, via?: 'key' | 'tap' | 'drag' | Dir) => void
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const againHint = useTransform(x, [-140, -24], [1, 0])
  const goodHint = useTransform(x, [24, 140], [0, 1])
  const { item, n } = contentAt(queue, i)
  return (
    <>
      {top && revealed && (
        <>
          <motion.div
            className="study-hint left"
            style={{ opacity: againHint }}
            exit={{ opacity: 0 }}
            aria-hidden
          >
            Again
            <span className="num">{intervals[item.kind].again}</span>
          </motion.div>
          <motion.div
            className="study-hint right"
            style={{ opacity: goodHint }}
            exit={{ opacity: 0 }}
            aria-hidden
          >
            Good
            <span className="num">{intervals[item.kind].good}</span>
          </motion.div>
        </>
      )}
      <motion.article
        className={`study-card ${top ? '' : 'under'}`}
        style={{ x, zIndex: top ? 2 : 1 }}
        variants={{
          exit: ({
            dir,
            instant,
            tear,
            fly,
          }: {
            dir: number
            instant: boolean
            tear: boolean
            fly: Dir | null
          }) =>
            reduce || instant
              ? { opacity: 0, transition: { duration: instant ? 0 : 0.15 } }
              : fly
                ? // Flicked: the card leaves the way the thumb went.
                  flyOut[fly]
                : tear
                  ? // Torn off the top of the printer: a quick yank up with a slight twist.
                    {
                      y: '-112%',
                      rotate: dir < 0 ? -2.5 : 1.5,
                      transition: { duration: 0.2, ease: ease.out },
                    }
                  : { x: `${dir * 115}%`, transition: { duration: 0.2, ease: ease.out } },
        }}
        exit="exit"
        drag={top && revealed ? 'x' : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        dragTransition={{ bounceStiffness: 700, bounceDamping: 50 }}
        onDragEnd={(_, info) => {
          const v = info.velocity.x
          if (info.offset.x < -110 || v < -650) onGrade('again', 'drag')
          else if (info.offset.x > 110 || v > 650) onGrade('good', 'drag')
        }}
        onClick={() => top && !revealed && onReveal()}
        aria-hidden={!top}
      >
        <div className="meta">
          <span>{decks.find((d) => d.id === item.deckId)!.name}</span>
          <span>
            {kindLabel[item.kind]} · <span className="num">{i + 1}</span>
          </span>
        </div>
        <Face item={item} n={n} revealed={revealed} />
      </motion.article>
    </>
  )
}

/* The session slip: the one place the app prints a literal receipt. */
function Done({
  queue,
  reviewed,
  seconds,
  onClose,
}: {
  queue: QueueItem[]
  reviewed: number
  seconds: number
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const shown = Math.max(seconds, reviewed * (month.seconds / month.reviews))
  const done = queue.slice(0, reviewed)
  const again = Math.round(reviewed * 0.077)
  const perDeck = decks
    .map((d) => ({ name: d.name, n: done.filter((q) => q.deckId === d.id).length }))
    .filter((d) => d.n > 0)
  const session = history.filter((d) => d.reviews > 0).length
  const stamp = `${today.toLocaleDateString('en-GB').replace(/\//g, '.')} ${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  return (
    <div className="done">
      <h2>Done for today.</h2>
      <motion.div
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', y: -12 }}
        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)', y: 0 }}
        transition={{ duration: 0.9, ease: printEase, delay: 0.15 }}
      >
        <div className="slip" aria-label="Session summary">
          <div className="slip-head">
            <b>INZA</b>
            <span className="num">{stamp}</span>
          </div>
          <div className="slip-head" style={{ marginTop: 2 }}>
            <span>Session</span>
            <span className="num">No. {String(session).padStart(4, '0')}</span>
          </div>
          <hr />
          <dl className="leaders">
            {perDeck.map((d) => (
              <div key={d.name}>
                <dt>{d.name}</dt>
                <dd className="num">{d.n}</dd>
              </div>
            ))}
          </dl>
          <hr />
          <dl className="leaders">
            <div>
              <dt>Again</dt>
              <dd className="num" style={{ color: 'var(--stamp)' }}>
                {again}
              </dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd className="num">{fmt.minutes(shown)}</dd>
            </div>
            <div>
              <dt>Retention</dt>
              <dd className="num">{fmt.pct(1 - again / Math.max(reviewed, 1))}</dd>
            </div>
          </dl>
          <hr className="double" />
          <dl className="leaders total">
            <div>
              <dt>Cards</dt>
              <dd className="num">{reviewed}</dd>
            </div>
          </dl>
          <Queue items={done} />
          <p className="slip-foot">Next: 118 reviews tomorrow from 04:00</p>
        </div>
        <svg className="slip-tear" aria-hidden>
          <defs>
            <pattern id="tear" width="12" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 0h12v2L6 9 0 2z" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="10" fill="url(#tear)" />
        </svg>
      </motion.div>
      <div className="head-actions">
        <button className="btn btn-primary btn-lg" onClick={onClose}>
          Back to today <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
