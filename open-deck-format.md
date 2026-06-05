# Open Deck Format

This document defines a human-readable deck format for flashcard decks that can
live as either a directory or a zip archive. The design goal is to support a
large range of Anki-like decks without copying Anki's HTML/CSS/template model
into the authoring format.

The core rule is simple:

> Deck files describe learning content and intent. The app owns rendering.

That means a deck can say "this is the term", "this is the sentence", "this is
audio", "this answer should be typed", or "this region is hidden". It should not
say "make a centered div with 72px text and this CSS class". Pretty defaults,
platform-specific layout, accessibility, dark mode, and responsive behavior are
app responsibilities.

## Non-Goals

- No deck-authored HTML templates.
- No deck-authored CSS.
- No JavaScript as the default extension point.
- No required database.
- No hidden binary package format.
- No attempt to preserve every imported deck layout exactly.

## Package Shape

A deck is a directory:

```text
my-deck/
  deck.yaml
  notes/
    basics.yaml
    chapter-01.yaml
  assets/
    images/
    audio/
    video/
```

The same directory can be zipped:

```text
my-deck.zip
```

A conforming reader should treat a zip exactly like the directory it contains.

## File Roles

### `deck.yaml`

`deck.yaml` is the deck manifest. It declares the deck identity.

```yaml
format: open-deck
id: rust-book
title: The Rust Book
description: Cards based on The Rust Programming Language book.
language: en
```

Optional manifest fields:

```yaml
license: MIT OR Apache-2.0
```

### `notes/*.yaml`

Note files contain authorable content. They may define file-level defaults and a
list of notes.

Decks may split notes across files in any useful way:

```text
notes/
  0001-0250.yaml
  0251-0500.yaml
  grammar.yaml
  chapter-03.yaml
```

Readers should load note files in stable lexical path order, then load notes in
the order they appear inside each file. If deck order matters, choose filenames
that sort in the intended order, such as zero-padded numeric prefixes.

```yaml
defaults:
  deck: rust-book/ch03
  tags: [ch03, data-types]

notes:
  - id: rust-scalar-categories
    type: prompt_response
    prompt: Which four scalar type categories does Rust have?
    answer: Integers, floating-point numbers, Booleans, and characters.
    tags: [definition]
```

### `assets/`

Assets are ordinary files referenced by relative path.

```yaml
image: assets/images/knee.png
audio: assets/audio/word.mp3
video: assets/video/demo.mp4
```

Readers should reject paths that escape the deck root.

## Core Concepts

### Deck Type

There are three top-level note types:

```yaml
type: prompt_response | cloze | occlusion
```

These classify the review interaction. Subject matter should usually be modeled
with decks and tags.

### Shared Fields

Every note may use these fields.

```yaml
id: stable-note-id
type: prompt_response
deck: rust-book/ch03
tags: [tag-one, tag-two]
language: en
```

Keep review fields focused on what the learner sees or what the scheduler needs.
Authoring history, import details, and source file paths belong in `provenance`,
not in the core note shape.

### Review Behavior

Review behavior describes how the learner answers without defining layout.

```yaml
answer_mode: reveal | typed
```

Recommended default:

```yaml
answer_mode: reveal
```

### Content

Visible content should use either Markdown text or a small list of generic
content blocks. Use Markdown text for ordinary cards. Use blocks when a card has
several learner-facing pieces that should not be flattened into one blob.

Simple string:

```yaml
prompt: What is ownership?
```

Markdown block:

````yaml
prompt: |
  What happens when this code runs?

  ```rust
  println!("{}", [1, 2, 3][1]);
  ```
````

Block list:

```yaml
prompt:
  - role: main
    text: "\u79c1"
    language: ja
    media:
      - kind: audio
        src: assets/audio/watashi.mp3
        label: Word audio

  - role: context
    label: Sentence
    text: "\u79c1\u306f\u30a2\u30f3\u3067\u3059\u3002"
    language: ja
    media:
      - kind: audio
        src: assets/audio/watashi-sentence.mp3
        label: Sentence audio
```

