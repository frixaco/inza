import SwiftUI
import AppKit

@main
struct InzaReferenceApp: App {
    var body: some Scene {
        WindowGroup {
            AppShell()
                .frame(minWidth: 900, minHeight: 660)
                .background(WindowChromeConfigurator())
        }
        .windowStyle(.hiddenTitleBar)
        .windowResizability(.contentMinSize)
        .commands {
            CommandMenu("Review") {
                Button("Show Answer") {}
                    .keyboardShortcut(.space, modifiers: [])
                Button("Again") {}
                    .keyboardShortcut("1", modifiers: [])
                Button("Hard") {}
                    .keyboardShortcut("2", modifiers: [])
                Button("Good") {}
                    .keyboardShortcut("3", modifiers: [])
                Button("Easy") {}
                    .keyboardShortcut("4", modifiers: [])
            }
        }
    }
}

private struct WindowChromeConfigurator: NSViewRepresentable {
    func makeNSView(context: Context) -> NSView {
        let view = NSView()
        DispatchQueue.main.async {
            context.coordinator.start(for: view)
        }
        return view
    }

    func updateNSView(_ nsView: NSView, context: Context) {
        DispatchQueue.main.async {
            context.coordinator.start(for: nsView)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    @MainActor
    final class Coordinator {
        private weak var view: NSView?
        private var attempts = 0

        func start(for view: NSView) {
            self.view = view
            attempts = 0
            scrubRepeatedly()
        }

        private func scrubRepeatedly() {
            configure(window: view?.window)
            attempts += 1
            guard attempts < 20 else { return }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
                self?.scrubRepeatedly()
            }
        }
    }

    private static func configure(window: NSWindow?) {
        guard let window else { return }
        window.title = ""
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.toolbar?.showsBaselineSeparator = false
    }

    private func configure(window: NSWindow?) {
        Self.configure(window: window)
    }
}

private enum Route: Hashable {
    case today
    case study
    case browser
    case create
    case stats
    case sync
    case settings
    case deck(UUID)
}

private struct Deck: Identifiable, Hashable {
    let id = UUID()
    var name: String
    var path: String
    var due: Int
    var learning: Int
    var new: Int
    var total: Int
    var reviewed: Int
    var retention: Int
    var streak: Int
    var lastStudied: String
    var tint: Color
}

private struct NoteCard: Identifiable, Hashable {
    let id = UUID()
    var deck: String
    var front: String
    var back: String
    var due: String
    var interval: String
    var ease: String
    var tags: [String]
}

private struct ReviewEvent: Identifiable {
    let id = UUID()
    var hour: String
    var reviews: Int
    var accuracy: Int
}

private struct AppShell: View {
    @State private var selectedRoute: Route = .today
    @State private var selectedDeckID: Deck.ID?
    @State private var selectedCardID: NoteCard.ID?
    @State private var searchText = ""
    @State private var showingBack = false
    @State private var prompt = "Create a focused deck from my Renaissance notes. Preserve images, generate cloze cards for dates, and add tags for artist, period, medium, and location."

    private let decks = SampleData.decks
    private let cards = SampleData.cards
    private let events = SampleData.events

    var selectedDeck: Deck {
        if case let .deck(id) = selectedRoute, let deck = decks.first(where: { $0.id == id }) {
            return deck
        }
        return decks.first ?? SampleData.decks[0]
    }

    var body: some View {
        NavigationSplitView {
            sidebar
                .navigationSplitViewColumnWidth(min: 198, ideal: 218, max: 252)
        } detail: {
            detailContainer
        }
        .navigationTitle("")
    }

    @ViewBuilder
    private var detailContainer: some View {
        if selectedRoute == .study {
            detailView
                .background(Color(nsColor: .windowBackgroundColor))
                .toolbar(.visible, for: .windowToolbar)
                .toolbarBackground(.hidden, for: .windowToolbar)
        } else {
            detailView
                .background(Color(nsColor: .windowBackgroundColor))
                .toolbar(.visible, for: .windowToolbar)
                .toolbarBackground(.visible, for: .windowToolbar)
                .toolbar {
                    ToolbarItemGroup(placement: .primaryAction) {
                        Button {
                            selectedRoute = .create
                        } label: {
                            Label("Create Deck", systemImage: "sparkles")
                        }

                        Button {} label: {
                            Label("Sync", systemImage: "arrow.triangle.2.circlepath")
                        }
                    }
                }
                .searchable(text: $searchText, placement: .toolbar, prompt: "Decks, cards, tags")
        }
    }

