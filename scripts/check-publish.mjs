import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { validateConfig } from "./check-config.mjs";
import { checkContentFiles } from "./check-content.mjs";
import { auditFonts } from "./check-fonts.mjs";
import { auditImages } from "./check-images.mjs";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distRoot = resolve(projectRoot, "dist");

const content = await checkContentFiles({ strictPublish: true });
const config = await validateConfig();
const hasDist = await access(distRoot).then(() => true).catch(() => false);
const images = hasDist ? await auditImages() : { errors: [] };
const fonts = hasDist ? await auditFonts() : { errors: [] };
const errors = [
	...content.errors.map((error) => `content: ${error}`),
	...config.map((error) => `config: ${error}`),
	...images.errors.map((error) => `images: ${error}`),
	...fonts.errors.map((error) => `fonts: ${error}`),
];

if (errors.length > 0) {
	console.error(`Publish check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`  - ${error}`);
	process.exit(1);
}

console.log(
	`Publish check passed: ${content.files.length} posts (${content.draftCount} drafts), ` +
		`${hasDist ? "production artifacts audited" : "run pnpm build for artifact audits"}.`,
);