Block fields:

```yaml
role: main | context | support | note
label: string
text: markdown-string
runs: [inline-run]
language: language-code
media: [media-ref]
```

A block must contain at least one of `text`, `runs`, or `media`. Use `text` for
ordinary Markdown. Use `runs` only when a card needs small inline relationships
that Markdown cannot express cleanly, such as text above or below an exact span.
Do not set both `text` and `runs` on the same block.

Use media on a block when the file belongs to that specific piece of content,
such as word audio, sentence audio, or an example image.

`role` tells the renderer the weight of the block, not its subject matter:

- `main`: the primary thing to answer or remember.
- `context`: material needed to understand the prompt or answer.
- `support`: ordinary supporting information.
- `note`: lower-emphasis extra information.

`label` is optional. Use it when flattening would lose meaning, such as
distinguishing "Reading", "Frequency", "Source sentence", or "Compiler error".
Labels are deck content, not renderer commands.

Readers may render a block list as native grouped text, as labeled rows, or as
plain Markdown-like sections. The app decides layout, spacing, script rendering,
inline above/below text, and emphasis.

### Inline Runs

Inline runs are plain text spans with small generic presentation hints. They are
not a template language, annotation engine, or subject-matter model. They store
what appears attached to text, not why.

```yaml
runs:
  - Plain text before
  - text: "\u79c1"
    above: "\u308f\u305f\u3057"
    marks: [strong]
  - "\u306f\u30a2\u30f3\u3067\u3059\u3002"
```

Run fields:

```yaml
text: string
marks: [strong | emphasis | code | strike | highlight]
above: string
below: string
link: url
```

Run `text`, `above`, and `below` are plain text, not Markdown. Use Markdown
`text` blocks for paragraphs, code fences, lists, formulas, and ordinary links.
Use `runs` only for the small cases where the exact span matters.

### Media References

Media references are semantic. The app decides replay button style, placement,
image sizing, captions, and lazy loading.

Media may appear on a note or inside an individual content block. Prefer
block-level media when the media belongs to a specific block. Use note-level
media when the media belongs to the whole card or there is no useful block to
attach it to.

```yaml
media:
  - kind: audio
    src: assets/audio/word.mp3
    label: Word audio
    role: main
  - kind: image
    src: assets/images/example.webp
    role: support
    alt: Person being threatened
```

Allowed media kinds:

```yaml
kind: image | audio | video
```

SVG files may be referenced as `kind: image`.

`role` and `label` on media are optional. They help the renderer group media
with nearby content without inventing media fields like `word_audio` or
`sentence_audio`. Block-level media already inherits the surrounding block's
role, so a block-level media item often needs only `kind`, `src`, and maybe
`label` or `alt`.

## Type 1: `prompt_response`

Use `prompt_response` for ordinary recall and problem-solving cards:

- Front/back cards.
- Vocabulary.
- Definitions.
- Dates and facts.
- Geography.
- Classification.
- Media identification.
- Structured fact cards.
- Problems, cases, proofs, and worked examples.
- Code diagnostics and query questions.

### Required Fields

```yaml
type: prompt_response
prompt: content
answer: content
```

### Additional Fields

```yaml
hint: content
media: [media-ref]
references:
  - title: string
    url: url
    locator: string
```

### Example: Simple QA

```yaml
- id: oxygen-symbol
  type: prompt_response
  prompt: What is the chemical symbol for oxygen?
  answer: O
```

### Example: Japanese Vocabulary

```yaml
- id: jp-warui
  type: prompt_response
  prompt:
    - role: main
      runs:
        - text: "\u60aa"
          above: "\u308f\u308b"
        - "\u3044"
      language: ja
      media:
        - kind: audio
          src: assets/audio/warui.mp3
          label: Word audio
    - role: context
      label: Sentence
      text: "\u3042\u306e\u4eba\u306f\u60aa\u3044\u4eba\u3067\u3059\u3002"
      language: ja
      media:
        - kind: audio
          src: assets/audio/warui-sentence.mp3
          label: Sentence audio
  answer:
    - role: main
      label: Meaning
      text: bad
    - role: support
      label: Reading
      text: warui
    - role: support
      label: Sentence meaning
      text: That person is a bad person.
    - role: support
      label: Illustration
      media:
        - kind: image
          src: assets/images/bad-person.webp
          alt: Person being threatened
```

