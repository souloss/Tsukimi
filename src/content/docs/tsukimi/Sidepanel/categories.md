---
title: 分类组件配置
createTime: 2025/08/17 17:21:41
permalink: /sidepanel/categories/
order: 4
icon: ri:folder-open-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 分类组件配置

Mizuki 侧边栏支持分类组件，展示博客文章的分类列表。分类组件无需额外配置，只需在侧边栏布局中启用即可。

## 添加到侧边栏

分类组件需要按照侧边栏组件的三步流程添加：

### 1. 声明类型

`categories` 已在 `WidgetComponentType` 中预定义，无需额外添加。

### 2. 配置布局

在 `sidebarLayoutConfig.components` 中添加分类组件：

```typescript
sidebarLayoutConfig: {
  components: {
    left: [
      {
        type: "categories",
        enable: true,
      },
    ],
  },
},
```

### 3. 注册组件映射

确保在 `SideBar.astro` 和 `RightSideBar.astro` 中注册了 `categories` 组件映射。

## 自定义属性 (customProps)

分类组件支持通过 `customProps` 传递自定义属性：

```typescript
{
  type: "categories",
  enable: true,
  customProps: {
    // 自定义属性将传递给组件
  },
},
```

## 注意事项

- 分类数据来自文章 frontmatter 中的 `category` 字段
- 分类组件会自动统计每个分类下的文章数量
- 如果没有文章设置了分类，组件将不会显示
