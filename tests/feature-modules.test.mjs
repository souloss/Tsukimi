import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const requiredEntrypoints = {
	comments: ["CommentIndex", "Giscus", "Twikoo", "Waline"],
	live2d: ["Live2D"],
	music: ["MusicPlayer"],
	search: ["SearchModal"],
	settings: ["DisplaySettings"],
};

test("feature modules expose stable entrypoints", () => {
	for (const [moduleName, exports] of Object.entries(requiredEntrypoints)) {
		const file = path.join(
			root,
			"src",
			"components",
			"features",
			moduleName,
			"index.ts",
		);
		assert.ok(fs.existsSync(file), `${moduleName} entrypoint is missing`);
		const source = fs.readFileSync(file, "utf8");
		for (const exportName of exports) {
			assert.match(
				source,
				new RegExp(`\\b${exportName}\\b`),
				`${moduleName} must export ${exportName}`,
			);
		}
	}
});
