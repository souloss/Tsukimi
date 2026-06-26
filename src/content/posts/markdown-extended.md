---
title: Markdown 扩展特性
published: 2024-05-01
updated: 2026-06-16
description: 'Tsukimi 支持的 Markdown 扩展语法一览'
image: ''
tags: [Demo, Example, Markdown, Tsukimi]
category: 'Examples'
draft: false 
---

本文档展示 Tsukimi 支持的所有 Markdown 扩展指令。在普通 `.md` 文件中直接使用 `:::` 和 `:` 语法，无需 import，无需 MDX。

---

## GitHub 仓库卡片(::github)

通过 GitHub API 自动拉取仓库信息，生成动态卡片。

效果：

::github{repo="souloss/Tsukimi"}

源码：

`````markdown
::github{repo="用户名/仓库名"}
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `repo` | GitHub 仓库路径，格式 `用户名/仓库名` | ✅ | — |

---

## 提示框(:::note/tip/important/warning/caution)

支持 5 种预设类型，同时兼容 GitHub 语法。

效果：

:::note
即使快速浏览也应注意的信息。
:::

:::tip
帮助用户更高效完成操作的可选信息。
:::

:::important
用户成功完成操作必需的关键信息。
:::

:::warning
存在潜在风险，需立即关注的重要内容。
:::

:::caution
某操作可能导致的负面后果。
:::

源码：

`````markdown
:::note
即使快速浏览也应注意的信息。
:::

:::tip
帮助用户更高效完成操作的可选信息。
:::

:::important
用户成功完成操作必需的关键信息。
:::

:::warning
存在潜在风险，需立即关注的重要内容。
:::

:::caution
某操作可能导致的负面后果。
:::
`````

类型说明：

| 类型 | 用途 |
|------|------|
| `note` | 需要注意的信息 |
| `tip` | 有用的可选建议 |
| `important` | 成功必需的关键信息 |
| `warning` | 潜在风险警告 |
| `caution` | 可能导致负面后果的警告 |

---

## 代码分组(:::code-group)

专用于代码块的选项卡容器，标签自动从代码块语言或 `[标签名]` 派生。

效果：

:::code-group
```js [npm]
npm install
```

```js [yarn]
yarn add
```

```js [pnpm]
pnpm add
```
:::

源码：

`````markdown
:::code-group
```js [npm]
npm install
```

```js [yarn]
yarn add
```

```js [pnpm]
pnpm add
```
:::
`````

参数：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `[标签名]` | 代码块元信息中指定标签名，如 `[pnpm]` | — |
| `:active` | 设置默认激活的代码块 | — |

---

## 字段文档(:::field/:::field-group)

用于 API 或配置项的结构化文档展示。支持 `@type`、`@required`、`@optional`、`@deprecated`、`@default`、`@description` 标签。

### 单个字段

使用 `:::field{名称}` 展示单个字段的类型、约束和描述。

:::field{name}

@type string

@required

@description 资源的唯一标识符

:::

### 字段组

使用 `::::field-group` 将多个字段排列在一起，自动添加分隔线。

::::field-group
:::field{port}

@type number

@default 3000

@description 监听的端口号

:::

:::field{host}

@type string

@default "localhost"

@deprecated

@description 绑定的主机名（请使用 `address` 替代）

:::

:::field{debug}

@type boolean

@optional

@description 启用调试日志

:::
::::

源码：

`````markdown
:::field{name}

@type string

@required

@description 资源的唯一标识符

:::

::::field-group
:::field{port}

@type number

@default 3000

@description 监听的端口号

:::

:::field{host}

@type string

@default "localhost"

@deprecated

@description 绑定的主机名（请使用 `address` 替代）

:::
::::
`````

标签说明：

| 标签 | 说明 |
|------|------|
| `@type` | 字段类型 |
| `@required` | 标记为必填（绿色标签） |
| `@optional` | 标记为可选（灰色标签） |
| `@deprecated` | 标记为已废弃（红色标签，字段名加删除线） |
| `@default` | 默认值 |
| `@description` | 字段描述 |

指令说明：

| 指令 | 说明 |
|------|------|
| `:::field{名称}` | 单个字段 |
| `::::field-group` | 字段组容器，字段间自动添加分隔线 |

---

## 代码树(:::code-tree)

左侧文件树 + 右侧代码面板的组合视图。点击文件名切换代码，点击文件夹展开/收起。

效果：

:::code-tree{title="My Project" entry="src/main.ts"}
```ts title="src/main.ts" :active
import { app } from './app'

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

