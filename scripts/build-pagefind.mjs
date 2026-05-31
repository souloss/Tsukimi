import { execSync } from "node:child_process";
import { existsSync, mkdirSync, cpSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";

const site = "dist";

console.log("Building separate Pagefind indexes...\n");

// Default index: all HTML except docs pages
// We need to exclude docs pages from the main search index.
// Since Pagefind doesn't support glob negation, we create a temporary
// copy of the site without docs/ directory.
const tempSite = join(site, "_pagefind_temp");
console.log("1. Building default (main site) index...");

try {
	// Create temp directory by copying dist, excluding docs/
	if (existsSync(tempSite)) {
		rmSync(tempSite, { recursive: true, force: true });
	}
	mkdirSync(tempSite, { recursive: true });

	// Copy everything except docs/ and pagefind/
	cpSync(join(site, "_astro"), join(tempSite, "_astro"), { recursive: true });
	// Copy top-level directories and files (but not docs/ or pagefind/)
	const entries = readdirSync(site);
	for (const entry of entries) {
		if (entry === "docs" || entry === "pagefind" || entry === "_pagefind_temp") {
			continue;
		}
		const srcPath = join(site, entry);
		cpSync(srcPath, join(tempSite, entry), { recursive: true });
	}

	execSync(
		`npx pagefind --site ${tempSite} --glob "**/*.html" --output-subdir pagefind/default --silent`,
		{ stdio: "inherit" },
	);

	// Move the built index back to the real dist directory
	mkdirSync(join(site, "pagefind", "default"), { recursive: true });
	cpSync(join(tempSite, "pagefind", "default"), join(site, "pagefind", "default"), { recursive: true });

	// Clean up temp directory
	rmSync(tempSite, { recursive: true, force: true });

	console.log("   Default index built.\n");
} catch (error) {
	console.error("   Failed to build default index:", error);
	// Clean up on failure
	if (existsSync(tempSite)) {
		rmSync(tempSite, { recursive: true, force: true });
	}
	process.exit(1);
}

// Tsukimi docs index: only docs/tsukimi HTML
console.log("2. Building Tsukimi docs index...");
try {
	execSync(
		`npx pagefind --site ${site} --glob "docs/tsukimi/**/*.html" --output-subdir pagefind/tsukimi --silent`,
		{ stdio: "inherit" },
	);
	console.log("   Tsukimi docs index built.\n");
} catch (error) {
	console.error("   Failed to build Tsukimi docs index:", error);
	process.exit(1);
}

console.log("All Pagefind indexes built successfully.");