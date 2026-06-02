# Validation Report

Status: in progress.

## Source Versions

- Requirements: `../rust-learning-deck-requirements.md`
- Rust Book: see `coverage.json.metadata.rust_book_commit`
- Coverage inventory generated from: `../rust-book/src/SUMMARY.md`

## Chapter Results

| Chapter | Status | Notes |
|---|---|---|
| Front Matter | extracted | All 2 sections extracted; no final cards drafted yet. |
| CH-00 | extracted | All 1 section extracted; no final cards drafted yet. |
| CH-01 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-02 | extracted | All 1 section extracted; no final cards drafted yet. |
| CH-03 | extracted | All 6 sections extracted; no final cards drafted yet. |
| CH-04 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-05 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-06 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-07 | extracted | All 6 sections extracted; no final cards drafted yet. |
| CH-08 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-09 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-10 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-11 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-12 | extracted | All 7 sections extracted; no final cards drafted yet. |
| CH-13 | extracted | All 5 sections extracted; no final cards drafted yet. |
| CH-14 | extracted | All 6 sections extracted; no final cards drafted yet. |
| CH-15 | extracted | All 7 sections extracted; no final cards drafted yet. |
| CH-16 | extracted | All 5 sections extracted; no final cards drafted yet. |
| CH-17 | extracted | All 7 sections extracted; no final cards drafted yet. |
| CH-18 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-19 | extracted | All 4 sections extracted; no final cards drafted yet. |
| CH-20 | extracted | All 6 sections extracted; no final cards drafted yet. |
| CH-21 | extracted | All 4 sections extracted; no final cards drafted yet. |
| Appendices | extracted | All 8 appendix sections extracted; no final cards drafted yet. |

## Reset Note

- Card drafts were reset on 2026-06-02 per user request. Extraction notes and coverage inventory were preserved; all card YAML files are empty stubs again.

## Open QA Items

- Define final export format after first chapter card draft stabilizes.
- Add automated card validation scripts after schema and first cards are stable.
- Decide whether chapter notes are kept long-term or compacted after cards are validated.

## Progress Log

### 2026-06-02 - Extraction: `title-page`

- Source read: `../rust-book/src/title-page.md`.
- Notes updated: `./chapter-notes/front-matter.md`.
- Coverage updated: `title-page` set to `extracted`.
- Extracted candidate content: Rust 1.90.0 or later assumption, `edition = "2024"` Cargo manifest assumption, Rust 2024 idiom boundary, and offline book access with `rustup doc --book`.
- Final cards drafted: no.
- Remaining front matter work: `foreword` is the next `not_started` coverage entry.

### 2026-06-02 - Extraction: `foreword`

- Source read: `../rust-book/src/foreword.md`.
- Notes updated: `./chapter-notes/front-matter.md`.
- Coverage updated: `foreword` set to `extracted`.
- Extracted candidate content: Rust's memory safety plus fast performance value proposition, friendly compiler and tooling, reliable-code goal, systems programming research roots, community practice, and syntax-only learning vs design/community learning boundary.
- Final cards drafted: no.
- Remaining front matter work: none; next `not_started` coverage entry is `ch00-00-introduction`.

### 2026-06-02 - Extraction: `ch00-00-introduction`

- Source read: `../rust-book/src/ch00-00-introduction.md`.
- Notes updated: `./chapter-notes/ch00.md`.
- Coverage updated: `ch00-00-introduction` set to `extracted`.
- Extracted candidate content: Rust's high-level ergonomics and low-level control balance, safety/productivity and speed/ergonomics goals, compiler gatekeeper role, systems-programming tooling, intended audiences, concept vs project chapter structure, project chapter map, compiler-feedback workflow, intentional non-compiling/panicking/undesired-behavior examples, and roadmap topics including `let...else`, async, unsafe/macros, multithreaded web server, and editions.
- Final cards drafted: no.
- Remaining CH-00 work: no more CH-00 source sections in coverage; next `not_started` coverage entry is `ch01-00-getting-started`.

### 2026-06-02 - Extraction: `ch01-00-getting-started`

- Source read: `../rust-book/src/ch01-00-getting-started.md`.
- Notes updated: `./chapter-notes/ch01.md`.
- Coverage updated: `ch01-00-getting-started` set to `extracted`.
- Extracted candidate content: Chapter 1 scope, installing Rust as the setup path, first `Hello, world!` program, and `cargo` as Rust's package manager and build system.
- Final cards drafted: no.
- Remaining CH-01 work: `ch01-01-installation`, `ch01-02-hello-world`, and `ch01-03-hello-cargo` remain `not_started`; next coverage entry is `ch01-01-installation`.

### 2026-06-02 - Extraction: `ch01-01-installation`

- Source read: `../rust-book/src/ch01-01-installation.md`.
- Notes updated: `./chapter-notes/ch01.md`.
- Coverage updated: `ch01-01-installation` set to `extracted`.
- Extracted candidate content: `rustup` purpose and install path, command prompt notation, stable compiler guarantee, Linux/macOS install command, linker and C compiler requirements, Windows Visual Studio/native library requirement, `rustc --version` verification and output shape, platform-specific PATH diagnostics, `rustup update`, `rustup self uninstall`, `rustup doc`, editor assumptions, API documentation use, and offline dependency caching with `cargo new`, `cargo add rand@0.8.5 trpl@0.2.0`, and `--offline`.
- Final cards drafted: no.
- Remaining CH-01 work: `ch01-02-hello-world` and `ch01-03-hello-cargo` remain `not_started`; next coverage entry is `ch01-02-hello-world`.

### 2026-06-02 - Extraction: `ch01-02-hello-world`

- Source read: `../rust-book/src/ch01-02-hello-world.md`.
- Notes updated: `./chapter-notes/ch01.md`.
- Coverage updated: `ch01-02-hello-world` set to `extracted`.
- Extracted candidate content: project directory setup commands, Rust source file naming with `.rs`, Listing 1-1 complete `main.rs`, `fn main` anatomy, curly-brace style, `rustfmt`, `println!` as a macro, string argument and semicolon behavior, direct `rustc main.rs` compilation, platform-specific run commands, generated executable/debug files, compilation vs execution, ahead-of-time compilation, and direct `rustc` vs Cargo workflow boundary.
- Final cards drafted: no.
- Remaining CH-01 work: `ch01-03-hello-cargo` remains `not_started`; next coverage entry is `ch01-03-hello-cargo`.

### 2026-06-02 - Extraction: `ch01-03-hello-cargo`

- Source read: `../rust-book/src/ch01-03-hello-cargo.md`.
- Notes updated: `./chapter-notes/ch01.md`.
- Coverage updated: `ch01-03-hello-cargo` set to `extracted`.
- Extracted candidate content: Cargo as build system and package manager, dependency/crate terminology, `cargo --version`, `cargo new hello_cargo`, generated Git behavior, `Cargo.toml` TOML format, `[package]`, `name`, `version`, `edition = "2024"`, `[dependencies]`, generated `src/main.rs`, Cargo source/top-level layout conventions, `cargo init`, `cargo build`, debug executable paths, `Cargo.lock`, `cargo run`, rebuild-skipping behavior, `cargo check` and why it is faster, OS-independent Cargo commands, `cargo build --release`, `target/release`, release optimization tradeoffs, benchmarking guidance, and existing-project Cargo workflow.
- Final cards drafted: no.
- Remaining CH-01 extraction work: none; next coverage entry is `ch02-00-guessing-game-tutorial`.

### 2026-06-02 - Extraction: `ch02-00-guessing-game-tutorial`

- Source read: `../rust-book/src/ch02-00-guessing-game-tutorial.md`.
- Concrete listings read: Chapter 2 listing files under `../rust-book/listings/ch02-guessing-game-tutorial/`, including Listings 2-1 through 2-6 and intermediate warning/error outputs.
- Notes updated: `./chapter-notes/ch02.md`.
- Coverage updated: `ch02-00-guessing-game-tutorial` set to `extracted`.
- Extracted candidate content: guessing-game project behavior, Cargo setup and iteration, `use std::io`, mutable `String` input buffer, `stdin().read_line(&mut guess)`, why `read_line` appends, references and `&mut`, `Result`/`Ok`/`Err`/`expect`, unused-`Result` warning, `println!` placeholders, adding `rand = "0.8.5"`, SemVer and `Cargo.lock`, `cargo update`, `rand::Rng`, `thread_rng`, `gen_range(1..=100)`, `cargo doc --open`, `Ordering`, `cmp`, `match` arms, Listing 2-4 E0308 compile-fail, shadowing `guess`, `trim`, `parse`, `u32` type annotation and inference, infinite `loop`, `break` on win, invalid-input panic, `Err(_) => continue`, and final Listing 2-6 with the secret-number print removed.
- Final cards drafted: no.
- Remaining CH-02 extraction work: none; next coverage entry is `ch03-00-common-programming-concepts`.

### 2026-06-02 - Extraction: `ch03-00-common-programming-concepts`

- Source read: `../rust-book/src/ch03-00-common-programming-concepts.md`.
- Notes updated: `./chapter-notes/ch03.md`.
- Coverage updated: `ch03-00-common-programming-concepts` set to `extracted`.
- Extracted candidate content: CH-03 scope as common programming-language concepts in Rust, topic roadmap for variables, basic types, functions, comments, and control flow, Rust-convention boundary, keyword reservation rule, and currently meaningful vs future-reserved keyword distinction.
- Final cards drafted: no.
- Remaining CH-03 extraction work: `ch03-01-variables-and-mutability`, `ch03-02-data-types`, `ch03-03-how-functions-work`, `ch03-04-comments`, and `ch03-05-control-flow` remain `not_started`; next coverage entry is `ch03-01-variables-and-mutability`.

### 2026-06-02 - Extraction: `ch03-01-variables-and-mutability`

- Source read: `../rust-book/src/ch03-01-variables-and-mutability.md`.
- Concrete listings read: `../rust-book/listings/ch03-common-programming-concepts/no-listing-01-variables-are-immutable` through `no-listing-05-mut-cant-change-types`, including E0384 and E0308 compiler outputs.
- Notes updated: `./chapter-notes/ch03.md`.
- Coverage updated: `ch03-01-variables-and-mutability` set to `extracted`.
- Extracted candidate content: variables immutable by default, `mut` opt-in and reader intent, E0384 immutable reassignment diagnostic, constants vs immutable variables, `const` syntax and required type annotation, constant scope and constant-expression limits, uppercase constant naming convention, shadowing with repeated `let`, nested-scope shadow behavior, shadowing vs mutation, shadowing type changes, and E0308 failure when trying to change a mutable variable from `&str` to `usize`.
- Final cards drafted: no.
- Remaining CH-03 extraction work: `ch03-02-data-types`, `ch03-03-how-functions-work`, `ch03-04-comments`, and `ch03-05-control-flow` remain `not_started`; next coverage entry is `ch03-02-data-types`.

### 2026-06-02 - Extraction: `ch03-02-data-types`

- Source read: `../rust-book/src/ch03-02-data-types.md`.
- Concrete listings read: CH-03 data-type listings under `../rust-book/listings/ch03-common-programming-concepts/`, including parse annotation error output, floating-point, numeric operations, Boolean, char, tuple, array, and invalid array access examples.
- Notes updated: `./chapter-notes/ch03.md`.
- Coverage updated: `ch03-02-data-types` set to `extracted`.
- Extracted candidate content: static typing and type inference, E0284 missing parse type annotation diagnostic, scalar vs compound type boundary, integer type table, signed/unsigned range formulas and examples, `isize`/`usize`, integer literal forms and suffixes, `_` numeric separators, `i32` default, integer overflow debug vs release behavior and explicit overflow method families, `f32`/`f64` defaults, IEEE-754, numeric operators and integer division truncation, `bool`, `char` as 4-byte Unicode scalar value, tuples, tuple destructuring and indexing, unit `()`, arrays, array vs vector boundary, array type syntax, repeated initialization, indexing, out-of-bounds runtime panic, and Rust's memory-safety bounds check.
- Final cards drafted: no.
- Remaining CH-03 extraction work: `ch03-03-how-functions-work`, `ch03-04-comments`, and `ch03-05-control-flow` remain `not_started`; next coverage entry is `ch03-03-how-functions-work`.

### 2026-06-02 - Extraction: `ch03-03-how-functions-work`

- Source read: `../rust-book/src/ch03-03-how-functions-work.md`.
- Concrete listings read: CH-03 function listings under `../rust-book/listings/ch03-common-programming-concepts/`, including `no-listing-16-functions` through `no-listing-23-statements-dont-return-values` and Listing 3-1, with statement/expression and semicolon E0308 outputs.
- Notes updated: `./chapter-notes/ch03.md`.
- Coverage updated: `ch03-03-how-functions-work` set to `extracted`.
- Extracted candidate content: `fn` definitions and calls, `main` as entry point, snake_case convention, definition order vs visible scope, parameters vs arguments, required parameter type annotations, comma-separated parameters, statement vs expression rules, `let` statement assignment failure, block expressions and tail expressions, `->` return types, implicit final-expression returns, early `return` boundary, semicolon-to-statement behavior, and E0308 expected `i32` found `()` diagnostic.
- Final cards drafted: no.
- Remaining CH-03 extraction work: `ch03-04-comments` and `ch03-05-control-flow` remain `not_started`; next coverage entry is `ch03-04-comments`.

### 2026-06-02 - Extraction: `ch03-04-comments`

- Source read: `../rust-book/src/ch03-04-comments.md`.
- Concrete listings read: `../rust-book/listings/ch03-common-programming-concepts/no-listing-24-comments-end-of-line/src/main.rs` and `../rust-book/listings/ch03-common-programming-concepts/no-listing-25-comments-above-line/src/main.rs`.
- Notes updated: `./chapter-notes/ch03.md`.
- Coverage updated: `ch03-04-comments` set to `extracted`.
- Extracted candidate content: comments as reader-facing source text ignored by the compiler, idiomatic `//` ordinary comments, end-of-line comment span, multi-line comments requiring `//` on each line, end-of-line comments vs more common above-line comments, and documentation comments as a separate kind deferred to Chapter 14.
- Final cards drafted: no.
- Remaining CH-03 extraction work: `ch03-05-control-flow` remains `not_started`; next coverage entry is `ch03-05-control-flow`.

### 2026-06-02 - Extraction: `ch03-05-control-flow`

- Source read: `../rust-book/src/ch03-05-control-flow.md`.
- Concrete listings read: CH-03 control-flow listings under `../rust-book/listings/ch03-common-programming-concepts/`, including `no-listing-26-if-true` through `no-listing-34-for-range`, Listing 3-2, Listing 3-3, Listing 3-4, and Listing 3-5, with E0308 outputs for non-Boolean `if` conditions and incompatible `if`/`else` arm types.
- Notes updated: `./chapter-notes/ch03.md`.
- Coverage updated: `ch03-05-control-flow` set to `extracted`.
- Extracted candidate content: `if` expressions, Boolean-only conditions, explicit nonzero comparisons, `else` and `else if`, first-true branch execution, assigning `if` expression results with `let`, same-type branch value requirement, `loop`, `break`, `continue`, loop-return values, `return` vs `break`, loop labels, `while`, index-based collection iteration risks, safer `for` collection iteration, range countdowns with `rev`, and CH-03 practice prompts for temperature conversion, nth Fibonacci, and repeated-song lyrics.
- Final cards drafted: no.
- Remaining CH-03 extraction work: none; next coverage entry is `ch04-00-understanding-ownership`.

### 2026-06-02 - Extraction: `ch04-00-understanding-ownership`

- Source read: `../rust-book/src/ch04-00-understanding-ownership.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch04.md`.
- Coverage updated: `ch04-00-understanding-ownership` set to `extracted`.
- Extracted candidate content: ownership as Rust's most unique feature, ownership's deep implications for the language, memory safety guarantees without needing a garbage collector, and CH-04 roadmap topics of borrowing, slices, and how Rust lays data out in memory.
- Final cards drafted: no.
- Remaining CH-04 extraction work: `ch04-01-what-is-ownership`, `ch04-02-references-and-borrowing`, and `ch04-03-slices` remain `not_started`; next coverage entry is `ch04-01-what-is-ownership`.

### 2026-06-02 - Extraction: `ch04-01-what-is-ownership`

- Source read: `../rust-book/src/ch04-01-what-is-ownership.md`.
- Concrete listings read: CH-04 ownership listings under `../rust-book/listings/ch04-understanding-ownership/`, including Listing 4-1 through Listing 4-5, `no-listing-01-can-mutate-string` through `no-listing-06-copy`, replacement-drop example, and E0382 output for use after move.
- Notes updated: `./chapter-notes/ch04.md`.
- Coverage updated: `ch04-01-what-is-ownership` set to `extracted`.
- Extracted candidate content: ownership rules, ownership as compiler-checked memory management, stack vs heap behavior, scope validity, string literals vs heap-allocated `String`, `String::from` and `push_str`, allocation and automatic `drop`, move semantics and double-free prevention, E0382 use-after-move diagnostic, replacement assignment dropping the old value, explicit `clone`, `Copy` trait examples and limits, ownership transfer to function parameters, return-value ownership transfer, tuple return of ownership plus length, and motivation for references.
- Final cards drafted: no.
- Remaining CH-04 extraction work: `ch04-02-references-and-borrowing` and `ch04-03-slices` remain `not_started`; next coverage entry is `ch04-02-references-and-borrowing`.

### 2026-06-02 - Extraction: `ch04-02-references-and-borrowing`

