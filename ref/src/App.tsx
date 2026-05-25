import "./index.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function App() {
  const [query, setQuery] = useState("");
  const [selectedDeckName, setSelectedDeckName] = useState(
    () => decks.find((deck) => deck.active)?.name ?? decks[0]?.name ?? "",
  );
  const [feedback, setFeedback] = useState("Ready");
  const searchRef = useRef<HTMLInputElement>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((message: string) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setFeedback(message);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback("Ready"), 1400);
  }, []);

  const visibleDecks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return decks;
    }

    return decks.filter((deck) => `${deck.name} ${deck.path}`.toLowerCase().includes(normalizedQuery));
  }, [query]);

  const totals = decks.reduce(
    (queue, deck) => ({
      due: queue.due + deck.due,
      learning: queue.learning + deck.learning,
      newCards: queue.newCards + deck.newCards,
    }),
    { due: 0, learning: 0, newCards: 0 },
  );
  const activeDeck = visibleDecks.find((deck) => deck.name === selectedDeckName) ?? visibleDecks[0];

  const selectDeck = useCallback((deckName: string) => {
    setSelectedDeckName(deckName);
    announce(`Selected ${deckName}`);
  }, [announce]);

  const studyDeck = useCallback((deck: Deck | undefined) => {
    if (!deck) {
      return;
    }

    setSelectedDeckName(deck.name);
    announce(`Opening review for ${deck.name}`);
  }, [announce]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function moveSelection(direction: -1 | 1) {
      if (!visibleDecks.length) {
        return;
      }

      const selectedIndex = visibleDecks.findIndex((deck) => deck.name === selectedDeckName);
      const nextIndex = selectedIndex === -1
        ? (direction === 1 ? 0 : visibleDecks.length - 1)
        : (selectedIndex + direction + visibleDecks.length) % visibleDecks.length;
      const nextDeck = visibleDecks[nextIndex];

      if (nextDeck) {
        selectDeck(nextDeck.name);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const searchInput = searchRef.current;

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        searchInput?.focus();
        searchInput?.select();
        announce("Search focused");
        return;
      }

      if (isEditableTarget(event.target)) {
        if (event.key === "Escape" && event.target === searchInput) {
          event.preventDefault();

          if (query) {
            setQuery("");
            announce("Search cleared");
          } else {
            searchInput?.blur();
            announce("Search dismissed");
          }
        }

        return;
      }

      if (isControlTarget(event.target)) {
        return;
      }

      if (key === "/") {
        event.preventDefault();
        searchInput?.focus();
        announce("Search focused");
        return;
      }

      if (key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1);
        return;
      }

      if (key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        studyDeck(activeDeck);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDeck, announce, query, selectDeck, selectedDeckName, studyDeck, visibleDecks]);

  return (
    <main className="native-window mx-2 my-3 max-w-[46rem] border border-border bg-background p-3 text-foreground sm:mx-auto sm:my-8 sm:p-4">
      <header className="flex flex-col gap-2 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-auto justify-start rounded-none px-0 py-0 text-left hover:bg-transparent"
        >
          <a href="#decks" aria-label="Manki home">
            <span className="grid size-8 place-items-center border border-border text-sm font-bold text-foreground">間</span>
            <span>
              <strong className="block text-[0.95rem] leading-5 tracking-[-0.03em]">Manki</strong>
              <small className="block text-xs font-normal text-muted-foreground">Default collection</small>
            </span>
          </a>
        </Button>

        <label className="native-search flex h-8 w-full max-w-[19rem] items-center border border-input bg-background sm:w-[19rem]">
          <kbd className="ml-2 border border-border px-1.5 py-0.5 text-[0.68rem] leading-none text-muted-foreground">⌘K</kbd>
          <Input
            ref={searchRef}
            aria-label="Search decks, tags, or cards"
            className="h-7 rounded-none border-0 px-2 text-sm focus-visible:border-transparent focus-visible:ring-0"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search decks, tags, cards…"
            type="search"
            value={query}
          />
          {query ? (
            <Button
              aria-label="Clear search"
              className="mr-1 size-6 rounded-none text-muted-foreground"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
                announce("Search cleared");
              }}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              ×
            </Button>
          ) : null}
        </label>
      </header>

      <nav className="mt-3 flex flex-wrap gap-1" aria-label="Main actions">
        {actions.map((action) => (
          <Button
            className="h-7 rounded-none px-2 text-xs font-semibold"
            variant={action.primary ? "default" : "outline"}
            size="sm"
            type="button"
            key={action.label}
            onClick={() => announce(action.feedback)}
          >
            {action.label}
          </Button>
        ))}
      </nav>

      <section className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2 border-y border-border/70 py-3" aria-label="Today queue">
        <QueueSummary eyebrow="Today" label="Due" value={totals.due} />
        <QueueSummary label="Learning" value={totals.learning} />
        <QueueSummary label="New" value={totals.newCards} />
        <Button className="ml-auto h-8 rounded-none px-3 text-sm" onClick={() => studyDeck(activeDeck)} type="button">
          Review now
        </Button>
      </section>

      <section className="mt-4" id="decks" aria-labelledby="decks-heading">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">Decks</p>
            <h1 className="text-lg leading-none font-semibold tracking-[-0.04em]" id="decks-heading">Study queues</h1>
          </div>
          <Button
            className="h-7 rounded-none px-2 text-xs font-semibold"
            onClick={() => announce("New deck sheet ready")}
            variant="outline"
            size="sm"
            type="button"
          >
            Create deck
          </Button>
        </div>

        <Table className="mt-2 min-w-[40rem]">
          <TableHeader>
            <TableRow className="border-border/70 hover:bg-transparent">
              <TableHead className="h-7 px-2 text-[0.68rem] font-bold tracking-[0.1em] text-muted-foreground uppercase">Deck</TableHead>
              <TableHead className="h-7 px-2 text-right text-[0.68rem] font-bold tracking-[0.1em] text-muted-foreground uppercase">Due</TableHead>
              <TableHead className="h-7 px-2 text-right text-[0.68rem] font-bold tracking-[0.1em] text-muted-foreground uppercase">Learn</TableHead>
              <TableHead className="h-7 px-2 text-right text-[0.68rem] font-bold tracking-[0.1em] text-muted-foreground uppercase">New</TableHead>
              <TableHead className="h-7 px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleDecks.length ? visibleDecks.map((deck) => {
              const selected = deck.name === activeDeck?.name;

              return (
                <TableRow
                  aria-selected={selected}
                  className="native-row"
                  key={deck.name}
                  onClick={() => selectDeck(deck.name)}
                  onDoubleClick={() => studyDeck(deck)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      studyDeck(deck);
                    }
                  }}
                  tabIndex={0}
                >
                  <TableCell className="py-2 pr-2 pl-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Button
                        aria-label={`Expand ${deck.name}`}
                        className="size-6 rounded-none text-muted-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          selectDeck(deck.name);
                          announce(`${deck.name} children expanded`);
                        }}
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                      >
                        ⌄
                      </Button>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm leading-5 font-medium tracking-[-0.025em]">{deck.name}</h2>
                        <p className="truncate text-xs text-muted-foreground">{deck.path}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">{deck.due}</TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">{deck.learning}</TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">{deck.newCards}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="h-6 rounded-none px-2 text-xs font-semibold"
                      onClick={(event) => {
                        event.stopPropagation();
                        studyDeck(deck);
                      }}
                      variant={selected ? "default" : "outline"}
                      size="xs"
                      type="button"
                    >
                      Study
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell className="py-6 text-center text-sm text-muted-foreground" colSpan={5}>
                  No decks match “{query}”
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <footer className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="native-feedback mr-1 text-xs text-muted-foreground" aria-live="polite" key={feedback}>
          {feedback}
        </span>
        {statuses.map((status) => (
          <Badge className="rounded-none px-1.5 font-normal text-muted-foreground" variant="ghost" key={status}>
            {status}
          </Badge>
        ))}
        <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">⌘K search · J/K move · Enter review</span>
      </footer>
    </main>
  );
}

