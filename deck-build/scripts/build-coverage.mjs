import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..", "..");
const summaryPath = join(root, "rust-book", "src", "SUMMARY.md");
const outputPath = join(root, "deck-build", "coverage.json");

const summary = readFileSync(summaryPath, "utf8");
const rustBookCommit = execSync("git -C rust-book rev-parse HEAD", {
  cwd: root,
  encoding: "utf8",
}).trim();

const entries = [];
const linkPattern = /^(?<indent>\s*)(?:-\s*)?\[(?<title>[^\]]+)\]\((?<file>[^)]+)\)/;

for (const line of summary.split("\n")) {
  const match = line.match(linkPattern);
  if (!match?.groups) continue;

  const indent = match.groups.indent.length;
  const level = line.trimStart().startsWith("- ") ? indent / 2 + 1 : 0;
  const title = match.groups.title.replace(/`/g, "");
  const file = match.groups.file;
  const chapterMatch = file.match(/^ch(\d{2})-/);
  const appendixMatch = file.match(/^appendix-(\d{2})/);

  let group = "front-matter";
  if (chapterMatch) group = `ch${chapterMatch[1]}`;
  if (appendixMatch || file === "appendix-00.md") group = "appendix";

  const requirementRefs = ["MR-02"];
  if (group === "front-matter" || group === "ch00") {
    requirementRefs.unshift("CH-00");
  } else if (group === "appendix") {
    requirementRefs.unshift("Appendices");
  } else if (chapterMatch) {
    requirementRefs.unshift(`CH-${chapterMatch[1]}`);
  }

  const slug = file
    .replace(/\.md$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  entries.push({
    id: slug,
    group,
    level,
    title,
    source_file: `rust-book/src/${file}`,
    status: "not_started",
    notes_file: `deck-build/chapter-notes/${group}.md`,
    cards_file: `deck-build/cards/${group}.yaml`,
    card_count: 0,
    requirement_refs: requirementRefs,
    notes: "",
  });
}

const coverage = {
  metadata: {
    generated_at: new Date().toISOString(),
    rust_book_commit: rustBookCommit,
    summary_source: "rust-book/src/SUMMARY.md",
    requirements_source: "rust-learning-deck-requirements.md",
    status_values: [
      "not_started",
      "extracted",
      "cards_drafted",
      "validated",
      "skipped_with_reason",
    ],
  },
  entries,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(coverage, null, 2)}\n`);
console.log(`Wrote ${entries.length} coverage entries to ${outputPath}`);
