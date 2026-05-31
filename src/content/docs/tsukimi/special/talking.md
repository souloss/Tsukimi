---
title: 动态/说说页面
createTime: 2025/08/17 17:21:41
permalink: /special/talking/
order: 2
icon: ri:book-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---


### 动态/说说页面配置教程

Mizuki 主题内置了一个优雅的动态/说说页面，用于分享你的日常点滴、心情感悟或生活瞬间。与传统博客文章不同，动态/说说更侧重于简短、即时的记录，通常会搭配图片。

本教程将详细指导你如何添加、修改和管理动态/说说内容，包括本地数据配置和 Memos API 集成。

---

#### **1. 核心概念：页面与数据分离**

::: file-tree

- Mizuki
  - src
    - pages
      - talking.astro
    - data
      - talking.ts
:::

在 Mizuki 主题中，动态/说说页面的**展示逻辑**和**内容数据**是分开的：

*   **展示逻辑**: `src/pages/talking.astro`
    *   这个文件负责动态/说说页面的HTML结构、CSS样式和JavaScript交互逻辑。
    *   它定义了动态/说说条目如何在页面上排列、图片如何展示、日期如何格式化等。
    *   **通常情况下，你不需要修改这个文件。**

*   **内容数据**: `src/data/talking.ts`
    *   这个文件是动态/说说内容的"数据库"。所有的动态/说说条目都以数组的形式存储在这里。
    *   每一篇动态/说说都是一个对象，包含 `id`, `content`, `date` 和 `images` 等属性。
    *   **添加、修改或删除动态/说说，都在这个文件中操作。**

---

#### **2. `src/data/talking.ts` 文件详解**

打开 `src/data/talking.ts`，你会看到类似下面的代码结构：

```typescript title="src/data/talking.ts"
export interface TalkingItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 示例动态/说说数据
const talkingData: TalkingItem[] = [
	{
		id: 1,
		content:
			"The falling speed of cherry blossoms is five centimeters per second!",
		date: "2025-01-15T10:30:00Z",
		images: ["/images/talking/sakura.jpg", "/images/talking/1.jpg"],
	},
];

```

**数据结构说明**:

*   **`interface TalkingItem`**: 这是一个TypeScript接口，它定义了每一篇动态/说说必须包含的字段和它们的类型。
    *   `id: number`: (必填) 动态/说说的唯一标识符。**必须是数字，且不能重复**。通常按时间顺序递增。
    *   `content: string`: (必填) 动态/说说的正文内容。可以是纯文本，也可以包含换行符。
    *   `date: string`: (必填) 动态/说说的发布日期和时间。**必须是ISO 8601格式**的字符串，例如 `2025-01-15T10:30:00Z`。`Z` 表示UTC时间，主题会自动将其转换为本地时间显示。
    *   `images?: string[]`: (可选) 动态/说说附带的图片路径数组。`?` 表示这个字段是可选的。如果一篇动态/说说没有图片，可以省略这个属性。
    *   `location?: string`: (可选) 位置信息，表示发布动态的地点。
    *   `mood?: string`: (可选) 心情信息，表示发布时的心情状态。
    *   `tags?: string[]`: (可选) 标签数组，用于分类和筛选动态。

*   **辅助函数**: `src/data/talking.ts` 还提供了几个实用函数：
    *   `getTalkingList(limit?)`: 获取按时间倒序排列的说说列表，可指定返回数量
    *   `getAllTags()`: 获取所有说说使用的标签，去重后返回

---

#### **3. 添加一篇新动态/说说**

按照以下步骤添加一篇新的动态/说说：

1.  **准备图片（如果需要）**:
    *   将你想要展示的图片文件（如 `my-new-photo.webp`）复制到项目的 `public` 目录下。建议创建一个专门的文件夹，例如 `public/images/talking/`。
    *   **注意**: 路径是从 `public` 文件夹开始计算的。如果图片放在 `public/images/talking/` 下，那么它的路径就是 `/images/talking/my-new-photo.webp`。

2.  **编辑 `talking.ts` 文件**:
    *   打开 `src/data/talking.ts`。
    *   在 `talkingData` 数组中，复制一个现有的动态/说说对象作为模板。
    *   修改模板中的属性：
        *   **`id`**: 给一个新的、唯一的数字（例如，在最后一篇动态/说说的`id`基础上加1）。
        *   **`content`**: 输入你的动态/说说内容。如果需要换行，可以使用 `
`。
        *   **`date`**: 设置动态/说说的日期和时间。你可以在网上搜索"ISO 8601 时间生成器"来获取正确格式的字符串。
        *   **`images`**: (如果有图片) 添加图片的路径数组。如果没有图片，可以直接删除 `images` 这一行。

