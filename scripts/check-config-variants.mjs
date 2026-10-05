import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateConfig } from "./check-config.mjs";
import { navBarConfig, sidebarLayoutConfig, siteConfig } from "../src/config/index.ts";

const errors = [];
const variants = [
	{ name: "default", config: undefined },
	{
		name: "minimal",
		config: { site: { ...siteConfig, featurePages: Object.fromEntries(Object.keys(siteConfig.featurePages).map((key) => [key, false])) }, navbar: { ...navBarConfig, links: [] }, sidebar: { ...sidebarLayoutConfig, components: { left: [], right: [], drawer: [] } } },
	},
	{
		name: "theme-variants",
		config: { site: { ...siteConfig, themeColor: { ...siteConfig.themeColor, hue: 0, paletteStyle: "monochrome", colorSpec: "2021" }, texture: { ...siteConfig.texture, enable: false, defaultPreset: "none", defaultOpacity: 0.1 } }, navbar: navBarConfig, sidebar: sidebarLayoutConfig },
	},
];

for (const variant of variants) {
	for (const error of await validateConfig(variant.config)) errors.push(`${variant.name}: ${error}`);
}

const fixtureRoot = path.resolve("tests/fixtures/feature-gates");
for (const fixture of ["enabled/index.html", "enabled/client.js", "disabled/index.html", "disabled/client.js"]) {
	await readFile(path.join(fixtureRoot, fixture)).catch(() => errors.push(`missing feature-gate fixture: ${fixture}`));
}

if (errors.length) {
	console.error(`Configuration variant check failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`Configuration variants passed (${variants.length} variants plus feature-gate fixtures).`);