```ts title="src/app.ts"
import express from 'express'

export const app = express()

app.get('/', (req, res) => {
  res.json({ hello: 'world' })
})
```
:::

源码：

`````markdown
:::code-tree{title="My Project" entry="src/main.ts"}
```ts title="src/main.ts" :active
import { app } from './app'

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

```ts title="src/app.ts"
import express from 'express'

export const app = express()

app.get('/', (req, res) => {
  res.json({ hello: 'world' })
})
```
:::
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `title` | 代码树标题 | ❌ | — |
| `entry` | 默认激活的文件路径 | ❌ | — |
| `height` | 代码树容器高度 | ❌ | — |
| `dir` | 导入目录路径，自动扫描文件构建代码树 | ❌ | — |
| `:active` | 代码块元信息，标记默认激活文件 | ❌ | — |

代码块的 `title` 属性用于构建文件树路径，以 `/` 分隔会自动创建文件夹层级。

### 从目录导入

使用 `dir` 属性可以导入整个目录作为代码树，自动扫描目录下所有文件：

:::code-tree{dir="public/demos/sample-web-project" title="示例 Web 项目" entry="src/main.ts"}
:::

---

## 折叠块(:::details/:::folders)

### 基础折叠

使用 `:::details` 创建可展开/收起的内容区域。

效果：

:::details{title="点击展开" open="true"}
这个内容默认展开。`folding`、`collapse`、`details` 三个指令名称效果完全相同。
:::

源码：

`````markdown
:::details{title="点击展开" open="true"}
这个内容默认展开。`folding`、`collapse`、`details` 三个指令名称效果完全相同。
:::
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `title` | 折叠块标题 | ✅ | `"Details"` |
| `open="true"` | 默认展开 | ❌ | — |
| `color` | 主题色 | ❌ | `accent` |

### 多级折叠

使用 `:::folders` 创建多个独立折叠面板，面板间自动添加分隔线。

效果：

:::folders
folder: 第一章：基础概念

Astro 是一个**内容优先**的静态站点生成器。核心特点：

1. 零 JS 默认输出
2. 群岛架构
3. 支持 React / Vue / Svelte

folder: 第二章：组件系统

Astro 组件使用 `.astro` 后缀，语法类似 HTML + JS：

```astro
---
const name = 'Astro';
---
<h1>Hello {name}</h1>
```

folder: 第三章：内容集合

使用 [Content Collections](https://docs.astro.build/zh-cn/guides/content-collections/) 管理类型安全的内容。
:::

源码：

`````markdown
:::folders
folder: 第一章：基础概念

Astro 是一个**内容优先**的静态站点生成器。核心特点：

1. 零 JS 默认输出
2. 群岛架构
3. 支持 React / Vue / Svelte

folder: 第二章：组件系统

Astro 组件使用 `.astro` 后缀，语法类似 HTML + JS：

```astro
---
const name = 'Astro';
---
<h1>Hello {name}</h1>
```

folder: 第三章：内容集合

