import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";
import {
	createImageCacheKey,
	IMAGE_PIPELINE_VERSION,
	isValidImageOutput,
} from "../scripts/image-cache.mjs";

test("image cache keys include source bytes and encoder configuration", () => {
	const config = { widths: [320, 640], formats: { avif: { quality: 55 } } };
	const first = createImageCacheKey(Buffer.from("source-a"), config);
	assert.equal(first, createImageCacheKey(Buffer.from("source-a"), config));
	assert.notEqual(first, createImageCacheKey(Buffer.from("source-b"), config));
	assert.notEqual(
		first,
		createImageCacheKey(Buffer.from("source-a"), { ...config, widths: [320] }),
	);
	assert.equal(IMAGE_PIPELINE_VERSION, 2);
});

test("image output validation recognizes encoded AVIF files", async () => {
	const directory = await mkdtemp(
		path.join(os.tmpdir(), "tsukimi-image-cache-"),
	);
	const output = path.join(directory, "sample-w4.avif");
	try {
		await sharp({
			create: {
				width: 4,
				height: 3,
				channels: 3,
				background: { r: 32, g: 64, b: 96 },
			},
		})
			.avif({ quality: 55, effort: 4 })
			.toFile(output);
		assert.equal(
			await isValidImageOutput(output, { format: "avif", width: 4 }),
			true,
		);
		assert.equal(
			await isValidImageOutput(output, { format: "webp", width: 4 }),
			false,
		);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
