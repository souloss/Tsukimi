import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = [
	"src/styles/motion-tokens.css",
	"src/styles/transition.css",
	"src/styles/animation-enhancements.css",
	"src/styles/textures.css",
	"src/layouts/partials/HeadTags.astro",
	"src/components/features/knowledge-graph/GraphCanvas.svelte",
];
const errors = [];
for (const relative of files) {
	const source = await readFile(path.join(root, relative), "utf8");
	if (!source.includes("prefers-reduced-motion") && !source.includes("reduceMotion")) {
		errors.push(`${relative}: no reduced-motion contract`);
	}
}
if (errors.length > 0) {
	console.error(errors.join("\n"));
	process.exit(1);
}
console.log(`Reduced motion check passed (${files.length} files).`);
