import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const roots = [path.join(root, "src", "components"), path.join(root, "src", "layouts")];
const extensions = new Set([".astro", ".svelte"]);
const warningLimit = 300;
const hardLimit = 500;
const exemptionsPath = path.join(root, ".component-size-exemptions.json");
const exemptions = JSON.parse(fs.readFileSync(exemptionsPath, "utf8"));

function walk(directory) {
	const files = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...walk(fullPath));
		else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
	}
	return files;
}

const files = roots.flatMap(walk);
const oversized = files
	.map((file) => ({
		file: path.relative(root, file).split(path.sep).join("/"),
		lines: fs.readFileSync(file, "utf8").split("\n").length,
	}))
	.filter(({ lines }) => lines > warningLimit)
	.sort((left, right) => right.lines - left.lines);

const hardFailures = oversized.filter(
	({ file, lines }) => lines > hardLimit && !exemptions[file]?.reason,
);
const staleExemptions = Object.keys(exemptions).filter(
	(file) => !oversized.some((entry) => entry.file === file && entry.lines > hardLimit),
);

console.log(
	`Component size check: ${files.length} files scanned, ${oversized.length} over ${warningLimit} lines.`,
);
for (const entry of oversized) {
	const exemption = exemptions[entry.file];
	const suffix = exemption?.reason ? ` [exempt: ${exemption.reason}]` : "";
	console.log(`- ${entry.file}: ${entry.lines} lines${suffix}`);
}

if (hardFailures.length > 0) {
	console.error("Components over 500 lines require a documented exemption:");
	for (const entry of hardFailures) console.error(`- ${entry.file} (${entry.lines} lines)`);
	process.exitCode = 1;
}

if (staleExemptions.length > 0) {
	console.error("Component size exemptions must only cover current files over 500 lines:");
	for (const file of staleExemptions) console.error(`- ${file}`);
	process.exitCode = 1;
}
