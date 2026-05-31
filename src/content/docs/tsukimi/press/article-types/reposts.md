---
title: Reposts 转载
createTime: 2026-05-20
permalink: /press/article-types/reposts/
order: 2
icon: ri:arrow-left-right-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## Reposts 转载功能

Mizuki 支持转载功能，可以在网站上展示转载自其他网站的文章，同时明确标注原作者和原文链接。

---

### 文章Frontmatter配置

在转载文章的Frontmatter中添加repost配置：

```yaml
---
title: 如何工作的？
published: 2026-01-01

# Repost 转载配置
repost:
  originalAuthor: '原作者姓名'
  originalUrl: 'https://example.com/original-article'
  originalTitle: '原文标题'
  originalSite: '原网站名称'
  redirect: 'https://optional-redirect.com'
---

文章内容...
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `repost.originalAuthor` | string | 是 | 原作者姓名 |
| `repost.originalUrl` | string | 是 | 原文URL链接 |
| `repost.originalTitle` | string | 否 | 原文标题（如果不同） |
| `repost.originalSite` | string | 否 | 原网站名称 |
| `repost.redirect` | string | 否 | 如果配置，访问此文章时会重定向到该URL |

---

### 转载文章页

在文章详情页中，系统会自动显示：
- 转载来源标签
- 原文链接
- 原作者信息
- 原网站（如有）
- 版权信息

---

### 转载文章列表页

Mizuki提供了专门的转载文章列表页：`/reposts/`

页面功能包括：
- 所有转载文章的卡片式列表
- 转载来源标签
- 原文链接跳转
- 按时间倒序排列

#### 启用/禁用

在站点配置中可以通过 `featurePages.reposts` 配置：

```typescript
export const siteConfig = {
	featurePages: {
		reposts: true, // 启用/禁用转载页面
		// ...
	},
}
```

---

### 配置导航栏

在导航栏配置中添加转载页面链接：

```typescript
export const navBarConfig = {
	links: [
		LinkPreset.Reposts, // 使用预设链接
	],
}
```

或者手动添加：

```typescript
export const navBarConfig = {
	links: [
		{
			name: "转载",
			url: "/reposts/",
			icon: "material-symbols:content-copy",
		},
	],
}
```

---

### 版权说明

可以在文章Frontmatter中添加版权许可证：

```yaml
copyright: 'CC BY-SA'
```

支持的许可证：
- `CC BY`
- `CC BY-SA`
- `CC BY-ND`
- `CC BY-NC`
- `CC BY-NC-SA`
- `CC BY-NC-ND`
- `CC0`
- `ARR`（保留所有权利）

---

### 使用示例

完整的转载文章Frontmatter：

```yaml
---
title: LLM是如何工作的？
published: 2026-01-01
repost:
  originalAuthor: 'John Doe'
  originalUrl: 'https://johndoe.com/how-llms-work'
  originalTitle: 'How LLMs Work: A Deep Dive'
  originalSite: 'John Doe Blog'
copyright: 'CC BY-NC-SA'
tags:
  - LLM
  - AI
---

这篇文章介绍了LLM的工作原理...
```

### 重定向功能

如果配置了 `repost.redirect` 字段，访问此文章时会自动重定向到该URL，通常用于完全跳转到原文：

```yaml
repost:
  originalAuthor: 'John Doe'
  originalUrl: 'https://johndoe.com/original'
  redirect: 'https://johndoe.com/original'
```

在这种情况下，文章内容可以很简短，直接引导用户跳转。
