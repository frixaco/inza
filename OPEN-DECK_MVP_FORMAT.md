# Open Deck MVP Format

This document defines the only Open Deck fields accepted by Inza MVP/v1. The
full post-MVP format is in [`OPEN-DECK_FORMAT.md`](OPEN-DECK_FORMAT.md).

The MVP format has one rule: every defined field is required. It has no defaults,
optional metadata, content blocks, or inline runs. A reader must reject unknown
fields instead of ignoring them.

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

## Markdown

`prompt`, `answer`, and cloze `text` are Markdown strings. Arrays and objects are
invalid. Raw HTML must not run. The MVP renderer supports ordinary paragraphs,
emphasis, strong text, lists, block quotes, code, and links.

## Media

Prompt-response and cloze notes always have a `media` array. Use `media: []` when
a note has no media. Every media item is one of these exact shapes:

```yaml
# Image
kind: image
src: assets/images/example.webp
alt: Description of the image

# Audio
kind: audio
src: assets/audio/word.mp3
label: Word audio

# Video
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
must be non-empty Markdown strings.

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
text: In Rust, each value has {{c1::one owner}} at a time.
media: []
```

`id`, `type`, `text`, and `media` are required. `text` must be a non-empty
Markdown string with at least one marker:

```text
{{id::answer}}
```

Each distinct marker ID produces one reviewable card. Repeated IDs belong to the
same card. Cloze hints are post-MVP work.

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
exactly `id`, `answer`, and `shape`. MVP shapes are rectangles with required
finite numbers for `x`, `y`, `w`, and `h`; `w` and `h` must be greater than zero.
Each mask ID must be unique within the note and produces one reviewable card.

## Validation

An MVP reader must reject a deck when:

- A required file or field is missing.
- A string that must be non-empty is empty.
- A note ID or mask ID is duplicated in its scope.
- A note type, media kind, or shape kind is unsupported.
- A Markdown content field is not a string.
- A cloze note has no valid marker.
- An occlusion note has no mask or invalid rectangle geometry.
- An asset is missing, unreadable, or outside the deck root.
- Any object contains a field not defined above.

Import is atomic. A validation failure must not leave a partial deck in local
storage.

## Deferred Format Features

The post-MVP specification keeps the broader design. MVP/v1 does not accept:

- Optional fields, defaults, tags, language, hints, context, or extra content.
- Content blocks, inline runs, roles, labels on text, or block-level media.
- Typed answers, references, provenance, or imported layout metadata.
- Ellipse or polygon masks.
- Formula extensions, HTML, CSS, or deck-authored JavaScript.
- ZIP or URL loading.
