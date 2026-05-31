---
title: Spine 看板娘配置
order: 3
icon: "ri:robot-2-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /feature/spine/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Spine 看板娘配置

Spine 看板娘是基于 Spine 骨骼动画的吉祥物系统，与 Live2D (Pio) 是独立的两种看板娘方案。Spine 支持更丰富的交互动画和待机效果。配置位于 `src/config.ts` 中的 `spineModelConfig` 对象。

::: tip 提示
Spine 看板娘和 Live2D (Pio) 看板娘可以同时启用，也可以只启用其中一种。
:::

## 基本配置

```typescript title="src/config.ts"
export const spineModelConfig: import("./types/config").SpineModelConfig = {
  enable: true,
  model: {
    path: "/spine/models/character/skeleton.json",
    scale: 1.0,
    x: 0,
    y: 0,
  },
  position: {
    corner: "bottom-right",
    offsetX: 20,
    offsetY: 20,
  },
  size: {
    width: 280,
    height: 400,
  },
  interactive: {
    enabled: true,
    clickAnimations: ["tap", "touch"],
    clickMessages: ["你好呀~", "别戳我啦~"],
    messageDisplayTime: 3000,
    idleAnimations: ["idle", "breath"],
    idleInterval: 10000,
  },
  responsive: {
    hideOnMobile: false,
    mobileBreakpoint: 768,
  },
  zIndex: 1000,
  opacity: 1.0,
};
```

## 配置项说明

### 模型配置 (model)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | `string` | 必填 | Spine 模型文件路径（`.json` 格式的 skeleton 文件） |
| `scale` | `number` | `1.0` | 模型缩放比例 |
| `x` | `number` | `0` | X 轴偏移量 |
| `y` | `number` | `0` | Y 轴偏移量 |

### 位置配置 (position)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `corner` | `"bottom-left" \| "bottom-right" \| "top-left" \| "top-right"` | 必填 | 显示位置 |
| `offsetX` | `number` | `20` | 水平偏移量（像素） |
| `offsetY` | `number` | `20` | 垂直偏移量（像素） |

### 尺寸配置 (size)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `number` | `280` | 容器宽度（像素） |
| `height` | `number` | `400` | 容器高度（像素） |

### 交互配置 (interactive)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | `boolean` | `true` | 是否启用交互功能 |
| `clickAnimations` | `string[]` | - | 点击时随机播放的动画名称列表 |
| `clickMessages` | `string[]` | - | 点击时随机显示的文字消息列表 |
| `messageDisplayTime` | `number` | `3000` | 文字消息显示时长（毫秒） |
| `idleAnimations` | `string[]` | - | 待机时循环播放的动画名称列表 |
| `idleInterval` | `number` | `10000` | 待机动画切换间隔（毫秒） |

### 响应式配置 (responsive)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `hideOnMobile` | `boolean` | `false` | 是否在移动端隐藏 |
| `mobileBreakpoint` | `number` | `768` | 移动端断点（像素） |

### 其他

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zIndex` | `number` | `1000` | CSS 层级 |
| `opacity` | `number` | `1.0` | 透明度（0-1） |

## Spine 模型准备

Spine 模型需要以下文件：

1. **skeleton.json** — 骨骼数据文件（在 `path` 中引用）
2. **atlas 文件** — 纹理图集描述文件（与 skeleton.json 同目录）
3. **纹理图片** — PNG 格式的纹理图（与 skeleton.json 同目录）

将模型文件放置在 `public/spine/models/` 目录下，然后在 `path` 中引用。

## 动画名称

`clickAnimations` 和 `idleAnimations` 中填写的动画名称需要与 Spine 模型中定义的动画名称一致。可以在 Spine 编辑器中查看模型包含的动画列表。
