# Tsukimi

> 一个以内容为中心的静态博客主题：保留 Astro 的低客户端开销，同时提供完整的写作、展示和个性化配置能力。

[![Node.js >= 22.12](https://img.shields.io/badge/node.js-%3E%3D22.12-brightgreen)](https://nodejs.org/)
[![pnpm 10](https://img.shields.io/badge/pnpm-10-blue)](https://pnpm.io/)
[![Astro 7](https://img.shields.io/badge/Astro-7-orange)](https://astro.build/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-ff3e00)](https://svelte.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](LICENSE)

语言：[中文](./README.md) / [English](./README.en.md)

[在线预览](https://tsukimi.souloss.cn/) · [在线文档](https://tsukimi.souloss.cn/docs/tsukimi/) · [GitHub](https://github.com/souloss/Tsukimi) · [内容仓库模板](https://github.com/souloss/Tsukimi-Content-Template)

## 主题定位

Tsukimi 是一个基于 Astro 的静态博客主题，适合技术文章、生活记录、系列教程、知识库和个人主页。它将文章、特殊页面和主题代码分开组织；默认内容可以直接运行，也可以把个人内容与配置放到独立仓库中。构建结果是可部署到静态托管平台的 dist/ 目录，不依赖运行时服务器。

项目面向两类使用者：

- 想直接写作和发布的用户：修改内容与少量配置即可开始。
- 想持续扩展的开发者：可以使用 Astro/Svelte 组件、Markdown 插件、配置类型和检查脚本，按现有架构添加功能。

## 能力概览

### 写作与阅读

- Markdown 和 MDX 内容集合，支持文章草稿、置顶、标签、分类、系列、转载、别名和自定义永久链接。
- Pagefind 全文搜索；文章目录、阅读时间、相关文章和随机文章。
- RSS 与 Atom feed、sitemap、Open Graph 元信息和可选 OG 图片生成。
- 客户端文章加密、密码提示和内容摘要隐藏。它适合控制页面访问，不等同于服务端密钥管理或机密存储。
- 响应式文章列表，可切换列表/网格布局；宽表格、图片懒加载、图片尺寸处理和图片格式优化。

### Markdown 扩展

在普通 .md 文件中即可使用扩展语法，无需在文章里导入组件：

- 提示框、折叠块、标签页、时间线、网格、卡片、画廊、视频和对话等容器指令。
- 行内标记、键盘按键、模糊/密码遮罩、颜色、徽标、缩写和注释。
- Mermaid、Markmap、PlantUML、Vega/Vega-Lite、WaveDrom 和 Bytefield 等图表或图形代码块。
- KaTeX 数学公式、GitHub 仓库卡片、相对链接、外部文件嵌入。
- Expressive Code 代码高亮、行号、行标记、语言徽章、复制按钮和代码块折叠。

完整语法和可复制示例见 [Markdown 指令文档](src/content/docs/tsukimi/press/Markdown/directives.md) 及 src/content/posts/markdown-extended.md。

### 主题与交互

- 浅色/深色主题、系统偏好检测、主题色相和响应式布局。
- Banner、全屏、覆盖层和无壁纸四种背景模式；图片轮播、水波纹、渐变和页面过渡可独立开关。
- 双侧边栏、抽屉式移动端布局、目录、日历、标签、分类、站点统计、公告和个人资料组件。
- Swup 页面过渡与可访问性配置；Svelte 5 用于搜索、设置、音乐播放器等交互组件。
- 可选评论系统：Twikoo、Waline 和 Giscus（具体服务端参数由用户配置）。
- 可选本地/外部音乐播放器、Live2D Pio 看板娘、樱花效果和分享海报。

### 特色页面

站点默认包含以下页面，均可通过 siteConfig.featurePages 控制对应特色路由：

| 页面 | 路由 | 用途 |
| --- | --- | --- |
| 番剧 | /anime/ | 使用本地数据、Bangumi 或 Bilibili 数据展示追番信息 |
| 动态 | /talking/ | 展示说说/动态，可接入 Memos API |
| 友链 | /friends/ | 友链卡片和可选的朋友圈动态 |
| 项目 / 技能 | /projects/ · /skills/ | 展示项目和技能数据 |
| 时间线 / 设备 | /timeline/ · /devices/ | 记录经历和设备清单 |
| 相册 | /albums/ | 本地或外链图片相册及详情页 |
| 系列 / 转载 | /series/ · /reposts/ | 组织系列文章和转载内容 |
| 留言板 / 赞助 | /guestbook/ · /sponsor/ | 互动留言和赞助说明 |
| 知识图谱 | /knowledge-graph/ | 以图形方式浏览文章关系 |

此外还有首页、归档、标签、分类、关于、RSS/Atom 和内置文档页面。禁用特色页面时，应同步移除导航栏中对应链接；pnpm check-config 可检查相关配置一致性。

## 技术栈

- [Astro 7](https://astro.build/) 静态输出（output: "static"）
- [Svelte 5](https://svelte.dev/) 交互组件
- [Tailwind CSS 4](https://tailwindcss.com/) 与 Stylus 样式
- TypeScript、Astro Content Collections、Markdown/MDX
- Swup 页面过渡、Pagefind 搜索、Expressive Code 代码块
- remark/rehype 插件、KaTeX、Mermaid、Markmap、PlantUML、Vega-Lite 等内容渲染能力

依赖版本以 [package.json](./package.json) 和锁文件为准；README 不替代框架或第三方服务的官方文档。

## 快速开始

### 环境要求

- Node.js >=22.12.0
- pnpm >=10.33.0 <11
- Git

### 安装与开发

~~~bash
git clone https://github.com/souloss/Tsukimi.git
cd Tsukimi
pnpm install
pnpm dev
~~~

开发服务器默认地址为 http://localhost:4321/。predev 会生成本地 Svelte 图标，并按环境变量决定是否同步独立内容仓库。

### 第一次配置

1. 从 src/config/index.ts 了解统一配置出口，再按职责编辑 src/config/ 下的文件。
2. 在 src/config/siteConfig.ts 设置站点标题、语言、siteURL、特色页面和首页行为。
3. 在 src/config/navBarConfig.ts 调整导航；在 src/config/profileConfig.ts 设置头像、简介和社交链接。
4. 按需配置 backgroundWallpaper.ts、commentConfig.ts、musicConfig.ts、sidebarConfig.ts、pioConfig.ts、effectsConfig.ts、字体和许可证等模块。
5. 需要环境变量时，复制 [.env.example](./.env.example) 为 .env。不要提交包含令牌、私有仓库地址或第三方服务密钥的 .env。

配置模块通过 withOverride 支持 src/overrides/<configName>.ts 的深度合并覆盖。该目录通常由内容同步产生并被忽略；没有覆盖文件时使用代码仓库内的默认配置。

## 内容组织与文章格式

### 目录

| 目录 | 内容 |
| --- | --- |
| src/content/posts/ | 博客文章（.md / .mdx），支持单文件或带资源的目录文章 |
| src/content/spec/ | 关于、友链等特殊页面内容 |
| src/content/docs/ | 主题文档内容，渲染到 /docs/tsukimi/ |
| src/data/ | 番剧、项目、技能、时间线、友链等页面数据 |
| public/images/、src/assets/ | 公共图片和主题资源 |

创建文章：

~~~bash
pnpm new-post my-first-post
~~~

文章至少需要 title 和 published 两个字段。常用 Frontmatter 如下：

~~~yaml
---
title: 文章标题
published: 2026-01-01
description: 用于 SEO、卡片和 feed 的摘要
tags: [Astro, Tsukimi]
category: 技术
draft: false
pinned: false
updated: 2026-01-02
image: ./cover.webp
series: 系列名称
seriesOrder: 1
comment: true
lang: zh_CN
slug: custom-slug
permalink: /custom/path/
alias: /old/path/
math:
  inline: false
  display: false
encrypted: false
password: ""
passwordHint: ""
hideHomeContent: false
redirect: ""
sourceLink: ""
licenseName: ""
licenseUrl: ""
repost:
  originalAuthor: 原作者
  originalUrl: https://example.com/post
copyright: CC BY-NC-SA
---
~~~

字段以 [src/content.config.ts](./src/content.config.ts) 的 schema 为准。draft: true 的文章在生产构建中不会作为公开文章发布；permalink 优先于 alias 和 slug；series 与 seriesOrder 用于系列导航。copyright 可使用 CC BY、CC BY-SA、CC BY-ND、CC BY-NC、CC BY-NC-SA、CC BY-NC-ND、CC0 或 ARR。

### 代码与内容分离（可选）

默认模式把内容和主题代码放在同一个仓库，直接编辑 src/content/、src/data/ 和资源目录即可。需要私有内容、多人协作或独立版本控制时，可以启用同步模式：

~~~bash
cp .env.example .env
~~~

~~~dotenv
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Tsukimi-Content.git
# 可选，默认是项目根目录下的 ./content
CONTENT_DIR=./content
~~~

然后执行：

~~~bash
pnpm run sync-content
~~~

同步脚本会将独立仓库中的 posts/、spec/、data/、images/ 映射到对应目录，并可处理 overrides/、assets/、public/ 和 wrangler.toml。pnpm dev 与 pnpm build 的生命周期钩子会自动运行同步；私有仓库请使用 SSH 或 CI/CD secret，避免把 Token 写入 URL 并提交到 Git。同步脚本可能替换本地内容目录，首次启用前请备份未提交的修改。

独立内容仓库的推荐结构和迁移步骤见 [内容仓库结构文档](src/content/docs/tsukimi/Other/structure.md)、[内容分离文档](src/content/docs/tsukimi/Other/separation.md) 和 [内容仓库模板](https://github.com/souloss/Tsukimi-Content-Template)。

## 构建、检查与发布

~~~bash
# 生产构建，输出 dist/；同时构建 Pagefind、压缩字体和更新 feed
pnpm build

# 预览已构建的静态站点
pnpm preview

# Astro、TypeScript、测试
pnpm check
pnpm type-check
pnpm test

# 内容、配置和发布门禁
pnpm check-content
pnpm check-config
pnpm check-publish

# 图片、字体、文档渲染和性能检查
pnpm check-images
pnpm check-fonts
pnpm check-docs-render
pnpm perf:baseline
pnpm perf:check

# Biome 格式化与检查（脚本会写回修复结果）
pnpm format
pnpm lint
~~~

pnpm build 需要能访问构建时使用的外部服务（例如启用的内容仓库、PlantUML 或数据更新接口）。不需要刷新远程数据时使用普通 pnpm build；pnpm build:refresh-data 会先刷新 feed 和番剧数据。部署静态站点时使用：

- 构建命令：pnpm build
- 发布目录：dist/

Vercel、Netlify、Cloudflare Pages、GitHub Pages 或自有静态服务器均可使用上述产物；具体平台配置见 [部署文档](src/content/docs/tsukimi/guide/deploy/_index.md)。GitHub Actions 示例位于 [.github/workflows/](./.github/workflows/)。

## 开发者入口

~~~text
src/
├── components/   原子组件、功能组件、布局和侧边栏 widgets
├── config/       站点、导航、布局、功能和第三方服务配置
├── content/      posts、spec、docs 三个内容集合
├── data/         特色页面数据
├── layouts/      Layout 与 MainGridLayout
├── pages/        Astro 文件路由和 feed/API/OG 端点
├── plugins/      remark/rehype、图表和代码块插件
├── styles/       全局变量和主题样式
└── utils/        内容处理、导航、目录、布局和性能工具
~~~

扩展时优先复用 src/components/ 的现有组件和 src/utils/ 工具，保持 atoms → features/widgets → layouts/pages 的分层。新增侧边栏 widget 需要同时更新：

1. src/types/config.ts 的 WidgetComponentType；
2. src/config/（当前配置入口为 src/config/index.ts）的侧边栏布局；
3. src/components/widgets/sidebar/SideBar.astro 与 src/components/layout/RightSideBar.astro 的组件映射。

Markdown 能力应放在 src/plugins/ 并接入 astro.config.mjs；跨页面数据处理放在 src/utils/。修改共享行为后至少运行 pnpm check、pnpm type-check、pnpm test 和相关的 check-* 脚本。组件架构、CSS、图标和侧边栏约束见 [docs/rule/](./docs/rule/)；更完整的主题文档源码在 [src/content/docs/tsukimi/](./src/content/docs/tsukimi/)。

## 贡献

欢迎提交问题、修复和与主题本身相关的功能改进。提交前请：

1. 确认修改没有把个人内容、账号标识、统计 ID、私有 URL 或密钥带入模板。
2. 按现有目录和配置类型组织代码，避免直接复制重复的 UI 逻辑。
3. 运行与改动相关的检查，至少包括 pnpm check 和 pnpm type-check；内容或配置变更同时运行 pnpm check-content / pnpm check-config。
4. 在 Pull Request 中说明行为变化、验证命令和必要的截图或复现步骤。

请先查看 [Issues](https://github.com/souloss/Tsukimi/issues) 中的现有讨论，再提交新的问题或建议。

## 上游与许可证

Tsukimi 延续并扩展了以下项目的代码、设计或实现思路，请保留相应的上游版权和许可证声明：

- [Fuwari](https://github.com/saicaca/fuwari)：早期模板基础。
- [Mizuki](https://github.com/LyraVoid/Mizuki)：Tsukimi 的重要上游实现。
- [Firefly](https://github.com/CuteLeaf/Firefly)：部分双侧栏、布局和交互思路。
- [Pio](https://github.com/Dreamer-Paul/Pio)：Live2D 看板娘插件来源。

仓库提供 [LICENSE](./LICENSE)（Apache License 2.0）和 [LICENSE.MIT](./LICENSE.MIT)（原始模板代码的 MIT 声明）。不同目录、上游代码和第三方依赖可能适用不同许可；分发或修改前请阅读许可证文件及相关版权声明。
