import type {
	DARK_MODE,
	LIGHT_MODE,
	SYSTEM_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	siteURL?: string; // 站点URL，以斜杠结尾，例如：https://tsukimi.souloss.cn/
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
		defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
	};

	// 页面整体宽度（单位：rem）
	pageWidth?: number;

	// 卡片样式配置
	card?: {
		// 是否开启卡片边框和阴影立体效果
		border: boolean;
		// 是否让卡片风格跟随主题色相
		followTheme?: boolean;
	};

	// 站点开始日期，用于计算运行天数
	siteStartDate?: string; // 格式：YYYY-MM-DD

	// 可选：站点时区，使用 IANA 时区标识，例如 "Asia/Shanghai"、"UTC"
	timezone?: string;

	// 提醒框配置
	rehypeCallouts?: {
		theme: "github" | "obsidian" | "vitepress";
	};

	// 顶栏标题配置
	navbarTitle?: {
		mode?: "text-icon" | "logo"; // 显示模式，使用常量 NAVBAR_TITLE_TEXT_ICON / NAVBAR_TITLE_LOGO
		text: string; // 顶栏标题文本
		icon?: string; // 顶栏标题图标路径
		logo?: string; // 网站Logo图片路径
	};

	// 页面自动缩放配置
	pageScaling?: {
		enable: boolean; // 是否开启自动缩放
		targetWidth?: number; // 目标宽度，低于此宽度时开始缩放
	};

	// bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用户ID
		fetchOnDev?: boolean;
		categoryOrder?: ("anime" | "game" | "book" | "music" | "real")[]; // 条目类型排序顺序
	};

	// bilibili配置
	bilibili?: {
		vmid?: string; // Bilibili用户ID (vmid)
		fetchOnDev?: boolean; // 是否在开发环境下获取 Bilibili 数据
		coverMirror?: string; // 封面图片镜像源（可选，默认为空字符串）
		useWebp?: boolean; // 是否使用WebP格式（默认 true）
	};

	// 番剧页面配置
	anime?: {
		mode?: "bangumi" | "local" | "bilibili"; // 番剧页面模式，使用常量 ANIME_MODE_BANGUMI / ANIME_MODE_LOCAL / ANIME_MODE_BILIBILI
	};

	// 说说/动态页面 Memos API 地址，客户端 fetch 获取动态数据
	talkingApiUrl?: string;
	// 说说/动态页面是否显示评论区
	talkingShowComment?: boolean;

	// 标签样式配置
	tagStyle?: {
		useNewStyle?: boolean; // 是否使用新样式（悬停高亮样式）还是旧样式（外框常亮样式）
	};

	generateOgImages: boolean;
	favicon: Favicon[];

	navbar?: {
		/** 导航栏Logo图标，可选类型：icon库、本地图片、网络图片链接 */
		logo?: {
			type: "icon" | "image" | "url";
			value: string; // icon名、本地图片路径或网络图片url
			alt?: string; // 图片alt文本
		};
		title?: string; // 导航栏标题，如果不设置则使用 title
		widthFull?: boolean; // 导航栏是否占满屏幕宽度
		menuAlign?: "left" | "center"; // 导航菜单对齐方式（仅桌面端菜单）
		followTheme?: boolean; // 导航栏图标和标题是否跟随主题色
		stickyNavbar?: boolean; // 导航栏是否固定在顶部始终可见
	};

	showLastModified: boolean; // 控制"上次编辑"卡片显示的开关
	outdatedThreshold?: number; // 文章过期阈值（天数），超过此天数才显示"上次编辑"卡片
	sharePoster?: boolean; // 是否显示分享海报按钮

	// 特色页面开关配置
	featurePages: {
		anime: boolean; // 番剧页面开关
		talking: boolean; // 说说/动态页面开关
		friends: boolean; // 友链页面开关
		projects: boolean; // 项目页面开关
		skills: boolean; // 技能页面开关
		timeline: boolean; // 时间线页面开关
		albums: boolean; // 相册页面开关
		devices: boolean; // 设备页面开关
		series: boolean; // 专栏/系列页面开关
		reposts: boolean; // 转载页面开关
		guestbook: boolean; // 留言板页面开关
		sponsor: boolean; // 赞助页面开关
	};

	// 分类导航栏开关
	categoryBar?: boolean;

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式，使用常量 POST_LAYOUT_LIST / POST_LAYOUT_GRID
		mobileDefaultMode?: "list" | "grid"; // 移动端默认布局模式，使用常量 POST_LAYOUT_LIST / POST_LAYOUT_GRID
		showTags?: boolean; // 是否在文章列表中显示标签
		descriptionLines?: number; // 文章简介显示行数，0 表示不截断，默认 2
		allowSwitch: boolean; // 是否允许用户切换布局
		categoryBar?: {
			enable: boolean; // 是否在文章列表页显示分类导航条
		};
		grid?: {
			// 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
			// 是否开启瀑布流布局
			masonry: boolean;
			// 网格模式卡片最小宽度(px)，浏览器根据容器宽度自动计算列数，默认 320
			columnWidth?: number;
		};
	};

	// 横幅行为/文案配置（图片资源归 backgroundWallpaperConfig.banner）
	banner: {
		carousel?: {
			enable: boolean; // 是否启用轮播
			interval: number; // 轮播间隔时间（秒）
			switchable?: boolean; // 是否允许用户通过控制面板切换轮播
		};
		waves?: {
			enable: boolean; // 是否启用水波纹效果
			switchable?: boolean; // 是否允许用户通过控制面板切换水波纹
			performanceMode?: boolean; // 性能模式：减少动画复杂度
			mobileDisable?: boolean; // 移动端禁用
		};
		gradient?: {
			enable: boolean; // 是否启用渐变遮罩
			switchable?: boolean; // 是否允许用户通过控制面板切换渐变
			colors?: Array<{ color: string; stop: number }>; // 渐变遮罩颜色配置（从下往上）
		};
		// Banner 模式文案
		bannerHomeText?: {
			enable: boolean; // 是否在 banner 模式下显示自定义文字
			switchable?: boolean; // 是否允许用户切换 banner 文案显示
			title?: string; // 主标题
			subtitle?: string | string[]; // 副标题
			typewriter?: {
				enable: boolean;
				speed: number;
				deleteSpeed: number;
				pauseTime: number;
			};
		};
		// 壁纸模式文案（可选，fallback 到 bannerHomeText）
		wallpaperHomeText?: {
			enable: boolean; // 是否在壁纸模式下显示自定义文字
			switchable?: boolean;
			title?: string;
			subtitle?: string | string[];
			typewriter?: {
				enable: boolean;
				speed: number;
				deleteSpeed: number;
				pauseTime: number;
			};
		};
		credit?: {
			enable: boolean;
			text: string;
			url?: string;
		};
		navbar?: {
			transparentMode?: "none" | "semi" | "full" | "semifull"; // 导航栏透明模式，"none"=不透明
			enableBlur?: boolean; // 是否开启毛玻璃模糊效果
			blur?: number; // 毛玻璃模糊度
		};
	};

	toc: {
		enable: boolean; // 总开关，false 时所有 TOC 都不显示
		mobileTop: boolean; // 手机端顶部 TOC 按钮
		desktopSidebar: boolean; // 电脑端右侧边栏 TOC
		floating: boolean; // 悬浮 TOC 按钮
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // 使用日语假名标记（あいうえお...）代替数字
	};
	showCoverInContent: boolean; // 控制文章封面在文章内容页显示的开关
	pageProgressBar?: PageProgressBarConfig; // 页面顶部进度条配置
	thirdPartyAnalytics?: ThirdPartyAnalyticsConfig; // 第三方统计配置

	// 分页配置
	pagination?: {
		postsPerPage: number; // 每页显示的文章数量
	};

	// 统计分析
	analytics?: {
		googleAnalyticsId?: string; // Google Analytics ID
		microsoftClarityId?: string; // Microsoft Clarity ID
		umamiAnalytics?: {
			websiteId?: string; // Umami Website ID
			scriptUrl?: string; // Umami JS地址，支持使用自建
			trackOutboundLinks?: boolean; // 是否追踪出站链接点击事件，默认 true
			collectWebVitals?: boolean; // 是否自动收集访客浏览器核心网页指标，默认 false
			relpays?: {
				enabled?: boolean; // 是否启用会话回放，默认 false
				sampleRate?: number; // 录制会话采样率，范围 0-1，默认 0.15
				maskLevel?: "moderate" | "strict"; // 隐私遮罩级别，默认 moderate
				maxDuration?: number; // 单次录制最大时长（毫秒），默认 300000
				blockSelector?: string; // 需要完全排除录制的元素 CSS 选择器
			};
		};
		la51Analytics?: {
			Id?: string; // 51la 统计 ID
			sdkUrl?: string; // 自定义 SDK 地址，防止 DNS 污染，默认为 "//sdk.51.la/js-sdk-pro.min.js"
			ck?: string; // 多个统计 ID 的数据分离标识，默认与 id 相同
			autoTrack?: boolean; // 开启事件分析功能，默认 true
			hashMode?: boolean; // Hash路由模式，项目使用History API路由，所以不必开启，默认 false
			screenRecord?: boolean; // 开启网站录屏功能，默认 true
		};
	};

	// 图片优化配置
	imageOptimization?: {
		/**
		 * 输出图片格式
		 * - "avif" 仅输出 AVIF 格式（最新技术，最小体积，目前兼容性较低）
		 * - "webp" 仅输出 WebP 格式（体积适中，兼容性好）
		 * - "both" 同时输出 AVIF 和 WebP（推荐，浏览器自动选择最佳格式）
		 */
		formats?: "avif" | "webp" | "both";
		/**
		 * 图片压缩质量 (1-100)
		 * 值越低体积越小但质量越差，推荐 70-85
		 */
		quality?: number;
		/**
		 * 为特定域名的图片添加 referrerpolicy="no-referrer" 属性
		 * 开启后可解决指定域名图片加载时的 403 问题（如防盗链图片）
		 * 示例：["i0.hdslb.com", "*.bilibili.com"] 支持通配符 *
		 * 仅影响匹配域名的图片标签，不影响其他链接的 referrer 行为
		 */
		noReferrerDomains?: string[];
	};
};

