import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const componentRoot = path.join(root, "src", "components");
const extensions = [".astro", ".svelte", ".ts", ".tsx"];

function walk(directory) {
	const files = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...walk(file));
		else if (extensions.includes(path.extname(entry.name))) files.push(file);
	}
	return files;
}

function resolveImport(source, specifier) {
	if (specifier.startsWith("@components/")) return path.join(componentRoot, specifier.slice(13));
	if (specifier.startsWith(".")) return path.resolve(path.dirname(source), specifier);
	return null;
}

function resolveFile(candidate) {
	if (!candidate) return null;
	const options = [candidate, ...extensions.map((extension) => `${candidate}${extension}`), ...extensions.map((extension) => path.join(candidate, `index${extension}`))];
	return options.find((file) => fs.existsSync(file)) ?? null;
}

const files = walk(componentRoot);
const graph = new Map(files.map((file) => [file, []]));
for (const file of files) {
	const source = fs.readFileSync(file, "utf8");
	for (const match of source.matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g)) {
		const target = resolveFile(resolveImport(file, match[1]));
		if (target && graph.has(target)) graph.get(file).push(target);
	}
}

const state = new Map();
const stack = [];
const cycles = [];
function visit(file) {
	state.set(file, 1);
	stack.push(file);
	for (const target of graph.get(file)) {
		if (state.get(target) === 1) {
			const start = stack.indexOf(target);
			cycles.push([...stack.slice(start), target].map((item) => path.relative(root, item).split(path.sep).join("/")));
		} else if (!state.get(target)) {
			visit(target);
		}
	}
	stack.pop();
	state.set(file, 2);
}
for (const file of files) if (!state.get(file)) visit(file);

const uniqueCycles = [...new Map(cycles.map((cycle) => [cycle.join(" -> "), cycle])).values()];
if (uniqueCycles.length > 0) {
	console.error(`Component dependency cycle check failed (${uniqueCycles.length} cycle(s)):`);
	for (const cycle of uniqueCycles) console.error(`- ${cycle.join(" -> ")}`);
	process.exit(1);
}
console.log(`Component dependency cycle check passed (${files.length} files scanned).`);
