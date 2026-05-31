---
title: 相对链接解析
createTime: 2025/08/17 17:21:41
permalink: /press/markdown/relative-links/
order: 6
icon: ri:link
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 相对链接解析插件

Mizuki 内置了 `remark-relative-links` 插件，可以自动将 Markdown 文章中的相对文件链接转换为正确的 URL 链接。

### 功能说明

当你在文章中引用其他文章时，可以使用相对路径链接，插件会自动：

1. 解析目标文章的 frontmatter 中的 `slug` 字段
2. 根据目录结构生成正确的 URL
3. 保留锚点链接（#section）
4. 缓存解析结果以提高构建速度

### 使用示例

```markdown
---
title: 我的文章
slug: my-article
---

请参考 [上篇文章](./previous-post.md)

或查看 [高级配置部分](./advanced.md#config)
```

插件会将这些链接转换为：

- `./previous-post.md` → `/posts/my-category/previous-post/`
- `./advanced.md#config` → `/posts/my-category/advanced/#config`

### 工作原理

1. **路径解析**：从当前文章路径出发，解析相对路径到目标文件的绝对路径
2. **Slug 提取**：读取目标文件的 frontmatter，提取 `slug` 字段
3. **URL 构建**：根据目录结构和 slug 生成最终的 URL
4. **缓存优化**：相同的路径只解析一次，提高构建性能

### 注意事项

- 只处理以 `./` 或 `../` 开头的相对链接
- 只处理 `.md`、`.mdx`、`.markdown` 后缀的文件链接
- 如果目标文件没有 `slug` 字段，会使用文件名（不含后缀）作为默认 slug
- 如果目标文件不存在或无法读取，链接保持原样不变

### 相关配置

此插件无需额外配置，已集成到 Astro 的 Markdown 处理流程中。
