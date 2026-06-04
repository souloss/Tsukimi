/**
 * Rehype plugin for :::file-tree directive.
 * After remark-rehype converts the directive to a <file-tree> element,
 * this plugin finds it, parses its list children into a tree structure,
 * and replaces it with the rendered file tree HAST.
 */
import { visit } from "unist-util-visit";

// Lucide SVG icons (body only, viewBox 0 0 24 24)
const ICONS = {
	folder:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
	"folder-open":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m-3-3h6"/>',
	file: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/></g>',
	"file-type":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12h4"/><path d="M10 16h4"/></g>',
	"file-code":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></g>',
	image:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></g>',
	info: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></g>',
	ellipsis:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g>',
};

const FILE_ICONS = {
	ts: "file-code",
	tsx: "file-code",
	js: "file-code",
	jsx: "file-code",
	mjs: "file-code",
	cjs: "file-code",
	md: "file-type",
	mdx: "file-type",
	png: "image",
	jpg: "image",
	jpeg: "image",
	gif: "image",
	svg: "image",
	webp: "image",
	ico: "image",
	avif: "image",
};

// HAST node helpers
function el(tag, props, children) {
	return {
		type: "element",
		tagName: tag,
		properties: props || {},
		children: children || [],
	};
}

function txt(value) {
	return { type: "text", value };
}

function svgIcon(iconName) {
	const body = ICONS[iconName] || ICONS.file;
	return el(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			width: "1em",
			height: "1em",
		},
		[{ type: "raw", value: body }],
	);
}

function getFileIcon(filename) {
	if (filename === "README.md") return "info";
	const ext = filename.split(".").pop()?.toLowerCase() || "";
	return FILE_ICONS[ext] || "file";
}

// Get text content from a HAST element
function hastText(node) {
	if (!node) return "";
	if (node.type === "text") return node.value;
	if (Array.isArray(node.children)) return node.children.map(hastText).join("");
	return "";
}

// Parse text like "src/config/ # comment" or "++ new-file.ts"
function parseItemText(text) {
	let name = text.trim();
	let comment = "";
	let diffType = null;

	const commentMatch = name.match(/\s+#\s*(.+)$/);
	if (commentMatch) {
		comment = commentMatch[1].trim();
		name = name.slice(0, name.length - commentMatch[0].length).trim();
	}

	if (name.startsWith("++ ")) {
		diffType = "add";
		name = name.slice(3).trim();
	} else if (name.startsWith("-- ")) {
		diffType = "remove";
		name = name.slice(3).trim();
	}

	const isFolder = name.endsWith("/");
	if (isFolder) name = name.slice(0, -1);

	const isEllipsis = name === "..." || name === "…";

	return { name, comment, diffType, isFolder, isEllipsis };
}

// Parse a HAST <li> element into a tree node
function parseLiElement(li) {
	// First child is the text content (in a <p> or directly)
	// Nested <ul>/<ol> contains children
	let text = "";
	let childList = null;

	for (const child of li.children || []) {
		if (child.tagName === "p" && !childList) {
			text = hastText(child);
		} else if (child.tagName === "ul" || child.tagName === "ol") {
			childList = child;
		} else if (child.type === "text" && !text) {
			text = child.value;
		}
	}

	const parsed = parseItemText(text);
	const node = { ...parsed, children: [] };

	if (childList) {
		for (const child of childList.children || []) {
			if (child.tagName === "li") {
				node.children.push(parseLiElement(child));
			}
		}
	}

	return node;
}

// Parse a HAST <ul>/<ol> element into tree nodes
function parseListElement(list) {
	const nodes = [];
	for (const child of list.children || []) {
		if (child.tagName === "li") {
			nodes.push(parseLiElement(child));
		}
	}
	return nodes;
}

// Build HAST for a tree node
function buildNodeHast(node, level, isRoot = false) {
	const { name, comment, diffType, isFolder, isEllipsis, children } = node;
	const infoClasses = ["vp-file-tree-info"];
	const indentStyle = `--file-tree-level: ${level};`;

	if (isEllipsis) {
		return el("div", { className: ["vp-file-tree-node"] }, [
			el(
				"p",
				{ className: ["vp-file-tree-info", "ellipsis"], style: indentStyle },
				[
					el("span", { className: ["vp-file-tree-icon"] }, [
						svgIcon("ellipsis"),
					]),
					el("span", { className: ["name", "ellipsis"] }, [txt("…")]),
				],
			),
		]);
	}

	if (diffType) infoClasses.push("diff", `diff-${diffType}`);

	if (isFolder) {
		const iconName = isRoot ? "folder-open" : "folder";
		const infoKids = [
			el("span", { className: ["vp-file-tree-icon", "folder-icon"] }, [
				svgIcon(iconName),
			]),
			el("span", { className: ["name", "folder"] }, [txt(name)]),
		];
		if (comment)
			infoKids.push(el("span", { className: ["comment"] }, [txt(comment)]));
		if (isRoot) infoClasses.push("expanded");

		const infoEl = el(
			"p",
			{ className: infoClasses, style: indentStyle },
			infoKids,
		);

		if (children.length === 0) {
			return el("div", { className: ["vp-file-tree-node"] }, [infoEl]);
		}

		const childNodes = children.map((c) => buildNodeHast(c, level + 1, false));
		const groupEl = el("div", { className: ["group"] }, childNodes);

		if (isRoot) {
			return el("div", { className: ["vp-file-tree-node"] }, [infoEl, groupEl]);
		}

		return el("div", { className: ["vp-file-tree-node"] }, [
			el("details", {}, [el("summary", {}, [infoEl]), groupEl]),
		]);
	}

	// File node
	const infoKids = [
		el("span", { className: ["vp-file-tree-icon", "file-icon"] }, [
			svgIcon(getFileIcon(name)),
		]),
		el("span", { className: ["name", "file"] }, [txt(name)]),
	];
	if (comment)
		infoKids.push(el("span", { className: ["comment"] }, [txt(comment)]));

	return el("div", { className: ["vp-file-tree-node"] }, [
		el("p", { className: infoClasses, style: indentStyle }, infoKids),
	]);
}

// Build full file tree HAST from parsed nodes
function buildFileTreeHast(nodes) {
	const childNodes = nodes.map((n) => buildNodeHast(n, 0, n.isFolder));
	return el("div", { className: ["vp-file-tree"] }, childNodes);
}

export function rehypeFileTree() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "file-tree") return;
			if (!parent || typeof index !== "number") return;

			// Find the first <ul> or <ol> child
			const listEl = node.children?.find(
				(c) => c.tagName === "ul" || c.tagName === "ol",
			);

			if (!listEl) {
				// No list found — replace with empty container
				parent.children[index] = el("div", { className: ["vp-file-tree"] }, []);
				return;
			}

			const treeNodes = parseListElement(listEl);
			const hast = buildFileTreeHast(treeNodes);

			// Replace the <file-tree> element with the rendered tree
			parent.children[index] = hast;
		});
	};
}
