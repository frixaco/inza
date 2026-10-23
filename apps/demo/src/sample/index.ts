// Sample data for the Inza design prototypes. The Kaishi notes are real rows from the
// local Kaishi 1.5k Open Deck. Every total on screen is computed from these rows.
import kaishiRows from './kaishi.json'

export type CardState = 'new' | 'learning' | 'review'
export type NoteType = 'prompt_response' | 'cloze' | 'occlusion'
export type Grade = 'again' | 'hard' | 'good' | 'easy'

export type Deck = {
  id: string
  name: string
  description: string
  type: NoteType
  notes: number
  cards: { new: number; learning: number; young: number; mature: number; suspended: number }
  today: { new: number; learn: number; review: number }
  newPerDay: number | null // null inherits the global limit
  reviewsPerDay: number | null
  lastStudied: string | null
  sizeBytes: number
  importedAt: string
}

export type KaishiNote = {
  id: string
  word: string
  sentence: string
  sentenceHtml: string
  reading: string
  meaning: string
  sentenceMeaning: string
  furigana: string
  notes: string
  frequency: number | null
  image: string | null
  imageAlt: string | null
}

export type ClozeNote = { id: string; html: string; translation: string; clozes: string[] }

export type KanaCell = { id: string; kana: string; romaji: string; row: number; col: number }

export const today = new Date('2026-10-21T19:40:00')

