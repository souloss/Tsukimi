import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = resolve(root, "src/plugins/markdown-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const errors = [];
if (manifest.version !== 1) errors.push("manifest version must be 1");
if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
	errors.push("manifest entries must be a non-empty array");
}

const ids = new Set();
for (const entry of manifest.entries ?? []) {
	if (!entry.id || !entry.syntax || !entry.implementation) {
		errors.push("every entry needs id, syntax, and implementation");
		continue;
	}
	if (ids.has(entry.id)) errors.push(`duplicate markdown entry: ${entry.id}`);
	ids.add(entry.id);
	try {
		await access(resolve(root, entry.implementation));
	} catch {
		errors.push(`${entry.id} implementation is missing: ${entry.implementation}`);
	}
}

if (errors.length > 0) {
	console.error(`Markdown manifest validation failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`  - ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Markdown manifest validation passed (${manifest.entries.length} entries).`);
}
