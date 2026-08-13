# Open Deck MVP Format

This document defines the Open Deck fields accepted by Inza MVP/v1. The full
release will use [`OPEN-DECK_FORMAT.md`](OPEN-DECK_FORMAT.md). Both use
`format: open-deck`; MVP is an implementation milestone, not a separate format.

The MVP format has one rule: every defined field is required. It has no defaults,
optional metadata, or content blocks. A reader must reject unknown fields
instead of ignoring them.

## Package

A deck is one directory:

```text
my-deck/
  deck.yaml
  notes/
    notes.yaml
  assets/
    images/
    audio/
    video/
```

Readers load `notes/*.yaml` in lexical path order and notes in file order. ZIP
and URL loading are post-MVP work. Asset paths are relative to the deck root and
must not escape it.

## `deck.yaml`

The manifest has exactly three fields:

```yaml
format: open-deck
id: rust-book
title: The Rust Book
```

All three fields are required non-empty strings. `format` must equal
`open-deck`.

## `notes/*.yaml`

Each note file has exactly one field:

```yaml
notes:
  - id: oxygen-symbol
    type: prompt_response
    prompt: What is the chemical symbol for oxygen?
    answer: O
    media: []
```

`notes` is a required array. File defaults are not supported. Every note has a
required non-empty `id` and one required `type`. IDs must be unique within the
deck.

## HTML Content

`prompt`, `answer`, cloze `text`, and occlusion mask `answer` values are HTML
fragment strings. Plain text is valid HTML content. Arrays and objects are
invalid. A content value must contain at least one non-whitespace text node.

The app owns layout and styling. Content may use these semantic HTML elements:

```text
p br hr h1 h2 h3 h4 h5 h6 div span blockquote pre code
strong b em i s del mark small sub sup kbd samp var
ul ol li dl dt dd table caption thead tbody tfoot tr th td
a ruby rt rp
```

Content may also use these MathML elements:

```text
math mrow mi mn mo mtext mspace mfrac msqrt mroot
msub msup msubsup munder mover munderover
mtable mtr mtd mpadded mphantom
```

Allowed attributes are `lang`, `dir`, and `title`; `href` on `a`; `start`,
`reversed`, and `type` on `ol`; `value` on `li`; `colspan`, `rowspan`, and
`scope` on table cells; `data-language` on `code`; `display` on `math`; and
`mathvariant` on MathML elements. Cloze `span` elements also use `data-cloze` as
defined below.

Links must use `https:`, `http:`, or `mailto:` URLs. A reader must reject every
unlisted element or attribute, full HTML documents, comments, CSS, event
handlers, scripts, forms, frames, embedded objects, and media elements. Images,
audio, and video use the structured media fields below.

A reader must validate HTML during import and sanitize it again before inserting
it into the page. It must reject unsafe HTML instead of silently changing deck
content.

## Media

Prompt-response and cloze notes always have a `media` array. Use `media: []` when
a note has no media. Every media item is one of these exact shapes:

```yaml
kind: image
src: assets/images/example.webp
alt: Description of the image
```

```yaml
kind: audio
src: assets/audio/word.mp3
label: Word audio
```

```yaml
kind: video
src: assets/video/demo.mp4
label: Demonstration
```

Every listed field is required. Images require `alt`. Audio and video require
`label`. SVG files use `kind: image`.

Inza shows note media with the prompt and keeps it visible after reveal.
Occlusion notes use their required `image` field instead of a `media` array.

## `prompt_response`

A prompt-response note has exactly these fields:

```yaml
id: oxygen-symbol
type: prompt_response
prompt: What is the chemical symbol for oxygen?
answer: O
media: []
```

`id`, `type`, `prompt`, `answer`, and `media` are required. `prompt` and `answer`
must be non-empty HTML fragment strings.

Example with media:

```yaml
id: france-flag
type: prompt_response
prompt: Which country uses this flag?
answer: France
media:
  - kind: image
    src: assets/images/france.svg
    alt: Flag of France
```

## `cloze`

A cloze note has exactly these fields:

```yaml
id: rust-ownership
type: cloze
text: |
  <p>In Rust, each value has <span data-cloze="c1">one owner</span> at a time.</p>
media: []
```

`id`, `type`, `text`, and `media` are required. `text` must be a non-empty HTML
fragment with at least one cloze element:

```html
<span data-cloze="id">answer</span>
```

The `data-cloze` value must be a non-empty ID. The element must contain
non-whitespace text. Each distinct ID produces one reviewable card. Repeated IDs
belong to the same card. Cloze hints are post-MVP work.

## `occlusion`

An occlusion note has exactly these fields:

```yaml
id: knee-ligaments
type: occlusion
image:
  src: assets/images/knee.png
  alt: Knee ligament diagram
masks:
  - id: acl
    answer: Anterior cruciate ligament
    shape:
      kind: rect
      x: 510
      y: 320
      w: 180
      h: 70
```

Every shown field is required. `image` has exactly `src` and `alt`. Each mask has
exactly `id`, `answer`, and `shape`. `answer` is a non-empty HTML fragment string.
MVP shapes are rectangles. Their `x`, `y`, `w`, and `h` values are finite pixel
measurements in the original image coordinate system, where `(0, 0)` is the
top-left corner. `x` and `y` locate the rectangle's top-left corner; `w` and `h`
are its width and height and must be greater than zero. A rectangle may start or
extend outside the image. Renderers clip it to the image bounds. Each mask ID
must be unique within the note and produces one reviewable card.

## Validation

An MVP reader must reject a deck when:

- A required file or field is missing.
- A required string is empty, or required HTML has no non-whitespace text.
- A note ID or mask ID is duplicated in its scope.
- A note type, media kind, or shape kind is unsupported.
- An HTML content field is not a string or contains an unlisted element,
  attribute, or URL protocol.
- A cloze note has no valid `data-cloze` element.
- An occlusion note has no mask, a non-finite coordinate, or a non-positive `w`
  or `h`.
- An asset is missing, unreadable, or outside the deck root.
- Any object contains a field not defined above.

The reader may write an import in stages so it can report progress. At the first
validation or storage error, it must stop, delete every deck, note, card, and
asset record added by that import, and only then report the error. No partial
data may remain. A deck becomes usable only after the import completes. Readers
must also delete interrupted imports during startup.

## Deferred Format Features

The post-MVP specification keeps the broader design. MVP/v1 does not accept:

- Optional fields, defaults, tags, language, hints, context, or extra content.
- Content blocks, roles, labels on content, or block-level media.
- Typed answers, references, provenance, or imported layout metadata.
- Ellipse or polygon masks.
- Full HTML documents, CSS, deck-authored JavaScript, or TeX formula syntax.
- ZIP or URL loading.
