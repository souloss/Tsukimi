# Tsukimi Markdown 参考索引

这是 skill 的二级路由。只读取与当前文章任务相关的参考文件；各文件给出“何时用、最小语法、参数和边界”，而不是复制完整教程。

## 按任务读取

| 任务 | 参考文件 | 源码依据 |
| --- | --- | --- |
| frontmatter、摘要、文章 URL、加密和转载 | [frontmatter.md](frontmatter.md) | `src/content.config.ts`、`src/utils/url-utils.ts` |
| 所有块级容器、卡片、布局、媒体指令 | [block-directives.md](block-directives.md) | `src/plugins/remark-content-directives.mjs` |
| 行内标记、遮罩、注释、状态和 emoji | [inline-directives.md](inline-directives.md) | `src/plugins/remark-content-directives.mjs` |
| 代码块元信息、折叠、别名和六类图表 | [code-and-diagrams.md](code-and-diagrams.md) | `astro.config.mjs`、`src/plugins/remark-*.js`、`src/plugins/rehype-*.mjs` |
| 普通图片、图片宽度、懒加载、include、相对链接、表格和摘要 | [media-and-markdown.md](media-and-markdown.md) | `src/plugins/remark-include.mjs`、`remark-relative-links.mjs`、`rehype-*.mjs` |
| 旧文档与当前实现的差异、不能依赖的名字 | [support-boundaries.md](support-boundaries.md) | `remark-content-directives.mjs` 的注册表和 dispatcher |

## “该引用哪个指令”速查

| 文章内容 | 推荐指令/语法 | 示例文章位置 |
| --- | --- | --- |
| GitHub 仓库信息 | `::github{repo="owner/repo"}` | `markdown-extended.md`：`## GitHub 仓库卡片` |
| 一般说明或风险 | `:::note`、`:::info`、`:::tip`、`:::warning`、`:::caution`、`:::important`、`:::danger` | `markdown-extended.md`：`## 提示框` |
| 问题、引用、缺陷、示例、成败状态 | `:::callout{type="question|quote|bug|example|success|failure"}` | `markdown-extended.md`：`## 提示框` |
| 可展开的附加内容 | `:::details` / `:::folding` / `:::collapse` | `markdown-extended.md`：`## 折叠块` |
| 多个可独立展开的章节 | `:::folders`，每项用 `folder: 标题` | `markdown-extended.md`：`### 多级折叠` |
| 同一内容的工具/语言切换 | `:::code-group` | `markdown-extended.md`：`## 代码分组` |
| 非代码的多个视角或方案 | `:::tabs`，用 `[标签]` 或 `tab: 标签` | `markdown-extended.md`：`## 选项卡` |
| 线性操作步骤 | `:::steps` + 有序列表 | `markdown-extended.md`：`## 步骤` |
| 事件顺序或版本演进 | `:::timeline` + `- 日期 | 标题 | 描述` | `markdown-extended.md`：`## 时间线` |
| API/config 字段 | `:::field` / `::::field-group` | `markdown-extended.md`：`## 字段文档` |
| 项目文件与对应源码 | `:::code-tree` + `title="路径"` 代码块，或 `dir="目录"` | `markdown-extended.md`：`## 代码树` |
| 只展示项目结构 | `:::file-tree` + 无序列表 | `markdown-extended.md`：`## 文件树` |
| 卡片、并列信息、响应式布局 | `:::card`、`::::card-grid`、`::::grid`、`::::flex`、`::::reel` | `markdown-extended.md`：`## 卡片`、`## 网格`、`## 弹性布局`、`## 胶卷` |
| 长引用或紧凑引言 | `:::blockquote` / `:::quot` | `markdown-extended.md`：`## 引用` |
| 诗歌、信件、分区文稿 | `:::poetry` / `:::paper` | `markdown-extended.md`：`## 诗歌`、`## 纸张` |
| 复制命令或密钥 | `:::copy` | `markdown-extended.md`：`## 复制` |
| 对话记录或消息气泡 | `:::chat` | `markdown-extended.md`：`## 对话` |
| 图片集合 | `:::gallery` + Markdown 图片 | `markdown-extended.md`：`## 画廊` |
| 单图需要显式尺寸/alt | `::image{src="..." alt="..."}` | `markdown-extended.md`：`## 图片指令` |
| 视频 | `:::video{src=...}`、`{bilibili=...}` 或 `{youtube=...}` | `markdown-extended.md`：`## 视频播放器` |
| 终端回放、色板、像素图 | `:::asciinema`、`:::colors`、`:::bitmap` | `markdown-extended.md`：`## 终端录制`、`## 色板`、图表章节 |
| 句内强调或补充解释 | 行内指令；优先 [inline-directives.md](inline-directives.md) | `markdown-extended.md`：`## 内联指令` |
| Mermaid/UML/思维导图/数据图 | fenced code block 的图表语言 | `markdown-extended.md`：`## 图表与数学公式` |

## 当前源码的关键位置

- 内容指令注册表：`src/plugins/remark-content-directives.mjs:37`。它还保留若干兼容/预留名称，不能单独当作“可用 API”清单。
- 块级 dispatcher：`src/plugins/remark-content-directives.mjs:3386`；这里的 `blockNames`、`cardNames`、`mediaNames` 才决定哪些容器真正进入处理分支。
- 行内处理：`src/plugins/remark-content-directives.mjs:836`。
- `:::file-tree` 独立于内容指令插件，由 `src/plugins/rehype-file-tree.mjs` 及其 remark 解析部分处理。
- `::github` 由 `src/plugins/rehype-component-github-card.mjs` 通过 `rehype-components` 注册，不在内容指令 dispatcher 中。
- 图表和 Markdown 增强插件的组装位置：`astro.config.mjs:193`。
- 完整可视化示例：`src/content/posts/markdown-extended.md`。按标题检索需要的小节即可，例如：

```bash
rg -n '^## |^### ' src/content/posts/markdown-extended.md
```

## 维护规则

当指令实现发生变化，先更新对应源码，再同步修改本 skill 的单个 reference；不要把整篇示例文章复制进 `SKILL.md`。如果文档和源码冲突，以源码处理分支和实际构建结果为准，并在 [support-boundaries.md](support-boundaries.md) 留下差异说明。
