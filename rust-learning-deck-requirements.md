# Rust Learning Deck Requirements

This document is a requirements spec for building our own high-quality Rust learning Anki deck based on the official Rust Book.

Evidence used:

- Reviewed deck: `Coding-Flashcards/rust/cards.md`, repo `ad-si/Coding-Flashcards`, tag `v1.2.0`, commit `b652c2a281c199538e275e7e00535a68e27ed515`.
- Official book source: `rust-book/src/SUMMARY.md`, repo `rust-lang/book`, commit `05d114287b7d6f6c9253d5242540f00fbd6172ab`.
- Current Rust Book structure: 21 chapters plus appendices, including Rust 2024 edition material and Chapter 17 on async, await, futures, and streams.

The current reviewed Rust deck is useful as a supplemental deck, but not good enough as the basis for a best-quality Rust Book deck. It has 557 cards and covers many fundamentals, but it misses current-book material and contains syntax/wording/code errors. Our deck must be stricter: every card should be traceable, current, testable, and written to teach one precise thing.

## 1. General Improvements From Deck Quality Review

These requirements come from the quality problems found in the reviewed deck.

### DQ-01: Every code card must be syntactically correct, unless intentionally marked as broken

Bad patterns found in the reviewed deck:

- Invalid `match` snippet closed with `];` instead of `};` in `Coding-Flashcards/rust/cards.md:79`.
- Invalid `let greeting file = ...` in `Coding-Flashcards/rust/cards.md:4849`.
- Invalid `Re<List>`, `Rc: :new`, `Re::strong_count`, and `Rc:strong_count` in `Coding-Flashcards/rust/cards.md:7931` and nearby lines.
- Invalid Rust call syntax `abs(input: -3)` in `Coding-Flashcards/rust/cards.md:9919`.

Requirement:

- All normal `rust` examples must compile under the Rust version assumed by the current official book.
- All intentionally broken examples must be explicitly marked as `compile_fail` or equivalent metadata and must name the exact expected compiler failure.

Good card:

````text
Front:
Why does this fail?

```rust
let mut s = String::from("hello");
let r1 = &mut s;
let r2 = &mut s;
println!("{r1}, {r2}");
```

Back:
It creates two simultaneous mutable references to `s`. Rust allows either one mutable reference or any number of immutable references, but not two mutable references at the same time.

Expected: compile failure for multiple mutable borrows.
````

Bad card:

```text
Front:
References are important. Explain.

Back:
Chapter 4 talks about this topic more.
```

### DQ-02: Use current Rust Book syntax and Rust 2024 edition idioms

The reviewed deck is outdated in current Rust Book areas:

- It has zero exact cards for `edition` or `2024`.
- It has outdated FFI cards using `extern "C"` without `unsafe extern`.
- It uses `#[no_mangle]` instead of current `#[unsafe(no_mangle)]`.
- It has zero exact cards for `let...else`.
- It has no real cards for `async`, `await`, `Future`, `Stream`, `Pin`, or `Unpin`.

Requirement:

- The deck must target the same Rust edition and assumptions as the official Rust Book version being used.
- Cards must use Rust 2024 forms where the book uses Rust 2024 forms.
- Old forms can appear only in contrast cards that explicitly say they are old, edition-dependent, or not the current-book syntax.

Good card:

````text
Front:
In Rust 2024, how do you declare an external C function that is generally unsafe to call?

Back:
Use an `unsafe extern "C"` block.

```rust
unsafe extern "C" {
    fn abs(input: i32) -> i32;
}
```

Calling the function still requires an `unsafe` block unless the item is explicitly marked `safe`.
````

Bad card:

```text
Front:
How to set up FFI?

Back:
Use extern.
```

### DQ-03: Missing major Rust Book areas are not acceptable

The reviewed deck has zero exact cards for:

- `async`
- `await`
- `let...else`
- `macro_rules`
- procedural macros
- `edition`
- `ThreadPool`
- `TcpListener`
- `unsafe extern`

Requirement:

- A deck based on the official Rust Book must include every current chapter and appendix topic that the book presents as teachable Rust knowledge.
- No chapter may be skipped because it is advanced, long, project-based, or inconvenient for flashcards.

### DQ-04: Cards must be source-mapped

Requirement:

- Every card must include metadata for book chapter, section, and source concept.
- If the card is based on a listing, include the listing number or local book source file.
- This enables audits like "show all cards for Chapter 17" or "show cards sourced from Chapter 10 lifetimes".

