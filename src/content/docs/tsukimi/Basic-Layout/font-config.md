---
title: 字体配置
createTime: 2026/05/20 12:00:00
permalink: /basic-layout/font-config/
order: 5
icon: ri:font-size-2
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 字体配置

Mizuki 主题支持自定义字体配置，用户可以在显示设置面板中自由切换字体方案。字体配置位于 `src/config/fontConfig.ts` 文件中。

## 基本配置

```typescript title="src/config/fontConfig.ts"
export const fontConfig: FontConfig = {
    switchable: true,       // 是否允许用户切换字体
    defaultFont: "lxgw",   // 默认字体选项 ID
    fonts: [
        {
            id: "system",
            name: "系统默认",
            i18nKey: "fontSystem",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        {
            id: "literata",
            name: "Literata",
            i18nKey: "fontLiterata",
            fontFamily: "'Literata', system-ui, sans-serif",
            cjkFontFamily: "'LXGW WenKai', serif",
            googleFonts: "https://fonts.googleapis.com/css2?family=Literata:wght@400;500;700&display=swap",
            cdnUrl: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.min.css",
        },
        {
            id: "lxgw",
            name: "霞鹜文楷",
            i18nKey: "fontLxgw",
            fontFamily: "'LXGW WenKai', serif",
            cdnUrl: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.min.css",
        },
        {
            id: "2d",
            name: "二次元",
            i18nKey: "font2D",
            fontFamily: "ZenMaruGothic-Medium",
            cjkFontFamily: "'萝莉体 第二版'",
            localFonts: [
                {
                    family: "ZenMaruGothic-Medium",
                    src: "/assets/font/ZenMaruGothic-Medium.ttf",
                    weight: 500,
                    style: "normal",
                },
                {
                    family: "萝莉体 第二版",
                    src: "/assets/font/loli.ttf",
                    weight: 400,
                    style: "normal",
                },
            ],
        },
    ],
};
```

## 配置项说明

### 主配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enable` | `boolean` | 否 | 是否启用自定义字体功能 |
| `switchable` | `boolean` | 否 | 是否允许用户在设置面板中切换字体 |
| `defaultFont` | `string` | 否 | 默认字体选项的 ID |
| `selected` | `string \| string[]` | 否 | 当前选择的字体 ID，支持单个或多个字体组合 |
| `fonts` | `FontItem[] \| Record<string, FontItem>` | 否 | 字体选项列表 |
| `fallback` | `string[]` | 否 | 全局字体回退列表 |
| `preload` | `boolean` | 否 | 是否预加载字体文件以提高性能 |

### FontItem 配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 字体唯一标识符，用于 `defaultFont` 和 `selected` 引用 |
| `name` | `string` | 字体显示名称 |
| `i18nKey` | `string` | 国际化翻译键 |
| `fontFamily` | `string` | CSS font-family 名称 |
| `cjkFontFamily` | `string` | CJK 回退字体（用于 ASCII/CJK 分字体方案） |
| `src` | `string` | 字体文件路径或 URL |
| `weight` | `string \| number` | 字体粗细 |
| `style` | `"normal" \| "italic" \| "oblique"` | 字体样式 |
| `display` | `"auto" \| "block" \| "swap" \| "fallback" \| "optional"` | font-display 属性 |
| `unicodeRange` | `string` | Unicode 范围，用于字体子集化 |
| `format` | `"woff" \| "woff2" \| "truetype" \| ...` | 字体格式 |
| `googleFonts` | `string` | Google Fonts 引入 URL |
| `cdnUrl` | `string` | 外部 CDN 字体样式表 URL |
| `localFonts` | `Array \| string[]` | 本地字体配置 |
| `enableCompress` | `boolean` | 是否启用字体子集优化 |

## 字体加载方式

Mizuki 支持三种字体加载方式：

| 方式 | 配置字段 | 说明 |
|------|----------|------|
| 系统字体 | 仅 `fontFamily` | 使用用户系统自带字体，零网络请求 |
| Google Fonts | `googleFonts` | 从 Google Fonts CDN 加载 |
| CDN 样式表 | `cdnUrl` | 从外部 CDN 加载字体 CSS |
| 本地字体 | `localFonts` | 从网站服务器加载本地字体文件 |

## 添加自定义字体

在 `fonts` 数组中添加新的字体选项：

```typescript
fonts: [
    // ... 现有的字体选项
    {
        id: "myfont",
        name: "我的自定义字体",
        i18nKey: "fontMyFont",
        fontFamily: "'My Custom Font', sans-serif",
        googleFonts: "https://fonts.googleapis.com/css2?family=MyCustomFont:wght@400;700&display=swap",
    },
],
```

然后设置 `defaultFont` 为新字体的 `id` 即可。

## 用户端切换

用户可以在显示设置面板中切换字体，设置保存在 `localStorage` 中。如果 `switchable` 设为 `false`，用户将看不到切换选项。