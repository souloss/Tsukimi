---
title: 页面自动缩放配置说明
createTime: 2026/01/22 10:00:00
permalink: /basic-layout/auto-res-algo/
order: 7
icon: ri:fullscreen-exit-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

页面自动缩放配置位于 `src/config/siteConfig.ts` 的 `siteConfig.pageScaling`。它只调整桌面端的根字号，不会对页面做图片式整体缩放。

```ts title="src/overrides/siteConfig.ts"
const override = {
  pageScaling: {
    enable: true,
    targetWidth: 2000,
  },
};

export default override;
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用桌面端缩放。 |
| `targetWidth` | `number` | `2000` | 根字号达到 `100%` 的参考视口宽度，单位为 CSS 像素。 |

启用后，代码先排除触屏设备、竖屏和视口宽度不超过 `1280px` 的情况；其余桌面窗口根据 `clientWidth / targetWidth` 计算根字号比例，并限制在 `85%` 至 `100%` 之间。因此它只在中等宽度的桌面视口缩小字号，不会放大更宽的屏幕，也不会影响手机和平板布局。窗口尺寸变化时会重新计算。

修改配置后在桌面窗口缩放浏览器，检查导航、文章卡片、侧栏和正文排版；若站点使用自定义 rem 布局尺寸，调整 `targetWidth` 前也要验证这些组件。