### Example: Structured Fact As Separate Cards

```yaml
- id: france-capital
  type: prompt_response
  prompt: What is the capital of France?
  answer: Paris

- id: france-country
  type: prompt_response
  prompt: Paris is the capital of which country?
  answer: France

- id: france-flag
  type: prompt_response
  prompt: Which country uses this flag?
  media:
    - kind: image
      src: assets/images/france.svg
      alt: Flag of France
  answer: France
```

### Example: Code Diagnostic

```yaml
- id: rust-double-mut-borrow
  type: prompt_response
  prompt: |
    Why does this fail?

    ```rust
    fn main() {
        let mut s = String::from("hello");
        let r1 = &mut s;
        let r2 = &mut s;
        println!("{r1}, {r2}");
    }
    ```
  answer: |
    It creates two simultaneous mutable references to `s`.

    Rust allows either one mutable reference or any number of immutable
    references, but not overlapping mutable references.

    Common mistakes:

    - Thinking the error is caused by `println!` formatting.
    - Thinking the borrow ends immediately after `r1` is created.
```

### Example: Math Problem

```yaml
- id: derivative-x2
  type: prompt_response
  prompt: |
    Find the derivative.

    $f(x) = x^2$
  answer: |
    $f'(x) = 2x$

    - Apply the power rule.
    - Multiply by the exponent and subtract one from the exponent.
```

## Type 2: `cloze`

Use `cloze` when the prompt is a source passage with inline hidden spans.

### Required Fields

```yaml
type: cloze
text: content-with-cloze-markers
```

### Additional Fields

```yaml
context: content
extra: content
media: [media-ref]
```

Cloze markers use this form:

```text
{{id::answer}}
{{id::answer::hint}}
```

Repeated IDs belong to the same group.

### Example

```yaml
- id: rust-ownership-cloze
  type: cloze
  text: |
    In Rust, each value has {{c1::one owner::count + noun}} at a time,
    and when the owner goes out of scope, the value is {{c2::dropped::cleanup action}}.
  extra: |
    This is the core ownership rule that lets Rust avoid a garbage collector.
```

## Type 3: `occlusion`

Use `occlusion` when the card hides regions of an image or diagram.

### Required Fields

```yaml
type: occlusion
image:
  src: assets/images/diagram.png
masks:
  - id: label-1
    shape:
      kind: rect
      x: 0
      y: 0
      w: 100
      h: 50
    answer: string
```

### Additional Fields

```yaml
image:
  src: path
  alt: string
  width: number
  height: number

masks:
  - id: string
    answer: string
    hint: string
    group: string
    shape:
      kind: rect | ellipse | polygon
      x: number
      y: number
      w: number
      h: number
      points: [[number, number]]

context: content
extra: content
```

Coordinates should use the natural image coordinate system. The renderer can
scale to screen size.

### Example

```yaml
- id: knee-ligaments
  type: occlusion
  image:
    src: assets/images/knee.png
    alt: Knee ligament diagram
    width: 1200
    height: 900
  masks:
    - id: acl
      answer: Anterior cruciate ligament
      hint: ACL
      shape:
        kind: rect
        x: 510
        y: 320
        w: 180
        h: 70
    - id: patella
      answer: Patella
      shape:
        kind: ellipse
        x: 440
        y: 160
        w: 150
        h: 120
  extra: |
    Review the relative position of each structure, not only the label name.
```

## References

References point to learner-facing source material. Use them when the app should
be able to show "read more", citations, or a friendly source link.

```yaml
references:
  - title: The Rust Programming Language
    url: https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html
    locator: Chapter 4, References and Borrowing
```

