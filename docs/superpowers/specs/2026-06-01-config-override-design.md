# Config Override System Design

**Date:** 2026-06-01
**Status:** Approved
**Scope:** Configuration override mechanism, Content repository structure, sync-content extension, master cleanup, newblog migration

## Problem Statement

Tsukimi's master branch contains private configuration (umami IDs, personal URLs, private analytics), and the newblog branch mixes both private content and feature code. The two branches have diverged significantly, requiring manual cherry-pick/merge to stay in sync. This creates:

1. **Config leakage** — private values committed to a public repo
2. **History pollution** — merge commits and cherry-picks between branches
3. **Cognitive overhead** — every change requires deciding which branch it belongs to
4. **No clean template experience** — cloning master gives a pre-configured personal site, not a generic template

## Design Goals

- master becomes a **clean generic template** — no private values, anyone can clone and configure
- Private content and configuration live in a **separate private Content repository**
- **One codebase, two deployment targets** — demo site (master defaults) and personal site (overrides)
- **Zero-friction for template users** — no override files = everything works with defaults
- **Type-safe overrides** — override files have full TypeScript type checking
- **Predictable merge semantics** — objects merge recursively, arrays replace entirely

## Architecture Overview

```
Tsukimi/ (master — public template repo)
├── src/config/              — default template configs (with withOverride() wrapper)
├── src/overrides/           — config overrides (.gitignored, populated by sync-content)
├── src/content/posts/       — example/template posts
├── src/content/spec/        — example special pages
├── src/utils/
│   ├── deep-merge.ts        — recursive deep merge utility
│   └── config-override.ts   — withOverride() function
└── scripts/sync-content.js  — extended to sync overrides + assets + wrangler.toml

Tsukimi-Content/ (private repo — personal content + config)
├── posts/                   — personal blog articles
├── spec/                    — personal about.md, friends.md
├── overrides/               — config override files
│   ├── siteConfig.ts
│   ├── profileConfig.ts
│   ├── commentConfig.ts
│   ├── musicConfig.ts
│   ├── pioConfig.ts
│   ├── backgroundWallpaper.ts
│   ├── navBarConfig.ts
│   ├── sidebarConfig.ts
│   └── friendsConfig.ts
├── data/                    — personal data files
│   ├── friends.ts
│   └── timeline.ts
├── assets/                  — personal assets
│   ├── images/avatar.jpg
│   └── favicon.ico
├── wrangler.toml            — Cloudflare Pages deployment config
└── README.md
```

## §1 Config Override Mechanism

### withOverride() function

Each config file wraps its default export through `withOverride()`:

```typescript
// src/config/siteConfig.ts
import { withOverride } from "@/utils/config-override";
import type { SiteConfig } from "@/types/config";

const defaults: SiteConfig = {
  title: "Tsukimi",
  siteURL: "https://tsukimi.example.com/",
  // ... all template defaults
};

export const siteConfig = withOverride("siteConfig", defaults);
```

### Override file format

Override files export a `RecursivePartial<T>` — only the fields to override:

```typescript
// src/overrides/siteConfig.ts
import type { SiteConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<SiteConfig> = {
  siteURL: "https://blog.souloss.com/",
  title: "souloss",
  featurePages: {
    anime: false,
    projects: false,
    skills: false,
    timeline: false,
    albums: false,
    devices: false,
  },
  banner: {
    bannerHomeText: { enable: false },
    wallpaperHomeText: { enable: false },
  },
  analytics: {
    umamiAnalytics: {
      websiteId: "cdbf170a-fddb-4963-92e7-aab575aa26eb",
      scriptUrl: "https://umami.souloss.cn/script.js",
    },
  },
};

export default override;
```

### withOverride implementation

```typescript
// src/utils/config-override.ts
import { deepMerge } from "@/utils/deep-merge";
import type { RecursivePartial } from "@/types/utils";

/**
 * Merge config defaults with an override file from src/overrides/.
 * If no override file exists, returns defaults unchanged.
 * Override files are loaded eagerly at build time via import.meta.glob.
 */
export function withOverride<T extends Record<string, unknown>>(
  name: string,
  defaults: T,
): T {
  // import.meta.glob resolves relative to the current module's directory.
  // Since this file is in src/utils/, we use ../overrides/ to reach src/overrides/.
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

### deepMerge implementation

```typescript
// src/utils/deep-merge.ts

