import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { cn } from "./utils";

/* ────────────────────────────────
   Constants
   ──────────────────────────────── */
const MIN_WIDTH = 150;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 218;
const STICK_THRESHOLD = 20;

/* ────────────────────────────────
   Sample data
   ──────────────────────────────── */
type Deck = {
  id: string;
  name: string;
  path: string;
  due: number;
  learn: number;
  new: number;
  tint: string;
};

const DECKS: Deck[] = [
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

const STATS = {
  due: 261,
  learning: 43,
  new: 40,
  retention: 92,
  estimate: 38,
  fsrs: 91,
  queued: 124,
};

/* ────────────────────────────────
   Icons
   ──────────────────────────────── */
function IconSun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPlayCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function IconWand({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 13l-2 2 2 2" />
      <path d="M14 13l2 2-2 2" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function IconCloud({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" />
      <path d="M17.5 19H19c2.21 0 4-1.79 4-4 0-2.21-1.79-4-4-4-.65 0-1.26.16-1.8.44" />
      <path d="M6.5 19H5c-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4 .65 0 1.26.16 1.8.44" />
    </svg>
  );
}

function IconGear({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconSparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.5 5.5L5 10l4.5 3.5L8 19l4-3 4 3-1.5-5.5L19 10l-5.5-1.5z" />
    </svg>
  );
}

/* ────────────────────────────────
   Sidebar
   ──────────────────────────────── */
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="px-3 pb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-500">
          {title}
        </span>
      </div>
      <div className="space-y-0.5 px-2">{children}</div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  count,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "text-stone-700 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800/60",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0 opacity-80" />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-auto shrink-0 text-[12px] font-medium tabular-nums",
            active ? "text-white/80" : "text-stone-500 dark:text-stone-500",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SidebarDeckItem({
  deck,
  active = false,
  onClick,
}: {
  deck: Deck;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "text-stone-700 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800/60",
      )}
    >
      <span
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ backgroundColor: deck.tint }}
      />
      <span className="flex-1 truncate">{deck.name}</span>
      <span
        className={cn(
          "ml-auto shrink-0 text-[12px] font-medium tabular-nums",
          active ? "text-white/80" : "text-stone-500 dark:text-stone-500",
        )}
      >
        {deck.due}
      </span>
    </button>
  );
}

