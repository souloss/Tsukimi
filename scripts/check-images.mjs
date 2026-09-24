import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "glob";
import { parse } from "node-html-parser";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const defaultDistRoot = resolve(projectRoot, "dist");

function isLocalRaster(src) {
	if (!src || /^(?:data:|https?:|\/\/)/i.test(src)) return false;
	return /\.(?:avif|gif|jpe?g|png|webp)(?:[?#]|$)/i.test(src);
}

function isLegacyRaster(src) {
	return /\.(?:gif|jpe?g|png)(?:[?#]|$)/i.test(src);
}

export async function auditImages({ distRoot = defaultDistRoot } = {}) {
	const htmlFiles = await glob("**/*.html", {
		cwd: distRoot,
		absolute: true,
	});
	const errors = [];
	let imageCount = 0;
	let missingDimensions = 0;
	let missingDecoding = 0;
	let localRasterCount = 0;
	let legacyRasterCount = 0;

	for (const filePath of htmlFiles) {
		const html = await readFile(filePath, "utf8");
		const document = parse(html);
		for (const image of document.querySelectorAll("img")) {
			imageCount += 1;
			const attributes = image.attributes;
			const src = attributes.src ?? attributes["data-src"] ?? "";
			const location = filePath.replace(`${distRoot}/`, "");

			if (!("alt" in attributes)) {
				errors.push(`${location}: image is missing alt`);
			}
			if (!("loading" in attributes)) {
				errors.push(`${location}: image is missing loading`);
			}
			if (attributes.decoding !== "async") missingDecoding += 1;
			if (!("width" in attributes) && !("height" in attributes)) {
				missingDimensions += 1;
			}
			if (isLocalRaster(src)) {
				localRasterCount += 1;
				if (isLegacyRaster(src)) legacyRasterCount += 1;
			}
		}
	}

	return {
		errors,
		pageCount: htmlFiles.length,
		imageCount,
		missingDimensions,
		missingDecoding,
		localRasterCount,
		legacyRasterCount,
	};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const report = await auditImages();
	if (report.errors.length > 0) {
		console.error(`Image audit failed with ${report.errors.length} error(s):`);
		for (const error of report.errors.slice(0, 20)) console.error(`  - ${error}`);
		if (report.errors.length > 20) console.error("  - ...");
		process.exitCode = 1;
	} else {
		const legacyRate = report.localRasterCount
			? ((report.legacyRasterCount / report.localRasterCount) * 100).toFixed(1)
			: "0.0";
		console.log(
			`Image audit passed: ${report.imageCount} images across ${report.pageCount} pages; ` +
			`${report.missingDimensions} without intrinsic dimensions; ` +
			`${report.missingDecoding} use the browser decoding default; ` +
			`${legacyRate}% of local raster references use png/jpg/gif.`,
		);
	}
}
