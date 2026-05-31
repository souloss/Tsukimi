---
title: 搜索功能配置
order: 9
icon: "ri:search-line"
badge:
  type: warning
  text: 新
createTime: 2026/05/20 12:00:00
permalink: /feature/search/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 搜索功能配置

Mizuki 使用 [Pagefind](https://pagefind.app/) 作为站内搜索引擎。Pagefind 是一个静态搜索库，构建时自动索引站点内容，无需后端服务，搜索速度快且体积小。

## 工作原理

1. **构建时索引**：执行 `pnpm build` 后，Pagefind 自动扫描生成的 HTML 文件，建立搜索索引
2. **客户端搜索**：用户在搜索框输入关键词后，直接在浏览器端完成搜索，无需请求服务器
3. **离线可用**：搜索索引随站点一起部署，完全静态

## 搜索入口

搜索功能通过导航栏中的搜索图标触发，搜索方式配置在 `navBarConfig` 中：

```typescript title="src/config.ts"
export const navBarConfig: NavBarConfig = {
  links: [...],
  search: {
    method: NavBarSearchMethod.PageFind,
  },
};
```

## 构建流程

Pagefind 索引在构建过程中自动生成：

```bash
pnpm build
```

构建流程为：`update-anime` → `astro build` → **`pagefind`** → `compress-fonts`

Pagefind 会在 `dist/` 目录下生成索引文件，部署后即可使用搜索功能。

## 开发环境

::: warning 注意
Pagefind 索引仅在构建后生成，开发环境（`pnpm dev`）中搜索功能不可用。需要先执行 `pnpm build && pnpm preview` 来预览搜索效果。
:::

## 自定义搜索

搜索组件位于 `src/components/organisms/navigation/Search.svelte`，如需自定义搜索 UI 可以修改此文件。
