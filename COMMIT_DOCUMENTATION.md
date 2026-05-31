# Commit History Documentation Summary

This document summarizes all significant changes from commit `ff15935` up to `2620eb2` that require documentation.

## Summary of Changes by Category

### 🎉 New Features

1. **Talking (Moments), Guestbook, and Sponsor Pages** (67ac05b)
   - Added `src/components/features/talking/` with MomentCard component
   - New pages: `guestbook.astro`, `sponsor.astro`
   - Documentation: `src/content/docs/tsukimi/special/talking.md`

2. **Docs Layout System** (6205f4c)
   - New documentation layout with sidebar, breadcrumb, TOC, and theming
   - Added comprehensive docs in `src/content/docs/`

3. **OG Image Fallback** (71c0f14)
   - Support using post cover or banner for OG images when `generateOgImages` is disabled

4. **Memos API Integration for Diary** (1d37d64)
   - Diary module now dynamically fetches data from Memos API

5. **Encrypted Post Improvements** (6dea652)
   - Hidden encrypted post summaries across all views
   - Added test suite: `tests/post-card-content.test.ts`

6. **New Remark/Rehype Plugins** (406998c)
   - `rehype-lazy-image.mjs` - Lazy image loading
   - `remark-relative-links.mjs` - Relative link handling

7. **New Utility Functions** (109c787)
   - Lazy image and livephoto handlers
   - Copyright utilities
   - Series navigation utilities

8. **Update Feeds Script** (fca075d)
   - New `scripts/update-feeds.mjs` for generating RSS/Atom feeds
   - Added `fast-xml-parser` dependency

### 🔧 Configuration Changes

1. **Config Modularization** (c8d5525)
   - Split `src/config.ts` into multiple modules:
     - `backgroundWallpaper.ts`, `effectsConfig.ts`, `fontConfig.ts`
     - `friendsConfig.ts`, `sponsorConfig.ts`
   - Updated `src/types/config.ts` for type safety
   - Enhanced `src/utils/setting-utils.ts`

2. **Config Cleanup** (680a230, fe3810d)
   - Removed deprecated `timeZone` config
   - Cleaned up deprecated configuration across the codebase

3. **Site Configuration Updates** (54554a8, 2d315c1)
   - Updated Astro config, content schema, and types
   - Multiple i18n and layout updates

### 📁 New Files and Content

1. **New Content** (d6ff8cd)
   - Blog posts: `how-llms-work` series, LLM quant series
   - Repost content: Multiple HTML reposts
   - Updated data files: friends circle, talking data

2. **New Documentation** (6205f4c, 202e8db)
   - Comprehensive docs system in `src/content/docs/`
   - Project `CLAUDE.md` file

3. **New Utilities** (109c787, 406998c)
   - Lazy image, livephoto, copyright, and series utilities
   - Additional plugin support

### 🎨 UI and Style Updates

1. **Component Overhauls** (969e8c6, bedd110)
   - New DisplaySettings and WallpaperSwitch components
   - Updated ThemeSwitch, LayoutSwitch, and navigation components
   - New FriendsCircle, Reward, SeriesNav, and RepostNotice components

2. **Style Updates** (4bd1f8f, 969e8c6)
   - New CSS for lazy images, livephotos, relative colors
   - Updated banner, navbar, and markdown styling

### 🌐 Internationalization

1. **Translation Updates** (0c34038, 2d315c1)
   - New translation keys added for all languages
   - Replaced hardcoded strings with i18n keys (encrypted posts)
   - Updated scanToRead labels for Astro 6.3.0

### 🐛 Bug Fixes

1. **Music Player Fix** (8bfe8f1)
   - Fixed music player showing when disabled in config

2. **OG Image Fixes** (0938044)
   - Added missing twitter:image meta tag
   - Added OG image width and height attributes

3. **Diary Time Fix** (9b9db61)
   - Use local time for relative timestamps in diary

4. **Dependency and CI Improvements** (680a230, 5d06b0b)
   - Updated all dependencies
   - Strengthened CI workflow

### 🗑️ Removals

1. **Diary Feature Removal** (c1ed3c0)
   - Removed entire diary feature from the codebase

2. **Outdated Documentation** (693c7a4)
   - Removed outdated docs in `src/content/docs/tsukimi-en/`

3. **Submodule Removal** (2620eb2)
   - Removed vhAstro-Theme submodule

## Detailed Commit Breakdown

For full file changes per commit, run:
```bash
git show <commit-hash>
```

| Commit Hash | Subject | Key Changes |
|-------------|---------|-------------|
| 2620eb2 | update gitignore | Removed vhAstro-Theme submodule |
| 2d315c1 | update i18n, data files, plugins, and scripts | Multiple i18n, component, and plugin updates |
| 969e8c6 | update UI components and styles | New settings components, style overhauls |
| 67ac05b | add talking (moments), guestbook, and sponsor pages | New feature pages and components |
| c8d5525 | split config into separate modules | Config modularization |
| c1ed3c0 | remove diary feature | Diary feature removal |
| fca075d | add update-feeds script | New feed generation script |
| 202e8db | add project docs and theme folder | Initial CLAUDE.md and theme |
| d6ff8cd | add new content and data | New blog posts and reposts |
| 406998c | add remark/rehype plugins | New plugins for images and links |
| 109c787 | update utils and scripts | New utility functions |
| 4bd1f8f | update stylesheets | CSS style updates |
| c235f19 | update pages and layouts | New archive, series, and repost pages |
| 0c34038 | update translations | New i18n keys |
| bedd110 | update components | Component refactors |
| 54554a8 | update config files | Config and schema updates |
| 693c7a4 | remove outdated documentation | Cleaned up old docs |
| 573ec09 | fix docs hydration errors | Docs layout improvements |
| 6205f4c | add docs layout system | Full docs system implementation |
| c4177a1 | add benchmark script | New validation benchmark |
| f511780 | replace encrypted post message with i18n | i18n improvement for encrypted posts |
| 6dea652 | hide encrypted post summaries | Security and privacy improvement |
| fe3810d | remove timeZone config | Config cleanup |
| 9b9db61 | fix diary timestamps | Local time format fix |
| 680a230 | clean up deprecated config | CI and config improvements |
| 1d37d64 | diary module接入 Memos API | Memos API integration |
| e767bbf | upgrade Astro to 6.3.0 | Astro version upgrade |
| 8bfe8f1 | fix musicPlayerConfig显示问题 | Music player visibility fix |
| 5d06b0b | update dependencies | Dependency updates |
| e98a6ea | refine zh-TW documentation | Translation wording updates |
| 71c0f14 | support OG image fallback | OG image improvements |
| 0938044 | fix missing twitter:image | Meta tag fixes |

## Documentation Priority Items

1. **High Priority**
   - Config modularization system
   - New docs layout system
   - Talking/guestbook/sponsor pages
   - Memos API integration for diary

2. **Medium Priority**
   - New plugins and utilities
   - Internationalization updates
   - UI component changes

3. **Low Priority**
   - Dependency and version updates
   - Minor bug fixes
   - Documentation cleanup

## Notes

- Always refer to the official [Astro 6.3.0 documentation](https://docs.astro.build/en/guides/integrations-guide/) for framework-specific changes
- For i18n updates, check `src/i18n/languages/` for all language files
- All new configuration files live in `src/config/`
- The new docs system is located in `src/content/docs/tsukimi/`
