import "./index.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  BarChart3,
  RefreshCw,
  Settings,
  MoreHorizontal,
  BookOpen,
  RotateCcw,
  Play,
  ArrowLeft,
  Volume2,
  Star,
  Upload,
  FileArchive,
  Trash2,
  X,
  ChevronDown,
  TrendingUp,
  Clock,
  Zap,
  Globe,
  HardDrive,
  Palette,
  Keyboard,
  ToggleLeft,
  ToggleRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────── */

type View =
  | "dashboard"
  | "study"
  | "add"
  | "browse"
  | "stats"
  | "sync"
  | "settings";

interface Deck {
  id: string;
  name: string;
  path: string;
  due: number;
  learning: number;
  newCards: number;
  total: number;
  studiedToday: number;
  retention: number;
  lastStudied: string;
  color: string;
}

interface StudySession {
  deckId: string;
  deckName: string;
  cardFront: string;
  cardBack: string;
  cardId: number;
  totalCards: number;
  position: number;
}

interface MockCard {
  id: number;
  deckId: string;
  front: string;
  back: string;
  tags: string[];
  due: string;
  interval: string;
  ease: number;
}

/* ────────────────────────────────────────────────────────────────
   Demo Data
   ──────────────────────────────────────────────────────────────── */

const DECKS: Deck[] = [
  {
    id: "1",
    name: "Japanese Core",
    path: "Languages / Kaishi 1.5k",
    due: 64,
    learning: 8,
    newCards: 12,
    total: 1523,
    studiedToday: 34,
    retention: 94,
    lastStudied: "2m ago",
    color: "#e11d48",
  },
  {
    id: "2",
    name: "Medicine",
    path: "School / Pathoma + Sketchy",
    due: 47,
    learning: 11,
    newCards: 0,
    total: 4200,
    studiedToday: 89,
    retention: 91,
    lastStudied: "1h ago",
    color: "#059669",
  },
  {
    id: "3",
    name: "Art History",
    path: "Great Works of Art",
    due: 39,
    learning: 5,
    newCards: 6,
    total: 890,
    studiedToday: 12,
    retention: 88,
    lastStudied: "3h ago",
    color: "#d97706",
  },
  {
    id: "4",
    name: "HSK 3000 Characters",
    path: "Chinese / Writing",
    due: 88,
    learning: 16,
    newCards: 18,
    total: 3000,
    studiedToday: 56,
    retention: 87,
    lastStudied: "5h ago",
    color: "#7c3aed",
  },
  {
    id: "5",
    name: "LeetCode Patterns",
    path: "Programming / Algorithms",
    due: 23,
    learning: 3,
    newCards: 4,
    total: 150,
    studiedToday: 8,
    retention: 96,
    lastStudied: "1d ago",
    color: "#0891b2",
  },
];

const STUDY_MOCK: StudySession = {
  deckId: "1",
  deckName: "Japanese Core",
  cardFront: "静か",
  cardBack: "Quiet, peaceful\n\n<em>shizuka</em>",
  cardId: 1,
  totalCards: 10,
  position: 1,
};

const MOCK_CARDS = [
  { front: "静か", back: "Quiet, peaceful\n\n<em>shizuka</em>" },
  { front: "美しい", back: "Beautiful, lovely\n\n<em>utsukushii</em>" },
  { front: "大きい", back: "Big, large\n\n<em>ookii</em>" },
  { front: "小さい", back: "Small, little\n\n<em>chiisai</em>" },
  { front: "楽しい", back: "Fun, enjoyable\n\n<em>tanoshii</em>" },
  { front: "難しい", back: "Difficult, hard\n\n<em>muzukashii</em>" },
  { front: "簡単", back: "Easy, simple\n\n<em>kantan</em>" },
  { front: "速い", back: "Fast, quick\n\n<em>hayai</em>" },
  { front: "遅い", back: "Slow, late\n\n<em>osoi</em>" },
  { front: "高い", back: "High, tall, expensive\n\n<em>takai</em>" },
];