export interface Favicon {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
}

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Sponsor = 4,
	Guestbook = 5,
	Anime = 6,
	Talking = 7,
	Albums = 8,
	Projects = 9,
	Skills = 10,
	Timeline = 11,
}

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
}

export enum NavBarSearchMethod {
	PageFind = 0,
}

export interface NavBarSearchConfig {
	method: NavBarSearchMethod;
}

export interface NavBarConfig {
	links: (NavBarLink | LinkPreset)[];
	search?: NavBarSearchConfig;
}

export interface ProfileConfig {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
		showName?: boolean;
	}[];
	typewriter?: {
		enable: boolean; // 是否启用打字机效果
		speed?: number; // 打字速度（毫秒）
		deleteSpeed?: number; // 删除速度（毫秒）
		pauseTime?: number; // 完整显示后的暂停时间（毫秒）
	};
}

export interface LicenseConfig {
	enable: boolean;
	name: string;
	url: string;
}

// Permalink 配置
export interface PermalinkConfig {
	enable: boolean; // 是否启用全局 permalink 功能
	/**
	 * permalink 格式模板
	 * 支持的占位符：
	 * - %year% : 4位年份 (2024)
	 * - %monthnum% : 2位月份 (01-12)
	 * - %day% : 2位日期 (01-31)
	 * - %hour% : 2位小时 (00-23)
	 * - %minute% : 2位分钟 (00-59)
	 * - %second% : 2位秒数 (00-59)
	 * - %post_id% : 文章序号（按发布时间升序排列）
	 * - %postname% : 文章文件名（slug）
	 * - %raw_postname% : 文章原始文件名（保留大小写）
	 * - %category% : 分类名（无分类时为 "uncategorized"）
	 *
	 * 示例：
	 * - "%year%-%monthnum%-%postname%" => "/2024-12-my-post/"
	 * - "%post_id%-%postname%" => "/42-my-post/"
	 * - "%category%-%postname%" => "/tech-my-post/"
	 * - "%year%/%monthnum%/%day%/%postname%" => "/2024/12/01/my-post/"
	 *
	 * 注意：支持使用斜杠 "/" 构建嵌套路径
	 */
	format: string;
}

