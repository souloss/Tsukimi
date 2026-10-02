<script lang="ts">
import Icon from "@components/atoms/Icon/LocalIcon.svelte";
import {
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import type { WALLPAPER_MODE } from "@types/config";
import {
	getDefaultMaterialPaletteStyle,
	getStoredMaterialPaletteStyle,
	MATERIAL_PALETTE_STYLES,
	type MaterialPaletteStyle,
	resolveMaterialColorScheme,
} from "@utils/material-theme";
import {
	applyFontToDocument,
	getDefaultBannerCarouselEnabled,
	getDefaultBannerTitleEnabled,
	getDefaultFont,
	getDefaultGradientEnabled,
	getDefaultHue,
	getDefaultOverlayBlur,
	getDefaultOverlayCardOpacity,
	getDefaultOverlayOpacity,
	getDefaultSakuraEnabled,
	getDefaultStickyNavbar,
	getDefaultTextureOpacity,
	getDefaultTexturePreset,
	getDefaultWavesEnabled,
	getFont,
	getHue,
	getReduceMotion,
	getStoredBannerCarouselEnabled,
	getStoredBannerTitleEnabled,
	getStoredFont,
	getStoredGradientEnabled,
	getStoredOverlayBlur,
	getStoredOverlayCardOpacity,
	getStoredOverlayOpacity,
	getStoredSakuraEnabled,
	getStoredStickyNavbar,
	getStoredTextureOpacity,
	getStoredTexturePreset,
	getStoredWallpaperMode,
	getStoredWavesEnabled,
	resetReduceMotion,
	setBannerCarouselEnabled,
	setBannerTitleEnabled,
	setFont,
	setGradientEnabled,
	setHue,
	setMaterialPaletteStyle,
	setOverlayBlur,
	setOverlayCardOpacity,
	setOverlayOpacity,
	setReduceMotion,
	setSakuraEnabled,
	setStickyNavbar,
	setTextureOpacity,
	setTexturePreset,
	setWallpaperMode,
	setWavesEnabled,
} from "@utils/setting-utils";
import { subscribeThemeSettings } from "@utils/theme-state";
import { onMount } from "svelte";

import {
	backgroundWallpaperConfig,
	effectsConfig,
	fontConfig,
	siteConfig,
	TEXTURE_PRESETS,
} from "@/config";
import type { TexturePreset } from "@/types/texture";

type OverlaySliderItem = {
	key: "opacity" | "blur" | "cardOpacity";
	enabled: boolean;
	label: string;
	displayValue: string;
	ariaLabel: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onValueChange: (value: number) => void;
};

let hue = $state(getHue());
let paletteStyle = $state<MaterialPaletteStyle>(
	getStoredMaterialPaletteStyle(),
);
let dark = $state(
	typeof document !== "undefined" &&
		document.documentElement.classList.contains("dark"),
);
let reduceMotion = $state(getReduceMotion());
let texturePreset = $state<TexturePreset>(getStoredTexturePreset());
let textureOpacity = $state(getStoredTextureOpacity());
const defaultHue = getDefaultHue();
const defaultPaletteStyle = getDefaultMaterialPaletteStyle();
const defaultTexturePreset = getDefaultTexturePreset();
const defaultTextureOpacity = getDefaultTextureOpacity();
let wallpaperMode: WALLPAPER_MODE = $state(
	backgroundWallpaperConfig.mode?.defaultMode,
);
const defaultWallpaperMode = backgroundWallpaperConfig.mode?.defaultMode;
let currentLayout: "list" | "grid" = $state("list");
const defaultLayout = siteConfig.postListLayout.defaultMode;
const mobileDefaultLayout =
	siteConfig.postListLayout.mobileDefaultMode || defaultLayout;
let mounted = $state(false);
let isSmallScreen = $state(
	typeof window !== "undefined" ? window.innerWidth < 1200 : false,
);
let isMobileWidth = $state(
	typeof window !== "undefined" ? window.innerWidth < 780 : false,
);
let isSwitching = $state(false);
let wavesEnabled = $state(true);
const defaultWavesEnabled = getDefaultWavesEnabled();
let gradientEnabled = $state(true);
const defaultGradientEnabled = getDefaultGradientEnabled();
let bannerTitleEnabled = $state(true);
const defaultBannerTitleEnabled = getDefaultBannerTitleEnabled();
let bannerCarouselEnabled = $state(true);
const defaultBannerCarouselEnabled = getDefaultBannerCarouselEnabled();
let sakuraEnabled = $state(true);
const defaultSakuraEnabled = getDefaultSakuraEnabled();
let overlayOpacity = $state(getDefaultOverlayOpacity());
const defaultOverlayOpacity = getDefaultOverlayOpacity();
let overlayBlur = $state(getDefaultOverlayBlur());
const defaultOverlayBlur = getDefaultOverlayBlur();
let overlayCardOpacity = $state(getDefaultOverlayCardOpacity());
const defaultOverlayCardOpacity = getDefaultOverlayCardOpacity();
let currentFont = $state(getDefaultFont());
const defaultFont = getDefaultFont();
let stickyNavbarEnabled = $state(getDefaultStickyNavbar());
const defaultStickyNavbar = getDefaultStickyNavbar();

const isWallpaperSwitchable =
	(backgroundWallpaperConfig.mode?.switchable ?? true) &&
	(backgroundWallpaperConfig.mode?.showModeSwitch?.enable ?? true) &&
	backgroundWallpaperConfig.mode?.showModeSwitch?.visibility !== "off";
const wallpaperModeVisibility =
	backgroundWallpaperConfig.mode?.showModeSwitch?.visibility ?? "both";
const showWallpaperModeSwitch = $derived(
	isWallpaperSwitchable &&
		(wallpaperModeVisibility === "both" ||
			(wallpaperModeVisibility === "mobile" && isSmallScreen) ||
			(wallpaperModeVisibility === "desktop" && !isSmallScreen)),
);
const allowLayoutSwitch = siteConfig.postListLayout.allowSwitch;
const isFontSwitchable = fontConfig?.switchable ?? true;
const effectiveDefaultLayout = $derived(
	isMobileWidth ? mobileDefaultLayout : defaultLayout,
);
const showThemeColor = !siteConfig.themeColor.fixed;
const showPaletteStyle = !siteConfig.themeColor.fixed;
const showReduceMotion = true;
const isTextureSwitchable =
	(siteConfig.texture?.enable ?? false) &&
	(siteConfig.texture?.switchable ?? false);
const palettePreviews = $derived(
	MATERIAL_PALETTE_STYLES.map((style) => ({
		style,
		colors: resolveMaterialColorScheme(
			hue,
			dark,
			style,
			siteConfig.themeColor.colorSpec ?? "2025",
		),
	})),
);
const currentPaletteColor = $derived(
	resolveMaterialColorScheme(
		hue,
		dark,
		paletteStyle,
		siteConfig.themeColor.colorSpec ?? "2025",
	).primary,
);
const textureIcons: Record<TexturePreset, string> = {
	none: "material-symbols:block-rounded",
	starlight: "material-symbols:auto-awesome-outline-rounded",
	"cyber-dots": "material-symbols:grid-view-rounded",
	topography: "material-symbols:waves-rounded",
	geometric: "material-symbols:category-outline-rounded",
	sakura: "material-symbols:local-florist-outline-rounded",
};

function paletteLabelKey(style: MaterialPaletteStyle): I18nKey {
	const labels: Record<MaterialPaletteStyle, I18nKey> = {
		tonalSpot: I18nKey.styleTonalSpot,
		vibrant: I18nKey.styleVibrant,
		expressive: I18nKey.styleExpressive,
		content: I18nKey.styleContent,
		rainbow: I18nKey.styleRainbow,
		fruitSalad: I18nKey.styleFruitSalad,
		monochrome: I18nKey.styleMonochrome,
		neutral: I18nKey.styleNeutral,
		fidelity: I18nKey.styleFidelity,
	};
	return labels[style];
}
// 是否允许用户切换水波纹动画（只看 switchable 配置）
const isWavesSwitchable = siteConfig.banner.waves?.switchable ?? false;
// 是否允许用户切换渐变过渡（只看 switchable 配置）
const isGradientSwitchable = siteConfig.banner.gradient?.switchable ?? false;
// 检查是否启用横幅标题配置
const isBannerTitleEnabled = siteConfig.banner.bannerHomeText?.enable ?? false;
// 是否允许用户切换横幅标题
const isBannerTitleSwitchable =
	isBannerTitleEnabled &&
	(siteConfig.banner.bannerHomeText?.switchable ?? false);
// 是否允许用户切换横幅轮播
const isBannerCarouselSwitchable =
	siteConfig.banner.carousel?.switchable ?? false;
// 是否允许用户切换樱花特效
const isSakuraSwitchable = effectsConfig.sakura?.switchable ?? false;
// 是否有任何横幅设置可显示（后续添加新设置时在此处添加条件）
const hasBannerSettings =
	isWavesSwitchable ||
	isGradientSwitchable ||
	isBannerTitleSwitchable ||
	isBannerCarouselSwitchable;
const overlaySwitchableConfig =
	backgroundWallpaperConfig.overlay?.switchable ?? false;
const isOverlaySettingsSwitchable =
	typeof overlaySwitchableConfig === "boolean" ? overlaySwitchableConfig : true;
const isOverlayOpacitySwitchable =
	typeof overlaySwitchableConfig === "boolean"
		? overlaySwitchableConfig
		: (overlaySwitchableConfig.opacity ?? false);
const isOverlayBlurSwitchable =
	typeof overlaySwitchableConfig === "boolean"
		? overlaySwitchableConfig
		: (overlaySwitchableConfig.blur ?? false);
const isOverlayCardOpacitySwitchable =
	typeof overlaySwitchableConfig === "boolean"
		? overlaySwitchableConfig
		: (overlaySwitchableConfig.cardOpacity ?? false);
const hasOverlaySettings =
	isOverlaySettingsSwitchable &&
	(isOverlayOpacitySwitchable ||
		isOverlayBlurSwitchable ||
		isOverlayCardOpacitySwitchable);
const overlaySettingsIsDefault = $derived(
	(!isOverlayOpacitySwitchable || overlayOpacity === defaultOverlayOpacity) &&
		(!isOverlayBlurSwitchable || overlayBlur === defaultOverlayBlur) &&
		(!isOverlayCardOpacitySwitchable ||
			overlayCardOpacity === defaultOverlayCardOpacity),
);
// 横幅设置是否全部为默认值（用于控制恢复默认按钮的显隐）
const bannerSettingsIsDefault = $derived(
	(!isBannerTitleSwitchable ||
		bannerTitleEnabled === defaultBannerTitleEnabled) &&
		(!isWavesSwitchable || wavesEnabled === defaultWavesEnabled) &&
		(!isGradientSwitchable || gradientEnabled === defaultGradientEnabled) &&
		(!isBannerCarouselSwitchable ||
			bannerCarouselEnabled === defaultBannerCarouselEnabled),
);
const hasAnyContent =
	showThemeColor ||
	showPaletteStyle ||
	showReduceMotion ||
	isTextureSwitchable ||
	isWallpaperSwitchable ||
	allowLayoutSwitch ||
	hasBannerSettings ||
	hasOverlaySettings ||
	isSakuraSwitchable ||
	isFontSwitchable;

const overlaySliderItems = $derived<OverlaySliderItem[]>([
	{
		key: "opacity",
		enabled: isOverlayOpacitySwitchable,
		label: i18n(I18nKey.overlayOpacity),
		displayValue: `${Math.round(overlayOpacity * 100)}%`,
		ariaLabel: i18n(I18nKey.overlayOpacity),
		min: 20,
		max: 100,
		step: 1,
		value: Math.round(overlayOpacity * 100),
		onValueChange: (value: number) => {
			overlayOpacity = value / 100;
		},
	},
	{
		key: "blur",
		enabled: isOverlayBlurSwitchable,
		label: i18n(I18nKey.overlayBlur),
		displayValue: `${overlayBlur.toFixed(1)}px`,
		ariaLabel: i18n(I18nKey.overlayBlur),
		min: 0,
		max: 20,
		step: 0.5,
		value: overlayBlur,
		onValueChange: (value: number) => {
			overlayBlur = value;
		},
	},
	{
		key: "cardOpacity",
		enabled: isOverlayCardOpacitySwitchable,
		label: i18n(I18nKey.overlayCardOpacity),
		displayValue: `${Math.round(overlayCardOpacity * 100)}%`,
		ariaLabel: i18n(I18nKey.overlayCardOpacity),
		min: 20,
		max: 100,
		step: 1,
		value: Math.round(overlayCardOpacity * 100),
		onValueChange: (value: number) => {
			overlayCardOpacity = value / 100;
		},
	},
]);

function resetHue() {
	hue = getDefaultHue();
	requestAnimationFrame(refreshAllRangeProgress);
}

function resetThemeAppearance() {
	hue = defaultHue;
	setHue(defaultHue);
	paletteStyle = defaultPaletteStyle;
	setMaterialPaletteStyle(defaultPaletteStyle);
	texturePreset = defaultTexturePreset;
	setTexturePreset(defaultTexturePreset);
	textureOpacity = defaultTextureOpacity;
	setTextureOpacity(defaultTextureOpacity);
	resetReduceMotion();
	reduceMotion = getReduceMotion();
	requestAnimationFrame(refreshAllRangeProgress);
}

function resetWallpaperMode() {
	wallpaperMode = defaultWallpaperMode;
	setWallpaperMode(defaultWallpaperMode);
}

function resetLayout() {
	currentLayout = effectiveDefaultLayout;
	localStorage.removeItem("postListLayout");

	// 触发自定义事件，通知页面布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: effectiveDefaultLayout },
	});
	window.dispatchEvent(event);
}

