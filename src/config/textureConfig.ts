import type { TextureConfig, TexturePreset } from "@/types/texture";
import { siteConfig } from "./siteConfig";

export const TEXTURE_PRESETS: readonly TexturePreset[] = [
	"none",
	"starlight",
	"cyber-dots",
	"topography",
	"geometric",
	"sakura",
];

const FALLBACK_TEXTURE: Required<TextureConfig> = {
	enable: false,
	switchable: false,
	defaultPreset: "none",
	defaultOpacity: 0.25,
	allowMotion: false,
};

export function isTexturePreset(value: string): value is TexturePreset {
	return (TEXTURE_PRESETS as readonly string[]).includes(value);
}

export function resolveTextureConfig(
	config: TextureConfig | undefined = siteConfig.texture,
): Required<TextureConfig> {
	const merged = { ...FALLBACK_TEXTURE, ...config };
	const opacity =
		typeof merged.defaultOpacity === "number" &&
		Number.isFinite(merged.defaultOpacity)
			? merged.defaultOpacity
			: FALLBACK_TEXTURE.defaultOpacity;
	return {
		...merged,
		defaultPreset: isTexturePreset(merged.defaultPreset)
			? merged.defaultPreset
			: "none",
		defaultOpacity: Math.min(0.25, Math.max(0.05, opacity)),
	};
}
