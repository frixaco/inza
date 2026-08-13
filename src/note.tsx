import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { DeckNote } from './notes'

function contentText(html: string, selector?: string) {
  const body = new DOMParser().parseFromString(html, 'text/html').body
  const content = (selector && body.querySelector(selector)) || body
  for (const block of content.querySelectorAll('br,dd,div,dt,h1,h2,h3,h4,h5,h6,li,p'))
    block.append(' ')
  return content.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

const safeElements: Record<string, true> = {
  a: true,
  b: true,
  blockquote: true,
  br: true,
  caption: true,
  code: true,
  dd: true,
  del: true,
  div: true,
  dl: true,
  dt: true,
  em: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  hr: true,
  i: true,
  kbd: true,
  li: true,
  mark: true,
  math: true,
  mfrac: true,
  mi: true,
  mn: true,
  mo: true,
  mroot: true,
  mrow: true,
  mspace: true,
  msqrt: true,
  msub: true,
  msubsup: true,
  msup: true,
  mtable: true,
  mtd: true,
  mtext: true,
  mtr: true,
  mpadded: true,
  mphantom: true,
  munder: true,
  munderover: true,
  mover: true,
  ol: true,
  p: true,
  pre: true,
  rp: true,
  rt: true,
  ruby: true,
  s: true,
  samp: true,
  small: true,
  span: true,
  strong: true,
  sub: true,
  sup: true,
  table: true,
  tbody: true,
  td: true,
  tfoot: true,
  th: true,
  thead: true,
  tr: true,
  ul: true,
  var: true,
}
const droppedElements: Record<string, true> = {
  audio: true,
  canvas: true,
  embed: true,
  form: true,
  iframe: true,
  object: true,
  script: true,
  style: true,
  template: true,
  video: true,
}
const globalAttributes: Record<string, true> = { dir: true, lang: true, title: true }
const elementAttributes: Record<string, Record<string, true>> = {
  a: { href: true },
  code: { 'data-language': true },
  li: { value: true },
  math: { display: true },
  ol: { reversed: true, start: true, type: true },
  span: { 'data-cloze': true },
  td: { colspan: true, rowspan: true, scope: true },
  th: { colspan: true, rowspan: true, scope: true },
}

function sanitizeFragment(html: string): DocumentFragment {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const sanitize = (node: Node): void => {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.parentNode?.removeChild(node)
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const element = node as HTMLElement
    for (const child of Array.from(element.childNodes)) sanitize(child)

    const tag = element.localName
    if (!safeElements[tag]) {
      if (droppedElements[tag] || !element.parentNode) {
        element.remove()
        return
      }
      while (element.firstChild) element.parentNode.insertBefore(element.firstChild, element)
      element.remove()
      return
    }

    for (const attribute of Array.from(element.attributes)) {
      const allowed =
        globalAttributes[attribute.name] ||
        elementAttributes[tag]?.[attribute.name] ||
        (attribute.name === 'mathvariant' && tag.startsWith('m') && tag !== 'mark')
      if (!allowed || (attribute.name === 'href' && !/^(https?:|mailto:)/i.test(attribute.value))) {
        element.removeAttribute(attribute.name)
      }
    }
  }

  for (const child of Array.from(parsed.body.childNodes)) sanitize(child)
  const fragment = parsed.createDocumentFragment()
  fragment.append(...Array.from(parsed.body.childNodes))
  return fragment
}

function Content({ children, xstyle }: { children: string; xstyle?: StyleXStyles }) {
  return (
    <div
      ref={(element) => {
        if (!element) return
        const nativeElement = element as HTMLDivElement & {
          setHTML?: (html: string) => void
        }
        if (nativeElement.setHTML) {
          nativeElement.setHTML(children)
          return
        }
        element.replaceChildren(sanitizeFragment(children))
      }}
      {...stylex.props(xstyle)}
    />
  )
}

function useMediaUrl(deckId: string, path: string) {
  const media = useLiveQuery(() => db.media.get(JSON.stringify([deckId, path])), [deckId, path])
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!media) return

    const nextUrl = URL.createObjectURL(media.blob)
    setUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [media])

  return url
}

