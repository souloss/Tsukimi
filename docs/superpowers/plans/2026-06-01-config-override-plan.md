# Config Override System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement build-time config override merging so master becomes a clean template while private config/content lives in a separate repo.

**Architecture:** Each config file in `src/config/` wraps its default object through `withOverride()`, which uses Vite's `import.meta.glob` (eager) to load matching override files from `src/overrides/` and `deepMerge` them. Override files are `.gitignored` and populated by `sync-content.js` from a private Content repo. No override files = defaults unchanged, zero-friction for template users.

**Tech Stack:** TypeScript, Vite `import.meta.glob`, Astro 6, Node.js fs for sync-content

---

### Task 1: Create RecursivePartial type

**Files:**
- Create: `src/types/utils.ts`

- [ ] **Step 1: Create the type file**

```typescript
// src/types/utils.ts
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Record<string, unknown>
      ? RecursivePartial<T[P]>
      : T[P];
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: PASS (new file, no imports yet, no breakage)

- [ ] **Step 3: Commit**

```bash
git add src/types/utils.ts
git commit -m "feat: add RecursivePartial type for config override system"
```

---

### Task 2: Create deepMerge utility

**Files:**
- Create: `src/utils/deep-merge.ts`
- Create: `tests/deep-merge.test.mjs`

- [ ] **Step 1: Write the test file**

```javascript
// tests/deep-merge.test.mjs
// Note: Run with: node --experimental-strip-types tests/deep-merge.test.mjs
// This test directly exercises the exported functions via dynamic import
const { deepMerge, isPlainObject } = await import("../src/utils/deep-merge.ts");

// Test isPlainObject
console.assert(isPlainObject({}) === true, "isPlainObject: empty object");
console.assert(isPlainObject({ a: 1 }) === true, "isPlainObject: object with props");
console.assert(isPlainObject(null) === false, "isPlainObject: null");
console.assert(isPlainObject([]) === false, "isPlainObject: array");
console.assert(isPlainObject("string") === false, "isPlainObject: string");
console.assert(isPlainObject(42) === false, "isPlainObject: number");

// Test deepMerge — primitives replaced
const result1 = deepMerge({ a: "default", b: 2 }, { a: "override" });
console.assert(result1.a === "override", "deepMerge: primitive override");
console.assert(result1.b === 2, "deepMerge: primitive inherited");

// Test deepMerge — objects merged recursively
const result2 = deepMerge(
  { banner: { enable: true, interval: 3, switchable: true } },
  { banner: { enable: false } }
);
console.assert(result2.banner.enable === false, "deepMerge: nested object override");
console.assert(result2.banner.interval === 3, "deepMerge: nested object inherit");
console.assert(result2.banner.switchable === true, "deepMerge: nested object inherit");

// Test deepMerge — arrays replaced entirely
const result3 = deepMerge(
  { links: [{ name: "GitHub" }, { name: "Twitter" }] },
  { links: [{ name: "Bilibili" }] }
);
console.assert(result3.links.length === 1, "deepMerge: array replaced");
console.assert(result3.links[0].name === "Bilibili", "deepMerge: array content replaced");

// Test deepMerge — deeply nested
const result4 = deepMerge(
  { analytics: { umami: { websiteId: "", scriptUrl: "" } } },
  { analytics: { umami: { websiteId: "abc123" } } }
);
console.assert(result4.analytics.umami.websiteId === "abc123", "deepMerge: deep override");
console.assert(result4.analytics.umami.scriptUrl === "", "deepMerge: deep inherit");

// Test deepMerge — null/undefined in source replaces target
const result5 = deepMerge({ a: "default" }, {});
console.assert(result5.a === "default", "deepMerge: empty source preserves target");

// Test deepMerge — new keys added from source
const result6 = deepMerge({ a: 1 }, { b: 2 });
console.assert(result6.a === 1, "deepMerge: preserve target key");
console.assert(result6.b === 2, "deepMerge: add source key");

console.log("All deepMerge tests passed!");
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types tests/deep-merge.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Create the implementation**

