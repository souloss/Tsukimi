import { gunzipSync } from "node:zlib";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const distRoot = path.resolve("dist");
const errors = [];
for (const index of ["default", "tsukimi"]) {
	const root = path.join(distRoot, "pagefind", index);
	await access(path.join(root, "pagefind-entry.json")).catch(() => errors.push(`missing ${index} Pagefind entry`));
	const fragments = await glob("fragment/*.pf_fragment", { cwd: root, absolute: true });
	if (fragments.length === 0) errors.push(`${index} Pagefind index has no fragments`);
	for (const file of fragments) {
		try {
			const content = gunzipSync(await readFile(file)).toString("utf8");
			if (/my-secret-password/.test(content)) errors.push(`${path.relative(process.cwd(), file)} contains a fixture password`);
		} catch (error) {
			errors.push(`${path.relative(process.cwd(), file)} cannot be decompressed: ${error.message}`);
		}
	}
}
if (errors.length) {
	console.error(`Pagefind quality check failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log("Pagefind indexes and encrypted-content boundary passed.");
