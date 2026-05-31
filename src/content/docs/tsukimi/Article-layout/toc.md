---
title: 目录配置
order: 1
icon: "ri:list-check-2"
badge:
  type: warning
  text: 新
createTime: 2025/08/17 17:21:41
permalink: /article-layout/toc/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 目录配置

Mizuki 支持文章目录（TOC）功能，帮助读者快速导航文章内容。配置位于 `src/config.ts` 中的 `siteConfig.toc` 对象。

## 基本配置

```typescript title="src/config.ts"
siteConfig: {
  toc: {
    enable: true,         // 总开关
    mobileTop: true,      // 手机端顶部 TOC 按钮
    desktopSidebar: true, // 电脑端右侧边栏 TOC
    floating: false,      // 悬浮 TOC 按钮
    depth: 2,             // TOC 深度：1, 2, 或 3
    useJapaneseBadge: false, // 使用日语假名标记代替数字
  },
}
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `true` | 总开关，false 时所有 TOC 都不显示 |
| `mobileTop` | `boolean` | `true` | 手机端顶部 TOC 按钮 |
| `desktopSidebar` | `boolean` | `true` | 电脑端右侧边栏 TOC |
| `floating` | `boolean` | `false` | 悬浮 TOC 按钮 |
| `depth` | `1 \| 2 \| 3` | `2` | TOC 深度，1 表示只显示 h1，2 表示 h1 和 h2，3 表示 h1-h3 |
| `useJapaneseBadge` | `boolean` | `false` | 使用日语假名标记（あいうえお...）代替数字 |

## 显示位置说明

TOC 支持三种显示位置，可以同时启用多个：

- **手机端顶部** (`mobileTop`)：在文章页面顶部显示一个 TOC 按钮，点击展开目录面板
- **电脑端侧边栏** (`desktopSidebar`)：在右侧边栏中显示 TOC 组件（需要侧边栏布局中包含 `card-toc` 组件）
- **悬浮按钮** (`floating`)：在页面右下角显示一个悬浮的 TOC 按钮

## 深度说明

`depth` 字段控制 TOC 显示的标题层级：

| 值 | 显示的标题层级 | 适用场景 |
|----|----------------|----------|
| `1` | 仅 h1 | 简短文章，只有一级标题 |
| `2` | h1 和 h2 | 一般文章，两级标题结构 |
| `3` | h1、h2 和 h3 | 长文章，复杂的多级标题结构 |

## 侧边栏 TOC 组件

如果启用了 `desktopSidebar`，还需要在侧边栏布局中添加 `card-toc` 组件：

```typescript
sidebarLayoutConfig: {
  components: {
    right: [
      // ...
      {
        type: "card-toc",
        enable: true,
        position: "sticky",
      },
    ],
  },
},
```

## 日语假名标记

启用 `useJapaneseBadge` 后，TOC 中的数字标记将替换为日语假名（あ、い、う、え、お...），为博客增添日式风格。