    private var sidebar: some View {
        List(selection: $selectedRoute) {
            Section("Review") {
                SidebarItem(route: .today, title: "Today", symbol: "sun.max", count: 261)
                SidebarItem(route: .study, title: "Study Queue", symbol: "play.circle", count: 124)
                SidebarItem(route: .browser, title: "Browse", symbol: "rectangle.grid.1x2")
                SidebarItem(route: .create, title: "Create", symbol: "sparkles")
            }

            Section("Decks") {
                ForEach(decks) { deck in
                    NavigationLink(value: Route.deck(deck.id)) {
                        HStack(spacing: 9) {
                            Circle()
                                .fill(deck.tint)
                                .frame(width: 6, height: 6)
                            Text(deck.name)
                                .font(.callout)
                                .lineLimit(1)
                            Spacer()
                            if deck.due > 0 {
                                Text(deck.due.formatted())
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }

            Section("System") {
                SidebarItem(route: .stats, title: "Stats", symbol: "chart.xyaxis.line")
                SidebarItem(route: .sync, title: "Sync", symbol: "icloud")
                SidebarItem(route: .settings, title: "Settings", symbol: "gearshape")
            }
        }
        .listStyle(.sidebar)
        .scrollContentBackground(.hidden)
        .background(Color(nsColor: .underPageBackgroundColor))
        .environment(\.defaultMinListRowHeight, 28)
    }

    @ViewBuilder
    private var detailView: some View {
        switch selectedRoute {
        case .today:
            TodayView(decks: decks) { deck in
                selectedRoute = .deck(deck.id)
            }
        case .study:
            StudyView(showingBack: $showingBack)
        case .browser:
            BrowserView(cards: filteredCards, selectedCardID: $selectedCardID)
        case .create:
            CreateDeckView(prompt: $prompt)
        case .stats:
            StatsView(events: events, decks: decks)
        case .sync:
            SyncView()
        case .settings:
            SettingsView()
        case .deck:
            DeckDetailView(deck: selectedDeck, cards: cards.filter { $0.deck == selectedDeck.name })
        }
    }

    private var filteredCards: [NoteCard] {
        guard !searchText.isEmpty else { return cards }
        return cards.filter {
            $0.front.localizedCaseInsensitiveContains(searchText)
            || $0.back.localizedCaseInsensitiveContains(searchText)
            || $0.deck.localizedCaseInsensitiveContains(searchText)
            || $0.tags.joined(separator: " ").localizedCaseInsensitiveContains(searchText)
        }
    }
}

private struct SidebarItem: View {
    var route: Route
    var title: String
    var symbol: String
    var count: Int?

    init(route: Route, title: String, symbol: String, count: Int? = nil) {
        self.route = route
        self.title = title
        self.symbol = symbol
        self.count = count
    }

    var body: some View {
        NavigationLink(value: route) {
            Label {
                HStack {
                    Text(title)
                        .font(.callout)
                    Spacer()
                    if let count {
                        Text(count.formatted())
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            } icon: {
                Image(systemName: symbol)
                    .font(.callout)
            }
        }
    }
}

private struct TodayView: View {
    var decks: [Deck]
    var selectDeck: (Deck) -> Void

    var totalDue: Int { decks.reduce(0) { $0 + $1.due } }
    var totalLearning: Int { decks.reduce(0) { $0 + $1.learning } }
    var totalNew: Int { decks.reduce(0) { $0 + $1.new } }

    var body: some View {
        GeometryReader { proxy in
            let narrow = proxy.size.width < 780
            let compact = proxy.size.width < 900
            let padding: CGFloat = narrow ? 18 : 28

            ScrollView {
                VStack(alignment: .leading, spacing: narrow ? 18 : 22) {
                    TodayHeader()

                    TodayStatusLine(
                        due: totalDue,
                        learning: totalLearning,
                        newCards: totalNew,
                        retention: 92,
                        estimate: "38m",
                        fsrsTarget: 91
                    )

                    deckSection(compact: compact)

                    TodayFooterBar()
                }
                .padding(padding)
                .frame(maxWidth: .infinity, alignment: .topLeading)
            }
        }
    }

    private func deckSection(compact: Bool) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(title: "Decks", action: "Sort by pressure")
            DeckTable(decks: decks, compact: compact, selectDeck: selectDeck)
        }
    }
}

private struct DeckDetailView: View {
    var deck: Deck
    var cards: [NoteCard]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                HeaderBlock(title: deck.name, subtitle: deck.path, trailing: "\(deck.retention)% retention")

                MetricStrip(metrics: [
                    .init(title: "Due", value: "\(deck.due)", detail: "now"),
                    .init(title: "Learning", value: "\(deck.learning)", detail: "steps"),
                    .init(title: "New", value: "\(deck.new)", detail: "today"),
                    .init(title: "Cards", value: deck.total.formatted(), detail: "total"),
                    .init(title: "Streak", value: "\(deck.streak)d", detail: "deck")
                ])

                HStack(alignment: .top, spacing: 22) {
                    VStack(alignment: .leading, spacing: 12) {
                        SectionHeader(title: "Recent Notes", action: "Open Browser")
                        ForEach(cards.prefix(5)) { card in
                            CardPreviewRow(card: card)
                            Divider()
                        }
                    }
                    .panelStyle()

                    VStack(alignment: .leading, spacing: 18) {
                        SectionHeader(title: "Deck Options", action: "Edit")
                        SettingLine(title: "Scheduler", value: "FSRS compatible")
                        SettingLine(title: "Daily limit", value: "120 reviews")
                        SettingLine(title: "New cards", value: "\(deck.new) per day")
                        SettingLine(title: "Import source", value: "Anki package")
                    }
                    .frame(width: 310)
                    .panelStyle()
                }
            }
            .padding(28)
        }
    }
}

private struct StudyView: View {
    @Binding var showingBack: Bool

