import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const routes = (process.env.LIGHTHOUSE_ROUTES ?? "/,/posts/guide/,/archive/,/tags/,/docs/tsukimi/,/friends/")
	.split(",").map((route) => route.trim()).filter(Boolean);
const mobile = process.argv.includes("--mobile");
const output = process.env.LIGHTHOUSE_MATRIX_OUTPUT ?? `.lighthouseci/${mobile ? "mobile-" : ""}matrix.json`;
const crawlableRoutes = new Set((process.env.LIGHTHOUSE_CRAWLABLE_ROUTES ?? "/,/posts/guide/")
	.split(",").map((route) => route.trim()).filter(Boolean));

function run(route) {
	return new Promise((resolve, reject) => {
		const child = spawn("pnpm", [mobile ? "perf:lighthouse:mobile" : "perf:lighthouse"], {
			env: {
				...process.env,
				LIGHTHOUSE_ROUTE: route,
				LIGHTHOUSE_MIN_SEO: crawlableRoutes.has(route) ? "1" : "0.66",
				LIGHTHOUSE_OUTPUT: `.lighthouseci/${mobile ? "mobile-" : ""}${encodeURIComponent(route)}.json`,
			},
			stdio: "inherit",
		});
		child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`Lighthouse failed for ${route}`)));
	});
}

async function assertBuiltRoute(route) {
	const pathname = new URL(route, "http://localhost").pathname;
	const relative = pathname.replace(/^\/+/, "");
	try {
		await access(path.join("dist", relative, "index.html"));
	} catch {
		throw new Error(`Lighthouse route ${route} has no built page; check feature gates or LIGHTHOUSE_ROUTES`);
	}
}

const results = {};
for (const route of routes) {
	await assertBuiltRoute(route);
	await run(route);
	const reportPath = `.lighthouseci/${mobile ? "mobile-" : ""}${encodeURIComponent(route)}.json`;
	const report = JSON.parse(await readFile(reportPath, "utf8"));
	results[route] = {
		...Object.fromEntries(Object.entries(report.categories).map(([name, category]) => [name, category.score])),
		expectedSeo: crawlableRoutes.has(route) ? 1 : 0.66,
		crawlable: crawlableRoutes.has(route),
	};
}
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), mobile, routes: results }, null, 2)}\n`);
console.log(`Lighthouse matrix written for ${routes.length} routes: ${output}`);
