import { readFile } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const projectRoot = process.cwd();
const htmlFiles = await glob("**/*.html", {
	cwd: path.join(projectRoot, "dist"),
	absolute: true,
});
const errors = [];

for (const file of htmlFiles) {
	const html = await readFile(file, "utf8");
	const relative = path.relative(path.join(projectRoot, "dist"), file);
	if (/<html\b/i.test(html) && !/\bhtml\b[^>]*\blang=["'][^"']+["']/i.test(html)) errors.push(`${relative}: html is missing lang`);
	if ((html.match(/<main\b/gi) ?? []).length > 1) errors.push(`${relative}: multiple main landmarks`);
	for (const link of html.matchAll(/<a\b([^>]*)>/gi)) if (/\bhref=["'](?:["']|\s)/i.test(link[1])) errors.push(`${relative}: anchor has an empty href`);
	for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
		if (!/\balt(?:\s*=|\s|$)/.test(image[1])) {
			errors.push(`${relative}: image is missing alt text`);
		}
	}
}

const sourceFiles = [
	"src/components/organisms/navigation/Navbar.astro",
	"src/components/features/settings/DisplaySettings.svelte",
];
const source = await Promise.all(
	sourceFiles.map(async (file) => readFile(path.join(projectRoot, file), "utf8")),
);
const joinedSource = source.join("\n");
if (!joinedSource.includes('id="display-settings-switch"') || !joinedSource.includes("aria-label={i18n(I18nKey.appearanceSettings)}")) {
	errors.push("theme settings trigger must expose an accessible label");
}
if (!joinedSource.includes('role="dialog"') || !joinedSource.includes('aria-labelledby="display-setting-title"')) {
	errors.push("theme settings panel must expose a labelled dialog role");
}
if (!joinedSource.includes("data-theme-control") || !joinedSource.includes("aria-pressed={")) {
	errors.push("theme option controls must expose pressed state");
}

if (errors.length > 0) {
	console.error(`Accessibility markup check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`  - ${error}`);
	process.exit(1);
}
console.log(`Accessibility markup check passed (${htmlFiles.length} pages).`);
