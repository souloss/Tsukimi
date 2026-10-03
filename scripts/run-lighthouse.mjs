import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const host = "127.0.0.1";
const port = 4338;
const chromePort = 9223;
const existingPreviewPort = 4321;
const url = `http://${host}:${port}/`;
const chromePath = process.env.CHROME_PATH ?? findPlaywrightChrome();

if (!chromePath) {
	throw new Error("Chrome executable not found. Set CHROME_PATH to a Chromium binary.");
}

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const existingUrl = `http://${host}:${existingPreviewPort}/`;
const previewUrl = (await isHealthy(existingUrl)) ? existingUrl : url;
const server = previewUrl === url
	? spawn(pnpm, ["astro", "preview", "--host", host, "--port", String(port)], {
			stdio: ["ignore", "pipe", "pipe"],
			env: { ...process.env, ENABLE_CONTENT_SYNC: "false" },
		})
	: undefined;

let serverOutput = "";
let browser;
server?.stdout.on("data", (chunk) => {
	serverOutput += chunk.toString();
});
server?.stderr.on("data", (chunk) => {
	serverOutput += chunk.toString();
});

try {
	await waitForServer(previewUrl);
	browser = spawn(chromePath, [
		"--headless",
		"--no-sandbox",
		"--disable-gpu",
		`--remote-debugging-port=${chromePort}`,
		`--user-data-dir=/tmp/tsukimi-lighthouse-${process.pid}`,
		"about:blank",
	], { stdio: "ignore" });
	await waitForServer(`http://${host}:${chromePort}/json/version`);
	const lighthouse = spawn(
		pnpm,
		[
			"exec",
			"lighthouse",
			previewUrl,
			`--port=${chromePort}`,
			"--output=json",
			"--output-path=stdout",
			"--quiet",
			"--preset=desktop",
			"--throttling-method=provided",
			"--only-categories=performance,accessibility,best-practices,seo",
		],
		{ stdio: ["ignore", "pipe", "pipe"] },
	);
	let output = "";
	let errors = "";
	lighthouse.stdout.on("data", (chunk) => {
		output += chunk.toString();
	});
	lighthouse.stderr.on("data", (chunk) => {
		errors += chunk.toString();
	});
	const exitCode = await new Promise((resolve) => lighthouse.on("close", resolve));
	if (exitCode !== 0) {
		throw new Error(`Lighthouse failed (${exitCode}): ${errors || output}`);
	}

	const report = JSON.parse(output);
	const scores = Object.fromEntries(
		Object.entries(report.categories).map(([name, category]) => [name, category.score]),
	);
	console.log(JSON.stringify(scores, null, 2));
	const minimums = { performance: 0.6, accessibility: 0.9, "best-practices": 0.8, seo: 0.9 };
	for (const [category, minimum] of Object.entries(minimums)) {
		if ((scores[category] ?? 0) < minimum) {
			throw new Error(`${category} score ${scores[category] ?? 0} is below ${minimum}`);
		}
	}
} finally {
	// Lighthouse owns the browser connection; terminate the temporary browser after the report.
	// The preview process may be shared with another local command.
	browser?.kill("SIGTERM");
	server?.kill("SIGTERM");
	if (serverOutput && process.exitCode) console.error(serverOutput);
}

function findPlaywrightChrome() {
	const root = "/root/.cache/ms-playwright";
	if (!existsSync(root)) return undefined;
	for (const entry of readdirSync(root).sort().reverse()) {
		const candidate = join(root, entry, "chrome-linux64", "chrome");
		if (existsSync(candidate)) return candidate;
	}
	return undefined;
}

async function waitForServer(target) {
	for (let attempt = 0; attempt < 60; attempt += 1) {
		try {
			const response = await fetch(target);
			if (response.ok) return;
		} catch {
			// The preview process is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	throw new Error(`Preview server did not start: ${serverOutput}`);
}

async function isHealthy(target) {
	try {
		return (await fetch(target)).ok;
	} catch {
		return false;
	}
}