    var body: some View {
        GeometryReader { proxy in
            let compact = proxy.size.width < 760
            let short = proxy.size.height < 620
            let horizontalPadding: CGFloat = compact ? 20 : 40
            let kanjiSize = min(compact ? 72 : 96, max(56, proxy.size.width * 0.105))
            let answerWidth = min(compact ? 320 : 460, max(210, proxy.size.width * 0.36))

            VStack(spacing: 0) {
                VStack(spacing: short ? 16 : (compact ? 22 : 28)) {
                    Spacer(minLength: short ? 12 : (compact ? 28 : 42))

                    VStack(spacing: compact ? 12 : 18) {
                        Text("静か")
                            .font(.system(size: kanjiSize, weight: .regular, design: .serif))
                            .minimumScaleFactor(0.58)
                            .lineLimit(1)

                        Text("adjective · common · audio attached")
                            .font(.callout)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                            .minimumScaleFactor(0.84)
                    }

                    if showingBack {
                        VStack(spacing: short ? 5 : 9) {
                            Text("Quiet, peaceful")
                                .font((short ? Font.title3 : Font.title2).weight(.medium))
                                .lineLimit(1)
                            Text("shizuka")
                                .font(short ? .callout : .title3)
                                .foregroundStyle(.secondary)
                                .lineLimit(1)
                            Text("The room became quiet after the lecture ended.")
                                .font(.callout)
                                .foregroundStyle(.secondary)
                                .multilineTextAlignment(.center)
                                .lineLimit(short ? 1 : 2)
                        }
                        .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }

                    Spacer(minLength: short ? 10 : (compact ? 16 : 26))

                    if showingBack {
                        RatingBar(compact: compact)
                            .transition(.opacity)
                    } else {
                        Button {
                            withAnimation(.snappy(duration: 0.18)) {
                                showingBack = true
                            }
                        } label: {
                            Label("Show Answer", systemImage: "space")
                                .font(.headline)
                                .frame(width: answerWidth)
                        }
                        .buttonStyle(.borderedProminent)
                        .controlSize(.large)
                        .keyboardShortcut(.space, modifiers: [])
                    }

                    ReviewShortcutBar(answerShown: showingBack, compact: compact)
                        .padding(.bottom, short ? 12 : (compact ? 18 : 28))
                }
                .padding(.horizontal, horizontalPadding)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }
}

private struct RatingBar: View {
    var compact: Bool

    var body: some View {
        if compact {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 118), spacing: 10)], spacing: 10) {
                ratingButtons
            }
            .frame(maxWidth: 620)
        } else {
            HStack(spacing: 10) {
                ratingButtons
            }
            .frame(maxWidth: 980)
        }
    }

    @ViewBuilder
    private var ratingButtons: some View {
        RatingButton(title: "Again", time: "1m", key: "1", tint: .red, compact: compact)
        RatingButton(title: "Hard", time: "6m", key: "2", tint: .orange, compact: compact)
        RatingButton(title: "Good", time: "2d", key: "3", tint: .green, compact: compact)
        RatingButton(title: "Easy", time: "5d", key: "4", tint: .blue, compact: compact)
    }
}

private struct ReviewShortcutBar: View {
    var answerShown: Bool
    var compact = false

    var body: some View {
        Group {
            if compact {
                VStack(spacing: 8) {
                    reviewProgress
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 82), spacing: 10)], spacing: 8) {
                        shortcutHints
                    }
                    .frame(maxWidth: 520)
                }
            } else {
                HStack(spacing: 16) {
                    reviewProgress
                    Spacer(minLength: 8)
                    shortcutHints
                }
            }
        }
        .font(.caption)
    }

    private var reviewProgress: some View {
        HStack(spacing: 14) {
            Text("Japanese Core")
                .font(.caption.weight(.medium))
                .foregroundStyle(.tertiary)
                .lineLimit(1)
            Text("18 / 124")
                .foregroundStyle(.tertiary)
                .monospacedDigit()
                .lineLimit(1)
        }
    }

    @ViewBuilder
    private var shortcutHints: some View {
        KeyHint(key: "Space", label: answerShown ? "Next" : "Answer")
        KeyHint(key: "E", label: "Edit")
        KeyHint(key: "B", label: "Browse")
        KeyHint(key: "S", label: "Suspend")
        KeyHint(key: "F", label: "Flag")
    }
}

private struct BrowserView: View {
    var cards: [NoteCard]
    @Binding var selectedCardID: NoteCard.ID?

    var selectedCard: NoteCard? {
        guard let selectedCardID else { return cards.first }
        return cards.first(where: { $0.id == selectedCardID }) ?? cards.first
    }

