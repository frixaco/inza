# Appendices Notes

Status: extracted (all 8 appendix sections extracted; no final cards drafted yet)

Source files:

- `rust-book/src/appendix-00.md` - Appendix
- `rust-book/src/appendix-01-keywords.md` - A - Keywords
- `rust-book/src/appendix-02-operators.md` - B - Operators and Symbols
- `rust-book/src/appendix-03-derivable-traits.md` - C - Derivable Traits
- `rust-book/src/appendix-04-useful-development-tools.md` - D - Useful Development Tools
- `rust-book/src/appendix-05-editions.md` - E - Editions
- `rust-book/src/appendix-06-translation.md` - F - Translations of the Book
- `rust-book/src/appendix-07-nightly-rust.md` - G - How Rust is Made and “Nightly Rust”

Requirement refs:

- `Appendices`
- `MR-02`

## Section: Appendix

Source: `rust-book/src/appendix-00.md`
Coverage status: extracted
Coverage id: `appendix-00`

### Learning Objectives

- Learner can identify the appendices as Rust Book reference material rather than project or concept chapters.
- Learner can explain that the appendices support later lookup and review during a Rust learning journey.
- Learner can identify which concrete appendix topics are deferred to the remaining appendix source files.
- Learner can distinguish the appendix overview from the detailed appendix sections that contain keywords, operators, derivable traits, tools, editions, translations, and nightly Rust.

### Card Content Candidates

#### Concepts

- The appendix overview is a short framing section.
- The appendices contain reference material.
- The book says the appendix material may be useful in a learner's Rust journey.
- The overview does not introduce new Rust syntax by itself.
- The overview does not list concrete keywords, operators, traits, tools, editions, translations, or nightly Rust details.
- The concrete teachable appendix material is located in later appendix sections.
- Appendix A covers keywords.
- Appendix B covers operators and symbols.
- Appendix C covers derivable traits.
- Appendix D covers useful development tools.
- Appendix E covers Rust editions.
- Appendix F covers translations of the book.
- Appendix G covers how Rust is made and nightly Rust.
- The deck should treat this overview as a roadmap and reserve detailed cards for the topic-specific appendix sections.

#### Syntax Forms

- No Rust syntax is introduced in `appendix-00`.
- Appendix syntax requirements to extract in later sections include raw identifiers, easy-to-confuse operators and symbols such as `::`, `->`, `=>`, `..`, `..=`, `?`, `!`, `_`, `&`, `*`, and turbofish `::<T>`, plus tool commands such as `cargo fmt`, `cargo clippy`, and `cargo fix`.

#### Prediction / Diagnostic Examples

- Given the source sentence "reference material you may find useful," classify `appendix-00` as overview/reference framing rather than a section with detailed Rust rules.
- Given a proposed final card about a specific keyword from `appendix-00` alone, reject it as under-sourced because keyword details appear in Appendix A.
- Given a proposed final card about `cargo fmt` from `appendix-00` alone, reject it as under-sourced because tool details appear in Appendix D.
- Given a proposed final card about Rust 2024 from `appendix-00` alone, reject it as under-sourced because edition details appear in Appendix E.

#### Failure Modes

- Treating `appendix-00` as if it contains the concrete appendix requirements would overclaim from a four-line overview.
- Skipping the remaining appendix sections after extracting this overview would violate the appendix coverage requirement.
- Drafting detailed cards for keywords, operators, derivable traits, tools, editions, translations, or nightly Rust from this overview alone would be under-sourced.
- Treating appendices as optional for the deck would violate the requirement to cover every official Rust Book chapter and appendix.

#### Comparisons

- Appendix overview vs topic appendices: the overview frames the appendices as reference material; the later appendix sections contain concrete teachable facts.
- Concept/project chapters vs appendices: earlier chapters teach through concepts and projects; appendices provide reference material for lookup and reinforcement.
- Overview extraction vs final card drafting: this section can support roadmap-level notes, but detailed final cards should come from the later appendix sections.

#### Project / Architecture Decisions

- Include `appendix-00` in coverage because the requirements demand every official book appendix entry be represented.
- Keep `appendix-00` extraction lightweight because the source contains only overview framing.
- Use later appendix sections for the required concrete coverage of keywords, operators, derivable traits, tools, editions, translations, and nightly Rust.
- Do not draft final cards from this overview until the detailed appendix sections are extracted.

#### Listings Worth Converting

- No code listings or tables appear in `appendix-00`.
- Later appendix sections may include tables and command syntax that should become cards.

### Drafting Notes

- Extraction complete for `appendix-00`; no final cards drafted in this pass.
- Candidate card types: `project_architecture` for placing appendices in the deck coverage model; `concept_boundary` for overview/reference framing vs concrete appendix content.
- Requirement coverage from this section: appendix-level roadmap framing and confirmation that appendices are part of the complete deck scope.
- Requirement gaps carried forward: strict keywords, reserved keywords, raw identifiers, operators and symbols, derivable traits, Rustfmt and `cargo fmt`, Clippy and `cargo clippy`, Rustfix and `cargo fix`, rust-analyzer/editor support, Rust editions including 2015/2018/2021/2024 and `edition = "2024"`, translations, nightly Rust, release channels, and why unstable features are not assumed.

## Section: A - Keywords

Source: `rust-book/src/appendix-01-keywords.md`
Coverage status: extracted
Coverage id: `appendix-01-keywords`

### Learning Objectives

- Learner can explain that Rust reserves keywords for current or future language use.
- Learner can identify what counts as an identifier in the Rust Book appendix.
- Learner can distinguish keywords currently in use from keywords reserved for future use.
- Learner can recall the current-use keyword list and the role of each keyword at a practical level.
- Learner can recall the future-reserved keyword list and explain that these words currently have no functionality.
- Learner can explain why keywords normally cannot be used as identifiers.
- Learner can use raw identifier syntax with the `r#` prefix.
- Learner can diagnose the `expected identifier, found keyword` error for trying to name a function `match`.
- Learner can rewrite a keyword identifier such as `match` as `r#match` in both definition and call sites.
- Learner can explain the cross-edition use case for raw identifiers, including `try` from Rust 2015 code used by later editions.

### Card Content Candidates

#### Concepts

- Rust reserves keywords for current or future language use.
- Reserved keywords normally cannot be used as identifiers.
- Raw identifiers are the exception that can allow a keyword-shaped name.
- Identifiers are names for functions.
- Identifiers are names for variables.
- Identifiers are names for parameters.
- Identifiers are names for struct fields.
- Identifiers are names for modules.
- Identifiers are names for crates.
- Identifiers are names for constants.
- Identifiers are names for macros.
- Identifiers are names for static values.
- Identifiers are names for attributes.
- Identifiers are names for types.
- Identifiers are names for traits.
- Identifiers are names for lifetimes.
- Appendix A splits keywords into currently used keywords and keywords reserved for future use.
- Keywords currently in use have language functionality.
- Keywords reserved for future use do not yet have functionality.
- Future-reserved keywords are still reserved by Rust and cannot be used normally as identifiers.
- `as` performs primitive casting, disambiguates the trait containing an item, or renames items in `use` statements.
- `async` returns a `Future` instead of blocking the current thread.
- `await` suspends execution until the result of a `Future` is ready.
- `break` exits a loop immediately.
- `const` defines constant items or constant raw pointers.
- `continue` continues to the next loop iteration.
- `crate` refers to the crate root in a module path.
- `dyn` selects dynamic dispatch to a trait object.
- `else` is the fallback for `if` and `if let` control flow constructs.
- `enum` defines an enumeration.
- `extern` links an external function or variable.
- `false` is the Boolean false literal.
- `fn` defines a function or the function pointer type.
- `for` loops over iterator items, implements a trait, or specifies a higher-ranked lifetime.
- `if` branches based on the result of a conditional expression.
- `impl` implements inherent or trait functionality.
- `in` is part of `for` loop syntax.
- `let` binds a variable.
- `loop` loops unconditionally.
- `match` matches a value to patterns.
- `mod` defines a module.
- `move` makes a closure take ownership of all its captures.
- `mut` denotes mutability in references, raw pointers, or pattern bindings.
- `pub` denotes public visibility in struct fields, `impl` blocks, or modules.
- `ref` binds by reference.
- `return` returns from a function.
- `Self` is a type alias for the type currently being defined or implemented.
- `self` is the method subject or current module.
- `static` defines a global variable or a lifetime lasting the entire program execution.
- `struct` defines a structure.
- `super` refers to the parent module of the current module.
- `trait` defines a trait.
- `true` is the Boolean true literal.
- `type` defines a type alias or associated type.
- `union` defines a union and is a keyword only when used in a union declaration.
- `unsafe` denotes unsafe code, functions, traits, or implementations.
- `use` brings symbols into scope.
- `where` denotes clauses that constrain a type.
- `while` loops conditionally based on the result of an expression.
- The future-reserved keywords listed by the appendix are `abstract`, `become`, `box`, `do`, `final`, `gen`, `macro`, `override`, `priv`, `try`, `typeof`, `unsized`, `virtual`, and `yield`.
- Raw identifiers are syntax for using keywords where they normally are not allowed.
- A raw identifier prefixes a keyword with `r#`.
- `match` is a keyword, so `fn match(...)` is rejected as a function name.
- The compiler error for `fn match(...)` says `expected identifier, found keyword`.
- `fn r#match(...)` uses the raw identifier syntax to make the function name legal.
- A raw identifier must be used both where the item is defined and where it is called.
- Raw identifiers allow using any chosen word as an identifier even if that word is a reserved keyword.
- Raw identifiers give more freedom in choosing identifier names.
- Raw identifiers help integrate with programs written in a language where those words are not keywords.
- Raw identifiers allow using libraries written in a different Rust edition than the current crate.
- `try` is not a keyword in Rust 2015.
- `try` is a keyword in Rust 2018, Rust 2021, and Rust 2024.
- If a Rust 2015 library exposes a `try` function, later-edition code calls it as `r#try`.
- Appendix A points to Appendix E for more information on editions.

