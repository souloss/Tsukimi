# 🌸 Tsukimi

> 一个现代化、功能丰富的静态博客模板，基于 [Astro](https://astro.build) 构建，具有先进的功能和精美的设计。

[![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.3.0-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌏 **语言：** [**中文**](./README.md) / [**English**](./README.en.md)

[**🖥️ 在线预览**](https://blog.souloss.cn/) | [**📝 文档**](https://tsukimi.souloss.cn/docs/tsukimi/) | [**📦 内容仓库**](https://github.com/souloss/Tsukimi-Content)

## ✨ 功能特性

### 🎨 设计与界面
- ⚡ 基于 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建，加载极快
- 🎭 明暗主题切换，支持系统偏好检测与动态主题色
- 🖼️ 全屏背景图片，支持轮播、透明度和模糊效果
- 📱 全设备响应式设计，自动分辨率适配
- 🎬 流畅的页面过渡动画（[Swup](https://swup.js.org/)）

### 🔍 内容与搜索
- 🔎 基于 [Pagefind](https://pagefind.app/) 的搜索，支持高亮与键盘导航
- 📝 [增强 Markdown](#-markdown-扩展语法)，支持数学公式、代码高亮、GitHub 卡片等
- 📑 交互式目录，支持自动滚动
- 📡 RSS / Atom 订阅
- ⏱️ 阅读时间估算

### 📱 特色页面
- 🎌 **追番页面** — 追踪动画观看进度和评分
- 🤝 **友链页面** — 精美卡片展示朋友网站
- 📔 **日记页面** — 分享生活瞬间
- 📦 **归档 / 关于 / 相册 / 项目 / 技能 / 时间线 / 设备** 等页面

### 🛠 技术特性
- 💬 评论系统（Twikoo / Giscus / Waline）
- 🔐 文章加密支持
- 🎵 音乐播放器
- 🐱 Live2D 看板娘
- 🌸 樱花特效
- 📊 SEO 优化、站点地图、OG 图片

> 📖 完整配置说明请参考 [Tsukimi 文档](https://tsukimi.souloss.cn/docs/tsukimi/)

## 🚀 快速开始

### 环境要求

- Node.js >= 22
- pnpm >= 9

### 安装

```bash
git clone https://github.com/souloss/Tsukimi.git
cd Tsukimi
pnpm install
```

### 配置

编辑 `src/config.ts` 自定义博客设置，包括站点信息、主题色彩、横幅图片、社交链接等。

### 启动开发服务器

```bash
pnpm dev
```

博客将在 `http://localhost:4321` 可用。

### 部署

支持 Vercel、Netlify、GitHub Pages、Cloudflare Pages 等平台。部署前请更新 `src/config.ts` 中的 `siteURL`。

环境变量配置参照 `.env.example`。不建议将 `.env` 文件提交到 Git。

## 📦 代码内容分离（可选）

Tsukimi 支持将代码和内容分为两个独立仓库，适合团队协作和私有内容管理。

```bash
# 启用内容分离模式
cp .env.example .env
# 编辑 .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Tsukimi-Content.git

# 同步内容
pnpm run sync-content
```

> 📖 详细配置参考 [内容分离指南](https://tsukimi.souloss.cn/docs/tsukimi/)

## 📝 文章 Frontmatter

```yaml
---
title: 文章标题
published: 2024-01-01
description: 文章描述
image: ./cover.jpg
tags: [标签1, 标签2]
category: 分类
draft: false
pinned: false
comment: true
lang: zh-CN      # 仅当文章语言与站点默认不同时设置
---
```

| 字段 | 说明 |
|:-----|:-----|
| `title` | 文章标题（必需） |
| `published` | 发布日期（必需） |
| `description` | 文章描述，用于 SEO 和预览 |
| `image` | 封面图片路径（相对于文章文件） |
| `tags` | 标签数组 |
| `category` | 文章分类 |
| `draft` | 设为 `true` 在生产环境隐藏 |
| `pinned` | 设为 `true` 置顶文章 |
| `comment` | 设为 `true` 启用评论区 |
| `lang` | 文章语言（仅与站点默认不同时设置） |

## 🧩 Markdown 扩展语法

- **提示框：** `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]` 等
- **数学公式：** `$inline$` 和 `$$block$$` 语法，KaTeX 渲染
- **代码高亮：** 基于 [Expressive Code](https://expressive-code.com/)，支持行号和复制按钮
- **GitHub 卡片：** `::github{repo="user/repo"}`
- **图片画廊：** PhotoSwipe 集成
- **可折叠区域：** `:::collapse` 指令

## 🧞 指令

| 命令 | 说明 |
|:-----|:-----|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器 `localhost:4321` |
| `pnpm build` | 构建生产站点到 `./dist/` |
| `pnpm preview` | 本地预览构建结果 |
| `pnpm check` | Astro 错误检查 |
| `pnpm format` | Prettier 格式化 |
| `pnpm lint` | ESLint 检查与修复 |
| `pnpm new-post <filename>` | 创建新文章 |

## 🙏 致谢

### 技术栈
- [Astro](https://astro.build) · [Tailwind CSS](https://tailwindcss.com) · [Svelte](https://svelte.dev) · [Swup](https://swup.js.org/) · [Pagefind](https://pagefind.app/) · [Iconify](https://iconify.design/)

### 灵感项目
- [Fuwari](https://github.com/saicaca/fuwari) — 本项目的原始模板，by saicaca
- [Mizuki](https://github.com/LyraVoid/Mizuki) — Tsukimi 基于 Mizuki 开发，by LyraVoid
- [Yukina](https://github.com/WhitePaper233/yukina) — 优雅的博客模板，提供了设计灵感
- [Firefly](https://github.com/CuteLeaf/Firefly) — 双侧边栏布局、文章双列网格等设计思路
- [Twilight](https://github.com/spr-aachen/Twilight) — 动态壁纸切换、响应式设计与过渡效果

### 其他
- [Pio](https://github.com/Dreamer-Paul/Pio) — Live2D 看板娘插件

## 📄 许可证

[Apache License 2.0](LICENSE) | [MIT License (Original)](LICENSE.MIT)

Copyright (c) 2023 saicaca (Fuwari) · Copyright (c) 2024-2026 LyraVoid (Mizuki)

## 🍀 贡献者

<a href="https://github.com/souloss/Tsukimi/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=souloss/Tsukimi" />
</a>

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=souloss/Tsukimi&type=Date)](https://star-history.com/#souloss/Tsukimi&Date)
