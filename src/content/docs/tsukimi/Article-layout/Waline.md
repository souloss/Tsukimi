---
title: Waline 评论系统配置
order: 8
icon: "ri:message-3-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /article-layout/waline/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Waline 评论系统配置

Waline 是一个简洁、安全的评论系统，支持 Markdown、邮件通知、访客统计等功能。配置位于 `src/config.ts` 中的 `commentConfig` 对象。

## 评论系统选择

通过 `commentConfig.system` 字段选择评论系统：

```typescript
system: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"
```

## 基本配置

```typescript title="src/config.ts"
export const commentConfig: CommentConfig = {
  enable: true,
  system: "waline",
  waline: {
    serverURL: "https://your-waline-server.vercel.app",
    lang: "zh-CN",
    emoji: ["https://unpkg.com/@waline/emojis@1.2.0/weibo"],
    login: "enable",
    visitorCount: true,
  },
};
```

## 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `serverURL` | `string` | 是 | Waline 服务端地址，部署后获取 |
| `lang` | `string` | 否 | 语言代码，如 `"zh-CN"`、`"en"`、`"ja"` |
| `emoji` | `string[]` | 否 | 表情包 CDN 地址数组 |
| `login` | `"enable" \| "force" \| "disable"` | 否 | 登录模式：`enable` 允许匿名、`force` 强制登录、`disable` 禁用登录 |
| `visitorCount` | `boolean` | 否 | 是否启用访客统计功能 |

## 部署 Waline 服务端

Waline 需要一个后端服务，推荐使用 Vercel + LeanCloud 部署：

1. 前往 [Waline 官方文档](https://waline.js.org/) 查看部署指南
2. 选择部署平台（Vercel / Netlify / Cloudflare 等）
3. 配置数据存储（LeanCloud / MongoDB / MySQL 等）
4. 获取服务端 URL 后填入 `serverURL`

## 切换评论系统

从其他评论系统切换到 Waline，只需修改 `system` 字段：

```typescript
export const commentConfig = {
  enable: true,
  system: "waline",  // 从 "twikoo" 或 "giscus" 切换为 "waline"
  waline: {
    serverURL: "https://your-waline-server.vercel.app",
    // ...
  },
};
```

## 表情包配置

支持配置多个表情包源：

```typescript
waline: {
  emoji: [
    "https://unpkg.com/@waline/emojis@1.2.0/weibo",
    "https://unpkg.com/@waline/emojis@1.2.0/bilibili",
  ],
}
```