- Source read: `../rust-book/src/ch04-02-references-and-borrowing.md`.
- Concrete listings read: CH-04 borrowing listings under `../rust-book/listings/ch04-understanding-ownership/`, including `no-listing-07-reference`, `no-listing-08-reference-with-annotations`, Listing 4-6, `no-listing-09-fixes-listing-04-06` through `no-listing-16-no-dangle`, and compiler outputs for E0596, E0499, E0502, and E0106.
- Notes updated: `./chapter-notes/ch04.md`.
- Coverage updated: `ch04-02-references-and-borrowing` set to `extracted`.
- Extracted candidate content: references as non-owning valid addresses, borrowing with `&`, `&String` reference parameters, dereferencing boundary, immutable references by default, mutable references with `&mut`, E0596 when mutating through `&String`, one-mutable-reference rule and E0499, immutable-plus-mutable overlap rule and E0502, data-race conditions and compile-time prevention, reference scopes ending at last use, dangling-reference prevention and E0106, owned return as the no-dangle fix, and the recap rules that references must be either one mutable or many immutable and always valid.
- Final cards drafted: no.
- Remaining CH-04 extraction work: `ch04-03-slices` remains `not_started`; next coverage entry is `ch04-03-slices`.

### 2026-06-02 - Extraction: `ch04-03-slices`

- Source read: `../rust-book/src/ch04-03-slices.md`.
- Concrete listings read: CH-04 slice listings under `../rust-book/listings/ch04-understanding-ownership/`, including Listing 4-7, Listing 4-8, `no-listing-17-slice`, `no-listing-18-first-word-slice`, `no-listing-19-slice-error`, Listing 4-9, and E0502 output for clearing a `String` while a slice remains in use.
- Notes updated: `./chapter-notes/ch04.md`.
- Coverage updated: `ch04-03-slices` set to `extracted`.
- Extracted candidate content: slices as non-owning contiguous references, the stale `usize` index problem in `first_word`, byte scanning with `as_bytes`, `iter`, `enumerate`, and `b' '`, string slice syntax and range shorthand, UTF-8 boundary rule, `first_word` returning `&str`, borrow-checker E0502 when `s.clear()` conflicts with a live slice, string literals as immutable `&str`, `&str` parameters as the more general API over `&String`, deref coercion boundary, array slices such as `&[i32]`, and the CH-04 memory-safety summary.
- Final cards drafted: no.
- Remaining CH-04 extraction work: none; next coverage entry is `ch05-00-structs`.

### 2026-06-02 - Extraction: `ch05-00-structs`

- Source read: `../rust-book/src/ch05-00-structs.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch05.md`.
- Coverage updated: `ch05-00-structs` set to `extracted`.
- Extracted candidate content: structs as custom data types for packaging and naming related values into meaningful groups, object data-attribute analogy, structs vs tuples roadmap, defining and instantiating structs, associated functions and methods, and structs/enums as domain-type building blocks for compile-time type checking.
- Final cards drafted: no.
- Remaining CH-05 extraction work: `ch05-01-defining-structs`, `ch05-02-example-structs`, and `ch05-03-method-syntax` remain `not_started`; next coverage entry is `ch05-01-defining-structs`.

### 2026-06-02 - Extraction: `ch05-01-defining-structs`

- Source read: `../rust-book/src/ch05-01-defining-structs.md`.
- Concrete listings read: CH-05 struct-definition listings under `../rust-book/listings/ch05-using-structs-to-structure-related-data/`, including Listings 5-1 through 5-7, `no-listing-01-tuple-structs`, `no-listing-04-unit-like-structs`, and `no-listing-02-reference-in-struct` with E0106 output.
- Notes updated: `./chapter-notes/ch05.md`.
- Coverage updated: `ch05-01-defining-structs` set to `extracted`.
- Extracted candidate content: struct definitions and field declarations, struct instances with `key: value` pairs, field order independence, dot notation, whole-instance mutability, implicit struct returns, field init shorthand, struct update syntax with `..user1`, move/copy effects of struct update, tuple structs and type distinction, unit-like structs, owned `String` fields vs borrowed `&str` fields, and E0106 missing lifetime specifier for reference fields.
- Final cards drafted: no.
- Remaining CH-05 extraction work: `ch05-02-example-structs` and `ch05-03-method-syntax` remain `not_started`; next coverage entry is `ch05-02-example-structs`.

### 2026-06-02 - Extraction: `ch05-02-example-structs`

- Source read: `../rust-book/src/ch05-02-example-structs.md`.
- Concrete listings read: CH-05 rectangle/refactor and debug-formatting listings under `../rust-book/listings/ch05-using-structs-to-structure-related-data/`, including Listings 5-8 through 5-12, `output-only-01-debug`, `output-only-02-pretty-debug`, and `no-listing-05-dbg-macro` outputs.
- Notes updated: `./chapter-notes/ch05.md`.
- Coverage updated: `ch05-02-example-structs` set to `extracted`.
- Extracted candidate content: rectangle area refactor from separate dimensions to tuple to `Rectangle`, named-field clarity, borrowing `&Rectangle` so `main` keeps ownership, field access through borrowed structs, E0277 missing `Display` and missing `Debug` diagnostics, `#[derive(Debug)]`, `{:?}` vs `{:#?}`, `dbg!` ownership/return behavior, file/line output, `stderr`, and borrowing with `dbg!(&rect1)`.
- Final cards drafted: no.
- Remaining CH-05 extraction work: `ch05-03-method-syntax` remains `not_started`; next coverage entry is `ch05-03-method-syntax`.

### 2026-06-02 - Extraction: `ch05-03-method-syntax`

- Source read: `../rust-book/src/ch05-03-method-syntax.md`.
- Concrete listings read: CH-05 method and associated-function listings under `../rust-book/listings/ch05-using-structs-to-structure-related-data/`, including Listings 5-13 through 5-16, `no-listing-06-method-field-interaction`, `no-listing-03-associated-functions`, and the inline automatic receiver adjustment example.
- Notes updated: `./chapter-notes/ch05.md`.
- Coverage updated: `ch05-03-method-syntax` set to `extracted`.
- Extracted candidate content: method syntax, `impl Rectangle`, `&self` as `self: &Self`, receiver forms `&self`/`&mut self`/`self`, method-call syntax, same-name field and method disambiguation, getters, automatic referencing/dereferencing for method receivers instead of `->`, `can_hold(&self, other: &Rectangle)`, associated functions without `self`, `Rectangle::square(3)`, `Self`, `::`, and multiple `impl` blocks.
- Final cards drafted: no.
- Remaining CH-05 extraction work: none; CH-05 extraction pass complete. Next coverage entry is `ch06-00-enums`.

### 2026-06-02 - Extraction: `ch06-00-enums`

- Source read: `../rust-book/src/ch06-00-enums.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch06.md`.
- Coverage updated: `ch06-00-enums` set to `extracted`.
- Extracted candidate content: enums as types defined by enumerating possible variants, enums encoding meaning along with data, `Option` as a something-or-nothing enum, `match` as expression-based branching over enum values, `if let` as a concise enum-handling idiom, and the CH-06 roadmap.
- Final cards drafted: no.
- Remaining CH-06 extraction work: `ch06-01-defining-an-enum`, `ch06-02-match`, and `ch06-03-if-let` remain `not_started`; next coverage entry is `ch06-01-defining-an-enum`.

### 2026-06-02 - Extraction: `ch06-01-defining-an-enum`

- Source read: `../rust-book/src/ch06-01-defining-an-enum.md`.
- Requirements context read: CH-06 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: CH-06 enum and `Option` listings under `../rust-book/listings/ch06-enums-and-pattern-matching/`, including Listing 6-1, Listing 6-2, `no-listing-01-defining-enums` through `no-listing-07-cant-use-option-directly`, and E0277 output for `i8 + Option<i8>`.
- Notes updated: `./chapter-notes/ch06.md`.
- Coverage updated: `ch06-01-defining-an-enum` set to `extracted`.
- Extracted candidate content: enum alternatives vs structs, `IpAddrKind` variants, namespaced variant paths with `::`, variants as values of one enum type, variants with associated data, variant constructors, variants with different data types and arities, standard-library-style `IpAddr`, `Message` variants with no data/named fields/tuple data, methods on enums, `Option<T>`, `Some`, `None`, prelude behavior, generic `T` overview, `None` type annotation, null comparison, explicit `Option` handling, and E0277 for direct `Option<i8>` arithmetic.
- Final cards drafted: no.
- Remaining CH-06 extraction work: `ch06-02-match` and `ch06-03-if-let` remain `not_started`; next coverage entry is `ch06-02-match`.

### 2026-06-02 - Extraction: `ch06-02-match`

- Source read: `../rust-book/src/ch06-02-match.md`.
- Requirements context read: CH-06 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: CH-06 match listings under `../rust-book/listings/ch06-enums-and-pattern-matching/`, including Listings 6-3 through 6-5, `no-listing-08-match-arm-multiple-lines`, `no-listing-09-variable-in-pattern`, `no-listing-10-non-exhaustive-match` with E0004 output, and catch-all examples `no-listing-15` through `no-listing-17`.
- Notes updated: `./chapter-notes/ch06.md`.
- Coverage updated: `ch06-02-match` set to `extracted`.
- Extracted candidate content: `match` expression structure, matched expression vs Boolean `if` conditions, match arms with patterns/code/`=>`/commas, first matching arm order, arm expression return values, multi-line arm blocks, binding enum payloads with `Coin::Quarter(state)`, matching `Option<T>` with `None` and `Some(i)`, E0004 non-exhaustive match missing `None`, named catch-all `other`, `_` catch-all without binding, `_ => ()`, and catch-all ordering.
- Final cards drafted: no.
- Remaining CH-06 extraction work: `ch06-03-if-let` remains `not_started`; next coverage entry is `ch06-03-if-let`.

### 2026-06-02 - Extraction: `ch06-03-if-let`

- Source read: `../rust-book/src/ch06-03-if-let.md`.
- Requirements context read: CH-06 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: CH-06 concise-control-flow listings under `../rust-book/listings/ch06-enums-and-pattern-matching/`, including Listing 6-6, `no-listing-12-if-let`, `no-listing-13-count-and-announce-match`, `no-listing-14-count-and-announce-if-let-else`, and Listings 6-7 through 6-9.
- Notes updated: `./chapter-notes/ch06.md`.
- Coverage updated: `ch06-03-if-let` set to `extracted`.
- Extracted candidate content: `if let` as concise one-pattern matching, transformation from `match` with `_ => ()`, pattern/expression syntax, exhaustiveness trade-off versus `match`, `if let ... else` as equivalent to a `match` `_` arm, nested `if let` versus value-producing `if let`, `let...else` syntax with early-return `else`, outer-scope binding on success, happy-path readability, and choosing among `match`, `if let`, and `let...else`.
- Final cards drafted: no.
- Remaining CH-06 extraction work: none; CH-06 extraction pass complete. Next coverage entry is `ch07-00-managing-growing-projects-with-packages-crates-and-modules`.

### 2026-06-02 - Extraction: `ch07-00-managing-growing-projects-with-packages-crates-and-modules`

- Source read: `../rust-book/src/ch07-00-managing-growing-projects-with-packages-crates-and-modules.md`.
- Requirements context read: CH-07 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch07.md`.
- Coverage updated: `ch07-00-managing-growing-projects-with-packages-crates-and-modules` set to `extracted`.
- Extracted candidate content: growing-project organization, progression from one module/file to modules/files/packages/crates/dependencies, package containing multiple binary crates and optionally one library crate, workspaces deferred to Chapter 14, encapsulation via public interfaces and private implementation details, scope as nested name context, duplicate-name restriction within one scope, and overview definitions of packages, crates, modules/use, and paths.
- Final cards drafted: no.
- Remaining CH-07 extraction work: `ch07-01-packages-and-crates`, `ch07-02-defining-modules-to-control-scope-and-privacy`, `ch07-03-paths-for-referring-to-an-item-in-the-module-tree`, `ch07-04-bringing-paths-into-scope-with-the-use-keyword`, and `ch07-05-separating-modules-into-different-files` remain `not_started`; next coverage entry is `ch07-01-packages-and-crates`.

### 2026-06-02 - Extraction: `ch07-01-packages-and-crates`

- Source read: `../rust-book/src/ch07-01-packages-and-crates.md`.
- Requirements context read: CH-07 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this section has shell/layout examples but no Rust code listings.
- Notes updated: `./chapter-notes/ch07.md`.
- Coverage updated: `ch07-01-packages-and-crates` set to `extracted`.
- Extracted candidate content: crate as compiler unit, crates containing modules, binary vs library crates, `main` requirement for binary crates, library crate behavior, crate root definition, package as `Cargo.toml` bundle of one or more crates, package constraints, `cargo new my-project` layout, `src/main.rs` and `src/lib.rs` crate-root conventions, package-name matching, `src/bin` multiple binary crate convention, and Cargo passing crate roots to `rustc`.
- Final cards drafted: no.
- Remaining CH-07 extraction work: `ch07-02-defining-modules-to-control-scope-and-privacy`, `ch07-03-paths-for-referring-to-an-item-in-the-module-tree`, `ch07-04-bringing-paths-into-scope-with-the-use-keyword`, and `ch07-05-separating-modules-into-different-files` remain `not_started`; next coverage entry is `ch07-02-defining-modules-to-control-scope-and-privacy`.

### 2026-06-02 - Extraction: `ch07-02-defining-modules-to-control-scope-and-privacy`

- Source read: `../rust-book/src/ch07-02-defining-modules-to-control-scope-and-privacy.md`.
- Requirements context read: CH-07 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch07-managing-growing-projects/quick-reference-example/src/main.rs`, `../rust-book/listings/ch07-managing-growing-projects/quick-reference-example/src/garden.rs`, `../rust-book/listings/ch07-managing-growing-projects/quick-reference-example/src/garden/vegetables.rs`, `../rust-book/listings/ch07-managing-growing-projects/quick-reference-example/output.txt`, and `../rust-book/listings/ch07-managing-growing-projects/listing-07-01/src/lib.rs`.
- Notes updated: `./chapter-notes/ch07.md`.
- Coverage updated: `ch07-02-defining-modules-to-control-scope-and-privacy` set to `extracted`.
- Extracted candidate content: module cheat sheet, crate-root module lookup, submodule lookup, paths gated by privacy, `use` shortcut overview, private-by-default rule, `pub mod` and basic `pub` item visibility, quick-reference `backyard` layout, `Asparagus` path, restaurant `front_of_house` grouping, Listing 7-1 inline modules, Listing 7-2 module tree, and parent/child/sibling terminology.
- Final cards drafted: no.
- Remaining CH-07 extraction work: `ch07-03-paths-for-referring-to-an-item-in-the-module-tree`, `ch07-04-bringing-paths-into-scope-with-the-use-keyword`, and `ch07-05-separating-modules-into-different-files` remain `not_started`; next coverage entry is `ch07-03-paths-for-referring-to-an-item-in-the-module-tree`.

### 2026-06-02 - Extraction: `ch07-03-paths-for-referring-to-an-item-in-the-module-tree`

- Source read: `../rust-book/src/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.md`.
- Requirements context read: CH-07 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch07-managing-growing-projects/listing-07-03/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-03/output.txt`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-05/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-05/output.txt`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-07/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-08/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-09/src/lib.rs`, and `../rust-book/listings/ch07-managing-growing-projects/listing-07-10/src/lib.rs`.
- Notes updated: `./chapter-notes/ch07.md`.
- Coverage updated: `ch07-03-paths-for-referring-to-an-item-in-the-module-tree` set to `extracted`.
- Extracted candidate content: absolute and relative paths, `crate`/`self`/`super`, `::` separators, path move tradeoffs, E0603 private module and private function diagnostics, `pub mod` plus `pub fn`, parent/child privacy rules, binary-plus-library package public API practice, `super::deliver_order`, public struct fields with private fields and constructors, and public enum variants.
- Final cards drafted: no.
- Remaining CH-07 extraction work: `ch07-04-bringing-paths-into-scope-with-the-use-keyword` and `ch07-05-separating-modules-into-different-files` remain `not_started`; next coverage entry is `ch07-04-bringing-paths-into-scope-with-the-use-keyword`.

### 2026-06-02 - Extraction: `ch07-04-bringing-paths-into-scope-with-the-use-keyword`

- Source read: `../rust-book/src/ch07-04-bringing-paths-into-scope-with-the-use-keyword.md`.
- Requirements context read: CH-07 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch07-managing-growing-projects/listing-07-11/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-12/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-12/output.txt`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-13/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-14/src/main.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-15/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-16/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-17/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/no-listing-01-use-std-unnested/src/main.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-18/src/main.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-19/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-20/src/lib.rs`, plus the referenced Chapter 2 `rand` dependency and `Rng` snippets.
- Notes updated: `./chapter-notes/ch07.md`.
- Coverage updated: `ch07-04-bringing-paths-into-scope-with-the-use-keyword` set to `extracted`.
- Extracted candidate content: `use` as scoped path shortcut, privacy checks on `use`, E0433 child-module scope failure, idiomatic function imports via parent modules, idiomatic full-path struct/enum imports, same-name import handling, `as` aliases, `pub use` re-exports, external package imports with `rand`, `std` import behavior, nested paths including `self`, glob imports, and glob import risks/use cases.
- Final cards drafted: no.
- Remaining CH-07 extraction work: `ch07-05-separating-modules-into-different-files` remains `not_started`; next coverage entry is `ch07-05-separating-modules-into-different-files`.

### 2026-06-02 - Extraction: `ch07-05-separating-modules-into-different-files`

- Source read: `../rust-book/src/ch07-05-separating-modules-into-different-files.md`.
- Requirements context read: CH-07 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch07-managing-growing-projects/listing-07-21-and-22/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/listing-07-21-and-22/src/front_of_house.rs`, `../rust-book/listings/ch07-managing-growing-projects/no-listing-02-extracting-hosting/src/lib.rs`, `../rust-book/listings/ch07-managing-growing-projects/no-listing-02-extracting-hosting/src/front_of_house.rs`, and `../rust-book/listings/ch07-managing-growing-projects/no-listing-02-extracting-hosting/src/front_of_house/hosting.rs`.
- Notes updated: `./chapter-notes/ch07.md`.
- Coverage updated: `ch07-05-separating-modules-into-different-files` set to `extracted`.
- Extracted candidate content: moving inline modules into file-backed modules, `mod front_of_house;` with `src/front_of_house.rs`, child module `hosting` with `src/front_of_house/hosting.rs`, `mod` as one-time module-tree declaration rather than include, paths and `pub use` unchanged by file moves, idiomatic and older `mod.rs` file paths, duplicate-style error risk, and CH-07 summary.
- Final cards drafted: no.
- Remaining CH-07 extraction work: none; CH-07 extraction pass complete. Next coverage entry is `ch08-00-common-collections`.

