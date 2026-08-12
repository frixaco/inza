import type { Dispatch, SetStateAction } from 'react'
import type { DeckNote } from './notes'

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
        <p className={`text-lg whitespace-pre-wrap ${isOpen ? '' : 'truncate'}`}>{prompt}</p>
        <p className={`whitespace-pre-wrap ${isOpen ? '' : 'line-clamp-2'}`}>{answer}</p>
      </div>

      {isOpen ? <div className="flex flex-col gap-6"></div> : null}
    </article>
  )
}
