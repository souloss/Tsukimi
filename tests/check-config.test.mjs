import assert from "node:assert/strict";
import { test } from "node:test";

import {
	validateConfig,
	validateEnvironment,
} from "../scripts/check-config.mjs";

test("default feature, navigation, and sidebar configuration is consistent", async () => {
	const errors = await validateConfig();
	assert.deepEqual(errors, []);
});

test("reports disabled features that remain in navigation", async () => {
	const errors = await validateConfig({
		site: {
			featurePages: {
				anime: false,
				talking: true,
				friends: true,
				projects: true,
				skills: true,
				timeline: true,
				albums: true,
				devices: true,
				series: true,
				reposts: true,
				guestbook: true,
				sponsor: true,
			},
		},
		navbar: { links: [{ name: "Anime", url: "/anime/" }] },
		sidebar: { components: { left: [], right: [], drawer: [] } },
	});

	assert.match(errors.join("\n"), /disabled feature anime/);
});

test("rejects invalid theme palette configuration", async () => {
	const errors = await validateConfig({
		site: {
			themeColor: { paletteStyle: "unknown" },
			featurePages: {},
		},
		navbar: { links: [] },
		sidebar: { components: { left: [], right: [], drawer: [] } },
	});

	assert.match(errors.join("\n"), /themeColor\.paletteStyle is invalid/);
});

test("rejects invalid texture configuration", async () => {
	const errors = await validateConfig({
		site: {
			texture: { defaultPreset: "unknown", defaultOpacity: 0.4 },
			featurePages: {},
		},
		navbar: { links: [] },
		sidebar: { components: { left: [], right: [], drawer: [] } },
	});

	assert.match(errors.join("\n"), /texture\.defaultPreset is invalid/);
	assert.match(errors.join("\n"), /texture\.defaultOpacity/);
});

test("rejects invalid runtime configuration values", async () => {
	const errors = await validateConfig({
		site: {
			lang: "xx",
			siteURL: "not-a-url",
			themeColor: { hue: 361 },
			postListLayout: { defaultMode: "columns", allowSwitch: "yes" },
			featurePages: {},
		},
		navbar: { links: [] },
		sidebar: { components: { left: [], right: [], drawer: [] } },
	});

	assert.match(errors.join("\n"), /lang is invalid/);
	assert.match(errors.join("\n"), /siteURL/);
	assert.match(errors.join("\n"), /themeColor\.hue/);
	assert.match(errors.join("\n"), /postListLayout/);
});

test("validates environment overrides with stable errors", () => {
	const errors = validateEnvironment({
		ENABLE_CONTENT_SYNC: "sometimes",
		NODE_ENV: "staging",
		DEV_MAX_RENDERED_POSTS: "many",
		CONTENT_REPO_URL: "file:///private/content",
	});

	assert.match(errors.join("\n"), /ENABLE_CONTENT_SYNC/);
	assert.match(errors.join("\n"), /NODE_ENV/);
	assert.match(errors.join("\n"), /DEV_MAX_RENDERED_POSTS/);
	assert.match(errors.join("\n"), /CONTENT_REPO_URL/);
});