Suggested tags:

```text
rust-book::ch10::traits
rust-book::ch10::lifetimes
rust-book::ch17::async-await
rust-book::ch20::unsafe
rust-book::appendix::editions
```

### DQ-05: Prompts must be atomic

Requirement:

- Each card should test one decision, one concept, one syntax form, one prediction, or one diagnostic.
- Multi-answer cards are allowed only for bounded enumerations that learners must know exactly.

Good card:

```text
Front:
What does `String::from("hello")` store on the stack, and what does it store on the heap?

Back:
The stack stores the pointer, length, and capacity. The heap stores the UTF-8 bytes.
```

Bad card:

```text
Front:
Explain ownership, borrowing, moving, cloning, slices, and references.
```

### DQ-06: Prompts must be specific, not vague summaries

Requirement:

- Avoid prompts like "What is ownership?" unless the answer is explicitly bounded.
- Prefer "Given this code, what happens and why?" or "Which rule is violated?".

Good card:

````text
Front:
After this code, can `s1` be used?

```rust
let s1 = String::from("hello");
let s2 = s1;
println!("{s1}");
```

Back:
No. `String` does not implement `Copy`; assigning `s1` to `s2` moves ownership. `s1` is invalid after the move.
````

Bad card:

```text
Front:
Chapter 4 talks about ownership. What should you remember?
```

### DQ-07: Answers must include the reason, not only the result

Requirement:

- If a card asks "what happens?", the answer must include "why".
- If a card asks "how?", the answer must include the minimal syntax and a constraint.
- If a card asks "when?", the answer must include the tradeoff or rule boundary.

Bad answer:

```text
It does not compile.
```

Good answer:

```text
It does not compile because `v` is immutably borrowed by `first` while `push` needs a mutable borrow of `v`. The immutable reference may point into storage that `push` could reallocate.
```

### DQ-08: The deck needs intentional card types

Requirement:

- Use a small set of repeatable card types:
  - Syntax production: "Write the minimal syntax for..."
  - Prediction: "What happens when this code runs/compiles?"
  - Diagnostic: "Why does this compiler error happen?"
  - Concept boundary: "When should you use X instead of Y?"
  - Transformation: "Rewrite this with the idiomatic construct."
  - API recall: "Which method/trait/type does this?"
  - Invariant: "Which rule must callers uphold?"

The current deck mixes these styles loosely. Our deck should use them deliberately.

### DQ-09: Non-compiling examples are first-class teaching objects

Requirement:

- Include compile-fail cards for borrow checker, ownership moves, exhaustive matches, unsafe contracts, trait bounds, lifetime errors, async pinning, and pattern refutability.
- Each compile-fail card must state:
  - whether the failure is expected;
  - the violated rule;
  - the smallest change that fixes it.

### DQ-10: Avoid accidental memorization of wrong code

Requirement:

- Do not put typo-filled code on the front unless the task is explicitly "find the typo".
- Do not use pseudo-Rust inside a `rust` code fence.
- If abbreviated code is needed, use comments or ellipses outside compile-checked snippets.

Bad:

```rust
let a = Rc::new(Cons(5, Rc: :new(Cons(10, Rc::new(Nil)))));
```

Good:

```rust
let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
```

### DQ-11: Every code sample must be rendered and validated

Requirement:

- Markdown rendering must be checked in the final deck.
- Code fences must not break the Anki card layout.
- Long code must be shortened without losing the tested point.
- Images must have a clear learning purpose and must not replace the card answer.

### DQ-12: The deck must not over-index on easy syntax while skipping hard concepts

The reviewed deck has many basic cards but misses major current chapters. A best-quality deck should not spend dozens of cards on simple syntax while leaving async, macros, or the final project uncovered.

Requirement:

- Each chapter gets a minimum coverage target.
- Advanced chapters get enough cards to make their concepts reviewable, not just one summary card.
- Repeated beginner syntax cards must be merged or deleted if they do not add a new distinction.

### DQ-13: Use precise language

Requirement:

- Fix grammar and terminology before release.
- Avoid learner-confusing wording such as "What is the `Self` keywords" or "How do create".
- Use Rust terms exactly: "associated function", "method", "trait object", "lifetime parameter", "generic type parameter", "unsafe block", "unsafe function", "unsafe trait", "FFI", "ABI".

### DQ-14: Include contrast cards where learners commonly confuse concepts

Requirement:

