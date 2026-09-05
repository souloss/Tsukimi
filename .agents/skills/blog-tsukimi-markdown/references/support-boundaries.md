# 支持边界与兼容性

## 判断一个名字是否可用

Markdown directive parser 会接受任意看起来像指令的名字，但这不代表主题会渲染它。判断顺序应是：

1. 看 `astro.config.mjs` 是否把对应 remark/rehype 插件装入当前 pipeline。
2. 对内容指令，同时看 `src/plugins/remark-content-directives.mjs` 的 dispatcher 分支；只出现在 `CONTENT_DIRECTIVE_NAMES` 注册表中的名字可能只是兼容或预留名称。
3. 对 `github`、`file-tree` 和图表，查看它们各自的独立处理插件。
4. 用 `pnpm check` 或生产 `pnpm build` 验证最终输出；开发占位符不等于生产失败。

## 当前可依赖的入口

| 类型 | 当前入口 | 处理方式 |
| --- | --- | --- |
| 行内 | `mark`、`kbd`、`blur`、`psw`、`u`、`wavy`、`emp`、`del`、`hashtag`、`color`、`sup`、`sub`、`checkbox`、`radio`、`step-brackets`、`emoji`、`badge`、`anno`、`abbr` | `remark-content-directives.mjs` 的 text directive 分支 |
| 叶子 | `image`、`asciinema`、`colors` | 同一插件的 leaf directive 分支；直接写属性，不接正文。`asciinema`/`colors` 也兼容空的容器写法。 |
| 容器 | 提示框、折叠、`folders`、`timeline`、`tabs`、`code-group`、`steps`、`poetry`、`copy`、`grid`、`blockquote`、`quot`、`reel`、`paper`、`gallery`、对齐、`npm-to`、`chat`、`field`、`field-group`、`code-tree`、`flex`、`bitmap` | dispatcher 的 block 分支 |
| 卡片 | `card`、`card-grid` | dispatcher 的 card 分支 |
| 媒体 | `video` | dispatcher 的 media 分支 |
| 独立处理 | `::github`、`:::file-tree`、`mermaid`/`plantuml`/`markmap`/`vega-lite`/`wavedrom`/`bytefield` fenced code | 各自的 rehype/remark 插件，不要按普通内容指令推断参数 |

上表中的“提示框”具体包含 `callout`、`note`、`info`、`tip`、`warning`、`caution`、`important`、`question`、`quote`、`bug`、`example`、`success`、`failure`、`danger`；折叠包含 `folding`、`collapse`、`details`。

## 不要依赖的名称

以下名称可能仍出现在注册表、旧文章或兼容代码中，但当前没有可依赖的渲染分支：

| 名称 | 原因/替代 |
| --- | --- |
| `:::panel` | 旧文档示例，当前 dispatcher 和兼容列表都没有 panel 处理；用 `:::card`、`:::grid` 或 `:::details`。 |
| `:::audio` | 注册表保留名称，没有 media 分支；当前只有 `:::video`。 |
| `:::private` | 没有加密/权限渲染分支；文章加密应使用 frontmatter 的 `encrypted`/`password`。 |
| `:::ghcard` | 不等于 GitHub 卡片；使用独立叶子指令 `::github{repo="owner/repo"}`。 |
| `:::sites`、`:::banner`、`:::yoicard`、`:::link` | 注册表中的兼容/预留名称，当前没有对应内容组件；普通链接用 Markdown，布局用 `card`/`grid`。 |
| `:button[]`、`:btn[]` | 行内注册名没有处理分支；不要把它们当作按钮 API。 |
| `:annotation[]` | Plume 兼容代码能识别旧写法，但当前内容 dispatcher 没有 `annotation` 分支；使用 `:anno[]`。 |
| `:::important{icon=...}` 等旧 icon 参数 | 当前提示框只可靠支持类型、标题和语义色；`icon` 不会按旧文档生成自定义图标。 |

“注册表中存在”与“页面能看见主题组件”是两件事。未知指令通常会被当作原生标签或未处理节点，可能静默消失、显示无样式内容，不能当作降级方案。

## `github` 与 `file-tree` 的特例

GitHub 卡片必须是叶子指令，且 `repo` 必须是 `owner/repo`：

```markdown
::github{repo="souloss/Tsukimi"}
```

页面端会请求 `api.github.com`，因此受网络、速率限制和仓库可见性影响；不要把它写成 `:::github` 容器，也不要在仓库名中放任意 URL。

`file-tree` 由独立插件把无序列表转换成静态 HTML 文件树，支持差异标记和行尾注释，但不读取磁盘。需要展示真实源码时使用 `:::code-tree`。

## 开发、生产和兼容层

- Mermaid、PlantUML、Markmap、Vega-Lite 在开发环境可能输出占位符或延迟加载，生产构建/预览才是最终视觉结果。
- WaveDrom 和 Bytefield 在构建期生成 SVG；解析错误应视为构建问题，不要用任意 fenced code 语言假装成功。
- `remark-plume-compat.js` 只负责少量旧 Plume 写法的 AST 修复（如旧折叠、标签和括号注释），不是新的公共 API。新文章统一使用本 skill 的 canonical 语法。
- 旧文档 `src/content/docs/tsukimi/press/Markdown/directives.md` 与示例文章可能包含历史名称或参数；发生冲突时以当前插件分支和构建结果为准。

## 反馈和维护

新增或修改指令时，必须同时检查：

- `CONTENT_DIRECTIVE_NAMES` 是否需要更新；
- dispatcher 的实际处理分支和属性清洗；
- `astro.config.mjs` 的插件顺序；
- `src/content/posts/markdown-extended.md` 的最小示例；
- 本 skill 中对应的 reference 和支持边界。

不要把整篇示例复制到 skill。只保留最小语法，并用标题或 `rg -n` 定位完整示例。