    var body: some View {
        HStack(spacing: 0) {
            VStack(spacing: 0) {
                HStack {
                    Text("\(cards.count) notes")
                        .font(.headline)
                    Spacer()
                    Picker("Filter", selection: .constant("Due")) {
                        Text("Due").tag("Due")
                        Text("New").tag("New")
                        Text("Marked").tag("Marked")
                    }
                    .pickerStyle(.segmented)
                    .frame(width: 220)
                }
                .padding(18)

                Table(cards, selection: $selectedCardID) {
                    TableColumn("Front") { card in
                        Text(card.front)
                            .font(.body)
                    }
                    TableColumn("Back") { card in
                        Text(card.back)
                            .foregroundStyle(.secondary)
                    }
                    TableColumn("Deck") { card in
                        Text(card.deck)
                    }
                    TableColumn("Due") { card in
                        Text(card.due)
                            .monospacedDigit()
                    }
                    TableColumn("Ease") { card in
                        Text(card.ease)
                            .monospacedDigit()
                    }
                }
            }

            Divider()

            NoteInspector(card: selectedCard)
                .frame(width: 326)
                .background(.ultraThinMaterial)
        }
    }
}

private struct CreateDeckView: View {
    @Binding var prompt: String

    var body: some View {
        GeometryReader { proxy in
            let narrow = proxy.size.width < 860
            let padding: CGFloat = proxy.size.width < 720 ? 18 : 28

            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    HeaderBlock(
                        title: "Create",
                        subtitle: "Turn notes, PDFs, media, or a prompt into an Anki-compatible deck.",
                        trailing: "Skill-ready"
                    )

                    if narrow {
                        VStack(alignment: .leading, spacing: 18) {
                            promptPanel
                            blueprintPanel
                        }
                    } else {
                        HStack(alignment: .top, spacing: 22) {
                            promptPanel
                                .frame(minWidth: 0, maxWidth: .infinity, alignment: .topLeading)

                            blueprintPanel
                                .frame(width: min(390, max(320, proxy.size.width * 0.34)))
                        }
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        SectionHeader(title: "Generation Queue", action: "Reveal Logs")
                        GenerationStep(title: "Parse sources", status: "complete", progress: 1.0)
                        GenerationStep(title: "Draft cards", status: "ready", progress: 0.72)
                        GenerationStep(title: "Validate templates", status: "waiting", progress: 0.18)
                        GenerationStep(title: "Package media", status: "waiting", progress: 0.06)
                    }
                    .panelStyle()
                }
                .padding(padding)
                .frame(maxWidth: .infinity, alignment: .topLeading)
            }
        }
    }

    private var promptPanel: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Prompt", action: "Run")
            TextEditor(text: $prompt)
                .font(.body)
                .scrollContentBackground(.hidden)
                .frame(minHeight: 178)
                .padding(12)
                .background(.quaternary.opacity(0.35), in: RoundedRectangle(cornerRadius: 10, style: .continuous))

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 112), spacing: 8)], alignment: .leading, spacing: 8) {
                SourceChip(title: "Notes.md", symbol: "doc.text")
                SourceChip(title: "Images", symbol: "photo.stack")
                SourceChip(title: "Existing APKG", symbol: "archivebox")
            }
        }
        .panelStyle()
    }

    private var blueprintPanel: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Deck Blueprint", action: "Adjust")
            BlueprintRow(title: "Note types", detail: "Basic, Cloze, Image Occlusion")
            BlueprintRow(title: "Compatibility", detail: "Exports .apkg with media")
            BlueprintRow(title: "Scheduler", detail: "Preserve review history if present")
            BlueprintRow(title: "Automation", detail: "Expose SKILL.md and MCP command")
        }
        .panelStyle()
    }
}

private struct StatsView: View {
    var events: [ReviewEvent]
    var decks: [Deck]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                HeaderBlock(title: "Stats", subtitle: "Scheduler health without visual noise.", trailing: "Last 30 days")

                MetricStrip(metrics: [
                    .init(title: "Reviews", value: "4,812", detail: "30-day"),
                    .init(title: "Accuracy", value: "92%", detail: "mature"),
                    .init(title: "Burden", value: "38m", detail: "daily avg"),
                    .init(title: "Overdue", value: "17", detail: "cards"),
                    .init(title: "Mature", value: "68%", detail: "collection")
                ])

                HStack(alignment: .top, spacing: 22) {
                    ReviewDensityPanel(events: events)
                        .frame(maxWidth: .infinity)

                    VStack(alignment: .leading, spacing: 14) {
                        SectionHeader(title: "Deck Pressure", action: "Tune")
                        ForEach(decks) { deck in
                            PressureRow(deck: deck)
                        }
                    }
                    .frame(width: 360)
                    .panelStyle()
                }
            }
            .padding(28)
        }
    }
}

private struct SyncView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HeaderBlock(title: "Sync", subtitle: "Local-first review data with explicit conflict visibility.", trailing: "Connected")
            VStack(alignment: .leading, spacing: 16) {
                SyncLine(title: "MacBook Pro", detail: "Current device · 38 seconds ago", symbol: "macbook")
                SyncLine(title: "iPhone", detail: "Review log merged · 7 minutes ago", symbol: "iphone")
                SyncLine(title: "iPad", detail: "Media download pending · 2 hours ago", symbol: "ipad")
                SyncLine(title: "Anki export", detail: "Last .apkg snapshot saved yesterday", symbol: "archivebox")
            }
            .panelStyle()
            Spacer()
        }
        .padding(28)
    }
}