- Include cards that compare similar concepts:
  - `String` vs `&str`
  - `iter` vs `into_iter` vs `iter_mut`
  - `panic!` vs `Result`
  - `Box<T>` vs `Rc<T>` vs `RefCell<T>` vs `Arc<T>`
  - `Fn` vs `FnMut` vs `FnOnce`
  - threads vs async tasks
  - generics/static dispatch vs trait objects/dynamic dispatch
  - `match` vs `if let` vs `let...else`
  - `Copy` vs `Clone`
  - `&T` vs `*const T`

### DQ-15: Answers should be minimal but complete

Requirement:

- A good answer should usually be 1-5 sentences or a small code block plus a reason.
- Long textbook paragraphs should be split into multiple cards.
- If an answer has a list, the front must specify the exact expected number.

Good:

```text
Front:
Name the two parts returned by `mpsc::channel()`.

Back:
It returns `(Sender<T>, Receiver<T>)`: the transmitting end and the receiving end.
```

Bad:

```text
Front:
What does channels mean?

Back:
Channels are important in Rust and other languages and can be used for concurrency and Chapter 16 explains them.
```

### DQ-16: Build a review pipeline, not just a markdown file

Requirement:

- Before release, run automated checks:
  - card parser/import test;
  - duplicate front detection;
  - spellcheck or lint for obvious typo patterns;
  - compile/pass tests for valid snippets;
  - compile-fail tests for invalid snippets;
  - Rust edition check;
  - Anki render/import smoke test.

### DQ-17: Include deck-level scaffolding

Requirement:

- Cards must have stable IDs.
- Cards must be tagged by chapter, section, difficulty, and card type.
- Cards must include a source version field.
- Cards must be reorderable without breaking review history.

### DQ-18: Avoid copying the book verbatim as the main strategy

Requirement:

- The deck should convert book concepts into retrieval prompts, predictions, and transformations.
- Direct quotes should be rare and short.
- Each card should make the learner recall or reason, not merely reread.

## 2. Official Rust Book Chapter Requirements

These requirements come from the official Rust Book chapter structure. Each item describes what a best-quality Rust Book deck must cover.

### CH-00: Foreword and Introduction

Must include cards for:

- What Rust optimizes for: safety, speed, concurrency, and reliability.
- What "systems programming" means in Rust's context.
- Why the book uses projects and compiler feedback as teaching tools.
- The difference between learning syntax and learning Rust's ownership model.

Bad requirement:

```text
Have a card saying the introduction is important.
```

Good requirement:

```text
Create a card asking which Rust theme explains compile-time memory safety without a garbage collector, and answer with ownership plus borrowing checked by the compiler.
```

### CH-01: Getting Started

Must include cards for:

- Installing and updating Rust with `rustup`.
- Verifying installation with `rustc --version`.
- Opening local documentation with `rustup doc`.
- Writing and compiling `main.rs` with `rustc`.
- The minimal `fn main()` program.
- `println!` as a macro, not a function.
- Creating a project with `cargo new`.
- `Cargo.toml`, package metadata, dependencies, and `edition = "2024"`.
- `src/main.rs` and Cargo's expected project layout.
- `cargo build`, `cargo run`, `cargo check`, and why `check` is faster.
- Debug vs release output directories.

### CH-02: Programming a Guessing Game

Must include cards for:

- Bringing standard library items into scope with `use std::io`.
- Creating mutable variables with `let mut`.
- Reading input with `stdin().read_line(&mut guess)`.
- Why `read_line` appends to a `String`.
- Handling `Result` from `read_line`.
- Adding external crates with Cargo, including version selection.
- Using `rand` to generate a random number in a range.
- Comparing values with `cmp` and `Ordering`.
- Using `match` arms for `Less`, `Greater`, and `Equal`.
- Looping until success and using `break`.
- Shadowing `guess` after trimming and parsing.
- Type annotation for `parse`.
- Handling parse failure with `Err(_) => continue`.

### CH-03: Common Programming Concepts

Must include cards for:

- Immutability by default and `mut`.
- Constants vs immutable variables.
- Shadowing vs mutation, including type changes through shadowing.
- Scalar types: integers, floats, Booleans, chars.
- Signed vs unsigned integer ranges and overflow behavior.
- Numeric literal forms and type suffixes.
- Compound types: tuples and arrays.
- Tuple destructuring and tuple indexing.
- Array type syntax, fixed length, repeated values, and out-of-bounds access.
- Function definitions, parameters, statements, and expressions.
- Return values, semicolon effects, and expression-bodied functions.
- Comments and doc-comment boundary only where relevant.
- `if` expressions and branch type compatibility.
- `loop`, `while`, and `for`.
- Returning values from `loop`.
- Loop labels and `break 'label` if present in the selected book version.