#### Syntax Forms

- Raw identifier prefix:
  ```rust
  r#keyword
  ```
- Rejected keyword-as-function-name example:
  ```rust
  fn match(needle: &str, haystack: &str) -> bool {
      haystack.contains(needle)
  }
  ```
- Diagnostic from the rejected `match` function name:
  ```text
  error: expected identifier, found keyword `match`
   --> src/main.rs:4:4
    |
  4 | fn match(needle: &str, haystack: &str) -> bool {
    |    ^^^^^ expected identifier, found keyword
  ```
- Raw identifier definition and call:
  ```rust
  fn r#match(needle: &str, haystack: &str) -> bool {
      haystack.contains(needle)
  }

  fn main() {
      assert!(r#match("foo", "foobar"));
  }
  ```
- Cross-edition raw identifier call form for a Rust 2015 `try` function from later editions:
  ```rust
  r#try
  ```

#### Prediction / Diagnostic Examples

- Given a proposed variable named `match`, predict that it is rejected unless written as a raw identifier.
- Given `fn match(needle: &str, haystack: &str) -> bool`, identify the error: `expected identifier, found keyword`.
- Given `fn r#match(...)` but a call written as `match(...)`, predict that the call site must also use `r#match(...)`.
- Given a Rust 2015 library function named `try` used from Rust 2018/2021/2024 code, choose `r#try` at the call site.
- Given a word from the future-reserved list, predict that Rust reserves it even though it currently has no functionality.
- Given `union` outside a union declaration, recall the source nuance that it is a keyword only when used in a union declaration.
- Given `as` in a `use` statement, identify the keyword role as renaming an imported item.
- Given `dyn Trait`, identify `dyn` as selecting dynamic dispatch to a trait object.
- Given `async` and `await`, distinguish their roles: `async` returns a `Future`; `await` suspends until a future is ready.
- Given `Self` vs `self`, identify `Self` as the current type alias and `self` as the method subject or current module.

#### Failure Modes

- Using a keyword as a normal identifier without `r#` fails.
- Assuming future-reserved keywords are available because they have no current functionality is wrong.
- Forgetting the `r#` prefix at call sites can break code even if the definition uses `r#`.
- Treating `try` as always available for an ordinary identifier ignores edition differences.
- Treating raw identifiers as changing the underlying function behavior is wrong; they only allow an otherwise reserved name.
- Confusing `Self` and `self` misses that one names the current type and the other names the method subject or current module.
- Treating `union` as always keyword-like misses the source nuance that it is keyword only in a union declaration.
- Drafting cards about operator symbols from Appendix A would be under-sourced; operators are Appendix B.

#### Comparisons

- Current-use keywords vs future-reserved keywords: current-use keywords have language functionality; future-reserved keywords are reserved but currently have no functionality.
- Keyword vs identifier: a keyword is reserved by the language; an identifier is a name for a program item such as a function, variable, module, type, trait, or lifetime.
- Normal identifier vs raw identifier: a normal identifier cannot be a keyword; a raw identifier uses `r#` to use a keyword-shaped name.
- `async` vs `await`: `async` produces a `Future`; `await` waits for a future's result.
- `Self` vs `self`: `Self` refers to the type being defined or implemented; `self` refers to the method subject or current module.
- Rust 2015 `try` vs later-edition `try`: `try` was not a keyword in 2015 but is a keyword in 2018, 2021, and 2024, so later editions use `r#try` for a 2015 API named `try`.

#### Project / Architecture Decisions

- Use Appendix A as the source for final cards about keyword categories, keyword functions, and raw identifiers.
- Keep future-reserved keywords as a bounded enumeration card candidate because the appendix lists them exactly.
- Prefer atomic cards for individual high-confusion keywords such as `as`, `dyn`, `Self`, `self`, `union`, `async`, and `await`.
- Create diagnostic card candidates from the `fn match` compile-fail example and the `r#match` fix.
- Connect `r#try` to edition interoperability, but defer broader edition coverage to Appendix E.
- Keep operator and symbol coverage out of Appendix A and defer it to Appendix B.

#### Listings Worth Converting

- The rejected `fn match(needle: &str, haystack: &str) -> bool` example should become a compile-fail diagnostic card.
- The `expected identifier, found keyword 'match'` output should become a diagnostic card.
- The fixed `fn r#match(...)` plus `assert!(r#match("foo", "foobar"));` example should become a syntax/transformation card.
- The `r#try` cross-edition example should become a concept-boundary or syntax card tied to Appendix A and Appendix E.
- No numbered Rust Book listing appears in Appendix A.

### Drafting Notes

- Extraction complete for `appendix-01-keywords`; no final cards drafted in this pass.
- Candidate card types: `api_recall` for exact keyword sets; `syntax` for `r#` raw identifiers; `diagnostic` for `expected identifier, found keyword`; `comparison` for current-use vs future-reserved keywords, keyword vs identifier, `Self` vs `self`, and Rust 2015 `try` vs later-edition `try`; `concept_boundary` for raw identifiers and edition interoperability.
- Requirement coverage from this section: strict/current-use keywords, reserved/future-use keywords, raw identifiers, and the `r#try` edition-interoperability use case.
- Requirement gaps carried forward: operators and symbols, derivable traits, Rustfmt and `cargo fmt`, Clippy and `cargo clippy`, Rustfix and `cargo fix`, rust-analyzer/editor support, editions beyond the `try` example, translations, nightly Rust, release channels, and why unstable features are not assumed.

## Section: B - Operators and Symbols

Source: `rust-book/src/appendix-02-operators.md`
Coverage status: extracted
Coverage id: `appendix-02-operators`

### Learning Objectives

- Learner can explain that Appendix B is a glossary of Rust syntax for operators and symbols.
- Learner can distinguish operators from non-operator symbols in the appendix framing.
- Learner can map common operators to their meaning and overload trait where the table lists one.
- Learner can distinguish the multiple meanings of `!`, `&`, `*`, `+`, `.`, `..`, `:`, `;`, and `|` by context.
- Learner can explain the especially easy-to-confuse appendix symbols: `::`, `->`, `=>`, `..`, `..=`, `?`, `!`, `_`, `&`, `*`, and turbofish `::<T>`.
- Learner can identify path syntax, generic syntax, trait-bound syntax, macro/attribute syntax, comment syntax, tuple/parenthesis syntax, curly-brace syntax, and square-bracket syntax from the appendix tables.
- Learner can use the overloadability column to know when an operator maps to a trait such as `Add`, `Deref`, `Index`, or `PartialEq`.
- Learner can identify deprecated `...` inclusive range pattern syntax and prefer `..=`.

### Card Content Candidates

#### Concepts