function resetFont() {
	currentFont = defaultFont;
	setFont(defaultFont);
}

function resetWavesEnabled() {
	wavesEnabled = defaultWavesEnabled;
	setWavesEnabled(defaultWavesEnabled);
}

function resetGradientEnabled() {
	gradientEnabled = defaultGradientEnabled;
	setGradientEnabled(defaultGradientEnabled);
}

function resetBannerSettings() {
	if (
		isBannerTitleSwitchable &&
		bannerTitleEnabled !== defaultBannerTitleEnabled
	) {
		bannerTitleEnabled = defaultBannerTitleEnabled;
		setBannerTitleEnabled(defaultBannerTitleEnabled);
	}
	if (isWavesSwitchable && wavesEnabled !== defaultWavesEnabled) {
		wavesEnabled = defaultWavesEnabled;
		setWavesEnabled(defaultWavesEnabled);
	}
	if (isGradientSwitchable && gradientEnabled !== defaultGradientEnabled) {
		gradientEnabled = defaultGradientEnabled;
		setGradientEnabled(defaultGradientEnabled);
	}
	if (
		isBannerCarouselSwitchable &&
		bannerCarouselEnabled !== defaultBannerCarouselEnabled
	) {
		bannerCarouselEnabled = defaultBannerCarouselEnabled;
		setBannerCarouselEnabled(defaultBannerCarouselEnabled);
	}
}