### CH-04: Understanding Ownership

Must include cards for:

- Stack vs heap at the level needed to understand ownership.
- The three ownership rules.
- Scope and automatic cleanup.
- `String` allocation, move, clone, and drop behavior.
- Why `String` moves but simple scalar types may copy.
- `Copy` vs `Clone`.
- Function calls transferring ownership.
- Returning values to transfer ownership back.
- References as borrowing.
- Immutable references and mutable references.
- The one-mutable-or-many-immutable borrowing rule.
- Non-lexical lifetime behavior where references stop being used.
- Dangling reference prevention.
- String slices and range syntax.
- Slices as non-owning views.
- Why string slicing must respect UTF-8 boundaries.
- Using `&str` in function signatures where possible.

### CH-05: Structs

Must include cards for:

- Struct definition and instantiation.
- Field init shorthand.
- Struct update syntax and move behavior.
- Tuple structs and unit-like structs.
- Ownership of struct fields.
- Borrowing fields.
- Deriving `Debug`.
- `dbg!` vs `println!("{:?}")`.
- Defining methods with `impl`.
- Method receivers: `&self`, `&mut self`, and `self`.
- Associated functions and `Self`.
- Multiple `impl` blocks.

### CH-06: Enums and Pattern Matching

Must include cards for:

- Enum variants with and without data.
- Why variants are namespaced under the enum.
- Modeling alternatives with enums instead of nullable values.
- `Option<T>`, `Some`, and `None`.
- Why `Option<T>` forces explicit handling.
- `match` expression structure.
- Exhaustiveness.
- Binding data in match arms.
- Catch-all patterns with `_` and named variables.
- `if let` as concise single-pattern matching.
- `else` with `if let`.
- `let...else` for keeping the happy path unindented.
- Choosing among `match`, `if let`, and `let...else`.

### CH-07: Packages, Crates, and Modules

Must include cards for:

- Package vs crate vs module.
- Binary crate vs library crate.
- Crate root files.
- Module tree mental model.
- Privacy rules: private by default.
- `pub mod`, `pub fn`, `pub struct`, public fields, and public enum variants.
- Absolute and relative paths.
- `crate`, `self`, and `super`.
- Bringing paths into scope with `use`.
- Idiomatic `use` paths for functions vs structs/enums.
- Aliasing with `as`.
- Re-exporting with `pub use`.
- Nested paths and glob imports.
- Splitting modules across files and directories.

### CH-08: Common Collections

Must include cards for:

- Creating vectors with `Vec::new` and `vec!`.
- Updating vectors with `push`.
- Indexing with `[]` vs `get`.
- Borrowing rules when holding references to vector elements and mutating the vector.
- Iterating immutably and mutably.
- Using enums to store different logical variants in one vector.
- Creating `String` values.
- Appending to strings with `push_str` and `push`.
- `format!` without taking ownership.
- Why Rust strings are UTF-8 and not indexable by integer.
- Bytes, scalar values, and grapheme clusters as different views of text.
- String slicing risks.
- Creating hash maps.
- Inserting, overwriting, and reading values.
- Ownership of keys and values in hash maps.
- `entry` and `or_insert`.
- Updating values based on old values.

### CH-09: Error Handling

Must include cards for:

- `panic!` and unrecoverable errors.
- Unwinding vs aborting.
- Reading panic backtraces.
- `Result<T, E>` as recoverable error handling.
- Matching on `Result`.
- `unwrap` and `expect`, including when not to use them.
- Propagating errors manually.
- The `?` operator and early return.
- `?` with `Result` and `Option` where the book covers it.
- `Box<dyn Error>` in simple examples.
- Guidelines for choosing `panic!` vs `Result`.
- Encoding valid states in types instead of relying on runtime checks.

### CH-10: Generic Types, Traits, and Lifetimes

Must include cards for:

- Removing duplication with generic functions.
- Generic structs, enums, and methods.
- Generic type parameter naming conventions.
- Monomorphization and why generics have no runtime cost in typical cases.
- Defining traits.
- Default trait method implementations.
- Implementing traits for types.
- Trait bounds.
- `impl Trait` in parameters and returns.
- Multiple trait bounds.
- `where` clauses.
- Blanket implementations.
- The orphan rule.
- Why lifetimes exist.
- Lifetime annotations as relationships, not duration changes.
- Lifetime annotations in function signatures.
- Generic lifetime parameters.
- Lifetime elision rules.
- Lifetimes in structs.
- The static lifetime and when not to overuse it.

