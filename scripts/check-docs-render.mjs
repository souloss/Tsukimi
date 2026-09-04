import { spawn } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as wait } from "node:timers/promises";

const baseUrl = (process.env.DOCS_RENDER_BASE_URL || "http://127.0.0.1:4329").replace(/\/$/, "");
const chromeBin = process.env.CHROME_BIN || findChromeBin();

const checks = [];
let failures = 0;

function record(name, passed, detail = "") {
	checks.push({ name, passed, detail });
	if (!passed) failures += 1;
}

function assertCheck(name, value, detail = "") {
	record(name, Boolean(value), detail);
}

function logStep(name) {
	console.log(`[docs-render] ${name}`);
}

function findChromeBin() {
	const candidates = [
		"/usr/bin/chromium-browser",
		"/usr/bin/chromium",
		"/usr/bin/google-chrome",
		"/usr/bin/google-chrome-stable",
	];
	for (const candidate of candidates) {
		try {
			accessSync(candidate, constants.X_OK);
			return candidate;
		} catch {
			// try next candidate
		}
	}
	return "google-chrome";
}

async function ensurePreview() {
	try {
		const response = await fetch(`${baseUrl}/docs/tsukimi/`);
		assertCheck("preview server responds", response.ok, `${response.status} ${response.statusText}`);
		if (!response.ok) process.exitCode = 1;
	} catch (error) {
		record("preview server responds", false, error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}

	if (process.exitCode) {
		printSummary();
		process.exit(process.exitCode);
	}
}

async function launchChrome() {
	const userDataDir = await mkdtemp(path.join(tmpdir(), "tsukimi-docs-chrome-"));
	const args = [
		"--headless=new",
		"--disable-gpu",
		"--disable-dev-shm-usage",
		"--disable-extensions",
		"--disable-component-extensions-with-background-pages",
		"--no-sandbox",
		"--no-proxy-server",
		"--proxy-server=direct://",
		"--proxy-bypass-list=*",
		"--remote-debugging-address=127.0.0.1",
		"--remote-debugging-port=0",
		`--user-data-dir=${userDataDir}`,
		"about:blank",
	];

	const chrome = spawn(chromeBin, args, { stdio: ["ignore", "pipe", "pipe"] });
	const endpoint = await new Promise((resolve, reject) => {
		let output = "";
		const timer = setTimeout(() => {
			reject(new Error(`Timed out waiting for Chrome DevTools endpoint. Output: ${output.trim()}`));
		}, 15000);

		function handleData(data) {
			output += data.toString();
			const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
			if (match) {
				clearTimeout(timer);
				resolve(match[1]);
			}
		}

		chrome.stdout.on("data", handleData);
		chrome.stderr.on("data", handleData);
		chrome.once("error", (error) => {
			clearTimeout(timer);
			reject(error);
		});
		chrome.once("exit", (code) => {
			clearTimeout(timer);
			reject(new Error(`Chrome exited before DevTools was ready: ${code}. Output: ${output.trim()}`));
		});
	});

	return {
		endpoint,
		httpEndpoint: `http://${new URL(endpoint).host}`,
		async close() {
			chrome.kill("SIGTERM");
			await wait(250);
			await rm(userDataDir, { recursive: true, force: true });
		},
	};
}

class CdpClient {
	constructor(endpoint, httpEndpoint) {
		this.endpoint = endpoint;
		this.httpEndpoint = httpEndpoint;
		this.nextId = 0;
		this.callbacks = new Map();
		this.pageClients = new Map();
		this.socket = undefined;
	}

	async connect() {
		this.socket = new WebSocket(this.endpoint);
		this.socket.addEventListener("message", (event) => {
			const message = JSON.parse(event.data);
			if (message.id && this.callbacks.has(message.id)) {
				const { resolve, reject } = this.callbacks.get(message.id);
				this.callbacks.delete(message.id);
				if (message.error) {
					reject(new Error(JSON.stringify(message.error)));
				} else {
					resolve(message.result);
				}
			}
		});

		await new Promise((resolve, reject) => {
			this.socket.addEventListener("open", resolve, { once: true });
			this.socket.addEventListener("error", reject, { once: true });
		});
	}

	send(method, params = {}, sessionId = undefined) {
		const id = ++this.nextId;
		const message = { id, method, params };
		if (sessionId) message.sessionId = sessionId;
		this.socket.send(JSON.stringify(message));
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.callbacks.delete(id);
				reject(new Error(`CDP command timed out: ${method}`));
			}, 15000);
			this.callbacks.set(id, {
				resolve: (value) => {
					clearTimeout(timer);
					resolve(value);
				},
				reject: (error) => {
					clearTimeout(timer);
					reject(error);
				},
			});
		});
	}

	async newPage(url, viewport) {
		const response = await fetch(`${this.httpEndpoint}/json/new?${url}`, {
			method: "PUT",
		});
		if (!response.ok) {
			throw new Error(`Failed to open ${url}: ${response.status} ${response.statusText}`);
		}
		const target = await response.json();
		if (target.url !== url) {
			console.log(`[docs-render] chrome opened ${target.url || "(empty)"} while requesting ${url}`);
		}
		const targetId = target.id;
		const pageClient = new CdpClient(target.webSocketDebuggerUrl, this.httpEndpoint);
		await pageClient.connect();
		this.pageClients.set(targetId, pageClient);
		await pageClient.send("Runtime.enable");
		await pageClient.send("Page.enable");
		await pageClient.send(
			"Emulation.setDeviceMetricsOverride",
			{
				width: viewport.width,
				height: viewport.height,
				deviceScaleFactor: viewport.deviceScaleFactor ?? 1,
				mobile: viewport.mobile ?? false,
			},
		);
		await pageClient.waitFor(
			undefined,
			"location.href",
			(value) => value === url,
			12000,
		);
		await pageClient.waitFor(
			undefined,
			"document.readyState !== 'loading'",
			(value) => value === true,
			12000,
		);
		await wait(900);
		return { sessionId: targetId, targetId };
	}

	async closePage(targetId) {
		this.pageClients.get(targetId)?.close();
		this.pageClients.delete(targetId);
		await fetch(`${this.httpEndpoint}/json/close/${targetId}`).catch(() => undefined);
	}

	async evaluate(sessionId, expression) {
		const pageClient = this.pageClients.get(sessionId);
		if (pageClient) {
			return pageClient.evaluate(undefined, expression);
		}

		const result = await this.send(
			"Runtime.evaluate",
			{
				expression,
				awaitPromise: true,
				returnByValue: true,
				timeout: 15000,
			},
			sessionId,
		);
		if (result.exceptionDetails) {
			const exception = result.exceptionDetails.exception;
			throw new Error(exception?.description || result.exceptionDetails.text || JSON.stringify(result.exceptionDetails));
		}
		return result.result?.value;
	}

	async waitFor(sessionId, expression, predicate, timeoutMs = 8000) {
		const started = Date.now();
		let lastValue;
		while (Date.now() - started < timeoutMs) {
			lastValue = await this.evaluate(sessionId, expression);
			if (predicate(lastValue)) return lastValue;
			await wait(150);
		}
		throw new Error(`Timed out waiting for ${expression}. Last value: ${JSON.stringify(lastValue)}`);
	}

	close() {
		this.socket?.close();
	}
}

