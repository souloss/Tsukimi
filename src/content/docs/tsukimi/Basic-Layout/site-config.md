---
title: 基础配置
createTime: 2025/08/17 17:21:41
permalink: /basic-layout/site-config/
order: 1
icon: ri:settings-3-line
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

**站点配置说明**

站点配置位于 `src/config/` 文件中的 `siteConfig` 对象，控制博客的基本信息和全局设置。

## 配置项详解

### 基本信息

```typescript title="src/config/"
const SITE_LANG = "zh_CN"; // 语言代码
export const siteConfig: SiteConfig = {
	title: "Tsukimi",
	subtitle: "一直很担心会什么都没有做就这样长大",
	siteURL: "https://tsukimi.souloss.cn/", // 站点URL，以斜杠结尾
	siteStartDate: "2020-01-01", // 站点开始运行日期，用于站点统计组件计算运行天数
	lang: SITE_LANG,
	themeColor: {
		hue: 360, // 主题色色相，范围 0-360
		fixed: false, // 是否对访问者隐藏主题色选择器
	},
};
```
- `title`：网站的主标题，显示在浏览器标签页和页面头部
- `subtitle`：网站的副标题，通常显示在主页横幅下方
- `siteURL`：你的网站 URL，必须以斜杠结尾，例如 `https://example.com/`
- `siteStartDate`：站点开始运行日期，格式为 `YYYY-MM-DD`，用于站点统计组件计算运行天数
- `description`：网站描述，用于生成 `<meta name="description">`（可选）
- `keywords`：站点关键词数组，用于生成 `<meta name="keywords">`（可选）
- `lang`：网站的默认语言，影响日期格式、翻译等功能
  - 支持的语言：`en`, `zh_CN`, `zh_TW`, `ja`, `ko`, `es`, `th`, `vi`, `tr`, `id`
- `timezone`：网站的时区设置，使用 IANA 时区标识，例如 `"Asia/Shanghai"`, `"UTC"`（可选）
- `themeColor`：网站的主题色配置
  - `hue`：主题色的色相值，可以是 0-360 之间的任何数值
    - 红色：0，青色：200，蓝绿色：250，粉色：345
  - `fixed`：设置为 `true` 时，访客将无法更改主题色
  - `defaultMode`：默认颜色模式：`"light"` 浅色，`"dark"` 深色，或 `"system"` 跟随系统（可选）

### 页面与卡片样式

```typescript
	pageWidth: 75, // 页面整体宽度（单位：rem）
	card: {
		border: true, // 是否开启卡片边框和阴影立体效果
		followTheme: false, // 是否让卡片风格跟随主题色相
	},
	rehypeCallouts: {
		theme: "github", // 调用框主题："github", "obsidian", "vitepress"
	},
```
- `pageWidth`：页面整体宽度（单位：rem），默认 75rem（可选）
- `card`：卡片样式配置（可选）
  - `border`：是否开启卡片边框和阴影立体效果
  - `followTheme`：是否让卡片风格跟随主题色相
- `rehypeCallouts`：提醒框配置（可选）
  - `theme`：调用框主题：`"github"`, `"obsidian"`, `"vitepress"`

### 特色页面开关配置

```typescript
	featurePages: {
		anime: true, // 番剧页面开关
		talking: true, // 说说/动态页面开关
		friends: true, // 友链页面开关
		projects: true, // 项目页面开关
		skills: true, // 技能页面开关
		timeline: true, // 时间线页面开关
		albums: true, // 相册页面开关
		devices: true, // 设备页面开关
		series: true, // 专栏/系列页面开关
		reposts: true, // 转载页面开关
		guestbook: true, // 留言板页面开关
		sponsor: true, // 赞助页面开关
	},
```
- `featurePages`：控制特色页面的启用状态（关闭后系统会返回404状态码）
  - `anime`：番剧页面
  - `talking`：说说/动态页面
  - `friends`：友链页面
  - `projects`：项目页面
  - `skills`：技能页面
  - `timeline`：时间线页面
  - `albums`：相册页面
  - `devices`：设备页面
  - `series`：专栏/系列页面
  - `reposts`：转载页面
  - `guestbook`：留言板页面
  - `sponsor`：赞助页面

