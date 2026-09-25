---
title: Banner 配置
createTime: 2026/09/25
permalink: /basic-layout/layout/banner/
order: 1
icon: ri:layout-top-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Banner 配置

Tsukimi 将 Banner 配置拆为两部分：

- siteConfig.banner（文件 src/config/siteConfig.ts）：轮播行为、水波纹、渐变、首页文字和导航栏透明度。
- backgroundWallpaperConfig.banner（文件 src/config/backgroundWallpaper.ts）：桌面/移动端图片、图片位置和可选图片 API。

不要再把两个对象合并到旧的 src/config.ts；该文件已经不存在。

## 图片资源

```ts title="src/config/backgroundWallpaper.ts"
banner: {
  src: {
    desktop: [
      "/assets/desktop-banner/1.webp",
      "/assets/desktop-banner/2.webp",
    ],
    mobile: [
      "/assets/mobile-banner/1.webp",
      "/assets/mobile-banner/2.webp",
    ],
  },
  position: "center top",
  imageApi: {
    enable: false,
    url: "https://example.com/images.txt",
  },
},
```

src 可以是字符串、字符串数组，或同时声明 desktop/mobile 的对象。图片 URL 应指向 public/ 资源（例如 /assets/...）或可公开访问的外部地址。启用 imageApi 时，接口应返回每行一个图片 URL；外部服务的可用性、CORS 和许可由站点作者负责。

## 行为和首页文字

```ts title="src/config/siteConfig.ts"
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

| 路径 | 说明 |
| --- | --- |
| carousel.enable / interval | 是否轮播以及轮播间隔（秒）；switchable 控制设置面板是否允许用户切换。 |
| waves.enable | Banner 水波纹动画总开关；performanceMode 降低动画复杂度，mobileDisable 可在移动端禁用。 |
| gradient | 叠加在 Banner 上的渐变遮罩；colors 的 stop 为 0 到 1。 |
| bannerHomeText | Banner 模式首页标题、副标题和打字机参数。 |
| wallpaperHomeText | 全屏/壁纸模式文字；未设置时回退到 bannerHomeText。 |
| credit | 是否显示图片来源文本和可选链接。 |
| navbar | Banner 模式下导航栏透明度、毛玻璃和模糊程度。 |

## 资源和性能建议

- 优先使用 WebP/AVIF，分别准备桌面和移动图片，避免移动端下载超大宽图。
- 水波纹、轮播和外部图片 API 都会增加运行时或网络开销；低端设备可打开 performanceMode 或关闭 waves。
- 图片来源和外部 API 需要遵守版权、隐私和 CORS 规则；不要把含 Token 的 API URL 放进公开配置。
- 修改配置后运行 pnpm check，生产发布前使用 pnpm build && pnpm preview 检查图片路径和轮播行为。

全屏、叠加层和无壁纸模式见背景壁纸总览（/docs/tsukimi/basic-layout/background-wallpaper/）；页面整体文案和首页开关见站点配置（/docs/tsukimi/basic-layout/site-config/）。
