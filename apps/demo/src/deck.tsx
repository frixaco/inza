import { useState } from 'react'
import { ArrowLeft, ArrowRight, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { deckCards, deckDue, decks, fmt, queueFor, settings } from './sample'
import { go } from './router'
import { Dialog, Queue, Rise, StatesBar, Stepper, Switch } from './ui'

export const stateColors = {
  new: 'var(--faded)',
  learning: 'var(--warning)',
  young: 'var(--control)',
  mature: 'var(--ink)',
  suspended: 'var(--raised)',
}

const typeLabel = {
  prompt_response: 'Prompt and response',
  cloze: 'Cloze',
  occlusion: 'Image occlusion',
}

export function DeckScreen({ id }: { id: string }) {
  const deck = decks.find((d) => d.id === id) ?? decks[0]
  const [inherit, setInherit] = useState(deck.newPerDay === null)
  const [newPerDay, setNewPerDay] = useState(deck.newPerDay ?? settings.newPerDay)
  const [reviews, setReviews] = useState(deck.reviewsPerDay ?? settings.reviewsPerDay)
  const [confirm, setConfirm] = useState<'reset' | 'delete' | null>(null)
  const total = deckCards(deck)
  const due = deckDue(deck)
  const parts = (Object.keys(stateColors) as (keyof typeof stateColors)[]).map((k) => ({
    key: k,
    value: deck.cards[k],
    color: stateColors[k],
  }))

  return (
    <div className="page">
      <a className="back" href="#/">
        <ArrowLeft size={16} /> Today
      </a>
      <Rise>
        <header className="head">
          <div>
            <h1>{deck.name}</h1>
            <p>{deck.description}</p>
          </div>
          <div className="head-actions">
            <button className="btn" onClick={() => go(`/browse?deck=${deck.id}`)}>
              <MagnifyingGlass size={16} /> Browse
            </button>
            <button
              className="btn btn-primary"
              disabled={due === 0}
              onClick={() => go(`/study/${deck.id}`)}
            >
              {due === 0 ? 'Nothing due' : `Study ${due}`}
              {due > 0 && <ArrowRight size={16} />}
            </button>
          </div>
        </header>
      </Rise>

      <Rise i={1}>
        <dl className="kpis" style={{ ['--n' as string]: 4 }}>
          <div className="kpi">
            <dt>New today</dt>
            <dd>{deck.today.new}</dd>
          </div>
          <div className="kpi">
            <dt>Learning</dt>
            <dd>{deck.today.learn}</dd>
          </div>
          <div className="kpi">
            <dt>Review</dt>
            <dd>{deck.today.review}</dd>
          </div>
          <div className="kpi">
            <dt>Cards</dt>
            <dd>{fmt.int(total)}</dd>
            <span className="sub">{fmt.int(deck.notes)} notes</span>
          </div>
        </dl>
      </Rise>

      {due > 0 && (
        <Rise i={2}>
          <div className="panel" style={{ marginTop: 'var(--gap)' }}>
            <h2 className="section-title">Today's queue</h2>
            <Queue items={queueFor(deck)} />
          </div>
        </Rise>
      )}

      <div className="grid" style={{ marginTop: 'var(--gap)' }}>
        <Rise i={3} className="span-7">
          <section className="panel" aria-labelledby="cards-title" style={{ height: '100%' }}>
            <h2 className="section-title" id="cards-title">
              Cards by state
            </h2>
            <StatesBar parts={parts} />
            <table className="legend-table">
              <tbody>
                {parts.map((p) => (
                  <tr key={p.key}>
                    <td>
                      <i
                        className="dot"
                        style={{ background: p.color, outline: '1px solid var(--line)' }}
                      />
                      {p.key[0].toUpperCase() + p.key.slice(1)}
                    </td>
                    <td className="r num">{fmt.int(p.value)}</td>
                    <td className="r num muted" style={{ width: 80 }}>
                      {fmt.pct(p.value / total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </Rise>
        <Rise i={4} className="span-5">
          <section className="panel" aria-labelledby="opts-title" style={{ height: '100%' }}>
            <h2 className="section-title" id="opts-title">
              Daily limits
            </h2>
            <div className="option-row">
              <div>
                <b>Use global limits</b>
                <span>
                  {settings.newPerDay} new · {settings.reviewsPerDay} reviews a day
                </span>
              </div>
              <Switch checked={inherit} onChange={setInherit} label="Use global limits" />
            </div>
            <div className="option-row" style={{ opacity: inherit ? 0.5 : 1 }}>
              <div>
                <b>New cards a day</b>
                <span>
                  {newPerDay === 0
                    ? 'Paused'
                    : `${Math.ceil(deck.cards.new / Math.max(newPerDay, 1))} days to finish`}
                </span>
              </div>
              <Stepper value={newPerDay} onChange={setNewPerDay} step={5} label="new cards a day" />
            </div>
            <div className="option-row" style={{ opacity: inherit ? 0.5 : 1 }}>
              <div>
                <b>Maximum reviews a day</b>
                <span>Reviews over this wait for tomorrow</span>
              </div>
              <Stepper value={reviews} onChange={setReviews} step={10} label="reviews a day" />
            </div>
          </section>
        </Rise>
      </div>

      <Rise i={5}>
        <dl className="kpis facts-strip" style={{ ['--n' as string]: 4, marginTop: 'var(--gap)' }}>
          <div className="kpi">
            <dt>Note type</dt>
            <dd>{typeLabel[deck.type]}</dd>
          </div>
          <div className="kpi">
            <dt>Imported</dt>
            <dd className="num">{deck.importedAt.slice(0, 10)}</dd>
          </div>
          <div className="kpi">
            <dt>Last studied</dt>
            <dd>{fmt.relative(deck.lastStudied)}</dd>
          </div>
          <div className="kpi">
            <dt>On this device</dt>
            <dd className="num">{fmt.bytes(deck.sizeBytes)}</dd>
          </div>
        </dl>
      </Rise>

      <div className="danger">
        <div>
          <b>Reset or remove</b>
          <p>
            Resetting keeps the notes and forgets every review. Deleting removes the deck and its
            media.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-danger" onClick={() => setConfirm('reset')}>
            Reset progress
          </button>
          <button className="btn btn-danger" onClick={() => setConfirm('delete')}>
            Delete deck
          </button>
        </div>
      </div>

      <Dialog
        open={confirm !== null}
        title={confirm === 'reset' ? `Reset ${deck.name}?` : `Delete ${deck.name}?`}
        body={
          confirm === 'reset'
            ? `All ${fmt.int(total)} cards return to new. Your notes stay.`
            : `${fmt.int(deck.notes)} notes, ${fmt.int(total)} cards and ${fmt.bytes(deck.sizeBytes)} of media leave this device.`
        }
        confirm={confirm === 'reset' ? 'Reset progress' : 'Delete deck'}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          toast(confirm === 'reset' ? `${deck.name} reset` : `${deck.name} deleted`, {
            action: { label: 'Undo', onClick: () => {} },
          })
        }}
      />
    </div>
  )
}