### 顶栏标题配置

```typescript
	navbarTitle: {
		mode: "text-icon", // 显示模式："text-icon" 显示图标+文本，"logo" 仅显示Logo
		text: "TsukimiUI", // 顶栏标题文本
		icon: "assets/home/home.webp", // 顶栏标题图标路径
		logo: "assets/home/default-logo.webp", // 网站Logo图片路径
	},
```
- `navbarTitle`：控制顶栏标题的显示（可选）
  - `mode`：显示模式，`"text-icon"` 显示图标+文本，`"logo"` 仅显示Logo
  - `text`：顶栏标题文本
  - `icon`：顶栏标题图标路径，默认使用 `public/assets/home/home.webp`
  - `logo`：网站Logo图片路径

### 导航栏配置

```typescript
	navbar: {
		logo: {
			type: "icon", // 类型："icon"（图标库）, "image"（本地图片）, "url"（网络图片）
			value: "material-symbols:home", // icon名、本地图片路径或网络图片url
			alt: "Home", // 图片alt文本
		},
		title: "Tsukimi", // 导航栏标题，如果不设置则使用 siteConfig.title
		widthFull: false, // 导航栏是否占满屏幕宽度
		menuAlign: "left", // 导航菜单对齐方式（仅桌面端菜单）："left" 或 "center"
		followTheme: false, // 导航栏图标和标题是否跟随主题色
		stickyNavbar: true, // 导航栏是否固定在顶部始终可见
	},
```
- `navbar`：导航栏配置（可选）
  - `logo`：导航栏Logo图标（可选）
    - `type`：类型：`"icon"`（图标库）, `"image"`（本地图片）, `"url"`（网络图片）
    - `value`：icon名、本地图片路径或网络图片url
    - `alt`：图片alt文本
  - `title`：导航栏标题，如果不设置则使用 `siteConfig.title`
  - `widthFull`：导航栏是否占满屏幕宽度
  - `menuAlign`：导航菜单对齐方式（仅桌面端菜单）：`"left"` 或 `"center"`
  - `followTheme`：导航栏图标和标题是否跟随主题色
  - `stickyNavbar`：导航栏是否固定在顶部始终可见

### 页面自动缩放配置

```typescript
	pageScaling: {
		enable: true, // 是否启用自动缩放
		targetWidth: 2000, // 目标宽度，低于此宽度时开始缩放
	},
```
- `pageScaling`：页面自动缩放配置（可选）
  - `enable`：是否启用自动缩放
  - `targetWidth`：目标宽度，低于此宽度时开始缩放

## 首页布局配置

### 文章区域布局配置

```typescript
	postListLayout: {
		defaultMode: "list", // 默认布局模式："list" 或 "grid"
		mobileDefaultMode: "list", // 移动端默认布局模式（可选）
		showTags: true, // 是否在文章列表中显示标签（可选）
		descriptionLines: 2, // 文章简介显示行数，0 表示不截断（可选）
		allowSwitch: true, // 是否允许用户切换布局
		categoryBar: {
			enable: true, // 是否在文章列表页显示分类导航条
		},
		grid: {
			masonry: false, // 是否开启瀑布流布局
			columnWidth: 320, // 网格模式卡片最小宽度(px)（可选）
		},
	},
	tagStyle: {
		useNewStyle: false, // 是否使用新样式（悬停高亮样式）
	},
```
- `postListLayout`：控制首页布局的显示
  - `defaultMode`：默认布局模式，`"list"` 列表模式（单列布局）或 `"grid"` 网格模式（双列布局）
  - `mobileDefaultMode`：移动端默认布局模式，不设置则跟随 `defaultMode`（可选）
  - `showTags`：是否在文章列表中显示标签（可选）
  - `descriptionLines`：文章简介显示行数，0 表示不截断，默认 2（可选）
  - `allowSwitch`：是否允许用户切换布局
  - `categoryBar`：分类导航条配置
    - `enable`：是否在文章列表页显示分类导航条
  - `grid`：网格布局配置（可选，仅在 defaultMode 为 "grid" 或允许切换布局时生效）
    - `masonry`：是否开启瀑布流布局
    - `columnWidth`：网格模式卡片最小宽度(px)，默认 320
