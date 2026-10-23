// Phone grading: one pad, one gesture. Press, flick, release.
// Flicking past the dead zone picks a direction at once; holding still shows the
// four options as a guide; releasing in the centre leaves them open to tap.
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@phosphor-icons/react'
import type { Grade } from './sample'

export type Dir = 'up' | 'down' | 'left' | 'right'

const arms: { d: Dir; g: Grade; label: string; I: typeof ArrowUp; v: [number, number] }[] = [
  { d: 'up', g: 'easy', label: 'Easy', I: ArrowUp, v: [0, -1] },
  { d: 'left', g: 'again', label: 'Again', I: ArrowLeft, v: [-1, 0] },
  { d: 'right', g: 'good', label: 'Good', I: ArrowRight, v: [1, 0] },
  { d: 'down', g: 'hard', label: 'Hard', I: ArrowDown, v: [0, 1] },
]
const DEAD = 22 // px before a direction counts
const HOLD = 170 // ms of stillness before the guide appears
const spring = { type: 'spring', stiffness: 620, damping: 36, mass: 0.7 } as const

const weight = { stiffness: 340, damping: 26, mass: 1.15 }
const NEAR = 26 // px of travel toward an option for its full proximity lift

// Positions one option and lifts it by how far the square has travelled
// toward it: a diagonal lifts both neighbours, straight on lifts one.
function Slot({
  d,
  v: [vx, vy],
  x,
  y,
  reduce,
  children,
}: {
  d: Dir
  v: [number, number]
  x: MotionValue<number>
  y: MotionValue<number>
  reduce: boolean
  children: ReactNode
}) {
  const scale = useTransform(() => {
    if (reduce) return 1
    const along = Math.max(0, x.get() * vx + y.get() * vy)
    return 1 + 0.07 * Math.min(1, along / NEAR)
  })
  return (
    <motion.div className={`flick-slot arm-${d}`} style={{ scale }} exit={{ opacity: 1 }}>
      {children}
    </motion.div>
  )
}

// Follows the finger 1:1 up to the edge of the pad, then resists.
const rubber = (d: number) => {
  const a = Math.abs(d)
  return Math.sign(d) * (a < 26 ? a : 26 + (a - 26) * 0.22)
}
const buzz = (ms: number) => navigator.vibrate?.(ms)

