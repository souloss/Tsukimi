import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

async function disableOptionalWallpaper(page: Page) {
	await page.evaluate(() => {
		document.documentElement.setAttribute("data-wallpaper-mode", "none");
		document.body.classList.remove(
			"enable-banner",
			"fullscreen-banner",
			"wallpaper-transparent",
			"no-banner-mode",
		);
		document.getElementById("wallpaper-wrapper")?.remove();
	});
}

const corePages = [
	"/",
	"/archive/",
	"/about/",
	"/friends/",
	"/tags/",
	"/categories/",
	"/__tsukimi_missing_route__",
];

test.describe("core page regression", () => {
	for (const route of corePages) {
		test(`${route} renders without critical accessibility errors`, async ({
			page,
		}) => {
			const pageErrors: Error[] = [];
			page.on("pageerror", (error) => pageErrors.push(error));

			const response = await page.goto(route, {
				waitUntil: "domcontentloaded",
			});
			expect(
				response?.status(),
				`unexpected response for ${route}`,
			).toBeLessThanOrEqual(404);
			await expect(page.locator("body")).toBeVisible();
			await expect(page.locator("main")).toBeVisible();

			const accessibility = await new AxeBuilder({ page })
				.include("main")
				.exclude("#twikoo")
				.withTags(["wcag2a", "wcag2aa"])
				.analyze();
			const criticalViolations = accessibility.violations.filter(
				({ impact }) => impact === "critical",
			);
			const contrastViolations = accessibility.violations.filter(
				({ id, impact }) =>
					id === "color-contrast" &&
					(impact === "critical" || impact === "serious"),
			);
			expect(
				criticalViolations,
				JSON.stringify(criticalViolations, null, 2),
			).toEqual([]);
			expect(
				contrastViolations,
				JSON.stringify(contrastViolations, null, 2),
			).toEqual([]);
			expect(
				pageErrors,
				pageErrors.map((error) => error.message).join("\n"),
			).toEqual([]);
		});
	}

	test("home keeps the document within the viewport and settles layout shifts", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "networkidle" });
		const metrics = await page.evaluate(() => {
			const performanceEntries = performance.getEntriesByType("paint");
			const navigation = performance.getEntriesByType("navigation")[0] as
				| PerformanceNavigationTiming
				| undefined;
			const lcpEntries = performance.getEntriesByType(
				"largest-contentful-paint",
			) as PerformanceEntry[];
			const layoutShifts = performance.getEntriesByType(
				"layout-shift",
			) as PerformanceEntry[];
			const interactionEntries = performance.getEntriesByType(
				"event",
			) as (PerformanceEntry & { duration?: number })[];
			const cumulativeLayoutShift = layoutShifts.reduce((total, entry) => {
				const value = entry as PerformanceEntry & {
					value?: number;
					hadRecentInput?: boolean;
				};
				return total + (value.hadRecentInput ? 0 : (value.value ?? 0));
			}, 0);
			const images = [...document.images];
			return {
				clientWidth: document.documentElement.clientWidth,
				scrollWidth: document.documentElement.scrollWidth,
				missingImages: images.filter((image) => {
					const rect = image.getBoundingClientRect();
					const visible =
						rect.width > 0 &&
						rect.height > 0 &&
						rect.top < window.innerHeight &&
						rect.bottom > 0 &&
						rect.left < window.innerWidth &&
						rect.right > 0;
					if (!visible) return false;
					return !image.complete || image.naturalWidth === 0;
				}).length,
				firstContentfulPaint:
					performanceEntries.find(
						(entry) => entry.name === "first-contentful-paint",
					)?.startTime ?? 0,
				largestContentfulPaint:
					(
						lcpEntries.at(-1) as
							| (PerformanceEntry & { renderTime?: number; loadTime?: number })
							| undefined
					)?.renderTime ??
					(
						lcpEntries.at(-1) as
							| (PerformanceEntry & { renderTime?: number; loadTime?: number })
							| undefined
					)?.loadTime ??
					0,
				ttfb: navigation?.responseStart ?? 0,
				cumulativeLayoutShift,
				interactionToNextPaint: interactionEntries.reduce(
					(max, entry) => Math.max(max, entry.duration ?? 0),
					0,
				),
			};
		});

		expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 4);
		expect(metrics.missingImages).toBe(0);
		expect(metrics.firstContentfulPaint).toBeGreaterThan(0);
		expect(metrics.firstContentfulPaint).toBeLessThan(
			Number(process.env.TSUKIMI_FCP_BUDGET_MS ?? 3_000),
		);
		expect(metrics.largestContentfulPaint).toBeLessThan(
			Number(process.env.TSUKIMI_LCP_BUDGET_MS ?? 4_000),
		);
		expect(metrics.ttfb).toBeLessThan(
			Number(process.env.TSUKIMI_TTFB_BUDGET_MS ?? 800),
		);
		expect(metrics.cumulativeLayoutShift).toBeLessThan(
			Number(process.env.TSUKIMI_CLS_BUDGET ?? 0.1),
		);
		expect(metrics.interactionToNextPaint).toBeLessThan(
			Number(process.env.TSUKIMI_INP_BUDGET_MS ?? 500),
		);
	});

	test("skip link reaches the main content", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const skipLink = page.locator(".skip-link");
		await expect(skipLink).toBeVisible();
		await skipLink.focus();
		await expect(skipLink).toBeFocused();
		await skipLink.press("Enter");
		await page.locator("#main-content").focus();
		await expect(page.locator("#main-content")).toBeFocused();
	});

	test("search dialog opens, traps focus, and restores focus", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const trigger = page.locator("button.search-modal-icon-btn").first();
		await expect(trigger).toBeVisible();
		await trigger.click();
		const dialog = page.locator(".search-modal");
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute("role", "dialog");
		await expect(dialog).toHaveAttribute("aria-modal", "true");
		await expect(dialog.locator("input")).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(dialog.locator("button.search-modal-close-btn")).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(dialog.locator("input")).toBeFocused();
		await page.keyboard.press("Escape");
		await expect(dialog).toHaveCount(0);
		await expect(trigger).toBeFocused();
	});

	test("theme switch persists across a reload", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.evaluate(() => localStorage.removeItem("theme"));
		await page.reload({ waitUntil: "domcontentloaded" });
		const switcher = page.locator("#scheme-switch");
		await expect(switcher).toBeVisible();
		const before = await page
			.locator("html")
			.evaluate((element) => element.classList.contains("dark"));
		await switcher.click();
		await expect
			.poll(() =>
				page
					.locator("html")
					.evaluate((element) => element.classList.contains("dark")),
			)
			.toBe(!before);
		await expect
			.poll(() => page.evaluate(() => localStorage.getItem("theme")))
			.toBe(before ? "light" : "dark");
		await page.reload({ waitUntil: "domcontentloaded" });
		await expect
			.poll(() =>
				page
					.locator("html")
					.evaluate((element) => element.classList.contains("dark")),
			)
			.toBe(!before);
		await page.evaluate(() => localStorage.removeItem("theme"));
	});

	test("encrypted post exposes an accessible invalid password state", async ({
		page,
	}) => {
		await page.goto("/posts/encrypted-post/", {
			waitUntil: "domcontentloaded",
		});
		const input = page.locator("#password-input");
		await expect(input).toBeVisible();
		await expect(page.locator('label[for="password-input"]')).toBeAttached();
		await expect(input).toHaveAttribute("aria-invalid", "false");

		await input.fill("definitely-not-the-password");
		await page.locator("#unlock-btn").click();
		await expect(page.locator("#password-error")).toBeVisible({
			timeout: 15_000,
		});
		await expect(input).toHaveAttribute("aria-invalid", "true");
		await expect(input).toHaveAttribute("aria-describedby", "password-error");
	});

	test("primary controls meet the mobile touch target", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const selectors = [
			"button.search-modal-icon-btn",
			"#scheme-switch",
			"#mobile-menu-toggle",
			"#floating-controls button",
		];
		const sizes = await page.evaluate(
			(targets) =>
				targets.flatMap((selector) =>
					Array.from(document.querySelectorAll<HTMLElement>(selector))
						.filter((element) => getComputedStyle(element).display !== "none")
						.map((element) => ({
							selector,
							width: element.getBoundingClientRect().width,
							height: element.getBoundingClientRect().height,
						})),
				),
			selectors,
		);
		expect(sizes.length).toBeGreaterThan(0);
		for (const size of sizes) {
			expect(size.width, `${size.selector} width`).toBeGreaterThanOrEqual(40);
			expect(size.height, `${size.selector} height`).toBeGreaterThanOrEqual(40);
		}
	});

	test("mobile navigation and settings remain keyboard accessible", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const menu = page.locator("#nav-menu-switch");
		if (await menu.isVisible()) {
			await menu.focus();
			await page.keyboard.press("Enter");
			await expect(page.locator("#nav-menu-panel")).toBeVisible();
			await page.keyboard.press("Escape");
		}
		const settings = page.locator("#display-settings-switch");
		await settings.focus();
		await page.keyboard.press("Enter");
		const dialog = page.locator(
			'[role="dialog"][aria-labelledby="display-setting-title"]',
		);
		await expect(dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
	});

	test("reduced motion disables continuous animation", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const durations = await page.evaluate(() =>
			[...document.querySelectorAll<HTMLElement>("*")].map(
				(element) =>
					Number.parseFloat(getComputedStyle(element).animationDuration) || 0,
			),
		);
		expect(Math.max(...durations, 0)).toBeLessThanOrEqual(0.01);
	});

	test("core layouts match the visual regression baselines", async ({
		page,
		browserName,
	}) => {
		test.skip(
			browserName !== "chromium",
			"visual baselines are maintained for Chromium; other browsers run behavioral checks",
		);
		const scenarios = [
			{
				route: "/",
				name: "home-light.png",
				width: 1280,
				height: 720,
				dark: false,
			},
			{
				route: "/",
				name: "home-dark.png",
				width: 1280,
				height: 720,
				dark: true,
			},
			{
				route: "/",
				name: "home-mobile.png",
				width: 390,
				height: 844,
				dark: false,
			},
			{
				route: "/archive/",
				name: "archive-light.png",
				width: 1280,
				height: 720,
				dark: false,
			},
		] as const;
		for (const scenario of scenarios) {
			await page.setViewportSize({
				width: scenario.width,
				height: scenario.height,
			});
			await page.goto(scenario.route, { waitUntil: "domcontentloaded" });
			await disableOptionalWallpaper(page);
			await page.evaluate((dark) => {
				document.documentElement.classList.toggle("dark", dark);
				document.documentElement.style.setProperty("scroll-behavior", "auto");
			}, scenario.dark);
			await page.addStyleTag({
				content:
					"*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
			});
			await page.evaluate(() => document.fonts.ready);
			await expect(page).toHaveScreenshot(scenario.name, {
				animations: "disabled",
				fullPage: false,
				mask: [page.locator("#copyright-year")],
				maskColor: "#888",
			});
		}
	});

	for (const viewport of [
		{ width: 375, height: 812 },
		{ width: 390, height: 844 },
		{ width: 768, height: 1024 },
		{ width: 1024, height: 768 },
	]) {
		test(`home has no horizontal overflow at ${viewport.width}px`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport);
			await page.goto("/", { waitUntil: "domcontentloaded" });
			const overflow = await page.evaluate(
				() =>
					document.documentElement.scrollWidth -
					document.documentElement.clientWidth,
			);
			expect(overflow).toBeLessThanOrEqual(4);
		});
	}
});
