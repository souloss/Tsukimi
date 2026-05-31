# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tsukimi is a feature-rich static blog built with **Astro 6** (static output mode), **Svelte 5**, **Tailwind CSS 4**, and **TypeScript**. It is based on the Fuwari template and extended with anime tracking, diary, music player, Live2D mascot, and more. The site uses Swup for page transitions and Pagefind for search.

## Commands

- `pnpm dev` — Start dev server (auto-syncs content first via predev hook)
- `pnpm build` — Production build (updates anime data, builds Astro, runs Pagefind, compresses fonts)
- `pnpm preview` — Preview production build locally
- `pnpm check` — Astro type/error checking
- `pnpm type-check` — TypeScript check via `tsc --noEmit`
- `pnpm lint` — ESLint with auto-fix (`eslint ./src --fix`)
- `pnpm format` — Prettier formatting (`prettier --write ./src`)
- `pnpm new-post <filename>` — Scaffold a new blog post in `src/content/posts/`
- `pnpm sync-content` — Sync content from external repo (if `ENABLE_CONTENT_SYNC=true`)
- `pnpm update-anime` / `pnpm update-bangumi` / `pnpm update-bilibili` — Fetch anime/bangumi/bilibili data

Package manager is **pnpm** only (enforced via preinstall hook). Node >= 22 required.

## Architecture

### Routing & Pages (`src/pages/`)

Astro file-based routing. Key pages:
- `[...page].astro` — Home/paginated post list
- `[...permalink].astro` — Individual post pages (handles permalink resolution)
- `posts/[...slug].astro` — Post slug fallback
- Feature pages: `anime.astro`, `diary.astro`, `friends.astro`, `albums.astro`, `projects.astro`, `skills.astro`, `timeline.astro`, `devices.astro`, `about.astro`, `archive.astro`
- API endpoints: `api/allPostMeta.json.ts`, `api/calendar-data.json.ts`
- OG image generation: `og/[...slug].png.ts`
- RSS/Atom feeds: `rss.xml.ts`, `atom.xml.ts`

### Content Collections (`src/content/`)

Two Astro content collections defined in `src/content.config.ts`:
- **posts** — Blog posts from `src/content/posts/` (md/mdx). Schema includes: title, published, draft, tags, category, image, pinned, comment, encrypted, password, permalink, alias, etc.
- **spec** — Special pages from `src/content/spec/` (about.md, friends.md) with empty schema.

### Configuration (`src/config.ts`)

Central configuration file exporting all config objects:
- `siteConfig` — Site metadata, language, theme, banner, feature page toggles, post layout, wallpaper mode, TOC, fonts, etc.
- `navBarConfig` — Navigation links with nested dropdown support
- `profileConfig` — Author profile for sidebar
- `sidebarLayoutConfig` — Sidebar widget ordering (left/right/drawer), animation, responsive breakpoints
- `commentConfig`, `musicPlayerConfig`, `announcementConfig`, `sakuraConfig`, `pioConfig`, etc.

### Component Organization (`src/components/`)

