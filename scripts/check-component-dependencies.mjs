import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const componentsRoot = path.join(root, "src", "components");
const sourceExtensions = new Set([".astro", ".svelte", ".ts", ".tsx"]);

// Lower layers may only import their own layer or a lower layer. Feature
// folders are application composites and can consume atoms, molecules, and
// organisms; pages and layouts are the only layers above them.
const layerByFolder = {
	atoms: 0,
	molecules: 1,
	organisms: 2,
	misc: 2,
	features: 3,
	widgets: 3,
	control: 3,
	common: 3,
	comment: 3,
	layout: 4,
	pages: 5,
};

const integrationAllowlist = new Set([
	"organisms/navigation/Navbar.astro -> features/toc",
	"organisms/navigation/Navbar.astro -> control/ThemeSwitch.svelte",
	"organisms/navigation/DocsNavbar.astro -> control/ThemeSwitch.svelte",
	"control/FloatingTOC.astro -> features/toc",
	"control/FloatingControls.astro -> features/toc",
	"widgets/toc/TOC.astro -> features/toc",
]);

function walk(directory) {
	const entries = fs.readdirSync(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...walk(fullPath));
		else if (sourceExtensions.has(path.extname(entry.name))) files.push(fullPath);
	}
	return files;
}

function componentPath(filePath) {
	return path.relative(componentsRoot, filePath).split(path.sep).join("/");
}

function layerFor(componentRelativePath) {
	const folder = componentRelativePath.split("/")[0];
	return layerByFolder[folder];
}

function sourceLayerPath(filePath) {
	const relative = componentPath(filePath);
	const folder = relative.split("/")[0];
	return { relative, layer: layerByFolder[folder] };
}

function resolveImport(sourceFile, importPath) {
	if (importPath.startsWith("@components/")) {
		return path.join(componentsRoot, importPath.slice("@components/".length));
	}
	if (importPath.startsWith(".")) return path.resolve(path.dirname(sourceFile), importPath);
	return null;
}

function resolveExisting(filePath) {
	if (!filePath) return null;
	const candidates = [
		filePath,
		...Array.from(sourceExtensions, (extension) => `${filePath}${extension}`),
		...Array.from(sourceExtensions, (extension) => path.join(filePath, `index${extension}`)),
	];
	return candidates.find((candidate) => fs.existsSync(candidate));
}

const violations = [];
for (const sourceFile of walk(componentsRoot)) {
	const { relative: sourceRelative, layer: sourceLayer } = sourceLayerPath(sourceFile);
	if (sourceLayer === undefined) continue;
	const contents = fs.readFileSync(sourceFile, "utf8");
	const imports = contents.matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g);

	for (const match of imports) {
		const importPath = match[1];
		const resolved = resolveExisting(resolveImport(sourceFile, importPath));
		if (!resolved || !resolved.startsWith(`${componentsRoot}${path.sep}`)) continue;
		const targetRelative = componentPath(resolved);
		const targetLayer = layerFor(targetRelative);
		if (targetLayer === undefined || targetLayer <= sourceLayer) continue;
		const sourceKey = `${sourceRelative} -> ${targetRelative.split("/").slice(0, 2).join("/")}`;
		if (integrationAllowlist.has(sourceKey)) continue;
		violations.push(`${sourceRelative}: ${importPath} (layer ${sourceLayer} -> ${targetLayer})`);
	}
}

if (violations.length > 0) {
	console.error("Component dependency boundary violations:");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log(`Component dependency check passed (${walk(componentsRoot).length} files scanned).`);
