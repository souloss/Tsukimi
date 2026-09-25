---
title: 代码块配置
order: 5
icon: "ri:code-line"
badge:
  type: info
  text: Expressive Code
createTime: 2026/09/25
permalink: /article-layout/codeblock/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 代码块配置

Tsukimi 使用 [Expressive Code](https://expressive-code.com/) 渲染 fenced code block。主题配置位于 `src/config/expressiveCodeConfig.ts`，而插件装配和颜色变量位于根目录 `astro.config.mjs`。

## 当前配置

```ts title="src/config/expressiveCodeConfig.ts"
import type { ExpressiveCodeConfig } from "../types/config";

export const expressiveCodeConfig: ExpressiveCodeConfig = {
  darkTheme: "github-dark",
  lightTheme: "github-light",
  hideDuringThemeTransition: true,
  pluginCollapsible: {
    enable: true,
    lineThreshold: 10,
    previewLines: 5,
    defaultCollapsed: false,
  },
};
```

代码块主题会随站点明暗模式切换。`astro.config.mjs` 当前启用了行号、语言徽章、可折叠区段、复制按钮和代码折叠插件；不要把这些插件误写成文章 frontmatter 字段。

## 配置字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `darkTheme` | `string` | 暗色模式使用的 Expressive Code 主题名，默认 `github-dark`。 |
| `lightTheme` | `string` | 亮色模式使用的主题名，默认 `github-light`。 |
| `hideDuringThemeTransition` | `boolean` | 切换主题时暂时隐藏代码块，减少闪烁和重绘。 |
| `pluginCollapsible.enable` | `boolean` | 是否为长代码块提供折叠控件。 |
| `pluginCollapsible.lineThreshold` | `number` | 超过多少行后显示折叠能力，默认 `10`。 |
| `pluginCollapsible.previewLines` | `number` | 折叠时保留的预览行数，默认 `5`。 |
| `pluginCollapsible.defaultCollapsed` | `boolean` | 长代码块是否默认折叠，默认 `false`。 |

`pluginLanguageBadge` 的类型已经预留，但当前构建由 `astro.config.mjs` 直接注册语言徽章插件；只有在修改插件装配方式时才需要同步这个字段。

## 文章中的代码块

使用真实语言名，并可用 Expressive Code 元信息标记标题、重点行和折叠：

~~~markdown
```ts title="src/config/siteConfig.ts" collapse
export const siteConfig = {
  title: "我的博客",
};
```
~~~
```

支持 `del={2}`、`ins={3-4}`、`{5}` 等行标记，以及目标语言支持的 `// [!code ++]`、`// [!code focus]` 注释。代码组使用 `:::code-group`，不要把不同概念的片段放在同一组。

## 主题与构建边界

- `github-light`、`github-dark` 是当前 `astro.config.mjs` 注册的主题；更换为未注册主题前要同步修改该文件。
- 代码块默认启用换行；终端语言（`bash`、`shell`、`zsh`）使用终端框架。
- 文章中的 `mermaid`、`plantuml`、`markmap`、`vega-lite`、`wavedrom` 和 `bytefield` 由独立插件处理，详见 [Markdown 扩展](/docs/tsukimi/press/markdown/directives/)。
- 修改代码块主题或插件后运行 `pnpm check`；涉及构建期图表或 Expressive Code 版本升级时再运行 `pnpm build`。
