---
title: 显示设置面板
order: 6
icon: "ri:settings-4-line"
badge:
  type: warning
  text: 新
createTime: 2025/05/20 00:00:00
permalink: /feature/display-settings/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

**显示设置面板说明**

Mizuki 主题内置了一个功能强大的统一显示设置面板，位于 `src/components/features/settings/DisplaySettings.svelte`。用户可以在前端实时调整多种显示选项，所有设置都会自动保存到浏览器的 `localStorage` 中。

---

## 功能概览

显示设置面板包含以下配置类别：

| 类别 | 功能描述 |
|------|----------|
| 主题颜色 | 色相调整、重置为默认、亮色/暗色模式切换 |
| 壁纸模式 | Banner / Fullscreen / Overlay / None 四种模式切换 |
| Overlay设置 | 透明度调整、模糊度调整、卡片透明度 |
| Banner设置 | 标题显示切换、轮播开关、水波纹效果、渐变背景 |
| 特效设置 | 樱花飘落特效开关 |
| 导航栏设置 | 固定导航栏开关 |
| 字体设置 | 四种预设字体切换 |
| 布局设置 | 文章列表布局切换（列表/网格） |

---

## 设置项详解

### 1. 主题颜色设置

```typescript
// 用户可调整的设置
hue: number; // 色相值 0-360
themeMode: 'light' | 'dark' | 'system'; // 主题模式
```

**功能说明**:
- **色相滑块**: 用户可以拖动滑块实时调整主题色的色相（0-360°）
  - 0° - 红色
  - 60° - 黄色
  - 120° - 绿色
  - 180° - 青色
  - 240° - 蓝色
  - 300° - 品红色
  - 340-360° - 粉色
- **重置按钮**: 一键恢复到网站配置的默认色相值
- **主题模式切换**: 亮色模式、暗色模式、跟随系统

**配置限制**: 如果 `siteConfig.themeColor.fixed === true`，用户将无法调整主题色。

---

### 2. 壁纸模式切换

```typescript
wallpaperMode: 'banner' | 'fullscreen' | 'overlay' | 'none';
```

用户可以实时切换四种壁纸模式，切换立即生效并保存。详细模式说明请参考 [背景壁纸配置](/docs/mizuki/basic-layout/background-wallpaper/) 文档。

---

### 3. Overlay 设置

仅在 Overlay 壁纸模式下可用：

```typescript
overlayOpacity: number; // 0-1，默认 0.15
overlayBlur: number; // 0-20px，默认 0
cardOpacity: number; // 0.5-1，卡片背景透明度
```

**配置项说明**:
- `overlayOpacity`: 覆盖层图片的透明度，建议 0.1-0.3
- `overlayBlur`: 覆盖层图片的模糊度，可创造梦幻效果
- `cardOpacity`: 内容卡片的背景透明度，创造玻璃拟态效果

---

### 4. Banner 设置

仅在 Banner 壁纸模式下可用：

```typescript
showBannerTitle: boolean; // 是否显示横幅标题
enableBannerCarousel: boolean; // 是否启用图片轮播
enableWaves: boolean; // 是否启用水波纹效果
enableBannerGradient: boolean; // 是否启用渐变遮罩
```

**配置项说明**:
- `showBannerTitle`: 控制横幅上的标题和副标题是否显示
- `enableBannerCarousel`: 多张横幅图片时是否自动轮播
- `enableWaves`: 水波纹动画效果开关，可提升性能
- `enableBannerGradient`: 是否在 Banner 图片上叠加渐变遮罩以增强文字可读性

---

### 5. 特效设置

```typescript
enableSakura: boolean; // 是否启用樱花飘落特效
```

**樱花特效**: 启用后页面会有樱花花瓣飘落的动画效果。详细配置请参考 [特效配置](/docs/mizuki/feature/effects-config/) 文档。

---

### 6. 导航栏设置

```typescript
stickyNavbar: boolean; // 是否启用固定导航栏
```

启用后，导航栏会在页面滚动时固定在顶部。

---

### 7. 字体设置

```typescript
fontPreset: 'system' | 'literata' | 'lxgw' | '2d';
```

四种预设字体：

| 预设 | 说明 | 适用场景 |
|------|------|----------|
| `system` | 系统默认字体 | 通用场景，加载最快 |
| `literata` | Google Literata 字体 | 文学博客、阅读体验 |
| `lxgw` | LXGW 霞鹜文楷 | 中文内容、艺术感 |
| `2d` | 二次元风格字体 | ACG 相关网站 |

详细字体配置请参考 [字体配置](/docs/mizuki/basic-layout/font-config/) 文档。

---

### 8. 布局设置

```typescript
postLayout: 'list' | 'grid'; // 文章列表布局
```

- `list`: 列表模式，单列布局，适合阅读
- `grid`: 网格模式，双列布局，适合浏览

**注意**: 如果侧边栏配置为双侧边栏（左右都有），网格模式可能不可用。

---

## localStorage 持久化

所有用户设置都会自动保存到浏览器的 `localStorage` 中，键名为 `mizuki-settings`。

**保存的数据结构**:
```typescript
{
    hue: number,
    themeMode: 'light' | 'dark' | 'system',
    wallpaperMode: 'banner' | 'fullscreen' | 'overlay' | 'none',
    overlayOpacity: number,
    overlayBlur: number,
    cardOpacity: number,
    showBannerTitle: boolean,
    enableBannerCarousel: boolean,
    enableWaves: boolean,
    enableBannerGradient: boolean,
    enableSakura: boolean,
    stickyNavbar: boolean,
    fontPreset: string,
    postLayout: 'list' | 'grid',
    // ... 其他设置
}
```

---

## 界面交互

设置面板采用抽屉式设计：
- 点击浮动控制栏的设置图标打开
- 支持通过点击遮罩层或关闭按钮关闭
- 所有调整实时预览效果
- 带有平滑的过渡动画

---

## 与配置文件的关系

显示设置面板提供的是**用户端的个性化设置**，而 `src/config.ts` 中的配置是**网站的默认设置**。

| 配置源 | 作用 | 优先级 |
|--------|------|--------|
| `src/config/backgroundWallpaper.ts` 等 | 网站默认配置 | 低（初始值） |
| `localStorage` 中的用户设置 | 用户个性化设置 | 高（覆盖默认） |

如果用户清除浏览器数据，设置会恢复到网站配置的默认值。

---

## 配置示例

在 `src/config/index.ts` 中可以设置各功能的默认值：

```typescript
export const siteConfig = {
    // ...
    themeColor: {
        hue: 340, // 粉色主题
        fixed: false, // 允许用户调整
        defaultMode: 'system',
    },
    postListLayout: {
        defaultMode: 'list', // 默认列表模式
        allowSwitch: true, // 允许用户切换
    },
    // ...
}
```
