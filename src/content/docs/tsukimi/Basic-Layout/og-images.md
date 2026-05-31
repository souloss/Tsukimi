---
title: OG 图片配置
createTime: 2025/08/17 17:21:41
permalink: /basic-layout/og-images/
order: 6
icon: ri:image-add-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## OG 图片配置

Open Graph（OG）图片是社交媒体分享时显示的预览图片。Mizuki 支持自动生成美观的 OG 图片。

### 配置选项

在 `src/config.ts` 中配置：

```typescript
export const siteConfig: SiteConfig = {
  // 启用/禁用 OG 图片自动生成
  generateOgImages: true,
  // ...其他配置
};
```

### 功能特性

#### 自动生成（启用时）

当 `generateOgImages: true` 时：

- 为每篇已发布文章自动生成 OG 图片
- 图片尺寸：1200x630（推荐的社交分享尺寸）
- 图片内容包含：
  - 网站标题和图标
  - 文章标题（最多显示 3 行）
  - 文章描述（最多显示 2 行）
  - 作者头像和名称
  - 发布日期
- 使用主题色作为背景色

#### 自定义图片（禁用时）

当 `generateOgImages: false` 时：

- 如果文章有 `cover` 图片，使用封面图作为 OG 图片
- 否则使用网站横幅作为 OG 图片

### Meta 标签

OG 标签会自动添加到页面 `<head>` 中：

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="Site Name" />
<meta property="og:url" content="https://example.com/posts/article" />
<meta property="og:title" content="Article Title" />
<meta property="og:description" content="Article description" />
<meta property="og:image" content="https://example.com/og/article.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="article" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://example.com/posts/article" />
<meta name="twitter:title" content="Article Title" />
<meta name="twitter:description" content="Article description" />
<meta name="twitter:image" content="https://example.com/og/article.png" />
```

### 生成的 OG 图片 URL

自动生成的 OG 图片路径为：
```
/og/<文章-slug>.png
```

例如：`/og/my-awesome-article.png`

### 字体处理

OG 图片生成使用 Google Fonts 中的 Noto Sans SC 字体：

- 常规字重（400）
- 粗体字重（700）
- 构建时从 Google Fonts CDN 下载
- 字体有缓存，避免重复下载

如果字体下载失败，会降级使用系统默认字体。

### 性能优化

生成的图片：

- 使用 `sharp` 库优化为 PNG 格式
- 设置了长期缓存头（`max-age=31536000, immutable`）
- 预渲染（prerender）在构建时生成，不影响页面加载速度

### 主题色集成

OG 图片自动使用网站主题色：

```typescript
// 配置主题色
export const siteConfig: SiteConfig = {
  themeColor: {
    hue: 240, // 色相，0-360
    fixed: false,
    defaultMode: "system",
  },
};
```

OG 图片中的颜色：
- 背景色：基于主题色的深色变体
- 主色调：基于主题色的亮色变体
- 文本色：基于主题色的浅色变体

### 禁用 OG 图片生成

如果你想完全禁用 OG 图片生成：

```typescript
export const siteConfig: SiteConfig = {
  generateOgImages: false,
};
```

禁用后：
- 不会生成 `/og/` 路径下的图片
- 文章页面会尝试使用封面图或横幅作为 OG 图片
- 可以为每篇文章手动设置自定义 OG 图片

### 测试 OG 图片

可以使用以下工具测试 OG 图片：

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### 注意事项

1. 确保 `siteConfig.siteUrl` 配置正确，否则 OG 图片 URL 可能无法解析
2. 构建时确保网络可以访问 Google Fonts CDN
3. 头像和 favicon 文件必须存在于指定路径
4. 加密文章仍会生成 OG 图片，但摘要会隐藏