private struct SettingsView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                HeaderBlock(title: "Settings", subtitle: "Defaults for fast review and trustworthy compatibility.", trailing: "Profile: Daily")

                VStack(alignment: .leading, spacing: 18) {
                    SectionHeader(title: "Review", action: nil)
                    SettingLine(title: "Scheduler", value: "FSRS-compatible")
                    SettingLine(title: "Answer keys", value: "1 Again, 2 Hard, 3 Good, 4 Easy")
                    SettingLine(title: "Autoplay audio", value: "Front and back")
                    SettingLine(title: "Bury siblings", value: "Enabled")
                }
                .panelStyle()

                VStack(alignment: .leading, spacing: 18) {
                    SectionHeader(title: "Compatibility", action: nil)
                    SettingLine(title: "Import", value: ".apkg, .colpkg, media folders")
                    SettingLine(title: "Export", value: "Anki 2.1 package")
                    SettingLine(title: "Templates", value: "Preserve HTML and CSS")
                    SettingLine(title: "History", value: "Keep review logs when available")
                }
                .panelStyle()
            }
            .padding(28)
        }
    }
}

private struct TodayHeader: View {
    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .firstTextBaseline, spacing: 18) {
                titleBlock
                Spacer(minLength: 16)
                Button {
                } label: {
                    Label("Start Review", systemImage: "play.fill")
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .keyboardShortcut(.space, modifiers: [])
            }

            VStack(alignment: .leading, spacing: 12) {
                titleBlock
                Button {
                } label: {
                    Label("Start Review", systemImage: "play.fill")
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .keyboardShortcut(.space, modifiers: [])
            }
        }
    }

    private var titleBlock: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Today")
                .font(.largeTitle.weight(.semibold))
                .lineLimit(1)
            Text("124 reviews queued. Current load is heavy but recoverable before 22:00.")
                .font(.callout)
                .foregroundStyle(.secondary)
                .lineLimit(2)
        }
    }
}

private struct TodayStatusLine: View {
    var due: Int
    var learning: Int
    var newCards: Int
    var retention: Int
    var estimate: String
    var fsrsTarget: Int

    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(spacing: 0) {
                statusText
                Spacer(minLength: 16)
                Text("FSRS \(fsrsTarget)%")
                    .font(.caption.weight(.medium))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(.quaternary.opacity(0.55), in: Capsule())
            }

            VStack(alignment: .leading, spacing: 8) {
                statusText
                Text("FSRS \(fsrsTarget)%")
                    .font(.caption.weight(.medium))
                    .foregroundStyle(.secondary)
            }
        }
        .font(.callout)
        .padding(.horizontal, 12)
        .padding(.vertical, 9)
        .background(Color(nsColor: .controlBackgroundColor), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 8, style: .continuous)
                .stroke(Color(nsColor: .separatorColor).opacity(0.36), lineWidth: 1)
        }
    }

    private var statusText: some View {
        Text("\(due) due · \(learning) learning · \(newCards) new · \(retention)% retention · \(estimate) estimate")
            .foregroundStyle(.secondary)
            .lineLimit(1)
            .minimumScaleFactor(0.86)
    }
}

private struct TodayFooterBar: View {
    var body: some View {
        HStack(spacing: 16) {
            Label("Synced 38s ago", systemImage: "checkmark.icloud")
            Spacer()
            KeyHint(key: "⌘K", label: "Commands")
            KeyHint(key: "Space", label: "Review")
            KeyHint(key: "/", label: "Search")
        }
        .font(.caption)
        .foregroundStyle(.secondary)
        .padding(.top, 4)
    }
}

private struct HeaderBlock: View {
    var title: String
    var subtitle: String
    var trailing: String

    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .firstTextBaseline, spacing: 16) {
                titleBlock
                Spacer(minLength: 16)
                trailingBadge
            }

            VStack(alignment: .leading, spacing: 10) {
                titleBlock
                trailingBadge
            }
        }
    }

    private var titleBlock: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.largeTitle.weight(.semibold))
                .lineLimit(1)
                .minimumScaleFactor(0.82)
            Text(subtitle)
                .font(.callout)
                .foregroundStyle(.secondary)
                .lineLimit(2)
        }
    }

    private var trailingBadge: some View {
        Text(trailing)
            .font(.callout.weight(.medium))
            .foregroundStyle(.secondary)
            .lineLimit(1)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(.quaternary.opacity(0.55), in: Capsule())
    }
}

private struct Metric: Identifiable {
    let id = UUID()
    var title: String
    var value: String
    var detail: String
}

private struct MetricStrip: View {
    var compact = false
    var metrics: [Metric]

