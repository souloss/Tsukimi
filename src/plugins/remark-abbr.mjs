/**
 * remark-abbr.mjs — Abbreviation support for markdown.
 *
 * Syntax:
 *   The HTML spec is maintained by the W3C.
 *
 *   *[HTML]: Hyper Text Markup Language
 *   *[W3C]:  World Wide Web Consortium
 *
 * Hovering over an abbreviation shows the full definition via <abbr title="...">.
 */
import { visit } from "unist-util-visit";

const ABBR_DEF_RE = /^\*\[(.+?)\]:\s+(.+)$/;

export function remarkAbbr() {
	return (tree) => {
		const abbreviations = new Map();

		// First pass: collect abbreviation definitions
		visit(tree, "paragraph", (node, index, parent) => {
			if (!parent) {
				return;
			}
			for (const child of node.children) {
				if (child.type === "text") {
					const match = child.value.trim().match(ABBR_DEF_RE);
					if (match) {
						abbreviations.set(match[1], match[2]);
						// Remove the definition paragraph
						parent.children.splice(index, 1);
						return index; // re-visit this index
					}
				}
			}
		});

		if (!abbreviations.size) {
			return;
		}

		// Second pass: replace abbreviation text with <abbr> elements
		visit(tree, "text", (node, index, parent) => {
			if (!parent) {
				return;
			}

			const value = node.value;
			let hasMatch = false;

			for (const [abbr, _title] of abbreviations) {
				if (value.includes(abbr)) {
					hasMatch = true;
				}
			}

			if (!hasMatch) {
				return;
			}

			// Split text around abbreviation occurrences
			const remaining = value;

			for (const [abbr, title] of abbreviations) {
				if (!remaining.includes(abbr)) {
					continue;
				}

				// Build a regex that matches the abbreviation as a whole word
				const escaped = abbr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const regex = new RegExp(
					`(?<=^|\\s|\\()${escaped}(?=$|\\s|\\.|,|;|:|\\)|\\])`,
					"g",
				);

				let lastIndex = 0;
				let match;
				const parts = [];

				// Use a simpler approach: split on abbreviation boundaries
				match = regex.exec(remaining);
				while (match !== null) {
					if (match.index > lastIndex) {
						parts.push({
							type: "text",
							value: remaining.slice(lastIndex, match.index),
						});
					}
					parts.push({
						type: "html",
						value: `<abbr title="${title.replace(/"/g, "&quot;")}">${abbr}</abbr>`,
					});
					lastIndex = match.index + match[0].length;
					match = regex.exec(remaining);
				}

				if (parts.length) {
					if (lastIndex < remaining.length) {
						parts.push({ type: "text", value: remaining.slice(lastIndex) });
					}
					// Replace in parent
					parent.children.splice(index, 1, ...parts);
					return index; // restart traversal at this index
				}
			}
		});
	};
}