function Media({
  note,
  media,
}: {
  note: DeckNote & { deckId: string }
  media:
    | { kind: 'image'; src: string; alt: string }
    | { kind: 'audio' | 'video'; src: string; label: string }
}) {
  const url = useMediaUrl(note.deckId, media.src)
  if (!url) return null

  switch (media.kind) {
    case 'image':
      return <img {...stylex.props(styles.media)} src={url} alt={media.alt} />
    case 'audio':
      return <audio aria-label={media.label} controls src={url} />
    case 'video':
      return <video {...stylex.props(styles.media)} aria-label={media.label} controls src={url} />
  }
}

type StoredNote = DeckNote & { deckId: string }

type NoteContentProps = {
  note: StoredNote
  revealed: boolean
  variantId?: string
}

function OcclusionContent({
  note,
  revealed,
  variantId,
}: NoteContentProps & { note: Extract<StoredNote, { type: 'occlusion' }> }) {
  const url = useMediaUrl(note.deckId, note.image.src)
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 })

  return (
    <>
      {url ? (
        <div {...stylex.props(styles.occlusion)}>
          <img
            {...stylex.props(styles.occlusionImage)}
            src={url}
            alt={note.image.alt}
            onLoad={(event) =>
              setImageSize({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }
          />
          <svg
            aria-label="Image occlusion masks"
            {...stylex.props(styles.mask)}
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
          >
            {note.masks.map((mask) => (
              <rect
                key={mask.id}
                fill={!revealed && mask.id === variantId ? 'black' : 'transparent'}
                height={mask.shape.h}
                stroke="black"
                width={mask.shape.w}
                x={mask.shape.x}
                y={mask.shape.y}
              />
            ))}
          </svg>
        </div>
      ) : null}
      {revealed
        ? note.masks
            .filter((mask) => variantId === undefined || mask.id === variantId)
            .map((mask) => <Content key={mask.id}>{mask.answer}</Content>)
        : null}
    </>
  )
}

export function NoteContent({ note, revealed, variantId }: NoteContentProps) {
  let content

  switch (note.type) {
    case 'prompt_response':
      content = (
        <>
          <Content xstyle={styles.textLarge}>{note.prompt}</Content>
          {note.media.map((media) => (
            <Media key={`${media.kind}:${media.src}`} note={note} media={media} />
          ))}
          {revealed ? <Content>{note.answer}</Content> : null}
        </>
      )
      break
    case 'cloze':
      content = (
        <>
          <Content xstyle={styles.textLarge}>
            {note.text.replace(/\{\{([^:}]+)::([^}]+)\}\}/g, (_marker, id, answer) =>
              revealed || id !== variantId ? answer : '[…]',
            )}
          </Content>
          {note.media.map((media) => (
            <Media key={`${media.kind}:${media.src}`} note={note} media={media} />
          ))}
        </>
      )
      break
    case 'occlusion':
      content = <OcclusionContent note={note} revealed={revealed} variantId={variantId} />
      break
  }

  return <div {...stylex.props(styles.noteContent)}>{content}</div>
}
export function Note({
  isOpen,
  note,
  setToggledNoteID,
}: {
  isOpen: boolean
  note: StoredNote
  setToggledNoteID: (update: (current: string | null) => string | null) => void
}) {
  const preview =
    note.type === 'prompt_response'
      ? contentText(note.prompt, 'p')
      : note.type === 'cloze'
        ? contentText(note.text.replace(/\{\{[^:}]+::([^}]+)\}\}/g, '$1'))
        : note.image.alt
  return (
    <article
      {...stylex.props(styles.note)}
      onClick={(event) => {
        event.stopPropagation()
        setToggledNoteID((current) => (current === note.id ? null : note.id))
      }}
    >
      {isOpen ? (
        <NoteContent note={note} revealed />
      ) : (
        <span {...stylex.props(styles.preview)}>{preview}</span>
      )}
    </article>
  )
}

const styles = stylex.create({
  mask: {
    height: '100%',
    inset: 0,
    position: 'absolute',
    width: '100%',
  },
  media: {
    maxHeight: '16rem',
    maxWidth: '100%',
  },
  note: {
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingBlock: '1rem',
    paddingInline: '1.5rem',
  },
  noteContent: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    minHeight: 0,
    overflowY: 'auto',
    textAlign: 'center',
  },
  occlusion: {
    display: 'inline-flex',
    maxWidth: '100%',
    position: 'relative',
  },
  occlusionImage: {
    maxHeight: '24rem',
    maxWidth: '100%',
  },
  preview: {
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  textLarge: {
    fontSize: '1.125rem',
  },
})
