# 块级指令与内容组件

块级容器的基本形状是：

````markdown
:::name{key="value"}
内容（可继续使用 Markdown）
:::
````

外层包含另一个容器时，多加一层冒号，例如 `::::card-grid` 包含 `:::card`。不要把结束标记写进代码块或正文行。除非本文件特别说明，属性没有必填项时可以省略；属性值含空格时使用双引号。

## 提示框

### 选择

提示框用于让读者在正文流中快速识别“需要注意什么”，不要把整段论证都包成提示框。直接使用类型名最清楚：

```markdown
:::note
补充说明。
:::

:::tip{title="小技巧"}
一个可选但有用的建议。
:::

:::warning
潜在风险。
:::
```

支持的类型为 `note`、`info`、`tip`、`warning`、`caution`、`important`、`question`、`quote`、`bug`、`example`、`success`、`failure`、`danger`。也可以用通用形式：

```markdown
:::callout{type="question" title="为什么这样做？"}
回答或思考过程。
:::
```

| 属性 | 适用范围 | 行为 |
| --- | --- | --- |
| `type` | `:::callout` | 选择上表中的类型；`warn` 是 `warning` 的别名，未知值回退为 `info`。 |
| `title` | 所有提示框 | 覆盖默认标题。 |
| `color` | 主要用于 `note` | 使用命名色或 CSS 色值覆盖主题色；其他类型使用其固定语义色。 |

GitHub alert 也会自动转换，但只支持 `NOTE`、`TIP`、`IMPORTANT`、`WARNING`、`CAUTION`：

```markdown
> [!NOTE]
> 这段内容会被转换为 note 提示框。
```

## 折叠内容

### 单个详情块

`details`、`folding`、`collapse` 是同一个折叠组件的别名。适合放可选背景、长日志或不希望打断主线的推导：

```markdown
:::details{title="展开查看" open="true" color="accent"}
默认展开的内容。
:::
```

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `title` | `Details` | 折叠标题。 |
| `open="true"` | 关闭 | 默认展开；空属性 `{open}` 也会被视为开启。 |
| `color` | `accent` | 命名色或安全的 CSS 色值。 |

### 多个面板

`folders` 按 `folder: 标题` 段落切分内容，每个标题后的内容属于该面板；第一个面板默认展开。添加 `accordion="true"` 后同一时间只展开一个：

```markdown
:::folders{accordion="true"}
folder: 安装

运行 `pnpm install`。

folder: 配置

编辑配置文件。
:::
```

`folder:` 必须单独作为一段的开头，标题后可继续使用列表、代码块和链接。

## 选项卡与代码分组

### 非代码选项卡

`tabs` 适合并列方案、环境、视角或结果；标签可以用 `[标签]` 或 `tab: 标签` 定义：

````markdown
:::tabs{align="center" sync="package"}
[pnpm]

`pnpm add astro`

tab: npm{color="orange"}

`npm install astro`
:::
````

| 属性/语法 | 说明 |
| --- | --- |
| `[标签]` | 开启一个标签，标签后的同段内容属于该标签。 |
| `tab: 标签` | 开启一个标签；推荐在 `tab:` 后留空格。 |
| `tab: 标签{color="..."}` | 设置当前标签的激活色。 |
| `align` | `left`、`center` 或 `right`。 |
| `sync` | 相同字符串的多个 `tabs` 组联动切换；不需要联动时省略。 |

### 代码选项卡

`code-group` 只用于同一功能的不同语言或包管理器：

````markdown
:::code-group
```bash [npm]
npm install package
```

```bash [pnpm] :active
pnpm add package
```
:::
````

代码块元信息中的 `[标签]` 是标签名；省略时使用语言名。`:active` 可指定默认激活项，省略则激活第一个。不要用 `code-group` 并列不同概念的代码。

### npm 命令转换

`npm-to` 可以把一条 npm 命令生成 npm、pnpm、yarn、bun 四种版本：