const routes = {
	home: `${baseUrl}/docs/tsukimi/`,
	intro: `${baseUrl}/docs/tsukimi/guide/intro/`,
	docker: `${baseUrl}/docs/tsukimi/guide/deploy/docker/`,
	article: `${baseUrl}/posts/markdown-tutorial/`,
};

async function checkDocsHome(client) {
	const page = await client.newPage(routes.home, { width: 1440, height: 900 });
	try {
		const state = await client.evaluate(
			page.sessionId,
			`(() => {
				const root = document.documentElement;
				return {
					bodyDocs: document.body.classList.contains("docs-page"),
					layout: !!document.querySelector(".docs-layout-container"),
					features: document.querySelectorAll(".docs-home-feature").length,
					overflow: root.scrollWidth - root.clientWidth,
				};
			})()`,
		);
		assertCheck("docs home uses docs body/layout", state.bodyDocs && state.layout, JSON.stringify(state));
		assertCheck("docs home feature grid renders", state.features >= 6, JSON.stringify(state));
		assertCheck("docs home has no horizontal overflow", state.overflow <= 1, JSON.stringify(state));
	} finally {
		await client.closePage(page.targetId);
	}
}

async function checkIntroDesktop(client) {
	const page = await client.newPage(routes.intro, { width: 1440, height: 900 });
	try {
		const state = await client.evaluate(
			page.sessionId,
			`(() => {
				const root = document.documentElement;
				const layout = document.querySelector(".docs-layout-container");
				const sidebar = document.querySelector(".docs-sidebar-wrapper");
				const toc = document.querySelector(".docs-toc-wrapper");
				const content = document.querySelector(".docs-content-wrapper");
				const container = document.querySelector(".docs-layout-container");
				return {
					bodyDocs: document.body.classList.contains("docs-page"),
					overflow: root.scrollWidth - root.clientWidth,
					layoutPaddingLeft: parseFloat(getComputedStyle(layout).paddingLeft),
					layoutPaddingRight: parseFloat(getComputedStyle(layout).paddingRight),
					sidebarDisplay: getComputedStyle(sidebar).display,
					sidebarPosition: getComputedStyle(sidebar).position,
					tocDisplay: getComputedStyle(toc).display,
					contentWidth: content.getBoundingClientRect().width,
					search: !!document.querySelector(".search-modal-pill-btn"),
					repoCards: document.querySelectorAll(".docs-markdown .docs-repo-card").length,
					linkCards: document.querySelectorAll(".docs-markdown .docs-link-card").length,
					collapses: document.querySelectorAll(".docs-markdown .md-directive-folding").length,
					colorScheme: getComputedStyle(container).colorScheme,
				};
			})()`,
		);
		assertCheck(
			"desktop docs layout offsets content for sidebar and toc",
			state.layoutPaddingLeft > 0 && state.layoutPaddingRight > 0 && state.contentWidth > 0,
			JSON.stringify(state),
		);
		assertCheck("desktop docs sidebar and toc are visible", state.sidebarDisplay !== "none" && state.tocDisplay !== "none", JSON.stringify(state));
		assertCheck("desktop intro custom cards render", state.repoCards >= 1 && state.linkCards >= 1, JSON.stringify(state));
		assertCheck("desktop intro collapse renders", state.collapses >= 1, JSON.stringify(state));
		assertCheck("desktop intro search input renders", state.search, JSON.stringify(state));
		assertCheck("desktop intro has no horizontal overflow", state.bodyDocs && state.overflow <= 1, JSON.stringify(state));

		const dark = await client.evaluate(
			page.sessionId,
				`(() => {
					const container = document.querySelector(".docs-layout-container");
					const search = document.querySelector(".search-modal-pill-btn");
					const article = document.querySelector(".docs-article");
					const lightBackground = getComputedStyle(container).backgroundColor;
					document.documentElement.classList.add("dark");
					return {
						lightBackground,
						darkBackground: getComputedStyle(container).backgroundColor,
						docsBackground: getComputedStyle(container).getPropertyValue("--docs-bg").trim(),
						docsText: getComputedStyle(container).getPropertyValue("--docs-text-100").trim(),
						searchBg: getComputedStyle(search).backgroundColor,
						articleBg: getComputedStyle(article).backgroundColor,
					};
				})()`,
		);
		assertCheck(
			"docs dark mode variables apply",
			dark.docsBackground.length > 0 && dark.docsText.length > 0 && dark.darkBackground !== dark.lightBackground,
			JSON.stringify(dark),
		);
	} finally {
		await client.closePage(page.targetId);
	}
}

