---
title: Twikoo 评论配置
order: 6
icon: "ri:message-3-line"
createTime: 2025/08/17 17:21:41
permalink: /article-layout/twikoo/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Twikoo 评论配置

Mizuki 支持多种评论系统，Twikoo 是其中之一。评论系统配置位于 `src/config.ts` 中的 `commentConfig` 对象。

## 评论系统选择

通过 `commentConfig.system` 字段选择评论系统：

```typescript
system: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"
```

| 值 | 说明 |
|------|------|
| `"none"` | 不启用评论（默认） |
| `"twikoo"` | 使用 Twikoo |
| `"waline"` | 使用 Waline |
| `"giscus"` | 使用 Giscus（基于 GitHub Discussions） |
| `"disqus"` | 使用 Disqus |
| `"artalk"` | 使用 Artalk |

## Twikoo 配置

```typescript title="src/config.ts"
export const commentConfig: CommentConfig = {
  system: "twikoo",
  twikoo: {
    envId: "your-env-id",          // 腾讯云环境 ID 或自部署地址
    region: "",                     // 环境地域
    lang: "zh-CN",                  // 语言
    visitorCount: true,             // 是否启用访客统计
  },
};
```

### 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `envId` | `string` | 是 | 腾讯云环境 ID 或自部署服务地址 |
| `region` | `string` | 否 | 环境地域，腾讯云时使用 |
| `lang` | `string` | 否 | 语言代码，默认 `"zh-CN"` |
| `visitorCount` | `boolean` | 否 | 是否启用访客统计，默认 `true` |

### envId 说明

`envId` 是 Twikoo 的核心配置项，支持两种部署方式：

| 部署方式 | envId 格式 | 示例 |
|----------|-----------|------|
| 腾讯云 CloudBase | 环境 ID | `"env-xxxxxxxx"` |
| 自部署 (Vercel/私有服务器) | 完整 URL | `"https://twikoo.example.com"` |

### region 说明

仅在腾讯云部署时需要填写，可选值：

| 值 | 地域 |
|------|------|
| `""` | 默认（上海） |
| `"ap-shanghai"` | 上海 |
| `"ap-guangzhou"` | 广州 |
| `"ap-beijing"` | 北京 |

自部署方式不需要填写此字段。

### visitorCount 说明

启用后，Twikoo 会自动统计每篇文章的访问量，并在文章页面显示阅读数。

- `true`: 启用访客统计和阅读数显示
- `false`: 不统计访客

## Twikoo 部署参考

### 腾讯云 CloudBase

1. 前往 [腾讯云 CloudBase](https://console.cloud.tencent.com/tcb) 创建环境
2. 记录环境 ID，填入 `envId`
3. 如有需要，在 Twikoo 管理面板中配置 SMTP 邮件通知等

### Vercel 部署

1. Fork [twikoo-vercel](https://github.com/imaegoo/twikoo-vercel) 仓库
2. 在 Vercel 中导入并部署
3. 将部署后的 URL 填入 `envId`

### 私有服务器部署

1. 安装 Twikoo Server: `npm i tkserver`
2. 配置环境变量并启动
3. 将服务地址填入 `envId`

## 其他评论系统

如需使用其他评论系统，请参考对应文档：

- [Waline 评论配置](/docs/mizuki/article-layout/waline/)
- [Giscus 评论配置](/docs/mizuki/article-layout/giscus/)
- [Disqus 评论配置](/docs/mizuki/article-layout/disqus/)
- [Artalk 评论配置](/docs/mizuki/article-layout/artalk/)

## 注意事项

- 切换评论系统后，旧评论数据不会迁移
- Twikoo 的管理面板通过评论区的"管理"按钮访问
- 自部署方式需要确保服务端已正确配置跨域（CORS）
- `visitorCount` 功能依赖 Twikoo 服务端支持