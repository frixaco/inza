import { useState } from 'react'
import { toast } from 'sonner'
import { decks, fmt, settings, storageUsed } from '@inza/sample'
import { Dialog, Rise, Segmented, Slider, Stepper, Switch } from './ui'

export type Theme = 'system' | 'light' | 'dark'
export const applyTheme = (t: Theme) => {
  if (t === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
  localStorage.setItem('inza-theme', t)
}

// A rough FSRS workload curve: reviews a day grow as the target retention rises.
const workload = (r: number) => Math.round(112 * ((1 / r - 1) / (1 / 0.9 - 1)) ** -0.55)

export function Settings() {
  const [newPerDay, setNewPerDay] = useState(settings.newPerDay)
  const [reviews, setReviews] = useState(settings.reviewsPerDay)
  const [target, setTarget] = useState(settings.desiredRetention)
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('inza-theme') as Theme) ?? 'system',
  )
  const [optimizing, setOptimizing] = useState(false)
  const [confirm, setConfirm] = useState<'reset' | 'wipe' | null>(null)
  const unseen = decks.reduce((s, d) => s + (d.newPerDay === 0 ? 0 : d.cards.new), 0)

  return (
    <div className="page settings">
      <Rise>
        <header className="head">
          <div>
            <h1>Settings</h1>
            <p>Every change saves on this device as you make it.</p>
          </div>
        </header>
      </Rise>

      <Rise i={1}>
        <section className="set-row" aria-labelledby="limits">
          <div className="set-label">
            <h2 id="limits">Daily limits</h2>
            <p>Applies to every deck that has no limits of its own.</p>
            <p className="summary">
              At {newPerDay} a day, the {fmt.int(unseen)} unseen cards take{' '}
              <b className="num">{newPerDay ? Math.ceil(unseen / newPerDay) : '—'}</b> days.
            </p>
          </div>
          <div className="set-panel">
            <div className="set-item">
              <div>
                <b>New cards a day</b>
                <span>Introduced in the order the deck lists them</span>
              </div>
              <Stepper value={newPerDay} onChange={setNewPerDay} step={5} label="new cards a day" />
            </div>
            <div className="set-item">
              <div>
                <b>Maximum reviews a day</b>
                <span>New cards stop once this is reached</span>
              </div>
              <Stepper value={reviews} onChange={setReviews} step={10} label="reviews a day" />
            </div>
          </div>
        </section>
      </Rise>

      <Rise i={2}>
        <section className="set-row" aria-labelledby="fsrs">
          <div className="set-label">
            <h2 id="fsrs">Scheduler</h2>
            <p>FSRS picks each interval so you recall the card with this probability.</p>
          </div>
          <div className="set-panel">
            <div className="set-item stack">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <b>Desired retention</b>
                  <span>About {workload(target)} reviews a day at this target</span>
                </div>
                <span className="num" style={{ fontSize: 24, letterSpacing: '-0.04em' }}>
                  {fmt.pct(target, 0)}
                </span>
              </div>
              <Slider
                value={target}
                min={0.8}
                max={0.97}
                step={0.01}
                onChange={setTarget}
                label="Desired retention"
              />
              <div className="progress-ends" style={{ marginTop: -4 }}>
                <span>80% · fewer reviews</span>
                <span>97% · more reviews</span>
              </div>
            </div>
            <div className="set-item">
              <div>
                <b>Optimize parameters</b>
                <span>
                  Last run {settings.optimizedAt} · {fmt.int(settings.reviewsSinceOptimize)} reviews
                  since
                </span>
              </div>
              <button
                className="btn"
                disabled={optimizing}
                onClick={() => {
                  setOptimizing(true)
                  setTimeout(() => {
                    setOptimizing(false)
                    toast('Parameters updated from 4,912 reviews')
                  }, 1600)
                }}
              >
                {optimizing ? 'Optimizing…' : 'Optimize'}
              </button>
            </div>
            <div className="set-item stack">
              <span>FSRS-6 parameters</span>
              <div className="params">
                {settings.params.map((p, i) => (
                  <span key={i}>{p.toFixed(4)}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Rise>

      <Rise i={3}>
        <section className="set-row" aria-labelledby="appearance">
          <div className="set-label">
            <h2 id="appearance">Appearance</h2>
            <p>System follows your device's light or dark setting.</p>
          </div>
          <div className="set-panel">
            <div className="set-item">
              <b>Theme</b>
              <Segmented
                label="Theme"
                value={theme}
                onChange={(t) => {
                  setTheme(t)
                  applyTheme(t)
                }}
                options={[
                  { value: 'system', label: 'System' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </div>
          </div>
        </section>
      </Rise>

      <Rise i={4}>
        <section className="set-row" aria-labelledby="sync">
          <div className="set-label">
            <h2 id="sync">Sync</h2>
            <p>Decks, reviews and settings stay on this device until you sign in.</p>
          </div>
          <div className="set-panel">
            <div className="set-item">
              <div>
                <b>Account</b>
                <span>Not signed in</span>
              </div>
              <button className="btn btn-primary">Sign in</button>
            </div>
            <div className="set-item">
              <div>
                <b>Sync automatically</b>
                <span>Sign in to turn this on</span>
              </div>
              <Switch checked={false} onChange={() => {}} label="Sync automatically" disabled />
            </div>
          </div>
        </section>
      </Rise>

      <Rise i={5}>
        <section className="set-row" aria-labelledby="storage">
          <div className="set-label">
            <h2 id="storage">Storage</h2>
            <p>Media is kept on this device so study works offline.</p>
          </div>
          <div className="set-panel">
            <div className="set-item stack">
              <div className="progress">
                <i style={{ transform: `scaleX(${storageUsed / settings.quotaBytes})` }} />
              </div>
              <div className="progress-ends" style={{ marginTop: 0 }}>
                <span className="num">{fmt.bytes(storageUsed)} used</span>
                <span className="num">{fmt.bytes(settings.quotaBytes)} available</span>
              </div>
            </div>
            {decks.map((d) => (
              <div className="set-item" key={d.id} style={{ minHeight: 48 }}>
                <span style={{ color: 'var(--ink)', fontSize: 14 }}>{d.name}</span>
                <span className="num">{fmt.bytes(d.sizeBytes)}</span>
              </div>
            ))}
            <div className="set-item" style={{ minHeight: 48 }}>
              <span style={{ color: 'var(--ink)', fontSize: 14 }}>Review history</span>
              <span className="num">{fmt.bytes(settings.reviewLogBytes)}</span>
            </div>
          </div>
        </section>
      </Rise>

      <div className="danger">
        <div>
          <b>Start over</b>
          <p>Reset every deck to new, or erase all decks, reviews and settings from this device.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-danger" onClick={() => setConfirm('reset')}>
            Reset all progress
          </button>
          <button className="btn btn-danger" onClick={() => setConfirm('wipe')}>
            Erase everything
          </button>
        </div>
      </div>
      <Dialog
        open={confirm !== null}
        title={confirm === 'reset' ? 'Reset all progress?' : 'Erase everything on this device?'}
        body={
          confirm === 'reset'
            ? `Reviews for all ${decks.length} decks are forgotten. Notes and media stay.`
            : `${decks.length} decks and ${fmt.bytes(storageUsed)} of data are removed. This cannot be undone.`
        }
        confirm={confirm === 'reset' ? 'Reset progress' : 'Erase everything'}
        onClose={() => setConfirm(null)}
        onConfirm={() => setConfirm(null)}
      />
    </div>
  )
}