### 2026-06-02 - Extraction: `ch08-00-common-collections`

- Source read: `../rust-book/src/ch08-00-common-collections.md`.
- Requirements context read: CH-08 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch08.md`.
- Coverage updated: `ch08-00-common-collections` set to `extracted`.
- Extracted candidate content: collection definition, heap-backed grow/shrink behavior, contrast with arrays and tuples, vectors as variable-length adjacent values, strings as collections of characters, hash maps as key-associated values, collection capability/cost tradeoffs, and CH-08 roadmap.
- Final cards drafted: no.
- Remaining CH-08 extraction work: `ch08-01-vectors`, `ch08-02-strings`, and `ch08-03-hash-maps` remain `not_started`; next coverage entry is `ch08-01-vectors`.

### 2026-06-02 - Extraction: `ch08-01-vectors`

- Source read: `../rust-book/src/ch08-01-vectors.md`.
- Requirements context read: CH-08 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch08-common-collections/listing-08-01/src/main.rs` through `../rust-book/listings/ch08-common-collections/listing-08-10/src/main.rs`, plus `../rust-book/listings/ch08-common-collections/listing-08-06/output.txt`.
- Notes updated: `./chapter-notes/ch08.md`.
- Coverage updated: `ch08-01-vectors` set to `extracted`.
- Extracted candidate content: `Vec<T>` definition, `Vec::new` with type annotation, `vec!` macro and inference, `push` with `mut`, `[]` vs `get` including panic vs `None`, E0502 element reference plus `push` diagnostic, vector reallocation invalidation reason, immutable and mutable iteration, dereferencing mutable element references, enum variants in one vector, trait object boundary, and vector drop semantics.
- Final cards drafted: no.
- Remaining CH-08 extraction work: `ch08-02-strings` and `ch08-03-hash-maps` remain `not_started`; next coverage entry is `ch08-02-strings`.

### 2026-06-02 - Extraction: `ch08-02-strings`

- Source read: `../rust-book/src/ch08-02-strings.md`.
- Requirements context read: CH-08 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch08-common-collections/listing-08-11/src/main.rs` through `../rust-book/listings/ch08-common-collections/listing-08-19/src/main.rs`, `../rust-book/listings/ch08-common-collections/listing-08-19/output.txt`, `../rust-book/listings/ch08-common-collections/no-listing-01-concat-multiple-strings/src/main.rs`, `../rust-book/listings/ch08-common-collections/no-listing-02-format/src/main.rs`, and `../rust-book/listings/ch08-common-collections/output-only-01-not-char-boundary/output.txt`.
- Notes updated: `./chapter-notes/ch08.md`.
- Coverage updated: `ch08-02-strings` set to `extracted`.
- Extracted candidate content: `String` vs `str`/`&str` definitions, `String::new`, `to_string`, `String::from`, UTF-8 examples, `push_str` and `push`, `+` ownership behavior and deref coercion, `format!` returning `String` without taking ownership, E0277 integer-indexing failure, UTF-8 byte/scalar/grapheme views, string slicing char-boundary panic, `chars`/`bytes` iteration, and string complexity tradeoffs.
- Final cards drafted: no.
- Remaining CH-08 extraction work: `ch08-03-hash-maps` remains `not_started`; next coverage entry is `ch08-03-hash-maps`.

### 2026-06-02 - Extraction: `ch08-03-hash-maps`

- Source read: `../rust-book/src/ch08-03-hash-maps.md`.
- Requirements context read: CH-08 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch08-common-collections/listing-08-20/src/main.rs` through `../rust-book/listings/ch08-common-collections/listing-08-25/src/main.rs`, plus `../rust-book/listings/ch08-common-collections/no-listing-03-iterate-over-hashmap/src/main.rs`.
- Notes updated: `./chapter-notes/ch08.md`.
- Coverage updated: `ch08-03-hash-maps` set to `extracted`.
- Extracted candidate content: `HashMap<K, V>` definition, `HashMap` import and creation, `insert`, `get` with `copied`/`unwrap_or`, arbitrary-order iteration, ownership of `Copy` and owned values, reference lifetime boundary, overwrite behavior, `entry`/`or_insert` insert-if-absent behavior, word-count update with mutable reference and `*count`, SipHash/custom hasher tradeoff, and CH-08 exercises.
- Final cards drafted: no.
- Remaining CH-08 extraction work: none; CH-08 extraction pass complete. Next coverage entry is `ch09-00-error-handling`.

### 2026-06-02 - Extraction: `ch09-00-error-handling`

- Source read: `../rust-book/src/ch09-00-error-handling.md`.
- Requirements context read: CH-09 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch09.md`.
- Coverage updated: `ch09-00-error-handling` set to `extracted`.
- Extracted candidate content: error acknowledgement before compile, recoverable vs unrecoverable categories, file-not-found and array-out-of-bounds examples, Rust's no-exceptions design, `Result<T, E>` for recoverable errors, `panic!` for unrecoverable errors, and CH-09 roadmap.
- Final cards drafted: no.
- Remaining CH-09 extraction work: `ch09-01-unrecoverable-errors-with-panic`, `ch09-02-recoverable-errors-with-result`, and `ch09-03-to-panic-or-not-to-panic` remain `not_started`; next coverage entry is `ch09-01-unrecoverable-errors-with-panic`.

### 2026-06-02 - Extraction: `ch09-01-unrecoverable-errors-with-panic`

- Source read: `../rust-book/src/ch09-01-unrecoverable-errors-with-panic.md`.
- Requirements context read: CH-09 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch09-error-handling/no-listing-01-panic/src/main.rs`, `../rust-book/listings/ch09-error-handling/no-listing-01-panic/output.txt`, `../rust-book/listings/ch09-error-handling/listing-09-01/src/main.rs`, and `../rust-book/listings/ch09-error-handling/listing-09-01/output.txt`; Listing 9-2 backtrace output is inline in the source file.
- Notes updated: `./chapter-notes/ch09.md`.
- Coverage updated: `ch09-01-unrecoverable-errors-with-panic` set to `extracted`.
- Extracted candidate content: direct `panic!`, default panic output, unwinding vs aborting, `panic = 'abort'` release profile setting, out-of-bounds vector panic, buffer-overread security rationale, `RUST_BACKTRACE=1`, backtrace reading strategy, debug-symbol requirement, and first-project-frame investigation guidance.
- Final cards drafted: no.
- Remaining CH-09 extraction work: `ch09-02-recoverable-errors-with-result` and `ch09-03-to-panic-or-not-to-panic` remain `not_started`; next coverage entry is `ch09-02-recoverable-errors-with-result`.

### 2026-06-02 - Extraction: `ch09-02-recoverable-errors-with-result`

- Source read: `../rust-book/src/ch09-02-recoverable-errors-with-result.md`.
- Requirements context read: CH-09 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch09-error-handling/listing-09-03/src/main.rs` through `../rust-book/listings/ch09-error-handling/listing-09-12/src/main.rs`, `../rust-book/listings/ch09-error-handling/listing-09-04/output.txt`, `../rust-book/listings/ch09-error-handling/listing-09-10/output.txt`, `../rust-book/listings/ch09-error-handling/no-listing-04-unwrap/src/main.rs`, and `../rust-book/listings/ch09-error-handling/no-listing-05-expect/src/main.rs`; `unwrap`, `expect`, and `unwrap_or_else` output/example text is inline in the source file.
- Notes updated: `./chapter-notes/ch09.md`.
- Coverage updated: `ch09-02-recoverable-errors-with-result` set to `extracted`.
- Extracted candidate content: `Result<T, E>` shape, `File::open` `Result` types, matching `Ok`/`Err`, `ErrorKind::NotFound` handling, `unwrap_or_else` sidebar, `unwrap` and `expect` panic-on-error behavior, manual propagation with `return Err(e)`, `?` early return and `From` conversion, chained `?`, `fs::read_to_string`, E0277 for `?` in `main` returning `()`, `?` with `Option`, `Result`/`Option` conversion boundary, `main -> Result<(), Box<dyn Error>>`, exit-code behavior, and `Termination` trait note.
- Final cards drafted: no.
- Remaining CH-09 extraction work: `ch09-03-to-panic-or-not-to-panic` remains `not_started`; next coverage entry is `ch09-03-to-panic-or-not-to-panic`.

### 2026-06-02 - Extraction: `ch09-03-to-panic-or-not-to-panic`

- Source read: `../rust-book/src/ch09-03-to-panic-or-not-to-panic.md`.
- Requirements context read: CH-09 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch09-error-handling/no-listing-08-unwrap-that-cant-fail/src/main.rs`, `../rust-book/listings/ch09-error-handling/no-listing-09-guess-out-of-range/src/main.rs`, `../rust-book/listings/ch09-error-handling/listing-09-13/src/guessing_game.rs`, and `../rust-book/listings/ch09-error-handling/listing-09-13/src/main.rs`.
- Notes updated: `./chapter-notes/ch09.md`.
- Coverage updated: `ch09-03-to-panic-or-not-to-panic` set to `extracted`.
- Extracted candidate content: `Result` as default for fallible functions, appropriate panic shortcuts in examples/prototypes/tests, `expect` when human logic proves success, bad-state criteria, expected failures returning `Result`, contract violations and safety-driven panics, panic-condition documentation, type-system checks, and the `Guess` custom type with private field, checked constructor, getter, and 1-through-100 invariant.
- Final cards drafted: no.
- Remaining CH-09 extraction work: none; CH-09 extraction pass complete. Next coverage entry is `ch10-00-generics`.

### 2026-06-02 - Extraction: `ch10-00-generics`

- Source read: `../rust-book/src/ch10-00-generics.md`.
- Requirements context read: CH-10 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-01/src/main.rs`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-02/src/main.rs`, and `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-03/src/main.rs`.
- Notes updated: `./chapter-notes/ch10.md`.
- Coverage updated: `ch10-00-generics` set to `extracted`.
- Extracted candidate content: generics as abstract stand-ins, prior generic examples `Option<T>`/`Vec<T>`/`HashMap<K, V>`/`Result<T, E>`, CH-10 roadmap for generic items/traits/lifetimes, function-extraction workflow, duplicated largest-number logic, Listings 10-1 through 10-3, slice parameter and returned-reference interpretation, and later-section sourcing boundaries.
- Final cards drafted: no.
- Remaining CH-10 extraction work: `ch10-01-syntax`, `ch10-02-traits`, and `ch10-03-lifetime-syntax` remain `not_started`; next coverage entry is `ch10-01-syntax`.

### 2026-06-02 - Extraction: `ch10-01-syntax`

- Source read: `../rust-book/src/ch10-01-syntax.md`.
- Requirements context read: CH-10 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-04/src/main.rs` through `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-11/src/main.rs`, plus `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-05/output.txt` and `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-07/output.txt`.
- Notes updated: `./chapter-notes/ch10.md`.
- Coverage updated: `ch10-01-syntax` set to `extracted`.
- Extracted candidate content: generic function declaration syntax, type parameter naming conventions, duplicated `largest_i32`/`largest_char` functions, generic `largest<T>` E0369 and `PartialOrd` hint, `Point<T>` and `Point<T, U>` structs, same-type vs mixed-type fields and E0308, `Option<T>` and `Result<T, E>` enum shapes, `impl<T>` methods, concrete `impl Point<f32>`, method-level generics in `mixup`, and monomorphization/no-runtime-cost behavior.
- Final cards drafted: no.
- Remaining CH-10 extraction work: `ch10-02-traits` and `ch10-03-lifetime-syntax` remain `not_started`; next coverage entry is `ch10-02-traits`.

### 2026-06-02 - Extraction: `ch10-02-traits`

- Source read: `../rust-book/src/ch10-02-traits.md`.
- Requirements context read: CH-10 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-12/src/lib.rs` through `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-15/src/lib.rs`, plus no-listing examples `no-listing-01-calling-trait-method`, `no-listing-02-calling-default-impl`, `no-listing-03-default-impl-calls-other-methods`, `no-listing-04-traits-as-parameters`, `no-listing-05-returning-impl-trait`, `no-listing-06-impl-trait-returns-one-type`, and `no-listing-07-where-clause`.
- Notes updated: `./chapter-notes/ch10.md`.
- Coverage updated: `ch10-02-traits` set to `extracted`.
- Extracted candidate content: trait definitions and required methods, `impl TraitName for TypeName`, trait method scope imports, orphan rule/coherence, default implementations and defaults calling required methods, `impl Trait` parameters, explicit trait bounds, same-type vs different-type parameters, multiple bounds with `+`, `where` clauses, return-position `impl Trait` and single-concrete-type limitation, conditional methods with `Display + PartialOrd`, blanket implementations, and compile-time trait-bound checking.
- Final cards drafted: no.
- Remaining CH-10 extraction work: `ch10-03-lifetime-syntax` remains `not_started`; next coverage entry is `ch10-03-lifetime-syntax`.

### 2026-06-02 - Extraction: `ch10-03-lifetime-syntax`

- Source read: `../rust-book/src/ch10-03-lifetime-syntax.md`.
- Requirements context read: CH-10 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-16/src/main.rs` through `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-25/src/main.rs`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-16/output.txt`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-20/output.txt`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/listing-10-23/output.txt`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/no-listing-08-only-one-reference-with-lifetime/src/main.rs`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/no-listing-09-unrelated-lifetime/src/main.rs`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/no-listing-09-unrelated-lifetime/output.txt`, `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/no-listing-10-lifetimes-on-methods/src/main.rs`, and `../rust-book/listings/ch10-generic-types-traits-and-lifetimes/no-listing-11-generics-traits-and-lifetimes/src/main.rs`.
- Notes updated: `./chapter-notes/ch10.md`.
- Coverage updated: `ch10-03-lifetime-syntax` set to `extracted`.
- Extracted candidate content: lifetimes as generic relationship annotations, dangling-reference prevention, borrow checker scope comparison, E0597/E0106/E0515 diagnostics, `longest<'a>` function signatures, smaller-overlap return lifetime, relationship-specific annotations, struct lifetimes, lifetime elision rules, method lifetime elision, `'static` string literals and overuse warning, and combined generic type parameter/trait bound/lifetime syntax.
- Final cards drafted: no.
- Remaining CH-10 extraction work: none; CH-10 extraction pass complete. Next coverage entry is `ch11-00-testing`.

### 2026-06-02 - Extraction: `ch11-00-testing`

- Source read: `../rust-book/src/ch11-00-testing.md`.
- Requirements context read: CH-11 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch11.md`.
- Coverage updated: `ch11-00-testing` set to `extracted`.
- Extracted candidate content: testing can show bug presence but not absence, correctness definition, Rust type/borrow checking limits, `add_two` behavioral example, tests as regression checks, and CH-11 roadmap for writing tests, running tests, and organizing unit/integration tests.
- Final cards drafted: no.
- Remaining CH-11 extraction work: `ch11-01-writing-tests`, `ch11-02-running-tests`, and `ch11-03-test-organization` remain `not_started`; next coverage entry is `ch11-01-writing-tests`.

### 2026-06-02 - Extraction: `ch11-01-writing-tests`

- Source read: `../rust-book/src/ch11-01-writing-tests.md`.
- Requirements context read: CH-11 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch11-writing-automated-tests/listing-11-01/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-01/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-01-changing-test-name/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-01-changing-test-name/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-03/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-03/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-05/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-06/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-06/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-02-adding-another-rectangle-test/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-02-adding-another-rectangle-test/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-03-introducing-a-bug/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-03-introducing-a-bug/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-07/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-07/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-04-bug-in-add-two/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-04-bug-in-add-two/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-05-greeter/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-06-greeter-with-bug/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-06-greeter-with-bug/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-07-custom-failure-message/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-07-custom-failure-message/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-08/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-08/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-08-guess-with-bug/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-08-guess-with-bug/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-09/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-09-guess-with-panic-msg-bug/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-09-guess-with-panic-msg-bug/output.txt`, and `../rust-book/listings/ch11-writing-automated-tests/no-listing-10-result-in-tests/src/lib.rs`.
- Notes updated: `./chapter-notes/ch11.md`.
- Coverage updated: `ch11-01-writing-tests` set to `extracted`.
- Extracted candidate content: test function structure, `#[test]`, generated Cargo library tests, basic `cargo test` pass/fail output, panic-caused failures, `assert!`, `assert_eq!`, `assert_ne!`, `PartialEq`/`Debug` requirements, custom failure messages, `#[should_panic]`, expected panic message substrings, and tests returning `Result<(), E>`.
- Final cards drafted: no.
- Remaining CH-11 extraction work: `ch11-02-running-tests` and `ch11-03-test-organization` remain `not_started`; next coverage entry is `ch11-02-running-tests`.

