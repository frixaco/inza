# Rust Learning Deck Card Requirements

This document defines requirements for the quality of individual Rust learning deck cards. It intentionally excludes deck generation, release process, source auditing, chapter coverage, scheduling, and Anki infrastructure requirements.

## 1. Card Scope

Each card must test one primary recall or reasoning target.

Acceptable targets:

- one bounded definition or fact;
- one Rust rule;
- one property or consequence;
- one syntax form;
- one API or type relationship;
- one prediction about code behavior;
- one diagnostic explanation;
- one transformation into idiomatic Rust;
- one evolution from an earlier example to a later example;
- one contrast between commonly confused concepts;
- one unsafe contract or invariant;
- one project-design decision from a Rust Book project.

Reject cards that require an unbounded essay answer or combine unrelated topics.

Good:

````text
Front:
After this code, can `s1` be used?

```rust
let s1 = String::from("hello");
let s2 = s1;
println!("{s1}");
```

Back:
No. Assigning `s1` to `s2` moves the `String` because `String` does not implement `Copy`. `s1` is invalid after the move.
````

Bad:

```text
Front:
Explain ownership, borrowing, moving, cloning, slices, and references.
```

## 2. Prompt Quality

Prompts must be specific enough that a reviewer can tell whether the answer is correct.

Each card must stand alone when reviewed out of order. The front must include enough context to answer without relying on neighboring cards, section headings, the previous example, or vague references such as "this" or "these traits" without an explicit subject.

Prefer prompts shaped as:

- "Given this code, what happens and why?"
- "Which rule is violated?"
- "What does X let you do?"
- "What makes X different from Y?"
- "What common misconception about X does this correct?"
- "What exact syntax expresses this?"
- "Rewrite this with the idiomatic construct."
- "What changed between these two versions, and why?"
- "Choose X or Y for this situation and explain the boundary."
- "What safety condition must the caller or implementer uphold?"
- "Which API, trait, or type does this?"

Avoid vague prompts such as:

- "What is ownership?"
- "Explain Rust."
- "What should you remember from Chapter 4?"
- "Why is this important?"

Use "what is" prompts only when the expected answer is tightly bounded.

Good:

```text
Front:
What does `String::from("hello")` store on the stack, and what does it store on the heap?

Back:
The stack stores the pointer, length, and capacity. The heap stores the UTF-8 bytes.
```

Bad:

```text
Front:
What is a `String`?
```

## 3. Answer Quality

Answers must be minimal but complete.

Requirements:

- If the card asks what happens, answer what happens and why.
- If the card asks how to write something, include the minimal syntax and the important constraint.
- If the card asks when to use something, include the rule boundary or tradeoff.
- If the answer is a list, the prompt must state or imply the exact expected set.
- Long explanations should be split into multiple cards.

A good answer is usually one to five sentences or a small code block plus a reason.

Bad:

```text
It does not compile.
```

Good:

```text
It does not compile because `v` is immutably borrowed by `first` while `push` needs a mutable borrow of `v`. The immutable reference may point into storage that `push` could reallocate.
```

## 4. Theory and Fact Cards

Theory cards are allowed and important, but they must be bounded.

Long explanatory source paragraphs should become a small cluster of cards, not one large card. Split the paragraph into cards that each test one precise definition, property, mechanism, consequence, contrast, or synthesis.

When decomposing a paragraph, identify each card-worthy claim and either create a bounded card for it or intentionally reject it as low-value, duplicate, or not relevant to Rust fluency. Do not silently drop an important fact just because the paragraph also contains more obvious facts.

Useful theory-card shapes:

- `definition`: "What does X mean or let you reference?"
- `property`: "What is true about X?"
- `mechanism`: "Which trait, rule, or feature makes X work?"
- `consequence`: "What does X allow or prevent?"
- `contrast`: "What makes X different from Y?"
- `misconception`: "What does X not mean or not do?"
- `synthesis`: "How do these two facts fit together?"
- `evolution`: "What changed from this version to the next, and what problem did it solve?"

Requirements:

- Keep the expected answer short enough to be reviewed from memory.
- Do not ask the learner to reproduce a paragraph.
- Preserve the important fact even when shortening the wording.
- Include the practical boundary or consequence when the fact is easy to memorize without understanding.
- If a paragraph introduces several terms, create separate cards for each term before creating a synthesis card.
- Reject or merge facts that do not teach a definition, mechanism, consequence, boundary, or misconception that changes how the learner reads or writes Rust.

