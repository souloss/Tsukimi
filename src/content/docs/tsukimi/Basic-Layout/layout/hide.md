---
title: 纯色背景配置
createTime: 2026/09/25
permalink: /basic-layout/layout/hide/
order: 3
icon: ri:paint-brush-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 纯色背景配置

无图模式由 src/config/backgroundWallpaper.ts 的 backgroundWallpaperConfig.mode 控制。旧版 wallpaperMode 和 src/config.ts 路径已废弃。

## 配置示例

```ts title="src/overrides/backgroundWallpaper.ts"
import type { BackgroundWallpaperConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<BackgroundWallpaperConfig> = {
  mode: {
    defaultMode: "none",
    switchable: true,
    showModeSwitch: {
      enable: true,
      visibility: "desktop",
    },
  },
};

export default override;
```

mode.defaultMode 可选 banner、fullscreen、overlay 或 none。设置为 none 后站点使用纯色背景；common.navbar 仍可控制导航栏是否启用模糊和透明。

mode.switchable 为 true 时，访客可切换壁纸模式；showModeSwitch.visibility 可设置 off、mobile、desktop 或 both。若不希望用户切换，将 switchable 设为 false 并隐藏切换按钮。

无图模式不会删除或移动图片资源，只是不渲染壁纸层。完成修改后运行 pnpm check，并在移动和桌面视口各确认一次导航栏及卡片对比度。
