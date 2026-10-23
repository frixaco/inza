import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react'
import { X } from '@phosphor-icons/react'

/* A printer feeds paper in line steps: an ease-out quantised to 12 lines. */
export const printEase = (t: number) => Math.round((1 - (1 - t) ** 3) * 12) / 12

export const ease = {
  out: [0.23, 1, 0.32, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
  drawer: [0.32, 0.72, 0, 1] as const,
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}
export const usePhone = () => useMedia('(max-width: 699px)')

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

export function Mark() {
  // A slip with a torn foot and two printed lines.
  return (
    <svg className="mark" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 2h14v18l-2.33-1.5L14.33 20 12 18.5 9.67 20 7.33 18.5 5 20z" fill="var(--ink)" />
      <path d="M8 7h8M8 11h5" stroke="var(--on-ink)" strokeWidth="1.6" />
    </svg>
  )
}

/* Segmented control. The inverted copy is clipped to the active segment, so the
   label colour flips exactly where the ink edge passes (no colour cross-fade). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: ReactNode }[]
  onChange: (v: T) => void
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [clip, setClip] = useState('inset(0 100% 0 0)')
  const index = options.findIndex((o) => o.value === value)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => {
      const el = root.querySelectorAll('button')[index]
      if (!el) return
      const left = el.offsetLeft
      const right = root.clientWidth - left - el.offsetWidth
      setClip(`inset(0 ${right}px 0 ${left}px)`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [index])
  return (
    <div className="seg" role="radiogroup" aria-label={label} ref={ref}>
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
      <div className="seg-copy" style={{ clipPath: clip }} aria-hidden>
        {options.map((o) => (
          <span key={o.value}>{o.label}</span>
        ))}
      </div>
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      className="switch"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  )
}

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  label,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  label: string
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button aria-label={`Fewer ${label}`} onClick={() => onChange(Math.max(min, value - step))}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path d="M1 6h10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <output aria-live="polite">{value}</output>
      <button aria-label={`More ${label}`} onClick={() => onChange(Math.min(max, value + step))}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path d="M1 6h10M6 1v10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  )
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  label: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="slider" style={{ ['--fill' as string]: `${pct}%` }}>
      <i aria-hidden />
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

const stateLabel = { new: 'New', learning: 'Learning', review: 'Review', suspended: 'Suspended' }
export function Tag({ state }: { state: keyof typeof stateLabel }) {
  return <span className={`tag tag-${state}`}>{stateLabel[state]}</span>
}

/* Bars: square columns, 4 round y ticks above the max, one highlighted bar. */
function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw) return m * p
  return 10 * p
}
export function Bars({
  data,
  height = 200,
  labelEvery = 7,
}: {
  data: { label: string; value: number; hl?: boolean; soft?: boolean; tip: string }[]
  height?: number
  labelEvery?: number
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const max = Math.max(...data.map((d) => d.value), 1)
  const step = niceStep(max / 4)
  const top = Math.ceil((max + 0.0001) / step) * step
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
  const padL = 36
  const padB = 22
  const w = Math.max(0, width - padL)
  const h = height - padB
  const bw = w / data.length
  const gap = Math.min(4, bw * 0.25)
  const y = (v: number) => h - (v / top) * h
  return (
    <div ref={ref} style={{ position: 'relative' }} onPointerLeave={() => setHover(null)}>
      {width > 0 && (
        <svg className="chart" width={width} height={height} role="img" aria-label="Bar chart">
          {ticks.map((t) => (
            <g key={t}>
              <line
                className={t === 0 ? 'baseline' : 'gridline'}
                x1={padL}
                x2={width}
                y1={y(t)}
                y2={y(t)}
              />
              <text x={padL - 8} y={y(t) + 4} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          <motion.g
            initial={reduce ? false : { clipPath: `inset(100% 0 0 0)` }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 0.6, ease: ease.out }}
          >
            {data.map((d, i) => (
              <rect
                key={i}
                className="bar"
                data-hl={d.hl || undefined}
                data-soft={d.soft || undefined}
                x={padL + i * bw + gap / 2}
                y={y(d.value)}
                width={Math.max(1, bw - gap)}
                height={h - y(d.value)}
                opacity={hover === null || hover === i ? 1 : 0.35}
                style={{ transition: 'opacity 120ms ease' }}
              />
            ))}
          </motion.g>
          {data.map((d, i) =>
            (data.length - 1 - i) % labelEvery === 0 ? (
              <text
                key={i}
                x={padL + i * bw + bw / 2}
                y={height - 4}
                textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
              >
                {d.label}
              </text>
            ) : null,
          )}
          {data.map((_, i) => (
            <rect
              key={i}
              className="hit"
              x={padL + i * bw}
              y={0}
              width={bw}
              height={h}
              onPointerEnter={() => setHover(i)}
            />
          ))}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <div
          className="chart-tip"
          style={{ left: padL + hover * bw + bw / 2, top: y(data[hover].value) - 6 }}
        >
          {data[hover].tip}
        </div>
      )}
    </div>
  )
}

/* Today's queue: one tick per card in Anki's interleaved order. */
export function Queue({ items, position = 0 }: { items: { kind: string }[]; position?: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="queue" aria-hidden>
      {items.map((it, i) => (
        <motion.i
          key={i}
          data-k={it.kind}
          data-done={i < position || undefined}
          data-current={i === position && position > 0 ? true : undefined}
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.28, ease: ease.out, delay: Math.min(i, 160) * 0.003 }}
        />
      ))}
    </div>
  )
}

export function StatesBar({ parts }: { parts: { key: string; value: number; color: string }[] }) {
  const reduce = useReducedMotion()
  return (
    <div className="states" aria-hidden>
      {parts
        .filter((p) => p.value > 0)
        .map((p, i) => (
          <motion.i
            key={p.key}
            style={{ flex: `${p.value} 1 0`, background: p.color }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: ease.out, delay: i * 0.06 }}
          />
        ))}
    </div>
  )
}