function resetOverlaySettings() {
	if (isOverlayOpacitySwitchable && overlayOpacity !== defaultOverlayOpacity) {
		overlayOpacity = defaultOverlayOpacity;
		setOverlayOpacity(defaultOverlayOpacity);
	}
	if (isOverlayBlurSwitchable && overlayBlur !== defaultOverlayBlur) {
		overlayBlur = defaultOverlayBlur;
		setOverlayBlur(defaultOverlayBlur);
	}
	if (
		isOverlayCardOpacitySwitchable &&
		overlayCardOpacity !== defaultOverlayCardOpacity
	) {
		overlayCardOpacity = defaultOverlayCardOpacity;
		setOverlayCardOpacity(defaultOverlayCardOpacity);
	}

	requestAnimationFrame(refreshAllRangeProgress);
}

function toggleWavesEnabled() {
	wavesEnabled = !wavesEnabled;
	setWavesEnabled(wavesEnabled);
}

function toggleGradientEnabled() {
	gradientEnabled = !gradientEnabled;
	setGradientEnabled(gradientEnabled);
}

function toggleBannerTitleEnabled() {
	bannerTitleEnabled = !bannerTitleEnabled;
	setBannerTitleEnabled(bannerTitleEnabled);
}

function toggleBannerCarouselEnabled() {
	bannerCarouselEnabled = !bannerCarouselEnabled;
	setBannerCarouselEnabled(bannerCarouselEnabled);
}

function toggleSakuraEnabled() {
	sakuraEnabled = !sakuraEnabled;
	setSakuraEnabled(sakuraEnabled);
}

function toggleStickyNavbar() {
	stickyNavbarEnabled = !stickyNavbarEnabled;
	setStickyNavbar(stickyNavbarEnabled);
}

function switchWallpaperMode(newMode: WALLPAPER_MODE) {
	wallpaperMode = newMode;
	setWallpaperMode(newMode);
	window.scrollTo({ top: 0 });

	if (newMode === WALLPAPER_OVERLAY) {
		requestAnimationFrame(refreshAllRangeProgress);
	}
}

function checkScreenSize() {
	isSmallScreen = window.innerWidth < 1200;
	isMobileWidth = window.innerWidth < 780;
	// 低于380px强制网格模式
	if (window.innerWidth < 380 && currentLayout === "list") {
		currentLayout = "grid";
		const event = new CustomEvent("layoutChange", {
			detail: { layout: "grid" },
		});
		window.dispatchEvent(event);
	}
}

function updateRangeProgress(input: HTMLInputElement) {
	const min = Number(input.min || 0);
	const max = Number(input.max || 100);
	const value = Number(input.value || 0);
	const progress = ((value - min) * 100) / (max - min || 1);
	input.style.setProperty(
		"--range-progress",
		`${Math.min(100, Math.max(0, progress))}%`,
	);
}

function refreshAllRangeProgress() {
	const panel = document.getElementById("display-setting");
	if (!panel) {
		return;
	}

	const rangeInputs = Array.from(
		panel.querySelectorAll('input[type="range"]'),
	) as HTMLInputElement[];
	rangeInputs.forEach(updateRangeProgress);
}

function switchLayout() {
	if (!mounted || isSwitching) {
		return;
	}

	isSwitching = true;
	currentLayout = currentLayout === "list" ? "grid" : "list";
	localStorage.setItem("postListLayout", currentLayout);

	// 触发自定义事件，通知页面布局已改变
	const event = new CustomEvent("layoutChange", {
		detail: { layout: currentLayout },
	});
	window.dispatchEvent(event);

	// 动画完成后重置状态
	setTimeout(() => {
		isSwitching = false;
	}, 500);
}

function switchFont(newFont: string) {
	currentFont = newFont;
	setFont(newFont);
}

