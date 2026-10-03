import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const required = [
	["image pipeline", "src/components/atoms/Image/Image.astro", /srcset=.*sizes=/s],
	["font compression", "scripts/compress-fonts/index.js", /woff2/],
	["lazy Pagefind", "src/components/organisms/navigation/Navbar.astro", /import\(scriptUrl\)/],
	["Swup lifecycle cleanup", "src/scripts/core/swup-hooks.ts", /content:replace/],
	["third-party idle loading", "src/layouts/partials/AnalyticsScripts.astro", /requestIdleCallback/],
	["immutable asset cache", "public/_headers", /_astro\/\*/],
];
const errors = [];
for (const [name, relative, pattern] of required) {
	const file = path.join(root, relative);
	if (!existsSync(file)) {
		errors.push(`${name}: missing ${relative}`);
		continue;
	}
	const source = await readFile(file, "utf8");
	if (!pattern.test(source)) errors.push(`${name}: expected contract missing in ${relative}`);
}
if (errors.length > 0) {
	console.error(`Performance contract check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`Performance contract check passed (${required.length} contracts).`);
