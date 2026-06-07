import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type Route =
  | "today"
  | "study"
  | "browser"
  | "create"
  | "stats"
  | "sync"
  | "settings"
  | `deck:${string}`;

type Deck = {
  id: string;
  name: string;
  path: string;
  due: number;
  learning: number;
  newCards: number;
  total: number;
  retention: number;
  streak: number;
  lastStudied: string;
  tint: string;
};

type NoteCard = {
  id: string;
  deck: string;
  front: string;
  back: string;
  due: string;
  interval: string;
  ease: string;
  tags: string[];
};

type ReviewEvent = {
  hour: string;
  reviews: number;
  accuracy: number;
};

type Metric = {
  title: string;
  value: string;
  detail: string;
};

type IconName =
  | "archive"
  | "browser"
  | "check"
  | "cloud"
  | "code"
  | "create"
  | "deck"
  | "doc"
  | "image"
  | "laptop"
  | "phone"
  | "play"
  | "settings"
  | "stats"
  | "study"
  | "sun"
  | "sync"
  | "tablet";

const decks: Deck[] = [
  {
    id: "japanese-core",
    name: "Japanese Core",
    path: "Languages / Kaishi 1.5k",
    due: 64,
    learning: 8,
    newCards: 12,
    total: 1523,
    retention: 94,
    streak: 42,
    lastStudied: "2m ago",
    tint: "oklch(58% 0.18 22)",
  },
  {
    id: "medicine",
    name: "Medicine",
    path: "School / Pathoma + Sketchy",
    due: 47,
    learning: 11,
    newCards: 0,
    total: 4200,
    retention: 91,
    streak: 106,
    lastStudied: "1h ago",
    tint: "oklch(61% 0.14 146)",
  },
  {
    id: "art-history",
    name: "Art History",
    path: "Great Works of Art",
    due: 39,
    learning: 5,
    newCards: 6,
    total: 890,
    retention: 88,
    streak: 18,
    lastStudied: "3h ago",
    tint: "oklch(70% 0.17 55)",
  },
  {
    id: "hsk-3000-characters",
    name: "HSK 3000 Characters",
    path: "Chinese / Writing",
    due: 88,
    learning: 16,
    newCards: 18,
    total: 3000,
    retention: 87,
    streak: 25,
    lastStudied: "5h ago",
    tint: "oklch(56% 0.17 300)",
  },
  {
    id: "leetcode-patterns",
    name: "LeetCode Patterns",
    path: "Programming / Algorithms",
    due: 23,
    learning: 3,
    newCards: 4,
    total: 150,
    retention: 96,
    streak: 9,
    lastStudied: "1d ago",
    tint: "oklch(64% 0.15 196)",
  },
];

const cards: NoteCard[] = [
  {
    id: "shizuka",
    deck: "Japanese Core",
    front: "静か",
    back: "Quiet, peaceful",
    due: "2d",
    interval: "4d",
    ease: "250%",
    tags: ["adjective", "common"],
  },
  {
    id: "utsukushii",
    deck: "Japanese Core",
    front: "美しい",
    back: "Beautiful, lovely",
    due: "1d",
    interval: "3d",
    ease: "230%",
    tags: ["adjective"],
  },
  {
    id: "ookii",
    deck: "Japanese Core",
    front: "大きい",
    back: "Big, large",
    due: "4h",
    interval: "1d",
    ease: "210%",
    tags: ["adjective", "size"],
  },
  {
    id: "penicillin",
    deck: "Medicine",
    front: "Mechanism of penicillin",
    back: "Inhibits bacterial cell wall synthesis by binding PBPs.",
    due: "3d",
    interval: "7d",
    ease: "265%",
    tags: ["antibiotics", "microbiology"],
  },
  {
    id: "celiac",
    deck: "Medicine",
    front: "Celiac histology",
    back: "Villous atrophy, crypt hyperplasia, intraepithelial lymphocytes.",
    due: "5d",
    interval: "14d",
    ease: "280%",
    tags: ["pathology", "GI"],
  },
  {
    id: "starry-night",
    deck: "Art History",
    front: "The Starry Night",
    back: "Vincent van Gogh, 1889, post-impressionist oil on canvas.",
    due: "1d",
    interval: "5d",
    ease: "250%",
    tags: ["painting", "post-impressionism"],
  },
  {
    id: "birth-of-venus",
    deck: "Art History",
    front: "The Birth of Venus",
    back: "Sandro Botticelli, c. 1485, tempera on canvas.",
    due: "6h",
    interval: "3d",
    ease: "235%",
    tags: ["painting", "renaissance"],
  },
  {
    id: "an",
    deck: "HSK 3000 Characters",
    front: "安",
    back: "peaceful, safe; roof radical over woman.",
    due: "now",
    interval: "learning",
    ease: "190%",
    tags: ["character", "radical"],
  },
  {
    id: "sliding-window",
    deck: "LeetCode Patterns",
    front: "Sliding window invariant",
    back: "Maintain a contiguous range while updating counts incrementally.",
    due: "2d",
    interval: "9d",
    ease: "255%",
    tags: ["arrays", "patterns"],
  },
];

