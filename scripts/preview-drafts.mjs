import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "glob";
import YAML from "yaml";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const postsRoot = resolve(projectRoot, "src/content/posts");
const files = await glob("**/*.{md,mdx}", { cwd: postsRoot, absolute: true });
const drafts = [];

for (const filePath of files) {
	const source = await readFile(filePath, "utf8");
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	const data = match ? YAML.parse(match[1]) : null;
	if (!data?.draft) continue;
	const relativePath = filePath
		.replace(`${postsRoot}/`, "")
		.replace(/\.(?:md|mdx)$/i, "")
		.replace(/\/index$/i, "");
	drafts.push({ title: data.title || relativePath, path: relativePath });
}

console.log(`Draft preview: ${drafts.length} draft(s) available in dev mode.`);
for (const draft of drafts) console.log(`  - ${draft.title} (/posts/${draft.path}/)`);
console.log("Production builds exclude drafts; stop this process when finished reviewing.");

const args = process.argv.slice(2).filter((arg) => arg !== "--list" && arg !== "--");
if (process.argv.includes("--list")) process.exit(0);

const child = spawn("pnpm", ["exec", "astro", "dev", ...args], {
	cwd: projectRoot,
	env: { ...process.env, DRAFT_PREVIEW: "true" },
	stdio: "inherit",
});
child.on("exit", (code, signal) => {
	if (signal) process.kill(process.pid, signal);
	else process.exit(code ?? 0);
});
