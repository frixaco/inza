export type Deck = {
  id: string;
  name: string;
  path: string;
  due: number;
  learn: number;
  new: number;
  tint: string;
};

export type Stats = {
  due: number;
  learning: number;
  new: number;
  retention: number;
  estimate: number;
  fsrs: number;
  queued: number;
};

export type Card = {
  id: string;
  deckId: string;
  prompt: string;
  answer: string;
  type: "prompt_response";
};

export const DECKS: Deck[] = [
  {
    id: "1",
    name: "Japanese Core",
    path: "Languages / Kaishi 1.5k",
    due: 64,
    learn: 8,
    new: 12,
    tint: "#ef4444",
  },
  {
    id: "2",
    name: "Medicine",
    path: "School / Pathoma + Sketchy",
    due: 47,
    learn: 11,
    new: 0,
    tint: "#22c55e",
  },
  {
    id: "3",
    name: "Art History",
    path: "Great Works of Art",
    due: 39,
    learn: 5,
    new: 6,
    tint: "#f59e0b",
  },
  {
    id: "4",
    name: "HSK 3000 Characters",
    path: "Chinese / Writing",
    due: 88,
    learn: 16,
    new: 18,
    tint: "#a855f7",
  },
  {
    id: "5",
    name: "LeetCode Patterns",
    path: "Programming / Algorithms",
    due: 23,
    learn: 3,
    new: 4,
    tint: "#06b6d4",
  },
];

export const STATS: Stats = {
  due: 261,
  learning: 43,
  new: 40,
  retention: 92,
  estimate: 38,
  fsrs: 91,
  queued: 124,
};

export const SAMPLE_CARDS: Card[] = [
  {
    id: "c1",
    deckId: "1",
    type: "prompt_response",
    prompt: "What is the reading of 私?",
    answer: "わたし (watashi)",
  },
  {
    id: "c2",
    deckId: "1",
    type: "prompt_response",
    prompt: "Translate: 私はアンです。",
    answer: "I am Anne.",
  },
  {
    id: "c3",
    deckId: "4",
    type: "prompt_response",
    prompt: "What is the meaning of 你?",
    answer: "You (nǐ)",
  },
  {
    id: "c4",
    deckId: "5",
    type: "prompt_response",
    prompt: "What is the time complexity of merge sort?",
    answer: "O(n log n)",
  },
  {
    id: "c5",
    deckId: "2",
    type: "prompt_response",
    prompt: "What is the function of the ACL?",
    answer: "Prevents anterior translation of the tibia relative to the femur.",
  },
];
