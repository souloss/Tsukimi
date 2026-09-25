---
title: 文档系统
createTime: 2026/09/25
permalink: /other/docs-system/
order: 7
icon: ri:book-open-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 文档系统

Tsukimi 内置一个基于 Astro content collection 的文档系统。文档文件放在 src/content/docs/ 下，路由由 pages/docs/[...slug].astro 生成，侧栏和上一页/下一页链接根据目录自动计算。

## 项目结构

```text
src/content/docs/
└── tsukimi/
    ├── _index.md                # 项目首页配置（isHomepage: true）
    ├── guide/
    │   ├── _index.md            # 目录节点，不单独渲染
    │   └── get-started.md
    ├── Basic-Layout/
    ├── Article-layout/
    ├── Feature/
    ├── Sidepanel/
    ├── press/
    ├── special/
    ├── transfer/
    ├── problem/
    ├── API/
    └── Other/
```

当前 Tsukimi 文档共 137 个 Markdown/MDX 条目：19 个索引/目录节点和 118 个专题页面。新增目录时添加 _index.md 并设置 order，侧栏会自动出现。

## 首页

项目根 _index.md 不作为普通文章渲染。它的 frontmatter 由 DocsHome.astro 读取：

| 字段 | 作用 |
| --- | --- |
| title | 项目名称。 |
| tagline | 首页眉题。 |
| description | 首页说明和 meta description。 |
| image | 首页装饰图。 |
| actions | 首页按钮数组，包含 theme、text、link。 |
| features | 首页能力卡片数组，包含 title、icon、details。 |
| isHomepage | 必须为 true 才会生成项目首页。 |

## 页面 frontmatter

普通页面可使用以下字段；均由 src/content.config.ts 的 docs schema 校验：

```yaml
---
title: 页面标题
createTime: 2026/09/25
permalink: /guide/example/
order: 3
icon: material-symbols:article-outline-rounded
description: 页面摘要
docSlug: tsukimi
lang: zh_CN
collapsed: true
badge:
  type: info
  text: 新
---
```

- title、description、createTime 控制标题、摘要和页面元信息。
- permalink 是相对于 /docs/<docSlug>/ 的自定义路径，例如 /guide/example/；省略时按文件路径生成。
- order 仅影响同级目录排序，数值越小越靠前。
- icon 使用 Iconify 名称；未知名称会回退到通用图标。
- collapsed 控制目录节点默认是否展开，当前页面所在目录仍会自动展开。
- docSlug 默认取文件路径的第一级目录；只有维护多个文档项目时才需要显式设置。
- lang 用于同一路径的多语言页面；未提供翻译时会回退到默认语言。

版权信息可以保留为任意 YAML 值，主题只把它作为页面元数据传递；不要把 posts 集合的 published/tags 等字段复制到 docs 页面。

## 自动侧栏和链接

侧栏由 src/utils/docs-utils.ts 扫描 docs collection 后构建：

1. 读取项目目录中所有 Markdown/MDX 文件。
2. 识别每级目录的 _index.md，使用其 title、icon、order、collapsed 作为节点配置。
3. 按 order 对同级页面和目录排序；普通文件使用 title、permalink 或文件路径生成 URL。
4. 标记当前页面，并据此生成面包屑、上一页/下一页链接。

因此不需要维护 src/data/docs-tsukimi.ts，也不要手写侧栏 ID。新页面只要放在正确目录并通过 frontmatter 指定 order 即可。链接建议使用完整路径，例如 /docs/tsukimi/guide/get-started/。

## 多语言

为同一页面增加语言版本时，使用 lang 字段并保持相同的相对文件路径或 permalink。默认语言由项目页面数量统计得出；未找到当前语言页面时，路由会显示默认语言内容并提示回退。

## Markdown 与搜索

文档页面和文章共用 Markdown pipeline，包括提示框、代码组、代码折叠、相对链接、Mermaid、PlantUML、Markmap、Vega-Lite、图片和媒体指令。新写法应以当前插件和 Markdown 扩展文档为准。

生产构建会执行 Pagefind 索引。运行 pnpm build 后，文档搜索按 docSlug:tsukimi 过滤到当前项目；pnpm dev 中没有完整的 Pagefind 索引，搜索验证请使用 pnpm preview。

## 添加页面

1. 在 src/content/docs/tsukimi/<section>/ 下创建 .md 或 .mdx。
2. 写入 title、order，必要时设置 permalink、icon、description 和 badge。
3. 如果是新目录，创建 _index.md；它只负责目录节点，不写普通文章正文。
4. 运行 pnpm check 检查 frontmatter 和 Markdown。
5. 运行 pnpm build && pnpm preview 检查链接、代码块和 Pagefind。

文档属于主题源码的一部分；需要与个人内容一起管理时，可将文档保留在代码仓库，不要通过内容同步脚本覆盖 src/content/docs/。
