---
title: Disqus 评论系统配置
order: 10
icon: "ri:message-3-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /article-layout/disqus/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Disqus 评论系统配置

Disqus 是一个广泛使用的第三方评论系统，支持社交登录、垃圾评论过滤、分析等功能。配置位于 `src/config.ts` 中的 `commentConfig` 对象。

## 评论系统选择

通过 `commentConfig.system` 字段选择评论系统：

```typescript
system: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"
```

## 基本配置

```typescript title="src/config.ts"
export const commentConfig: CommentConfig = {
  enable: true,
  system: "disqus",
  disqus: {
    shortname: "your-disqus-shortname",
  },
};
```

## 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `shortname` | `string` | 是 | Disqus 站点的 shortname，在 Disqus 后台注册时获取 |

## 获取 shortname

1. 前往 [Disqus 官网](https://disqus.com/) 注册账号
2. 创建新站点，填写网站信息
3. 在站点设置中找到 shortname
4. 将 shortname 填入配置

## 注意事项

- Disqus 是外部服务，需要用户能访问 Disqus 服务器
- 免费版本会显示广告
- 加载速度可能受网络环境影响