- Appendix B contains a glossary of Rust syntax.
- The glossary includes operators.
- The glossary includes symbols that appear by themselves.
- The glossary includes symbols used in paths.
- The glossary includes symbols used with generics.
- The glossary includes symbols used in trait bounds.
- The glossary includes symbols used in macros.
- The glossary includes symbols used in attributes.
- The glossary includes symbols used in comments.
- The glossary includes symbols used in tuples and brackets.
- Table B-1 lists operators, examples, meanings, and overloadability.
- An overloadable operator lists the trait used to overload it.
- Table B-2 lists stand-alone syntax that is not treated as operators.
- Table B-3 lists path-related syntax.
- Table B-4 lists generic syntax.
- Table B-5 lists trait-bound constraint syntax.
- Table B-6 lists macro and attribute syntax.
- Table B-7 lists comment syntax.
- Table B-8 lists parenthesis syntax.
- Table B-9 lists curly-bracket syntax.
- Table B-10 lists square-bracket syntax.
- `!` has multiple meanings: macro invocation, logical or bitwise complement, and the never type in stand-alone syntax.
- `&` has multiple meanings: borrow, borrowed pointer type, and bitwise AND.
- `*` has multiple meanings: multiplication, dereference, and raw pointer type.
- `+` has multiple meanings: compound type constraint and arithmetic addition.
- `.` has multiple meanings: field access, method call, and tuple indexing.
- `..` has multiple meanings: right-exclusive range literal, struct literal update syntax, and "and the rest" pattern binding.
- `:` has multiple meanings: type/pattern constraints, struct field initializer, and loop label.
- `;` has multiple meanings: statement/item terminator and fixed-size array syntax.
- `|` has multiple meanings: pattern alternatives, bitwise OR, and closure parameter delimiters.
- `::` is path syntax, not arithmetic or comparison syntax.
- `->` marks the return type of a function or closure.
- `=>` is part of match arm syntax.
- `..=` is the right-inclusive range literal syntax.
- `?` propagates errors.
- `_` is an ignored pattern binding and can make integer literals more readable.
- Turbofish `::<...>` specifies generic parameters in an expression.
- `...` is deprecated for inclusive range patterns; the appendix says to use `..=` instead.

#### Syntax Forms

- Macro invocation operator:
  ```rust
  ident!(...)
  ident!{...}
  ident![...]
  ```
- Logical or bitwise complement:
  ```rust
  !expr
  ```
  Overload trait: `Not`.
- Non-equality comparison:
  ```rust
  expr != expr
  ```
  Overload trait: `PartialEq`.
- Arithmetic remainder and assignment:
  ```rust
  expr % expr
  var %= expr
  ```
  Overload traits: `Rem`, `RemAssign`.
- Borrow expression and borrowed pointer type:
  ```rust
  &expr
  &mut expr
  &type
  &mut type
  &'a type
  &'a mut type
  ```
- Bitwise AND and assignment:
  ```rust
  expr & expr
  var &= expr
  ```
  Overload traits: `BitAnd`, `BitAndAssign`.
- Short-circuiting logical AND:
  ```rust
  expr && expr
  ```
- Multiplication, dereference, and raw pointer syntax:
  ```rust
  expr * expr
  *expr
  *const type
  *mut type
  ```
  Overload traits: `Mul` for multiplication and `Deref` for dereference.
- Multiplication assignment:
  ```rust
  var *= expr
  ```
  Overload trait: `MulAssign`.
- Compound type constraint:
  ```rust
  trait + trait
  'a + trait
  ```
- Addition and assignment:
  ```rust
  expr + expr
  var += expr
  ```
  Overload traits: `Add`, `AddAssign`.
- Argument and element separator:
  ```rust
  expr, expr
  ```
- Negation, subtraction, and subtraction assignment:
  ```rust
  -expr
  expr - expr
  var -= expr
  ```
  Overload traits: `Neg`, `Sub`, `SubAssign`.
- Function and closure return type:
  ```rust
  fn(...) -> type
  |...| -> type
  ```
- Field access, method call, and tuple indexing:
  ```rust
  expr.ident
  expr.ident(expr, ...)
  expr.0
  ```
- Range, update, and rest-pattern forms:
  ```rust
  ..
  expr..
  ..expr
  expr..expr
  ..=expr
  expr..=expr
  ..expr
  variant(x, ..)
  struct_type { x, .. }
  ```
- Deprecated inclusive range pattern:
  ```rust
  expr...expr
  ```
  Use `..=` instead.
- Division and assignment:
  ```rust
  expr / expr
  var /= expr
  ```
  Overload traits: `Div`, `DivAssign`.
- Type/pattern constraint, struct field initializer, and loop label:
  ```rust
  pat: type
  ident: type
  ident: expr
  'a: loop { ... }
  ```
- Statement/item terminator and fixed-size array syntax:
  ```rust
  expr;
  [...; len]
  ```
- Shift, comparison, equality, and match arm operators:
  ```rust
  expr << expr
  var <<= expr
  expr < expr
  expr <= expr
  var = expr
  ident = type
  expr == expr
  pat => expr
  expr > expr
  expr >= expr
  expr >> expr
  var >>= expr
  ```
  Relevant overload traits include `Shl`, `ShlAssign`, `PartialOrd`, `PartialEq`, `Shr`, and `ShrAssign`.
- Pattern binding:
  ```rust
  ident @ pat
  ```
- Bitwise XOR and assignment:
  ```rust
  expr ^ expr
  var ^= expr
  ```
  Overload traits: `BitXor`, `BitXorAssign`.
- Pattern alternative, bitwise OR, bitwise OR assignment, and short-circuiting OR:
  ```rust
  pat | pat
  expr | expr
  var |= expr
  expr || expr
  ```
  Overload traits for bitwise forms: `BitOr`, `BitOrAssign`.
- Error propagation:
  ```rust
  expr?
  ```
- Stand-alone syntax examples:
  ```rust
  'ident
  "..."
  r"..."
  r#"..."#
  b"..."
  br"..."
  '...'
  b'...'
  |...| expr
  !
  _
  ```
- Path-related syntax:
  ```rust
  ident::ident
  ::path
  self::path
  super::path
  type::ident
  <type as trait>::ident
  <type>::...
  trait::method(...)
  type::method(...)
  <type as trait>::method(...)
  ```
- Generic syntax:
  ```rust
  path<...>
  path::<...>
  method::<...>
  fn ident<...> ...
  struct ident<...> ...
  enum ident<...> ...
  impl<...> ...
  for<...> type
  type<ident=type>
  ```
- Trait-bound syntax:
  ```rust
  T: U
  T: 'a
  T: 'static
  'b: 'a
  T: ?Sized
  'a + trait
  trait + trait
  ```
- Macro and attribute syntax:
  ```rust
  #[meta]
  #![meta]
  $ident
  $ident:kind
  $(...)...
  ident!(...)
  ident!{...}
  ident![...]
  ```
- Comment syntax:
  ```rust
  //
  //!
  ///
  /*...*/
  /*!...*/
  /**...*/
  ```
- Parentheses syntax:
  ```rust
  ()
  (expr)
  (expr,)
  (type,)
  (expr, ...)
  (type, ...)
  expr(expr, ...)
  ```
- Curly-bracket syntax:
  ```rust
  { ... }
  Type { ... }
  ```
- Square-bracket syntax:
  ```rust
  [...]
  [expr; len]
  [type; len]
  expr[expr]
  expr[..]
  expr[a..]
  expr[..b]
  expr[a..b]
  ```

#### Prediction / Diagnostic Examples

- Given `ident!(...)`, identify `!` as macro expansion, not logical negation.
- Given `!expr`, identify `!` as logical or bitwise complement and overloadable via `Not`.
- Given `expr?`, identify `?` as error propagation.
- Given `&expr` or `&mut expr`, identify `&` as borrowing.
- Given `&T`, `&mut T`, `&'a T`, or `&'a mut T`, identify `&` as part of a borrowed pointer type.
- Given `expr & expr`, identify `&` as bitwise AND, not borrowing.
- Given `*expr`, identify `*` as dereference.
- Given `*const T` or `*mut T`, identify `*` as part of a raw pointer type.
- Given `expr * expr`, identify `*` as multiplication.
- Given `fn f() -> T`, identify `->` as return type syntax.
- Given `pat => expr`, identify `=>` as match arm syntax.
- Given `expr..expr`, identify a right-exclusive range literal.
- Given `expr..=expr`, identify a right-inclusive range literal.
- Given `struct_type { x, .. }`, identify `..` as "and the rest" pattern binding.
- Given `Type { field, ..old }`, identify `..` as struct literal update syntax.
- Given `expr...expr`, identify deprecated inclusive range pattern syntax and replace with `..=`.
- Given `path::<T>` or `method::<T>`, identify the turbofish expression form for generic parameters.
- Given `ident::ident`, identify a namespace path.
- Given `::path`, identify an explicitly absolute path relative to the crate root.
- Given `self::path`, identify an explicitly relative path from the current module.
- Given `super::path`, identify a path relative to the parent module.
- Given `<type as trait>::method(...)`, identify explicit method disambiguation by trait and type.
- Given `T: ?Sized`, identify allowance for dynamically sized types.
- Given `#[meta]` vs `#![meta]`, distinguish outer and inner attributes.
- Given `_` in a pattern, identify an ignored binding.
- Given `_` in a number such as `1_000`, identify readability formatting in an integer literal.
- Given `expr[..]`, identify collection slicing via a range value used as the index.
- Given `(expr,)`, identify a single-element tuple, not only parenthesized expression.

