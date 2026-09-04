import {
	BANNER_HEIGHT_EXTEND,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	SYSTEM_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import { getFontFamily, getFontStylesheets } from "@utils/font-utils";
import {
	backgroundWallpaperConfig,
	effectsConfig,
	expressiveCodeConfig,
	fontConfig,
	siteConfig,
} from "@/config";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";

function isHomePage(pathname: string): boolean {
	return pathname === "/" || pathname === "";
}

// Declare global functions
declare global {
	interface Window {
		initSemifullScrollDetection?: () => void;
		semifullScrollHandler?: () => void;
	}
}

export function getDefaultHue(): number {
	const fallback = "250";
	// Check if in browser environment
	if (typeof document === "undefined") {
		return Number.parseInt(fallback, 10);
	}
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getDefaultTheme(): LIGHT_DARK_MODE {
	// If config has defaultMode, use that
	// Otherwise use DEFAULT_THEME (backward compatibility)
	return siteConfig.themeColor.defaultMode ?? DEFAULT_THEME;
}

// Get system theme
export function getSystemTheme(): LIGHT_DARK_MODE {
	if (typeof window === "undefined") {
		return LIGHT_MODE;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? DARK_MODE
		: LIGHT_MODE;
}

// Resolve theme (if system mode, get system theme)
export function resolveTheme(theme: LIGHT_DARK_MODE): LIGHT_DARK_MODE {
	if (theme === SYSTEM_MODE) {
		return getSystemTheme();
	}
	return theme;
}

export function getHue(): number {
	// Check global object first
	if (typeof window === "undefined" || !window.localStorage) {
		return getDefaultHue();
	}
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	// Check if in browser environment first
	if (
		typeof window === "undefined" ||
		!window.localStorage ||
		typeof document === "undefined"
	) {
		return;
	}
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// Check if in browser environment
	if (typeof document === "undefined") {
		return;
	}

	// Resolve theme
	const resolvedTheme = resolveTheme(theme);

	// Get complete info about current theme state
	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");

	// Calculate target theme state
	let targetIsDark = false; // Initialize default value
	switch (resolvedTheme) {
		case LIGHT_MODE:
			targetIsDark = false;
			break;
		case DARK_MODE:
			targetIsDark = true;
			break;
		default:
			// Handle default case, use current theme state
			targetIsDark = currentIsDark;
			break;
	}

	// Detect if theme switch is actually needed:
	// 1. If dark class state changes
	// 2. If expressiveCode theme needs update
	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark
		? expressiveCodeConfig.darkTheme
		: expressiveCodeConfig.lightTheme;
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	// If neither theme switch nor code theme update needed, return directly
	if (!needsThemeChange && !needsCodeThemeUpdate) {
		return;
	}

	// Batch DOM operations, reduce repaints
	if (needsThemeChange) {
		// Add transition protection class (but causes many repaints, so use lighter approach)
		// document.documentElement.classList.add("is-theme-transitioning");

		// Switch theme directly, use CSS variable features for browser optimized transitions
		if (targetIsDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}

	// Set theme for Expressive Code based on current mode
	if (needsCodeThemeUpdate) {
		document.documentElement.setAttribute("data-theme", expectedTheme);
	}
}

// System theme listener reference
let systemThemeListener:
	| ((e: MediaQueryListEvent | MediaQueryList) => void)
	| null = null;

export function setTheme(
	theme: LIGHT_DARK_MODE,
	clickCoords?: { x: number; y: number },
): void {
	// Check if in browser environment
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}

	// Resolve the target theme to check if dark mode will change
	const resolvedTheme = resolveTheme(theme);
	const currentIsDark =
		typeof document !== "undefined" &&
		document.documentElement.classList.contains("dark");
	const targetIsDark = resolvedTheme === DARK_MODE;

	if (
		currentIsDark !== targetIsDark &&
		typeof document !== "undefined" &&
		document.startViewTransition
	) {
		// Use View Transition API for animated theme switch
		const root = document.documentElement;
		root.classList.add("is-theme-transitioning", "use-view-transition");

		if (targetIsDark) {
			root.classList.add("going-dark");
		}

		const transition = document.startViewTransition(() => {
			applyThemeToDocument(theme);
		});

		// Apply circular clip animation if click coordinates provided
		if (clickCoords) {
			const { x, y } = clickCoords;
			const endRadius = Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y),
			);
			const isDark = targetIsDark;
			transition.ready.then(() => {
				const clipPath = isDark
					? [
							`circle(0px at ${x}px ${y}px)`,
							`circle(${endRadius}px at ${x}px ${y}px)`,
						]
					: [
							`circle(${endRadius}px at ${x}px ${y}px)`,
							`circle(0px at ${x}px ${y}px)`,
						];
				document.documentElement.animate(
					{
						clipPath,
					},
					{
						duration: 500,
						easing: "ease-in-out",
						pseudoElement: isDark
							? "::view-transition-new(root)"
							: "::view-transition-old(root)",
					},
				);
			});
		}

		transition.finished.then(() => {
			root.classList.remove(
				"is-theme-transitioning",
				"use-view-transition",
				"going-dark",
			);
		});
	} else {
		// Fallback: apply theme directly without animation
		applyThemeToDocument(theme);
	}

	// Save to localStorage
	localStorage.setItem("theme", theme);

	// If switching to system mode, need to listen to system theme changes
	if (theme === SYSTEM_MODE) {
		setupSystemThemeListener();
	} else {
		// If switching to other modes, remove system theme listener
		cleanupSystemThemeListener();
	}
}

// Setup system theme listener
export function setupSystemThemeListener() {
	// Clean up previous listener first
	cleanupSystemThemeListener();

	if (typeof window === "undefined") {
		return;
	}

	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	// Handle system theme change callback
	const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
		const isDark = e.matches;
		const currentIsDark = document.documentElement.classList.contains("dark");

		// If theme state hasn't changed, return directly
		if (currentIsDark === isDark) {
			return;
		}

		// Apply system theme directly, don't use transition protection class to avoid many repaints
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// Set theme for Expressive Code
		const expressiveTheme = isDark
			? expressiveCodeConfig.darkTheme
			: expressiveCodeConfig.lightTheme;
		document.documentElement.setAttribute("data-theme", expressiveTheme);

		// Dispatch custom event to notify other components (only when actually switching)
		window.dispatchEvent(new CustomEvent("theme-change"));
	};

	// Call immediately to set initial state
	handleSystemThemeChange(mediaQuery);

	// Listen to system theme changes
	mediaQuery.addEventListener("change", handleSystemThemeChange);

	systemThemeListener = handleSystemThemeChange;
}

