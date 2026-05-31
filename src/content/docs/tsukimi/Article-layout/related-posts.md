---
title: 相关文章与随机文章
order: 14
icon: "ri:links-line"
badge:
  type: warning
  text: 新
createTime: 2025-05-20
permalink: /article-layout/related-posts/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 相关文章功能

Mizuki 支持在文章详情页显示相关文章推荐，帮助读者发现更多感兴趣的内容。

### 配置

在 `src/config.ts` 中配置：

```typescript
export const relatedPostsConfig: RelatedPostsConfig = {
    enable: true,        // 启用相关文章功能
    maxCount: 5,         // 最多显示的相关文章数量
};
```

### 工作原理

- 根据标签和分类来匹配相关文章
- 优先显示有更多共同标签的文章
- 按发布时间倒序排列（最新的在前）

---

## 随机文章功能

除了相关文章外，Mizuki 还支持显示随机文章推荐，帮助发现可能错过的内容。

### 配置

在 `src/config.ts` 中配置：

```typescript
export const randomPostsConfig: RandomPostsConfig = {
    enable: true,        // 启用随机文章功能
    maxCount: 5,         // 最多显示的随机文章数量
};
```

### 工作原理

- 从所有公开的文章中随机选择
- 不包括加密文章和草稿
- 每次刷新页面都会重新随机选择

---

## 在主题中启用

这两个功能默认都已在主题中启用，无需额外设置。如果你希望禁用，可以在配置中设置 `enable: false`。
