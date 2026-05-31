# 🌸 Tsukimi

> A modern, feature-rich static blog template built with [Astro](https://astro.build), featuring advanced functionality and beautiful design.

[![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.3.0-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌏 **Language:** [**English**](./README.en.md) / [**中文**](./README.md)

[**🖥️ Live Demo**](https://blog.souloss.cn/) | [**📝 Documentation**](https://tsukimi.souloss.cn/docs/tsukimi/) | [**📦 Content Repo**](https://github.com/souloss/Tsukimi-Content)

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

Edit `src/config.ts` to customize your blog settings, including site info, theme colors, banner images, and social links.

### Start Development Server

```bash
pnpm dev
```

Your blog will be available at `http://localhost:4321`.

### Deployment

Supports Vercel, Netlify, GitHub Pages, Cloudflare Pages, and more. Update `siteURL` in `src/config.ts` before deploying.

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
comment: true
lang: en      # Only set when article language differs from site default
---
```

| Field | Description |
|:------|:------------|
| `title` | Post title (required) |
| `published` | Publication date (required) |
| `description` | Post description for SEO and previews |
| `image` | Cover image path (relative to post file) |
| `tags` | Array of tags |
| `category` | Post category |
| `draft` | Set to `true` to hide in production |
| `pinned` | Set to `true` to pin to top |
| `comment` | Set to `true` to enable comments |
| `lang` | Post language (only when different from site default) |

## 🧩 Markdown Extensions

- **Callouts:** `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, etc.
- **Math formulas:** `$inline$` and `$$block$$` syntax, KaTeX rendering
- **Code highlighting:** Powered by [Expressive Code](https://expressive-code.com/) with line numbers and copy button
- **GitHub cards:** `::github{repo="user/repo"}`
- **Image gallery:** PhotoSwipe integration
- **Collapsible sections:** `:::collapse` directive

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
