import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import YAML from "yaml";

type Role = "main" | "context" | "support" | "note";

type ContentBlock = {
  role: Role;
  label?: string;
  text: string;
  language?: string;
};

type MediaRef = {
  kind: "audio" | "image" | "video";
  src: string;
  role?: Role;
  label?: string;
  alt?: string;
};

type RawNote = {
  id: string;
  type?: string;
  answer_mode?: string;
  tags?: string[];
  prompt: string | ContentBlock[];
  answer: string | ContentBlock[];
  media?: MediaRef[];
};

type NoteFile = {
  defaults?: Partial<RawNote> & { deck?: string };
  notes: RawNote[];
};

type DeckManifest = {
  id: string;
  title: string;
  description?: string;
  language?: string;
};

type DeckData = {
  manifest: DeckManifest;
  notes: RawNote[];
};

const DECK_ROOT = "/deck";
const ROLES: Role[] = ["main", "context", "support", "note"];

function encodeAssetPath(src: string) {
  return `${DECK_ROOT}/${src.split("/").map(encodeURIComponent).join("/")}`;
}

function normalizeBlocks(content: string | ContentBlock[], fallbackRole: Role): ContentBlock[] {
  if (Array.isArray(content)) {
    return content;
  }

  return [{ role: fallbackRole, text: content }];
}

async function fetchYaml<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}: ${response.status}`);
  }

  return YAML.parse(await response.text()) as T;
}

async function loadDeck(): Promise<DeckData> {
  const manifest = await fetchYaml<DeckManifest>(`${DECK_ROOT}/deck.yaml`);
  const noteFile = await fetchYaml<NoteFile>(`${DECK_ROOT}/notes/kaishi-sample.yaml`);
  const defaults = noteFile.defaults ?? {};
  const notes = noteFile.notes.map((note) => ({ ...defaults, ...note }));

  return { manifest, notes };
}

function roleLabel(role: Role) {
  return role[0].toUpperCase() + role.slice(1);
}

function BlockList({ blocks, side }: { blocks: ContentBlock[]; side: "prompt" | "answer" }) {
  return (
    <div className={`block-list block-list-${side}`}>
      {blocks.map((block, index) => (
        <section className={`content-block role-${block.role}`} key={`${block.role}-${block.label ?? "block"}-${index}`}>
          <div className="block-meta">
            <span>{block.label ?? roleLabel(block.role)}</span>
          </div>
          <div className="block-text" lang={block.language}>
            <ReactMarkdown>{block.text}</ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}

function MediaStrip({ media, roles }: { media: MediaRef[]; roles: Role[] }) {
  const filtered = media.filter((item) => roles.includes(item.role ?? "support"));

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="media-strip">
      {filtered.map((item) => {
        const src = encodeAssetPath(item.src);

        if (item.kind === "audio") {
          return (
            <button className="audio-button" key={item.src} type="button" onClick={() => void new Audio(src).play()}>
              <Volume2 size={18} aria-hidden="true" />
              <span>{item.label ?? "Audio"}</span>
            </button>
          );
        }

        if (item.kind === "image") {
          return (
            <figure className="image-media" key={item.src}>
              <img src={src} alt={item.alt ?? item.label ?? ""} loading="lazy" />
              {item.label ? <figcaption>{item.label}</figcaption> : null}
            </figure>
          );
        }

        return (
          <video className="video-media" key={item.src} src={src} controls>
            {item.label ?? item.src}
          </video>
        );
      })}
    </div>
  );
}

function ProgressDots({ count, active, onSelect }: { count: number; active: number; onSelect: (index: number) => void }) {
  return (
    <div className="progress-dots" aria-label="Card picker">
      {Array.from({ length: count }, (_, index) => (
        <button
          aria-label={`Go to card ${index + 1}`}
          aria-current={index === active ? "step" : undefined}
          className={index === active ? "active" : ""}
          key={index}
          type="button"
          onClick={() => onSelect(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

export function App() {
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    loadDeck().then(setDeck).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : String(caught)));
  }, []);

  const note = deck?.notes[index];
  const promptBlocks = useMemo(() => (note ? normalizeBlocks(note.prompt, "main") : []), [note]);
  const answerBlocks = useMemo(() => (note ? normalizeBlocks(note.answer, "support") : []), [note]);

  const selectCard = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
    setRevealed(false);
  }, []);

  const move = useCallback(
    (direction: 1 | -1) => {
      if (!deck) return;
      const nextIndex = (index + direction + deck.notes.length) % deck.notes.length;
      selectCard(nextIndex);
    },
    [deck, index, selectCard],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      if (event.key === " ") {
        event.preventDefault();
        setRevealed((current) => !current);
      }

      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  if (error) {
    return (
      <main className="app-shell center-shell">
        <section className="status-panel">
          <h1>Deck load failed</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!deck || !note) {
    return (
      <main className="app-shell center-shell">
        <section className="status-panel">
          <h1>Loading deck</h1>
          <p>Reading the Open Deck YAML sample.</p>
        </section>
      </main>
    );
  }

  const media = note.media ?? [];
  const mainAnswer = answerBlocks.find((block) => block.role === "main");

  return (
    <main className="app-shell">
      <aside className="deck-panel">
        <div>
          <p className="deck-kicker">Open Deck stress test</p>
          <h1>{deck.manifest.title}</h1>
          <p>{deck.manifest.description}</p>
        </div>

        <div className="deck-stats" aria-label="Deck status">
          <span>{index + 1}</span>
          <span>/</span>
          <span>{deck.notes.length}</span>
        </div>

        <ProgressDots count={deck.notes.length} active={index} onSelect={selectCard} />
      </aside>

      <section className="review-surface" aria-live="polite">
        <header className="review-header">
          <div>
            <p>{note.id}</p>
            <h2>{promptBlocks[0]?.text ?? "Card"}</h2>
          </div>
          <button className="ghost-button" type="button" onClick={() => setRevealed(false)}>
            <RotateCcw size={18} aria-hidden="true" />
            Reset
          </button>
        </header>

        <div className="card-stage">
          <section className="prompt-pane" aria-label="Prompt">
            <BlockList blocks={promptBlocks} side="prompt" />
            <MediaStrip media={media} roles={["main", "context"]} />
          </section>

          <section className={`answer-pane ${revealed ? "is-visible" : ""}`} aria-label="Answer">
            {revealed ? (
              <>
                {mainAnswer ? (
                  <div className="answer-callout">
                    <span className="answer-label">{mainAnswer.label ?? "Answer"}</span>
                    <ReactMarkdown>{mainAnswer.text}</ReactMarkdown>
                  </div>
                ) : null}
                <BlockList blocks={answerBlocks.filter((block) => block !== mainAnswer)} side="answer" />
                <MediaStrip media={media} roles={["support", "note"]} />
              </>
            ) : (
              <button className="reveal-button" type="button" onClick={() => setRevealed(true)}>
                <Eye size={20} aria-hidden="true" />
                Reveal answer
              </button>
            )}
          </section>
        </div>

        <footer className="review-actions">
          <button className="nav-button" type="button" onClick={() => move(-1)}>
            <ChevronLeft size={20} aria-hidden="true" />
            Previous
          </button>
          <button className="flip-button" type="button" onClick={() => setRevealed((current) => !current)}>
            {revealed ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            {revealed ? "Hide" : "Reveal"}
          </button>
          <button className="nav-button" type="button" onClick={() => move(1)}>
            Next
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </footer>
      </section>
    </main>
  );
}
