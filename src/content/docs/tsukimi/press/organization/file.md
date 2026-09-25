---
title: 单文件方案
createTime: 2025/09/01 20:29:52
permalink: /press/organization/file/
order: 1
icon: ri:file-text-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---
# 直接在posts目录创建文章

这是在 Tsukimi 中创建文章的两种方法之一，适合正文和资源结构相对简单、希望直接管理 Markdown 文件的场景。根目录文章中的本地图片也可由 RSS 处理；发布前建议检查生成的 `/rss.xml`，确认目标托管路径下的图片 URL 可访问。

## 创建文章

1. 在`src/content/posts`目录下创建一个新的Markdown文件，文件名应该具有描述性，例如`my-first-post.md`。

2. 在文件中添加 Frontmatter（前置元数据）；必须包含 `title` 和 `published`，`description` 可选：

```markdown
---
title: Markdown Tutorial
published: 2025-01-20
pinned: true
description: A simple example of a Markdown blog post.
tags: [Markdown, Blogging]
category: Examples
licenseName: "Unlicensed"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false
image: "./cover.png"
permalink: "/articles/markdown-tutorial/"
---
```

## Frontmatter字段详解

Frontmatter 字段、默认值、路由优先级、转载、加密、数学公式和版权行为统一见[文章 Frontmatter 参考](/docs/tsukimi/press/article-types/frontmatter/)。`permalink` 指向站点根路径；`slug` 与 `alias` 的行为不同，设置前请先阅读固定链接说明。

3. 在frontmatter下方编写文章内容，可以使用标准的Markdown语法。

## Markdown学习资源

如果您还不熟悉Markdown语法，建议先学习基础知识：

📚 **推荐学习地址**：[菜鸟教程 - Markdown教程](https://www.runoob.com/markdown/md-tutorial.html)

这个教程涵盖了：
- Markdown基本语法
- 标题、段落、换行
- 字体样式（粗体、斜体等）
- 列表、链接、图片
- 代码块、表格
- 高级功能

掌握这些基础语法后，您就可以轻松编写美观的博客文章了！

## Frontmatter最佳实践

### 日期格式
建议使用ISO 8601格式（YYYY-MM-DD）来设置日期：
```yaml
published: 2025-01-20
updated: 2025-02-01
```

### 标签和分类
- 标签应该具体且相关，避免过于宽泛
- 分类用于高级组织，通常比标签更宽泛
- 示例：
```yaml
tags: [Vue.js, JavaScript, Frontend, Tutorial]
category: Web Development
```

### 草稿管理
使用`draft`字段来管理文章状态：
- `draft: true` - 文章不会在生产环境中显示
- `draft: false` - 文章正常发布

### 许可证设置
常见的许可证名称：
- "MIT"
- "Apache-2.0"
- "CC BY 4.0"
- "CC BY-SA 4.0"
- "Unlicensed"

### 完整示例
```markdown
---
title: "Vue.js 3 组合式API完全指南"
published: 2025-01-20
pinned: false
description: "深入了解Vue.js 3的组合式API，包括setup函数、响应式系统和生命周期钩子。"
tags: [Vue.js, JavaScript, Frontend, API]
category: "Web Development"
licenseName: "CC BY 4.0"
author: "张三"
sourceLink: "https://github.com/zhangsan/vue3-guide"
draft: false
image: 'https://example.com/vue3-cover.jpg'
---

# Vue.js 3 组合式API完全指南

在这篇文章中，我们将深入探讨Vue.js 3的组合式API...
```

## 预览文章

保存文件后，可以在浏览器中预览文章。将文章文件名（不包括.md扩展名）拼接到预览URL的末尾即可查看。
例如，如果本地开发服务器运行在`http://localhost:4321/`，文章文件名为`my-first-post.md`，则可以通过`http://localhost:4321/posts/my-first-post`访问文章。

如果文章尚未创建或文件名错误，页面将显示404错误。当你预览一个尚未创建的文章时，控制台会显示不同的输出，这有助于进行故障排查。

## 链接到文章

要在博客页面或其他页面中链接到你的文章，可以使用标准的HTML `<a>` 标签：

```html
<a href="/posts/my-first-post/">我的第一篇文章</a>
```

确保链接的href属性指向正确的文章路径。

## 添加图片

如果需要在文章中添加图片，可以将图片文件放在`public`目录下，然后在文章中通过相对路径引用：

```markdown
![图片描述](/images/my-image.webp)
```

## 创建多篇文章

你可以在`src/content/posts/`目录下创建多个Markdown文件，每个文件代表一篇文章。例如：

::: file-tree

- src
  - content
    - posts
      - my-first-post.md
      - my-second-post.md
      - my-third-post.md

:::

每篇文章都是一个独立的Markdown文件，文件名将被用作文章的URL路径。

## 链接多篇文章

要在博客页面中链接到多篇文章，可以创建一个文章列表：

```html
<ul>
  <li><a href="/posts/my-first-post/">我的第一篇文章</a></li>
  <li><a href="/posts/my-second-post/">我的第二篇文章</a></li>
  <li><a href="/posts/my-third-post/">我的第三篇文章</a></li>
</ul>
```

确保每个链接都指向正确的文章路径。

## 注意事项

- `published` 是必填日期；如需标记最后修改时间，使用可选的 `updated`。`date` 和 `pubDate` 不是当前文章 schema 字段。
- 默认文章路径根据文件名生成；Frontmatter 中的 `permalink`、`slug` 或 `alias` 会按优先级改变文章 URL。
- 这种方法适合简单的文章；如果文章包含大量图片，建议使用子文件夹方案。