#### Failure Modes

- Treating every `!` as negation misses macro invocation and the never type.
- Treating every `&` as borrowing misses borrowed pointer types and bitwise AND.
- Treating every `*` as multiplication misses dereference and raw pointer types.
- Treating `=>` as a comparison or closure arrow is wrong; it belongs to match arm syntax.
- Treating `->` as a match arm arrow is wrong; it marks function and closure return types.
- Confusing `..` and `..=` changes whether the range includes the right endpoint.
- Using deprecated `...` for inclusive range patterns violates the appendix guidance to use `..=`.
- Treating `::path`, `self::path`, and `super::path` as interchangeable loses the path's starting point.
- Forgetting the turbofish form `::<...>` can make generic method calls hard to parse or infer.
- Treating `_` as only an ignored pattern misses its use in readable integer literals.
- Treating `(expr)` and `(expr,)` as the same misses the single-element tuple comma requirement.
- Treating `[expr; len]` and `[expr, expr]` as equivalent misses repeated initialization semantics.
- Treating `#[meta]` and `#![meta]` as equivalent misses outer vs inner attribute placement.
- Assuming every operator is overloadable is wrong; the appendix explicitly leaves some overloadability entries blank.
- Assuming non-operator symbols behave like function or method calls contradicts the appendix framing.

#### Comparisons

- Operator vs non-operator symbol: Table B-1 operators can behave like operations and may be overloadable; later tables list syntax symbols that do not function as operators.
- Macro `!` vs complement `!` vs never type `!`: macro `!` follows an identifier, complement prefixes an expression, and never type appears as a stand-alone type syntax.
- Borrow `&` vs bitwise AND `&`: borrow prefixes an expression or type; bitwise AND appears between expressions.
- Dereference `*expr` vs raw pointer `*const T`/`*mut T` vs multiplication `expr * expr`: the same symbol changes meaning by position and operands.
- `->` vs `=>`: `->` marks function/closure return types; `=>` separates a pattern from a match arm expression.
- `..` vs `..=`: `..` is right-exclusive in ranges; `..=` is right-inclusive.
- Range `..` vs rest-pattern `..` vs struct update `..`: range forms build ranges, pattern forms ignore remaining fields/elements, and struct update fills remaining fields from another value.
- `:` in `pat: type` vs `ident: expr` vs `'a: loop`: type/pattern constraint, struct field initializer, and loop label are different contexts.
- `path<...>` vs `path::<...>`: type-position generic parameters use angle brackets; expression-position generic arguments often use turbofish.
- `#[meta]` vs `#![meta]`: outer attribute vs inner attribute.
- `//` vs `//!` vs `///`: ordinary line comment, inner line doc comment, and outer line doc comment.
- `()` vs `(expr,)`: unit/empty tuple vs single-element tuple expression.
- `[expr; len]` vs `[type; len]`: array literal with repeated values vs array type.

#### Project / Architecture Decisions

- Use Appendix B as the source for operator and symbol lookup cards.
- Prioritize cards for symbols required by the deck spec: `::`, `->`, `=>`, `..`, `..=`, `?`, `!`, `_`, `&`, `*`, and `::<T>`.
- Use table names B-1 through B-10 as source anchors for final card metadata.
- Split overloaded or multi-context symbols into separate atomic cards.
- Create comparison cards for pairs that learners commonly confuse, especially `->` vs `=>`, `..` vs `..=`, borrow `&` vs bitwise `&`, dereference `*` vs raw pointer `*`, and `path<...>` vs `path::<...>`.
- Mark cards for deprecated `...` as current-guidance contrast cards that say to use `..=`.
- Do not use Appendix B as the final source for deeper semantics of borrowing, dereferencing, error propagation, or generics; use it for syntax recall and cross-reference deeper chapters as needed.

#### Listings Worth Converting

- Table B-1: operator glossary and overload trait mapping.
- Table B-2: stand-alone syntax including lifetimes/labels, literal forms, closures, never type, and `_`.
- Table B-3: path-related syntax including `::`, `self::`, `super::`, associated items, and method disambiguation.
- Table B-4: generic syntax including turbofish `::<...>`.
- Table B-5: trait-bound constraints including `T: ?Sized` and lifetime outlives bounds.
- Table B-6: macro and attribute syntax.
- Table B-7: line, block, and doc comment syntax.
- Table B-8: parentheses and tuple syntax.
- Table B-9: block expression and struct literal curly-brace syntax.
- Table B-10: array, indexing, and slicing square-bracket syntax.

### Drafting Notes

- Extraction complete for `appendix-02-operators`; no final cards drafted in this pass.
- Candidate card types: `syntax` for individual operator/symbol forms; `comparison` for confusing pairs; `api_recall` for overload trait mapping; `diagnostic` for deprecated `...` and tuple comma/slicing confusions; `concept_boundary` for operator vs non-operator symbol.
- Requirement coverage from this section: operators and symbols, including `::`, `->`, `=>`, `..`, `..=`, `?`, `!`, `_`, `&`, `*`, and turbofish `::<T>`.
- Requirement gaps carried forward: derivable traits, Rustfmt and `cargo fmt`, Clippy and `cargo clippy`, Rustfix and `cargo fix`, rust-analyzer/editor support, editions beyond earlier keyword notes, translations, nightly Rust, release channels, and why unstable features are not assumed.

## Section: C - Derivable Traits

Source: `rust-book/src/appendix-03-derivable-traits.md`
Coverage status: extracted
Coverage id: `appendix-03-derivable-traits`

### Learning Objectives

- Learner can explain that `derive` generates default trait implementations for annotated structs or enums.
- Learner can identify which standard-library traits Appendix C says can be derived and what behavior each derived implementation provides.
- Learner can distinguish traits that enable operators or formatting from marker traits that communicate stronger invariants.
- Learner can predict when deriving a trait is allowed based on whether all fields or enum payload values implement the same trait.
- Learner can choose between derived behavior and a manual trait implementation when a type needs domain-specific formatting, equality, ordering, duplication, hashing, or defaults.

### Card Content Candidates

#### Concepts

