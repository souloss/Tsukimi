---
title: 个人信息配置
createTime: 2025/08/17 17:21:41
permalink: /sidepanel/profile/
order: 2
icon: ri:user-smile-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 个人信息配置

Mizuki 侧边栏支持展示个人信息卡片，包含头像、名称、描述和社交链接。配置位于 `src/config.ts` 中的 `profileConfig` 对象。

## 基本配置

```typescript title="src/config.ts"
export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.webp", // 头像图片路径
  name: "Mizuki",                       // 显示名称
  bio: "A blog based on Astro",         // 个人简介
  typewriter: {
    enable: true,                        // 启用个人简介打字机效果
    speed: 80,                           // 打字速度（毫秒）
  },
  links: [
    {
      name: "GitHub",
      url: "https://github.com/souloss",
      icon: "fa7-brands:github",
      showName: true,                    // 是否显示链接名称
    },
    {
      name: "Bilibili",
      url: "https://space.bilibili.com/123456",
      icon: "fa7-brands:bilibili",
    },
  ],
};
```

## 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `avatar` | `string` | 否 | 头像图片路径，相对于 `src` 目录；以 `/` 开头则相对于 `public` 目录 |
| `name` | `string` | 是 | 显示名称 |
| `bio` | `string` | 否 | 个人简介，支持多行文本 |
| `typewriter` | `object` | 否 | 打字机效果配置 |
| `links` | `object[]` | 否 | 社交链接数组 |

### 打字机效果 (typewriter)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enable` | `boolean` | 是 | 是否启用打字机效果 |
| `speed` | `number` | 否 | 打字速度（毫秒），默认 80 |

启用后，个人简介文字会以逐字打出的方式显示，增加动态感。

### 社交链接配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 链接名称（用于无障碍提示和显示） |
| `url` | `string` | 是 | 链接地址 |
| `icon` | `string` | 是 | 图标名，使用 Iconify 图标集 |
| `showName` | `boolean` | 否 | 是否在图标旁显示链接名称文字 |

## 图标使用

社交链接的图标使用 Iconify 图标集，常用图标前缀：

| 前缀 | 说明 | 示例 |
|------|------|------|
| `fa7-brands:` | Font Awesome 7 品牌图标 | `fa7-brands:github`, `fa7-brands:twitter` |
| `material-symbols:` | Material Symbols 图标 | `material-symbols:mail`, `material-symbols:home` |
| `simple-icons:` | Simple Icons 图标 | `simple-icons:bilibili`, `simple-icons:telegram` |

## 添加到侧边栏

个人信息组件需要按照侧边栏组件的三步流程添加：

### 1. 声明类型

`profile` 已在 `WidgetComponentType` 中预定义，无需额外添加。

### 2. 配置布局

在 `sidebarLayoutConfig.components` 中添加个人信息组件：

```typescript
sidebarLayoutConfig: {
  components: {
    left: [
      {
        type: "profile",
        enable: true,
      },
    ],
  },
},
```

### 3. 注册组件映射

确保在 `SideBar.astro` 和 `RightSideBar.astro` 中注册了 `profile` 组件映射。

## 注意事项

- 头像图片建议使用正方形图片，推荐尺寸 200x200 或更大
- 个人简介支持使用 HTML 标签进行简单排版
- 社交链接的图标名称可以在 [Iconify 图标搜索](https://icon-sets.iconify.design/) 中查找