Good requirement:

```text
Create a prediction card asking why `longest(x.as_str(), y.as_str())` can return `&str` only when the returned reference is tied to input lifetimes.
```

Bad requirement:

```text
Chapter 10 talks about generics, traits, and lifetimes more.
```

### CH-11: Writing Automated Tests

Must include cards for:

- `#[test]` functions.
- `assert!`, `assert_eq!`, and `assert_ne!`.
- Custom failure messages.
- `#[should_panic]` and expected panic messages.
- Returning `Result` from tests.
- Running tests with `cargo test`.
- Passing options to the test binary.
- Running tests in parallel and controlling test threads.
- Showing output from passing tests.
- Filtering tests by name.
- Ignoring tests.
- Unit tests with `#[cfg(test)]`.
- Testing private functions where appropriate.
- Integration tests in the `tests` directory.
- Why binary crates need library extraction for integration testing.

### CH-12: I/O Project: Command Line Program

Must include cards for:

- Reading command-line arguments.
- Why collecting args into `Vec<String>` is initially simple but not final design.
- Separating parsing from execution.
- `Config::build` style construction.
- Returning `Result` from configuration parsing.
- Reading files with `fs::read_to_string`.
- Improving error messages.
- Moving logic into `lib.rs`.
- Test-driven development for search behavior.
- Case-sensitive and case-insensitive search.
- Environment variables.
- Writing errors to stderr with `eprintln!`.
- Returning process-friendly errors from `main`.

### CH-13: Functional Language Features: Iterators and Closures

Must include cards for:

- Closure syntax and type inference.
- Capturing by immutable borrow, mutable borrow, and move.
- `move` closures.
- `Fn`, `FnMut`, and `FnOnce`.
- Using closures in APIs such as `unwrap_or_else`.
- Iterator laziness.
- `iter`, `iter_mut`, and `into_iter`.
- Calling `next`.
- Consuming adaptors such as `sum`.
- Iterator adaptors such as `map` and `filter`.
- `collect` and type annotations.
- Using closures and iterators to improve the I/O project.
- Performance comparison between loops and iterators.

### CH-14: More About Cargo and Crates.io

Must include cards for:

- Release profiles and optimization levels.
- Documentation comments with `///`.
- Markdown sections such as Examples, Panics, Errors, and Safety.
- Doc tests.
- Crate-level docs with `//!`.
- Re-exporting public API with `pub use`.
- crates.io account/API token basics where the book covers publishing.
- Publishing metadata in `Cargo.toml`.
- `cargo publish`.
- Yanking and unyanking versions.
- Cargo workspaces, members, and shared `Cargo.lock`.
- Path dependencies in workspaces.
- Running packages in a workspace.
- Installing binaries with `cargo install`.
- Cargo custom commands.

### CH-15: Smart Pointers

Must include cards for:

- Pointers vs references vs smart pointers.
- `Box<T>` and heap allocation.
- Recursive types and why `Box<T>` gives known size.
- Dereference operator and implementing `Deref`.
- Deref coercion and where it applies.
- `DerefMut`.
- `Drop` and cleanup.
- Why `Drop::drop` cannot be called directly.
- `std::mem::drop`.
- `Rc<T>` for multiple ownership in single-threaded code.
- `Rc::clone`, strong count, and weak count.
- `RefCell<T>` and runtime borrow checking.
- Interior mutability.
- Combining `Rc<T>` and `RefCell<T>`.
- Reference cycles and memory leaks.
- `Weak<T>` and `upgrade`.

### CH-16: Fearless Concurrency

Must include cards for:

- Creating threads with `thread::spawn`.
- Join handles and `join`.
- `move` closures with threads.
- Message passing with `mpsc::channel`.
- Sender and receiver types.
- `send`, `recv`, and `try_recv`.
- Ownership transfer through channels.
- Multiple producers with cloned senders.
- Shared-state concurrency.
- `Mutex<T>`, `lock`, and guard behavior.
- `Arc<T>` for shared ownership across threads.
- Why `Rc<T>` is not thread-safe.
- `Send` and `Sync` marker traits.
- When not to manually implement `Send` or `Sync`.

