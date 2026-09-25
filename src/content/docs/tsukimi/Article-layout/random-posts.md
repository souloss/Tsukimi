---
title: 随机文章推荐
order: 13
icon: "ri:shuffle-line"
badge:
  type: info
  text: 文章页
createTime: 2026/09/25
permalink: /article-layout/random-posts/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 随机文章推荐

Tsukimi 可以在文章详情页底部显示随机文章，帮助读者发现与当前文章不一定相关的内容。它与相关文章组件并列渲染，不是侧边栏 Widget。

## 配置

配置位于 `src/config/randomPostsConfig.ts`，通过 `src/config/index.ts` 导出：

```ts title="src/config/randomPostsConfig.ts"
import type { RandomPostsConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: RandomPostsConfig = {
  enable: true,
  maxCount: 5,
};

export const randomPostsConfig = withOverride("randomPostsConfig", defaults);
```

推荐使用覆盖文件修改个人站点：

```ts title="src/overrides/randomPostsConfig.ts"
import type { RandomPostsConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<RandomPostsConfig> = {
  enable: true,
  maxCount: 3,
};

export default override;
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否在文章底部渲染随机推荐。 |
| `maxCount` | `number` | `5` | 推荐文章数量。 |

文章页 `src/pages/posts/[...slug].astro` 会读取该配置；当前文章和不适合展示的条目会由文章列表逻辑处理。该配置不会改变首页、归档页或侧栏。

## 与相关文章的区别

| 特性 | 随机文章 | 相关文章 |
| --- | --- | --- |
| 匹配方式 | 以随机顺序抽取 | 按标签、标题、描述、分类和新鲜度评分 |
| 目的 | 扩大内容发现范围 | 延续当前主题阅读 |
| 配置 | `randomPostsConfig` | `relatedPostsConfig` |
| 位置 | 文章详情页底部 | 文章详情页底部 |

两者可以同时启用。若只需要一种推荐，把对应配置的 `enable` 设为 `false`。当前 `WidgetComponentType` 没有 `random-posts`，不要把它添加到 `sidebarLayoutConfig.components`。

修改后运行 `pnpm check`，并在文章详情页确认卡片数量和移动端布局。