### 2026-06-02 - Extraction: `ch11-02-running-tests`

- Source read: `../rust-book/src/ch11-02-running-tests.md`.
- Requirements context read: CH-11 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch11-writing-automated-tests/listing-11-10/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-10/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/output-only-01-show-output/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-11/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-11/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/output-only-02-single-test/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/output-only-03-multiple-tests/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-11-ignore-a-test/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-11-ignore-a-test/output.txt`, and `../rust-book/listings/ch11-writing-automated-tests/output-only-04-running-ignored/output.txt`.
- Notes updated: `./chapter-notes/ch11.md`.
- Coverage updated: `ch11-02-running-tests` set to `extracted`.
- Extracted candidate content: `cargo test` compiling/running test binaries, argument separation with `--`, Cargo/test-binary help, default parallel execution, shared-state interference, `--test-threads=1`, stdout capture, `--show-output`, test name and substring filtering, module-name filtering, `#[ignore]`, `--ignored`, and `--include-ignored`.
- Final cards drafted: no.
- Remaining CH-11 extraction work: `ch11-03-test-organization` remains `not_started`; next coverage entry is `ch11-03-test-organization`.

### 2026-06-02 - Extraction: `ch11-03-test-organization`

- Source read: `../rust-book/src/ch11-03-test-organization.md`.
- Requirements context read: CH-11 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch11-writing-automated-tests/listing-11-01/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-12/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-13/src/lib.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-13/tests/integration_test.rs`, `../rust-book/listings/ch11-writing-automated-tests/listing-11-13/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/output-only-05-single-integration/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-12-shared-test-code-problem/tests/common.rs`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-12-shared-test-code-problem/output.txt`, `../rust-book/listings/ch11-writing-automated-tests/no-listing-13-fix-shared-test-code-problem/tests/common/mod.rs`, and `../rust-book/listings/ch11-writing-automated-tests/no-listing-13-fix-shared-test-code-problem/tests/integration_test.rs`.
- Notes updated: `./chapter-notes/ch11.md`.
- Coverage updated: `ch11-03-test-organization` set to `extracted`.
- Extracted candidate content: unit vs integration test roles, unit tests in `src` with `#[cfg(test)]`, `cfg(test)` compile behavior, testing private functions with `use super::*`, integration tests in `tests` as separate crates using public API, `cargo test` output sections, `cargo test --test integration_test`, `tests/common.rs` helper pitfall, `tests/common/mod.rs` shared helper pattern, and binary crate library extraction rationale.
- Final cards drafted: no.
- Remaining CH-11 extraction work: none; CH-11 extraction pass complete. Next coverage entry is `ch12-00-an-io-project`.

### 2026-06-02 - Extraction: `ch12-00-an-io-project`

- Source read: `../rust-book/src/ch12-00-an-io-project.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-00-an-io-project` set to `extracted`.
- Extracted candidate content: command line I/O project goal, Rust command line tool advantages, simplified `grep` behavior, file path and search string inputs, file-read/search/print data flow, environment variable configuration goal, `stderr` vs `stdout` motivation, `ripgrep` comparison, and CH-12 roadmap.
- Final cards drafted: no.
- Remaining CH-12 extraction work: `ch12-01-accepting-command-line-arguments`, `ch12-02-reading-a-file`, `ch12-03-improving-error-handling-and-modularity`, `ch12-04-testing-the-librarys-functionality`, `ch12-05-working-with-environment-variables`, and `ch12-06-writing-to-stderr-instead-of-stdout` remain `not_started`; next coverage entry is `ch12-01-accepting-command-line-arguments`.

### 2026-06-02 - Extraction: `ch12-01-accepting-command-line-arguments`

- Source read: `../rust-book/src/ch12-01-accepting-command-line-arguments.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch12-an-io-project/listing-12-01/src/main.rs`, `../rust-book/listings/ch12-an-io-project/listing-12-01/output.txt`, `../rust-book/listings/ch12-an-io-project/output-only-01-with-args/output.txt`, `../rust-book/listings/ch12-an-io-project/listing-12-02/src/main.rs`, and `../rust-book/listings/ch12-an-io-project/listing-12-02/output.txt`.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-01-accepting-command-line-arguments` set to `extracted`.
- Extracted candidate content: `cargo run --` argument forwarding, `std::env::args` iterator, `collect` into `Vec<String>` with type annotation, `std::env` import rationale, invalid Unicode and `args_os` caveat, `args[0]` as binary path/name, query and `file_path` indexing with `args[1]`/`args[2]`, output examples, and direct-indexing/missing-argument limitation.
- Final cards drafted: no.
- Remaining CH-12 extraction work: `ch12-02-reading-a-file`, `ch12-03-improving-error-handling-and-modularity`, `ch12-04-testing-the-librarys-functionality`, `ch12-05-working-with-environment-variables`, and `ch12-06-writing-to-stderr-instead-of-stdout` remain `not_started`; next coverage entry is `ch12-02-reading-a-file`.

### 2026-06-02 - Extraction: `ch12-02-reading-a-file`

- Source read: `../rust-book/src/ch12-02-reading-a-file.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch12-an-io-project/listing-12-03/poem.txt`, `../rust-book/listings/ch12-an-io-project/listing-12-04/src/main.rs`, and `../rust-book/listings/ch12-an-io-project/listing-12-04/output.txt`.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-02-reading-a-file` set to `extracted`.
- Extracted candidate content: project-root `poem.txt` sample file, `std::fs` import, `fs::read_to_string(file_path)`, `std::io::Result<String>` return type, `expect`-based temporary error handling, `contents` output verification, `cargo run -- the poem.txt` output, `main` responsibility critique, weak error-handling critique, and early refactoring rationale.
- Final cards drafted: no.
- Remaining CH-12 extraction work: `ch12-03-improving-error-handling-and-modularity`, `ch12-04-testing-the-librarys-functionality`, `ch12-05-working-with-environment-variables`, and `ch12-06-writing-to-stderr-instead-of-stdout` remain `not_started`; next coverage entry is `ch12-03-improving-error-handling-and-modularity`.

### 2026-06-02 - Extraction: `ch12-03-improving-error-handling-and-modularity`

- Source read: `../rust-book/src/ch12-03-improving-error-handling-and-modularity.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch12-an-io-project/listing-12-05/src/main.rs`, `listing-12-06/src/main.rs`, `listing-12-07/src/main.rs`, `listing-12-07/output.txt`, `listing-12-08/src/main.rs`, `listing-12-08/output.txt`, `listing-12-09/src/main.rs`, `listing-12-10/src/main.rs`, `listing-12-10/output.txt`, `listing-12-11/src/main.rs`, `listing-12-12/src/main.rs`, `listing-12-12/output.txt`, `no-listing-01-handling-errors-in-main/src/main.rs`, `listing-12-13/src/lib.rs`, and `listing-12-14/src/main.rs`.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-03-improving-error-handling-and-modularity` set to `extracted`.
- Extracted candidate content: four refactoring/error-handling problems, binary-project separation pattern, `parse_config` extraction, `Config` struct grouping, `clone` trade-off for owned `String` config fields, `Config::new` to `Config::build`, `Result<Config, &'static str>`, improved argument errors, `unwrap_or_else` closure handling, `process::exit(1)`, `run(config)` extraction, `Result<(), Box<dyn Error>>`, `?` propagation, `Ok(())`, unused `Result` warning, `if let Err(e)` handling, library split into `src/lib.rs`, public `search` placeholder, `minigrep::search` import, matching-line print loop, and remaining search/stderr boundaries.
- Final cards drafted: no.
- Remaining CH-12 extraction work: `ch12-04-testing-the-librarys-functionality`, `ch12-05-working-with-environment-variables`, and `ch12-06-writing-to-stderr-instead-of-stdout` remain `not_started`; next coverage entry is `ch12-04-testing-the-librarys-functionality`.

### 2026-06-02 - Extraction: `ch12-04-testing-the-librarys-functionality`

- Source read: `../rust-book/src/ch12-04-testing-the-librarys-functionality.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch12-an-io-project/listing-12-15/src/lib.rs`, `listing-12-16/src/lib.rs`, `listing-12-16/output.txt`, `output-only-02-missing-lifetimes/src/lib.rs`, `output-only-02-missing-lifetimes/output.txt`, `listing-12-17/src/lib.rs`, `listing-12-18/src/lib.rs`, `listing-12-19/src/lib.rs`, `listing-12-19/output.txt`, `no-listing-02-using-search-in-run/src/lib.rs`, `no-listing-02-using-search-in-run/output.txt`, `output-only-03-multiple-matches/output.txt`, and `output-only-04-no-matches/output.txt`.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-04-testing-the-librarys-functionality` set to `extracted`.
- Extracted candidate content: TDD loop, direct library-function testing, `one_result` test, multiline string backslash behavior, `unimplemented!` failure, `vec![]` failing-test step, E0106 missing-lifetime diagnostic, output lifetime tied to `contents`, `contents.lines()`, `line.contains(query)`, mutable `results` vector, `results.push(line)`, final case-sensitive search implementation, passing `cargo test` output, and final CLI single-match/multiple-match/no-match outputs.
- Final cards drafted: no.
- Remaining CH-12 extraction work: `ch12-05-working-with-environment-variables` and `ch12-06-writing-to-stderr-instead-of-stdout` remain `not_started`; next coverage entry is `ch12-05-working-with-environment-variables`.

### 2026-06-02 - Extraction: `ch12-05-working-with-environment-variables`

- Source read: `../rust-book/src/ch12-05-working-with-environment-variables.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch12-an-io-project/listing-12-20/src/lib.rs`, `listing-12-21/src/lib.rs`, `listing-12-21/output.txt`, `listing-12-22/src/main.rs`, `listing-12-23/src/main.rs`, and `listing-12-23/output.txt`; manual source output for `IGNORE_CASE=1 cargo run -- to poem.txt` and PowerShell set/remove commands also captured from the section source.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-05-working-with-environment-variables` set to `extracted`.
- Extracted candidate content: environment-variable rationale, case-sensitive test rename, `Duct tape.` regression case, case-insensitive `rUsT` test, `search_case_insensitive` implementation, `query.to_lowercase` shadowing, `String` vs `&str` `contains(&query)`, Unicode caveat, `ignore_case` `Config` field, `search`/`search_case_insensitive` import, `run` branching on `config.ignore_case`, `env::var("IGNORE_CASE").is_ok()`, set/unset semantics, Unix and PowerShell command forms, no-env and `IGNORE_CASE` output differences, and command-line/env-var precedence design note.
- Final cards drafted: no.
- Remaining CH-12 extraction work: `ch12-06-writing-to-stderr-instead-of-stdout` remains `not_started`; next coverage entry is `ch12-06-writing-to-stderr-instead-of-stdout`.

### 2026-06-02 - Extraction: `ch12-06-writing-to-stderr-instead-of-stdout`

- Source read: `../rust-book/src/ch12-06-writing-to-stderr-instead-of-stdout.md`.
- Requirements context read: CH-12 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch12-an-io-project/listing-12-24/src/main.rs` and `listing-12-24/src/lib.rs`; pre-fix and post-fix stdout redirection examples captured from the section source.
- Notes updated: `./chapter-notes/ch12.md`.
- Coverage updated: `ch12-06-writing-to-stderr-instead-of-stdout` set to `extracted`.
- Extracted candidate content: `stdout` vs `stderr` distinction, shell `>` stdout redirection, pre-fix error message captured in `output.txt`, `println!` limitation, centralized error printing in `main`, `eprintln!` for argument parsing and application errors, post-fix redirected error staying onscreen with empty `output.txt`, successful run writing matches to `output.txt`, `process::exit` vs stream distinction, and CH-12 project summary.
- Final cards drafted: no.
- Remaining CH-12 extraction work: none; CH-12 extraction pass complete. Next coverage entry is `ch13-00-functional-features`.

### 2026-06-02 - Extraction: `ch13-00-functional-features`

- Source read: `../rust-book/src/ch13-00-functional-features.md`.
- Requirements context read: CH-13 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch13.md`.
- Coverage updated: `ch13-00-functional-features` set to `extracted`.
- Extracted candidate content: functional programming influence, functions-as-values behaviors, chapter boundary that it does not debate functional programming definitions, closure and iterator overview definitions, CH-12 I/O project improvement roadmap, closures/iterators performance theme, pattern matching/enums as prior functional-style influences, and later CH-13 source-section boundaries.
- Final cards drafted: no.
- Remaining CH-13 extraction work: `ch13-01-closures`, `ch13-02-iterators`, `ch13-03-improving-our-io-project`, and `ch13-04-performance` remain `not_started`; next coverage entry is `ch13-01-closures`.

### 2026-06-02 - Extraction: `ch13-01-closures`

- Source read: `../rust-book/src/ch13-01-closures.md`.
- Requirements context read: CH-13 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch13-functional-features/listing-13-01/src/main.rs`, `listing-13-01/output.txt`, `listing-13-02/src/main.rs`, `listing-13-03/src/main.rs`, `listing-13-03/output.txt`, `listing-13-04/src/main.rs`, `listing-13-04/output.txt`, `listing-13-05/src/main.rs`, `listing-13-05/output.txt`, `listing-13-06/src/main.rs`, `listing-13-07/src/main.rs`, `listing-13-07/output.txt`, `listing-13-08/src/main.rs`, `listing-13-08/output.txt`, and `listing-13-09/src/main.rs`.
- Notes updated: `./chapter-notes/ch13.md`.
- Coverage updated: `ch13-01-closures` set to `extracted`.
- Extracted candidate content: closure definition and environment capture, `Option::unwrap_or_else` with `|| self.most_stocked()`, closure syntax/type inference and optional annotations, function-vs-closure syntax comparison, E0308 inferred closure type lock-in, immutable/mutable/`move` captures, `move` thread closures, `FnOnce`/`FnMut`/`Fn` additive traits, `unwrap_or_else` `FnOnce() -> T` bound, function fallback `Vec::new`, `sort_by_key` `FnMut` requirement, E0507 for moving a captured value out of an `FnMut` closure, and valid mutable-counter `sort_by_key` example.
- Final cards drafted: no.
- Remaining CH-13 extraction work: `ch13-02-iterators`, `ch13-03-improving-our-io-project`, and `ch13-04-performance` remain `not_started`; next coverage entry is `ch13-02-iterators`.

### 2026-06-02 - Extraction: `ch13-02-iterators`

- Source read: `../rust-book/src/ch13-02-iterators.md`.
- Requirements context read: CH-13 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch13-functional-features/listing-13-10/src/main.rs`, `listing-13-11/src/main.rs`, `listing-13-12/src/lib.rs`, `listing-13-13/src/lib.rs`, `listing-13-14/src/main.rs`, `listing-13-14/output.txt`, `listing-13-15/src/main.rs`, and `listing-13-16/src/lib.rs`.
- Notes updated: `./chapter-notes/ch13.md`.
- Coverage updated: `ch13-02-iterators` set to `extracted`.
- Extracted candidate content: iterator pattern and laziness, `iter` creation, `for`-loop consumption, `Iterator` trait with associated `Item` and `next`, direct `next` return sequence and mutability requirement, `iter`/`iter_mut`/`into_iter` ownership differences, consuming adapters such as `sum`, iterator adapters such as `map` and `filter`, unused `Map` warning for unconsumed `map`, `collect` with `Vec<_>` type annotation, adapter chaining, and `filter` closure capture in the `shoes_in_size` example.
- Final cards drafted: no.
- Remaining CH-13 extraction work: `ch13-03-improving-our-io-project` and `ch13-04-performance` remain `not_started`; next coverage entry is `ch13-03-improving-our-io-project`.

### 2026-06-02 - Extraction: `ch13-03-improving-our-io-project`

- Source read: `../rust-book/src/ch13-03-improving-our-io-project.md`.
- Requirements context read: CH-13 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch13-functional-features/listing-12-23-reproduced/src/main.rs`, `listing-12-24-reproduced/src/main.rs`, `listing-13-18/src/main.rs`, `listing-13-19/src/main.rs`, `listing-13-20/src/main.rs`, `../rust-book/listings/ch12-an-io-project/listing-12-19/src/lib.rs`, and `../rust-book/listings/ch13-functional-features/listing-13-22/src/lib.rs`; companion lib files for Listings 13-18 through 13-20 and main file for Listing 13-22 also checked.
- Notes updated: `./chapter-notes/ch13.md`.
- Coverage updated: `ch13-03-improving-our-io-project` set to `extracted`.
- Extracted candidate content: `Config::build` clone removal by taking ownership of `env::args`, replacing `Vec<String>` collection and `&[String]` indexing with `mut args: impl Iterator<Item = String>`, using `next` to skip program name and extract query/file path with precise errors, preserving `IGNORE_CASE`, rewriting `search` from mutable `results` and `for` loop to `contents.lines().filter(|line| line.contains(query)).collect()`, reduced mutable state and future parallelization rationale, optional lazy `impl Iterator<Item = &'a str>` search return, and loop-style vs iterator-style clarity comparison.
- Final cards drafted: no.
- Remaining CH-13 extraction work: `ch13-04-performance` remains `not_started`; next coverage entry is `ch13-04-performance`.

