export type MediaRef =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'audio' | 'video'; src: string; label: string }

type BaseNote = {
  id: string
}

export type PromptResponseNote = BaseNote & {
  type: 'prompt_response'
  prompt: string
  answer: string
  media: MediaRef[]
}

export type ClozeNote = BaseNote & {
  type: 'cloze'
  text: string
  media: MediaRef[]
}

export type OcclusionNote = BaseNote & {
  type: 'occlusion'
  image: {
    src: string
    alt: string
  }
  masks: Array<{
    id: string
    answer: string
    shape: {
      kind: 'rect'
      x: number
      y: number
      w: number
      h: number
    }
  }>
}

export type DeckNote = PromptResponseNote | ClozeNote | OcclusionNote

export const NOTES: DeckNote[] = [
  {
    id: 'kaishi-0002-私',
    type: 'prompt_response',
    prompt: '私\n\n**Sentence:** 私はアンです。',
    answer: 'I (polite, general)\n\n**Reading:** わたし\n\n**Sentence:** I am Ann.',
    media: [
      {
        kind: 'audio',
        src: 'assets/audio/私_ワタシ━_0_NHK-2016.mp3',
        label: 'Word audio',
      },
      {
        kind: 'image',
        src: 'assets/images/jikosyoukai_man-0f017c07b9f1048ff29830827e8503a6984504f6.webp',
        alt: 'A man introducing himself',
      },
    ],
  },
  {
    id: 'rust-ownership-cloze',
    type: 'cloze',
    text: 'In Rust, each value has {{c1::one owner}} at a time.',
    media: [],
  },
  {
    id: 'knee-ligaments',
    type: 'occlusion',
    image: {
      src: 'assets/images/knee.png',
      alt: 'Knee ligament diagram',
    },
    masks: [
      {
        id: 'acl',
        answer: 'Anterior cruciate ligament',
        shape: { kind: 'rect', x: 510, y: 320, w: 180, h: 70 },
      },
    ],
  },
]
