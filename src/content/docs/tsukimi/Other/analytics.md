---
title: 统计分析配置
createTime: 2026/09/25
permalink: /other/analytics/
order: 10
icon: ri:bar-chart-2-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 统计分析配置

Tsukimi 的运行时统计入口集中在 `src/layouts/partials/AnalyticsScripts.astro`。当前实现支持：

- **Umami**：通过 `siteConfig.analytics.umamiAnalytics` 加载脚本。
- **Microsoft Clarity**：通过 `siteConfig.thirdPartyAnalytics.enable` 与 `clarityId` 加载。
- **Google Tag Manager**：通过 `siteConfig.thirdPartyAnalytics.gtmId` 加载，并在 `Layout.astro` 中输出 noscript 回退。

如需接入其他分析服务，需要通过自定义集成或组件实现；本配置页只列出主题当前会加载的 Umami、Clarity 和 GTM。

## 配置示例

```ts title="src/overrides/siteConfig.ts"
import type { SiteConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<SiteConfig> = {
  analytics: {
    umamiAnalytics: {
      websiteId: "your-website-id",
      scriptUrl: "https://analytics.example.com/script.js",
      trackOutboundLinks: true,
      collectWebVitals: true,
      relpays: {
        enabled: false,
        sampleRate: 0.15,
        maskLevel: "moderate",
        maxDuration: 300000,
      },
    },
  },
  thirdPartyAnalytics: {
    enable: true,
    clarityId: "your-clarity-id",
    gtmId: "GTM-XXXXXXX",
  },
};

export default override;
```

### Umami 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `websiteId` | `string` | Umami 后台的网站 ID；与 `scriptUrl` 同时填写才会加载。 |
| `scriptUrl` | `string` | Umami script URL，可使用云服务或自建地址。 |
| `trackOutboundLinks` | `boolean` | 是否追踪出站链接，默认 `true`。 |
| `collectWebVitals` | `boolean` | 是否收集 Core Web Vitals，默认 `false`。 |
| `relpays.enabled` | `boolean` | 是否启用会话回放，默认 `false`。 |
| `relpays.sampleRate` | `number` | 回放采样率，范围 `0` 到 `1`。 |
| `relpays.maskLevel` | `moderate \| strict` | 隐私遮罩级别。 |
| `relpays.maxDuration` | `number` | 单次回放最大时长，单位毫秒。 |
| `relpays.blockSelector` | `string` | 可选的排除录制元素 CSS 选择器。 |

### Clarity 与 GTM 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `thirdPartyAnalytics.enable` | `boolean` | 是否允许 Clarity 加载；默认 `false`。 |
| `thirdPartyAnalytics.clarityId` | `string` | Clarity 项目 ID。 |
| `thirdPartyAnalytics.gtmId` | `string` | Google Tag Manager 容器 ID；为空时不注入 GTM。 |

## 延迟加载行为

为减少首屏阻塞，脚本不会在页面解析时立即下载：

1. 页面监听 `scroll`、`mousemove`、`keydown`、`touchstart` 和 `click`。
2. 首次用户交互会执行所有已配置的加载器。
3. 用户始终没有交互时，10 秒定时器会触发加载。
4. `window.analyticsLoaded` 变为 `true` 后不会重复加载。

因此测试统计时需要先滚动或点击页面，再检查浏览器 Network 面板。Umami 脚本还会通过 `data-*` 属性接收出站链接、Web Vitals 和回放设置。

## 隐私与性能

第三方分析会将页面信息发送给外部服务，并可能影响 Lighthouse 结果。启用前应：

- 在隐私政策中说明使用的服务和数据类型。
- 对会话回放设置合理的采样率、遮罩级别和排除选择器。
- 不要在公开配置中提交访问 Token；统计 ID 通常不是密码，但仍应按服务商建议管理。
- 在开发环境验证配置后，再在生产站点开启。

修改配置后运行 `pnpm check`，部署前使用 `pnpm build && pnpm preview` 检查页面和网络请求。