// Clean up system theme listener
function cleanupSystemThemeListener() {
	if (typeof window === "undefined" || !systemThemeListener) {
		return;
	}

	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	mediaQuery.removeEventListener("change", systemThemeListener);

	systemThemeListener = null;
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	// Check if in browser environment
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultTheme();
	}
	return (
		(localStorage.getItem("theme") as LIGHT_DARK_MODE) || getDefaultTheme()
	);
}

// Initialize theme listener (used after page loads)
export function initThemeListener() {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return;
	}

	const theme = getStoredTheme();

	// If theme is system mode, need to listen to system theme changes
	if (theme === SYSTEM_MODE) {
		setupSystemThemeListener();
	}
}

// Wallpaper mode functions
export function applyWallpaperModeToDocument(
	mode: WALLPAPER_MODE,
	animate = true,
) {
	// Get current wallpaper mode
	const currentMode =
		(document.documentElement.getAttribute(
			"data-wallpaper-mode",
		) as WALLPAPER_MODE) || backgroundWallpaperConfig.mode?.defaultMode;

	// If mode hasn't changed, return directly
	if (currentMode === mode) {
		// Even for same mode, ensure UI state is correct
		ensureWallpaperState(mode);
		return;
	}

	// Add transition protection class
	document.documentElement.classList.add("is-wallpaper-transitioning");

	// Update data attribute
	document.documentElement.setAttribute("data-wallpaper-mode", mode);

	// Use requestAnimationFrame to ensure execution in next frame, avoid flicker
	requestAnimationFrame(() => {
		const body = document.body;

		// Remove all wallpaper related CSS classes
		body.classList.remove(
			"enable-banner",
			"wallpaper-transparent",
			"no-banner-layout",
			"no-banner-mode",
			"fullscreen-banner",
		);

		// Add corresponding CSS class based on mode
		switch (mode) {
			case WALLPAPER_BANNER:
				body.classList.add("enable-banner");
				showBannerMode(true);
				break;
			case WALLPAPER_FULLSCREEN:
				body.classList.remove(
					"wallpaper-transparent",
					"no-banner-layout",
					"no-banner-mode",
				);
				body.classList.add("enable-banner", "fullscreen-banner");
				showFullscreenMode(animate);
				break;
			case WALLPAPER_OVERLAY:
				body.classList.add("wallpaper-transparent");
				body.classList.add("no-banner-layout");
				body.classList.add("no-banner-mode");
				showOverlayMode();
				break;
			case WALLPAPER_NONE:
				body.classList.add("no-banner-layout");
				body.classList.add("no-banner-mode");
				hideAllWallpapers();
				break;
			default:
				body.classList.add("no-banner-layout");
				body.classList.add("no-banner-mode");
				hideAllWallpapers();
				break;
		}

		// Update navbar transparency mode
		updateNavbarTransparency(mode);

		// Remove transition protection class in next frame
		requestAnimationFrame(() => {
			document.documentElement.classList.remove("is-wallpaper-transitioning");
		});
	});
}

// Ensure wallpaper state is correct
function ensureWallpaperState(mode: WALLPAPER_MODE) {
	const body = document.body;

	// Remove all wallpaper related CSS classes
	body.classList.remove(
		"enable-banner",
		"wallpaper-transparent",
		"no-banner-layout",
		"no-banner-mode",
		"fullscreen-banner",
	);

	// Add corresponding CSS class based on mode
	switch (mode) {
		case WALLPAPER_BANNER:
			body.classList.add("enable-banner");
			showBannerMode();
			break;
		case WALLPAPER_FULLSCREEN:
			body.classList.remove(
				"wallpaper-transparent",
				"no-banner-layout",
				"no-banner-mode",
			);
			body.classList.add("enable-banner", "fullscreen-banner");
			showFullscreenMode();
			break;
		case WALLPAPER_OVERLAY:
			body.classList.add("wallpaper-transparent");
			body.classList.add("no-banner-layout");
			body.classList.add("no-banner-mode");
			showOverlayMode();
			break;
		case WALLPAPER_NONE:
			body.classList.add("no-banner-layout");
			body.classList.add("no-banner-mode");
			hideAllWallpapers();
			break;
	}

	// Update navbar transparency mode
	updateNavbarTransparency(mode);
}