使用 [Content Collections](https://docs.astro.build/zh-cn/guides/content-collections/) 管理类型安全的内容。
:::
`````

### 手风琴模式

添加 `accordion` 属性，同一时间只能展开一个面板。

效果：

:::folders{accordion}
folder: 安装

运行 `npm install` 安装依赖。

folder: 配置

编辑 `config.json` 设置偏好。

folder: 部署

运行 `npm run build && npm run deploy`。
:::

源码：

`````markdown
:::folders{accordion}
folder: 安装

运行 `npm install` 安装依赖。

folder: 配置

编辑 `config.json` 设置偏好。

folder: 部署

运行 `npm run build && npm run deploy`。
:::
`````

指令说明：

| 指令 | 说明 |
|------|------|
| `:::details{title="标题"}` | 单个折叠块 |
| `:::folders` | 多个折叠面板 |
| `:::folders{accordion}` | 手风琴模式，同时只展开一个 |
| `folder: 标题` | 面板标题行，后跟内容 |

---

## 卡片网格(::::card-grid)

使用 `::::card-grid` 将多个 `:::card` 以响应式网格布局排列。

效果：

::::card-grid
:::card{title="快速" icon="lucide:zap" color="#22c55e"}
基于 Astro 6 静态输出，页面加载极快。
:::

:::card{title="现代" icon="lucide:code" color="#3b82f6"}
Svelte 5 runes 模式、Tailwind CSS 4、TypeScript。
:::

:::card{title="丰富" icon="lucide:bookmark" color="#a855f7"}
扩展 Markdown 指令 80+，图表、交互组件一应俱全。
:::
::::

源码：

`````markdown
::::card-grid
:::card{title="快速" icon="lucide:zap" color="#22c55e"}
基于 Astro 6 静态输出，页面加载极快。
:::

:::card{title="现代" icon="lucide:code" color="#3b82f6"}
Svelte 5 runes 模式、Tailwind CSS 4、TypeScript。
:::

:::card{title="丰富" icon="lucide:bookmark" color="#a855f7"}
扩展 Markdown 指令 80+，图表、交互组件一应俱全。
:::
::::
`````

指令说明：

| 指令 | 说明 |
|------|------|
| `::::card-grid` | 卡片网格容器 |
| `:::card{title="..."}` | 单个卡片 |

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `title` | 卡片标题 | ❌ | — |
| `icon` | 卡片图标，支持 `lucide:名称` 格式 | ❌ | — |
| `color` | 图标和主题色 | ❌ | `accent` |
| `href` | 点击跳转链接 | ❌ | — |

---

## 代码块标注(del/ins/聚焦)

Expressive Code 内置支持行标注，通过代码块元信息指定行号。支持三种标注类型：

- **删除行** `del={行号}` — 红色高亮，表示被删除的代码
- **新增行** `ins={行号}` — 绿色高亮，表示新增的代码
- **聚焦行** `{行号}` — 蓝色高亮，表示需要关注的行

支持行号范围，如 `del={2}`、`ins={3-4}`、`{5-7}`。

### 行标注示例

```typescript del={2} ins={3} {5}
function getUser(id: string) {
  const user = db.findUser(id)
  const user = db.findById(id)
  if (!user) {
    throw new Error('Not found')
  }
  return user
}
```

源码：

`````markdown
```typescript del={2} ins={3} {5}
function getUser(id: string) {
  const user = db.findUser(id)
  const user = db.findById(id)
  if (!user) {
    throw new Error('Not found')
  }
  return user
}
```
`````

### diff 语法

使用 `diff` 语言标识符，通过 `+`/`-` 前缀标注行，同时保留语法高亮：

```diff lang="ts"
- const user = db.findUser(id)
+ const user = db.findById(id)
  if (!user) {
    throw new Error('Not found')
  }
```

源码：

`````markdown
```diff lang="ts"
- const user = db.findUser(id)
+ const user = db.findById(id)
  if (!user) {
    throw new Error('Not found')
  }
```
`````

### 参数说明

| 标注 | 语法 | 说明 | 颜色 |
|------|------|------|------|
| 删除行 | `del={行号}` | 标记为删除的代码行 | 🔴 红色 |
| 新增行 | `ins={行号}` | 标记为新增的代码行 | 🟢 绿色 |
| 聚焦行 | `{行号}` | 需要关注的代码行 | 🔵 蓝色 |
| diff 语法 | `diff lang="语言"` | 使用 `+`/`-` 前缀标注 | 同上 |

行号支持范围写法：`del={2-5}` 表示第 2-5 行，多个范围用空格分隔：`ins={3-4} ins={8-10}`。

---

## 代码块折叠

代码块支持两种折叠方式：**自动折叠**（超过行数阈值自动添加折叠按钮）和**强制折叠**（通过 `collapse` 标记手动指定）。

### 自动折叠

当代码块行数超过配置的阈值（默认 10 行）时，自动添加折叠按钮。折叠后显示前 5 行预览，底部渐变遮罩提示可展开。

```typescript
interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  createdAt: Date
  updatedAt: Date
  settings: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: boolean
  }
}

function formatUserProfile(user: UserProfile): string {
  const { name, email, bio } = user
  return `${name} <${email}> — ${bio}`
}
```

### 强制折叠

在代码块语言标识后添加 `collapse`，强制代码块默认折叠，无论行数多少：

```go collapse
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

源码：

`````markdown
```go collapse
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```
`````

### 配置项