### 2026-06-02 - Extraction: `ch13-04-performance`

- Source read: `../rust-book/src/ch13-04-performance.md`.
- Requirements context read: CH-13 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch13.md`.
- Coverage updated: `ch13-04-performance` set to `extracted`.
- Extracted candidate content: loop-vs-iterator `search` benchmark context using _The Adventures of Sherlock Holmes_ and query `"the"`, benchmark output showing similar performance for explicit `for` loop and iterator-adapter implementations, caution against overclaiming from one benchmark, comprehensive benchmark variation dimensions, iterator zero-cost abstraction definition, compiled-code equivalence to hand-written lower-level code, loop unrolling and bounds-check elimination examples, and CH-13 summary on closures/iterators expressing high-level ideas at low-level performance.
- Final cards drafted: no.
- Remaining CH-13 extraction work: none; CH-13 extraction pass complete. Next coverage entry is `ch14-00-more-about-cargo`.

### 2026-06-02 - Extraction: `ch14-00-more-about-cargo`

- Source read: `../rust-book/src/ch14-00-more-about-cargo.md`.
- Requirements context read: CH-14 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings.
- Notes updated: `./chapter-notes/ch14.md`.
- Coverage updated: `ch14-00-more-about-cargo` set to `extracted`.
- Extracted candidate content: CH-14 roadmap beyond basic Cargo build/run/test features, advanced topics of release profiles, publishing libraries on crates.io, workspaces for large projects, installing binaries from crates.io, extending Cargo with custom commands, Cargo documentation as the full reference, and later CH-14 source-section boundaries.
- Final cards drafted: no.
- Remaining CH-14 extraction work: `ch14-01-release-profiles`, `ch14-02-publishing-to-crates-io`, `ch14-03-cargo-workspaces`, `ch14-04-installing-binaries`, and `ch14-05-extending-cargo` remain `not_started`; next coverage entry is `ch14-01-release-profiles`.

### 2026-06-02 - Extraction: `ch14-01-release-profiles`

- Source read: `../rust-book/src/ch14-01-release-profiles.md`.
- Requirements context read: CH-14 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch14.md`.
- Coverage updated: `ch14-01-release-profiles` set to `extracted`.
- Extracted candidate content: release profiles as predefined customizable independent compiler configurations, `dev` profile for `cargo build`, `release` profile for `cargo build --release`, build output profile indicators, `Cargo.toml` `[profile.*]` override sections, `opt-level` range 0 through 3, default `opt-level = 0` for `dev` and `opt-level = 3` for `release`, compile-time versus runtime-speed tradeoff, partial profile overrides preserving defaults, and `[profile.dev] opt-level = 1` example.
- Final cards drafted: no.
- Remaining CH-14 extraction work: `ch14-02-publishing-to-crates-io`, `ch14-03-cargo-workspaces`, `ch14-04-installing-binaries`, and `ch14-05-extending-cargo` remain `not_started`; next coverage entry is `ch14-02-publishing-to-crates-io`.

### 2026-06-02 - Extraction: `ch14-02-publishing-to-crates-io`

- Source read: `../rust-book/src/ch14-02-publishing-to-crates-io.md`.
- Requirements context read: CH-14 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch14-more-about-cargo/listing-14-01/src/lib.rs`, `listing-14-02/src/lib.rs`, `listing-14-03/src/lib.rs`, `listing-14-04/src/main.rs`, `listing-14-05/src/lib.rs`, `listing-14-06/src/main.rs`, and relevant `Cargo.toml` files for `my_crate` and `art`; source-embedded output snippets for doc tests, `cargo login`, missing metadata `cargo publish`, successful `cargo publish`, `cargo yank`, and `cargo yank --undo` captured.
- Notes updated: `./chapter-notes/ch14.md`.
- Coverage updated: `ch14-02-publishing-to-crates-io` set to `extracted`.
- Verification: `cargo test -q` passed in `../rust-book/listings/ch14-more-about-cargo/listing-14-01`, including one doc test.
- Extracted candidate content: documentation comments with `///`, Markdown doc sections `Examples`/`Panics`/`Errors`/`Safety`, `cargo doc` and `cargo doc --open`, doc tests run by `cargo test`, crate/module docs with `//!`, public API design and `pub use` re-exports, `art` crate internal-vs-re-exported imports, crates.io account/API token and `cargo login` basics, API token secrecy, unique crate names, required publishing metadata in `Cargo.toml` including `description` and `license`, SPDX license identifiers, `license-file` and `OR` licensing, `cargo publish` failure and success output shapes, permanent published versions, SemVer version bumps for new releases, `cargo yank` and `--undo` behavior, `Cargo.lock` effects, and yanking-not-deletion caveat.
- Final cards drafted: no.
- Remaining CH-14 extraction work: `ch14-03-cargo-workspaces`, `ch14-04-installing-binaries`, and `ch14-05-extending-cargo` remain `not_started`; next coverage entry is `ch14-03-cargo-workspaces`.

### 2026-06-02 - Extraction: `ch14-03-cargo-workspaces`

- Source read: `../rust-book/src/ch14-03-cargo-workspaces.md`.
- Requirements context read: CH-14 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: workspace fixture manifests under `../rust-book/listings/ch14-more-about-cargo/no-listing-01-workspace`, `output-only-01-adder-crate`, `no-listing-02-workspace-with-two-crates`, `listing-14-07`, `no-listing-03-workspace-with-external-dependency`, `output-only-03-use-rand`, and `no-listing-04-workspace-with-tests`; source-embedded output snippets for `cargo new`, `cargo build`, `cargo run -p adder`, workspace `rand` warning, E0432 unresolved import, `cargo test`, and `cargo test -p add_one` captured.
- Notes updated: `./chapter-notes/ch14.md`.
- Coverage updated: `ch14-03-cargo-workspaces` set to `extracted`.
- Verification: `cargo run -q -p adder` passed in `../rust-book/listings/ch14-more-about-cargo/listing-14-07/add` with expected output; `cargo test -q` passed in `../rust-book/listings/ch14-more-about-cargo/no-listing-04-workspace-with-tests/add`.
- Extracted candidate content: workspace definition as packages sharing one `Cargo.lock` and output directory, root `[workspace]` manifest with `resolver = "3"` and `members`, `cargo new` auto-adding workspace members, shared top-level `target` directory rationale, adding `add_one` library crate, explicit path dependency `add_one = { path = "../add_one" }` from `adder`, Listing 14-7 using `add_one::add_one`, `cargo build` and `cargo run -p adder` behavior, top-level shared `Cargo.lock` dependency resolution, `rand` external dependency per-package declaration requirement and E0432 unresolved import in `adder` without `rand` dependency, workspace-wide `cargo test`, `cargo test -p add_one`, publishing each workspace crate separately with `-p`, and workspace coordination rationale.
- Final cards drafted: no.
- Remaining CH-14 extraction work: `ch14-04-installing-binaries` and `ch14-05-extending-cargo` remain `not_started`; next coverage entry is `ch14-04-installing-binaries`.

### 2026-06-02 - Extraction: `ch14-04-installing-binaries`

- Source read: `../rust-book/src/ch14-04-installing-binaries.md`.
- Requirements context read: CH-14 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch14.md`.
- Coverage updated: `ch14-04-installing-binaries` set to `extracted`.
- Extracted candidate content: `cargo install` as a local binary-crate installation command for tools shared on crates.io, not a system package replacement; binary target versus library target distinction; `src/main.rs` and other binary-target files; README as installability clue; install root `bin` directory and default `$HOME/.cargo/bin` with rustup; `$PATH` requirement; `cargo install ripgrep` output shape; `ripgrep` package installing executable `rg`; and `rg --help` post-install usage.
- Final cards drafted: no.
- Remaining CH-14 extraction work: `ch14-05-extending-cargo` remains `not_started`; next coverage entry is `ch14-05-extending-cargo`.

### 2026-06-02 - Extraction: `ch14-05-extending-cargo`

- Source read: `../rust-book/src/ch14-05-extending-cargo.md`.
- Requirements context read: CH-14 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch14.md`.
- Coverage updated: `ch14-05-extending-cargo` set to `extracted`.
- Extracted candidate content: Cargo custom command extension model, `cargo-something` binary naming in `$PATH`, `cargo something` invocation, `cargo --list` discovery, installing extensions with `cargo install`, built-in-like use of extensions, and CH-14 summary on Cargo/crates.io sharing, small stable standard library, and crates evolving independently.
- Final cards drafted: no.
- Remaining CH-14 extraction work: none; CH-14 extraction pass complete. Next coverage entry is `ch15-00-smart-pointers`.

### 2026-06-02 - Extraction: `ch15-00-smart-pointers`

- Source read: `../rust-book/src/ch15-00-smart-pointers.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-00-smart-pointers` set to `extracted`.
- Extracted candidate content: pointer as memory address variable, Rust references as no-overhead borrowing pointers, smart pointers as data structures with metadata/capabilities, many smart pointers owning pointed-to data, `Deref` and `Drop` overview roles, standard library roadmap for `Box<T>`, `Rc<T>`, `Ref<T>`, `RefMut<T>`, `RefCell<T>`, interior mutability, and reference-cycle leaks.
- Final cards drafted: no.
- Remaining CH-15 extraction work: `ch15-01-box`, `ch15-02-deref`, `ch15-03-drop`, `ch15-04-rc`, `ch15-05-interior-mutability`, and `ch15-06-reference-cycles` remain `not_started`; next coverage entry is `ch15-01-box`.

### 2026-06-02 - Extraction: `ch15-01-box`

- Source read: `../rust-book/src/ch15-01-box.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch15-smart-pointers/listing-15-01/src/main.rs`, `listing-15-02/src/main.rs`, `listing-15-03/src/main.rs`, `listing-15-03/output.txt`, `listing-15-05/src/main.rs`, and the comparison enum in `../rust-book/listings/ch06-enums-and-pattern-matching/listing-06-02/src/main.rs`.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-01-box` set to `extracted`.
- Extracted candidate content: `Box<T>` heap allocation with stack pointer, `Box::new` syntax, common `Box<T>` use cases, large-data ownership transfer via pointer move, cons-list recursive type example, direct `Cons(i32, List)` infinite-size failure with E0072/E0391, compiler indirection suggestion, `Box<List>` known-size fix, boxed cons-list construction, and `Box<T>` `Deref`/`Drop` smart-pointer boundary.
- Final cards drafted: no.
- Remaining CH-15 extraction work: `ch15-02-deref`, `ch15-03-drop`, `ch15-04-rc`, `ch15-05-interior-mutability`, and `ch15-06-reference-cycles` remain `not_started`; next coverage entry is `ch15-02-deref`.

### 2026-06-02 - Extraction: `ch15-02-deref`

- Source read: `../rust-book/src/ch15-02-deref.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch15-smart-pointers/listing-15-06/src/main.rs`, `output-only-01-comparing-to-reference/src/main.rs`, `output-only-01-comparing-to-reference/output.txt`, `listing-15-07/src/main.rs`, `listing-15-08/src/main.rs`, `listing-15-09/src/main.rs`, `listing-15-09/output.txt`, `listing-15-10/src/main.rs`, `listing-15-11/src/main.rs`, `listing-15-12/src/main.rs`, and `listing-15-13/src/main.rs`.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-02-deref` set to `extracted`.
- Extracted candidate content: dereference operator on references and `Box<T>`, E0277 for comparing an integer to a reference without `*`, `MyBox<T>` tuple struct, E0614 before implementing `Deref`, `Deref` implementation with `Target` and `deref(&self)`, `*` desugaring to `*(y.deref())`, ownership reason `deref` returns a reference, deref coercion in function/method arguments, `&MyBox<String>` to `&String` to `&str`, explicit `hello(&(*m)[..])` equivalent, compile-time no-runtime-penalty coercion, and `Deref`/`DerefMut` mutability coercion rules.
- Final cards drafted: no.
- Remaining CH-15 extraction work: `ch15-03-drop`, `ch15-04-rc`, `ch15-05-interior-mutability`, and `ch15-06-reference-cycles` remain `not_started`; next coverage entry is `ch15-03-drop`.

### 2026-06-02 - Extraction: `ch15-03-drop`

- Source read: `../rust-book/src/ch15-03-drop.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch15-smart-pointers/listing-15-14/src/main.rs`, `listing-15-14/output.txt`, `listing-15-15/src/main.rs`, `listing-15-15/output.txt`, `listing-15-16/src/main.rs`, and `listing-15-16/output.txt`.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-03-drop` set to `extracted`.
- Extracted candidate content: `Drop` trait cleanup customization, `fn drop(&mut self)`, automatic scope-end cleanup, reverse creation drop order, `CustomSmartPointer` output, E0040 for explicit `c.drop()` destructor call, double-cleanup reason direct `Drop::drop` is rejected, `std::mem::drop`/`drop(c)` for early cleanup, and ownership/drop-once safety boundary.
- Final cards drafted: no.
- Remaining CH-15 extraction work: `ch15-04-rc`, `ch15-05-interior-mutability`, and `ch15-06-reference-cycles` remain `not_started`; next coverage entry is `ch15-04-rc`.

### 2026-06-02 - Extraction: `ch15-04-rc`

- Source read: `../rust-book/src/ch15-04-rc.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch15-smart-pointers/listing-15-17/src/main.rs`, `listing-15-17/output.txt`, `listing-15-18/src/main.rs`, `listing-15-19/src/main.rs`, and `listing-15-19/output.txt`.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-04-rc` set to `extracted`.
- Extracted candidate content: `Rc<T>` for explicit single-threaded multiple ownership, graph/shared-tail motivation, `Box<List>` shared-tail E0382 move failure, `Rc<List>` transformation with `Rc::new` and `Rc::clone`, `Rc::clone` convention versus deep-copy clone, `Rc::strong_count` count changes 1/2/3/2, `Drop`-driven count decrement, read-only sharing boundary, and `weak_count` name deferral to `Weak<T>` section.
- Final cards drafted: no.
- Remaining CH-15 extraction work: `ch15-05-interior-mutability` and `ch15-06-reference-cycles` remain `not_started`; next coverage entry is `ch15-05-interior-mutability`.

### 2026-06-02 - Extraction: `ch15-05-interior-mutability`

- Source read: `../rust-book/src/ch15-05-interior-mutability.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch15-smart-pointers/no-listing-01-cant-borrow-immutable-as-mutable/src/main.rs`, `no-listing-01-cant-borrow-immutable-as-mutable/output.txt`, `listing-15-20/src/lib.rs`, `listing-15-21/src/lib.rs`, `listing-15-21/output.txt`, `listing-15-22/src/lib.rs`, `listing-15-23/src/lib.rs`, `listing-15-23/output.txt`, `listing-15-24/src/main.rs`, and `listing-15-24/output.txt`.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-05-interior-mutability` set to `extracted`.
- Extracted candidate content: interior mutability as safe API over internal unsafe code, `RefCell<T>` single ownership with runtime borrow checking, `Box<T>`/`Rc<T>`/`RefCell<T>` comparison, immutable-value E0596, mock-object `Messenger`/`LimitTracker` use case, plain `Vec` `MockMessenger` E0596, `RefCell<Vec<String>>` fix with `borrow_mut` and `borrow`, `Ref<T>`/`RefMut<T>` runtime tracking, two-`borrow_mut` runtime panic, `Rc<RefCell<i32>>` shared mutable cons-list, and `RefCell<T>`-vs-`Mutex<T>` single-threaded boundary.
- Final cards drafted: no.
- Remaining CH-15 extraction work: `ch15-06-reference-cycles` remains `not_started`; next coverage entry is `ch15-06-reference-cycles`.

### 2026-06-02 - Extraction: `ch15-06-reference-cycles`

- Source read: `../rust-book/src/ch15-06-reference-cycles.md`.
- Requirements context read: CH-15 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch15-smart-pointers/listing-15-25/src/main.rs`, `listing-15-26/src/main.rs`, `listing-15-26/output.txt`, `listing-15-27/src/main.rs`, `listing-15-28/src/main.rs`, and `listing-15-29/src/main.rs`; source-embedded output prose for Listings 15-28 and 15-29 captured.
- Notes updated: `./chapter-notes/ch15.md`.
- Coverage updated: `ch15-06-reference-cycles` set to `extracted`.
- Extracted candidate content: reference cycles as memory-safe leaks, `Rc<List>` cons-list values with `RefCell<Rc<List>>` tail links forming a cycle, strong-count values that prevent cleanup, stack-overflow risk from recursive debug printing, ownership vs non-ownership design, `Weak<T>` weak references, `Rc::downgrade`, `weak_count` behavior, `upgrade` returning `Option<Rc<T>>`, parent/child tree with `Rc<Node>` children and `RefCell<Weak<Node>>` parent, strong/weak count walkthrough, and CH-15 smart pointer summary.
- Final cards drafted: no.
- Remaining CH-15 extraction work: none; CH-15 extraction pass complete. Next coverage entry is `ch16-00-concurrency`.

### 2026-06-02 - Extraction: `ch16-00-concurrency`

