import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { collectBuildMetrics } from "./performance-baseline.mjs";

const profiles = {
	desktop: { width: 1440, height: 900, cpu: "desktop" },
	mobile375: { width: 375, height: 812, cpu: "low-end-mobile" },
	mobile390: { width: 390, height: 844, cpu: "low-end-mobile" },
	tablet768: { width: 768, height: 1024, cpu: "mobile" },
};
const metrics = await collectBuildMetrics();
const routes = [
	"/",
	"/posts/markdown-extended/",
	"/archive/",
	"/tags/",
	"/docs/tsukimi/",
	"/anime/",
];
const budgets = {
	performance: Number(process.env.TSUKIMI_PERF_SCORE_MIN ?? 0.6),
	lcpMs: Number(process.env.TSUKIMI_LCP_BUDGET_MS ?? 4000),
	cls: Number(process.env.TSUKIMI_CLS_BUDGET ?? 0.1),
	inpMs: Number(process.env.TSUKIMI_INP_BUDGET_MS ?? 500),
	ttfbMs: Number(process.env.TSUKIMI_TTFB_BUDGET_MS ?? 800),
	fcpMs: Number(process.env.TSUKIMI_FCP_BUDGET_MS ?? 3000),
};
const report = {
	generatedAt: new Date().toISOString(),
	profiles,
	routes: Object.fromEntries(routes.map((route) => [route, {
		available: Boolean(metrics.pages[route === "/" ? "home" : route.includes("posts") ? "article" : route.includes("docs") ? "docs" : route.includes("anime") ? "feature" : null]),
		budgets,
	}])),
	budgets,
	build: metrics,
};
const outputPath = process.env.TSUKIMI_PERFORMANCE_MATRIX_OUTPUT ?? path.join(process.cwd(), "docs", "generated", "performance-matrix.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
const missing = routes.filter((route) => route === "/posts/markdown-extended/" ? !metrics.pages.article : route === "/docs/tsukimi/" ? !metrics.pages.docs : route === "/" ? !metrics.pages.home : !metrics.pages.feature);
if (missing.length > 0) {
	console.error(`Performance matrix missing routes: ${missing.join(", ")}`);
	process.exit(1);
}
console.log(`Performance matrix written for ${routes.length} routes and ${Object.keys(profiles).length} profiles: ${outputPath}`);