| 配置 | 说明 | 默认值 |
|------|------|--------|
| `enable` | 是否启用代码块折叠功能 | `true` |
| `lineThreshold` | 触发自动折叠的行数阈值 | `10` |
| `previewLines` | 折叠时显示的预览行数 | `5` |
| `defaultCollapsed` | 超过阈值时是否默认折叠 | `false` |

配置位于 `src/config/expressiveCodeConfig.ts` 的 `pluginCollapsible` 字段。

---

## 视频播放器(:::video)

支持本地视频、Bilibili 和 YouTube 三种视频源。

### 本地视频（带封面）

通过 `src` 属性指定视频地址，`poster` 设置封面图。

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80" ratio="16/9"}
:::

### Bilibili 视频

通过 `bilibili` 属性指定 BV 号即可嵌入。

:::video{bilibili=BV1uT4y1P7CX ratio="16/9"}
:::

### YouTube 视频

通过 `youtube` 属性指定视频 ID 即可嵌入。

:::video{youtube=dQw4w9WgXcQ ratio="16/9"}
:::

源码：

`````markdown
<!-- 本地视频（带封面） -->
:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80" ratio="16/9"}
:::

<!-- Bilibili -->
:::video{bilibili=BV1uT4y1P7CX ratio="16/9"}
:::

<!-- YouTube -->
:::video{youtube=dQw4w9WgXcQ ratio="16/9"}
:::
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `src` | 本地视频 URL | 三选一 | — |
| `bilibili` | Bilibili BV 号（可省略 `BV` 前缀） | 三选一 | — |
| `youtube` | YouTube 视频 ID | 三选一 | — |
| `poster` | 封面图片 URL（仅 `src` 模式） | ❌ | — |
| `ratio` | 宽高比 | ❌ | `16/9` |
| `width` | 视频宽度 | ❌ | — |
| `autoplay` | 自动播放（需同时静音） | ❌ | — |
| `pip` | 画中画模式 | ❌ | `auto` |

---

## 选项卡(:::tabs)

使用 `:::tabs` 创建选项卡内容，支持跨组同步切换。

### 基础选项卡

使用 `[标签名]` 语法定义每个选项卡。

:::tabs
[pnpm] pnpm add astro

[yarn] yarn add astro

[npm] npm install astro
:::

### 同步选项卡

多个选项卡组可通过 `sync` 属性联动切换：

:::tabs{sync="pkg"}
[pnpm] `pnpm add @astrojs/svelte`

[yarn] `yarn add @astrojs/svelte`

[npm] `npm install @astrojs/svelte`
:::

:::tabs{sync="pkg"}
[pnpm] `pnpm add svelte`

[yarn] `yarn add svelte`

[npm] `npm install svelte`
:::

源码：

`````markdown
<!-- 基础选项卡 -->
:::tabs
[pnpm] pnpm add astro

[yarn] yarn add astro

[npm] npm install astro
:::

<!-- 同步选项卡 -->
:::tabs{sync="pkg"}
[pnpm] `pnpm add @astrojs/svelte`

[yarn] `yarn add @astrojs/svelte`

[npm] `npm install @astrojs/svelte`
:::
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `[标签名]` | 选项卡标签文本 | ✅ | — |
| `sync` | 同步组名，相同组名的选项卡联动切换 | ❌ | — |

---

## 时间线(:::timeline)

使用 `:::timeline` 创建时间轴视图，展示事件序列。

效果：

:::timeline
- 2024-01 项目启动，完成基础架构
- 2024-03 首个公开版本发布
- 2024-06 支持自定义主题和国际化
- 2024-09 新增音乐播放器和 Live2D 看板娘
- 2025-01 迁移至 Astro 6 + Svelte 5
:::

源码：

`````markdown
:::timeline
- 2024-01 项目启动，完成基础架构
- 2024-03 首个公开版本发布
- 2024-06 支持自定义主题和国际化
- 2024-09 新增音乐播放器和 Live2D 看板娘
- 2025-01 迁移至 Astro 6 + Svelte 5
:::
`````

格式说明：

| 格式 | 说明 |
|------|------|
| `- 日期 描述` | 时间线条目，日期与描述以空格分隔 |

---

## 步骤(:::steps)

使用 `:::steps` 创建带编号的步骤指引。

效果：

:::steps
1. 安装依赖

   运行 `pnpm install` 安装项目依赖。

2. 配置环境

   复制 `.env.example` 为 `.env` 并填写配置。

