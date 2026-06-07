import { expect, test } from "bun:test";

import { deriveDefaultOutputDir, parseApkg } from "./parse_anki.ts";

const modernDeck = parseApkg("./Kaishi-1.5k-v2.4.apkg", undefined, { extractMedia: false });
const legacyDeck = parseApkg("./Great_Works_of_Art_expanded_v30.apkg", undefined, {
  extractMedia: false,
});

test("derives default output dir from deck filename", () => {
  expect(deriveDefaultOutputDir("./Kaishi-1.5k-v2.4.apkg")).toBe("./Kaishi-1.5k-v2.4");
  expect(deriveDefaultOutputDir("./decks/foo/bar/custom-deck.colpkg")).toBe("./custom-deck");
  expect(deriveDefaultOutputDir("plain-deck")).toBe("./plain-deck");
});

test("parses modern anki21b decks with decoded templates + media manifest", async () => {
  const result = await modernDeck;
  const card = result.cards.find((entry) => entry.front.includes("私"));
  const noteType = result.noteTypes["1708628080880"];

  expect(result.meta.format).toBe("anki21+");
  expect(result.meta.name).toBe("Kaishi 1.5k");
  expect(result.meta.deckNames).toEqual(["Kaishi 1.5k"]);
  expect(result.meta.mediaCount).toBeGreaterThan(4000);

  expect(noteType).toBeDefined();
  expect(noteType?.templates[0]?.qfmt).toContain("{{Word}}");
  expect(noteType?.templates[0]?.afmt).toContain("{{Word Meaning}}");

  expect(result.media[0]?.filename).toBe(
    "6f0951279a64a81133b2c6acfb3d3020-2eaa51cf10c2cb113f607b8507d951884d35e5f2.mp3",
  );
  expect(result.media[0]?.size).toBe(11498);

  expect(card).toBeDefined();
  expect(card?.deck).toBe("Kaishi 1.5k");
  expect(card?.back).toContain("わたし");
  expect(card?.back).toContain("I (polite, general)");
});

test("parses legacy anki2 decks with legacy note types + subdecks", async () => {
  const result = await legacyDeck;
  const noteType = Object.values(result.noteTypes)[0];

  expect(result.meta.format).toBe("legacy");
  expect(result.meta.name).toBe("Great Works of Art::Artists");
  expect(result.meta.cardsCount).toBeGreaterThan(result.meta.notesCount);
  expect(result.meta.deckNames.length).toBe(2);

  expect(noteType).toBeDefined();
  expect(noteType?.templates[0]?.qfmt).toContain("{{Front}}");
  expect(result.noteTypes["1342707818481"]?.templates.length).toBe(2);

  expect(result.media[0]?.filename).toBe("2014-08-19_020719.jpg");
  expect(result.cards[0]?.front).toContain("Artist?");
  expect(result.cards[0]?.back).toContain("Max Ernst");
});
