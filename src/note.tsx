import type { Dispatch, SetStateAction } from 'react'
import type { DeckNote } from './notes'
import { Renderer, marked } from 'marked'

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

function Markdown({ children, className }: { children: string; className: string }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: marked.parse(children, { async: false, renderer }),
      }}
    />
  )
}

type NoteProps = {
  isOpen: boolean
  note: DeckNote
  setToggledNoteID: Dispatch<SetStateAction<string | null>>
}

export function Note({ isOpen, note, setToggledNoteID }: NoteProps) {
  let prompt: string
  let answer: string

  switch (note.type) {
    case 'prompt_response':
      prompt = note.prompt
      answer = note.answer
      break
    case 'cloze':
      prompt = note.text.replace(/\{\{[^:}]+::([^}]+)\}\}/g, '[…]')
      answer = Array.from(note.text.matchAll(/\{\{[^:}]+::([^}]+)\}\}/g), (match) => match[1]).join(
        ', ',
      )
      break
    case 'occlusion':
      prompt = note.image.alt
      answer = note.masks.map((mask) => mask.answer).join(', ')
      break
  }

  return (
    <article
      className="flex flex-col gap-4 border border-gray-300 px-6 py-4"
      onClick={(event) => {
        event.stopPropagation()
        setToggledNoteID((current) => (current === note.id ? null : note.id))
      }}
    >
      <div className="flex flex-col gap-1">
        <Markdown className={`text-lg ${isOpen ? '' : 'truncate'}`}>{prompt}</Markdown>
        <Markdown className={isOpen ? '' : 'line-clamp-2'}>{answer}</Markdown>
      </div>

      {isOpen ? <div className="flex flex-col gap-6"></div> : null}
    </article>
  )
}