    var body: some View {
        Group {
            if compact {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 130), spacing: 0)], spacing: 0) {
                    ForEach(metrics) { metric in
                        MetricCell(metric: metric)
                    }
                }
            } else {
                Grid(horizontalSpacing: 0, verticalSpacing: 0) {
                    GridRow {
                        ForEach(metrics) { metric in
                            MetricCell(metric: metric)
                                .overlay(alignment: .trailing) {
                                    if metric.id != metrics.last?.id {
                                        Rectangle()
                                            .fill(Color(nsColor: .separatorColor).opacity(0.55))
                                            .frame(width: 1)
                                            .padding(.vertical, 14)
                                    }
                                }
                        }
                    }
                }
            }
        }
        .background(Color(nsColor: .controlBackgroundColor), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .stroke(Color(nsColor: .separatorColor).opacity(0.42), lineWidth: 1)
        }
    }
}

private struct MetricCell: View {
    var metric: Metric

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(metric.title)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            Text(metric.value)
                .font(.title2.weight(.semibold))
                .monospacedDigit()
                .lineLimit(1)
                .minimumScaleFactor(0.82)
            Text(metric.detail)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
    }
}

private struct SectionHeader: View {
    var title: String
    var action: String?

    var body: some View {
        HStack {
            Text(title)
                .font(.headline.weight(.semibold))
            Spacer()
            if let action {
                Button(action) {}
                    .buttonStyle(.link)
                    .font(.callout)
            }
        }
    }
}

private struct DeckTable: View {
    var decks: [Deck]
    var compact = false
    var selectDeck: (Deck) -> Void

    private var iconSize: CGFloat { 8 }
    private var titleMinWidth: CGFloat { compact ? 160 : 230 }
    private var statSpacing: CGFloat { compact ? 12 : 18 }

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Color.clear
                    .frame(width: iconSize, height: 1)

                Text("Deck")
                    .frame(minWidth: titleMinWidth, maxWidth: .infinity, alignment: .leading)

                HStack(spacing: statSpacing) {
                    DeckColumnHeader("Due")
                    DeckColumnHeader("Learn")
                    DeckColumnHeader("New")
                    if !compact {
                        DeckColumnHeader("Ret.")
                        DeckColumnHeader("ETA")
                    }
                }

                if !compact {
                    Text("Last")
                        .frame(width: 62, alignment: .trailing)
                }
            }
            .font(.caption.weight(.medium))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 14)
            .padding(.bottom, 7)

            Divider()

            ForEach(decks) { deck in
                DeckRow(deck: deck, compact: compact)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectDeck(deck)
                }
                if deck.id != decks.last?.id {
                    Divider()
                        .padding(.leading, 14 + iconSize + 12)
                }
            }
        }
    }
}

private struct DeckColumnHeader: View {
    var title: String

    init(_ title: String) {
        self.title = title
    }

    var body: some View {
        Text(title)
            .frame(width: 46, alignment: .trailing)
    }
}

private struct DeckRow: View {
    var deck: Deck
    var compact = false

    private var eta: String {
        let minutes = max(3, Int(ceil(Double(deck.due + deck.learning * 2 + deck.new) / 7.5)))
        return "\(minutes)m"
    }

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 3) {
                Text(deck.name)
                    .font(.callout.weight(.medium))
                    .lineLimit(1)
                    .truncationMode(.tail)
                Text(deck.path)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                    .truncationMode(.middle)
            }
            .frame(minWidth: compact ? 150 : 210, maxWidth: .infinity, alignment: .leading)
            .layoutPriority(1)

            HStack(spacing: compact ? 10 : 18) {
                DeckValue(text: deck.due.formatted(), emphasized: deck.due >= 80)
                DeckValue(text: deck.learning.formatted(), emphasized: deck.learning >= 12)
                DeckValue(text: deck.new.formatted())
                if !compact {
                    DeckValue(text: "\(deck.retention)%", emphasized: deck.retention < 90)
                    DeckValue(text: eta)
                }
            }

            if !compact {
                Text(deck.lastStudied)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                    .frame(width: 62, alignment: .trailing)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 9)
        .background(.background.opacity(0.001))
    }

    private var statusColor: Color {
        if deck.due >= 80 { return .orange }
        if deck.retention < 90 { return .yellow }
        return deck.tint.opacity(0.9)
    }
}

private struct DeckValue: View {
    var text: String
    var emphasized = false

    var body: some View {
        Text(text)
            .font(.callout.weight(emphasized ? .semibold : .medium))
            .foregroundStyle(emphasized ? .primary : .secondary)
            .monospacedDigit()
            .lineLimit(1)
            .frame(width: 46, alignment: .trailing)
    }
}

private struct NextCardPanel: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 13) {
            SectionHeader(title: "Next Card", action: "Study")
            Text("静か")
                .font(.system(size: 42, weight: .regular, design: .serif))
            Text("Japanese Core · due now · last failed 2 days ago")
                .font(.callout)
                .foregroundStyle(.secondary)
                .lineLimit(2)
            Spacer(minLength: 8)
            Divider()
            HStack {
                KeyHint(key: "Space", label: "Start")
                Spacer()
                KeyHint(key: "3", label: "Good")
            }
        }
        .frame(maxWidth: .infinity, minHeight: 220, alignment: .topLeading)
        .panelStyle()
    }
}

