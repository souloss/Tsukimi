import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const snapshotDir = path.join(root, "cache", "data-snapshots");

function snapshotPath(name) {
	return path.join(snapshotDir, `${name}.json`);
}

export async function readDataSnapshot(name) {
	try {
		const value = JSON.parse(await fs.readFile(snapshotPath(name), "utf8"));
		return value && typeof value === "object" && "data" in value ? value : null;
	} catch {
		return null;
	}
}

export async function writeDataSnapshot(name, data, { source, schemaVersion = 1 } = {}) {
	await fs.mkdir(snapshotDir, { recursive: true });
	const value = {
		schemaVersion,
		source: source ?? name,
		fetchedAt: new Date().toISOString(),
		commit: process.env.GITHUB_SHA ?? process.env.SOURCE_COMMIT ?? "local",
		data,
	};
	const target = snapshotPath(name);
	const temporary = `${target}.${process.pid}.tmp`;
	await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
	await fs.rename(temporary, target);
	return value;
}

export function snapshotAgeMs(snapshot) {
	const fetchedAt = Date.parse(snapshot?.fetchedAt ?? "");
	return Number.isFinite(fetchedAt) ? Date.now() - fetchedAt : Infinity;
}

export async function writeDataSummary(name, summary) {
	await fs.mkdir(snapshotDir, { recursive: true });
	const target = path.join(snapshotDir, `${name}.summary.json`);
	await fs.writeFile(target, `${JSON.stringify({
		generatedAt: new Date().toISOString(),
		...summary,
	}, null, 2)}\n`);
}
