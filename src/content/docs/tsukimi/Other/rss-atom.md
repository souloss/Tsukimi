---
title: RSS/Atom 订阅配置
createTime: 2026/05/20 12:00:00
permalink: /other/rss-atom/
order: 9
icon: ri:rss-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# RSS/Atom 订阅配置

Mizuki 内置 RSS 和 Atom 两种订阅格式，读者可以通过订阅链接获取博客更新。

## 订阅地址

构建后自动生成以下订阅文件：

| 格式 | 地址 | 文件 |
|------|------|------|
| RSS | `/rss.xml` | `src/pages/rss.xml.ts` |
| Atom | `/atom.xml` | `src/pages/atom.xml.ts` |

## 配置

订阅源的基本信息从 `src/config.ts` 中的 `siteConfig` 读取：

```typescript
siteConfig: {
  title: "你的博客名称",       // 订阅源标题
  description: "博客描述",     // 订阅源描述
  url: "https://example.com", // 站点 URL
  lang: "zh_CN",              // 语言
}
```

## 自定义订阅内容

如需自定义订阅输出的文章数量、内容格式等，可修改对应的生成文件：

- `src/pages/rss.xml.ts` — RSS 格式生成器
- `src/pages/atom.xml.ts` — Atom 格式生成器

## 在页面中展示订阅链接

可以在导航栏或侧边栏中添加订阅链接：

```typescript
// navBarConfig 中添加 RSS 链接
{
  name: "RSS",
  url: "/rss.xml",
  icon: "ri:rss-line",
}
```

## robots.txt

Mizuki 自动生成 `robots.txt` 文件（`src/pages/robots.txt.ts`），其中包含订阅文件的引用，便于搜索引擎和订阅工具发现。