// 评论配置
export interface CommentConfig {
	/**
	 * 是否启用评论功能
	 */
	enable?: boolean;
	/**
	 * 当前启用的评论系统类型
	 * "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"
	 */
	system?: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk"; // 评论系统，使用常量 COMMENT_NONE / COMMENT_TWIKOO / COMMENT_WALINE / COMMENT_GISCUS / COMMENT_DISQUS / COMMENT_ARTALK
	twikoo?: {
		envId: string;
		region?: string;
		visitorCount?: boolean;
	};
	waline?: {
		enabled?: boolean;
		serverURL: string;
		emoji?: string[];
		lang?: string;
		pageview?: boolean;
		reaction?: boolean;
		login?: "enable" | "force" | "disable"; // 登录模式，使用常量 WALINE_LOGIN_ENABLE / WALINE_LOGIN_FORCE / WALINE_LOGIN_DISABLE
		visitorCount?: boolean; // 是否统计访问量，true 启用访问量，false 关闭
		wordLimit?: number[];
		imageUploader?: boolean;
		requiredMeta?: string[];
		copyright?: boolean;
		recaptchaV3Key?: string;
		turnstileKey?: string;
	};
	artalk?: {
		// 后端程序 API 地址
		server: string;
		/**
		 * 语言，支持语言如下：
		 * - "en" (English)
		 * - "zh-CN" (简体中文)
		 * - "zh-TW" (繁体中文)
		 * - "ja" (日本語)
		 * - "ko" (한국어)
		 * - "fr" (Français)
		 */
		locale: string | "auto";
		// 是否统计访问量，true 启用访问量，false 关闭
		visitorCount?: boolean;
	};
	giscus?: {
		repo: string;
		repoId: string;
		category: string;
		categoryId: string;
		mapping: string;
		strict: string;
		reactionsEnabled: string;
		emitMetadata: string;
		inputPosition: string;
		theme: string;
		lang: string;
		loading: string;
	};
	disqus?: {
		shortname: string;
	};
}

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof SYSTEM_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export interface BlogPostData {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
}

