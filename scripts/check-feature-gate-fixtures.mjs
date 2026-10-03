import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const fixtureRoot = path.join(root, "tests", "fixtures", "feature-gates");
const gates = {
	music: ["music-player-fab-shell", "music-sidebar-widget", "MusicPlayer"],
	pio: ["pio-container", "/pio/models/", "Pio"],
	"context-menu": ["data-context-menu", "context-menu", "ContextMenu"],
};

function readFixture(name) {
	const directory = path.join(fixtureRoot, name);
	return fs
		.readdirSync(directory, { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => fs.readFileSync(path.join(directory, entry.name), "utf8"))
		.join("\n");
}

const enabled = readFixture("enabled");
const disabled = readFixture("disabled");
const errors = [];
for (const [name, markers] of Object.entries(gates)) {
	for (const marker of markers) {
		if (!enabled.includes(marker)) errors.push(`${name} enabled fixture misses ${marker}`);
		if (disabled.includes(marker)) errors.push(`${name} disabled fixture contains ${marker}`);
	}
}

if (errors.length > 0) {
	console.error("Feature gate fixture check failed:");
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}

console.log("Feature gate fixtures passed for music, pio, and context-menu.");