- `tagStyle`：标签样式配置（可选）
  - `useNewStyle`：是否使用新样式（悬停高亮样式）还是旧样式（外框常亮样式）

### 说说/动态页面配置

```typescript
	talkingApiUrl: "", // 说说/动态页面 Memos API 地址
	talkingShowComment: true, // 说说/动态页面是否显示评论区
```
- `talkingApiUrl`：说说/动态页面 Memos API 地址，用于客户端动态获取数据（可选）
- `talkingShowComment`：说说/动态页面是否显示评论区（可选）

## 横幅配置（siteConfig.banner）

横幅的**行为和文案**配置位于 `siteConfig.banner`，而**图片资源**配置位于 `backgroundWallpaperConfig`（见下节）。

```typescript
	banner: {
		carousel: {
			enable: true, // 是否启用轮播
			interval: 3, // 轮播间隔时间（秒）
			switchable: true, // 是否允许用户通过控制面板切换轮播
		},
		waves: {
			enable: true, // 是否启用水波纹效果
			switchable: true, // 是否允许用户通过控制面板切换水波纹
			performanceMode: false, // 性能模式：减少动画复杂度
			mobileDisable: false, // 移动端禁用
		},
		gradient: {
			enable: true, // 是否启用渐变遮罩
			switchable: true, // 是否允许用户通过控制面板切换渐变
			colors: [
				{ color: "var(--color-bg)", stop: 0.2 },
				{ color: "transparent", stop: 0.7 },
			], // 渐变遮罩颜色配置（从下往上）
		},
		bannerHomeText: {
			enable: true, // 是否在 banner 模式下显示自定义文字
			switchable: true, // 是否允许用户切换 banner 文案显示
			title: "我的小窝", // 主标题
			subtitle: ["...", "..."], // 副标题，支持单个字符串或字符串数组
			typewriter: {
				enable: true, // 是否启用打字机效果
				speed: 100, // 打字速度（毫秒）
				deleteSpeed: 50, // 删除速度（毫秒）
				pauseTime: 2000, // 完整显示后的暂停时间（毫秒）
			},
		},
		wallpaperHomeText: {
			enable: true, // 是否在壁纸模式下显示自定义文字
			switchable: true, // 是否允许用户切换壁纸文案显示
			title: "我的小窝", // 主标题
			subtitle: ["...", "..."], // 副标题，支持单个字符串或字符串数组
			typewriter: {
				enable: true, // 是否启用打字机效果
				speed: 100, // 打字速度（毫秒）
				deleteSpeed: 50, // 删除速度（毫秒）
				pauseTime: 2000, // 完整显示后的暂停时间（毫秒）
			},
		},
		credit: {
			enable: false, // 是否显示壁纸来源标识
			text: "Describe", // 来源文本
			url: "", // 来源链接（可选）
		},
		navbar: {
			transparentMode: "none", // 导航栏透明模式："none", "semi", "full", "semifull"
			enableBlur: true, // 是否开启毛玻璃模糊效果
			blur: 10, // 毛玻璃模糊度
		},
	},
```
- `carousel`：轮播配置
  - `enable`：是否启用轮播
  - `interval`：轮播间隔时间（秒）
  - `switchable`：是否允许用户通过控制面板切换轮播（可选）
- `waves`：水波纹效果配置
  - `enable`：是否启用水波纹效果
  - `switchable`：是否允许用户通过控制面板切换水波纹（可选）
  - `performanceMode`：性能模式：减少动画复杂度
  - `mobileDisable`：移动端禁用
- `gradient`：渐变遮罩配置
  - `enable`：是否启用渐变遮罩
  - `switchable`：是否允许用户通过控制面板切换渐变（可选）
  - `colors`：渐变遮罩颜色配置（从下往上），每项包含 `color`（CSS 颜色值）和 `stop`（0-1 的位置值）
- `bannerHomeText`：Banner 模式首页文字配置
  - `enable`：是否在 banner 模式下显示自定义文字
  - `switchable`：是否允许用户切换 banner 文案显示（可选）
  - `title`：主标题
  - `subtitle`：副标题，支持单个字符串或字符串数组
  - `typewriter`：打字机效果配置
    - `enable`：是否启用打字机效果
    - `speed`：打字速度（毫秒）
    - `deleteSpeed`：删除速度（毫秒）
    - `pauseTime`：完整显示后的暂停时间（毫秒）
