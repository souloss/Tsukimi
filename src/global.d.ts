declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
			regenerateTOC?: () => void;
		};
	}

	/**
	 * Swup hooks interface for type-safe swup access
	 */
	interface Swup {
		hooks: {
			on: (event: string, handler: (...args: unknown[]) => void) => void;
			off: (event: string, handler: (...args: unknown[]) => void) => void;
			before: (event: string, handler: (...args: unknown[]) => void) => void;
		};
		options: {
			ignoreVisit: (
				url: string,
				opts: { el?: Element; event?: Event },
			) => boolean;
			containers: string[];
			[key: string]: unknown;
		};
		navigate?: (url: string, options?: { history?: boolean }) => void;
		preload?: (url: string) => Promise<void>;
	}

	/**
	 * Site config TOC section interface
	 */
	interface SiteConfigTOC {
		enable?: boolean;
		mode?: "float" | "sidebar";
		depth?: number;
		useJapaneseBadge?: boolean;
	}

	/**
	 * Site config interface for type-safe global siteConfig access
	 */
	interface SiteConfigWindow {
		lang?: string;
		toc?: SiteConfigTOC;
		wallpaperMode?: {
			defaultMode?: "banner" | "fullscreen" | "none";
		};
	}

	interface Window {
		swup: Swup | undefined;
		closeAnnouncement: () => void;
		pagefind: {
			search: (query: string) => Promise<{
				results: {
					data: () => Promise<SearchResult>;
				}[];
			}>;
		};

		loadPagefind?: () => Promise<void>;
		pagefindTsukimi?: {
			search: (query: string) => Promise<{
				results: {
					data: () => Promise<SearchResult>;
				}[];
			}>;
			options: (opts?: Record<string, unknown>) => Promise<void>;
		};
		loadPagefindTsukimi?: () => Promise<void>;
		_walineModule?: any;
		toggleFloatingTOC?: () => void;
		mobileTOCInit?: () => void;
		initSemifullScrollDetection?: () => void;
		iconifyLoaded?: boolean;

		// CardTOC manager
		CardTOC?: {
			manager: {
				init?: () => void;
				cleanup?: () => void;
			} | null;
		};

		// TOC internal navigation flag
		tocInternalNavigation?: boolean;
		__iconifyLoader?: {
			load: () => Promise<void>;
			addToPreloadQueue: (icons: string[]) => void;
			onLoad: (callback: () => void) => void;
			isLoaded: boolean;
		};
		siteConfig: SiteConfigWindow;
		hljs?: {
			highlightElement: (block: HTMLElement) => void;
		};
		renderMermaidDiagrams?: () => void;

		// Sidebar manager window properties
		__tsukimiSidebarResizeHandler?: () => void;
		__tsukimiSidebarSwupHooked?: boolean;
		__tsukimiSidebarManagerInitialized?: boolean;
		__tsukimiRightSidebarResizeHandler?: () => void;
		__tsukimiRightSidebarSwupHooked?: boolean;
		__tsukimiRightSidebarManagerInitialized?: boolean;
	}

	interface Fancybox {
		unbind: (selector: string) => void;
		bind: (selector: string, options: object) => void;
	}

	var Fancybox: Fancybox | undefined;
}

interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	content?: string;
	word_count?: number;
	filters?: Record<string, unknown>;
	anchors?: {
		element: string;
		id: string;
		text: string;
		location: number;
	}[];
	weighted_locations?: {
		weight: number;
		balanced_score: number;
		location: number;
	}[];
	locations?: number[];
	raw_content?: string;
	raw_url?: string;
	sub_results?: SearchResult[];
}

export { SearchResult };