- Source read: `../rust-book/src/ch16-00-concurrency.md`.
- Requirements context read: CH-16 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch16.md`.
- Coverage updated: `ch16-00-concurrency` set to `extracted`.
- Extracted candidate content: concurrent vs parallel definitions, CH-16 shorthand terminology for concurrent and/or parallel, ownership and type checking as the basis for compile-time concurrency error prevention, fearless concurrency framing, Rust's multi-tool approach compared with single-model language design, and the chapter topic map for threads, message passing, shared state, and `Send`/`Sync`.
- Final cards drafted: no.
- Remaining CH-16 extraction work: `ch16-01-threads`, `ch16-02-message-passing`, `ch16-03-shared-state`, and `ch16-04-extensible-concurrency-sync-and-send` remain `not_started`; next coverage entry is `ch16-01-threads`.

### 2026-06-02 - Extraction: `ch16-01-threads`

- Source read: `../rust-book/src/ch16-01-threads.md`.
- Requirements context read: CH-16 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch16-fearless-concurrency/listing-16-01/src/main.rs`, `listing-16-02/src/main.rs`, `no-listing-01-join-too-early/src/main.rs`, `listing-16-03/src/main.rs`, `listing-16-03/output.txt`, `listing-16-04/src/main.rs`, `listing-16-05/src/main.rs`, `output-only-01-move-drop/src/main.rs`, and `output-only-01-move-drop/output.txt`; source-embedded sample output prose for Listings 16-1, 16-2, and the join-too-early variant captured.
- Notes updated: `./chapter-notes/ch16.md`.
- Coverage updated: `ch16-01-threads` set to `extracted`.
- Extracted candidate content: process/thread boundary, thread risks including race conditions and deadlocks, Rust standard-library 1:1 threading model, `thread::spawn` with closures, spawned-thread shutdown when `main` exits, scheduling nondeterminism, `thread::sleep`, `JoinHandle<T>`, `join` blocking and placement effects, `move` closures for ownership transfer into threads, E0373 borrowed closure failure, and E0382 use-after-move failure after moving into a thread.
- Final cards drafted: no.
- Remaining CH-16 extraction work: `ch16-02-message-passing`, `ch16-03-shared-state`, and `ch16-04-extensible-concurrency-sync-and-send` remain `not_started`; next coverage entry is `ch16-02-message-passing`.

### 2026-06-02 - Extraction: `ch16-02-message-passing`

- Source read: `../rust-book/src/ch16-02-message-passing.md`.
- Requirements context read: CH-16 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch16-fearless-concurrency/listing-16-06/src/main.rs`, `listing-16-07/src/main.rs`, `listing-16-08/src/main.rs`, `listing-16-09/src/main.rs`, `listing-16-09/output.txt`, `listing-16-10/src/main.rs`, and `listing-16-11/src/main.rs`; source-embedded sample output prose for Listings 16-8, 16-10, and 16-11 captured.
- Notes updated: `./chapter-notes/ch16.md`.
- Coverage updated: `ch16-02-message-passing` set to `extracted`.
- Extracted candidate content: message passing as threads or actors sending data, channel transmitter and receiver halves, closed-channel condition, `mpsc::channel` and `(tx, rx)` destructuring, `mpsc` as multiple producer/single consumer, `send` returning `Result`, `recv` blocking behavior, `try_recv` nonblocking behavior, `send` ownership transfer and E0382 after using a sent `String`, receiver iteration over multiple messages, and multiple producers via cloned transmitters.
- Final cards drafted: no.
- Remaining CH-16 extraction work: `ch16-03-shared-state` and `ch16-04-extensible-concurrency-sync-and-send` remain `not_started`; next coverage entry is `ch16-03-shared-state`.

### 2026-06-02 - Extraction: `ch16-03-shared-state`

- Source read: `../rust-book/src/ch16-03-shared-state.md`.
- Requirements context read: CH-16 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch16-fearless-concurrency/listing-16-12/src/main.rs`, `listing-16-13/src/main.rs`, `listing-16-13/output.txt`, `listing-16-14/src/main.rs`, `listing-16-14/output.txt`, and `listing-16-15/src/main.rs`; source-embedded output prose for Listing 16-15 captured.
- Notes updated: `./chapter-notes/ch16.md`.
- Coverage updated: `ch16-03-shared-state` set to `extracted`.
- Extracted candidate content: shared-state concurrency as shared memory and multiple ownership, `Mutex<T>` mutual exclusion, lock acquisition and blocking, `LockResult<MutexGuard<T>>`, guard `Deref` and `Drop`-based unlock behavior, E0382 when moving one `Mutex` into multiple thread closures, E0277 for `Rc<Mutex<i32>>` not being `Send`, why `Rc<T>` is not thread-safe, `Arc<T>` atomic reference counting for cross-thread shared ownership, `Arc<Mutex<i32>>` counter pattern, deadlock risk, and `RefCell<T>`/`Rc<T>` vs `Mutex<T>`/`Arc<T>` comparison.
- Final cards drafted: no.
- Remaining CH-16 extraction work: `ch16-04-extensible-concurrency-sync-and-send` remains `not_started`; next coverage entry is `ch16-04-extensible-concurrency-sync-and-send`.

### 2026-06-02 - Extraction: `ch16-04-extensible-concurrency-sync-and-send`

- Source read: `../rust-book/src/ch16-04-extensible-concurrency-sync-and-send.md`.
- Requirements context read: CH-16 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this summary section has no new numbered Rust code listings. Cross-references to Listings 16-14 and 16-15 were captured from the source text.
- Notes updated: `./chapter-notes/ch16.md`.
- Coverage updated: `ch16-04-extensible-concurrency-sync-and-send` set to `extracted`.
- Extracted candidate content: standard-library concurrency tools vs language-level marker traits, `Send` for ownership transfer between threads, why `Rc<T>` is not `Send`, `Arc<T>` satisfying the thread-transfer requirement, automatic `Send` propagation, `Sync` for safe shared references across threads, `T: Sync` if `&T: Send`, why `Rc<T>`, `RefCell<T>`, and `Cell<T>` are not `Sync`, `Mutex<T>` implementing `Sync`, unsafe manual `Send`/`Sync` implementation boundary, and CH-16 concurrency summary.
- Final cards drafted: no.
- Remaining CH-16 extraction work: none; CH-16 extraction pass complete. Next coverage entry is `ch17-00-async-await`.

### 2026-06-02 - Extraction: `ch17-00-async-await`

- Source read: `../rust-book/src/ch17-00-async-await.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings. Figure descriptions for Figures 17-1, 17-2, and 17-3 were captured from the source text.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-00-async-await` set to `extracted`.
- Extracted candidate content: asynchronous programming as potential pausing points and eventual results, Rust futures/streams/`async`/`await`/runtimes roadmap, CPU-bound video export vs I/O-bound video download, blocking vs nonblocking resource calls, thread-per-download overhead, runtime coordination at a high level, concurrency vs parallelism, serial dependencies, single-core concurrency vs multicore parallelism, and Rust async usually being concurrent and potentially parallel depending on hardware, OS, and runtime.
- Final cards drafted: no.
- Remaining CH-17 extraction work: `ch17-01-futures-and-syntax`, `ch17-02-concurrency-with-async`, `ch17-03-more-futures`, `ch17-04-streams`, `ch17-05-traits-for-async`, and `ch17-06-futures-tasks-threads` remain `not_started`; next coverage entry is `ch17-01-futures-and-syntax`.

### 2026-06-02 - Extraction: `ch17-01-futures-and-syntax`

- Source read: `../rust-book/src/ch17-01-futures-and-syntax.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch17-async-await/listing-17-01/src/main.rs`, `listing-17-02/src/main.rs`, `listing-17-03/src/main.rs`, `listing-17-04/src/main.rs`, `listing-17-05/src/main.rs`, and `no-listing-state-machine/src/lib.rs`; source-embedded E0752 error for Listing 17-3 and source-embedded output prose for Listing 17-4 captured.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-01-futures-and-syntax` set to `extracted`.
- Extracted candidate content: `Future` trait overview, futures as lazy values, `async` on blocks/functions, `await` as postfix and polling trigger, `page_title` async function, `trpl` setup and runtime role, `async fn` desugaring to `impl Future<Output = T>` with `async move`, E0752 for `async main`, `trpl::block_on` bridge from sync `main` to async execution, await points as runtime handoff, compiler-generated state machine, executor role, runtime async-main macro behavior, and `trpl::select` with `Either` for racing two futures.
- Final cards drafted: no.
- Remaining CH-17 extraction work: `ch17-02-concurrency-with-async`, `ch17-03-more-futures`, `ch17-04-streams`, `ch17-05-traits-for-async`, and `ch17-06-futures-tasks-threads` remain `not_started`; next coverage entry is `ch17-02-concurrency-with-async`.

### 2026-06-02 - Extraction: `ch17-02-concurrency-with-async`

- Source read: `../rust-book/src/ch17-02-concurrency-with-async.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch17-async-await/listing-17-06/src/main.rs`, `listing-17-07/src/main.rs`, `listing-17-08/src/main.rs`, `listing-17-09/src/main.rs`, `listing-17-10/src/main.rs`, `listing-17-11/src/main.rs`, `listing-17-12/src/main.rs`, and `listing-17-13/src/main.rs`; source-embedded output prose for Listings 17-6, 17-7, 17-8, and 17-13 captured.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-02-concurrency-with-async` set to `extracted`.
- Extracted candidate content: async/thread API behavior differences, `trpl::spawn_task`, async sleep, early spawned-task shutdown, awaiting task handles, `trpl::join` for two futures and fairness, async channel creation with mutable receiver, `recv().await` yielding instead of blocking, unbounded `send` not being awaited, `while let` receiver loop, one async block executing linearly, splitting sender/receiver futures with `join`, nontermination when sender is borrowed, `async move` to drop senders and close channels, cloned senders for multiple producers, and `trpl::join!` for a compile-time-known number of futures.
- Final cards drafted: no.
- Remaining CH-17 extraction work: `ch17-03-more-futures`, `ch17-04-streams`, `ch17-05-traits-for-async`, and `ch17-06-futures-tasks-threads` remain `not_started`; next coverage entry is `ch17-03-more-futures`.

### 2026-06-02 - Extraction: `ch17-03-more-futures`

- Source read: `../rust-book/src/ch17-03-more-futures.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch17-async-await/listing-17-14/src/main.rs`, `listing-17-15/src/main.rs`, `listing-17-16/src/main.rs`, `listing-17-17/src/main.rs`, `listing-17-18/src/main.rs`, `listing-17-19/src/main.rs`, and `listing-17-20/src/main.rs`; source-embedded output prose for Listings 17-15, 17-16, and 17-20 captured.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-03-more-futures` set to `extracted`.
- Extracted candidate content: await points as the only runtime handoff points, synchronous work between awaits, future starvation from long blocking work, `std::thread::sleep` as a blocking simulator, `trpl::sleep(...).await` as an async timer await point, `trpl::yield_now().await` for cooperative yielding, cooperative multitasking responsibilities, yield overhead and measurement guidance, generic `timeout<F: Future>` API returning `Result<F::Output, Duration>`, `trpl::select` with `trpl::Either`, unfair select polling order, and timeout success/failure behavior.
- Requirement gap noted: this source file does not cover arbitrary collections of futures despite the coverage title; the CH-17 "Handling an arbitrary number of futures" requirement is covered later via `trpl::join_all` in `ch17-05-traits-for-async`.
- Final cards drafted: no.
- Remaining CH-17 extraction work: `ch17-04-streams`, `ch17-05-traits-for-async`, and `ch17-06-futures-tasks-threads` remain `not_started`; next coverage entry is `ch17-04-streams`.

### 2026-06-02 - Extraction: `ch17-04-streams`

- Source read: `../rust-book/src/ch17-04-streams.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch17-async-await/listing-17-21/src/main.rs` and `listing-17-22/src/main.rs`; source-embedded E0599 diagnostic for Listing 17-21 captured.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-04-streams` set to `extracted`.
- Extracted candidate content: streams as asynchronous sequences of items over time, async channel `recv` as a stream-like example, queues/filesystem chunks/network data as stream-shaped inputs, batching/timeouts/throttling motivations, iterator vs stream time and API differences, `trpl::stream_from_iter`, `stream.next().await`, E0599 when `StreamExt` is not in scope, trait-provided methods requiring trait imports, `Stream` vs `StreamExt`, extension-trait pattern, and `use trpl::StreamExt` as the fix.
- Final cards drafted: no.
- Remaining CH-17 extraction work: `ch17-05-traits-for-async` and `ch17-06-futures-tasks-threads` remain `not_started`; next coverage entry is `ch17-05-traits-for-async`.

### 2026-06-02 - Extraction: `ch17-05-traits-for-async`

- Source read: `../rust-book/src/ch17-05-traits-for-async.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch17-async-await/listing-17-23/src/main.rs`, `listing-17-24/src/main.rs`, and `no-listing-stream-ext/src/lib.rs`; source-embedded E0277 diagnostic for Listing 17-23 captured.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-05-traits-for-async` set to `extracted`.
- Extracted candidate content: `Future::Output`, `Future::poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>`, `Poll::Ready`, `Poll::Pending`, post-`Ready` polling caution, `.await` as polling coordinated by the runtime, channel receive poll states, `trpl::join_all` for runtime-sized future collections, E0277 for `Vec<Box<dyn Future<Output = ()>>>` because `dyn Future<Output = ()>` cannot be unpinned, distinct anonymous async block future types, implicit direct-await pinning, `Pin` guarantees, self-referential async state machines, `Unpin` as a marker trait and normal case, `pin!` with `Vec<Pin<&mut dyn Future<Output = ()>>>`, `Stream::poll_next` as `Poll<Option<Self::Item>>`, and `StreamExt::next` mechanics.
- Requirement gap closed: this section covers the previously separate CH-17 "handling an arbitrary number of futures" requirement through `trpl::join_all`.
- Final cards drafted: no.
- Remaining CH-17 extraction work: `ch17-06-futures-tasks-threads` remains `not_started`; next coverage entry is `ch17-06-futures-tasks-threads`.

### 2026-06-02 - Extraction: `ch17-06-futures-tasks-threads`

- Source read: `../rust-book/src/ch17-06-futures-tasks-threads.md`.
- Requirements context read: CH-17 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch17-async-await/listing-17-25/src/main.rs`.
- Notes updated: `./chapter-notes/ch17.md`.
- Coverage updated: `ch17-06-futures-tasks-threads` set to `extracted`.
- Extracted candidate content: threads and async as complementary concurrency tools, thread memory and platform-support tradeoffs, tasks as runtime-managed work, threads as synchronous operation boundaries, tasks as asynchronous operation boundaries, concurrency between and within tasks, futures as the most granular concurrency unit, executor/task/future hierarchy, thread simplicity and fire-and-forget behavior, runtimes moving tasks across threads, multithreaded runtime default, work stealing, CPU-bound very parallelizable work favoring threads, I/O-bound very concurrent work favoring async, and Listing 17-25 combining a blocking thread producer with async channel receiving.
- Final cards drafted: no.
- Remaining CH-17 extraction work: none; CH-17 extraction pass complete. Next coverage entry is `ch18-00-oop`.

### 2026-06-02 - Extraction: `ch18-00-oop`

- Source read: `../rust-book/src/ch18-00-oop.md`.
- Requirements context read: CH-18 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch18.md`.
- Coverage updated: `ch18-00-oop` set to `extracted`.
- Extracted candidate content: OOP as a way of modeling programs, Simula 1960s object origins, Alan Kay's message-passing object architecture and 1967 OOP term, competing OOP definitions, Rust being object oriented under some definitions but not others, CH-18 roadmap for translating OOP characteristics to idiomatic Rust, implementing an object-oriented design pattern, and comparing that pattern with Rust-strength alternatives.
- Final cards drafted: no.
- Remaining CH-18 extraction work: `ch18-01-what-is-oo`, `ch18-02-trait-objects`, and `ch18-03-oo-design-patterns` remain `not_started`; next coverage entry is `ch18-01-what-is-oo`.

### 2026-06-02 - Extraction: `ch18-01-what-is-oo`

- Source read: `../rust-book/src/ch18-01-what-is-oo.md`.
- Requirements context read: CH-18 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch18-oop/listing-18-01/src/lib.rs` and `listing-18-02/src/lib.rs`.
- Notes updated: `./chapter-notes/ch18.md`.
- Coverage updated: `ch18-01-what-is-oo` set to `extracted`.
- Extracted candidate content: no-consensus OOP framing, Gang of Four object definition as data plus methods/operations, Rust structs/enums plus `impl` methods satisfying that definition, encapsulation through `pub` and default privacy, `AveragedCollection` public type with private `list` and `average` fields, public `add`, `remove`, and `average` methods preserving a cached-average invariant through private `update_average`, representation-change benefit from private fields, Rust lacking built-in struct inheritance, inheritance reasons of code reuse and type-system polymorphism, default trait methods as limited code reuse, bounded parametric polymorphism via generics and trait bounds, inheritance flexibility risks, and trait objects as Rust's runtime-polymorphism alternative.
- Final cards drafted: no.
- Remaining CH-18 extraction work: `ch18-02-trait-objects` and `ch18-03-oo-design-patterns` remain `not_started`; next coverage entry is `ch18-02-trait-objects`.

### 2026-06-02 - Extraction: `ch18-02-trait-objects`

