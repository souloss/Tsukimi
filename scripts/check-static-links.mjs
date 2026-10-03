import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const root = path.resolve("dist");
const htmlFiles = await glob("**/*.html", { cwd: root, absolute: true });
const errors = [];
const exists = async (relative) => access(path.join(root, relative)).then(() => true).catch(() => false);
const knownRoutes = new Set(["/"]);
for (const file of htmlFiles) {
	const relative = path.relative(root, file).replaceAll(path.sep, "/");
	if (relative === "404.html") continue;
	knownRoutes.add(relative.endsWith("index.html") ? `/${relative.slice(0, -"index.html".length)}` : `/${relative}`);
}

for (const file of htmlFiles) {
	const source = await readFile(file, "utf8");
	const relative = path.relative(root, file).replaceAll(path.sep, "/");
	for (const match of source.matchAll(/href="([^"]+)"/g)) {
		const target = match[1].split(/[?#]/, 1)[0];
		if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/api/")) continue;
		const normalized = target.replace(/^\/+/, "");
		const candidates = [normalized, `${normalized}index.html`, `${normalized.replace(/\/$/, "")}.html`];
		if (["/sitemap-index.xml", "/favicon.png"].includes(target) || target.startsWith("/js/") || target.startsWith("/demos/") || target.startsWith("/sponsor/") || target.startsWith("/zh/") || target.startsWith("/tags/")) continue;
		if (target.startsWith("/my-repo/")) continue;
		const isAsset = normalized.startsWith("_astro/") || normalized.startsWith("assets/") || normalized.startsWith("favicon/") || normalized.startsWith("images/");
		const valid = isAsset
			? (await Promise.all(candidates.map(exists))).some(Boolean)
			: knownRoutes.has(target.endsWith("/") ? target : `${target}/`) || knownRoutes.has(target);
		if (!valid) {
			errors.push(`${relative}: missing local target ${target}`);
		}
	}
}

if (errors.length) {
	console.error(`Static link check failed (${errors.length}):`);
	for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`Static link check passed (${htmlFiles.length} HTML files).`);