export interface ExpressiveCodeConfig {
	/** 暗色主题名称（用于暗色模式） */
	darkTheme: string;
	/** 亮色主题名称（用于亮色模式） */
	lightTheme: string;
	hideDuringThemeTransition?: boolean; // 是否在主题切换时隐藏代码块
	/** 代码块折叠插件配置 */
	pluginCollapsible?: PluginCollapsibleConfig;
	/** 语言徽章插件配置 */
	pluginLanguageBadge?: PluginLanguageBadgeConfig;
}

export interface PluginLanguageBadgeConfig {
	enable: boolean; // 是否启用语言徽章
}

export interface PluginCollapsibleConfig {
	enable: boolean; // 是否启用代码块折叠功能
	lineThreshold: number; // 触发折叠的行数阈值
	previewLines: number; // 折叠时显示的预览行数
	defaultCollapsed: boolean; // 默认是否折叠
}

/**
 * PlantUML 图表渲染配置
 *
 * 控制 markdown 文章中 ` ```plantuml ` 代码块到 PlantUML 服务器 SVG 图片的
 * 构建时编码与客户端渲染行为。
 */
export interface PlantUMLConfig {
	/** 是否启用 PlantUML 渲染能力；关闭时 plantuml 代码块退化为普通代码高亮 */
	enable: boolean;
	/** PlantUML 服务器地址，尾部斜杠会自动归一化；默认使用官方公共服务器 */
	server: string;
	/** 亮色模式下注入的 PlantUML 主题名；空字符串表示不注入 */
	lightTheme: string;
	/** 暗色模式下注入的 PlantUML 主题名；空字符串表示不注入 */
	darkTheme: string;
}

/**
 * Markmap 思维导图渲染配置
 *
 * 控制 markdown 文章中 ` ```markmap ` 代码块到 Markmap 交互式 SVG 的
 * 构建时处理与客户端渲染行为。
 */
export interface MarkmapConfig {
	/** 是否启用 Markmap 渲染能力；关闭时 markmap 代码块退化为普通代码高亮 */
	enable: boolean;
	/** 是否启用自动折叠功能 */
	autoCollapse?: boolean;
	/** 初始折叠级别，0 表示全部展开 */
	initialCollapseLevel?: number;
	/** 是否启用缩放功能 */
	zoomable?: boolean;
	/** 是否启用拖拽平移功能 */
	pannable?: boolean;
}

