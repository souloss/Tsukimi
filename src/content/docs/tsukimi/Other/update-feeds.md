---
title: 朋友圈 RSS 聚合
createTime: 2025/08/17 17:21:41
permalink: /other/update-feeds/
order: 6
icon: ri:rss-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 朋友圈 RSS 聚合脚本

`scripts/update-feeds.mjs` 是一个 Node.js 脚本，用于自动抓取友链的 RSS/Atom 订阅，聚合生成朋友圈动态数据。

### 功能特性

- 自动解析 RSS 2.0 和 Atom 格式
- 支持从 `friends.ts` 读取配置
- 按权重和时间排序（权重每增加 1，相当于提前 1 小时）
- 限制每个友链的最大文章数
- 限制总显示条数
- 自动去重 HTML 标签
- 请求延迟避免被封
- 使用 axios 替代 fetch，支持禁用代理
- 自动清除代理环境变量，避免代理缓存导致 304
- CDN 缓存绕过：首次请求失败后自动加随机参数重试
- 全部抓取失败时保留已有数据不覆盖

### 安装依赖

脚本依赖 `fast-xml-parser` 和 `axios`，确保已安装：

```bash
pnpm add fast-xml-parser axios
```

### 使用方法

#### 手动运行

```bash
node scripts/update-feeds.mjs
```

#### 集成到构建流程

在 `package.json` 中添加：

```json
{
  "scripts": {
    "update-feeds": "node scripts/update-feeds.mjs",
    "prebuild": "pnpm update-feeds && pnpm update-anime"
  }
}
```

这样每次构建时都会自动更新朋友圈数据。

### 配置说明

脚本从 `src/config/friendsConfig.ts` 读取配置：

```typescript
export const friendsConfig: FriendsPageConfig = {
  // 是否启用朋友圈
  showFriendsCircle: true,
  // 朋友圈最多显示条数
  circleMaxItems: 20,
  // 每个友链最多显示条数
  circleMaxItemsPerFriend: 3,
};
```

### 友链数据配置

在 `src/data/friends.ts` 中为友链添加 `rss` 字段：

```typescript
export const friendsData: FriendItem[] = [
  {
    id: 1,
    name: "示例博客",
    avatar: "https://example.com/avatar.jpg",
    url: "https://example.com",
    rss: "https://example.com/feed.xml", // RSS 订阅地址
    weight: 10, // 权重越大排序越靠前
    enabled: true,
  },
];
```

### 输出文件

脚本会生成 `src/data/friends-circle.json`：

```json
{
  "lastUpdated": "2025-05-20T12:00:00.000Z",
  "items": [
    {
      "title": "文章标题",
      "author": "博客名称",
      "avatar": "头像地址",
      "siteUrl": "网站地址",
      "date": "2025-05-19T10:30:00.000Z",
      "link": "文章链接",
      "content": "摘要内容（最多 300 字符）"
    }
  ]
}
```

### 工作流程

1. 读取配置文件
2. 查找所有配置了 `rss` 的友链
3. 依次抓取每个友链的 RSS/Atom
4. 解析 XML 并提取文章数据
5. 按权重（权重*3600000ms + 时间戳）排序
6. 截取前 N 条
7. 写入输出文件

### 错误处理

- 单个友链抓取失败不会影响其他友链
- 超时时间设置为 15 秒
- 请求间隔 500ms 避免频繁请求
- 详细的控制台日志输出
- 首次请求无内容时自动加随机参数重试（绕过 CDN 缓存）
- 全部抓取失败时保留已有数据，不会用空数据覆盖

### 支持的 Feed 格式

- RSS 2.0 (`<rss>` 或 `<RDF>`)
- Atom (`<feed>`)

### 自动提取字段

- 文章标题
- 作者（使用 Feed 标题）
- 发布日期
- 文章链接
- 内容摘要（去除 HTML 标签）
- 头像（使用友链头像）
- 网站地址

### 代理与缓存处理

脚本内置了代理和 CDN 缓存处理机制：

1. **代理环境变量清除**：脚本启动时自动清除 `http_proxy`、`https_proxy` 等环境变量，避免代理缓存导致返回 304 空内容
2. **axios 禁用代理**：使用 `httpAgent` 和 `httpsAgent` 创建无代理的 HTTP 客户端，并设置 `proxy: false`
3. **CDN 缓存绕过**：首次请求返回空内容时，自动添加 `?_=timestamp` 随机参数重试
4. **数据保护**：如果本次所有 RSS 抓取均失败，保留 `friends-circle.json` 中已有数据不覆盖