function Sidebar() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDraggingRef = useRef(false);
  const isCollapsedRef = useRef(false);
  const dragStartRef = useRef<{ x: number; width: number }>({ x: 0, width: 0 });
  const widthRef = useRef(DEFAULT_WIDTH);
  const stickStateRef = useRef<{ type: "none" } | { type: "stuck"; anchor: number }>({
    type: "none",
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
    dragStartRef.current = { x: e.clientX, width: rect.width };
    isDraggingRef.current = true;
    stickStateRef.current = { type: "none" };
    document.body.style.cursor = "col-resize";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const currentX = e.clientX;
      const delta = currentX - dragStartRef.current.x;
      const newWidth = Math.max(6, Math.min(MAX_WIDTH, dragStartRef.current.width + delta));

      if (isCollapsedRef.current) {
        if (stickStateRef.current.type === "none") {
          stickStateRef.current = { type: "stuck", anchor: currentX };
          return;
        }

        const { anchor } = stickStateRef.current;
        const stickDelta = currentX - anchor;

        if (stickDelta >= STICK_THRESHOLD) {
          widthRef.current = newWidth;
          setWidth(newWidth);
          setIsCollapsed(false);
          isCollapsedRef.current = false;
          stickStateRef.current = { type: "none" };
        } else if (stickDelta <= 0) {
          stickStateRef.current = { type: "none" };
        }
      } else {
        if (newWidth < MIN_WIDTH) {
          if (stickStateRef.current.type === "none") {
            stickStateRef.current = { type: "stuck", anchor: currentX };
            setWidth(MIN_WIDTH);
            return;
          }

          const { anchor } = stickStateRef.current;
          const stickDelta = currentX - anchor;

          if (stickDelta <= -STICK_THRESHOLD) {
            widthRef.current = 6;
            setWidth(6);
            setIsCollapsed(true);
            isCollapsedRef.current = true;
            stickStateRef.current = { type: "none" };
          } else if (stickDelta >= 0) {
            stickStateRef.current = { type: "none" };
            const resumedWidth = Math.max(MIN_WIDTH, newWidth);
            widthRef.current = resumedWidth;
            setWidth(resumedWidth);
            setIsCollapsed(false);
          } else {
            setWidth(MIN_WIDTH);
          }
        } else {
          stickStateRef.current = { type: "none" };
          widthRef.current = newWidth;
          setWidth(newWidth);
          setIsCollapsed(false);
          isCollapsedRef.current = false;
        }
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      stickStateRef.current = { type: "none" };

      const currentWidth = widthRef.current;
      if (currentWidth < MIN_WIDTH) {
        setWidth(6);
        setIsCollapsed(true);
        isCollapsedRef.current = true;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="relative flex" style={{ width }}>
      {!isCollapsed && (
        <aside
          className="flex h-full flex-col overflow-hidden border border-white/75 bg-stone-50 shadow-lg shadow-stone-400/10 dark:border-white/10 dark:bg-[#1e1b18] dark:shadow-stone-950/20"
          data-window-sidebar
        >
          {/* Top spacer for traffic lights */}
          <div className="shrink-0" style={{ height: 44 }} />

          <div className="flex flex-1 flex-col overflow-y-auto px-2 pb-4">
            <SidebarSection title="Review">
              <SidebarItem icon={IconSun} label="Today" count={STATS.due} active />
              <SidebarItem icon={IconPlayCircle} label="Study Queue" count={124} />
              <SidebarItem icon={IconList} label="Browse" />
              <SidebarItem icon={IconWand} label="Create" />
            </SidebarSection>

            <SidebarSection title="Decks">
              {DECKS.map((deck) => (
                <SidebarDeckItem key={deck.id} deck={deck} />
              ))}
            </SidebarSection>

            <SidebarSection title="System">
              <SidebarItem icon={IconChart} label="Stats" />
              <SidebarItem icon={IconCloud} label="Sync" />
              <SidebarItem icon={IconGear} label="Settings" />
            </SidebarSection>
          </div>
        </aside>
      )}
      <div
        className="resize-handle absolute top-0 right-0 bottom-0 z-10"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

/* ────────────────────────────────
   Today View
   ──────────────────────────────── */
function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded-[5px] border border-stone-300 bg-stone-100 px-[6px] py-[2px] text-[11px] font-semibold text-stone-600 dark:border-stone-700 dark:bg-[#2a2724] dark:text-stone-400">
      {children}
    </kbd>
  );
}

function TodayView() {
  return (
    <div className="flex h-full flex-col">
      {/* Top toolbar */}
      <div className="flex shrink-0 items-center gap-2 px-6 pb-3 pt-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200">
          <IconSparkle className="h-[18px] w-[18px]" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200">
          <IconRefresh className="h-[18px] w-[18px]" />
        </button>
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            placeholder="Decks, cards, tags"
            className="h-8 w-full rounded-lg border border-stone-200 bg-stone-100/80 py-1.5 pl-9 pr-3 text-[13px] text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none dark:border-stone-800 dark:bg-[#25221f] dark:text-stone-100 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Today
            </h1>
            <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">
              {STATS.queued} reviews queued. Current load is heavy but recoverable before 22:00.
            </p>
          </div>
          <button className="mt-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
            <IconPlay className="h-4 w-4" />
            Start Review
          </button>
        </div>

        {/* Status line */}
        <div className="mt-5 flex items-center justify-between rounded-[10px] border border-stone-200/60 bg-stone-100/60 px-4 py-2.5 dark:border-white/[0.06] dark:bg-[#25221f]/80">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px] text-stone-600 dark:text-stone-400">
            <span className="font-medium tabular-nums text-stone-800 dark:text-stone-300">
              {STATS.due}
            </span>
            <span>due</span>
            <span className="mx-1 text-stone-300 dark:text-stone-700">·</span>
            <span className="font-medium tabular-nums text-stone-800 dark:text-stone-300">
              {STATS.learning}
            </span>
            <span>learning</span>
            <span className="mx-1 text-stone-300 dark:text-stone-700">·</span>
            <span className="font-medium tabular-nums text-stone-800 dark:text-stone-300">
              {STATS.new}
            </span>
            <span>new</span>
            <span className="mx-1 text-stone-300 dark:text-stone-700">·</span>
            <span className="font-medium tabular-nums text-stone-800 dark:text-stone-300">
              {STATS.retention}%
            </span>
            <span>retention</span>
            <span className="mx-1 text-stone-300 dark:text-stone-700">·</span>
            <span className="font-medium tabular-nums text-stone-800 dark:text-stone-300">
              {STATS.estimate}m
            </span>
            <span>estimate</span>
          </div>
          <span className="shrink-0 rounded-md bg-stone-200/70 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-stone-700 dark:bg-stone-800/70 dark:text-stone-400">
            FSRS {STATS.fsrs}%
          </span>
        </div>

        {/* Decks section */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-stone-800 dark:text-stone-200">Decks</h2>
          <button className="text-[13px] font-medium text-blue-500 hover:text-blue-400">
            Sort by pressure
          </button>
        </div>

        {/* Deck table */}
        <div className="mt-3 rounded-[10px] border border-stone-200/60 bg-stone-100/40 dark:border-white/[0.06] dark:bg-[#1e1b18]/60">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_80px_80px] items-center border-b border-stone-200/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-stone-500 dark:border-white/[0.06] dark:text-stone-500">
            <div className="pl-6">Deck</div>
            <div className="text-right">Due</div>
            <div className="text-right">Learn</div>
            <div className="text-right">New</div>
          </div>

          {/* Rows */}
          {DECKS.map((deck, i) => (
            <div
              key={deck.id}
              className={cn(
                "group grid cursor-default grid-cols-[1fr_80px_80px_80px] items-center px-4 py-2 transition-colors hover:bg-stone-200/30 dark:hover:bg-white/[0.03]",
                i !== DECKS.length - 1 && "border-b border-stone-200/40 dark:border-white/[0.04]",
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-[8px] w-[8px] shrink-0 rounded-full"
                  style={{ backgroundColor: deck.tint }}
                />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-stone-800 dark:text-stone-200">
                    {deck.name}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-500">{deck.path}</div>
                </div>
              </div>
              <div className="text-right text-[13px] font-medium tabular-nums text-stone-700 dark:text-stone-300">
                {deck.due}
              </div>
              <div className="text-right text-[13px] font-medium tabular-nums text-stone-700 dark:text-stone-300">
                {deck.learn}
              </div>
              <div className="text-right text-[13px] font-medium tabular-nums text-stone-700 dark:text-stone-300">
                {deck.new}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-stone-200/40 px-6 py-2.5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-500">
          <IconCloud className="h-3.5 w-3.5" />
          <span>Synced 38s ago</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <KeyCap>⌘K</KeyCap>
            <span className="text-[11px] text-stone-500 dark:text-stone-500">Commands</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyCap>Space</KeyCap>
            <span className="text-[11px] text-stone-500 dark:text-stone-500">Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyCap>/</KeyCap>
            <span className="text-[11px] text-stone-500 dark:text-stone-500">Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────
   App shell
   ──────────────────────────────── */
function App() {
  return (
    <div
      className="flex h-full gap-2 bg-[#f6f4ef] p-2 text-stone-950 dark:bg-[#1c1917] dark:text-stone-100"
      data-window-shell
    >
      <Sidebar />
      <main className="flex-1 overflow-hidden rounded-[var(--window-radius)] border border-white/75 bg-stone-50 shadow-lg shadow-stone-400/10 dark:border-white/10 dark:bg-[#1c1917] dark:shadow-stone-950/20">
        <TodayView />
      </main>
    </div>
  );
}

function boot() {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("Missing app mount");
  }

  createRoot(app).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

boot();
