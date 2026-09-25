---
title: 文章分享海报与赞助按钮
order: 8
icon: ri:share-box-line
createTime: 2026/09/25
permalink: /feature/share-card/
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

默认 `/posts/.../` 文章页底部提供分享海报和可选的赞助按钮。该区域目前由 `src/pages/posts/[...slug].astro` 渲染；使用文章级 `permalink` 或启用全局固定链接后，文章会由根路径路由处理，而 `src/pages/[...permalink].astro` 当前没有渲染此分享/赞助区域。海报按钮使用客户端 Canvas 生成 PNG，不会在构建时为每篇文章预先生成海报。

## 分享海报

访客点击“分享文章”后，主题会使用文章标题、站点作者、描述、发布日期、封面图、站点名称和文章 URL 绘制海报，并为文章 URL 生成二维码。弹窗提供复制文章链接和下载 PNG 两个操作；目前没有内置的微博、X/Twitter 等平台直发按钮，也没有海报模板配置项。

显示开关位于 `siteConfig.sharePoster`，默认值为 `true`：

```ts title="src/overrides/siteConfig.ts"
const override = {
  sharePoster: true,
};

export default override;
```

设置为 `false` 后不显示分享海报按钮；若赞助按钮也关闭，文章底部的分享/赞助区域不会渲染。组件实现位于 `src/components/misc/SharePoster.svelte`，由 `src/pages/posts/[...slug].astro` 加载。

复制链接依赖浏览器 Clipboard API；非安全上下文或浏览器权限限制可能导致复制失败。封面图会用于 Canvas 绘制，远程图片需允许跨域读取；如果图片加载失败，海报仍可生成，但可能不含该封面。

## 赞助按钮

赞助按钮指向 `/sponsor/`。它只有在 `siteConfig.featurePages.sponsor` 未关闭且 `sponsorConfig.showButtonInPost` 不为 `false` 时显示。默认 `showButtonInPost` 为 `true`：

```ts title="src/overrides/siteConfig.ts"
const override = {
  featurePages: {
    sponsor: true,
  },
};

export default override;
```

```ts title="src/overrides/sponsorConfig.ts"
const override = {
  showButtonInPost: true,
};

export default override;
```

当分享海报和赞助按钮同时启用时，两者显示在同一个文章底部区域；关闭任一项不会影响另一项。赞助方式、二维码、赞助者名单和页面评论等完整配置见[赞助页面](/docs/tsukimi/special/sponsor/)。

## 配置与迁移

- 文章 Frontmatter 中的 `image` 会作为海报封面；未填写封面时使用主题背景绘制海报。字段说明见[文章 Frontmatter](/docs/tsukimi/press/article-types/frontmatter/)。
- 文章底部区域位于正文与版权信息附近。旧配置 `shareConfig.enable` 当前不会生效；升级时改用上文的 `siteConfig.sharePoster`。
