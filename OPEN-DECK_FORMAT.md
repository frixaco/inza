# Open Deck Format

> **Post-MVP specification.** Inza MVP/v1 uses the strict required-only subset in [`OPEN-DECK_MVP_FORMAT.md`](OPEN-DECK_MVP_FORMAT.md).

This document defines a human-readable deck format for flashcard decks that can
live as either a directory or a zip archive. The design goal is to support a
large range of Anki-like decks without copying Anki's templates, CSS, or
JavaScript into the authoring format.

The core rule is simple:

> Deck files describe learning content and intent. The app owns rendering.

Learner-facing text is safe semantic HTML because Open Deck targets a web app.
HTML describes paragraphs, emphasis, links, code, tables, ruby text, and math.
It does not control layout or styling. Pretty defaults, accessibility, dark
mode, and responsive behavior remain app responsibilities.

## Non-Goals

- No full HTML documents or card templates.
- No deck-authored CSS or JavaScript.
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

### HTML Content

Visible content uses either an HTML fragment string or a small list of generic
content blocks. Plain text is valid HTML content. Use one string for ordinary
cards. Use blocks when a card has several learner-facing pieces that need
separate roles, labels, languages, or media.

Simple string:

```yaml
prompt: What is ownership?
```

HTML fragment:

```yaml
prompt: |
  <p>What happens when this code runs?</p>
  <pre><code data-language="rust">println!(&quot;{}&quot;, [1, 2, 3][1]);</code></pre>
```

Block list:

```yaml
prompt:
  - role: main
    html: <ruby>私<rt>わたし</rt></ruby>
    language: ja
    media:
      - kind: audio
        src: assets/audio/watashi.mp3
        label: Word audio

  - role: context
    label: Sentence
    html: 私はアンです。
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
html: html-fragment
language: language-code
media: [media-ref]
```

A block must contain `html` or a non-empty `media` list. Use media on a block
when the file belongs to that specific piece of content, such as word audio,
sentence audio, or an example image.

`role` tells the renderer the weight of the block, not its subject matter:

- `main`: the primary thing to answer or remember.
- `context`: material needed to understand the prompt or answer.
- `support`: ordinary supporting information.
- `note`: lower-emphasis extra information.

`label` is optional. Use it when flattening would lose meaning, such as
distinguishing "Reading", "Frequency", "Source sentence", or "Compiler error".
Labels are deck content, not renderer commands.

Readers render each block's HTML inside an app-owned block component. The app
decides block layout, spacing, labels, language handling, and visual weight.

### Safe HTML

Content may use these semantic HTML elements:

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

Allowed attributes are:

- `lang`, `dir`, and `title`.
- `href` on `a`.
- `start`, `reversed`, and `type` on `ol`; `value` on `li`.
- `colspan`, `rowspan`, and `scope` on table cells.
- `data-language` on `code`.
- `data-cloze` and `data-hint` on cloze `span` elements.
- `display` on `math`; `mathvariant` on MathML elements.

Links must use `https:`, `http:`, or `mailto:` URLs. Readers must reject every
unlisted element or attribute, full HTML documents, comments, CSS, event
handlers, scripts, forms, frames, embedded objects, and media elements. Images,
audio, and video use structured media references so readers can validate and
load deck assets.

A reader must parse and validate every fragment during import. It must reject
unsafe HTML instead of silently changing deck content. It must sanitize the
validated fragment again before inserting it into the page. Deck HTML must never
be assigned to an executable script, style, URL, or event-handler context.

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

### Visual Demonstrations

Some cards need to show how something is produced over time: drawing a
character, sketching a diagram, constructing a proof, playing a chord, or
folding a shape. Model that as ordinary media first.

```yaml
answer:
  - role: main
    html: 你
    language: zh-Hans
    media:
      - kind: video
        src: assets/video/ni-writing-demo.mp4
        label: Writing demo
        role: support
```

This keeps the format generic. The deck stores learner-facing content and
optional demonstration media. The app decides playback controls, animation
style, native drawing surfaces, script-aware stroke renderers, and fallbacks.

Do not add renderer-specific libraries, JavaScript, CDN URLs, canvas settings,
stroke colors, or widget configuration to the deck. If native ordered-step
rendering becomes a common real need, define one generic media form for ordered
visual sequences later. Do not add subject-specific fields such as
`hanzi_writer`, `stroke_order`, or `kanji_svg` to the core note shape.

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
      html: <ruby>悪<rt>わる</rt></ruby>い
      language: ja
      media:
        - kind: audio
          src: assets/audio/warui.mp3
          label: Word audio
    - role: context
      label: Sentence
      html: あの人は悪い人です。
      language: ja
      media:
        - kind: audio
          src: assets/audio/warui-sentence.mp3
          label: Sentence audio
  answer:
    - role: main
      label: Meaning
      html: bad
    - role: support
      label: Reading
      html: warui
    - role: support
      label: Sentence meaning
      html: That person is a bad person.
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

Use separate notes when one source item should create multiple review prompts.
This is intentionally boring: it avoids introducing a template or card-generator
layer into the deck format.

