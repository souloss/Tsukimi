---
title: Giscus 评论配置
order: 7
icon: "ri:message-3-line"
createTime: 2025/08/17 17:21:41
permalink: /article-layout/giscus/
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# Giscus 评论配置

Giscus 是基于 GitHub Discussions 的评论系统，适合技术博客。配置位于 `src/config.ts` 中的 `commentConfig` 对象。

## 评论系统选择

通过 `commentConfig.system` 字段选择评论系统：

```typescript
system: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"
```

| 值 | 说明 |
|------|------|
| `"none"` | 不启用评论（默认） |
| `"twikoo"` | 使用 Twikoo |
| `"waline"` | 使用 Waline |
| `"giscus"` | 使用 Giscus（基于 GitHub Discussions） |
| `"disqus"` | 使用 Disqus |
| `"artalk"` | 使用 Artalk |

## 前置要求

在配置 Giscus 之前，需要确保：

1. **GitHub 仓库**：需要一个公开的 GitHub 仓库用于存储评论数据
2. **已安装 Giscus GitHub App**：前往 [https://github.com/apps/giscus](https://github.com/apps/giscus) 安装到你的仓库
3. **已启用 Discussions**：在仓库 Settings 中启用 Discussions 功能

## Giscus 配置

```typescript title="src/config.ts"
export const commentConfig: CommentConfig = {
  system: "giscus",
  giscus: {
    repo: "username/repo-name",             // GitHub 仓库路径
    repoId: "R_kgDOxxxxxxx",                // 仓库 ID
    category: "Announcements",              // Discussion 分类名
    categoryId: "DIC_kwDOxxxxxxx",          // 分类 ID
    mapping: "pathname",                    // 页面映射方式
    strict: "0",                            // 严格匹配
    reactionsEnabled: "1",                  // 反应功能
    emitMetadata: "0",                      // 元数据发送
    inputPosition: "top",                   // 输入框位置
    theme: "preferred_color_scheme",        // 主题
    lang: "zh-CN",                          // 语言
    loading: "lazy",                        // 加载方式
  },
};
```

### 配置项说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `repo` | `string` | 是 | GitHub 仓库路径，格式 `用户名/仓库名` |
| `repoId` | `string` | 是 | 仓库唯一 ID |
| `category` | `string` | 是 | Discussion 分类名 |
| `categoryId` | `string` | 是 | 分类唯一 ID |
| `mapping` | `string` | 是 | 页面映射方式 |
| `strict` | `string` | 否 | 是否严格匹配，`"0"` 或 `"1"` |
| `reactionsEnabled` | `string` | 否 | 是否启用反应功能，`"0"` 或 `"1"` |
| `emitMetadata` | `string` | 否 | 是否发送元数据，`"0"` 或 `"1"` |
| `inputPosition` | `string` | 否 | 输入框位置，`"top"` 或 `"bottom"` |
| `theme` | `string` | 否 | 评论区主题 |
| `lang` | `string` | 否 | 评论区语言 |
| `loading` | `string` | 否 | 加载方式，`"lazy"` 或 `"eager"` |

### 获取配置参数

所有参数可在 [Giscus 官网配置页面](https://giscus.app/zh-CN) 自动生成：

1. 输入仓库路径
2. 选择映射方式（推荐 `pathname`）
3. 选择 Discussion 分类（推荐 `Announcements`）
4. 页面底部自动生成配置代码

### mapping 映射方式

| 值 | 说明 |
|------|------|
| `"pathname"` | 使用页面路径名（推荐） |
| `"url"` | 使用完整 URL |
| `"title"` | 使用页面标题 |
| `"og:title"` | 使用 OpenGraph 标题 |
| 自定义字符串 | 使用自定义标识 |

### theme 主题选项

| 值 | 说明 |
|------|------|
| `"preferred_color_scheme"` | 跟随系统偏好（推荐） |
| `"light"` | 亮色主题 |
| `"dark"` | 暗色主题 |
| `"dark_dimmed"` | 低对比度暗色 |
| `"transparent_dark"` | 透明暗色 |
| 自定义 CSS URL | 完全自定义 |

## 其他评论系统

- [Twikoo 评论配置](/docs/mizuki/article-layout/twikoo/)
- [Waline 评论配置](/docs/mizuki/article-layout/waline/)
- [Disqus 评论配置](/docs/mizuki/article-layout/disqus/)
- [Artalk 评论配置](/docs/mizuki/article-layout/artalk/)

## 注意事项

- 评论数据存储在 GitHub Discussions 中，你拥有完全数据控制权
- 评论者需要 GitHub 账号登录，有助于减少垃圾评论
- 更换域名或路径后，之前关联的评论可能丢失
- 建议在确定 URL 结构后再部署