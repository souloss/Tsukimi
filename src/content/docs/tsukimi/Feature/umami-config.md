---
title: Umami访问量统计配置说明
order: 5
icon: "ri:bar-chart-2-line"
badge:
  type: info
  text: v3
createTime: 2025/10/20 12:36:33
permalink: /feature/umami-config/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Umami 统计配置教程(V3版本)

Umami 是一个开源、注重隐私的网站分析工具，可以替代 Google Analytics。本教程将指导您如何在 Mizuki 主题中配置 Umami 统计功能。  

注意：本教程适用于 Mizuki 8.2(1dcaa61) 或更高版本。

## 什么是 Umami？

Umami 是一个开源的网站分析工具，具有以下特点：
- 开源且注重用户隐私
- 轻量级，不会影响网站性能
- 提供详细的访问统计信息
- 可自建服务或使用云服务

## 配置步骤

### 1. 注册并创建 Umami 账户

首先，您需要注册一个 Umami 账户：
1. 访问 [Umami 官网](https://umami.is/) 或使用自建的 Umami 服务
2. 注册账户并登录
3. 创建一个新的网站，获取网站ID

### 2. 获取必要信息

在 Umami 仪表板中，您需要获取以下信息：
- **umami统计分享链接** (shareURL)
- **跟踪脚本地址** (Tracking Script URL)

### 3. 配置 astro.config.mjs

打开 `astro.config.mjs` 文件，找到 `umami` 集成配置项：

```typescript title="astro.config.mjs"
import { umami } from "oddmisc";

export default defineConfig({
  integrations: [
    umami({
      shareUrl: "YOUR_SHARE_URL", // Umami 分享链接（见下方说明）如设置为 false 则禁用组件的umami访问量信息显示,不影响umami统计
    }),
    // ... 其他集成
  ],
});
```

:::warning Umami Cloud 用户注意
如果您使用的是 **Umami Cloud（官方托管服务）**，请注意：

从仪表盘复制的分享链接格式通常为：
```
https://cloud.umami.is/share/xxxxx
```

**不能直接使用此链接！** 您需要：
1. 在浏览器中手动访问该分享链接
2. 等待页面加载完成，浏览器会自动重定向到一个新的地址
3. 复制浏览器地址栏中最终显示的链接（格式类似 `https://cloud.umami.is/analytics/us/share/xxxxxxxxx`,具体是us还是eu取决于你注册时选择的数据中心位置）
4. 使用这个最终重定向后的链接作为 `shareUrl` 的值

:::

### 4. 配置 siteConfig.ts

打开 `src/config/siteConfig.ts` 文件，在 `analytics.umamiAnalytics` 配置中填写您的 Umami 信息：

```typescript title="src/config/siteConfig.ts"
analytics: {
  umamiAnalytics: {
    // Umami Website ID，在 Umami 后台获取
    websiteId: "your-website-id",
    // Umami JS 地址，云服务或自建服务的地址
    scriptUrl: "https://umami.example.com/script.js",
    // 是否追踪出站链接点击事件，默认 true
    trackOutboundLinks: true,
    // 是否自动收集访客浏览器核心网页指标，默认 false
    collectWebVitals: false,
    // 会话回放配置（可选）
    relpays: {
      enabled: false,
      sampleRate: 0.15,
      maskLevel: "moderate",
      maxDuration: 300000,
    },
  },
},
```

### 5. 完整配置示例

#### astro.config.mjs（用于显示访问量数据）

```typescript title="astro.config.mjs"
import { umami } from "oddmisc";

export default defineConfig({
  integrations: [
    umami({
      shareUrl: "https://cloud.umami.is/analytics/us/share/pNrbzntfHm1jet1f",
    }),
    // ... 其他集成
  ],
});
```

#### siteConfig.ts（用于数据追踪）

```typescript title="src/config/siteConfig.ts"
analytics: {
  umamiAnalytics: {
    websiteId: "606672ff-6f67-4dc0-8006-bfc094539ecb",
    scriptUrl: "https://cloud.umami.is/script.js",
  },
},
```

### 6. 保存并重新构建

1. 保存所有修改的文件
2. 重新构建您的网站：
   ```bash
   pnpm build
   ```
3. 部署您的网站

## 验证配置

配置完成后，您可以通过以下方式验证是否配置成功：

### ⚠️ 重要：延迟加载机制

为了优化页面加载性能，Umami 脚本**不会立即加载**，而是采用以下策略：

1. **等待用户交互**：用户进行滚动、鼠标移动、点击、按键等操作后才加载
2. **备用自动加载**：如果用户 10 秒内没有任何交互，会在浏览器空闲时自动加载

### 验证步骤

1. **检查页面源代码**：
   - 打开浏览器开发者工具 → Elements/元素面板
   - 搜索 `umamiEnable`，确认值为 `true`
   - 确认 `umamiWebsiteId` 和 `umamiScriptUrl` 配置正确

2. **触发加载并检查网络请求**：
   - 打开浏览器开发者工具 → Network/网络面板
   - 刷新页面
   - **移动鼠标或滚动页面**（这会触发 Umami 加载）
   - 在网络面板中搜索 `script.js`，确认有来自 Umami 服务器的请求
   - 随后应该会看到 `/api/collect` 请求，表示数据正在发送

3. **使用控制台验证**：
   - 在浏览器控制台输入 `window.analyticsLoaded`
   - 如果返回 `true` 表示分析脚本已加载

4. **查看 Umami 仪表板**：
   - 访问您的 Umami 后台
   - 查看实时访问数据，确认有访问记录

## 故障排除

如果配置后没有数据，请检查：

1. **确认 shareUrl 配置正确**（Umami Cloud 用户请确保使用重定向后的链接）
2. **检查跟踪脚本地址是否正确**
3. **查看浏览器控制台是否有错误信息**
4. **确认 Umami 服务是否正常运行**
5. **确保已触发用户交互**（移动鼠标或滚动页面）
6. **耐心等待最多 10 秒**，查看是否自动加载

## 隐私保护

Umami 重视用户隐私，不会收集个人身份信息。您可以在您的隐私政策中添加 Umami 的使用说明，以确保透明度。