- Source read: `../rust-book/src/ch18-02-trait-objects.md`.
- Requirements context read: CH-18 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch18-oop/listing-18-03/src/lib.rs`, `listing-18-04/src/lib.rs`, `listing-18-05/src/lib.rs`, `listing-18-06/src/lib.rs`, `listing-18-07/src/lib.rs`, `listing-18-08/src/main.rs`, `listing-18-09/src/main.rs`, `listing-18-10/src/main.rs`, and `listing-18-10/output.txt`.
- Notes updated: `./chapter-notes/ch18.md`.
- Coverage updated: `ch18-02-trait-objects` set to `extracted`.
- Extracted candidate content: fixed enum vs extensible trait object use case, GUI `Draw` trait, trait objects as pointer to implementer plus runtime method table, pointer-like trait object forms with `dyn Trait` such as `Box<dyn Draw>`, `Screen` with `Vec<Box<dyn Draw>>`, `run` calling `draw` on components, generic `Screen<T: Draw>` homogeneous alternative, monomorphization and static dispatch, `Button` and downstream `SelectBox` `Draw` implementations, mixed `SelectBox`/`Button` screen, duck-typing comparison with compile-time trait checking, E0277 for `String` not implementing `Draw`, dynamic dispatch runtime lookup cost, inlining/optimization limits, and dyn compatibility constraints.
- Final cards drafted: no.
- Remaining CH-18 extraction work: `ch18-03-oo-design-patterns` remains `not_started`; next coverage entry is `ch18-03-oo-design-patterns`.

### 2026-06-02 - Extraction: `ch18-03-oo-design-patterns`

- Source read: `../rust-book/src/ch18-03-oo-design-patterns.md`.
- Requirements context read: CH-18 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch18-oop/listing-18-11/src/main.rs`, `listing-18-12/src/lib.rs`, `listing-18-13/src/lib.rs`, `listing-18-14/src/lib.rs`, `listing-18-15/src/lib.rs`, `listing-18-16/src/lib.rs`, `listing-18-17/src/lib.rs`, `listing-18-18/src/lib.rs`, `listing-18-19/src/lib.rs`, `listing-18-20/src/lib.rs`, `listing-18-21/src/lib.rs`, and `listing-18-21/src/main.rs`.
- Notes updated: `./chapter-notes/ch18.md`.
- Coverage updated: `ch18-03-oo-design-patterns` set to `extracted`.
- Extracted candidate content: state pattern definition, blog post draft/pending-review/published workflow, `Post` hiding private state, `Option<Box<dyn State>>`, `self: Box<Self>` transition methods, `Option::take` ownership mechanics, no-op invalid transitions, content delegation through `State::content`, `as_ref`, `unwrap`, deref coercion, lifetime annotations, enum/match tradeoffs, state-pattern benefits and downsides, dyn compatibility limits for default methods returning `self`, type-state rewrite using `DraftPost`, `PendingReviewPost`, and published `Post`, consuming transitions, caller shadowing, absent draft/pending-review `content` methods, and compile-time invalid-state prevention.
- Final cards drafted: no.
- Remaining CH-18 extraction work: none; CH-18 extraction pass complete. Next coverage entry is `ch19-00-patterns`.

### 2026-06-02 - Extraction: `ch19-00-patterns`

- Source read: `../rust-book/src/ch19-00-patterns.md`.
- Requirements context read: CH-19 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch19.md`.
- Coverage updated: `ch19-00-patterns` set to `extracted`.
- Extracted candidate content: patterns as Rust syntax for matching simple and complex type structure, pattern components including literals/destructured arrays/enums/structs/tuples/variables/wildcards/placeholders, example patterns `x`, `(a, 3)`, and `Some(Color::Red)`, pattern match/no-match control-flow behavior, use of matched value parts, and CH-19 roadmap for pattern locations, refutability, and syntax forms.
- Final cards drafted: no.
- Remaining CH-19 extraction work: `ch19-01-all-the-places-for-patterns`, `ch19-02-refutability`, and `ch19-03-pattern-syntax` remain `not_started`; next coverage entry is `ch19-01-all-the-places-for-patterns`.

### 2026-06-02 - Extraction: `ch19-01-all-the-places-for-patterns`

- Source read: `../rust-book/src/ch19-01-all-the-places-for-patterns.md`.
- Requirements context read: CH-19 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch19-patterns-and-matching/listing-19-01/src/main.rs`, `listing-19-02/src/main.rs`, `listing-19-02/output.txt`, `listing-19-03/src/main.rs`, `listing-19-04/src/main.rs`, `listing-19-05/src/main.rs`, `listing-19-05/output.txt`, `listing-19-06/src/main.rs`, and `listing-19-07/src/main.rs`.
- Notes updated: `./chapter-notes/ch19.md`.
- Coverage updated: `ch19-01-all-the-places-for-patterns` set to `extracted`.
- Extracted candidate content: valid pattern locations in `match`, `let`, `if let`, `while let`, `for`, function parameters, and closure parameters; `match VALUE { PATTERN => EXPRESSION }` shape; `match` exhaustiveness; variable catch-all and `_`; `let PATTERN = EXPRESSION`; tuple destructuring with `let (x, y, z) = (1, 2, 3)`; E0308 for tuple arity mismatch; `if let` with optional `else`; mixed `if let`/`else if`/`else if let` chains; `Ok(age)` shadowing and scope; lack of `if let` exhaustiveness checking; `while let Ok(value) = rx.recv()` loop behavior; `for (index, value) in v.iter().enumerate()` destructuring; and function/closure parameter patterns including `&(x, y): &(i32, i32)`.
- Final cards drafted: no.
- Remaining CH-19 extraction work: `ch19-02-refutability` and `ch19-03-pattern-syntax` remain `not_started`; next coverage entry is `ch19-02-refutability`.

### 2026-06-02 - Extraction: `ch19-02-refutability`

- Source read: `../rust-book/src/ch19-02-refutability.md`.
- Requirements context read: CH-19 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch19-patterns-and-matching/listing-19-08/src/main.rs`, `listing-19-08/output.txt`, `listing-19-09/src/main.rs`, `listing-19-10/src/main.rs`, and `listing-19-10/output.txt`.
- Notes updated: `./chapter-notes/ch19.md`.
- Coverage updated: `ch19-02-refutability` set to `extracted`.
- Extracted candidate content: refutable vs irrefutable pattern definitions, `x` in `let x = 5` as irrefutable, `Some(x)` as refutable for `Option` values, function parameters/`let` statements/`for` loops requiring irrefutable patterns, `if let`/`while let`/`let...else` accepting refutable patterns, conditional constructs warning on irrefutable patterns, E0005 for `let Some(x) = some_option_value`, compiler note that `let` requires an irrefutable pattern and `None` is not covered, `let...else` transformation with `return`, `irrefutable_let_patterns` warning for `let x = 5 else`, and match-arm refutability guidance.
- Final cards drafted: no.
- Remaining CH-19 extraction work: `ch19-03-pattern-syntax` remains `not_started`; next coverage entry is `ch19-03-pattern-syntax`.

### 2026-06-02 - Extraction: `ch19-03-pattern-syntax`

- Source read: `../rust-book/src/ch19-03-pattern-syntax.md`.
- Requirements context read: CH-19 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch19-patterns-and-matching/no-listing-01-literals/src/main.rs`, `listing-19-11/src/main.rs`, `no-listing-02-multiple-patterns/src/main.rs`, `no-listing-03-ranges/src/main.rs`, `no-listing-04-ranges-of-char/src/main.rs`, `listing-19-12/src/main.rs`, `listing-19-13/src/main.rs`, `listing-19-14/src/main.rs`, `listing-19-15/src/main.rs`, `listing-19-16/src/main.rs`, `no-listing-05-destructuring-structs-and-tuples/src/main.rs`, `listing-19-17/src/main.rs`, `listing-19-18/src/main.rs`, `listing-19-19/src/main.rs`, `listing-19-20/src/main.rs`, `listing-19-21/src/main.rs`, `listing-19-22/src/main.rs`, `listing-19-23/src/main.rs`, `listing-19-24/src/main.rs`, `listing-19-25/src/main.rs`, `listing-19-25/output.txt`, `listing-19-26/src/main.rs`, `listing-19-27/src/main.rs`, `listing-19-28/src/main.rs`, and `listing-19-29/src/main.rs`.
- Notes updated: `./chapter-notes/ch19.md`.
- Coverage updated: `ch19-03-pattern-syntax` set to `extracted`.
- Extracted candidate content: literal matching, named-variable shadowing in `match`, multiple patterns with `|`, inclusive ranges with `..=` for numeric and `char` values, struct destructuring with renamed fields/shorthand/literal tests, enum and nested enum destructuring, nested tuple/struct destructuring, ignoring values with `_`, nested `_`, leading-underscore variables, `_name` binding versus `_` nonbinding ownership behavior, `..` for remaining struct/tuple parts, ambiguous tuple `..` compile error, match guards including outer-variable comparison and `|` precedence, `@` bindings with ranges, and the CH-19 summary.
- Final cards drafted: no.
- Remaining CH-19 extraction work: none; CH-19 extraction pass complete. Next coverage entry is `ch20-00-advanced-features`.

### 2026-06-02 - Extraction: `ch20-00-advanced-features`

- Source read: `../rust-book/src/ch20-00-advanced-features.md`.
- Requirements context read: CH-20 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch20.md`.
- Coverage updated: `ch20-00-advanced-features` set to `extracted`.
- Extracted candidate content: CH-20 reference-chapter framing, advanced features as occasional tools for specific situations, position before the CH-21 project, roadmap topic areas of unsafe Rust, advanced traits, advanced types, advanced functions and closures, and macros, unsafe Rust as opting out of some guarantees while manually upholding them, advanced trait roadmap items, advanced type roadmap items, function pointers and returning closures, and macros as code defining more code at compile time.
- Final cards drafted: no.
- Remaining CH-20 extraction work: `ch20-01-unsafe-rust`, `ch20-02-advanced-traits`, `ch20-03-advanced-types`, `ch20-04-advanced-functions-and-closures`, and `ch20-05-macros` remain `not_started`; next coverage entry is `ch20-01-unsafe-rust`.

### 2026-06-02 - Extraction: `ch20-01-unsafe-rust`

- Source read: `../rust-book/src/ch20-01-unsafe-rust.md`.
- Requirements context read: CH-20 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch20-advanced-features/listing-20-01/src/main.rs`, `listing-20-02/src/main.rs`, `listing-20-03/src/main.rs`, `no-listing-01-unsafe-fn/src/main.rs`, `output-only-01-missing-unsafe/output.txt`, `listing-20-04/src/main.rs`, `listing-20-05/src/main.rs`, `listing-20-05/output.txt`, `listing-20-06/src/main.rs`, `listing-20-07/src/main.rs`, `listing-20-07/output.txt`, `listing-20-08/src/main.rs`, `listing-20-09/src/main.rs`, `listing-20-10/src/main.rs`, `listing-20-11/src/main.rs`, and `listing-20-12/src/main.rs`.
- Notes updated: `./chapter-notes/ch20.md`.
- Coverage updated: `ch20-01-unsafe-rust` set to `extracted`.
- Extracted candidate content: unsafe Rust motivation, the five unsafe capabilities, `unsafe` blocks not disabling borrow checking, small unsafe blocks and safe abstractions, raw pointer forms `*const T`/`*mut T`, raw pointer creation with `&raw const`/`&raw mut` versus dereference, arbitrary address pointer risks, unsafe functions and E0133, unsafe operations inside unsafe functions still needing unsafe blocks, safe abstractions over unsafe code, why safe-only `split_at_mut` fails with E0499, unsafe `split_at_mut` with `as_mut_ptr`, `slice::from_raw_parts_mut`, and `ptr.add`, arbitrary slice UB, `unsafe extern "C"` and ABI, marking extern items `safe`, `#[unsafe(no_mangle)]` exports, immutable and mutable statics, `static_mut_refs`/raw borrow guidance, `SAFETY` comments, unsafe traits and unsafe impls, union field access, Miri commands/output/limits, and unsafe-code correctness guidance.
- Final cards drafted: no.
- Remaining CH-20 extraction work: `ch20-02-advanced-traits`, `ch20-03-advanced-types`, `ch20-04-advanced-functions-and-closures`, and `ch20-05-macros` remain `not_started`; next coverage entry is `ch20-02-advanced-traits`.

### 2026-06-02 - Extraction: `ch20-02-advanced-traits`

- Source read: `../rust-book/src/ch20-02-advanced-traits.md`.
- Requirements context read: CH-20 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch20-advanced-features/listing-20-13/src/lib.rs`, `no-listing-22-iterator-on-counter/src/lib.rs`, `listing-20-14/src/lib.rs`, `listing-20-15/src/main.rs`, `listing-20-16/src/lib.rs`, `listing-20-17/src/main.rs`, `listing-20-18/src/main.rs`, `listing-20-19/src/main.rs`, `listing-20-19/output.txt`, `listing-20-20/src/main.rs`, `listing-20-20/output.txt`, `listing-20-21/src/main.rs`, `listing-20-21/output.txt`, `listing-20-22/src/main.rs`, `listing-20-22/output.txt`, `listing-20-23/src/main.rs`, `no-listing-02-impl-outlineprint-for-point/src/main.rs`, `no-listing-02-impl-outlineprint-for-point/output.txt`, `no-listing-03-impl-display-for-point/src/main.rs`, and `listing-20-24/src/main.rs`.
- Notes updated: `./chapter-notes/ch20.md`.
- Coverage updated: `ch20-02-advanced-traits` set to `extracted`.
- Extracted candidate content: associated types with `Iterator::Item`, associated types vs generic trait parameters, `Counter` choosing `Item = u32`, default generic type parameters with `<PlaceholderType=ConcreteType>` and `Add<Rhs=Self>`, operator overloading through `std::ops::Add` and `type Output`, custom `Rhs` with `Millimeters + Meters`, same-name trait and inherent methods, trait-name method disambiguation, fully qualified syntax for associated functions and E0790, supertraits with `OutlinePrint: Display`, E0277 when `Display` is missing, satisfying the supertrait with `impl Display for Point`, the orphan rule, and the newtype pattern with `Wrapper(Vec<String>)`.
- Final cards drafted: no.
- Remaining CH-20 extraction work: `ch20-03-advanced-types`, `ch20-04-advanced-functions-and-closures`, and `ch20-05-macros` remain `not_started`; next coverage entry is `ch20-03-advanced-types`.

### 2026-06-02 - Extraction: `ch20-03-advanced-types`

- Source read: `../rust-book/src/ch20-03-advanced-types.md`.
- Requirements context read: CH-20 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch20-advanced-features/no-listing-04-kilometers-alias/src/main.rs`, `listing-20-25/src/main.rs`, `listing-20-26/src/main.rs`, `no-listing-05-write-trait/src/lib.rs`, `no-listing-06-result-alias/src/lib.rs`, `no-listing-07-never-type/src/lib.rs`, `../rust-book/listings/ch02-guessing-game-tutorial/listing-02-05/src/main.rs`, `no-listing-08-match-arms-different-types/src/main.rs`, `no-listing-09-unwrap-definition/src/lib.rs`, `no-listing-10-loop-returns-never/src/main.rs`, `no-listing-11-cant-create-str/src/main.rs`, `no-listing-12-generic-fn-definition/src/lib.rs`, `no-listing-13-generic-implicit-sized-bound/src/lib.rs`, and `no-listing-14-generic-maybe-sized/src/lib.rs`.
- Notes updated: `./chapter-notes/ch20.md`.
- Coverage updated: `ch20-03-advanced-types` set to `extracted`.
- Extracted candidate content: newtype use for type safety and abstraction, `type` aliases, `Kilometers`, `Thunk`, `std::io::Result<T>`, `Result<T, std::io::Error>`, aliases as synonyms rather than distinct types, `!` never type, diverging functions, `continue`, `panic!`, infinite `loop` behavior, dynamically sized types, `str`, `&str`, DST pointer metadata, `Box<str>`, `Rc<str>`, trait object pointers with `dyn Trait`, `Sized`, implicit `T: Sized`, and `T: ?Sized`.
- Final cards drafted: no.
- Remaining CH-20 extraction work: `ch20-04-advanced-functions-and-closures` and `ch20-05-macros` remain `not_started`; next coverage entry is `ch20-04-advanced-functions-and-closures`.

### 2026-06-02 - Extraction: `ch20-04-advanced-functions-and-closures`

