---
title: 侧边栏布局配置
createTime: 2025/08/17 17:21:41
permalink: /sidepanel/global/
order: 1
icon: ri:layout-grid-line
badge:
  type: info
  text: v2
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 侧边栏布局配置

Mizuki 的侧边栏布局配置位于 `src/config.ts` 中的 `sidebarLayoutConfig` 对象，控制侧边栏的组件排列、动画效果和响应式行为。

## 基本配置

```typescript title="src/config.ts"
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  properties: [
    {
      type: "profile",
      position: "top",
      class: "onload-animation",
      animationDelay: 0,
    },
    {
      type: "announcement",
      position: "top",
      class: "onload-animation",
      animationDelay: 50,
    },
    {
      type: "music-sidebar",
      position: "sticky",
      class: "onload-animation",
      animationDelay: 100,
    },
    {
      type: "categories",
      position: "sticky",
      class: "onload-animation",
      animationDelay: 150,
      responsive: {
        collapseThreshold: 5,
      },
      customProps: {
        topN: 20,
      },
    },
    {
      type: "tags",
      position: "top",
      class: "onload-animation",
      animationDelay: 250,
      responsive: {
        collapseThreshold: 20,
      },
      customProps: {
        topN: 20,
      },
    },
    {
      type: "site-stats",
      position: "top",
      class: "onload-animation",
      animationDelay: 200,
    },
    {
      type: "calendar",
      position: "top",
      class: "onload-animation",
      animationDelay: 250,
    },
  ],
  components: {
    left: ["profile", "announcement", "tags"],
    right: ["site-stats", "calendar", "categories", "music-sidebar"],
    drawer: ["profile", "announcement", "music-sidebar", "categories", "tags"],
  },
  defaultAnimation: {
    enable: true,
    baseDelay: 0,
    increment: 50,
  },
  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1280,
      desktop: 1280,
    },
  },
};
```

## 顶层配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `true` | 是否启用侧边栏（可选） |
| `position` | `"left" \| "right" \| "both"` | - | 侧边栏位置（可选） |
| `tabletSidebar` | `"left" \| "right"` | `"left"` | 平板端显示哪侧侧边栏（可选） |
| `showBothSidebarsOnPostPage` | `boolean` | `false` | 文章详情页是否显示双侧边栏（可选） |
| `properties` | `WidgetComponentConfig[]` | - | 组件配置列表 |
| `components` | `object` | - | 组件位置配置 |
| `defaultAnimation` | `object` | - | 默认动画配置 |
| `responsive` | `object` | - | 响应式断点配置 |

## 组件配置 (WidgetComponentConfig)

每个组件在 `properties` 数组中的配置项：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `WidgetComponentType` | 是 | 组件类型 |
| `enable` | `boolean` | 否 | 是否启用该组件 |
| `position` | `"top" \| "sticky"` | 是 | 组件定位方式 |
| `class` | `string` | 否 | 自定义 CSS 类名 |
| `style` | `string` | 否 | 自定义内联样式 |
| `animationDelay` | `number` | 否 | 动画延迟时间（毫秒） |
| `configId` | `string` | 否 | 配置 ID（用于广告组件） |
| `showOnPostPage` | `boolean` | 否 | 是否在文章详情页显示 |
| `showOnNonPostPage` | `boolean` | 否 | 是否在非文章页显示 |
| `responsive` | `object` | 否 | 响应式配置 |
| `customProps` | `Record<string, unknown>` | 否 | 自定义属性 |

### 可用的组件类型 (WidgetComponentType)

| 类型 | 说明 |
|------|------|
| `profile` | 个人资料 |
| `announcement` | 公告栏 |
| `categories` | 分类列表 |
| `tags` | 标签云 |
| `toc` | 目录导航 |
| `card-toc` | 卡片式目录 |
| `music-player` | 音乐播放器 |
| `music-sidebar` | 侧栏音乐 |
| `pio` | 看板娘 |
| `site-stats` | 站点统计 |
| `calendar` | 日历 |
| `advertisement` | 广告 |
| `custom` | 自定义组件 |

## 组件位置配置 (components)

| 字段 | 类型 | 说明 |
|------|------|------|
| `left` | `WidgetComponentType[]` | 左侧栏组件列表，按顺序排列 |
| `right` | `WidgetComponentType[]` | 右侧栏组件列表，按顺序排列 |
| `drawer` | `WidgetComponentType[]` | 抽屉模式组件列表（移动端） |

## 默认动画配置 (defaultAnimation)

| 字段 | 类型 | 说明 |
|------|------|------|
| `enable` | `boolean` | 是否启用默认动画 |
| `baseDelay` | `number` | 基础延迟时间（毫秒） |
| `increment` | `number` | 每个组件递增的延迟时间（毫秒） |

## 响应式配置 (responsive)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `breakpoints.mobile` | `number` | `768` | 移动端断点（px） |
| `breakpoints.tablet` | `number` | `1280` | 平板端断点（px） |
| `breakpoints.desktop` | `number` | `1280` | 桌面端断点（px） |

## 添加新组件的三步流程

添加新的侧边栏组件需要完成以下三个步骤（缺少任何一步会导致组件不渲染）：

1. **声明类型**：在 `src/types/config.ts` 的 `WidgetComponentType` 中添加新类型
2. **配置布局**：在 `src/config.ts` 的 `sidebarLayoutConfig` 中添加组件配置
3. **注册映射**：在 `SideBar.astro` 和 `RightSideBar.astro` 中注册组件映射

## 注意事项

- 右侧栏组件需要在 `components.right` 数组中配置，否则不会显示
- 组件的显示顺序由 `components` 数组中的顺序决定
- 抽屉模式（drawer）适用于移动端，建议只放置核心组件
- `sticky` 定位的组件需确保侧边栏有足够高度