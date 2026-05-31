---
title: Markmap 思维导图
createTime: 2026/05/20 12:00:00
permalink: /press/markdown/markmap/
order: 5
icon: ri:mind-map
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Markmap 思维导图

Mizuki 支持在 Markdown 文章中使用 Markmap 语法绘制交互式思维导图。Markmap 代码块会在客户端动态渲染为可交互的 SVG 图表，支持亮暗主题自动适配、缩放、拖拽和全屏查看。

## 基本配置

配置文件位于 `src/config/markmapConfig.ts`：

```typescript title="src/config/markmapConfig.ts"
import type { MarkmapConfig } from "../types/config";

export const markmapConfig: MarkmapConfig = {
  enable: true,
  autoCollapse: false,
  initialCollapseLevel: 0,
  zoomable: true,
  pannable: true,
};
```

## 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `true` | 是否启用 Markmap 渲染；关闭时 `markmap` 代码块退化为普通代码高亮 |
| `autoCollapse` | `boolean` | `false` | 是否启用自动折叠功能 |
| `initialCollapseLevel` | `number` | `0` | 初始折叠级别，0 表示全部展开 |
| `zoomable` | `boolean` | `true` | 是否启用缩放功能 |
| `pannable` | `boolean` | `true` | 是否启用拖拽平移功能 |

## 使用方法

在 Markdown 文章中使用 ` ```markmap ` 代码块（语言标识必须为小写 `markmap`）：

````markdown
```markmap
# 根节点

## 子节点 1

### 孙子节点 1.1
### 孙子节点 1.2

## 子节点 2

### 孙子节点 2.1
### 孙子节点 2.2
```
````

示例：

```markmap
# Mizuki 主题

## 核心功能

### Markdown 扩展
- 代码高亮
- 图表支持
- 数学公式

### 页面组件
- 导航栏
- 侧边栏
- 页脚

## 特色功能

### 动画效果
- 樱花飘落
- Live2D 看板娘
- 页面过渡

### 交互功能
- 主题切换
- 音乐播放器
- 搜索功能

## 配置选项

### 站点配置
- 站点标题
- 主题色
- 语言设置

### 功能开关
- 特色页面
- 特效启用
- 统计配置
```

## 交互功能

渲染后的 Markmap 思维导图支持以下交互：

- **缩放**：鼠标滚轮缩放，或使用右上角 +/- 按钮
- **拖拽**：拖拽移动画布查看不同区域
- **重置**：点击重置按钮恢复初始视图
- **全屏**：点击全屏按钮进入全屏查看模式
- **节点折叠**：点击节点可展开/折叠子节点
- **主题切换**：根据页面亮/暗主题自动调整显示效果

## Markdown 语法

Markmap 支持标准 Markdown 标题语法来构建思维导图层级：

- `#` 一级标题 → 根节点
- `##` 二级标题 → 一级子节点
- `###` 三级标题 → 二级子节点
- 以此类推...

也支持使用列表语法：

```markmap
- 根节点
  - 子节点 1
    - 孙子节点 1.1
    - 孙子节点 1.2
  - 子节点 2
    - 孙子节点 2.1
```

## 高级特性

### 链接

可以在节点中添加链接：

```markmap
# Markmap
## 官方网站
- [markmap.js.org](https://markmap.js.org)
## GitHub
- [markmap/markmap](https://github.com/markmap/markmap)
```

### 富文本

节点支持简单的 Markdown 格式：

```markmap
# 富文本示例
## 样式
- **粗体**
- *斜体*
- ~~删除线~~
## 代码
- `行内代码`
```

## 技术说明

Markmap 使用以下技术栈：

- **markmap-lib**：将 Markdown 转换为 markmap 数据结构
- **markmap-view**：在浏览器中渲染交互式 SVG
- **d3**：提供缩放和拖拽功能

库文件从 CDN 动态加载（jsdelivr 优先，unpkg 作为备用），不会增加构建体积。

::: tip 提示
Markmap 在客户端渲染，首次加载时会从 CDN 下载必要的库文件，后续访问会使用浏览器缓存。
:::
