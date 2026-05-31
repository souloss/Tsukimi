---
title: 背景壁纸配置
createTime: 2026/05/20 12:00:00
permalink: /basic-layout/background-wallpaper/
order: 4
icon: ri:image-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 背景壁纸配置

背景壁纸配置位于 `src/config/backgroundWallpaper.ts` 文件中，是 Mizuki 主题的核心配置之一。它支持四种不同的壁纸模式：Banner（横幅模式）、Fullscreen（全屏模式）、Overlay（覆盖层模式）和 None（无壁纸模式）。

## 基本配置

```typescript title="src/config/backgroundWallpaper.ts"
export const backgroundWallpaperConfig: BackgroundWallpaperConfig = {
    defaultMode: WALLPAPER_BANNER,  // 默认壁纸模式
    switchable: true,               // 是否允许用户切换壁纸模式
    showModeSwitch: {
        enable: true,
        visibility: "desktop",  // "off" | "mobile" | "desktop" | "both"
    },
    src: { ... },                   // 壁纸图片源（支持桌面端/移动端分别设置）
    banner: { ... },                // Banner 模式配置
    fullscreen: { ... },            // Fullscreen 模式配置
    overlay: { ... },               // Overlay 模式配置
};
```

## 配置项说明

### 主配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `defaultMode` | `WALLPAPER_MODE` | 默认壁纸模式，使用常量值 |
| `switchable` | `boolean` | 是否允许用户通过控制面板切换壁纸模式 |
| `showModeSwitch` | `object` | 模式切换按钮显示设置 |
| `src` | `string \| string[] \| {desktop?, mobile?}` | 壁纸图片源 |

### showModeSwitch 配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `enable` | `boolean` | 是否显示切换按钮 |
| `visibility` | `"off" \| "mobile" \| "desktop" \| "both"` | 显示位置 |

## 四种壁纸模式详解

### 1. Banner 模式（横幅模式）

Banner 模式是默认模式，在页面顶部显示横幅区域。

```typescript
banner: {
    src: {
        desktop: ["/assets/desktop-banner/1.webp", "/assets/desktop-banner/2.webp"],
        mobile: ["/assets/mobile-banner/1.webp"],
    },
    position: "center",
    carousel: { enable: true, switchable: true, interval: 3 },
    waves: { enable: true, switchable: true, performanceMode: false, mobileDisable: false },
    gradient: {
        enable: true,
        switchable: true,
        colors: [
            { color: "var(--color-bg)", stop: 0.2 },
            { color: "transparent", stop: 0.7 },
        ],
    },
    homeText: {
        enable: true,
        switchable: true,
        title: "我的小窝",
        subtitle: ["没有什么特别的，但有你在就足够了"],
        typewriter: { enable: true, speed: 100, deleteSpeed: 50, pauseTime: 2000 },
    },
    credit: { enable: false, text: "", url: "" },
    navbar: { transparentMode: "semifull" },
    imageApi: { enable: false, url: "" },
},
```

### 2. Fullscreen 模式（全屏模式）

Fullscreen 模式将背景图片铺满整个浏览器窗口。

```typescript
fullscreen: {
    src: {
        desktop: ["/assets/desktop-banner/1.webp"],
        mobile: ["/assets/mobile-banner/1.webp"],
    },
    position: "center",
    carousel: { enable: true, interval: 5 },
    zIndex: -1,
    opacity: 0.8,
    blur: 1,
    gradient: {
        enable: true,
        colors: [
            { color: "var(--color-bg)", stop: 0.3 },
            { color: "transparent", stop: 0.8 },
        ],
    },
},
```

Fullscreen 模式特有配置：

| 字段 | 类型 | 说明 |
|------|------|------|
| `zIndex` | `number` | 背景层级 |
| `opacity` | `number` | 背景透明度 |
| `blur` | `number` | 背景模糊度(px) |
| `gradient` | `object` | 渐变遮罩配置 |

### 3. Overlay 模式（覆盖层模式）

Overlay 模式在页面角落显示一张装饰性图片。

```typescript
overlay: {
    src: "/assets/desktop-banner/1.webp",
    position: "bottom-right",  // "top-left" | "top-right" | "bottom-left" | "bottom-right"
    size: { width: 300, height: 400 },
    opacity: 0.9,
    blur: 0,
    cardOpacity: 0.9,
    borderRadius: "1rem",
    margin: "1rem",
    zIndex: 0,
    shadow: true,
    switchable: {
        opacity: true,
        blur: true,
        cardOpacity: true,
    },
},
```

Overlay 模式特有配置：

| 字段 | 类型 | 说明 |
|------|------|------|
| `size` | `{width, height}` | 图片尺寸(px) |
| `cardOpacity` | `number` | 卡片区域透明度 |
| `borderRadius` | `string` | 圆角半径 |
| `margin` | `string` | 外边距 |
| `shadow` | `boolean` | 是否显示阴影 |
| `switchable` | `{opacity?, blur?, cardOpacity?}` | 各属性是否允许用户调整 |

### 4. None 模式（无壁纸模式）

None 模式禁用所有背景壁纸，使用纯颜色背景（主题色）。

## 共享配置 (common)

横幅和全屏模式共享的配置：

| 字段 | 类型 | 说明 |
|------|------|------|
| `common.dimOpacity` | `number` | 横幅文字遮罩暗度 (0-1) |
| `common.homeText` | `object` | 首页自定义文字配置 |
| `common.navbar` | `object` | 导航栏透明模式配置 |
| `common.waves` | `object` | 水波纹效果配置 |

## PicFlow API 集成

Banner 模式支持 PicFlow API 动态获取图片：

```typescript
imageApi: {
    enable: false,
    url: "http://domain.com/api_v2.php?format=text&count=4",
},
```

API 要求返回纯文本，每行一个图片 URL。这是构建时静态获取，不是运行时动态加载。

## 模式切换功能

用户可以在前端实时切换壁纸模式，选择保存在 `localStorage` 中。通过 `showModeSwitch` 控制切换按钮的显示位置。

```typescript
showModeSwitch: {
    enable: true,
    visibility: "both",  // 在所有设备上显示切换按钮
},
```