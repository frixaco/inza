import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "..", "..");
const coverage = JSON.parse(readFileSync(join(root, "deck-build", "coverage.json"), "utf8"));

const groups = new Map();
for (const entry of coverage.entries) {
  if (!groups.has(entry.group)) groups.set(entry.group, []);
  groups.get(entry.group).push(entry);
}

function displayGroup(group) {
  if (group === "front-matter") return "Front Matter";
  if (group === "appendix") return "Appendices";
  if (group === "ch00") return "CH-00";
  return `CH-${group.slice(2)}`;
}

function notesTemplate(group, entries) {
  const title = displayGroup(group);
  const sourceList = entries
    .map((entry) => `- \`${entry.source_file}\` - ${entry.title}`)
    .join("\n");
  const requirementRefs = [...new Set(entries.flatMap((entry) => entry.requirement_refs))]
    .map((ref) => `- \`${ref}\``)
    .join("\n");
  const sections = entries
    .map((entry) => {
      return `## Section: ${entry.title}

Source: \`${entry.source_file}\`
Coverage status: not_started
Coverage id: \`${entry.id}\`

### Learning Objectives

- 

### Card Content Candidates

#### Concepts

- 

#### Syntax Forms

- 

#### Prediction / Diagnostic Examples

- 

#### Failure Modes

- 

#### Comparisons

- 

#### Project / Architecture Decisions

- 

#### Listings Worth Converting

- 

### Drafting Notes

- 
`;
    })
    .join("\n");

  return `# ${title} Notes

Status: not_started

Source files:

${sourceList}

Requirement refs:

${requirementRefs}

${sections}`;
}

function cardsTemplate(group, entries) {
  const title = displayGroup(group);
  const sourceFiles = entries.map((entry) => `  - ${entry.source_file}`).join("\n");
  return `chapter: ${title}
chapter_group: ${group}
status: not_started
source_files:
${sourceFiles}
cards: []

# Add cards using ./deck-build/schema/card.schema.yaml.
`;
}

let created = 0;
for (const [group, entries] of groups) {
  const notesPath = join(root, entries[0].notes_file);
  const cardsPath = join(root, entries[0].cards_file);
  mkdirSync(dirname(notesPath), { recursive: true });
  mkdirSync(dirname(cardsPath), { recursive: true });

  if (!existsSync(notesPath)) {
    writeFileSync(notesPath, notesTemplate(group, entries));
    created += 1;
  }
  if (!existsSync(cardsPath)) {
    writeFileSync(cardsPath, cardsTemplate(group, entries));
    created += 1;
  }
}

console.log(`Initialized ${created} notes/card files.`);