Atomic design hierarchy:
- **atoms/** — Primitive UI elements
- **features/** — Feature-specific components (posts, toc, pio, settings, timeline, stats, skills, projects)
- **organisms/** — Composed sections (navigation/Navbar, footer/Footer)
- **widgets/** — Sidebar widgets (profile, announcement, categories, tags, card-toc, calendar, site-stats, music-sidebar, music-player, sidebar, feed)
- **layout/** — Banner, RightSideBar
- **control/** — ThemeSwitch, FloatingControls, PageProgressBar
- **misc/** — Markdown renderer, ConfigCarrier, FullscreenWallpaper, IconifyLoader
- **common/** — Shared utilities

Components use both `.astro` and `.svelte` files. Svelte 5 is used for interactive/client-side components (music player, theme switch, search, etc.).

### Layouts (`src/layouts/`)

- `Layout.astro` — Root layout: `<head>`, global styles, ConfigCarrier, MusicPlayer, Pio, PageProgressBar
- `MainGridLayout.astro` — Grid layout wrapping Layout: Navbar, Banner, SideBar, RightSideBar, Footer, FloatingControls, TOC

### i18n (`src/i18n/`)

- `i18nKey.ts` — All translation keys as a union type
- `languages/` — Translation files: `en.ts`, `ja.ts`, `zh_CN.ts`, `zh_TW.ts`
- `translation.ts` — `i18n(key)` function that resolves translations based on `siteConfig.lang`

### Markdown Plugins (`src/plugins/`)

Custom remark/rehype plugins registered in `astro.config.mjs`:
- `remark-content.mjs` — Content processing
- `remark-fix-github-admonitions.js` — Normalize GitHub-style admonitions
- `remark-mermaid.js` / `rehype-mermaid.mjs` — Mermaid diagram support
- `rehype-component-admonition.mjs` — Callout/admonition blocks (note, tip, warning, caution, important)
- `rehype-component-github-card.mjs` — `::github{repo="..."}` embeds
- `rehype-image-width.mjs`, `rehype-wrap-table.mjs` — Image/table enhancements
- `expressive-code/` — Custom copy button and language badge plugins

### Static Data (`src/data/`)

TypeScript data files for feature pages: `anime.ts`, `diary.ts`, `friends.ts`, `projects.ts`, `skills.ts`, `timeline.ts`, `devices.ts`

### Utilities (`src/utils/`)

Key utilities: `content-utils.ts` (post processing), `widget-manager.ts` (sidebar widget orchestration), `grid-layout-utils.ts`, `tocManager.ts`, `permalink-utils.ts`, `navigation-utils.ts`, `sakura-manager.ts`, `animation-utils.ts`, `performance-observer.ts`

### Styles (`src/styles/`)

CSS/Stylus files. Main entry: `main.css`. Notable: `variables.styl`, `banner.css`, `transition.css`, `encrypted-content.css`, `widget-responsive.css`

### Scripts (`scripts/`)

Node.js scripts for build pipeline and content management: `new-post.js`, `sync-content.js`, `update-anime.mjs`, `update-bangumi.mjs`, `update-bilibili.mjs`, `compress-fonts.js`, `indexnow-submit.js`

## Key Patterns

- **Path aliases**: `@components/*`, `@assets/*`, `@constants/*`, `@utils/*`, `@i18n/*`, `@layouts/*`, `@/*` (maps to `src/*`)
- **Trailing slashes**: Site uses `trailingSlash: "always"` in Astro config
- **Content sync**: `predev`/`prebuild` hooks auto-run `sync-content.js` before dev/build
- **Build pipeline**: Build runs `update-anime.mjs` → `astro build` → `pagefind` → `compress-fonts.js`
- **Feature page toggles**: `siteConfig.featurePages` controls which pages are enabled; disabled pages should also be removed from `navBarConfig`
- **Sidebar configuration**: Widget ordering and placement (left/right/drawer) is controlled by `sidebarLayoutConfig.components`
- **Encrypted posts**: Posts support client-side encryption via `encrypted`/`password` frontmatter fields using CryptoJS
- **ESLint**: Many Astro template files are ignored in ESLint config due to parsing issues; import sorting is enforced via `eslint-plugin-simple-import-sort`

## Development Rules (from `docs/rule/`)

### Component Architecture (Atomic Design)

Components follow a strict layered hierarchy: **atoms → molecules → organisms → pages**

- **atoms/** — Minimal, indivisible UI elements. No business logic, no component dependencies. Examples: Badge, Button, Chip, Icon, Image, Link, Loader
- **features/** — Feature-specific composites (posts, toc, pio, settings, timeline, stats, skills, projects)
- **organisms/** — Complex business components combining multiple atoms/molecules (Navbar, Footer, MusicPlayer, Calendar, TOC)
- **widgets/** — Sidebar modules using the shared `WidgetLayout.astro` container
- **misc/** — General-purpose containers (ListContainer, ListDivider, CardBase)

**Before writing new UI code, check if an existing atom/component can be reused.** If the same UI pattern appears 2+ times, extract it into a reusable component. If no suitable component exists, create one.

**Component size limits:**
- > 500 lines: must split
- 300-500 lines: should consider splitting
- < 200 lines: acceptable

**Complex component structure** (when splitting is needed):
```
ComponentName/
├── ComponentName.astro/svelte  # Composition layer
├── SubComponent.svelte
├── hooks/       # Logic hooks (useAudio.ts, usePlaylist.ts)
├── types.ts     # Type definitions
└── utils/       # Helper functions
```

### Sidebar Widget Integration (3 mandatory steps)

Adding a new sidebar widget requires all three steps — missing any causes the widget to silently not render:

1. **Declare type** in `src/types/config.ts` → add to `WidgetComponentType` union
2. **Configure layout** in `src/config.ts` → add to `sidebarLayoutConfig.components` (left/right/drawer arrays)
3. **Register in componentMap** in **both** sidebar renderers:
   - `src/components/widgets/sidebar/SideBar.astro` (left sidebar + drawer)
   - `src/components/layout/RightSideBar.astro` (right sidebar — independent from left!)

The most common mistake is registering in SideBar.astro but forgetting RightSideBar.astro.

### Icon Usage (3 methods, strict rules)

| Method | Import | Attribute | File Type |
|--------|--------|-----------|-----------|
| astro-icon | `import { Icon } from "astro-icon/components"` | `name` | `.astro` |
| @iconify/svelte | `import Icon from "@iconify/svelte"` | `icon` | `.svelte` |
| Custom Icon | `import Icon from "@components/misc/Icon.astro"` | `icon` | `.astro` (needs loading/fallback) |

- **Never** use raw `<iconify-icon>` tags directly
- **Never** mix `name` and `icon` attributes — they belong to different libraries
- Prefer `material-symbols:` icon set for visual consistency
- Use Tailwind `text-*` classes for icon sizing instead of `width`/`height` attributes

### CSS Rules

- **No `!important`** in business CSS — the only exception is `src/styles/twikoo.css` for overriding Twikoo's dynamically injected styles
- Prefer Tailwind utility classes > CSS variables > scoped styles > `:global()` > `!important` (last resort)
- Use CSS variables for theming; dark mode via `.dark` class with variable overrides
- Use Astro scoped styles by default; avoid `:global()` unless truly necessary

### Import Conventions

- Use path aliases (`@components/*`, `@utils/*`, etc.) instead of relative paths
- Import order enforced by ESLint: external libs → internal libs → components → utils → types → constants
- Avoid circular dependencies; extract shared state to stores or shared modules

### Naming Conventions

- Components: PascalCase (`Button.astro`, `MusicPlayer.svelte`)
- Hooks: `use` prefix (`useCalendar.ts`, `useAudio.ts`)
- Utility files: `[feature]-utils.ts` (`content-utils.ts`, `date-utils.ts`)
- Feature module components: `[Feature]Module.astro`
- Container components: `[Feature]Container.astro`
