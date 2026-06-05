/**
 * Generate file-icons.json from @iconify-json/vscode-icons.
 *
 * Reads icon data from the vscode-icons Iconify package and outputs a JSON
 * file used by the rehype-file-tree plugin. The `file-type-*` variants
 * provide clean per-file-type icons (file shape + language symbol, no
 * background box), matching Vuepress Plume's visual style.
 *
 * To swap icon sets, change the `iconSet` import and update
 * EXT_ICON_MAP / NAME_ICON_MAP accordingly.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Icon set ──────────────────────────────────────────────────────
// Swap this import to change the icon source.
const iconSetModule = await import("@iconify-json/vscode-icons");
const iconSet = iconSetModule.default || iconSetModule;

const { icons: iconCollection, width: defaultWidth = 32, height: defaultHeight = 32 } = iconSet;
const iconData = iconCollection.icons;

/**
 * Extract the SVG body for an icon name.
 * Returns { body, width, height }.
 */
function getIcon(name) {
	const icon = iconData[name];
	if (!icon) return null;
	return {
		body: icon.body,
		width: icon.width || defaultWidth,
		height: icon.height || defaultHeight,
	};
}

// ── File extension → vscode-icons name mapping ─────────────────────

const EXT_ICON_MAP = {
	// Code languages
	ts: "file-type-typescript",
	tsx: "file-type-typescript",
	js: "file-type-js-official",
	jsx: "file-type-js-official",
	mjs: "file-type-js-official",
	cjs: "file-type-js-official",
	py: "file-type-python",
	rs: "file-type-rust",
	go: "file-type-go",
	java: "file-type-java",
	rb: "file-type-ruby",
	php: "file-type-php",
	swift: "file-type-swift",
	kt: "file-type-kotlin",
	scala: "file-type-scala",
	c: "file-type-c",
	cpp: "file-type-cpp",
	h: "file-type-c",
	hpp: "file-type-cpp",
	cs: "file-type-csharp",
	dart: "file-type-dartlang",
	lua: "file-type-lua",
	r: "file-type-r",
	zig: "file-type-rust",
	sql: "file-type-sql",
	sh: "file-type-shell",
	bash: "file-type-shell",
	ex: "file-type-elixir",
	exs: "file-type-elixir",
	hs: "file-type-haskell",
	elm: "file-type-elm2",
	clj: "file-type-clojurescript",
	erl: "file-type-erlang2",
	coffee: "file-type-coffeescript",

	// Web / markup
	vue: "file-type-vue",
	svelte: "file-type-svelte",
	astro: "file-type-astro",
	html: "file-type-html",
	htm: "file-type-html",
	css: "file-type-css",
	scss: "file-type-sass",
	sass: "file-type-sass",
	less: "file-type-less",
	styl: "file-type-css",
	md: "file-type-markdown",
	mdx: "file-type-markdown",
	txt: "file-type-markdown",
	xml: "file-type-html",
	graphql: "file-type-graphql",
	prisma: "file-type-prisma",

	// Config / data
	json: "file-type-json",
	jsonc: "file-type-json",
	yaml: "file-type-yaml-official",
	yml: "file-type-yaml-official",
	toml: "file-type-toml",
	conf: "file-type-config",
	ini: "file-type-config",
	cfg: "file-type-config",
	env: "file-type-dotenv",

	// Image
	png: "file-type-image",
	jpg: "file-type-image",
	jpeg: "file-type-image",
	gif: "file-type-image",
	svg: "file-type-svg",
	webp: "file-type-image",
	ico: "file-type-image",
	avif: "file-type-image",
	bmp: "file-type-image",
	tiff: "file-type-image",

	// Font
	woff: "file-type-font",
	woff2: "file-type-font",
	ttf: "file-type-font",
	otf: "file-type-font",

	// Archive
	zip: "file-type-zip",
	tar: "file-type-zip",
	gz: "file-type-zip",

	// Doc / data
	csv: "file-type-json",
	xlsx: "file-type-excel",
	pdf: "file-type-pdf2",
	doc: "file-type-word",
	docx: "file-type-word",
	ppt: "file-type-powerpoint",
	pptx: "file-type-powerpoint",

	// Lock / git
	lock: "file-type-git",
	gitignore: "file-type-git",
};

// ── Specific filename → vscode-icons name mapping ─────────────────

const NAME_ICON_MAP = {
	"readme.md": "file-type-markdown",
	"license": "file-type-markdown",
	".gitignore": "file-type-git",
	".gitattributes": "file-type-git",
	".env": "file-type-dotenv",
	".env.local": "file-type-dotenv",
	".env.production": "file-type-dotenv",
	"dockerfile": "file-type-docker",
	"docker-compose.yml": "file-type-docker",
	"makefile": "file-type-shell",
	"package.json": "file-type-npm",
	"pnpm-lock.yaml": "file-type-npm",
	"yarn.lock": "file-type-yarn",
	"package-lock.json": "file-type-npm",
	"tsconfig.json": "file-type-tsconfig",
	"astro.config.mjs": "file-type-astro",
	"vite.config.ts": "file-type-vite",
	"tailwind.config.ts": "file-type-tailwind",
	"next.config.js": "file-type-vite",
	".eslintrc": "file-type-eslint",
	".prettierrc": "file-type-prettier",
	"cargo.toml": "file-type-cargo",
	"go.mod": "file-type-go",
	"requirements.txt": "file-type-python",
	"pipfile": "file-type-python",
	"gemfile": "file-type-ruby",
	"composer.json": "file-type-php",
};

