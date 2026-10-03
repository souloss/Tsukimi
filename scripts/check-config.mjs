import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { LinkPresets } from "../src/constants/link-presets.ts";
import { featurePageRegistry, featurePageRoutes } from "../src/config/featureRoutes.ts";
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

const supportedLanguages = new Set(["en", "zh_CN", "zh_TW", "ja", "ko", "es", "th", "vi", "tr", "id"]);
const booleanEnvironmentKeys = ["ENABLE_CONTENT_SYNC", "DRAFT_PREVIEW"];
const integerEnvironmentKeys = ["DEV_MAX_RENDERED_POSTS", "TSUKIMI_PERFORMANCE_MAX_TRACKED_BYTES"];

function isHttpUrl(value) {
	try {
		const parsed = new URL(value);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

export function validateEnvironment(env = process.env) {
	const errors = [];
	for (const key of booleanEnvironmentKeys) {
		if (env[key] !== undefined && env[key] !== "true" && env[key] !== "false") {
			errors.push(`${key} must be \\"true\\" or \\"false\\"`);
		}
	}
	if (env.NODE_ENV !== undefined && !["development", "production", "test"].includes(env.NODE_ENV)) {
		errors.push("NODE_ENV must be development, production, or test");
	}
	for (const key of integerEnvironmentKeys) {
		if (env[key] !== undefined && (!/^\\d+$/.test(env[key]) || Number(env[key]) < 0)) {
			errors.push(`${key} must be a non-negative integer`);
		}
	}
	for (const key of ["CONTENT_REPO_URL", "DOCS_RENDER_BASE_URL"]) {
		if (env[key] !== undefined && !isHttpUrl(env[key])) errors.push(`${key} must be an http(s) URL`);
	}
	if (env.CONTENT_DIR !== undefined && !env.CONTENT_DIR.trim()) errors.push("CONTENT_DIR must not be empty");
	return errors;
}

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
		if (!(key in featurePageRegistry)) {
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

	for (const [key, route] of Object.entries(featurePageRegistry)) {
		if (!(await pathExists(resolve(root, route.page)))) {
			errors.push(`${key} route page is missing: ${route.page}`);
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
	if (site.lang !== undefined && !supportedLanguages.has(site.lang)) {
		errors.push(`lang is invalid: ${site.lang}`);
	}
	if (
		themeColor.hue !== undefined &&
		(typeof themeColor.hue !== "number" || !Number.isFinite(themeColor.hue) || themeColor.hue < 0 || themeColor.hue > 360)
	) {
		errors.push("themeColor.hue must be between 0 and 360");
	}
	if (site.siteURL !== undefined && !isHttpUrl(site.siteURL)) errors.push("siteURL must be an http(s) URL");
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
	for (const key of ["copySelection", "backToTop", "copyLink"]) {
		if (contextMenuConfig[key] !== undefined && typeof contextMenuConfig[key] !== "boolean") {
			errors.push(`contextMenu.${key} must be boolean`);
		}
	}
	const postListLayout = site.postListLayout ?? {};
	for (const [key, value] of Object.entries({
		defaultMode: postListLayout.defaultMode,
		mobileDefaultMode: postListLayout.mobileDefaultMode,
	})) {
		if (value !== undefined && value !== "list" && value !== "grid") {
			errors.push(`postListLayout.${key} must be list or grid`);
		}
	}
	if (postListLayout.allowSwitch !== undefined && typeof postListLayout.allowSwitch !== "boolean") {
		errors.push("postListLayout.allowSwitch must be boolean");
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
	const errors = [...validateEnvironment(), ...(await validateConfig())];
	if (errors.length > 0) {
		console.error(`Configuration validation failed with ${errors.length} error(s):`);
		for (const error of errors) console.error(`  - ${error}`);
		process.exitCode = 1;
	} else {
		console.log("Configuration validation passed.");
	}
}
