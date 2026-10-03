import { readFile } from "node:fs/promises";
import { glob } from "glob";

const files = await glob(["src/styles/**/*.{css,styl}", "src/components/**/*.{astro,svelte}", "src/pages/**/*.astro"], {
		ignore: ["src/styles/twikoo.css"],
	});
const violations = [];
const transitionAll = /transition\s*:\s*all\b/;

for (const file of files) {
	const source = await readFile(file, "utf8");
	for (const [index, line] of source.split("\n").entries()) {
		if (transitionAll.test(line)) violations.push(`${file}:${index + 1}: transition: all is not allowed`);
	}
}

if (violations.length > 0) {
	console.error(violations.join("\n"));
	process.exitCode = 1;
} else {
	console.log(`Motion token check passed (${files.length} source files).`);
}