onMount(() => {
	mounted = true;
	checkScreenSize();
	const themeObserver = new MutationObserver(() => {
		dark = document.documentElement.classList.contains("dark");
	});
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	// 从localStorage读取保存的壁纸模式
	wallpaperMode = getStoredWallpaperMode();

	// 从localStorage读取水波纹动画状态
	wavesEnabled = getStoredWavesEnabled();

	// 从localStorage读取渐变过渡状态
	gradientEnabled = getStoredGradientEnabled();

	// 从localStorage读取横幅标题状态
	bannerTitleEnabled = getStoredBannerTitleEnabled();

	// 从localStorage读取横幅轮播状态
	bannerCarouselEnabled = getStoredBannerCarouselEnabled();

	// 从localStorage读取樱花特效状态
	sakuraEnabled = getStoredSakuraEnabled();

	// 从localStorage读取全屏透明设置状态
	overlayOpacity = getStoredOverlayOpacity();
	overlayBlur = getStoredOverlayBlur();
	overlayCardOpacity = getStoredOverlayCardOpacity();

	// 从localStorage读取用户偏好布局
	const savedLayout = localStorage.getItem("postListLayout");
	if (savedLayout && (savedLayout === "list" || savedLayout === "grid")) {
		currentLayout = savedLayout;
	} else {
		currentLayout =
			window.innerWidth < 780 ? mobileDefaultLayout : defaultLayout;
	}

	// 从localStorage读取用户偏好字体
	currentFont = getStoredFont();
	applyFontToDocument(currentFont);

	// 从localStorage读取固定导航栏设置
	stickyNavbarEnabled = getStoredStickyNavbar();
	reduceMotion = getReduceMotion();
	texturePreset = getStoredTexturePreset();
	textureOpacity = getStoredTextureOpacity();

	// 监听窗口大小变化
	window.addEventListener("resize", checkScreenSize);

	return () => {
		window.removeEventListener("resize", checkScreenSize);
		themeObserver.disconnect();
	};
});

// Keep this panel synchronized with changes made by the early theme bootstrap
// or another client island. The storage helpers remain the persistence layer;
// this event stream is the single client-side state notification path.
onMount(() =>
	subscribeThemeSettings(({ key, value }) => {
		switch (key) {
			case "hue":
				if (typeof value === "number") hue = value;
				break;
			case "palette":
				if (typeof value === "string")
					paletteStyle = value as MaterialPaletteStyle;
				break;
			case "texture":
				if (typeof value === "string") texturePreset = value as TexturePreset;
				break;
			case "textureOpacity":
				if (typeof value === "number") textureOpacity = value;
				break;
			case "reduceMotion":
				if (typeof value === "boolean") reduceMotion = value;
				break;
			case "wallpaper":
				if (typeof value === "string") wallpaperMode = value as WALLPAPER_MODE;
				break;
		}
	}),
);

// 监听布局变化事件
onMount(() => {
	const handleCustomEvent = (event: Event) => {
		const customEvent = event as CustomEvent<{
			layout: "list" | "grid";
		}>;
		currentLayout = customEvent.detail.layout;
	};

	window.addEventListener("layoutChange", handleCustomEvent);

	return () => {
		window.removeEventListener("layoutChange", handleCustomEvent);
	};
});

onMount(() => {
	const panel = document.getElementById("display-setting");
	if (!panel) {
		return;
	}

	const handleRangeInput = (event: Event) => {
		const target = event.target;
		if (target instanceof HTMLInputElement && target.type === "range") {
			updateRangeProgress(target);
		}
	};

	refreshAllRangeProgress();
	panel.addEventListener("input", handleRangeInput);

	return () => {
		panel.removeEventListener("input", handleRangeInput);
	};
});

onMount(() => {
	const handleWallpaperModeChange = (event: Event) => {
		const customEvent = event as CustomEvent<{ mode: WALLPAPER_MODE }>;
		wallpaperMode = customEvent.detail.mode;
	};

	window.addEventListener("wallpaper-mode-change", handleWallpaperModeChange);

	return () => {
		window.removeEventListener(
			"wallpaper-mode-change",
			handleWallpaperModeChange,
		);
	};
});

$effect(() => {
	if (hue || hue === 0) {
		setHue(hue);
	}
});

function switchPaletteStyle(style: MaterialPaletteStyle) {
	paletteStyle = style;
	setMaterialPaletteStyle(style);
}

function toggleReduceMotion() {
	reduceMotion = !reduceMotion;
	setReduceMotion(reduceMotion);
}

function switchTexturePreset(preset: TexturePreset) {
	texturePreset = preset;
	setTexturePreset(preset);
}

function switchTextureOpacity(value: number) {
	textureOpacity = Math.min(0.25, Math.max(0.05, value));
	setTextureOpacity(textureOpacity);
}

function handleOptionKeydown(
	event: KeyboardEvent,
	index: number,
	count: number,
) {
	if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
	event.preventDefault();
	const direction = event.key === "ArrowRight" ? 1 : -1;
	const nextIndex = (index + direction + count) % count;
	const buttons = Array.from(
		(
			event.currentTarget as HTMLElement
		).parentElement?.querySelectorAll<HTMLButtonElement>("button") ?? [],
	);
	buttons[nextIndex]?.focus();
}

$effect(() => {
	if (wallpaperMode === WALLPAPER_OVERLAY) {
		if (isOverlayOpacitySwitchable) {
			setOverlayOpacity(overlayOpacity);
		}
		if (isOverlayBlurSwitchable) {
			setOverlayBlur(overlayBlur);
		}
		if (isOverlayCardOpacitySwitchable) {
			setOverlayCardOpacity(overlayCardOpacity);
		}
	}
});
</script>