- The `derive` attribute can be applied to a struct or enum definition; it generates an implementation of a trait with default behavior for the annotated type.
- Appendix C is a reference for the standard-library traits that can be derived on user-defined types.
- The section's framing for each derivable trait: what operations the trait enables, what derived behavior does, what implementing the trait signifies, when the trait can or cannot be implemented, and examples that require it.
- `Display` is a standard-library trait that cannot be derived because end-user formatting has no sensible universal default; programmers must decide what data to show and in what format.
- Standard-library derive support is finite, but derive in general is open-ended because libraries can provide custom derives through procedural macros.
- `Debug` enables debug formatting with `:?` in formatting placeholders and is intended for programmer inspection.
- `Debug` is required by `assert_eq!` so failed equality assertions can print the compared values.
- `PartialEq` enables equality and inequality checks with `==` and `!=`.
- Derived `PartialEq` on structs treats two values as equal only when all fields are equal; if any field differs, the structs are not equal.
- Derived `PartialEq` on enums treats each variant as equal to itself and not equal to other variants.
- `Eq` has no methods; it signals that every value of the type is equal to itself.
- `Eq` requires `PartialEq`, but not every `PartialEq` type can implement `Eq`; floating-point `NaN` prevents floats from satisfying the self-equality guarantee.
- `Eq` is required for `HashMap<K, V>` keys so the map can decide whether two keys are the same.
- `PartialOrd` enables ordering comparisons with `<`, `>`, `<=`, and `>=`, and requires `PartialEq`.
- Derived `PartialOrd` implements `partial_cmp`, returning `Option<Ordering>` because some pairs of values may have no valid ordering.
- `NaN` is the appendix example where `partial_cmp` with a floating-point value returns `None`.
- Derived `PartialOrd` on structs compares fields in declaration order; derived `PartialOrd` on enums orders earlier variants before later variants.
- `PartialOrd` is required by examples such as `rand::Rng::gen_range`, which works with a range expression.
- `Ord` means any two values of the type have a valid ordering; it implements `cmp`, returning `Ordering` rather than `Option<Ordering>`.
- `Ord` requires `PartialOrd` and `Eq`, and through `Eq` also requires `PartialEq`.
- Derived `Ord` on structs and enums follows the same field-order and variant-order behavior as derived `PartialOrd`.
- `Ord` is required for values stored in `BTreeSet<T>`, which stores data by sort order.
- `Clone` allows explicit deep copying of a value; cloning may run arbitrary code and copy heap data.
- Derived `Clone` implements `clone` by calling `clone` on every field or enum payload value, so all parts of the type must implement `Clone`.
- `Clone` is required by `slice::to_vec` because the returned vector owns its elements and must clone items from the borrowed slice.
- `Copy` duplicates a value by copying stack bits only; no arbitrary code runs.
- `Copy` intentionally defines no methods so implementations cannot overload copying behavior and violate the fast bit-copy assumption.
- A type can derive `Copy` only when all of its parts implement `Copy`.
- Any type implementing `Copy` must also implement `Clone`; the `Clone` implementation for a `Copy` type is trivial and does the same bit-copy work.
- `Copy` is rarely required, but when a type is `Copy`, code can omit explicit `clone` calls and may have optimizations available.
- Anything possible with `Copy` can be done with `Clone`, but possibly with slower code or explicit `clone` calls.
- `Hash` maps a value of arbitrary size to a fixed-size hash value.
- Derived `Hash` implements `hash` by combining the hashes of each part, so all fields or enum payload values must implement `Hash`.
- `Hash` is required for keys in a `HashMap<K, V>` so data can be stored efficiently.
- `Default` creates a default value for a type.
- Derived `Default` implements `default` by calling `default` on each field or enum payload value, so all parts must implement `Default`.
- `Default::default` is commonly used with struct update syntax as `..Default::default()` to fill unspecified fields.
- `Default` is required by `Option<T>::unwrap_or_default`; when the option is `None`, it returns `Default::default()` for `T`.

#### Syntax Forms

- `#[derive(TraitName)]` as the attribute form that asks the compiler or a derive macro to generate a trait implementation for a struct or enum.
- `:?` inside `{}` placeholders requests `Debug` formatting.
- `==` and `!=` require `PartialEq`.
- `<`, `>`, `<=`, and `>=` require `PartialOrd`.
- `partial_cmp` returns `Option<Ordering>` for partially ordered types.
- `cmp` returns `Ordering` for totally ordered types.
- `.clone()` is the explicit duplication operation from `Clone`.
- `Default::default()` constructs a default value for a type that implements `Default`.
- `..Default::default()` fills the remaining fields in struct update syntax.
- `unwrap_or_default` on `Option<T>` requires `T: Default`.

#### Prediction / Diagnostic Examples

- Given a derived `PartialEq` struct, predict that two values compare equal only when every field compares equal.
- Given a derived `PartialEq` enum, predict that two values with different variants compare not equal even if similarly named fields or payload values look related.
- Given a derived `PartialOrd` struct, predict that comparison proceeds by field declaration order, not by semantic importance unless the declaration order matches that meaning.
- Given a derived `PartialOrd` enum, predict that variants earlier in the enum definition compare less than variants declared later.
- Given a float comparison involving `NaN`, predict that `partial_cmp` returns `None` and that floating-point types cannot satisfy the `Eq` self-equality invariant.
- Given a struct containing a non-`Clone` field, predict that deriving `Clone` for the whole struct is not allowed until that field type also implements `Clone`.
- Given a struct containing a non-`Copy` field, predict that deriving `Copy` is not allowed even if the outer type derives `Clone`.
- Given a borrowed slice converted with `to_vec`, identify why the element type must implement `Clone`.
- Given `Option<T>::unwrap_or_default()`, identify that `T` must implement `Default`.
- Given a custom type used as a `HashMap` key, identify that equality and hashing traits are part of the key requirements discussed by the appendix.

#### Failure Modes

- Trying to derive `Display` fails conceptually because Rust cannot infer end-user formatting decisions.
- Assuming every standard-library trait is derivable is wrong; Appendix C lists the standard-library traits with sensible derived behavior.
- Assuming custom derive is limited to the standard library is wrong; libraries can provide their own derive procedural macros.
- Deriving a trait for an aggregate type fails when a field or payload type lacks the required same-trait implementation.
- Deriving `Eq` for a type whose values can violate self-equality is invalid; floats and `NaN` are the appendix's key example.
- Treating `PartialOrd::partial_cmp` as always successful is wrong because it can return `None`.
- Treating `Ord::cmp` like `PartialOrd::partial_cmp` is wrong; `Ord` promises a valid ordering and returns `Ordering`.
- Treating `Copy` as a customizable hook is wrong; `Copy` has no methods and implies fast bit copying without arbitrary code.
- Deriving `Copy` without `Clone` is invalid because `Copy` requires `Clone`.
- Expecting derived `Default` to invent domain-specific defaults is wrong; derived `Default` delegates to each part's `Default`.

#### Comparisons

- Derived implementation vs manual implementation: derive supplies generic field-by-field or variant-order behavior; manual implementation is needed for domain-specific behavior.
- Standard-library derivable traits vs custom derive traits: Appendix C lists standard-library derives, while libraries can add derive support through procedural macros.
- `Debug` vs `Display`: `Debug` is derivable and programmer-facing; `Display` is user-facing and not derivable.
- `PartialEq` vs `Eq`: `PartialEq` enables `==`/`!=`; `Eq` adds the marker guarantee that every value equals itself.
- `PartialOrd` vs `Ord`: `PartialOrd` may fail to produce an ordering and returns `Option<Ordering>`; `Ord` always produces `Ordering`.
- Struct ordering vs enum ordering: derived struct ordering follows field declaration order; derived enum ordering follows variant declaration order.
- `Clone` vs `Copy`: `Clone` is explicit and may run arbitrary code or copy heap data; `Copy` is implicit bit duplication with no arbitrary code.
- `Hash` vs equality traits: `Hash` enables fixed-size hash values for efficient lookup; `Eq`/`PartialEq` determine whether keys are the same.
- `Default` vs struct update syntax: `Default` provides values; struct update with `..Default::default()` uses those values for omitted fields.

#### Project / Architecture Decisions

- Use Appendix C to close the deck requirement for derivable traits at a practical level.
- Create separate atomic cards for each derivable trait or trait pair: `Debug`, `PartialEq`/`Eq`, `PartialOrd`/`Ord`, `Clone`/`Copy`, `Hash`, and `Default`.
- Include source-backed cards for the common examples that require traits: `assert_eq!`, `HashMap<K, V>` keys, `BTreeSet<T>`, `slice::to_vec`, `Option<T>::unwrap_or_default`, and struct update with `..Default::default()`.
- Cross-link `Clone`/`Copy` cards to the deck's required move/copy/clone gap closure, but keep Appendix C cards focused on what deriving those traits means.
- Cross-link custom derive mechanics to Chapter 20 procedural macro extraction; Appendix C should only establish that derive can be library-provided and procedural-macro-based.
- Avoid presenting `Display` as derivable; use it as a concept-boundary card contrasting programmer output with end-user output.

#### Listings Worth Converting

- No numbered listings in Appendix C.
- Trait reference sections worth converting into cards: `Debug`, `PartialEq`/`Eq`, `PartialOrd`/`Ord`, `Clone`/`Copy`, `Hash`, and `Default`.
- Source-embedded examples worth converting: `assert_eq!` requiring `Debug` and `PartialEq`, `HashMap<K, V>` requiring equality and hashing support for keys, `BTreeSet<T>` requiring `Ord`, `to_vec` requiring `Clone`, `..Default::default()` struct update, and `unwrap_or_default` requiring `Default`.

### Drafting Notes

- Extraction complete for `appendix-03-derivable-traits`; no final cards drafted in this pass.
- Candidate card types: `api_recall` for trait meanings and required examples; `comparison` for `Debug`/`Display`, `PartialEq`/`Eq`, `PartialOrd`/`Ord`, and `Clone`/`Copy`; `prediction` for derived field/variant behavior; `diagnostic` for non-derivable `Display`, missing field trait implementations, `NaN`, and invalid `Copy` assumptions.
- Requirement coverage from this section: derivable traits and what each derive means at a practical level.
- Requirement gaps carried forward: Rustfmt and `cargo fmt`, Clippy and `cargo clippy`, Rustfix and `cargo fix`, rust-analyzer/editor support, editions beyond earlier keyword notes, translations, nightly Rust, release channels, and why unstable features are not assumed.

