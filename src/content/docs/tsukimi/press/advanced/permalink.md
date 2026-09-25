---
title: 文章固定链接
createTime: 2026/09/25
permalink: /press/advanced/permalink/
order: 3
icon: ri:link
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

文章 URL 由 Frontmatter、全局固定链接配置和文章文件路径共同决定。可为单篇文章设置 `permalink`，也可以在 `src/config/permalinkConfig.ts`（或 `src/overrides/permalinkConfig.ts`）为所有文章设置统一格式。字段完整说明见[文章 Frontmatter](/docs/tsukimi/press/article-types/frontmatter/)。

## 全局固定链接格式

全局配置默认为关闭，格式默认为 `%postname%`。启用后，未单独设置文章 `permalink` 的文章会根据格式生成站点根路径 URL：

```ts title="src/overrides/permalinkConfig.ts"
import type { PermalinkConfig } from "@/types/config";

const override: Partial<PermalinkConfig> = {
  enable: true,
  format: "%year%/%monthnum%/%postname%",
};

export default override;
```

格式支持以下占位符：`%year%` 年份、`%monthnum%` 月份、`%day%` 日期、`%hour%` 小时、`%minute%` 分钟、`%second%` 秒、`%post_id%` 文章序号、`%postname%` 文件名 slug、`%raw_postname%` 保留大小写的原文件名、`%category%` 分类名（空分类使用 `uncategorized`）。格式可用 `/` 生成分层路径，例如 `%year%/%monthnum%/%postname%`。

## 路径优先级

| 优先级 | 来源 | 示例与行为 |
| --- | --- | --- |
| 1 | `permalink` | `permalink: /notes/hello/` 生成根路径 `/notes/hello/`，不带 `/posts/` 前缀。 |
| 2 | 启用的全局 `permalinkConfig` | 根据全局格式生成根路径；此时 `slug`、`alias` 不决定主链接。 |
| 3 | `slug` | 替换文件名部分并保留文章目录，例如 `posts/guide/start.md` 配置 `slug: begin` 后使用 `/posts/guide/begin/`。 |
| 4 | `alias` | 未设置更高优先级字段时作为文章主链接，位于 `/posts/` 下；未启用全局格式时也会生成别名路由。 |
| 5 | 源文件路径 | 默认按 `src/content/posts/` 下的相对文件路径生成 `/posts/.../`。 |

当未设置文章级 `permalink` 且全局 `permalinkConfig.enable` 为 `false` 时，路由生成器会额外生成 `slug` 和 `alias` 路径；若二者同时设置，主链接使用 `slug`，`alias` 是兼容地址。设置文章级 `permalink` 或启用全局格式时，主题仍保留基于源文件路径的 `/posts/.../` 兼容页面，但不会额外生成自定义 `slug` 或 `alias` 路径。`alias` 是额外文章路由，不会发出 HTTP 重定向。修改已经发布文章的路径前，检查已公开使用的 URL，并按需配置托管平台重定向，避免外部链接失效。

## 单篇文章配置

```yaml
---
title: 固定链接示例
published: 2026-09-25
permalink: /notes/permalink-example/
---
```

`permalink` 会去掉首尾斜线再生成站点根路径，建议仍按示例显式写上首尾 `/`，便于阅读和维护。部署在子路径下时，主题会在站点 URL 基础上加上部署前缀。

## 迁移建议

- 保持原文件名不变，只调整 `permalink` 时，文章正文文件仍留在原位置。
- 关闭全局固定链接且未设置文章级 `permalink` 时，可用 `slug` 和 `alias` 保留自定义兼容路径；使用自定义 `permalink` 或启用全局格式时，主题仅保留源文件路径对应的默认 `/posts/.../` 兼容页面，其他旧路径应另行配置部署平台重定向。
- `redirect` 用于让文章路由跳转到外部或其他页面；它不是 `permalink` 的别名字段。
- URL 字段组合和优先级以[文章 Frontmatter 路由规则](/docs/tsukimi/press/article-types/frontmatter/#路由与重定向)为准。