function showBannerMode(animate = false) {
	// Show wallpaper-wrapper and switch to banner mode
	const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
	const fullscreenWallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement | null;

	// Hide fullscreen wallpaper
	if (fullscreenWallpaper) {
		fullscreenWallpaper.style.display = "none";
	}
	if (wallpaperWrapper) {
		// Remove overlay and fullscreen wallpaper mode classes
		wallpaperWrapper.classList.remove("wallpaper-overlay");
		wallpaperWrapper.classList.remove("wallpaper-fullscreen");

		// Restore banner mode top position (needed to offset translateY on homepage)
		wallpaperWrapper.style.top = `-${BANNER_HEIGHT_EXTEND}vh`;
		// Clear inline transform:none left by fullscreen mode, so CSS translateY takes over
		wallpaperWrapper.style.removeProperty("transform");

		// Check if currently on homepage
		const isHome = isHomePage(window.location.pathname);
		const isMobile = window.innerWidth < 1024;

		// On mobile non-homepage, don't show banner; on desktop always show
		if (isMobile && !isHome) {
			wallpaperWrapper.style.display = "none";
			wallpaperWrapper.classList.add("mobile-hide-banner");
		} else {
			// Homepage or desktop: set display first, then use requestAnimationFrame to ensure rendering
			wallpaperWrapper.style.display = "block";
			wallpaperWrapper.style.setProperty("display", "block", "important");
			requestAnimationFrame(() => {
				wallpaperWrapper.classList.remove("hidden");
				wallpaperWrapper.classList.remove("opacity-0");
				wallpaperWrapper.classList.add("opacity-100");
				wallpaperWrapper.classList.remove("mobile-hide-banner");
			});
		}
	}

	// Show banner homepage text (if enabled and on homepage)
	const bannerTextOverlay = document.querySelector(
		".banner-text-overlay",
	) as HTMLElement | null;
	if (bannerTextOverlay) {
		// Check if homeText is enabled
		const homeTextEnabled = siteConfig.banner.bannerHomeText?.enable;

		// Check if currently on homepage
		const isHome = isHomePage(window.location.pathname);

		// Only show if enabled and on homepage
		if (homeTextEnabled && isHome) {
			bannerTextOverlay.classList.remove("hidden");
		} else {
			bannerTextOverlay.classList.add("hidden");
		}
		// Reset fullscreen mode downward transform
		bannerTextOverlay.style.transition = "";
		bannerTextOverlay.style.transform = "";
	}

	// Adjust main content position
	adjustMainContentPosition("banner", animate);

	// Handle mobile non-homepage main content area position
	const mainContentWrapper = document.querySelector(
		".w-full.z-30.pointer-events-none",
	);
	if (mainContentWrapper) {
		const isHome = isHomePage(window.location.pathname);
		const isMobile = window.innerWidth < 1024;
		// Only adjust main content position on mobile non-homepage
		if (isMobile && !isHome) {
			mainContentWrapper.classList.add("mobile-main-no-banner");
		} else {
			mainContentWrapper.classList.remove("mobile-main-no-banner");
		}
	}

	// Remove transparency (banner mode doesn't use transparency)
	adjustMainContentTransparency(false);

	// Adjust navbar transparency
	const navbar = document.getElementById("navbar");
	if (navbar) {
		// Get navbar transparency mode config (banner mode)
		const transparentMode = siteConfig.banner.navbar?.transparentMode || "semi";
		navbar.setAttribute("data-transparent-mode", transparentMode);

		// Reinitialize semifull mode scroll detection (if needed)
		if (
			transparentMode === "semifull" &&
			typeof window.initSemifullScrollDetection === "function"
		) {
			window.initSemifullScrollDetection();
		}
	}
}

function showFullscreenMode(animate = false) {
	// Fullscreen mode uses the dedicated fullscreen image source.
	const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
	const fullscreenWallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement | null;

	if (fullscreenWallpaper) {
		fullscreenWallpaper.style.display = "block";
	}

	if (wallpaperWrapper) {
		wallpaperWrapper.style.display = "none";
		wallpaperWrapper.classList.remove(
			"wallpaper-overlay",
			"wallpaper-fullscreen",
		);
	}

	// Hide banner text overlay in fullscreen mode
	const bannerTextOverlay = document.querySelector(
		".banner-text-overlay",
	) as HTMLElement | null;
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	adjustMainContentPosition("fullscreen", animate);
	adjustMainContentTransparency(false);
}

