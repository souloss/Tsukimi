import assert from "node:assert/strict";
import { test } from "node:test";

import {
	isTexturePreset,
	resolveTextureConfig,
	TEXTURE_PRESETS,
} from "../src/config/textureConfig";

test("texture presets have a bounded, normalized configuration", () => {
	assert.equal(TEXTURE_PRESETS[0], "none");
	assert.ok(isTexturePreset("starlight"));
	assert.equal(isTexturePreset("invalid"), false);
	assert.deepEqual(resolveTextureConfig({ defaultOpacity: 1 }), {
		enable: false,
		switchable: false,
		defaultPreset: "none",
		defaultOpacity: 0.25,
		allowMotion: false,
	});
});
