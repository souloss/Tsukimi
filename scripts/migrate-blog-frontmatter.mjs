#!/usr/bin/env node
/**
 * Migrate blog frontmatter from astro-blog format to Tsukimi format.
 *
 * Transformations:
 *   pubDatetime → published (date only: YYYY-MM-DD)
 *   modDatetime → updated (date only: YYYY-MM-DD)
 *   series.name → series (flat string)
 *   series.order → seriesOrder (flat number)
 *   .text files → .md files
 *   Old-style fields (categories, date, comments, katex, subtitle, archives) → Tsukimi equivalents
 *   category with "/" → take first segment only
 *   Remove fields not in Tsukimi schema (subtitle, archives, katex, comments)
 *   categories (plural) → category (first item)
 *   date → published
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

const SRC_DIR = "/root/astro-blog/src/data/blog/zh";
const DST_DIR = "/tmp/posts";

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkDir(full));
    } else if ([".md", ".mdx", ".text"].includes(extname(full))) {
      results.push(full);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: "", body: content };
  return { frontmatter: match[1], body: content.slice(match[0].length) };
}

function parseYamlSimple(text) {
  // Simple YAML parser for frontmatter - handles the patterns we see
  const lines = text.split(/\r?\n/);
  const result = {};
  let currentKey = null;
  let currentArray = null;
  let inSeries = false;
  let seriesObj = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Series nested block
    if (inSeries) {
      const nameMatch = line.match(/^\s+name:\s*["']?(.+?)["']?\s*$/);
      const orderMatch = line.match(/^\s+order:\s*(\d+)\s*$/);
      if (nameMatch) {
        seriesObj.name = nameMatch[1];
        continue;
      }
      if (orderMatch) {
        seriesObj.order = parseInt(orderMatch[1]);
        continue;
      }
      // Series block ended
      inSeries = false;
      if (seriesObj.name) result.series = seriesObj;
      seriesObj = {};
      // Fall through to process this line normally
    }

    // Array item: "  - value" or "  - 'value'" or '  - "value"'
    const arrayMatch = line.match(/^\s*-\s+(.+)$/);
    if (arrayMatch && currentArray) {
      let val = arrayMatch[1].trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      currentArray.push(val);
      continue;
    }

    // Key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)\s*$/);
    if (kvMatch) {
      // Save previous array
      if (currentKey && currentArray && currentArray.length > 0) {
        result[currentKey] = currentArray;
      }
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();

      // Series starts a nested block
      if (currentKey === "series" && val === "") {
        inSeries = true;
        currentArray = null;
        continue;
      }

      currentArray = null;

      if (val === "") {
        // Could be start of array or nested object - check next line
        if (i + 1 < lines.length && lines[i + 1].match(/^\s*-\s+/)) {
          currentArray = [];
        }
        continue;
      }

      // Strip quotes and unescape YAML escape sequences
      let stripped = val.replace(/^["']|["']$/g, "");
      // In YAML double-quoted strings, \" is an escaped quote
      if (val.startsWith('"')) {
        stripped = stripped.replace(/\\"/g, '"');
      }
      result[currentKey] = stripped;
      continue;
    }

    // Non-matching line - save array if any
    if (currentKey && currentArray && currentArray.length > 0) {
      result[currentKey] = currentArray;
      currentArray = null;
    }
  }

  // Finalize
  if (inSeries && seriesObj.name) {
    result.series = seriesObj;
  }
  if (currentKey && currentArray && currentArray.length > 0) {
    result[currentKey] = currentArray;
  }

  return result;
}

function formatDate(isoStr) {
  if (!isoStr) return null;
  // Extract YYYY-MM-DD from ISO string
  const m = isoStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function buildTsukimiFrontmatter(parsed, srcRelPath) {
  const fm = {};

  // published (required)
  if (parsed.pubDatetime) {
    fm.published = formatDate(parsed.pubDatetime);
  } else if (parsed.date) {
    fm.published = formatDate(parsed.date);
  }

  // updated
  if (parsed.modDatetime) {
    fm.updated = formatDate(parsed.modDatetime);
  }

  // title (required)
  if (parsed.title) {
    fm.title = parsed.title;
  }

  // description
  if (parsed.description) {
    fm.description = parsed.description;
  }

  // image
  if (parsed.image && parsed.image !== "") {
    fm.image = parsed.image;
  }

  // tags
  if (parsed.tags) {
    if (Array.isArray(parsed.tags)) {
      fm.tags = parsed.tags;
    } else if (typeof parsed.tags === "string") {
      fm.tags = parsed.tags.split(",").map(t => t.trim());
    }
  }

  // category - handle categories (plural), slash syntax
  if (parsed.category) {
    let cat = parsed.category;
    // Strip after /
    if (cat.includes("/")) {
      cat = cat.split("/")[0];
    }
    fm.category = cat;
  } else if (parsed.categories) {
    if (Array.isArray(parsed.categories)) {
      fm.category = parsed.categories[0] || "";
    } else {
      fm.category = parsed.categories;
    }
  }

  // draft
  if (parsed.draft !== undefined) {
    fm.draft = parsed.draft === "true" || parsed.draft === true;
  }

  // pinned
  if (parsed.pinned !== undefined) {
    fm.pinned = parsed.pinned === "true" || parsed.pinned === true;
  } else if (parsed.pin !== undefined) {
    fm.pinned = parsed.pin === "true" || parsed.pin === true;
  }

  // comment
  if (parsed.comments !== undefined) {
    fm.comment = parsed.comments === "true" || parsed.comments === true;
  }

  // author
  if (parsed.author) {
    fm.author = parsed.author;
  }

  // lang
  if (parsed.lang) {
    fm.lang = parsed.lang;
  }

  // slug
  if (parsed.slug) {
    fm.slug = parsed.slug;
  }

  // series → flat string
  if (parsed.series) {
    if (typeof parsed.series === "object" && parsed.series.name) {
      fm.series = parsed.series.name;
      if (parsed.series.order !== undefined) {
        fm.seriesOrder = typeof parsed.series.order === "number"
          ? parsed.series.order
          : parseInt(parsed.series.order);
      }
    } else if (typeof parsed.series === "string") {
      fm.series = parsed.series;
    }
  }

  return fm;
}

function formatYamlValue(val, key) {
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    // Always use multi-line format for tags to ensure values are quoted strings
    if (key === "tags") {
      return "\n" + val.map(v => {
        const s = String(v);
        // Quote tags that look like numbers or contain special chars
        if (/^\d+$/.test(s) || /[":{}[\]#&*!|>'%@`?,]/.test(s) || s === "" ||
            s === "true" || s === "false" || s === "null") {
          return `  - "${s}"`;
        }
        return `  - ${s}`;
      }).join("\n");
    }
    if (val.length <= 3 && val.every(v => typeof v === "string" && !v.includes(" "))) {
      return "[" + val.map(v => v).join(", ") + "]";
    }
    return "\n" + val.map(v => `  - ${v}`).join("\n");
  }
  if (typeof val === "string") {
    // Date fields should be unquoted so YAML parses them as Date objects (required by z.date())
    if (key === "published" || key === "updated") {
      return val;
    }
    // Quote if contains special chars
    if (/[":{}[\]#&*!|>'%@`?,]/.test(val) || val.includes("\n") || val === "" ||
        val === "true" || val === "false" || val === "null" ||
        /^\d/.test(val)) {
      return `"${val.replace(/"/g, '\\"')}"`;
    }
    return val;
  }
  return String(val);
}

function buildFrontmatterString(fm) {
  // Define field order to match Tsukimi conventions
  const fieldOrder = [
    "title", "published", "updated", "draft", "description", "image",
    "tags", "category", "lang", "pinned", "comment", "priority",
    "author", "sourceLink", "licenseName", "licenseUrl",
    "encrypted", "password", "passwordHint", "hideHomeContent",
    "alias", "permalink", "slug", "series", "seriesOrder",
    "ogDescription", "redirect", "repost", "copyright",
  ];

  const lines = [];
  for (const key of fieldOrder) {
    if (fm[key] === undefined || fm[key] === null) continue;
    // Skip defaults that match Tsukimi defaults
    if (key === "draft" && fm[key] === false) continue;
    if (key === "pinned" && fm[key] === false) continue;
    if (key === "comment" && fm[key] === true) continue;
    if (key === "description" && fm[key] === "") continue;
    if (key === "image" && fm[key] === "") continue;
    if (key === "category" && fm[key] === "") continue;
    if (key === "seriesOrder" && fm[key] === 0) continue;

    const val = formatYamlValue(fm[key], key);
    if (val.startsWith("\n")) {
      lines.push(`${key}:${val}`);
    } else {
      lines.push(`${key}: ${val}`);
    }
  }

  return lines.join("\n");
}

function migrateFile(srcPath) {
  const content = readFileSync(srcPath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);
  const parsed = parseYamlSimple(frontmatter);
  const fm = buildTsukimiFrontmatter(parsed, srcPath);

  const newFm = buildFrontmatterString(fm);
  const newContent = `---\n${newFm}\n---${body}`;

  // Determine destination path
  const relPath = srcPath.slice(SRC_DIR.length);
  let dstRelPath = relPath;
  // .text → .md
  if (extname(dstRelPath) === ".text") {
    dstRelPath = dstRelPath.replace(/\.text$/, ".md");
  }

  const dstPath = join(DST_DIR, dstRelPath);
  return { srcPath, dstPath, newContent, relPath, dstRelPath };
}

// Main
const files = walkDir(SRC_DIR);
console.log(`Found ${files.length} files to migrate`);

let success = 0;
let errors = 0;

for (const srcPath of files) {
  try {
    const { dstPath, newContent, relPath } = migrateFile(srcPath);

    // Ensure destination directory exists
    const dstDir = join(dstPath, "..");
    mkdirSync(dstDir, { recursive: true });

    writeFileSync(dstPath, newContent, "utf-8");
    success++;
    if (success % 50 === 0) {
      console.log(`  Migrated ${success}/${files.length}...`);
    }
  } catch (err) {
    console.error(`Error migrating ${srcPath}: ${err.message}`);
    errors++;
  }
}

console.log(`\nDone! Success: ${success}, Errors: ${errors}`);
