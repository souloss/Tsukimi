import { readFile } from "node:fs/promises";
import path from "node:path";

import { featurePageRegistry } from "../src/config/featureRoutes.ts";

const root = process.cwd();
const errors: string[] = [];

for (const [key, route] of Object.entries(featurePageRegistry)) {
	try {
		const source = await readFile(path.join(root, route.page), "utf8");
		if (!source.includes(`siteConfig.featurePages.${key}`)) {
			errors.push(`${route.page} does not enforce featurePages.${key}`);
		}
	} catch {
		errors.push(`${key} route page is missing: ${route.page}`);
	}
	if (!route.path.startsWith("/") || !route.path.endsWith("/")) {
		errors.push(`${key} route must use a leading and trailing slash: ${route.path}`);
	}
}

if (errors.length > 0) {
	console.error(`Route registry check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}

console.log(`Route registry check passed (${Object.keys(featurePageRegistry).length} feature routes).`);