- `wallpaperHomeText`：壁纸模式首页文字配置（可选，未设置时 fallback 到 `bannerHomeText`）
  - `enable`：是否在壁纸模式下显示自定义文字
  - `switchable`：是否允许用户切换壁纸文案显示（可选）
  - `title`：主标题
  - `subtitle`：副标题，支持单个字符串或字符串数组
  - `typewriter`：打字机效果配置（同 `bannerHomeText.typewriter`）
- `credit`：壁纸来源标识配置
  - `enable`：是否显示壁纸来源标识
  - `text`：来源文本
  - `url`：来源链接
- `navbar`：横幅区域导航栏配置
  - `transparentMode`：导航栏透明模式：`"none"` 不透明, `"semi"`, `"full"`, `"semifull"`
  - `enableBlur`：是否开启毛玻璃模糊效果（可选）
  - `blur`：毛玻璃模糊度（可选）

## 背景壁纸配置（backgroundWallpaperConfig）

背景壁纸配置位于 `src/config/backgroundWallpaper.ts` 中的 `backgroundWallpaperConfig` 对象，控制壁纸模式、图片资源和各模式的详细设置。

### 壁纸模式控制

```typescript title="src/config/backgroundWallpaper.ts"
	mode: {
		defaultMode: "banner", // 默认壁纸模式："banner", "fullscreen", "overlay", "none"
		switchable: true, // 是否允许用户通过导航栏切换壁纸模式
		showModeSwitch: {
			enable: true, // 是否显示切换按钮
			visibility: "desktop", // 显示范围："off", "mobile", "desktop", "both"
		},
	},
```
- `mode`：壁纸模式控制
  - `defaultMode`：默认壁纸模式，`"banner"` 顶部横幅，`"fullscreen"` 全屏壁纸，`"overlay"` 叠加层壁纸，`"none"` 无壁纸
  - `switchable`：是否允许用户通过导航栏切换壁纸模式（可选，默认 true）
  - `showModeSwitch`：切换按钮显示配置
    - `enable`：是否显示切换按钮
    - `visibility`：显示范围，`"off"` 不显示，`"mobile"` 仅移动端，`"desktop"` 仅桌面端，`"both"` 全部显示

### Banner 模式图片资源

```typescript
	banner: {
		src: {
			desktop: ["/assets/desktop-banner/1.webp", ...],
			mobile: ["/assets/mobile-banner/1.webp", ...],
		}, // 支持单个图片、图片数组或分别设置桌面端和移动端图片
		position: "center top", // 图片定位，支持 CSS object-position 值
		imageApi: {
			enable: false, // 是否启用图片API
			url: "", // API地址，返回每行一个图片链接的文本
		},
	},
```
- `banner`：Banner 模式图片资源配置
  - `src`：支持单个图片（字符串）、图片数组（字符串数组）或分别设置桌面端和移动端图片（`{ desktop, mobile }` 对象）
  - `position`：图片定位，支持 CSS `object-position` 值，如 `"center"`, `"top"`, `"center top"`
  - `imageApi`：图片 API 配置
    - `enable`：是否启用图片 API
    - `url`：API 地址，返回每行一个图片链接的文本

### 全屏壁纸模式配置

