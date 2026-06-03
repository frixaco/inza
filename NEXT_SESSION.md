# Next Session Prompt

Use this file to start a new Codex session for the Rust Book Anki deck.

## Start A New Session

From a terminal:

```sh
cd /Users/frixa/Documents/manki
codex -C /Users/frixa/Documents/manki
```

In the new Codex session, send this prompt:

```text
We are in /Users/frixa/Documents/manki.

Build a complete official Rust Book Anki deck from ./rust-book, following ./rust-learning-deck-requirements.md as the full source-of-truth spec and ./deck-build/requirements-checklist.md as the compact checklist.

Important current state:
- Extraction pass is complete for all 111 coverage entries.
- There are currently 0 drafted cards.
- deck-build/coverage.json has all entries status "extracted" and card_count 0.
- The card pass should begin at the first extracted zero-card entry in coverage order: title-page.
- deck-build/schema/card.schema.yaml has been corrected to require source_version and source_concept. Do not remove those fields.
- rust-book shows as modified/submodule state; do not touch or revert it unless explicitly asked.

Workflow:
1. Read deck-build/README.md, deck-build/requirements-checklist.md, rust-learning-deck-requirements.md as needed, and deck-build/coverage.json.
2. Since no not_started entries remain, pick the first entry with status extracted and card_count 0.
3. Read the exact Rust Book source file and the matching deck-build/chapter-notes file before drafting.
4. Draft final cards only for that one section, using deck-build/schema/card.schema.yaml.
5. Every card must include:
   - id
   - chapter
   - section
   - source_file
   - source_version
   - source_concept
   - requirement_refs with at least one CH-* or Appendix ref and at least one MR-* ref
   - card_type
   - difficulty
   - compile_status
   - front
   - back
   - tags including rust-book, chapter tag, section tag, card type, difficulty, and compile status
6. Keep cards atomic, source-mapped, and specific. Reject vague cards like "Explain Rust" or "Chapter X talks about this more."
7. For complete Rust snippets, run real compile validation with rustc unless the card is intentionally compile_fail.
8. Update deck-build/cards/*.yaml, deck-build/coverage.json, and deck-build/validation-report.md with exact progress.
9. Run focused validation:
   - YAML parse
   - required fields
   - source_version and source_concept present
   - CH/MR refs present
   - tag coverage
   - allowed metadata values
   - duplicate IDs/fronts
   - banned prompt patterns
   - coverage card_count consistency
   - rustc checks for complete Rust snippets
   - git diff --check
10. Stop at a clean checkpoint after validating the section. Report total cards, coverage status counts, next target, and any tests/checks run.

Start with title-page.
```