```typescript
// src/utils/deep-merge.ts

export function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: RecursivePartial<T>,
): T {
  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source as object)) {
    const sourceVal = (source as Record<string, unknown>)[key];
    const targetVal = result[key];
    if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as RecursivePartial<Record<string, unknown>>,
      );
    } else {
      result[key] = sourceVal;
    }
  }
  return result as T;
}

import type { RecursivePartial } from "@/types/utils";
```

Note: The import must be at the top of the file per Biome import order rules. Actual file structure:

```typescript
// src/utils/deep-merge.ts
import type { RecursivePartial } from "@/types/utils";

export function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: RecursivePartial<T>,
): T {
  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source as object)) {
    const sourceVal = (source as Record<string, unknown>)[key];
    const targetVal = result[key];
    if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as RecursivePartial<Record<string, unknown>>,
      );
    } else {
      result[key] = sourceVal;
    }
  }
  return result as T;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --experimental-strip-types tests/deep-merge.test.mjs`
Expected: PASS — "All deepMerge tests passed!"

- [ ] **Step 5: Run TypeScript check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/utils/deep-merge.ts tests/deep-merge.test.mjs
git commit -m "feat: add deepMerge utility for config override system"
```

---

### Task 3: Create withOverride function

**Files:**
- Create: `src/utils/config-override.ts`

- [ ] **Step 1: Create the implementation**

```typescript
// src/utils/config-override.ts
import type { RecursivePartial } from "@/types/utils";
import { deepMerge } from "@/utils/deep-merge";

/**
 * Merge config defaults with an override file from src/overrides/.
 * If no override file exists, returns defaults unchanged.
 * Override files are loaded eagerly at build time via import.meta.glob.
 */
