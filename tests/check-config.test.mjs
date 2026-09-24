import assert from "node:assert/strict";
import { test } from "node:test";

import { validateConfig } from "../scripts/check-config.mjs";

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
