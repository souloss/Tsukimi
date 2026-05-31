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

## LivePhoto / Lazy Images

Mizuki支持图片懒加载和LivePhoto动图功能，提升页面加载性能和视觉体验。

---

### Lazy Images 图片懒加载

图片懒加载功能默认开启，图片仅在进入视口时加载。

#### 工作原理

- 使用loading="lazy"属性
- 浏览器原生支持
- 无需额外配置
- 提升页面加载速度
- 减少不必要的带宽消耗

#### 配置

不需要额外配置，所有文章中的图片都默认使用懒加载。

---

### LivePhoto 动图功能

LivePhoto功能支持在文章中嵌入短动图，点击时播放。

#### 实现方式

通过`src/plugins/remark-plume-compat.js`等插件处理特定的图片格式。

#### 使用方法

在Markdown中使用标准的图片语法：

```markdown
![描述](/images/my-photo.webp)
```

如果图片是动态WebP或GIF，会自动处理。

---

### 图片优化

Mizuki支持自动图片格式转换和优化，使用Sharp库。

在 `astro.config.mjs` 中配置：

```javascript
imageOptimization: {
  formats: ['webp', 'avif'], // 输出图片格式
  quality: 80, // 压缩质量
}
```

#### 配置选项

| 选项 | 说明 |
|------|------|
| `formats` | 输出图片格式，支持 `webp`, `avif` 或两者都有 |
| `quality` | 压缩质量，1-100之间，建议70-85 |

---

### 相关代码

- `src/scripts/handlers/lazy-image-handler.ts` - 图片懒加载处理器
- `src/scripts/handlers/livephoto-handler.ts` - LivePhoto处理器
- `src/plugins/rehype-lazy-image.mjs` - Rehype懒加载插件
- `src/styles/lazy-image.css` - 懒加载样式
- `src/styles/livephoto.css` - LivePhoto样式

---

### 使用提示

- 建议使用WebP格式图片，体积更小质量更好
- LivePhoto图片建议适当压缩
- 图片尺寸要适当，不要太大影响加载
- 移动端会自动调整图片
