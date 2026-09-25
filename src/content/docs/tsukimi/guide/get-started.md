---
title: 安装与使用
order: 2
icon: ri:rocket-line
createTime: 2025/08/16 23:56:17
permalink: /guide/get-started/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

本页给出从源码启动 Tsukimi、写第一篇文章到生成静态站点的最短路径。

## 环境要求

- **Node.js `>=22.12.0`**
- **pnpm `>=10.33.0 <11`**（仓库通过 `packageManager` 和 `only-allow` 固定 pnpm）
- Git

检查版本：

```bash
node --version
pnpm --version
git --version
```

建议使用 Node.js LTS。不要用 npm、yarn 或 bun 替代项目的 pnpm 工作流。

## 获取源码并启动

:::steps
1. 克隆仓库

   ```bash
   git clone https://github.com/souloss/Tsukimi.git
   cd Tsukimi
   ```

2. 安装依赖

   ```bash
   pnpm install
   ```

3. 修改最小配置

   默认配置分散在 `src/config/*.ts`。第一次运行至少检查 `src/config/siteConfig.ts` 中的 `title`、`siteURL`、`lang` 和 `featurePages`，并按需修改 `src/config/profileConfig.ts` 与 `src/config/navBarConfig.ts`。

4. 启动开发服务器

   ```bash
   pnpm dev
   ```

   打开 <http://localhost:4321/>。`predev` 会生成图标并尝试执行内容同步；未启用内容分离时会继续使用本地内容。
:::

## 创建第一篇文章

推荐使用脚手架：

```bash
pnpm new-post hello-tsukimi
```

文章会写入 `src/content/posts/`。最小 frontmatter 如下：

```yaml
---
title: Hello Tsukimi
published: 2026-09-25
description: 我的第一篇文章
tags: [Astro, Tsukimi]
category: 随笔
draft: false
---
```

文章字段、系列、转载、加密和固定链接见[文章 frontmatter](/docs/tsukimi/press/article-types/)。Markdown 扩展见 [Markdown 语法](/docs/tsukimi/press/markdown/)。

## 构建与预览

```bash
pnpm check       # Astro 内容与类型检查
pnpm build       # 生成 dist/、Pagefind 索引并压缩字体
pnpm preview     # 本地预览 dist/
```

完整构建会依次执行内容同步、数据源更新（由脚本和环境决定）、`astro build`、Pagefind 索引和字体压缩。生产部署应使用 `pnpm build` 生成的 `dist/`，不要把开发服务器暴露到公网。

## 可选：内容仓库分离

默认情况下，文章、特殊页面和数据都在当前仓库。需要独立管理内容时，复制 `.env.example` 为 `.env`，再设置：

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-name/your-content.git
# CONTENT_DIR=./content
```

同步脚本会将内容仓库中的 `posts/`、`spec/`、`data/` 映射到对应目录，并复制 `overrides/` 到 `src/overrides/`、合并 `assets/` 和 `public/`。私有仓库可使用 SSH URL；不要把 Token 直接提交进 `.env`。详细说明见[内容分离](/docs/tsukimi/other/separation/)。

## 下一步

- [站点配置](/docs/tsukimi/basic-layout/site-config/)
- [配置模块化与覆盖](/docs/tsukimi/basic-layout/config-modularization/)
- [侧边栏布局](/docs/tsukimi/sidepanel/global/)
- [部署指南](/docs/tsukimi/guide/deploy/)
