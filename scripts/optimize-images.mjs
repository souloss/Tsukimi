import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createImageCacheKey, IMAGE_PIPELINE_VERSION, isValidImageOutput } from "./image-cache.mjs";

const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);
const publicRoot = path.join(projectRoot, "public");
const manifestPath = path.join(projectRoot, "src/generated/image-manifest.json");
const cachePath = path.join(projectRoot, "cache/image-optimization-cache.json");
const rasterPattern = /\.(?:avif|jpe?g|png|webp)$/i;
const generatedPattern = /-w\d+\.(?:avif|webp)$/i;
const widths = [320, 640, 960, 1280];
const encoderConfig = { widths, formats: { avif: { quality: 55, effort: 4 }, webp: { quality: 80, effort: 4 } } };

let previousCache = {};
try {
	const parsed = JSON.parse(await readFile(cachePath, "utf8"));
	if (parsed.version === IMAGE_PIPELINE_VERSION && parsed.entries && typeof parsed.entries === "object") {
		previousCache = parsed.entries;
	}
} catch {
	// A missing or malformed cache is a cold build.
}
const nextCache = {};

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === "pio") continue;
			files.push(...(await walk(absolute)));
		} else if (rasterPattern.test(entry.name) && !generatedPattern.test(entry.name)) {
			files.push(absolute);
		}
	}
	return files;
}

function toPublicUrl(absolutePath) {
	return `/${path.relative(publicRoot, absolutePath).split(path.sep).join("/")}`;
}

function toHex(rgb) {
	return `#${[rgb[0], rgb[1], rgb[2]]
		.map((channel) => channel.toString(16).padStart(2, "0"))
		.join("")}`;
}

async function getPlaceholder(input) {
	const { data } = await sharp(input)
		.resize(1, 1, { fit: "cover" })
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	return toHex(data);
}

async function optimizeImage(input) {
	const source = await readFile(input);
	const metadata = await sharp(source).metadata();
	if (!metadata.width || !metadata.height || metadata.animated) return null;

	const relative = path.relative(publicRoot, input);
	const parsed = path.parse(input);
	const cacheKey = createImageCacheKey(source, encoderConfig);
	const cached = previousCache[`/${relative.split(path.sep).join("/")}`];
	if (cached?.key === cacheKey && await validateCachedVariants(cached, metadata.width)) {
		nextCache[`/${relative.split(path.sep).join("/")}`] = cached;
		return cached.image;
	}
	const variants = { avif: [], webp: [] };
	const sourceStat = await stat(input);
	const targetWidths = [
		...widths.filter((candidate) => candidate < metadata.width),
		metadata.width,
	].filter((width, index, values) => values.indexOf(width) === index);
	for (const width of targetWidths) {
		await Promise.all(Object.keys(variants).map(async (format) => {
			const output = path.join(parsed.dir, `${parsed.name}-w${width}.${format}`);
			const outputStat = await stat(output).catch(() => null);
			const outputValid = outputStat && await isValidImageOutput(output, { format, width });
			const sourceChanged = cached && cached.key !== cacheKey;
			if (!outputValid || sourceChanged || outputStat.mtimeMs < sourceStat.mtimeMs) {
				await sharp(source)
					.resize({ width, fit: "inside", withoutEnlargement: true })
					[format]({ quality: format === "avif" ? 55 : 80, effort: 4 })
					.toFile(output);
			}
			variants[format].push({
				src: toPublicUrl(output),
				width,
			});
		}));
	}

	const image = {
		src: `/${relative.split(path.sep).join("/")}`,
		width: metadata.width,
		height: metadata.height,
		placeholder: await getPlaceholder(input),
		variants,
	};
	const record = { key: cacheKey, image };
	nextCache[image.src] = record;
	return image;
}

async function validateCachedVariants(record, sourceWidth) {
	if (!record.image?.variants || !record.image.width || !record.image.height) return false;
	const expectedWidths = [
		...widths.filter((candidate) => candidate < sourceWidth),
		sourceWidth,
	].filter((width, index, values) => values.indexOf(width) === index);
	for (const format of ["avif", "webp"]) {
		const variants = record.image.variants[format];
		if (!Array.isArray(variants) || variants.length !== expectedWidths.length) return false;
		for (let index = 0; index < expectedWidths.length; index += 1) {
			const variant = variants[index];
			const absolute = path.resolve(publicRoot, `.${variant.src}`);
			if (!absolute.startsWith(`${publicRoot}${path.sep}`)) return false;
			if (variant.width !== expectedWidths[index]) return false;
			if (!(await isValidImageOutput(absolute, { format, width: expectedWidths[index] }))) return false;
		}
	}
	return true;
}

const files = await walk(publicRoot);
const manifest = {};
const queue = [...files];
async function worker() {
	while (queue.length > 0) {
		const file = queue.shift();
		if (!file) return;
		const entry = await optimizeImage(file);
		if (entry) manifest[entry.src] = entry;
	}
}
await Promise.all(Array.from({ length: 4 }, worker));
const sortedManifest = Object.fromEntries(
	Object.entries(manifest).sort(([left], [right]) => left.localeCompare(right)),
);
await writeFile(
	manifestPath,
	`${JSON.stringify({ version: 1, widths, images: sortedManifest }, null, "\t")}\n`,
);
await mkdir(path.dirname(cachePath), { recursive: true });
await writeFile(cachePath, `${JSON.stringify({ version: IMAGE_PIPELINE_VERSION, entries: nextCache }, null, "\t")}\n`);
const cacheHits = Object.keys(nextCache).filter((key) => previousCache[key]?.key === nextCache[key]?.key).length;
console.log(`Image pipeline processed ${Object.keys(sortedManifest).length} images (${cacheHits} cache hits).`);
