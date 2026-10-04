import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import path from "node:path";

const headers = await readFile(path.resolve("public/_headers"), "utf8");
const required = ["Strict-Transport-Security", "Referrer-Policy", "Permissions-Policy", "X-Content-Type-Options", "Content-Security-Policy-Report-Only"];
const errors = required.filter((name) => !headers.includes(name)).map((name) => `_headers is missing ${name}`);
const dist = path.resolve("dist");
if (await access(dist).then(() => true).catch(() => false)) {
	const { glob } = await import("glob");
	for (const file of await glob("**/*.{html,js,json,css}", { cwd: dist, absolute: true })) {
		const source = await readFile(file, "utf8");
		if (/(?:sk|api[_-]?key|private[_-]?key)\s*[:=]\s*["'][A-Za-z0-9_\-]{24,}["']/i.test(source)) errors.push(`${path.relative(process.cwd(), file)} may contain a hard-coded secret`);
		if (/(?:href|src)=["'](?:javascript|vbscript):/i.test(source)) errors.push(`${path.relative(process.cwd(), file)} contains an executable URL protocol`);
		if (/<script[^>]+src=["']http:/i.test(source)) errors.push(`${path.relative(process.cwd(), file)} loads a script over HTTP`);
	}
}
if (errors.length) {
	console.error(`Security check failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log("Security headers and artifact secret scan passed.");
