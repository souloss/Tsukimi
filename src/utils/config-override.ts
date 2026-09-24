import announcementConfigOverride from "../overrides/announcementConfig";
import backgroundWallpaperOverride from "../overrides/backgroundWallpaper";
import commentConfigOverride from "../overrides/commentConfig";
import effectsConfigOverride from "../overrides/effectsConfig";
import footerConfigOverride from "../overrides/footerConfig";
import friendsConfigOverride from "../overrides/friendsConfig";
import musicConfigOverride from "../overrides/musicConfig";
import navBarConfigOverride from "../overrides/navBarConfig";
import pioConfigOverride from "../overrides/pioConfig";
import profileConfigOverride from "../overrides/profileConfig";
import sidebarConfigOverride from "../overrides/sidebarConfig";
import siteConfigOverride from "../overrides/siteConfig";
import sponsorConfigOverride from "../overrides/sponsorConfig";
import type { RecursivePartial } from "../types/utils";
import { deepMerge } from "./deep-merge";

type OverrideModule = {
	default: RecursivePartial<Record<string, unknown>>;
};

const staticOverrideModules: Record<string, OverrideModule> = {
	"../overrides/announcementConfig.ts": { default: announcementConfigOverride },
	"../overrides/backgroundWallpaper.ts": {
		default: backgroundWallpaperOverride,
	},
	"../overrides/commentConfig.ts": { default: commentConfigOverride },
	"../overrides/effectsConfig.ts": { default: effectsConfigOverride },
	"../overrides/footerConfig.ts": { default: footerConfigOverride },
	"../overrides/friendsConfig.ts": { default: friendsConfigOverride },
	"../overrides/musicConfig.ts": { default: musicConfigOverride },
	"../overrides/navBarConfig.ts": { default: navBarConfigOverride },
	"../overrides/pioConfig.ts": { default: pioConfigOverride },
	"../overrides/profileConfig.ts": { default: profileConfigOverride },
	"../overrides/sidebarConfig.ts": { default: sidebarConfigOverride },
	"../overrides/siteConfig.ts": { default: siteConfigOverride },
	"../overrides/sponsorConfig.ts": { default: sponsorConfigOverride },
};

/**
 * Merge config defaults with an override file from src/overrides/.
 * If no override file exists, returns defaults unchanged.
 * Override files are loaded eagerly at build time via import.meta.glob.
 */
export function withOverride<T extends object>(name: string, defaults: T): T {
	const globModules =
		typeof import.meta.glob === "function"
			? import.meta.glob<Record<string, RecursivePartial<T>>>(
					"../overrides/*.ts",
					{ eager: true },
				)
			: {};
	const modules =
		Object.keys(globModules).length > 0 ? globModules : staticOverrideModules;
	const key = `../overrides/${name}.ts`;
	if (modules[key]) {
		const module = modules[key] as {
			default?: RecursivePartial<T>;
		};
		const override = module.default ?? (modules[key] as RecursivePartial<T>);
		return deepMerge(defaults, override) as T;
	}
	return defaults;
}
