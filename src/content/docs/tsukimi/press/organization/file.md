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

这是在Mizuki博客系统中创建文章的两种方法之一。这种方法适用于简单的文章，不需要管理大量图片资源的情况。
单文件方案会导致RSS无法正常构建图片的路径(指本地,如果你使用图床那么不会有这个问题),如果你需要使用rss功能请使用文件夹写作方案

## 创建文章

1. 在`src/content/posts`目录下创建一个新的Markdown文件，文件名应该具有描述性，例如`my-first-post.md`。

2. 在文件中添加frontmatter（前置元数据），这是文章的配置信息，必须包含`title`和`description`字段：

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
date: 2025-01-20
image: "./cover.png"
pubDate: 2025-01-20
permalink: "encrypted-example"
---
```

## Frontmatter字段详解

frontmatter支持的字段包括：

### 必需字段
- `title`：文章标题（必需）
- `published`：文章发布日期，格式为YYYY-MM-DD

### 发布相关
- `draft`：是否为草稿，true表示草稿，false表示正式发布
- `updated`：文章最后更新日期（格式同 published），配合 `siteConfig.showLastModified` 显示"上次编辑"信息
- `pinned`：是否置顶文章，true表示置顶
- `priority`：文章排序优先级，数字越大越靠前
- `permalink`：自定义固定链接，优先级高于 alias
- `slug`：URL 路径中的简短文本标识，只覆盖文件名部分
- `alias`：别名路径，用于旧 URL 重定向
- `redirect`：跳转到外部/静态资源页面

### 内容分类
- `tags`：文章标签数组，用于标记文章主题
- `category`：文章分类，用于组织文章
- `series`：专栏/系列名称
- `seriesOrder`：在系列中的排序位置，默认 0

### 作者信息
- `author`：文章作者姓名
- `licenseName`：文章许可证名称，如"MIT"、"CC BY 4.0"等
- `licenseUrl`：文章许可证 URL
- `sourceLink`：文章源链接，通常指向GitHub仓库或原始来源
- `copyright`：版权许可类型，支持 `"CC BY"`, `"CC BY-SA"`, `"CC BY-ND"`, `"CC BY-NC"`, `"CC BY-NC-SA"`, `"CC BY-NC-ND"`, `"CC0"`, `"ARR"`

### 图片设置
- `image`：文章封面图片
- `ogDescription`：自定义 OG 描述文本，覆盖默认生成的 OG 图片描述

### 语言设置
- `lang`：单篇文章的语言覆盖，如 `"en"`, `"zh_CN"`, `"ja"`

### 评论设置
- `comment`：是否在文章详情页显示评论区，默认 true

### 加密设置
- `encrypted`：是否启用文章加密，true 时文章内容需要密码才能查看
- `password`：加密密码
- `passwordHint`：密码提示文字
- `hideHomeContent`：是否在首页隐藏文章内容摘要

### 转载设置
- `repost`：转载文章配置对象
  - `repost.originalAuthor`：原作者姓名
  - `repost.originalUrl`：原文 URL
  - `repost.originalTitle`：原文标题（可选）
  - `repost.originalSite`：原站点名称（可选）
  - `repost.redirect`：是否重定向到原文（可选）

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
date: 2025-01-20
pubDate: 2025-01-20
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
date: 2025-01-20
image: 'https://example.com/vue3-cover.jpg'
pubDate: 2025-01-20
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

- 文件名将被用作文章的URL路径，所以应该具有描述性且不含特殊字符
- frontmatter中的`date`字段是可选的，如果不提供，系统会使用文件的创建日期
- 这种方法适合简单的文章，但如果文章包含大量图片，建议使用子文件夹方案