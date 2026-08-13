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

function Content({ children, xstyle }: { children: string; xstyle?: StyleXStyles }) {
  return (
    <div
      ref={(element) =>
        (element as (HTMLDivElement & { setHTML(html: string): void }) | null)?.setHTML(children)
      }
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
