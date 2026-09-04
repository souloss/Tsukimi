import type { FontConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

// 字体配置
const defaults: FontConfig = {
	// 是否允许用户切换字体
	switchable: true,
	// 默认字体选项
	defaultFont: "lxgw",
	// 字体选项列表
	fonts: [
		{
			id: "system",
			name: "系统默认",
			i18nKey: "fontSystem",
			// 系统默认字体栈，无需引入
			fontFamily:
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
		},
		{
			id: "literata",
			name: "Literata",
			i18nKey: "fontLiterata",
			fontFamily: "'Literata', system-ui, sans-serif",
			cjkFontFamily: "'LXGW WenKai', serif",
			googleFonts:
				"https://fonts.googleapis.com/css2?family=Literata:wght@400;500;700&display=swap",
			cdnUrls: [
				"https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css",
				"https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-bold.css",
			],
		},
		{
			id: "lxgw",
			name: "霞鹜文楷",
			i18nKey: "fontLxgw",
			fontFamily: "'LXGW WenKai', serif",
			cdnUrls: [
				"https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css",
				"https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-bold.css",
			],
		},
		{
			id: "2d",
			name: "二次元",
			i18nKey: "font2D",
			fontFamily: "ZenMaruGothic-Medium",
			cjkFontFamily: "'萝莉体 第二版'",
			localFonts: [
				{
					family: "ZenMaruGothic-Medium",
					src: "/assets/font/ZenMaruGothic-Medium.ttf",
					weight: 500,
					style: "normal",
				},
				{
					family: "萝莉体 第二版",
					src: "/assets/font/loli.ttf",
					weight: 400,
					style: "normal",
				},
			],
		},
	],
};

export const fontConfig = withOverride("fontConfig", defaults);
