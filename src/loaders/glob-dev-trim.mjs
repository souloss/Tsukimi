/**
 * Dev-mode content loader that wraps Astro's glob() loader.
 *
 * In production (NODE_ENV="production"), delegates directly to glob().
 * In dev, trims the data-store to reduce memory usage:
 *   - Keeps frontmatter for ALL entries (listing/archive pages work)
 *   - Keeps full rendered HTML only for the N most recent posts
 *   - Strips rendered HTML, rendered metadata, and body for older entries
 *   - Applies to ALL collections (posts, docs, spec)
 */

import { glob } from "astro/loaders";

const isDev = () => {
	// Use dual env check for reliable dev-mode detection in Astro 6 content loaders.
	// ASTRO_BUILDING is not available during content loader execution in Astro 6
	// (it's undefined even during `astro build`). NODE_ENV is reliably set:
	// - "production" during `astro build` (set by Astro CLI)
	// - undefined or "development" during `astro dev`
	// Check both to be safe — if either indicates production, treat as production.
	const astroBuilding = process.env.ASTRO_BUILDING === "true";
	const nodeEnvProd = process.env.NODE_ENV === "production";
	return !astroBuilding && !nodeEnvProd;
};
const DEV_MAX_RENDERED = Number.parseInt(
	process.env.DEV_MAX_RENDERED_POSTS || "20",
	10,
);
const DEV_PLACEHOLDER_HTML = "<p>Content preview not available in dev mode</p>";

export function devGlob(globOptions) {
	const baseLoader = glob(globOptions);

	return {
		name: "dev-glob",

		async load(context) {
			if (!isDev()) {
				return baseLoader.load(context);
			}

			await baseLoader.load(context);

			const keys = context.store.keys();
			const entries = [];
			for (const id of keys) {
				const entry = context.store.get(id);
				if (entry) {
					entries.push([id, entry]);
				}
			}

			// Separate posts (sorted by date) from other collections
			const postsEntries = [];
			const otherEntries = [];

			for (const [id, entry] of entries) {
				if (entry.data?.published) {
					postsEntries.push([id, entry]);
				} else {
					otherEntries.push([id, entry]);
				}
			}

			// Sort posts by published date (newest first)
			postsEntries.sort((a, b) => {
				const da = a[1]?.data?.published;
				const db = b[1]?.data?.published;
				if (!da && !db) {
					return 0;
				}
				if (!da) {
					return 1;
				}
				if (!db) {
					return -1;
				}
				return new Date(db) - new Date(da);
			});

			// Trim: strip rendered HTML/metadata/body from posts beyond threshold
			let trimmed = 0;
			for (let i = DEV_MAX_RENDERED; i < postsEntries.length; i++) {
				const [id, entry] = postsEntries[i];
				if (
					process.env.DRAFT_PREVIEW === "true" &&
					entry.data?.draft === true
				) {
					continue;
				}
				if (entry.rendered || entry.body) {
					context.store.set({
						id,
						data: entry.data,
						filePath: entry.filePath,
						rendered: {
							html: DEV_PLACEHOLDER_HTML,
							metadata: { headings: [] },
						},
						assetImports: entry.assetImports,
						deferredRender: entry.deferredRender,
					});
					trimmed++;
				}
			}

			// Trim ALL non-posts entries (docs, spec) — strip rendered content
			for (const [id, entry] of otherEntries) {
				if (entry.rendered || entry.body) {
					context.store.set({
						id,
						data: entry.data,
						filePath: entry.filePath,
						rendered: {
							html: DEV_PLACEHOLDER_HTML,
							metadata: { headings: [] },
						},
						assetImports: entry.assetImports,
						deferredRender: entry.deferredRender,
					});
					trimmed++;
				}
			}

			console.log(
				`[dev-glob] Trimmed ${trimmed}/${entries.length} entries (kept ${Math.min(DEV_MAX_RENDERED, postsEntries.length)} recent posts with full HTML)`,
			);
		},
	};
}