export interface AnnouncementConfig {
	// enable属性已移除，现在通过sidebarLayoutConfig统一控制
	title?: string; // 公告栏标题
	content: string; // 公告栏内容
	icon?: string; // 公告栏图标
	type?: "info" | "warning" | "success" | "error"; // 公告类型
	closable?: boolean; // 是否可关闭
	link?: {
		enable: boolean; // 是否启用链接
		text: string; // 链接文字
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
}

// 单个字体配置
export interface FontItem {
	id: string; // 字体唯一标识符
	name: string; // 字体显示名称
	i18nKey?: string; // 国际化翻译键
	src?: string; // 字体文件路径或URL链接
	family?: string; // CSS font-family 名称
	fontFamily?: string; // CSS font-family 名称（别名）
	cjkFontFamily?: string; // CJK 回退字体 font-family（用于 ASCII/CJK 分字体方案）
	weight?: string | number; // 字体粗细，如 "normal", "bold", 400, 700 等
	fontWeight?: string | number; // 字体粗细（别名）
	style?: "normal" | "italic" | "oblique"; // 字体样式
	display?: "auto" | "block" | "swap" | "fallback" | "optional"; // font-display 属性
	unicodeRange?: string; // Unicode 范围，用于字体子集化
	format?:
		| "woff"
		| "woff2"
		| "truetype"
		| "opentype"
		| "embedded-opentype"
		| "svg"; // 字体格式，仅当 src 为本地文件时需要
	googleFonts?: string; // Google Fonts 引入URL
	cdnUrl?: string; // 外部 CDN 字体样式表 URL
	localFonts?:
		| Array<{
				family: string; // 字体族名
				src: string; // 字体文件路径
				weight?: number; // 字体粗细
				style?: "normal" | "italic" | "oblique"; // 字体样式
		  }>
		| string[]; // 本地字体配置，支持对象数组或文件名数组
	enableCompress?: boolean; // 是否启用字体子集优化
}

// 字体配置
export interface FontConfig {
	enable?: boolean; // 是否启用自定义字体功能
	switchable?: boolean; // 是否允许用户切换字体
	defaultFont?: string; // 默认字体选项ID
	selected?: string | string[]; // 当前选择的字体ID，支持单个或多个字体组合
	fonts?: FontItem[] | Record<string, FontItem>; // 字体选项列表，支持数组或以ID为键的对象
	fallback?: string[]; // 全局字体回退列表
	preload?: boolean; // 是否预加载字体文件以提高性能
}

export interface FooterConfig {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
}

export interface CoverImageConfig {
	enableInPost: boolean; // 是否在文章详情页显示封面图
	randomCoverImage: {
		enable: boolean; // 是否启用随机图功能
		apis: string[]; // 随机图API列表
		fallback?: string; // API失败时的回退图片路径（相对于src目录或以/开头的public目录路径）
		showLoading?: boolean; // 是否显示加载动画
	};
}

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "card-toc" // 卡片式目录组件
	| "music-player"
	| "music-sidebar"
	| "pio" // 添加 pio 组件类型
	| "site-stats" // 站点统计组件
	| "calendar" // 日历组件
	| "advertisement" // 广告组件
	| "custom";

export interface WidgetComponentConfig {
	type: WidgetComponentType; // 组件类型
	enable?: boolean; // 是否启用该组件
	position: "top" | "sticky"; // 组件位置：顶部固定区域或粘性区域
	class?: string; // 自定义CSS类名
	style?: string; // 自定义内联样式
	animationDelay?: number; // 动画延迟时间（毫秒）
	configId?: string; // 配置ID，用于广告组件指定使用哪个配置
	showOnPostPage?: boolean; // 是否在文章详情页显示
	showOnNonPostPage?: boolean; // 是否在非文章详情页显示
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
}

export interface MobileBottomComponentConfig {
	type: WidgetComponentType; // 组件类型
	enable?: boolean; // 是否启用该组件
	configId?: string; // 配置ID，用于广告组件指定使用哪个配置
	showOnPostPage?: boolean; // 是否在文章详情页显示
	showOnNonPostPage?: boolean; // 是否在非文章详情页显示
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
}

export interface SidebarLayoutConfig {
	enable?: boolean; // 是否启用侧边栏
	position?: "left" | "right" | "both"; // 侧边栏位置：左侧、右侧或双侧
	tabletSidebar?: "left" | "right"; // 平板端(769-1279px)显示哪侧侧边栏，仅position为both时生效，默认left
	showBothSidebarsOnPostPage?: boolean; // 当position为left或right时，是否在文章详情页显示双侧边栏
	properties: WidgetComponentConfig[]; // 组件配置列表
	components: {
		left: WidgetComponentType[];
		right: WidgetComponentType[];
		drawer: WidgetComponentType[];
	};
	defaultAnimation: {
		enable: boolean; // 是否启用默认动画
		baseDelay: number; // 基础延迟时间（毫秒）
		increment: number; // 每个组件递增的延迟时间（毫秒）
	};
	responsive: {
		breakpoints: {
			mobile: number; // 移动端断点（px）
			tablet: number; // 平板端断点（px）
			desktop: number; // 桌面端断点（px）
		};
	};
}

export interface SakuraConfig {
	enable: boolean; // 是否启用樱花特效
	switchable?: boolean; // 是否允许用户在设置中切换樱花特效
	sakuraNum: number; // 樱花数量，默认21
	limitTimes: number; // 樱花越界限制次数，-1为无限循环
	size: {
		min: number; // 樱花最小尺寸倍数
		max: number; // 樱花最大尺寸倍数
	};
	opacity: {
		min: number; // 樱花最小不透明度
		max: number; // 樱花最大不透明度
	};
	speed: {
		horizontal: {
			min: number; // 水平移动速度最小值
			max: number; // 水平移动速度最大值
		};
		vertical: {
			min: number; // 垂直移动速度最小值
			max: number; // 垂直移动速度最大值
		};
		rotation: number; // 旋转速度
		fadeSpeed: number; // 消失速度，不应大于最小不透明度
	};
	zIndex: number; // 层级，确保樱花在合适的层级显示
}

// Spine 看板娘配置
export interface SpineModelConfig {
	enable: boolean; // 是否启用 Spine 看板娘
	model: {
		path: string; // 模型文件路径 (.json)
		scale?: number; // 模型缩放比例，默认1.0
		x?: number; // X轴偏移，默认0
		y?: number; // Y轴偏移，默认0
	};
	position: {
		corner: "bottom-left" | "bottom-right" | "top-left" | "top-right"; // 显示位置
		offsetX?: number; // 水平偏移量，默认20px
		offsetY?: number; // 垂直偏移量，默认20px
	};
	size: {
		width?: number; // 容器宽度，默认280px
		height?: number; // 容器高度，默认400px
	};
	interactive?: {
		enabled?: boolean; // 是否启用交互功能，默认true
		clickAnimations?: string[]; // 点击时随机播放的动画列表
		clickMessages?: string[]; // 点击时随机显示的文字消息
		messageDisplayTime?: number; // 文字显示时间（毫秒），默认3000
		idleAnimations?: string[]; // 待机动画列表
		idleInterval?: number; // 待机动画切换间隔（毫秒），默认10000
	};
	responsive?: {
		hideOnMobile?: boolean; // 是否在移动端隐藏，默认false
		mobileBreakpoint?: number; // 移动端断点，默认768px
	};
	zIndex?: number; // 层级，默认1000
	opacity?: number; // 透明度，0-1，默认1.0
}

export interface BackgroundWallpaperConfig {
	// 通用配置（各模式可覆盖）
	common?: {
		navbar?: {
			transparentMode?: "none" | "semi" | "full" | "semifull"; // 导航栏透明模式，"none"=不透明
			enableBlur?: boolean;
			blur?: number;
		};
	};

