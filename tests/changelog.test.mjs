import assert from "node:assert/strict";
import { test } from "node:test";

import {
	generateChangelog,
	normalizeRepositoryUrl,
	parseCommitRecord,
} from "../scripts/generate-changelog.mjs";

test("classifies conventional commits and marks breaking changes", () => {
	const breaking = parseCommitRecord(
		"0123456789abcdef0123456789abcdef01234567\tfeat(api)!: remove legacy endpoint",
	);
	assert.equal(breaking.type, "breaking");
	assert.equal(breaking.scope, "api");

	const output = generateChangelog([
		"0123456789abcdef0123456789abcdef01234567\tfeat(search): add filters",
		"abcdefabcdefabcdefabcdefabcdefabcdefabcd\tfix: avoid null result crash",
		"1111111111111111111111111111111111111111\tperf: reduce image bytes",
	]);
	assert.match(output, /## Added/);
	assert.match(output, /## Fixed/);
	assert.match(output, /## Performance/);
});

test("recognizes a breaking-change footer", () => {
	const commit = parseCommitRecord(
		"0123456789abcdef0123456789abcdef01234567\tfeat(api): replace response shape\tBREAKING CHANGE: clients must update",
	);
	assert.equal(commit.type, "breaking");
});

test("redacts credential-shaped text from commit subjects", () => {
	const output = generateChangelog([
		"0123456789abcdef0123456789abcdef01234567\tfix: remove token=secret-value and ghp_abcdefghijklmnopqrstuvwxyz123456",
	]);
	assert.doesNotMatch(
		output,
		/secret-value|ghp_abcdefghijklmnopqrstuvwxyz123456/,
	);
	assert.match(output, /token=\[REDACTED\]/);
});

test("creates links only for trusted GitHub remotes", () => {
	assert.equal(
		normalizeRepositoryUrl("git@github.com:souloss/Tsukimi.git"),
		"https://github.com/souloss/Tsukimi",
	);
	assert.equal(
		normalizeRepositoryUrl(
			"https://user:password@github.com/souloss/Tsukimi.git",
		),
		undefined,
	);
});
