# Frontmatter 与文章元数据

文章集合由 `src/content.config.ts` 的 `posts` schema 校验。新文章至少需要 `title` 和 `published`；字段名区分大小写。下面只列出作者可写的字段，`prevTitle`、`prevSlug`、`nextTitle`、`nextSlug` 是渲染流程内部字段，不要手动设置。

## 最小模板

```yaml
---
title: 文章标题
published: 2026-09-05
description: 一句话摘要
tags: [TypeScript, Astro]
category: 技术
draft: false
---
```

`published` 和 `updated` 是日期字段，使用 ISO 日期（`YYYY-MM-DD`）最稳妥。`published` 必填；`updated` 省略即可。布尔值、数字和数组要写成 YAML 对应类型，不要把 `false`、`0`、`[]` 全部加引号。

## 字段表

| 字段 | 类型 | 默认/可选值 | 用途与注意事项 |
| --- | --- | --- | --- |
| `title` | `string` | 必填 | 文章标题。 |
| `published` | `date` | 必填 | 发布时间；必须能被 Astro/Zod 解析为日期。 |
| `updated` | `date` | 可选 | 最后更新时间。 |
| `draft` | `boolean` | `false` | 草稿文章不应误设为 `false` 以外的字符串。 |
| `description` | `string` | `""` | SEO/列表摘要；未设置时 pipeline 会从正文取摘要。 |
| `image` | `string` | `""` | 封面图片路径或 URL。 |
| `tags` | `string[]` | `[]` | 文章标签数组。 |
| `category` | `string \| null` | `""` | 分类；需要明确空值时可写 `null`。 |
| `lang` | `string` | `""` | 覆盖站点默认语言。 |
| `pinned` | `boolean` | `false` | 是否置顶。 |
| `comment` | `boolean` | `true` | 是否开启评论。 |
| `priority` | `number` | 可选 | 列表排序权重。 |
| `author` | `string` | `""` | 覆盖默认作者。 |
| `sourceLink` | `string` | `""` | 原文或参考来源链接。 |
| `licenseName` | `string` | `""` | 展示用许可证名称。 |
| `licenseUrl` | `string` | `""` | 许可证链接。 |
| `encrypted` | `boolean` | `false` | 开启客户端文章加密；通常与 `password`、`passwordHint` 一起设置。 |
| `password` | `string` | `""` | 加密密码；不要在公开仓库中放真实敏感凭据。 |
| `passwordHint` | `string` | `""` | 给读者的密码提示。 |
| `hideHomeContent` | `boolean` | 可选 | 隐藏首页文章摘要；仅在需要时设置 `true`。 |
| `alias` | `string` | 可选 | 兼容旧 URL 的别名路径。 |
| `permalink` | `string` | 可选 | 自定义固定链接；通常优先于 `slug` 和 `alias`。 |
| `slug` | `string` | 可选 | 覆盖文件名对应的 URL slug；目录结构仍按文章所在目录参与生成。 |
| `math.inline` | `boolean` | `false` | 允许单美元行内公式 `$...$`。 |
| `math.display` | `boolean` | `false` | schema 接受该字段；当前 pipeline 的显示公式仍按 `$$...$$` 处理，不要依赖它开启额外行为。 |
| `series` | `string` | 可选 | 系列名称。 |
| `seriesOrder` | `number` | `0` | 系列内排序。 |
| `ogDescription` | `string` | 可选 | 覆盖 OG 图片/社交分享描述。 |
| `redirect` | `string` | 可选 | 将文章路由重定向到外部 URL 或其他资源。 |
| `copyright` | `string` | 可选 | 只能是 `CC BY`、`CC BY-SA`、`CC BY-ND`、`CC BY-NC`、`CC BY-NC-SA`、`CC BY-NC-ND`、`CC0`、`ARR`。 |

## 转载声明

`repost` 至少需要 `originalAuthor` 和 `originalUrl`：

```yaml
repost:
  originalAuthor: 原作者
  originalUrl: https://example.com/original
  originalTitle: 原文标题
  originalSite: 原站名称
  redirect: https://example.com/original
```

`originalTitle`、`originalSite`、`redirect` 可选。转载内容仍应保留来源和许可证信息，不要让 skill 代替作者判断版权。

## 数学开关

显示公式直接使用 KaTeX 的双美元语法：

```markdown
$$
E = mc^2
$$
```

只有在 frontmatter 中显式开启 `math.inline: true` 时才使用单美元行内公式：

```yaml
math:
  inline: true
```

这是为了避免正文里的金额（例如 `$10`）被误解析为公式。

## 摘要和 URL

- 正文中的 `<!-- more -->` 将其前内容设为手动摘要；没有该标记时，pipeline 使用第一段非空段落。
- `permalink`、`slug`、`alias` 的最终 URL 规则还受站点 URL 工具影响；修改 URL 前应查看 `src/utils/url-utils.ts`，并考虑已有外部链接和相对链接解析。
- frontmatter 中的字段值只描述文章，不要把组件参数（例如 `:::video` 的 `ratio`）放进 frontmatter。