```yaml
- id: artwork-ernst-artist
  type: prompt_response
  prompt:
    - role: main
      label: Artwork
      media:
        - kind: image
          src: assets/images/europe-after-rain.jpg
          alt: Europe After the Rain II
  answer:
    - role: main
      label: Artist
      html: Max Ernst

- id: artwork-ernst-title
  type: prompt_response
  prompt:
    - role: main
      label: Artwork
      media:
        - kind: image
          src: assets/images/europe-after-rain.jpg
          alt: Europe After the Rain II
  answer:
    - role: main
      label: Title
      html: Europe After the Rain II
```

### Example: Code Diagnostic

```yaml
- id: rust-double-mut-borrow
  type: prompt_response
  prompt: |
    <p>Why does this fail?</p>
    <pre><code data-language="rust">fn main() {
        let mut s = String::from(&quot;hello&quot;);
        let r1 = &amp;mut s;
        let r2 = &amp;mut s;
        println!(&quot;{r1}, {r2}&quot;);
    }</code></pre>
  answer: |
    <p>It creates two simultaneous mutable references to <code>s</code>.</p>
    <p>Rust allows either one mutable reference or any number of immutable
    references, but not overlapping mutable references.</p>
    <p>Common mistakes:</p>
    <ul>
      <li>Thinking the error is caused by <code>println!</code> formatting.</li>
      <li>Thinking the borrow ends immediately after <code>r1</code> is created.</li>
    </ul>
```

### Example: Math Problem

```yaml
- id: derivative-x2
  type: prompt_response
  prompt: |
    <p>Find the derivative.</p>
    <math display="block"><mrow><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup></mrow></math>
  answer: |
    <math display="block"><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>2</mn><mi>x</mi></mrow></math>
    <ul>
      <li>Apply the power rule.</li>
      <li>Multiply by the exponent and subtract one from the exponent.</li>
    </ul>
```

## Type 2: `cloze`

Use `cloze` when the prompt is a source passage with inline hidden spans.

### Required Fields

```yaml
type: cloze
text: content-with-cloze-elements
```

### Additional Fields

```yaml
context: content
extra: content
media: [media-ref]
```

Cloze content uses a `span` with a non-empty `data-cloze` ID:

```html
<span data-cloze="c1">answer</span>
<span data-cloze="c1" data-hint="hint">answer</span>
```

The element content is the answer. It may contain safe inline HTML. Repeated IDs
belong to the same card.

### Example

```yaml
- id: rust-ownership-cloze
  type: cloze
  text: |
    <p>In Rust, each value has
    <span data-cloze="c1" data-hint="count + noun">one owner</span> at a time,
    and when the owner goes out of scope, the value is
    <span data-cloze="c2" data-hint="cleanup action">dropped</span>.</p>
  extra: |
    <p>This is the core ownership rule that lets Rust avoid a garbage collector.</p>
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
    answer: html-fragment
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
    answer: html-fragment
    hint: html-fragment
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
    <p>Review the relative position of each structure, not only the label name.</p>
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
Importers may preserve safe learner-facing HTML, but must discard source
templates, CSS, JavaScript, renderer preferences, and widget configuration.
Preserve useful content, media, links, and audit metadata instead.

## Validation Rules

A validator should check:

- `deck.yaml` exists and its `format` is supported.
- Every note has a stable ID, a supported type, and its required fields.
- IDs are unique within the deck.
- Asset references exist and stay inside the deck root.
- Every HTML content value is a string or valid content block list.
- Every HTML fragment uses only allowed elements, attributes, and URL protocols.
- Content blocks have a supported role and contain `html` or media.
- Media is valid on both notes and content blocks.
- Prompt-response notes have a prompt and answer.
- Cloze notes have at least one valid `data-cloze` element.
- Occlusion masks have valid geometry.

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
- Safe semantic HTML.
- Code blocks and native MathML.
- Accessibility labels.
- Empty optional fields.

The renderer must not require deck authors to manage layout.

## Format Identifier

The format string identifies the Open Deck format:

```yaml
format: open-deck
```

Compatibility rules:

- Canonical validators should reject unknown schema fields so typos and stale
  fields are caught early.
- Readers may ignore unknown keys inside `provenance`.
- Readers must reject unknown required `type` values.
- Unknown note types are invalid.
- Native deck behavior must not depend on `provenance`.

## Minimum Reader Support

A conforming reader should support:

- Directory and zip loading.
- `deck.yaml` and `notes/*.yaml`.
- Local assets.
- `prompt_response`, `cloze`, and `occlusion`.
- Safe HTML fragments and content blocks.
- Validation errors with file paths and note IDs.

Do not build a template engine.

## Safe HTML Rendering

Card content is an HTML fragment or a list of generic labeled blocks whose
`html` values are fragments. HTML is content syntax, not a layout or template
system.

Readers must parse fragments with an HTML parser. String matching is not enough
to validate nested elements, encoded URLs, or malformed markup. Import validation
must reject content outside the allowlist in [Safe HTML](#safe-html).

Before rendering, readers must sanitize the fragment again and insert only the
sanitized result. This second pass protects the page if stored data bypassed or
predates import validation:

```text
HTML fragment
  -> parse and validate during import
  -> store
  -> sanitize before DOM insertion
```

The app supplies all CSS. It may style semantic elements and content-block roles,
but deck content cannot select classes, set styles, or run code. The app also
owns external-link behavior, syntax highlighting, media controls, responsive
layout, and accessibility defaults.

Math uses the allowed native MathML subset. TeX delimiters and
renderer-specific formula extensions are not part of Open Deck.
