---
title: 公告栏配置
createTime: 2025/08/17 17:21:41
permalink: /sidepanel/announcement/
order: 3
icon: ri:notification-3-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 公告栏配置

Mizuki 侧边栏支持公告栏组件，可以展示网站公告、通知等信息。配置位于 `src/config.ts` 中的 `announcementConfig` 对象。

::: note
公告栏的启用/禁用现在通过 `sidebarLayoutConfig` 统一控制，不再使用 `enable` 字段。如需隐藏公告栏，从侧边栏布局中移除 `announcement` 组件即可。
:::

## 基本配置

```typescript title="src/config.ts"
export const announcementConfig: AnnouncementConfig = {
  title: "",                                    // 公告栏标题，留空使用 i18n 默认文字
  content: "欢迎来到我的博客！这是一条示例公告", // 公告内容
  icon: "material-symbols:campaign",             // 公告图标
  type: "info",                                  // 公告类型
  closable: true,                                // 是否可关闭
  link: {
    enable: true,                                // 是否启用链接
    text: "Learn More",                          // 链接文本
    url: "/about/",                              // 链接 URL
    external: false,                             // 是否外部链接
  },
};
```

## 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 否 | 公告栏标题，留空使用 i18n 默认文字 |
| `content` | `string` | 是 | 公告内容，支持 HTML 标签 |
| `icon` | `string` | 否 | 公告图标，使用 Iconify 图标名 |
| `type` | `"info" \| "warning" \| "success" \| "error"` | 否 | 公告类型，影响显示样式 |
| `closable` | `boolean` | 否 | 是否允许用户关闭公告 |
| `link` | `object` | 否 | 公告链接配置 |

### 公告类型说明

| 类型 | 说明 | 视觉效果 |
|------|------|----------|
| `"info"` | 信息通知 | 蓝色/主题色背景 |
| `"success"` | 成功通知 | 绿色背景 |
| `"warning"` | 警告通知 | 黄色/橙色背景 |
| `"error"` | 错误通知 | 红色背景 |

### 链接配置 (link)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `enable` | `boolean` | 是 | 是否启用链接 |
| `text` | `string` | 是 | 链接文本 |
| `url` | `string` | 是 | 链接 URL |
| `external` | `boolean` | 否 | 是否外部链接，默认 `false` |

## 添加到侧边栏

公告栏组件需要按照侧边栏组件的三步流程添加：

### 1. 声明类型

`announcement` 已在 `WidgetComponentType` 中预定义，无需额外添加。

### 2. 配置布局

在 `sidebarLayoutConfig.properties` 中添加公告栏组件，并在 `components` 中指定位置：

```typescript
sidebarLayoutConfig: {
  properties: [
    {
      type: "announcement",
      position: "top",
      class: "onload-animation",
      animationDelay: 50,
    },
  ],
  components: {
    left: ["profile", "announcement", "tags"],
  },
},
```

### 3. 注册组件映射

确保在 `SideBar.astro` 和 `RightSideBar.astro` 中注册了 `announcement` 组件映射。

## 内容格式

`content` 字段支持 HTML 标签，可以实现更丰富的排版效果：

```typescript
content: "欢迎访问！<br>本站已迁移至新域名，请注意更新书签。",
```

## 注意事项

- 公告内容不宜过长，建议控制在 2-3 行以内
- 使用 `type` 字段选择合适的公告类型，避免滥用警告和错误类型
- 图标名称可以在 [Iconify 图标搜索](https://icon-sets.iconify.design/) 中查找
- `closable` 设为 `true` 后，用户关闭公告的状态会保存在本地