async function checkIntroMobile(client) {
	const page = await client.newPage(routes.intro, { width: 390, height: 844, mobile: true, deviceScaleFactor: 2 });
	try {
		const state = await client.evaluate(
			page.sessionId,
			`(() => {
				const root = document.documentElement;
				const sidebar = document.querySelector(".docs-sidebar-wrapper");
				const toc = document.querySelector(".docs-toc-wrapper");
				const toggle = document.querySelector(".docs-sidebar-toggle");
				return {
					overflow: root.scrollWidth - root.clientWidth,
					tocDisplay: getComputedStyle(toc).display,
					sidebarPosition: getComputedStyle(sidebar).position,
					sidebarTransform: getComputedStyle(sidebar).transform,
					toggleDisplay: getComputedStyle(toggle).display,
					contentWidth: document.querySelector(".docs-content-wrapper").getBoundingClientRect().width,
				};
			})()`,
		);
		assertCheck("mobile docs hides right toc", state.tocDisplay === "none", JSON.stringify(state));
		assertCheck("mobile docs sidebar is a fixed drawer", state.sidebarPosition === "fixed" && state.sidebarTransform !== "none", JSON.stringify(state));
		assertCheck("mobile docs sidebar toggle is visible", state.toggleDisplay === "flex", JSON.stringify(state));
		assertCheck("mobile intro has no horizontal overflow", state.overflow <= 1, JSON.stringify(state));

		await client.evaluate(
			page.sessionId,
			`(() => {
				document.querySelector(".docs-sidebar-toggle").click();
				return true;
			})()`,
		);
		await wait(380);
		const openState = await client.evaluate(
			page.sessionId,
			`(() => {
				const sidebar = document.querySelector(".docs-sidebar-wrapper");
				return {
					open: sidebar.classList.contains("docs-sidebar-open"),
					transform: getComputedStyle(sidebar).transform,
				};
			})()`,
		);
		assertCheck("mobile sidebar opens from toggle", openState.open && !openState.transform.includes("-280"), JSON.stringify(openState));
	} finally {
		await client.closePage(page.targetId);
	}
}