3.  **示例：添加一篇新动态/说说**

    假设我们要在现有两篇动态/说说后添加一篇新的，内容如下：
    *   内容："今天尝试了新的咖啡配方，味道很棒！"
    *   日期：2025年1月20日下午3点
    *   图片：`coffee.jpg` (已放入 `public/images/talking/` 目录)

    修改后的 `talkingData` 数组会是这样：

    ```typescript
    export const talkingData: TalkingItem[] = [
      {
        id: 1,
        content: "The falling speed of cherry blossoms is five centimeters per second!",
        date: "2025-01-15T10:30:00Z",
        images: ["/images/talking/sakura.jpg", "/images/talking/1.jpg"],
      },
      {
        id: 2,
        content: "今日は晴れで、公園でピクニックをしました。とても楽しかったです！",
        date: "2025-01-10T14:00:00Z",
      },
      // --- 这是我们新添加的动态/说说 ---
      {
        id: 3, // 新的ID
        content: "今天尝试了新的咖啡配方，味道很棒！绵密的奶泡是关键。", // 内容，使用换行
        date: "2025-01-20T15:00:00Z", // 新的日期
        images: ["/images/talking/coffee.jpg"], // 新的图片路径
      },
    ];
    ```

---

#### **4. 修改或删除动态/说说**

*   **修改动态/说说**: 直接在 `talkingData` 数组中找到对应的动态/说说对象，修改其 `content`, `date`, `images`, `location`, `mood` 或 `tags` 属性即可。
*   **删除动态/说说**: 找到对应的动态/说说对象，将其从数组中完全移除。注意不要留下多余的逗号，以免造成语法错误。

---

#### **5. MomentCard 组件**

说说页面使用 `MomentCard.astro` 组件来展示每条动态：

*   **组件位置**: `src/components/features/talking/MomentCard.astro`
*   **特性**:
    *   智能图片布局：1张图时大图显示，2张图双列，3张图左图右两小图，4+图网格布局
    *   优雅的渐入动画（按索引延迟）
    *   悬停效果（上移、阴影、渐变叠加）
    *   相对时间显示（如："5分钟前"、"3小时前"、"2天前"）
    *   位置和心情信息显示
    *   标签展示
    *   Fancybox 图片灯箱支持
    *   标签过滤支持

*   **Props**:
    *   `moment`: TalkingItem 对象
    *   `index`: 索引值，用于动画延迟
    *   `minutesAgo`, `hoursAgo`, `daysAgo`: 多语言时间文本

---

#### **6. 使用 Memos API 动态获取数据**

除了使用本地 `talking.ts` 数据文件，你还可以配置 Memos API 来动态获取说说数据：

```typescript title="src/config.ts"
export const siteConfig: SiteConfig = {
	// ... 其他配置
	// 说说/动态页面 Memos API 地址，客户端 fetch 获取动态数据
	talkingApiUrl: "https://your-memos-instance.com/api/v1/memo",
	// 说说/动态页面是否显示评论区
	talkingShowComment: true,
};
```

**配置说明**:
*   `talkingApiUrl`: 设置为你的 Memos 实例 API 地址
*   `talkingShowComment`: 控制是否在说说页面显示评论区

当配置了 `talkingApiUrl` 时，页面会优先从 API 获取数据；如果没有配置或 API 请求失败，则回退到本地 `talking.ts` 数据。

---

#### **7. 最佳实践与建议**

*   **图片优化**: 建议使用现代的图片格式如 `.webp`，并在上传前进行压缩，以保证页面加载速度。
*   **日期格式**: 严格遵守 ISO 8601 格式 (`YYYY-MM-DDTHH:mm:ssZ`)，否则日期可能无法正确显示。
*   **ID管理**: 保持 `id` 的连续性和唯一性，这有助于你管理动态/说说，也便于未来可能的功能扩展（如按ID查询）。
*   **内容排版**: 在 `content` 中适当使用换行，可以让你的动态/说说在页面上显示得更美观、易读。
*   **标签使用**: 合理使用标签可以帮助访客筛选和浏览相关的动态内容。
*   **评论配置**: 根据需要决定是否在说说页面启用评论功能。

通过以上步骤，你就可以轻松地管理你的动态/说说页面了。定期更新 `src/data/talking.ts` 或使用 Memos API，让你的博客充满生活气息吧！