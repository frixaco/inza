import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { Renderer, marked } from 'marked'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { DeckNote } from './notes'

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const renderer = new Renderer()
renderer.html = ({ text }) => escapeHtml(text)
renderer.link = ({ href, title, tokens }) => {
  const text = renderer.parser.parseInline(tokens)
  const hasSafeProtocol = !/^[a-z][a-z\d+.-]*:/i.test(href) || /^(https?:|mailto:)/i.test(href)
  if (!hasSafeProtocol) return text

  return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}>${text}</a>`
}

function Markdown({ children, xstyle }: { children: string; xstyle?: StyleXStyles }) {
  return (
    <div
      {...stylex.props(xstyle)}
      dangerouslySetInnerHTML={{
        __html: marked.parse(children, { async: false, renderer }),
      }}
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
            .map((mask) => <Markdown key={mask.id}>{mask.answer}</Markdown>)
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
          <Markdown xstyle={styles.textLarge}>{note.prompt}</Markdown>
          {note.media.map((media) => (
            <Media key={`${media.kind}:${media.src}`} note={note} media={media} />
          ))}
          {revealed ? <Markdown>{note.answer}</Markdown> : null}
        </>
      )
      break
    case 'cloze':
      content = (
        <>
          <Markdown xstyle={styles.textLarge}>
            {note.text.replace(/\{\{([^:}]+)::([^}]+)\}\}/g, (_marker, id, answer) =>
              revealed || id !== variantId ? answer : '[…]',
            )}
          </Markdown>
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
      ? note.prompt
      : note.type === 'cloze'
        ? note.text.replace(/\{\{[^:}]+::([^}]+)\}\}/g, '$1')
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
        <Markdown xstyle={styles.preview}>{preview}</Markdown>
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
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    overflow: 'hidden',
    textAlign: 'start',
  },
  textLarge: {
    fontSize: '1.125rem',
  },
})