/* Sheet: from the right on tablet and desktop, from the bottom on a phone, where
   the head drags it down. A flick dismisses it regardless of distance. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  const phone = usePhone()
  const reduce = useReducedMotion()
  const controls = useDragControls()
  const hidden = reduce ? { opacity: 0 } : phone ? { y: '100%' } : { x: '100%' }
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.section
            key="sheet"
            className="sheet"
            role="dialog"
            aria-modal
            aria-label={title}
            initial={hidden}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={hidden}
            transition={{ duration: 0.32, ease: ease.drawer }}
            drag={phone ? 'y' : false}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 1 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
            dragControls={controls}
          >
            {/* The head is the drag handle on phones, so the body keeps its own scroll. */}
            <div className="sheet-head" onPointerDown={(e) => phone && controls.start(e)}>
              <span className="grabber" aria-hidden />
              <h2>{title}</h2>
              <button
                className="btn btn-ghost btn-icon"
                aria-label="Close"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
            <div className="sheet-body">{children}</div>
            {footer && <div className="sheet-foot">{footer}</div>}
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}

export function Dialog({
  open,
  title,
  body,
  confirm,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: string
  confirm: string
  onConfirm: () => void
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="scrim dialog-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
          />
          <motion.div
            className="dialog"
            role="alertdialog"
            aria-modal
            aria-label={title}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: ease.out }}
          >
            <h2>{title}</h2>
            <p>{body}</p>
            <div className="dialog-actions">
              <button className="btn" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                {confirm}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* Section entrance: the parts of a block rise in, once, 60ms apart. */
export function Rise({
  children,
  i = 0,
  className,
}: {
  children: ReactNode
  i?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', y: -6 }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)', y: 0 }}
      transition={{ duration: 0.42, ease: printEase, delay: i * 0.07 }}
    >
      {children}
    </motion.div>
  )
}