// ── Folder icons (from vscode-icons) ──────────────────────────────

const FOLDER_ICON_MAP = {
	src: "folder-type-src",
	source: "folder-type-src",
	components: "folder-type-component",
	pages: "folder-type-src",
	routes: "folder-type-src",
	views: "folder-type-src",
	styles: "folder-type-sass",
	tests: "folder-type-test",
	test: "folder-type-test",
	__tests__: "folder-type-test",
	utils: "folder-type-helper",
	lib: "folder-type-library",
	assets: "folder-type-src",
	public: "folder-type-src",
	static: "folder-type-src",
	config: "folder-type-config",
	docs: "folder-type-docs",
	scripts: "folder-type-script",
	plugins: "folder-type-plugin",
	modules: "folder-type-node",
	store: "folder-type-node",
	data: "folder-type-src",
	i18n: "folder-type-locale",
	locales: "folder-type-locale",
	types: "folder-type-typescript",
	middleware: "folder-type-src",
	layout: "folder-type-src",
	layouts: "folder-type-src",
	shared: "folder-type-src",
	common: "folder-type-src",
};

// ── SVG Normalization ─────────────────────────────────────────────

/**
 * Store icon body at its native size — no scaling transforms.
 * Each icon entry includes its native viewBox so the renderer
 * can use the correct viewBox per icon (Vuepress approach).
 */
function normalizeIcon(body, iconWidth, iconHeight) {
	return { body, viewBox: `0 0 ${iconWidth} ${iconHeight}` };
}

// ── Main ──────────────────────────────────────────────────────────

const icons = {}; // iconName → { body, viewBox }
const fileMap = {}; // extension or filename → iconName
const folderMap = {}; // folder name → iconName

// Collect all unique icon names needed
const neededIcons = new Set();

for (const icon of Object.values(EXT_ICON_MAP)) {
	neededIcons.add(icon);
}
for (const icon of Object.values(NAME_ICON_MAP)) {
	neededIcons.add(icon);
}
for (const icon of Object.values(FOLDER_ICON_MAP)) {
	neededIcons.add(icon);
}

// Add folder open/closed defaults
neededIcons.add("default-folder");
neededIcons.add("default-folder-opened");
neededIcons.add("default-file");

// Resolve and normalize icons
for (const name of neededIcons) {
	const icon = getIcon(name);
	if (icon) {
		icons[name] = normalizeIcon(icon.body, icon.width, icon.height);
	} else {
		console.warn(`  [warn] Icon not found in vscode-icons: ${name}`);
	}
}

// Build file map from extensions
for (const [ext, iconName] of Object.entries(EXT_ICON_MAP)) {
	fileMap[ext] = iconName;
}

// Build file map from specific names
for (const [name, iconName] of Object.entries(NAME_ICON_MAP)) {
	fileMap[name] = iconName;
}

// Build folder map
for (const [name, iconName] of Object.entries(FOLDER_ICON_MAP)) {
	folderMap[name] = iconName;
}

// Chevron arrow (custom, 16x16 viewBox)
const chevronSvg = '<path fill="currentColor" d="m5.157 13.069l4.611-4.685a.546.546 0 0 0 0-.768L5.158 2.93a.55.55 0 0 1 0-.771a.53.53 0 0 1 .759 0l4.61 4.684a1.65 1.65 0 0 1 0 2.312l-4.61 4.684a.53.53 0 0 1-.76 0a.55.55 0 0 1 0-.771"/>';

// Ellipsis (custom, 16x16 viewBox)
const ellipsisSvg =
	'<circle fill="#94a3b8" cx="4" cy="8" r="1.5"/><circle fill="#94a3b8" cx="8" cy="8" r="1.5"/><circle fill="#94a3b8" cx="12" cy="8" r="1.5"/>';

const DEFAULT_ICON = "default-file";
if (!icons[DEFAULT_ICON]) {
	icons[DEFAULT_ICON] = {
		body: '<path fill="#c5c5c5" d="M20.414 2H5v28h22V8.586ZM7 28V4h12v6h6v18Z"/>',
		viewBox: "0 0 32 32",
	};
}

const DEFAULT_FOLDER = "default-folder";
const DEFAULT_FOLDER_OPEN = "default-folder-opened";

const output = {
	icons,
	fileMap,
	folderMap,
	defaultFile: DEFAULT_ICON,
	defaultFolder: DEFAULT_FOLDER,
	defaultFolderOpen: DEFAULT_FOLDER_OPEN,
	chevron: { body: chevronSvg, viewBox: "0 0 16 16" },
	ellipsis: { body: ellipsisSvg, viewBox: "0 0 16 16" },
	defaultIcon: DEFAULT_ICON,
};

const outPath = join(__dirname, "..", "src", "plugins", "file-icons.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(output, null, "\t") + "\n");

console.log(
	`Generated ${Object.keys(icons).length} icons, ${Object.keys(fileMap).length} file mappings, ${Object.keys(folderMap).length} folder mappings`,
);
console.log(`Output: ${outPath}`);