Example source paragraph:

```text
Smart pointers are usually implemented using structs. Unlike an ordinary struct, smart pointers implement the Deref and Drop traits. The Deref trait allows an instance of the smart pointer struct to behave like a reference so that you can write your code to work with either references or smart pointers. The Drop trait allows you to customize the code that's run when an instance of the smart pointer goes out of scope.
```

Better card cluster:

```text
Front:
How are Rust smart pointers usually implemented?

Back:
They are usually structs that implement pointer-like behavior, commonly through traits such as `Deref` and `Drop`.
```

```text
Front:
What makes a smart pointer different from an ordinary reference?

Back:
A smart pointer is a data structure that acts like a pointer but also provides extra metadata or capabilities.
```

```text
Front:
Which two traits are central to how Rust smart pointers behave?

Back:
`Deref` and `Drop`.
```

```text
Front:
What does implementing `Deref` let a smart pointer do?

Back:
It lets the smart pointer behave like a reference, so code can work with references or smart pointers through dereferencing behavior.
```

```text
Front:
What does implementing `Drop` let a smart pointer do?

Back:
It lets the type customize what runs when a value goes out of scope.
```

```text
Front:
Why are `Deref` and `Drop` important to smart pointers?

Back:
`Deref` controls how the smart pointer behaves like a reference, and `Drop` controls cleanup when the smart pointer goes out of scope.
```

Good bounded fact card:

```text
Front:
What does a slice let you reference?

Back:
A slice lets you reference a contiguous sequence of elements in a collection without owning that sequence.
```

Good misconception card:

```text
Front:
What does a lifetime annotation like `<'a>` not do?

Back:
It does not extend how long any value lives. It describes relationships between references so the compiler can check that returned or stored references remain valid.
```

Bad paragraph card:

```text
Front:
Explain smart pointers, `Deref`, and `Drop`.
```

## 5. Code Correctness

Every Rust code sample must be either valid Rust or intentionally invalid Rust used as a diagnostic prompt.

Requirements:

- Complete `rust` snippets that are presented as valid must compile under the Rust version and edition used by the deck.
- Partial Rust snippets must be explicitly marked as excerpts and must include enough surrounding context in prose to make the tested point clear.
- Prefer complete snippets for prediction and diagnostic cards; include required imports, type definitions, or harness code when they are necessary to understand or validate the behavior.
- Intentionally invalid snippets must be marked as expected failures.
- Invalid snippets must name the violated rule or expected compiler failure.
- Pseudo-Rust must not appear inside a `rust` code fence.
- Accidental typos must never be used as examples unless the task is explicitly to find the typo.
- Source fence attributes must be preserved as card meaning when relevant:
  - `does_not_compile` and `compile_fail` examples must become expected-failure cards, not ordinary prediction cards.
  - `no_run` examples may compile but should not be presented as safely runnable in the card.
  - `ignore` and `noplayground` examples require a short reason if the runnable status matters to the tested point.
- Hidden doctest lines from the source may be included for validation context, but must not appear as surprising or unexplained code in the final card unless they are part of the learning target.

Good diagnostic card:

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

Bad code:

```rust
let a = Rc::new(Cons(5, Rc: :new(Cons(10, Rc::new(Nil)))));
```

## 6. Non-Rust Snippets

Cards may use non-Rust snippets when the learning target depends on commands, output, diagnostics, protocols, HTML, or project files.

Requirements:

- Label non-Rust snippets by role, such as shell command, console output, compiler diagnostic, HTTP request, HTTP response, HTML, TOML, or file tree.
- Keep non-Rust snippets short enough that the learner is tested on the Rust concept, workflow, or boundary rather than on copying incidental output.
- Do not put shell commands, compiler output, HTTP text, or HTML inside a `rust` fence.
- If output is platform-, version-, or environment-dependent, include only the stable portion needed for the card.
- Compiler-output cards should ask for the violated rule or fix, not for verbatim diagnostic wording unless exact wording is the learning target.

Good:

````text
Front:
This command reports an error about borrowing `v` as mutable. Which Rust rule is the compiler enforcing?

```console
error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable
```

Back:
An immutable borrow of `v` is still active while `push` needs a mutable borrow. Rust does not allow a mutable borrow while an immutable borrow that may be used later is active.
````

## 7. Current Rust Usage

Cards must teach the current Rust syntax and idioms assumed by the deck.

Requirements:

- Use the current Rust edition syntax where the official learning source uses it.
- Present old forms only in explicit contrast cards.
- Do not teach outdated syntax as the default answer.
- Use precise Rust terminology.

Examples of terminology to use exactly:

- associated function;
- method;
- trait object;
- lifetime parameter;
- generic type parameter;
- unsafe block;
- unsafe function;
- unsafe trait;
- FFI;
- ABI.

Good:

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

Bad:

```text
Front:
How to set up FFI?

