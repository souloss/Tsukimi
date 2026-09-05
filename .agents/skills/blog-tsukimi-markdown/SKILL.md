---
name: blog-tsukimi-markdown
description: "在 Tsukimi 博客中创建或编辑 Markdown/MDX 文章时，按当前源码选择可用的 frontmatter、块级与行内指令、代码块、图表和媒体语法，并按需读取对应参考。不要用于修改主题组件或泛化写作风格。"
metadata:
  short-description: "Tsukimi 文章语法与组件选择"
---

# Tsukimi 博客写作

这个 skill 只约束文章内容层。文章放在 `src/content/posts/`，可以是 `.md` 或 `.mdx`；这些指令由主题的 Markdown pipeline 处理，不需要在文章中 `import` 组件，也不需要把文章改成 MDX 组件调用。

## 先按意图选语法

| 想表达的内容 | 优先选择 | 读取 |
| --- | --- | --- |
| 新建文章或修正文章元数据 | 普通 YAML frontmatter | [frontmatter.md](references/frontmatter.md) |
| 风险、说明、建议、问答 | `:::note` / `:::tip` / `:::warning` / `:::callout` | [block-directives.md](references/block-directives.md) |
| 隐藏次要内容或分组说明 | `:::details` / `:::folders` | [block-directives.md](references/block-directives.md) |
| 同一问题的多种方案或多语言代码 | `:::tabs` / `:::code-group` / `:::npm-to` | [block-directives.md](references/block-directives.md) |
| 步骤、时间顺序、字段定义 | `:::steps` / `:::timeline` / `:::field-group` | [block-directives.md](references/block-directives.md) |
| 卡片、并列内容、对齐或滚动展示 | `:::card` / `:::grid` / `:::flex` / `:::reel` | [block-directives.md](references/block-directives.md) |
| 句子中的强调、遮罩、注释或状态 | `:mark[]` / `:kbd[]` / `:blur[]` / `:anno[]` 等 | [inline-directives.md](references/inline-directives.md) |
| 源码、代码差异、代码树或图表 | fenced code block、`:::code-tree`、图表语言 | [code-and-diagrams.md](references/code-and-diagrams.md) |
| 图片、视频、画廊、终端录制或外部文件 | `::image` / `:::video` / `:::gallery` / `:::asciinema` / `@include` | [media-and-markdown.md](references/media-and-markdown.md) |
| 不确定某个名字是否真的可用 | 先查支持矩阵和源码 | [index.md](references/index.md)、[support-boundaries.md](references/support-boundaries.md) |

不要为了“看起来丰富”堆叠组件。能用普通 Markdown 清楚表达时，优先普通 Markdown；指令应该改变信息的结构、交互或可扫描性。

## 语法契约

- 块级容器使用 `:::name{key="value"}`，并用单独一行的 `:::` 结束；叶子指令使用 `::name{...}`。指令名、属性名使用源码中的小写形式。
- 行内指令使用 `:name[内容]{key="value"}`。`:anno[术语](解释)` 和 `:abbr[缩写](全称)` 是带圆括号说明的特例。
- 属性值含空格、`#`、`/` 或标点时加双引号；布尔开关用 `="true"` 最稳妥，源码也接受空属性（例如 `{accordion}`）。不要把任意 CSS 或 HTML 注入属性值。
- 嵌套容器要让外层使用更多冒号：例如 `::::card-grid` 包含 `:::card`，`::::grid` 包含 `:::card`。代码围栏嵌套时同样使用更长的反引号围栏。
- `:::code-group` 只放同一功能的代码变体；普通文字对比使用 `:::tabs` 或 `:::grid`。每个代码块都应标注真实语言，必要时用 `title="路径"`。
- 文章标题中不要使用行内指令：pipeline 会把标题内的 `:name[...]` 当作行内代码，以免破坏目录和锚点。
- 不要手写主题生成的 HTML、随机 ID、客户端脚本或组件 import。需要扩展能力时先确认源码是否有对应处理分支。

## 工作流程

1. 先读目标文章的 frontmatter 和相关章节，确认文章类型、语言、链接和已有指令。
2. 根据上表只读取当前任务需要的参考文件；长示例文章只定位到相关小节，不要把整篇载入上下文。
3. 用最小语法改稿。涉及外部 URL、真实仓库、命令、版本或数据时，不要编造；缺少事实就保留占位或向用户确认。
4. 完成后检查围栏配对、属性引号、嵌套冒号层级、标题内指令和 frontmatter 类型。需要确认渲染时运行 `pnpm check`；涉及构建期图表、`dir` 导入或相对链接时再运行 `pnpm build`。

## 支持边界

`src/content/posts/markdown-extended.md` 是可视化示例集合，不是唯一规范；[index.md](references/index.md) 的源码路径和 [support-boundaries.md](references/support-boundaries.md) 的边界说明优先级更高。尤其不要从旧文档直接复制 `:::panel`、`:::audio`、`:::private`、`:::ghcard`、`:::sites`、`:::banner`、`:::yoicard`、`:::link` 或 `:button` / `:btn`，它们目前没有可依赖的内容渲染分支。

这个 skill 不替代文章的选题、事实核验或写作风格规则；它只负责让生成的文章使用 Tsukimi 当前实际支持的内容语法。

## 完成前检查

- frontmatter 只有 schema 支持的字段，`title` 与 `published` 存在且类型正确。
- 每个动态指令都有明确用途；没有把不同语义的内容塞进同一个容器。
- 代码、图表、视频和外部文件的语言/URL/路径真实可用，并注明必要的上下文。
- 需要长示例时只引用 [markdown-extended.md](../../../src/content/posts/markdown-extended.md) 的对应小节；不要复制整篇示例到文章或 skill 入口。
