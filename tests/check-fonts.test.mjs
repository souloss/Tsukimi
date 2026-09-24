import assert from "node:assert/strict";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { auditFonts } from "../scripts/check-fonts.mjs";

test("font audit reports missing generated files", async () => {
	const root = await mkdtemp(join(tmpdir(), "tsukimi-fonts-test-"));
	await mkdir(join(root, "assets/font"), { recursive: true });
	const report = await auditFonts({ distRoot: root });
	assert.ok(report.fontCount > 0);
	assert.ok(
		report.errors.some((error) => error.includes("missing generated WOFF2")),
	);
});