const images = import.meta.glob<string>('./images/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})
export const assetUrl = (name: string) => images[`./images/${name}`]

export const kaishi = kaishiRows as KaishiNote[]

export const cloze: ClozeNote[] = [
  ['私<c1>は</c1>学生です。', 'I am a student.'],
  ['駅<c1>まで</c1>歩きます。', 'I walk to the station.'],
  ['毎朝コーヒー<c1>を</c1>飲みます。', 'I drink coffee every morning.'],
  ['友達<c1>と</c1>映画<c2>を</c2>見ました。', 'I watched a movie with a friend.'],
  ['図書館<c1>で</c1>勉強します。', 'I study at the library.'],
  ['日本<c1>に</c1>行きたいです。', 'I want to go to Japan.'],
  ['これは私<c1>の</c1>本です。', 'This is my book.'],
  ['雨<c1>が</c1>降っています。', 'It is raining.'],
].map(([source, translation], i) => {
  const clozes = [...source.matchAll(/<(c\d)>/g)].map((m) => m[1])
  return {
    id: `particles-${String(i + 1).padStart(3, '0')}`,
    html: source.replace(/<(c\d)>(.*?)<\/c\d>/g, '<span data-cloze="$1">$2</span>'),
    translation,
    clozes,
  }
})

const kanaRows = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', '', 'ゆ', '', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', '', '', '', 'を'],
  ['ん', '', '', '', ''],
]
const romaji = [
  ['a', 'i', 'u', 'e', 'o'],
  ['ka', 'ki', 'ku', 'ke', 'ko'],
  ['sa', 'shi', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'],
  ['na', 'ni', 'nu', 'ne', 'no'],
  ['ha', 'hi', 'fu', 'he', 'ho'],
  ['ma', 'mi', 'mu', 'me', 'mo'],
  ['ya', '', 'yu', '', 'yo'],
  ['ra', 'ri', 'ru', 're', 'ro'],
  ['wa', '', '', '', 'wo'],
  ['n', '', '', '', ''],
]
export const kana: KanaCell[] = kanaRows.flatMap((row, r) =>
  row.flatMap((k, c) =>
    k ? [{ id: romaji[r][c], kana: k, romaji: romaji[r][c], row: r, col: c }] : [],
  ),
)
// The occlusion note hides one cell per card; the card under review hides "ni".
export const occlusionTarget = 'ni'

export const decks: Deck[] = [
  {
    id: 'kaishi-1-5k',
    name: 'Kaishi 1.5k',
    description: 'Core Japanese vocabulary with sentences, audio and pictures',
    type: 'prompt_response',
    notes: 1500,
    cards: { new: 688, learning: 14, young: 512, mature: 284, suspended: 2 },
    today: { new: 20, learn: 9, review: 86 },
    newPerDay: null,
    reviewsPerDay: null,
    lastStudied: '2026-10-21T08:12:00',
    sizeBytes: 110_650_085,
    importedAt: '2026-09-10T21:04:00',
  },
  {
    id: 'particles',
    name: 'Particles in context',
    description: 'Cloze sentences for は, が, を, に, で, と and the rest',
    type: 'cloze',
    notes: 120,
    cards: { new: 96, learning: 6, young: 52, mature: 10, suspended: 0 },
    today: { new: 10, learn: 2, review: 12 },
    newPerDay: 10,
    reviewsPerDay: null,
    lastStudied: '2026-10-20T22:30:00',
    sizeBytes: 418_304,
    importedAt: '2026-09-28T18:40:00',
  },
  {
    id: 'hiragana',
    name: 'Hiragana chart',
    description: 'Image occlusion over the gojūon table',
    type: 'occlusion',
    notes: 1,
    cards: { new: 0, learning: 1, young: 9, mature: 36, suspended: 0 },
    today: { new: 0, learn: 1, review: 3 },
    newPerDay: null,
    reviewsPerDay: null,
    lastStudied: '2026-10-19T07:55:00',
    sizeBytes: 1_212_416,
    importedAt: '2026-09-02T09:15:00',
  },
  {
    id: 'radicals',
    name: 'Kanji radicals',
    description: 'The 214 Kangxi radicals with meanings',
    type: 'prompt_response',
    notes: 214,
    cards: { new: 214, learning: 0, young: 0, mature: 0, suspended: 0 },
    today: { new: 0, learn: 0, review: 0 },
    newPerDay: 0,
    reviewsPerDay: null,
    lastStudied: null,
    sizeBytes: 905_216,
    importedAt: '2026-10-14T20:02:00',
  },
]

export const deckCards = (d: Deck) =>
  d.cards.new + d.cards.learning + d.cards.young + d.cards.mature + d.cards.suspended
export const deckDue = (d: Deck) => d.today.new + d.today.learn + d.today.review

export const totals = decks.reduce(
  (sum, d) => ({
    new: sum.new + d.today.new,
    learn: sum.learn + d.today.learn,
    review: sum.review + d.today.review,
  }),
  { new: 0, learn: 0, review: 0 },
)
export const totalDue = totals.new + totals.learn + totals.review

// Anki's default: spread new cards evenly through the due queue.
export function interleave(due: number, fresh: number): ('due' | 'new')[] {
  const out: ('due' | 'new')[] = []
  const ratio = (due + 1) / (fresh + 1)
  let d = 0
  let n = 0
  while (d < due || n < fresh) {
    const takeNew = n < fresh && (d === due || (n + 1) * ratio < d + 1)
    if (takeNew) n++
    else d++
    out.push(takeNew ? 'new' : 'due')
  }
  return out
}

export type QueueItem = { kind: CardState; deckId: string }
export function queueFor(deck: Deck): QueueItem[] {
  const due: CardState[] = []
  // Learning cards are due first in Anki's order; reviews follow.
  for (let i = 0; i < deck.today.learn; i++) due.push('learning')
  for (let i = 0; i < deck.today.review; i++) due.push('review')
  let di = 0
  return interleave(due.length, deck.today.new).map((k) => ({
    kind: k === 'new' ? 'new' : due[di++],
    deckId: deck.id,
  }))
}

export const intervals: Record<CardState, Record<Grade, string>> = {
  new: { again: '1m', hard: '6m', good: '10m', easy: '4d' },
  learning: { again: '1m', hard: '6m', good: '1d', easy: '5d' },
  review: { again: '10m', hard: '3d', good: '8d', easy: '19d' },
}

// Review history: Kaishi started 41 days ago at 20 new cards a day.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(1500)
const day = (offset: number) => {
  const d = new Date(today)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  return d
}
const missed = new Set([-17, -9])

export type DayStat = { date: Date; reviews: number; again: number; seconds: number }
export const history: DayStat[] = Array.from({ length: 42 }, (_, i) => {
  const offset = i - 41
  if (missed.has(offset)) return { date: day(offset), reviews: 0, again: 0, seconds: 0 }
  if (offset === 0) return { date: day(0), reviews: 37, again: 4, seconds: 37 * 8 }
  const reviews = Math.round(20 + (i + 1) * 2.6 + (rand() - 0.5) * 26)
  const again = Math.round(reviews * (0.08 + rand() * 0.06))
  return { date: day(offset), reviews, again, seconds: Math.round(reviews * (6.5 + rand() * 2.5)) }
})

export const streak = (() => {
  let n = 0
  for (let i = history.length - 1; i >= 0 && history[i].reviews > 0; i--) n++
  return n
})()

export const forecast = Array.from({ length: 30 }, (_, i) => {
  const base = 150 - i * 1.6 + Math.sin(i / 2.3) * 14
  return { date: day(i + 1), reviews: Math.max(40, Math.round(base + (rand() - 0.5) * 30)) }
})

const last30 = history.slice(-30)
export const month = {
  reviews: last30.reduce((s, d) => s + d.reviews, 0),
  again: last30.reduce((s, d) => s + d.again, 0),
  seconds: last30.reduce((s, d) => s + d.seconds, 0),
  daysStudied: last30.filter((d) => d.reviews > 0).length,
}
export const retention = 1 - month.again / month.reviews

export const cardStates = decks.reduce(
  (s, d) => ({
    new: s.new + d.cards.new,
    learning: s.learning + d.cards.learning,
    young: s.young + d.cards.young,
    mature: s.mature + d.cards.mature,
    suspended: s.suspended + d.cards.suspended,
  }),
  { new: 0, learning: 0, young: 0, mature: 0, suspended: 0 },
)

export type BrowseItem = {
  id: string
  deckId: string
  type: NoteType
  title: string
  subtitle: string
  state: CardState | 'suspended'
  due: string
  stability: number | null
  difficulty: number | null
  retrievability: number | null
  reps: number
  lapses: number
  kaishi?: KaishiNote
  cloze?: ClozeNote
}

const dueLabel = (days: number) =>
  days <= 0
    ? 'Today'
    : days === 1
      ? 'Tomorrow'
      : days < 30
        ? `In ${days} days`
        : `In ${Math.round(days / 30)} mo`

export const browse: BrowseItem[] = [
  ...kaishi.map((n, i): BrowseItem => {
    const state: BrowseItem['state'] =
      i === 7 || i === 23 ? 'suspended' : i < 34 ? 'review' : i < 40 ? 'learning' : 'new'
    const s = state === 'review' ? Math.round((4 + ((i * 7) % 31)) * 10) / 10 : null
    return {
      id: n.id,
      deckId: 'kaishi-1-5k',
      type: 'prompt_response',
      title: n.word,
      subtitle: n.meaning,
      state,
      due:
        state === 'new'
          ? 'New'
          : state === 'suspended'
            ? 'Suspended'
            : state === 'learning'
              ? 'Today'
              : dueLabel((i * 5) % 23),
      stability: s,
      difficulty: state === 'new' ? null : Math.round((3.2 + ((i * 13) % 50) / 10) * 10) / 10,
      retrievability:
        state === 'review' ? Math.round((0.86 + ((i * 3) % 12) / 100) * 100) / 100 : null,
      reps: state === 'new' ? 0 : 3 + (i % 9),
      lapses: state === 'new' ? 0 : i % 4 === 0 ? 1 : 0,
      kaishi: n,
    }
  }),
  ...cloze.map(
    (c, i): BrowseItem => ({
      id: c.id,
      deckId: 'particles',
      type: 'cloze',
      title: c.html.replace(/<span data-cloze="c\d">(.*?)<\/span>/g, '[$1]'),
      subtitle: c.translation,
      state: i < 5 ? 'review' : 'new',
      due: i < 5 ? dueLabel(i * 3) : 'New',
      stability: i < 5 ? 6.2 + i : null,
      difficulty: i < 5 ? 4.1 + i / 2 : null,
      retrievability: i < 5 ? 0.9 : null,
      reps: i < 5 ? 4 : 0,
      lapses: 0,
      cloze: c,
    }),
  ),
  {
    id: 'hiragana-gojuon',
    deckId: 'hiragana',
    type: 'occlusion',
    title: 'Gojūon table',
    subtitle: `${kana.length} masks`,
    state: 'review',
    due: 'Today',
    stability: 41.8,
    difficulty: 2.4,
    retrievability: 0.97,
    reps: 312,
    lapses: 6,
  },
]

export const reviewLog = [
  { date: '2026-10-13', grade: 'good' as Grade, interval: '8d' },
  { date: '2026-10-05', grade: 'good' as Grade, interval: '3d' },
  { date: '2026-10-02', grade: 'again' as Grade, interval: '10m' },
  { date: '2026-09-24', grade: 'good' as Grade, interval: '4d' },
  { date: '2026-09-20', grade: 'easy' as Grade, interval: '4d' },
]

export const settings = {
  newPerDay: 20,
  reviewsPerDay: 200,
  desiredRetention: 0.9,
  optimizedAt: '2026-10-02',
  reviewsSinceOptimize: history
    .filter((d) => d.date >= new Date('2026-10-02'))
    .reduce((s, d) => s + d.reviews, 0),
  params: [
    0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835,
    0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
  ],
  reviewLogBytes: 2_310_144,
  quotaBytes: 2_576_980_378,
}
export const storageUsed = decks.reduce((s, d) => s + d.sizeBytes, 0) + settings.reviewLogBytes

// Import sample: the files a folder import walks through.
export const importFiles = [
  { path: 'deck.yaml', bytes: 412 },
  { path: 'notes/0001-0250.yaml', bytes: 486_201 },
  { path: 'notes/0251-0500.yaml', bytes: 471_934 },
  { path: 'notes/0501-0750.yaml', bytes: 468_120 },
  { path: 'notes/0751-1000.yaml', bytes: 470_877 },
  { path: 'notes/1001-1250.yaml', bytes: 466_502 },
  { path: 'notes/1251-1500.yaml', bytes: 463_819 },
  { path: 'assets/audio · 3,000 files', bytes: 66_108_220 },
  { path: 'assets/images · 1,382 files', bytes: 41_714_010 },
]
export const importTotal = importFiles.reduce((s, f) => s + f.bytes, 0)

// Formatting shared by both prototypes.
export const fmt = {
  int: (n: number) => n.toLocaleString('en-US'),
  pct: (n: number, d = 1) => `${(n * 100).toFixed(d)}%`,
  bytes: (b: number) =>
    b >= 1e9
      ? `${(b / 1e9).toFixed(1)} GB`
      : b >= 1e6
        ? `${(b / 1e6).toFixed(1)} MB`
        : `${Math.round(b / 1e3)} KB`,
  minutes: (s: number) => {
    const m = Math.round(s / 60)
    return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} m` : `${m} m`
  },
  weekday: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' }),
  dayMonth: (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  long: (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  relative: (iso: string | null) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    const days = Math.round((day(0).getTime() - new Date(d.toDateString()).getTime()) / 864e5)
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    return days === 0 ? `Today ${time}` : days === 1 ? `Yesterday ${time}` : `${days} days ago`
  },
}

console.assert(
  decks.every((d) => d.notes > 0 && deckCards(d) >= d.notes),
  'every deck has at least one card per note',
)
console.assert(deckCards(decks[0]) === 1500, 'Kaishi has 1,500 cards')
console.assert(deckCards(decks[2]) === kana.length, 'one hiragana card per mask')
console.assert(queueFor(decks[0]).length === deckDue(decks[0]), 'queue length equals due count')
