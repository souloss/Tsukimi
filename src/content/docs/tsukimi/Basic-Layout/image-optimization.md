---
title: 手动图片转换（WebP）
createTime: 2026/09/25
permalink: /basic-layout/image-optimization/
order: 9
icon: ri:image-edit-line
badge:
  type: info
  text: 手动脚本
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 手动图片转换（WebP）

仓库提供 `scripts/convert-images.js`，用于手动把一组指定的 `public/` 图片转换成 WebP。它不是 Astro 图片管线，不会在开发服务器、`pnpm build` 或站点运行时自动执行，也不会重写 Markdown、MDX 或文章 frontmatter 中的图片路径。

## 执行方式

```bash
node scripts/convert-images.js
```

脚本会按固定目标列表扫描 `public/` 下的文件：

| 目标 | 匹配的源文件 |
| --- | --- |
| `assets/home/` | 第一层目录中的 `*.png`、`*.jpg` |
| 根目录 | `sakura.png` |
| `images/albums/` | 任意子目录中的 `*.jpg`、`*.jpeg` |
| `images/diary/` | 第一层目录中的 `*.jpg` |
| `images/device/` | 第一层目录中的 `*.png` |
| `assets/music/cover/` | 第一层目录中的 `*.jpg` |

脚本不扫描表格以外的目录或扩展名；例如文章附件、`src/assets/` 图片和远程图片不会被处理。

## 输出与安全

- 在每张源图旁生成同名 `.webp`，例如 `public/images/device/phone.png` 会生成 `public/images/device/phone.webp`。
- 使用 Sharp WebP 编码，质量固定为 `85`、`effort` 固定为 `6`；脚本没有命令行参数可覆盖这些值。
- 原始文件会保留。已有 WebP 文件的修改时间晚于源文件时会跳过；否则重新生成同名 WebP。
- 图片转换完成后，需自行更新文章、配置或页面中的引用路径。例如把 `/images/device/phone.png` 改为 `/images/device/phone.webp`。未更新的引用仍会继续使用原图。

首次批量转换前确认仓库中有足够空间，并在抽查 WebP 的透明度、画质与引用后再发布。`pnpm build` 不会代替这一步；构建脚本的整体执行顺序见[构建脚本](/docs/tsukimi/other/build-scripts/)。
