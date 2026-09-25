---
title: LivePhoto / Lazy Images
order: 12
icon: "ri:image-line"
badge:
  type: warning
  text: 新
createTime: 2026-05-20
permalink: /article-layout/live-photo/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 懒加载图片

文章图片由 `src/plugins/rehype-lazy-image.mjs` 添加浏览器原生 `loading="lazy"`、`decoding="async"` 和 `lazy-image` 样式类；无需额外配置。内联 `data:` 图片会跳过插件处理。

## LivePhoto

主题通过 Apple LivePhotosKit 显示 Live Photo。页面上的 `.live-photo` 或 `[data-live-photo]` 元素需要同时提供静态照片与配套视频地址：

```html
<div
  class="live-photo"
  data-photo-src="/images/live-photo.jpg"
  data-video-src="/images/live-photo.mov"
  data-width="100%"
  data-height="auto"
></div>
```

处理器在存在 Live Photo 元素时，从 jsDelivr 动态加载 LivePhotosKit；因此该功能需要浏览器能够访问 CDN。普通 GIF 或动态 WebP 不会因此自动转换成 Live Photo。

## 图片格式与转换

当前没有 `siteConfig.imageOptimization` 配置，也没有在 Astro 配置中启用文档所述的自动 WebP/AVIF 转换。可按需使用仓库脚本 `scripts/convert-images.js` 转换静态资源；转换前请先备份原图，并检查文章引用路径。

实现位置：`src/plugins/rehype-lazy-image.mjs`、`src/scripts/handlers/livephoto-handler.ts`、`src/styles/lazy-image.css` 和 `src/styles/livephoto.css`。