```typescript
	fullscreen: {
		src: {
			desktop: ["/assets/desktop-banner/1.webp", ...],
			mobile: ["/assets/mobile-banner/1.webp", ...],
		},
		position: "center top", // 壁纸位置
		imageApi: {
			enable: false,
			url: "",
		},
		carousel: {
			enable: true, // 是否启用轮播
			interval: 5, // 轮播间隔时间（秒）
		},
		zIndex: -1, // 层级
		opacity: 0.8, // 壁纸透明度，0-1
		blur: 1, // 背景模糊度，单位 px
		gradient: {
			enable: true, // 是否启用渐变过渡
			colors: [
				{ color: "var(--color-bg)", stop: 0.3 },
				{ color: "transparent", stop: 0.8 },
			],
		},
		navbar: {
			transparentMode: "semifull", // 导航栏透明模式
			enableBlur: true, // 是否开启毛玻璃模糊效果
			blur: 10, // 毛玻璃模糊度
		},
	},
```
- `fullscreen`：全屏壁纸模式配置（可选）
  - `src`：图片资源（同 `banner.src` 格式）
  - `position`：壁纸位置，支持 CSS `object-position` 值
  - `imageApi`：图片 API 配置（同 `banner.imageApi`）
  - `carousel`：轮播配置
    - `enable`：是否启用轮播
    - `interval`：轮播间隔时间（秒）
  - `zIndex`：层级（可选）
  - `opacity`：壁纸透明度，0-1 之间（可选）
  - `blur`：背景模糊度，单位 px（可选）
  - `gradient`：渐变过渡配置
    - `enable`：是否启用渐变过渡
    - `colors`：渐变遮罩颜色配置（同 `siteConfig.banner.gradient.colors` 格式）
  - `navbar`：全屏模式导航栏配置（覆盖 `common.navbar`）
    - `transparentMode`：导航栏透明模式：`"semi"`, `"full"`, `"semifull"`
    - `enableBlur`：是否开启毛玻璃模糊效果
    - `blur`：毛玻璃模糊度

### 叠加层壁纸模式配置

```typescript
	overlay: {
		src: "/assets/desktop-banner/1.webp", // 单张图片路径
		position: "bottom-right", // 壁纸位置："top-left", "top-right", "bottom-left", "bottom-right"
		size: {
			width: 300, // 宽度(px)
			height: 400, // 高度(px)
		},
		opacity: 0.9, // 壁纸透明度，0-1
		blur: 0, // 背景模糊度，单位 px
		cardOpacity: 0.9, // 卡片背景透明度，0-1
		borderRadius: "1rem", // 圆角
		margin: "1rem", // 外边距
		zIndex: 0, // 层级
		shadow: true, // 是否显示阴影
		switchable: {
			opacity: true, // 是否允许用户调整壁纸透明度
			blur: true, // 是否允许用户调整背景模糊度
			cardOpacity: true, // 是否允许用户调整卡片透明度
		},
	},
```
- `overlay`：叠加层壁纸模式配置（可选，小图角落显示）
  - `src`：图片路径（支持单个字符串、数组或 `{ desktop, mobile }` 对象）
  - `position`：壁纸位置：`"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`
  - `size`：壁纸尺寸
    - `width`：宽度(px)
    - `height`：高度(px)
  - `opacity`：壁纸透明度，0-1 之间
  - `blur`：背景模糊度，单位 px
  - `cardOpacity`：卡片背景透明度，0-1 之间
  - `borderRadius`：圆角
  - `margin`：外边距
  - `zIndex`：层级
  - `shadow`：是否显示阴影
  - `switchable`：用户可调整的选项（支持 `boolean` 或对象形式）
    - `opacity`：是否允许用户调整壁纸透明度
    - `blur`：是否允许用户调整背景模糊度
    - `cardOpacity`：是否允许用户调整卡片透明度

### 通用导航栏配置

```typescript
	common: {
		navbar: {
			transparentMode: "none", // 导航栏透明模式，默认不透明
			enableBlur: true, // 是否开启毛玻璃模糊效果
			blur: 10, // 毛玻璃模糊度
		},
	},
```
- `common`：通用配置，各壁纸模式可覆盖
  - `navbar`：默认导航栏配置（各模式可单独覆盖）
    - `transparentMode`：导航栏透明模式：`"none"`, `"semi"`, `"full"`, `"semifull"`
    - `enableBlur`：是否开启毛玻璃模糊效果
    - `blur`：毛玻璃模糊度

## 文章详情页配置

