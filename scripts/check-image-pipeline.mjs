import { access, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);
const manifestPath = path.join(projectRoot, "src/generated/image-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const errors = [];

if (manifest.version !== 1 || !Array.isArray(manifest.widths)) {
	errors.push("image manifest must include version 1 and widths");
}
for (const [source, image] of Object.entries(manifest.images ?? {})) {
	if (!image.width || !image.height || !image.placeholder) {
		errors.push(`${source} is missing dimensions or placeholder`);
	}
	for (const format of ["avif", "webp"]) {
		for (const variant of image.variants?.[format] ?? []) {
			try {
				await access(path.join(projectRoot, "public", variant.src.replace(/^\//, "")));
			} catch {
				errors.push(`${source} references missing ${variant.src}`);
			}
		}
	}
}

if (errors.length) {
	console.error(`Image pipeline check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`  - ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Image pipeline check passed (${Object.keys(manifest.images ?? {}).length} images).`);
}
