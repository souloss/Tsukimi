---
title: 站点配置
createTime: 2026/09/25
permalink: /basic-layout/site-config/
order: 1
icon: ri:settings-3-line
badge:
  type: info
  text: 核心配置
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

站点核心配置位于 `src/config/siteConfig.ts`，导出 `siteConfig`。它控制站点身份、语言、首页文章列表、壁纸文案、文章页目录、特色页面和统计等全局行为。配置类型见 `src/types/config.ts` 中的 `SiteConfig`。

如果使用内容分离或不希望修改主题源码，可在 `src/overrides/siteConfig.ts` 写同结构的部分字段；详见[配置模块化](/docs/tsukimi/basic-layout/config-modularization/)。

## 最小配置

```ts title="src/overrides/siteConfig.ts"
import type { SiteConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<SiteConfig> = {
  title: "我的博客",
  subtitle: "记录、分享与长期维护",
  siteURL: "https://example.com/",
  lang: "zh_CN",
  themeColor: {
    hue: 210,
    fixed: false,
  },
};

export default override;
```

`siteURL` 应使用公开站点的规范 URL，并以 `/` 结尾。默认配置里的站点信息只是示例，部署前必须替换。

## 站点身份与主题

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 站点主标题，参与页面标题和导航栏回退。 |
| `subtitle` | `string` | 副标题，显示在首页/元信息中。 |
| `siteURL` | `string` | 站点绝对 URL，建议以 `/` 结尾，用于 sitemap、RSS 和绝对链接。 |
| `description` | `string` | 可选的站点描述，用于 meta description。 |
| `keywords` | `string[]` | 可选的站点关键词。 |
| `lang` | `string` | 默认语言：`en`、`zh_CN`、`zh_TW`、`ja`、`ko`、`es`、`th`、`vi`、`tr`、`id`。 |
| `timezone` | `string` | 可选的 IANA 时区，例如 `Asia/Shanghai` 或 `UTC`。 |
| `siteStartDate` | `YYYY-MM-DD` | 站点运行天数的起算日期。 |
| `themeColor.hue` | `number` | 主题色相，通常为 `0` 到 `360`。 |
| `themeColor.fixed` | `boolean` | `true` 时隐藏访客主题色选择。 |
| `themeColor.defaultMode` | `light \| dark \| system` | 可选的初始明暗模式。 |
| `pageWidth` | `number` | 可选的整体宽度，单位为 `rem`。 |
| `card.border` | `boolean` | 是否显示卡片边框和阴影。 |
| `card.followTheme` | `boolean` | 卡片样式是否跟随主题色相。 |

## 特色页面开关

`featurePages` 控制页面是否参与构建和导航。关闭后，对应路由会从生产输出中移除；同时请从 `navBarConfig.links` 删除相应菜单项。

| 键 | 路由 | 用途 |
| --- | --- | --- |
| `anime` | `/anime/` | Bangumi、Bilibili 或本地番剧列表。 |
| `talking` | `/talking/` | 动态/说说，可选 Memos API。 |
| `friends` | `/friends/` | 友链和可选的朋友圈 RSS。 |
| `projects` | `/projects/` | 项目展示。 |
| `skills` | `/skills/` | 技能/技术栈展示。 |
| `timeline` | `/timeline/` | 时间线。 |
| `albums` | `/albums/` | 相册。 |
| `devices` | `/devices/` | 设备列表。 |
| `series` | `/series/` | 文章系列索引。 |
| `reposts` | `/reposts/` | 转载文章索引。 |
| `guestbook` | `/guestbook/` | 留言板。 |
| `sponsor` | `/sponsor/` | 赞助页面。 |
| `knowledgeGraph` | `/knowledge-graph/` | 文章关系图谱。 |

示例：

```ts
featurePages: {
  anime: false,
  albums: false,
  knowledgeGraph: true,
  // 其他键保持默认值或按需设置
},
```

## 导航栏标题与导航