3. 启动开发服务器

   ```bash
   pnpm dev
   ```

4. 构建生产版本

   ```bash
   pnpm build
   ```
:::

源码：

`````markdown
:::steps
1. 安装依赖

   运行 `pnpm install` 安装项目依赖。

2. 配置环境

   复制 `.env.example` 为 `.env` 并填写配置。

3. 启动开发服务器

   ```bash
   pnpm dev
   ```

4. 构建生产版本

   ```bash
   pnpm build
   ```
:::
`````

---

## 诗歌(:::poetry)

使用 `:::poetry` 排版诗歌或歌词，自动保留换行和缩进。

效果：

:::poetry{title="水调歌头" author="苏轼"}
明月几时有？把酒问青天。
不知天上宫阙，今夕是何年。
我欲乘风归去，又恐琼楼玉宇，高处不胜寒。
起舞弄清影，何似在人间。
:::

源码：

`````markdown
:::poetry{title="水调歌头" author="苏轼"}
明月几时有？把酒问青天。
不知天上宫阙，今夕是何年。
我欲乘风归去，又恐琼楼玉宇，高处不胜寒。
起舞弄清影，何似在人间。
:::
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `title` | 诗歌标题 | ❌ | — |
| `author` | 作者 | ❌ | — |

---

## 胶卷(:::reel)

使用 `:::reel` 创建水平滚动的卡片容器。

效果：

::::reel
:::card{title="Astro" icon="lucide:rocket" color="#ff5d01"}
内容优先的 Web 框架。
:::

:::card{title="Svelte" icon="lucide:component" color="#ff3e00"}
编译型前端框架，无虚拟 DOM。
:::

:::card{title="Tailwind" icon="lucide:paintbrush" color="#06b6d4"}
原子化 CSS 框架。
:::

:::card{title="TypeScript" icon="lucide:file-code" color="#3178c6"}
类型安全的 JavaScript 超集。
:::
::::

源码：

``````markdown
::::reel
:::card{title="Astro" icon="lucide:rocket" color="#ff5d01"}
内容优先的 Web 框架。
:::

:::card{title="Svelte" icon="lucide:component" color="#ff3e00"}
编译型前端框架，无虚拟 DOM。
:::

:::card{title="Tailwind" icon="lucide:paintbrush" color="#06b6d4"}
原子化 CSS 框架。
:::

:::card{title="TypeScript" icon="lucide:file-code" color="#3178c6"}
类型安全的 JavaScript 超集。
:::
::::
``````

---

## 纸张(:::paper)

使用 `:::paper` 创建纸张风格的容器，适合展示信件或文档。

效果：

:::paper
致未来的自己：

当你看到这段文字时，希望一切安好。技术日新月异，但创造的初心不变。

—— 来自 2024 年的开发者
:::

源码：

`````markdown
:::paper
致未来的自己：

当你看到这段文字时，希望一切安好。技术日新月异，但创造的初心不变。

—— 来自 2024 年的开发者
:::
`````

---

## 引用(:::quot)

使用 `:::quot` 创建带作者和来源的引用块。

效果：

:::quot{author="Linus Torvalds" source="Linux 内核邮件列表"}
Talk is cheap. Show me the code.
:::

源码：

`````markdown
:::quot{author="Linus Torvalds" source="Linux 内核邮件列表"}
Talk is cheap. Show me the code.
:::
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `author` | 引用作者 | ❌ | — |
| `source` | 引用来源 | ❌ | — |

---

## 网格(:::grid)

使用 `:::grid` 创建响应式网格布局。

效果：

::::grid{cols="2"}
:::card{title="左侧" icon="lucide:arrow-left"}
网格的第一列内容。
:::

:::card{title="右侧" icon="lucide:arrow-right"}
网格的第二列内容。
:::
::::

源码：

``````markdown
::::grid{cols="2"}
:::card{title="左侧" icon="lucide:arrow-left"}
网格的第一列内容。
:::

:::card{title="右侧" icon="lucide:arrow-right"}
网格的第二列内容。
:::
::::
``````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `cols` | 列数 | ❌ | `2` |
| `gap` | 间距 | ❌ | `16`（px） |
| `minw` | 最小列宽（自动列数时） | ❌ | `240px` |
| `bg` | 背景样式 | ❌ | `card` |

---

## 弹性布局(:::flex)

