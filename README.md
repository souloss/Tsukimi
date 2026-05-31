# 🌸 Tsukimi

> 一个现代化、功能丰富的静态博客模板，基于 [Astro](https://astro.build) 构建，具有先进的功能和精美的设计。

[![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.3.0-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

🌏 **语言：** [**中文**](./README.md) / [**English**](./README.en.md)

[**🖥️ 在线预览**](https://tsukimi.souloss.cn/) | [**📝 文档**](https://tsukimi.souloss.cn/docs/tsukimi/) | [**📦 内容仓库**](https://github.com/souloss/Tsukimi-Content)

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

编辑 `src/config/` 目录下的配置文件自定义博客设置，包括站点信息、主题色彩、横幅图片、社交链接等。

### 启动开发服务器

```bash
pnpm dev
```

博客将在 `http://localhost:4321` 可用。

### 部署

支持 Vercel、Netlify、GitHub Pages、Cloudflare Pages 等平台。部署前请更新 `src/config/siteConfig.ts` 中的 `siteURL`。

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
priority: 0
comment: true
lang: zh-CN
updated: 2024-06-01
slug: custom-slug
permalink: /custom/path/
alias: /old-path/
series: 系列名称
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

### 基础字段

| 字段 | 类型 | 默认值 | 说明 |
|:-----|:-----|:-------|:-----|
| `title` | `string` | — | 文章标题（必需） |
| `published` | `Date` | — | 发布日期（必需） |
| `description` | `string` | `""` | 文章描述，用于 SEO、预览和 RSS |
| `image` | `string` | `""` | 封面图片路径（相对于文章文件） |
| `tags` | `string[]` | `[]` | 标签数组 |
| `category` | `string` | `""` | 文章分类 |
| `draft` | `boolean` | `false` | 设为 `true` 在生产环境隐藏 |
| `lang` | `string` | `""` | 文章语言（仅与站点默认不同时设置） |
| `updated` | `Date` | — | 更新日期，显示在文章元信息中 |

### 排序与导航

| 字段 | 类型 | 默认值 | 说明 |
|:-----|:-----|:-------|:-----|
| `pinned` | `boolean` | `false` | 设为 `true` 置顶文章 |
| `priority` | `number` | — | 置顶文章间的排序优先级（越小越靠前） |
| `slug` | `string` | — | 自定义 URL slug（仅替换文件名部分） |
| `permalink` | `string` | — | 自定义永久链接（最高优先级，覆盖 slug 和全局配置） |
| `alias` | `string` | — | 别名路径，低于 permalink 优先级 |

### 系列文章

| 字段 | 类型 | 默认值 | 说明 |
|:-----|:-----|:-------|:-----|
| `series` | `string` | — | 系列名称，同系列文章自动显示导航 |
| `seriesOrder` | `number` | `0` | 系列内排序序号（越小越靠前） |

### 评论与版权

| 字段 | 类型 | 默认值 | 说明 |
|:-----|:-----|:-------|:-----|
| `comment` | `boolean` | `true` | 启用 / 禁用评论区 |
| `author` | `string` | `""` | 覆盖作者名（默认使用 profileConfig） |
| `licenseName` | `string` | `""` | 覆盖许可证名称 |
| `licenseUrl` | `string` | `""` | 覆盖许可证链接 |
| `sourceLink` | `string` | `""` | 覆盖文章来源链接 |

### 加密与访问控制

| 字段 | 类型 | 默认值 | 说明 |
|:-----|:-----|:-------|:-----|
| `encrypted` | `boolean` | `false` | 启用文章加密 |
| `password` | `string` | `""` | 加密密码（需同时启用 encrypted） |
| `passwordHint` | `string` | `""` | 密码提示文字 |
| `hideHomeContent` | `boolean` | `false` | 隐藏首页文章摘要 |
| `redirect` | `string` | — | 外部重定向 URL |

### 转载

```yaml
repost:
  originalAuthor: 原作者
  originalUrl: https://example.com/original
  originalTitle: 原文标题
  originalSite: 原站名称
```

`copyright` 支持的值：`CC BY` / `CC BY-SA` / `CC BY-ND` / `CC BY-NC` / `CC BY-NC-SA` / `CC BY-NC-ND` / `CC0` / `ARR`

## 🧩 Markdown 扩展语法

### 📝 文本标记

| 语法 | 效果 | 示例 |
|:-----|:-----|:-----|
| `==文本==` | 高亮标记 | `==重点内容==` |
| `:mark[文本]{color=red}` | 彩色标记 | `:mark[标注]{color=blue}` |
| `:kbd[Ctrl+C]` | 键盘按键 | Ctrl+C 样式 |
| `:blur[隐藏内容]` | 模糊遮罩（点击揭示） | 适合剧透内容 |
| `:psw[密码内容]` | 密码遮罩（点击揭示） | — |
| `:u[下划线]` | 下划线 | `:u[文字]{color=red}` |
| `:emp[强调]` | 彩色强调 | `:emp[文字]{color=blue}` |
| `:wavy[波浪线]` | 波浪下划线 | `:wavy[文字]{color=pink}` |
| `:del[删除线]` | 删除线 | — |
| `:sup[上标]` | 上标 | `:sup[n]{color=red}` |
| `:sub[下标]` | 下标 | `:sub[n]{color=blue}` |
| `:color[文字]{color=red}` | 自定义颜色文字 | 支持 red/orange/yellow/green/blue/purple/pink/cyan/accent 或十六进制 |
| `:hashtag[标签]{href=...}` | 哈希标签（自动轮换颜色） | `:hashtag[前端]{href=/tags/frontend}` |
| `:checkbox[选项]{checked=true}` | 自定义复选框 | `color=` `symbol=` `inline=` |
| `:radio[选项]{checked=true}` | 自定义单选按钮 | `color=` `inline=` |
| `:emoji[smile]{source=qq}` | 外部 Emoji 图片 | source: qq/aru/tieba/blobcat/twemoji |
| `:step-brackets[1]{title=步骤}` | 步骤标记 | — |

### 📦 容器指令

#### 提示框（Callout）

13 种类型：`note` · `info` · `tip` · `warning` · `caution` · `important` · `question` · `quote` · `bug` · `example` · `success` · `failure` · `danger`

```markdown
:::tip[提示标题]{color=blue}
提示内容
:::
```

也支持 GitHub 风格：`> [!NOTE]` / `> [!TIP]` / `> [!WARNING]` 等

#### 折叠区域

```markdown
:::folding[标题]{open=true color=blue}
折叠内容
:::
```

#### 标签页

```markdown
:::tabs{align=center}
tab:选项卡一{color=red}
内容一
tab:选项卡二{color=blue}
内容二
:::
```

#### 时间线

```markdown
:::timeline
- 2024-01 | 事件标题 | 事件描述
- 2024-02 | 事件标题 | 事件描述
:::
```

#### 网格布局

```markdown
:::grid{cols=3 gap=16 minw=240px bg=card}
单元格一
---
单元格二
---
单元格三
:::
```

#### 其他容器

| 指令 | 说明 | 属性 |
|:-----|:-----|:-----|
| `:::poetry{title=... author=...}` | 诗歌排版 | `title` `author` `date` `footer` |
| `:::copy{label=复制内容}` | 一键复制 | `label` |
| `:::blockquote{icon=user}` | 装饰引用 | `icon` |
| `:::quot` | 紧凑引用卡片 | — |
| `:::reel{title=... author=...}` | 卡片容器 | `title` `author` `date` `footer` |
| `:::paper{title=... style=...}` | 文档/信纸排版 | `title` `author` `date` `footer` `style` |
| `:::gallery{cols=3 gap=8}` | 图片画廊（点击放大） | `cols` `gap` |
| `:::folders` | 多层嵌套折叠 | `folder:名称` 分隔 |
| `:::colors{values=#ff0000,#00ff00}` | 色板展示 | `values` |
| `:::asciinema{src=url}` | 终端录制播放 | `src` `cols` `rows` |

### 🃏 卡片指令

```markdown
:::link-card{href=... title=... desc=... image=... icon=...}
:::

:::card{title=... icon=... href=... color=blue}
卡片内容
:::

:::panel
<!-- label: 左侧 | 右侧 -->
代码内容...
:::
```

### 🎬 媒体指令

```markdown
:::video{src=video.mp4 poster=cover.jpg ratio=16/9}
:::

<!-- Bilibili -->
:::video{bilibili=BVxxxxxx}

<!-- YouTube -->
:::video{youtube=VIDEO_ID}
```

### 📊 图表

| 语言 | 说明 |
|:-----|:-----|
| ````mermaid` | Mermaid 流程图/时序图/甘特图等，支持明暗主题 |
| ````markmap` | Markmap 思维导图，支持折叠/缩放 |
| ````plantuml` | PlantUML 图表，支持明暗主题双渲染 |

### 🔢 数学公式

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 💻 代码块增强

基于 [Expressive Code](https://expressive-code.com/)，支持：

```markdown
```js {1,3-5} title="example.js" ins={2} del={4} mark={6}
// 行高亮、插入、删除、标记
```
```

- 行号显示、可折叠区域
- 语言徽章、自定义复制按钮
- `frame="terminal"` / `frame="code"` 框架模式

### 🔗 GitHub 卡片

```markdown
::github{repo="owner/repo"}
```

### 🖼️ 图片增强

- **宽度控制**：`![图片 w-50%](image.png)` — 设置图片宽度百分比
- **懒加载**：所有图片自动懒加载，带模糊过渡
- **画廊**：PhotoSwipe 集成，点击图片全屏查看

### 📋 其他

- **表格自动包裹**：宽表格自动横向滚动
- **外部链接**：自动添加 `target="_blank"` 和 `rel="nofollow noopener noreferrer"`
- **相对链接解析**：`./other-post.md` 自动解析为正确的 URL
- **阅读时间**：自动计算，支持 CJK 优化（400 字/分钟）
- **摘要分割**：`<!-- more -->` 手动控制摘要截断

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