顶部品牌区由 `siteConfig.navbarTitle` 控制，菜单链接和下拉菜单由 `src/config/navBarConfig.ts` 控制。`navbarTitle` 同时用于博客页与文档页导航栏；未配置该对象时，导航栏使用 `siteConfig.title` 和默认图标。设置对象后，按 `mode` 选择文字加图标或 Logo 图片。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `navbarTitle.mode` | `text-icon \| logo` | `text-icon` 显示文字和图标；`logo` 显示图片。 |
| `navbarTitle.text` | `string` | 品牌文字；Logo 模式下也用作图片替代文本。 |
| `navbarTitle.icon` | `string` | `text-icon` 模式使用的图标图片路径。 |
| `navbarTitle.logo` | `string` | `logo` 模式使用的图片路径。 |

```ts
navbarTitle: {
  mode: "text-icon",
  text: "我的博客",
  icon: "assets/home/home-128.webp",
  logo: "assets/home/default-logo.webp",
},
```

本地图片通常放在 `src/assets/`（由 Astro 处理）或 `public/`（以 `/...` URL 引用）。`siteConfig.navbar.stickyNavbar` 设置访客尚未选择时的吸顶导航默认值；访客可以在显示设置中覆盖，选择保存在浏览器本地。菜单结构和 Pagefind 搜索入口见[导航栏配置](/docs/tsukimi/basic-layout/navbarconfig/)。

## 超宽屏页面缩放

`pageScaling` 仅调整桌面端根字号，避免宽屏下布局显得过小；它不会放大页面。默认在宽度不超过 `1280px`、触屏设备或竖屏时不调整。桌面端按视口宽度与 `targetWidth` 的比例缩小根字号，缩放范围限制为 `85%` 到 `100%`。

```ts
pageScaling: {
  enable: true,
  targetWidth: 2000,
},
```

`targetWidth` 是根字号达到 `100%` 的参考宽度，默认 `2000`；例如宽度为 `1600px` 时比例会被限制在 `85%`，宽度达到或超过参考值时使用 `100%`。完整行为和注意事项见[页面自动缩放](/docs/tsukimi/basic-layout/auto-res-algo/)。

## 首页文章列表

```ts
postListLayout: {
  defaultMode: "list",       // "list" 或 "grid"
  mobileDefaultMode: "list", // 可选
  showTags: true,
  descriptionLines: 2,        // 0 表示不截断
  allowSwitch: true,
  categoryBar: { enable: true },
  grid: {
    masonry: false,
    columnWidth: 320,
  },
},
tagStyle: {
  useNewStyle: false,
},
```

`grid` 仅在网格模式或允许用户切换布局时使用；`columnWidth` 是卡片最小宽度（像素），列数由容器宽度自动计算。分页数量可通过可选的 `pagination.postsPerPage` 设置。

## Banner 文案与行为

`siteConfig.banner` 只负责 Banner 行为、首页文字和导航栏透明度；图片路径、轮播图片和壁纸模式在 `src/config/backgroundWallpaper.ts` 的 `backgroundWallpaperConfig` 中配置。

```ts
banner: {
  carousel: { enable: true, interval: 3, switchable: true },
  waves: {
    enable: true,
    switchable: true,
    performanceMode: false,
    mobileDisable: false,
  },
  gradient: {
    enable: true,
    switchable: true,
    colors: [
      { color: "var(--color-bg)", stop: 0.2 },
      { color: "transparent", stop: 0.7 },
    ],
  },
  bannerHomeText: {
    enable: true,
    switchable: true,
    title: "我的博客",
    subtitle: ["第一句副标题", "第二句副标题"],
    typewriter: {
      enable: true,
      speed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
    },
  },
  wallpaperHomeText: {
    enable: true,
    switchable: true,
    title: "我的博客",
    subtitle: "壁纸模式使用的文字",
  },
  credit: { enable: false, text: "", url: "" },
  navbar: { transparentMode: "none", enableBlur: true, blur: 10 },
},
```

`wallpaperHomeText` 未设置时会回退到 `bannerHomeText`。壁纸模式的完整字段见[背景壁纸](/docs/tsukimi/basic-layout/background-wallpaper/)。

