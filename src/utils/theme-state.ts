import type { TexturePreset } from "@/types/texture";
import type { MaterialPaletteStyle } from "@/utils/material-theme";

export interface ThemeSettings {
	hue: number | null;
	palette: MaterialPaletteStyle | null;
	texture: TexturePreset | null;
	textureOpacity: number | null;
	reduceMotion: boolean | null;
	wallpaper: string | null;
}

export interface ThemeSettingChange {
	key: keyof ThemeSettings;
	value: ThemeSettings[keyof ThemeSettings];
}

const EVENT_NAME = "tsukimi:theme-setting-change";

export function getThemeSettings(): ThemeSettings {
	if (typeof localStorage === "undefined") {
		return {
			hue: null,
			palette: null,
			texture: null,
			textureOpacity: null,
			reduceMotion: null,
			wallpaper: null,
		};
	}
	const hue = Number.parseInt(localStorage.getItem("hue") ?? "", 10);
	const opacity = Number.parseFloat(
		localStorage.getItem("textureOpacity") ?? "",
	);
	const reduced = localStorage.getItem("reduceMotion");
	return {
		hue: Number.isFinite(hue) ? hue : null,
		palette: localStorage.getItem(
			"material-theme-style",
		) as MaterialPaletteStyle | null,
		texture: localStorage.getItem("texturePreset") as TexturePreset | null,
		textureOpacity: Number.isFinite(opacity) ? opacity : null,
		reduceMotion: reduced === null ? null : reduced === "true",
		wallpaper: localStorage.getItem("wallpaperMode"),
	};
}

export function notifyThemeSetting<Key extends keyof ThemeSettings>(
	key: Key,
	value: ThemeSettings[Key],
): void {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent<ThemeSettingChange>(EVENT_NAME, {
			detail: { key, value },
		}),
	);
}

export function subscribeThemeSettings(
	listener: (change: ThemeSettingChange) => void,
): () => void {
	if (typeof window === "undefined") return () => {};
	const handler = (event: Event) => {
		listener((event as CustomEvent<ThemeSettingChange>).detail);
	};
	window.addEventListener(EVENT_NAME, handler);
	return () => window.removeEventListener(EVENT_NAME, handler);
}