Do not use `references` for raw generator bookkeeping. A local source file path
such as `rust-book/src/ch04-02-references-and-borrowing.md` is usually not useful
to a learner. Put that in `provenance` instead.

## Provenance

`provenance` is optional maintainer metadata. It can help generated decks,
imports, audits, and regeneration, but native review behavior must not depend on
it.

```yaml
provenance:
  source_path: rust-book/src/ch04-02-references-and-borrowing.md
  source_lines: 10-30
  generator: rust-book-card-generator
```

Readers may ignore `provenance`.

Importers should produce ordinary native notes. If they need to preserve source
system details, they should put that data in `provenance`, not in review fields.

## Validation Rules

A validator should check:

- `deck.yaml` exists.
- `format` is supported.
- Every note has a stable `id`.
- Every note has a supported `type`.
- Required fields for the type are present.
- Asset references exist and stay inside the deck root.
- IDs are unique within the deck.
- Prompt-response notes have a prompt and answer.
- Content blocks, when used, have a supported role and at least one of `text`,
  `runs`, or `media`.
- Content blocks do not set both `text` and `runs`.
- Inline runs, when used, are non-empty and use supported marks.
- Media is valid on both notes and content blocks.
- Occlusion masks have valid geometry.
- Cloze notes have at least one cloze marker.

This repository includes a small validator:

```bash
bun tools/validate-open-deck.ts kaishi-open-deck
```

Warnings, not hard errors:

- Missing optional alt text.
- Very large media files.

## Renderer Contract

The renderer must provide good defaults for:

- Front and back layout.
- Mobile and desktop responsive sizing.
- Dark mode.
- Audio controls.
- Image sizing.
- Inline above/below text where available.
- Code blocks.
- Math/formula text where available.
- Accessibility labels.
- Empty optional fields.

The renderer should not require deck authors to manage layout.

## Format Identifier

The format string identifies the Open Deck format:

```yaml
format: open-deck
```

Compatibility rules:

- Readers may ignore unknown optional fields.
- Readers must reject unknown required `type` values.
- Unknown note types are invalid.
- Native deck behavior must not depend on `provenance`.

## Minimum Reader Support

A conforming reader should support:

- Directory and zip loading.
- `deck.yaml`.
- `notes/*.yaml`.
- Local assets.
- `prompt_response`.
- `cloze`.
- `occlusion`.
- Validation errors with file paths and note IDs.

Do not build a template engine.

## Native Markdown Rendering

Card content may use Markdown for ordinary rich text, code fences, links, lists,
and formulas. Card content may also be a list of generic labeled blocks whose
`text` values are Markdown. Markdown is authoring syntax, not a layout or
template system.

Blocks that use `runs` bypass Markdown. Run text is already a small inline
content tree, so readers should render it directly as native text spans.

Readers should parse Markdown into an app-owned content tree before rendering:

```text
Markdown content
  -> content tree
  -> native renderer
```

For block lists, readers should parse each block's `text` through the same
Markdown pipeline, or render its `runs` directly. Then they should render the
block role and label with app-owned native components.

Readers should render that tree with platform-native UI components where
practical. For example, iOS can render the tree with SwiftUI views, Android can
render it with Compose views, and desktop apps can render it with their native UI
toolkit. Electron desktop apps may render sanitized HTML as an implementation
detail, but deck content should still be parsed through the same content tree and
must not become deck-authored HTML.

The content tree should stay small and semantic:

```text
paragraph
text
emphasis
strong
inline_code
code_block(language, text)
link
image
bullet_list
ordered_list
blockquote
math_inline
math_block
```

Readers should not support raw HTML, custom CSS, deck-authored JavaScript, or
renderer-specific Markdown extensions.

Syntax highlighting, if supported, should be returned as spans over a code block
rather than HTML:

```text
code_span(start, end, role)
```

The native renderer maps span roles to platform theme colors.

Formula support should be isolated behind `math_inline` and `math_block`.
Readers may render formulas with a native math renderer, pre-rendered images, or
plain TeX fallback. Formula support should not require cards to use HTML.
