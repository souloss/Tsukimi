---
title: 文档系统
createTime: 2025/08/17 17:21:41
permalink: /other/docs-system/
order: 7
icon: ri:book-open-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 文档系统

Mizuki 内置了一个完整的文档系统，用于编写和展示项目文档。

### 功能特性

- **侧边栏导航** - 自动生成的文档目录导航
- **目录（TOC）** - 页面内的标题导航
- **面包屑导航** - 显示当前页面在文档结构中的位置
- **多语言支持** - 同一文档可以有多种语言版本
- **上一页/下一页导航** - 文档页面间的顺序导航
- **搜索功能** - 文档内容搜索
- **暗色主题** - 支持暗色模式
- **自定义永久链接** - 可为文档页面设置自定义 URL

### 文档目录结构

文档文件位于 `src/content/docs/` 目录下：

```
src/content/docs/
├── mizuki/
│   ├── index.md
│   ├── guide/
│   │   ├── intro.md
│   │   ├── get-started.md
│   │   └── ...
│   ├── Basic-Layout/
│   │   ├── site-config.md
│   │   └── ...
│   └── ...
└── <其他项目文档>/
    └── ...
```

每个文档项目是一个独立的子目录。

### 文档页面 Frontmatter

文档页面使用以下 Frontmatter：

```markdown
---
title: 页面标题
createTime: 2025/08/17 17:21:41
permalink: /路径/到/页面/
docSlug: mizuki
lang: zh_CN
---

文档内容...
```

#### 字段说明

| 字段 | 必填 | 说明 |
|-----|------|-----|
| `title` | 是 | 页面显示标题 |
| `createTime` | 否 | 页面创建时间 |
| `permalink` | 否 | 自定义永久链接（不包含 `/docs/<项目>/` 前缀） |
| `docSlug` | 否 | 文档项目标识，默认为目录名 |
| `lang` | 否 | 语言标识，如 `zh_CN`、`en`、`ja` |

### 侧边栏配置

侧边栏导航在 `src/data/docs-mizuki.ts` 中配置：

```typescript
import type { DocsMizukiSidebarItem } from "./docs-mizuki";

export const docsMizukiSidebar: DocsMizukiSidebarItem[] = [
  {
    name: "指南",
    icon: "material-symbols:menu-book-outline-rounded",
    items: [
      { id: "mizuki/guide/intro", title: "介绍", order: 1 },
      { id: "mizuki/guide/get-started", title: "快速开始", order: 2 },
    ],
  },
  {
    name: "基础配置",
    icon: "material-symbols:settings-rounded",
    items: [
      { id: "mizuki/Basic-Layout/site-config", title: "站点配置", order: 1 },
    ],
  },
];
```

#### 配置项说明

- `name` - 章节名称
- `icon` - 章节图标（使用 Iconify 图标）
- `items` - 该章节下的文档页面列表
  - `id` - 文档文件路径（不含扩展名）
  - `title` - 侧边栏显示的标题
  - `order` - 排序顺序，数字越小越靠前
  - `collapsed` - （可选）该章节是否默认折叠

### 多语言文档

为文档添加多语言版本：

```
src/content/docs/
└── mizuki/
    ├── guide/
    │   ├── intro.md              # 默认语言
    │   ├── intro.zh_CN.md        # 简体中文
    │   ├── intro.ja.md           # 日语
    │   └── ...
```

语言文件命名格式：`<文件名>.<语言标识>.md`

#### 语言切换器

文档页面顶部会自动显示语言切换器，列出该页面可用的所有语言版本。

### 文档首页配置

文档项目首页在 `src/data/docs-mizuki.ts` 中配置：

```typescript
export const docsMizukiProject = {
  slug: "mizuki",
  title: "Mizuki",
  description: "A beautiful Astro blog theme",
  defaultLang: "zh_CN",
};

export const docsMizukiHome = {
  id: "mizuki/guide/intro",
  title: "文档首页",
};
```

### 访问文档

文档系统路由配置：

| URL | 说明 |
|-----|-----|
| `/docs/` | 文档项目列表页 |
| `/docs/mizuki/` | Mizuki 文档首页 |
| `/docs/mizuki/guide/get-started/` | 具体文档页面 |
| `/docs/mizuki/<permalink>/` | 使用自定义 permalink 的页面 |

### 文档搜索

文档系统内置搜索功能，使用 Pagefind 索引。

搜索功能特性：
- 实时搜索文档标题和内容
- 高亮搜索关键词
- 显示结果页面预览
- 支持中文、英文等多语言搜索

### 图标自动匹配

文档侧边栏图标会根据目录/文件名称自动匹配：

- `guide/` - 书本图标
- `api/` - API 图标
- `config/` - 设置图标
- `deploy/` - 部署图标
- `question/` - 问题图标
- `bug/` - Bug 图标
- 等等...

可以在侧边栏配置中手动指定 `icon` 覆盖自动匹配。

### 面包屑导航

面包屑自动生成，显示当前页面的路径层次：

```
首页 > 基础配置 > 站点配置
```

### 上一页/下一页导航

根据侧边栏顺序自动生成上一页和下一页链接，方便用户连续阅读。

### 添加新文档

添加新文档的步骤：

1. 在 `src/content/docs/mizuki/<目录>/` 下创建 Markdown 文件
2. 添加 Frontmatter
3. 在 `src/data/docs-mizuki.ts` 中添加侧边栏配置
4. （可选）添加其他语言版本

### 样式定制

文档系统样式在 `src/styles/docs-layout.css` 中定义：

- 响应式布局（移动设备优化）
- 暗色主题支持
- 代码高亮样式
- 侧边栏和目录样式
