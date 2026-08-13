# Kaishi 1.5k HTML conversion check

## Source

- Release: Kaishi 1.5k v2.4.1 from the official `donkuri/kaishi` GitHub release.
- File: `stuff/Kaishi.1.5k.v2.4.1.apkg`.
- SHA-256: `0bfed7adfb740e49fbe323d05a6899d25942213aa2238749630653e3d11d357e`.
- Source data: 1,501 notes, 1,501 cards, and 4,354 media files.

## Review result

I reviewed a one-line summary for each of the 1,501 converted cards. I also compared every source field, link, reading, pitch base text, and media reference with its converted card. The comparison found no missing or changed learner-facing text, links, readings, or media references.

The output has seven note files. It contains 1,501 unique `prompt_response` notes and 4,354 copied media files. All 4,499 card-level media references resolve; 145 references reuse a file used by another card.

## Source edge cases

- Card 1 is a welcome and deck-instruction card, not a vocabulary card. It remains in the deck.
- The welcome card and card 147 (`失礼します`) have no word audio. Card 147 still has sentence audio and an image.
- The APKG has 1,500 pictures, but 806 source `<img>` elements have no `alt` value. The converter uses `Illustration for <word>` for these images. This is valid but less descriptive than a manually written alt value.
- The source has seven links. The converter keeps their safe `https:` URLs and removes Anki's `target="_blank"` attributes.
- The source has 56 ordinary note fields and 60 pitch-accent note fields. Some use `<br>` or nested `<div>` elements. The converter keeps their text and line breaks without source layout markup.

## Anki markup gotchas

- Anki furigana uses `base[reading]`. Spaces between these groups are syntax separators, not visible spaces. The converter removes those separators and emits `<ruby><rt>` markup.
- Pitch accent is encoded as deeply nested `<span style="...">` elements. The converter maps the high section to `<ruby><rt>￣</rt>`, the drop to `<sub>＼</sub>`, and colored glyphs to `<mark>`. Exact Anki colors and line placement are not preserved because Open Deck does not allow deck CSS.
- One pitch value uses `text-decoration: overline` instead of the usual border spans. The converter handles this separate form.
- One pitch-accent note contains pitch markup inside explanatory prose. The converter preserves both the prose and its pitch annotations.
- Anki card templates, comments, CSS, and conditional template logic are not copied. The Open Deck card uses semantic HTML for content and structured media for images and audio.

## HTML syntax gotchas

- Markdown punctuation has no special meaning in HTML text. A browser round-trip
  kept `word)** next`, `**not bold**`, Markdown-style links, underscores,
  backticks, and cloze braces unchanged.
- HTML has different delimiter hazards: literal text must encode `&` as
  `&amp;` and `<` as `&lt;`. Attribute values must also encode their quote
  delimiter. The converter decodes source entities and then escapes text and
  attributes once before it emits HTML.
- I checked all 3,002 generated fragments. They have no raw or unknown
  ampersands and no elements or attributes outside the Open Deck allowlist.
- HTML can repair invalid nesting, such as a block element inside `<p>`. The
  converter avoids arbitrary source structure and emits fixed, valid `p`, `h2`,
  `dl`, `dt`, and `dd` structures instead.

## Output decisions

Prompt HTML contains the word and its example sentence. Answer HTML uses a description list for meanings, readings, furigana, notes, pitch accent, and frequency. Source bold text becomes `<strong>`. Images and audio remain outside HTML in the required `media` array.