const events: ReviewEvent[] = [
  { hour: "7", reviews: 28, accuracy: 95 },
  { hour: "8", reviews: 42, accuracy: 93 },
  { hour: "9", reviews: 18, accuracy: 88 },
  { hour: "12", reviews: 24, accuracy: 91 },
  { hour: "15", reviews: 36, accuracy: 94 },
  { hour: "18", reviews: 52, accuracy: 89 },
  { hour: "21", reviews: 31, accuracy: 92 },
];

function App() {
  const [selectedRoute, setSelectedRoute] = useState<Route>("today");
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id);
  const [searchText, setSearchText] = useState("");
  const [showingBack, setShowingBack] = useState(false);
  const [prompt, setPrompt] = useState(
    "Create a focused deck from my Renaissance notes. Preserve images, generate cloze cards for dates, and add tags for artist, period, medium, and location.",
  );

  const selectedDeck = useMemo(() => {
    if (selectedRoute.startsWith("deck:")) {
      const id = selectedRoute.slice("deck:".length);
      return decks.find((deck) => deck.id === id) ?? decks[0];
    }

    return decks[0];
  }, [selectedRoute]);

  const filteredCards = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase();

    if (!query) {
      return cards;
    }

    return cards.filter((card) =>
      [card.front, card.back, card.deck, card.tags.join(" ")]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    );
  }, [searchText]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && selectedRoute !== "study") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>("#collection-search")?.focus();
      }

      if (event.code === "Space" && selectedRoute === "study") {
        event.preventDefault();
        setShowingBack((current) => !current);
      }

      if (["1", "2", "3", "4"].includes(event.key) && selectedRoute === "study" && showingBack) {
        event.preventDefault();
        setShowingBack(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRoute, showingBack]);

  if (!selectedDeck) {
    throw new Error("Missing sample deck");
  }

  const showToolbar = selectedRoute !== "study";

  return (
    <div className="app-shell">
      <Sidebar selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} />
      <main className="detail-shell">
        {showToolbar ? (
          <Toolbar
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onCreate={() => setSelectedRoute("create")}
          />
        ) : null}
        <section className={showToolbar ? "detail-content" : "detail-content study-content"}>
          <DetailView
            filteredCards={filteredCards}
            prompt={prompt}
            searchText={searchText}
            selectedCardId={selectedCardId}
            selectedDeck={selectedDeck}
            selectedRoute={selectedRoute}
            showingBack={showingBack}
            onPromptChange={setPrompt}
            onSelectCard={setSelectedCardId}
            onSelectDeck={(deck) => setSelectedRoute(`deck:${deck.id}`)}
            onSelectRoute={setSelectedRoute}
            onShowBackChange={setShowingBack}
          />
        </section>
      </main>
    </div>
  );
}

