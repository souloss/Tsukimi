---
title: 构建脚本配置
createTime: 2026/05/20 12:00:00
permalink: /other/build-scripts/
order: 12
icon: ri:terminal-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 构建脚本配置

Tsukimi 提供多个构建脚本用于自动化部署流程，位于 `scripts/` 目录中。

## 构建流程

完整的构建流程（`pnpm build`）运行 Astro 静态构建、生成 Pagefind 搜索索引并压缩字体。番剧、朋友圈等数据更新脚本需按需单独运行；`prebuild` 会同步内容仓库并更新朋友圈数据。

脚本入口定义在根目录 `package.json` 中，构建辅助脚本位于 `scripts/`。

## 字体压缩脚本

```bash
pnpm build  # compress-fonts 作为构建流程的一部分自动执行
```

脚本文件：`scripts/compress-fonts/index.js`

### 功能

- 读取 `src/config/fontConfig.ts` 中的字体配置，发现所有 `localFonts` 数组
- 根据是否具有 `cjkFontFamily` 将字体分类为 ASCII 字体和 CJK 字体
- 收集项目中所有使用到的文字字符（数据文件、配置、i18n、文章内容、音乐播放列表、番剧数据等）
- 使用 `subset-font` 对 TTF/OTF 字体进行子集化，仅保留需要的字符，并直接输出 WOFF2
- 将字体转换为 WOFF2 格式输出到 `dist/assets/font/`
- 跳过已经是 WOFF/WOFF2 格式的文件（直接复制）
- 更新 `dist/` 中的 CSS `@font-face` 引用，指向压缩后的 WOFF2 文件

## IndexNow 提交脚本

```bash
node scripts/indexnow-submit.js
```

脚本文件：`scripts/indexnow-submit.js`

### 功能

IndexNow 是一个协议，允许网站所有者即时通知搜索引擎内容更新。该脚本：

1. 读取 `dist/sitemap-0.xml` 中的所有 URL
2. 过滤匹配配置域名的 URL
3. 通过 IndexNow API 批量提交给搜索引擎（每批最多 10,000 个 URL）

### 环境变量

IndexNow 脚本通过环境变量配置，不使用 `siteConfig`：

```bash
INDEXNOW_KEY=your-indexnow-key    # IndexNow API 密钥
INDEXNOW_HOST=yourdomain.com      # 网站域名
```

### 支持的搜索引擎

- Bing (`https://www.bing.com/indexnow`)
- Yandex (`https://yandex.com/indexnow`)
- IndexNow 统一接口 (`https://api.indexnow.org`)

## robots.txt 生成

Tsukimi 在构建时自动生成 `robots.txt` 文件，由 `src/pages/robots.txt.ts` 生成：

```
User-agent: *
Disallow: /
Allow: /$
Allow: /posts/

Sitemap: https://yourdomain.com/sitemap-index.xml
```

默认配置较为严格，仅允许搜索引擎爬取首页和文章页面。Sitemap 地址基于 `SITE` 环境变量自动生成。

## 内容同步脚本

```bash
pnpm sync-content
```

脚本文件：`scripts/sync-content.js`

### 功能

从外部内容仓库同步文章内容，适用于多仓库协作场景。

### 环境变量

```bash
ENABLE_CONTENT_SYNC=true    # 启用内容同步
CONTENT_REPO_URL=...        # 外部内容仓库地址
```

## 新文章脚手架

```bash
pnpm new-post <filename>
```

脚本文件：`scripts/new-post.js`

### 功能

在 `src/content/posts/` 目录下创建新的 Markdown 文件，自动填充 frontmatter 模板：

```yaml
---
title: <filename>
published: <当前日期>
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
```

## 番剧数据更新

```bash
pnpm update-anime
pnpm update-bangumi
pnpm update-bilibili
```

脚本文件：`scripts/update-anime.mjs`、`scripts/update-bangumi.mjs`、`scripts/update-bilibili.mjs`

### 功能

- 从 Bangumi API 获取番剧数据
- 从 Bilibili API 获取追番数据
- 生成 `src/data/anime.ts` 数据文件
- 需要配置对应的 API 密钥和用户 ID

## 其他脚本

| 脚本 | 说明 |
|------|------|
| `convert-images.js` | 手动将指定的 `public/` PNG/JPEG 图片转换为 WebP（质量 85）；不会随 `pnpm build` 自动执行。 |
| `init-content-repo.js` | 初始化内容仓库 |
| `load-env.js` | 环境变量加载工具 |
| `update-feeds.mjs` | 朋友圈 RSS 订阅更新 |
| `benchmark-bugs.mjs` | 性能基准测试 |
| `check-content.mjs` | 检查文章内容 |
| `check-config.mjs` | 检查配置 |
| `check-docs-render.mjs` | 检查文档渲染 |
| `check-images.mjs` / `check-fonts.mjs` | 检查图片和字体资源 |

运行 `node scripts/convert-images.js` 可执行图片转换。脚本只匹配 `public/assets/home/` 下的 PNG/JPG、`public/sakura.png`、`public/images/albums/` 下的 JPG/JPEG、`public/images/diary/` 下的 JPG、`public/images/device/` 下的 PNG，以及 `public/assets/music/cover/` 下的 JPG；每张图片旁写出同名 `.webp` 文件，原图保留。已有 WebP 文件比源文件更新时会跳过。脚本不会处理其他目录、远程图片或 `.webp` 以外的输出格式，也不会修改 Markdown/MDX 中的引用。完整步骤见[手动图片转换](/docs/tsukimi/basic-layout/image-optimization/)。