type Deck = {
  active?: boolean;
  due: number;
  learning: number;
  name: string;
  newCards: number;
  path: string;
};

type Action = {
  feedback: string;
  label: string;
  primary?: boolean;
};

const actions: Action[] = [
  { label: "Add", feedback: "Add note opened" },
  { label: "Browse", feedback: "Browser opened" },
  { label: "Stats", feedback: "Stats opened" },
  { label: "Sync", feedback: "Sync started" },
  { label: "Study due", feedback: "Opening due queue", primary: true },
];

const decks: Deck[] = [
  {
    name: "Japanese Core",
    path: "Languages::Kaishi 1.5k",
    due: 64,
    learning: 8,
    newCards: 12,
    active: true,
  },
  {
    name: "Medicine",
    path: "School::Pathoma + Sketchy",
    due: 47,
    learning: 11,
    newCards: 0,
  },
  {
    name: "Art History",
    path: "Great Works of Art",
    due: 39,
    learning: 5,
    newCards: 6,
  },
  {
    name: "Characters",
    path: "Chinese::HSK 3000",
    due: 88,
    learning: 16,
    newCards: 18,
  },
];

const statuses = ["AnkiWeb up to date", "FSRS enabled", "Retention 91%"];

function QueueSummary({ eyebrow, label, value }: { eyebrow?: string; label: string; value: number }) {
  return (
    <div className="min-w-14">
      {eyebrow ? <span className="mb-1 block text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">{eyebrow}</span> : null}
      <strong className="block text-2xl leading-none font-semibold tracking-[-0.05em] tabular-nums">{value}</strong>
      <small className="block text-xs text-muted-foreground">{label}</small>
    </div>
  );
}

function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)
  );
}

function isControlTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest("a,button") !== null;
}

export default App;
