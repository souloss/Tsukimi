import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);
const publicRoot = path.join(projectRoot, "public");
const manifestPath = path.join(projectRoot, "src/generated/image-manifest.json");
const rasterPattern = /\.(?:avif|jpe?g|png|webp)$/i;
const generatedPattern = /-w\d+\.(?:avif|webp)$/i;
const widths = [320, 640, 960, 1280];

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
	const metadata = await sharp(input).metadata();
	if (!metadata.width || !metadata.height || metadata.animated) return null;

	const relative = path.relative(publicRoot, input);
	const parsed = path.parse(input);
	const variants = { avif: [], webp: [] };
	const targetWidths = [
		...widths.filter((candidate) => candidate < metadata.width),
		metadata.width,
	].filter((width, index, values) => values.indexOf(width) === index);
	for (const width of targetWidths) {
		await Promise.all(Object.keys(variants).map(async (format) => {
			const output = path.join(parsed.dir, `${parsed.name}-w${width}.${format}`);
			const [inputStat, outputStat] = await Promise.all([
				stat(input),
				stat(output).catch(() => null),
			]);
			if (!outputStat || outputStat.mtimeMs < inputStat.mtimeMs) {
				await sharp(input)
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

	return {
		src: `/${relative.split(path.sep).join("/")}`,
		width: metadata.width,
		height: metadata.height,
		placeholder: await getPlaceholder(input),
		variants,
	};
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
console.log(`Image pipeline optimized ${Object.keys(sortedManifest).length} images.`);
