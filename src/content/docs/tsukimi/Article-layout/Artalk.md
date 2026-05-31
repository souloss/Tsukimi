---
title: Artalk 评论系统配置
order: 9
icon: "ri:message-3-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /article-layout/artalk/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Artalk 评论系统配置

Artalk 是一款简洁的自托管评论系统，支持 Markdown、邮件通知、站点通知、评论审核等功能。配置位于 `src/config.ts` 中的 `commentConfig` 对象。

## 评论系统选择

通过 `commentConfig.system` 字段选择评论系统：

```typescript
system: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"
```

## 基本配置

```typescript title="src/config.ts"
export const commentConfig: CommentConfig = {
  enable: true,
  system: "artalk",
  artalk: {
    server: "https://your-artalk-server.com",
    locale: "zh-CN",
    visitorCount: true,
  },
};
```

## 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `server` | `string` | 是 | Artalk 后端 API 地址 |
| `locale` | `string \| "auto"` | 是 | 界面语言，支持：`"en"`、`"zh-CN"`、`"zh-TW"`、`"ja"`、`"ko"`、`"fr"`、`"ru"`，`"auto"` 自动检测 |
| `visitorCount` | `boolean` | 否 | 是否启用访客统计功能 |

## 部署 Artalk 服务端

Artalk 是自托管评论系统，需要自行部署后端：

1. 前往 [Artalk 官方文档](https://artalk.js.org/) 查看部署指南
2. 支持多种部署方式：Docker、二进制文件、源码编译
3. 配置数据存储（SQLite / MySQL / PostgreSQL 等）
4. 获取服务端地址后填入 `server`

## 切换评论系统

从其他评论系统切换到 Artalk：

```typescript
export const commentConfig = {
  enable: true,
  system: "artalk",
  artalk: {
    server: "https://your-artalk-server.com",
    locale: "auto",
    visitorCount: true,
  },
};
```
