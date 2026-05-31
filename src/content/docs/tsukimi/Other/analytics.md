---
title: 统计分析配置
createTime: 2026/05/20 12:00:00
permalink: /other/analytics/
order: 10
icon: ri:bar-chart-2-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 统计分析配置

Mizuki 支持多种统计分析服务，包括 Google Analytics、Microsoft Clarity、Umami 和 51la。所有配置位于 `src/config.ts` 中的 `siteConfig.analytics` 对象。

## 综合分析配置 (analytics)

```typescript title="src/config.ts"
siteConfig: {
  analytics: {
    googleAnalyticsId: "G-XXXXXXXXXX",     // Google Analytics ID
    microsoftClarityId: "xxxxxxxxxxxx",     // Microsoft Clarity ID
    umamiAnalytics: {
      websiteId: "your-website-id",         // Umami Website ID
      scriptUrl: "https://analytics.umami.is/umami.js", // Umami JS 地址
      trackOutboundLinks: true,             // 追踪出站链接点击
      collectWebVitals: false,              // 自动收集 Core Web Vitals
      relpays: {
        enabled: false,                     // 启用会话回放
        sampleRate: 0.15,                   // 采样率 (0-1)
        maskLevel: "moderate",              // 隐私遮罩级别
        maxDuration: 300000,                // 最大录制时长(ms)
        blockSelector: "",                  // 排除录制的 CSS 选择器
      },
    },
    la51Analytics: {
      Id: "your-51la-id",                   // 51la 统计 ID
      sdkUrl: "//sdk.51.la/js-sdk-pro.min.js", // SDK 地址
      ck: "",                               // 数据分离标识
      autoTrack: true,                      // 事件分析功能
      hashMode: false,                      // Hash 路由模式
      screenRecord: true,                   // 网站录屏功能
    },
  },
}
```

## 配置项说明

### Google Analytics

| 字段 | 类型 | 说明 |
|------|------|------|
| `googleAnalyticsId` | `string` | Google Analytics 追踪 ID，格式为 `G-XXXXXXXXXX` |

### Microsoft Clarity

| 字段 | 类型 | 说明 |
|------|------|------|
| `microsoftClarityId` | `string` | Microsoft Clarity 项目 ID |

### Umami Analytics

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `websiteId` | `string` | - | Umami 网站 ID |
| `scriptUrl` | `string` | - | Umami JS 地址，支持自建服务 |
| `trackOutboundLinks` | `boolean` | `true` | 是否追踪出站链接点击事件 |
| `collectWebVitals` | `boolean` | `false` | 是否自动收集 Core Web Vitals 指标 |

#### Umami 会话回放 (relpays)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | `boolean` | `false` | 是否启用会话回放 |
| `sampleRate` | `number` | `0.15` | 录制采样率，范围 0-1 |
| `maskLevel` | `"moderate" \| "strict"` | `"moderate"` | 隐私遮罩级别 |
| `maxDuration` | `number` | `300000` | 单次录制最大时长（毫秒） |
| `blockSelector` | `string` | - | 排除录制的元素 CSS 选择器 |

### 51la Analytics

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Id` | `string` | - | 51la 统计 ID |
| `sdkUrl` | `string` | `"//sdk.51.la/js-sdk-pro.min.js"` | 自定义 SDK 地址，防止 DNS 污染 |
| `ck` | `string` | 同 Id | 多个统计 ID 的数据分离标识 |
| `autoTrack` | `boolean` | `true` | 开启事件分析功能 |
| `hashMode` | `boolean` | `false` | Hash 路由模式（项目使用 History API，不必开启） |
| `screenRecord` | `boolean` | `true` | 开启网站录屏功能 |

## 第三方统计配置 (thirdPartyAnalytics)

除了 `analytics` 综合配置外，还有独立的第三方统计配置，主要用于 Microsoft Clarity：

```typescript title="src/config.ts"
thirdPartyAnalytics: {
  enable: false,        // 是否启用第三方统计，默认关闭
  clarityId: "",        // Clarity 项目 ID
},
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `enable` | `boolean` | 是否启用第三方统计（可能影响 Lighthouse 评分） |
| `clarityId` | `string` | Microsoft Clarity 项目 ID |

## 性能优化

统计脚本采用延迟加载策略，不会阻塞页面首次渲染：

- 脚本仅在用户交互后加载（scroll、mousemove、keydown、touchstart、click）
- 设置了 10 秒兜底超时，确保统计脚本最终加载
- `thirdPartyAnalytics.enable` 默认关闭，因为第三方统计可能影响 Lighthouse 评分

## Umami 集成说明

Umami 的部分配置已移至 `astro.config.mjs`：

```javascript title="astro.config.mjs"
oddmisc({
  umami: {
    shareUrl: false,
  },
}),
```

如需手动插入统计脚本到 `<head>` 中，请编辑 `src/layouts/Layout.astro`。
