import { collectBuildMetrics } from "./performance-baseline.mjs";

const budget = {
	maxTrackedBytes: 45 * 1024 * 1024,
	maxPageHtmlBytes: 1024 * 1024,
	maxPageJsCssBytes: 1024 * 1024,
	maxPageJsCssReferences: 32,
};
const metrics = await collectBuildMetrics();
const errors = [];

if (metrics.totalTrackedBytes > budget.maxTrackedBytes) {
	errors.push(`tracked output exceeds ${budget.maxTrackedBytes} bytes`);
}
for (const [route, page] of Object.entries(metrics.pages)) {
	if (!page) continue;
	if (page.htmlBytes > budget.maxPageHtmlBytes) {
		errors.push(`${route} HTML exceeds ${budget.maxPageHtmlBytes} bytes`);
	}
	if (page.localJsCssBytes > budget.maxPageJsCssBytes) {
		errors.push(`${route} JS/CSS exceeds ${budget.maxPageJsCssBytes} bytes`);
	}
	if (page.localJsCssReferences > budget.maxPageJsCssReferences) {
		errors.push(`${route} references more than ${budget.maxPageJsCssReferences} local JS/CSS files`);
	}
}

if (errors.length > 0) {
	console.error(`Performance budget failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`  - ${error}`);
	process.exit(1);
}

console.log(
	`Performance budget passed (${metrics.pageCount} pages, ${(metrics.totalTrackedBytes / 1024 / 1024).toFixed(1)} MiB tracked).`,
);