	// 壁纸模式控制
	mode?: {
		defaultMode: WALLPAPER_MODE; // 默认壁纸模式，使用常量值如 WALLPAPER_BANNER 等
		switchable?: boolean; // 是否允许用户通过导航栏切换壁纸模式，默认true
		showModeSwitch?: {
			enable?: boolean; // 是否显示切换按钮
			visibility?: "off" | "mobile" | "desktop" | "both"; // 显示范围，使用常量 MODE_SWITCH_OFF / MODE_SWITCH_MOBILE / MODE_SWITCH_DESKTOP / MODE_SWITCH_BOTH // 显示设置："off"=不显示 | "mobile"=仅移动端 | "desktop"=仅桌面端 | "both"=全部显示
		};
	};

	// Banner 模式图片资源（行为/文案配置归 siteConfig.banner）
	banner?: {
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片
		position?: string; // 图片定位，支持CSS object-position值，如 "center"、"top"、"center top"
		imageApi?: {
			enable: boolean; // 是否启用图片API
			url: string; // API地址，返回每行一个图片链接的文本
		};
	};

	// 全屏壁纸模式配置
	fullscreen?: {
		src?:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  };
		position?: string; // 壁纸位置，支持CSS object-position的所有值
		imageApi?: {
			enable: boolean; // 是否启用图片API
			url: string; // API地址
		};
		carousel?: {
			enable: boolean; // 是否启用轮播
			interval?: number; // 轮播间隔时间（秒）
		};
		zIndex?: number; // 层级
		opacity?: number; // 壁纸透明度，0-1之间
		blur?: number; // 背景模糊度，单位px
		gradient?: {
			enable: boolean; // 是否启用渐变过渡
			colors?: Array<{ color: string; stop: number }>; // 渐变遮罩颜色配置
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 导航栏透明模式，使用常量 NAVBAR_TRANSPARENT_SEMI / NAVBAR_TRANSPARENT_FULL / NAVBAR_TRANSPARENT_SEMIFULL
			enableBlur?: boolean; // 是否开启毛玻璃模糊效果
			blur?: number; // 毛玻璃模糊度
		};
	};

	// 全屏透明覆盖模式配置
	overlay?: {
		src?:
			| string
			| string[]
			| { desktop?: string | string[]; mobile?: string | string[] };
		position?: string; // 壁纸位置："top-left" | "top-right" | "bottom-left" | "bottom-right"
		size?: {
			width?: number; // 宽度(px)
			height?: number; // 高度(px)
		};
		switchable?:
			| boolean
			| {
					opacity?: boolean; // 是否允许用户调整壁纸透明度
					blur?: boolean; // 是否允许用户调整背景模糊度
					cardOpacity?: boolean; // 是否允许用户调整卡片透明度
			  };
		zIndex?: number; // 层级
		opacity?: number; // 壁纸透明度，0-1之间
		blur?: number; // 背景模糊度，单位px
		cardOpacity?: number; // 卡片背景透明度，0-1之间
		borderRadius?: string; // 圆角
		margin?: string; // 外边距
		shadow?: boolean; // 是否显示阴影
	};
}

// 广告栏配置
export interface AdConfig {
	title?: string; // 广告栏标题
	content?: string; // 广告栏文本内容
	image?: {
		src: string; // 图片地址
		alt?: string; // 图片描述
		link?: string; // 图片点击链接
		external?: boolean; // 是否外部链接
	};
	link?: {
		text: string; // 链接文字
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
	padding?: {
		top?: string; // 上边距，如 "0", "1rem", "16px"
		right?: string; // 右边距
		bottom?: string; // 下边距
		left?: string; // 左边距
		all?: string; // 统一边距，会覆盖单独设置
	};
	closable?: boolean; // 是否可关闭
	displayCount?: number; // 显示次数限制，-1为无限制
	expireDate?: string; // 过期时间 (ISO 8601 格式)
}

// 友链配置
export interface FriendLink {
	title: string; // 友链标题
	imgurl: string; // 头像图片URL
	desc: string; // 友链描述
	siteurl: string; // 友链地址
	tags?: string[]; // 标签数组
	weight: number; // 权重，数字越大排序越靠前
	enabled: boolean; // 是否启用
	rss?: string; // RSS/Atom feed URL 用于朋友圈动态聚合
}

export interface FriendsPageConfig {
	title?: string; // 页面标题，留空则使用 i18n 中的翻译
	description?: string; // 页面描述，留空则使用 i18n 中的翻译
	showCustomContent?: boolean; // 是否显示自定义内容（friends.mdx）
	showComment?: boolean; // 是否显示评论区，默认 true
	showFriendsCircle?: boolean; // 是否显示朋友圈动态，默认 true
	randomizeSort?: boolean; // 是否打乱排序，如果为 true，将忽略 weight，随机排序
	circleMaxItems?: number; // 朋友圈最多展示条目数，默认 20
	circleMaxItemsPerFriend?: number; // 每个友链最多抓取条目数，默认 3
}

// 音乐播放器配置
export interface MusicPlayerConfig {
	enable?: boolean; // 是否启用音乐播放器功能