## Section: D - Useful Development Tools

Source: `rust-book/src/appendix-04-useful-development-tools.md`
Coverage status: extracted
Coverage id: `appendix-04-useful-development-tools`

### Learning Objectives

- Learner can identify the Rust project tools Appendix D recommends for formatting, applying compiler suggestions, linting, and IDE integration.
- Learner can distinguish `rustfmt`, `rustfix`, Clippy, and rust-analyzer by purpose.
- Learner can recall the Cargo commands for formatting a project, applying clear warning fixes, and running Clippy lints.
- Learner can predict what changes are semantic versus style-only for the Appendix D tool examples.
- Learner can explain how rust-analyzer relates to Language Server Protocol and editor features.

### Card Content Candidates

#### Concepts

- Appendix D covers automatic formatting, quick ways to apply warning fixes, linting, and IDE integration.
- `rustfmt` reformats Rust code according to the community code style.
- Collaborative projects use `rustfmt` to reduce disputes about code style because everyone formats code with the same tool.
- Rust installations include `rustfmt` and `cargo-fmt` by default.
- `rustfmt` allows finer-grained control; `cargo-fmt` understands Cargo project conventions, analogous to the relationship between `rustc` and `cargo`.
- `cargo fmt` formats all Rust code in the current crate.
- `cargo fmt` should change only code style, not code semantics.
- `rustfix` is included with Rust installations and can automatically fix compiler warnings when the warning has a clear likely-correct fix.
- The `rustfix` example starts with `let mut x = 42;` even though `x` is never mutated.
- The compiler warning is `unused_mut`; it says the variable does not need to be mutable and suggests removing `mut`.
- `cargo fix` applies the compiler's suggestion in the example, changing `let mut x = 42;` to `let x = 42;`.
- `cargo fix` can also be used to transition code between Rust editions.
- Clippy is a collection of lints for catching common mistakes and improving Rust code.
- Clippy is included with standard Rust installations.
- `cargo clippy` runs Clippy's lints on a Cargo project.
- The Clippy example using `3.1415` for pi triggers `clippy::approx_constant`, which says Rust already has a more precise constant.
- Replacing the approximation with `std::f64::consts::PI` avoids the Clippy error in the example.
- Rust community recommendation for IDE integration is `rust-analyzer`.
- rust-analyzer is a set of compiler-centric utilities that speak Language Server Protocol.
- Language Server Protocol lets IDEs and programming languages communicate with each other.
- Different editor clients can use rust-analyzer, including the Rust analyzer plug-in for Visual Studio Code.
- rust-analyzer can provide editor capabilities such as autocompletion, jump to definition, and inline errors.

#### Syntax Forms

- `cargo fmt` formats Rust code in the current Cargo crate.
- `cargo fix` applies clear compiler-warning suggestions such as removing unnecessary `mut`.
- `cargo clippy` runs Clippy lints for the current Cargo project.
- `let mut x = 42;` is the warning example where `mut` is unnecessary because `x` is not mutated.
- `#[warn(unused_mut)]` is the warning category shown for the unnecessary `mut` example.
- `#[deny(clippy::approx_constant)]` is the Clippy lint category shown for the approximate-pi example.
- `std::f64::consts::PI` is the precise constant used to fix the approximate-pi example.

#### Prediction / Diagnostic Examples

- Given a Cargo project with unformatted Rust code, predict that `cargo fmt` reformats Rust files and should preserve semantics.
- Given `let mut x = 42; println!("{x}");`, predict that the compiler warns the variable does not need to be mutable.
- Given the `unused_mut` warning with a clear suggestion, predict that `cargo fix` can remove `mut` automatically.
- Given a project that uses `let x = 3.1415;` as pi, predict that `cargo clippy` reports `clippy::approx_constant`.
- Given the fixed Clippy example using `std::f64::consts::PI`, predict that Clippy no longer reports the approximate-constant issue shown by the appendix.
- Given an IDE with rust-analyzer installed, predict editor features such as autocompletion, jump to definition, and inline errors.

#### Failure Modes

- Treating `cargo fmt` as a semantic refactoring tool is wrong; Appendix D says it should change style, not semantics.
- Expecting `cargo fix` to fix every warning is too broad; Appendix D limits it to warnings with a clear way to correct the problem that is likely what the programmer wants.
- Treating `cargo fix` as only a warnings tool misses the appendix note that it can help transition code between Rust editions.
- Treating Clippy as the same thing as `cargo build` misses that Clippy adds a collection of extra lints for common mistakes and code improvement.
- Assuming an approximate numeric literal is always good enough misses Clippy's `approx_constant` lint and the standard constant path.
- Treating rust-analyzer as an IDE by itself is inaccurate; it is language-server tooling used by editor clients.
- Installing an editor without language server support may miss rust-analyzer capabilities such as inline errors and jump to definition.

#### Comparisons

- `rustfmt` vs `cargo-fmt`: `rustfmt` gives finer-grained control; `cargo-fmt` understands Cargo project conventions.
- `rustc` vs `cargo` analogy: `rustfmt`/`cargo-fmt` mirror the single-tool versus Cargo-aware distinction.
- `cargo build` vs `cargo fix`: `cargo build` reports the warning and suggestion; `cargo fix` applies a clear suggestion automatically.
- `rustfix` vs Clippy: `rustfix` applies compiler warning suggestions; Clippy finds additional lint issues.
- `cargo fmt` vs `cargo clippy`: formatting normalizes style; Clippy analyzes code for mistakes and improvements.
- `rust-analyzer` vs editor client: rust-analyzer speaks LSP; clients such as VS Code use it to provide IDE features.

#### Project / Architecture Decisions

- Use Appendix D to close the deck requirements for Rustfmt/`cargo fmt`, Clippy/`cargo clippy`, Rustfix/`cargo fix`, and rust-analyzer/editor support.
- Create command recall cards for `cargo fmt`, `cargo fix`, and `cargo clippy`.
- Create diagnostic cards around `unused_mut` and `clippy::approx_constant`.
- Create comparison cards for `cargo fmt` vs `cargo fix` vs `cargo clippy`, and for rust-analyzer vs an IDE client.
- Link the `cargo fix` edition-transition note forward to Appendix E rather than expanding edition details in Appendix D.
- Mark command examples with compile status `shell` during final card drafting.

#### Listings Worth Converting

- 
- Source-embedded Rustfix example: `src/main.rs` with `let mut x = 42; println!("{x}");`, compiler `unused_mut` warning output, `cargo fix` output, and fixed `let x = 42;`.
- Clippy Listing `src/main.rs`: approximate-pi example using `let x = 3.1415;` and radius `8.0`.
- Clippy diagnostic output: `clippy::approx_constant` with help to use the constant directly.
- Clippy fixed Listing `src/main.rs`: `let x = std::f64::consts::PI;`.
- Shell command examples worth converting: `cargo fmt`, `cargo fix`, and `cargo clippy`.

### Drafting Notes

- Extraction complete for `appendix-04-useful-development-tools`; no final cards drafted in this pass.
- Candidate card types: `api_recall` and `syntax` for shell commands and tool purposes; `diagnostic` for `unused_mut` and `clippy::approx_constant`; `comparison` for tool boundaries; `project_architecture` for standard toolchain/editor workflow choices.
- Requirement coverage from this section: Rustfmt and `cargo fmt`, Clippy and `cargo clippy`, Rustfix and `cargo fix`, and rust-analyzer/editor support.
- Requirement gaps carried forward: editions beyond the `cargo fix` transition pointer, translations, nightly Rust, release channels, and why unstable features are not assumed.

## Section: E - Editions

Source: `rust-book/src/appendix-05-editions.md`
Coverage status: extracted
Coverage id: `appendix-05-editions`

### Learning Objectives

- Learner can explain what a Rust edition is and how it differs from the six-week Rust release cycle.
- Learner can identify the currently listed editions in the book: Rust 2015, Rust 2018, Rust 2021, and Rust 2024.
- Learner can explain that this Rust Book version uses Rust 2024 edition idioms.
- Learner can state what the `edition` key in `Cargo.toml` controls and what happens when it is absent.
- Learner can reason about crates from different editions linking together in the same build.
- Learner can identify when switching editions is necessary for later-edition features.

