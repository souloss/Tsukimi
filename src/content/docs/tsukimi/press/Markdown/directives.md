---
title: Markdown 指令
createTime: 2025/5/21
permalink: /press/markdown/directives/
order: 8
icon: ri:command-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

在普通 `.md` 文章里直接使用 `:::` 和 `:` 语法，无需 import，无需 MDX。下面每个指令都分成了**演示效果**与**示例代码**两个选项卡，方便你边预览边复制。

---

## 块级组件

### Callout 提示块

::::tabs
tab: 演示效果

:::callout{type="info"}
这是一条**信息提示**，适合补充说明背景知识。
:::

:::callout{type="tip" title="小技巧"}
通过 `title` 属性自定义标题。
:::

:::callout{type="warn"}
这是一条**注意事项**，提醒读者小心的地方。
:::

:::callout{type="danger" title="危险操作"}
执行此操作前请务必备份数据。
:::

tab: 示例代码

````
:::callout{type="info"}
这是一条**信息提示**，适合补充说明背景知识。
:::

:::callout{type="tip" title="小技巧"}
通过 `title` 属性自定义标题。
:::

:::callout{type="warn"}
这是一条**注意事项**，提醒读者小心的地方。
:::

:::callout{type="danger" title="危险操作"}
执行此操作前请务必备份数据。
:::
````

- `type` 可选值：`info` | `tip` | `warn` | `danger`
- `title` 可自定义标题，不传则使用默认值

::::

---

### Note 主题色提示

::::tabs
tab: 演示效果

:::note
使用博客**主题色**的轻量提示块，自动适配当前色相。
:::

:::note{title="自定义蓝色" color="blue"}
通过 `color` 属性指定颜色，覆盖默认主题色。
:::

:::note{title="自定义十六进制色" color="#e11d48"}
也支持传入任意十六进制色值。
:::

tab: 示例代码

````
:::note
使用博客**主题色**的轻量提示块，自动适配当前色相。
:::

:::note{title="自定义蓝色" color="blue"}
通过 `color` 属性指定颜色，覆盖默认主题色。
:::

:::note{title="自定义十六进制色" color="#e11d48"}
也支持传入任意十六进制色值。
:::
````

- 不传 `color` 时自动使用博客主题色（`--primary`），适配亮/暗模式
- `color` 可选值：`blue`、`green`、`red`、`yellow`、`purple` 等命名色，或任意十六进制色值（如 `#e11d48`）
- `title` 可设置标题

::::

---

### Folding 折叠块

::::tabs
tab: 演示效果

:::folding{title="查看完整配置"}
```js
// astro.config.mjs
import remarkDirective from 'remark-directive';
import remarkContentDirectives from './src/plugins/remark-content-directives.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkContentDirectives]
  }
});
```
:::

:::folding{title="默认展开的折叠块" open="true"}
通过 `open="true"` 让折叠块默认展开。支持 `color` 属性自定义颜色。
:::

tab: 示例代码

`````
:::folding{title="查看完整配置"}
```js
import remarkDirective from 'remark-directive';
import remarkContentDirectives from './src/plugins/remark-content-directives.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkContentDirectives]
  }
});
```
:::

:::folding{title="默认展开的折叠块" open="true"}
通过 `open="true"` 让折叠块默认展开。支持 `color` 属性自定义颜色。
:::
`````

- `title` 折叠按钮上的文字
- `open="true"` 默认展开
- `color` 自定义颜色

::::

---

### Folders 多级折叠

::::tabs
tab: 演示效果

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

tab: 示例代码

