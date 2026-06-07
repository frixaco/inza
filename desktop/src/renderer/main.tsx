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
        <span className="text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-500">
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
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "text-stone-700 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800/60",
      )}
    >
      <Icon className="size-4.5 shrink-0 opacity-80" />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-auto shrink-0 text-xs font-medium tabular-nums",
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
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "text-stone-700 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800/60",
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: deck.tint }} />
      <span className="flex-1 truncate">{deck.name}</span>
      <span
        className={cn(
          "ml-auto shrink-0 text-xs font-medium tabular-nums",
          active ? "text-white/80" : "text-stone-500 dark:text-stone-500",
        )}
      >
        {deck.due}
      </span>
    </button>
  );
}

function Sidebar({ onCollapsedChange }: { onCollapsedChange?: (collapsed: boolean) => void }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDraggingRef = useRef(false);
  const isCollapsedRef = useRef(false);
  const dragStartRef = useRef<{ x: number; width: number }>({ x: 0, width: 0 });
  const widthRef = useRef(DEFAULT_WIDTH);
  const stickStateRef = useRef<{ type: "none" } | { type: "stuck"; anchor: number }>({
    type: "none",
  });

  useEffect(() => {
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

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
          className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-white/75 bg-stone-50 shadow-lg shadow-stone-400/10 dark:border-white/10 dark:bg-stone-900 dark:shadow-stone-950/20"
          style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
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
        className={cn(
          "absolute top-0 right-0 bottom-0 z-10 w-1 cursor-col-resize",
          isCollapsed && "w-3.5",
        )}
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        onMouseDown={handleMouseDown}
      >
        {isCollapsed && (
          <div className="absolute top-1/2 left-1/2 h-15 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-500/30" />
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────
   Today View
   ──────────────────────────────── */
function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-xs font-semibold text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
      {children}
    </kbd>
  );
}

function TodayView({ isCollapsed }: { isCollapsed: boolean }) {
  const hPad = isCollapsed ? "pl-12 pr-6" : "px-6";

  return (
    <div className="flex h-full flex-col">
      {/* Top toolbar */}
      <div className={cn("z-10 flex shrink-0 items-center gap-2 pt-0.5", hPad)}>
        <button className="flex size-6 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200">
          <IconRefresh className="size-4.5" />
        </button>
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            placeholder="Decks, cards, tags"
            className="h-6 w-full max-w-52 rounded-lg border border-stone-200 bg-stone-100/80 pr-3 pl-9 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-500 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className={cn("flex flex-1 flex-col overflow-y-auto pb-4", hPad)}>
        {/* Deck table */}
        <div className="mt-3 rounded-lg border border-stone-200/60 bg-stone-100/40 dark:border-white/10 dark:bg-stone-900/60">
          {/* Header */}
          <div
            className="grid items-center border-b border-stone-200/60 px-4 py-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:border-white/10 dark:text-stone-500"
            style={{ gridTemplateColumns: "1fr 80px 80px 80px" }}
          >
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
                "group grid cursor-default items-center px-4 py-2 transition-colors hover:bg-stone-200/30 dark:hover:bg-white/5",
                i !== DECKS.length - 1 && "border-b border-stone-200/40 dark:border-white/5",
              )}
              style={{ gridTemplateColumns: "1fr 80px 80px 80px" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: deck.tint }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    {deck.name}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-500">{deck.path}</div>
                </div>
              </div>
              <div className="text-right text-sm font-medium text-stone-700 tabular-nums dark:text-stone-300">
                {deck.due}
              </div>
              <div className="text-right text-sm font-medium text-stone-700 tabular-nums dark:text-stone-300">
                {deck.learn}
              </div>
              <div className="text-right text-sm font-medium text-stone-700 tabular-nums dark:text-stone-300">
                {deck.new}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────
   App shell
   ──────────────────────────────── */
function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-full gap-2 rounded-xl bg-stone-100 p-2 text-stone-950 dark:bg-stone-900 dark:text-stone-100">
      <Sidebar onCollapsedChange={setIsCollapsed} />
      <main className="flex-1 overflow-hidden rounded-xl bg-stone-50 shadow-lg shadow-stone-400/10 dark:bg-stone-900 dark:shadow-stone-950/20">
        <TodayView isCollapsed={isCollapsed} />
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
