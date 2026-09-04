import { visit } from "unist-util-visit";

const selfClosingComponentPattern = /<([A-Z][A-Za-z0-9-]*)(\s[^<>]*?)?\s*\/>/g;
const openingDirectivePattern =
	/^:{3,}\s*([A-Za-z][\w-]*)(?:\[(.*?)\])?(?:\s+(.+))?$/;
const closingDirectivePattern = /^:{3,}\s*$/;
const directiveNames = new Set([
	"card",
	"collapse",
	"file-tree",
	"important",
	"note",
	"steps",
	"tabs",
	"tip",
	"warning",
	"caution",
]);
const labeledDirectiveNames = new Set([
	"important",
	"note",
	"tip",
	"warning",
	"caution",
]);

function getParagraphText(node) {
	if (node?.type !== "paragraph") {
		return null;
	}
	if (!Array.isArray(node.children)) {
		return null;
	}
	return node.children
		.map((child) => {
			if (child.type === "text" || child.type === "inlineCode") {
				return child.value;
			}
			return "";
		})
		.join("")
		.trim();
}

function getNodeText(node) {
	if (!node) {
		return "";
	}
	if (
		node.type === "text" ||
		node.type === "inlineCode" ||
		node.type === "code"
	) {
		return node.value ?? "";
	}
	if (!Array.isArray(node.children)) {
		return "";
	}
	return node.children.map(getNodeText).join("");
}

function parseOpeningDirective(node) {
	const text = getParagraphText(node);
	if (!text) {
		return null;
	}
	const match = text.match(openingDirectivePattern);
	if (!match) {
		return null;
	}

	const name = match[1];
	if (!directiveNames.has(name)) {
		return null;
	}

	return {
		name,
		bracketLabel: match[2]?.trim() || "",
		meta: match[3]?.trim() || "",
	};
}

function isClosingDirective(node) {
	const text = getParagraphText(node);
	return Boolean(text && closingDirectivePattern.test(text));
}

function isEmptyNode(node) {
	if (!node) {
		return true;
	}
	if (node.type === "text") {
		return node.value.length === 0;
	}
	if (node.type === "paragraph") {
		return !node.children || node.children.every(isEmptyNode);
	}
	if (node.type === "listItem" || node.type === "list") {
		return !node.children || node.children.every(isEmptyNode);
	}
	return false;
}

function pruneEmptyTrailingChildren(node) {
	if (!Array.isArray(node?.children)) {
		return;
	}

	while (node.children.length > 0 && isEmptyNode(node.children.at(-1))) {
		node.children.pop();
	}
}

function stripTrailingClosingMarker(node) {
	if (!node || node.type === "code" || node.type === "html") {
		return false;
	}

	if (node.type === "text") {
		const nextValue = node.value.replace(/(?:\n|\s)*:{3,}\s*$/, "");
		const changed = nextValue !== node.value;
		node.value = nextValue;
		return changed;
	}

	if (!Array.isArray(node.children) || node.children.length === 0) {
		return false;
	}

	const lastChild = node.children.at(-1);
	const changed = stripTrailingClosingMarker(lastChild);
	if (changed) {
		pruneEmptyTrailingChildren(node);
	}

	return changed;
}

function findClosingDirectiveIndex(children, startIndex) {
	for (let cursor = startIndex; cursor < children.length; cursor += 1) {
		if (isClosingDirective(children[cursor])) {
			return { index: cursor, includeClosingNode: false };
		}

		if (stripTrailingClosingMarker(children[cursor])) {
			return { index: cursor, includeClosingNode: true };
		}
	}

	return null;
}

