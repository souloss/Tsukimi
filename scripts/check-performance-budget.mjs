import { collectBuildMetrics } from "./performance-baseline.mjs";

const metrics = await collectBuildMetrics();
// Content-repository builds add one static HTML page per article. Keep the
// original cap for normal builds, then reserve a bounded amount per page.
const baseTrackedBytes = 45 * 1024 * 1024;
const basePageCount = 150;
const additionalPageAllowance = 256 * 1024;
const configuredMaxTrackedBytes = Number(
	process.env.TSUKIMI_PERFORMANCE_MAX_TRACKED_BYTES,
);
const maxTrackedBytes =
	Number.isFinite(configuredMaxTrackedBytes) && configuredMaxTrackedBytes > 0
		? configuredMaxTrackedBytes
		: baseTrackedBytes +
			Math.max(0, metrics.pageCount - basePageCount) * additionalPageAllowance;

const budget = {
	maxTrackedBytes,
	maxPageHtmlBytes: 1024 * 1024,
	maxPageJsCssBytes: 1024 * 1024,
	maxPageJsCssReferences: 32,
};
const errors = [];

if (metrics.totalTrackedBytes > budget.maxTrackedBytes) {
	errors.push(
		`tracked output is ${metrics.totalTrackedBytes} bytes, exceeding ${budget.maxTrackedBytes} bytes`,
	);
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
	`Performance budget passed (${metrics.pageCount} pages, ${(metrics.totalTrackedBytes / 1024 / 1024).toFixed(1)} MiB tracked, ${(budget.maxTrackedBytes / 1024 / 1024).toFixed(1)} MiB budget).`,
);