private struct CommandPanel: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "Commands", action: nil)
            Spacer(minLength: 0)
            CommandRow(key: "N", title: "New AI deck")
            CommandRow(key: "B", title: "Browse current deck")
            CommandRow(key: "R", title: "Rebuild scheduler cache")
            CommandRow(key: "/", title: "Search collection")
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, minHeight: 220, alignment: .topLeading)
        .panelStyle()
    }
}

private struct ReviewDensityPanel: View {
    var events: [ReviewEvent]

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Review Density", action: nil)
            Spacer(minLength: 0)
            HStack(alignment: .bottom, spacing: 7) {
                ForEach(events) { event in
                    VStack(spacing: 6) {
                        RoundedRectangle(cornerRadius: 4, style: .continuous)
                            .fill(barColor(for: event.accuracy))
                            .frame(height: CGFloat(event.reviews) * 1.1)
                        Text(event.hour)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            .frame(height: 136)
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, minHeight: 220, alignment: .topLeading)
        .panelStyle()
    }

    private func barColor(for accuracy: Int) -> Color {
        if accuracy >= 93 { return .green.opacity(0.72) }
        if accuracy >= 88 { return .teal.opacity(0.72) }
        return .orange.opacity(0.72)
    }
}

private struct RatingButton: View {
    var title: String
    var time: String
    var key: String
    var tint: Color
    var compact = false

    var body: some View {
        Button {} label: {
            ViewThatFits(in: .horizontal) {
                HStack(spacing: 8) {
                    Text(title)
                        .font(.headline.weight(.semibold))
                    KeyCap(key)
                    Spacer(minLength: 8)
                    Text(time)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .monospacedDigit()
                }

                VStack(spacing: 3) {
                    HStack(spacing: 6) {
                        Text(title)
                            .font(.headline.weight(.semibold))
                        KeyCap(key)
                    }
                    Text(time)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .monospacedDigit()
                }
            }
            .frame(maxWidth: .infinity, minHeight: compact ? 54 : 62)
            .padding(.horizontal, compact ? 10 : 14)
        }
        .buttonStyle(.bordered)
        .tint(tint)
        .keyboardShortcut(KeyEquivalent(Character(key)), modifiers: [])
    }
}

private struct BrowserTag: View {
    var title: String

    var body: some View {
        Text(title)
            .font(.caption)
            .padding(.horizontal, 7)
            .padding(.vertical, 3)
            .background(.quaternary.opacity(0.65), in: RoundedRectangle(cornerRadius: 5, style: .continuous))
    }
}

private struct NoteInspector: View {
    var card: NoteCard?

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Inspector")
                .font(.headline)

            if let card {
                VStack(alignment: .leading, spacing: 8) {
                    Text(card.front)
                        .font(.title2.weight(.medium))
                    Text(card.back)
                        .font(.body)
                        .foregroundStyle(.secondary)
                    HStack {
                        ForEach(card.tags, id: \.self) { tag in
                            BrowserTag(title: tag)
                        }
                    }
                }

                Divider()

                SettingLine(title: "Deck", value: card.deck)
                SettingLine(title: "Due", value: card.due)
                SettingLine(title: "Interval", value: card.interval)
                SettingLine(title: "Ease", value: card.ease)

                Divider()

                Button {
                } label: {
                    Label("Edit Template", systemImage: "curlybraces")
                }
                Button {
                } label: {
                    Label("Open Media", systemImage: "photo")
                }
            } else {
                Text("Select a note to inspect scheduling, tags, templates, and media.")
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .padding(20)
    }
}

private struct CardPreviewRow: View {
    var card: NoteCard

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(card.front)
                    .font(.body.weight(.medium))
                Text(card.back)
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            Spacer()
            Text(card.due)
                .font(.caption)
                .foregroundStyle(.secondary)
                .monospacedDigit()
        }
        .padding(.vertical, 4)
    }
}

private struct SourceChip: View {
    var title: String
    var symbol: String

    var body: some View {
        Label(title, systemImage: symbol)
            .font(.callout)
            .lineLimit(1)
            .minimumScaleFactor(0.86)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 10)
            .padding(.vertical, 7)
            .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

private struct BlueprintRow: View {
    var title: String
    var detail: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.callout.weight(.semibold))
            Text(detail)
                .font(.callout)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 5)
    }
}

private struct GenerationStep: View {
    var title: String
    var status: String
    var progress: Double

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: status == "complete" ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(status == "complete" ? .green : .secondary)
            Text(title)
                .font(.callout.weight(.medium))
                .lineLimit(1)
                .layoutPriority(1)
            Spacer()
            ProgressView(value: progress)
                .frame(minWidth: 90, idealWidth: 180, maxWidth: 220)
            Text(status)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .frame(width: 64, alignment: .trailing)
        }
        .padding(.vertical, 6)
    }
}

private struct PressureRow: View {
    var deck: Deck

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            HStack {
                Text(deck.name)
                    .font(.callout.weight(.medium))
                Spacer()
                Text("\(deck.due) due")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            ProgressView(value: min(Double(deck.due) / 120, 1))
                .tint(deck.tint)
        }
    }
}

private struct SyncLine: View {
    var title: String
    var detail: String
    var symbol: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: symbol)
                .font(.title3)
                .frame(width: 28)
                .foregroundStyle(.secondary)
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.body.weight(.medium))
                Text(detail)
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(.green)
        }
        .padding(.vertical, 6)
    }
}