### CH-17: Async, Await, Futures, and Streams

This chapter is missing from the reviewed deck and is mandatory for our deck.

Must include cards for:

- Concurrency vs parallelism in the book's async context.
- CPU-bound vs I/O-bound work.
- Blocking vs non-blocking operations.
- What `async` marks on functions and blocks.
- `async fn` returning a future rather than running immediately to completion.
- Future laziness: futures do not do work until polled/awaited.
- `.await` postfix syntax.
- Why `main` cannot simply be `async` without a runtime or macro.
- Runtime and executor responsibilities.
- `block_on` as the bridge from sync to async.
- Await points and compiler-generated state machines.
- Running multiple futures with join/select patterns from the book.
- Spawning tasks where the book introduces tasks.
- Async channels and async message passing.
- `async move`.
- Joining multiple futures known at compile time.
- Handling an arbitrary number of futures.
- Streams as asynchronous sequences.
- `Stream` vs `StreamExt`.
- `Future::poll`, `Poll::Ready`, and `Poll::Pending`.
- Why `Pin` and `Unpin` appear with futures.
- When async and threads solve different problems.
- When async and threads can be combined.

Good card:

```text
Front:
Why does calling an `async fn` not immediately perform the whole operation?

Back:
An `async fn` returns a future. Futures in Rust are lazy; they make progress only when polled, usually by awaiting them inside a runtime.
```

Bad card:

```text
Front:
What is async?
Back:
Async is asynchronous programming.
```

### CH-18: Object-Oriented Programming Features

Must include cards for:

- Rust's relationship to object-oriented concepts.
- Encapsulation through modules and `pub`.
- Trait objects with `dyn Trait`.
- Static dispatch with generics vs dynamic dispatch with trait objects.
- Object safety where the book requires it.
- Why trait objects require pointer-like types such as `&`, `Box<T>`, or `Rc<T>`.
- Runtime cost of dynamic dispatch.
- The blog post state-pattern example.
- Tradeoffs between state pattern and Rust type-state or enum approaches.

### CH-19: Patterns and Matching

Must include cards for:

- Places patterns appear: `match`, `if let`, `while let`, `for`, `let`, function params, closure params.
- Refutable vs irrefutable patterns.
- Why `let` requires irrefutable patterns.
- `let...else` with refutable patterns.
- Matching literals.
- Matching named variables and shadowing.
- Multiple patterns with `|`.
- Ranges with `..=`.
- Destructuring structs, enums, tuples, and nested values.
- Ignoring values with `_`.
- Ignoring parts with `..`.
- Match guards.
- `@` bindings.

### CH-20: Advanced Features

Must include cards for unsafe Rust:

- The five unsafe capabilities.
- `unsafe` blocks do not turn off the borrow checker.
- Raw pointer creation vs dereference.
- `*const T` and `*mut T`.
- Unsafe functions and methods.
- Safe abstractions over unsafe code.
- Why `split_at_mut` needs unsafe internally.
- `unsafe extern "C"` blocks in current Rust.
- Marking individual external functions as safe where the book covers it.
- `#[unsafe(no_mangle)]` for exporting Rust functions.
- Mutable static variables.
- Unsafe traits and unsafe impls.

Must include cards for advanced traits:

- Associated types.
- Default generic type parameters.
- Operator overloading.
- Fully qualified syntax.
- Supertraits.
- Newtype pattern.

Must include cards for advanced types:

- Type aliases.
- Never type.
- Dynamically sized types and `Sized`.

Must include cards for advanced functions and closures:

- Function pointers.
- Returning closures and trait objects where relevant.

Must include cards for macros:

- What macros are: code that writes code.
- Macro expansion timing.
- Why macros differ from functions.
- Declarative macros with `macro_rules!`.
- Macro patterns and repetition.
- `#[macro_export]`.
- Procedural macros and `TokenStream`.
- Custom derive macros.
- Attribute-like macros.
- Function-like procedural macros.

### CH-21: Final Project: Multithreaded Web Server

Must include cards for:

- TCP vs HTTP at the level used by the project.
- Binding a `TcpListener`.
- Iterating over incoming `TcpStream`s.
- Reading from a stream.
- HTTP request structure.
- HTTP response status line, headers, and body.
- `Content-Length`.
- Routing basic paths.
- Why the single-threaded server blocks.
- Spawning one thread per request and why that is limited.
- Thread pool purpose.
- Desired `ThreadPool::new` and `execute` API.
- Compiler-driven development of `ThreadPool`.
- `Worker` struct role.
- Job representation as boxed closure.
- Sharing receiver with `Arc<Mutex<_>>`.
- Closure bounds for jobs: `FnOnce`, `Send`, and `'static`.
- Receiving and executing jobs.
- Implementing graceful shutdown.
- Using `Drop`, `Option::take`, dropping sender, and joining worker threads.
- Why the project is educational and not a production web framework.

### Appendices

Must include cards for:

- Strict keywords, reserved keywords, and raw identifiers where useful.
- Operators and symbols, especially ones that are easy to confuse: `::`, `->`, `=>`, `..`, `..=`, `?`, `!`, `_`, `&`, `*`, turbofish `::<T>`.
- Derivable traits and what each derive means at a practical level.
- Rustfmt and `cargo fmt`.
- Clippy and `cargo clippy`.
- Rustfix / `cargo fix` where the book includes it.
- Rust-analyzer and editor support where the book includes it.
- Editions, especially Rust 2015, 2018, 2021, 2024, and `edition = "2024"`.
- Nightly Rust, release channels, and why unstable features are not assumed in the book.

## 3. Merged Complete Requirements

This is the canonical merged list. It combines the deck-quality requirements and Rust Book coverage requirements into one set of requirements for our future deck.

### MR-01: Source and version requirement

The deck must declare:

- official Rust Book source version or URL snapshot;
- Rust version assumed by that book;
- Rust edition;
- deck generation date;
- validation toolchain version.

Acceptance test:

- A reviewer can tell exactly which book version every card was built from.

### MR-02: Complete book coverage requirement

The deck must cover every current official Rust Book chapter and appendix listed in Section 2.

Acceptance test:

- There is at least one tag namespace for every chapter: `ch01` through `ch21`, plus appendices.
- No chapter has only a vague summary card.
- Chapter 17, Chapter 20 macros, Chapter 21, `let...else`, Rust 2024 editions, and current unsafe FFI are explicitly present.

### MR-03: Section-level learning objective requirement

Every book section must be converted into concrete learning objectives before cards are written.

Bad objective:

```text
Chapter 10 talks about this topic more.
```

Good objective:

```text
Learner can explain why a returned reference from `longest` needs a lifetime relationship to input references and can identify when `<'a>` does not extend any value's lifetime.
```

### MR-04: Card atomicity requirement

Every card must test exactly one primary recall or reasoning target.

Acceptance test:

- If a card answer contains more than one independent concept, split it unless it is a bounded enumeration.

### MR-05: Card type requirement

Every card must have one of these card types:

- syntax;
- prediction;
- diagnostic;
- transformation;
- concept boundary;
- API recall;
- invariant;
- comparison;
- project architecture.

Acceptance test:

- Card metadata includes `card_type`.

### MR-06: Current Rust syntax requirement

Cards must use current Rust Book syntax and Rust 2024 idioms unless intentionally teaching an older form.

Acceptance test:

- Current unsafe FFI uses `unsafe extern`.
- Exported unmangled functions use `#[unsafe(no_mangle)]` where the current book does.
- Cargo examples include `edition = "2024"` where relevant.

### MR-07: Compile validation requirement

All complete Rust code examples must be validated.

Acceptance test:

- Passing snippets compile.
- Failing snippets are marked as expected failures and have matching expected diagnostics.
- Pseudo-code never appears in a `rust` code fence.

### MR-08: Explanation requirement

Answers must include the rule or reason behind the result.

Acceptance test:

- Cards that answer only "yes", "no", "it compiles", or "it fails" are rejected unless the reason is already included in a separate required field.

### MR-09: Contrast requirement

The deck must include explicit comparison cards for commonly confused Rust concepts:

- `String` vs `&str`;
- move vs copy vs clone;
- `match` vs `if let` vs `let...else`;
- `unwrap` vs `expect` vs `?`;
- generics vs trait objects;
- `iter` vs `iter_mut` vs `into_iter`;
- `Box<T>` vs `Rc<T>` vs `RefCell<T>` vs `Arc<T>`;
- threads vs async tasks;
- safe abstraction vs unsafe implementation;
- declarative macros vs procedural macros.

### MR-10: Failure-mode requirement

The deck must teach important compiler errors as learning targets.

Required failure-mode families:

- use after move;
- multiple mutable borrows;
- mutable plus immutable borrow conflict;
- dangling reference;
- missing trait bound;
- non-exhaustive match;
- refutable pattern in an irrefutable context;
- lifetime mismatch;
- trying to send non-`Send` values across threads;
- async future type mismatch or pinning issue where the book covers it;
- unsafe operation outside unsafe context.

### MR-11: Project cards requirement

Project chapters must produce project-architecture cards, not only syntax cards.

Applies to:

- guessing game;
- command-line I/O project;
- async examples;
- multithreaded web server.

Acceptance test:

- The learner can reconstruct the project flow from cards: inputs, state, error handling, module boundaries, and why the design changes.

### MR-12: Tagging requirement

Every card must include:

- `rust-book`;
- chapter tag;
- section tag;
- difficulty tag;
- card type tag;
- compile status tag: `compiles`, `compile_fail`, `concept_only`, or `shell`.

### MR-13: Rendering requirement

The final Anki deck must be visually checked.

Acceptance test:

- Code is readable.
- Tables do not overflow.
- Images render.
- Long answers are split or formatted.
- No Markdown artifacts such as stray headings appear in card bodies.

### MR-14: Duplicate and low-value card requirement

The deck must reject duplicate or near-duplicate cards unless the distinction is intentional.

Bad duplicate:

```text
Front: What is `cargo run`?
Front: Which command runs a package?
```

Good distinction:

```text
Front: What does `cargo check` do that makes it faster than `cargo build`?
Front: When would you prefer `cargo build --release` over `cargo build`?
```

### MR-15: Difficulty progression requirement

Cards must be ordered and tagged so learners can study progressively:

- foundations: chapters 1-6;
- project/module/error basics: chapters 7-12;
- idioms and abstractions: chapters 13-16;
- async and advanced Rust: chapters 17-20;
- final integration project: chapter 21;
- appendices as reference reinforcement.

### MR-16: Maintenance requirement

When the official Rust Book changes, the deck must be auditable.

Acceptance test:

- A script or checklist can compare current book `SUMMARY.md` to deck chapter tags.
- Missing new sections are reported.
- Cards with outdated syntax are flagged.

### MR-17: Release QA requirement

Before a deck release:

- Run card parser tests.
- Run Rust snippet compile tests.
- Run compile-fail tests.
- Run duplicate-front detection.
- Run spellcheck/typo scan.
- Render/import the Anki deck.
- Sample at least one card from every chapter tag.
- Confirm no required chapter has zero cards.

### MR-18: Minimum coverage requirement

The first production deck should not target a tiny card count. A realistic minimum for full Rust Book coverage is:

- Chapters 1-6: enough cards to make ownership, structs, enums, and matching automatic.
- Chapters 7-12: enough cards to teach module structure, error handling, tests, and project organization.
- Chapters 13-16: enough cards to distinguish Rust abstractions and concurrency primitives.
- Chapter 17: enough cards to teach async as a real model, not a vocabulary term.
- Chapter 20: enough cards to teach unsafe boundaries, advanced traits/types/functions, and macros.
- Chapter 21: enough cards to reconstruct the project architecture.

The exact count should come after drafting, but "one card per section" is too shallow for a best-quality deck.

### MR-19: Bad-card rejection requirement

Reject cards with these patterns:

- "Chapter X talks about this more."
- "Explain Rust."
- "What is ownership?" with an unbounded essay answer.
- Answers that only quote the book without requiring recall.
- Code with accidental typos.
- Old syntax presented as current syntax.
- Cards where the learner can answer by reading the front rather than recalling anything.

### MR-20: Good-card acceptance requirement

Prefer cards with these patterns:

- "Given this code, what happens and why?"
- "Which rule is violated?"
- "Rewrite this with the idiomatic construct."
- "Choose X or Y for this situation and explain the boundary."
- "What trait bound is missing?"
- "What ownership transfer happens here?"
- "Which API returns this type?"
- "What exact syntax expresses this concept?"

## 4. Working Definition of a Best-Quality Rust Book Deck

A best-quality deck is not just "many cards about Rust." It is a current, source-mapped, compile-validated learning system that turns every important Rust Book concept into precise retrieval practice.

The deck is complete only when:

- every official book chapter and appendix is represented;
- current Rust 2024 syntax is used;
- all code examples are validated or intentionally marked as failing;
- every card has a clear learning objective;
- vague and typo-prone cards are rejected;
- missing current-book topics such as async, macros, `let...else`, editions, web server project, and current unsafe FFI are covered;
- the deck can be audited against the book after future book updates.