`````
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

- 每个 `folder: 标题` 开启一个新的折叠项
- 支持在内容中嵌套代码块、列表、链接等 Markdown 内容

::::

---

### Timeline 时间线

::::tabs
tab: 演示效果

:::timeline
- 2024-01 | 开始学习 Astro | 从官方文档入手，了解基本概念
- 2024-03 | 搭建个人博客 | 基于 Vergil 主题开始定制
- 2024-06 | 上线运营 | 正式部署到 GitHub Pages
- 2025-04 | 持续迭代 | 添加分类、专栏、内容指令等功能
:::

tab: 示例代码

````
:::timeline
- 2024-01 | 开始学习 Astro | 从官方文档入手，了解基本概念
- 2024-03 | 搭建个人博客 | 基于 Vergil 主题开始定制
- 2024-06 | 上线运营 | 正式部署到 GitHub Pages
- 2025-04 | 持续迭代 | 添加分类、专栏、内容指令等功能
:::
````

- 每条时间线以 `-` 开头，用 `|` 分隔**日期**、**标题**、**描述**
- 描述为可选

::::

---

### Tabs 选项卡

#### 演示效果

:::tabs
tab: 标签 A

这是**标签 A** 的内容。

tab: 标签 B{color=blue}

这是带 `color` 属性的**标签 B**。
:::

#### 示例代码

````
:::tabs
tab: 标签 A

这是**标签 A** 的内容。

tab: 标签 B{color=blue}

这是带 `color` 属性的**标签 B**。
:::
````

- `tab: 标签名` 后需要空一行，再写内容
- `tab: 标签名{color=blue}` 可给标签设置颜色

---

### Poetry 诗歌/引用

::::tabs
tab: 演示效果

:::poetry{title="游山西村" author="陆游" footer="诗词节选" date="（宋）"}
莫笑农家腊酒浑，丰年留客足鸡豚。

**山重水复疑无路，柳暗花明又一村**

箫鼓追随春社近，衣冠简朴古风存。

从今若许闲乘月，拄杖无时夜叩门。
:::

tab: 示例代码

````
:::poetry{title="游山西村" author="陆游" footer="诗词节选" date="（宋）"}
莫笑农家腊酒浑，丰年留客足鸡豚。

**山重水复疑无路，柳暗花明又一村**

箫鼓追随春社近，衣冠简朴古风存。

从今若许闲乘月，拄杖无时夜叩门。
:::
````

- `title` 诗歌标题
- `author` 作者
- `date` 日期/朝代

::::

---

### Reel 卷轴

::::tabs
tab: 演示效果

:::reel{title="卷轴示例" author="作者" date="2026-04-20" footer="卷轴底部"}
这是卷轴的内容，文字会从右向左竖排显示。

支持多段落内容。
:::

tab: 示例代码

`````markdown
:::reel{title="卷轴示例" author="作者" date="2026-04-20" footer="卷轴底部"}
这是卷轴的内容，文字会从右向左竖排显示。

支持多段落内容。
:::
`````

- `title`：卷轴标题
- `author`：作者信息
- `date`：日期
- `footer`：底部文字

::::

---

### Paper 纸张

::::tabs
tab: 演示效果

:::paper{title="文言文" author="诸葛亮" date="三国" footer="节选"}
出师表

<!-- paragraph -->
先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。

<!-- section 后出师表 -->
先帝深虑汉、贼不两立，王业不偏安，故托臣以讨贼也。

<!-- line right -->
臣鞠躬尽瘁，死而后已。
:::

tab: 示例代码

`````markdown
:::paper{title="文言文" author="诸葛亮" date="三国" footer="节选"}
出师表

<!-- paragraph -->
先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。

<!-- section 后出师表 -->
先帝深虑汉、贼不两立，王业不偏安，故托臣以讨贼也。

<!-- line right -->
臣鞠躬尽瘁，死而后已。
:::
`````

- `title`：纸张标题（居中）
- `author` / `date` / `footer`：作者、日期、底部文字
- 内容分区：
  - `<!-- paragraph -->`：普通段落（首行缩进）
  - `<!-- section 标题 -->`：带居中标题的章节
  - `<!-- line right -->`：右对齐行

::::

### Copy 一键复制

::::tabs
tab: 演示效果

:::copy{label="安装"}
pnpm add remark-directive unist-util-visit
:::

:::copy{label="SSH"}
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA example@example.com
:::

tab: 示例代码

````
:::copy{label="安装"}
pnpm add remark-directive unist-util-visit
:::

:::copy{label="SSH"}
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA example@example.com
:::
````

- `label` 左侧标签文字
- 内容区域会被处理为一行纯文本，点击右侧按钮即可复制

::::

---

### Grid 网格布局

::::tabs
tab: 演示效果

:::grid{cols="3" gap="12"}
**快速开始**

```bash
npm create astro@latest
```

---

**核心概念**

- [群岛架构](https://docs.astro.build/)
- [内容集合](https://docs.astro.build/)
- [视图过渡](https://docs.astro.build/)

---

**部署指南**

1. 构建项目：`npm run build`
2. 选择平台：Vercel / Netlify / Cloudflare Pages
3. 一键部署
:::

tab: 示例代码

`````
:::grid{cols="3" gap="12"}
**快速开始**

```bash
npm create astro@latest
```

