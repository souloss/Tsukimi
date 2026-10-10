import assert from "node:assert/strict";
import { test } from "node:test";

import {
	checkPerformanceRegression,
	createSampledReporter,
} from "../src/utils/performance-observer.ts";

test("sampled reporter clamps rates and forwards only selected metrics", () => {
	const seen: string[] = [];
	const originalRandom = Math.random;
	Math.random = () => 0.5;
	try {
		createSampledReporter(
			(metric) => seen.push(metric.name),
			0,
		)({
			name: "FCP",
			value: 1,
			rating: "good",
			delta: 1,
			id: "fcp-1",
			entries: [],
		});
		createSampledReporter(
			(metric) => seen.push(metric.name),
			1,
		)({
			name: "LCP",
			value: 1,
			rating: "good",
			delta: 1,
			id: "lcp-1",
			entries: [],
		});
	} finally {
		Math.random = originalRandom;
	}
	assert.deepEqual(seen, ["LCP"]);
});

test("performance regression check reports only changes above the threshold", () => {
	const result = checkPerformanceRegression(
		{ LCP: 1200, CLS: 0.14, FCP: 1000 },
		{ LCP: 1000, CLS: 0.1, FCP: 1000 },
		{ regressionPercent: 20 },
	);
	assert.equal(result.hasRegression, true);
	assert.deepEqual(
		result.regressions.map(({ metric }) => metric),
		["CLS"],
	);
});
