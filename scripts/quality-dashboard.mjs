import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function readJson(file) {
	try { return JSON.parse(await readFile(file, "utf8")); } catch { return null; }
}

const performance = await readJson("docs/generated/performance-matrix.json");
const resource = await readJson("docs/generated/resource-report.json");
const report = {
	generatedAt: new Date().toISOString(),
	commit: process.env.GITHUB_SHA ?? "local",
	ref: process.env.GITHUB_REF ?? process.env.GITHUB_REF_NAME ?? "local",
	baseCommit: process.env.GITHUB_BASE_SHA ?? process.env.GITHUB_EVENT_BEFORE ?? null,
	run: process.env.GITHUB_RUN_ID ?? null,
	performance,
	resourcePages: resource ? Object.keys(resource.pages ?? {}).length : 0,
	checks: {
		astro: process.env.QUALITY_ASTRO ?? "not-recorded",
		typecheck: process.env.QUALITY_TYPECHECK ?? "not-recorded",
		tests: process.env.QUALITY_TESTS ?? "not-recorded",
		browser: process.env.QUALITY_BROWSER ?? "not-recorded",
	},
};
const output = process.env.QUALITY_REPORT_OUTPUT ?? path.join("docs", "generated", "quality-report.json");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Quality report written: ${output}`);
