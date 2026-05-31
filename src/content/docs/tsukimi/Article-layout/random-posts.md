---
title: 随机文章推荐配置
order: 13
icon: "ri:shuffle-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /article-layout/random-posts/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 随机文章推荐配置

Mizuki 支持在文章底部展示随机推荐文章，帮助读者发现更多内容。

## 基本配置

随机文章配置是独立的顶层导出，位于 `src/config.ts`：

```typescript title="src/config.ts"
export const randomPostsConfig: RandomPostsConfig = {
    enable: true,       // 是否启用随机文章推荐
    maxCount: 5,        // 推荐文章数量
};
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `true` | 是否启用随机文章推荐 |
| `maxCount` | `number` | `5` | 每次展示的推荐文章数量 |

## 工作原理

1. 构建时从所有已发布文章中随机选取指定数量的文章
2. 排除当前正在阅读的文章和加密文章
3. 使用 Fisher-Yates 洗牌算法确保随机性
4. 在文章底部渲染推荐卡片列表

## 侧边栏组件

随机文章也可以作为侧边栏组件使用。在 `sidebarLayoutConfig.components` 中添加：

```typescript
sidebarLayoutConfig: {
  components: {
    right: [
      // ...
      {
        type: "random-posts",
        enable: true,
        position: "sticky",
      },
    ],
  },
},
```

## 与相关文章的区别

| 特性 | 随机文章推荐 | 相关文章 |
|------|------------|---------|
| 匹配方式 | 随机选取 | 基于标签和分类匹配 |
| 发现性 | 高（可能发现不相关但有趣的内容） | 低（只看相关内容） |
| 配置位置 | `randomPostsConfig`（顶层导出） | `relatedPostsConfig`（顶层导出） |
| 展示位置 | 文章底部 / 侧边栏 | 文章底部 |

两个功能可以同时启用，互不冲突。