export function withOverride<T extends Record<string, unknown>>(
  name: string,
  defaults: T,
): T {
  const modules = import.meta.glob<Record<string, RecursivePartial<T>>>(
    "../overrides/*.ts",
    { eager: true },
  );
  const key = `../overrides/${name}.ts`;
  if (modules[key]) {
    const override = modules[key].default ?? modules[key];
    return deepMerge(defaults, override) as T;
  }
  return defaults;
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `pnpm type-check`
Expected: PASS — `import.meta.glob` is valid in Astro/Vite context

- [ ] **Step 3: Commit**

```bash
git add src/utils/config-override.ts
git commit -m "feat: add withOverride function for config override system"
```

---

### Task 4: Wrap siteConfig with withOverride (proof of concept)

**Files:**
- Modify: `src/config/siteConfig.ts`

This is the first config file wrapped — serves as the proof of concept before wrapping all others.

- [ ] **Step 1: Read the current file**

Read `src/config/siteConfig.ts` to get exact current content.

- [ ] **Step 2: Modify the file — rename the inline const and wrap with withOverride**

The current file has: `export const siteConfig: SiteConfig = { ... }`

Change to:

```typescript
// Add import at top (Biome order: external → internal → types)
import { withOverride } from "@/utils/config-override";
import type { SiteConfig } from "../types/config";

const SITE_LANG = "zh_CN";

export { SITE_LANG };

const defaults: SiteConfig = {
  title: "souloss",
  subtitle: "个人技术博客",
  siteURL: "https://tsukimi-bt7.pages.dev/",
  // ... rest of the object unchanged, just renamed from siteConfig to defaults
};

export const siteConfig = withOverride("siteConfig", defaults);
```

The key change: rename the `const` from `siteConfig` to `defaults`, and add `export const siteConfig = withOverride("siteConfig", defaults)` at the bottom. All other exports (like `SITE_LANG`) stay unchanged.

- [ ] **Step 3: Run Astro check**

Run: `pnpm check`
Expected: PASS — no type errors, `withOverride` returns the same type

- [ ] **Step 4: Run dev server to verify override works when no override file exists**

Run: `ENABLE_CONTENT_SYNC=false pnpm dev` (timeout 30s, check it starts without errors)
Expected: Dev server starts, `siteConfig` has same values as before (no overrides directory exists)

- [ ] **Step 5: Create a test override file to verify merging works**

Create `src/overrides/siteConfig.ts` temporarily:

```typescript
import type { RecursivePartial } from "@/types/utils";
import type { SiteConfig } from "@/types/config";

const override: RecursivePartial<SiteConfig> = {
  title: "OverrideTest",
};

export default override;
```

- [ ] **Step 6: Run dev server and verify override applied**

Run: `ENABLE_CONTENT_SYNC=false pnpm dev` — check that `title` shows "OverrideTest" on the page
Expected: Title displays "OverrideTest" instead of default

- [ ] **Step 7: Remove the test override file and verify defaults restored**

Delete `src/overrides/siteConfig.ts`, remove `src/overrides/` directory if empty.
Run: `ENABLE_CONTENT_SYNC=false pnpm dev` — verify title shows default value
Expected: Title displays default "souloss"

- [ ] **Step 8: Commit**

```bash
git add src/config/siteConfig.ts
git commit -m "feat: wrap siteConfig with withOverride — config override proof of concept"
```

---

### Task 5: Wrap remaining 17 config files with withOverride

**Files:**
- Modify: `src/config/profileConfig.ts`
- Modify: `src/config/commentConfig.ts`
- Modify: `src/config/musicConfig.ts`
- Modify: `src/config/pioConfig.ts`
- Modify: `src/config/backgroundWallpaper.ts`
- Modify: `src/config/navBarConfig.ts`
- Modify: `src/config/sidebarConfig.ts`
- Modify: `src/config/friendsConfig.ts`
- Modify: `src/config/announcementConfig.ts`
- Modify: `src/config/effectsConfig.ts`
- Modify: `src/config/footerConfig.ts`
- Modify: `src/config/fontConfig.ts`
- Modify: `src/config/sponsorConfig.ts`
- Modify: `src/config/shareConfig.ts`
- Modify: `src/config/permalinkConfig.ts`
- Modify: `src/config/randomPostsConfig.ts`
- Modify: `src/config/relatedPostsConfig.ts`

The transformation pattern is identical for every file:

**Before:**
```typescript
import type {FooConfig} from "../types/config";
export const fooConfig: FooConfig = { /* inline object */ };
```

**After:**
```typescript
import { withOverride } from "@/utils/config-override";
import type { FooConfig } from "../types/config";

const defaults: FooConfig = { /* inline object, unchanged */ };

export const fooConfig = withOverride("fooConfig", defaults);
```

The `withOverride` name matches the filename without `.ts` extension.

**Special cases:**

| File | Export name | Override name | Notes |
|------|------------|---------------|-------|
| `musicConfig.ts` | `musicPlayerConfig` | `"musicConfig"` | Override filename = file basename |
| `sidebarConfig.ts` | `sidebarLayoutConfig` | `"sidebarConfig"` | Override filename = file basename |
| `backgroundWallpaper.ts` | `backgroundWallpaperConfig` | `"backgroundWallpaper"` | Override filename = file basename |

- [ ] **Step 1: Wrap all 17 files**

Apply the transformation to each file. The only change per file is:
1. Add `import { withOverride } from "@/utils/config-override";` at top
2. Rename `export const <name>: <Type> = {` to `const defaults: <Type> = {`
3. Add `export const <name> = withOverride("<overrideName>", defaults);` at bottom

- [ ] **Step 2: Run Astro check**

Run: `pnpm check`
Expected: PASS

- [ ] **Step 3: Run dev server**

Run: `ENABLE_CONTENT_SYNC=false pnpm dev` (30s timeout, verify it starts)
Expected: Dev server starts, all pages render normally

- [ ] **Step 4: Commit**

```bash
git add src/config/
git commit -m "feat: wrap all config files with withOverride for config override system"
```

---

### Task 6: Add src/overrides/ to .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the gitignore entry**

Add after the existing `/content/` entry:

```gitignore
# Config overrides (populated by sync-content from private Content repo)
src/overrides/
```

- [ ] **Step 2: Verify .gitignore works**

Run: `git status src/overrides/`
Expected: Directory not listed (or "not tracked" if empty)

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add src/overrides/ to .gitignore for config override privacy"
```

---

### Task 7: Extend sync-content.js for overrides, assets, favicon, wrangler.toml

**Files:**
- Modify: `scripts/sync-content.js`

- [ ] **Step 1: Read current sync-content.js**

Read `scripts/sync-content.js` to get exact current content.

- [ ] **Step 2: Add new sync mappings after existing contentMappings loop**

Insert after the `for (const mapping of contentMappings)` loop (after line ~138), before the `console.log("\n内容同步完成\n")` line:

```javascript
// ── Override files: content/overrides/ → src/overrides/ (copy, not symlink) ──
const overridesSrc = path.join(CONTENT_DIR, "overrides");
const overridesDest = path.join(rootDir, "src/overrides");
if (fs.existsSync(overridesSrc)) {
	if (fs.existsSync(overridesDest)) {
		fs.rmSync(overridesDest, { recursive: true, force: true });
	}
	copyRecursive(overridesSrc, overridesDest);
	console.log("已同步配置覆盖文件");
}

// ── Personal assets: content/assets/ → src/assets/private/ ──
const assetsSrc = path.join(CONTENT_DIR, "assets");
const assetsDest = path.join(rootDir, "src/assets/private");
if (fs.existsSync(assetsSrc)) {
	if (fs.existsSync(assetsDest)) {
		fs.rmSync(assetsDest, { recursive: true, force: true });
	}
	copyRecursive(assetsSrc, assetsDest);
	console.log("已同步私人资源文件");

	// ── Favicon: content/assets/favicon.ico → public/favicon.ico ──
	const faviconSrc = path.join(CONTENT_DIR, "assets/favicon.ico");
	if (fs.existsSync(faviconSrc)) {
		fs.copyFileSync(faviconSrc, path.join(rootDir, "public/favicon.ico"));
		console.log("已同步 favicon");
	}
}

// ── wrangler.toml: content/wrangler.toml → project root ──
const wranglerSrc = path.join(CONTENT_DIR, "wrangler.toml");
if (fs.existsSync(wranglerSrc)) {
	fs.copyFileSync(wranglerSrc, path.join(rootDir, "wrangler.toml"));
	console.log("已同步 wrangler.toml");
}
```

- [ ] **Step 3: Run lint to verify code style**

Run: `pnpm lint`
Expected: PASS (Biome auto-fixes any formatting issues)

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-content.js
git commit -m "feat: extend sync-content to sync overrides, assets, favicon, wrangler.toml"
```

---

### Task 8: Clean master config — replace private values with template defaults

**Files:**
- Modify: `src/config/siteConfig.ts`
- Modify: `src/data/friends.ts`
- Modify: `src/data/timeline.ts`
- Modify: `src/components/organisms/footer/Footer.astro`
- Modify: `src/pages/friends.astro`

- [ ] **Step 1: Clean siteConfig.ts**

Change the following fields in the `defaults` object (the object is now named `defaults` after Task 4):

| Field | Current value | New template default |
|-------|--------------|---------------------|
| `siteURL` | `"https://tsukimi-bt7.pages.dev/"` | `"https://tsukimi.example.com/"` |
| `analytics.umamiAnalytics.websiteId` | `"cdbf170a-fddb-4963-92e7-aab575aa26eb"` | `""` |
| `analytics.umamiAnalytics.scriptUrl` | `"https://umami.souloss.cn/script.js"` | `""` |

- [ ] **Step 2: Clean data/friends.ts**

Change friend entry #2:
- `title: "Mizuki Docs"` → `title: "Tsukimi Docs"`
- `desc: "Mizuki User Manual"` → `desc: "Tsukimi User Manual"`

- [ ] **Step 3: Clean data/timeline.ts**

Change project entry:
- `title: "Mizuki Personal Blog Project"` → `title: "Tsukimi Blog Project"`

- [ ] **Step 4: Clean Footer.astro**

Find the footer link text and change from the current brand name to `"Tsukimi"`. The exact line is:
```html
href="https://github.com/souloss/Mizuki">Mizuki</a
```
Change the display text from whatever it currently is to `Tsukimi`.

- [ ] **Step 5: Clean friends.astro**

Change the `mySiteInfo` object:
- `name: siteConfig.title || "Mizuki Blog"` → `name: siteConfig.title || "Tsukimi Blog"`
- `desc: profileConfig.bio || "一个使用 Mizuki 主题的 Astro 博客"` → `desc: profileConfig.bio || "一个使用 Tsukimi 主题的 Astro 博客"`

- [ ] **Step 6: Run lint**

Run: `pnpm lint`
Expected: PASS

- [ ] **Step 7: Run dev server with no overrides**

Run: `ENABLE_CONTENT_SYNC=false pnpm dev` (30s timeout)
Expected: Site renders with template defaults — no private URLs, no private analytics IDs

- [ ] **Step 8: Commit**

```bash
git add src/config/siteConfig.ts src/data/friends.ts src/data/timeline.ts src/components/organisms/footer/Footer.astro src/pages/friends.astro
git commit -m "chore: replace private config values with template defaults"
```

---

### Task 9: Update .env.example with override documentation

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add override explanation to .env.example**

Add after the existing `CONTENT_DIR` section:

```ini
# ============================================
# 配置覆盖说明 (Config Override)
# ============================================
# 当 ENABLE_CONTENT_SYNC=true 时，sync-content 会从 Content 仓库同步:
# - posts/ → src/content/posts/ (文章)
# - spec/ → src/content/spec/ (特殊页面)
# - data/ → src/data/ (数据文件)
# - overrides/ → src/overrides/ (配置覆盖，深度合并到默认配置)
# - assets/ → src/assets/private/ (私人资源)
# - wrangler.toml → 项目根目录 (部署配置)
# 配置覆盖使用 RecursivePartial<T> 格式，只写需要覆盖的字段。
# 详细说明见 docs/superpowers/specs/2026-06-01-config-override-design.md
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add config override documentation to .env.example"
```

---

### Task 10: Verify full system — dev server with no overrides

**Files:** None (verification only)

- [ ] **Step 1: Ensure src/overrides/ is empty or absent**

Run: `ls src/overrides/ 2>/dev/null || echo "Directory does not exist"`
Expected: "Directory does not exist" or empty listing

- [ ] **Step 2: Run dev server with sync disabled**

Run: `ENABLE_CONTENT_SYNC=false pnpm dev` (30s timeout)
Expected: Dev server starts successfully, all pages render with template defaults

- [ ] **Step 3: Check specific template default values are present**

In browser:
- Title should show template default (not private value)
- No private umami/analytics URLs in page source
- Footer shows "Tsukimi" brand

- [ ] **Step 4: Run Astro check**

Run: `pnpm check`
Expected: PASS

- [ ] **Step 5: Run build**

Run: `ENABLE_CONTENT_SYNC=false pnpm build` (120s timeout)
Expected: Build succeeds, produces `dist/` with template defaults

---

### Task 11: Final integration commit

- [ ] **Step 1: Run full lint + format**

Run: `pnpm lint && pnpm format`
Expected: PASS

- [ ] **Step 2: Run full type check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 3: Run Astro check**

Run: `pnpm check`
Expected: PASS

- [ ] **Step 4: Verify .gitignore blocks src/overrides/**

Run: `git status`
Expected: No `src/overrides/` files appear in untracked/modified

---

## Post-Implementation Tasks (manual, outside this plan)

These tasks require manual action by the user (creating a GitHub private repo, extracting content from newblog, deploying):

1. **Create Tsukimi-Content private repository** — extract posts, spec, data, overrides, assets, wrangler.toml from newblog branch
2. **Configure .env** — set `ENABLE_CONTENT_SYNC=true`, `CONTENT_REPO_URL=<private-repo-url>`
3. **Verify personal site build** — `pnpm dev` with Content repo sync + overrides applied
4. **Deploy personal site** — `pnpm build && npx wrangler pages deploy dist`
5. **Verify demo site CI** — ensure GitHub Actions uses `ENABLE_CONTENT_SYNC=false`
6. **Archive newblog branch** — `git branch -d newblog && git push origin --delete newblog`
7. **Clean up private remote** — `git remote remove private`

These are NOT part of the automated implementation plan because they involve:
- Creating a new GitHub repository (manual)
- Extracting content from git branches (context-dependent)
- Deploying to Cloudflare (account-specific)
- Deleting git branches (destructive, requires explicit user consent)