function showOverlayMode() {
	// Overlay mode is a compact card and must not also enable the fullscreen layer.
	const fullscreenWallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement | null;
	if (fullscreenWallpaper) {
		fullscreenWallpaper.style.display = "none";
	}

	const overlayWallpaper = document.querySelector(
		"[data-overlay-wallpaper]",
	) as HTMLElement | null;
	if (overlayWallpaper) {
		overlayWallpaper.style.display = "block";
	}

	const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
	if (wallpaperWrapper) {
		wallpaperWrapper.style.display = "none";
	}

	// Hide banner homepage text
	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	// Adjust main content transparency
	adjustMainContentTransparency(true);

	// Adjust layout to compact mode
	adjustMainContentPosition("overlay");
}

function hideAllWallpapers() {
	// Hide wallpaper
	const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
	const fullscreenWallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement | null;

	if (fullscreenWallpaper) {
		fullscreenWallpaper.style.display = "none";
	}
	const overlayWallpaper = document.querySelector(
		"[data-overlay-wallpaper]",
	) as HTMLElement | null;
	if (overlayWallpaper) {
		overlayWallpaper.style.display = "none";
	}

	if (wallpaperWrapper) {
		wallpaperWrapper.style.display = "none";
		wallpaperWrapper.classList.add("hidden");
		wallpaperWrapper.classList.add("opacity-0");
		wallpaperWrapper.classList.remove("wallpaper-overlay");
		wallpaperWrapper.classList.remove("wallpaper-fullscreen");
	}

	// Hide banner homepage text
	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	// Adjust main content position and transparency
	adjustMainContentPosition("none");
	adjustMainContentTransparency(false);
}

function updateNavbarTransparency(mode: WALLPAPER_MODE) {
	const navbar = document.getElementById("navbar");
	if (!navbar) {
		return;
	}

	let transparentMode: string;
	let enableBlur: boolean;
	let blurAmount: number;

	// Set navbar transparency mode and blur effect based on current wallpaper mode
	if (mode === WALLPAPER_OVERLAY) {
		// Fullscreen transparency mode
		transparentMode = "none";
		enableBlur = false;
		blurAmount = 0;
	} else if (mode === WALLPAPER_NONE) {
		// Solid background mode
		transparentMode = "none";
		enableBlur = false;
		blurAmount = 0;
	} else if (mode === WALLPAPER_FULLSCREEN) {
		// Fullscreen wallpaper mode: use fullscreen configured transparency mode and blur effect
		transparentMode =
			backgroundWallpaperConfig.fullscreen?.navbar?.transparentMode ||
			siteConfig.banner.navbar?.transparentMode ||
			"semi";
		enableBlur =
			backgroundWallpaperConfig.fullscreen?.navbar?.enableBlur ??
			siteConfig.banner.navbar?.enableBlur ??
			true;
		blurAmount =
			backgroundWallpaperConfig.fullscreen?.navbar?.blur ??
			siteConfig.banner.navbar?.blur ??
			20;
	} else {
		// Banner mode: use configured transparency mode and blur effect
		transparentMode = siteConfig.banner.navbar?.transparentMode || "semi";
		enableBlur = siteConfig.banner.navbar?.enableBlur ?? true;
		blurAmount = siteConfig.banner.navbar?.blur ?? 20;
	}

	// Update navbar transparency mode attribute
	navbar.setAttribute("data-transparent-mode", transparentMode);
	navbar.setAttribute("data-enable-blur", String(enableBlur));
	navbar.style.setProperty("--navbar-glass-blur", `${blurAmount}px`);

	// Remove existing transparency mode classes
	navbar.classList.remove(
		"navbar-transparent-semi",
		"navbar-transparent-full",
		"navbar-transparent-semifull",
	);

	// Remove scrolled class
	navbar.classList.remove("scrolled");

	// Scroll detection feature
	if (
		transparentMode === "semifull" &&
		(mode === WALLPAPER_BANNER || mode === WALLPAPER_FULLSCREEN) &&
		typeof window.initSemifullScrollDetection === "function"
	) {
		// Enable scroll detection in Banner and Fullscreen wallpaper mode semifull
		window.initSemifullScrollDetection();
	} else if (window.semifullScrollHandler) {
		// Remove scroll listener
		window.removeEventListener("scroll", window.semifullScrollHandler);
		delete window.semifullScrollHandler;
	}
}

// Track setTimeout for fullscreen mode animation, need to cancel when switching quickly
let fullscreenAnimationTimeout: ReturnType<typeof setTimeout> | null = null;

