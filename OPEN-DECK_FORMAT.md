# Open Deck Format

Open Deck is a plain-text flashcard deck format. A person can write a deck by
hand in a text editor, and an AI agent can generate one reliably. This document
is the only Open Deck specification. It has no reduced or extended profile.

The core rule:

> Deck files describe learning content. The app owns rendering.

A deck contains content, media, and stable identifiers. It never contains
templates, CSS, JavaScript, layout settings, or scheduling state.

Sections 1–10 define the format. Section 11 defines how Inza reads and updates
decks. Section 12 lists what the format deliberately leaves out.

## 1. Package

A deck is a directory:

```text
my-deck/
  deck.yaml
  notes/
    basics.yaml
    chapter-02.yaml
  assets/
    images/
    audio/
    video/
```

The same directory may be packed as a ZIP file. The archive must contain
`deck.yaml` at its root or exactly one top-level directory that contains it. A
ZIP is only a container; its contents follow the same rules.

- `deck.yaml` is required.
- `notes/` holds one or more `.yaml` files, in any subdirectory layout. A reader
  loads them in lexical order of their paths (compared by Unicode code point),
  then loads notes in file order. File names and file boundaries carry no
  meaning; moving a note to another file changes nothing.
- `assets/` holds every image, audio, and video file the notes reference. It
  may be omitted when no note references an asset.

### YAML rules

Files use YAML 1.2 with plain, JSON-compatible values. Comments are allowed.

- Duplicate mapping keys, anchors, aliases, merge keys (`<<`), and custom tags
  are invalid.
- Values are never coerced. A content field written as `19` is a number and is
  invalid; write `"19"`.
- Omit an optional field instead of writing `null`. Empty strings are invalid;
  an empty list (such as `media: []`) is valid.
- Every object rejects fields that this document does not define, at every
  depth. A typo is an error, never silently ignored.

Authoring tips:

- Quote a string that contains `: `, starts with `{`, `[`, `&`, `*`, `!`, `|`,
  `>`, `'`, `"`, `%`, `@`, or a backtick, or could be read as a number or
  boolean.
- Use a block scalar (`|`) for multi-line HTML.

## 2. `deck.yaml`

```yaml
format: open-deck
id: kaishi
title: Kaishi 1.5k
description: Japanese vocabulary with example sentences.
language: en
license: CC BY-SA 4.0
```

