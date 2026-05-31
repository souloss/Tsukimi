---
title: Series 系列/专栏
createTime: 2026-05-20
permalink: /press/article-types/series/
order: 1
icon: ri:list-indefinite
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## Series 系列/专栏功能

Mizuki支持Series（系列/专栏）功能，可以将多篇文章组织成一个完整的系列，便于读者按顺序阅读。

---

### 文章Frontmatter配置

在文章的Frontmatter中添加以下字段来配置系列：

```yaml
---
title: 系列文章标题
published: 2026-01-01

# Series系列配置
series: 'My Series'
seriesOrder: 1
---

文章内容...
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `series` | string | 否 | 系列名称，具有相同series名称的文章会被归为同一个系列 |
| `seriesOrder` | number | 否 | 系列中的排序，数字越小排序越靠前，默认为0 |

---

### 系列导航

在文章详情页中，系统会自动显示该文章所属系列的导航栏，显示：
- 上一篇文章（前一篇）
- 下一篇文章（后一篇）
- 系列文章列表（全部章节）

---

### 相关工具函数

在 `src/utils/series-utils.ts` 中提供了系列管理的工具函数：

```typescript
import { getSeriesPosts, getSeriesNavigation } from "@utils/series-utils"
```

#### getSeriesPosts(post, allPosts)

获取指定文章所属系列的所有文章列表，按seriesOrder排序。

#### getSeriesNavigation(post, allPosts)

获取系列导航数据，包含上一篇、下一篇、系列列表。

---

### 功能特点

1. **自动排序**：根据 seriesOrder 字段自动排序
2. **导航展示**：在文章详情页显示系列导航
3. **灵活分组**：通过 series 字段任意分组

---

### 示例

```yaml
---
title: LLM量化入门（1）
published: 2026-01-01
series: 'LLM量化指南'
seriesOrder: 1
---
```

```yaml
---
title: LLM量化入门（2）
published: 2026-01-08
series: 'LLM量化指南'
seriesOrder: 2
---
```

这两篇文章会自动归为同一个系列，并按照 seriesOrder 排序。
