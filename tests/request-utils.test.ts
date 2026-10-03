import assert from "node:assert/strict";
import { test } from "node:test";

import {
	advanceRequestGeneration,
	fetchJson,
	RequestLifecycleError,
} from "../src/utils/request-utils.ts";

test("fetchJson deduplicates concurrent requests and validates JSON", async () => {
	const originalFetch = globalThis.fetch;
	let calls = 0;
	globalThis.fetch = async () => {
		calls += 1;
		return new Response(JSON.stringify({ ok: true }), {
			headers: { "content-type": "application/json" },
		});
	};
	try {
		const [first, second] = await Promise.all([
			fetchJson<{ ok: boolean }>("/test", {
				dedupeKey: "request-test",
				validate: (value): value is { ok: boolean } =>
					typeof value === "object" && value !== null && "ok" in value,
			}),
			fetchJson<{ ok: boolean }>("/test", { dedupeKey: "request-test" }),
		]);
		assert.deepEqual(first, { ok: true });
		assert.deepEqual(second, { ok: true });
		assert.equal(calls, 1);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test("fetchJson rejects responses from a replaced page", async () => {
	const originalFetch = globalThis.fetch;
	let resolveResponse!: (response: Response) => void;
	globalThis.fetch = () =>
		new Promise<Response>((resolve) => {
			resolveResponse = resolve;
		});
	try {
		const request = fetchJson("/stale", { dedupeKey: "stale-test" });
		advanceRequestGeneration();
		resolveResponse(
			new Response(JSON.stringify({ ok: true }), {
				headers: { "content-type": "application/json" },
			}),
		);
		await assert.rejects(
			request,
			(error: unknown) =>
				error instanceof RequestLifecycleError && error.code === "stale",
		);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test("fetchJson retries transient failures and preserves source context", async () => {
	const originalFetch = globalThis.fetch;
	let calls = 0;
	globalThis.fetch = async () => {
		calls += 1;
		if (calls < 3) throw new Error("temporary network failure");
		return new Response(JSON.stringify({ ok: true }), {
			headers: { "content-type": "application/json" },
		});
	};
	try {
		const result = await fetchJson<{ ok: boolean }>("/retry", {
			retries: 2,
			retryDelayMs: 1,
			source: "calendar",
		});
		assert.deepEqual(result, { ok: true });
		assert.equal(calls, 3);
	} finally {
		globalThis.fetch = originalFetch;
	}
});
