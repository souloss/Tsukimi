import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// File-tree icons are generated and ignored, so fresh checkouts need them
// before Vite analyzes the client module that imports them.
await import("./generate-file-icons.mjs");

const friendsCirclePath = path.join(root, "src/data/friends-circle.json");
if (!existsSync(friendsCirclePath)) {
	await writeFile(
		friendsCirclePath,
		JSON.stringify({ lastUpdated: new Date(0).toISOString(), items: [] }, null, 2),
	);
}