- Source read: `../rust-book/src/ch20-04-advanced-functions-and-closures.md`.
- Requirements context read: CH-20 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch20-advanced-features/listing-20-28/src/main.rs`, `listing-20-29/src/main.rs`, `listing-20-30/src/main.rs`, `listing-20-31/src/main.rs`, `listing-20-32/src/lib.rs`, `listing-20-33/src/main.rs`, `listing-20-33/output.txt`, `listing-20-34/src/main.rs`, and supplemental `no-listing-18-returns-closure/src/lib.rs`.
- Notes updated: `./chapter-notes/ch20.md`.
- Coverage updated: `ch20-04-advanced-functions-and-closures` set to `extracted`.
- Extracted candidate content: function pointers with lowercase `fn`, `fn` vs `Fn`, `do_twice(f: fn(i32) -> i32, arg: i32)`, function pointers implementing `Fn`/`FnMut`/`FnOnce`, generic closure-trait bounds as the flexible API default, C interop as a reason to accept only `fn`, inline closures and named functions in `Iterator::map`, `ToString::to_string`, enum variant initializer functions such as `Status::Value`, returning closures with `impl Fn`, `FnMut`, or `FnOnce`, `move` closures that capture environment, distinct opaque types from separate `impl Trait` returns, E0308 in Listing 20-33, and `Box<dyn Fn(i32) -> i32>` trait objects for one shared closure type.
- Final cards drafted: no.
- Remaining CH-20 extraction work: `ch20-05-macros` remains `not_started`; next coverage entry is `ch20-05-macros`.

### 2026-06-02 - Extraction: `ch20-05-macros`

- Source read: `../rust-book/src/ch20-05-macros.md`.
- Requirements context read: CH-20 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch20-advanced-features/listing-20-35/src/lib.rs`, `listing-20-37/src/main.rs`, `listing-20-38/hello_macro/src/lib.rs`, `listing-20-39/pancakes/src/main.rs`, `listing-20-40/hello_macro/hello_macro_derive/Cargo.toml`, `listing-20-40/hello_macro/hello_macro_derive/src/lib.rs`, `listing-20-42/hello_macro/hello_macro_derive/src/lib.rs`, and final fixture files under `no-listing-21-pancakes`.
- Notes updated: `./chapter-notes/ch20.md`.
- Coverage updated: `ch20-05-macros` set to `extracted`.
- Extracted candidate content: macros as code that writes code, metaprogramming, macro expansion before semantic interpretation, macro vs function differences, macro scope-order rules, declarative `macro_rules!` macros, simplified `vec!` with `#[macro_export]`, macro pattern pieces including `$`, `$x:expr`, literal comma separators, and `*` repetition, generated `vec![1, 2, 3]` shape, procedural macros with `TokenStream` input/output, procedural macro crate type with `[lib] proc-macro = true`, custom derive macros with `HelloMacro`, `syn`, `quote`, `#[proc_macro_derive]`, `DeriveInput`, `quote!`, `#name`, `stringify!`, and `generated.into()`, attribute-like macros with `#[proc_macro_attribute]` and two `TokenStream` parameters, function-like procedural macros with `#[proc_macro]` and the `sql!` example, and declarative macros vs procedural macros.
- Final cards drafted: no.
- Remaining CH-20 extraction work: none; CH-20 extraction pass complete. Next coverage entry is `ch21-00-final-project-a-web-server`.

### 2026-06-02 - Extraction: `ch21-00-final-project-a-web-server`

- Source read: `../rust-book/src/ch21-00-final-project-a-web-server.md`.
- Requirements context read: CH-21 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no numbered Rust code listings.
- Notes updated: `./chapter-notes/ch21.md`.
- Coverage updated: `ch21-00-final-project-a-web-server` set to `extracted`.
- Extracted candidate content: CH-21 final-project framing, browser-visible "Hello!" / "Hi from Rust" goal, five-step roadmap for TCP/HTTP basics, listening for TCP connections on a socket, parsing a small number of HTTP requests, creating a proper HTTP response, and improving throughput with a thread pool, educational-not-production boundary, production-ready crates on crates.io, systems-programming abstraction-level rationale, no async/await scope decision, and the connection to Chapter 17's note that many async runtimes use thread pools.
- Final cards drafted: no.
- Remaining CH-21 extraction work: `ch21-01-single-threaded`, `ch21-02-multithreaded`, and `ch21-03-graceful-shutdown-and-cleanup` remain `not_started`; next coverage entry is `ch21-01-single-threaded`.

### 2026-06-02 - Extraction: `ch21-01-single-threaded`

- Source read: `../rust-book/src/ch21-01-single-threaded.md`.
- Requirements context read: CH-21 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch21-web-server/listing-21-01/src/main.rs`, `listing-21-02/src/main.rs`, `listing-21-03/src/main.rs`, `listing-21-05/hello.html`, `listing-21-05/src/main.rs`, `listing-21-06/src/main.rs`, `listing-21-07/src/main.rs`, `listing-21-07/404.html`, and `listing-21-09/src/main.rs`.
- Notes updated: `./chapter-notes/ch21.md`.
- Coverage updated: `ch21-01-single-threaded` set to `extracted`.
- Extracted candidate content: TCP vs HTTP at the project level, client/server request-response roles, `TcpListener::bind("127.0.0.1:7878")`, port binding and bind failure, `listener.incoming()` connection attempts, `TcpStream` as an open connection, browser retry/favicon/preconnection behavior, `handle_connection`, `BufReader`, `BufRead::lines`, reading request lines until a blank line, HTTP request-line/header/body structure, `GET / HTTP/1.1` breakdown, CRLF, HTTP response status line/header/body structure, tiny `HTTP/1.1 200 OK` response, `write_all(response.as_bytes())`, `hello.html`, `Content-Length`, route check for `GET / HTTP/1.1`, `HTTP/1.1 404 NOT FOUND`, `404.html`, refactoring duplicated response writing with `(status_line, filename)`, and the single-threaded one-request-at-a-time limitation.
- Final cards drafted: no.
- Remaining CH-21 extraction work: `ch21-02-multithreaded` and `ch21-03-graceful-shutdown-and-cleanup` remain `not_started`; next coverage entry is `ch21-02-multithreaded`.

### 2026-06-02 - Extraction: `ch21-02-multithreaded`

- Source read: `../rust-book/src/ch21-02-multithreaded.md`.
- Requirements context read: CH-21 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch21-web-server/listing-21-10/src/main.rs`, `listing-21-11/src/main.rs`, `listing-21-12/src/main.rs`, `listing-21-12/output.txt`, `no-listing-01-define-threadpool-struct/src/lib.rs`, `no-listing-01-define-threadpool-struct/output.txt`, `no-listing-02-impl-threadpool-new/src/lib.rs`, `no-listing-02-impl-threadpool-new/output.txt`, `no-listing-03-define-execute/src/lib.rs`, `no-listing-03-define-execute/output.txt`, `listing-21-13/src/lib.rs`, `listing-21-14/src/lib.rs`, `listing-21-15/src/lib.rs`, `listing-21-16/src/lib.rs`, `listing-21-17/src/lib.rs`, `listing-21-17/output.txt`, `listing-21-18/src/lib.rs`, `listing-21-19/src/lib.rs`, `listing-21-20/src/lib.rs`, `listing-21-20/src/main.rs`, and `listing-21-21/src/lib.rs`.
- Notes updated: `./chapter-notes/ch21.md`.
- Coverage updated: `ch21-02-multithreaded` set to `extracted`.
- Extracted candidate content: slow `/sleep` route with `thread::sleep(Duration::from_secs(5))`, `match &request_line[..]`, single-threaded blocking demonstration, one-thread-per-request prototype with `thread::spawn`, resource-exhaustion and denial-of-service limit of unbounded threads, thread pool purpose, queued bounded workers, desired `ThreadPool::new(4)` and `pool.execute` API, compiler-driven development, E0433/E0599/E0382 diagnostics, `usize` size choice, `assert!(size > 0)` and `# Panics` docs, `Vec::with_capacity`, `JoinHandle<()>`, `Worker` role, channel-backed job queue, `Job` as `Box<dyn FnOnce() + Send + 'static>`, `execute` boxing and sending closures, sharing `mpsc::Receiver<Job>` with `Arc<Mutex<_>>`, worker `recv`/`job()` execution, mutex poisoning and disconnected-channel caveats, and `while let`/`MutexGuard` temporary-lifetime behavior.
- Final cards drafted: no.
- Remaining CH-21 extraction work: `ch21-03-graceful-shutdown-and-cleanup` remains `not_started`; next coverage entry is `ch21-03-graceful-shutdown-and-cleanup`.

### 2026-06-02 - Extraction: `ch21-03-graceful-shutdown-and-cleanup`

- Source read: `../rust-book/src/ch21-03-graceful-shutdown-and-cleanup.md`.
- Requirements context read: CH-21 block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: `../rust-book/listings/ch21-web-server/listing-21-22/src/lib.rs`, `listing-21-22/output.txt`, `no-listing-04-update-drop-definition/src/lib.rs`, `listing-21-23/src/lib.rs`, `listing-21-24/src/lib.rs`, `listing-21-25/src/main.rs`, `listing-21-25/src/lib.rs`, `no-listing-07-final-code/src/main.rs`, `no-listing-07-final-code/src/lib.rs`, plus supplemental intermediate fixtures `no-listing-05-fix-worker-new/src/lib.rs` and `no-listing-06-fix-threadpool-drop/src/lib.rs`.
- Notes updated: `./chapter-notes/ch21.md`.
- Coverage updated: `ch21-03-graceful-shutdown-and-cleanup` set to `extracted`.
- Extracted candidate content: Ctrl-C as abrupt shutdown, graceful shutdown goals, `Drop` for `ThreadPool`, joining worker threads, Listing 21-22 E0507 because `JoinHandle::join` consumes `self`, moving handles out before joining, `Option<thread::JoinHandle<()>>::take` as a possible move-out pattern, `Vec::drain(..)` as the source's first fix, double-panic risk from `join().unwrap()` during `drop`, why joining alone can block forever when workers loop on `recv`, `sender: Option<mpsc::Sender<Job>>`, `sender: Some(sender)`, `self.sender.as_ref().unwrap().send(job).unwrap()`, `drop(self.sender.take())`, channel closure as the worker shutdown signal, `recv` returning `Err`, matching `Ok(job)`/`Err(_)` and `break`, `listener.incoming().take(2)` demonstration, third-request failure after shutdown, nondeterministic worker-output ordering, final reference code using `Option<JoinHandle<()>>` and `worker.thread.take()`, and production improvement suggestions.
- Final cards drafted: no.
- Remaining CH-21 extraction work: none; CH-21 extraction pass complete. Next coverage entry is `appendix-00`.

### 2026-06-02 - Extraction: `appendix-00`

- Source read: `../rust-book/src/appendix-00.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; this overview section has no code listings, tables, or command examples.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-00` set to `extracted`.
- Extracted candidate content: appendix overview framing, appendices as reference material useful during a Rust learning journey, roadmap to Appendix A keywords, Appendix B operators and symbols, Appendix C derivable traits, Appendix D useful development tools, Appendix E editions, Appendix F translations, and Appendix G nightly Rust.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-01-keywords`, `appendix-02-operators`, `appendix-03-derivable-traits`, `appendix-04-useful-development-tools`, `appendix-05-editions`, `appendix-06-translation`, and `appendix-07-nightly-rust` remain `not_started`; next coverage entry is `appendix-01-keywords`.

### 2026-06-02 - Extraction: `appendix-01-keywords`

- Source read: `../rust-book/src/appendix-01-keywords.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none numbered; source-embedded `fn match` compile-fail example, `expected identifier, found keyword` output, and `fn r#match`/`r#match(...)` fixed example captured.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-01-keywords` set to `extracted`.
- Extracted candidate content: keywords reserved for current or future Rust language use, identifier definition covering functions, variables, parameters, struct fields, modules, crates, constants, macros, static values, attributes, types, traits, and lifetimes, current-use keyword list and practical role summaries, future-reserved keyword list `abstract`, `become`, `box`, `do`, `final`, `gen`, `macro`, `override`, `priv`, `try`, `typeof`, `unsized`, `virtual`, and `yield`, raw identifier syntax with `r#`, rejected `fn match` diagnostic, fixed `fn r#match` definition and call-site syntax, raw identifiers for language interoperability, and cross-edition `try`/`r#try` behavior between Rust 2015 and Rust 2018/2021/2024.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-02-operators`, `appendix-03-derivable-traits`, `appendix-04-useful-development-tools`, `appendix-05-editions`, `appendix-06-translation`, and `appendix-07-nightly-rust` remain `not_started`; next coverage entry is `appendix-02-operators`.

### 2026-06-02 - Extraction: `appendix-02-operators`

- Source read: `../rust-book/src/appendix-02-operators.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; source tables B-1 through B-10 captured.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-02-operators` set to `extracted`.
- Extracted candidate content: operator vs non-operator symbol framing, Table B-1 operators, examples, meanings, and overload traits, multi-context meanings for `!`, `&`, `*`, `+`, `.`, `..`, `:`, `;`, and `|`, required confusing symbols `::`, `->`, `=>`, `..`, `..=`, `?`, `!`, `_`, `&`, `*`, and turbofish `::<T>`, deprecated `...` inclusive range pattern guidance to use `..=`, stand-alone syntax including literals, closures, never type, and `_`, path syntax with `ident::ident`, `::path`, `self::path`, `super::path`, associated items, and method disambiguation, generic syntax including `path<...>`, `path::<...>`, and `method::<...>`, trait-bound syntax including `T: ?Sized`, macro and attribute syntax, comment syntax, parentheses and tuple syntax, curly-brace syntax, and square-bracket array/indexing/slicing syntax.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-03-derivable-traits`, `appendix-04-useful-development-tools`, `appendix-05-editions`, `appendix-06-translation`, and `appendix-07-nightly-rust` remain `not_started`; next coverage entry is `appendix-03-derivable-traits`.

### 2026-06-02 - Extraction: `appendix-03-derivable-traits`

- Source read: `../rust-book/src/appendix-03-derivable-traits.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; Appendix C has trait reference sections rather than numbered listings.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-03-derivable-traits` set to `extracted`.
- Extracted candidate content: derive attribute framing for structs and enums, standard-library derivable trait reference scope, non-derivable `Display` contrast, library custom derives through procedural macros, `Debug` formatting and `assert_eq!` need, `PartialEq`/`Eq` equality behavior and `NaN` limitation, `PartialOrd`/`Ord` ordering behavior with field and variant order, `Clone`/`Copy` duplication behavior and trait requirements, `Hash` for fixed-size hash values and `HashMap<K, V>` keys, `Default::default`, `..Default::default()`, and `Option<T>::unwrap_or_default`.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-04-useful-development-tools`, `appendix-05-editions`, `appendix-06-translation`, and `appendix-07-nightly-rust` remain `not_started`; next coverage entry is `appendix-04-useful-development-tools`.

### 2026-06-02 - Extraction: `appendix-04-useful-development-tools`

- Source read: `../rust-book/src/appendix-04-useful-development-tools.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: source-embedded Rustfix example and output, Clippy approximate-constant listing and diagnostic output, Clippy fixed listing, and shell command examples `cargo fmt`, `cargo fix`, and `cargo clippy`.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-04-useful-development-tools` set to `extracted`.
- Extracted candidate content: Appendix D useful development tools, `rustfmt`/`cargo-fmt` purpose, `cargo fmt` formatting current crate and style-only semantics, `rustfix`/`cargo fix` applying clear compiler warning suggestions and supporting edition transitions, `unused_mut` example and fixed `let x` binding, Clippy/`cargo clippy` lint purpose, `clippy::approx_constant` diagnostic and `std::f64::consts::PI` fix, rust-analyzer as LSP-based IDE integration, VS Code client mention, and editor features autocompletion, jump to definition, and inline errors.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-05-editions`, `appendix-06-translation`, and `appendix-07-nightly-rust` remain `not_started`; next coverage entry is `appendix-05-editions`.

### 2026-06-02 - Extraction: `appendix-05-editions`

- Source read: `../rust-book/src/appendix-05-editions.md`.
- Requirements context read: Appendices and Rust 2024 requirement references in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; Appendix E has edition model prose rather than numbered listings.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-05-editions` set to `extracted`.
- Extracted candidate content: Rust six-week release cycle vs roughly three-year editions, edition purposes for active users/non-users/Rust developers, listed editions Rust 2015/2018/2021/2024, Rust Book using Rust 2024 idioms, `Cargo.toml` `edition` key behavior, missing edition fallback to 2015, explicit opt-in to edition changes, incompatible parse changes such as new keywords, mixed-edition crate linking, edition changes affecting initial parsing, most features available on all editions, later-edition keyword-feature caveat, Edition Guide and `cargo fix` upgrade pointer, and requirement-backed `edition = "2024"` syntax hook.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-06-translation` and `appendix-07-nightly-rust` remain `not_started`; next coverage entry is `appendix-06-translation`.

### 2026-06-02 - Extraction: `appendix-06-translation`

- Source read: `../rust-book/src/appendix-06-translation.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: none; Appendix F contains links to translation resources, not Rust snippets or commands.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-06-translation` set to `extracted`.
- Extracted candidate content: Appendix F as non-English Rust Book translation resource list, most translations still in progress, GitHub `Translations` label for helping or reporting new translations, broad language/resource list, and explicit no Rust syntax, commands, listings, or diagnostics.
- Final cards drafted: no.
- Remaining appendix extraction work: `appendix-07-nightly-rust` remains `not_started`; next coverage entry is `appendix-07-nightly-rust`.

### 2026-06-02 - Extraction: `appendix-07-nightly-rust`

- Source read: `../rust-book/src/appendix-07-nightly-rust.md`.
- Requirements context read: Appendices block in `../rust-learning-deck-requirements.md`.
- Concrete listings read: nightly/beta/stable release train text diagrams, `rustup toolchain install nightly`, `rustup toolchain list` output, and `rustup override set nightly` example.
- Notes updated: `./chapter-notes/appendix.md`.
- Coverage updated: `appendix-07-nightly-rust` set to `extracted`.
- Extracted candidate content: stability without stagnation, nightly/beta/stable release channels, release train model from main to nightly to beta to stable, six-week cadence, beta CI regression testing and backports, most-recent-stable support and EOL after new stable, unstable features behind feature flags, nightly requirement for feature flags, beta/stable inability to use feature flags, book stable-only assumption, rustup channel and toolchain concepts, `rustup toolchain install nightly`, `rustup toolchain list`, `rustup override set nightly`, per-project nightly behavior for `rustc`/`cargo`, RFC process, accepted-feature implementation, feature gates, nightly evaluation, stabilization decision, and feature riding trains to stable.
- Final cards drafted: no.
- Remaining appendix extraction work: none; Appendix extraction pass complete. Next coverage entry: none, because all 111 entries are now extracted.
