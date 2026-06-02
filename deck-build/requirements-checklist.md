# Compact Requirements Checklist

This is the working checklist derived from `../rust-learning-deck-requirements.md`. The full requirements file remains the source of truth.

## Per Section

- Source mapped to Rust Book file and section.
- Concrete learning objectives extracted before writing cards.
- No vague placeholder such as "Chapter X talks about this more."
- Includes concept, syntax, failure mode, comparison, or project decision where relevant.
- Current Rust Book syntax and Rust 2024 idioms used.
- Any skipped section has a specific reason.

## Per Card

- Atomic: one primary recall or reasoning target.
- Has `card_type`: `syntax`, `prediction`, `diagnostic`, `transformation`, `concept_boundary`, `api_recall`, `invariant`, `comparison`, or `project_architecture`.
- Has source metadata: chapter, section, source file, and requirement refs.
- Has difficulty metadata.
- Has compile status: `compiles`, `compile_fail`, `concept_only`, or `shell`.
- Answer includes the reason or rule, not only the result.
- Complete Rust snippets compile, unless intentionally marked `compile_fail`.
- Pseudo-code does not appear in a `rust` code fence.
- No accidental typos in code.
- No old syntax presented as current syntax.

## Required Cross-Cutting Coverage

- `String` vs `&str`.
- Move vs copy vs clone.
- `match` vs `if let` vs `let...else`.
- `unwrap` vs `expect` vs `?`.
- Generics vs trait objects.
- `iter` vs `iter_mut` vs `into_iter`.
- `Box<T>` vs `Rc<T>` vs `RefCell<T>` vs `Arc<T>`.
- Threads vs async tasks.
- Safe abstraction vs unsafe implementation.
- Declarative macros vs procedural macros.

## Required Gap Closures From Reviewed Deck

- Chapter 17 async, await, futures, streams, tasks, runtimes, `Pin`, and `Unpin`.
- `let...else`.
- Chapter 20 macros, including `macro_rules!` and procedural macros.
- Chapter 21 multithreaded web server project.
- Rust 2024 editions and `edition = "2024"`.
- Current unsafe FFI: `unsafe extern` and `#[unsafe(no_mangle)]`.

## Release Gates

- Parser/import check passes.
- Rust snippet compile checks pass.
- Compile-fail checks pass.
- Duplicate-front detection passes.
- Spell/typo scan passes.
- Anki render/import smoke test passes.
- At least one card sample from every chapter tag has been reviewed.
- No required chapter has zero cards.

