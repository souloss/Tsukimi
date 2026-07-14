import fs from "node:fs";
import path from "node:path";

import { visit } from "unist-util-visit";

const isDev = () => process.env.NODE_ENV !== "production";

/**
 * remark-relative-links: resolve relative markdown file links (e.g. ./1-file.md)
 * to the target post's final URL (e.g. /posts/internet-architecture/slug/).
 *
 * How it works:
 * 1. Get the current file path from vfile
 * 2. When a relative link is found, resolve the target file's absolute path
 * 3. Read the target file's frontmatter (slug / alias / permalink)
 * 4. Build the correct URL following the SAME priority as getPostUrl()
 *
 * NOTE: URL priority here MUST stay in sync with `getPostUrl()` in
 * src/utils/url-utils.ts. The plugin can't import it directly (it runs on
 * raw file path + frontmatter text, not a CollectionEntry), so this is a
 * faithful minimal replica. Global permalink (permalinkConfig.enable) is
 * intentionally NOT replicated here — it's disabled by default and needs an
 * entry object the plugin doesn't have.
 */

// Cache: resolved filePath -> URL mapping
const resolvedCache = new Map();

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

function extractField(yaml, field) {
	// Match `field:` on its own line; strip surrounding quotes/commas.
	const re = new RegExp(`^${field}:\\s*(.+)$`, "m");
	const match = yaml.match(re);
	if (!match) {
		return null;
	}
	return match[1].trim().replace(/^["']|["']$/g, "");
}

/**
 * Extract slug / alias / permalink from YAML frontmatter.
 * Mirrors the schema in src/content.config.ts (alias, permalink, slug).
 */
function extractFrontmatter(content) {
	const match = content.match(FRONTMATTER_RE);
	if (!match) {
		return {};
	}
	const yaml = match[1];
	return {
		slug: extractField(yaml, "slug"),
		alias: extractField(yaml, "alias"),
		permalink: extractField(yaml, "permalink"),
	};
}

/**
 * Strip leading/trailing slashes from a permalink/alias segment.
 */
function cleanSegment(s) {
	return s.replace(/^\/+/, "").replace(/\/+$/, "");
}

/**
 * Resolve the directory part under posts/ for a given file path.
 * Tolerates symlinked posts dir: file.path may be the logical path
 * (src/content/posts/...) OR a realpath after symlink resolution.
 * Falls back to the posts/ segment if the canonical marker is absent.
 */
function resolveDir(absolutePath) {
	const normalized = absolutePath.replace(/\\/g, "/");
	const marker = "src/content/posts/";
	const markerIdx = normalized.indexOf(marker);
	if (markerIdx >= 0) {
		const rel = normalized.substring(markerIdx + marker.length);
		const lastSlash = rel.lastIndexOf("/");
		return lastSlash >= 0 ? rel.substring(0, lastSlash + 1) : "";
	}
	// Symlink-resolved real path lacks the src/content/posts/ marker.
	// Derive dir from the posts/ segment instead.
	const postsIdx = normalized.lastIndexOf("/posts/");
	if (postsIdx >= 0) {
		const rel = normalized.substring(postsIdx + "/posts/".length);
		const lastSlash = rel.lastIndexOf("/");
		return lastSlash >= 0 ? rel.substring(0, lastSlash + 1) : "";
	}
	return "";
}

/**
 * Compute URL from file path + frontmatter, mirroring getPostUrl() priority:
 *   permalink > (global permalink, unsupported) > slug > alias > filename
 */
function computeUrl(absolutePath, fm) {
	const dir = resolveDir(absolutePath);
	const basename = absolutePath.replace(/\\/g, "/").split("/").pop() || "";
	const filenameWithoutExt = basename.replace(/\.(md|mdx|markdown)$/i, "");

	// permalink -> root-level URL (highest priority, like getPostUrl)
	if (fm.permalink) {
		return `/${cleanSegment(fm.permalink)}/`;
	}

	// slug -> /posts/<dir>/<slug>/ (dir preserved from on-disk structure)
	if (fm.slug) {
		return `/posts/${dir}${fm.slug}/`;
	}

	// alias -> /posts/<alias>/
	if (fm.alias) {
		return `/posts/${cleanSegment(fm.alias)}/`;
	}

	// default -> /posts/<dir>/<filename-without-ext>/
	return `/posts/${dir}${filenameWithoutExt}/`;
}

/**
 * Resolve a relative link target file to its URL
 */
function resolveLinkTarget(targetPath) {
	if (resolvedCache.has(targetPath)) {
		return resolvedCache.get(targetPath);
	}

	let result = null;
	try {
		if (fs.existsSync(targetPath)) {
			const content = fs.readFileSync(targetPath, "utf-8");
			const fm = extractFrontmatter(content);
			result = computeUrl(targetPath, fm);
		}
	} catch (_e) {
		// File does not exist or cannot be read; return null
	}

	resolvedCache.set(targetPath, result);
	return result;
}

export function remarkRelativeLinks() {
	return (tree, file) => {
		if (isDev()) {
			return;
		}
		const currentFilePath = file.path || file.history?.[0] || "";
		if (!currentFilePath) {
			return;
		}

		const currentDir = path.dirname(currentFilePath);

		visit(tree, "link", (node) => {
			const url = node.url;
			if (!url || typeof url !== "string") {
				return;
			}

			// Only process relative markdown links
			if (!url.startsWith("./") && !url.startsWith("../")) {
				return;
			}

			// Separate anchor from path (e.g. ./file.md#section)
			let anchor = "";
			let linkPath = url;
			const anchorIndex = linkPath.indexOf("#");
			if (anchorIndex >= 0) {
				anchor = linkPath.substring(anchorIndex);
				linkPath = linkPath.substring(0, anchorIndex);
			}

			// Only process links to .md/.mdx files
			if (!/\.(md|mdx|markdown)$/i.test(linkPath)) {
				return;
			}

			// Resolve relative path to absolute path
			const resolvedPath = path.resolve(currentDir, linkPath);

			// Look up the target file's URL
			const targetUrl = resolveLinkTarget(resolvedPath);
			if (targetUrl) {
				node.url = targetUrl + anchor;
			}
		});
	};
}
