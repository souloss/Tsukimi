import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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
			expect(
				criticalViolations,
				JSON.stringify(criticalViolations, null, 2),
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
			const layoutShifts = performance.getEntriesByType(
				"layout-shift",
			) as PerformanceEntry[];
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
				missingImages: images.filter(
					(image) => !image.complete || image.naturalWidth === 0,
				).length,
				firstContentfulPaint:
					performanceEntries.find(
						(entry) => entry.name === "first-contentful-paint",
					)?.startTime ?? 0,
				cumulativeLayoutShift,
			};
		});

		expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 4);
		expect(metrics.missingImages).toBe(0);
		expect(metrics.firstContentfulPaint).toBeGreaterThan(0);
		expect(metrics.firstContentfulPaint).toBeLessThan(5_000);
		expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1);
	});
});
