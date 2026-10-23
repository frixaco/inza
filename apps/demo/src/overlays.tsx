import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Check,
  CircleNotch,
  FolderOpen,
  Image as ImageIcon,
  SpeakerHigh,
  X,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { assetUrl, browse, fmt, importFiles, importTotal } from './sample'
import { go } from './router'
import { ease, Sheet } from './ui'

type Phase = 'choose' | 'progress' | 'done' | 'error'

export function ImportSheet({
  open,
  initial,
  onClose,
}: {
  open: boolean
  initial: Phase
  onClose: () => void
}) {
  const [phase, setPhase] = useState<Phase>(initial)
  const [bytes, setBytes] = useState(0)
  const [over, setOver] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => setPhase(initial), [initial, open])
  useEffect(() => {
    if (phase !== 'progress') return
    setBytes(0)
    const t = setInterval(() => {
      setBytes((b) => {
        const next = Math.min(importTotal, b + importTotal / 28)
        if (next >= importTotal) {
          clearInterval(t)
          setTimeout(() => setPhase('done'), 250)
        }
        return next
      })
    }, 90)
    return () => clearInterval(t)
  }, [phase])

  let walked = 0
  const files = importFiles.map((f) => {
    const start = walked
    walked += f.bytes
    return { ...f, state: bytes >= walked ? 'done' : bytes > start ? 'active' : 'waiting' }
  })

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Import a deck"
      footer={
        phase === 'done' ? (
          <>
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={() => go('/deck/kaishi-1-5k')}>
              Open deck
            </button>
          </>
        ) : phase === 'error' ? (
          <>
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => setPhase('choose')}>
              Choose again
            </button>
          </>
        ) : phase === 'progress' ? (
          <button className="btn" onClick={() => setPhase('choose')}>
            Cancel import
          </button>
        ) : undefined
      }
    >
      {phase === 'choose' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div
            className="drop"
            data-over={over || undefined}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              setPhase('progress')
            }}
          >
            <FolderOpen size={32} weight="light" />
            <div>
              <b style={{ fontWeight: 500 }}>Drop an Open Deck folder or .zip here</b>
              <p>It needs a deck.yaml at the top level.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setPhase('progress')}>
              Choose folder
            </button>
          </div>
          <dl className="facts">
            <div>
              <dt>Note types</dt>
              <dd>Prompt and response, cloze, occlusion</dd>
            </div>
            <div>
              <dt>Media</dt>
              <dd>Images, audio and video next to the notes</dd>
            </div>
            <div>
              <dt>Where it goes</dt>
              <dd>This device only</dd>
            </div>
          </dl>
        </div>
      )}

      {phase === 'progress' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <p style={{ fontWeight: 500, marginBottom: 10 }}>Importing Kaishi 1.5k</p>
            <div className="progress">
              <i style={{ transform: `scaleX(${bytes / importTotal})` }} />
            </div>
            <div className="progress-ends">
              <span className="num">{fmt.bytes(bytes)}</span>
              <span className="num">{fmt.bytes(importTotal)}</span>
            </div>
          </div>
          <ul className="files">
            {files.map((f) => (
              <li key={f.path} data-state={f.state}>
                {f.state === 'done' ? (
                  <Check size={14} weight="bold" />
                ) : f.state === 'active' ? (
                  <motion.span
                    style={{ display: 'grid' }}
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  >
                    <CircleNotch size={14} />
                  </motion.span>
                ) : (
                  <span />
                )}
                <span>{f.path}</span>
                <span className="num">{fmt.bytes(f.bytes)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === 'done' && (
        <motion.div
          style={{ display: 'grid', gap: 20 }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: ease.out }}
        >
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>
              Kaishi 1.5k is ready.
            </h3>
            <p className="muted" style={{ marginTop: 6 }}>
              20 new cards are waiting for today.
            </p>
          </div>
          <dl className="kpis" style={{ ['--n' as string]: 3 }}>
            <div className="kpi">
              <dt>Notes</dt>
              <dd style={{ fontSize: 24 }}>1,500</dd>
            </div>
            <div className="kpi">
              <dt>Cards</dt>
              <dd style={{ fontSize: 24 }}>1,500</dd>
            </div>
            <div className="kpi">
              <dt>Media</dt>
              <dd style={{ fontSize: 24 }}>{fmt.bytes(importTotal)}</dd>
            </div>
          </dl>
        </motion.div>
      )}

      {phase === 'error' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="error-box" role="alert">
            <b>The deck was not imported.</b>
            <p style={{ marginTop: 4 }}>
              <code>notes/0251-0500.yaml</code>, note <code>kaishi-0377</code> has a field this
              version does not know: <code>hint</code>.
            </p>
          </div>
          <p className="muted">
            Nothing was saved, and your other decks are unchanged. Remove the field or update the
            deck, then try again.
          </p>
        </div>
      )}
    </Sheet>
  )
}

export function EditSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const note = browse.find((n) => n.id === id)
  const k = note?.kaishi
  return (
    <Sheet
      open={!!note}
      onClose={onClose}
      title="Edit note"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose()
              toast('Note saved')
            }}
          >
            Save
          </button>
        </>
      }
    >
      {note && (
        <form
          className="edit-form"
          style={{ display: 'grid', gap: 16 }}
          onSubmit={(e) => e.preventDefault()}
        >
          {k ? (
            <>
              <label className="field">
                <span>Word</span>
                <input className="input" lang="ja" defaultValue={k.word} />
              </label>
              <label className="field">
                <span>Reading</span>
                <input className="input" lang="ja" defaultValue={k.reading} />
              </label>
              <label className="field">
                <span>Meaning</span>
                <input className="input" defaultValue={k.meaning} />
              </label>
              <label className="field">
                <span>Sentence</span>
                <textarea className="textarea" lang="ja" defaultValue={k.sentence} rows={2} />
                <small>Wrap the word in &lt;strong&gt; to highlight it.</small>
              </label>
              <label className="field">
                <span>Sentence meaning</span>
                <input className="input" defaultValue={k.sentenceMeaning} />
              </label>
              <label className="field">
                <span>Notes</span>
                <textarea className="textarea" defaultValue={k.notes} rows={3} />
              </label>
              <div className="field">
                <span>Media</span>
                <ul className="files">
                  {k.image && (
                    <li>
                      <ImageIcon size={16} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={assetUrl(k.image)}
                          alt=""
                          width={32}
                          height={32}
                          style={{ objectFit: 'contain', background: '#fff' }}
                        />
                        {k.imageAlt}
                      </span>
                      <button
                        className="btn btn-ghost btn-icon"
                        aria-label="Remove image"
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  )}
                  {['Word audio', 'Sentence audio'].map((a) => (
                    <li key={a}>
                      <SpeakerHigh size={16} />
                      <span>{a}</span>
                      <button
                        className="btn btn-ghost btn-icon"
                        aria-label={`Remove ${a}`}
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <label className="field">
                <span>{note.type === 'cloze' ? 'Text' : 'Image description'}</span>
                <textarea
                  className="textarea"
                  lang="ja"
                  defaultValue={note.cloze?.html ?? 'Gojūon table'}
                  rows={3}
                />
                {note.type === 'cloze' && <small>Each data-cloze ID becomes one card.</small>}
              </label>
              <label className="field">
                <span>{note.type === 'cloze' ? 'Translation' : 'Masks'}</span>
                <input className="input" defaultValue={note.subtitle} />
              </label>
            </>
          )}
        </form>
      )}
    </Sheet>
  )
}
