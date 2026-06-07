import { useEffect, useMemo, useState } from "react";

import { cn } from "./utils";

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

export function App() {
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
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <Sidebar selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {showToolbar ? (
          <Toolbar
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onCreate={() => setSelectedRoute("create")}
          />
        ) : null}
        <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
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
    <aside className="m-2 flex w-64 shrink-0 flex-col overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <nav aria-label="Main navigation" className="grid gap-4">
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
              className={cn(
                "flex min-h-8 items-center gap-2 rounded-lg px-2 py-1 text-left text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                selectedRoute === `deck:${deck.id}` &&
                  "bg-blue-600 text-white hover:bg-blue-600 dark:text-white dark:hover:bg-blue-600",
              )}
              key={deck.id}
              onClick={() => onSelectRoute(`deck:${deck.id}`)}
              type="button"
            >
              <DeckDot deck={deck} />
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {deck.name}
              </span>
              {deck.due > 0 ? (
                <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                  {deck.due.toLocaleString()}
                </span>
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
    <section className="grid gap-1">
      <h2 className="px-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">{title}</h2>
      <div className="grid gap-px">{children}</div>
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
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-lg px-2 py-1 text-left text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
        isSelected &&
          "bg-blue-600 text-white hover:bg-blue-600 dark:text-white dark:hover:bg-blue-600",
      )}
      onClick={onClick}
      type="button"
    >
      <Icon name={icon} />
      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </span>
      {count !== undefined ? (
        <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
          {count.toLocaleString()}
        </span>
      ) : null}
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
    <header className="flex h-12 items-center gap-2 px-3">
      <button
        aria-label="Create Deck"
        className="inline-flex size-9 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm hover:bg-zinc-50 active:translate-y-px dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
        onClick={onCreate}
        title="Create Deck"
        type="button"
      >
        <Icon name="create" />
      </button>
      <button
        aria-label="Sync"
        className="inline-flex size-9 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm hover:bg-zinc-50 active:translate-y-px dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
        title="Sync"
        type="button"
      >
        <Icon name="sync" />
      </button>
      <label
        className="flex h-9 w-80 max-w-full items-center gap-2 rounded-full bg-white px-3 shadow-sm dark:bg-zinc-900"
        htmlFor="collection-search"
      >
        <Icon className="size-4 text-zinc-400" name="browser" />
        <input
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold outline-0 placeholder:text-zinc-400"
          id="collection-search"
          placeholder="Decks, cards, tags"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.currentTarget.value)}
        />
      </label>
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
            Today
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            124 reviews queued. Current load is heavy but recoverable before 22:00.
          </p>
        </div>
        <button
          className="inline-flex min-h-9 min-w-36 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold whitespace-nowrap text-white shadow-sm hover:bg-blue-700 active:translate-y-px"
          onClick={onStartStudy}
          type="button"
        >
          <Icon name="play" />
          Start Review
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>
          {totalDue} due · {totalLearning} learning · {totalNew} new · 92% retention · 38m estimate
        </span>
        <Pill>FSRS 91%</Pill>
      </div>

      <section className="grid gap-3">
        <SectionHeader action="Sort by pressure" title="Decks" />
        <DeckTable onSelectDeck={onSelectDeck} />
      </section>

      <footer className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-2">
          <Icon name="check" />
          Synced 38s ago
        </span>
        <span className="ml-auto flex items-center gap-3.5">
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
      <div className="grid grid-cols-3 items-start gap-6">
        <Panel>
          <SectionHeader action="Open Browser" title="Recent Notes" />
          <div className="grid">
            {deckCards.slice(0, 5).map((card) => (
              <CardPreviewRow card={card} key={card.id} />
            ))}
          </div>
        </Panel>
        <Panel>
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
    <div className="grid h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="grid min-h-0 grid-rows-5 justify-items-center px-10 pb-8 text-center">
        <div className="row-span-2 grid content-end gap-4">
          <div className="font-serif text-8xl leading-none">静か</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            adjective · common · audio attached
          </p>
        </div>

        {showingBack ? (
          <div className="mt-6 grid gap-2">
            <h2 className="text-3xl font-semibold">Quiet, peaceful</h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">shizuka</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              The room became quiet after the lecture ended.
            </p>
          </div>
        ) : null}

        <div className="mt-8 w-full max-w-5xl">
          {showingBack ? (
            <RatingBar onRate={() => onShowBackChange(false)} />
          ) : (
            <button
              className="inline-flex min-h-11 w-full max-w-md items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
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
    <div className="grid h-full min-h-0 grid-cols-3">
      <div className="col-span-2 flex min-h-0 min-w-0 flex-col">
        <div className="flex items-center justify-between gap-4 p-4">
          <h1 className="text-base font-bold">{visibleCards.length} notes</h1>
          <SegmentedControl options={["Due", "New", "Marked"]} selected="Due" />
        </div>
        {searchText ? (
          <p className="mx-4 mb-2 text-xs text-zinc-500 dark:text-zinc-400">
            Filtered by "{searchText}"
          </p>
        ) : null}
        <div className="min-h-0 overflow-auto border-t border-zinc-200 dark:border-zinc-800">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className="sticky top-0 border-b border-zinc-200 bg-zinc-100 p-2 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  Front
                </th>
                <th className="sticky top-0 border-b border-zinc-200 bg-zinc-100 p-2 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  Back
                </th>
                <th className="sticky top-0 border-b border-zinc-200 bg-zinc-100 p-2 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  Deck
                </th>
                <th className="sticky top-0 border-b border-zinc-200 bg-zinc-100 p-2 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  Due
                </th>
                <th className="sticky top-0 border-b border-zinc-200 bg-zinc-100 p-2 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  Ease
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleCards.map((card) => (
                <tr
                  className={card.id === selectedCard?.id ? "bg-blue-100 dark:bg-blue-950" : ""}
                  key={card.id}
                  onClick={() => onSelectCard(card.id)}
                >
                  <td className="overflow-hidden border-b border-zinc-200 p-2 text-sm text-ellipsis whitespace-nowrap dark:border-zinc-800">
                    {card.front}
                  </td>
                  <td className="overflow-hidden border-b border-zinc-200 p-2 text-sm text-ellipsis whitespace-nowrap dark:border-zinc-800">
                    {card.back}
                  </td>
                  <td className="overflow-hidden border-b border-zinc-200 p-2 text-sm text-ellipsis whitespace-nowrap dark:border-zinc-800">
                    {card.deck}
                  </td>
                  <td className="overflow-hidden border-b border-zinc-200 p-2 text-sm text-ellipsis whitespace-nowrap text-zinc-500 tabular-nums dark:border-zinc-800 dark:text-zinc-400">
                    {card.due}
                  </td>
                  <td className="overflow-hidden border-b border-zinc-200 p-2 text-sm text-ellipsis whitespace-nowrap text-zinc-500 tabular-nums dark:border-zinc-800 dark:text-zinc-400">
                    {card.ease}
                  </td>
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
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Panel>
            <SectionHeader action="Run" title="Prompt" />
            <textarea
              className="min-h-44 w-full resize-y rounded-lg border-0 bg-zinc-100 p-3 text-sm outline-0 dark:bg-zinc-800"
              value={prompt}
              onChange={(event) => onPromptChange(event.currentTarget.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              <SourceChip icon="doc" title="Notes.md" />
              <SourceChip icon="image" title="Images" />
              <SourceChip icon="archive" title="Existing APKG" />
            </div>
          </Panel>
        </div>
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
      <div className="grid grid-cols-3 items-start gap-6">
        <div className="col-span-2">
          <ReviewDensityPanel />
        </div>
        <Panel>
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
  return <div className="grid h-full content-start gap-5 overflow-auto px-5 py-8">{children}</div>;
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
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>
      <Pill>{trailing}</Pill>
    </header>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-6 items-center rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold whitespace-nowrap text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-5 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {metrics.map((metric) => (
        <div
          className="grid gap-1 border-l border-zinc-200 p-4 first:border-l-0 dark:border-zinc-800"
          key={metric.title}
        >
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{metric.title}</span>
          <strong className="text-2xl font-semibold tracking-normal tabular-nums">
            {metric.value}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{metric.detail}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ action, title }: { action?: string; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      {action ? (
        <button
          className="rounded bg-transparent text-xs text-blue-600 hover:underline"
          type="button"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid content-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {children}
    </section>
  );
}

function DeckTable({ onSelectDeck }: { onSelectDeck: (deck: Deck) => void }) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-9 items-center gap-4 px-4 pb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span />
        <span className="col-span-2">Deck</span>
        <span>Due</span>
        <span>Learn</span>
        <span>New</span>
        <span>Ret.</span>
        <span>ETA</span>
        <span>Last</span>
      </div>
      {decks.map((deck) => (
        <button
          className="grid min-h-12 grid-cols-9 items-center gap-4 border-t border-zinc-200 px-4 py-2 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
          key={deck.id}
          onClick={() => onSelectDeck(deck)}
          type="button"
        >
          <DeckDot deck={deck} />
          <span className="col-span-2 grid min-w-0 gap-1">
            <strong className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
              {deck.name}
            </strong>
            <small className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-zinc-500 dark:text-zinc-400">
              {deck.path}
            </small>
          </span>
          <DeckValue emphasized={deck.due >= 80} value={deck.due.toLocaleString()} />
          <DeckValue emphasized={deck.learning >= 12} value={deck.learning.toLocaleString()} />
          <DeckValue value={deck.newCards.toLocaleString()} />
          <DeckValue emphasized={deck.retention < 90} value={`${deck.retention}%`} />
          <DeckValue value={estimateDeck(deck)} />
          <span className="text-right text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
            {deck.lastStudied}
          </span>
        </button>
      ))}
    </div>
  );
}

function DeckDot({ deck }: { deck: Deck }) {
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        deck.id === "japanese-core" && "bg-red-500",
        deck.id === "medicine" && "bg-emerald-600",
        deck.id === "art-history" && "bg-amber-500",
        deck.id === "hsk-3000-characters" && "bg-purple-600",
        deck.id === "leetcode-patterns" && "bg-cyan-600",
      )}
    />
  );
}

function DeckValue({ emphasized = false, value }: { emphasized?: boolean; value: string }) {
  return (
    <span
      className={cn(
        "text-right text-xs font-medium text-zinc-500 tabular-nums dark:text-zinc-400",
        emphasized && "font-bold text-zinc-950 dark:text-zinc-50",
      )}
    >
      {value}
    </span>
  );
}

function CardPreviewRow({ card }: { card: NoteCard }) {
  return (
    <div className="flex items-center gap-3 border-t border-zinc-200 py-2 first:border-t-0 dark:border-zinc-800">
      <span className="grid min-w-0 gap-1">
        <strong className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
          {card.front}
        </strong>
        <small className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-zinc-500 dark:text-zinc-400">
          {card.back}
        </small>
      </span>
      <time className="ml-auto text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
        {card.due}
      </time>
    </div>
  );
}

function RatingBar({ onRate }: { onRate: () => void }) {
  const ratings = [
    { title: "Again", time: "1m", keyName: "1" },
    { title: "Hard", time: "6m", keyName: "2" },
    { title: "Good", time: "2d", keyName: "3" },
    { title: "Easy", time: "5d", keyName: "4" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {ratings.map((rating) => (
        <button
          className={cn(
            "flex min-h-16 items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800",
            rating.title === "Again" && "text-red-600",
            rating.title === "Hard" && "text-amber-600",
            rating.title === "Good" && "text-emerald-600",
            rating.title === "Easy" && "text-blue-600",
          )}
          key={rating.title}
          onClick={onRate}
          type="button"
        >
          <span className="flex items-center gap-2 font-bold">
            {rating.title}
            <KeyCap>{rating.keyName}</KeyCap>
          </span>
          <time className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
            {rating.time}
          </time>
        </button>
      ))}
    </div>
  );
}

function ReviewShortcutBar({ answerShown }: { answerShown: boolean }) {
  return (
    <div className="flex w-full max-w-5xl items-center justify-between gap-4 self-end text-xs text-zinc-500 dark:text-zinc-400">
      <div className="flex items-center gap-2">
        <span>Japanese Core</span>
        <span>18 / 124</span>
      </div>
      <div className="flex items-center gap-2">
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
    <aside className="grid min-w-0 content-start gap-4 border-l border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-bold">Inspector</h2>
      {card ? (
        <>
          <div className="grid gap-2">
            <h3 className="text-2xl font-semibold">{card.front}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.back}</p>
            <div className="flex flex-wrap gap-1">
              {card.tags.map((tag) => (
                <span className="rounded bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-800" key={tag}>
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
          <button
            className="flex min-h-8 items-center justify-start gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            type="button"
          >
            <Icon name="code" />
            Edit Template
          </button>
          <button
            className="flex min-h-8 items-center justify-start gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            type="button"
          >
            <Icon name="image" />
            Open Media
          </button>
        </>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select a note to inspect scheduling, tags, templates, and media.
        </p>
      )}
    </aside>
  );
}

function SegmentedControl({ options, selected }: { options: string[]; selected: string }) {
  return (
    <div
      className="grid w-56 grid-cols-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800"
      role="tablist"
    >
      {options.map((option) => (
        <button
          aria-selected={option === selected}
          className={cn(
            "min-h-7 border-l border-zinc-300 text-xs text-zinc-500 first:border-l-0 dark:border-zinc-700 dark:text-zinc-400",
            option === selected &&
              "bg-white font-semibold text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50",
          )}
          key={option}
          role="tab"
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SourceChip({ icon, title }: { icon: IconName; title: string }) {
  return (
    <button
      className="flex min-h-9 items-center justify-start gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      type="button"
    >
      <Icon name={icon} />
      {title}
    </button>
  );
}

function BlueprintRow({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="grid gap-1 py-1">
      <strong>{title}</strong>
      <span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-zinc-500 dark:text-zinc-400">
        {detail}
      </span>
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
    <div className="grid grid-cols-6 items-center gap-3 py-1 text-sm">
      <Icon name={status === "complete" ? "check" : "deck"} />
      <strong className="col-span-2">{title}</strong>
      <progress max={1} value={progress} />
      <span className="text-right text-xs text-zinc-500 dark:text-zinc-400">{status}</span>
    </div>
  );
}

function ReviewDensityPanel() {
  return (
    <Panel>
      <SectionHeader title="Review Density" />
      <div className="mt-auto flex h-36 items-end gap-2">
        {events.map((event) => (
          <div className="grid flex-1 items-end justify-items-center gap-2" key={event.hour}>
            <span
              className={cn(
                "w-full max-w-10 rounded",
                event.reviews >= 50 && "h-16",
                event.reviews >= 35 && event.reviews < 50 && "h-12",
                event.reviews >= 25 && event.reviews < 35 && "h-10",
                event.reviews < 25 && "h-8",
                event.accuracy >= 93 && "bg-emerald-500",
                event.accuracy >= 88 && event.accuracy < 93 && "bg-cyan-500",
                event.accuracy < 88 && "bg-amber-500",
              )}
            />
            <small className="text-xs text-zinc-500 dark:text-zinc-400">{event.hour}</small>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PressureRow({ deck }: { deck: Deck }) {
  return (
    <div className="grid gap-2">
      <div className="flex justify-between gap-3 text-sm">
        <span>{deck.name}</span>
        <small className="text-zinc-500 dark:text-zinc-400">{deck.due} due</small>
      </div>
      <progress
        className={cn(
          deck.id === "japanese-core" && "accent-red-500",
          deck.id === "medicine" && "accent-emerald-600",
          deck.id === "art-history" && "accent-amber-500",
          deck.id === "hsk-3000-characters" && "accent-purple-600",
          deck.id === "leetcode-patterns" && "accent-cyan-600",
        )}
        max={120}
        value={Math.min(deck.due, 120)}
      />
    </div>
  );
}

function SyncLine({ detail, icon, title }: { detail: string; icon: IconName; title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <Icon name={icon} />
      <span className="grid min-w-0 flex-1 gap-1">
        <strong className="overflow-hidden text-ellipsis whitespace-nowrap">{title}</strong>
        <small className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-zinc-500 dark:text-zinc-400">
          {detail}
        </small>
      </span>
      <Icon className="text-emerald-600" name="check" />
    </div>
  );
}

function SettingLine({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">{title}</span>
      <strong className="text-right font-semibold">{value}</strong>
    </div>
  );
}

function KeyHint({ keyName, label }: { keyName: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <KeyCap>{keyName}</KeyCap>
      <span>{label}</span>
    </span>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-h-5 min-w-6 items-center justify-center rounded border border-zinc-300 bg-zinc-200 px-1 font-mono text-xs font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50">
      {children}
    </kbd>
  );
}

function Icon({ className = "", name }: { className?: string; name: IconName }) {
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
    <svg
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
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

function estimateDeck(deck: Deck) {
  return `${Math.max(3, Math.ceil((deck.due + deck.learning * 2 + deck.newCards) / 7.5))}m`;
}
