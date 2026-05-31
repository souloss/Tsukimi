---
title: 友链页面
createTime: 2025/08/17 17:21:41
permalink: /special/friends/
order: 4
icon: ri:links-line
badge:
  type: info
  text: v3
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

### 友链页面配置教程

Mizuki 主题内置了一个美观的友情链接（Friends）页面，用于展示与您的博客相关的其他网站或朋友的博客链接。与传统博客文章不同，友情链接更侧重于快速访问和分类管理。

本教程将详细指导你如何添加、修改和管理友情链接数据。

---

#### **1. 核心概念：页面、配置与数据分离**

::: file-tree

- Mizuki
  - src
    - pages
      - friends.astro
    - config
      - friendsConfig.ts
    - data
      - friends.ts
:::

在 Mizuki 主题中，友情链接页面的**展示逻辑**、**配置**和**内容数据**是分开的：

*   **展示逻辑**: `src/pages/friends.astro`
    *   这个文件负责友情链接页面的HTML结构、CSS样式和JavaScript交互逻辑。
    *   它定义了友情链接如何在页面上排列、头像如何展示、标签如何分类等。
    *   **通常情况下，你不需要修改这个文件。**

*   **配置**: `src/config/friendsConfig.ts`
    *   这个文件包含友链页面的配置选项，如页面标题、是否显示朋友圈等。
    *   **配置页面的整体行为在这里操作。**

*   **内容数据**: `src/data/friends.ts`
    *   这个文件是友情链接内容的"数据库"。所有的友情链接都以数组的形式存储在这里。
    *   每一个友情链接都是一个对象，包含 `id`, `title`, `imgurl`, `desc`, `siteurl` 和 `tags` 等属性。
    *   **添加、修改或删除友情链接，都在这个文件中操作。**

---

#### **2. `src/config/friendsConfig.ts` 配置详解**

打开 `src/config/friendsConfig.ts`，你会看到友链页面的配置选项：

```typescript title="src/config/friendsConfig.ts"
import type { FriendsPageConfig } from "../types/config";

// 友链页面配置
export const friendsConfig: FriendsPageConfig = {
  // 页面标题
  title: "友情链接",
  // 页面描述
  description: "欢迎来交换友链！",
  // 是否显示自定义内容（friends.md）
  showCustomContent: true,
  // 是否显示评论区
  showComment: false,
  // 是否显示朋友圈动态
  showFriendsCircle: true,
  // 是否打乱排序，如果为 true，将忽略 weight，随机排序
  randomizeSort: true,
  // 朋友圈最多展示条目数
  circleMaxItems: 20,
  // 每个友链最多抓取条目数
  circleMaxItemsPerFriend: 3,
};
```

**配置项说明**:
*   **title**: 页面标题，显示在页面顶部
*   **description**: 页面描述文本，显示在标题下方
*   **showCustomContent**: 是否显示自定义内容（来自 `src/content/spec/friends.md`），默认为 `true`
*   **showComment**: 是否显示评论区，默认为 `false`
*   **showFriendsCircle**: 是否显示朋友圈动态，默认为 `true`
*   **randomizeSort**: 是否打乱排序，如果为 `true` 将忽略 weight 随机排序，默认为 `true`
*   **circleMaxItems**: 朋友圈最多展示的条目总数，默认为 20
*   **circleMaxItemsPerFriend**: 每个友链最多抓取的条目数，默认为 3

---

#### **3. `src/data/friends.ts` 文件详解**

打开 `src/data/friends.ts`，你会看到类似下面的代码结构：

```typescript title="src/data/friends.ts"
export interface FriendItem {
	id: number;
	name: string; // 网站名称（原 title）
	avatar: string; // 头像URL（原 imgurl）
	url: string; // 网站地址（原 siteurl）
	description?: string; // 网站描述（原 desc，可选）
	tags?: string[]; // 标签数组（可选）
	rss?: string; // RSS 订阅地址（新增，可选）
	weight?: number; // 权重（新增，可选，数字越大排序越靠前）
	enabled?: boolean; // 是否启用（新增，可选，默认 true）
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		name: "Astro",
		avatar: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		url: "https://github.com/withastro/astro",
		description: "The web framework for content-driven websites",
		tags: ["Framework"],
		rss: "https://github.com/withastro/astro/releases.atom",
		weight: 10,
		enabled: true,
	},
];
```

**数据结构说明**:

*   **`interface FriendItem`**: 这是一个TypeScript接口，它定义了每一个友情链接必须包含的字段和它们的类型。
    *   `id: number`: (必填) 友情链接的唯一标识符。**必须是数字，且不能重复**。通常按添加顺序递增。
    *   `name: string`: (必填) 网站或博客的名称。（原 `title`）
    *   `avatar: string`: (必填) 网站头像或Logo的URL地址。建议使用正方形图片，尺寸为640x640像素。（原 `imgurl`）
    *   `url: string`: (必填) 网站的URL地址，需要包含协议（http://或https://）。（原 `siteurl`）
    *   `description?: string`: (可选) 网站的简短描述。（原 `desc`）
    *   `tags?: string[]`: (可选) 标签数组，用于分类。
    *   `rss?: string`: (可选) 网站的 RSS/Atom 订阅地址，用于朋友圈功能抓取文章。
    *   `weight?: number`: (可选) 权重值，数字越大排序越靠前。默认值为 0。
    *   `enabled?: boolean`: (可选) 是否启用此友链，设为 `false` 时不显示。默认值为 `true`。