async function checkSearch(client) {
	const page = await client.newPage(routes.intro, { width: 1440, height: 900 });
	try {
		const loaded = await client.waitFor(
			page.sessionId,
			`(async () => {
				if (typeof window.loadPagefindTsukimi === "function") await window.loadPagefindTsukimi();
				return !!window.pagefindTsukimi && typeof window.pagefindTsukimi.search === "function";
			})()`,
			(value) => value === true,
			15000,
		);
		assertCheck("pagefind loads in preview", loaded === true);

		const directSearch = await client.evaluate(
			page.sessionId,
			`(async () => {
				const response = await window.pagefindTsukimi.search("Docker", { filters: { docSlug: "tsukimi" } });
				const entries = await Promise.all(response.results.slice(0, 5).map((item) => item.data()));
				return {
					count: response.results.length,
					urls: entries.map((entry) => entry.url),
				};
			})()`,
		);
		assertCheck("pagefind docSlug filter returns docs results", directSearch.count > 0 && directSearch.urls.every((url) => url.startsWith("/docs/tsukimi/")), JSON.stringify(directSearch));

		await client.evaluate(
			page.sessionId,
			`(() => {
				document.querySelector(".search-modal-pill-btn")?.click();
				return true;
			})()`,
		);
		await client.waitFor(
			page.sessionId,
			`!!document.querySelector("#search-modal-input")`,
			(value) => value === true,
			5000,
		);
		await client.evaluate(
			page.sessionId,
			`(() => {
				const input = document.querySelector("#search-modal-input");
				input.focus();
				input.value = "Docker";
				input.dispatchEvent(new Event("input", { bubbles: true }));
				return true;
			})()`,
		);
		const uiSearch = await client.waitFor(
			page.sessionId,
			`(() => Array.from(document.querySelectorAll(".search-modal-result")).map((item) => item.textContent.trim()))()`,
			(value) => Array.isArray(value) && value.length > 0,
			10000,
		);
		assertCheck("docs search UI renders filtered results", uiSearch.every((text) => text.length > 0), JSON.stringify(uiSearch));
	} finally {
		await client.closePage(page.targetId);
	}
}

