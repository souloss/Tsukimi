import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte, { vitePreprocess } from "@astrojs/svelte";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginTextMarkers } from "@expressive-code/plugin-text-markers";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { oddmisc } from "oddmisc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";

import {
	markmapConfig,
	plantumlConfig,
	siteConfig,
} from "./src/config/index.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import {
	rehypeFileTreeV3 as rehypeFileTree,
	remarkFileTree,
} from "./src/plugins/rehype-file-tree.mjs";
import { rehypeImageWidth } from "./src/plugins/rehype-image-width.mjs";
import { rehypeLazyImage } from "./src/plugins/rehype-lazy-image.mjs";
import { rehypeMarkmap } from "./src/plugins/rehype-markmap.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { rehypePlantuml } from "./src/plugins/rehype-plantuml.mjs";
import { rehypeWrapTable } from "./src/plugins/rehype-wrap-table.mjs";
import { remarkAbbr } from "./src/plugins/remark-abbr.mjs";
import { remarkCodeLangAliases } from "./src/plugins/remark-code-lang-aliases.js";
import { remarkContent } from "./src/plugins/remark-content.mjs";
import remarkContentDirectives from "./src/plugins/remark-content-directives.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkFixGithubAdmonitions } from "./src/plugins/remark-fix-github-admonitions.js";
import { remarkInclude } from "./src/plugins/remark-include.mjs";
import { remarkMark } from "./src/plugins/remark-mark.js";
import { remarkMarkmap } from "./src/plugins/remark-markmap.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkPlantuml } from "./src/plugins/remark-plantuml.js";
import { remarkPlumeCompat } from "./src/plugins/remark-plume-compat.js";
import { remarkRelativeLinks } from "./src/plugins/remark-relative-links.mjs";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.siteURL,
	base: "/",
	trailingSlash: "always",

	output: "static",

	experimental: {
		queuedRendering: {
			enabled: true,
			poolSize: 1000,
			contentCache: true,
		},
	},

	integrations: [
		oddmisc({
			umami: {
				shareUrl: "https://umami.souloss.cn/share/TmEHhKiBNMFZP49l",
			},
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-",
			containers: ["main"],
			smoothScrolling: false,
			cache: true,
			preload: false,
			accessibility: true,
			updateHead: process.env.NODE_ENV === "production",
			updateBodyClass: false,
			globalInstance: true,
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				return event.state && event.state.url && event.state.url.includes("#");
			},
		}),
		icon(),
		expressiveCode({
			themes: ["github-light", "github-dark"],
			plugins: [
				pluginTextMarkers(),
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: { showLineNumbers: false },
					bash: { frame: "code" },
					shell: { frame: "code" },
					sh: { frame: "code" },
					zsh: { frame: "code" },
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', SFMono-Regular, Menlo, Monaco, Consolas, 'Liber Mono', 'Courier New', 'Microsoft JhengHei', '微軟正黑體', 'Microsoft YaHei', '微软雅黑', 'Noto Sans HK', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans KR', ui-monospace, monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-bg)",
					editorTabBarBackground: "var(--codeblock-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte({
			compilerOptions: { runes: true },
			preprocess: vitePreprocess(),
		}),
		sitemap(),
		mdx(),
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkContent,
			remarkFixGithubAdmonitions,
			remarkMark,
			remarkInclude,
			remarkPlumeCompat,
			remarkCodeLangAliases,
			remarkDirective,
			remarkContentDirectives,
			remarkSectionize,
			parseDirectiveNode,
			remarkFileTree,
			remarkMermaid,
			[remarkPlantuml, plantumlConfig],
			[remarkMarkmap, markmapConfig],
			remarkRelativeLinks,
			remarkAbbr,
		],
		rehypePlugins: [
			rehypeKatex,
			[
				rehypeExternalLinks,
				{
					target: "_blank",
					rel: ["nofollow", "noopener", "noreferrer"],
				},
			],
			rehypeSlug,
			rehypeWrapTable,
			rehypeFileTree,
			rehypeMermaid,
			rehypePlantuml,
			rehypeMarkmap,
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [{ type: "text", value: "#" }],
					},
				},
			],
			rehypeImageWidth,
			rehypeLazyImage,
		],
	},
	vite: {
		customLogger: {
			info: (msg, options) => console.log(msg),
			warn: (msg, options) => {
				if (msg.includes("svelte/transition") && msg.includes("but never used"))
					return;
				console.warn(msg);
			},
			error: (msg, options) => console.error(msg),
			warnOnce: (msg, options) => {
				if (msg.includes("svelte/transition") && msg.includes("but never used"))
					return;
				console.warn(msg);
			},
			hasWarned: false,
			hasErrorLogged: () => false,
			clearScreen: () => {},
		},
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: [
				"overlayscrollbars",
				"@fancyapps/ui",
				"marked",
				"sanitize-html",
				"qrcode",
				"katex",
				"hastscript",
				"unist-util-visit",
				"reading-time",
			],
		},
		server: {
			warmup: {
				clientFiles: [
					"src/layouts/Layout.astro",
					"src/pages/[...page].astro",
					"src/components/widgets/music-player/MusicPlayer.svelte",
					"src/components/organisms/navigation/SearchModal.svelte",
					"src/components/control/ThemeSwitch.svelte",
					"src/components/features/settings/DisplaySettings.svelte",
					"src/scripts/swup-manager.ts",
				],
			},
			hmr: { timeout: 120000 },
			watch: {
				ignored: [
					"**/node_modules/**",
					"**/.git/**",
					"**/content/**",
					"**/public/**",
					"**/*.md",
				],
			},
		},
		build: {
			assetsInlineLimit: 4096,
			cssCodeSplit: true,
			cssMinify: "esbuild",
			inlineStylesheets: "auto",
			minify: "esbuild",
			chunkSizeWarningLimit: 1200,
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					if (
						warning.message.includes("is imported from external module") &&
						warning.message.includes("but never used")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
		esbuildOptions: {
			drop:
				process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
		},
	},
});