*   **`export const friendsData: FriendItem[] = [...]`**: 这是实际的友情链接数据数组。
    *   数组中的每一个对象都遵循上面 `FriendItem` 接口的定义。
    *   友情链接在页面上的显示顺序**通常是按照权重（weight）排序，权重相同时按数组顺序**，也可以使用随机排序函数使其随机展示。

**字段名变更说明**:
- `title` → `name`
- `imgurl` → `avatar`
- `siteurl` → `url`
- `desc` → `description`
- 新增: `rss`, `weight`, `enabled`

---

#### **4. 添加一个新的友情链接**

按照以下步骤添加一个新的友情链接：

1.  **准备头像图片**:
    *   获取或制作一个网站头像图片，建议使用正方形图片，尺寸为640x640像素。
    *   推荐使用GitHub头像、网站Logo或其他代表性图片。
    *   确保图片URL可以正常访问。

2.  **编辑 `friends.ts` 文件**:
    *   打开 `src/data/friends.ts`。
    *   在 `friendsData` 数组中，复制一个现有的友情链接对象作为模板。
    *   修改模板中的属性：
        *   **`id`**: 给一个新的、唯一的数字（例如，在最后一个友情链接的`id`基础上加1）。
        *   **`name`**: 输入网站或博客的名称。
        *   **`avatar`**: 设置头像图片的URL。
        *   **`url`**: 设置网站的URL地址，确保包含协议。
        *   **`description`**: (可选) 输入网站的简短描述，建议控制在50个字符以内。
        *   **`tags`**: (可选) 添加适当的标签。
        *   **`rss`**: (可选) 添加网站的 RSS 订阅地址，用于朋友圈功能。
        *   **`weight`**: (可选) 设置权重，数字越大排序越靠前。
        *   **`enabled`**: (可选) 设置是否启用，默认为 true。

3.  **示例：添加一个新的友情链接**

    假设我们要在现有友情链接后添加一个新的，内容如下：
    *   名称："Vue.js"
    *   头像：Vue.js的Logo
    *   描述："渐进式JavaScript框架"
    *   网址："https://vuejs.org"
    *   标签：["Framework", "JavaScript"]
    *   RSS："https://vuejs.org/feed.xml"
    *   权重：8

    修改后的 `friendsData` 数组会是这样：

    ```typescript title="src/data/friends.ts"
    export const friendsData: FriendItem[] = [
      {
        id: 1,
        name: "Astro",
        avatar: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
        url: "https://github.com/withastro/astro",
        description: "The web framework for content-driven websites",
        tags: ["Framework"],
        rss: "https://github.com/withastro/astro/releases.atom",
        weight: 10,
        enabled: true,
      },
      {
        id: 2,
        name: "Mizuki Docs",
        avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
        url: "https://docs.mizuki.mysqil.com",
        description: "Mizuki User Manual",
        tags: ["Docs"],
        weight: 5,
        enabled: true,
      },
      // ... 其他友情链接 ...
      // --- 这是我们新添加的友情链接 ---
      {
        id: 9, // 新的ID
        name: "Vue.js", // 名称
        avatar: "https://avatars.githubusercontent.com/u/6128107?v=4&s=640", // 头像URL
        url: "https://vuejs.org", // 网站URL
        description: "渐进式JavaScript框架", // 描述
        tags: ["Framework", "JavaScript"], // 标签
        rss: "https://vuejs.org/feed.xml", // RSS地址
        weight: 8, // 权重
        enabled: true, // 启用
      },
    ];
    ```

---

#### **5. 修改或删除友情链接**

*   **修改友情链接**: 直接在 `friendsData` 数组中找到对应的友情链接对象，修改其 `name`, `avatar`, `url`, `description`, `tags`, `rss`, `weight` 或 `enabled` 属性即可。
*   **临时隐藏友情链接**: 不需要删除，只需将 `enabled` 设置为 `false` 即可临时隐藏。
*   **删除友情链接**: 找到对应的友情链接对象，将其从数组中完全移除。注意不要留下多余的逗号，以免造成语法错误。

---

#### **6. 高级功能：排序与辅助函数**

友情链接页面支持多种排序方式，包括按权重排序和随机排序：

```typescript title="src/data/friends.ts"
// 获取启用的友情链接
export function getEnabledFriendsList(): FriendItem[] {
	return friendsData.filter(friend => friend.enabled !== false);
}

// 获取按权重排序的友情链接数据（权重越大越靠前）
export function getWeightedFriendsList(): FriendItem[] {
	const enabled = getEnabledFriendsList();
	return [...enabled].sort((a, b) => (b.weight || 0) - (a.weight || 0));
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const enabled = getEnabledFriendsList();
	const shuffled = [...enabled];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
```

