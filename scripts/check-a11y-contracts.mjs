import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [
	["main skip link", "src/layouts/MainGridLayout.astro", /skip-link[\s\S]*#main-content/],
	["docs skip link", "src/layouts/DocsLayout.astro", /skip-link[\s\S]*#main-content/],
	["main landmark", "src/layouts/MainGridLayout.astro", /<main[\s\S]*id=\"swup-container\"[\s\S]*id=\"main-content\"/],
	["search dialog semantics", "src/components/organisms/navigation/SearchModal.svelte", /role\", \"dialog|aria-modal/],
	["settings dialog label", "src/components/features/settings/DisplaySettings.svelte", /aria-labelledby=\"display-setting-title\"/],
	["password input label", "src/components/features/auth/PasswordModal.svelte", /aria-label|<label/],
	["music error announcement", "src/components/widgets/music-player/MusicPlayer.svelte", /role=\"alert\"[\s\S]*aria-live=\"assertive\"/],
	["comment loading announcement", "src/components/comment/Twikoo.astro", /role=\"status\"[\s\S]*aria-live=\"polite\"/],
	["comment loading announcement", "src/components/comment/Waline.astro", /role=\"status\"[\s\S]*aria-live=\"polite\"/],
];
const errors = [];
for (const [name, relative, pattern] of checks) {
	const source = await readFile(path.join(root, relative), "utf8");
	if (!pattern.test(source)) errors.push(`${name}: ${relative}`);
}
if (errors.length > 0) {
	console.error(`Accessibility contract check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`Accessibility contract check passed (${checks.length} contracts).`);
