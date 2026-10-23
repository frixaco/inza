import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { queueFor, decks } from '@inza/sample'
import { ease, printEase, Queue, Rise, Segmented, Slider, Stepper, Switch, Tag } from './ui'

const colours = [
  ['--ground', 'Ground'],
  ['--surface', 'Surface'],
  ['--raised', 'Raised'],
  ['--line', 'Line'],
  ['--ink', 'Ink'],
  ['--muted', 'Muted'],
  ['--faded', 'Faded ink · new'],
  ['--stamp', 'Stamp · again, learning'],
]

const type = [
  [
    'Title',
    'Paper Mono 26 / 700',
    { fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' },
    'Daily limits',
  ],
  [
    'Label',
    '12 / 600 · caps +0.08em',
    { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
    'Cards by state',
  ],
  ['Body', '14 / 400', { fontSize: 14 }, 'Reviews over this wait for tomorrow.'],
  ['Small', '12 / 400 · muted', { fontSize: 12, color: 'var(--muted)' }, 'Last run 2026-10-02'],
  [
    'Figure',
    'Paper Mono 56 / 700',
    { fontSize: 56, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 },
    '143',
  ],
  [
    'Prompt',
    'BIZ UDGothic 700 · 64–132',
    { fontFamily: 'var(--jp)', fontSize: 64, fontWeight: 700, lineHeight: 1 },
    '私',
  ],
] as const

const motions = [
  ['Press', 'scale 0.97 · 120ms ease-out'],
  ['Print', 'clip-path · 420ms in 12 line steps'],
  ['Tear off', 'translateY -110% · 200ms ease-out'],
  ['Sheet', 'translate 100% · 320ms drawer curve'],
]

export function System() {
  const [seg, setSeg] = useState('a')
  const [on, setOn] = useState(true)
  const [n, setN] = useState(20)
  const [r, setR] = useState(0.9)
  const [run, setRun] = useState(0)
  return (
    <div className="page">
      <Rise>
        <header className="head">
          <div>
            <h1>Receipt design system</h1>
            <p>
              One monospace face, paper slips on a grey counter, dashed rules and dot leaders. No
              hue; a red stamp marks what you got wrong.
            </p>
          </div>
        </header>
      </Rise>

      <section className="sys-block">
        <h2>Colour</h2>
        <div className="swatches">
          {colours.map(([v, name]) => (
            <div className="swatch" key={v}>
              <i style={{ background: `var(${v})` }} />
              <div>
                {name}
                <code>{v}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sys-block">
        <h2>Type</h2>
        {type.map(([name, spec, style, sample]) => (
          <div className="type-row" key={name}>
            <code>
              {name} · {spec}
            </code>
            <span style={style} lang={name === 'Prompt' ? 'ja' : undefined}>
              {sample}
            </span>
          </div>
        ))}
      </section>

      <section className="sys-block">
        <h2>Controls</h2>
        <div className="sys-row">
          <button className="btn btn-primary" onClick={() => toast('Primary pressed')}>
            Study 143 <ArrowRight size={16} />
          </button>
          <button className="btn">Secondary</button>
          <button className="btn btn-ghost">Ghost</button>
          <button className="btn btn-danger">Delete deck</button>
          <button className="btn" disabled>
            Disabled
          </button>
        </div>
        <div className="sys-row" style={{ marginTop: 16 }}>
          <Segmented
            label="Demo"
            value={seg}
            onChange={setSeg}
            options={[
              { value: 'a', label: 'Week' },
              { value: 'b', label: 'Month' },
              { value: 'c', label: 'All' },
            ]}
          />
          <Switch checked={on} onChange={setOn} label="Demo switch" />
          <Stepper value={n} onChange={setN} step={5} label="demo" />
          <div style={{ width: 200 }}>
            <Slider
              value={r}
              min={0.8}
              max={0.97}
              step={0.01}
              onChange={setR}
              label="Demo slider"
            />
          </div>
        </div>
        <div className="sys-row" style={{ marginTop: 16 }}>
          <Tag state="new" />
          <Tag state="learning" />
          <Tag state="review" />
          <Tag state="suspended" />
        </div>
      </section>

      <section className="sys-block">
        <h2>Signature: today's queue</h2>
        <p className="muted" style={{ marginBottom: 12 }}>
          One tick per card, in the order the session will show them. Blue is new, amber is
          learning, ink is review.
        </p>
        <Queue items={queueFor(decks[0])} position={14} />
      </section>

      <section className="sys-block">
        <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
          Motion
          <button className="btn" onClick={() => setRun((x) => x + 1)}>
            Replay
          </button>
        </h2>
        <div className="motion-demo">
          {motions.map(([name, spec], i) => (
            <div className="panel" key={name}>
              <b style={{ fontWeight: 500 }}>{name}</b>
              <span className="muted" style={{ fontSize: 12 }}>
                {spec}
              </span>
              <div className="track">
                <motion.i
                  key={run}
                  initial={
                    i === 1
                      ? { clipPath: 'inset(0 0 100% 0)', width: '100%' }
                      : i === 2
                        ? { y: 0 }
                        : i === 3
                          ? { x: '-100%', width: '100%' }
                          : { scale: 1 }
                  }
                  animate={
                    i === 1
                      ? { clipPath: 'inset(0 0 0% 0)' }
                      : i === 2
                        ? { y: -48 }
                        : i === 3
                          ? { x: 0 }
                          : { scale: [1, 0.97, 1] }
                  }
                  transition={{
                    duration: [0.24, 0.42, 0.2, 0.32][i],
                    ease: i === 3 ? ease.drawer : i === 1 ? printEase : ease.out,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
