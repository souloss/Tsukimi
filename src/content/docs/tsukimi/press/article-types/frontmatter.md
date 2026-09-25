---
title: 文章 Frontmatter
description: 文章元数据字段、路由规则、系列、转载和加密选项。
createTime: 2026/09/25
permalink: /press/article-types/frontmatter/
order: 1
icon: ri:article-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

文章使用 Markdown 或 MDX 编写，文件顶部的 YAML Frontmatter 用于设置标题、日期、分类、路由和文章行为。字段由 [`src/content.config.ts`](https://github.com/souloss/Tsukimi/blob/main/src/content.config.ts) 校验；本页说明主题当前会使用的字段。

## 最小示例

```yaml
---
title: 我的第一篇文章
published: 2026-09-25
description: 一段用于文章卡片和订阅摘要的介绍。
tags: [Astro, Tsukimi]
category: 技术
draft: false
---

从这里开始写正文。
```

`title` 与 `published` 必填。日期使用 `YYYY-MM-DD`；文章正文从 Frontmatter 结束的 `---` 之后开始。

## 基础字段

| 字段 | 类型 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `title` | string | 必填 | 文章标题，用于文章页、列表、归档和分享海报。 |
| `published` | date | 必填 | 发布日期，影响页面元信息、归档和排序。 |
| `updated` | date | 无 | 可选的最后修改日期；是否显示还受站点配置控制。 |
| `draft` | boolean | `false` | `true` 时不进入生产文章列表和 feed；开发预览仍可查看。 |
| `description` | string | `""` | 文章摘要，供列表、SEO 和订阅内容使用；未填写时部分位置会从正文生成摘要。 |
| `image` | string | `""` | 封面图片路径，用于文章页、列表、Open Graph 和分享海报。文章目录中的图片可用相对路径。 |
| `tags` | string[] | `[]` | 标签列表。 |
| `category` | string \| null | `""` | 文章分类；留空或设为 `null` 时按未分类处理。 |
| `lang` | string | `""` | 可选的文章语言标记，用于文章页语言属性和结构化数据；留空时使用站点默认语言。 |
| `pinned` | boolean | `false` | 将文章置顶。置顶文章按 `priority` 从小到大排列，再按发布日期排序。 |
| `priority` | number | 无 | 置顶文章的排序权重；仅置顶文章之间比较，数值越小越靠前。 |
| `comment` | boolean | `true` | 控制当前文章是否显示评论区；还需要站点评论系统已启用。 |

## 作者与版权

| 字段 | 类型 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `author` | string | `""` | 覆盖站点作者名；为空时使用个人资料配置中的作者。 |
| `sourceLink` | string | `""` | 文章版权卡片中的来源链接。 |
| `licenseName` | string | `""` | 覆盖站点默认许可证名称。 |
| `licenseUrl` | string | `""` | 覆盖站点默认许可证链接。 |
| `copyright` | string | 无 | 转载列表使用的许可证标记，可选值见下表。 |

`copyright` 可设为 `CC BY`、`CC BY-SA`、`CC BY-ND`、`CC BY-NC`、`CC BY-NC-SA`、`CC BY-NC-ND`、`CC0` 或 `ARR`。许可证含义和注意事项见[版权许可说明](/docs/tsukimi/press/advanced/copyright-license/)。

## 路由与重定向

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| `permalink` | string | 指定文章的根路径 URL，例如 `/notes/hello/`；优先于全局固定链接规则和其他文章路由字段。 |
| `slug` | string | 替换文件名对应的 URL 部分，保留文章所在子目录；只在未设置 `permalink` 且全局固定链接规则未启用时使用。 |
| `alias` | string | 在默认文章路由模式下添加 `/posts/` 备用路径；没有 `slug` 时可作为文章的首选链接。 |
| `redirect` | string | 访问文章路由时跳转到指定 URL。 |

当前主链接选择顺序为：文章 `permalink` → 启用时的全局固定链接规则 → `slug` → `alias` → 源文件路径。只有未设置文章 `permalink` 且全局固定链接关闭时，`alias` 才会生成 `/posts/` 备用路由；启用全局规则或设置文章 `permalink` 时，`alias` 不会额外生成路由。当 `slug` 与 `alias` 同时存在且全局规则关闭时，主链接使用 `slug`，`alias` 是备用地址。详细配置见[固定链接说明](/docs/tsukimi/press/advanced/permalink/)。

设置文章级 `permalink` 或启用全局规则时，主题仍会为文章保留基于源文件路径的 `/posts/.../` 兼容页面；但默认模式下额外生成的自定义 `slug`、`alias` 路由不会一并保留。迁移时应检查曾公开使用的旧地址，并按需配置站点托管平台的重定向。

如果设置 `redirect`，文章路由会直接重定向。转载字段中的 `repost.redirect` 也可提供重定向目标；文章级 `redirect` 优先。

## 数学公式

```yaml
math:
  inline: true
```

默认只解析 `$$...$$` 块级公式。设置 `math.inline: true` 后，单美元符号 `$...$` 也会作为行内公式解析。该选项适用于需要行内数学语法的文章。

## 系列文章

```yaml
series: Astro 入门
seriesOrder: 2
```

`series` 设置系列名称，`seriesOrder` 设置系列中的顺序，默认值为 `0`。启用站点的系列页面后，同系列文章会出现在系列导航和系列索引中。详见[系列文章](/docs/tsukimi/press/article-types/series/)。

## 转载文章

```yaml
repost:
  originalAuthor: 原作者
  originalUrl: https://example.com/original-post
  originalTitle: 原文标题
  originalSite: 原发布站点
  redirect: https://example.com/original-post
```

`originalAuthor` 和 `originalUrl` 必填；`originalTitle`、`originalSite`、`redirect` 可选。转载信息会显示在文章页和转载索引中。配置 `redirect` 后，访问本地文章会跳转到目标页面。详见[转载文章](/docs/tsukimi/press/article-types/reposts/)。

## 加密文章

```yaml
encrypted: true
password: "请替换为单篇文章密码"
passwordHint: "可选的密码提示"
hideHomeContent: true
```

只有 `encrypted: true` 且 `password` 为非空字符串时，文章内容才会在构建时加密；访客在文章页输入密码后由浏览器解密。`passwordHint` 显示在密码输入框附近。`hideHomeContent` 控制列表摘要是否隐藏；未设置时，有密码的文章默认隐藏摘要。加密不等于服务端访问控制，也不适合保存真正机密的信息；密码会以明文写在文章源文件中。详见[加密文章](/docs/tsukimi/press/article-types/encrypted-posts/)。

## 相关页面

- [系列文章](/docs/tsukimi/press/article-types/series/)
- [转载文章](/docs/tsukimi/press/article-types/reposts/)
- [加密文章](/docs/tsukimi/press/article-types/encrypted-posts/)
- [Markdown 指令](/docs/tsukimi/press/markdown/directives/)
- [文件型文章组织](/docs/tsukimi/press/organization/file/)
