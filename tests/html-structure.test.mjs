import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { auditHtmlStructure } from "../scripts/check-html-structure.mjs";

async function withFixture(html, callback) {
	const root = await mkdtemp(path.join(os.tmpdir(), "tsukimi-html-"));
	try {
		await writeFile(path.join(root, "index.html"), html);
		return await callback(root);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
}

test("HTML structure audit accepts documented responsive duplicates", async () => {
	const report = await withFixture(
		'<html lang="zh-CN"><body><main><h1>Title</h1><h2>Section</h2><div id="announcement"></div><div id="announcement"></div><a href="/">Home</a><button type="button">Open</button></main></body></html>',
		(root) => auditHtmlStructure({ distRoot: root }),
	);
	assert.deepEqual(report.errors, []);
});

test("HTML structure audit reports stable rule ids", async () => {
	const report = await withFixture(
		'<html lang="zh-CN"><body><main><h1>Title</h1><h3>Skipped</h3><div id="duplicate"></div><div id="duplicate"></div><a>Missing</a><form><button>Missing type</button></form><a href="/"><button type="button">Nested</button></a></main></body></html>',
		(root) => auditHtmlStructure({ distRoot: root }),
	);
	assert.ok(
		report.errors.some((error) => error.startsWith("HTML-HEADING-JUMP")),
	);
	assert.ok(
		report.errors.some((error) => error.startsWith("HTML-DUPLICATE-ID")),
	);
	assert.ok(
		report.errors.some((error) => error.startsWith("HTML-ANCHOR-HREF")),
	);
	assert.ok(
		report.errors.some((error) => error.startsWith("HTML-BUTTON-TYPE")),
	);
	assert.ok(
		report.errors.some((error) => error.startsWith("HTML-NESTED-INTERACTIVE")),
	);
});