function adjustMainContentPosition(
	mode: WALLPAPER_MODE | "banner" | "none" | "overlay" | "fullscreen",
	animate = false,
) {
	const mainContent = document.querySelector(
		".w-full.z-30.pointer-events-none",
	) as HTMLElement;
	if (!mainContent) {
		return;
	}

	// Cancel previous fullscreen mode animation setTimeout to avoid race condition when switching quickly
	if (fullscreenAnimationTimeout) {
		clearTimeout(fullscreenAnimationTimeout);
		fullscreenAnimationTimeout = null;
	}

	// Remove existing position classes
	mainContent.classList.remove("mobile-main-no-banner", "no-banner-layout");

	switch (mode) {
		case "banner": {
			// Banner mode: main content is below banner
			const isHome = isHomePage(window.location.pathname);
			const bannerTargetTop = "calc(var(--banner-height) - 3rem)";

			// Disable CSS transition to avoid transition animations from value changes during entire positioning process
			mainContent.style.setProperty("transition", "none", "important");
			// Clear fullscreen mode specific inline styles (position: relative, top: 0, etc.)
			mainContent.style.position = "";
			mainContent.style.zIndex = "";
			mainContent.style.top = "";
			mainContent.style.setProperty("margin-top", "");

			if (!isHome) {
				mainContent.classList.add("mobile-main-no-banner");
				if (window.innerWidth < 1024) {
					mainContent.style.setProperty("top", "5.5rem", "important");
				} else {
					mainContent.style.setProperty("top", bannerTargetTop, "important");
				}
			} else {
				mainContent.style.setProperty("top", bannerTargetTop, "important");
			}
			const bannerGrid = document.getElementById("main-grid");
			if (bannerGrid) {
				bannerGrid.style.transform = "";
				bannerGrid.style.transition = "";
			}
			// After all positioning operations, force reflow and restore CSS transition
			void mainContent.offsetWidth;
			mainContent.style.removeProperty("transition");
			break;
		}
		case "fullscreen": {
			// Fullscreen wallpaper mode: wallpaper already takes 100vh in document flow, main content follows immediately
			const isFullscreenMobile = window.innerWidth < 1024;
			const isFullscreenHome = isHomePage(window.location.pathname);
			if (isFullscreenMobile && !isFullscreenHome) {
				// Mobile non-homepage: wallpaper already hidden, main content starts below navbar
				mainContent.classList.add("mobile-main-no-banner");
				mainContent.classList.add("no-banner-layout");
				mainContent.style.setProperty("top", "5.5rem", "important");
				mainContent.style.setProperty("margin-top", "0", "important");
				mainContent.style.position = "";
				mainContent.style.minHeight = "";
				mainContent.style.transition = "";
				break;
			}

			if (animate) {
				// Runtime switch: animate slide from current position to below wallpaper, switch to relative after completion
				const computedTop = mainContent.getBoundingClientRect().top;
				mainContent.style.transition = "none";
				mainContent.style.position = "absolute";
				mainContent.style.zIndex = "30";
				mainContent.style.setProperty("top", `${computedTop}px`, "important");
				// margin-top doesn't affect layout in absolute positioning, set final value early to avoid jump when switching to relative
				mainContent.style.setProperty("margin-top", "1rem", "important");
				mainContent.classList.add("no-banner-layout");
				void mainContent.offsetWidth;
				mainContent.style.setProperty(
					"transition",
					"top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
					"important",
				);
				mainContent.style.setProperty("top", "100vh", "important");
				fullscreenAnimationTimeout = setTimeout(() => {
					mainContent.style.transition = "none";
					mainContent.style.position = "relative";
					mainContent.style.setProperty("top", "0", "important");
					void mainContent.offsetWidth;
					mainContent.style.transition = "";
				}, 450);
			} else {
				// Initialization: set position directly, no animation needed
				mainContent.classList.add("no-banner-layout");
				mainContent.style.position = "relative";
				mainContent.style.zIndex = "30";
				mainContent.style.setProperty("top", "0", "important");
				mainContent.style.setProperty("margin-top", "1rem", "important");
				mainContent.style.transition = "";
			}
			break;
		}
		case "overlay":
			// Overlay mode: use compact layout, main content starts below navbar
			mainContent.classList.add("no-banner-layout");
			mainContent.style.setProperty("top", "5.5rem", "important");
			mainContent.style.setProperty("margin-top", "0", "important");
			mainContent.style.position = "";
			mainContent.style.minHeight = "";
			mainContent.style.transition = "";
			break;
		case "none":
			// No wallpaper mode: main content starts below navbar
			mainContent.classList.add("no-banner-layout");
			mainContent.style.setProperty("top", "5.5rem", "important");
			mainContent.style.setProperty("margin-top", "0", "important");
			mainContent.style.position = "";
			mainContent.style.minHeight = "";
			mainContent.style.transition = "";
			break;
		default:
			mainContent.style.setProperty("top", "5.5rem", "important");
			mainContent.style.position = "";
			mainContent.style.minHeight = "";
			mainContent.style.transition = "";
			break;
	}

	// Show main content after positioning is complete, avoid content flicker before wallpaper initialization during initial load
	mainContent.style.visibility = "visible";
	document.body.classList.add("wallpaper-initialized");
}

function adjustMainContentTransparency(enable: boolean) {
	const mainContent = document.querySelector(
		".w-full.z-30.pointer-events-none",
	);
	const body = document.body;

	if (enable) {
		if (mainContent) {
			mainContent.classList.add("wallpaper-transparent");
		}
		if (body) {
			body.classList.add("wallpaper-transparent");
		}
	} else {
		if (mainContent) {
			mainContent.classList.remove("wallpaper-transparent");
		}
		if (body) {
			body.classList.remove("wallpaper-transparent");
		}
	}
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	// Check if in browser environment
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	if (!(backgroundWallpaperConfig.mode?.switchable ?? true)) {
		return;
	}
	localStorage.setItem("wallpaperMode", mode);
	applyWallpaperModeToDocument(mode);
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("wallpaper-mode-change", {
				detail: { mode },
			}),
		);
	}
}

