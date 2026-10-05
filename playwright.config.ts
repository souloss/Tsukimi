import { defineConfig } from "@playwright/test";

const port = 4337;
const browser = process.env.PLAYWRIGHT_BROWSER ?? "chromium";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 45_000,
	expect: {
		timeout: 10_000,
		toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
	},
	fullyParallel: false,
	workers: 1,
	reporter: process.env.CI
		? [["line"], ["json", { outputFile: "playwright-report/results.json" }]]
		: "list",
	use: {
		browserName: browser,
		baseURL: `http://127.0.0.1:${port}`,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "off",
	},
	webServer: {
		// Astro 7 backgrounds the server inside agent environments. Keep the
		// webServer command alive while that managed process serves the port.
		command: `pnpm prepare-dev-assets && pnpm astro dev --host 127.0.0.1 --port ${port}; while curl -sf http://127.0.0.1:${port}/ >/dev/null; do sleep 1; done`,
		url: `http://127.0.0.1:${port}/`,
		reuseExistingServer: true,
		timeout: 120_000,
		env: {
			ENABLE_CONTENT_SYNC: "false",
		},
	},
});