## 文章页与分享

```ts
toc: {
  enable: true,
  mobileTop: true,
  desktopSidebar: true,
  floating: false,
  depth: 2, // 1、2 或 3
  useJapaneseBadge: false,
},
showCoverInContent: true,
showLastModified: true,
sharePoster: true,
pageProgressBar: {
  enable: true,
  height: 3,
  duration: 6000,
},
```

目录由 `toc` 控制；文章底部的分享海报由 `sharePoster` 控制，赞助按钮由 `sponsorConfig.showButtonInPost` 和赞助特色页开关共同控制。`showLastModified` 控制文章编辑信息卡片是否显示；单篇文章的 `updated` 日期见[Frontmatter 参考](/docs/tsukimi/press/article-types/frontmatter/)。

## 统计与隐私

### Umami、Clarity 与 GTM

当前运行时实际加载三类分析脚本：`analytics.umamiAnalytics` 中配置的 Umami、`thirdPartyAnalytics.clarityId` 控制的 Microsoft Clarity，以及 `thirdPartyAnalytics.gtmId` 控制的 Google Tag Manager。`AnalyticsScripts.astro` 会在用户交互或 10 秒兜底时延迟加载这些脚本；没有有效 ID/URL 时不会发送数据。

```ts
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
  enable: false,
  clarityId: "",
  gtmId: "",
},
```

第三方脚本会影响隐私与性能。会话回放必须评估遮罩和法律合规；不要把用户输入或敏感页面纳入录制。更多字段见[统计分析](/docs/tsukimi/other/analytics/)和 [Umami 配置](/docs/tsukimi/feature/umami-config/)。

### OG 图片与 favicon

```ts
generateOgImages: false,
favicon: [],
```

OG 图片按文章路由生成，开启后会增加构建耗时；`favicon` 可提供多个带 `src`、`theme` 和 `sizes` 的图标。仓库另有手动静态图片转换脚本，但不会在构建或运行时自动改写文章图片；见[静态图片转换](/docs/tsukimi/basic-layout/image-optimization/)。

## 番剧与动态

```ts
bangumi: {
  userId: "your-bangumi-id",
  fetchOnDev: false,
  categoryOrder: ["anime", "game", "book", "music", "real"],
},
bilibili: {
  vmid: "your-bilibili-vmid",
  fetchOnDev: false,
  coverMirror: "",
  useWebp: true,
},
anime: { mode: "local" }, // "local"、"bangumi" 或 "bilibili"
talkingApiUrl: "",
talkingShowComment: true,
```

远程数据通常由 `pnpm update-anime`、`pnpm update-bangumi` 或 `pnpm update-bilibili` 更新；开发环境默认不请求远程服务。先在相应特色页面文档中完成数据文件和账号配置，再打开对应开关。

## 相关模块

`siteConfig` 只覆盖全局行为，以下模块负责各自功能：

| 模块 | 用途 |
| --- | --- |
| `backgroundWallpaperConfig` | Banner、全屏、叠加层和无壁纸模式。 |
| `navBarConfig` | 菜单项、下拉菜单和搜索入口。 |
| `sidebarLayoutConfig` | 左/右/抽屉侧栏及响应式组件。 |
| `commentConfig` | 支持 Twikoo、Waline、Giscus，详见对应评论配置文档。 |
| `musicPlayerConfig` | 本地或 Meting 播放列表。 |
| `effectsConfig` | 樱花等视觉特效。 |
| `fontConfig` | 字体选项与用户端切换。 |
| `expressiveCodeConfig` | 代码块明暗主题、折叠和语言徽章。 |
| `relatedPostsConfig` / `randomPostsConfig` | 文章底部推荐。 |
| `siteConfig.sharePoster` / `sponsorConfig` | 文章分享海报与赞助入口。 |
| `permalinkConfig` / `licenseConfig` | 全局固定链接与版权声明。 |

完成修改后运行 `pnpm check`；涉及 OG、图表、数据更新或路由时再运行 `pnpm build`，并在 `pnpm preview` 中确认生产结果。