/**
 * Deep merge two objects.
 * - Plain objects: recursive merge
 * - Primitives and arrays: source replaces target entirely
 */
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

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}
```

### RecursivePartial type

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

### Merge semantics

| Type | Behavior | Rationale |
|------|----------|-----------|
| Plain object | Recursive merge | Override specific fields, inherit the rest |
| Primitive (string, number, boolean) | Replace | Unambiguous |
| Array | Replace entirely | Merging arrays element-by-element is unpredictable and rarely desired |

### Config files to wrap

All files in `src/config/` that export a config object:

- `siteConfig.ts` — siteConfig
- `profileConfig.ts` — profileConfig
- `commentConfig.ts` — commentConfig
- `musicConfig.ts` — musicPlayerConfig
- `pioConfig.ts` — pioConfig
- `backgroundWallpaper.ts` — backgroundWallpaperConfig
- `navBarConfig.ts` — navBarConfig
- `sidebarConfig.ts` — sidebarLayoutConfig
- `friendsConfig.ts` — friendsConfig
- `announcementConfig.ts` — announcementConfig
- `effectsConfig.ts` — effectsConfig
- `footerConfig.ts` — footerConfig
- `fontConfig.ts` — fontConfig
- `sponsorConfig.ts` — sponsorConfig
- `shareConfig.ts` — shareConfig
- `permalinkConfig.ts` — permalinkConfig
- `randomPostsConfig.ts` — randomPostsConfig
- `relatedPostsConfig.ts` — relatedPostsConfig

Files that are NOT overridden (constants, non-config exports):
- `index.ts` — re-exports only
- `expressiveCodeConfig.ts` — code block styling, rarely personal
- `markmapConfig.ts` — markmap plugin config
- `plantumlConfig.ts` — plantuml plugin config
- `licenseConfig.ts` — license display config

### .gitignore addition

```gitignore
# Config overrides (populated by sync-content from private Content repo)
src/overrides/
```

## §2 Content Repository Structure

### Directory layout

```
Tsukimi-Content/
├── posts/                    — Blog articles (.md/.mdx)
├── spec/                     — Special pages (about.md, friends.md)
├── overrides/                — Config override files (one per config)
│   ├── siteConfig.ts
│   ├── profileConfig.ts
│   ├── commentConfig.ts
│   ├── musicConfig.ts
│   ├── pioConfig.ts
│   ├── backgroundWallpaper.ts
│   ├── navBarConfig.ts
│   ├── sidebarConfig.ts
│   └── friendsConfig.ts
├── data/                     — Personal data files
│   ├── friends.ts            — Friend links data
│   └── timeline.ts           — Timeline data
├── assets/                   — Personal assets
│   ├── images/avatar.jpg     — Personal avatar
│   └── favicon.ico           — Personal favicon
├── wrangler.toml             — Cloudflare Pages deployment config
└── README.md
```

### Sync mode

All content uses **replace mode** — Content repository files completely replace template defaults. No merge of posts or data. This matches current sync-content behavior (symlinks replace entire directories).

## §3 sync-content.js Extension

### Current mappings (unchanged)

```javascript
const contentMappings = [
  { src: "posts", dest: "src/content/posts" },
  { src: "spec", dest: "src/content/spec" },
  { src: "data", dest: "src/data" },
  { src: "images", dest: "public/images" },
];
```

### New sync steps (added after existing mappings)

```javascript
// 1. Override files: content/overrides/ → src/overrides/ (copy, not symlink)
const overridesSrc = path.join(CONTENT_DIR, "overrides");
const overridesDest = path.join(rootDir, "src/overrides");
if (fs.existsSync(overridesSrc)) {
  fs.rmSync(overridesDest, { recursive: true, force: true });
  copyRecursive(overridesSrc, overridesDest);
  console.log("已同步配置覆盖文件");
}

// 2. Personal assets: content/assets/ → src/assets/private/
const assetsSrc = path.join(CONTENT_DIR, "assets");
const assetsDest = path.join(rootDir, "src/assets/private");
if (fs.existsSync(assetsSrc)) {
  fs.rmSync(assetsDest, { recursive: true, force: true });
  copyRecursive(assetsSrc, assetsDest);
  console.log("已同步私人资源文件");
}

// 3. Favicon: content/assets/favicon.ico → public/favicon.ico
const faviconSrc = path.join(CONTENT_DIR, "assets/favicon.ico");
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, path.join(rootDir, "public/favicon.ico"));
  console.log("已同步 favicon");
}