```typescript
	toc: {
		enable: true, // 总开关
		mobileTop: true, // 手机端顶部 TOC 按钮
		desktopSidebar: true, // 电脑端右侧边栏 TOC
		floating: false, // 悬浮 TOC 按钮
		depth: 2, // TOC 深度：1, 2, 或 3
		useJapaneseBadge: false, // 使用日语假名标记代替数字
	},
	showCoverInContent: true, // 是否在文章内容页显示封面
	showLastModified: true, // 是否显示"上次编辑"信息
	outdatedThreshold: 365, // 文章过期阈值（天数）（可选）
	sharePoster: true, // 是否显示分享海报按钮
```
- `toc`：文章目录配置
  - `enable`：总开关，false 时所有 TOC 都不显示
  - `mobileTop`：手机端顶部 TOC 按钮
  - `desktopSidebar`：电脑端右侧边栏 TOC
  - `floating`：悬浮 TOC 按钮
  - `depth`：TOC 深度：1, 2, 或 3（1 表示只显示 h1，2 表示 h1 和 h2，3 表示 h1-h3）
  - `useJapaneseBadge`：使用日语假名标记（あいうえお...）代替数字
- `showCoverInContent`：控制文章封面在文章内容页显示的开关
- `showLastModified`：控制"上次编辑"卡片显示的开关
- `outdatedThreshold`：文章过期阈值（天数），超过此天数才显示"上次编辑"卡片（可选）
- `sharePoster`：是否显示分享海报按钮（可选）

### 页面顶部进度条配置

```typescript
	pageProgressBar: {
		enable: true, // 是否启用页面顶部进度条
		height: 3, // 进度条高度，默认 3px
		duration: 6000, // 动画时长，默认 8000ms
	},
```
- `pageProgressBar`：页面顶部进度条配置（可选）
  - `enable`：是否启用页面顶部进度条
  - `height`：进度条高度，默认 3px
  - `duration`：动画时长，默认 8000ms

### 第三方统计配置

```typescript
	thirdPartyAnalytics: {
		enable: false, // 是否启用第三方统计（Microsoft Clarity）
		clarityId: "", // Clarity 项目 ID
	},
```
- `thirdPartyAnalytics`：第三方统计配置（可选，可能影响 Lighthouse 评分）
  - `enable`：是否启用第三方统计（Microsoft Clarity）
  - `clarityId`：Microsoft Clarity 项目 ID

### 分析统计配置

```typescript
	analytics: {
		googleAnalyticsId: "", // Google Analytics ID
		umamiAnalytics: {
			websiteId: "", // Umami Website ID
			scriptUrl: "", // Umami JS地址
			trackOutboundLinks: true, // 是否追踪出站链接点击事件
			collectWebVitals: false, // 是否收集核心网页指标
			relpays: {
				enabled: false, // 是否启用会话回放
				sampleRate: 0.15, // 录制会话采样率
				maskLevel: "moderate", // 隐私遮罩级别
				maxDuration: 300000, // 单次录制最大时长（毫秒）
				blockSelector: "", // 需要排除录制的元素 CSS 选择器
			},
		},
		la51Analytics: {
			Id: "", // 51la 统计 ID
			sdkUrl: "", // 自定义 SDK 地址
			ck: "", // 数据分离标识
			autoTrack: true, // 开启事件分析功能
			hashMode: false, // Hash路由模式
			screenRecord: true, // 开启网站录屏功能
		},
	},
```
- `analytics`：统计分析配置（可选）
  - `googleAnalyticsId`：Google Analytics ID
  - `umamiAnalytics`：Umami 分析配置
    - `websiteId`：Umami Website ID
    - `scriptUrl`：Umami JS地址，支持使用自建
    - `trackOutboundLinks`：是否追踪出站链接点击事件，默认 true
    - `collectWebVitals`：是否自动收集访客浏览器核心网页指标，默认 false
    - `relpays`：会话回放配置
      - `enabled`：是否启用会话回放，默认 false
      - `sampleRate`：录制会话采样率，范围 0-1，默认 0.15
      - `maskLevel`：隐私遮罩级别：`"moderate"` 或 `"strict"`，默认 moderate
      - `maxDuration`：单次录制最大时长（毫秒），默认 300000
      - `blockSelector`：需要完全排除录制的元素 CSS 选择器
  - `la51Analytics`：51.la 统计配置
    - `Id`：51.la 统计 ID
    - `sdkUrl`：自定义 SDK 地址，防止 DNS 污染
    - `ck`：多个统计 ID 的数据分离标识，默认与 id 相同
    - `autoTrack`：开启事件分析功能，默认 true
    - `hashMode`：Hash路由模式，默认 false
    - `screenRecord`：开启网站录屏功能，默认 true

