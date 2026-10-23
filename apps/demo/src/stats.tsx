import { useState } from 'react'
import { cardStates, fmt, forecast, history } from '@inza/sample'
import { stateColors } from './deck'
import { Bars, Rise, Segmented, StatesBar } from './ui'

type Range = '7' | '30' | 'all'

export function Stats() {
  const [range, setRange] = useState<Range>('30')
  const days = range === 'all' ? history : history.slice(-Number(range))
  const reviews = days.reduce((s, d) => s + d.reviews, 0)
  const again = days.reduce((s, d) => s + d.again, 0)
  const seconds = days.reduce((s, d) => s + d.seconds, 0)
  const studied = days.filter((d) => d.reviews > 0).length
  const best = days.reduce((a, b) => (b.reviews > a.reviews ? b : a))
  const totalCards = Object.values(cardStates).reduce((s, n) => s + n, 0)
  const parts = (Object.keys(stateColors) as (keyof typeof stateColors)[]).map((k) => ({
    key: k,
    value: cardStates[k],
    color: stateColors[k],
  }))
  const missed = days.filter((d) => d.reviews === 0)

  return (
    <div className="page">
      <Rise>
        <header className="head">
          <div>
            <h1>Stats</h1>
            <p>
              {fmt.int(reviews)} reviews in{' '}
              {range === 'all' ? `${days.length} days` : `the last ${range} days`}
              {missed.length > 0 &&
                ` · missed ${missed.map((d) => fmt.dayMonth(d.date)).join(' and ')}`}
            </p>
          </div>
          <Segmented
            label="Range"
            value={range}
            onChange={setRange}
            options={[
              { value: '7', label: 'Week' },
              { value: '30', label: 'Month' },
              { value: 'all', label: 'All' },
            ]}
          />
        </header>
      </Rise>

      <Rise i={1}>
        <dl className="kpis" style={{ ['--n' as string]: 4 }}>
          <div className="kpi">
            <dt>Reviews</dt>
            <dd>{fmt.int(reviews)}</dd>
            <span className="sub">{Math.round(reviews / days.length)} a day on average</span>
          </div>
          <div className="kpi">
            <dt>Retention</dt>
            <dd>{fmt.pct(1 - again / reviews)}</dd>
            <span className="sub">Target 90.0%</span>
          </div>
          <div className="kpi">
            <dt>Time studied</dt>
            <dd>{fmt.minutes(seconds)}</dd>
            <span className="sub">{(seconds / reviews).toFixed(1)} s a card</span>
          </div>
          <div className="kpi">
            <dt>Days studied</dt>
            <dd>
              {studied}
              <small>/ {days.length}</small>
            </dd>
            <span className="sub">{fmt.pct(studied / days.length, 0)} of days</span>
          </div>
        </dl>
      </Rise>

      <div className="grid" style={{ marginTop: 'var(--gap)' }}>
        <Rise i={2} className="span-8">
          <section className="panel" aria-labelledby="per-day">
            <h2 className="section-title" id="per-day">
              Reviews a day
              <span className="muted" style={{ fontSize: 13 }}>
                Busiest {fmt.dayMonth(best.date)} · {best.reviews}
              </span>
            </h2>
            <Bars
              key={range}
              labelEvery={range === '7' ? 1 : 7}
              data={days.map((d, i) => ({
                label: range === '7' ? fmt.weekday(d.date) : fmt.dayMonth(d.date),
                value: d.reviews,
                hl: i === days.length - 1,
                tip: `${fmt.dayMonth(d.date)} · ${d.reviews} reviews · ${d.again} again`,
              }))}
            />
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Today is still printing, so its bar is hollow.
            </p>
          </section>
        </Rise>
        <Rise i={3} className="span-4">
          <section className="panel" aria-labelledby="states-title" style={{ height: '100%' }}>
            <h2 className="section-title" id="states-title">
              All cards <span className="num muted">{fmt.int(totalCards)}</span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </Rise>
        <Rise i={4} className="span-12">
          <section className="panel" aria-labelledby="forecast-title">
            <h2 className="section-title" id="forecast-title">
              Due in the next 30 days
              <span className="muted" style={{ fontSize: 13 }}>
                {fmt.int(forecast.reduce((s, d) => s + d.reviews, 0))} reviews, before new cards
              </span>
            </h2>
            <Bars
              height={160}
              data={forecast.map((d, i) => ({
                label: i === 0 ? 'Tomorrow' : fmt.dayMonth(d.date),
                value: d.reviews,
                soft: i > 6,
                tip: `${fmt.dayMonth(d.date)} · ${d.reviews} due`,
              }))}
            />
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              The next 7 days in ink; later days in grey change as you review.
            </p>
          </section>
        </Rise>
      </div>
    </div>
  )
}
