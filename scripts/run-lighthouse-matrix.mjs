import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const routes = (process.env.LIGHTHOUSE_ROUTES ?? "/,/posts/markdown-extended/,/archive/,/tags/,/docs/tsukimi/,/anime/")
	.split(",").map((route) => route.trim()).filter(Boolean);
const output = process.env.LIGHTHOUSE_MATRIX_OUTPUT ?? ".lighthouseci/matrix.json";
const mobile = process.argv.includes("--mobile");

function run(route) {
	return new Promise((resolve, reject) => {
		const child = spawn("pnpm", [mobile ? "perf:lighthouse:mobile" : "perf:lighthouse"], {
			env: { ...process.env, LIGHTHOUSE_ROUTE: route, LIGHTHOUSE_OUTPUT: `.lighthouseci/${mobile ? "mobile-" : ""}${encodeURIComponent(route)}.json` },
			stdio: "inherit",
		});
		child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`Lighthouse failed for ${route}`)));
	});
}

const results = {};
for (const route of routes) {
	await run(route);
	const reportPath = `.lighthouseci/${mobile ? "mobile-" : ""}${encodeURIComponent(route)}.json`;
	const report = JSON.parse(await readFile(reportPath, "utf8"));
	results[route] = Object.fromEntries(Object.entries(report.categories).map(([name, category]) => [name, category.score]));
}
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), mobile, routes: results }, null, 2)}\n`);
console.log(`Lighthouse matrix written for ${routes.length} routes: ${output}`);
