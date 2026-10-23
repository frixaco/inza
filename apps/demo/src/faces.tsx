import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Pause, SpeakerHigh } from '@phosphor-icons/react'
import { assetUrl, kana, occlusionTarget, type ClozeNote, type KaishiNote } from './sample'
import { ease, printEase } from './ui'

/* The answer prints below the perforation, a few lines at a time. */
function Wipe({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.32, ease: printEase }}
    >
      {children}
    </motion.div>
  )
}

function AudioButton({ label }: { label: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <button
      className={`btn audio-btn ${playing ? 'btn-primary' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        setPlaying(true)
        setTimeout(() => setPlaying(false), 1400)
      }}
      aria-pressed={playing}
    >
      {playing ? <Pause size={14} weight="fill" /> : <SpeakerHigh size={14} />}
      {label}
    </button>
  )
}

export function KaishiFace({ note, revealed }: { note: KaishiNote; revealed: boolean }) {
  return (
    <>
      <div className="face">
        <p className="face-word" lang="ja">
          {note.word}
        </p>
        <p
          className="face-sentence"
          lang="ja"
          dangerouslySetInnerHTML={{ __html: note.sentenceHtml }}
        />
      </div>
      {revealed && (
        <Wipe>
          <div className="answer">
            <div className="answer-main">
              <p
                className="answer-reading"
                lang="ja"
                dangerouslySetInnerHTML={{ __html: note.furigana || note.reading }}
              />
              <p className="answer-meaning">{note.meaning}</p>
              <p className="answer-sub">{note.sentenceMeaning}</p>
              {note.notes && <p className="answer-sub">{note.notes}</p>}
              <div className="audio-row">
                <AudioButton label="Word" />
                <AudioButton label="Sentence" />
              </div>
            </div>
            {note.image && (
              <img className="answer-img" src={assetUrl(note.image)} alt={note.imageAlt ?? ''} />
            )}
          </div>
        </Wipe>
      )}
    </>
  )
}

export function ClozeFace({
  note,
  revealed,
  active = 'c1',
}: {
  note: ClozeNote
  revealed: boolean
  active?: string
}) {
  const parts = note.html.split(/(<span data-cloze="c\d">.*?<\/span>)/g)
  return (
    <>
      <div className="face">
        <p className="cloze-text" lang="ja">
          {parts.map((p, i) => {
            const m = p.match(/<span data-cloze="(c\d)">(.*?)<\/span>/)
            if (!m) return <span key={i}>{p}</span>
            if (m[1] !== active) return <span key={i}>{m[2]}</span>
            return revealed ? (
              <motion.span
                key={i}
                className="cloze-fill"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 0.22, ease: ease.out }}
              >
                {m[2]}
              </motion.span>
            ) : (
              <span key={i} className="cloze-gap">
                ?
              </span>
            )
          })}
        </p>
      </div>
      {revealed && (
        <Wipe>
          <div className="answer">
            <div className="answer-main">
              <p className="answer-meaning">{note.translation}</p>
            </div>
          </div>
        </Wipe>
      )}
    </>
  )
}

export function KanaFace({ revealed }: { revealed: boolean }) {
  return (
    <div className="face">
      <p className="answer-sub">Which kana sits under the mask?</p>
      <div className="kana" role="img" aria-label="Hiragana chart with one cell hidden">
        {Array.from({ length: 55 }, (_, i) => {
          const r = Math.floor(i / 5)
          const c = i % 5
          const cell = kana.find((k) => k.row === r && k.col === c)
          if (!cell) return <span key={i} />
          const target = cell.id === occlusionTarget
          if (target && !revealed)
            return (
              <span key={i} className="mask">
                ?
              </span>
            )
          return (
            <span key={i} className={target ? 'revealed' : undefined} lang="ja">
              {cell.kana}
              <small>{cell.romaji}</small>
            </span>
          )
        })}
      </div>
      {revealed && (
        <Wipe>
          <p className="answer-meaning">
            <span lang="ja">に</span> · ni
          </p>
        </Wipe>
      )}
    </div>
  )
}
