# Deck Math Rendering Notes

Current direction: keep math in deck content as TeX-like source inside Markdown,
but do not make HTML or WebView part of the deck format.

## Constraints

- Mobile app uses Expo.
- Mobile should feel native.
- Deck content should remain portable and readable.
- The app should not allow deck-authored HTML, CSS, or JavaScript.
- Desktop Electron can use HTML internally, but that should stay an
  implementation detail.

## Recommended Pipeline

```text
Markdown content
  -> parser detects $...$ and $$...$$
  -> content tree with math_inline(tex) and math_block(tex)
  -> renderer chooses platform output
```

For Expo mobile, prefer cached SVG output rendered with `react-native-svg`:

```text
math_inline(tex)
  -> TeX-to-SVG render step
  -> cached SVG by formula hash
  -> react-native-svg
```

Keep the original TeX alongside rendered output for editing, search,
accessibility labels, fallback display, and future re-rendering.

## Expo Mobile

Use `react-native-svg` to display formulas. It is supported by Expo and included
in Expo Go:

- https://docs.expo.dev/versions/latest/sdk/svg/

This avoids WebView and avoids custom native modules for the first math
implementation.

Do not run a full TeX renderer live for every card on mobile unless profiling
shows it is acceptable. Prefer pre-rendering or caching formulas at import time,
build time, desktop sync time, or first render.

## Desktop

Electron can use MathJax or KaTeX to produce sanitized SVG/HTML internally.
That does not change the deck format: deck content is still Markdown plus TeX
source, not authored HTML.

MathJax supports SVG output and Node-side usage:

- https://docs.mathjax.org/en/stable/output/index.html
- https://docs.mathjax.org/en/stable/server/components.html

## Parser Notes

Comrak can detect math delimiters with math extensions, but it does not replace
the need for a math renderer.

Useful comrak options:

```rust
options.extension.math_dollars = true;
options.extension.math_code = true;
```

Comrak should be used to detect/extract math into content tree nodes:

```text
math_inline(tex)
math_block(tex)
```

Not as the final formula renderer.

Reference:

- https://docs.rs/comrak/latest/comrak/struct.ExtensionOptions.html

## Native Math Renderer Option

If math becomes a core product surface and SVG output feels insufficient, add
custom native math renderers through Expo development builds / Expo Modules.

Possible direction:

```text
Expo development build
  -> custom native module
  -> iOS/macOS native math renderer
  -> Android native math renderer
```

Expo development builds are required when adding native code beyond Expo Go's
fixed library set:

- https://docs.expo.dev/develop/development-builds/introduction/
- https://docs.expo.dev/workflow/customizing/

Native renderer candidates:

- iOS/macOS: SwiftMath, https://github.com/mgriebling/SwiftMath
- Android: native or Compose-oriented math renderer, to be selected after a
  focused prototype.

## Avoid For Now

- WebView-based formula rendering on mobile.
- Deck-authored HTML/CSS/JS.
- Full TeX engines such as Tectonic for inline flashcard formulas.
- Making Typst the formula language unless the whole product intentionally
  chooses Typst authoring.
- Building a custom math typesetter before SVG rendering proves insufficient.

## Practical Decision

Start with cached SVG formulas rendered through `react-native-svg`.

This keeps Expo mobile simple, native-feeling enough for review cards, and
portable across platforms. Revisit native math renderers only if real decks show
that SVG formulas have unacceptable performance, accessibility, scaling, or
theming problems.