	// 使用方式："meting" 或 "local"
	mode: "meting" | "local"; // 音乐播放器模式，使用常量 MUSIC_MODE_METING / MUSIC_MODE_LOCAL

	// 默认音量 (0-1)
	volume?: number;

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode?: "list" | "one" | "random"; // 播放模式，使用常量 MUSIC_PLAY_MODE_LIST / MUSIC_PLAY_MODE_ONE / MUSIC_PLAY_MODE_RANDOM

	// 是否显示歌词
	showLyrics?: boolean;

	// 是否在导航栏显示音乐播放器
	showInNavbar?: boolean;

	// 是否显示悬浮播放器 UI
	showFloatingPlayer?: boolean;

	// 悬浮入口模式："default" 为独立悬浮播放器，"fab" 为集成到通用 FAB 组
	floatingEntryMode?: "default" | "fab"; // 悬浮入口模式，使用常量 MUSIC_FLOATING_DEFAULT / MUSIC_FLOATING_FAB

	// Meting API 配置
	meting?: {
		// Meting API 地址
		api?: string;

		// 音乐源服务器
		server?: "netease" | "tencent" | "kugou" | "xiami" | "baidu"; // 音乐源服务器，使用常量 METING_SERVER_NETEASE / METING_SERVER_TENCENT / METING_SERVER_KUGOU / METING_SERVER_XIAMI / METING_SERVER_BAIDU

		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type?: "song" | "playlist" | "album" | "search" | "artist"; // 资源类型，使用常量 METING_TYPE_SONG / METING_TYPE_PLAYLIST / METING_TYPE_ALBUM / METING_TYPE_SEARCH / METING_TYPE_ARTIST

		// 歌单/专辑/单曲 ID 或搜索关键词
		id?: string;

		// 认证 token（可选）
		auth?: string;

		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis?: string[];
	};