// 4. wrangler.toml: content/wrangler.toml → project root
const wranglerSrc = path.join(CONTENT_DIR, "wrangler.toml");
if (fs.existsSync(wranglerSrc)) {
  fs.copyFileSync(wranglerSrc, path.join(rootDir, "wrangler.toml"));
  console.log("已同步 wrangler.toml");
}
```

### Key decisions

- **Overrides use copy, not symlink** — Vite's `import.meta.glob` requires real files within `src/`. Symlinks may not resolve correctly for eager glob imports.
- **wrangler.toml copied to root** — needed by `npx wrangler pages deploy` after build.
- **Personal assets go to `src/assets/private/`** — avoids overwriting template assets, profileConfig override can point to this path.

## §4 Master Config Cleanup

### Values to replace with template defaults

| File | Field | Current (private) | Template default |
|------|-------|-------------------|-----------------|
| `siteConfig.ts` | `siteURL` | `"https://tsukimi-bt7.pages.dev/"` | `"https://tsukimi.example.com/"` |
| `siteConfig.ts` | `analytics.umamiAnalytics.websiteId` | `"cdbf170a-..."` | `""` |
| `siteConfig.ts` | `analytics.umamiAnalytics.scriptUrl` | `"https://umami.souloss.cn/script.js"` | `""` |
| `data/friends.ts` | friend #2 title | `"Mizuki Docs"` | `"Tsukimi Docs"` |
| `data/timeline.ts` | project title | `"Mizuki Personal Blog Project"` | `"Tsukimi Blog Project"` |
| `Footer.astro` | footer link text | `"Mizuki"` → `"souloss"` | `"Tsukimi"` |
| `friends.astro` | site info name | `"Mizuki Blog"` / `"souloss Blog"` | `"Tsukimi Blog"` |
| `friends.astro` | site info desc | `"souloss 的个人博客"` | `"一个使用 Tsukimi 主题的 Astro 博客"` |

### Values that stay as template defaults (no change needed)

- `profileConfig.ts` — already uses generic values suitable for a template
- `commentConfig.ts` — already has placeholder values
- `musicConfig.ts` — `enable: true` is correct for template demo
- `pioConfig.ts` — `enable: true` is correct for template demo
- `backgroundWallpaper.ts` — already uses template defaults

## §5 Dual Deployment Flow

### Demo site (template showcase)

```
master push → GitHub Actions CI
  → ENABLE_CONTENT_SYNC=false
  → pnpm build (uses src/content/posts/ example articles + default config)
  → Deploy to tsukimi-bt7.pages.dev (Cloudflare Pages git integration)
```

No override files exist. `withOverride()` returns defaults unchanged.

### Personal site (private blog)

```
Local machine (or future CI triggered by Content repo):
  → pnpm dev / pnpm build (predev/prebuild hook runs sync-content)
  → sync-content pulls Tsukimi-Content repo
  → Injects overrides + private posts + assets + wrangler.toml
  → pnpm build with overrides applied
  → npx wrangler pages deploy dist
  → Deployed to blog.souloss.com
```

Override files exist in `src/overrides/`. `withOverride()` merges them into defaults.

### No blog branch needed

Since the personal site is built locally with sync-content injecting overrides, there is no need for a `blog` branch in the Tsukimi repo. Master is the only code branch.

## §6 Migration Path

### Step 1: Implement config-override infrastructure

- Create `src/utils/deep-merge.ts`
- Create `src/utils/config-override.ts`
- Create `src/types/utils.ts` (RecursivePartial)
- Wrap all config files in `src/config/` with `withOverride()`
- Add `src/overrides/` to `.gitignore`
- Verify: `ENABLE_CONTENT_SYNC=false pnpm dev` works unchanged

### Step 2: Create Tsukimi-Content private repository

- Initialize private repo
- Extract posts from newblog branch → `posts/`
- Extract spec from newblog branch → `spec/`
- Extract private data from newblog → `data/`
- Extract private assets from newblog → `assets/`
- Extract wrangler.toml from newblog → `wrangler.toml`
- Create override files by diffing newblog config vs master config → `overrides/`

### Step 3: Extend sync-content.js

- Add overrides sync (copy to src/overrides/)
- Add assets sync (copy to src/assets/private/)
- Add favicon sync
- Add wrangler.toml sync
- Verify: `pnpm dev` with Content repo syncs correctly

### Step 4: Clean master config

- Replace all private values with template defaults (per §4 table)
- Verify: `ENABLE_CONTENT_SYNC=false pnpm dev` shows clean template

### Step 5: Update CI configuration

- Ensure GitHub Actions uses `ENABLE_CONTENT_SYNC=false`
- Verify demo site deploys correctly

### Step 6: Verify dual sites

- Demo site: no private information visible
- Personal site: overrides applied, all private content present

### Step 7: Archive newblog branch

- Confirm all content migrated to Content repo
- `git branch -d newblog`
- `git push origin --delete newblog`

### Step 8: Clean up remotes

- `git remote remove private` (astro-blog repo no longer needed)

## §7 newblog Code Changes to Backport

Some code changes on newblog are genuine improvements that belong in master:

| File | Change | Action |
|------|--------|--------|
| `DocsLayout.astro` | Script lazy-loading with `requestIdleCallback` | Cherry-pick to master |
| `mermaid-render-script.js` | Biome auto-format | Already on master via Biome migration |
| `Waline.astro` | Trailing newline | Trivial, skip |

The `DocsLayout.astro` change is a performance improvement (lazy script loading) that should be on master regardless of the config override work.

## Constraints and Non-Goals

- **Not changing the Content repo to be a full fork** — it stays pure content
- **Not adding merge mode for posts** — replace only, per user preference
- **Not adding sync-config.json** — replace mode is sufficient
- **Not automating personal site CI** — local build + wrangler deploy for now; can add CI later
- **Not migrating the private remote** — it will be removed after migration