使用 `:::flex` 创建弹性容器，支持方向、对齐等参数。

效果：

::::flex{justify="center" align="center" gap="2rem"}
:::card{title="A" icon="lucide:box"}
项目 A
:::

:::card{title="B" icon="lucide:box"}
项目 B
:::

:::card{title="C" icon="lucide:box"}
项目 C
:::
::::

源码：

``````markdown
::::flex{justify="center" align="center" gap="2rem"}
:::card{title="A" icon="lucide:box"}
项目 A
:::

:::card{title="B" icon="lucide:box"}
项目 B
:::

:::card{title="C" icon="lucide:box"}
项目 C
:::
::::
``````
参数：

| 参数 | 说明 | 可选值 | 默认值 |
|------|------|------|--------|
| `column` | 纵向排列 | `true` | `false` |
| `justify` | 主轴对齐 | `center` / `between` / `around` / `evenly` | — |
| `align` | 交叉轴对齐 | `start` / `center` / `end` / `stretch` | — |
| `gap` | 间距 | CSS 值，如 `1rem` | `1rem` |

---

## 复制(:::copy)

使用 `:::copy` 创建可复制的内容区域。

效果：

:::copy{title="安装命令"}
```bash
pnpm add @astrojs/svelte
```
:::

源码：

`````markdown
:::copy{title="安装命令"}
```bash
pnpm add @astrojs/svelte
```
:::
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `title` | 复制区标题 | ❌ | — |

---

## 画廊(:::gallery)

使用 `:::gallery` 创建图片画廊，点击可查看大图。

效果：

:::gallery
![风景](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80)

![城市](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80)

![自然](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80)
:::

源码：

`````markdown
:::gallery
![风景](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80)

![城市](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80)

![自然](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80)
:::
`````

---

## 终端录制(:::asciinema)

使用 `:::asciinema` 嵌入终端录制回放。

效果：

:::asciinema{src="/demos/demo.cast"}
:::

源码：

`````markdown
:::asciinema{src="/demos/demo.cast"}
:::
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `src` | asciinema 录制文件 URL（`.cast` 格式） | ✅ | — |
| `cols` | 终端列数 | ❌ | `80` |
| `rows` | 终端行数 | ❌ | `24` |

---

## 色板(:::colors)

使用 `:::colors` 展示调色板或颜色列表。

效果：

:::colors{values="#3b82f6,#22c55e,#ef4444,#f59e0b,#8b5cf6"}
:::

源码：

`````markdown
:::colors{values="#3b82f6,#22c55e,#ef4444,#f59e0b,#8b5cf6"}
:::
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `values` | 颜色值列表，逗号分隔 | ✅ | — |

---

## 对话(:::chat)

使用 `:::chat` 创建对话气泡视图，支持标题、日期分隔符和多种发送者标识。

效果：

:::chat{title="Tsukimi 功能咨询"}
{:2025-06-17 14:30}

{.} 你好！Tsukimi 支持哪些功能？

{对方} 它支持 Markdown 扩展指令、音乐播放器、Live2D 看板娘等丰富功能。

{.} 太棒了，怎么开始使用？

{对方} 查看文档即可快速上手！
:::

源码：

`````markdown
:::chat{title="Tsukimi 功能咨询"}
{:2025-06-17 14:30}

{.} 你好！Tsukimi 支持哪些功能？

{对方} 它支持 Markdown 扩展指令、音乐播放器、Live2D 看板娘等丰富功能。

{.} 太棒了，怎么开始使用？

{对方} 查看文档即可快速上手！
:::
`````
标识说明：

| 标识 | 说明 |
|------|------|
| `{.}` 或 `[自己]` | 右侧气泡，主色调 |
| `{用户名}` 或 `[用户名]` | 左侧气泡，显示用户名 |
| `{:日期时间}` | 居中日期分隔线 |
| `title="标题"` | 对话框标题 |

---

## npm 包(:::npm-to)

使用 `:::npm-to` 展示 npm 包信息和安装命令。

效果：

:::npm-to{package="astro"}
:::

源码：

`````markdown
:::npm-to{package="包名"}
:::
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `package` | npm 包名 | ✅ | — |
| `tabs` | 显示的包管理器 | ❌ | `npm,pnpm,yarn,bun` |

---

## 卡片(:::card)

使用 `:::card` 创建独立卡片，可添加标题、图标和链接。