---

**核心概念**

- [群岛架构](https://docs.astro.build/)
- [内容集合](https://docs.astro.build/)
- [视图过渡](https://docs.astro.build/)

---

**部署指南**

1. 构建项目：`npm run build`
2. 选择平台：Vercel / Netlify / Cloudflare Pages
3. 一键部署
:::
`````

- `cols` 列数，可选 `2` | `3` | `4`，不传则按最小宽度自动换行
- `gap` 格子间距，单位 px
- `minw` 自动列数时的最小列宽，默认 `240px`
- `bg` 格子背景样式：`card`（默认） | `box` | `none`
- 用 `---` 分隔每个格子

::::

---

### Quot 引言

::::tabs
tab: 演示效果

:::quot{icon="x"}
代码是写给人看的，顺便让机器执行。
:::

tab: 示例代码

````
:::quot{icon="x"}
代码是写给人看的，顺便让机器执行。
:::
````

- `icon` 可自定义图标，不传则使用默认引号图标

::::

---

### Blockquote 段落引用

::::tabs
tab: 演示效果

:::blockquote
这是使用 blockquote 标签的例子。

支持多段落内容，适合引用长段文字。
:::

tab: 示例代码

````
:::blockquote
这是使用 blockquote 标签的例子。

支持多段落内容，适合引用长段文字。
:::
````

- 使用 `<blockquote>` 标签包裹内容
- 顶部左右角自动显示引号图标

::::

---

## 行内指令

### 文字装饰

::::tabs
tab: 演示效果

- 高亮：:mark[默认主题色高亮] 和 :mark[黄色高亮]{color="yellow"} 和 :mark[红色高亮]{color="red"}
- 下划线：:u[实线下划线] 和 :u[蓝色下划线]{color="blue"}
- 着重号：:emp[着重号下划线]（点状）
- 波浪线：:wavy[波浪下划线]
- 删除线：:del[已删除的内容]
- 上标：H:sup[2]O 和 注释:sup[1]{color="red"}
- 下标：CO:sub[2] 和 H:sub[2]O

tab: 示例代码

````
- 高亮：:mark[默认主题色高亮] 和 :mark[黄色高亮]{color="yellow"} 和 :mark[红色高亮]{color="red"}
- 下划线：:u[实线下划线] 和 :u[蓝色下划线]{color="blue"}
- 着重号：:emp[着重号下划线]（点状）
- 波浪线：:wavy[波浪下划线]
- 删除线：:del[已删除的内容]
- 上标：H:sup[2]O 和 注释:sup[1]{color="red"}
- 下标：CO:sub[2] 和 H:sub[2]O
````

- `:mark` 的 `color` 可选值：`yellow`、`red`、`green`、`blue`、`purple` 或任意色值
- `:u`、`:sup`、`:sub` 同样支持 `color` 属性

::::

---

### 交互效果

::::tabs
tab: 演示效果

- 键盘按键：按 :kbd[Ctrl+C] 复制，按 :kbd[Ctrl+V] 粘贴，按 :kbd[⌘+K] 搜索
- 模糊遮罩：:blur[点击可以查看隐藏内容]（点击揭示）
- 密码遮罩：密码是 :psw[MySecretPassword123]（点击显示）

tab: 示例代码

````
- 键盘按键：按 :kbd[Ctrl+C] 复制，按 :kbd[Ctrl+V] 粘贴，按 :kbd[⌘+K] 搜索
- 模糊遮罩：:blur[点击可以查看隐藏内容]（点击揭示）
- 密码遮罩：密码是 :psw[MySecretPassword123]（点击显示）
````

- `:blur` 点击后移除模糊效果
- `:psw` 点击后显示明文

::::

---

### Hashtag 标签

::::tabs
tab: 演示效果

- 自动轮询颜色：:hashtag[Astro]{href="/tags/astro"} :hashtag[博客]{href="/tags/blog"} :hashtag[教程]{href="/tags/tutorial"} :hashtag[前端]{href="/tags/frontend"} :hashtag[CSS]{href="/tags/css"}
- 自定义颜色：:hashtag[指定蓝色]{href="/tags/blue" color="blue"} :hashtag[指定红色]{href="/tags/red" color="red"}

tab: 示例代码

````
- 自动轮询颜色：:hashtag[Astro]{href="/tags/astro"} :hashtag[博客]{href="/tags/blog"} :hashtag[教程]{href="/tags/tutorial"} :hashtag[前端]{href="/tags/frontend"} :hashtag[CSS]{href="/tags/css"}
- 自定义颜色：:hashtag[指定蓝色]{href="/tags/blue" color="blue"} :hashtag[指定红色]{href="/tags/red" color="red"}
````

- `:hashtag` 默认自动轮询 7 种颜色（红、橙、黄、绿、青、蓝、紫），无需指定 `color`
- `:hashtag` 的 `href` 为跳转链接，`color` 可手动自定义颜色
- `:hashtag` 左侧会自动显示 `#` 图标

::::

---

### Image 图片

::::tabs
tab: 演示效果

::image{src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="风景照片"}

::image{src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="正方形裁剪" ratio="1/1" width="300px"}

tab: 示例代码

````
::image{src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="风景照片"}

::image{src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="正方形裁剪" ratio="1/1" width="300px"}
````

- `src`（**必填**）：图片地址
- `alt`：图片描述，会显示在图片下方作为 caption
- `width` / `height`：设置图片尺寸
- `ratio`：固定宽高比
- `link`：可选，点击图片跳转的链接

::::

---

### Gallery 图片画廊

::::tabs
tab: 演示效果

:::gallery{layout="grid" size="m" ratio="square"}
![山景1](/images/albums/AcgExample/1.webp)
![山景2](/images/albums/AcgExample/2.webp)
![森林](/images/albums/AcgExample/3.webp)
![湖泊](/images/albums/AcgExample/4.webp)
:::

tab: 示例代码

````
:::gallery{layout="grid" size="m" ratio="square"}
![山景1](/images/albums/AcgExample/1.webp)
![山景2](/images/albums/AcgExample/2.webp)
![森林](/images/albums/AcgExample/3.webp)
![湖泊](/images/albums/AcgExample/4.webp)
:::
````

- `layout`：`grid`（网格，默认）或 `flow`（瀑布流）
- `size`：`xs` | `s` | `m` | `l` | `xl` | `mix`
- `ratio`：`square` | `portrait` | `origin`（保持原始比例）

::::

---

### Panel 代码面板

将多个相关代码块或文字段落放入同一个面板中并列展示。每段有独立的左侧标签和右侧说明，支持每段单独复制。

#### 场景 1：多语言代码对比

::::tabs
tab: 演示效果

:::panel
```js title="JavaScript" right="ES2024"
const user = await fetch('/api/user').then(r => r.json())
console.log(user.name)
```

```ts title="TypeScript" right="v5.7"
interface User { name: string }
const user = await fetch<User>('/api/user').then(r => r.json())
console.log(user.name)
```

```py title="Python" right="3.13"
import requests
user = requests.get('/api/user').json()
print(user['name'])
```
:::

tab: 示例代码

`````markdown
:::panel
```js title="JavaScript" right="ES2024"
const user = await fetch('/api/user').then(r => r.json())
```

```ts title="TypeScript" right="v5.7"
const user = await fetch<User>('/api/user').then(r => r.json())
```
:::
`````

- `title` -> 左侧标签（场景/功能描述）
- `right` -> 右侧说明（语言、版本、文件名等任意文本）

::::

---

#### 场景 2：前后端配对

::::tabs
tab: 演示效果

:::panel
```js title="前端调用" right="React"
api.getUser(id).then(user => {
  setUser(user)
})
```

```go title="后端实现" right="Go 1.23"
func GetUser(w http.ResponseWriter, r *http.Request) {
  id := r.URL.Query().Get("id")
  user := db.FindUser(id)
  json.NewEncoder(w).Encode(user)
}
```
:::

tab: 示例代码

`````markdown
:::panel
```js title="前端调用" right="React"
fetch('/api/user').then(r => r.json())
```

```go title="后端实现" right="Go 1.23"
func GetUser(w http.ResponseWriter, r *http.Request) { ... }
```
:::
`````

::::

---

#### 场景 3：请求与响应

::::tabs
tab: 演示效果

:::panel
```http title="请求" right="HTTP/1.1"
GET /api/posts?page=1&limit=10
Authorization: Bearer eyJhbG...
```

```json title="响应" right="JSON"
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10
}
```
:::

tab: 示例代码

`````markdown
:::panel
```http title="请求" right="HTTP/1.1"
GET /api/posts?page=1&limit=10
```

```json title="响应" right="JSON"
{ "data": [...], "total": 42 }
```
:::
`````

::::

---

#### 场景 4：配置文件多环境对比

::::tabs
tab: 演示效果

:::panel
```yaml title="开发环境" right="dev.yaml"
database: localhost:5432
debug: true
log_level: debug
```

```yaml title="生产环境" right="prod.yaml"
database: prod.db.internal:5432
debug: false
log_level: warn
```
:::

tab: 示例代码

`````markdown
:::panel
```yaml title="开发环境" right="dev.yaml"
database: localhost:5432
```

```yaml title="生产环境" right="prod.yaml"
database: prod.db.internal:5432
```
:::
`````

::::

---

#### 场景 5：普通文字内容分段

::::tabs
tab: 演示效果

:::panel

<!-- label: 快速上手 | 1 分钟 -->
创建项目只需一行命令：

```bash
npx create-my-app
```

<!-- label: 详细步骤 | 5 分钟 -->
1. 确保 Node.js >= 18
2. 运行 `npx create-my-app`
3. 按提示选择模板

<!-- label: 进阶配置 | 可选 -->
如需自定义配置，可在项目根目录创建 `my-app.config.js`：

```js
export default {
  theme: 'default',
  plugins: ['@my-app/i18n']
}
```

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 快速上手 | 1 分钟 -->
创建项目只需一行命令：

```bash
npx create-my-app
```

<!-- label: 详细步骤 | 5 分钟 -->
1. 确保 Node.js >= 18
2. 运行 `npx create-my-app`

:::
`````

- `<!-- label: 左边 | 右边 -->` 用 `|` 分隔左右标签
- 若不需要右边标签，可省略 `|` 及之后内容

::::

---

#### 场景 6：多视角叙事

::::tabs
tab: 演示效果

:::panel

<!-- label: 用户视角 | 痛点 -->
界面突然卡住，刷新后数据全没了，心情很崩溃。

<!-- label: 开发者视角 | 根因 -->
前端在 `onMount` 时未做 Loading 态处理，接口 5s 超时导致用户以为页面死了，重复刷新引发竞态条件。

<!-- label: 产品经理视角 | 方案 -->
需要加 Loading 骨架屏 + 请求防抖 + 断网重试机制。

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 用户视角 | 痛点 -->
界面突然卡住，刷新后数据全没了。

<!-- label: 开发者视角 | 根因 -->
前端在 `onMount` 时未做 Loading 态处理。

:::
`````

::::

---

#### 场景 7：正反观点对比

::::tabs
tab: 演示效果

:::panel

<!-- label: 支持 TypeScript | 优势 -->
TypeScript 的严格类型让大型项目维护成本大幅降低，重构时信心十足，IDE 提示也能减少低级错误。

<!-- label: 反对 TypeScript | 劣势 -->
小项目引入 TS 的 overhead 过高，类型体操反而增加了心智负担，配置复杂，不如直接用 JSDoc + 类型检查。

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 支持 TypeScript | 优势 -->
TypeScript 的严格类型让大型项目维护成本大幅降低。

<!-- label: 反对 TypeScript | 劣势 -->
小项目引入 TS 的 overhead 过高。

:::
`````

::::

---

#### 场景 8：时间线对比

::::tabs
tab: 演示效果

:::panel

<!-- label: 2023 | Webpack 时代 -->
当时使用 Webpack 5，构建一次要 30 秒，热更新也经常失败，开发体验很差。

<!-- label: 2025 | Vite 时代 -->
迁移到 Vite 后，冷启动 < 1 秒，HMR 几乎无感知，开发效率提升了数倍。

<!-- label: 展望 | Rspack 未来 -->
明年计划尝试 Rspack，在保持 Webpack 兼容的同时进一步提升构建性能。

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 2023 | Webpack 时代 -->
当时使用 Webpack 5，构建一次要 30 秒。

<!-- label: 2025 | Vite 时代 -->
迁移到 Vite 后，冷启动 < 1 秒。

:::
`````

::::

---

### Grid 多列步骤示例

:::grid{cols="2" step="true" gap="16"}
:step-brackets[01]{title="创建项目"}

Start by creating a new Vite project if you don't have one set up already.

---

```bash terminal
npm create vite@latest my-project
cd my-project
```
:::

:::grid{cols="2" step="true" gap="16"}
:step-brackets[02]{title="安装依赖"}

安装 `tailwindcss` 和 `@tailwindcss/vite`  via npm。

---

```bash terminal
npm install tailwindcss @tailwindcss/vite
```
:::

:::grid{cols="2" step="true" gap="16"}
:step-brackets[03]{title="修改配置文件"}

在 `vite.config.ts` 中引入插件：

---

```bash terminal title="vite.config.ts" highlight="2,6-7"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```
:::

:::grid{cols="2" step="true" gap="16"}
:step-brackets[04]{title="显示行号的 Terminal"}

通过 `linenos` 属性让 terminal 显示行号。

---

```bash terminal title="安装依赖" linenos highlight="2"
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```
:::

---

### Checkbox 复选框

::::tabs
 tab: 演示效果

:checkbox[默认未选中]
:checkbox[已选中]{checked="true"}
:checkbox[绿色已选中]{checked="true" color="green"}
:checkbox[紫色加号]{checked="true" color="purple" symbol="plus"}
:checkbox[红色减号]{checked="true" color="red" symbol="minus"}
:checkbox[青色叉号]{checked="true" color="cyan" symbol="times"}

行内用法：:checkbox[行内复选框]{inline="true" checked="true"}

 tab: 示例代码

`````markdown
:checkbox[默认未选中]
:checkbox[已选中]{checked="true"}
:checkbox[绿色已选中]{checked="true" color="green"}
:checkbox[紫色加号]{checked="true" color="purple" symbol="plus"}
:checkbox[红色减号]{checked="true" color="red" symbol="minus"}
:checkbox[青色叉号]{checked="true" color="cyan" symbol="times"}

行内用法：:checkbox[行内复选框]{inline="true" checked="true"}
`````

- 默认独占一行（块级），添加 `inline="true"` 可在段落中内联使用
- `:checkbox` 的 `checked` 为 `true` 时显示选中态
- `:checkbox` 的 `symbol` 可选值：`plus`、`minus`、`times`
- `color` 支持 `blue`、`green`、`red`、`cyan`、`purple`、`orange` 等或任意色值

::::

---

### Radio 单选按钮

::::tabs
 tab: 演示效果

:radio[单选未选中]
:radio[单选已选中]{checked="true"}
:radio[单选橙色]{checked="true" color="orange"}

行内用法：:radio[行内单选]{inline="true" checked="true"}

 tab: 示例代码

 `````markdown
 :radio[单选未选中]
 :radio[单选已选中]{checked="true"}
 :radio[单选橙色]{checked="true" color="orange"}

 行内用法：:radio[行内单选]{inline="true" checked="true"}
 `````

 - 默认独占一行（块级），添加 `inline="true"` 可在段落中内联使用
 - `:radio` 的 `checked` 为 `true` 时显示选中态
 - `color` 支持 `blue`、`green`、`red`、`cyan`、`purple`、`orange` 等或任意色值

 ::::

---

### Emoji 表情包

::::tabs
 tab: 演示效果

今天是开心的一天 :emoji[aini]{source="qq"}，代码终于跑通了！:emoji[OK]{source="qq"}

Twemoji 风格的表情 :emoji[1f600]{source="twemoji"} :emoji[1f389]{source="twemoji"}

也可以直接使用默认源（省略 source）：:emoji[aini]

 tab: 示例代码

 `````markdown
今天是开心的一天 :emoji[aini]{source="qq"}，代码终于跑通了！:emoji[OK]{source="qq"}

Twemoji 风格的表情 :emoji[1f600]{source="twemoji"} :emoji[1f389]{source="twemoji"}

也可以直接使用默认源（省略 source）：:emoji[aini]
 `````

 - `:emoji` 为行内指令，可在段落中直接使用
 - `source` 表情源，可选值：
   - `qq` — QQ 表情（GIF 格式）
   - `twemoji` — Twitter Emoji（SVG 格式）
   - `aru` — Aru 表情（GIF 格式）
   - `tieba` — 贴吧表情（PNG 格式）
   - `blobcat` — Blobcat 表情（GIF 格式）
   - 省略 `source` 时自动使用 `qq` 源
 - 方括号内的内容为表情名称

::::

---


### Video 视频播放器

在文章中插入视频，支持本地视频模式。

#### 本地视频（带封面）

::::tabs
tab: 演示效果

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80" ratio="16/9"}
:::

tab: 示例代码

`````markdown
:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80" ratio="16/9"}
:::
`````

- `src`（**必填**）：视频文件地址
- `poster`：封面图
- `ratio`：宽高比，默认 `16/9`
- `title`：可选标题

::::

---