### 分页配置

```typescript
	pagination: {
		postsPerPage: 10, // 每页显示的文章数量
	},
```
- `pagination`：分页配置（可选）
  - `postsPerPage`：每页显示的文章数量

### 图片优化配置

```typescript
	imageOptimization: {
		formats: "webp", // 输出图片格式："avif", "webp", 或 "both"
		quality: 80, // 图片压缩质量 (1-100)
		noReferrerDomains: ["i0.hdslb.com", "*.bilibili.com"], // 特定域名添加 no-referrer
	},
```
- `imageOptimization`：图片优化配置（可选）
  - `formats`：输出图片格式：`"avif"`, `"webp"`, 或 `"both"`
  - `quality`：图片压缩质量 (1-100)，推荐 70-85
  - `noReferrerDomains`：为特定域名的图片添加 `referrerpolicy="no-referrer"` 属性，支持通配符

### Favicon 配置

```typescript
	favicon: [], // 留空以使用默认 favicon
```
- `favicon`：网站图标配置，支持多个图标，根据主题自动切换
  - `src`：图标文件路径
  - `theme`：指定主题 `"light"` | `"dark"`（可选）
  - `sizes`：图标大小（可选）

### Open Graph 图片生成

```typescript
	generateOgImages: false, // 是否自动生成 Open Graph 图片
```
- `generateOgImages`：是否自动生成 Open Graph 图片（注意开启后要渲染很长时间，不建议本地调试时开启）

## 番剧页面配置

```typescript
	bangumi: {
		userId: "your-bangumi-id", // Bangumi 用户 ID
		fetchOnDev: false, // 是否在开发环境下获取 Bangumi 数据
		categoryOrder: ["anime", "game", "book", "music", "real"], // 条目类型排序顺序
	},
	bilibili: {
		vmid: "your-bilibili-vmid", // Bilibili 用户 ID
		fetchOnDev: false, // 是否在开发环境下获取 Bilibili 数据
		coverMirror: "", // 封面图片镜像源（可选）
		useWebp: true, // 是否使用 WebP 格式
	},
	anime: {
		mode: "local", // 番剧页面模式："bangumi", "local", "bilibili"
	},
```
- `bangumi`：Bangumi 配置（可选）
  - `userId`：Bangumi 用户 ID
  - `fetchOnDev`：是否在开发环境下获取 Bangumi 数据
  - `categoryOrder`：条目类型排序顺序
- `bilibili`：Bilibili 配置（可选）
  - `vmid`：Bilibili 用户 ID (vmid)
  - `fetchOnDev`：是否在开发环境下获取 Bilibili 数据
  - `coverMirror`：封面图片镜像源（可选）
  - `useWebp`：是否使用 WebP 格式（默认 true）
- `anime`：番剧页面模式（可选）
  - `mode`：番剧页面模式：`"bangumi"`, `"local"`, `"bilibili"`

## 更多配置

其他重要的配置模块（在 `src/config/` 中单独导出）包括：

- **navBarConfig**：导航栏菜单配置，支持多级菜单和下拉分组
- **profileConfig**：侧边栏个人信息配置
- **sidebarLayoutConfig**：侧边栏布局和组件配置
- **commentConfig**：评论系统配置（支持 Twikoo、Waline、Giscus、Disqus、Artalk）
- **musicPlayerConfig**：音乐播放器配置
- **announcementConfig**：公告栏配置
- **sakuraConfig**：樱花特效配置（已废弃，请使用 `effectsConfig.sakura`）
- **effectsConfig**：特效统一配置（包含樱花等）
- **fontConfig**：字体配置
- **sponsorConfig**：赞助页面配置
- **footerConfig**：页脚配置
- **expressiveCodeConfig**：代码块配置
- **licenseConfig**：许可证配置
- **permalinkConfig**：固定链接配置
- **backgroundWallpaperConfig**：背景壁纸完整配置（含模式控制、图片资源、全屏/叠加层配置）
- **pioConfig**：看板娘配置
- **shareConfig**：分享功能配置
- **relatedPostsConfig**：相关文章配置
- **randomPostsConfig**：随机文章配置

详细的配置说明请参考对应功能的文档页面。