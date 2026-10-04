import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeUrl } from "../src/plugins/remark-content-directives.mjs";

test("content URL sanitizer blocks executable and unsafe data protocols", () => {
	assert.equal(sanitizeUrl("javascript:alert(1)", "#"), "#");
	assert.equal(sanitizeUrl("vbscript:msgbox(1)", "#"), "#");
	assert.equal(
		sanitizeUrl("data:text/html,<script>alert(1)</script>", "#"),
		"#",
	);
	assert.equal(
		sanitizeUrl("data:image/png;base64,abc"),
		"data:image/png;base64,abc",
	);
	assert.equal(
		sanitizeUrl("https://example.com/image.webp"),
		"https://example.com/image.webp",
	);
});