export function FlickPad({
  iv,
  onGrade,
  onRoom,
}: {
  iv: Record<Grade, string>
  onGrade: (g: Grade, d: Dir) => void
  // While the options are open: the y the card must stay above so Easy has room.
  onRoom: (y: number | null) => void
}) {
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number; timer: number } | null>(null)
  const activeRef = useRef<Dir | null>(null)
  const [open, setOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [active, setActiveState] = useState<Dir | null>(null)
  const [fired, setFired] = useState<Dir | null>(null)
  const [learned] = useState(() => Number(localStorage.getItem('inza-flicks') ?? 0) >= 8)
  // px/py are where the finger says the square should be; sx/sy are where it
  // is. The square trails on a heavier spring, so it has a little weight.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, weight)
  const sy = useSpring(py, weight)

  const setActive = (d: Dir | null) => {
    if (d === activeRef.current) return
    activeRef.current = d
    setActiveState(d)
    if (d) buzz(6)
  }
  const home = () => {
    animate(px, 0, spring)
    animate(py, 0, spring)
  }
  const close = () => {
    setOpen(false)
    setSticky(false)
    setActive(null)
    home()
  }
  const fire = (d: Dir) => {
    if (fired) return
    setFired(d)
    buzz(14)
    localStorage.setItem(
      'inza-flicks',
      String(Number(localStorage.getItem('inza-flicks') ?? 0) + 1),
    )
    const [vx, vy] = arms.find((a) => a.d === d)!.v
    animate(px, vx * 44, { duration: 0.12, ease: [0.23, 1, 0.32, 1] })
    animate(py, vy * 44, { duration: 0.12, ease: [0.23, 1, 0.32, 1] })
    const g = arms.find((a) => a.d === d)!.g
    setTimeout(() => onGrade(g, d), reduce ? 0 : 110)
  }

  useEffect(() => {
    const stage = root.current?.querySelector('.flick-stage')
    onRoom(open && !fired && stage ? stage.getBoundingClientRect().top - 54 - 12 : null)
  }, [open, fired, onRoom])
  useEffect(() => () => onRoom(null), [onRoom])

  // A tap-opened guide closes on a tap anywhere else.
  useEffect(() => {
    if (!sticky) return
    const on = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close()
    }
    addEventListener('pointerdown', on)
    return () => removeEventListener('pointerdown', on)
  })

  const down = (e: PointerEvent) => {
    if (fired) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setPressed(true)
    start.current = {
      x: e.clientX,
      y: e.clientY,
      timer: window.setTimeout(() => setOpen(true), HOLD),
    }
  }
  const move = (e: PointerEvent) => {
    const s = start.current
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    px.set(rubber(dx))
    py.set(rubber(dy))
    if (Math.hypot(dx, dy) < DEAD) return setActive(null)
    clearTimeout(s.timer)
    setOpen(true)
    setActive(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down')
  }
  const up = () => {
    const s = start.current
    if (!s) return
    clearTimeout(s.timer)
    start.current = null
    setPressed(false)
    if (activeRef.current) return fire(activeRef.current)
    // Released in the centre (a tap, a hold, or a flick taken back):
    // leave the four options open for tapping.
    home()
    setOpen(true)
    setSticky(true)
  }
  const cancel = () => {
    if (start.current) clearTimeout(start.current.timer)
    start.current = null
    setPressed(false)
    close()
  }

  return (
    <div className="flick" ref={root}>
      {/* Screen readers and switch users get plain buttons. */}
      {arms.map(({ g, label }) => (
        <button
          key={g}
          className="sr-only"
          onClick={() => onGrade(g, arms.find((a) => a.g === g)!.d)}
        >
          {label}, {iv[g]}
        </button>
      ))}
      <div className="flick-stage" aria-hidden>
        <AnimatePresence>
          {open &&
            arms.map(({ d, g, label, I, v: [vx, vy] }, i) => {
              const on = active === d
              const off = (active && !on) || (fired && fired !== d)
              return (
                <Slot key={d} d={d} v={[vx, vy]} x={sx} y={sy} reduce={!!reduce}>
                  <motion.button
                    tabIndex={-1}
                    className={`flick-arm is-${g}${on ? ' on' : ''}`}
                    initial={
                      reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, x: vx * -26, y: vy * -26 }
                    }
                    animate={{
                      opacity: off ? 0.28 : 1,
                      scale: reduce ? 1 : fired === d ? 1.06 : on ? 1.02 : off ? 0.94 : 1,
                      x: reduce ? 0 : on ? vx * 4 : 0,
                      y: reduce ? 0 : on ? vy * 4 : 0,
                    }}
                    exit={
                      reduce
                        ? { opacity: 0, transition: { duration: 0.1 } }
                        : {
                            opacity: 0,
                            scale: 0.7,
                            x: vx * -18,
                            y: vy * -18,
                            transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
                          }
                    }
                    transition={{ ...spring, delay: active ? 0 : i * 0.012 }}
                    onClick={() => sticky && fire(d)}
                  >
                    <I size={14} weight="bold" />
                    <b>{label}</b>
                    <span>{iv[g]}</span>
                  </motion.button>
                </Slot>
              )
            })}
        </AnimatePresence>
        <motion.div
          className={`flick-pad${open ? ' is-open' : ''}`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={cancel}
          animate={{ scale: reduce ? 1 : pressed ? 0.94 : 1 }}
          transition={{ type: 'spring', stiffness: 900, damping: 40 }}
        >
          {!open &&
            arms.map(({ d, I }) => (
              <I key={d} className={`flick-chev chev-${d}`} size={10} weight="bold" />
            ))}
          <motion.span
            className={`flick-puck${active ? ` to-${active}` : ''}`}
            style={{ x: sx, y: sy }}
            animate={{ scale: reduce ? 1 : pressed ? 1.15 : 1, rotate: active ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 700, damping: 32 }}
          />
        </motion.div>
      </div>
      <motion.p
        className="flick-hint"
        animate={{ opacity: open || learned ? 0 : 1 }}
        transition={{ duration: 0.12 }}
        aria-hidden
      >
        Hold and flick
      </motion.p>
    </div>
  )
}
