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

function Markdown({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div
      className={className}
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
      return <img className="max-h-64 max-w-full" src={url} alt={media.alt} />
    case 'audio':
      return <audio aria-label={media.label} controls src={url} />
    case 'video':
      return <video aria-label={media.label} className="max-h-64 max-w-full" controls src={url} />
  }
}

type StoredNote = DeckNote & { deckId: string }

type NoteContentProps = {
  note: StoredNote
  revealed: boolean
}

function OcclusionContent({
  note,
  revealed,
}: NoteContentProps & { note: Extract<StoredNote, { type: 'occlusion' }> }) {
  const url = useMediaUrl(note.deckId, note.image.src)
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 })

  return (
    <>
      {url ? (
        <div className="relative inline-flex max-w-full">
          <img
            className="max-h-96 max-w-full"
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
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
          >
            {note.masks.map((mask) => (
              <rect
                key={mask.id}
                fill={revealed ? 'transparent' : 'black'}
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
      {revealed ? note.masks.map((mask) => <Markdown key={mask.id}>{mask.answer}</Markdown>) : null}
    </>
  )
}

export function NoteContent({ note, revealed }: NoteContentProps) {
  let content

  switch (note.type) {
    case 'prompt_response':
      content = (
        <>
          <Markdown className="text-lg">{note.prompt}</Markdown>
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
          <Markdown className="text-lg">
            {note.text.replace(/\{\{[^:}]+::([^}]+)\}\}/g, revealed ? '$1' : '[…]')}
          </Markdown>
          {note.media.map((media) => (
            <Media key={`${media.kind}:${media.src}`} note={note} media={media} />
          ))}
        </>
      )
      break
    case 'occlusion':
      content = <OcclusionContent note={note} revealed={revealed} />
      break
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
      {content}
    </div>
  )
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
  return (
    <article
      className="flex min-h-48 flex-col gap-4 border border-gray-300 px-6 py-4"
      onClick={(event) => {
        event.stopPropagation()
        setToggledNoteID((current) => (current === note.id ? null : note.id))
      }}
    >
      <NoteContent note={note} revealed={isOpen} />
    </article>
  )
}
