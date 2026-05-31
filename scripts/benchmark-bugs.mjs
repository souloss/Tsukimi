#!/usr/bin/env node

/**
 * Tsukimi Bug Benchmark
 *
 * Static analysis benchmark that scans the Tsukimi Astro blog source code
 * for known bug categories. Outputs a JSON score as the last line of stdout.
 *
 * Bug categories:
 *   - missing_i18n: Nav link names in navBarConfig not mapped in navTitleMap
 *   - broken_nav_refs: Internal nav URLs (leaf pages) with no corresponding page file
 *   - missing_widget_reg: Sidebar widget types in config not in SidebarColumn componentMap
 *   - css_important_misuse: !important in component CSS (not core framework CSS)
 *   - dark_mode_gaps: Key components with text color classes missing dark: variant
 *
 * Output JSON format (last line of stdout):
 *   {"primary": <bug_count>, "sub_scores": {"missing_i18n": N, "broken_nav_refs": N, ...}}
 */

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

// ─── Helpers ────────────────────────────────────────────────────────────────

function readFile(p) {
  try {
    return readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

function fileExists(p) {
  return existsSync(p);
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/** Recursively collect files matching a predicate */
function collectFiles(dir, predicate, results = []) {
  if (!isDir(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, predicate, results);
    } else if (predicate(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ─── 1. Missing i18n Keys ───────────────────────────────────────────────────

/**
 * Parse navBarConfig from config.ts to extract all link names used in navigation.
 * Then parse navTitleMap from DropdownMenu.astro and NavMenuPanel.astro.
 * Any name in navBarConfig that is NOT in navTitleMap is a missing i18n bug.
 *
 * We only check names that appear in the navBarConfig.links array,
 * excluding external links (GitHub, Bilibili, etc.) and profile names.
 */
function checkMissingI18n() {
  const configPath = join(SRC, "config", "navBarConfig.ts");
  const configContent = readFile(configPath);

  // Extract only navBarConfig section
  const navBarMatch = configContent.match(/navBarConfig[^=]*=\s*\{[\s\S]*?^\};/m);
  if (!navBarMatch) return [];
  const navBarContent = navBarMatch[0];

  // Extract link names from navBarConfig
  const namePattern = /name:\s*["']([^"']+)["']/g;
  const navNames = new Set();
  let match;
  while ((match = namePattern.exec(navBarContent)) !== null) {
    navNames.add(match[1]);
  }

  // External link names that don't need i18n (they're proper nouns/brands)
  const externalNames = new Set([
    "GitHub", "Bilibili", "Gitee", "Codeberg", "Discord",
  ]);

  // Remove external names from the check set
  for (const name of externalNames) {
    navNames.delete(name);
  }

  // Extract navTitleMap keys from DropdownMenu.astro
  const dropdownPath = join(SRC, "components/organisms/navigation/DropdownMenu.astro");
  const dropdownContent = readFile(dropdownPath);

  // Extract navTitleMap keys from NavMenuPanel.astro
  const panelPath = join(SRC, "components/organisms/navigation/NavMenuPanel.astro");
  const panelContent = readFile(panelPath);

  // Pattern for navTitleMap entries: KeyName: I18nKey.xxx
  const mapKeyPattern = /^\s*(\w+)\s*:\s*I18nKey\./gm;
  const mappedKeys = new Set();
  while ((match = mapKeyPattern.exec(dropdownContent)) !== null) {
    mappedKeys.add(match[1]);
  }
  while ((match = mapKeyPattern.exec(panelContent)) !== null) {
    mappedKeys.add(match[1]);
  }

  // Check which nav names are missing from the navTitleMap
  const bugs = [];
  for (const name of navNames) {
    if (!mappedKeys.has(name)) {
      bugs.push(name);
    }
  }

  return bugs;
}

// ─── 2. Broken Navigation References ────────────────────────────────────────

/**
 * Extract internal leaf-page URLs from navBarConfig and verify corresponding
 * page files exist. We skip parent/group URLs (those with children) since
 * they're just dropdown containers, not actual pages.
 */
function checkBrokenNavRefs() {
  const configPath = join(SRC, "config", "navBarConfig.ts");
  const configContent = readFile(configPath);

  // Extract the navBarConfig section
  const navBarMatch = configContent.match(/navBarConfig[^=]*=\s*\{[\s\S]*?^\};/m);
  if (!navBarMatch) return [];
  const navBarContent = navBarMatch[0];

  const pagesDir = join(SRC, "pages");
  const bugs = [];

  // Strategy: Find all object blocks { name, url, ... } in navBarConfig.
  // For each block, extract the url. If the block also has children:,
  // it's a parent container - skip its URL. If it has no children:,
  // it's a leaf link - check if the URL resolves to a page file.

  // We also need to handle LinkPreset entries (just a number like LinkPreset.Home)
  // which don't have url: properties - they resolve at runtime.

  // Parse object blocks by finding balanced { } pairs
  // Simple approach: find all url: values, then for each one check if
  // a children: property exists between the opening { and the url: line

  // Better approach: find each complete object block and analyze it
  const objectBlocks = [];
  let depth = 0;
  let blockStart = -1;
  let blockContent = "";

  for (let i = 0; i < navBarContent.length; i++) {
    if (navBarContent[i] === "{") {
      if (depth === 0) {
        blockStart = i;
        blockContent = "";
      }
      depth++;
      blockContent += navBarContent[i];
    } else if (navBarContent[i] === "}") {
      depth--;
      blockContent += navBarContent[i];
      if (depth === 0 && blockStart >= 0) {
        objectBlocks.push(blockContent);
        blockStart = -1;
        blockContent = "";
      }
    } else if (depth > 0) {
      blockContent += navBarContent[i];
    }
  }

  // For each object block, extract url and check if it has children
  const parentUrls = new Set();
  const leafUrls = [];

  for (const block of objectBlocks) {
    const urlMatch = block.match(/url:\s*["']([^"']+)["']/);
    if (!urlMatch) continue; // LinkPreset entries don't have url

    const url = urlMatch[1];
    // Only internal URLs
    if (!url.startsWith("/") || url.startsWith("//") || url === "#") continue;

    if (block.includes("children:")) {
      parentUrls.add(url);
    } else {
      leafUrls.push(url);
    }
  }

  for (const url of leafUrls) {
    const cleanUrl = url.replace(/\/$/, "").replace(/^\//, "");

    let found = false;

    // Check direct file: pages/<name>.astro
    const directFile = join(pagesDir, `${cleanUrl}.astro`);
    if (fileExists(directFile)) {
      found = true;
    }

    // Check index file: pages/<name>/index.astro
    if (!found) {
      const indexFile = join(pagesDir, cleanUrl, "index.astro");
      if (fileExists(indexFile)) {
        found = true;
      }
    }

    // Check directory with any astro/ts files
    if (!found) {
      const dir = join(pagesDir, cleanUrl);
      if (isDir(dir)) {
        const files = readdirSync(dir);
        if (files.some(f => f.endsWith(".astro") || f.endsWith(".ts"))) {
          found = true;
        }
      }
    }

    if (!found) {
      bugs.push(url);
    }
  }

  return bugs;
}

// ─── 3. Missing Widget Registrations ────────────────────────────────────────

/**
 * Check that all widget types in sidebarLayoutConfig.components (left, right, drawer)
 * are registered in the SidebarColumn.astro componentMap.
 */
function checkMissingWidgetReg() {
  const configPath = join(SRC, "config", "sidebarConfig.ts");
  const configContent = readFile(configPath);

  // Extract the components section from sidebarLayoutConfig
  // Match: components: { left: [...], right: [...], drawer: [...] }
  const componentsMatch = configContent.match(/components:\s*\{[\s\S]*?drawer:\s*\[[\s\S]*?\]\s*\}/);
  if (!componentsMatch) return [];

  const section = componentsMatch[0];
  // Extract quoted string types from the arrays
  const typePattern = /["']([\w-]+)["']/g;
  const configuredTypes = new Set();
  let match;
  while ((match = typePattern.exec(section)) !== null) {
    configuredTypes.add(match[1]);
  }

  // Extract componentMap keys from SidebarColumn.astro
  // The componentMap uses bare identifiers as keys: profile: Profile, "card-toc": CardTOC
  const sidebarColumnPath = join(SRC, "components/layout/SidebarColumn.astro");
  const sidebarColumnContent = readFile(sidebarColumnPath);

  // Match the componentMap object body
  const componentMapMatch = sidebarColumnContent.match(/componentMap[^=]*=\s*\{([\s\S]*?)\n\}/);
  if (!componentMapMatch) return [];

  const mapBody = componentMapMatch[1];
  const registeredTypes = new Set();

  // Keys can be bare identifiers (profile:) or quoted strings ("card-toc":)
  const bareKeyPattern = /^\s*([\w-]+)\s*:/gm;
  while ((match = bareKeyPattern.exec(mapBody)) !== null) {
    registeredTypes.add(match[1]);
  }
  const quotedKeyPattern = /["']([\w-]+)["']\s*:/g;
  while ((match = quotedKeyPattern.exec(mapBody)) !== null) {
    registeredTypes.add(match[1]);
  }

  const bugs = [];
  for (const type of configuredTypes) {
    if (!registeredTypes.has(type)) {
      bugs.push(type);
    }
  }

  return bugs;
}

// ─── 4. CSS !important Misuse ───────────────────────────────────────────────

/**
 * Count !important usages in COMPONENT-level CSS files only.
 * Core framework CSS files (banner.css, main.css, transition.css, etc.)
 * legitimately use !important for animations, performance, and specificity overrides.
 *
 * We only flag !important in component-specific CSS files that should follow
 * the project's CSS rules (no !important in business CSS).
 *
 * Allowed files (core/framework CSS that legitimately uses !important):
 *   - twikoo.css (overrides dynamic injected styles - explicitly allowed by CLAUDE.md)
 *   - encrypted-content.css (code syntax highlighting overrides)
 *   - banner.css (complex animation system)
 *   - main.css (global performance/utility overrides)
 *   - transition.css (Swup page transition system)
 *   - expressive-code.css (code block styling overrides)
 *   - mobile-transition-fix.css (performance fix for mobile)
 *   - mobile-post-list-fix.css (mobile layout fixes)
 *   - wallpaper-navbar-transparent.css (wallpaper mode overrides)
 *   - widget-responsive.css (responsive layout overrides)
 *   - photoswipe.css (third-party lightbox overrides)
 *   - animation-enhancements.css (animation system)
 *
 * Files to CHECK for !important misuse:
 *   - Any component-specific CSS not in the above list
 */
function checkCssImportantMisuse() {
  const stylesDir = join(SRC, "styles");
  const cssFiles = collectFiles(stylesDir, (name) => name.endsWith(".css"));

  // Core/framework CSS files that legitimately use !important
  const allowedFiles = new Set([
    "twikoo.css",
    "encrypted-content.css",
    "banner.css",
    "main.css",
    "transition.css",
    "expressive-code.css",
    "mobile-transition-fix.css",
    "mobile-post-list-fix.css",
    "wallpaper-navbar-transparent.css",
    "widget-responsive.css",
    "photoswipe.css",
    "animation-enhancements.css",
  ]);

  const bugs = [];
  for (const file of cssFiles) {
    const fileName = file.split("/").pop();
    if (allowedFiles.has(fileName)) continue;

    const content = readFile(file);
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("!important")) {
        // Skip if it's inside a comment
        const beforeImportant = lines[i].split("!important")[0];
        if (beforeImportant.includes("/*") && !beforeImportant.includes("*/")) continue;
        // Skip comment-only lines
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.startsWith("//")) continue;

        bugs.push({ file: fileName, line: i + 1, content: trimmed.substring(0, 80) });
      }
    }
  }

  return bugs;
}

// ─── 5. Dark Mode Gaps ─────────────────────────────────────────────────────

/**
 * Check key page/component files for Tailwind text color classes that set
 * a light-mode color but lack a corresponding dark: variant on the same line.
 *
 * This is a heuristic check - it looks for patterns like:
 *   text-black/75  (without dark:text-white/75 on the same line)
 *
 * We only check Astro template sections (between --- frontmatter and <style> tags).
 */
function checkDarkModeGaps() {
  const keyPaths = [
    join(SRC, "pages/archive.astro"),
    join(SRC, "pages/about.astro"),
    join(SRC, "pages/friends.astro"),
    join(SRC, "pages/anime.astro"),
    join(SRC, "pages/diary.astro"),
    join(SRC, "pages/albums.astro"),
    join(SRC, "pages/devices.astro"),
    join(SRC, "pages/projects.astro"),
    join(SRC, "pages/skills.astro"),
    join(SRC, "pages/timeline.astro"),
    join(SRC, "pages/message.astro"),
    join(SRC, "pages/talking.astro"),
    join(SRC, "pages/reposts.astro"),
    join(SRC, "components/organisms/navigation/Navbar.astro"),
    join(SRC, "components/organisms/navigation/DropdownMenu.astro"),
    join(SRC, "components/organisms/navigation/NavMenuPanel.astro"),
    join(SRC, "components/widgets/categories/Categories.astro"),
    join(SRC, "components/widgets/tags/Tags.astro"),
    join(SRC, "components/widgets/profile/Profile.astro"),
    join(SRC, "components/widgets/announcement/Announcement.astro"),
  ];

  const bugs = [];

  for (const filePath of keyPaths) {
    const content = readFile(filePath);
    if (!content) continue;

    // Extract only the template section (after frontmatter, before <style>)
    // Remove frontmatter
    let templateContent = content.replace(/^---[\s\S]*?---/, "");
    // Remove <style>...</style> blocks
    templateContent = templateContent.replace(/<style[\s\S]*?<\/style>/g, "");
    // Remove <script>...</script> blocks
    templateContent = templateContent.replace(/<script[\s\S]*?<\/script>/g, "");

    const lines = templateContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check for text-black/XX or text-black-XXX without dark:text- on the same line
      // We look for explicit light-mode text colors that should have dark variants
      const hasLightTextColor = /\btext-black(?:\/\d+)?\b/.test(line);
      const hasDarkVariant = /\bdark:text-/.test(line);

      if (hasLightTextColor && !hasDarkVariant) {
        const fileName = filePath.split("/").pop();
        bugs.push({ file: fileName, line: i + 1, content: trimmed.substring(0, 100) });
      }
    }
  }

  return bugs;
}

// ─── 6. i18n Key Coverage ───────────────────────────────────────────────────

/**
 * Check that all keys defined in i18nKey.ts have translations in ALL language files.
 * Missing translations will cause fallback to the key name, which is a bug.
 */
function checkI18nCoverage() {
  const i18nKeyPath = join(SRC, "i18n/i18nKey.ts");
  const i18nKeyContent = readFile(i18nKeyPath);

  // Extract all enum values from I18nKey
  const keyPattern = /(\w+)\s*=\s*["']\1["']/g;
  const allKeys = new Set();
  let match;
  while ((match = keyPattern.exec(i18nKeyContent)) !== null) {
    allKeys.add(match[1]);
  }

  // Check each language file
  const langFiles = ["en.ts", "ja.ts", "zh_CN.ts", "zh_TW.ts"];
  const bugs = [];

  for (const langFile of langFiles) {
    const langPath = join(SRC, "i18n/languages", langFile);
    const langContent = readFile(langPath);

    // Check which keys are missing from this language file
    for (const key of allKeys) {
      // Look for [Key.keyName]: pattern
      if (!langContent.includes(`[Key.${key}]`) && !langContent.includes(`Key.${key}]`)) {
        bugs.push({ lang: langFile.replace(".ts", ""), key });
      }
    }
  }

  return bugs;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  const missingI18n = checkMissingI18n();
  const brokenNavRefs = checkBrokenNavRefs();
  const missingWidgetReg = checkMissingWidgetReg();
  const cssImportantMisuse = checkCssImportantMisuse();
  const darkModeGaps = checkDarkModeGaps();
  const i18nCoverage = checkI18nCoverage();

  // Calculate sub-scores
  const subScores = {
    missing_i18n: missingI18n.length,
    broken_nav_refs: brokenNavRefs.length,
    missing_widget_reg: missingWidgetReg.length,
    css_important_misuse: cssImportantMisuse.length,
    dark_mode_gaps: darkModeGaps.length,
    i18n_coverage: i18nCoverage.length,
  };

  // Primary score = sum of all sub-scores (lower is better, target: 0)
  const primary =
    subScores.missing_i18n +
    subScores.broken_nav_refs +
    subScores.missing_widget_reg +
    subScores.css_important_misuse +
    subScores.dark_mode_gaps +
    subScores.i18n_coverage;

  // Print detailed report to stderr
  const report = {
    missing_i18n: missingI18n,
    broken_nav_refs: brokenNavRefs,
    missing_widget_reg: missingWidgetReg,
    css_important_misuse: cssImportantMisuse.map(b => `${b.file}:${b.line} - ${b.content}`),
    dark_mode_gaps: darkModeGaps.map(b => `${b.file}:${b.line} - ${b.content}`),
    i18n_coverage: i18nCoverage.map(b => `${b.lang}: ${b.key}`),
  };

  console.error("=== Tsukimi Bug Benchmark Report ===");
  console.error(JSON.stringify(report, null, 2));
  console.error("");

  // Output JSON score as last line of stdout
  const result = {
    primary: Math.round(primary * 10) / 10,
    sub_scores: subScores,
  };
  console.log(JSON.stringify(result));
}

main();