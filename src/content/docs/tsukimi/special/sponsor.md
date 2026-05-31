---
title: 赞助页面
createTime: 2025/05/20 00:00:00
permalink: /special/sponsor/
order: 7
icon: ri:heart-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

### 赞助页面配置教程

Mizuki 主题内置了一个优雅的赞助页面，让你可以接受访客的支持与打赏。页面支持多种赞助方式（二维码、跳转链接），以及赞助者名单展示功能。

本教程将详细指导你如何配置和使用赞助页面。

---

#### **1. 核心概念：页面与配置分离**

::: file-tree

- Mizuki
  - src
    - pages
      - sponsor.astro
    - config
      - sponsorConfig.ts
:::

在 Mizuki 主题中，赞助页面的**展示逻辑**和**配置数据**是分开的：

*   **展示逻辑**: `src/pages/sponsor.astro`
    *   这个文件负责赞助页面的 HTML 结构、CSS 样式和 JavaScript 交互逻辑。
    *   它定义了赞助方式展示、赞助者列表等功能。
    *   **通常情况下，你不需要修改这个文件。**

*   **配置数据**: `src/config/sponsorConfig.ts`
    *   这个文件包含赞助页面的所有配置选项。
    *   你可以在这里设置页面标题、描述、赞助方式、赞助者列表等。

---

#### **2. sponsorConfig.ts 配置详解**

打开 `src/config/sponsorConfig.ts`，你会看到完整的配置结构：

```typescript
import type { SponsorConfig } from "../types/config";

// 赞助页面配置
export const sponsorConfig: SponsorConfig = {
  // 页面标题
  title: "支持与赞助",
  // 页面描述
  description: "如果这个项目对你有帮助，欢迎支持我继续创作",
  // 赞助用途说明
  usage: "你的支持将用于服务器维护、域名续费等开支，让项目能够持续运行下去。",
  // 赞助方式列表
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
  // 赞助者列表（可选）
  sponsors: [
    {
      name: "支持者A",
      amount: "50元",
      date: "2025-01-01",
    },
  ],
  // 是否显示赞助者列表
  showSponsorsList: true,
  // 是否显示评论区
  showComment: false,
  // 是否在文章详情页底部显示赞助按钮
  showButtonInPost: true,
};
```

**配置项说明**:

*   **title**: 页面标题，显示在页面顶部
*   **description**: 页面描述文本，显示在标题下方
*   **usage**: 赞助用途说明，会显示在一个信息框中
*   **methods**: 赞助方式数组，每个方式包含：
    *   **name**: 赞助方式名称，如 "支付宝"、"微信"、"PayPal"
    *   **icon**: 图标名称（Iconify 格式），如 "fa7-brands:alipay"
    *   **qrCode**: 收款码图片路径（需要放在 public 目录下），可选
    *   **link**: 赞助链接 URL，可选。如果提供，会显示跳转按钮
    *   **description**: 描述文本，可选
    *   **enabled**: 是否启用该赞助方式
*   **sponsors**: 赞助者列表数组（可选），每个赞助者包含：
    *   **name**: 赞助者名称
    *   **amount**: 赞助金额（可选）
    *   **date**: 赞助日期（可选，ISO 格式）
    *   **message**: 留言（可选）
*   **showSponsorsList**: 是否显示赞助者列表，默认 `true`
*   **showComment**: 是否显示评论区，默认 `false`
*   **showButtonInPost**: 是否在文章详情页底部显示赞助按钮，默认 `true`

---

#### **3. 添加赞助方式**

你可以添加多种赞助方式，支持二维码和跳转链接两种形式：

**二维码方式**:

```typescript
{
  name: "支付宝",
  icon: "fa7-brands:alipay",
  qrCode: "/sponsor/alipay.webp", // 将图片放在 public/sponsor/ 目录下
  description: "扫码支持",
  enabled: true,
}
```

**跳转链接方式**:

```typescript
{
  name: "PayPal",
  icon: "fa7-brands:paypal",
  link: "https://paypal.me/yourname",
  description: "通过 PayPal 支持",
  enabled: true,
}
```

**混合使用**: 你可以同时配置多种赞助方式，访客可以选择他们喜欢的方式。

---

#### **4. 添加赞助者**

在 `sponsors` 数组中添加赞助者信息：

```typescript
sponsors: [
  {
    name: "张三",
    amount: "100元",
    date: "2025-01-15",
    message: "加油！",
  },
  {
    name: "李四",
    amount: "50元",
    date: "2025-01-20",
  },
  {
    name: "匿名", // 可以显示为匿名
    amount: "任意金额",
  },
],
```

---

#### **5. 站点配置中的赞助页面开关**

在 `src/config.ts` 的 `siteConfig.featurePages` 中，你可以控制赞助页面的开关：

```typescript
featurePages: {
  // ... 其他页面
  sponsor: true, // 设置为 false 会禁用赞助页面
},
```

---

#### **6. 导航栏配置**

要在导航栏中显示赞助页面链接，在 `src/config.ts` 的 `navBarConfig` 中配置：

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.Sponsor, // 使用预设
    // ... 其他链接
  ],
};
```

或者手动添加：

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    {
      name: "赞助",
      url: "/sponsor/",
      icon: "material-symbols:favorite",
    },
    // ... 其他链接
  ],
};
```

---

#### **7. 最佳实践与建议**

*   **图片准备**: 收款码图片建议使用 WebP 格式以获得更好的加载性能
*   **图片存放**: 将收款码图片放在 `public/sponsor/` 目录下便于管理
*   **透明真诚**: 在 `usage` 中清楚说明赞助用途，让支持者知道他们的支持用在哪里
*   **及时更新**: 记得及时更新赞助者名单，表达感谢
*   **尊重隐私**: 如果赞助者不愿意公开，可以将名字设置为"匿名"

---

通过以上步骤，你就可以轻松配置和使用赞助页面了！
