---
title: 归档页面配置
createTime: 2026/05/20 12:00:00
permalink: /special/archive/
order: 3
icon: ri:archive-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 归档页面配置

归档页面按时间线展示所有已发布的文章，提供全局文章检索视图。

## 启用归档页面

归档页面通过 `siteConfig.featurePages` 控制：

```typescript title="src/config.ts"
siteConfig: {
  featurePages: {
    archive: true,  // 设为 false 可禁用归档页面
  },
}
```

## 页面路由

归档页面的路由为 `/archive/`，对应源文件 `src/pages/archive.astro`。

## 页面特性

- **时间线分组**：文章按发布年份分组展示
- **文章计数**：显示每个年份的文章数量
- **文章元信息**：每篇文章显示标题、发布日期、分类和标签
- **置顶标记**：置顶文章带有特殊标记
- **响应式布局**：适配桌面端和移动端

## 导航栏配置

在 `navBarConfig` 中添加归档页面链接：

```typescript title="src/config.ts"
navBarConfig: [
  // ...
  { text: "归档", link: "/archive/" },
],
```

## 禁用归档页面

如果不需要归档页面，需要同时：

1. 在 `siteConfig.featurePages` 中设置 `archive: false`
2. 从 `navBarConfig` 中移除归档页面链接

## 与侧边栏日历组件的关系

侧边栏的日历组件（Calendar Widget）也提供文章时间维度的浏览，但归档页面提供更完整的全局视图。两者可以同时使用，互不冲突。
