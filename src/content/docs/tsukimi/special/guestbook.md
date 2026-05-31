---
title: 留言板
createTime: 2025/05/20 00:00:00
permalink: /special/guestbook/
order: 6
icon: ri:sticky-note-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

### 留言板页面配置教程

Mizuki 主题内置了一个优雅的留言板页面，访客可以在这里留下消息、评论和互动。

本教程将详细指导你如何配置和使用留言板页面。

---

#### **1. 核心概念：页面与内容分离**

::: file-tree

- Mizuki
  - src
    - pages
      - guestbook.astro
    - content
      - spec
        - guestbook.md
:::

在 Mizuki 主题中，留言板页面的**展示逻辑**和**内容数据**是分开的：

*   **展示逻辑**: `src/pages/guestbook.astro`
    *   这个文件负责留言板页面的 HTML 结构、CSS 样式和 JavaScript 交互逻辑。
    *   它定义了页面布局、评论系统集成等功能。
    *   **通常情况下，你不需要修改这个文件。**

*   **内容数据**: `src/content/spec/guestbook.md`
    *   这个文件包含留言板页面的欢迎文本或介绍内容。
    *   你可以在这里编写欢迎语、留言规则等内容。
    *   支持 Markdown 格式。

---

#### **2. 配置留言板内容**

打开 `src/content/spec/guestbook.md`，你可以自定义页面的欢迎内容：

```markdown
---
title: Guestbook
---

欢迎来到我的留言板！留下你的足迹吧~
```

你可以修改成任意你想要显示的内容，支持完整的 Markdown 语法。

---

#### **3. 评论系统集成**

留言板页面使用 Mizuki 的评论系统。要启用留言功能，你需要：

1.  确保在 `src/config.ts` 中启用了评论系统
2.  配置好你选择的评论服务（Twikoo、Waline、Giscus、Artalk 等）

留言板会自动使用你配置的评论系统。

---

#### **4. 站点配置中的留言板开关**

在 `src/config.ts` 的 `siteConfig.featurePages` 中，你可以控制留言板页面的开关：

```typescript
featurePages: {
  // ... 其他页面
  guestbook: true, // 设置为 false 会禁用留言板页面
},
```

*   **启用**: 设置为 `true`，留言板页面可以正常访问
*   **禁用**: 设置为 `false`，访问留言板页面会重定向到 404

---

#### **5. 导航栏配置**

要在导航栏中显示留言板链接，在 `src/config.ts` 的 `navBarConfig` 中配置：

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.Guestbook, // 使用预设
    // ... 其他链接
  ],
};
```

或者手动添加：

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    {
      name: "留言板",
      url: "/guestbook/",
      icon: "material-symbols:chat",
    },
    // ... 其他链接
  ],
};
```

---

#### **6. 最佳实践与建议**

*   **内容配置**: 在 `guestbook.md` 中明确留言规则、注意事项等
*   **评论审核**: 建议开启评论审核功能，避免垃圾留言
*   **定期维护**: 定期查看和回复访客留言，保持互动

---

通过以上步骤，你就可以轻松配置和使用留言板页面了！
