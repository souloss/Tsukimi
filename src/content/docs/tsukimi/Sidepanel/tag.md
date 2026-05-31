---
title: 标签组件配置
createTime: 2025/08/17 17:21:41
permalink: /sidepanel/tag/
order: 5
icon: ri:price-tag-3-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 标签组件配置

Mizuki 侧边栏支持标签组件，以标签云的形式展示博客文章的标签。标签组件无需额外配置，只需在侧边栏布局中启用即可。

## 添加到侧边栏

标签组件需要按照侧边栏组件的三步流程添加：

### 1. 声明类型

`tags` 已在 `WidgetComponentType` 中预定义，无需额外添加。

### 2. 配置布局

在 `sidebarLayoutConfig.components` 中添加标签组件：

```typescript
sidebarLayoutConfig: {
  components: {
    left: [
      {
        type: "tags",
        enable: true,
      },
    ],
  },
},
```

### 3. 注册组件映射

确保在 `SideBar.astro` 和 `RightSideBar.astro` 中注册了 `tags` 组件映射。

## 自定义属性 (customProps)

标签组件支持通过 `customProps` 传递自定义属性：

```typescript
{
  type: "tags",
  enable: true,
  customProps: {
    // 自定义属性将传递给组件
  },
},
```

## 标签样式

标签的显示样式由 `siteConfig.tagStyle` 控制：

```typescript
siteConfig: {
  tagStyle: {
    useNewStyle: false, // 是否使用新样式（悬停高亮样式）
  },
},
```

- `useNewStyle: false`：旧样式，外框常亮样式
- `useNewStyle: true`：新样式，悬停高亮样式

## 注意事项

- 标签数据来自文章 frontmatter 中的 `tags` 字段
- 标签组件会自动统计每个标签下的文章数量
- 标签的大小根据文章数量自动调整