function Sidebar({
  selectedRoute,
  onSelectRoute,
}: {
  selectedRoute: Route;
  onSelectRoute: (route: Route) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="window-drag-space" />
      <nav aria-label="Main navigation">
        <SidebarSection title="Review">
          <SidebarItem
            count={261}
            icon="sun"
            isSelected={selectedRoute === "today"}
            title="Today"
            onClick={() => onSelectRoute("today")}
          />
          <SidebarItem
            count={124}
            icon="study"
            isSelected={selectedRoute === "study"}
            title="Study Queue"
            onClick={() => onSelectRoute("study")}
          />
          <SidebarItem
            icon="browser"
            isSelected={selectedRoute === "browser"}
            title="Browse"
            onClick={() => onSelectRoute("browser")}
          />
          <SidebarItem
            icon="create"
            isSelected={selectedRoute === "create"}
            title="Create"
            onClick={() => onSelectRoute("create")}
          />
        </SidebarSection>

        <SidebarSection title="Decks">
          {decks.map((deck) => (
            <button
              className={`sidebar-row deck-link ${selectedRoute === `deck:${deck.id}` ? "is-selected" : ""}`}
              key={deck.id}
              onClick={() => onSelectRoute(`deck:${deck.id}`)}
              type="button"
            >
              <span className="deck-dot" style={{ background: deck.tint }} />
              <span className="sidebar-label">{deck.name}</span>
              {deck.due > 0 ? (
                <span className="sidebar-count">{deck.due.toLocaleString()}</span>
              ) : null}
            </button>
          ))}
        </SidebarSection>

        <SidebarSection title="System">
          <SidebarItem
            icon="stats"
            isSelected={selectedRoute === "stats"}
            title="Stats"
            onClick={() => onSelectRoute("stats")}
          />
          <SidebarItem
            icon="cloud"
            isSelected={selectedRoute === "sync"}
            title="Sync"
            onClick={() => onSelectRoute("sync")}
          />
          <SidebarItem
            icon="settings"
            isSelected={selectedRoute === "settings"}
            title="Settings"
            onClick={() => onSelectRoute("settings")}
          />
        </SidebarSection>
      </nav>
    </aside>
  );
}

function SidebarSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="sidebar-section">
      <h2>{title}</h2>
      <div className="sidebar-items">{children}</div>
    </section>
  );
}