```markdown
:::npm-to{package="astro" tabs="npm,pnpm,yarn,bun"}
:::
```

`package` 省略时，可在容器正文放一个代码块或命令文本；转换器会处理 `npm install`、`npm install -D`、`npm run`、`npm init`、`npm create`、`npx`、`npm uninstall`、`npm ci` 等常见形式。`tabs` 只接受 `npm`、`pnpm`、`yarn`、`bun`，会去重；默认是四者。

### 复制

`copy` 从正文中的代码块（存在时）或文本提取内容，生成带复制按钮的区域：

````markdown
:::copy{title="安装命令"}
```bash
pnpm add @astrojs/svelte
```
:::
````

`label` 和 `title` 都可作为标题；没有标题也可以使用。复制内容应是一条完整命令、短配置或密钥提示，不要把大段文章塞进输入框。

### 对话

`chat` 把每个正文段落按发送者转换为对话气泡，支持标题、日期分隔和连续消息：

```markdown
:::chat{title="Tsukimi 功能咨询"}
{:2025-06-17 14:30}

{.} 你好！Tsukimi 支持哪些功能？

{对方} 它支持 Markdown 扩展指令。

{.} 如何开始？
:::
```

| 标识 | 行为 |
| --- | --- |
| `{.}` 或 `[自己]` | 右侧自己的气泡。 |
| `{用户名}` 或 `[用户名]` | 左侧气泡并显示用户名。 |
| `{:日期时间}` | 居中的日期分隔线；`{:date}` 为空日期分隔线。 |
| `title` | 对话框标题，可选。 |

每个发送者标识应单独占一行或段落；后续普通段落会沿用最近一次发送者。对话内容会提取为纯文本，复杂 Markdown 不会保留。

## 步骤、时间线和字段

### 步骤

`steps` 把有序列表转成带编号的步骤。列表项的第一段是标题，后续缩进内容是步骤正文：

````markdown
:::steps
1. 安装依赖

   运行 `pnpm install`。

2. 启动项目

   ```bash
   pnpm dev
   ```
:::
````

渲染时会重新编号；列表项中的数字只用于解析顺序。

### 时间线

`timeline` 适合版本演进、事件记录和日期序列。推荐使用三个竖线字段：

```markdown
:::timeline
- 2026-01 | 项目启动 | 完成基础架构
- 2026-03 | 首次发布 | 开放公开访问
:::
```

格式为 `日期 | 标题 | 描述`；也兼容 `日期 标题`。时间线内容按纯文本提取，复杂 Markdown 不会保留为富文本。

### 字段文档

`field` 用于 API/config 字段，`field-group` 用于把多个字段放入同一组。字段名可以放在 `{}` 中，元数据推荐写成正文中的独立行：

````markdown
::::field-group
:::field{port}
@type number
@required
@default 3000
@description 监听端口。
:::

:::field{name="host"}
@type string
@optional
@default "localhost"
@description 绑定地址。
:::
::::
````

支持的元数据为 `@type`、`@required`、`@optional`、`@default`、`@deprecated`、`@description`。也可以使用 `:::field{title="字段名"}`，但不要同时提供互相冲突的 `name`、`title` 和裸属性；源码会选择第一个可识别名称。

## 布局、卡片和引用

### 网格

`grid` 把内容按 `---` 或直接子指令切成单元格。适合少量并列比较，不要用它替代长列表：

````markdown
::::grid{cols="2" gap="16" minw="240px" bg="card"}
**左列**

说明。

---

**右列**

说明。
::::
````

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `cols` | 自动 | 固定列数，范围 `1`–`12`；未设置时按 `minw` 自动换列。 |
| `gap` | `16px` | 数字按 px 处理，也接受 `rem`、`em`、`%`、`vw`、`vh`、`ch`。 |
| `minw` | `240px` | 自动布局时的最小列宽。 |
| `bg` | `card` | `card`、`box` 或 `none`。 |

