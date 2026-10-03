import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
	commentConfig,
	contextMenuConfig,
	musicPlayerConfig,
	pioConfig,
} from "../src/config/index.ts";
import { resolveTextureConfig } from "../src/config/textureConfig.ts";

const projectRoot = process.cwd();
const distRoot = path.join(projectRoot, "dist");

async function configuredFlag(name: string, fallback: boolean): Promise<boolean> {
	const overridePath = path.join(projectRoot, "src/overrides", `${name}.ts`);
	try {
		const source = await readFile(overridePath, "utf8");
		const match = source.match(/\benable\s*:\s*(true|false)\b/);
		return match ? match[1] === "true" : fallback;
	} catch {
		return fallback;
	}
}

async function walk(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolute)));
		else files.push(absolute);
	}
	return files;
}

const files = await walk(distRoot);
const contents = await Promise.all(
	files.map(async (file) => ({ file, text: await readFile(file, "utf8") })),
);
const html = contents
	.filter(({ file }) => file.endsWith(".html"))
	.map(({ text }) => text)
	.join("\n");
const clientArtifacts = contents
	.filter(({ file }) => /\.(?:js|mjs|css)$/.test(file))
	.map(({ text }) => text)
	.join("\n");
const errors: string[] = [];

const gates = [
	{
		name: "comments",
		enabled: await configuredFlag("commentConfig", commentConfig.enable),
		markers: ['id="twikoo-container"', 'id="waline-container"', 'id="giscus-container"'],
		scope: html,
	},
	{
		name: "music",
		enabled: await configuredFlag("musicConfig", musicPlayerConfig.enable),
		markers: ['class="music-player-fab-shell"', 'class="music-sidebar-widget"'],
		moduleMarkers: ["MusicPlayer"],
		scope: html,
		moduleScope: clientArtifacts,
	},
	{
		name: "pio",
		enabled: await configuredFlag("pioConfig", pioConfig.enable),
		markers: ['id="pio-container"', 'src="/pio/models/'],
		moduleMarkers: ["Pio"],
		scope: html,
		moduleScope: clientArtifacts,
	},
	{
		name: "context-menu",
		enabled: contextMenuConfig.enable,
		markers: ['data-context-menu', 'class="context-menu"'],
		moduleMarkers: ["ContextMenu"],
		scope: html,
		moduleScope: clientArtifacts,
	},
	{
		name: "texture",
		enabled: resolveTextureConfig().enable,
		markers: ["texture-canvas", "data-texture-enabled"],
		scope: html,
	},
];

for (const gate of gates) {
	if (!gate.enabled) {
		for (const marker of gate.markers) {
			if (gate.scope.includes(marker)) {
				errors.push(`${gate.name} is disabled but artifact contains ${marker}`);
			}
		}
		for (const marker of gate.moduleMarkers ?? []) {
			if (gate.moduleScope.includes(marker)) {
				errors.push(`${gate.name} is disabled but client artifact contains ${marker}`);
			}
		}
	}
}

if (errors.length > 0) {
	console.error(`Feature gate check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`  - ${error}`);
	process.exit(1);
}

console.log(
	`Feature gate check passed (${gates.filter((gate) => gate.enabled).length}/${gates.length} enabled).`,
);
