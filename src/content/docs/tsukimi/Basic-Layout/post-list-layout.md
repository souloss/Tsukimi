---
title: 文章列表布局配置
createTime: 2026/05/20 12:00:00
permalink: /basic-layout/post-list-layout/
order: 8
icon: ri:list-unordered
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 文章列表布局配置

文章列表支持列表模式和网格模式两种布局，用户可在页面中切换。配置位于 `src/config.ts` 中 `siteConfig.postListLayout` 对象。

## 基本配置

```typescript title="src/config.ts"
postListLayout: {
  defaultMode: "list",         // 默认布局模式："list" 列表 | "grid" 网格
  mobileDefaultMode: "list",   // 移动端默认布局模式（可选，不设置则跟随 defaultMode）
  showTags: true,              // 是否在文章列表中显示标签
  descriptionLines: 2,         // 文章简介显示行数，0 表示不截断
  allowSwitch: true,           // 是否允许用户切换布局
  categoryBar: {
    enable: true,              // 是否在文章列表页显示分类导航条
  },
  grid: {
    masonry: false,            // 是否开启瀑布流布局
    columnWidth: 320,          // 网格模式卡片最小宽度(px)
  },
},
```

## 配置项说明

### 主配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `defaultMode` | `"list" \| "grid"` | 必填 | 默认布局模式，`list` 为传统列表，`grid` 为卡片网格 |
| `mobileDefaultMode` | `"list" \| "grid"` | 跟随 `defaultMode` | 移动端（视口宽度 < 780px）的默认布局模式 |
| `showTags` | `boolean` | - | 是否在文章列表卡片中显示标签 |
| `descriptionLines` | `number` | `2` | 文章简介截断行数，设为 `0` 则不截断显示完整内容 |
| `allowSwitch` | `boolean` | 必填 | 是否允许用户在列表/网格模式之间切换 |

### 分类导航条

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `categoryBar.enable` | `boolean` | 必填 | 是否在文章列表页顶部显示分类导航条 |

### 网格布局配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `grid.masonry` | `boolean` | 必填 | 是否开启瀑布流布局（Masonry），开启后卡片高度不一致时自动排列 |
| `grid.columnWidth` | `number` | `320` | 网格模式卡片最小宽度（像素），浏览器根据容器宽度自动计算列数 |

## 布局模式说明

### 列表模式 (list)

传统的文章列表展示方式，每篇文章占一行，包含封面图、标题、摘要、标签等信息。适合内容较多的博客。

### 网格模式 (grid)

卡片式网格布局，文章以卡片形式排列。适合图片较多的博客，视觉效果更丰富。

### 瀑布流模式 (masonry)

在网格模式基础上开启瀑布流，卡片高度不固定，自动填充空间，避免大量空白。适合文章摘要长度差异较大的场景。

```typescript
// 开启瀑布流
postListLayout: {
  defaultMode: "grid",
  allowSwitch: true,
  grid: {
    masonry: true,
    columnWidth: 280,
  },
},
```

## 分类导航条

分类导航条显示在文章列表顶部，允许用户按分类筛选文章。需要同时确保 `siteConfig.categoryBar` 设置为 `true`。

```typescript
// 启用分类导航条
siteConfig: {
  categoryBar: true,
  postListLayout: {
    categoryBar: {
      enable: true,
    },
  },
}
```

## 移动端适配

移动端可以单独设置默认布局模式，推荐使用列表模式以获得更好的阅读体验：

```typescript
postListLayout: {
  defaultMode: "grid",          // 桌面端默认网格
  mobileDefaultMode: "list",    // 移动端默认列表
  allowSwitch: true,
}
```
