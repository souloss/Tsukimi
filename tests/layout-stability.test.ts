import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("..", import.meta.url);

test("layout stability safeguards remain present", async () => {
	const [mainCss, motionTokens, settings] = await Promise.all([
		readFile(new URL("src/styles/main.css", root), "utf8"),
		readFile(new URL("src/styles/motion-tokens.css", root), "utf8"),
		readFile(
			new URL("src/components/features/settings/DisplaySettings.svelte", root),
			"utf8",
		),
	]);
	assert.match(mainCss, /scrollbar-gutter:\s*stable/);
	assert.match(motionTokens, /prefers-reduced-motion/);
	assert.match(settings, /overscroll-behavior:\s*contain/);
	assert.match(settings, /max-height:\s*min\(/);
	assert.match(settings, /overflow-y:\s*auto/);
});
