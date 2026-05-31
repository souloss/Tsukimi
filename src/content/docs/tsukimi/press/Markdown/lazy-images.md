---
title: 图片懒加载
createTime: 2025/08/17 17:21:41
permalink: /press/markdown/lazy-images/
order: 7
icon: ri:lazy-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 图片懒加载插件

Mizuki 内置了 `rehype-lazy-image` 插件，为 Markdown 内容中的图片自动添加懒加载功能和过渡动画效果。

### 功能说明

该插件会自动为文章中的图片添加：

- `data-lazy-src` 属性 - 用于客户端懒加载处理
- `loading="lazy"` 属性 - 原生浏览器懒加载支持
- `lazy-image` CSS 类名 - 用于模糊过渡动画样式

### 效果

当页面加载时，图片会先显示模糊占位，然后平滑过渡到清晰状态，提供更好的用户体验。

### 自动跳过的图片

- Base64 编码的内联图片（`data:` 开头）
- 已经处理过的图片（已有 `data-lazy-src` 属性）

### 客户端处理

配合 `src/scripts/handlers/lazy-image-handler.js` 使用，实现：

1. 监听图片进入视口
2. 加载真实图片
3. 平滑过渡动画
4. 错误处理

### CSS 样式

相关样式定义在 `src/styles/lazy-image.css` 中：

```css
.lazy-image {
  /* 初始模糊状态 */
  filter: blur(8px);
  transition: filter 0.3s ease;
}

.lazy-image.loaded {
  /* 加载完成后移除模糊 */
  filter: blur(0);
}
```

### 相关配置

此插件无需额外配置，已集成到 Astro 的 Markdown 处理流程中。
