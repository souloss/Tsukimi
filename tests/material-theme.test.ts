import assert from "node:assert/strict";
import test from "node:test";

import {
	MATERIAL_PALETTE_STYLES,
	materialColorCssVariables,
	resolveMaterialColorScheme,
} from "../src/utils/material-theme";

test("material palettes provide paired readable roles in both color modes", () => {
	for (const style of MATERIAL_PALETTE_STYLES) {
		for (const isDark of [false, true]) {
			const colors = resolveMaterialColorScheme(210, isDark, style, "2025");
			assert.match(colors.primary, /^#[\da-f]{6}$/i);
			assert.match(colors.onPrimary, /^#[\da-f]{6}$/i);
			assert.match(colors.surface, /^#[\da-f]{6}$/i);
			assert.match(colors.onSurface, /^#[\da-f]{6}$/i);
			assert.notEqual(colors.primary, colors.onPrimary);
		}
	}
});

test("material role variables preserve Tsukimi's existing CSS contract", () => {
	const variables = materialColorCssVariables(
		resolveMaterialColorScheme(330, false),
	);

	assert.equal(variables["--primary"], "var(--mc-primary)");
	assert.equal(variables["--secondary"], "var(--mc-secondary)");
	assert.equal(variables["--tertiary"], "var(--mc-tertiary)");
	assert.equal(variables["--page-bg"], "var(--mc-surface)");
	assert.equal(variables["--text-primary"], "var(--mc-on-surface)");
	assert.match(
		variables["--mc-surface-container-high"] ?? "",
		/^#[\da-f]{6}$/i,
	);
});
