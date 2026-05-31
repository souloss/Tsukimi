---
title: 图片优化配置
createTime: 2026/05/20 12:00:00
permalink: /basic-layout/image-optimization/
order: 9
icon: ri:image-edit-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 图片优化配置

Mizuki 内置图片优化功能，可在构建时自动转换图片格式、压缩质量，并解决防盗链图片加载问题。配置位于 `src/config.ts` 中 `siteConfig.imageOptimization` 对象。

## 基本配置

```typescript title="src/config.ts"
imageOptimization: {
  formats: "both",         // 输出格式："avif" | "webp" | "both"
  quality: 80,             // 压缩质量 (1-100)
  noReferrerDomains: [],   // 需要添加 no-referrer 的域名列表
},
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `formats` | `"avif" \| "webp" \| "both"` | - | 输出图片格式 |
| `quality` | `number` | - | 图片压缩质量（1-100），推荐 70-85 |
| `noReferrerDomains` | `string[]` | `[]` | 为匹配域名的图片添加 `referrerpolicy="no-referrer"` |

## 输出格式说明

| 格式 | 说明 |
|------|------|
| `avif` | 最新压缩技术，体积最小，兼容性较低 |
| `webp` | 体积适中，兼容性好 |
| `both` | 同时输出 AVIF 和 WebP，浏览器自动选择最佳格式（推荐） |

## 防盗链图片处理

部分图片源（如 Bilibili、HDSLB）设置了防盗链，直接引用会导致 403 错误。通过 `noReferrerDomains` 配置可以为指定域名的图片自动添加 `referrerpolicy="no-referrer"` 属性：

```typescript
imageOptimization: {
  noReferrerDomains: [
    "i0.hdslb.com",
    "*.bilibili.com",
    "img.example.com",
  ],
},
```

支持通配符 `*` 匹配子域名。此配置仅影响匹配域名的图片标签，不影响其他链接的 referrer 行为。