**函数说明**:
- `getEnabledFriendsList()`: 获取所有启用的友链（过滤掉 `enabled: false` 的）
- `getWeightedFriendsList()`: 按权重排序，权重越大越靠前
- `getShuffledFriendsList()`: 随机排序，每次刷新都可能不同

你可以在页面组件中调用这些函数来获取排序后的友情链接列表。

---

#### **7. 朋友圈功能集成**

友链页面集成了朋友圈功能，可以聚合展示友链博客的最新文章：

*   在友链配置中添加 `rss` 字段，填写友链的 RSS/Atom 订阅地址
*   在 `src/data/friends-circle.ts` 中配置朋友圈功能
*   朋友圈区域会自动显示在友链列表下方

详细配置请参考 [朋友圈功能文档](/docs/mizuki/special/friends-circle/)。

---

#### **8. 最佳实践与建议**

*   **头像图片**: 建议使用正方形的高质量图片，尺寸为640x640像素。可以使用GitHub头像、网站Logo或其他代表性图片。
*   **描述长度**: 保持描述简洁，建议控制在50个字符以内，避免过长的文本影响页面布局。
*   **标签管理**: 使用一致的标签命名，便于分类和管理。建议使用英文标签，如"Framework"、"Docs"等。
*   **链接有效性**: 定期检查友情链接的有效性，移除失效链接或设置 `enabled: false`。
*   **ID管理**: 保持 `id` 的连续性和唯一性，这有助于你管理友情链接，也便于未来可能的功能扩展（如按ID查询）。
*   **权重设置**: 给重要的友链设置更高的 `weight` 值，使其排在前面。
*   **RSS配置**: 为友链添加 `rss` 地址，让朋友圈功能能够聚合展示他们的文章。

---

#### **9. 页面特性与自定义**

友情链接页面具有以下特性：

*   **响应式设计**: 在不同设备上都能良好显示
    *   桌面端：2列网格布局
    *   移动端：1列布局

*   **标签筛选**: 顶部标签栏支持按分类筛选友链，选中标签以主题色填充样式高亮

*   **友链卡片**: 每个友链卡片包含头像、名称、描述和标签，悬停时有主题色背景装饰和箭头动画

*   **本站信息**: 页面下方展示本站信息（站点名称、描述、链接、头像），每个字段支持一键复制

*   **申请流程**: 提供三步友链申请指引（添加本站 → 评论区留言 → 等待审核），申请模板也支持一键复制

*   **注意事项**: 展示友链申请的注意事项（互换原则、链接维护、内容要求等）

*   **随机排序**: 支持随机排序，确保公平展示

如需自定义样式，可以修改对应的CSS类或使用主题提供的自定义样式选项。

---

#### **10. 页面区域布局**

友链页面从上到下依次包含以下区域：

1. **友链卡片** — 展示所有友情链接，支持标签筛选
2. **朋友圈** — 聚合友链博客的最新文章（需开启 `showFriendsCircle`）
3. **自定义内容** — 来自 `src/content/spec/friends.md`，默认包含本站信息、申请流程和注意事项（需开启 `showCustomContent`）
4. **评论区** — 读者可留言申请友链（需开启 `showComment`）

---

#### **11. 自定义内容（friends.md）**

`src/content/spec/friends.md` 用于展示本站信息和友链申请流程。页面会自动从 `siteConfig` 和 `profileConfig` 读取本站信息，你也可以直接编辑此文件自定义内容。

默认的自定义内容包含：

- **本站信息卡片**：展示站点名称、描述、链接、头像，每个字段旁有复制按钮
- **申请流程卡片**：三步流程指引（添加本站友链 → 评论区留言申请 → 等待审核），附申请模板和复制按钮
- **注意事项**：互换原则、链接维护、内容要求、站点要求、RSS 订阅说明

::: tip 提示
本站信息（站点名称、描述、链接、头像）由 `siteConfig` 和 `profileConfig` 自动填充，修改配置文件即可更新。
:::

---

#### **12. 导航栏配置**

要在导航栏中显示友情链接，请确保在 `src/config.ts` 的 `navBarConfig` 中包含了友情链接：

```typescript title="src/config.ts"
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Friends, // 友情链接
		// ... 其他链接
	],
};
```

或者手动添加友情链接：

```typescript title="src/config.ts"
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "友情链接",
			url: "/friends/",
			icon: "ri:links-line",
		},
		// ... 其他链接
	],
};
```

---

#### **13. 友情链接申请**

友链页面内置了友链申请流程，访客可以通过以下步骤申请：

1. 在本站信息区域复制本站信息，先在自己的网站添加本站友链
2. 使用申请模板（页面内置，支持一键复制）在评论区留言
3. 等待站长审核

你也可以自定义 `src/content/spec/friends.md` 来修改申请流程和注意事项。

---

通过以上步骤，你就可以轻松地管理你的友情链接页面了。定期更新 `src/data/friends.ts`，让你的博客与其他优质网站建立联系吧！