### 弹性布局

`flex` 适合少量需要主轴/交叉轴控制的内容：

```markdown
::::flex{justify="center" align="center" gap="1rem"}
:::card{title="A"}
项目 A
:::
:::card{title="B"}
项目 B
:::
::::
```

| 属性 | 可选值/别名 | 说明 |
| --- | --- | --- |
| `column` | `true` | 改为纵向排列。 |
| `justify` / `main` | `start`、`center`、`end`、`between`、`around`、`evenly` | 主轴对齐。 |
| `align` / `cross` | `start`、`center`、`end`、`stretch`、`baseline` | 交叉轴对齐。 |
| `gap` | CSS 长度 | 默认 `1rem`。 |

### 卡片

`card` 是单个卡片；`card-grid` 是响应式卡片集合：

```markdown
::::card-grid
:::card{title="Tsukimi" icon="lucide:moon" color="#4a7c59" href="https://github.com/souloss/Tsukimi"}
卡片正文。
:::
::::
```

| `card` 属性 | 默认/说明 |
| --- | --- |
| `title` | 卡片标题，可选。 |
| `icon` | 建议使用源码中已有的 `lucide:名称`，如 `lucide:moon`、`lucide:star`；未知图标会退化为文字。 |
| `color` | 图标和主题色，默认 `accent`；可用命名色或 CSS 色值。 |
| `href` | 链接地址；设置后卡片整体为新窗口链接。 |
| `image` / `cover` | 与 `href` 同时设置时生成带封面的链接卡片。 |
| `desc` / `description` | 链接卡片的描述文字。 |

`card-grid` 没有额外属性。外层和内层卡片使用不同冒号层级，避免结束标记提前闭合。

### 对齐、卷轴和纸张

- `:::left`、`:::center`、`:::right`、`:::justify`：只改变内部内容对齐方式，无额外属性。
- `reel`：水平滚动容器；可设置 `title`、`author`、`date`、`footer`，常与 `card` 组合。
- `paper`：纸张风格容器；可设置 `style`、`title`、`author`、`date`、`footer`。`style` 只接受安全的类名 token，不是任意 CSS。

`paper` 正文可用注释切分：`<!-- paragraph -->`、`<!-- section 标题 -->`、`<!-- line right -->`。这些注释是布局标记，不会作为正文显示。

### 引用

```markdown
:::blockquote
适合多段落的长引用，内部仍可使用 Markdown。
:::

:::quot{icon="lucide:quote"}
适合一句话的紧凑引言。
:::
```

`blockquote` 默认带装饰引号；`quot` 将正文提取为纯文本。`icon` 可用 `lucide:名称`、`fa7-solid:quote-left`、裸图标名或 `http(s)` 图片 URL；省略时使用默认引号图标。

### 诗歌

`poetry` 适合诗歌、歌词或需要保留段落节奏的文本：

```markdown
:::poetry{title="标题" author="作者" date="2026" footer="注释"}
第一行。

第二行。
:::
```

`title`、`author`、`date`、`footer` 均可选。

## 代码树

`code-tree` 把多个带路径标题的代码块组合成左侧文件树和右侧代码面板：

````markdown
:::code-tree{title="项目" entry="src/main.ts" height="480px"}
```ts title="src/main.ts" :active
export const app = "hello";
```

```ts title="src/utils.ts"
export function helper() {}
```
:::
````

| 属性 | 说明 |
| --- | --- |
| `title` | 文件树标题。 |
| `entry` | 默认激活的文件路径，必须与代码块的 `title` 完全一致。 |
| `height` | 容器高度，如 `480px`；不设置时使用主题默认高度。 |
| `dir` | 从项目根目录（构建时的 `process.cwd()`）递归导入目录下文件；跳过隐藏文件和 `node_modules`。 |
| `:active` | 写在代码块元信息中，指定默认激活文件。 |