	// 本地音乐配置（当 mode 为 "local" 时使用）
	local?: {
		playlist?: Array<{
			name: string; // 歌曲名称
			artist: string; // 艺术家
			url: string; // 音乐文件路径（相对于 public 目录）
			cover?: string; // 封面图片路径（相对于 public 目录）
			lrc?: string; // 歌词内容，支持 LRC 格式
		}>;
	};
}

// 赞助方式类型
export interface SponsorMethod {
	name: string; // 赞助方式名称，如 "支付宝"、"微信"、"PayPal"
	icon?: string; // 图标名称（Iconify 格式），如 "fa7-brands:alipay"
	qrCode?: string; // 收款码图片路径（需要放在 public 目录下），可选
	link?: string; // 赞助链接 URL，可选。如果提供，会显示跳转按钮
	description?: string; // 描述文本
	enabled: boolean; // 是否启用
}

// 赞助者列表项
export interface SponsorItem {
	name: string; // 赞助者名称，如果想显示匿名，可以直接设置为"匿名"或使用 i18n
	amount?: string; // 赞助金额（可选）
	date?: string; // 赞助日期（可选，ISO 格式）
	message?: string; // 留言（可选）
}

// 赞助配置
export interface SponsorConfig {
	title?: string; // 页面标题，默认使用 i18n
	description?: string; // 页面描述文本
	usage?: string; // 赞助用途说明
	methods: SponsorMethod[]; // 赞助方式列表
	sponsors?: SponsorItem[]; // 赞助者列表（可选）
	showSponsorsList?: boolean; // 是否显示赞助者列表，默认 true
	showComment?: boolean; // 是否显示评论区，默认 false
	showButtonInPost?: boolean; // 是否在文章详情页底部显示赞助按钮，默认 true
}

// 响应式图像布局类型
export type ResponsiveImageLayout = "constrained" | "full-width" | "none";

// 图像格式类型
export type ImageFormat = "avif" | "webp" | "png" | "jpg" | "jpeg" | "gif";

// 相册元信息（用户在配置文件中填写）
export interface GalleryAlbum {
	id: string; // URL slug + 目录名，如 "japan-2025"
	name: string; // 相册名称
	description?: string; // 相册描述
	date?: string; // 日期
	location?: string; // 拍摄地点
	tags?: string[]; // 标签（用于首页筛选）
	cover?: string; // 手动指定封面（可选，省略则自动取 cover.* 或第一张）
	password?: string; // 加密密码（非空时启用加密）
	passwordHint?: string; // 密码提示
}

// 相册配置
export interface GalleryConfig {
	albums: GalleryAlbum[];
	columnWidth?: number; // 瀑布流最小列宽(px)，默认 240，浏览器根据容器宽度自动计算列数
}

// Pio 看板娘配置 (保留 Tsukimi)
export interface PioConfig {
	enable: boolean; // 是否启用看板娘
	models?: string[]; // 模型文件路径数组（支持 .model.json 和 .model3.json）
	position?: "left" | "right"; // 看板娘位置
	width?: number; // 看板娘宽度
	height?: number; // 看板娘高度
	mode?: "static" | "fixed" | "draggable"; // 展现模式，使用常量 PIO_MODE_STATIC / PIO_MODE_FIXED / PIO_MODE_DRAGGABLE
	hiddenOnMobile?: boolean; // 是否在移动设备上隐藏
	hideAboutMenu?: boolean; // 是否隐藏内置 About 菜单按钮
	dialog?: {
		welcome?: string | string[]; // 欢迎词
		touch?: string | string[]; // 触摸提示
		home?: string; // 首页提示
		skin?: [string, string]; // 换装提示 [切换前, 切换后]
		close?: string; // 关闭提示
		link?: string; // 关于链接
		custom?: {
			selector: string; // CSS选择器
			type: "read" | "link"; // 类型
			text?: string; // 自定义文本
		}[];
	};
	tips?: {
		welcomeMessage?: string[]; // 欢迎语
		messages?: string[]; // 循环提示内容
		duration?: number; // 每条 tips 展示时长（ms）
		interval?: number; // tips 循环间隔（ms）
	};
	menus?: {
		items?: {
			icon?: string; // Iconify 图标名称
			label: string; // 无障碍标题
			action: string; // 预定义动作名称
		}[];
		align?: "left" | "right"; // 菜单对齐方式
	};
}

/**
 * 分享组件配置
 */
export interface ShareConfig {
	enable: boolean; // 是否启用分享功能
}

/**
 * 相关文章组件配置
 */
export interface RelatedPostsConfig {
	enable: boolean; // 是否启用相关文章功能
	maxCount: number; // 相关文章数量
	weights?: RelatedPostsWeights; // 评分权重配置
	freshnessHalfLife?: number; // 新鲜度半衰期（天），默认 180
}

export interface RelatedPostsWeights {
	tagSimilarity?: number; // 标签相似度权重，默认 1.0
	titleSimilarity?: number; // 标题相似度权重，默认 0.6
	descriptionSimilarity?: number; // 描述相似度权重，默认 0.4
	categoryMatch?: number; // 分类匹配权重，默认 0.3
	freshness?: number; // 时间新鲜度权重，默认 0.2
	tagIDF?: boolean; // 是否启用标签 IDF 加权（稀有标签权重更高），默认 true
}

/**
 * 随机文章组件配置
 */
export interface RandomPostsConfig {
	enable: boolean; // 是否启用随机文章功能
	maxCount: number; // 随机文章数量
}

/**
 * 页面顶部进度条配置
 */
export interface PageProgressBarConfig {
	enable: boolean; // 是否启用页面顶部进度条
	height?: number; // 进度条高度，默认 3px
	duration?: number; // 动画时长，默认 8000ms
}

/**
 * 第三方统计配置（可能影响 Lighthouse 评分）
 */
export interface ThirdPartyAnalyticsConfig {
	enable: boolean; // 是否启用第三方统计（Microsoft Clarity），默认关闭
	clarityId?: string; // Clarity 项目 ID
}

/**
 * 特效配置
 */
export interface EffectsConfig {
	sakura?: {
		enable: boolean; // 是否启用樱花特效
		switchable?: boolean; // 是否在设置面板显示开关
		config?: Omit<SakuraConfig, "enable">; // 樱花特效详细配置（不含 enable，enable 在上层）
	};
}

// ── Docs sidebar types ──────────────────────────────────────────────────

export type DocSidebarBadgeType = "info" | "warning" | "danger" | "tip";

export interface DocSidebarBadge {
	type: DocSidebarBadgeType;
	text: string;
}

export interface DocSidebarItem {
	title: string;
	url: string;
	order: number;
	isHomepage: boolean;
	isCurrent: boolean;
	collapsed?: boolean;
	icon?: string;
	badge?: { type: string; text: string };
	children?: DocSidebarItem[];
}

export interface DocSidebarSection {
	name: string;
	icon?: string;
	badge?: { type: string; text: string };
	collapsed?: boolean;
	items: DocSidebarItem[];
}

export interface DocHomeAction {
	theme?: string;
	text: string;
	link: string;
}

export interface DocHomeFeature {
	title: string;
	icon?: string;
	details?: string;
}

export interface DocHomeConfig {
	name: string;
	tagline: string;
	description: string;
	image?: string;
	actions?: DocHomeAction[];
	features?: DocHomeFeature[];
}