export function initWallpaperMode(): void {
	// Initialize overlay mode settings (transparency/blur/card transparency)
	applyStoredOverlaySettingsToDocument();
	const storedMode = getStoredWallpaperMode();
	applyWallpaperModeToDocument(storedMode, false);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	const defaultMode =
		backgroundWallpaperConfig.mode?.defaultMode ?? WALLPAPER_BANNER;
	// Check if in browser environment
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return defaultMode;
	}

	const isSwitchable = backgroundWallpaperConfig.mode?.switchable ?? true;
	if (!isSwitchable) {
		localStorage.removeItem("wallpaperMode");
		return defaultMode;
	}

	return (
		(localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) || defaultMode
	);
}

// Overlay settings functions
function clampNumber(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function getDefaultOverlayOpacity(): number {
	return backgroundWallpaperConfig.overlay?.opacity ?? 0.8;
}

export function getDefaultOverlayBlur(): number {
	return backgroundWallpaperConfig.overlay?.blur ?? 0;
}

export function getDefaultOverlayCardOpacity(): number {
	return backgroundWallpaperConfig.overlay?.cardOpacity ?? 0.6;
}

export function getStoredOverlayOpacity(): number {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultOverlayOpacity();
	}
	const stored = localStorage.getItem("overlayOpacity");
	if (stored === null) {
		return getDefaultOverlayOpacity();
	}
	const parsed = Number.parseFloat(stored);
	if (Number.isNaN(parsed)) {
		return getDefaultOverlayOpacity();
	}
	return clampNumber(parsed, 0, 1);
}

export function getStoredOverlayBlur(): number {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultOverlayBlur();
	}
	const stored = localStorage.getItem("overlayBlur");
	if (stored === null) {
		return getDefaultOverlayBlur();
	}
	const parsed = Number.parseFloat(stored);
	if (Number.isNaN(parsed)) {
		return getDefaultOverlayBlur();
	}
	return clampNumber(parsed, 0, 20);
}

export function getStoredOverlayCardOpacity(): number {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultOverlayCardOpacity();
	}
	const stored = localStorage.getItem("overlayCardOpacity");
	if (stored === null) {
		return getDefaultOverlayCardOpacity();
	}
	const parsed = Number.parseFloat(stored);
	if (Number.isNaN(parsed)) {
		return getDefaultOverlayCardOpacity();
	}
	return clampNumber(parsed, 0, 1);
}

export function applyOverlayOpacityToDocument(opacity: number): void {
	if (typeof document === "undefined") {
		return;
	}
	const safeOpacity = clampNumber(opacity, 0, 1);
	// Corner card overlay
	const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
	if (wallpaperWrapper) {
		wallpaperWrapper.style.setProperty(
			"--overlay-opacity",
			String(safeOpacity),
		);
	}
	// Full-page background
	const fullscreenWallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement | null;
	if (fullscreenWallpaper) {
		fullscreenWallpaper.style.setProperty(
			"--wallpaper-opacity",
			String(safeOpacity),
		);
	}
}

export function applyOverlayBlurToDocument(blur: number): void {
	if (typeof document === "undefined") {
		return;
	}
	const safeBlur = clampNumber(blur, 0, 20);
	// Corner card overlay
	const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
	if (wallpaperWrapper) {
		wallpaperWrapper.style.setProperty("--overlay-blur", `${safeBlur}px`);
	}
	// Full-page background
	const fullscreenWallpaper = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement | null;
	if (fullscreenWallpaper) {
		fullscreenWallpaper.style.setProperty("--wallpaper-blur", `${safeBlur}px`);
	}
}

export function applyOverlayCardOpacityToDocument(cardOpacity: number): void {
	if (typeof document === "undefined") {
		return;
	}
	const safeCardOpacity = clampNumber(cardOpacity, 0, 1);
	document.documentElement.style.setProperty(
		"--card-transparent-opacity",
		String(safeCardOpacity),
	);
}

export function setOverlayOpacity(opacity: number): void {
	const safeOpacity = clampNumber(opacity, 0, 1);
	if (
		typeof localStorage !== "undefined" &&
		typeof localStorage.setItem === "function"
	) {
		localStorage.setItem("overlayOpacity", String(safeOpacity));
	}
	applyOverlayOpacityToDocument(safeOpacity);
}

export function setOverlayBlur(blur: number): void {
	const safeBlur = clampNumber(blur, 0, 20);
	if (
		typeof localStorage !== "undefined" &&
		typeof localStorage.setItem === "function"
	) {
		localStorage.setItem("overlayBlur", String(safeBlur));
	}
	applyOverlayBlurToDocument(safeBlur);
}

export function setOverlayCardOpacity(cardOpacity: number): void {
	const safeCardOpacity = clampNumber(cardOpacity, 0, 1);
	if (
		typeof localStorage !== "undefined" &&
		typeof localStorage.setItem === "function"
	) {
		localStorage.setItem("overlayCardOpacity", String(safeCardOpacity));
	}
	applyOverlayCardOpacityToDocument(safeCardOpacity);
}

