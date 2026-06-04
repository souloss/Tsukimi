/**
 * Rehype plugin for :::file-tree directive (Vuepress-inspired design).
 */
import { visit } from "unist-util-visit";

const ICONS = {
	folder:
		'<path fill="#d97706" stroke="none" d="M4 4a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2H4V4z"/><path fill="#f59e0b" stroke="none" d="M2 10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v5z"/>',
	file: '<path fill="#94a3b8" stroke="none" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#e2e8f0" stroke="none" d="M14 2v5a1 1 0 0 0 1 1h5L14 2z"/>',
	"file-code":
		'<path fill="#3b82f6" stroke="none" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#93c5fd" stroke="none" d="M14 2v5a1 1 0 0 0 1 1h5L14 2z"/><path fill="#1d4ed8" stroke="none" d="m10 13-2 2 2 2"/><path fill="#1d4ed8" stroke="none" d="m14 17 2-2-2-2"/>',
	"file-type":
		'<path fill="#8b5cf6" stroke="none" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#c4b5fd" stroke="none" d="M14 2v5a1 1 0 0 0 1 1h5L14 2z"/>',
	"file-config":
		'<path fill="#f97316" stroke="none" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#fdba74" stroke="none" d="M14 2v5a1 1 0 0 0 1 1h5L14 2z"/>',
	"file-image":
		'<path fill="#22c55e" stroke="none" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#86efac" stroke="none" d="M14 2v5a1 1 0 0 0 1 1h5L14 2z"/>',
	"file-lock":
		'<path fill="#ef4444" stroke="none" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#fca5a5" stroke="none" d="M14 2v5a1 1 0 0 0 1 1h5L14 2z"/>',
	info: '<circle fill="#6366f1" cx="12" cy="12" r="10"/><path fill="#e0e7ff" d="M12 16v-4m0-4h.01"/>',
	ellipsis:
		'<circle fill="#94a3b8" cx="12" cy="12" r="1"/><circle fill="#94a3b8" cx="19" cy="12" r="1"/><circle fill="#94a3b8" cx="5" cy="12" r="1"/>',
	chevron: '<path fill="currentColor" d="M6 9l6 6l6-6z"/>',
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
	png: "file-image",
	jpg: "file-image",
	jpeg: "file-image",
	gif: "file-image",
	svg: "file-image",
	webp: "file-image",
	ico: "file-image",
	avif: "file-image",
	json: "file-config",
	yaml: "file-config",
	yml: "file-config",
	toml: "file-config",
	env: "file-lock",
	lock: "file-lock",
	gitignore: "file-lock",
};

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

function svgIcon(iconName, size = "1em") {
	const body = ICONS[iconName] || ICONS.file;
	return el(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			width: size,
			height: size,
		},
		[{ type: "raw", value: body }],
	);
}

function getFileIcon(filename) {
	if (filename === "README.md") return "info";
	const base = filename.split("/").pop() || filename;
	const ext = base.split(".").pop()?.toLowerCase() || "";
	if (FILE_ICONS[base.toLowerCase()]) return FILE_ICONS[base.toLowerCase()];
	if (FILE_ICONS[ext]) return FILE_ICONS[ext];
	return "file";
}

function getFileIconClass(filename) {
	const iconName = getFileIcon(filename);
	const classMap = {
		"file-code": "vp-icon-code",
		"file-type": "vp-icon-doc",
		"file-config": "vp-icon-config",
		"file-image": "vp-icon-image",
		"file-lock": "vp-icon-lock",
		info: "vp-icon-info",
	};
	return classMap[iconName] || "";
}

function hastText(node) {
	if (!node) return "";
	if (node.type === "text") return node.value;
	if (Array.isArray(node.children)) return node.children.map(hastText).join("");
	return "";
}

function parseItemText(text) {
	let name = text.trim();
	let comment = "";
	let diffType = null;

	const commentMatch = name.match(/\s+#\s+(.+)$/);
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

function parseLiElement(li) {
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

function parseListElement(list) {
	const nodes = [];
	for (const child of list.children || []) {
		if (child.tagName === "li") {
			nodes.push(parseLiElement(child));
		}
	}
	return nodes;
}

function buildNodeHast(node, level) {
	const { name, comment, diffType, isFolder, isEllipsis, children } = node;
	const infoClasses = ["vp-file-tree-row"];
	const indentStyle = `--file-tree-level: ${level};`;

	if (isEllipsis) {
		return el("div", { className: ["vp-file-tree-item"], dataLevel: level }, [
			el(
				"div",
				{
					className: ["vp-file-tree-row", "vp-file-tree-ellipsis"],
					style: indentStyle,
				},
				[
					el("span", { className: ["vp-file-tree-icon"] }, [
						svgIcon("ellipsis"),
					]),
					el(
						"span",
						{ className: ["vp-file-tree-name", "vp-file-tree-ellipsis-text"] },
						[txt("…")],
					),
				],
			),
		]);
	}

	if (diffType)
		infoClasses.push("vp-file-tree-diff", `vp-file-tree-diff-${diffType}`);

	if (isFolder) {
		const infoKids = [
			el("span", { className: ["vp-file-tree-arrow"] }, [
				svgIcon("chevron", "0.85em"),
			]),
			el("span", { className: ["vp-file-tree-icon", "vp-icon-folder"] }, [
				svgIcon("folder"),
			]),
			el("span", { className: ["vp-file-tree-name", "vp-file-tree-folder"] }, [
				txt(name),
			]),
		];
		if (comment)
			infoKids.push(
				el("span", { className: ["vp-file-tree-comment"] }, [txt(comment)]),
			);

		const infoEl = el(
			"div",
			{ className: infoClasses, style: indentStyle },
			infoKids,
		);

		if (children.length === 0) {
			return el("div", { className: ["vp-file-tree-item"], dataLevel: level }, [
				infoEl,
			]);
		}

		const childNodes = children.map((c) => buildNodeHast(c, level + 1));
		const groupEl = el(
			"div",
			{ className: ["vp-file-tree-group"] },
			childNodes,
		);

		const isOpen = level === 0;

		return el("div", { className: ["vp-file-tree-item"], dataLevel: level }, [
			el("details", { open: isOpen }, [el("summary", {}, [infoEl]), groupEl]),
		]);
	}

	const iconClass = getFileIconClass(name);
	const infoKids = [
		el("span", { className: ["vp-file-tree-arrow-spacer"] }),
		el("span", { className: ["vp-file-tree-icon", iconClass] }, [
			svgIcon(getFileIcon(name)),
		]),
		el("span", { className: ["vp-file-tree-name", "vp-file-tree-file"] }, [
			txt(name),
		]),
	];
	if (comment)
		infoKids.push(
			el("span", { className: ["vp-file-tree-comment"] }, [txt(comment)]),
		);

	return el("div", { className: ["vp-file-tree-item"], dataLevel: level }, [
		el("div", { className: infoClasses, style: indentStyle }, infoKids),
	]);
}

function buildFileTreeHast(nodes) {
	const childNodes = nodes.map((n) => buildNodeHast(n, 0));
	return el("div", { className: ["vp-file-tree"] }, childNodes);
}

export function rehypeFileTree() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "file-tree") return;
			if (!parent || typeof index !== "number") return;

			const listEl = node.children?.find(
				(c) => c.tagName === "ul" || c.tagName === "ol",
			);

			if (!listEl) {
				parent.children[index] = el("div", { className: ["vp-file-tree"] }, []);
				return;
			}

			const treeNodes = parseListElement(listEl);
			const hast = buildFileTreeHast(treeNodes);

			parent.children[index] = hast;
		});
	};
}
