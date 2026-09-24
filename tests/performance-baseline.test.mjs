import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { collectBuildMetrics } from "../scripts/performance-baseline.mjs";

test("collects page and local asset metrics from a static build", async () => {
	const root = await mkdtemp(join(tmpdir(), "tsukimi-perf-test-"));
	await mkdir(join(root, "posts/markdown-extended"), { recursive: true });
	await mkdir(join(root, "docs/tsukimi"), { recursive: true });
	await mkdir(join(root, "friends"), { recursive: true });
	await mkdir(join(root, "_astro"), { recursive: true });
	await writeFile(
		join(root, "index.html"),
		'<link rel="stylesheet" href="/_astro/site.css"><script src="/_astro/site.js"></script>',
	);
	await writeFile(join(root, "posts/markdown-extended/index.html"), "article");
	await writeFile(join(root, "docs/tsukimi/index.html"), "docs");
	await writeFile(join(root, "friends/index.html"), "friend");
	await writeFile(join(root, "_astro/site.css"), "css");
	await writeFile(join(root, "_astro/site.js"), "javascript");

	const metrics = await collectBuildMetrics({ distRoot: root });
	assert.equal(metrics.pageCount, 4);
	assert.equal(metrics.pages.home.htmlBytes, 86);
	assert.equal(metrics.pages.home.localJsCssBytes, 13);
	assert.equal(metrics.pages.article.htmlBytes, 7);
	assert.equal(metrics.pages.docs.htmlBytes, 4);
	assert.deepEqual(metrics.pages.feature, {
		route: "/friends/",
		htmlBytes: 6,
		localJsCssBytes: 0,
		localJsCssReferences: 0,
	});
});
