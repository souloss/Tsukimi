---
title: 主题概览
order: 1
icon: ri:information-line
createTime: 2025/08/17 15:19:06
permalink: /guide/intro/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

Tsukimi 是一个基于 Astro 7、Svelte 5、Tailwind CSS 4 和 TypeScript 的静态博客主题。它适合个人博客，也适合把博客、系列文章和项目文档放在同一个站点中维护。

主题以**静态输出**为默认目标：文章和页面在构建时生成 HTML，搜索索引和 RSS/Atom 也在构建阶段产生；评论、统计、音乐等功能按需连接第三方服务，不要求站点运行自己的后端。

## 能力边界

- **写作**：文章集合位于 `src/content/posts/`，使用 frontmatter 管理标题、日期、标签、分类、系列、转载和加密等元数据。
- **Markdown**：主题接入 Astro Markdown/MDX pipeline，提供提示框、折叠、标签页、代码组、步骤、媒体、数学公式和 Mermaid/PlantUML/Markmap 等图表。
- **主题外观**：浅色/深色模式、主题色、响应式布局、Banner/全屏/叠加层/无壁纸模式、字体与代码主题均可配置。
- **内容页面**：内置归档、分类、标签、系列、转载、知识图谱，以及番剧、相册、项目、技能、设备、时间线、友链、留言板和赞助等可选页面。
- **站点能力**：Pagefind 静态搜索、目录、相关文章与随机文章、分享卡片、RSS/Atom、OG 图片、Twikoo/Waline/Giscus 评论、Umami/Clarity/GTM 统计、音乐播放器和 Pio 看板娘。
- **开发**：配置按功能拆分到 `src/config/*.ts`，内容仓库可以通过 `ENABLE_CONTENT_SYNC=true` 独立同步；自定义配置可放在 `src/overrides/`。

## 阅读路线

1. [安装与启动](/docs/tsukimi/guide/get-started/)：准备 Node.js/pnpm，运行开发服务器并完成首次构建。
2. [站点配置](/docs/tsukimi/basic-layout/site-config/)：先修改站点标题、语言、特色页面和文章列表布局。
3. [配置模块化](/docs/tsukimi/basic-layout/config-modularization/)：了解 `src/config/index.ts`、配置覆盖和类型定义。
4. [文章类型](/docs/tsukimi/press/article-types/) 与 [Markdown 扩展](/docs/tsukimi/press/markdown/)：开始写文章并使用主题提供的内容能力。
5. [部署](/docs/tsukimi/guide/deploy/)：根据目标平台选择 GitHub Pages、Vercel、Netlify、Cloudflare Pages、Docker 或自有服务器。

## 源码与内容

- [Tsukimi 源码](https://github.com/souloss/Tsukimi)：主题、构建脚本和示例站点。
- [Tsukimi Content Template](https://github.com/souloss/Tsukimi-Content-Template)：可选的独立内容仓库模板。
- [Astro 官方文档](https://docs.astro.build/)：了解路由、内容集合、静态构建和集成机制。

主题默认配置只是示例值。部署前请至少修改 `siteConfig.siteURL`、站点标题、个人资料、导航链接和需要启用的第三方服务；不要把真实密钥或私有 Token 提交到公开仓库。
