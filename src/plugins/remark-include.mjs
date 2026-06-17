/**
 * remark-include.mjs — Include external file content in markdown.
 *
 * Syntax: <!-- @include: ./snippet.md{5-10} -->
 *         <!-- @include: ./snippet.md#region -->
 *
 * Supports:
 * - Full file: <!-- @include: ./file.md -->
 * - Line range: <!-- @include: ./file.md{5-10} -->
 * - From line: <!-- @include: ./file.md{5-} -->
 * - To line: <!-- @include: ./file.md{-10} -->
 * - Region: <!-- @include: ./file.md#region -->
 *
 * Region markers per language:
 * - HTML/MD: <!-- #region [name] --> / <!-- #endregion [name] -->
 * - JS/TS/Java/C#: // #region [name] / // #endregion [name]
 * - CSS: /* #region [name] *​/ / /* #endregion [name] *​/
 * - Python/Ruby/Bash: # region [name] / # endregion [name]
 */

import fs from "node:fs";
import path from "node:path";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const INCLUDE_RE =
	/<!--\s*@include:\s*(\S+?)(?:{(\d*)-(\d*)})?(?:#(\w+))?\s*-->/g;
const REGION_START_RE = /(?:<!--|#|\/\/|\/\*)\s*(?:#region|region)\s+(\w+)/;
const REGION_END_RE = /(?:<!--|#|\/\/|\/\*)\s*(?:#endregion|endregion)\s+(\w+)/;

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

function stripFrontmatter(content) {
	return content.replace(FRONTMATTER_RE, "");
}

function extractLines(content, from, to) {
	const lines = content.split("\n");
	const start = from ? Number.parseInt(from, 10) - 1 : 0;
	const end = to ? Number.parseInt(to, 10) : lines.length;
	return lines.slice(start, end).join("\n");
}

function extractRegion(content, regionName) {
	const lines = content.split("\n");
	let inRegion = false;
	const regionLines = [];
	for (const line of lines) {
		const startMatch = line.match(REGION_START_RE);
		const endMatch = line.match(REGION_END_RE);
		if (startMatch && startMatch[1] === regionName) {
			inRegion = true;
			continue;
		}
		if (endMatch && endMatch[1] === regionName) {
			inRegion = false;
			continue;
		}
		if (inRegion) {
			regionLines.push(line);
		}
	}
	return regionLines.join("\n");
}

export function remarkInclude() {
	return (tree, file) => {
		const filePath = file.history?.[0] || file.path || "";
		const dir = filePath ? path.dirname(filePath) : process.cwd();

		visit(tree, "html", (node, index, parent) => {
			if (!node.value?.includes("@include:")) {
				return;
			}

			const matches = [...node.value.matchAll(INCLUDE_RE)];
			if (!matches.length) {
				return;
			}

			const replacements = [];
			for (const match of matches) {
				const [, relPath, from, to, region] = match;
				const absPath = path.resolve(dir, relPath);

				let content;
				try {
					content = fs.readFileSync(absPath, "utf-8");
				} catch {
					replacements.push({
						type: "html",
						value: `<!-- @include: ${relPath} — FILE NOT FOUND -->`,
					});
					continue;
				}

				if (region) {
					content = extractRegion(content, region);
				} else if (from || to) {
					content = extractLines(content, from, to);
				}

				if (absPath.endsWith(".md")) {
					// Strip frontmatter from .md files before parsing
					content = stripFrontmatter(content);
					// Parse as Markdown AST and insert children
					const parsed = unified().use(remarkParse).parse(content);
					replacements.push(...parsed.children);
				} else {
					// Non-markdown files: insert as raw HTML
					replacements.push({
						type: "html",
						value: content,
					});
				}
			}

			if (replacements.length && parent) {
				parent.children.splice(index, 1, ...replacements);
			}
		});
	};
}