效果：

:::card{title="Tsukimi" icon="lucide:moon" color="#a855f7" href="https://github.com/souloss/Tsukimi"}
一个功能丰富的 Astro 博客模板，支持丰富的 Markdown 扩展指令。
:::

源码：

`````markdown
:::card{title="Tsukimi" icon="lucide:moon" color="#a855f7" href="https://github.com/souloss/Tsukimi"}
一个功能丰富的 Astro 博客模板，支持丰富的 Markdown 扩展指令。
:::
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `title` | 卡片标题 | ❌ | — |
| `icon` | 图标，支持 `lucide:名称` | ❌ | — |
| `color` | 图标和主题色 | ❌ | `accent` |
| `href` | 点击跳转链接 | ❌ | — |

---

## 链接卡片样式(:::card with image)

使用 `:::card` 指定 `image` 和 `href` 属性即可生成链接预览样式的卡片。

效果：

:::card{href="https://astro.build" title="Astro 官网" image="https://astro.build/assets/press/astro-icon-light.png" desc="内容优先的现代 Web 框架。"}

源码：

`````markdown
:::card{href="https://astro.build" title="Astro 官网" image="https://astro.build/assets/press/astro-icon-light.png" desc="内容优先的现代 Web 框架。"}
:::
`````


参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `href` | 链接地址 | ✅ | — |
| `title` | 卡片标题 | ❌ | — |
| `image` | 预览图片 | ❌ | — |
| `desc` | 描述文字 | ❌ | — |

---

## 内联指令(:指令[内容]{参数})

以下指令使用行内语法 `:指令[内容]{参数}` 在段落中直接使用。

### 文本标记(:mark)

使用 `:mark[文本]` 高亮文本，类似荧光笔效果。

这段文字中有:mark[高亮标记]和普通文本。

源码：

`````markdown
这段文字中有:mark[高亮标记]和普通文本。
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `color` | 高亮颜色，支持 CSS 颜色名 / hex | ❌ | `yellow` |

### 键盘按键(:kbd)

使用 `:kbd[按键]` 显示键盘按键样式。

按下 :kbd[Ctrl] + :kbd[C] 复制，:kbd[Ctrl] + :kbd[V] 粘贴。

源码：

`````markdown
按下 :kbd[Ctrl] + :kbd[C] 复制，:kbd[Ctrl] + :kbd[V] 粘贴。
`````

### 下划线(:u)

使用 `:u[文本]` 添加下划线。

这是:u[带下划线的文本]。

源码：

`````markdown
这是:u[带下划线的文本]。
`````

### 着重号(:emp)

使用 `:emp[文本]` 添加着重号（CJK 专用），类似日文傍点。

这是:emp[重点内容]需要关注。

源码：

`````markdown
这是:emp[重点内容]需要关注。
`````

### 波浪线(:wavy)

使用 `:wavy[文本]` 添加波浪下划线。

这是:wavy[波浪线标注的文本]。

源码：

`````markdown
这是:wavy[波浪线标注的文本]。
`````

### 删除线(:del)

使用 `:del[文本]` 添加删除线（比 `~~~~` 更灵活）。

原价 :del[¥99]，现价 ¥49。

源码：

`````markdown
原价 :del[¥99]，现价 ¥49。
`````

### 上标与下标(:sup/:sub)

使用 `:sup[文本]` 和 `:sub[文本]` 添加上标和下标。

E = mc:sup[2]，H:sub[2]O。

源码：

`````markdown
E = mc:sup[2]，H:sub[2]O。
`````

### 彩色文字(:color)

使用 `:color[文本]{color="#hex"}` 设置文字颜色。

这是:color[红色文字]{color="#ef4444"}和:color[蓝色文字]{color="#3b82f6"}。

源码：

`````markdown
这是:color[红色文字]{color="#ef4444"}和:color[蓝色文字]{color="#3b82f6"}。
`````
参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `color` | 文字颜色，支持 hex / CSS 颜色名 | ✅ | — |

### 密码揭示与模糊遮罩(:psw/:blur)

使用 `:psw[文本]` 创建密码遮罩，使用 `:blur[文本]` 创建模糊遮罩。点击即可揭示。

- 密码遮罩：密码是 :psw[s3cret]，点击显示
- 模糊遮罩：:blur[hidden content]，点击揭示

源码：

