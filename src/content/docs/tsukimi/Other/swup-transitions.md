---
title: 页面过渡动画配置
createTime: 2026/05/20 12:00:00
permalink: /other/swup-transitions/
order: 11
icon: ri:exchange-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 页面过渡动画配置

Mizuki 使用 `@swup/astro` 集成实现页面间的平滑过渡动画，提供类似单页应用（SPA）的浏览体验。

## 基本配置

Swup 通过 Astro 集成配置，位于 `astro.config.mjs`：

```javascript title="astro.config.mjs"
import swup from "@swup/astro";

export default defineConfig({
  integrations: [
    swup({
      theme: false,
      animationClass: "transition-swup-",
      containers: ["main"],
      smoothScrolling: false,
      cache: true,
      preload: false,
      accessibility: true,
      updateHead: process.env.NODE_ENV === "production",
      updateBodyClass: false,
      globalInstance: true,
      animateHistoryBrowsing: false,
    }),
  ],
});
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `boolean` | `false` | 是否使用 Swup 默认主题样式 |
| `animationClass` | `string` | - | 过渡动画 CSS 类名前缀 |
| `containers` | `string[]` | `["main"]` | 页面过渡时替换的容器选择器 |
| `smoothScrolling` | `boolean` | `false` | 是否启用平滑滚动（已禁用以避免锚点导航冲突） |
| `cache` | `boolean` | `true` | 是否缓存已访问页面 |
| `preload` | `boolean` | `false` | 是否预加载鼠标悬停链接的目标页面（已禁用以优化性能） |
| `accessibility` | `boolean` | `true` | 是否启用无障碍支持 |
| `updateHead` | `boolean` | - | 是否更新 `<head>` 内容（仅生产环境启用） |
| `updateBodyClass` | `boolean` | `false` | 是否更新 `<body>` 的 class |
| `globalInstance` | `boolean` | `true` | 是否创建全局 Swup 实例 |
| `animateHistoryBrowsing` | `boolean` | `false` | 浏览器前进/后退时是否播放动画 |

## 过渡动画样式

过渡动画样式定义在 `src/styles/transition.css` 中，使用 `transition-swup-` 前缀的 CSS 类：

- **淡入淡出**：页面内容的透明度过渡（默认效果）

## Swup 管理器

Swup 的运行时管理由 `src/scripts/swup-manager.ts` 中的 `SwupManager` 类负责：

- 初始化面板处理器
- 注册 Swup 钩子（Fancybox、懒加载图片、Live Photo、自定义滚动条、KaTeX）
- 管理回到顶部按钮
- 处理横幅显示
- 管理链接预加载
- **跨布局重载**：在文档布局和主布局之间导航时，强制完整页面刷新

## Swup 配置常量

`src/scripts/core/swup-config.ts` 导出了过渡动画的核心常量：

| 导出 | 说明 |
|------|------|
| `SWUP_SELECTORS` | CSS 选择器配置（内容容器、动画范围、持久元素、横幅、导航栏、TOC） |
| `TRANSITION_CONFIG` | 过渡动画默认参数（时长 120ms、缓动函数、位移距离、交错延迟） |
| `ANIMATION_CONFIG` | 页面进入/离开时长、高度扩展延迟、TOC 就绪延迟、评论初始化延迟 |
| `PERFORMANCE_CONFIG` | 性能模式配置（水波纹动画层数、樱花最大粒子数、Live2D、打字机） |
| `FANCYBOX_SELECTORS` | Fancybox 灯箱选择器配置 |

## 注意事项

- Swup 仅替换 `<main>` 容器内的内容，导航栏和侧边栏保持不变
- 外部链接和带有特殊属性的链接不会被 Swup 拦截
- 在文档布局和主布局之间导航时，会触发完整页面刷新
- 开发模式下 Swup 可能与 Astro HMR 产生冲突
