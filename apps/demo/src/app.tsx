import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { CalendarCheck, ChartBar, GearSix, MagnifyingGlass, Swatches } from '@phosphor-icons/react'
import { Toaster } from 'sonner'
import { decks, deckDue, fmt, storageUsed, totalDue } from '@inza/sample'
import { Browse } from './browse'
import { DeckScreen } from './deck'
import { EditSheet, ImportSheet } from './overlays'
import { go, overlays, useRoute, type Route } from './router'
import { Settings } from './settings'
import { Stats } from './stats'
import { Study } from './study'
import { System } from './system'
import { Today } from './today'
import { Mark, usePhone } from './ui'

const tabs = [
  { id: 'today', href: '#/', label: 'Today', Icon: CalendarCheck, count: totalDue },
  { id: 'browse', href: '#/browse', label: 'Browse', Icon: MagnifyingGlass },
  { id: 'stats', href: '#/stats', label: 'Stats', Icon: ChartBar },
  { id: 'settings', href: '#/settings', label: 'Settings', Icon: GearSix },
]

let lastBase: Route = { path: [], query: new URLSearchParams() }
const hrefOf = (r: Route) =>
  `/${r.path.map(encodeURIComponent).join('/')}${r.query.size ? `?${r.query}` : ''}`

const titles: Record<string, string> = {
  '': 'Today',
  deck: 'Deck',
  stats: 'Stats',
  settings: 'Settings',
  system: 'Design system',
}

export function App() {
  const route = useRoute()
  const phone = usePhone()
  const isOverlay = overlays.has(route.path[0])
  if (!isOverlay) lastBase = route
  const base = lastBase
  const section = base.path[0] ?? ''
  const tab = section === 'deck' || section === '' ? 'today' : section
  const close = () => go(hrefOf(base))

  const mainRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll({ container: mainRef })
  const barOpacity = useTransform(scrollY, [28, 52], [0, 1])

  let screen
  if (section === 'deck') screen = <DeckScreen id={base.path[1]} key={base.path[1]} />
  else if (section === 'browse')
    screen = <Browse id={base.path[1]} deckParam={base.query.get('deck')} />
  else if (section === 'stats') screen = <Stats />
  else if (section === 'settings') screen = <Settings />
  else if (section === 'system') screen = <System />
  else screen = <Today />

  return (
    <div className="app">
      <nav className="nav" aria-label="Main">
        <a className="nav-brand" href="#/">
          <Mark />
          <span>Inza</span>
        </a>
        <div className="nav-list">
          {tabs.map(({ id, href, label, Icon, count }) => (
            <a
              key={id}
              className="nav-item"
              href={href}
              aria-current={tab === id ? 'page' : undefined}
            >
              <Icon size={phone ? 22 : 18} weight={tab === id ? 'fill' : 'regular'} />
              <span>{label}</span>
              {count !== undefined && <span className="count num">{count}</span>}
            </a>
          ))}
        </div>
        <div className="nav-group">
          <div className="nav-label">Decks</div>
          {decks.map((d) => (
            <a key={d.id} className="nav-deck" href={`#/deck/${d.id}`}>
              <span>{d.name}</span>
              <span className="num">{deckDue(d) || '—'}</span>
            </a>
          ))}
        </div>
        <div className="nav-foot">
          <span>
            <strong>This device only</strong> · not synced
          </span>
          <span className="num">{fmt.bytes(storageUsed)} stored</span>
          <a
            href="#/system"
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}
          >
            <Swatches size={14} /> Design system
          </a>
        </div>
      </nav>

      <main
        className="main"
        ref={mainRef}
        style={section === 'browse' ? { overflow: 'hidden' } : undefined}
      >
        {section !== 'browse' && (
          <motion.div className="titlebar" style={{ opacity: barOpacity }} aria-hidden>
            {section === 'deck' ? decks.find((d) => d.id === base.path[1])?.name : titles[section]}
          </motion.div>
        )}
        {screen}
      </main>

      <AnimatePresence>
        {route.path[0] === 'study' && (
          <Study key="study" deckId={route.path[1] ?? 'all'} onClose={close} />
        )}
      </AnimatePresence>
      <ImportSheet
        open={route.path[0] === 'import'}
        initial={route.query.has('error') ? 'error' : route.query.has('done') ? 'done' : 'choose'}
        onClose={close}
      />
      <EditSheet id={route.path[0] === 'edit' ? route.path[1] : null} onClose={close} />
      <Toaster
        position={phone ? 'top-center' : 'bottom-right'}
        toastOptions={{ duration: 4000 }}
        gap={8}
      />
    </div>
  )
}