{#if hasAnyContent}
	<div
		id="display-setting"
		class="float-panel float-panel-closed absolute transition-all w-80 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain right-4 max-w-[calc(100vw-2rem)] px-4 py-2 transition-opacity"
		role="dialog"
		aria-modal="false"
		aria-labelledby="display-setting-title"
		tabindex="-1"
		aria-label={i18n(I18nKey.appearanceSettings)}
		class:opacity-50={!mounted}
		class:pointer-events-none={!mounted}
	>
		<div class="sticky top-0 z-10 -mx-4 mb-2 flex items-center justify-between gap-3 px-4 pt-1 pb-2 bg-[var(--float-panel-bg)]/95 backdrop-blur-sm">
			<h2 id="display-setting-title" class="text-base font-bold text-neutral-900 dark:text-neutral-100">
				{i18n(I18nKey.appearanceSettings)}
			</h2>
			<button
				type="button"
				class="btn-regular flex h-7 items-center gap-1 rounded-md px-2 text-xs active:scale-95"
				aria-label={i18n(I18nKey.resetAppearance)}
				title={i18n(I18nKey.resetAppearance)}
				onclick={resetThemeAppearance}
			>
				<Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.75rem]" />
				<span>{i18n(I18nKey.resetAppearance)}</span>
			</button>
		</div>
		<section class="settings-group settings-group--theme">
			<div class="settings-group__header">
				<span>{i18n(I18nKey.settingsTheme)}</span>
			</div>
		<!-- Theme Color Section -->
		{#if showThemeColor}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex flex-row gap-2 mb-2 items-center justify-between"
				>
					<div
						class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
					>
						{i18n(I18nKey.themeColor)}
						<button
							aria-label="Reset to Default"
							class="btn-regular w-7 h-7 rounded-md active:scale-95"
							class:opacity-0={hue === defaultHue}
							class:pointer-events-none={hue === defaultHue}
							onclick={resetHue}
						>
							<div class="text-[var(--btn-content)]">
								<Icon
									icon="fa7-solid:arrow-rotate-left"
									class="text-[0.875rem]"
								/>
							</div>
						</button>
					</div>
					<div class="flex items-center gap-2">
						<div
							id="hueValue"
							class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center font-bold text-sm items-center text-[var(--btn-content)]"
						>
							{hue}
						</div>
						<div
							class="h-7 w-7 rounded-full"
							style={`background: ${currentPaletteColor}; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text-primary) 20%, transparent)`}
							aria-hidden="true"
						></div>
					</div>
				</div>
				<div
					class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none"
				>
					<input
						aria-label={i18n(I18nKey.themeColor)}
						type="range"
						min="0"
						max="360"
						bind:value={hue}
						class="slider"
						id="colorSlider"
						step="5"
						style="width: 100%"
					/>
				</div>
			</div>
		{/if}

		{#if showPaletteStyle}
			<div class="settings-section mt-3 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.themePalette)}
				</div>
				<div class="theme-option-grid" role="radiogroup" aria-label={i18n(I18nKey.themePalette)}>
					{#each palettePreviews as preview, index (preview.style)}
						<button
							type="button"
							class="theme-option m3-style-cell"
							class:selected={paletteStyle === preview.style}
							role="radio"
							aria-checked={paletteStyle === preview.style}
							aria-pressed={paletteStyle === preview.style}
							aria-label={i18n(paletteLabelKey(preview.style))}
							title={i18n(paletteLabelKey(preview.style))}
							data-theme-control
							onkeydown={(event) =>
								handleOptionKeydown(event, index, MATERIAL_PALETTE_STYLES.length)}
							onclick={() => switchPaletteStyle(preview.style)}
						>
							<span class="theme-option__dots" aria-hidden="true">
								<span class="m3-style-cell__dot" style={`background: ${preview.colors.primary}`} />
								<span class="m3-style-cell__dot" style={`background: ${preview.colors.secondary}`} />
								<span class="m3-style-cell__dot" style={`background: ${preview.colors.tertiary}`} />
							</span>
							<span class="theme-option__label m3-style-cell__name">{i18n(paletteLabelKey(preview.style))}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}



		</section>

		<section class="settings-group settings-group--interface">
			<div class="settings-group__header">
				<span>{i18n(I18nKey.settingsWallpaper)}</span>
			</div>
		<!-- Wallpaper Mode Section -->
		{#if showWallpaperModeSwitch}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.wallpaperMode)}
					<button
						aria-label="Reset to Default"
						class="btn-regular w-7 h-7 rounded-md active:scale-95"
						class:opacity-0={wallpaperMode === defaultWallpaperMode}
						class:pointer-events-none={wallpaperMode ===
							defaultWallpaperMode}
						onclick={resetWallpaperMode}
					>
						<div class="text-[var(--btn-content)]">
							<Icon
								icon="fa7-solid:arrow-rotate-left"
								class="text-[0.875rem]"
							/>
						</div>
					</button>
				</div>
				<div class="flex gap-2">
					<button
						class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
						class:opacity-60={wallpaperMode !== WALLPAPER_BANNER}
						class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode ===
							WALLPAPER_BANNER}
						onclick={() => switchWallpaperMode(WALLPAPER_BANNER)}
					>
						<Icon
							icon="material-symbols:image-outline"
							class="text-[1.25rem] shrink-0"
						/>
						<span class="text-xs font-medium"
							>{i18n(I18nKey.wallpaperBanner)}</span
						>
					</button>
					<button
						class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
						class:opacity-60={wallpaperMode !==
							WALLPAPER_FULLSCREEN}
						class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode ===
							WALLPAPER_FULLSCREEN}
						onclick={() =>
							switchWallpaperMode(WALLPAPER_FULLSCREEN)}
					>
						<Icon
							icon="material-symbols:wallpaper"
							class="text-[1.25rem] shrink-0"
						/>
						<span class="text-xs font-medium"
							>{i18n(I18nKey.wallpaperFullscreen)}</span
						>
					</button>
				</div>
				<div class="flex gap-2 mt-2">
					<button
						class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
						class:opacity-60={wallpaperMode !== WALLPAPER_OVERLAY}
						class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode ===
							WALLPAPER_OVERLAY}
						onclick={() => switchWallpaperMode(WALLPAPER_OVERLAY)}
					>
						<Icon
							icon="material-symbols:full-coverage-outline-rounded"
							class="text-[1.25rem] shrink-0"
						/>
						<span class="text-xs font-medium"
							>{i18n(I18nKey.wallpaperOverlay)}</span
						>
					</button>
					<button
						class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
						class:opacity-60={wallpaperMode !== WALLPAPER_NONE}
						class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode ===
							WALLPAPER_NONE}
						onclick={() => switchWallpaperMode(WALLPAPER_NONE)}
					>
						<Icon
							icon="material-symbols:hide-image-outline"
							class="text-[1.25rem] shrink-0"
						/>
						<span class="text-xs font-medium"
							>{i18n(I18nKey.wallpaperNone)}</span
						>
					</button>
				</div>
			</div>
		{/if}


		{#if isTextureSwitchable && wallpaperMode === WALLPAPER_NONE}
			<div class="settings-section mt-3 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.texture)}
				</div>
				<div class="theme-option-grid" role="radiogroup" aria-label={i18n(I18nKey.texture)}>
					{#each TEXTURE_PRESETS as preset, index}
						<button
							type="button"
							class="theme-option"
							class:selected={texturePreset === preset}
							role="radio"
							aria-checked={texturePreset === preset}
							aria-pressed={texturePreset === preset}
							aria-label={preset}
							title={preset}
							data-theme-control
							onkeydown={(event) =>
								handleOptionKeydown(event, index, TEXTURE_PRESETS.length)}
							onclick={() => switchTexturePreset(preset)}
						>
							<Icon icon={textureIcons[preset]} class="theme-option__icon" aria-hidden="true" />
							<span class="theme-option__label">{i18n(
								preset === "none"
									? I18nKey.textureNone
									: preset === "cyber-dots"
										? I18nKey.textureCyberDots
										: preset === "topography"
											? I18nKey.textureTopography
											: preset === "geometric"
												? I18nKey.textureGeometric
													: preset === "starlight"
														? I18nKey.textureStarlight
															: I18nKey.textureSakura,
							)}</span>
						</button>
					{/each}
				</div>
				<div class="mt-3 flex items-center justify-between gap-2">
					<label class="text-xs text-neutral-700 dark:text-neutral-300" for="texture-opacity-slider">
						{i18n(I18nKey.textureOpacity)}
					</label>
					<span class="text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
						{Math.round(textureOpacity * 100)}%
					</span>
				</div>
				<input
					id="texture-opacity-slider"
					class="slider mt-1 w-full"
					type="range"
					min="5"
					max="25"
					step="1"
					value={Math.round(textureOpacity * 100)}
					aria-label={i18n(I18nKey.textureOpacity)}
					oninput={(event) =>
						switchTextureOpacity(Number((event.currentTarget as HTMLInputElement).value) / 100)}
				/>
			</div>
		{/if}


		<!-- Layout Switch Section -->
		{#if allowLayoutSwitch}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.postListLayout)}
					<button
						aria-label="Reset to Default"
						class="btn-regular w-7 h-7 rounded-md active:scale-95"
						class:opacity-0={currentLayout ===
							effectiveDefaultLayout}
						class:pointer-events-none={currentLayout ===
							effectiveDefaultLayout}
						onclick={resetLayout}
					>
						<div class="text-[var(--btn-content)]">
							<Icon
								icon="fa7-solid:arrow-rotate-left"
								class="text-[0.875rem]"
							/>
						</div>
					</button>
				</div>
				<div class="flex gap-2">
					<button
						aria-label={i18n(I18nKey.postListLayoutList)}
						class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
						class:opacity-60={currentLayout !== "list"}
						class:bg-[var(--btn-regular-bg-hover)]={currentLayout ===
							"list"}
						disabled={isSwitching}
						onclick={switchLayout}
						title={i18n(I18nKey.postListLayoutList)}
					>
						<svg
							class="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
						</svg>
						<span class="text-xs font-medium"
							>{i18n(I18nKey.postListLayoutList)}</span
						>
					</button>
					<button
						aria-label={i18n(I18nKey.postListLayoutGrid)}
						class="flex-1 btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
						class:opacity-60={currentLayout !== "grid"}
						class:bg-[var(--btn-regular-bg-hover)]={currentLayout ===
							"grid"}
						disabled={isSwitching}
						onclick={switchLayout}
						title={i18n(I18nKey.postListLayoutGrid)}
					>
						<svg
							class="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
							/>
						</svg>
						<span class="text-xs font-medium"
							>{i18n(I18nKey.postListLayoutGrid)}</span
						>
					</button>
				</div>
			</div>
		{/if}
		</section>

		<section class="settings-group settings-group--effects">
			<div class="settings-group__header">
				<span>{i18n(I18nKey.settingsEffects)}</span>
			</div>

		<div class="settings-section mt-3 mb-2">
			<button
				type="button"
				id="reduce-motion-toggle"
				class="motion-toggle"
				role="switch"
				aria-checked={reduceMotion}
				onclick={toggleReduceMotion}
			>
				<span class="motion-toggle__icon" aria-hidden="true">
					<Icon icon="material-symbols:motion-photos-off" />
				</span>
				<span class="motion-toggle__label">{i18n(I18nKey.reduceMotion)}</span>
				<span class="setting-switch" class:active={reduceMotion} aria-hidden="true">
					<span class="setting-switch__thumb" />
				</span>
			</button>
		</div>
		<!-- Overlay Settings Section -->
		{#if wallpaperMode === WALLPAPER_OVERLAY && hasOverlaySettings}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.overlaySettings)}
					<button
						aria-label="Reset to Default"
						class="btn-regular w-7 h-7 rounded-md active:scale-95"
						class:opacity-0={overlaySettingsIsDefault}
						class:pointer-events-none={overlaySettingsIsDefault}
						onclick={resetOverlaySettings}
					>
						<div class="text-[var(--btn-content)]">
							<Icon
								icon="fa7-solid:arrow-rotate-left"
								class="text-[0.875rem]"
							/>
						</div>
					</button>
				</div>
				<div class="space-y-2">
					{#each overlaySliderItems as item (item.key)}
						{#if item.enabled}
							<div
								class="rounded-md bg-[var(--btn-regular-bg)] p-2"
							>
								<div
									class="flex items-center justify-between mb-1"
								>
									<span
										class="text-sm font-medium text-[var(--btn-content)] opacity-80"
										>{item.label}</span
									>
									<span
										class="text-xs text-[var(--btn-content)]"
										>{item.displayValue}</span
									>
								</div>
								<input
									aria-label={item.ariaLabel}
									type="range"
									min={item.min}
									max={item.max}
									step={item.step}
									value={item.value}
									oninput={(e) =>
										item.onValueChange(
											Number(
												(
													e.currentTarget as HTMLInputElement
												).value,
											),
										)}
									class="slider w-full overlay-slider"
								/>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Banner Settings Section -->
		{#if (wallpaperMode === WALLPAPER_BANNER || wallpaperMode === WALLPAPER_FULLSCREEN) && hasBannerSettings}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.wallpaperSettings)}
					<button
						aria-label="Reset to Default"
						class="btn-regular w-7 h-7 rounded-md active:scale-95"
						class:opacity-0={bannerSettingsIsDefault}
						class:pointer-events-none={bannerSettingsIsDefault}
						onclick={resetBannerSettings}
					>
						<div class="text-[var(--btn-content)]">
							<Icon
								icon="fa7-solid:arrow-rotate-left"
								class="text-[0.875rem]"
							/>
						</div>
					</button>
				</div>
				<div class="space-y-1">
					<!-- Banner Title Switch -->
					{#if isBannerTitleSwitchable}
						<button
							class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
							class:bg-[var(--btn-regular-bg-hover)]={bannerTitleEnabled}
							onclick={toggleBannerTitleEnabled}
						>
							<Icon
								icon="material-symbols:titlecase-rounded"
								class="text-[1.25rem] shrink-0"
							/>
							<span class="text-sm flex-1"
								>{i18n(I18nKey.wallpaperBannerTitle)}</span
							>
							<div
								class="w-10 h-5 rounded-full transition-all duration-200 relative"
								class:bg-[var(--primary)]={bannerTitleEnabled}
								class:bg-[var(--btn-regular-bg-active)]={!bannerTitleEnabled}
							>
								<div
									class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
									class:left-0.5={!bannerTitleEnabled}
									class:left-5={bannerTitleEnabled}
								></div>
							</div>
						</button>
					{/if}
					<!-- Banner Carousel Switch -->
					{#if isBannerCarouselSwitchable}
						<button
							class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
							class:bg-[var(--btn-regular-bg-hover)]={bannerCarouselEnabled}
							onclick={toggleBannerCarouselEnabled}
						>
							<Icon
								icon="material-symbols:view-carousel-outline"
								class="text-[1.25rem] shrink-0"
							/>
							<span class="text-sm flex-1"
								>{i18n(I18nKey.wallpaperCarousel)}</span
							>
							<div
								class="w-10 h-5 rounded-full transition-all duration-200 relative"
								class:bg-[var(--primary)]={bannerCarouselEnabled}
								class:bg-[var(--btn-regular-bg-active)]={!bannerCarouselEnabled}
							>
								<div
									class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
									class:left-0.5={!bannerCarouselEnabled}
									class:left-5={bannerCarouselEnabled}
								></div>
							</div>
						</button>
					{/if}
					<!-- Waves Animation Switch -->
					{#if isWavesSwitchable}
						<button
							class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
							class:bg-[var(--btn-regular-bg-hover)]={wavesEnabled}
							onclick={toggleWavesEnabled}
						>
							<Icon
								icon="material-symbols:airwave-rounded"
								class="text-[1.25rem] shrink-0"
							/>
							<span class="text-sm flex-1"
								>{i18n(I18nKey.wavesAnimation)}</span
							>
							<div
								class="w-10 h-5 rounded-full transition-all duration-200 relative"
								class:bg-[var(--primary)]={wavesEnabled}
								class:bg-[var(--btn-regular-bg-active)]={!wavesEnabled}
							>
								<div
									class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
									class:left-0.5={!wavesEnabled}
									class:left-5={wavesEnabled}
								></div>
							</div>
						</button>
					{/if}
					<!-- Gradient Transition Switch -->
					{#if isGradientSwitchable}
						<button
							class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
							class:bg-[var(--btn-regular-bg-hover)]={gradientEnabled}
							onclick={toggleGradientEnabled}
						>
							<Icon
								icon="material-symbols:gradient"
								class="text-[1.25rem] shrink-0"
							/>
							<span class="text-sm flex-1"
								>{i18n(I18nKey.gradientTransition)}</span
							>
							<div
								class="w-10 h-5 rounded-full transition-all duration-200 relative"
								class:bg-[var(--primary)]={gradientEnabled}
								class:bg-[var(--btn-regular-bg-active)]={!gradientEnabled}
							>
								<div
									class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
									class:left-0.5={!gradientEnabled}
									class:left-5={gradientEnabled}
								></div>
							</div>
						</button>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Effects Settings Section -->
		{#if isSakuraSwitchable && wallpaperMode === WALLPAPER_NONE}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.effectsSettings)}
					<button
						aria-label="Reset to Default"
						class="btn-regular w-7 h-7 rounded-md active:scale-95"
						class:opacity-0={sakuraEnabled === defaultSakuraEnabled}
						class:pointer-events-none={sakuraEnabled ===
							defaultSakuraEnabled}
						onclick={() => {
							sakuraEnabled = defaultSakuraEnabled;
							setSakuraEnabled(defaultSakuraEnabled);
						}}
					>
						<div class="text-[var(--btn-content)]">
							<Icon
								icon="fa7-solid:arrow-rotate-left"
								class="text-[0.875rem]"
							/>
						</div>
					</button>
				</div>
				<div class="space-y-1">
					<button
						class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
						class:bg-[var(--btn-regular-bg-hover)]={sakuraEnabled}
						onclick={toggleSakuraEnabled}
					>
						<Icon
							icon="mdi:flower-poppy"
							class="text-[1.25rem] shrink-0"
						/>
						<span class="text-sm flex-1"
							>{i18n(I18nKey.sakuraEffect)}</span
						>
						<div
							class="w-10 h-5 rounded-full transition-all duration-200 relative"
							class:bg-[var(--primary)]={sakuraEnabled}
							class:bg-[var(--btn-regular-bg-active)]={!sakuraEnabled}
						>
							<div
								class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
								class:left-0.5={!sakuraEnabled}
								class:left-5={sakuraEnabled}
							></div>
						</div>
					</button>
				</div>
			</div>
		{/if}

		<!-- Sticky Navbar Section -->
		<div class="settings-section mt-2 mb-2">
			<div
				class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
			>
				{i18n(I18nKey.stickyNavbar)}
				<button
					aria-label="Reset to Default"
					class="btn-regular w-7 h-7 rounded-md active:scale-95"
					class:opacity-0={stickyNavbarEnabled ===
						defaultStickyNavbar}
					class:pointer-events-none={stickyNavbarEnabled ===
						defaultStickyNavbar}
					onclick={() => {
						stickyNavbarEnabled = defaultStickyNavbar;
						setStickyNavbar(defaultStickyNavbar);
					}}
				>
					<div class="text-[var(--btn-content)]">
						<Icon
							icon="fa7-solid:arrow-rotate-left"
							class="text-[0.875rem]"
						/>
					</div>
				</button>
			</div>
			<div class="space-y-1">
				<button
					class="w-full btn-regular rounded-md py-2 px-3 flex items-center gap-3 text-left active:scale-95 transition-all relative overflow-hidden"
					class:bg-[var(--btn-regular-bg-hover)]={stickyNavbarEnabled}
					onclick={toggleStickyNavbar}
				>
					<Icon
						icon="material-symbols:push-pin-outline"
						class="text-[1.25rem] shrink-0"
					/>
					<span class="text-sm flex-1"
						>{i18n(I18nKey.stickyNavbar)}</span
					>
					<div
						class="w-10 h-5 rounded-full transition-all duration-200 relative"
						class:bg-[var(--primary)]={stickyNavbarEnabled}
						class:bg-[var(--btn-regular-bg-active)]={!stickyNavbarEnabled}
					>
						<div
							class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
							class:left-0.5={!stickyNavbarEnabled}
							class:left-5={stickyNavbarEnabled}
						></div>
					</div>
				</button>
			</div>
		</div>

		<!-- Font Selector Section -->
		{#if isFontSwitchable && fontConfig?.fonts}
			<div class="settings-section mt-2 mb-2">
				<div
					class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2"
				>
					{i18n(I18nKey.fontSelector)}
					<button
						aria-label="Reset to Default"
						class="btn-regular w-7 h-7 rounded-md active:scale-95"
						class:opacity-0={currentFont === defaultFont}
						class:pointer-events-none={currentFont === defaultFont}
						onclick={resetFont}
					>
						<div class="text-[var(--btn-content)]">
							<Icon
								icon="fa7-solid:arrow-rotate-left"
								class="text-[0.875rem]"
							/>
						</div>
					</button>
				</div>
				<div class="grid grid-cols-2 gap-2">
					{#each fontConfig.fonts as font}
						<button
							class="btn-regular rounded-md py-2 px-3 flex items-center justify-center gap-2 active:scale-95 transition-all relative overflow-hidden"
							class:opacity-60={currentFont !== font.id}
							class:bg-[var(--btn-regular-bg-hover)]={currentFont ===
								font.id}
							onclick={() => switchFont(font.id)}
						>
							<Icon
								icon="material-symbols:font-download-outline"
								class="text-[1.25rem] shrink-0"
							/>
							<span class="text-xs font-medium"
								>{i18n(font.i18nKey as I18nKey) ||
									font.name}</span
							>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		</section>
	</div>
{/if}

<style>
	#display-setting input[type="range"] {
		-webkit-appearance: none;
		height: 1.5rem;
		border-radius: 999px;
		background-image: linear-gradient(
			90deg,
			var(--primary) 0 var(--range-progress, 50%),
			color-mix(in srgb, var(--primary) 18%, transparent) var(--range-progress, 50%) 100%
		);
		transition: background-image 0.15s ease-in-out;
	}

	#display-setting {
		max-height: min(42rem, calc(100dvh - 5.75rem));
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--primary) 45%, transparent) transparent;
	}

	.settings-section {
		padding: 0.4rem 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	.settings-section + .settings-section {
		margin-top: 0.35rem;
		padding-top: 0.75rem;
		border-top: 1px solid color-mix(in srgb, var(--text-primary) 9%, transparent);
	}

	.settings-group {
		margin-top: 0.65rem;
		padding: 0.65rem 0.75rem 0.75rem;
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--card-bg) 82%, var(--page-bg));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text-primary) 8%, transparent);
	}

	.settings-group__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.15rem 0.25rem 0.5rem;
		color: var(--text-secondary);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.settings-group__header::before {
		content: "";
		width: 0.2rem;
		height: 0.9rem;
		border-radius: 999px;
		background: var(--primary);
	}

	.theme-option-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.25rem;
	}

	.theme-option {
		min-width: 0;
		min-height: 3.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		padding: 0.55rem 0.35rem;
		border: 0;
		border-radius: 0.65rem;
		background: transparent;
		color: var(--text-secondary);
		font-size: 0.72rem;
		cursor: pointer;
		user-select: none;
		transition: background 150ms ease, color 150ms ease, transform 150ms ease;
	}

	.theme-option:hover {
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		color: var(--text-primary);
	}

	.theme-option:active {
		transform: scale(0.97);
	}

	.theme-option.selected {
		background: var(--mc-secondary-container, var(--btn-regular-bg));
		box-shadow: none;
		color: var(--mc-on-secondary-container, var(--btn-content));
	}

	.theme-option__icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.theme-option__dots {
		display: flex;
		gap: 0.25rem;
	}

	.m3-style-cell__dot {
		width: 0.625rem;
		height: 0.625rem;
		border-radius: 999px;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text-primary) 20%, transparent);
	}

	.theme-option__label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.65rem;
		line-height: 1;
		text-transform: capitalize;
	}

	.motion-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.4rem 0.25rem;
		border: 0;
		border-radius: 0.55rem;
		background: transparent;
		color: var(--text-primary);
		text-align: left;
		transition: border-color 150ms ease, background 150ms ease;
	}

	.motion-toggle:hover {
		background: color-mix(in srgb, var(--text-primary) 7%, transparent);
	}

	.motion-toggle__icon {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 0.45rem;
		background: color-mix(in srgb, var(--primary) 14%, transparent);
		color: var(--primary);
		font-size: 1.1rem;
	}

	.motion-toggle__label {
		flex: 1;
		font-size: 0.82rem;
		font-weight: 600;
	}

	.setting-switch {
		position: relative;
		width: 2.25rem;
		height: 1.25rem;
		flex: 0 0 auto;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-primary) 22%, transparent);
		transition: background 150ms ease;
	}

	.setting-switch.active {
		background: var(--primary);
	}

	.setting-switch__thumb {
		position: absolute;
		top: 0.2rem;
		left: 0.2rem;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		background: var(--card-bg);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
		transition: transform 150ms ease;
	}

	.setting-switch.active .setting-switch__thumb {
		transform: translateX(1rem);
	}

	#display-setting button:focus-visible,
	#display-setting input:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		#display-setting {
			right: 0.75rem;
			max-height: calc(100dvh - 5rem);
		}
	}

	#display-setting input[type="range"].overlay-slider {
		height: 0.85rem;
	}

	/* Input Thumb */
	#display-setting input[type="range"].overlay-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 0;
		width: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	#display-setting input[type="range"].overlay-slider::-moz-range-thumb {
		height: 0;
		width: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	#display-setting input[type="range"].overlay-slider::-ms-thumb {
		-webkit-appearance: none;
		height: 0;
		width: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	#display-setting #colorSlider {
		background-image: var(--color-selection-bar);
		transition: background-image 0.15s ease-in-out;
	}

	#display-setting #colorSlider::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 1rem;
		width: 0.5rem;
		border-radius: 0.125rem;
		background: rgba(255, 255, 255, 0.7);
		box-shadow: none;
	}

	#display-setting #colorSlider::-webkit-slider-thumb:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	#display-setting #colorSlider::-webkit-slider-thumb:active {
		background: rgba(255, 255, 255, 0.6);
	}

	#display-setting #colorSlider::-moz-range-thumb {
		-webkit-appearance: none;
		height: 1rem;
		width: 0.5rem;
		border-radius: 0.125rem;
		border-width: 0;
		background: rgba(255, 255, 255, 0.7);
		box-shadow: none;
	}

	#display-setting #colorSlider::-moz-range-thumb:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	#display-setting #colorSlider::-moz-range-thumb:active {
		background: rgba(255, 255, 255, 0.6);
	}

	#display-setting #colorSlider::-ms-thumb {
		-webkit-appearance: none;
		height: 1rem;
		width: 0.5rem;
		border-radius: 0.125rem;
		background: rgba(255, 255, 255, 0.7);
		box-shadow: none;
	}

	#display-setting #colorSlider::-ms-thumb:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	#display-setting #colorSlider::-ms-thumb:active {
		background: rgba(255, 255, 255, 0.6);
	}
</style>
