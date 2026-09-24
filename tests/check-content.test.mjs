import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { checkContentFiles } from "../scripts/check-content.mjs";

async function createFixture(files) {
	const root = await mkdtemp(join(tmpdir(), "tsukimi-content-test-"));
	for (const [name, content] of Object.entries(files)) {
		const filePath = join(root, name);
		await mkdir(join(filePath, ".."), { recursive: true });
		await writeFile(filePath, content);
	}
	return root;
}

test("accepts valid frontmatter and a local cover image", async () => {
	const root = await createFixture({
		"guide/index.md":
			"---\ntitle: Guide\npublished: 2024-01-01\nimage: ./cover.webp\ntags: [guide]\n---\n",
		"guide/cover.webp": "image",
	});

	const result = await checkContentFiles({ root });
	assert.deepEqual(result.errors, []);
});

test("reports missing required fields and local assets", async () => {
	const root = await createFixture({
		"broken.md": `---\ntitle: ''\npublished: invalid\nencrypted: true\nimage: ./missing.webp\n---\n`,
	});

	const result = await checkContentFiles({ root });
	assert.equal(result.errors.length, 4);
	assert.match(result.errors.join("\n"), /title/);
	assert.match(result.errors.join("\n"), /published/);
	assert.match(result.errors.join("\n"), /password/);
	assert.match(result.errors.join("\n"), /image/);
});

test("reports duplicate explicit routes", async () => {
	const root = await createFixture({
		"one.md":
			"---\ntitle: One\npublished: 2024-01-01\npermalink: /same/\n---\n",
		"two.md": "---\ntitle: Two\npublished: 2024-01-02\nalias: same\n---\n",
	});

	const result = await checkContentFiles({ root });
	assert.equal(result.errors.length, 1);
	assert.match(result.errors[0], /conflicts/);
});