export function applyStoredOverlaySettingsToDocument(): void {
	applyOverlayOpacityToDocument(getStoredOverlayOpacity());
	applyOverlayBlurToDocument(getStoredOverlayBlur());
	applyOverlayCardOpacityToDocument(getStoredOverlayCardOpacity());
}

// Waves animation functions
export function getDefaultWavesEnabled(): boolean {
	return siteConfig.banner.waves?.enable ?? false;
}

export function getStoredWavesEnabled(): boolean {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultWavesEnabled();
	}
	const stored = localStorage.getItem("wavesEnabled");
	if (stored === null) {
		return getDefaultWavesEnabled();
	}
	return stored === "true";
}

export function setWavesEnabled(enabled: boolean): void {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("wavesEnabled", String(enabled));
	applyWavesEnabledToDocument(enabled);
}

export function applyWavesEnabledToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	// Update html attribute, CSS takes effect immediately
	document.documentElement.setAttribute("data-waves-enabled", String(enabled));
	// Also update element style (compatibility)
	const wavesElement = document.getElementById("header-waves");
	if (wavesElement) {
		if (enabled) {
			wavesElement.style.display = "";
			wavesElement.classList.remove("waves-disabled");
		} else {
			wavesElement.style.display = "none";
			wavesElement.classList.add("waves-disabled");
		}
	}
}

// Gradient transition functions
export function getDefaultGradientEnabled(): boolean {
	return siteConfig.banner.gradient?.enable ?? true;
}

export function getStoredGradientEnabled(): boolean {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultGradientEnabled();
	}
	const stored = localStorage.getItem("gradientEnabled");
	if (stored === null) {
		return getDefaultGradientEnabled();
	}
	return stored === "true";
}

export function setGradientEnabled(enabled: boolean): void {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("gradientEnabled", String(enabled));
	applyGradientEnabledToDocument(enabled);
}

export function applyGradientEnabledToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	document.documentElement.setAttribute(
		"data-gradient-enabled",
		String(enabled),
	);
	const gradientElement = document.getElementById("wallpaper-gradient");
	if (gradientElement) {
		if (enabled) {
			gradientElement.style.display = "";
			gradientElement.classList.remove("gradient-disabled");
		} else {
			gradientElement.style.display = "none";
			gradientElement.classList.add("gradient-disabled");
		}
	}
}

// Sakura effect functions
export function getDefaultSakuraEnabled(): boolean {
	return effectsConfig.sakura?.enable ?? false;
}

export function getStoredSakuraEnabled(): boolean {
	if (typeof localStorage === "undefined") {
		return getDefaultSakuraEnabled();
	}
	const stored = localStorage.getItem("sakuraEnabled");
	if (stored === null) {
		return getDefaultSakuraEnabled();
	}
	return stored === "true";
}

export function setSakuraEnabled(enabled: boolean): void {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("sakuraEnabled", String(enabled));
	document.documentElement.setAttribute("data-sakura-enabled", String(enabled));
	// Toggle sakura effect in real-time
	window.dispatchEvent(
		new CustomEvent("sakuraToggle", { detail: { enabled } }),
	);
}

// Banner title functions
export function getDefaultBannerTitleEnabled(): boolean {
	return siteConfig.banner.bannerHomeText?.enable ?? true;
}

export function getDefaultBannerCarouselEnabled(): boolean {
	return siteConfig.banner.carousel?.enable ?? false;
}

export function getStoredBannerTitleEnabled(): boolean {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultBannerTitleEnabled();
	}
	const stored = localStorage.getItem("bannerTitleEnabled");
	if (stored === null) {
		return getDefaultBannerTitleEnabled();
	}
	return stored === "true";
}

export function getStoredBannerCarouselEnabled(): boolean {
	const isSwitchable = siteConfig.banner.carousel?.switchable ?? false;
	if (!isSwitchable) {
		return getDefaultBannerCarouselEnabled();
	}
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.getItem !== "function"
	) {
		return getDefaultBannerCarouselEnabled();
	}
	const stored = localStorage.getItem("bannerCarouselEnabled");
	if (stored === null) {
		return getDefaultBannerCarouselEnabled();
	}
	return stored === "true";
}

export function setBannerTitleEnabled(enabled: boolean): void {
	if (
		typeof localStorage === "undefined" ||
		typeof localStorage.setItem !== "function"
	) {
		return;
	}
	localStorage.setItem("bannerTitleEnabled", String(enabled));
	applyBannerTitleEnabledToDocument(enabled);
}

export function setBannerCarouselEnabled(enabled: boolean): void {
	const safeEnabled = !!enabled;
	const isSwitchable = siteConfig.banner.carousel?.switchable ?? false;
	if (
		isSwitchable &&
		typeof localStorage !== "undefined" &&
		typeof localStorage.setItem === "function"
	) {
		localStorage.setItem("bannerCarouselEnabled", String(safeEnabled));
	}
	applyBannerCarouselEnabledToDocument(safeEnabled);
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("banner-carousel-change", {
				detail: { enabled: safeEnabled },
			}),
		);
	}
}

export function applyBannerTitleEnabledToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	// Update html attribute, CSS takes effect immediately
	document.documentElement.setAttribute(
		"data-banner-title-enabled",
		String(enabled),
	);
	// Also update element style (compatibility)
	const bannerTextOverlay = document.querySelector(
		".banner-text-overlay",
	) as HTMLElement;
	if (bannerTextOverlay) {
		if (enabled) {
			bannerTextOverlay.classList.remove("user-hidden");
		} else {
			bannerTextOverlay.classList.add("user-hidden");
		}
	}
}

export function applyBannerCarouselEnabledToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	document.documentElement.setAttribute(
		"data-banner-carousel-enabled",
		String(enabled),
	);
}

// Font settings
const FONT_STORAGE_KEY = "selectedFont";

export function getDefaultFont(): string {
	return fontConfig?.defaultFont || "system";
}

export function getFont(): string {
	if (typeof localStorage === "undefined") {
		return getDefaultFont();
	}
	return getStoredFont();
}

export function getStoredFont(): string {
	if (typeof localStorage === "undefined") {
		return getDefaultFont();
	}
	const stored = localStorage.getItem(FONT_STORAGE_KEY);
	if (!stored) {
		return getDefaultFont();
	}
	const fonts = fontConfig?.fonts;
	const fontList = Array.isArray(fonts)
		? fonts
		: fonts
			? Object.values(fonts)
			: [];
	return fontList.some((font) => font.id === stored)
		? stored
		: getDefaultFont();
}

export function setFont(fontId: string): void {
	if (typeof localStorage === "undefined") {
		return;
	}
	localStorage.setItem(FONT_STORAGE_KEY, fontId);
	applyFontToDocument(fontId);
}

export function applyFontToDocument(fontId: string): void {
	if (typeof document === "undefined") {
		return;
	}
	document.documentElement.setAttribute("data-font", fontId);

	// Find the font option and apply its fontFamily + cjkFontFamily + external resources
	const fonts = fontConfig?.fonts;
	const fontList = Array.isArray(fonts)
		? fonts
		: fonts
			? Object.values(fonts)
			: [];
	const fontOption = fontList.find((f) => f.id === fontId);
	if (fontOption) {
		const fullFontFamily = getFontFamily(fontOption);

		// Set CSS variable for any CSS rules that reference it
		document.documentElement.style.setProperty("--font-family", fullFontFamily);
		// Apply directly to body via inline style to override Layout.astro's inline style
		document.body.style.setProperty("font-family", fullFontFamily, "important");

		for (const { id, href } of getFontStylesheets(fontOption)) {
			const absoluteHref = new URL(href, document.baseURI).href;
			const alreadyLoaded = [
				...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
			].some(
				(link) => link.dataset.fontId === id || link.href === absoluteHref,
			);
			if (alreadyLoaded) {
				continue;
			}
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = href;
			link.dataset.fontId = id;
			document.head.appendChild(link);
		}
	} else {
		// Font not found, reset to default
		document.documentElement.style.removeProperty("--font-family");
		document.body.style.removeProperty("font-family");
	}
}

// Sticky navbar functions
export function getDefaultStickyNavbar(): boolean {
	return siteConfig.navbar?.stickyNavbar ?? false;
}

export function getStoredStickyNavbar(): boolean {
	if (typeof localStorage === "undefined") {
		return getDefaultStickyNavbar();
	}
	const stored = localStorage.getItem("stickyNavbar");
	if (stored === null) {
		return getDefaultStickyNavbar();
	}
	return stored === "true";
}

export function setStickyNavbar(enabled: boolean): void {
	if (typeof localStorage === "undefined") {
		return;
	}
	localStorage.setItem("stickyNavbar", String(enabled));
	applyStickyNavbarToDocument(enabled);
}

export function applyStickyNavbarToDocument(enabled: boolean): void {
	if (typeof document === "undefined") {
		return;
	}
	// Set data attribute for CSS selectors that use :root[data-sticky-navbar]
	document.documentElement.setAttribute("data-sticky-navbar", String(enabled));

	// Use body class as the primary mechanism - CSS !important rules in navbar.css
	// enforce fixed positioning when body.sticky-navbar is present
	if (enabled) {
		document.body.classList.add("sticky-navbar");
	} else {
		document.body.classList.remove("sticky-navbar");
	}

	// Handle navbar shadow and scrolled state
	const navbar = document.getElementById("navbar");
	if (navbar) {
		if (enabled) {
			// Ensure navbar always has background when sticky
			navbar.classList.add("navbar-sticky-shadow");
			navbar.classList.add("scrolled");
			// Remove navbar-hidden if present (sticky navbar should never be hidden)
			navbar.classList.remove("navbar-hidden");
		} else {
			navbar.classList.remove("navbar-sticky-shadow");
			// Re-initialize scroll detection to handle scrolled state correctly
			const initSemifullScrollDetection = (window as any)
				.initSemifullScrollDetection;
			if (typeof initSemifullScrollDetection === "function") {
				initSemifullScrollDetection();
			}
		}
	}

	// Also handle navbar-wrapper navbar-hidden
	const navbarWrapper = document.getElementById("navbar-wrapper");
	if (navbarWrapper && enabled) {
		navbarWrapper.classList.remove("navbar-hidden");
	}
}
