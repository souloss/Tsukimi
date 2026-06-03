import { WALLPAPER_BANNER } from "../constants/constants";
import type { BackgroundWallpaperConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

// 背景壁纸配置（图片资源 + 模式控制）
const defaults: BackgroundWallpaperConfig = {
	// 通用配置（各模式可覆盖）
	common: {
		navbar: {
			transparentMode: "none", // 默认不透明
			enableBlur: true,
			blur: 10,
		},
	},
	// 壁纸模式控制
	mode: {
		defaultMode: WALLPAPER_BANNER,
		switchable: true,
		showModeSwitch: {
			enable: true,
			// "off" = 不显示 | "mobile" = 仅在移动端显示 | "desktop" = 仅在桌面端显示 | "both" = 在所有设备上显示
			visibility: "desktop",
		},
	},
	// Banner 模式图片资源（行为/文案配置归 siteConfig.banner）
	banner: {
		src: {
			desktop: [
				"/assets/desktop-banner/1.webp",
				"/assets/desktop-banner/2.webp",
				"/assets/desktop-banner/3.webp",
				"/assets/desktop-banner/4.webp",
			],
			mobile: [
				"/assets/mobile-banner/1.webp",
				"/assets/mobile-banner/2.webp",
				"/assets/mobile-banner/3.webp",
				"/assets/mobile-banner/4.webp",
			],
		},
		position: "center top",
		imageApi: {
			enable: false,
			url: "http://domain.com/api2_v2.php?format=text&count=4",
		},
	},
	// 全屏壁纸模式配置
	fullscreen: {
		src: {
			desktop: [
				"/assets/desktop-banner/1.webp",
				"/assets/desktop-banner/2.webp",
				"/assets/desktop-banner/3.webp",
				"/assets/desktop-banner/4.webp",
			],
			mobile: [
				"/assets/mobile-banner/1.webp",
				"/assets/mobile-banner/2.webp",
				"/assets/mobile-banner/3.webp",
				"/assets/mobile-banner/4.webp",
			],
		},
		position: "center top",
		imageApi: {
			enable: false,
			url: "http://domain.com/api2_v2.php?format=text&count=4",
		},
		carousel: {
			enable: true,
			interval: 5,
		},
		zIndex: -1,
		opacity: 0.8,
		blur: 1,
		gradient: {
			enable: true,
			colors: [
				{ color: "var(--color-bg)", stop: 0.3 },
				{ color: "transparent", stop: 0.8 },
			],
		},
		navbar: {
			transparentMode: "semifull",
			enableBlur: true,
			blur: 10,
		},
	},
	// 叠加层壁纸模式配置（小图角落显示）
	overlay: {
		src: "/assets/desktop-banner/1.webp",
		position: "bottom-right", // top-left | top-right | bottom-left | bottom-right
		size: {
			width: 300,
			height: 400,
		},
		opacity: 0.9,
		blur: 0,
		cardOpacity: 0.9,
		borderRadius: "1rem",
		margin: "1rem",
		zIndex: 0,
		shadow: true,
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
	},
};

export const backgroundWallpaperConfig = withOverride(
	"backgroundWallpaper",
	defaults,
);
