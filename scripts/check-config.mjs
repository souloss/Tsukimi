import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { LinkPresets } from "../src/constants/link-presets.ts";
import { featurePageRoutes } from "../src/config/featureRoutes.ts";
import {
	contextMenuConfig,
	fabConfig,
	navBarConfig,
	sidebarLayoutConfig,
	siteConfig,
} from "../src/config/index.ts";
import { isTexturePreset } from "../src/config/textureConfig.ts";
import { WIDGET_COMPONENT_MAP } from "../src/utils/widget-manager.ts";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

const featurePageFiles = {
	anime: "src/pages/anime.astro",
	talking: "src/pages/talking.astro",
	friends: "src/pages/friends.astro",
	projects: "src/pages/projects.astro",
	skills: "src/pages/skills.astro",
	timeline: "src/pages/timeline.astro",
	albums: "src/pages/albums.astro",
	devices: "src/pages/devices.astro",
	series: "src/pages/series/index.astro",
	reposts: "src/pages/reposts.astro",
	guestbook: "src/pages/guestbook.astro",
	sponsor: "src/pages/sponsor.astro",
	knowledgeGraph: "src/pages/knowledge-graph.astro",
};

const renderedSidebarTypes = new Set([
	"profile",
	"announcement",
	"categories",
	"tags",
	"toc",
	"card-toc",
	"music-player",
	"music-sidebar",
	"site-stats",
	"umami-stats",
	"calendar",
]);

async function pathExists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

function flattenLinks(items, result = []) {
	for (const item of items) {
		const link = typeof item === "number" ? LinkPresets[item] : item;
		if (!link) continue;
		result.push(link);
		if (link.children) flattenLinks(link.children, result);
	}
	return result;
}

export async function validateConfig({
	root = projectRoot,
	site = siteConfig,
	navbar = navBarConfig,
	sidebar = sidebarLayoutConfig,
} = {}) {
	const errors = [];
	const featureKeys = Object.keys(site.featurePages);
	const routeKeys = Object.keys(featurePageRoutes);

	for (const key of routeKeys) {
		if (!(key in site.featurePages)) {
			errors.push(`featurePages.${key} has no config value`);
		}
		if (!(key in featurePageFiles)) {
			errors.push(`featurePages.${key} has no page file mapping`);
		}
	}
	for (const key of featureKeys) {
		if (!(key in featurePageRoutes)) {
			errors.push(`featurePages.${key} has no route mapping`);
		}
		if (typeof site.featurePages[key] !== "boolean") {
			errors.push(`featurePages.${key} must be boolean`);
		}
	}

	for (const [key, file] of Object.entries(featurePageFiles)) {
		if (!(await pathExists(resolve(root, file)))) {
			errors.push(`${key} route page is missing: ${file}`);
		}
	}

	for (const link of flattenLinks(navbar.links)) {
		const featureKey = Object.entries(featurePageRoutes).find(
			([, route]) => route === link.url,
		)?.[0];
		if (featureKey && site.featurePages[featureKey] === false) {
			errors.push(`disabled feature ${featureKey} is still present in navigation`);
		}
	}

	for (const location of ["left", "right", "drawer"]) {
		for (const type of sidebar.components[location]) {
			if (!(type in WIDGET_COMPONENT_MAP)) {
				errors.push(`sidebar.${location} references unknown widget: ${type}`);
				continue;
			}
			if (!renderedSidebarTypes.has(type)) {
				errors.push(
					`sidebar.${location}.${type} has no renderer in SidebarColumn.astro`,
				);
			}
		}
	}

	const themeColor = site.themeColor ?? {};
	if (
		themeColor.paletteStyle !== undefined &&
		![
			"tonalSpot",
			"vibrant",
			"expressive",
			"content",
			"rainbow",
			"fruitSalad",
			"monochrome",
			"neutral",
			"fidelity",
		].includes(themeColor.paletteStyle)
	) {
		errors.push(`themeColor.paletteStyle is invalid: ${themeColor.paletteStyle}`);
	}
	if (
		themeColor.colorSpec !== undefined &&
		!["2021", "2025"].includes(themeColor.colorSpec)
	) {
		errors.push(`themeColor.colorSpec is invalid: ${themeColor.colorSpec}`);
	}
	for (const [key, item] of Object.entries(fabConfig.items)) {
		if (!item.devices.length) errors.push(`fab.${key} must target at least one device`);
	}
	if (typeof contextMenuConfig.enable !== "boolean") {
		errors.push("contextMenu.enable must be boolean");
	}
	const texture = site.texture ?? {};
	if (
		texture.defaultPreset !== undefined &&
		!isTexturePreset(texture.defaultPreset)
	) {
		errors.push(`texture.defaultPreset is invalid: ${texture.defaultPreset}`);
	}
	if (
		texture.defaultOpacity !== undefined &&
		(typeof texture.defaultOpacity !== "number" ||
			!Number.isFinite(texture.defaultOpacity) ||
			texture.defaultOpacity < 0.05 ||
			texture.defaultOpacity > 0.25)
	) {
		errors.push("texture.defaultOpacity must be between 0.05 and 0.25");
	}

	return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const errors = await validateConfig();
	if (errors.length > 0) {
		console.error(`Configuration validation failed with ${errors.length} error(s):`);
		for (const error of errors) console.error(`  - ${error}`);
		process.exitCode = 1;
	} else {
		console.log("Configuration validation passed.");
	}
}
