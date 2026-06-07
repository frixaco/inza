import { ChevronLeft, ChevronRight, Eye, RotateCcw, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import YAML from "yaml";

type Role = "main" | "context" | "support" | "note";
type InlineMark = "strong" | "emphasis" | "code" | "strike" | "highlight";
type InlineRun =
  | string
  | {
      text: string;
      marks?: InlineMark[];
      above?: string;
      below?: string;
      link?: string;
    };

type ContentBlock = {
  role: Role;
  label?: string;
  text?: string;
  runs?: InlineRun[];
  language?: string;
  media?: MediaRef[];
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
const OVERLINE_MARK = "￣";
const DROP_MARK = "＼";
const NOTE_FILES = [
  "0001-0250.yaml",
  "0251-0500.yaml",
  "0501-0750.yaml",
  "0751-1000.yaml",
  "1001-1250.yaml",
  "1251-1500.yaml",
  "1501-1501.yaml",
] as const;

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
  const noteFiles = await Promise.all(
    NOTE_FILES.map((name) => fetchYaml<NoteFile>(`${DECK_ROOT}/notes/${name}`)),
  );
  const notes = noteFiles.flatMap((noteFile) => {
    const defaults = noteFile.defaults ?? {};
    return noteFile.notes.map((note) => ({ ...defaults, ...note }));
  });

  return { manifest, notes };
}

function roleLabel(role: Role) {
  return role[0].toUpperCase() + role.slice(1);
}

function textDensity(text?: string) {
  const length = text?.trim().replace(/\s+/g, " ").length ?? 0;

  if (length <= 8) return "density-token";
  if (length <= 28) return "density-short";
  if (length <= 90) return "density-medium";
  return "density-long";
}

function runsText(runs?: InlineRun[]) {
  return runs?.map((run) => (typeof run === "string" ? run : run.text)).join("") ?? "";
}

function InlineRuns({ runs, language }: { runs: InlineRun[]; language?: string }) {
  return (
    <div className="block-text block-runs" lang={language}>
      {runs.map((run, index) => {
        if (typeof run === "string") {
          return <span key={`${run}-${index}`}>{run}</span>;
        }

        const isPitchOverline = run.above === OVERLINE_MARK;
        const isPitchDrop = run.below === DROP_MARK;
        const classes = [
          "inline-run",
          isPitchOverline ? "pitch-overline" : "",
          isPitchDrop ? "pitch-drop" : "",
          run.above && !isPitchOverline ? "has-above" : "",
          run.below && !isPitchDrop ? "has-below" : "",
          ...(run.marks ?? []).map((mark) => `mark-${mark}`),
        ]
          .filter(Boolean)
          .join(" ");

        const content = (
          <span className={classes}>
            {run.above && !isPitchOverline ? (
              <span className="run-adornment run-above">{run.above}</span>
            ) : null}
            <span className="run-text">{run.text}</span>
            {run.below && !isPitchDrop ? (
              <span className="run-adornment run-below">{run.below}</span>
            ) : null}
          </span>
        );

        if (run.link) {
          return (
            <a
              className="inline-link"
              href={run.link}
              key={`${run.text}-${index}`}
              rel="noreferrer"
              target="_blank"
            >
              {content}
            </a>
          );
        }

        return <span key={`${run.text}-${index}`}>{content}</span>;
      })}
    </div>
  );
}

function BlockList({ blocks, side }: { blocks: ContentBlock[]; side: "prompt" | "answer" }) {
  return (
    <div className={`block-list block-list-${side}`}>
      {blocks.map((block, index) => (
        <section
          className={`content-block role-${block.role} ${textDensity(block.text ?? runsText(block.runs))}`}
          key={`${block.role}-${block.label ?? "block"}-${index}`}
        >
          <div className="block-meta">
            <span>{block.label ?? roleLabel(block.role)}</span>
          </div>
          {block.text ? (
            <div className="block-text" lang={block.language}>
              <ReactMarkdown>{block.text}</ReactMarkdown>
            </div>
          ) : null}
          {block.runs ? <InlineRuns runs={block.runs} language={block.language} /> : null}
          {block.media ? <MediaStrip media={block.media} /> : null}
        </section>
      ))}
    </div>
  );
}

function MediaStrip({ media, roles }: { media: MediaRef[]; roles?: Role[] }) {
  const filtered = roles ? media.filter((item) => roles.includes(item.role ?? "support")) : media;

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="media-strip">
      {filtered.map((item) => {
        const src = encodeAssetPath(item.src);

        if (item.kind === "audio") {
          return (
            <button
              className="audio-button"
              key={item.src}
              type="button"
              onClick={() => void new Audio(src).play()}
            >
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

function cardWindow(count: number, active: number) {
  if (count <= 12) {
    return Array.from({ length: count }, (_, index) => index);
  }

  const indexes = new Set([0, count - 1]);
  const windowStart = Math.max(1, Math.min(active - 2, count - 6));
  const windowEnd = Math.min(count - 2, Math.max(active + 2, 5));

  for (let index = windowStart; index <= windowEnd; index += 1) {
    indexes.add(index);
  }

  return [...indexes].sort((left, right) => left - right);
}

function CardNavigator({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  const visibleIndexes = cardWindow(count, active);

  return (
    <div className="card-navigator" aria-label="Card picker">
      <input
        aria-label="Jump to card"
        className="card-range"
        max={count}
        min={1}
        type="range"
        value={active + 1}
        onChange={(event) => onSelect(Number(event.currentTarget.value) - 1)}
      />

      <div className="card-window">
        {visibleIndexes.map((index, itemIndex) => {
          const previous = visibleIndexes[itemIndex - 1];
          const hasGap = previous !== undefined && index - previous > 1;

          return (
            <div className="card-window-item" key={index}>
              {hasGap ? <span className="card-gap">...</span> : null}
              <button
                aria-label={`Go to card ${index + 1}`}
                aria-current={index === active ? "step" : undefined}
                className={index === active ? "active" : ""}
                type="button"
                onClick={() => onSelect(index)}
              >
                {index + 1}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function App() {
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    loadDeck()
      .then(setDeck)
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : String(caught)),
      );
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
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
        return;

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
          <p>Reading the Kaishi Open Deck YAML files.</p>
        </section>
      </main>
    );
  }

  const media = note.media ?? [];
  const mainAnswer = answerBlocks.find((block) => block.role === "main");
  const noteCode = note.id.match(/^kaishi-\d+/)?.[0] ?? note.id;

  return (
    <main className="app-shell">
      <aside className="deck-panel">
        <div>
          <p className="deck-kicker">Open Deck preview</p>
          <h1>{deck.manifest.title}</h1>
          <p>{deck.manifest.description}</p>
        </div>

        <div className="deck-stats" aria-label="Deck status">
          <span>{index + 1}</span>
          <span>/</span>
          <span>{deck.notes.length}</span>
        </div>

        <CardNavigator count={deck.notes.length} active={index} onSelect={selectCard} />
      </aside>

      <section className="review-surface" aria-live="polite">
        <header className="review-header">
          <div>
            <p>
              Card {index + 1} of {deck.notes.length}
            </p>
            <h2>{noteCode}</h2>
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
                    {mainAnswer.text ? <ReactMarkdown>{mainAnswer.text}</ReactMarkdown> : null}
                    {mainAnswer.runs ? (
                      <InlineRuns runs={mainAnswer.runs} language={mainAnswer.language} />
                    ) : null}
                    {mainAnswer.media ? <MediaStrip media={mainAnswer.media} /> : null}
                  </div>
                ) : null}
                <BlockList
                  blocks={answerBlocks.filter((block) => block !== mainAnswer)}
                  side="answer"
                />
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
          <button className="nav-button" type="button" onClick={() => move(1)}>
            Next
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </footer>
      </section>
    </main>
  );
}
