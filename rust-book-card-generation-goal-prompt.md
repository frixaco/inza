# Rust Book Card Generation Goal Prompt

```text
/goal Read rust-learning-deck-requirements.md fully first, then use it as the binding card-quality spec to create Rust Book learning cards from rust-book/. Work through the book chapter by chapter and section by section, in source order.

Write YAML card files into rust-book-cards/. Split output by Rust Book section:

- rust-book-cards/ch01_getting_started.yaml
- rust-book-cards/ch01_installation.yaml
- rust-book-cards/ch02_guessing_game.yaml
- rust-book-cards/ch09_unrecoverable_errors_with_panic.yaml

Use lowercase filenames with this pattern:

chXX_short_section_slug.yaml

Use two-digit chapter numbers: ch01, ch02, ..., ch21. Use short, readable section slugs. If a source file contains multiple meaningful subsections, keep them in the same section file unless splitting would clearly improve reviewability.

Each YAML file should contain a top-level list of cards with this simple schema:

- id: rust-book-chXX-section-slug-NNN
  chapter: "Chapter X: Title"
  section: "Section title"
  source: "rust-book/src/path/to/file.md"
  card_type: definition | misconception | syntax | prediction | diagnostic | transformation | evolution | concept_boundary | api_recall | invariant | comparison | project_architecture
  front: |
    ...
  back: |
    ...
  compile_status: compiles | expected_failure | excerpt | concept_only | non_rust
  tags:
    - rust-book
    - chXX
    - section-slug
    - card-type

Requirements:
- Follow rust-learning-deck-requirements.md exactly; do not add deck infrastructure requirements or overcomplicate the schema.
- Read the whole requirements doc before writing cards.
- Use the local rust-book/ source, including mdBook includes/listings where needed.
- Resolve {{#include ...}} and {{#rustdoc_include ...}} before deciding card content.
- Do not turn raw mdBook directives, hidden doctest lines, figure markup, or source artifacts into card text.
- Create high-quality card content, not coverage filler.
- For every section, identify the important Rust facts, rules, syntax, diagnostics, misconceptions, contrasts, and code behaviors worth remembering.
- Turn long explanatory paragraphs into small clusters of bounded cards instead of one large card.
- Do not silently drop important theory/fact claims such as definitions, mechanisms, consequences, or boundaries.
- Each card must test one primary target and stand alone out of order.
- Keep answers minimal but complete, usually 1-5 sentences or a small code block plus reason.
- Prefer prediction, diagnostic, contrast, misconception, transformation, and bounded theory cards over vague "explain X" cards.
- Mark invalid Rust examples as expected_failure and explain the violated rule.
- Respect fence attributes like does_not_compile, compile_fail, no_run, ignore, and noplayground.
- Label non-Rust snippets correctly; do not put console/shell/HTML/output inside rust fences.
- For unsafe Rust, state the unsafe operation, the safety obligation, and who must uphold it.
- Preserve teaching caveats so beginner simplifications do not become false standalone advice.
- Avoid duplicate or near-duplicate cards unless the distinction is intentional and visible.
- Keep each section file focused on cards from that section only.
- Verify every YAML file parses before finishing.
- After finishing, report total card count, card count by chapter, generated file count, and any sections intentionally skipped with reasons.
```
