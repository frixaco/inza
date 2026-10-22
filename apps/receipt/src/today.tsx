import { ArrowRight, CaretRight, DownloadSimple, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  decks,
  deckDue,
  fmt,
  forecast,
  history,
  month,
  queueFor,
  streak,
  today,
  totalDue,
  totals,
  type Deck,
} from '@inza/sample'
import { go } from './router'
import { Queue, Rise } from './ui'

// "Study all" mixes decks in proportion, so each deck's cards are spread through the session.
export const allQueue = decks
  .flatMap((d) => queueFor(d).map((q, i, all) => ({ ...q, at: (i + 0.5) / all.length })))
  .sort((a, b) => a.at - b.at)

const secondsPerCard = month.seconds / month.reviews
const reviewedToday = history[history.length - 1].reviews

export function Count({ n }: { n: number }) {
  return <span className={`num ${n === 0 ? 'zero' : ''}`}>{n === 0 ? '0' : fmt.int(n)}</span>
}

function deckNote(d: Deck) {
  if (d.newPerDay === 0 && deckDue(d) === 0) return 'Paused · new cards set to 0 a day'
  if (deckDue(d) === 0) return 'Nothing due today'
  return `${fmt.int(d.notes)} ${d.notes === 1 ? 'note' : 'notes'} · studied ${fmt.relative(d.lastStudied).toLowerCase()}`
}

export function Today() {
  const lead = decks[0]
  const next7 = forecast.slice(0, 7)
  const maxNext = Math.max(...next7.map((d) => d.reviews))
  return (
    <div className="page">
      <Rise>
        <header className="head">
          <div>
            <h1>Today</h1>
            <p className="stamp-line">
              <span className="num">
                {fmt.weekday(today).toUpperCase()}{' '}
                {today.toLocaleDateString('en-GB').replace(/\//g, '.')}{' '}
                {today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span>{reviewedToday} reviewed</span>
              <span>{streak}-day streak</span>
            </p>
          </div>
        </header>
      </Rise>

      <Rise i={1}>
        <section className="today-lead" aria-labelledby="due-title">
          <div>
            <div className="today-figure">
              <span className="num" id="due-title">
                {totalDue}
              </span>
              <p>cards left today</p>
            </div>
            <div className="today-split">
              <span>
                <i className="dot" style={{ background: 'var(--faded)' }} />
                New <b className="num">{totals.new}</b>
              </span>
              <span>
                <i className="dot" style={{ background: 'var(--warning)' }} />
                Learning <b className="num">{totals.learn}</b>
              </span>
              <span>
                <i className="dot" style={{ background: 'var(--ink)' }} />
                Review <b className="num">{totals.review}</b>
              </span>
              <span>About {fmt.minutes(totalDue * secondsPerCard)} at your pace</span>
            </div>
            <p className="today-split" style={{ marginTop: 6 }}>
              {lead.name} holds {deckDue(lead)} of them.
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => go('/study/all')}>
            Study all
            <ArrowRight size={18} />
          </button>
          <div className="queue-wrap">
            <Queue items={allQueue} />
            <div className="queue-legend">
              <span>Card 1</span>
              <span>New cards are spread through the reviews</span>
              <span className="num">{totalDue}</span>
            </div>
          </div>
        </section>
      </Rise>

      <div className="grid" style={{ marginTop: 'var(--gap)' }}>
        <Rise i={2} className="span-8">
          <section
            className="panel panel-col"
            aria-labelledby="decks-title"
            style={{ height: '100%' }}
          >
            <h2 className="section-title" id="decks-title">
              Decks{' '}
              <span className="muted num" style={{ fontSize: 13 }}>
                {decks.length}
              </span>
            </h2>
            <table className="ledger ledger-decks">
              <thead>
                <tr>
                  <th>Deck</th>
                  <th className="r">New</th>
                  <th className="r">Learn</th>
                  <th className="r">Review</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {decks.map((d) => (
                  <tr key={d.id} onClick={() => go(`/deck/${d.id}`)}>
                    <td>
                      <div className="deck-name">
                        <b>{d.name}</b>
                        <span>{deckNote(d)}</span>
                      </div>
                    </td>
                    <td className="r">
                      <Count n={d.today.new} />
                    </td>
                    <td className="r">
                      <Count n={d.today.learn} />
                    </td>
                    <td className="r">
                      <Count n={d.today.review} />
                    </td>
                    <td className="r" style={{ width: 28 }}>
                      <CaretRight size={14} className="muted" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="deck-rows">
              {decks.map((d) => (
                <button key={d.id} className="deck-row" onClick={() => go(`/deck/${d.id}`)}>
                  <div className="deck-name">
                    <b>{d.name}</b>
                    <span>{deckNote(d)}</span>
                  </div>
                  <div className="counts">
                    <span style={{ color: 'var(--faded)' }}>
                      <Count n={d.today.new} />
                    </span>
                    <span style={{ color: 'var(--warning)' }}>
                      <Count n={d.today.learn} />
                    </span>
                    <Count n={d.today.review} />
                  </div>
                </button>
              ))}
            </div>
            <div className="panel-foot">
              <button className="btn" onClick={() => go('/import')}>
                <DownloadSimple size={16} />
                Import deck
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => toast('New deck created', { description: 'Add notes from Browse.' })}
              >
                <Plus size={16} />
                New deck
              </button>
            </div>
          </section>
        </Rise>

        <Rise i={3} className="span-4">
          <section className="panel" aria-labelledby="next-title" style={{ height: '100%' }}>
            <h2 className="section-title" id="next-title">
              Next 7 days
              <a href="#/stats">Forecast</a>
            </h2>
            <dl className="leaders">
              {next7.map((d, i) => (
                <div key={i}>
                  <dt>
                    {i === 0 ? 'Tomorrow' : fmt.weekday(d.date)}&nbsp;
                    <span className="muted">{fmt.dayMonth(d.date)}</span>
                  </dt>
                  <dd className={`num ${d.reviews === maxNext ? 'strong' : ''}`}>{d.reviews}</dd>
                </div>
              ))}
            </dl>
            <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>
              Heaviest day in bold. New cards are not included.
            </p>
          </section>
        </Rise>
      </div>
    </div>
  )
}
