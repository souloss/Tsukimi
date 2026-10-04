import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
	fetchExternalJson,
	fetchExternalText,
} from "../scripts/external-request.mjs";

const originalFetch = globalThis.fetch;
afterEach(() => {
	globalThis.fetch = originalFetch;
});

test("external request validates HTTP, parses JSON and text, and retries", async () => {
	let attempts = 0;
	globalThis.fetch = async (_url, options) => {
		assert.ok(options.signal);
		attempts += 1;
		if (attempts === 1) return new Response("temporary", { status: 503 });
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	};
	assert.deepEqual(
		await fetchExternalJson("https://example.test/data", {
			source: "test",
			retries: 1,
		}),
		{ ok: true },
	);
	assert.equal(attempts, 2);

	globalThis.fetch = async () => new Response("<rss />", { status: 200 });
	assert.equal(
		await fetchExternalText("https://example.test/feed", { source: "test" }),
		"<rss />",
	);
});

test("external request reports timeout and caller cancellation", async () => {
	globalThis.fetch = (_url, { signal }) =>
		new Promise((_resolve, reject) => {
			signal.addEventListener(
				"abort",
				() => reject(new DOMException("aborted", "AbortError")),
				{ once: true },
			);
		});
	await assert.rejects(
		fetchExternalText("https://example.test/slow", {
			source: "slow",
			timeoutMs: 5,
			retries: 0,
		}),
		(error) => error.code === "timeout" && error.source === "slow",
	);

	const controller = new AbortController();
	const pending = fetchExternalText("https://example.test/cancel", {
		source: "cancel",
		signal: controller.signal,
		timeoutMs: 1000,
		retries: 0,
	});
	controller.abort();
	await assert.rejects(pending, (error) => error.code === "aborted");
});