const BROWSE_CARDS: MockCard[] = [
  {
    id: 1,
    deckId: "1",
    front: "静か",
    back: "Quiet, peaceful",
    tags: ["adjective", "common"],
    due: "2d",
    interval: "4d",
    ease: 250,
  },
  {
    id: 2,
    deckId: "1",
    front: "美しい",
    back: "Beautiful, lovely",
    tags: ["adjective"],
    due: "1d",
    interval: "3d",
    ease: 230,
  },
  {
    id: 3,
    deckId: "1",
    front: "大きい",
    back: "Big, large",
    tags: ["adjective", "common", "size"],
    due: "4h",
    interval: "1d",
    ease: 210,
  },
  {
    id: 4,
    deckId: "1",
    front: "小さい",
    back: "Small, little",
    tags: ["adjective", "common", "size"],
    due: "1h",
    interval: "2d",
    ease: 240,
  },
  {
    id: 5,
    deckId: "2",
    front: "What is the mechanism of action of penicillin?",
    back: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), preventing cross-linking of peptidoglycan.",
    tags: ["antibiotics", "microbiology"],
    due: "3d",
    interval: "7d",
    ease: 265,
  },
  {
    id: 6,
    deckId: "2",
    front: "Describe the histology of celiac disease.",
    back: "Villous atrophy, crypt hyperplasia, and increased intraepithelial lymphocytes in the small intestine.",
    tags: ["pathology", "gi"],
    due: "5d",
    interval: "14d",
    ease: 280,
  },
  {
    id: 7,
    deckId: "3",
    front: "The Starry Night",
    back: "Vincent van Gogh, 1889. Post-Impressionist oil on canvas. Depicts the view from his asylum room at Saint-Rémy-de-Provence.",
    tags: ["painting", "post-impressionism"],
    due: "1d",
    interval: "5d",
    ease: 250,
  },
  {
    id: 8,
    deckId: "3",
    front: "The Birth of Venus",
    back: "Sandro Botticelli, c. 1485. Tempera on canvas. Depicts the goddess Venus arriving at the shore after her birth.",
    tags: ["painting", "renaissance"],
    due: "6h",
    interval: "3d",
    ease: 235,
  },
  {
    id: 9,
    deckId: "4",
    front: "好",
    back: "hǎo — good, fine, nice",
    tags: ["hsk1", "character"],
    due: "2h",
    interval: "1d",
    ease: 220,
  },
  {
    id: 10,
    deckId: "4",
    front: "爱",
    back: "ài — love, affection",
    tags: ["hsk1", "character"],
    due: "1d",
    interval: "3d",
    ease: 245,
  },
  {
    id: 11,
    deckId: "5",
    front: "Two Sum",
    back: "Use a hash map to store complement values. Time: O(n), Space: O(n).",
    tags: ["array", "hash-map", "easy"],
    due: "7d",
    interval: "21d",
    ease: 290,
  },
  {
    id: 12,
    deckId: "5",
    front: "Merge Intervals",
    back: "Sort by start time, then merge overlapping intervals. Time: O(n log n), Space: O(n).",
    tags: ["array", "sorting", "medium"],
    due: "4d",
    interval: "12d",
    ease: 275,
  },
];

/* ────────────────────────────────────────────────────────────────
   Main App
   ──────────────────────────────────────────────────────────────── */

type ThemeMode = "light" | "dark" | "system";

function getStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem("manki-theme");
    if (stored === "light" || stored === "dark" || stored === "system")
      return stored;
  } catch { /* ignore */ }
  return "system";
}

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function App() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("dashboard");
  const [studyDeck, setStudyDeck] = useState<Deck | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isDark = theme === "dark" || (theme === "system" && prefersDark());
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("manki-theme", theme);
    } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const filteredDecks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DECKS;
    return DECKS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.path.toLowerCase().includes(q),
    );
  }, [query]);

  const totals = useMemo(() => {
    return DECKS.reduce(
      (acc, d) => {
        acc.due += d.due;
        acc.learning += d.learning;
        acc.new += d.newCards;
        acc.studied += d.studiedToday;
        return acc;
      },
      { due: 0, learning: 0, new: 0, studied: 0 },
    );
  }, []);

  const startStudy = useCallback((deck: Deck) => {
    setStudyDeck(deck);
    setView("study");
  }, []);

  const exitStudy = useCallback(() => {
    setView("dashboard");
    setStudyDeck(null);
  }, []);

  const navigate = useCallback((v: View) => {
    setView(v);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (view === "study") {
        if (e.key === "Escape") {
          e.preventDefault();
          exitStudy();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (e.key === "/" && document.activeElement === document.body) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, exitStudy]);

  if (view === "study" && studyDeck) {
    return (
      <StudyView deck={studyDeck} session={STUDY_MOCK} onExit={exitStudy} />
    );
  }

  if (view === "add") {
    return <AddView onBack={() => navigate("dashboard")} />;
  }

  if (view === "browse") {
    return <BrowseView onBack={() => navigate("dashboard")} />;
  }

  if (view === "stats") {
    return <StatsView onBack={() => navigate("dashboard")} />;
  }

  if (view === "sync") {
    return <SyncView onBack={() => navigate("dashboard")} />;
  }

  if (view === "settings") {
    return (
      <SettingsView
        onBack={() => navigate("dashboard")}
        theme={theme}
        onThemeChange={setTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <header className="mb-8 flex h-8 items-center justify-between">
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              icon={<Plus className="h-4 w-4" />}
              label="Add"
              onClick={() => navigate("add")}
            />
            <ToolbarButton
              icon={<BookOpen className="h-4 w-4" />}
              label="Browse"
              onClick={() => navigate("browse")}
            />
            <ToolbarButton
              icon={<BarChart3 className="h-4 w-4" />}
              label="Stats"
              onClick={() => navigate("stats")}
            />
            <ToolbarButton
              icon={<RefreshCw className="h-4 w-4" />}
              label="Sync"
              onClick={() => navigate("sync")}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* macOS-style search field */}
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-56 rounded-full border border-transparent bg-muted/80 py-2 pl-9 pr-14 text-[0.8rem] text-foreground outline-none ring-primary/20 transition-all placeholder:text-muted-foreground/50 focus:bg-background focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] focus:ring-1 focus:ring-primary/30 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-background/80 px-1.5 py-0 text-[0.6rem] font-medium text-muted-foreground/60">
                ⌘K
              </kbd>
            </div>

            <ToolbarButton
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              onClick={() => navigate("settings")}
            />
          </div>
        </header>

        {/* Mobile Search */}
        <div className="relative mb-6 sm:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full rounded-full border border-transparent bg-muted/80 py-2 pl-9 pr-4 text-sm outline-none ring-primary/20 transition-all placeholder:text-muted-foreground/50 focus:bg-background focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] focus:ring-1 focus:ring-primary/30 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
          />
        </div>

        {/* Decks */}
        <section>
          <div className="flex flex-col">
            {filteredDecks.map((deck, i) => (
              <DeckItem
                key={deck.id}
                deck={deck}
                onStudy={() => startStudy(deck)}
                last={i === filteredDecks.length - 1}
              />
            ))}
            {filteredDecks.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Search className="mx-auto mb-2 h-5 w-5 opacity-40" />
                <p>No decks match &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        </section>

        {/* Stats + Activity */}
        <section className="mt-10">
          <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Today
          </h2>
          <div className="flex flex-col px-1">
            <div className="flex items-baseline gap-1 py-2">
              <span className="text-2xl font-semibold tabular-nums leading-none">
                {totals.studied}
              </span>
              <span className="text-sm text-muted-foreground/60">
                / {totals.due + totals.learning + totals.new}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
              <span className="text-red-600 dark:text-red-400">{totals.due} due</span>
              <span className="text-amber-600 dark:text-amber-400">{totals.learning} learning</span>
              <span className="text-blue-600 dark:text-blue-400">{totals.new} new</span>
              <span className="ml-auto">12 days · 91% retention</span>
            </div>
            <div className="mt-3 flex h-6 items-end gap-[3px]">
              {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-[1px] transition-all duration-500",
                    i === 5 ? "bg-amber-500/50" : "bg-muted-foreground/10",
                  )}
                  style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

/* ────────────────────────────────────────────────────────────────
   Shared Components
   ──────────────────────────────────────────────────────────────── */

function ScreenHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <header className="mb-8 flex h-8 items-center gap-3">
      <button
        onClick={onBack}
        className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
        title="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <h1 className="font-serif text-xl font-medium leading-none tracking-tight">{title}</h1>
    </header>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
      title={label}
    >
      {icon}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────
   Dashboard Sub-components
   ──────────────────────────────────────────────────────────────── */

function DeckItem({
  deck,
  onStudy,
  last,
}: {
  deck: Deck;
  onStudy: () => void;
  last: boolean;
}) {
  return (
    <div className={cn(
      "group flex items-center gap-4 px-3 py-2.5",
      !last && "border-b border-border/30",
    )}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm">{deck.name}</h3>
          <span className="shrink-0 text-[0.65rem] text-muted-foreground/50">
            {deck.lastStudied}
          </span>
        </div>
        <p className="truncate text-[0.7rem] text-muted-foreground/60">
          {deck.path}
        </p>
      </div>

      {/* Inline stats */}
      <div className="hidden items-center gap-2 text-sm tabular-nums sm:flex">
        <span className="text-red-600 dark:text-red-400">{deck.due}</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-amber-600 dark:text-amber-400">{deck.learning}</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-blue-600 dark:text-blue-400">{deck.newCards}</span>
      </div>

      <button
        onClick={onStudy}
        className="inline-flex h-7 items-center gap-1.5 rounded border border-border/50 bg-background px-3 text-sm font-medium text-foreground shadow-[0_0.5px_0_0_rgba(0,0,0,0.04)] transition-colors active:bg-muted active:scale-[0.98] dark:shadow-[0_0.5px_0_0_rgba(255,255,255,0.04)]"
      >
        <Play className="h-4 w-4" />
        Study
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Add View
   ──────────────────────────────────────────────────────────────── */

function AddView({ onBack }: { onBack: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [recentImports, setRecentImports] = useState([
    { name: "Core 2000.apkg", size: "12.4 MB", date: "2 days ago" },
    { name: "Genki I+II.apkg", size: "8.1 MB", date: "1 week ago" },
  ]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      // In a real app, we'd read the file here
    },
    [],
  );

  const removeImport = useCallback((name: string) => {
    setRecentImports((prev) => prev.filter((i) => i.name !== name));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <ScreenHeader title="Add" onBack={onBack} />

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded border-2 border-dashed p-10 text-center transition-all",
            isDragging
              ? "border-primary/40 bg-primary/[0.02]"
              : "border-border/50",
          )}
        >
          <Upload className="mb-2 h-5 w-5 text-muted-foreground/40" />
          <p className="text-sm">Drag & drop an .apkg file</p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            or{" "}
            <button className="text-primary/80 underline underline-offset-2 transition-colors hover:text-primary">
              browse
            </button>{" "}
            to import
          </p>
        </div>

        {/* Recent Imports */}
        {recentImports.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Imports
            </h2>
            <div className="flex flex-col">
              {recentImports.map((item, i) => (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center gap-3 px-1 py-2.5 transition-colors hover:bg-muted/30",
                    i !== recentImports.length - 1 && "border-b border-border/40",
                  )}
                >
                  <FileArchive className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground/70">
                      {item.size} · {item.date}
                    </p>
                  </div>
                  <button
                    onClick={() => removeImport(item.name)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-muted hover:text-destructive"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Browse View
   ──────────────────────────────────────────────────────────────── */

function BrowseView({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<string | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredCards = useMemo(() => {
    let cards = BROWSE_CARDS;
    if (selectedDeck !== "all") {
      cards = cards.filter((c) => c.deckId === selectedDeck);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      cards = cards.filter(
        (c) =>
          c.front.toLowerCase().includes(q) ||
          c.back.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return cards;
  }, [query, selectedDeck]);

  const deckStats = useMemo(() => {
    const stats = new Map<string, number>();
    BROWSE_CARDS.forEach((c) => {
      stats.set(c.deckId, (stats.get(c.deckId) || 0) + 1);
    });
    return stats;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <ScreenHeader title="Browse" onBack={onBack} />

        {/* Search + Filter */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search cards..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-full rounded border border-border/60 bg-transparent py-2 pl-9 pr-4 text-sm outline-none ring-primary/20 transition-all placeholder:text-muted-foreground/40 focus:border-border focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <select
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value)}
            className="h-8 rounded border border-border/60 bg-transparent px-3 text-sm outline-none ring-primary/20 transition-all focus:border-border focus:ring-1 focus:ring-primary/20"
          >
            <option value="all">All Decks ({BROWSE_CARDS.length})</option>
            {DECKS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({deckStats.get(d.id) || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mb-1 px-1 text-xs tabular-nums text-muted-foreground/60">
          {filteredCards.length} card
          {filteredCards.length !== 1 ? "s" : ""}
        </div>

        {/* Table */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center border-b border-border px-1 pb-1.5 pt-2 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground/50">
            <span className="w-[35%]">Front</span>
            <span className="w-[35%]">Back</span>
            <span className="w-[18%]">Deck</span>
            <span className="w-[7%] text-right">Due</span>
            <span className="w-[5%]"></span>
          </div>

          {/* Rows */}
          {filteredCards.map((card, i) => (
            <BrowseTableRow
              key={card.id}
              card={card}
              expanded={expandedId === card.id}
              onToggle={() =>
                setExpandedId((id) => (id === card.id ? null : card.id))
              }
              last={i === filteredCards.length - 1}
            />
          ))}
          {filteredCards.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <Search className="mx-auto mb-2 h-5 w-5 opacity-40" />
              <p>No cards match &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BrowseTableRow({
  card,
  expanded,
  onToggle,
  last,
}: {
  card: MockCard;
  expanded: boolean;
  onToggle: () => void;
  last: boolean;
}) {
  const deck = DECKS.find((d) => d.id === card.deckId);

  return (
    <div className={cn("group", expanded && "bg-muted/20", !last && "border-b border-border/30")}>
      <button
        onClick={onToggle}
        className="flex w-full items-start px-1 py-2.5 text-left transition-colors hover:bg-muted/20"
      >
        <span className="w-[35%] pr-3 text-sm font-medium leading-snug">
          {card.front}
        </span>
        <span className="w-[35%] pr-3 text-sm text-muted-foreground leading-snug">
          {card.back}
        </span>
        <span className="w-[18%] pr-3 text-xs text-muted-foreground/70 leading-snug">
          {deck?.name ?? "—"}
        </span>
        <span className="w-[7%] text-right text-xs tabular-nums text-muted-foreground/70 leading-snug">
          {card.due}
        </span>
        <span className="flex w-[5%] justify-end pt-0.5">
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/30 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </span>
      </button>

      {expanded && (
        <div className="px-1 pb-3 pt-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
            {card.tags.length > 0 && (
              <span>{card.tags.join(", ")}</span>
            )}
            <span>Interval {card.interval}</span>
            <span>Ease {card.ease}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Stats View
   ──────────────────────────────────────────────────────────────── */

function StatsView({ onBack }: { onBack: () => void }) {
  const dailyReviews = [45, 72, 38, 91, 56, 120, 89, 67, 95, 43, 78, 62, 55, 88, 34, 71, 99, 48, 82, 60, 77, 52, 85, 41, 69, 93, 58, 76, 44, 81];
  const maxDaily = Math.max(...dailyReviews);
  const totalStudied = dailyReviews.reduce((a, b) => a + b, 0);
  const avgDaily = Math.round(totalStudied / dailyReviews.length);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <ScreenHeader title="Statistics" onBack={onBack} />

        {/* Summary */}
        <div className="mb-10 flex items-baseline gap-8">
          <div>
            <p className="text-2xl font-semibold tabular-nums leading-none">{totalStudied.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground/60">cards studied</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums leading-none">{avgDaily}</p>
            <p className="mt-1 text-xs text-muted-foreground/60">avg / day</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums leading-none">91%</p>
            <p className="mt-1 text-xs text-muted-foreground/60">retention</p>
          </div>
        </div>

        {/* Activity Chart */}
        <section className="mb-10">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Activity (30 Days)
          </h2>
          <div className="flex h-28 items-end gap-[3px]">
            {dailyReviews.map((count, i) => {
              const h = (count / maxDaily) * 100;
              const isToday = i === dailyReviews.length - 1;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-[1px] transition-all",
                    isToday
                      ? "bg-primary/60"
                      : "bg-muted-foreground/10 hover:bg-muted-foreground/20",
                  )}
                  style={{ height: `${h}%` }}
                  title={`${count} reviews`}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[0.6rem] text-muted-foreground/40">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </section>

        {/* Deck Breakdown */}
        <section>
          <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Deck Breakdown
          </h2>
          <div className="flex flex-col">
            {DECKS.map((deck, i) => {
              const totalQueue = deck.due + deck.learning + deck.newCards;
              const studiedPct =
                totalQueue > 0
                  ? Math.round((deck.studiedToday / totalQueue) * 100)
                  : 0;
              return (
                <div
                  key={deck.id}
                  className={cn(
                    "px-1 py-2.5",
                    i !== DECKS.length - 1 && "border-b border-border/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: deck.color }}
                      />
                      <span className="text-sm">{deck.name}</span>
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground/60">
                      {deck.studiedToday} / {totalQueue}
                    </span>
                  </div>
                  <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${studiedPct}%`,
                        backgroundColor: deck.color,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[0.65rem] text-muted-foreground/50">
                    <span className="text-red-600 dark:text-red-400">{deck.due} due</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {deck.learning} learning
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">{deck.newCards} new</span>
                    <span className="ml-auto">
                      {deck.retention}% retention
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Sync View
   ──────────────────────────────────────────────────────────────── */

function SyncView({ onBack }: { onBack: () => void }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("2 minutes ago");
  const [status, setStatus] = useState<"idle" | "syncing" | "error">("idle");

  const handleSync = useCallback(() => {
    if (syncing) return;
    setSyncing(true);
    setStatus("syncing");
    setTimeout(() => {
      setSyncing(false);
      setStatus("idle");
      setLastSync("Just now");
    }, 2500);
  }, [syncing]);

  const collectionInfo = {
    decks: DECKS.length,
    cards: DECKS.reduce((acc, d) => acc + d.total, 0),
    media: 342,
    size: "48.2 MB",
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <ScreenHeader title="Sync" onBack={onBack} />

        {/* Status */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-2 w-2 rounded-full",
                status === "idle" && "bg-emerald-500",
                status === "syncing" && "bg-blue-500",
                status === "error" && "bg-red-500",
              )}
            />
            <div>
              <p className="text-sm">
                {status === "idle" && "Up to date"}
                {status === "syncing" && "Syncing..."}
                {status === "error" && "Sync failed"}
              </p>
              <p className="text-xs text-muted-foreground/60">
                Last synced {lastSync}
              </p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex h-7 items-center gap-1.5 rounded border border-border/60 px-3 text-xs font-medium transition-all hover:bg-muted active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", syncing && "animate-spin")}
            />
            Sync Now
          </button>
        </div>

        {/* Collection Info */}
        <section>
          <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Collection
          </h2>
          <div className="flex flex-col">
            {[
              { label: "Decks", value: `${collectionInfo.decks}` },
              { label: "Cards", value: collectionInfo.cards.toLocaleString() },
              { label: "Media Files", value: `${collectionInfo.media}` },
              { label: "Size", value: collectionInfo.size },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={cn(
                  "flex items-center justify-between px-1 py-2",
                  i !== arr.length - 1 && "border-b border-border/30",
                )}
              >
                <span className="text-sm text-muted-foreground/70">{row.label}</span>
                <span className="text-sm tabular-nums">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Settings View
   ──────────────────────────────────────────────────────────────── */

function SettingsView({
  onBack,
  theme,
  onThemeChange,
}: {
  onBack: () => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
}) {
  const [newCardsPerDay, setNewCardsPerDay] = useState(20);
  const [reviewsPerDay, setReviewsPerDay] = useState(200);
  const [showTimer, setShowTimer] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <ScreenHeader title="Settings" onBack={onBack} />

        {/* Study Preferences */}
        <section className="mb-10">
          <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Study
          </h2>
          <div className="flex flex-col">
            <SettingNumberRow
              label="New cards/day"
              value={newCardsPerDay}
              onChange={setNewCardsPerDay}
              min={0}
              max={999}
            />
            <SettingNumberRow
              label="Review limit"
              value={reviewsPerDay}
              onChange={setReviewsPerDay}
              min={10}
              max={9999}
            />
            <SettingToggleRow
              label="Show study timer"
              description="Display elapsed time during reviews"
              enabled={showTimer}
              onChange={setShowTimer}
            />
            <SettingToggleRow
              label="Auto-advance"
              description="Automatically show answer after 3 seconds"
              enabled={autoAdvance}
              onChange={setAutoAdvance}
            />
          </div>
        </section>

        {/* Appearance */}
        <section className="mb-10">
          <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Appearance
          </h2>
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-1 py-2.5">
              <div>
                <p className="text-sm">Theme</p>
                <p className="text-xs text-muted-foreground/60">Color scheme</p>
              </div>
              <div className="flex items-center rounded border border-border/60 bg-muted p-0.5">
                {(["light", "system", "dark"] as ThemeMode[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => onThemeChange(t)}
                    className={cn(
                      "rounded-sm px-2.5 py-1 text-xs font-medium transition-all",
                      theme === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground/60 hover:text-foreground",
                    )}
                  >
                    {t[0]!.toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section>
          <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Keyboard Shortcuts
          </h2>
          <div className="flex flex-col">
            <ShortcutRow action="Flip card / Show answer" keys={["Space"]} />
            <ShortcutRow action="Rate Again" keys={["1"]} />
            <ShortcutRow action="Rate Hard" keys={["2"]} />
            <ShortcutRow action="Rate Good" keys={["3"]} />
            <ShortcutRow action="Rate Easy" keys={["4"]} />
            <ShortcutRow action="Search decks" keys={["⌘", "K"]} />
            <ShortcutRow action="Exit study" keys={["Esc"]} last />
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingNumberRow({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between px-1 py-2.5">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground/60 transition-colors hover:bg-muted"
        >
          <span className="text-base leading-none">−</span>
        </button>
        <span className="w-8 text-center text-sm tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground/60 transition-colors hover:bg-muted"
        >
          <span className="text-base leading-none">+</span>
        </button>
      </div>
    </div>
  );
}

function SettingToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-1 py-2.5">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-muted-foreground/60">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "inline-flex h-5 w-9 items-center rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-muted-foreground/20",
        )}
      >
        <span
          className={cn(
            "mx-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
            enabled && "translate-x-4",
          )}
        />
      </button>
    </div>
  );
}

function ShortcutRow({
  action,
  keys,
  last,
}: {
  action: string;
  keys: string[];
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 py-2",
        !last && "border-b border-border/30",
      )}
    >
      <span className="text-sm text-muted-foreground/80">{action}</span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="rounded border border-border/50 bg-muted/60 px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground/70"
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Study View
   ──────────────────────────────────────────────────────────────── */

function StudyView({
  deck,
  session,
  onExit,
}: {
  deck: Deck;
  session: StudySession;
  onExit: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [rating, setRating] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  const currentCard = MOCK_CARDS[cardIndex % MOCK_CARDS.length]!;
  const isComplete = cardIndex >= session.totalCards;

  const rateCard = useCallback(
    (value: string) => {
      if (exiting || isComplete) return;
      setRating(value);
      setExiting(true);
      setTimeout(() => {
        setCardIndex((p) => p + 1);
        setFlipped(false);
        setRating(null);
        setExiting(false);
      }, 200);
    },
    [exiting, isComplete],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        if (!flipped && !exiting && !isComplete) setFlipped(true);
      }
      if (e.key === "1" && flipped && !exiting && !isComplete)
        rateCard("again");
      if (e.key === "2" && flipped && !exiting && !isComplete)
        rateCard("hard");
      if (e.key === "3" && flipped && !exiting && !isComplete)
        rateCard("good");
      if (e.key === "4" && flipped && !exiting && !isComplete)
        rateCard("easy");
      if (e.key === "Escape") onExit();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, exiting, isComplete, rateCard, onExit]);

  const pct = Math.round((cardIndex / session.totalCards) * 100);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-background text-foreground antialiased">
      {/* Study Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-medium">{deck.name}</span>
          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: deck.color }}
            />
          </div>
          <span className="mt-0.5 text-[0.6rem] tabular-nums text-muted-foreground">
            {Math.min(cardIndex + 1, session.totalCards)} / {session.totalCards}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
            <Volume2 className="h-4 w-4" />
          </button>
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
            <Star className="h-4 w-4" />
          </button>
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Card or Completion */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        {isComplete ? (
          <div className="animate-fade-in-up text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              All caught up
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {deck.name} · {session.totalCards} cards reviewed
            </p>
            <button
              onClick={onExit}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <p className="mt-3 text-xs text-muted-foreground/60">
              Press{" "}
              <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">
                Esc
              </kbd>
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "w-full max-w-2xl transition-[transform,opacity]",
              exiting && "-translate-y-5 opacity-0 scale-[0.97]",
            )}
            style={{
              transitionDuration: "200ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div key={cardIndex} className="animate-card-enter">
              <div
                className="relative cursor-pointer select-none perspective-1000"
                onClick={() =>
                  !exiting && !isComplete && setFlipped((p) => !p)
                }
              >
                <div
                  className={cn(
                    "relative min-h-[20rem] rounded-2xl border border-border bg-card p-8 sm:p-12",
                    flipped && "rotate-y-180",
                  )}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                    transition:
                      "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* Front */}
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center text-center",
                      flipped && "invisible",
                    )}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                      {currentCard.front}
                    </h2>
                    <p className="mt-8 text-sm text-muted-foreground">
                      Press{" "}
                      <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">
                        Space
                      </kbd>{" "}
                      to flip
                    </p>
                  </div>

                  {/* Back */}
                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center sm:p-12",
                      !flipped && "invisible",
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div
                      className="text-lg leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: currentCard.back.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rating Bar */}
      <footer className="border-t border-border px-4 py-4 sm:px-6">
        {isComplete ? (
          <div className="flex justify-center">
            <button
              onClick={onExit}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        ) : !flipped ? (
          <div className="flex justify-center">
            <button
              onClick={() => !exiting && setFlipped(true)}
              disabled={exiting}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Show Answer
              <kbd className="ml-1 rounded border border-primary-foreground/30 px-1.5 py-0.5 text-xs">
                Space
              </kbd>
            </button>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl gap-2">
            <RatingButton
              label="Again"
              time="< 1m"
              shortcut="1"
              tone="destructive"
              disabled={exiting}
              onClick={() => rateCard("again")}
            />
            <RatingButton
              label="Hard"
              time="2d"
              shortcut="2"
              tone="warn"
              disabled={exiting}
              onClick={() => rateCard("hard")}
            />
            <RatingButton
              label="Good"
              time="4d"
              shortcut="3"
              tone="primary"
              disabled={exiting}
              onClick={() => rateCard("good")}
            />
            <RatingButton
              label="Easy"
              time="7d"
              shortcut="4"
              tone="success"
              disabled={exiting}
              onClick={() => rateCard("easy")}
            />
          </div>
        )}
      </footer>
    </div>
  );
}

function RatingButton({
  label,
  time,
  shortcut,
  tone,
  onClick,
  disabled,
}: {
  label: string;
  time: string;
  shortcut: string;
  tone: "destructive" | "warn" | "primary" | "success";
  onClick: () => void;
  disabled?: boolean;
}) {
  const toneStyles = {
    destructive:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",
    warn: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
    primary:
      "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 dark:bg-primary/10",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-3 transition-all active:scale-[0.98] disabled:opacity-50",
        toneStyles[tone],
      )}
    >
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-[0.65rem] opacity-70">{time}</span>
      <kbd className="mt-0.5 rounded border border-current/20 px-1 py-0 text-[0.6rem]">
        {shortcut}
      </kbd>
    </button>
  );
}