Back:
Use extern.
```

## 8. Card Types

Every card must use one deliberate card type.

Allowed card types:

- `definition`: recall a bounded definition, fact, or property;
- `misconception`: correct a common false belief or overgeneralization;
- `syntax`: write or identify minimal syntax;
- `prediction`: predict whether code compiles, runs, panics, moves, borrows, or prints;
- `diagnostic`: explain a compiler error or violated rule;
- `transformation`: rewrite code into a more idiomatic or requested form;
- `evolution`: explain what changed between two related listings and why that change matters;
- `concept_boundary`: choose between related concepts and explain the boundary;
- `api_recall`: recall the method, trait, type, command, or return shape;
- `invariant`: state the rule or safety condition that must hold;
- `comparison`: compare commonly confused Rust concepts;
- `project_architecture`: explain a project-flow or design decision.

The card body should make the selected type obvious even without metadata.

## 9. Diagnostic and Failure Cards

Compiler failures are first-class learning objects.

Compile-fail cards must include:

- whether the failure is expected;
- the rule being violated;
- the smallest change that fixes it, when a small fix exists.

Important failure families to cover when relevant:

- use after move;
- multiple mutable borrows;
- mutable plus immutable borrow conflict;
- dangling reference;
- missing trait bound;
- non-exhaustive match;
- refutable pattern in an irrefutable context;
- lifetime mismatch;
- sending non-`Send` values across threads;
- async future type mismatch or pinning issue;
- unsafe operation outside an unsafe context.

## 10. Unsafe Contract Cards

Unsafe Rust cards must separate the unsafe operation from the safety argument.

Requirements:

- Identify which operation, function, trait, or implementation is unsafe.
- State the safety obligation in concrete terms.
- Name who must uphold the obligation: caller, callee, implementer, wrapper API, or surrounding invariant.
- If the card shows a safe abstraction around unsafe code, explain why callers can use the safe API without writing `unsafe`.
- Do not imply that an `unsafe` block disables Rust's safety checks globally; it only permits specific unsafe operations inside the block.
- Do not present unsafe examples as generally reusable patterns without the required preconditions.

Good:

```text
Front:
In a safe wrapper around raw-pointer code, what must the card answer explain besides "the code uses `unsafe`"?

Back:
It must explain the safety contract: which unsafe operation is being performed, what invariant makes it valid, and whether the caller or wrapper is responsible for upholding that invariant.
```

## 11. Contrast Cards

The deck must include explicit comparison cards where learners commonly confuse concepts.

Useful contrasts:

- `String` vs `&str`;
- move vs copy vs clone;
- `match` vs `if let` vs `let...else`;
- `unwrap` vs `expect` vs `?`;
- generics vs trait objects;
- `iter` vs `iter_mut` vs `into_iter`;
- `Box<T>` vs `Rc<T>` vs `RefCell<T>` vs `Arc<T>`;
- threads vs async tasks;
- safe abstraction vs unsafe implementation;
- declarative macros vs procedural macros;
- `Fn` vs `FnMut` vs `FnOnce`;
- `&T` vs `*const T`.

Each contrast card must name the practical boundary, not just define both sides.

Good:

```text
Front:
When should a function parameter be `&str` instead of `String`?

Back:
Use `&str` when the function only needs to read string data and does not need ownership. This accepts both string slices and borrowed `String` values without forcing allocation or ownership transfer.
```

## 12. Source Grounding

Card content must be traceable to the selected learning source, but the source reference must serve the card quality.

Requirements:

- A card must not rely on "the book says so" as its answer.
- Source wording should be converted into retrieval, prediction, diagnostic, or transformation prompts.
- Direct quotes should be rare, short, and used only when exact wording matters.
- If a card is based on a specific listing, the code must preserve the intended teaching point.
- If the source uses a teaching simplification, preserve the caveat that prevents the card from becoming false or overgeneralized.
- Do not turn intentionally beginner-friendly project code, such as temporary `unwrap` usage, into recommended production practice unless the card explicitly asks about that tradeoff.

Bad:

```text
Front:
Chapter 10 talks about traits. What should you remember?