function parseAttributes(meta) {
	const attributes = {};
	if (!meta || !/[A-Za-z][\w-]*=/.test(meta)) {
		return attributes;
	}

	const attrPattern =
		/([A-Za-z_:][\w:.-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"']+)))?/g;
	for (const match of meta.matchAll(attrPattern)) {
		const key = match[1];
		const value = match[2] ?? match[3] ?? match[4] ?? "";
		attributes[key] = value;
	}

	return attributes;
}

function createLabelParagraph(label) {
	return {
		type: "paragraph",
		data: { directiveLabel: true },
		children: [{ type: "text", value: label }],
	};
}

function normalizeCollapseChildren(children, fallbackLabel) {
	const body = [...children];
	const first = body[0];
	const firstItem = first?.type === "list" ? first.children?.[0] : null;
	const titleNode = firstItem?.children?.[0];

	if (titleNode?.type === "paragraph") {
		const label = getNodeText(titleNode).trim();
		const restOfFirstItem = firstItem.children.slice(1);
		const remainingListItems = first.children.slice(1);
		const normalizedChildren = [
			createLabelParagraph(label || fallbackLabel),
			...restOfFirstItem,
		];

		if (remainingListItems.length > 0) {
			normalizedChildren.push({
				...first,
				children: remainingListItems,
			});
		}

		normalizedChildren.push(...body.slice(1));
		return normalizedChildren;
	}

	return [createLabelParagraph(fallbackLabel), ...body];
}

function createDirectiveNode(opening, children) {
	const attributes = parseAttributes(opening.meta);
	const label =
		opening.bracketLabel ||
		(labeledDirectiveNames.has(opening.name) &&
		Object.keys(attributes).length === 0
			? opening.meta
			: "");

	if (opening.name === "collapse") {
		return {
			type: "containerDirective",
			name: opening.name,
			attributes,
			children: normalizeCollapseChildren(children, label || "Details"),
		};
	}

	return {
		type: "containerDirective",
		name: opening.name,
		attributes,
		children: label ? [createLabelParagraph(label), ...children] : children,
	};
}

function transformDirectiveBlocks(parent) {
	if (!Array.isArray(parent?.children)) {
		return;
	}

	for (let index = 0; index < parent.children.length; index += 1) {
		const opening = parseOpeningDirective(parent.children[index]);
		if (!opening) {
			transformDirectiveBlocks(parent.children[index]);
			continue;
		}

		const closing = findClosingDirectiveIndex(parent.children, index + 1);
		if (!closing) {
			continue;
		}

		const childrenEnd = closing.includeClosingNode
			? closing.index + 1
			: closing.index;
		const children = parent.children.slice(index + 1, childrenEnd);
		parent.children.splice(
			index,
			closing.index - index + 1,
			createDirectiveNode(opening, children),
		);
		transformDirectiveBlocks(parent.children[index]);
	}
}

/**
 * Revert smartypants transformations inside :::file-tree blocks.
 * remark-smartypants converts -- to — (em-dash), which breaks
 * the -- diff marker syntax. Revert it back so the rehype plugin
 * can correctly parse diff markers.
 */
function revertSmartypantsInFileTree(node) {
	if (!node || !Array.isArray(node.children)) return;

	for (const child of node.children) {
		if (child.type === "containerDirective" && child.name === "file-tree") {
			revertSmartypantsInTree(child);
		} else {
			revertSmartypantsInFileTree(child);
		}
	}
}

function revertSmartypantsInTree(node) {
	if (!node) return;
	if (node.type === "text" && typeof node.value === "string") {
		node.value = node.value.replace(/— /g, "-- ");
	}
	if (Array.isArray(node.children)) {
		for (const child of node.children) {
			revertSmartypantsInTree(child);
		}
	}
}

// Inline directives with () syntax that need conversion
// remark-parse interprets [text](url) as links, breaking :anno[text](content) syntax.
// We must reconstruct these from AST link nodes before remark-directive runs.
const parenDirectiveMap = {
	anno: "content",
	annotation: "content",
	abbr: "title",
};

/**
 * Transform AST-level patterns where :anno[text](content) or :abbr[text](content)
 * was parsed by remark-parse as: text(":name") + link("content", [text("text")])
 * and reconstruct them as textDirective nodes with the parenthetical content
 * stored as an attribute.
 */
function transformInlineParenDirectiveAST(tree) {
	// Handle both paragraphs and headings
	visit(tree, (node) => {
		if (node.type !== "paragraph" && node.type !== "heading") return;
		if (!Array.isArray(node.children)) return;

		for (let i = node.children.length - 1; i >= 0; i--) {
			const child = node.children[i];
			if (child.type !== "link") continue;
			// Check if the previous text node ends with :anno or :abbr
			const prev = node.children[i - 1];
			if (prev?.type !== "text") continue;
			const match = prev.value.match(/:(anno|annotation|abbr)$/);
			if (!match) continue;
			const dirName = match[1];
			const attrName = parenDirectiveMap[dirName];
			if (!attrName) continue;
			// Extract bracket content from link children
			const bracketContent = child.children
				? child.children.map((c) => c.value || "").join("")
				: "";
			// Extract parenthetical content from link URL
			const parenContent = child.url || "";
			if (!parenContent) continue;
			// Remove trailing :name from previous text node
			prev.value = prev.value.slice(0, -match[0].length);
			// Replace the link node with a textDirective
			const directive = {
				type: "textDirective",
				name: dirName,
				attributes: { [attrName]: parenContent },
				children: [{ type: "text", value: bracketContent }],
			};
			node.children.splice(i, 1, directive);
		}
	});
}

export function remarkPlumeCompat() {
	return (tree) => {
		visit(tree, "html", (node) => {
			node.value = node.value.replace(
				selfClosingComponentPattern,
				(_, componentName, attributes = "") =>
					`<${componentName}${attributes}></${componentName}>`,
			);
		});

		transformInlineParenDirectiveAST(tree);
		transformDirectiveBlocks(tree);
		revertSmartypantsInFileTree(tree);
	};
}
