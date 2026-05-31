---
title: 分享卡片与赞助按钮
order: 8
icon: "ri:share-box-line"
badge:
  type: warning
  text: 新
createTime: 2025/05/20 00:00:00
permalink: /feature/share-card/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

**分享卡片与赞助按钮说明**

Mizuki 主题在文章底部提供了分享卡片组件（`ShareCard`），集成了社交分享和赞助按钮功能。

---

## 组件结构

分享卡片组件位于 `src/components/features/posts/ShareCard.astro`。

**显示位置**: 文章详情页底部，评论区上方。

---

## 功能概览

分享卡片包含以下功能：

| 功能 | 说明 | 配置位置 |
|------|------|----------|
| 社交分享 | 分享到 Twitter、微博等 | 内置 |
| 复制链接 | 一键复制当前文章链接 | 内置 |
| 赞助按钮 | 跳转到赞助页面 | `sponsorConfig` |

---

## 赞助按钮配置

赞助按钮的显示逻辑在 `src/config/sponsorConfig.ts` 中控制：

```typescript title="src/config/sponsorConfig.ts"
export const sponsorConfig = {
    // ... 其他赞助配置

    showButtonInPost: true, // 是否在文章底部显示赞助按钮
}
```

### showButtonInPost

```typescript
showButtonInPost: boolean;
```

是否在每篇文章的底部分享卡片中显示赞助按钮。

- `true`: 显示赞助按钮（默认）
- `false`: 不显示赞助按钮

---

## 赞助按钮显示逻辑

赞助按钮的显示遵循以下规则：

1. **总开关**: `siteConfig.featurePages.sponsor` 必须为 `true`
2. **按钮开关**: `sponsorConfig.showButtonInPost` 必须为 `true`
3. **页面存在**: `/sponsor/` 页面必须可访问

只有满足以上所有条件，文章底部的赞助按钮才会显示。

---

## 社交分享

内置支持以下分享方式：

| 平台 | 说明 |
|------|------|
| Twitter / X | 推文分享 |
| 微博 | 新浪微博分享 |
| 复制链接 | 复制当前页面 URL |

未来可扩展更多分享平台。

---

## 分享海报（待实现）

::: note 预告功能
分享海报功能目前处于规划阶段，未来版本将支持：
- 自动生成带二维码的文章分享海报
- 自定义海报样式
- 支持下载和分享
:::

---

## 自定义分享卡片

你可以通过覆盖 `src/components/features/posts/ShareCard.astro` 来自定义分享卡片的样式和功能。

**组件 Props**:
```typescript
interface Props {
    title: string; // 文章标题
    url: string; // 文章链接
    description?: string; // 文章描述
    image?: string; // 文章图片
}
```

---

## SponsorConfig 配置

赞助配置位于 `src/config/sponsorConfig.ts`，类型为 `SponsorConfig`。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 否 | 页面标题，默认使用 i18n |
| `description` | `string` | 否 | 页面描述文本 |
| `usage` | `string` | 否 | 赞助用途说明 |
| `methods` | `SponsorMethod[]` | 是 | 赞助方式列表 |
| `sponsors` | `SponsorItem[]` | 否 | 赞助者列表 |
| `showSponsorsList` | `boolean` | 否 | 是否显示赞助者列表，默认 `true` |
| `showComment` | `boolean` | 否 | 是否显示评论区，默认 `false` |
| `showButtonInPost` | `boolean` | 否 | 是否在文章底部显示赞助按钮，默认 `true` |

### SponsorMethod 赞助方式

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 赞助方式名称，如 "支付宝"、"微信" |
| `icon` | `string` | 否 | 图标名称（Iconify 格式），如 `"fa7-brands:alipay"` |
| `qrCode` | `string` | 否 | 收款码图片路径（`public` 目录下） |
| `link` | `string` | 否 | 赞助链接 URL（提供后显示跳转按钮） |
| `description` | `string` | 否 | 描述文本 |
| `enabled` | `boolean` | 是 | 是否启用 |

### SponsorItem 赞助者

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 赞助者名称 |
| `amount` | `string` | 否 | 赞助金额 |
| `date` | `string` | 否 | 赞助日期（ISO 格式） |
| `message` | `string` | 否 | 留言 |

## 完整配置示例

```typescript title="src/config/sponsorConfig.ts"
export const sponsorConfig: SponsorConfig = {
    title: "支持与赞助",
    description: "如果这个项目对你有帮助，欢迎支持我继续创作",
    usage: "你的支持将用于服务器维护、域名续费等开支",
    methods: [
        {
            name: "支付宝",
            icon: "fa7-brands:alipay",
            qrCode: "/sponsor/alipay.webp",
            enabled: true,
        },
        {
            name: "微信支付",
            icon: "fa7-brands:weixin",
            qrCode: "/sponsor/wechat.webp",
            enabled: true,
        },
    ],
    sponsors: [
        {
            name: "支持者A",
            amount: "50元",
            date: "2025-01-01",
        },
    ],
    showSponsorsList: true,
    showComment: false,
    showButtonInPost: true,
};
```

```typescript title="src/config.ts"
export const siteConfig = {
    // ...
    featurePages: {
        // ...
        sponsor: true, // 必须启用赞助页面
    },
};
```

---

## 相关文档

- [赞助页面](/docs/mizuki/special/sponsor/) - 赞助页面的详细配置
