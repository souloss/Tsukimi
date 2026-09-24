import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { auditImages } from "../scripts/check-images.mjs";

test("audits image loading metadata in generated HTML", async () => {
	const root = await mkdtemp(join(tmpdir(), "tsukimi-images-test-"));
	await mkdir(join(root, "posts"), { recursive: true });
	await writeFile(
		join(root, "index.html"),
		'<img src="/hero.webp" alt="Hero" width="1200" height="630" loading="eager" decoding="async">',
	);
	await writeFile(
		join(root, "posts/index.html"),
		'<img src="https://example.com/photo.jpg" alt="Photo" loading="lazy" decoding="async">',
	);

	const report = await auditImages({ distRoot: root });
	assert.deepEqual(report.errors, []);
	assert.equal(report.imageCount, 2);
	assert.equal(report.missingDimensions, 1);
});

test("reports missing image loading metadata", async () => {
	const root = await mkdtemp(join(tmpdir(), "tsukimi-images-test-"));
	await writeFile(join(root, "index.html"), '<img src="/hero.png" alt="Hero">');

	const report = await auditImages({ distRoot: root });
	assert.equal(report.errors.length, 1);
	assert.match(report.errors.join("\n"), /missing loading/);
	assert.equal(report.missingDecoding, 1);
});
