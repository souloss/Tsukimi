---
title: 全屏壁纸配置
createTime: 2026/09/25
permalink: /basic-layout/layout/fullscreen/
order: 2
icon: ri:fullscreen-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 全屏壁纸配置

全屏壁纸是 backgroundWallpaperConfig 的一个模式，配置文件为 src/config/backgroundWallpaper.ts。旧版 fullscreenWallpaperConfig 和 src/config.ts 路径已废弃。

## 配置示例

在 `src/overrides/backgroundWallpaper.ts` 中覆盖默认配置：

```ts title="src/overrides/backgroundWallpaper.ts"
import type { BackgroundWallpaperConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<BackgroundWallpaperConfig> = {
  mode: {
    defaultMode: "fullscreen",
    switchable: true,
  },
  fullscreen: {
    src: {
      desktop: ["/assets/desktop-banner/1.webp"],
      mobile: ["/assets/mobile-banner/1.webp"],
    },
    carousel: { enable: true, interval: 5 },
    opacity: 0.8,
    blur: 1,
  },
};

export default override;
```

## 字段说明

| 字段 | 说明 |
| --- | --- |
| src | 字符串、数组或 desktop/mobile 图片对象；图片一般放在 public/。 |
| position | CSS object-position，例如 center top。 |
| carousel | 是否轮播和轮播间隔（秒）。 |
| zIndex | 背景图层层级，默认负值以避免遮挡内容。 |
| opacity | 壁纸不透明度，范围 0 到 1。 |
| blur | 背景模糊程度，单位为像素。 |
| gradient | 是否叠加渐变以及颜色停止点。 |
| navbar | 全屏模式下覆盖通用导航栏透明度和模糊配置。 |

## 模式切换

mode.defaultMode 负责默认模式；mode.switchable 和 mode.showModeSwitch 控制访客是否能从导航栏切换模式。可选值为 banner、fullscreen、overlay、none。无图模式见纯色背景配置。

全屏壁纸会增加图片下载和解码成本。为移动端提供单独资源，控制轮播数量，并在生产环境运行 pnpm build && pnpm preview 验证路径。
