import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const MIN_WIDTH = 150;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 192;
const STICK_THRESHOLD = 20;

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
        // Currently collapsed: sticky zone for expanding
        if (stickStateRef.current.type === "none") {
          stickStateRef.current = { type: "stuck", anchor: currentX };
          return;
        }

        const { anchor } = stickStateRef.current;
        const stickDelta = currentX - anchor;

        if (stickDelta >= STICK_THRESHOLD) {
          // Expand to cursor position
          widthRef.current = newWidth;
          setWidth(newWidth);
          setIsCollapsed(false);
          isCollapsedRef.current = false;
          stickStateRef.current = { type: "none" };
        } else if (stickDelta <= 0) {
          // Exit sticky zone without expanding
          stickStateRef.current = { type: "none" };
        }
        // Otherwise: stay collapsed
      } else {
        // Currently open: sticky zone for collapsing
        if (newWidth < MIN_WIDTH) {
          if (stickStateRef.current.type === "none") {
            stickStateRef.current = { type: "stuck", anchor: currentX };
            setWidth(MIN_WIDTH);
            return;
          }

          const { anchor } = stickStateRef.current;
          const stickDelta = currentX - anchor;

          if (stickDelta <= -STICK_THRESHOLD) {
            // Collapse
            widthRef.current = 6;
            setWidth(6);
            setIsCollapsed(true);
            isCollapsedRef.current = true;
            stickStateRef.current = { type: "none" };
          } else if (stickDelta >= 0) {
            // Exit sticky zone without collapsing
            stickStateRef.current = { type: "none" };
            const resumedWidth = Math.max(MIN_WIDTH, newWidth);
            widthRef.current = resumedWidth;
            setWidth(resumedWidth);
            setIsCollapsed(false);
          } else {
            // Still in sticky zone
            setWidth(MIN_WIDTH);
          }
        } else {
          // Normal resizing
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
          className="size-full border border-white/75 bg-stone-50 shadow-lg shadow-stone-400/10 dark:border-white/10 dark:bg-stone-800 dark:shadow-stone-950/20"
          data-window-sidebar
        />
      )}
      <div
        className="resize-handle absolute top-0 right-0 bottom-0 z-10"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

function App() {
  return (
    <div
      className="flex h-full bg-stone-100 p-2 text-stone-950 dark:bg-stone-900 dark:text-stone-100"
      data-window-shell
    >
      <Sidebar />
      <main className="flex-1" />
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
