import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "glob";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const defaultDistRoot = resolve(projectRoot, "dist");
const defaultBaselinePath = resolve(
	projectRoot,
	".codex/iteration/performance-baseline.json",
);
const trackedExtensions = new Set([".html", ".js", ".css", ".json", ".woff2"]);
const pageRoutes = {
	home: "/",
	article: "/posts/markdown-extended/",
	docs: "/docs/tsukimi/",
	feature: [
		"/anime/",
		"/talking/",
		"/friends/",
		"/projects/",
		"/skills/",
		"/timeline/",
		"/albums/",
		"/devices/",
		"/series/",
		"/reposts/",
		"/guestbook/",
		"/sponsor/",
	],
};

function toRoute(filePath, distRoot) {
	const relativePath = relative(distRoot, filePath).replaceAll("\\", "/");
	if (relativePath === "index.html") return "/";
	if (relativePath.endsWith("/index.html")) {
		return `/${relativePath.slice(0, -"/index.html".length)}/`;
	}
	return `/${relativePath}`;
}

function getAssetPath(reference, distRoot) {
	if (!reference || reference.startsWith("data:") || reference.startsWith("#")) {
		return null;
	}
	const cleanReference = reference.split(/[?#]/, 1)[0];
	if (!cleanReference.startsWith("/")) return null;
	return resolve(distRoot, cleanReference.slice(1));
}

async function fileBytes(filePath) {
	return (await stat(filePath)).size;
}

async function collectAssetBytes(references, distRoot) {
	const assets = new Map();
	for (const reference of references) {
		const assetPath = getAssetPath(reference, distRoot);
		if (!assetPath || assets.has(assetPath)) continue;
		try {
			assets.set(assetPath, await fileBytes(assetPath));
		} catch {
			// References to external or conditionally generated assets are excluded.
		}
	}
	return [...assets.values()].reduce((sum, bytes) => sum + bytes, 0);
}

function extractReferences(html) {
	return [
		...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g),
	].map((match) => match[1]);
}

function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	return `${(bytes / 1024).toFixed(1)} KiB`;
}

export async function collectBuildMetrics({ distRoot = defaultDistRoot } = {}) {
	const files = await glob("**/*", { cwd: distRoot, absolute: true, nodir: true });
	const fileMetrics = {};
	let totalBytes = 0;
	const counts = {};

	for (const filePath of files) {
		const extension = extname(filePath).toLowerCase();
		if (!trackedExtensions.has(extension)) continue;
		const bytes = await fileBytes(filePath);
		totalBytes += bytes;
		counts[extension.slice(1)] = (counts[extension.slice(1)] ?? 0) + 1;
	}

	const htmlFiles = files.filter((filePath) => extname(filePath).toLowerCase() === ".html");
	for (const filePath of htmlFiles) {
		const html = await readFile(filePath, "utf8");
		const route = toRoute(filePath, distRoot);
		const localReferences = extractReferences(html).filter((reference) => {
			const extension = extname(reference.split(/[?#]/, 1)[0]).toLowerCase();
			return extension === ".js" || extension === ".css";
		});
		fileMetrics[route] = {
			htmlBytes: Buffer.byteLength(html),
			localJsCssBytes: await collectAssetBytes(localReferences, distRoot),
			localJsCssReferences: localReferences.length,
		};
	}

	const pages = {};
	for (const [name, route] of Object.entries(pageRoutes)) {
		if (Array.isArray(route)) {
			const activeRoute = route.find((candidate) => fileMetrics[candidate]);
			pages[name] = activeRoute
				? { route: activeRoute, ...fileMetrics[activeRoute] }
				: null;
			continue;
		}
		pages[name] = fileMetrics[route] ?? null;
	}

	return {
		generatedAt: new Date().toISOString(),
		pageCount: htmlFiles.length,
		totalTrackedBytes: totalBytes,
		totalTrackedSize: formatBytes(totalBytes),
		fileCounts: counts,
		pages,
	};
}

async function main() {
	const shouldWrite = process.argv.includes("--write");
	const shouldCheck = process.argv.includes("--check");
	const baselinePath = resolve(
		process.env.TSUKIMI_PERFORMANCE_BASELINE ?? defaultBaselinePath,
	);
	const metrics = await collectBuildMetrics();

	if (shouldCheck) {
		let baseline;
		try {
			baseline = JSON.parse(await readFile(baselinePath, "utf8"));
		} catch {
			throw new Error(`Performance baseline not found: ${baselinePath}`);
		}
		const baselineBytes = baseline.totalTrackedBytes;
		const change = baselineBytes ? (metrics.totalTrackedBytes - baselineBytes) / baselineBytes : 0;
		console.log(`Current tracked output: ${metrics.totalTrackedSize}`);
		console.log(`Baseline tracked output: ${formatBytes(baselineBytes)}`);
		console.log(`Tracked output change: ${(change * 100).toFixed(2)}%`);
		if (change > 0.1) {
			throw new Error("Tracked output increased by more than 10%.");
		}
		return;
	}

	console.log(`Pages: ${metrics.pageCount}`);
	console.log(`Tracked output: ${metrics.totalTrackedSize}`);
	for (const [name, page] of Object.entries(metrics.pages)) {
		if (!page) {
			console.log(`${name}: route not found`);
			continue;
		}
		console.log(
			`${name}: HTML ${formatBytes(page.htmlBytes)}, local JS/CSS ${formatBytes(page.localJsCssBytes)}`,
		);
	}

	if (shouldWrite) {
		await mkdir(dirname(baselinePath), { recursive: true });
		await writeFile(`${baselinePath}`, `${JSON.stringify(metrics, null, 2)}\n`);
		console.log(`Baseline written to ${baselinePath}`);
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	try {
		await main();
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}
