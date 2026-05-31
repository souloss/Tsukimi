---
title: 浮动控件与进度条配置
order: 10
icon: "ri:arrow-up-circle-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /feature/floating-controls/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 浮动控件与进度条配置

Mizuki 提供浮动控件组（FloatingControls）和页面阅读进度条（PageProgressBar），增强页面导航体验。

## 页面进度条 (PageProgressBar)

页面进度条显示在页面顶部，随滚动实时反映当前阅读进度。

### 配置

```typescript title="src/config.ts"
siteConfig: {
  pageProgressBar: {
    enable: true,        // 是否启用页面进度条
    height: 3,           // 进度条高度(px)，默认 3
    duration: 8000,      // 动画时长(ms)，默认 8000
  },
}
```

### 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | - | 是否启用页面进度条 |
| `height` | `number` | `3` | 进度条高度（像素） |
| `duration` | `number` | `8000` | 动画时长（毫秒） |

## 浮动控件组 (FloatingControls)

浮动控件组是页面右下角的悬浮按钮组，集成了多个快捷功能。

### 包含的功能

| 功能 | 说明 |
|------|------|
| 回到顶部 | 点击平滑滚动回页面顶部 |
| 主题切换 | 快速切换浅色/深色主题 |
| 显示设置 | 打开显示设置面板 |
| 音乐控制 | 音乐播放器快捷控制 |

### 特性

- 智能显隐：滚动一定距离后才显示回到顶部按钮
- 响应式：在移动端自动调整按钮大小和间距
- 动画效果：按钮出现/消失带有过渡动画

## 回到顶部按钮 (BackToTop)

回到顶部按钮是浮动控件组的一部分，也可以独立使用。

### 行为

- 页面滚动超过一定距离后自动显示
- 点击后平滑滚动回页面顶部
- 滚动到顶部时自动隐藏
