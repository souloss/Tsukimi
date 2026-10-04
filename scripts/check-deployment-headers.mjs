import { readFile } from "node:fs/promises";

const source = await readFile("public/_headers", "utf8");
const required = [
	"Strict-Transport-Security",
	"Referrer-Policy",
	"Permissions-Policy",
	"X-Content-Type-Options",
	"Content-Security-Policy-Report-Only",
	"Cache-Control",
];
const missing = required.filter((header) => !new RegExp(`^\\s*${header}:`, "mi").test(source));
if (missing.length) {
	console.error(`Deployment header contract failed: ${missing.join(", ")}`);
	process.exit(1);
}
if (!/Content-Security-Policy-Report-Only:[^\n]*default-src 'self'/.test(source)) {
	console.error("Deployment header contract failed: CSP must keep a self default source.");
	process.exit(1);
}
console.log(`Deployment header contract passed (${required.length} headers).`);
