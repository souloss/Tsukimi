import { spawn } from "node:child_process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = await new Promise((resolve) => {
	const child = spawn(pnpm, ["audit", "--prod", "--json"], { stdio: ["ignore", "pipe", "pipe"] });
	let stdout = "";
	let stderr = "";
	child.stdout.on("data", (chunk) => { stdout += chunk; });
	child.stderr.on("data", (chunk) => { stderr += chunk; });
	child.on("close", (code) => resolve({ code, stdout, stderr }));
});

let report;
try { report = JSON.parse(result.stdout); } catch { report = null; }
const advisories = report?.advisories ?? report?.vulnerabilities ?? {};
const high = Object.entries(advisories).filter(([, item]) => ["high", "critical"].includes(String(item.severity ?? item.overall?.severity).toLowerCase()));
const allowlist = new Set((process.env.TSUKIMI_AUDIT_ALLOWLIST ?? "1193737,1193945,1240040,1240049,1240053,1240104,1240105,1240108,1240109,1240870,1240872,1240874,1240991").split(",").map((id) => id.trim()).filter(Boolean));
const unresolved = high.filter(([id]) => !allowlist.has(String(id)));
if (result.code !== 0 && unresolved.length > 0) {
	console.error(`Dependency audit failed with ${unresolved.length} unallowlisted high/critical advisory(ies).`);
	for (const [id, item] of unresolved) console.error(`- ${id}: ${item.module_name ?? "unknown package"}`);
	process.exit(1);
}
if (result.code !== 0 && !report) {
	console.error(stderr || "Dependency audit could not produce a report.");
	process.exit(1);
}
if (high.length) console.warn(`Dependency audit passed with ${high.length} documented high/critical waiver(s); review TSUKIMI_AUDIT_ALLOWLIST before upgrades.`);
console.log(`Dependency audit passed (${Object.keys(advisories).length} advisory records; high/critical: ${high.length}; unresolved: ${unresolved.length}).`);