`````markdown
- 密码遮罩：密码是 :psw[s3cret]，点击显示
- 模糊遮罩：:blur[hidden content]，点击揭示
`````

### 复选框(:checkbox)

使用 `:checkbox[状态]` 创建行内复选框。

- :checkbox[checked] 已完成任务
- :checkbox[unchecked] 待办事项
- :checkbox[checked] 另一项已完成

源码：

`````markdown
- :checkbox[checked] 已完成任务
- :checkbox[unchecked] 待办事项
- :checkbox[checked] 另一项已完成
`````

### 单选框(:radio)

使用 `:radio[状态]` 创建行内单选框。

- :radio[selected] 已选中选项
- :radio[unselected] 未选中选项

源码：

`````markdown
- :radio[selected] 已选中选项
- :radio[unselected] 未选中选项
`````

### 标签(:hashtag)

使用 `:hashtag[标签名]` 创建标签样式的行内元素。

这篇文章的标签是 :hashtag[TypeScript] :hashtag[Astro] :hashtag[前端]。

源码：

`````markdown
这篇文章的标签是 :hashtag[TypeScript] :hashtag[Astro] :hashtag[前端]。
`````

### 徽章(:badge)

使用 `:badge[文本]{type="类型"}` 创建行内徽章。

状态：:badge[稳定]{type="tip"} :badge[实验性]{type="warning"} :badge[已废弃]{type="danger"}

源码：

`````markdown
状态：:badge[稳定]{type="tip"} :badge[实验性]{type="warning"} :badge[已废弃]{type="danger"}
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `type` | 徽章类型，同下表 | ❌ | `blue` |
| `color` | 自定义颜色，覆盖 `type` | ❌ | — |

类型说明：

| type | 说明 | 颜色 |
|------|------|------|
| `tip` | 提示 | 绿色 |
| `info` | 信息 | 蓝色 |
| `warning` | 警告 | 橙色 |
| `danger` | 危险 | 红色 |

### 注释(:anno)

使用 `:anno[文本](提示内容)` 创建带悬浮提示的注释文本。

这个:anno[术语](这里是术语的解释)需要解释。

源码：

`````markdown
这个:anno[术语](这里是术语的解释)需要解释。
`````

### 缩写(:abbr)

使用 `:abbr[缩写](全称)` 创建带悬浮提示的缩写。

使用 :abbr[HTML](HyperText Markup Language) 构建 :abbr[UI](User Interface)。

源码：

`````markdown
使用 :abbr[HTML](HyperText Markup Language) 构建 :abbr[UI](User Interface)。
`````

### 表情符号(:emoji)

使用 `:emoji[名称]` 插入 emoji 表情。

我喜欢 :emoji[heart] 编程 :emoji[rocket]。

源码：

`````markdown
我喜欢 :emoji[heart] 编程 :emoji[rocket]。
`````

参数：

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `height` | emoji 高度 | ❌ | `1.75em` |
| `source` | emoji 来源 | ❌ | `twemoji` |

### 步骤括号(:step-brackets)

使用 `:step-brackets[数字]` 创建带括号的步骤编号。

:step-brackets[1] 安装 → :step-brackets[2] 配置 → :step-brackets[3] 部署

源码：

`````markdown
:step-brackets[1] 安装 → :step-brackets[2] 配置 → :step-brackets[3] 部署
`````

---

## 文件树(:::file-tree)

使用 `:::file-tree` 创建带图标的文件树视图，支持文件夹折叠和差异标记。

:::file-tree
- src/
  - components/
    - Header.astro
    - Footer.astro
  - pages/
    - index.astro
  - config.ts
- public/
  - favicon.svg
- package.json
- ++ README.md
- -- CHANGELOG.md
:::

源码：

`````markdown
:::file-tree
- src/
  - components/
    - Header.astro
    - Footer.astro
  - pages/
    - index.astro
  - config.ts
- public/
  - favicon.svg
- package.json
- ++ README.md
- -- CHANGELOG.md
:::
`````
语法说明：

| 语法 | 说明 |
|------|------|
| `- 名称/` | 文件夹，以 `/` 结尾 |
| `- 文件名.扩展名` | 文件 |
| `- ++ 新增文件` | 差异标记：新增 |
| `- -- 删除文件` | 差异标记：删除 |
| `- ...` | 省略号 |
| `- 名称 # 注释` | 行末注释 |