function SidebarItem({
  count,
  icon,
  isSelected,
  title,
  onClick,
}: {
  count?: number;
  icon: IconName;
  isSelected: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`sidebar-row ${isSelected ? "is-selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      <Icon name={icon} />
      <span className="sidebar-label">{title}</span>
      {count !== undefined ? <span className="sidebar-count">{count.toLocaleString()}</span> : null}
    </button>
  );
}

function Toolbar({
  searchText,
  onCreate,
  onSearchTextChange,
}: {
  searchText: string;
  onCreate: () => void;
  onSearchTextChange: (text: string) => void;
}) {
  return (
    <header className="toolbar">
      <button
        aria-label="Create Deck"
        className="toolbar-button icon-only"
        onClick={onCreate}
        title="Create Deck"
        type="button"
      >
        <Icon name="create" />
      </button>
      <button aria-label="Sync" className="toolbar-button icon-only" title="Sync" type="button">
        <Icon name="sync" />
      </button>
      <label className="search-field" htmlFor="collection-search">
        <Icon name="browser" />
        <input
          autoComplete="off"
          id="collection-search"
          placeholder="Decks, cards, tags"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.currentTarget.value)}
        />
      </label>
      <div className="toolbar-drag" />
    </header>
  );
}

function DetailView({
  filteredCards,
  prompt,
  searchText,
  selectedCardId,
  selectedDeck,
  selectedRoute,
  showingBack,
  onPromptChange,
  onSelectCard,
  onSelectDeck,
  onSelectRoute,
  onShowBackChange,
}: {
  filteredCards: NoteCard[];
  prompt: string;
  searchText: string;
  selectedCardId: string | undefined;
  selectedDeck: Deck;
  selectedRoute: Route;
  showingBack: boolean;
  onPromptChange: (prompt: string) => void;
  onSelectCard: (id: string) => void;
  onSelectDeck: (deck: Deck) => void;
  onSelectRoute: (route: Route) => void;
  onShowBackChange: (showing: boolean) => void;
}) {
  if (selectedRoute === "today") {
    return <TodayView onSelectDeck={onSelectDeck} onStartStudy={() => onSelectRoute("study")} />;
  }

  if (selectedRoute === "study") {
    return <StudyView showingBack={showingBack} onShowBackChange={onShowBackChange} />;
  }

  if (selectedRoute === "browser") {
    return (
      <BrowserView
        cards={filteredCards}
        selectedCardId={selectedCardId}
        searchText={searchText}
        onSelectCard={onSelectCard}
      />
    );
  }

  if (selectedRoute === "create") {
    return <CreateDeckView prompt={prompt} onPromptChange={onPromptChange} />;
  }

  if (selectedRoute === "stats") {
    return <StatsView />;
  }

  if (selectedRoute === "sync") {
    return <SyncView />;
  }

  if (selectedRoute === "settings") {
    return <SettingsView />;
  }

  return <DeckDetailView deck={selectedDeck} />;
}

function TodayView({
  onSelectDeck,
  onStartStudy,
}: {
  onSelectDeck: (deck: Deck) => void;
  onStartStudy: () => void;
}) {
  const totalDue = decks.reduce((sum, deck) => sum + deck.due, 0);
  const totalLearning = decks.reduce((sum, deck) => sum + deck.learning, 0);
  const totalNew = decks.reduce((sum, deck) => sum + deck.newCards, 0);

  return (
    <ScrollPage>
      <div className="today-header">
        <div>
          <h1>Today</h1>
          <p>124 reviews queued. Current load is heavy but recoverable before 22:00.</p>
        </div>
        <button className="primary-action" onClick={onStartStudy} type="button">
          <Icon name="play" />
          Start Review
        </button>
      </div>

      <div className="status-line">
        <span>
          {totalDue} due · {totalLearning} learning · {totalNew} new · 92% retention · 38m estimate
        </span>
        <span className="pill">FSRS 91%</span>
      </div>

      <section className="section-block">
        <SectionHeader action="Sort by pressure" title="Decks" />
        <DeckTable onSelectDeck={onSelectDeck} />
      </section>

      <footer className="footer-bar">
        <span className="sync-status">
          <Icon name="check" />
          Synced 38s ago
        </span>
        <span className="footer-hints">
          <KeyHint keyName="⌘K" label="Commands" />
          <KeyHint keyName="Space" label="Review" />
          <KeyHint keyName="/" label="Search" />
        </span>
      </footer>
    </ScrollPage>
  );
}

function DeckDetailView({ deck }: { deck: Deck }) {
  const deckCards = cards.filter((card) => card.deck === deck.name);

  return (
    <ScrollPage>
      <HeaderBlock
        subtitle={deck.path}
        title={deck.name}
        trailing={`${deck.retention}% retention`}
      />
      <MetricStrip
        metrics={[
          { title: "Due", value: `${deck.due}`, detail: "now" },
          { title: "Learning", value: `${deck.learning}`, detail: "steps" },
          { title: "New", value: `${deck.newCards}`, detail: "today" },
          { title: "Cards", value: deck.total.toLocaleString(), detail: "total" },
          { title: "Streak", value: `${deck.streak}d`, detail: "deck" },
        ]}
      />
      <div className="two-column">
        <Panel>
          <SectionHeader action="Open Browser" title="Recent Notes" />
          <div className="preview-list">
            {deckCards.slice(0, 5).map((card) => (
              <CardPreviewRow card={card} key={card.id} />
            ))}
          </div>
        </Panel>
        <Panel className="options-panel">
          <SectionHeader action="Edit" title="Deck Options" />
          <SettingLine title="Scheduler" value="FSRS compatible" />
          <SettingLine title="Daily limit" value="120 reviews" />
          <SettingLine title="New cards" value={`${deck.newCards} per day`} />
          <SettingLine title="Import source" value="Anki package" />
        </Panel>
      </div>
    </ScrollPage>
  );
}

function StudyView({
  showingBack,
  onShowBackChange,
}: {
  showingBack: boolean;
  onShowBackChange: (showing: boolean) => void;
}) {
  return (
    <div className="study-view">
      <div className="window-drag-strip" />
      <div className="study-card">
        <div className="study-prompt">
          <div className="kanji">静か</div>
          <p>adjective · common · audio attached</p>
        </div>

        {showingBack ? (
          <div className="answer-block">
            <h2>Quiet, peaceful</h2>
            <p className="reading">shizuka</p>
            <p>The room became quiet after the lecture ended.</p>
          </div>
        ) : null}

        <div className="study-actions">
          {showingBack ? (
            <RatingBar onRate={() => onShowBackChange(false)} />
          ) : (
            <button
              className="show-answer-button"
              onClick={() => onShowBackChange(true)}
              type="button"
            >
              <KeyCap>Space</KeyCap>
              Show Answer
            </button>
          )}
        </div>

        <ReviewShortcutBar answerShown={showingBack} />
      </div>
    </div>
  );
}

function BrowserView({
  cards: visibleCards,
  searchText,
  selectedCardId,
  onSelectCard,
}: {
  cards: NoteCard[];
  searchText: string;
  selectedCardId: string | undefined;
  onSelectCard: (id: string) => void;
}) {
  const selectedCard = visibleCards.find((card) => card.id === selectedCardId) ?? visibleCards[0];

  return (
    <div className="browser-view">
      <div className="browser-table-pane">
        <div className="browser-header">
          <h1>{visibleCards.length} notes</h1>
          <SegmentedControl options={["Due", "New", "Marked"]} selected="Due" />
        </div>
        {searchText ? <p className="search-summary">Filtered by "{searchText}"</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Front</th>
                <th>Back</th>
                <th>Deck</th>
                <th>Due</th>
                <th>Ease</th>
              </tr>
            </thead>
            <tbody>
              {visibleCards.map((card) => (
                <tr
                  className={card.id === selectedCard?.id ? "is-selected" : ""}
                  key={card.id}
                  onClick={() => onSelectCard(card.id)}
                >
                  <td>{card.front}</td>
                  <td>{card.back}</td>
                  <td>{card.deck}</td>
                  <td className="numeric">{card.due}</td>
                  <td className="numeric">{card.ease}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NoteInspector card={selectedCard} />
    </div>
  );
}

function CreateDeckView({
  prompt,
  onPromptChange,
}: {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}) {
  return (
    <ScrollPage>
      <HeaderBlock
        subtitle="Turn notes, PDFs, media, or a prompt into an Anki-compatible deck."
        title="Create"
        trailing="Skill-ready"
      />
      <div className="create-grid">
        <Panel>
          <SectionHeader action="Run" title="Prompt" />
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.currentTarget.value)}
          />
          <div className="source-grid">
            <SourceChip icon="doc" title="Notes.md" />
            <SourceChip icon="image" title="Images" />
            <SourceChip icon="archive" title="Existing APKG" />
          </div>
        </Panel>
        <Panel>
          <SectionHeader action="Adjust" title="Deck Blueprint" />
          <BlueprintRow detail="Basic, Cloze, Image Occlusion" title="Note types" />
          <BlueprintRow detail="Exports .apkg with media" title="Compatibility" />
          <BlueprintRow detail="Preserve review history if present" title="Scheduler" />
          <BlueprintRow detail="Expose SKILL.md and MCP command" title="Automation" />
        </Panel>
      </div>
      <Panel>
        <SectionHeader action="Reveal Logs" title="Generation Queue" />
        <GenerationStep progress={1} status="complete" title="Parse sources" />
        <GenerationStep progress={0.72} status="ready" title="Draft cards" />
        <GenerationStep progress={0.18} status="waiting" title="Validate templates" />
        <GenerationStep progress={0.06} status="waiting" title="Package media" />
      </Panel>
    </ScrollPage>
  );
}

function StatsView() {
  return (
    <ScrollPage>
      <HeaderBlock
        subtitle="Scheduler health without visual noise."
        title="Stats"
        trailing="Last 30 days"
      />
      <MetricStrip
        metrics={[
          { title: "Reviews", value: "4,812", detail: "30-day" },
          { title: "Accuracy", value: "92%", detail: "mature" },
          { title: "Burden", value: "38m", detail: "daily avg" },
          { title: "Overdue", value: "17", detail: "cards" },
          { title: "Mature", value: "68%", detail: "collection" },
        ]}
      />
      <div className="two-column">
        <ReviewDensityPanel />
        <Panel className="pressure-panel">
          <SectionHeader action="Tune" title="Deck Pressure" />
          {decks.map((deck) => (
            <PressureRow deck={deck} key={deck.id} />
          ))}
        </Panel>
      </div>
    </ScrollPage>
  );
}

function SyncView() {
  return (
    <ScrollPage>
      <HeaderBlock
        subtitle="Local-first review data with explicit conflict visibility."
        title="Sync"
        trailing="Connected"
      />
      <Panel>
        <SyncLine detail="Current device · 38 seconds ago" icon="laptop" title="MacBook Pro" />
        <SyncLine detail="Review log merged · 7 minutes ago" icon="phone" title="iPhone" />
        <SyncLine detail="Media download pending · 2 hours ago" icon="tablet" title="iPad" />
        <SyncLine detail="Last .apkg snapshot saved yesterday" icon="archive" title="Anki export" />
      </Panel>
    </ScrollPage>
  );
}

function SettingsView() {
  return (
    <ScrollPage>
      <HeaderBlock
        subtitle="Defaults for fast review and trustworthy compatibility."
        title="Settings"
        trailing="Profile: Daily"
      />
      <Panel>
        <SectionHeader title="Review" />
        <SettingLine title="Scheduler" value="FSRS-compatible" />
        <SettingLine title="Answer keys" value="1 Again, 2 Hard, 3 Good, 4 Easy" />
        <SettingLine title="Autoplay audio" value="Front and back" />
        <SettingLine title="Bury siblings" value="Enabled" />
      </Panel>
      <Panel>
        <SectionHeader title="Compatibility" />
        <SettingLine title="Import" value=".apkg, .colpkg, media folders" />
        <SettingLine title="Export" value="Anki 2.1 package" />
        <SettingLine title="Templates" value="Preserve HTML and CSS" />
        <SettingLine title="History" value="Keep review logs when available" />
      </Panel>
    </ScrollPage>
  );
}

function ScrollPage({ children }: { children: React.ReactNode }) {
  return <div className="scroll-page">{children}</div>;
}

function HeaderBlock({
  subtitle,
  title,
  trailing,
}: {
  subtitle: string;
  title: string;
  trailing: string;
}) {
  return (
    <header className="header-block">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="pill">{trailing}</span>
    </header>
  );
}

function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="metric-strip">
      {metrics.map((metric) => (
        <div className="metric-cell" key={metric.title}>
          <span>{metric.title}</span>
          <strong>{metric.value}</strong>
          <span>{metric.detail}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ action, title }: { action?: string; title: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {action ? (
        <button className="link-button" type="button">
          {action}
        </button>
      ) : null}
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function DeckTable({ onSelectDeck }: { onSelectDeck: (deck: Deck) => void }) {
  return (
    <div className="deck-table">
      <div className="deck-table-head">
        <span />
        <span>Deck</span>
        <span>Due</span>
        <span>Learn</span>
        <span>New</span>
        <span className="wide-column">Ret.</span>
        <span className="wide-column">ETA</span>
        <span className="wide-column">Last</span>
      </div>
      {decks.map((deck) => (
        <button className="deck-row" key={deck.id} onClick={() => onSelectDeck(deck)} type="button">
          <span className="deck-dot" style={{ background: statusColor(deck) }} />
          <span className="deck-title">
            <strong>{deck.name}</strong>
            <small>{deck.path}</small>
          </span>
          <DeckValue emphasized={deck.due >= 80} value={deck.due.toLocaleString()} />
          <DeckValue emphasized={deck.learning >= 12} value={deck.learning.toLocaleString()} />
          <DeckValue value={deck.newCards.toLocaleString()} />
          <DeckValue
            className="wide-column"
            emphasized={deck.retention < 90}
            value={`${deck.retention}%`}
          />
          <DeckValue className="wide-column" value={estimateDeck(deck)} />
          <span className="wide-column last-studied">{deck.lastStudied}</span>
        </button>
      ))}
    </div>
  );
}

function DeckValue({
  className = "",
  emphasized = false,
  value,
}: {
  className?: string;
  emphasized?: boolean;
  value: string;
}) {
  return (
    <span className={`deck-value ${emphasized ? "is-emphasized" : ""} ${className}`}>{value}</span>
  );
}

function CardPreviewRow({ card }: { card: NoteCard }) {
  return (
    <div className="card-preview-row">
      <span>
        <strong>{card.front}</strong>
        <small>{card.back}</small>
      </span>
      <time>{card.due}</time>
    </div>
  );
}

function RatingBar({ onRate }: { onRate: () => void }) {
  const ratings = [
    { title: "Again", time: "1m", keyName: "1", className: "again" },
    { title: "Hard", time: "6m", keyName: "2", className: "hard" },
    { title: "Good", time: "2d", keyName: "3", className: "good" },
    { title: "Easy", time: "5d", keyName: "4", className: "easy" },
  ];

  return (
    <div className="rating-bar">
      {ratings.map((rating) => (
        <button
          className={`rating-button ${rating.className}`}
          key={rating.title}
          onClick={onRate}
          type="button"
        >
          <span>
            {rating.title}
            <KeyCap>{rating.keyName}</KeyCap>
          </span>
          <time>{rating.time}</time>
        </button>
      ))}
    </div>
  );
}

function ReviewShortcutBar({ answerShown }: { answerShown: boolean }) {
  return (
    <div className="review-shortcuts">
      <div className="review-progress">
        <span>Japanese Core</span>
        <span>18 / 124</span>
      </div>
      <div className="shortcut-list">
        <KeyHint keyName="Space" label={answerShown ? "Next" : "Answer"} />
        <KeyHint keyName="E" label="Edit" />
        <KeyHint keyName="B" label="Browse" />
        <KeyHint keyName="S" label="Suspend" />
        <KeyHint keyName="F" label="Flag" />
      </div>
    </div>
  );
}

function NoteInspector({ card }: { card: NoteCard | undefined }) {
  return (
    <aside className="note-inspector">
      <h2>Inspector</h2>
      {card ? (
        <>
          <div className="inspector-card">
            <h3>{card.front}</h3>
            <p>{card.back}</p>
            <div className="tag-row">
              {card.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <hr />
          <SettingLine title="Deck" value={card.deck} />
          <SettingLine title="Due" value={card.due} />
          <SettingLine title="Interval" value={card.interval} />
          <SettingLine title="Ease" value={card.ease} />
          <hr />
          <button className="inspector-button" type="button">
            <Icon name="code" />
            Edit Template
          </button>
          <button className="inspector-button" type="button">
            <Icon name="image" />
            Open Media
          </button>
        </>
      ) : (
        <p className="muted">Select a note to inspect scheduling, tags, templates, and media.</p>
      )}
    </aside>
  );
}

function SegmentedControl({ options, selected }: { options: string[]; selected: string }) {
  return (
    <div className="segmented-control" role="tablist">
      {options.map((option) => (
        <button aria-selected={option === selected} key={option} role="tab" type="button">
          {option}
        </button>
      ))}
    </div>
  );
}

function SourceChip({ icon, title }: { icon: IconName; title: string }) {
  return (
    <button className="source-chip" type="button">
      <Icon name={icon} />
      {title}
    </button>
  );
}

function BlueprintRow({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="blueprint-row">
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

function GenerationStep({
  progress,
  status,
  title,
}: {
  progress: number;
  status: string;
  title: string;
}) {
  return (
    <div className="generation-step">
      <Icon name={status === "complete" ? "check" : "deck"} />
      <strong>{title}</strong>
      <progress max={1} value={progress} />
      <span>{status}</span>
    </div>
  );
}

function ReviewDensityPanel() {
  return (
    <Panel className="density-panel">
      <SectionHeader title="Review Density" />
      <div className="density-chart">
        {events.map((event) => (
          <div className="density-column" key={event.hour}>
            <span
              className={event.accuracy >= 93 ? "high" : event.accuracy >= 88 ? "mid" : "low"}
              style={{ height: `${event.reviews * 1.1}px` }}
            />
            <small>{event.hour}</small>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PressureRow({ deck }: { deck: Deck }) {
  return (
    <div className="pressure-row">
      <div>
        <span>{deck.name}</span>
        <small>{deck.due} due</small>
      </div>
      <progress max={120} style={{ accentColor: deck.tint }} value={Math.min(deck.due, 120)} />
    </div>
  );
}

function SyncLine({ detail, icon, title }: { detail: string; icon: IconName; title: string }) {
  return (
    <div className="sync-line">
      <Icon name={icon} />
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <Icon name="check" />
    </div>
  );
}

function SettingLine({ title, value }: { title: string; value: string }) {
  return (
    <div className="setting-line">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KeyHint({ keyName, label }: { keyName: string; label: string }) {
  return (
    <span className="key-hint">
      <KeyCap>{keyName}</KeyCap>
      <span>{label}</span>
    </span>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return <kbd>{children}</kbd>;
}

function Icon({ name }: { name: IconName }) {
  const icons: Record<IconName, string> = {
    archive: "M4 7h16v13H4z M7 4h10l2 3H5z M8 12h8",
    browser: "M4 5h16v15H4z M4 9h16 M9 9v11",
    check: "M5 12l4 4L19 6",
    cloud: "M7 17h10a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4.5 4.5 0 0 0 1 9z",
    code: "M9 7l-5 5 5 5 M15 7l5 5-5 5",
    create: "M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9z",
    deck: "M5 6h14v13H5z M8 3h11v13",
    doc: "M7 3h8l4 4v14H7z M15 3v5h5 M10 13h7 M10 17h5",
    image: "M4 5h16v14H4z M8 14l3-3 3 3 2-2 3 4 M8 9h.01",
    laptop: "M5 5h14v10H5z M3 19h18",
    phone: "M9 3h6v18H9z M11 18h2",
    play: "M8 5v14l11-7z",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M19.1 4.9 17 7 M7 17l-2.1 2.1",
    stats: "M5 19V9 M12 19V5 M19 19v-8",
    study: "M7 4h10a3 3 0 0 1 0 6H7z M7 10h11a3 3 0 0 1 0 6H7z",
    sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 1v3 M12 20v3 M1 12h3 M20 12h3 M4 4l2 2 M18 18l2 2 M20 4l-2 2 M6 18l-2 2",
    sync: "M17 2v5h-5 M7 22v-5h5 M19 10a7 7 0 0 0-12-4 M5 14a7 7 0 0 0 12 4",
    tablet: "M7 3h10v18H7z M11 18h2",
  };

  return (
    <svg aria-hidden="true" className="icon" fill="none" viewBox="0 0 24 24">
      <path
        d={icons[name]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function statusColor(deck: Deck) {
  if (deck.due >= 80) {
    return "oklch(70% 0.17 55)";
  }

  if (deck.retention < 90) {
    return "oklch(76% 0.13 92)";
  }

  return deck.tint;
}

function estimateDeck(deck: Deck) {
  return `${Math.max(3, Math.ceil((deck.due + deck.learning * 2 + deck.newCards) / 7.5))}m`;
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