### Card Content Candidates

#### Concepts

- `cargo new` adds edition metadata to `Cargo.toml`; Appendix E explains what that edition metadata means.
- Rust has a six-week release cycle, producing a steady stream of smaller updates.
- Over time, many small release-to-release changes add up to substantial language evolution.
- Every three years or so, the Rust team produces a new Rust edition.
- A Rust edition packages landed features together with updated documentation and tooling.
- New editions ship through the normal six-week release process rather than as a separate compiler line.
- For active Rust users, an edition packages incremental changes in a way that is easier to understand.
- For non-users, an edition signals major advancements that may make Rust worth another look.
- For people developing Rust, an edition provides a rallying point for the project.
- Appendix E lists four editions available at the time of writing: Rust 2015, Rust 2018, Rust 2021, and Rust 2024.
- The book is written using Rust 2024 edition idioms.
- The `edition` key in `Cargo.toml` tells the compiler which edition to use for the code.
- If the `edition` key is absent, Rust uses `2015` for backward compatibility.
- A project can opt in to an edition other than the default Rust 2015 edition.
- Editions may contain incompatible changes, such as adding a keyword that conflicts with an existing identifier.
- Upgrading the Rust compiler alone does not opt a project into edition changes; code keeps compiling unless the project opts in.
- Rust compiler versions support every edition that existed before that compiler release.
- Crates from supported editions can link together, so a Rust 2015 crate and Rust 2018 crate can be used together in either direction when supported by the compiler.
- Edition changes affect only the way the compiler initially parses code.
- Most features are available on all editions as stable releases improve Rust.
- Some features, mainly those involving new keywords, may require a later edition.
- The Rust Edition Guide enumerates edition differences and explains automatic upgrades with `cargo fix`.
- The deck requirements require current Rust Book syntax and Rust 2024 idioms, including `edition = "2024"` where Cargo metadata is relevant.

#### Syntax Forms

- `edition` is the `Cargo.toml` key that selects the compiler edition for a package.
- `edition = "2024"` is the current-book Cargo metadata form required by the deck spec where an explicit edition example is useful.
- `cargo fix` is referenced by Appendix E as the tool used by the Edition Guide for automatic edition upgrades.

#### Prediction / Diagnostic Examples

- Given a `Cargo.toml` with no `edition` key, predict that Rust uses the 2015 edition for backward compatibility.
- Given a project that upgrades only its compiler version, predict that it does not automatically opt into new edition parsing changes.
- Given a Rust 2015 project depending on a Rust 2018 crate, predict that supported compiler versions can link those crates together.
- Given a Rust 2018 project depending on a Rust 2015 crate, predict that the opposite mixed-edition dependency direction can also work.
- Given a new keyword introduced in a later edition, predict that code using that word as an identifier may need raw identifiers or an edition transition.
- Given a feature available in all stable editions, predict that changing the edition is not necessary just to use that feature.

#### Failure Modes

- Confusing Rust compiler release versions with Rust editions misses the appendix's distinction between six-week releases and roughly three-year editions.
- Assuming a new edition is a separate compiler distribution is wrong; new editions ship through the normal release process.
- Assuming the latest installed compiler automatically parses every project as the latest edition is wrong; the project opts in with `Cargo.toml`.
- Assuming the missing `edition` key means "latest edition" is wrong; the fallback is Rust 2015.
- Assuming crates from different editions cannot link together is wrong; supported editions can link together.
- Assuming edition changes affect all compiler behavior is too broad; Appendix E says they affect initial parsing.
- Assuming every new feature requires the newest edition is wrong; most features are available on all editions.
- Assuming all keyword conflicts are harmless misses that new keywords are a main reason some features require later editions.

#### Comparisons

- Rust release vs Rust edition: releases happen every six weeks; editions arrive every three years or so and package accumulated changes.
- Compiler upgrade vs edition opt-in: a compiler upgrade gives stable improvements, but edition changes require the project's edition setting.
- Edition compatibility vs dependency compatibility: editions can change parsing within a crate, while crates from supported editions can still link together.
- Most features vs later-edition-only features: most stable features work across editions; features requiring new keywords may need a later edition.
- Appendix D `cargo fix` vs Appendix E edition upgrade: Appendix D introduces `cargo fix`; Appendix E points to the Edition Guide for using it during edition transitions.

#### Project / Architecture Decisions

- Use Appendix E to close the deck requirement for editions, especially Rust 2015, 2018, 2021, 2024, and `edition = "2024"`.
- Add concept-boundary cards that separate compiler version, release cycle, and edition.
- Add prediction cards for missing `edition`, mixed-edition dependencies, and compiler upgrade without edition opt-in.
- Add a requirement-linked card that says final examples should use Rust 2024 idioms when following this Rust Book source.
- Keep detailed edition-difference cards out of Appendix E unless sourced from the Edition Guide separately; Appendix E only gives the high-level model and pointer.

#### Listings Worth Converting

- No numbered listings in Appendix E.
- Source facts worth converting: four listed editions, Rust 2024 idiom statement, missing-`edition` fallback to 2015, mixed-edition linking, parse-only edition effects, and `cargo fix` upgrade pointer.
- Requirement-backed syntax example worth converting where appropriate: `edition = "2024"` in `Cargo.toml`.

### Drafting Notes

- Extraction complete for `appendix-05-editions`; no final cards drafted in this pass.
- Candidate card types: `concept_boundary` for release vs edition and compiler version vs edition opt-in; `prediction` for missing edition and mixed-edition crates; `syntax` for `edition = "2024"`; `project_architecture` for choosing current Rust Book idioms.
- Requirement coverage from this section: Rust editions, Rust 2015/2018/2021/2024, Rust 2024 idioms, and `edition = "2024"`.
- Requirement gaps carried forward: translations, nightly Rust, release channels, and why unstable features are not assumed.

## Section: F - Translations of the Book

Source: `rust-book/src/appendix-06-translation.md`
Coverage status: extracted
Coverage id: `appendix-06-translation`

### Learning Objectives

- Learner can identify Appendix F as a reference list for non-English Rust Book resources.
- Learner can explain that most listed translations are still in progress.
- Learner can find the upstream GitHub Translations label to help with translations or report a new translation.
- Learner can avoid treating Appendix F as a source for Rust syntax or semantics cards.

### Card Content Candidates

#### Concepts

- Appendix F is for resources in languages other than English.
- Most listed translations are still in progress.
- The appendix points to the Rust Book GitHub `Translations` label for helping with translations or reporting a new translation.
- The listed translations include Portuguese variants, Chinese variants, Ukrainian, Spanish variants, Russian, Korean, Japanese, French, Polish, Cebuano, Tagalog, Esperanto, Greek, Swedish, Farsi/Persian, German, Hindi, Thai, Danish, Uzbek, Vietnamese, Italian, and Bengali.
- The source is a reference/resource appendix rather than a Rust language feature section.

#### Syntax Forms

- No Rust syntax forms in Appendix F.

#### Prediction / Diagnostic Examples

- Given a learner asking where to find a non-English Rust Book, identify Appendix F as the relevant source.
- Given a proposed technical card about ownership, editions, or tools sourced only to Appendix F, reject it because this appendix lists translations rather than language behavior.

#### Failure Modes

- Treating the translation list as complete and permanently current would be unsafe; the appendix says most translations are still in progress and points to the GitHub label.
- Creating Rust syntax cards from Appendix F would be under-sourced because the section contains no Rust code, commands, or diagnostics.
- Treating all translations as official completed editions overstates the source; Appendix F frames them as resources, most still in progress.

#### Comparisons

- Appendix F vs technical appendices: Appendix F lists learning resources in other languages; Appendices A-E and G contain language/tooling/release-channel concepts.
- Translation list vs Translations label: the appendix gives a snapshot list; the GitHub label is the contribution/discovery path for updates.

#### Project / Architecture Decisions

- Do not force high-volume Anki coverage for Appendix F; create at most a small reference card if appendix-wide coverage needs every section represented.
- Do not source Rust language behavior, command usage, or edition rules to Appendix F.
- Preserve the translation-resource note in validation so the section has an explicit extraction outcome rather than appearing accidentally skipped.

#### Listings Worth Converting

- No numbered listings, Rust snippets, command examples, or diagnostics in Appendix F.
- Possible low-priority reference card: Appendix F points to non-English Rust Book translations and the GitHub `Translations` label, with most translations still in progress.

### Drafting Notes

