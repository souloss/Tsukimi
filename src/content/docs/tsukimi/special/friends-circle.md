---
title: 朋友圈功能
createTime: 2025/05/20 00:00:00
permalink: /special/friends-circle/
order: 5
icon: ri:chat-group-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

**朋友圈功能说明**

Mizuki 主题内置了朋友圈（Friends Circle）功能，可以通过 RSS 聚合友链博客的最新文章，形成一个文章广场。

---

## 核心概念

朋友圈功能的文件结构：

::: file-tree
- Mizuki
  - src/
    - data/
      - friends-circle.ts    # 朋友圈配置和聚合逻辑
      - friends.ts          # 友链数据
    - pages/
      - friends.astro       # 友链页面（包含朋友圈）
:::

---

## 数据结构

### 友链配置扩展

在 `src/data/friends.ts` 中，每个友链项支持配置 RSS 地址：

```typescript
export interface FriendItem {
    id: number;
    name: string;
    url: string;
    avatar: string;
    description?: string;
    rss?: string; // RSS 订阅地址（新增）
    weight?: number; // 权重，影响排序（新增）
    enabled?: boolean; // 是否启用（新增，默认 true）
}
```

**新增字段说明**:
- `rss`: 友链博客的 RSS/Atom 订阅地址，用于抓取文章
- `weight`: 权重值，数字越大排序越靠前
- `enabled`: 是否在友链列表中显示，同时也影响朋友圈是否抓取

### 朋友圈数据结构

`src/data/friends-circle.ts` 中的聚合文章结构：

```typescript
export interface FriendsCirclePost {
    title: string;
    link: string;
    pubDate: Date;
    author: string;
    blogName: string;
    blogUrl: string;
    description?: string;
    categories?: string[];
}
```

---

## friends-circle.ts 配置

```typescript title="src/data/friends-circle.ts"
export const friendsCircleConfig = {
    enable: true, // 是否启用朋友圈功能
    cacheExpireTime: 30 * 60 * 1000, // 缓存过期时间 30分钟
    maxPostsPerBlog: 5, // 每个博客最多抓取的文章数
    totalPostsLimit: 50, // 总文章数限制
    showFullText: false, // 是否显示全文（默认只显示摘要）
    dateFormat: 'YYYY-MM-DD', // 日期显示格式
    sortBy: 'date', // 排序方式: 'date' | 'random'
}

// 手动添加的精选文章
export const featuredPosts: FriendsCirclePost[] = [
    {
        title: '欢迎使用 Mizuki',
        link: 'https://example.com/post/1',
        pubDate: new Date('2025-01-01'),
        author: 'Admin',
        blogName: 'Mizuki Blog',
        blogUrl: 'https://example.com',
        description: '这是一篇精选文章示例',
    },
]
```

---

## 配置项详解

### enable

```typescript
enable: boolean;
```

是否启用朋友圈功能。禁用后不会抓取 RSS，也不会在友链页面显示朋友圈区域。

---

### cacheExpireTime

```typescript
cacheExpireTime: number; // 毫秒
```

RSS 抓取结果的缓存时间，单位毫秒。

| 推荐值 | 说明 |
|--------|------|
| `15 * 60 * 1000` | 15分钟，更新频繁 |
| `30 * 60 * 1000` | 30分钟（默认） |
| `60 * 60 * 1000` | 1小时，减少请求 |

---

### maxPostsPerBlog

```typescript
maxPostsPerBlog: number;
```

从每个友链博客最多抓取多少篇文章。

---

### totalPostsLimit

```typescript
totalPostsLimit: number;
```

朋友圈最多显示的总文章数，超过此数量会按时间截断。

---

### showFullText

```typescript
showFullText: boolean;
```

是否显示文章全文。注意：RSS 可能不包含全文，取决于对方博客的 RSS 配置。

---

### sortBy

```typescript
sortBy: 'date' | 'random';
```

文章排序方式：
- `date`: 按发布时间倒序（最新在前）
- `random`: 随机排序

---

## 配置友链 RSS

在 `src/data/friends.ts` 中为你的友链添加 RSS 地址：

```typescript
export const friends: FriendItem[] = [
    {
        id: 1,
        name: '张三的博客',
        url: 'https://blog.zhang.example',
        avatar: '/assets/friends/zhang.webp',
        description: '一个技术博客',
        rss: 'https://blog.zhang.example/rss.xml', // 添加 RSS 地址
        weight: 10,
        enabled: true,
    },
    {
        id: 2,
        name: '李四的博客',
        url: 'https://blog.li.example',
        avatar: '/assets/friends/li.webp',
        rss: 'https://blog.li.example/feed/',
        weight: 5,
        enabled: true,
    },
]
```

---

## 缓存机制

为了避免每次页面加载都去请求 RSS，Mizuki 使用了缓存机制：

1. **构建时缓存**: 生产构建时会预抓取 RSS 并缓存
2. **运行时缓存**: 浏览器端也会缓存结果到 `localStorage`
3. **过期策略**: 根据 `cacheExpireTime` 自动过期并重新抓取

**缓存键**: `mizuki-friends-circle-cache`

---

## 页面显示

朋友圈区域会显示在友链页面（`/friends/`）的友链列表下方，通常包含：

- 聚合文章列表
- 每篇文章显示：作者头像、作者名称（可点击跳转友链网站）、发布时间、文章标题（可点击跳转原文）、内容摘要
- 作者信息与文章标题分离布局：作者信息区域独立于文章链接，点击作者名称跳转友链网站，点击文章标题跳转原文

---

## 完整配置示例

```typescript title="src/data/friends-circle.ts"
export const friendsCircleConfig = {
    enable: true,
    cacheExpireTime: 30 * 60 * 1000,
    maxPostsPerBlog: 5,
    totalPostsLimit: 50,
    showFullText: false,
    dateFormat: 'YYYY-MM-DD',
    sortBy: 'date',
}

export const featuredPosts: FriendsCirclePost[] = [
    {
        title: 'Mizuki 主题发布',
        link: 'https://example.com/post/mizuki-release',
        pubDate: new Date('2025-01-01'),
        author: 'souloss',
        blogName: 'souloss Blog',
        blogUrl: 'https://example.com',
        description: 'Mizuki 是一个精美的 Astro 博客主题...',
    },
]
```

---

## 注意事项

1. **RSS 格式**: 支持 RSS 2.0 和 Atom 1.0 格式
2. **CORS 限制**: 浏览器端抓取可能受 CORS 限制，可能需要配置代理
3. **内容所有权**: 聚合的文章版权归原作者所有
4. **性能考虑**: 友链数量较多时，建议适当延长缓存时间
5. **可用性**: 部分博客可能不提供 RSS，或 RSS 格式不标准

---

## 相关配置

- [友链配置](/docs/mizuki/special/friends/) - 友链列表的详细配置
