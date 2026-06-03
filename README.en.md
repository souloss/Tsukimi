# 🌸 Tsukimi

> A modern, feature-rich static blog template built with [Astro](https://astro.build), featuring advanced functionality and beautiful design.

[![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.3.0-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌏 **Language:** [**English**](./README.en.md) / [**中文**](./README.md)

[**🖥️ Live Demo**](https://tsukimi.souloss.cn/) | [**📝 Documentation**](https://tsukimi.souloss.cn/docs/tsukimi/) | [**📦 Content Repo Template**](https://github.com/souloss/Tsukimi-Content-Template)

## ✨ Features

### 🎨 Design & Interface
- ⚡ Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com) for blazing-fast loading
- 🎭 Light/dark theme switching with system preference detection and dynamic theme colors
- 🖼️ Fullscreen background images with carousel, opacity, and blur effects
- 📱 Fully responsive design with automatic resolution adaptation
- 🎬 Smooth page transitions with [Swup](https://swup.js.org/)

### 🔍 Content & Search
- 🔎 [Pagefind](https://pagefind.app/)-powered search with highlighting and keyboard navigation
- 📝 [Enhanced Markdown](#-markdown-extensions) with math formulas, code highlighting, GitHub cards, etc.
- 📑 Interactive table of contents with auto-scrolling
- 📡 RSS / Atom feed generation
- ⏱️ Reading time estimation

### 📱 Special Pages
- 🎌 **Anime Tracking** — Track anime watching progress and ratings
- 🤝 **Friends Page** — Beautiful cards showcasing friend websites
- 📔 **Diary Page** — Share life moments
- 📦 **Archive / About / Albums / Projects / Skills / Timeline / Devices** pages

### 🛠 Technical Features
- 💬 Comment system (Twikoo / Giscus / Waline)
- 🔐 Post encryption support
- 🎵 Music player
- 🐱 Live2D mascot
- 🌸 Sakura effect
- 📊 SEO optimization, sitemaps, OG images

> 📖 For full configuration details, see the [Tsukimi Documentation](https://tsukimi.souloss.cn/docs/tsukimi/)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22
- pnpm >= 9

### Installation

```bash
git clone https://github.com/souloss/Tsukimi.git
cd Tsukimi
pnpm install
```

### Configuration

Edit configuration files in `src/config/` to customize your blog settings, including site info, theme colors, banner images, and social links.

### Start Development Server

```bash
pnpm dev
```

Your blog will be available at `http://localhost:4321`.

### Deployment

Supports Vercel, Netlify, GitHub Pages, Cloudflare Pages, and more. Update `siteURL` in `src/config/siteConfig.ts` before deploying.

For environment variables, refer to `.env.example`. Do not commit `.env` to Git.

## 📦 Code-Content Separation (Optional)

Tsukimi supports separating code and content into two independent repositories, ideal for team collaboration and private content.

```bash
# Enable content separation mode
cp .env.example .env
# Edit .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Tsukimi-Content.git

# Sync content
pnpm run sync-content
```

> 📖 For detailed configuration, see the [Content Separation Guide](https://tsukimi.souloss.cn/docs/tsukimi/)

## 📝 Post Frontmatter

```yaml
---
title: Post Title
published: 2024-01-01
description: Post description
image: ./cover.jpg
tags: [tag1, tag2]
category: Category
draft: false
pinned: false
priority: 0
comment: true
lang: en
updated: 2024-06-01
slug: custom-slug
permalink: /custom/path/
alias: /old-path/
series: Series Name
seriesOrder: 1
encrypted: false
password: ""
passwordHint: ""
hideHomeContent: false
author: ""
licenseName: ""
licenseUrl: ""
sourceLink: ""
redirect: ""
---
```

### Basic Fields

| Field | Type | Default | Description |
|:------|:-----|:--------|:------------|
| `title` | `string` | — | Post title (required) |
| `published` | `Date` | — | Publication date (required) |
| `description` | `string` | `""` | Post description for SEO, previews, and RSS |
| `image` | `string` | `""` | Cover image path (relative to post file) |
| `tags` | `string[]` | `[]` | Array of tags |
| `category` | `string` | `""` | Post category |
| `draft` | `boolean` | `false` | Set to `true` to hide in production |
| `lang` | `string` | `""` | Post language (only when different from site default) |
| `updated` | `Date` | — | Update date, shown in post meta |

### Sorting & Navigation

| Field | Type | Default | Description |
|:------|:-----|:--------|:------------|
| `pinned` | `boolean` | `false` | Set to `true` to pin to top |
| `priority` | `number` | — | Sort priority among pinned posts (lower = higher) |
| `slug` | `string` | — | Custom URL slug (replaces filename part only) |
| `permalink` | `string` | — | Custom permalink (highest priority, overrides slug and global config) |
| `alias` | `string` | — | Alias path, lower priority than permalink |

### Series

| Field | Type | Default | Description |
|:------|:-----|:--------|:------------|
| `series` | `string` | — | Series name; posts in the same series show navigation |
| `seriesOrder` | `number` | `0` | Sort order within the series (lower = earlier) |

### Comments & Copyright

| Field | Type | Default | Description |
|:------|:-----|:--------|:------------|
| `comment` | `boolean` | `true` | Enable / disable comment section |
| `author` | `string` | `""` | Override author name (defaults to profileConfig) |
| `licenseName` | `string` | `""` | Override license name |
| `licenseUrl` | `string` | `""` | Override license URL |
| `sourceLink` | `string` | `""` | Override source link for the post |

### Encryption & Access Control

| Field | Type | Default | Description |
|:------|:-----|:--------|:------------|
| `encrypted` | `boolean` | `false` | Enable post encryption |
| `password` | `string` | `""` | Encryption password (requires encrypted: true) |
| `passwordHint` | `string` | `""` | Password hint text |
| `hideHomeContent` | `boolean` | `false` | Hide post excerpt on homepage |
| `redirect` | `string` | — | External redirect URL |

### Repost

```yaml
repost:
  originalAuthor: Original Author
  originalUrl: https://example.com/original
  originalTitle: Original Title
  originalSite: Original Site
```

`copyright` supported values: `CC BY` / `CC BY-SA` / `CC BY-ND` / `CC BY-NC` / `CC BY-NC-SA` / `CC BY-NC-ND` / `CC0` / `ARR`

## 🧩 Markdown Extensions

### 📝 Text Markup

| Syntax | Effect | Example |
|:-------|:-------|:--------|
| `==text==` | Highlighted mark | `==important==` |
| `:mark[text]{color=red}` | Colored mark | `:mark[label]{color=blue}` |
| `:kbd[Ctrl+C]` | Keyboard key | Ctrl+C style |
| `:blur[hidden]` | Blur overlay (click to reveal) | For spoiler content |
| `:psw[password]` | Password mask (click to reveal) | — |
| `:u[underlined]` | Underline | `:u[text]{color=red}` |
| `:emp[emphasized]` | Colored emphasis | `:emp[text]{color=blue}` |
| `:wavy[wavy]` | Wavy underline | `:wavy[text]{color=pink}` |
| `:del[deleted]` | Strikethrough | — |
| `:sup[superscript]` | Superscript | `:sup[n]{color=red}` |
| `:sub[subscript]` | Subscript | `:sub[n]{color=blue}` |
| `:color[text]{color=red}` | Custom colored text | Supports red/orange/yellow/green/blue/purple/pink/cyan/accent or hex |
| `:hashtag[tag]{href=...}` | Hash tag (auto-cycling colors) | `:hashtag[frontend]{href=/tags/frontend}` |
| `:checkbox[option]{checked=true}` | Custom checkbox | `color=` `symbol=` `inline=` |
| `:radio[option]{checked=true}` | Custom radio button | `color=` `inline=` |
| `:emoji[smile]{source=qq}` | External emoji image | source: qq/aru/tieba/blobcat/twemoji |
| `:step-brackets[1]{title=Step}` | Step marker | — |

### 📦 Container Directives

#### Callouts

13 types: `note` · `info` · `tip` · `warning` · `caution` · `important` · `question` · `quote` · `bug` · `example` · `success` · `failure` · `danger`

```markdown
:::tip[Title]{color=blue}
Content
:::
```

Also supports GitHub-style: `> [!NOTE]` / `> [!TIP]` / `> [!WARNING]` etc.

#### Collapsible Sections

```markdown
:::folding[Title]{open=true color=blue}
Content
:::
```

#### Tabs

```markdown
:::tabs{align=center}
tab:Tab One{color=red}
Content one
tab:Tab Two{color=blue}
Content two
:::
```

#### Timeline

```markdown
:::timeline
- 2024-01 | Event Title | Event description
- 2024-02 | Event Title | Event description
:::
```

#### Grid Layout

```markdown
:::grid{cols=3 gap=16 minw=240px bg=card}
Cell one
---
Cell two
---
Cell three
:::
```

#### Other Containers

| Directive | Description | Attributes |
|:----------|:-----------|:-----------|
| `:::poetry{title=... author=...}` | Poetry layout | `title` `author` `date` `footer` |
| `:::copy{label=Copy this}` | One-click copy | `label` |
| `:::blockquote{icon=user}` | Decorated blockquote | `icon` |
| `:::quot` | Compact quote card | — |
| `:::reel{title=... author=...}` | Card container | `title` `author` `date` `footer` |
| `:::paper{title=... style=...}` | Document/letter layout | `title` `author` `date` `footer` `style` |
| `:::gallery{cols=3 gap=8}` | Image gallery (click to zoom) | `cols` `gap` |
| `:::folders` | Nested collapsible sections | `folder:Name` separator |
| `:::colors{values=#ff0000,#00ff00}` | Color swatches | `values` |
| `:::asciinema{src=url}` | Terminal recording player | `src` `cols` `rows` |

### 🃏 Card Directives

```markdown
:::link-card{href=... title=... desc=... image=... icon=...}
:::

:::card{title=... icon=... href=... color=blue}
Card content
:::

:::panel
<!-- label: Left | Right -->
Code content...
:::
```

### 🎬 Media Directives

```markdown
:::video{src=video.mp4 poster=cover.jpg ratio=16/9}
:::

<!-- Bilibili -->
:::video{bilibili=BVxxxxxx}

<!-- YouTube -->
:::video{youtube=VIDEO_ID}
```

### 📊 Diagrams

| Language | Description |
|:---------|:------------|
| ````mermaid` | Mermaid flowcharts/sequence/gantt etc., light/dark theme support |
| ````markmap` | Markmap mind maps, collapsible/zoomable |
| ````plantuml` | PlantUML diagrams, dual light/dark theme rendering |

### 🔢 Math Formulas

```markdown
Inline: $E = mc^2$

Block:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 💻 Enhanced Code Blocks

Powered by [Expressive Code](https://expressive-code.com/):

```markdown
```js {1,3-5} title="example.js" ins={2} del={4} mark={6}
// Line highlight, insert, delete, mark
```
```

- Line numbers, collapsible sections
- Language badge, custom copy button
- `frame="terminal"` / `frame="code"` frame modes

### 🔗 GitHub Card

```markdown
::github{repo="owner/repo"}
```

### 🖼️ Image Enhancements

- **Width control**: `![Image w-50%](image.png)` — set image width percentage
- **Lazy loading**: All images lazy-loaded with blur transition
- **Gallery**: PhotoSwipe integration, click to view fullscreen

### 📋 Other

- **Table wrapping**: Wide tables auto-scroll horizontally
- **External links**: Auto `target="_blank"` and `rel="nofollow noopener noreferrer"`
- **Relative link resolution**: `./other-post.md` resolves to correct URLs
- **Reading time**: Auto-calculated, CJK-optimized (400 chars/min)
- **Excerpt split**: `<!-- more -->` for manual excerpt control

## 🧞 Commands

| Command | Action |
|:--------|:-------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally |
| `pnpm check` | Run Astro error checking |
| `pnpm format` | Format with Prettier |
| `pnpm lint` | Lint and fix with ESLint |
| `pnpm new-post <filename>` | Create a new post |

## 🙏 Acknowledgements

### Tech Stack
- [Astro](https://astro.build) · [Tailwind CSS](https://tailwindcss.com) · [Svelte](https://svelte.dev) · [Swup](https://swup.js.org/) · [Pagefind](https://pagefind.app/) · [Iconify](https://iconify.design/)

### Inspired By
- [Fuwari](https://github.com/saicaca/fuwari) — The original template this project is based on, by saicaca
- [Mizuki](https://github.com/LyraVoid/Mizuki) — Tsukimi is built on top of Mizuki, by LyraVoid
- [Yukina](https://github.com/WhitePaper233/yukina) — Elegant blog template that provided design inspiration
- [Firefly](https://github.com/CuteLeaf/Firefly) — Dual sidebar layout, article grid design ideas
- [Twilight](https://github.com/spr-aachen/Twilight) — Dynamic wallpaper switching, responsive design, and transition effects

### Other
- [Pio](https://github.com/Dreamer-Paul/Pio) — Live2D mascot plugin

## 📄 License

[Apache License 2.0](LICENSE) | [MIT License (Original)](LICENSE.MIT)

Copyright (c) 2023 saicaca (Fuwari) · Copyright (c) 2024-2026 LyraVoid (Mizuki)

## 🍀 Contributors

<a href="https://github.com/souloss/Tsukimi/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=souloss/Tsukimi" />
</a>

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=souloss/Tsukimi&type=Date)](https://star-history.com/#souloss/Tsukimi&Date)
