export type InlineMark = 'strong' | 'emphasis' | 'code' | 'strike' | 'highlight'

export type InlineRun =
  | string
  | {
      text: string
      marks?: InlineMark[]
      above?: string
      below?: string
      link?: string
    }

export type ContentRole = 'main' | 'context' | 'support' | 'note'

export type MediaRef = {
  kind: 'image' | 'audio' | 'video'
  src: string
  role?: ContentRole
  label?: string
  alt?: string
}

export type ContentBlock = {
  role: ContentRole
  label?: string
  text?: string
  runs?: InlineRun[]
  language?: string
  media?: MediaRef[]
}

export type NoteContent = string | ContentBlock[]

export type Provenance = {
  importer: string
  anki_note_id: number
  anki_guid: string
  anki_note_type: string
  anki_mod: number
}

export type PromptResponseNote = {
  id: string
  type: 'prompt_response'
  deck?: string
  tags?: string[]
  language?: string
  answer_mode?: 'reveal' | 'typed'
  prompt: NoteContent
  answer: NoteContent
  hint?: NoteContent
  media?: MediaRef[]
  references?: Array<{
    title: string
    url: string
    locator?: string
  }>
  provenance?: Provenance
}

export const NOTES: PromptResponseNote[] = [
  {
    id: 'kaishi-0002-私',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '私',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/私_ワタシ━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: '私',
            marks: ['strong'],
          },
          'はアンです。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0001.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'I (polite, general)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'わたし',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '私',
            above: 'わたし',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I am Ann.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '私',
            marks: ['strong'],
            above: 'わたし',
          },
          'はアンです。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'Can also be read わたくし (formal) and あたし (feminine).\nThere are rarer readings too.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ワ',
          {
            text: 'タシ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '19',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/jikosyoukai_man-0f017c07b9f1048ff29830827e8503a6984504f6.webp',
            role: 'support',
            label: 'Picture',
            alt: '自己紹介のイラスト（男性） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439854,
      anki_guid: 'ue*r{>Er!]',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0003-あなた',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'あなた',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/あなた_アナ＼タ_2_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'あなた',
            marks: ['strong'],
          },
          'はトムさんですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0005.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: "you (usually when one doesn't know the person)",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'あなた',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['あなた'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Are you Tom-san?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'あなた',
            marks: ['strong'],
          },
          'はトムさんですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ア',
          {
            text: 'ナ',
            above: '￣',
            below: '＼',
          },
          'タ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '136',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/pose_touch_hitosashiyubi_man.webp',
            role: 'support',
            label: 'Picture',
            alt: '人差し指で押す人のイラスト（男性）',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439855,
      anki_guid: 'N*bTdF#y|q',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0004-さん',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'さん',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/さん_サ＼ン_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あなたはトム',
          {
            text: 'さん',
            marks: ['strong'],
          },
          'ですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0005.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'san',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'さん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['さん'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Are you Tom-san?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あなたはトム',
          {
            text: 'さん',
            marks: ['strong'],
          },
          'ですか。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'Most commonplace neutral polite honorific. Somewhat similar to using "M." in front of a name in English.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'サ',
            above: '￣',
            below: '＼',
          },
          'ン*',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Pitch Accent Notes',
        text: 'If the name has an accent, さん and all other honorifics are pronounced low: 高橋さん → たか＼はしさん while if a name is heiban, all honorifics are also flat: 平田さん would be ひらたさん￣.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '35',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/stand1_front05_man.webp',
            role: 'support',
            label: 'Picture',
            alt: '立っている男性のイラスト（ポーズ） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439856,
      anki_guid: 'l^^i5RVwq@',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1744630791,
    },
  },
  {
    id: 'kaishi-0005-彼',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '彼',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/彼_カ＼レ_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: '彼',
            marks: ['strong'],
          },
          'はトムさんです。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0006.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'he, him',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'かれ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '彼',
            above: 'かれ',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'He is Tom-san.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '彼',
            marks: ['strong'],
            above: 'かれ',
          },
          'はトムさんです。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'カ',
            above: '￣',
            below: '＼',
          },
          'レ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '150',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/couple_okoru_woman.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439857,
      anki_guid: 'EJQrRKG_l(',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0006-好き',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '好き',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/d7fc47445da76bf992a10e581da01ba9-0fba83bd67a3dc41ed108b722008eb47b879a343.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '私はワインが',
          {
            text: '好き',
            marks: ['strong'],
          },
          'です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/fe1250584407c2a9b5499098ec358022-292b7d8c38187415a03e45ff4f21ec25989bc12b.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'fond of, liked',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'すき',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '好',
            above: 'す',
          },
          'き',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I like wine.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '私',
            above: 'わたし',
          },
          'はワインが',
          {
            text: '好',
            marks: ['strong'],
            above: 'す',
          },
          {
            text: 'き',
            marks: ['strong'],
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: "This is not a verb, but it is often translated in English as the verb 'to like'.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ス',
            marks: ['highlight'],
          },
          {
            text: 'キ',
            above: '￣',
            below: '＼',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '186',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/idol_koisuru_girl_woman.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439858,
      anki_guid: 'J2=BL5C>P9',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775997603,
    },
  },
  {
    id: 'kaishi-0007-人',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '人',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/90806b952a90a8a3d4a670af736cd2c2-aff81c948016ff060fca09d5405316fa6bd38a55.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あの',
          {
            text: '人',
            marks: ['strong'],
          },
          'はいい人です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0589-02.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'person',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ひと',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '人',
            above: 'ひと',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'That person is a good person.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あの',
          {
            text: '人',
            marks: ['strong'],
            above: 'ひと',
          },
          'はいい ',
          {
            text: '人',
            above: 'ひと',
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ヒ',
          {
            text: 'ト',
            above: '￣',
          },
          '・ヒ',
          {
            text: 'ト',
            above: '￣',
            below: '＼',
          },
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Pitch Accent Notes',
        text: 'ひと＼ when modified, otherwise ひと￣ when unmodified. Note that in this case, あの人 is あの＼ひと. This is an exception, その＼ひと is another.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '71',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/fashion_sweat_jersey_woman.webp',
            role: 'support',
            label: 'Picture',
            alt: '部屋着を着た人のイラスト（女性） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439859,
      anki_guid: 'K~xVS.9}%C',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1733384624,
    },
  },
  {
    id: 'kaishi-0008-いい',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'いい',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/いい_イ＼ー_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あの人は',
          {
            text: 'いい',
            marks: ['strong'],
          },
          '人です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0589-02.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'good',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'いい',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['いい'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'That person is a good person.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あの ',
          {
            text: '人',
            above: 'ひと',
          },
          'は',
          {
            text: 'いい',
            marks: ['strong'],
          },
          ' ',
          {
            text: '人',
            above: 'ひと',
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'イ',
            above: '￣',
            below: '＼',
          },
          'イ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '37',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/good_woman.webp',
            role: 'support',
            label: 'Picture',
            alt: '親指を立てている人のイラスト（女性）',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439860,
      anki_guid: 'E&m=0;hjj-',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1733384628,
    },
  },
  {
    id: 'kaishi-0009-人',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '人',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/人_ジ＼ン_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '私はイギリス',
          {
            text: '人',
            marks: ['strong'],
          },
          'です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0072.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'person from (nationality)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'じん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '人',
            above: 'じん',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I am British.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '私',
            above: 'わたし',
          },
          'はイギリス',
          {
            text: '人',
            marks: ['strong'],
            above: 'じん',
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'A suffix added to a country name to mean a person that is from that country.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ジ',
            above: '￣',
            below: '＼',
          },
          'ン*',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Pitch Accent Notes',
        text: 'As a suffix, drops before 人, so イギリス＼人. 日本人 is an exception: (にほんじ＼ん).',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '71',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/fashion_sweat_jersey_woman.webp',
            role: 'support',
            label: 'Picture',
            alt: '部屋着を着た人のイラスト（女性） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439861,
      anki_guid: 'C=.1`G!}BW',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775999778,
    },
  },
  {
    id: 'kaishi-0010-日本語',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '日本語',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/日本語_ニホンコ゚━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '私は',
          {
            text: '日本語',
            marks: ['strong'],
          },
          'を勉強しています。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/6e20ba5b1e5139fec3b8438b7d14bc15-ad2d22a7e9f5b8cb06e78654c82d381d10c6f683.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'Japanese language',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'にほんご',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '日本',
            above: 'にほん',
          },
          ' ',
          {
            text: '語',
            above: 'ご',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "I'm studying Japanese.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '私',
            above: 'わたし',
          },
          'は',
          {
            text: '日本',
            marks: ['strong'],
            above: 'にほん',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '語',
            marks: ['strong'],
            above: 'ご',
          },
          'を ',
          {
            text: '勉',
            above: 'べん',
          },
          ' ',
          {
            text: '強',
            above: 'きょう',
          },
          'しています。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ニ',
          {
            text: 'ホンコ',
            above: '￣',
          },
          {
            text: '°',
            marks: ['highlight'],
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '5442',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/study_nihongo.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439862,
      anki_guid: 'BjMgplFn)5',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0011-勉強',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '勉強',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/f19c9dd8b9e2fcd2ff2bc0a44c509ee5-958bdd052eadbd5cef17c81813d29a91fe185113.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '私は日本語を',
          {
            text: '勉強',
            marks: ['strong'],
          },
          'しています。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/6e20ba5b1e5139fec3b8438b7d14bc15-ad2d22a7e9f5b8cb06e78654c82d381d10c6f683.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'study',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'べんきょう',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '勉',
            above: 'べん',
          },
          ' ',
          {
            text: '強',
            above: 'きょう',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "I'm studying Japanese.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '私',
            above: 'わたし',
          },
          'は ',
          {
            text: '日本',
            above: 'にほん',
          },
          ' ',
          {
            text: '語',
            above: 'ご',
          },
          'を',
          {
            text: '勉',
            marks: ['strong'],
            above: 'べん',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '強',
            marks: ['strong'],
            above: 'きょう',
          },
          'しています。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ベ',
          {
            text: 'ンキョー',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '925',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/study_night_girl.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439863,
      anki_guid: 'vFr#[Bnt$p',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0012-本',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '本',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/本_ホ＼ン_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'いい',
          {
            text: '本',
            marks: ['strong'],
          },
          'でしたね。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/honS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'book',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ほん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '本',
            above: 'ほん',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "It was a good book, wasn't it?",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'いい',
          {
            text: '本',
            marks: ['strong'],
            above: 'ほん',
          },
          'でしたね。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ホ',
            above: '￣',
            below: '＼',
          },
          'ン',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '499',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/book_yoko.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439864,
      anki_guid: 'bV_yk0SX_=',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0013-これ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'これ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/これ_コレ━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'これ',
            marks: ['strong'],
          },
          'は日本語の本です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0235.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'this',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'これ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['これ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'This is a Japanese book.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'これ',
            marks: ['strong'],
          },
          'は ',
          {
            text: '日本',
            above: 'にほん',
          },
          ' ',
          {
            text: '語',
            above: 'ご',
          },
          'の ',
          {
            text: '本',
            above: 'ほん',
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'コ',
          {
            text: 'レ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '40',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kosoado2_kore.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439865,
      anki_guid: 'zZk>YZc2I[',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0014-何',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '何',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/9ef558b78122dd5a3a4c05d55bd6f033-9ee9d08831e1c47e04a31ed10b8c75c0d8c94e0e.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'A「これは',
          {
            text: '何',
            marks: ['strong'],
          },
          'ですか。」\nB「本です。」',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0243.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'what',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'なに・なん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '何',
            above: 'なに・なん',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "A: What is this?\nB: It's a book.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'A「これは',
          {
            text: '何',
            marks: ['strong'],
            above: 'なん',
          },
          'ですか。」\nB「 ',
          {
            text: '本',
            above: 'ほん',
          },
          'です。」',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'Can be read either なに or なん.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ナ',
            above: '￣',
            below: '＼',
          },
          'ニ・',
          {
            text: 'ナ',
            above: '￣',
            below: '＼',
          },
          'ン',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '62',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/girl_question.webp',
            role: 'support',
            label: 'Picture',
            alt: '女の子の表情のイラスト「目がハート・疑問・居眠り・照れ ...',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439866,
      anki_guid: 'C@7_ePJ~)F',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1754674289,
    },
  },
  {
    id: 'kaishi-0015-それ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'それ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/8b0ee07c0864e07d96871e87f158ad96-efdddaf31dbe1b15c565627266d51198e579319a.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'それ',
            marks: ['strong'],
          },
          'は本です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/soreS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'that',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'それ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['それ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'That is a book.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'それ',
            marks: ['strong'],
          },
          'は ',
          {
            text: '本',
            above: 'ほん',
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ソ',
          {
            text: 'レ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '17',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kosoado2_sore.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439867,
      anki_guid: 'J/s_tW[i$u',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0016-あれ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'あれ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/c7ebca148c5293d1a0c7a004c182eba7-f9031ebbabe0dd8444b9e19b954f2540b9a664bf.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'あれ',
            marks: ['strong'],
          },
          'は何ですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/da6575acfab0df719bc8a035ee57ea96-e609ef29f30f2e102180cba9b5531ed279892376.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'that over there',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'あれ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['あれ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "What's that?",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'あれ',
            marks: ['strong'],
          },
          'は ',
          {
            text: '何',
            above: 'なん',
          },
          'ですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ア',
          {
            text: 'レ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '129',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kosoado2_are.webp',
            role: 'support',
            label: 'Picture',
            alt: 'これ・それ・あれ」のイラスト | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439868,
      anki_guid: 'F4axo~+{?5',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0017-と-れ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'どれ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/722241bb0f4ce21cbb388e276ae0a6f4-6777a1ec0dbfd6d10792a35422b6e80ccd55a777.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'どれ',
            marks: ['strong'],
          },
          'が好きですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/b3b2c52dd411c176af418032442fbb98-6d6972313a4f2dde8f2f16516d1c80fbe6cc8090.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'which, what',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'どれ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['どれ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Which would you like?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'どれ',
            marks: ['strong'],
          },
          'が ',
          {
            text: '好',
            above: 'す',
          },
          'きですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ド',
            above: '￣',
            below: '＼',
          },
          'レ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '930',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/sweets_okashi_erabu_boy-7fdb9e3ff6c8372fc936d1fe173e4042554f8453.webp',
            role: 'support',
            label: 'Picture',
            alt: 'お菓子を選ぶ子供のイラスト（男の子） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439869,
      anki_guid: 'J!F|q?*7Gx',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1728731815,
    },
  },
  {
    id: 'kaishi-0018-毎日',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '毎日',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/4465289718153b4963a8cc301289e914-de5a300452d8c7d0f48f25ff1f3419547f08a3f7.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: '毎日',
            marks: ['strong'],
          },
          '、日本語を勉強します。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0145.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'every day',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'まいにち',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '毎',
            above: 'まい',
          },
          ' ',
          {
            text: '日',
            above: 'にち',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I study Japanese every day.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '毎',
            marks: ['strong'],
            above: 'まい',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '日',
            marks: ['strong'],
            above: 'にち',
          },
          '、 ',
          {
            text: '日本',
            above: 'にほん',
          },
          ' ',
          {
            text: '語',
            above: 'ご',
          },
          'を ',
          {
            text: '勉',
            above: 'べん',
          },
          ' ',
          {
            text: '強',
            above: 'きょう',
          },
          'します。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'マ',
            above: '￣',
            below: '＼',
          },
          'イニチ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '877',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/text1_mainichi.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439870,
      anki_guid: 'eqi(tWOan8',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0019-兄',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '兄',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/3b174a5bd2eab47d46f1dc630477454a-d06792fbe4460a84d6042a2a511fe8c66ced8e08.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'これは',
          {
            text: '兄',
            marks: ['strong'],
          },
          'のパソコンです。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0261.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'older brother',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'あに',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '兄',
            above: 'あに',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "This is my older brother's personal computer.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'これは',
          {
            text: '兄',
            marks: ['strong'],
            above: 'あに',
          },
          'のパソコンです。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ア',
            above: '￣',
            below: '＼',
          },
          'ニ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '980',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/family_kyoudai.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439871,
      anki_guid: 'C%++],/lQ9',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0020-いる',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'いる',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/いる_イル━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '兄が',
          {
            text: 'います',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0040-02.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to have, to exist (animate)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'いる',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['いる'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I have an older brother.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '兄',
            above: 'あに',
          },
          'が',
          {
            text: 'います',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'イ',
          {
            text: 'ル',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '21',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/brothers_chounan-7c1ee034cef1e3d1e9c0bd7cd3cbe30d853a972d.webp',
            role: 'support',
            label: 'Picture',
            alt: '妹と弟を可愛がるお兄さんのイラスト | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439872,
      anki_guid: 'p@lWpT]Cr[',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998277,
    },
  },
  {
    id: 'kaishi-0021-ある',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'ある',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/ある_ア＼ル_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'ペンが',
          {
            text: 'ある',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/aruS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to have, to exist (inanimate)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ある',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['ある'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'There is a pen.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'ペンが',
          {
            text: 'ある',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ア',
            above: '￣',
            below: '＼',
          },
          'ル',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '16',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/pen_marker_close3_yellow.webp',
            role: 'support',
            label: 'Picture',
            alt: 'いろいろなマーカーのイラスト | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439873,
      anki_guid: 'Pl7O52HkO3',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998506,
    },
  },
  {
    id: 'kaishi-0022-あまり',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'あまり',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/あまり_アマリ━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'スポーツは',
          {
            text: 'あまり',
            marks: ['strong'],
          },
          '好きじゃありません。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0524.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: '(not) very, (not) much',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'あまり',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['あまり'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "I don't really like sports.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'スポーツは',
          {
            text: 'あまり',
            marks: ['strong'],
          },
          ' ',
          {
            text: '好',
            above: 'す',
          },
          'きじゃありません。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ア',
          {
            text: 'マリ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '388',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/sports_man.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439874,
      anki_guid: 'lt~b=q&8zJ',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0023-今',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '今',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/b1bac99f71951be325093ff9ef5902dc-0a6c895f5f24d623d2de48fa9eab56a220d1856a.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '彼は',
          {
            text: '今',
            marks: ['strong'],
          },
          '、勉強しています。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/f0f1725c926b64b8ddcc17e413914ed8-361d9dc0e27a097586758af272b6910e12f98c19.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'now',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'いま',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '今',
            above: 'いま',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "He's studying now.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '彼',
            above: 'かれ',
          },
          'は',
          {
            text: '今',
            marks: ['strong'],
            above: 'いま',
          },
          '、 ',
          {
            text: '勉',
            above: 'べん',
          },
          ' ',
          {
            text: '強',
            above: 'きょう',
          },
          'しています。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'イ',
            above: '￣',
            below: '＼',
          },
          'マ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '64',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kaden_digital_tokei.webp',
            role: 'support',
            label: 'Picture',
            alt: '時計の検索結果 | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439875,
      anki_guid: 'Qjv*%gxsE{',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0024-時間',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '時間',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/41e9126a0d1852dd6072f7a1b8d05558-4989812e99eb121d12adc7ad74d329dfd9298cee.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '今は',
          {
            text: '時間',
            marks: ['strong'],
          },
          'がありません。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/fe6b580a409f268f0e4f9765cdd794ca-ba194c5df337ac8ba6371a3238d4dcf0aeb78785.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'time, hour',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'じかん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '時',
            above: 'じ',
          },
          ' ',
          {
            text: '間',
            above: 'かん',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "I don't have time now.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '今',
            above: 'いま',
          },
          'は',
          {
            text: '時',
            marks: ['strong'],
            above: 'じ',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '間',
            marks: ['strong'],
            above: 'かん',
          },
          'がありません。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ジ',
          {
            text: 'カン',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '164',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/jikan_tobu.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439876,
      anki_guid: 'QkWY;ySQjF',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0025-無い',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '無い',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/a67ef780f84bea265815b6db3d063cb8-fe729ae97a2972111629cc438dd7ddfd65e239bc.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '今はあまり時間が',
          {
            text: '無い',
            marks: ['strong'],
          },
          'のです。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/naiS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'nonexistent, not being',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ない',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '無',
            above: 'な',
          },
          'い',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "I don't have much time now.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '今',
            above: 'いま',
          },
          'はあまり ',
          {
            text: '時',
            above: 'じ',
          },
          ' ',
          {
            text: '間',
            above: 'かん',
          },
          'が',
          {
            text: '無',
            marks: ['strong'],
            above: 'な',
          },
          {
            text: 'い',
            marks: ['strong'],
          },
          'のです。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'This is often used as the negative form of the verb ある. See a grammar book for more details on how to use it.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ナ',
            above: '￣',
            below: '＼',
          },
          'イ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '33',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/money_kinketsu_man-a865a3313a308d24df1f53197a3945604cd2a88c.webp',
            role: 'support',
            label: 'Picture',
            alt: '金欠のイラスト（男性）',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439877,
      anki_guid: 't@^SDA}L0%',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1776000082,
    },
  },
  {
    id: 'kaishi-0026-この',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'この',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/この_コノ━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '山田さんの本はどれですか。',
          {
            text: 'この',
            marks: ['strong'],
          },
          '本ですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0239.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'this one',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'この',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['この'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "Which book is Yamada-san's? Is it this book?",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '山',
            above: 'やま',
          },
          ' ',
          {
            text: '田',
            above: 'だ',
          },
          'さんの ',
          {
            text: '本',
            above: 'ほん',
          },
          'はどれですか。',
          {
            text: 'この',
            marks: ['strong'],
          },
          ' ',
          {
            text: '本',
            above: 'ほん',
          },
          'ですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'コ',
          {
            text: 'ノ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '30',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/house_ie_sagashi.webp',
            role: 'support',
            label: 'Picture',
            alt: '不動産の検索結果 | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439878,
      anki_guid: 'DyV}[wCS=A',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0027-その',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'その',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/その_ソノ━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'その',
            marks: ['strong'],
          },
          '本ですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0240.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'that one',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'その',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['その'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Is it that book?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'その',
            marks: ['strong'],
          },
          ' ',
          {
            text: '本',
            above: 'ほん',
          },
          'ですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ソ',
          {
            text: 'ノ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '28',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/image 1.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439879,
      anki_guid: 't=>5NIlH5J',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0028-あの',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'あの',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/あの_アノ━_0_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'あの',
            marks: ['strong'],
          },
          '本ですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0241.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'that one there',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'あの',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['あの'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'That book (over there)?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'あの',
            marks: ['strong'],
          },
          ' ',
          {
            text: '本',
            above: 'ほん',
          },
          'ですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ア',
          {
            text: 'ノ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '53',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/image 2.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439880,
      anki_guid: 'GeS%q@g|N',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1733384641,
    },
  },
  {
    id: 'kaishi-0029-と-の',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'どの',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/どの_ド＼ノ_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'どの',
            marks: ['strong'],
          },
          '本ですか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0242.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'which one',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'どの',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['どの'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Which book is it?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'どの',
            marks: ['strong'],
          },
          ' ',
          {
            text: '本',
            above: 'ほん',
          },
          'ですか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ド',
            above: '￣',
            below: '＼',
          },
          'ノ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '1398',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/sweets_okashi_erabu_boy-7fdb9e3ff6c8372fc936d1fe173e4042554f8453.webp',
            role: 'support',
            label: 'Picture',
            alt: 'お菓子を選ぶ子供のイラスト（男の子） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439881,
      anki_guid: 'jrPf<ARf:d',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0030-見る',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '見る',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/4553491bd93c9fd49f9fcd420a8bac3e-7cd0ef7d180a4dec8d7df2bf346f89d033052953.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '兄は毎日テレビを',
          {
            text: '見ます',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/miruS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to see, to look at',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'みる',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '見',
            above: 'み',
          },
          'る',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'My older brother watches TV every day.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '兄',
            above: 'あに',
          },
          'は ',
          {
            text: '毎',
            above: 'まい',
          },
          ' ',
          {
            text: '日',
            above: 'にち',
          },
          'テレビを',
          {
            text: '見',
            marks: ['strong'],
            above: 'み',
          },
          {
            text: 'ます',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ミ',
            above: '￣',
            below: '＼',
          },
          'ル',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '38',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/pose_doredore_man.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439882,
      anki_guid: 'fXsqPXhSP(',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998535,
    },
  },
  {
    id: 'kaishi-0031-全然',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '全然',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/16ce975c2b73161bdb6cc23c1f2864d2-bdc810120bf463a8df09bbbc692faa1fa5d9ec75.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'テレビを',
          {
            text: '全然',
            marks: ['strong'],
          },
          '見ません。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0403.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: '(not) at all',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ぜんぜん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '全',
            above: 'ぜん',
          },
          ' ',
          {
            text: '然',
            above: 'ぜん',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I never watch television.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'テレビを',
          {
            text: '全',
            marks: ['strong'],
            above: 'ぜん',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '然',
            marks: ['strong'],
            above: 'ぜん',
          },
          ' ',
          {
            text: '見',
            above: 'み',
          },
          'ません。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ゼ',
          {
            text: 'ンゼン',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '550',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/dame_man-dfc1a882bd7da723328ea20c745db91c191ba31d.webp',
            role: 'support',
            label: 'Picture',
            alt: '「ダメ」のポーズをする人のイラスト（男性）',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439883,
      anki_guid: 'doQSx#_f#u',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775999412,
    },
  },
  {
    id: 'kaishi-0032-面白い',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '面白い',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/01e3329b1993208a0da0279860533f9a-caf422b4c342ec4baaeabf0eeb14909e910c5f2f.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'この本は全然',
          {
            text: '面白くなかった',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/db3d645c85365755c755208ad3aab5bb-971936ac59eada448acba31bf5101ea49b75a00d.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'interesting, amusing',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'おもしろい',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '面',
            above: 'おも',
          },
          ' ',
          {
            text: '白',
            above: 'しろ',
          },
          'い',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "This book wasn't interesting at all.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'この ',
          {
            text: '本',
            above: 'ほん',
          },
          'は ',
          {
            text: '全',
            above: 'ぜん',
          },
          ' ',
          {
            text: '然',
            above: 'ぜん',
          },
          {
            text: '面',
            marks: ['strong'],
            above: 'おも',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '白',
            marks: ['strong'],
            above: 'しろ',
          },
          {
            text: 'くなかった',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'オ',
          {
            text: 'モシロ',
            above: '￣',
            below: '＼',
          },
          'イ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '603',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/hyottoko.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439884,
      anki_guid: 'G<ll=O6+df',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0033-する',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'する',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/9c724f8a061546e4da465b791fd8950e-aff65767dfef77c1bef4d5020d994959d446e0d4.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '彼はテニスを',
          {
            text: 'します',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/suruS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to do, to make',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'する',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['する'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'He plays tennis (lit: "He does tennis").',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '彼',
            above: 'かれ',
          },
          'はテニスを',
          {
            text: 'します',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ス',
          {
            text: 'ル',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '12',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/game_tetsuya_man.webp',
            role: 'support',
            label: 'Picture',
            alt: '徹夜でゲームをする人のイラスト（男性） | かわいいフリー素材集 ...',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439885,
      anki_guid: 'j^V<HCxc[G',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998454,
    },
  },
  {
    id: 'kaishi-0034-なる',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'なる',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/4ff4c70bfbd1c435b304f171869b06d2-4dca18f2fb5a714a1900c9358ac2459821f8b57f.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '日本語の勉強が好きに',
          {
            text: 'なりました',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/naruS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to become, to result in, to come (to do)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'なる',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['なる'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I have come to like Japanese study.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '日本',
            above: 'にほん',
          },
          ' ',
          {
            text: '語',
            above: 'ご',
          },
          'の ',
          {
            text: '勉',
            above: 'べん',
          },
          ' ',
          {
            text: '強',
            above: 'きょう',
          },
          'が ',
          {
            text: '好',
            above: 'す',
          },
          'きに',
          {
            text: 'なりました',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'This verb has many meanings and will take some time to assimilate properly.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ナ',
            above: '￣',
            below: '＼',
          },
          'ル',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '15',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/smartphone_camera_bijin.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439886,
      anki_guid: 'mfuJjTwDI4',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998489,
    },
  },
  {
    id: 'kaishi-0035-先生',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '先生',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/79481e379d111e2f10dc3569502d64a2-d7a3a07242e00fd0ec33fb47fc2cd6cf71bfcc57.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '私は日本語の',
          {
            text: '先生',
            marks: ['strong'],
          },
          'になりたいです。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/a1eea51e2177da098b4988e8aa34e2ea-8f44543f0896dc6cc0aace3d9e2082cb23ea7481.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'teacher',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'せんせい',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '先',
            above: 'せん',
          },
          ' ',
          {
            text: '生',
            above: 'せい',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'I want to become a Japanese teacher.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '私',
            above: 'わたし',
          },
          'は ',
          {
            text: '日本',
            above: 'にほん',
          },
          ' ',
          {
            text: '語',
            above: 'ご',
          },
          'の',
          {
            text: '先',
            marks: ['strong'],
            above: 'せん',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '生',
            marks: ['strong'],
            above: 'せい',
          },
          'になりたいです。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'セ',
          {
            text: 'ンセ',
            above: '￣',
            below: '＼',
          },
          'ー',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '277',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/job_teacher_man.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439887,
      anki_guid: 'H{4;e,l7Pc',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1776001277,
    },
  },
  {
    id: 'kaishi-0036-くた-さい',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'ください',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/ください_クダサ＼イ_3_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'コーヒーを',
          {
            text: 'ください',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/kudasaiS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'please give..., please do...',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ください',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['ください'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Please give me a coffee.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'コーヒーを',
          {
            text: 'ください',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ク',
          {
            text: 'ダサ',
            above: '￣',
            below: '＼',
          },
          'イ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '172',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/doorknob_sign1_okosanaide.webp',
            role: 'support',
            label: 'Picture',
            alt: 'いろいろなドアノブサインのイラスト | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439888,
      anki_guid: 'D:KI3V{p48',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0037-名前',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '名前',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/6f6e9ca121032766e44531d78d739464-f0de09ee6b36388f887ec8eeea39dd8633fbccb0.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あなたの',
          {
            text: '名前',
            marks: ['strong'],
          },
          'を教えてください。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/0587554fb10adb4ab4e58d0775863c7a-78ca37efe56709c031e1ec7e97ad4bc024b4df38.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'name',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'なまえ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '名',
            above: 'な',
          },
          ' ',
          {
            text: '前',
            above: 'まえ',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Please tell me your name.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あなたの',
          {
            text: '名',
            marks: ['strong'],
            above: 'な',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '前',
            marks: ['strong'],
            above: 'まえ',
          },
          'を ',
          {
            text: '教',
            above: 'おし',
          },
          'えてください。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ナ',
          {
            text: 'マエ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '264',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/pet_maigofuda_cat.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439889,
      anki_guid: 'ppYT,aaa9#',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0038-教える',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '教える',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/8f6b682140ce42c63ddec2ba5200d003-7bbde665d16f64c1b4fda091e902715514082a9a.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あなたの名前を',
          {
            text: '教えて',
            marks: ['strong'],
          },
          'ください。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/0587554fb10adb4ab4e58d0775863c7a-78ca37efe56709c031e1ec7e97ad4bc024b4df38.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to teach, to tell',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'おしえる',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '教',
            above: 'おし',
          },
          'える',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Please tell me your name.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あなたの ',
          {
            text: '名',
            above: 'な',
          },
          ' ',
          {
            text: '前',
            above: 'まえ',
          },
          'を',
          {
            text: '教',
            marks: ['strong'],
            above: 'おし',
          },
          {
            text: 'えて',
            marks: ['strong'],
          },
          'ください。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'オ',
          {
            text: 'シエル',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '257',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/school_class_woman_aseru.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439890,
      anki_guid: 'f&(tDTL>90',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998556,
    },
  },
  {
    id: 'kaishi-0039-ここ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'ここ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/e445a8f0202ac296f4ac247cc79cff14-e7444fc02ca7f192fcfa218bdd0ece9c4f09943c.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'ここ',
            marks: ['strong'],
          },
          'に本があります。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/edc80c601a7ab0131cc4d0ddda420a5c-91663add97635d7870b3902e4509418337960668.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'here',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ここ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['ここ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "There's a book here.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'ここ',
            marks: ['strong'],
          },
          'に ',
          {
            text: '本',
            above: 'ほん',
          },
          'があります。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'コ',
          {
            text: 'コ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '59',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kosoado1_koko.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439891,
      anki_guid: 'jtHL[aaNHN',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0040-そこ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'そこ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/75V.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: 'そこ',
            marks: ['strong'],
          },
          'はトイレです。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/sokoS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'there',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'そこ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['そこ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'There is the bathroom.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: 'そこ',
            marks: ['strong'],
          },
          'はトイレです。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ソ',
          {
            text: 'コ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '110',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kosoado1_soko.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439892,
      anki_guid: 'FE.Hq`{mdR',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0041-あそこ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'あそこ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/9dd0baeca90a894b5b08366e9145c731-6ddefb5c0a7db1dbd1a7def10da6a777484dd28d.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '彼は',
          {
            text: 'あそこ',
            marks: ['strong'],
          },
          'にいます。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/asokoS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'over there',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'あそこ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['あそこ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'He is over there.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '彼',
            above: 'かれ',
          },
          'は',
          {
            text: 'あそこ',
            marks: ['strong'],
          },
          'にいます。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ア',
          {
            text: 'ソコ',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '840',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/kosoado1_asoko.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439893,
      anki_guid: 'Ppqd&+pIa3',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0042-と-こ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'どこ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/c040358bf31eef715231b69c0b1bb3f7-c37d43cb0a99781f8f36f49ea4c25569936a110b.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あの本を',
          {
            text: 'どこ',
            marks: ['strong'],
          },
          'に置きましたか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/a5ad112ad26012971c1cd145d2500c4f-6fb6bcc849e3cc2e13da8c1325656de1c20b9ea4.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'where',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'どこ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['どこ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Where did you put that book?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あの ',
          {
            text: '本',
            above: 'ほん',
          },
          'を',
          {
            text: 'どこ',
            marks: ['strong'],
          },
          'に ',
          {
            text: '置',
            above: 'お',
          },
          'きましたか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ド',
            above: '￣',
            below: '＼',
          },
          'コ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '182',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/pose_sagasu_kyorokyoro_man.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439894,
      anki_guid: 'QEpjUA4U)Y',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0043-置く',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '置く',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/66ee151d6e524a561a5c19b631a6a2a6-59bbd69d5fc7eb0b801066131845bb1e690cf126.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あの本をどこに',
          {
            text: '置きました',
            marks: ['strong'],
          },
          'か。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/a5ad112ad26012971c1cd145d2500c4f-6fb6bcc849e3cc2e13da8c1325656de1c20b9ea4.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to put, to place',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'おく',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '置',
            above: 'お',
          },
          'く',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Where did you put that book?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あの ',
          {
            text: '本',
            above: 'ほん',
          },
          'をどこに',
          {
            text: '置',
            marks: ['strong'],
            above: 'お',
          },
          {
            text: 'きました',
            marks: ['strong'],
          },
          'か。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'オ',
          {
            text: 'ク',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '194',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/yuubin_takuhaiin_door.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439895,
      anki_guid: 'A-R7Jro*+>',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998612,
    },
  },
  {
    id: 'kaishi-0044-家',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '家',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/6c5a0f2191279946af4a89d07bcc865d-70bbd467c7c8fd72182fbc46f09f6764884d45d3.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'ここが私の',
          {
            text: '家',
            marks: ['strong'],
          },
          'です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/b848644912537ef2f2b4646035ad0b66-33384c0ec8bb6ca0eb0371490b6400dd141a1c6b.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'house, home',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'いえ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '家',
            above: 'いえ',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'This is my house.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'ここが ',
          {
            text: '私',
            above: 'わたし',
          },
          'の',
          {
            text: '家',
            marks: ['strong'],
            above: 'いえ',
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'Can also be read うち.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'イ',
          {
            text: 'エ',
            above: '￣',
            below: '＼',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '168',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/house_1f.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439896,
      anki_guid: 'L>FJEf[tsz',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0045-帰る',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '帰る',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/e484ea757416ce081cddaecf59f22f5c-d85323507909d6ee593abdbdead2dc602bb36d54.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '家に',
          {
            text: '帰ろう',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/5836ca64c9d6c53bbbd7c8e5fbd1c2ce-ccb39ffb539d15fec7914f3ed075d8a4ffddb03d.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to return, to go back',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'かえる',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '帰',
            above: 'かえ',
          },
          'る',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "Let's go home.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '家',
            above: 'うち',
          },
          'に',
          {
            text: '帰',
            marks: ['strong'],
            above: 'かえ',
          },
          {
            text: 'ろう',
            marks: ['strong'],
          },
          '。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'カ',
            above: '￣',
            below: '＼',
          },
          'エル',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '220',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/mark_arrow_uturn.webp',
            role: 'support',
            label: 'Picture',
            alt: 'いろいろな矢印のイラスト | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439897,
      anki_guid: 'D/6?w0V?4`',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998239,
    },
  },
  {
    id: 'kaishi-0046-話',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '話',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/b1bb3219fd4976ecaaaf9eb5300fcb07-f6f9964908766ea4be4fb5c040cff6bd47f64806.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あなたの',
          {
            text: '話',
            marks: ['strong'],
          },
          'は面白いね。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/c9077bf9c6877fcc52b231002c88ad96-57c38a220f63b5b0d5ebac0716c67cd861636ddd.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'talk, story',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'はなし',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '話',
            above: 'はなし',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Your story is interesting.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あなたの',
          {
            text: '話',
            marks: ['strong'],
            above: 'はなし',
          },
          'は ',
          {
            text: '面',
            above: 'おも',
          },
          ' ',
          {
            text: '白',
            above: 'しろ',
          },
          'いね。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'ハ',
          {
            text: 'ナシ',
            above: '￣',
            below: '＼',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '101',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/hanashi_nagai_woman.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439898,
      anki_guid: 'K4]+3Ar1a3',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0047-知る',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '知る',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/b181b22d729c84793ebb6329aad15585-f0a435ef1b54a6065fa1aa52c350fdf74d20d628.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'あの人を',
          {
            text: '知っています',
            marks: ['strong'],
          },
          'か。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/shiruS.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'to know',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'しる',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '知',
            above: 'し',
          },
          'る',
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Do you know that person?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'あの ',
          {
            text: '人',
            above: 'ひと',
          },
          'を',
          {
            text: '知',
            marks: ['strong'],
            above: 'し',
          },
          {
            text: 'っています',
            marks: ['strong'],
          },
          'か。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'シ',
          {
            text: 'ル',
            above: '￣',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '68',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/book_fukayomi_woman.webp',
            role: 'support',
            label: 'Picture',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439899,
      anki_guid: 'u+]g/3;ZlH',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1775998566,
    },
  },
  {
    id: 'kaishi-0048-彼女',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: '彼女',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/彼女_カ＼ノジョ_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          {
            text: '彼女',
            marks: ['strong'],
          },
          'の名前を知っていますか。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N4_0572-02.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'she, her, girlfriend',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'かのじょ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: [
          {
            text: '彼',
            above: 'かの',
          },
          ' ',
          {
            text: '女',
            above: 'じょ',
          },
        ],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'Do you know her name?',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '彼',
            marks: ['strong'],
            above: 'かの',
          },
          {
            text: ' ',
            marks: ['strong'],
          },
          {
            text: '女',
            marks: ['strong'],
            above: 'じょ',
          },
          'の ',
          {
            text: '名',
            above: 'な',
          },
          ' ',
          {
            text: '前',
            above: 'まえ',
          },
          'を ',
          {
            text: '知',
            above: 'し',
          },
          'っていますか。',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'カ',
            above: '￣',
            below: '＼',
          },
          'ノジョ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '100',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/couple_nakaii_hug-1a63b9a55f49f038fbc149c9980191fc4830c6d8.webp',
            role: 'support',
            label: 'Picture',
            alt: '仲の良いカップルのイラスト | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439900,
      anki_guid: 'kD){c?imQq',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0049-ちゃん',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'ちゃん',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/chan.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          '彼女はララ',
          {
            text: 'ちゃん',
            marks: ['strong'],
          },
          'です。',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0004.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'chan',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'ちゃん',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['ちゃん'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'She is Lara-chan.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          {
            text: '彼',
            above: 'かの',
          },
          ' ',
          {
            text: '女',
            above: 'じょ',
          },
          'はララ',
          {
            text: 'ちゃん',
            marks: ['strong'],
          },
          'です。',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Notes',
        text: 'Honorific usually used to show endearment, especially with girls and small children.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'チャ',
            above: '￣',
            below: '＼',
          },
          'ン*',
        ],
        language: 'ja',
      },
      {
        role: 'note',
        label: 'Pitch Accent Notes',
        text: 'If the name has an accent, ちゃん and all other honorifics are pronounced low: 高橋ちゃん → たか＼はしちゃん, while if a name is heiban, all honorifics are also flat so 平田ちゃん would be ひらたちゃん￣.',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '120',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/stand1_front02_girl.webp',
            role: 'support',
            label: 'Picture',
            alt: '立っている女の子のイラスト（ポーズ） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439901,
      anki_guid: 'co94A,*H>6',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0050-はい',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'はい',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/はい_ハ＼イ_1_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'A「山田さんですか。」\nB「',
          {
            text: 'はい',
            marks: ['strong'],
          },
          '。」',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0009.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'yes (polite)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'はい',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['はい'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: 'A: Are you Yamada-san?\nB: Yes, I am.',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'A「 ',
          {
            text: '山',
            above: 'やま',
          },
          ' ',
          {
            text: '田',
            above: 'だ',
          },
          'さんですか。」\nB「',
          {
            text: 'はい',
            marks: ['strong'],
          },
          '。」',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          {
            text: 'ハ',
            above: '￣',
            below: '＼',
          },
          'イ',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '92',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/poze_unazuku_woman-88221395705f6c44767ea705c3c5de96d2e7b9e6.webp',
            role: 'support',
            label: 'Picture',
            alt: '頷いている人のイラスト（女性） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439902,
      anki_guid: 'scNB25sDl&',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1714298668,
    },
  },
  {
    id: 'kaishi-0051-いいえ',
    type: 'prompt_response',
    deck: 'kaishi-1-5k',
    language: 'ja',
    answer_mode: 'reveal',
    prompt: [
      {
        role: 'main',
        text: 'いいえ',
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/いいえ_イーエ＼_3_NHK-2016.mp3',
            role: 'main',
            label: 'Word Audio',
          },
        ],
      },
      {
        role: 'context',
        label: 'Sentence',
        runs: [
          'A「山田さんですか。」\nB「',
          {
            text: 'いいえ',
            marks: ['strong'],
          },
          '。」',
        ],
        language: 'ja',
        media: [
          {
            kind: 'audio',
            src: 'assets/audio/JLPT_Tango_N5_0011.mp3',
            role: 'context',
            label: 'Sentence Audio',
          },
        ],
      },
    ],
    answer: [
      {
        role: 'main',
        label: 'Word Meaning',
        text: 'no (polite)',
        language: 'en',
      },
      {
        role: 'support',
        label: 'Word Reading',
        text: 'いいえ',
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Word Furigana',
        runs: ['いいえ'],
        language: 'ja',
      },
      {
        role: 'context',
        label: 'Sentence Meaning',
        text: "A: Are you Yamada-san?\nB: No, I'm not.",
        language: 'en',
      },
      {
        role: 'support',
        label: 'Sentence Furigana',
        runs: [
          'A「 ',
          {
            text: '山',
            above: 'やま',
          },
          ' ',
          {
            text: '田',
            above: 'だ',
          },
          'さんですか。」\nB「',
          {
            text: 'いいえ',
            marks: ['strong'],
          },
          '。」',
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Pitch Accent',
        runs: [
          'イ',
          {
            text: 'ーエ',
            above: '￣',
            below: '＼',
          },
        ],
        language: 'ja',
      },
      {
        role: 'support',
        label: 'Frequency',
        text: '8787',
      },
      {
        role: 'support',
        label: 'Picture',
        media: [
          {
            kind: 'image',
            src: 'assets/images/pose_kubifuri_woman-abcb54fc6539f2a2fa343c63e40b5e6ed53f0b46.webp',
            role: 'support',
            label: 'Picture',
            alt: '首を振っている人のイラスト（女性） | かわいいフリー素材集 いらすとや',
          },
        ],
      },
    ],
    provenance: {
      importer: 'stuff/convert-kaishi-to-open-deck.ts',
      anki_note_id: 1708637439903,
      anki_guid: 'c/T!2r-5BM',
      anki_note_type: 'Kaishi 1.5k',
      anki_mod: 1776001359,
    },
  },
]