代码块的 `title` 用 `/` 分隔即可形成文件夹层级。`dir` 会把真实文件内容带入页面，使用前确认目录范围、文件体积和敏感信息。

## 文件树

`file-tree` 由独立的文件树插件处理，内容必须是一个 Markdown 无序列表。文件夹以 `/` 结尾，子列表表示层级：

```markdown
:::file-tree
- src/
  - components/
    - Header.astro
  - config.ts
- public/
  - favicon.svg
- ++ README.md
- -- CHANGELOG.md
- package.json # 项目根配置
- ...
:::
```

列表语法：

| 写法 | 行为 |
| --- | --- |
| `- folder/` | 可折叠文件夹；嵌套列表成为子节点。 |
| `- file.ext` | 文件节点，图标按文件名/扩展名选择。 |
| `- ++ file` | 新增差异标记。 |
| `- -- file` | 删除差异标记；不要让 smartypants 把两个连字符改成破折号。 |
| `- name # comment` | 文件或文件夹的行尾注释。 |
| `- ...` | 省略号节点。 |

文件树只展示你在文章中列出的结构，不会读取磁盘；要展示真实文件内容请改用 `:::code-tree{dir="..."}`。

## 媒体与实用容器

### 视频

`video` 三选一提供 `src`、`bilibili` 或 `youtube`：

```markdown
:::video{src="/media/demo.mp4" poster="/images/demo.webp" ratio="16/9"}
:::

:::video{bilibili="BV1uT4y1P7CX" ratio="16/9"}
:::

:::video{youtube="dQw4w9WgXcQ" autoplay="true"}
:::
```

| 属性 | 说明 |
| --- | --- |
| `src` | 本地或可访问的视频 URL；可配 `poster`。 |
| `bilibili` | BV 号，可省略 `BV` 前缀。 |
| `youtube` | YouTube 视频 ID。 |
| `poster` | 仅 `src` 模式使用的封面图。 |
| `ratio` | 宽高比，默认 `16/9`；非法值回退为该比例。 |
| `width` | CSS 宽度。 |
| `align` | `left`、`center`、`right`。 |
| `autoplay` | `true` 时自动播放；播放器会同时静音。 |
| `pip` | `manual` 显示画中画按钮；其他值为默认自动模式。 |

缺少三种来源时只会渲染提示文字。外部视频还受浏览器、平台和网络策略影响。

### 图片、画廊和终端

```markdown
::image{src="/images/cover.webp" alt="封面" width="480" height="270"}

:::gallery{cols="3" gap="8"}
![图片一](/images/one.webp)
![图片二](/images/two.webp)
:::

:::asciinema{src="/demos/demo.cast" cols="80" rows="24"}
:::
```

- `::image` 是叶子指令，`src`、`alt`、`width`、`height` 是直接传给图片元素的属性；不要在它后面写正文。
- `gallery` 只收集内部的 Markdown 图片；`cols` 范围 `1`–`8`，默认 `3`；`gap` 默认 `8px`。
- `asciinema` 的 `src` 必填；`cols` 默认 `80`、范围 `1`–`500`，`rows` 默认 `24`、范围 `1`–`200`。它也接受无正文的叶子写法 `::asciinema{src="..."}`；`colors` 同样可写成 `::colors{values="..."}`。

### 色板与像素图

````markdown
:::colors{values="#ef4444,#22c55e,blue"}
:::

:::bitmap{scale="8" palette="#0f172a #38bdf8" title="像素图"}
```text
..##..
.####.
..##..
```
:::
````

`colors` 的 `values` 是逗号分隔的颜色值。`bitmap` 中空格和 `.` 表示透明，其余字符按首次出现顺序分配 `palette`；常用属性为 `scale`（`1`–`32`，默认 `8`）、`palette`、`color`、`background`、`title`/`alt`。位图最大宽高各为 256 个字符。
