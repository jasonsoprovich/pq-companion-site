#!/usr/bin/env node
// Parses the canonical CHANGELOG.md (in the pq-companion repo) into per-version
// Astro content collection files at src/content/changelog/vX.Y.Z.md.
//
// Source CHANGELOG.md is expected to use this format per section:
//
//   ## vX.Y.Z — YYYY-MM-DD
//
//   <single-paragraph headline>
//
//   ### Highlights
//   - bullet
//   - bullet
//
//   ### Fixes
//   - bullet
//
// Each release becomes a content file with structured frontmatter (highlights
// and fixes as string arrays). Markdown formatting inside each bullet (e.g.
// **bold**, `code`) is preserved; the Astro page converts those to HTML.
//
// Usage:
//   node scripts/sync-changelog.mjs
//   CHANGELOG_PATH=/abs/path/to/CHANGELOG.md node scripts/sync-changelog.mjs

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(__dirname, "..");
const DEFAULT_SOURCE = resolve(
  SITE_ROOT,
  "..",
  "pq-companion",
  "CHANGELOG.md",
);
const sourcePath = process.env.CHANGELOG_PATH || DEFAULT_SOURCE;
const outDir = resolve(SITE_ROOT, "src", "content", "changelog");

let raw;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch (err) {
  console.error(`sync-changelog: cannot read ${sourcePath}`);
  console.error(err.message);
  process.exit(1);
}

const firstHeaderIndex = raw.search(/^## v/m);
if (firstHeaderIndex < 0) {
  console.error(`sync-changelog: no \`## v\` sections found in ${sourcePath}`);
  process.exit(1);
}
const body = raw.slice(firstHeaderIndex);
const sections = body.split(/(?=^## v)/m).filter((s) => s.trim());

mkdirSync(outDir, { recursive: true });
const written = new Set();

const HEADER_RE = /^## v(\d+\.\d+\.\d+)\s+—\s+(\d{4}-\d{2}-\d{2})\s*$/m;

function yamlQuote(s) {
  // Always emit double-quoted YAML strings with backslash + double-quote
  // escapes. Keeps quoting consistent and unambiguous.
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function parseSection(section) {
  const m = section.match(HEADER_RE);
  if (!m) return null;
  const [headerLine, version, date] = m;
  const afterHeader = section
    .slice(section.indexOf(headerLine) + headerLine.length)
    .trim();

  // Pull out subsections by splitting on `### `.
  const parts = afterHeader.split(/\n(?=### )/);
  let headline = "";
  const subs = {};

  for (const part of parts) {
    if (part.startsWith("### ")) {
      const subHeaderMatch = part.match(/^### (\S+)\s*\n?([\s\S]*)$/);
      if (!subHeaderMatch) continue;
      const [, name, contentRaw] = subHeaderMatch;
      const bullets = contentRaw
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2).trim());
      subs[name.toLowerCase()] = bullets;
    } else if (!headline && part.trim()) {
      // First non-### block is the headline.
      headline = part.trim();
    }
  }

  return {
    version,
    date,
    headline,
    highlights: subs.highlights || [],
    fixes: subs.fixes || [],
  };
}

function buildFrontmatter(entry) {
  const lines = ["---"];
  lines.push(`version: ${yamlQuote(entry.version)}`);
  lines.push(`date: ${entry.date}`);
  if (entry.headline) lines.push(`headline: ${yamlQuote(entry.headline)}`);
  if (entry.highlights.length) {
    lines.push("highlights:");
    for (const b of entry.highlights) lines.push(`  - ${yamlQuote(b)}`);
  }
  if (entry.fixes.length) {
    lines.push("fixes:");
    for (const b of entry.fixes) lines.push(`  - ${yamlQuote(b)}`);
  }
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

for (const section of sections) {
  const entry = parseSection(section);
  if (!entry) {
    console.warn(
      `sync-changelog: skipping unparseable section: ${section
        .slice(0, 80)
        .replace(/\n/g, " ")}`,
    );
    continue;
  }
  const filename = `v${entry.version}.md`;
  writeFileSync(join(outDir, filename), buildFrontmatter(entry));
  written.add(filename);
}

let pruned = 0;
for (const f of readdirSync(outDir)) {
  if (f.endsWith(".md") && !written.has(f)) {
    rmSync(join(outDir, f));
    pruned++;
  }
}

console.log(
  `sync-changelog: wrote ${written.size} entries${pruned ? `, pruned ${pruned}` : ""} → ${outDir}`,
);
