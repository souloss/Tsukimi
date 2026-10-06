import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

export const IMAGE_PIPELINE_VERSION = 2;

export function createImageCacheKey(source, config) {
	return createHash("sha256")
		.update(JSON.stringify({ version: IMAGE_PIPELINE_VERSION, config }))
		.update(source)
		.digest("hex");
}

export async function isValidImageOutput(file, { format, width }) {
	try {
		const metadata = await sharp(await readFile(file)).metadata();
		const formatMatches = format === "avif"
			? metadata.format === "avif" || metadata.mediaType === "image/avif"
			: metadata.format === format;
		return formatMatches && metadata.width === width && metadata.height > 0;
	} catch {
		return false;
	}
}