Back:
Traits are important.
```

Good:

```text
Front:
Why can `longest(x.as_str(), y.as_str())` return `&str` only when the returned reference is tied to the input lifetimes?

Back:
The returned reference must be known to live no longer than the input reference it came from. A lifetime parameter expresses that relationship; it does not extend either input's lifetime.
```

## 13. Source Expansion and Listing Handling

Cards based on mdBook source must use the rendered learning example, not raw source artifacts.

Requirements:

- Resolve source directives such as `{{#include ...}}` and `{{#rustdoc_include ...}}` before judging the card's code or wording.
- Preserve listing captions, filenames, and before/after context when they are needed to understand the teaching point.
- Do not treat hidden doctest setup lines, raw mdBook directives, figure markup, or image references as ordinary prose headings or card content.
- If a source listing evolves across a chapter, an `evolution` card may compare two short excerpts, but it must identify the exact changed behavior or design pressure.
- If a diagram or image carries the teaching point, either convert the point into a text/card prompt or include the image only when it remains readable and necessary in the final card.

Good evolution card:

````text
Front:
What problem does this later version solve compared with the earlier one?

Earlier:
```rust
let response = String::new();
```

Later:
```rust
let response = String::from("HTTP/1.1 200 OK\r\n\r\n");
```

Back:
The later version sends a real HTTP status line instead of an empty response, so the browser can interpret the server's reply.
````

Bad:

```text
Front:
What does `{{#rustdoc_include ../listings/ch17-01.rs}}` teach?
```

## 14. Rendering and Readability

Cards must be readable in their final review form.

Requirements:

- Code fences must not break the card layout.
- Code should be short enough to fit the tested point.
- Long code should be reduced without hiding the relevant ownership, lifetime, trait, or control-flow behavior.
- Tables should be avoided unless they remain readable on the target card layout.
- Images must have a clear learning purpose and must not replace the answer.
- Markdown artifacts such as stray headings must not appear in card bodies.

## 15. Duplicate and Low-Value Rejection

Reject duplicate or near-duplicate cards unless the distinction is intentional and visible.

Bad duplicate:

```text
Front:
What is `cargo run`?

Front:
Which command runs a package?
```

Good distinction:

```text
Front:
What does `cargo check` do that makes it faster than `cargo build`?

Front:
When would you prefer `cargo build --release` over `cargo build`?
```

Reject cards with these patterns:

- vague chapter references;
- unbounded essay prompts;
- answers that only quote the source;
- typo-filled code;
- outdated syntax presented as current syntax;
- prompts answerable by reading the front instead of recalling or reasoning;
- answer-only trivia that does not support Rust fluency.

## 16. Good Card Acceptance Checklist

A card is acceptable when all of the following are true:

- It tests one primary target.
- The prompt is specific and answerable.
- The answer includes the reason or boundary.
- Theory paragraphs are split into bounded cards instead of copied into one answer.
- Important claims from source paragraphs are either carded or intentionally rejected as low-value, duplicate, or not relevant.
- The card stands alone when reviewed out of order.
- Rust terminology is precise.
- Code is valid or intentionally marked as invalid.
- Source fence attributes are respected when they change compile, run, or playground expectations.
- Partial code is explicitly marked as an excerpt and has enough context.
- Non-Rust snippets are labeled by role and kept focused.
- Unsafe cards state the safety obligation and who upholds it.
- Teaching simplifications preserve the caveat that makes the card accurate.
- mdBook includes, hidden lines, listings, and images are handled as source structure, not accidental card text.
- The card teaches current Rust unless explicitly contrasting older syntax.
- The expected answer is short enough for review.
- The card requires recall or reasoning, not passive rereading.
- Similar existing cards do not already test the same distinction.

Prefer cards that ask the learner to:

- recall a bounded definition or important fact;
- correct a common misconception;
- predict compile or runtime behavior;
- identify a violated rule;
- rewrite code idiomatically;
- explain the reason an example evolved from one listing to the next;
- choose between related Rust concepts;
- recall exact syntax for a focused purpose;
- explain an ownership, borrowing, lifetime, trait, async, or unsafe boundary;
- state a safety contract or invariant that makes unsafe code sound.
