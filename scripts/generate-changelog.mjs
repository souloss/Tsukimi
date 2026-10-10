import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const sections = [
	["Breaking Changes", new Set(["breaking"])],
	["Added", new Set(["feat"])],
	["Fixed", new Set(["fix"])],
	["Performance", new Set(["perf"])],
	["Security", new Set(["security"])],
	["Changed", new Set(["refactor", "build"])],
	["Documentation", new Set(["docs"])],
	["Tests", new Set(["test"])],
	["Maintenance", new Set(["chore", "ci", "revert"])],
];

export function parseCommitRecord(record) {
	const [hash, subject = "", ...bodyParts] = record.split("\t");
	const body = bodyParts.join("\t");
	if (!hash || !subject) return null;
	const match = subject.match(/^([a-z]+)(?:\(([^)]+)\))?(!)?:\s+(.+)$/i);
	const type = match?.[1]?.toLowerCase() ?? "other";
	const scope = match?.[2];
	const breaking = Boolean(match?.[3]) || /^BREAKING CHANGE:/im.test(body);
	const description = redactSubject(match?.[4] ?? subject);
	return {
		hash: hash.slice(0, 12),
		type: breaking ? "breaking" : type,
		scope,
		description,
	};
}

export function generateChangelog(records, { from, to, repositoryUrl } = {}) {
	const commits = records.map(parseCommitRecord).filter(Boolean);
	const grouped = new Map(sections.map(([title]) => [title, []]));
	grouped.set("Other", []);

	for (const commit of commits) {
		const title = sections.find(([, types]) => types.has(commit.type))?.[0] ?? "Other";
		const reference = repositoryUrl
			? ` ([${commit.hash}](${repositoryUrl}/commit/${commit.hash}))`
			: ` (${commit.hash})`;
		const scope = commit.scope ? `**${commit.scope}:** ` : "";
		grouped.get(title).push(`- ${scope}${commit.description}${reference}`);
	}

	const lines = [`# Changes${from && to ? ` (${from}..${to})` : ""}`, ""];
	for (const [title] of sections) {
		const items = grouped.get(title);
		if (!items.length) continue;
		lines.push(`## ${title}`, "", ...items, "");
	}
	const other = grouped.get("Other");
	if (other.length) lines.push("## Other", "", ...other, "");
	if (commits.length === 0) lines.push("No user-facing changes in this range.", "");
	return lines.join("\n");
}

export function normalizeRepositoryUrl(remote) {
	if (!remote) return undefined;
	const normalized = remote
		.replace(/^git@github\.com:/, "https://github.com/")
		.replace(/^ssh:\/\/git@github\.com\//, "https://github.com/")
		.replace(/\.git$/, "");
	try {
		const url = new URL(normalized);
		if (url.hostname !== "github.com" || url.username || url.password) return undefined;
		return `https://github.com/${url.pathname.replace(/^\/+|\/+$/g, "")}`;
	} catch {
		return undefined;
	}
}

function redactSubject(subject) {
	return subject
		.replace(/[\r\n\t\0-\x1f]/g, " ")
		.replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g, "[REDACTED]")
		.replace(/\b(token|api[-_ ]?key|password|secret|sessdata)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]")
		.replace(/https?:\/\/[^\s/@]+:[^\s/@]+@[^\s]+/gi, "[REDACTED_URL]")
		.trim();
}

function parseArgs(args) {
	if (args[0] === "--") args = args.slice(1);
	const options = { from: undefined, to: "HEAD", output: undefined };
	for (let index = 0; index < args.length; index += 1) {
		const flag = args[index];
		if (!["--from", "--to", "--output"].includes(flag)) {
			throw new Error(`Unknown argument: ${flag}`);
		}
		const value = args[index + 1];
		if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
		options[flag.slice(2)] = value;
		index += 1;
	}
	if (!options.from) {
		options.from = process.env.GITHUB_BASE_REF
			? `origin/${process.env.GITHUB_BASE_REF}`
			: "HEAD^";
	}
	return options;
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	const { stdout: log } = await execFileAsync("git", [
		"log",
		"--no-merges",
		`--format=%H%x09%s%x09%b%x00`,
		`${options.from}..${options.to}`,
	]);
	const records = log
		.split("\0")
		.map((record) => record.trim())
		.filter(Boolean);
	const repositoryUrl = normalizeRepositoryUrl(
		process.env.GITHUB_REPOSITORY
			? `https://github.com/${process.env.GITHUB_REPOSITORY}`
			: (await execFileAsync("git", ["config", "--get", "remote.origin.url"])).stdout.trim(),
	);
	const output = generateChangelog(records, {
		from: options.from,
		to: options.to,
		repositoryUrl,
	});
	if (options.output) {
		const target = path.resolve(options.output);
		await mkdir(path.dirname(target), { recursive: true });
		await writeFile(target, output);
		console.log(`Changelog written: ${target}`);
	} else {
		process.stdout.write(output);
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