async function checkDockerPage(client) {
	const page = await client.newPage(routes.docker, { width: 1440, height: 900 });
	try {
		const state = await client.evaluate(
			page.sessionId,
			`(() => {
				const root = document.documentElement;
				return {
					overflow: root.scrollWidth - root.clientWidth,
				tabs: document.querySelectorAll(".docs-markdown .md-directive-tabs").length,
				enhancedTabs: document.querySelectorAll(".docs-markdown .md-directive-tabs .md-tabs-nav").length,
				tabButtons: document.querySelectorAll(".docs-markdown .md-directive-tabs .md-tab-btn").length,
				tabsHeadingLeak: document.querySelectorAll(".docs-markdown .md-directive-tabs h1").length,
				};
			})()`,
		);
		assertCheck("docker docs tabs are enhanced", state.tabs >= 1 && state.enhancedTabs >= 1 && state.tabButtons >= 2, JSON.stringify(state));
		assertCheck("docker docs tabs do not leak headings", state.tabsHeadingLeak === 0, JSON.stringify(state));
		assertCheck("docker page has no horizontal overflow", state.overflow <= 1, JSON.stringify(state));

		const switched = await client.evaluate(
			page.sessionId,
			`(() => {
				const buttons = document.querySelectorAll(".docs-markdown .md-directive-tabs .md-tab-btn");
				if (buttons.length < 2) return false;
				buttons[1].click();
				return true;
			})()`,
		);
		await wait(120);
		const tabState = await client.evaluate(
			page.sessionId,
			`(() => Array.from(document.querySelectorAll(".docs-markdown .md-directive-tabs .md-tab-btn")).map((button) => button.getAttribute("aria-selected")))()`,
		);
		assertCheck("docker docs tabs switch interactively", switched && tabState[1] === "true" && tabState[0] === "false", JSON.stringify(tabState));
	} finally {
		await client.closePage(page.targetId);
	}
}

async function checkNonDocsIsolation(client) {
	const page = await client.newPage(routes.article, { width: 1440, height: 900 });
	try {
		const state = await client.evaluate(
			page.sessionId,
			`(() => {
				const probe = document.createElement("tabs");
				probe.id = "docs-style-probe";
				probe.textContent = "probe";
				document.body.append(probe);
				const style = getComputedStyle(probe);
				return {
					bodyDocs: document.body.classList.contains("docs-page"),
					layout: !!document.querySelector(".docs-layout-container"),
					probeDisplay: style.display,
					probeBorderTop: style.borderTopWidth,
					probeBackground: style.backgroundColor,
					overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				};
			})()`,
		);
		assertCheck("non-doc page does not use docs layout", !state.bodyDocs && !state.layout, JSON.stringify(state));
		assertCheck("docs custom tag styles stay scoped", state.probeDisplay === "inline" && state.probeBorderTop === "0px", JSON.stringify(state));
		assertCheck("non-doc page has no docs-induced overflow", state.overflow <= 1, JSON.stringify(state));
	} finally {
		await client.closePage(page.targetId);
	}
}

function printSummary() {
	for (const check of checks) {
		const prefix = check.passed ? "ok" : "not ok";
		console.log(`${prefix} - ${check.name}${check.detail ? ` (${check.detail})` : ""}`);
	}
	if (failures === 0) {
		console.log(`\nDocs render checks passed (${checks.length} checks).`);
	} else {
		console.error(`\nDocs render checks failed (${failures}/${checks.length}).`);
	}
}

async function main() {
	logStep("checking preview");
	await ensurePreview();
	logStep("launching chrome");
	const chrome = await launchChrome();
	const client = new CdpClient(chrome.endpoint, chrome.httpEndpoint);
	try {
		logStep("connecting to chrome");
		await client.connect();
		logStep("checking docs home");
		await checkDocsHome(client);
		logStep("checking intro desktop");
		await checkIntroDesktop(client);
		logStep("checking intro mobile");
		await checkIntroMobile(client);
		logStep("checking docs search");
		await checkSearch(client);
		logStep("checking docker page");
		await checkDockerPage(client);
		logStep("checking non-doc isolation");
		await checkNonDocsIsolation(client);
	} finally {
		client.close();
		await chrome.close();
	}

	printSummary();
	if (failures > 0) process.exit(1);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