private struct SettingLine: View {
    var title: String
    var value: String

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
                .multilineTextAlignment(.trailing)
        }
        .font(.callout)
    }
}

private struct CommandRow: View {
    var key: String
    var title: String

    var body: some View {
        HStack {
            KeyCap(key)
            Text(title)
                .font(.callout)
            Spacer()
        }
    }
}

private struct KeyHint: View {
    var key: String
    var label: String

    var body: some View {
        HStack(spacing: 6) {
            KeyCap(key)
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}

private struct KeyCap: View {
    var key: String

    init(_ key: String) {
        self.key = key
    }

    var body: some View {
        Text(key)
            .font(.caption.weight(.semibold))
            .monospaced()
            .padding(.horizontal, 6)
            .padding(.vertical, 3)
            .background(.quaternary.opacity(0.75), in: RoundedRectangle(cornerRadius: 5, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 5, style: .continuous)
                    .stroke(.separator.opacity(0.45), lineWidth: 1)
            }
    }
}

private extension View {
    func panelStyle() -> some View {
        self
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(nsColor: .controlBackgroundColor), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .stroke(Color(nsColor: .separatorColor).opacity(0.42), lineWidth: 1)
            }
    }
}

private enum SampleData {
    static let decks: [Deck] = [
        Deck(name: "Japanese Core", path: "Languages / Kaishi 1.5k", due: 64, learning: 8, new: 12, total: 1523, reviewed: 34, retention: 94, streak: 42, lastStudied: "2m ago", tint: .red),
        Deck(name: "Medicine", path: "School / Pathoma + Sketchy", due: 47, learning: 11, new: 0, total: 4200, reviewed: 89, retention: 91, streak: 106, lastStudied: "1h ago", tint: .green),
        Deck(name: "Art History", path: "Great Works of Art", due: 39, learning: 5, new: 6, total: 890, reviewed: 12, retention: 88, streak: 18, lastStudied: "3h ago", tint: .orange),
        Deck(name: "HSK 3000 Characters", path: "Chinese / Writing", due: 88, learning: 16, new: 18, total: 3000, reviewed: 56, retention: 87, streak: 25, lastStudied: "5h ago", tint: .purple),
        Deck(name: "LeetCode Patterns", path: "Programming / Algorithms", due: 23, learning: 3, new: 4, total: 150, reviewed: 8, retention: 96, streak: 9, lastStudied: "1d ago", tint: .cyan)
    ]

    static let cards: [NoteCard] = [
        NoteCard(deck: "Japanese Core", front: "静か", back: "Quiet, peaceful", due: "2d", interval: "4d", ease: "250%", tags: ["adjective", "common"]),
        NoteCard(deck: "Japanese Core", front: "美しい", back: "Beautiful, lovely", due: "1d", interval: "3d", ease: "230%", tags: ["adjective"]),
        NoteCard(deck: "Japanese Core", front: "大きい", back: "Big, large", due: "4h", interval: "1d", ease: "210%", tags: ["adjective", "size"]),
        NoteCard(deck: "Medicine", front: "Mechanism of penicillin", back: "Inhibits bacterial cell wall synthesis by binding PBPs.", due: "3d", interval: "7d", ease: "265%", tags: ["antibiotics", "microbiology"]),
        NoteCard(deck: "Medicine", front: "Celiac histology", back: "Villous atrophy, crypt hyperplasia, intraepithelial lymphocytes.", due: "5d", interval: "14d", ease: "280%", tags: ["pathology", "GI"]),
        NoteCard(deck: "Art History", front: "The Starry Night", back: "Vincent van Gogh, 1889, post-impressionist oil on canvas.", due: "1d", interval: "5d", ease: "250%", tags: ["painting", "post-impressionism"]),
        NoteCard(deck: "Art History", front: "The Birth of Venus", back: "Sandro Botticelli, c. 1485, tempera on canvas.", due: "6h", interval: "3d", ease: "235%", tags: ["painting", "renaissance"]),
        NoteCard(deck: "HSK 3000 Characters", front: "安", back: "peaceful, safe; roof radical over woman.", due: "now", interval: "learning", ease: "190%", tags: ["character", "radical"]),
        NoteCard(deck: "LeetCode Patterns", front: "Sliding window invariant", back: "Maintain a contiguous range while updating counts incrementally.", due: "2d", interval: "9d", ease: "255%", tags: ["arrays", "patterns"])
    ]

    static let events: [ReviewEvent] = [
        ReviewEvent(hour: "7", reviews: 28, accuracy: 95),
        ReviewEvent(hour: "8", reviews: 42, accuracy: 93),
        ReviewEvent(hour: "9", reviews: 18, accuracy: 88),
        ReviewEvent(hour: "12", reviews: 24, accuracy: 91),
        ReviewEvent(hour: "15", reviews: 36, accuracy: 94),
        ReviewEvent(hour: "18", reviews: 52, accuracy: 89),
        ReviewEvent(hour: "21", reviews: 31, accuracy: 92)
    ]
}
