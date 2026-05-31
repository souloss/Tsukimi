---
title: 广告组件配置
createTime: 2026/05/20 12:00:00
permalink: /sidepanel/advertisement/
order: 8
icon: ri:advertisement-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 广告组件配置

Mizuki 侧边栏支持广告组件，可以展示推广信息、友情推荐等内容。配置位于 `src/config.ts` 中的 `adConfig` 对象。

## 基本配置

```typescript title="src/config.ts"
export const adConfig: AdConfig = {
  title: "推荐",
  content: "这是一条推广信息",
  image: {
    src: "/images/ad-banner.jpg",
    alt: "推广图片",
    link: "https://example.com",
    external: true,
  },
  link: {
    text: "了解更多",
    url: "https://example.com",
    external: true,
  },
  padding: {
    all: "1rem",
  },
  closable: true,
  displayCount: -1,
  expireDate: "2026-12-31T23:59:59Z",
};
```

## 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 否 | 广告栏标题 |
| `content` | `string` | 否 | 广告栏文本内容 |
| `image` | `object` | 否 | 广告图片配置 |
| `link` | `object` | 否 | 广告链接配置 |
| `padding` | `object` | 否 | 内边距配置 |
| `closable` | `boolean` | 否 | 是否可关闭 |
| `displayCount` | `number` | 否 | 显示次数限制，`-1` 为无限制 |
| `expireDate` | `string` | 否 | 过期时间（ISO 8601 格式） |

### 图片配置 (image)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `src` | `string` | 是 | 图片地址 |
| `alt` | `string` | 否 | 图片描述 |
| `link` | `string` | 否 | 图片点击链接 |
| `external` | `boolean` | 否 | 是否外部链接（新窗口打开） |

### 链接配置 (link)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | `string` | 是 | 链接文字 |
| `url` | `string` | 是 | 链接地址 |
| `external` | `boolean` | 否 | 是否外部链接 |

### 内边距配置 (padding)

| 字段 | 类型 | 说明 |
|------|------|------|
| `top` | `string` | 上边距，如 `"0"`, `"1rem"`, `"16px"` |
| `right` | `string` | 右边距 |
| `bottom` | `string` | 下边距 |
| `left` | `string` | 左边距 |
| `all` | `string` | 统一边距，设置后会覆盖单独的边距设置 |

## 添加到侧边栏

广告组件需要按照侧边栏组件的三步流程添加：

### 1. 声明类型

`advertisement` 已在 `WidgetComponentType` 中预定义，无需额外添加。

### 2. 配置布局

在 `sidebarLayoutConfig.components` 中添加广告组件：

```typescript
sidebarLayoutConfig: {
  components: {
    right: [
      // ...
      {
        type: "advertisement",
        enable: true,
        position: "sticky",
        configId: "default",  // 对应 adConfig 的配置 ID
      },
    ],
  },
},
```

### 3. 注册组件映射

确保在 `SideBar.astro` 和 `RightSideBar.astro` 中注册了 `advertisement` 组件映射。

## 显示控制

- **次数限制**：设置 `displayCount` 后，用户关闭广告后达到指定次数将不再显示
- **过期时间**：设置 `expireDate` 后，过期日期之后广告自动隐藏
- **可关闭**：设置 `closable: true` 允许用户手动关闭广告