- Extraction complete for `appendix-06-translation`; no final cards drafted in this pass.
- Candidate card types: `api_recall` or `concept_boundary` only if a final deck needs one appendix-resource card; otherwise this section may produce no technical cards with a recorded reason.
- Requirement coverage from this section: appendix reference coverage only; no explicit Rust syntax/tooling requirement is closed here.
- Requirement gaps carried forward: nightly Rust, release channels, and why unstable features are not assumed.

## Section: G - How Rust is Made and “Nightly Rust”

Source: `rust-book/src/appendix-07-nightly-rust.md`
Coverage status: extracted
Coverage id: `appendix-07-nightly-rust`

### Learning Objectives

- Learner can explain Rust's "stability without stagnation" principle.
- Learner can distinguish the nightly, beta, and stable release channels.
- Learner can describe the release train model from main branch to nightly, beta, and stable.
- Learner can explain why unstable features require nightly Rust and feature flags.
- Learner can explain why this book and final deck should assume stable Rust unless explicitly teaching a contrast.
- Learner can recall the rustup commands used to install nightly, list toolchains, and set a per-project nightly override.
- Learner can summarize how the RFC process leads from proposal to feature gate to stable release.

### Card Content Candidates

#### Concepts

- Appendix G explains how Rust is made and how that affects Rust developers.
- "Stability without stagnation" balances stable user code with experimentation on new features.
- The guiding principle is that users should not fear upgrading to a new version of stable Rust.
- Stable Rust upgrades should be painless while still bringing new features, fewer bugs, and faster compile times.
- Rust development happens on the main branch of the Rust repository.
- Rust follows a software release train model.
- Rust has three release channels: nightly, beta, and stable.
- Most Rust developers primarily use stable.
- Developers who want to try experimental features may use nightly or beta.
- Nightly builds are produced automatically every night from the main branch.
- Every six weeks, the beta branch branches off from the main branch used by nightly.
- Most users do not actively use beta, but testing against beta in CI helps the Rust project find regressions.
- If a regression is found during beta, the fix is applied to main so nightly is fixed, then backported to beta.
- Six weeks after beta is created, stable branches from beta.
- After stable branches from beta, the next beta branches from nightly again.
- The train model means a release leaves every six weeks, travels through beta, and then arrives as stable.
- The six-week release cadence reduces pressure to rush unpolished features into a release because another release is soon.
- Users can test beta to verify upgrades and report issues before the next stable release.
- The Rust project supports the most recent stable version; when a new stable version is released, the old version reaches end of life.
- Each stable version is supported for six weeks according to Appendix G.
- Unstable features are controlled with feature flags.
- A new feature under active development lands on main and therefore nightly, but behind a feature flag.
- To try a work-in-progress feature, a user must use nightly Rust and annotate source code with the appropriate feature flag.
- Beta and stable Rust cannot use feature flags.
- Feature flags allow practical use of new features before Rust declares them stable forever.
- This book contains only stable features because in-progress features are still changing.
- Documentation for nightly-only features is available online rather than in this book.
- Rustup can switch Rust release channels globally or per project.
- Stable Rust is installed by default.
- A rustup toolchain is a release of Rust plus associated components.
- Most Rust users use stable most of the time, with nightly only for projects that need a cutting-edge feature.
- A per-project rustup override makes `rustc` and `cargo` use nightly inside that project directory rather than the default stable toolchain.
- Rust development uses a Request For Comments (RFC) process for proposed improvements.
- Anyone can write an RFC; proposals are reviewed and discussed by Rust teams and subteams.
- Rust teams cover areas such as language design, compiler implementation, infrastructure, and documentation.
- Accepted RFC features get an issue opened on the Rust repository and can be implemented by someone other than the proposer.
- A ready implementation lands on main behind a feature gate.
- After nightly users try the feature, team members decide whether it should move into stable Rust.
- If the decision is to stabilize, the feature gate is removed and the feature rides the trains into a stable Rust release.

#### Syntax Forms

- Release channel names: `nightly`, `beta`, and `stable`.
- Install nightly:
  ```console
  $ rustup toolchain install nightly
  ```
- List installed toolchains:
  ```console
  > rustup toolchain list
  ```
- Example toolchain list entries from the source: `stable-x86_64-pc-windows-msvc (default)`, `beta-x86_64-pc-windows-msvc`, and `nightly-x86_64-pc-windows-msvc`.
- Set nightly for one project directory:
  ```console
  $ cd ~/projects/needs-nightly
  $ rustup override set nightly
  ```
- Appendix G mentions annotating source with the appropriate feature flag but does not show exact `#![feature(...)]` syntax.

#### Prediction / Diagnostic Examples

- Given a developer who wants the least surprising toolchain for normal Rust work, choose stable.
- Given a project that needs a cutting-edge unstable feature, choose nightly and a project-specific rustup override.
- Given a beta regression, predict that the fix should land on main/nightly and be backported to beta before stable.
- Given a feature that misses a release train, predict that another release follows six weeks later.
- Given a user trying feature flags on beta or stable, predict that this is not allowed.
- Given a project directory with `rustup override set nightly`, predict that `rustc` and `cargo` invoked inside that directory use nightly.
- Given a new stable release, predict that the previous stable version reaches EOL under the appendix's support model.
- Given an accepted RFC, predict that the feature still needs implementation, nightly testing behind a feature gate, and a stabilization decision before stable release.

#### Failure Modes

- Assuming stable Rust upgrades are supposed to be risky contradicts "stability without stagnation."
- Assuming most Rust users should run nightly by default is wrong; stable is the primary channel and rustup installs stable by default.
- Assuming beta is mainly for daily development misses its role in pre-stable testing and CI regression discovery.
- Assuming nightly features are stable is wrong; they are work in progress and may change.
- Assuming beta or stable can use feature flags is wrong; feature flags require nightly.
- Assuming this book teaches nightly-only features is wrong; Appendix G says the book contains stable features only.
- Assuming an accepted RFC immediately becomes stable skips implementation, feature gating, nightly evaluation, and stabilization.
- Assuming an old stable version remains supported indefinitely is wrong under Appendix G's most-recent-stable support model.
- Assuming a project-specific nightly need must change the global default is wrong; rustup supports per-project overrides.

#### Comparisons

- Stable vs beta vs nightly: stable is the primary channel for most users, beta is the pre-stable testing channel, and nightly is built from main for experimentation.
- Main branch vs beta branch vs stable branch: main feeds nightly, beta branches from main every six weeks, and stable branches from beta after testing.
- Feature flag vs feature gate: users opt into nightly work-in-progress features with feature flags; implementations land behind feature gates until stabilization.
- Stable book content vs nightly documentation: this book covers stable features; nightly-only features are documented online.
- Global rustup channel vs per-project override: global channel sets the default, while an override changes toolchain selection inside one project directory.
- RFC proposal vs implemented feature: an RFC is a reviewed proposal; accepted work still needs an implementation and stabilization path.

#### Project / Architecture Decisions

- Use Appendix G to close the deck requirement for nightly Rust, release channels, and why unstable features are not assumed in the book.
- Add concept-boundary cards for stable/beta/nightly and stable book content vs nightly-only documentation.
- Add shell cards for `rustup toolchain install nightly`, `rustup toolchain list`, and `rustup override set nightly`.
- Add prediction cards for beta regressions, feature flags on stable/beta, project overrides, and accepted RFCs.
- Mark final cards about nightly features as contrast cards unless they are specifically about the release process or rustup commands.
- Keep final deck examples on stable Rust unless a card explicitly says it is teaching nightly or unstable-feature boundaries.

#### Listings Worth Converting

- Text diagrams of nightly/beta/stable train progression are useful source anchors for release-channel process cards.
- Console command example: `rustup toolchain install nightly`.
- PowerShell command/example output: `rustup toolchain list` with stable default, beta, and nightly toolchains.
- Console command example: `cd ~/projects/needs-nightly` followed by `rustup override set nightly`.
- No Rust code listings in Appendix G.

### Drafting Notes

- Extraction complete for `appendix-07-nightly-rust`; no final cards drafted in this pass.
- Candidate card types: `concept_boundary` for channel and stability distinctions; `prediction` for release train and feature-flag scenarios; `syntax`/`api_recall` with compile status `shell` for rustup commands; `project_architecture` for stable-by-default deck policy.
- Requirement coverage from this section: nightly Rust, release channels, stable-only book assumptions, feature flags, rustup nightly usage, and RFC-to-stable process.
- Appendix extraction pass complete; all 8 appendix entries are extracted. No final cards drafted yet.
