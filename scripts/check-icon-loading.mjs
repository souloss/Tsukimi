import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const iconPrimitive = await readFile(
	resolve(root, "src/components/atoms/Icon/Icon.astro"),
	"utf8",
);
const loader = await readFile(
	resolve(root, "src/components/misc/IconifyLoader.astro"),
	"utf8",
);
const errors = [];
if (iconPrimitive.includes("<iconify-icon")) {
	errors.push("the Astro icon primitive must stay bundled and local");
}
if (!loader.includes("document.querySelector(\"iconify-icon\")")) {
	errors.push("the legacy Iconify loader must remain content-triggered");
}
if (errors.length > 0) {
	console.error(errors.join("\n"));
	process.exitCode = 1;
} else {
	console.log("Icon loading contract passed.");
}
