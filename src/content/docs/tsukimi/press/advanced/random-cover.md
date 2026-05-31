---
title: 随机封面图配置
createTime: 2026/05/20 12:00:00
permalink: /press/advanced/random-cover/
order: 5
icon: ri:image-add-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 随机封面图配置

当文章未设置封面图（`image` 字段）时，Mizuki 可以自动从随机图 API 获取封面图。配置位于 `src/config.ts` 中 `siteConfig` 的 `coverImage` 相关配置。

## 基本配置

```typescript title="src/config.ts"
// 文章封面图配置
coverImage: {
  enableInPost: true,  // 是否在文章详情页显示封面图
  randomCoverImage: {
    enable: true,       // 是否启用随机封面图
    apis: [
      "https://api.example.com/random.jpg",
      "https://picsum.photos/800/400",
    ],
    fallback: "/images/default-cover.jpg",  // API 失败时的回退图片
    showLoading: true,  // 是否显示加载动画
  },
},
```

## 配置项说明

### 主配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enableInPost` | `boolean` | 是 | 是否在文章详情页显示封面图 |
| `randomCoverImage` | `object` | 否 | 随机封面图配置 |

### randomCoverImage 配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enable` | `boolean` | 是 | 是否启用随机封面图功能 |
| `apis` | `string[]` | 是 | 随机图 API 列表，支持多个 API 地址 |
| `fallback` | `string` | 否 | API 请求失败时的回退图片路径（相对于 src 目录或以 `/` 开头的 public 目录路径） |
| `showLoading` | `boolean` | 否 | 是否在图片加载时显示加载动画 |

## 随机图 API

常用的随机图 API：

| API | 说明 |
|-----|------|
| `https://picsum.photos/800/400` | Lorem Picsum，随机风景图 |
| 自建 API | 返回图片链接或直接返回图片 |

::: tip 提示
建议使用自建的随机图 API，第三方 API 可能存在稳定性和速率限制问题。
:::

## 优先级

封面图的显示优先级为：

1. **文章 frontmatter 中的 `image` 字段** — 最高优先级
2. **随机图 API** — 文章未设置 `image` 且 `randomCoverImage.enable` 为 `true` 时使用
3. **回退图片** — API 请求失败时使用 `fallback` 指定的图片
