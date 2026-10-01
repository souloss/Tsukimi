import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distRoot = resolve(root, "dist");
const output = resolve(root, "docs/generated/resource-report.json");

function routeFor(filePath) {
	const relativePath = relative(distRoot, filePath).replaceAll("\\", "/");
	if (relativePath === "index.html") return "/";
	if (relativePath.endsWith("/index.html")) return `/${relativePath.slice(0, -11)}/`;
	return `/${relativePath}`;
}

function localReferences(html) {
	return [...html.matchAll(/\b(?:src|href)=['"]([^'"]+)['"]/g)]
		.map((match) => match[1])
		.filter((reference) => reference.startsWith("/"));
}

const htmlFiles = await glob("**/*.html", { cwd: distRoot, absolute: true });
const pages = {};
for (const filePath of htmlFiles) {
	const html = await readFile(filePath, "utf8");
	const references = localReferences(html);
	const resources = [];
	for (const reference of new Set(references)) {
		const resourcePath = resolve(distRoot, reference.slice(1).split(/[?#]/, 1)[0]);
		try {
			const bytes = (await stat(resourcePath)).size;
			resources.push({
				path: reference,
				type: extname(resourcePath).slice(1) || "unknown",
				bytes,
			});
		} catch {
			// External or conditionally generated resources are ignored.
		}
	}
	pages[routeFor(filePath)] = resources.sort((a, b) => b.bytes - a.bytes);
}

await mkdir(dirname(output), { recursive: true });
await writeFile(
	output,
	`${JSON.stringify({ pages }, null, 2)}\n`,
);
console.log(`Generated resource report for ${Object.keys(pages).length} pages.`);
