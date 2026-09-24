import { readFile } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "glob";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const defaultDistRoot = resolve(projectRoot, "dist");

async function configuredLocalFonts() {
	const source = await readFile(resolve(projectRoot, "src/config/fontConfig.ts"), "utf8");
	return [...source.matchAll(/src:\s*["']([^"']+\.(?:ttf|otf|woff2?))["']/g)].map(
		([, value]) => basename(value, extname(value)),
	);
}

export async function auditFonts({ distRoot = defaultDistRoot } = {}) {
	const fontNames = await configuredLocalFonts();
	const cssFiles = await glob("**/*.css", { cwd: distRoot, absolute: true });
	const css = await Promise.all(cssFiles.map((file) => readFile(file, "utf8")));
	const errors = [];
	for (const fontName of fontNames) {
		const woff2Path = resolve(distRoot, `assets/font/${fontName}.woff2`);
		try {
			await readFile(woff2Path);
		} catch {
			errors.push(`missing generated WOFF2: ${fontName}.woff2`);
		}
		if (css.some((content) => content.includes(`/assets/font/${fontName}.ttf`))) {
			errors.push(`CSS still references legacy TTF: ${fontName}.ttf`);
		}
		try {
			await readFile(resolve(distRoot, `assets/font/${fontName}.ttf`));
			errors.push(`uncompressed TTF is present in dist: ${fontName}.ttf`);
		} catch {
			// Production output should only include the subsetted WOFF2.
		}
	}
	return { errors, fontCount: fontNames.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const report = await auditFonts();
	if (report.errors.length > 0) {
		console.error(`Font audit failed with ${report.errors.length} error(s):`);
		for (const error of report.errors) console.error(`  - ${error}`);
		process.exitCode = 1;
	} else {
		console.log(`Font audit passed: ${report.fontCount} configured local font(s) use WOFF2.`);
	}
}