| Field | Required | Value |
|---|---|---|
| `format` | yes | The string `open-deck` |
| `id` | yes | [ID](#5-identifiers). Identifies the deck. |
| `title` | yes | Text |
| `description` | no | Text |
| `language` | no | [Language tag](#language) for the deck's content |
| `license` | no | Text identifying the deck's license |

Text is a plain string with at least one non-whitespace character. It is shown
literally and is never parsed as HTML.

## 3. Note files

A note file has exactly one field:

```yaml
notes:
  - id: oxygen
    type: prompt_response
    prompt: What is the chemical symbol for oxygen?
    answer: O
```

`notes` is a list of notes. An empty list (`notes: []`) is valid. Note files
have no file-level defaults.

### Fields shared by every note

| Field | Required | Value |
|---|---|---|
| `id` | yes | [ID](#5-identifiers), unique within the deck |
| `type` | yes | `prompt_response`, `cloze`, or `occlusion` |
| `tags` | no | List of tags |
| `language` | no | Language tag for this note's content |
| `media` | no | List of [media](#7-media) not linked to any content |

A tag is a non-empty string without whitespace. Tags in one note must be
unique. Tags organize and filter notes; they never change rendering or which
cards a note produces.

Each note type adds its own fields, defined in [section 8](#8-note-types).

## 4. Content

Every learner-facing field (`prompt`, `answer`, `reverse`, `text`, `extra`,
occlusion `prompt`, and mask `answer`) holds **content**. Content is either an
HTML string or a list of **parts**.

A string is the short form. Plain text is valid HTML:

```yaml
prompt: What is ownership?
answer: Each value has one owner.
```

Use a list of parts when pieces of content need their own label, language, or
media:

```yaml
answer:
  - label: Meaning
    html: I (polite, general)
  - label: Example
    html: <mark>私</mark>はアンです。
    language: ja
    media:
      - kind: audio
        src: assets/audio/watashi-sentence.mp3
```

A string is equivalent to a list with one part: `prompt: X` means
`prompt: [{html: X}]`.

### Part fields

| Field | Required | Value |
|---|---|---|
| `html` | see below | [Safe HTML](#6-safe-html) |
| `label` | no | Text shown as a small heading for the part |
| `language` | no | Language tag for this part |
| `media` | see below | List of media linked to this part |

A part must have `html`, a non-empty `media` list, or both. A part with only a
label is invalid. A content list must contain at least one part.

Parts render in list order. Labels are presentation only: they never decide
where media goes, what is hidden, or how a card behaves. Renaming every label in
a deck changes nothing except the visible headings.

### Language

A language tag is a BCP 47 tag such as `en`, `ja`, or `pt-BR`. Content language
is inherited from the nearest of: the part's `language`, the note's `language`,
the manifest's `language`. A `lang` attribute inside HTML overrides it for that
element. Readers use the language for fonts, line breaking, and text-to-speech.

## 5. Identifiers

An ID is a non-empty string with no whitespace, control characters, `:`, `{`,
or `}`. IDs are case-sensitive. Any script is allowed: `kaishi-0002-私` is a
valid ID.

| ID | Unique within |
|---|---|
| Deck `id` | The reader's collection |
| Note `id` | The deck |
| Cloze ID (`c1` in `{{c1::...}}`) | The note |
| Mask `id` | The note |

IDs are how a reader keeps review history when a deck changes. The rules for
keeping them stable are in [section 10](#10-updating-a-deck).

## 6. Safe HTML

HTML in a deck is a fragment, not a document. It describes meaning; the app
decides how it looks.

Allowed elements:

```text
p br hr h1 h2 h3 h4 h5 h6 div span blockquote pre code
strong b em i s del mark small sub sup kbd samp var
ul ol li dl dt dd table caption thead tbody tfoot tr th td
a ruby rt rp
```

Allowed MathML elements:

```text
math mrow mi mn mo mtext mspace mfrac msqrt mroot
msub msup msubsup munder mover munderover
mtable mtr mtd mpadded mphantom
```

Allowed attributes:

- `lang`, `dir`, and `title` on any allowed element.
- `href` on `a`.
- `start`, `reversed`, and `type` on `ol`; `value` on `li`.
- `colspan`, `rowspan`, and `scope` on `th` and `td`.
- `data-language` on `code`, naming the programming language for highlighting.
- `display` on `math`; `mathvariant` on MathML elements.

Links must use absolute `https:`, `http:`, or `mailto:` URLs.

Everything else is invalid, including full documents, comments, `class`,
`style`, `id`, event handlers, scripts, forms, frames, embedded objects, and
`img`, `audio`, and `video` elements. Images, audio, and video are always
[media](#7-media), never HTML.

Write `&lt;` for a literal `<` and `&amp;` for a literal `&`.

### Emphasis

Use `<mark>` for the text a piece of content is about, such as the target word
inside an example sentence:

```yaml
html: あなたはトム<mark>さん</mark>ですか。
```

Use `<strong>` and `<em>` for ordinary emphasis. The app decides how each looks.

## 7. Media

A media item references one file under `assets/`.

```yaml
- kind: image
  src: assets/images/knee.webp
  alt: Front view of a knee joint

- kind: audio
  src: assets/audio/watashi.mp3
  label: Word audio

- kind: video
  src: assets/video/fold.mp4
  label: How to fold the corner
```

| Field | Kinds | Required | Value |
|---|---|---|---|
| `kind` | all | yes | `image`, `audio`, or `video` |
| `src` | all | yes | Asset path |
| `alt` | image | yes | Text describing the image |
| `label` | audio, video | no | Text naming the recording for accessibility |
| `side` | all | no | `front`, `back`, or `both` (default `both`) |

- Images include GIF, animated WebP, and SVG. SVG is always displayed as an
  image, never inserted as markup.
- Audio and video never play automatically because of anything in the deck.
- An asset path starts with `assets/`, uses `/` separators, and has no `..`
  segments, backslashes, or URL scheme. Remote and `data:` URLs are invalid.
- Several media items may reference the same file.

### Linked and standalone media

Where a media item is written decides what it belongs to.

**Linked media** sits inside a part that has `html`. It belongs to that piece
of content, whatever the content is: a word, a sentence, a code sample, a
formula. The app places audio controls next to the part's text and places
images and videos directly below it, inside the same part.

```yaml
prompt:
  - html: 私
    media:
      - kind: audio
        src: assets/audio/watashi.mp3
```

**Standalone media** belongs to no particular content. There are two forms:

- A **media-only part** (a part without `html`) renders at its own position in
  the content list. Use it to place a picture between two paragraphs, or to make
  a prompt that is only a recording.
- **Note-level `media`** renders as its own row between the card's front content
  and its answer.

```yaml
answer:
  - html: This is the finished fold.
  - media:
      - kind: image
        src: assets/images/fold.webp
        alt: The finished paper fold
  - html: Notice where the two corners meet.
```

Linking is per part. To link audio to a whole sentence while showing which word
it practises, put the audio on the sentence part and wrap the word in `<mark>`.

### Front, back, and `side`

"Front" is a card before the learner reveals the answer. "Back" is the same card
after the reveal. The back keeps the front's content visible and adds the answer
below it.

Each content field has a fixed visibility, listed with each note type in
[section 8](#8-note-types). A media item is visible only when **both** its
container is visible and its `side` allows it:

| `side` | Visible |
|---|---|
| `both` (default) | Whenever its container is visible |
| `front` | Only before the reveal |
| `back` | Only after the reveal |

`side` exists for media that would give the answer away. Audio of a vocabulary
word on the front would let the learner hear the reading they are meant to
recall, so mark it `side: back`. Its play button then appears next to the word,
but only after the reveal:

```yaml
prompt:
  - html: 私
    media:
      - kind: audio
        src: assets/audio/watashi.mp3
        side: back
```

`side: front` on media in a field that only appears after the reveal can never
show and is invalid.

## 8. Note types

There are three note types. Each describes a different review interaction.
Subject matter belongs in decks and tags, not in note types.

Each card renders as:

```text
front area → visible note-level media → answer area (after reveal)
```

### `prompt_response`

A question and its answer.

| Field | Required | Visible |
|---|---|---|
| `prompt` | yes | Front and back |
| `answer` | yes | Back |
| `reverse` | no | See below |

```yaml
- id: oxygen
  type: prompt_response
  prompt: What is the chemical symbol for oxygen?
  answer: O
```

The note produces one card with variant ID `""` (empty).

`prompt` must show something before the reveal: at least one part with `html`,
or media whose `side` is `front` or `both`.

#### Reverse cards

`reverse` adds a second card that asks in the opposite direction. Its value is
content: exactly what the reverse card shows on its front.

```yaml
- id: kaishi-0002-私
  type: prompt_response
  prompt: 私
  answer: I (polite, general)
  reverse: I (polite, general)
```

The reverse card has variant ID `reverse`:

| Area | Forward card | Reverse card |
|---|---|---|
| Front | `prompt` | `reverse` |
| Back | `prompt`, then `answer` | `reverse`, then `prompt`, then `answer` |

On the reverse card, `prompt` appears only after the reveal, so media in it with
`side: front` does not show there. `reverse` follows the same rule as `prompt`:
it must show something before the reveal.

Write `reverse` so it does not contain the answer. Removing `reverse` later
removes the reverse card (see [section 10](#10-updating-a-deck)).

### `cloze`

Text with hidden pieces. Each cloze ID becomes one card.

| Field | Required | Visible |
|---|---|---|
| `text` | yes | Front and back, with clozes hidden or shown |
| `extra` | no | Back |

```yaml
- id: ownership
  type: cloze
  text: In Rust, each value has {{c1::one owner}} at a time.
```

A cloze is written `{{id::answer}}` inside the `html` of `text`:

- Each distinct cloze ID produces one card whose variant ID is the cloze ID.
  Cards are created in order of each ID's first appearance.
- Repeating an ID puts all its occurrences on the same card.
- On a card's front, every occurrence of its ID is shown as `[…]`. Clozes with
  other IDs show their answers.
- On the back, every answer is shown, followed by `extra`.
- The answer must contain non-whitespace text and may contain inline HTML, such
  as `{{c1::<ruby>私<rt>わたし</rt></ruby>}}`. A `::` inside the answer is
  ordinary text, so `{{c1::std::vec}}` is valid.
- Clozes cannot nest, cannot cross an HTML element boundary, and cannot span
  two parts.
- Cloze syntax is recognised only in the `html` of `text`, in text and not inside
  tags or attribute values. To write a literal `{{` there, use `&#123;&#123;`.
- `text` must contain at least one cloze. An unclosed or malformed cloze is
  invalid.

Media belongs to the note, not to one cloze: an image on the note appears on
every card the note produces. Audio that speaks a hidden answer should use
`side: back`.

```yaml
- id: wa-topic
  type: cloze
  language: ja
  text:
    - html: 私{{c1::は}}アンです。
      media:
        - kind: audio
          src: assets/audio/watashi-sentence.mp3
          side: back
  extra: は marks the topic of the sentence.
```

### `occlusion`

An image with regions to recall. Each mask becomes one card.

| Field | Required | Visible |
|---|---|---|
| `prompt` | no | Front and back |
| `image` | yes | Front and back |
| `masks` | yes | Active mask covered on the front, uncovered on the back |
| mask `answer` | yes | Back, for the active mask only |
| `extra` | no | Back |

```yaml
- id: knee-ligaments
  type: occlusion
  prompt: Name the covered ligament.
  image:
    src: assets/images/knee.png
    alt: Knee ligament diagram
  masks:
    - id: acl
      answer: Anterior cruciate ligament
      shape: {kind: rect, x: 510, y: 320, w: 180, h: 70}
    - id: pcl
      answer: Posterior cruciate ligament
      shape: {kind: rect, x: 480, y: 420, w: 180, h: 70}
```

- `image` has exactly `src` and `alt`. The image must be a still image with
  known pixel dimensions.
- `masks` has at least one mask. Each mask has exactly `id`, `answer`, and
  `shape`. Each mask produces one card whose variant ID is the mask ID.
- `shape` has `kind: rect` and `x`, `y`, `w`, `h` in the image's natural pixel
  coordinates, with `(0, 0)` at the top-left corner. `x` and `y` locate the
  rectangle's top-left corner. `w` and `h` must be greater than zero. A
  rectangle may extend past the image edge and is clipped, but it must overlap
  the image.
- On a card's front only its own mask is covered; the rest of the image stays
  visible. On the back that region is uncovered and the mask's `answer` is shown.
- A mask's `answer` is content, so it can carry linked media that appears only
  on that mask's card, such as the pronunciation of one cell of a kana chart.

## 9. Cards

A note produces cards. Each card has an identity made of three parts:

```text
(deck id, note id, variant id)
```

| Note type | Variant IDs |
|---|---|
| `prompt_response` | `""`, plus `reverse` when `reverse` is present |
| `cloze` | One per distinct cloze ID |
| `occlusion` | One per mask ID |

Cards from the same note are **siblings**. Readers keep siblings apart in time
(see [sibling burying](#sibling-burying)).

A reader stores scheduling and review history against a card's identity, never
against its content or its position in a file.

## 10. Updating a deck

A deck grows and changes over time. Every package is a **complete snapshot** of
the deck, never a patch. A note, cloze, mask, `reverse`, or asset missing from a
new version has been removed.

Readers keep a learner's review history by matching card identities between
versions. Authors and generators must keep identities stable:

- The deck `id` identifies the deck, independently of its title, directory
  name, or ZIP file name. Change it only to create a separate deck.
- Keep each note's `id` when editing the note's content, tags, media, or file.
- Do not renumber cloze IDs or mask IDs when inserting, removing, or reordering
  items. Adding a cloze between `c1` and `c2` makes it `c3`.
- Never reuse an ID for an unrelated learning task. Give new tasks new IDs.
- Editing content never changes identity. Fixing a typo, rewording an answer,
  replacing an image, or moving a mask keeps the card and its history.
- Changing an ID is a removal plus an addition. The format has no alias or
  rename mechanism. History does not move to the new ID; it stays with the old
  one and returns if the old ID returns.
- Every asset a note references must be in the package, even if an earlier
  version already contained it.

Agents generating or regenerating a deck must read the existing notes first and
keep their IDs. Deriving IDs from a stable key (such as `kaishi-0002-私`) is
safer than numbering notes by position.

## 11. Reader behaviour in Inza

This section is not part of the file format. It defines what Inza guarantees
when it reads Open Deck packages.

### Validation

Inza rejects a whole package, with the file path, note ID, and field path of the
first problem, when:

- A required file or field is missing, or a field is unknown at any depth.
- A value has the wrong type, required text is empty, or YAML uses a construct
  that [section 1](#yaml-rules) forbids.
- A note ID, mask ID, tag within a note, or mapping key is duplicated.
- A note type, media kind, or shape kind is unsupported.
- An ID contains a forbidden character.
- HTML contains an element, attribute, or URL scheme outside the allowlist.
- A cloze is malformed, or `text` has no cloze.
- A content field cannot show anything in the state where it must, or media has
  a `side` it can never be visible with.
- A mask has invalid geometry, or the occlusion image is not a usable still
  image.
- An asset is missing, unreadable, or outside `assets/`.

Inza validates HTML when importing and sanitizes it again before inserting it
into the page.

### Import and update

Importing a deck whose `id` is new adds it. Importing a deck whose `id` already
exists updates that deck. Both follow the same steps:

1. **Prepare.** Read the whole package, validate every note and asset, and hash
   note content and asset bytes. Nothing is written yet.
2. **Preview.** Compare against the stored deck and show what will change:
   - Notes added, changed, and removed, including note type changes.
   - Cards new, kept, and restored from the archive.
   - Removed cards, split into reviewed (archived) and never reviewed (deleted).
   - Assets added, replaced, and removed, with sizes.
   - In-app edits that the update will overwrite.

   Formatting-only changes (indentation, comments, key order, which file a
   note is in) do not count as changes.
3. **Apply.** After the learner confirms, write everything in one database
   transaction. If anything fails or the app closes, the previous version stays
   complete and usable. There is never a half-updated deck.

Cards are matched by identity:

| In the new package | Stored | Result |
|---|---|---|
| Present | No | New card |
| Present | Active | Keeps scheduling and history; shows new content |
| Present | Archived | Restored with its scheduling and history |
| Absent | Answered at least once | Archived |
| Absent | Never answered | Deleted |

- **Content edits never reset scheduling.** Resetting a card's schedule is a
  separate action, and a reset card still counts as answered.
- **Archived cards** keep their identity, scheduling, and review events. They
  are excluded from study and counts. Their old content is not kept; an archived
  card can be listed with its history but not studied until its identity returns.
- Permanently deleting reviewed history is a separate, explicit action, never
  part of an import.
- An update replaces assets whose bytes changed and removes assets no note
  references.

### In-app edits

Inza allows editing notes in the app. The deck file stays the source of truth:
when an update would overwrite a note edited in the app, the preview says so and
offers to export the deck first. An export keeps every deck, note, cloze, and
mask ID, so the edits can be merged into the source files. In-app edits follow
the same identity rules as imports; removing a reviewed cloze in the app
archives its card.

### Review history

Inza records every answer as a review event, together with the card's new
schedule, in one transaction. Review events are kept for archived cards. They
are what the FSRS optimizer learns from.

### Sibling burying

Inza shows at most one new or review card per note per day. When a card is
answered, its new and review siblings wait until the next day. Cards in their
learning or relearning steps are exempt, because delaying them a day would break
their short intervals. Burying only delays a card; it never changes its
schedule.

### Rendering

Inza provides the layout for front and back, responsive sizing, dark mode,
audio and video controls, image sizing, code highlighting, MathML, and
accessible labels. Hidden cloze answers are absent from the page, not merely
invisible. Deck authors never manage layout.

## 12. Not in this format

These are deliberately left out. Each would add rules without a demonstrated
need.

| Left out | Instead |
|---|---|
| Templates, deck CSS, JavaScript | The app renders semantic content |
| Markdown, TeX | Safe HTML and MathML |
| Content roles and rendering weights | Part order and containment |
| Per-word media anchors | Link to the part; mark the word with `<mark>` |
| File-level defaults, per-note sub-decks | Explicit fields on each note; tags |
| Hint fields and cloze hints | Write cues into the visible content |
| Structured references | Ordinary links in content |
| Provenance or generator metadata | Keep it in the authoring source |
| Ellipse and polygon masks, mask groups | Rectangles |
| "Hide all, guess one" occlusion | Hide one, guess one |
| Media per cloze card | Note media; occlusion masks carry their own media |
| Autoplay and player settings | Controls owned by the app |
| Remote assets, URL loading | Self-contained packages |
| ID aliases and rename tracking | Stable IDs; archived history |
| Version or revision fields | Content comparison |
| Scheduling state in deck files | Stored by the reader |

## 13. Complete example

```yaml
# deck.yaml
format: open-deck
id: kaishi
title: Kaishi 1.5k
language: en
```

```yaml
# notes/0001-0250.yaml
notes:
  # The short form: one line per note.
  - {id: oxygen, type: prompt_response, prompt: "Symbol for oxygen?", answer: O}

  # Parts with linked media and a reverse card.
  - id: kaishi-0002-私
    type: prompt_response
    tags: [n5, pronoun]
    prompt:
      - html: 私
        language: ja
        media:
          - kind: audio
            src: assets/audio/watashi.mp3
            label: Word audio
            side: back
    answer:
      - label: Meaning
        html: I (polite, general)
      - label: Reading
        html: <ruby>私<rt>わたし</rt></ruby>
        language: ja
      - label: Example
        html: <mark>私</mark>はアンです。
        language: ja
        media:
          - kind: audio
            src: assets/audio/watashi-sentence.mp3
            label: Sentence audio
          - kind: image
            src: assets/images/jikosyoukai_man.webp
            alt: A man introducing himself to three people
      - label: Translation
        html: I am Ann.
      - label: Notes
        html: Can also be read わたくし (formal) and あたし (feminine).
    reverse: I (polite, general)

  # A cloze with audio held back until the reveal.
  - id: wa-topic
    type: cloze
    language: ja
    text:
      - html: 私{{c1::は}}アンです。
        media:
          - kind: audio
            src: assets/audio/watashi-sentence.mp3
            side: back
    extra: は marks the topic of the sentence.

  # A code card using HTML.
  - id: rust-borrow-scope
    type: prompt_response
    prompt: |
      <p>Does this compile?</p>
      <pre><code data-language="rust">let r1 = &amp;s;
      let r2 = &amp;mut s;
      println!("{r1}");</code></pre>
    answer: No. <code>r1</code> is still used after the mutable borrow begins.
```
