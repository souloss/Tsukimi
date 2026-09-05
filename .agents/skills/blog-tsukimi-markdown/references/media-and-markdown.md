# 媒体与 Markdown 增强

## 图片

普通 Markdown 图片是首选：

```markdown
![架构示意图](/images/architecture.webp "架构")
```

需要显式传入尺寸时使用叶子指令 `::image`：

```markdown
::image{src="/images/architecture.webp" alt="架构示意图" width="960" height="540"}
```

`::image` 不接正文；`src`、`alt`、`width`、`height` 直接成为图片属性。URL 会经过安全清洗，不能借此注入脚本或任意 HTML。

### 宽度和懒加载

普通图片的 alt 文本中写 `w-N%` 可设置居中宽度，并把 Markdown title 渲染成图注：

```markdown
![流程图 w-70%](/images/flow.webp "从输入到输出")
```

图片会自动获得原生 `loading="lazy"` 和 `lazy-image` 类；data URL 和已经指定 `loading` 的图片不会被覆盖。不要依赖旧文档中的 `data-lazy-src`，当前实现不再写入该属性。

## 文件包含

用 HTML 注释包含当前文章目录下的文件：

```markdown
<!-- @include: ./snippets/intro.md -->
<!-- @include: ./snippets/example.md{5-10} -->
<!-- @include: ./snippets/example.md{5-} -->
<!-- @include: ./snippets/example.md{-10} -->
<!-- @include: ./src/example.ts#region -->
```

- `*.md` 文件会去除自己的 frontmatter，再按 Markdown AST 插入正文；因此其中的指令可继续参与处理。
- 其他扩展名按原文插入为 raw HTML，不会自动变成代码块；要展示源码请配合 fenced code 或 `:::code-tree`。
- 行号范围从 `1` 开始，`{5-10}` 包含第 5 至 10 行，`{5-}` 从第 5 行到末尾，`{-10}` 取前 10 行。
- `#region` 只匹配插件支持的成对 region 注释，名称是字母数字下划线；文件读取失败时会留下 `FILE NOT FOUND` 注释，region 标记不成对时则可能得到空内容。
- 路径相对于当前文章文件，不是站点根目录；包含前先确认不会把密钥、环境文件或大文件带入输出。

## Markdown 文件链接

文章之间可使用相对 Markdown 链接：

```markdown
参见[安装指南](../guide/index.md#install)。
```

生产构建时，`./` 或 `../` 开头且扩展名为 `.md`、`.mdx`、`.markdown` 的链接会解析为文章最终 URL，并保留 `#anchor`。解析优先级是 `permalink` > `slug` > `alias` > 文件名；目标不存在或在开发环境中则保持原链接文本。链接解析不复制全局 permalink 配置，因此自定义 URL 后应在生产构建中确认。

## 表格、外部链接和缩写

- Markdown 表格会包在 `.table-wrapper` 中，以便窄屏横向滚动；仍应控制列数和单元格内容长度。
- 外部链接统一设置新窗口打开和 `nofollow noopener noreferrer`；不要在正文手写这些属性。
- 缩写定义使用独立段落 `*[缩写]: 全称`，定义会从正文移除，正文中匹配到的完整词会生成带 `title` 的 `<abbr>`：

  ```markdown
  *[AST]: Abstract Syntax Tree

  AST 用于表示文章结构。
  ```

  定义中的缩写尽量使用字母、数字和空格；代码块、行内代码和 HTML 中的文本不会按普通正文替换。

## 摘要与阅读统计

在正文中放置 `<!-- more -->` 可明确指定首页摘要边界：

```markdown
开头这段会显示在列表摘要中。

<!-- more -->

从这里开始是正文主体。
```

没有该标记时，pipeline 使用第一个非空段落作为摘要；同时会跳过代码块，按中日韩字符和非 CJK 单词估算阅读时间与字数。摘要标记只能放在文章正文顶层，不能指望它从嵌套卡片内部截断文章。

## 组合建议

- 图片说明优先普通 Markdown；需要显式尺寸才用 `::image`，需要多图浏览才用 `:::gallery`。
- `@include` 适合复用短片段或项目源码；长篇内容应拆成独立文章并使用相对链接。
- 这些增强由 Markdown pipeline 自动处理，不需要在 `.md`/`.mdx` 中 import 组件或手写生成的 HTML。
