import type { Dispatch, SetStateAction } from 'react'
import type {
  ContentBlock,
  InlineMark,
  InlineRun,
  MediaRef,
  NoteContent,
  PromptResponseNote,
} from './notes'

type NoteProps = {
  isOpen: boolean
  note: PromptResponseNote
  setToggledNoteID: Dispatch<SetStateAction<string | null>>
}

const sampleAudioURL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

export function Note({ isOpen, note, setToggledNoteID }: NoteProps) {
  console.log(isOpen)

  return (
    <article
      className="flex flex-col gap-4 border border-gray-300 px-6 py-4"
      onClick={(event) => {
        event.stopPropagation()
        setToggledNoteID((current) => (current === note.id ? null : note.id))
      }}
    >
      <div className="flex flex-col gap-1">
        <p className={`text-lg ${isOpen ? '' : 'truncate'}`}>{note.prompt}</p>
        <p className={isOpen ? '' : 'line-clamp-2'}>{note.answer}</p>
      </div>

      {isOpen ? <div className="flex flex-col gap-6"></div> : null}
    </article>
  )
}
