/**
 * Remark content directives — combined Vergil + Tsukimi implementation.
 *
 * Handles all custom markdown directives (:::callout, :::tabs, :mark[], etc.)
 * using hardcoded Lucide SVG icons (no dynamic imports from @iconify-json).
 */
import { visit } from "unist-util-visit";

// ---------------------------------------------------------------------------
// Hardcoded Lucide icon SVG data (body only, viewBox 0 0 24 24)
// ---------------------------------------------------------------------------
const LUCIDE_ICONS = {
	info: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></g>',
	lightbulb:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 14c.2-1 .7-1.7 1.5-2.5c1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5c.7.7 1.3 1.5 1.5 2.5m0 4h6m-5 4h4"/>',
	"triangle-alert":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01"/>',
	"circle-x":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9l-6 6m0-6l6 6"/></g>',
	"chevron-down":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6"/>',
	copy: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></g>',
	"git-fork":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9m6 3v3"/></g>',
	star: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
	tag: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></g>',
	play: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
	"picture-in-picture":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 10h6V4M2 4l6 6m13 0V7a2 2 0 0 0-2-2h-7m-9 9v2a2 2 0 0 0 2 2h3"/><rect width="10" height="7" x="12" y="14" rx="1"/></g>',
	check:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"/>',
	x: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>',
	plus: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/>',
	minus:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>',
	bookmark:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/>',
	calendar:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 2v4m8-4v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></g>',
	clock:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g>',
	"external-link":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
	file: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/></g>',
	folder:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
	heart:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
	mail: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></g>',
	pen: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
	search:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/></g>',
	settings:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g>',
	shield:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
	"thumbs-up":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88M7 10v12"/>',
	user: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g>',
	users:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></g>',
	zap: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
	code: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 18l6-6l-6-6M8 6l-6 6l6 6"/>',
	terminal:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19h8M4 17l6-6l-6-6"/>',
	quote:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
	"help-circle":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 1-1.16 1.77-2 2.35c-.56.39-.91.87-.91 1.47"/><path d="M12 17h.01"/></g>',
	"alert-circle":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></g>',
	download:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10l5 5l5-5"/></g>',
	upload:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
	"map-pin":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></g>',
	"message-square":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
	flame:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-5 .67 1.67 2.67 3.33 4 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 1-2.5 2.5"/>',
	rocket:
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.42 5.4-1.57 7.7L17 10l-3 3Z"/><path d="M9 12H4s.55-3 3-4.95c.3-.22.6-.42.95-.58M14.95 4.95A7.5 7.5 0 0 0 12 9"/></g>',
	bug: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.57 0-6.53-2.81-6.82-6.34L4.82 9.6A2 2 0 0 1 6.8 8h10.4a2 2 0 0 1 1.98 1.6l-1.36 4.06C17.53 17.19 14.57 20 12 20"/><path d="M6 12h4m4 0h4"/></g>',
	list: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13"/></g>',
	hashtag:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
};

// FA7-solid icons for blockquote (filled quote marks)
const FA7_SOLID_ICONS = {
	"quote-left":
		'<path fill="currentColor" d="M96 280c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64z"/>',
	"quote-right":
		'<path fill="currentColor" d="M544 360c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8h-64c-35.3 0-64-28.7-64-64v-64c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64zm-256 0c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8h-64c-35.3 0-64-28.7-64-64v-64c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64z"/>',
};

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

/** Get Lucide SVG string by icon name */
function getLucideSvg(name, size = "1em") {
	const body = LUCIDE_ICONS[name];
	if (!body) {
		return "";
	}
	return (
		'<svg xmlns="http://www.w3.org/2000/svg" width="' +
		size +
		'" height="' +
		size +
		'" viewBox="0 0 24 24">' +
		body +
		"</svg>"
	);
}

/** Get FA7-solid SVG string by icon name */
function getFa7SolidSvg(name, size = "1em") {
	const body = FA7_SOLID_ICONS[name];
	if (!body) {
		return "";
	}
	return (
		'<svg xmlns="http://www.w3.org/2000/svg" width="' +
		size +
		'" height="' +
		size +
		'" viewBox="0 0 576 512">' +
		body +
		"</svg>"
	);
}

/** Generic icon resolver: "lucide:info" or "fa7-solid:quote-left" or bare "info" (defaults to lucide) */
function getIconSvg(name, size = "1em") {
	if (name.includes(":")) {
		const colonIdx = name.indexOf(":");
		const set = name.slice(0, colonIdx);
		const iconName = name.slice(colonIdx + 1);
		if (set === "lucide") {
			return getLucideSvg(iconName, size);
		}
		if (set === "fa7-solid") {
			return getFa7SolidSvg(iconName, size);
		}
		if (set === "bxs" || set === "bx") {
			return getFa7SolidSvg(iconName, size);
		}
		if (set === "solar") {
			return getLucideSvg(iconName, size);
		}
		return "";
	}
	return getLucideSvg(name, size);
}

const NAMED_COLORS = {
	red: "#ef4444",
	orange: "#f97316",
	yellow: "#eab308",
	green: "#22c55e",
	blue: "#3b82f6",
	purple: "#a855f7",
	pink: "#ec4899",
	cyan: "#06b6d4",
	accent: "var(--accent-color,#4a7c59)",
};

/** Resolve color name to CSS value */
function resolveColor(c) {
	return NAMED_COLORS[c] || c || "var(--accent-color,#4a7c59)";
}

/** HTML escape */
function escapeHtml(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** Create a hast container node */
function h(tagName, properties, children) {
	return {
		type: "container",
		data: { hName: tagName, hProperties: properties || {} },
		children: children || [],
	};
}

/** Serialize AST nodes to HTML string */
function serializeToHtml(nodes) {
	const nodeArr = Array.isArray(nodes) ? nodes : [nodes];
	return nodeArr
		.map((node) => {
			if (!node) {
				return "";
			}
			switch (node.type) {
				case "text":
					return escapeHtml(node.value || "");
				case "inlineCode":
					return `<code>${escapeHtml(node.value || "")}</code>`;
				case "strong":
					return `<strong>${serializeToHtml(node.children)}</strong>`;
				case "emphasis":
					return `<em>${serializeToHtml(node.children)}</em>`;
				case "delete":
					return `<del>${serializeToHtml(node.children)}</del>`;
				case "link":
					return (
						'<a href="' +
						(node.url || "#") +
						'">' +
						serializeToHtml(node.children) +
						"</a>"
					);
				case "image":
					return (
						'<img src="' +
						(node.url || "") +
						'" alt="' +
						(node.alt || "") +
						'" loading="lazy" />'
					);
				case "break":
					return "<br>";
				case "paragraph":
					return `<p>${serializeToHtml(node.children)}</p>`;
				case "heading":
					return (
						"<h" +
						(node.depth || 2) +
						">" +
						serializeToHtml(node.children) +
						"</h" +
						(node.depth || 2) +
						">"
					);
				case "code":
					return (
						'<pre><code class="language-' +
						(node.lang || "") +
						'">' +
						escapeHtml(node.value || "") +
						"</code></pre>"
					);
				case "blockquote":
					return `<blockquote>${serializeToHtml(node.children)}</blockquote>`;
				case "list": {
					const tag = node.ordered ? "ol" : "ul";
					return (
						"<" +
						tag +
						">" +
						node.children
							.map((item) => `<li>${serializeToHtml(item.children)}</li>`)
							.join("") +
						"</" +
						tag +
						">"
					);
				}
				case "listItem":
					return serializeToHtml(node.children);
				case "thematicBreak":
					return "<hr>";
				case "html":
					return node.value || "";
				case "container":
					return serializeToHtml(node.children);
				default:
					return "";
			}
		})
		.join("");
}

const HASHTAG_COLORS = [
	"red",
	"orange",
	"yellow",
	"green",
	"cyan",
	"blue",
	"purple",
];

const EMOJI_SOURCES = {
	default: "https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/qq/{name}.gif",
	qq: "https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/qq/{name}.gif",
	aru: "https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/aru/{name}.gif",
	tieba: "https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/tieba/{name}.png",
	blobcat:
		"https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/blobcat/{name}.gif",
	twemoji:
		"https://gcore.jsdelivr.net/gh/twitter/twemoji/assets/svg/{name}.svg",
};

// ---------------------------------------------------------------------------
// Callout colors (Tailwind standard) and default titles
// ---------------------------------------------------------------------------
const CALLOUT_COLORS = {
	info: {
		bar: "#3b82f6",
		bg: "rgba(59,130,246,0.08)",
		border: "rgba(59,130,246,0.22)",
	},
	tip: {
		bar: "#10b981",
		bg: "rgba(16,185,129,0.08)",
		border: "rgba(16,185,129,0.22)",
	},
	warn: {
		bar: "#f59e0b",
		bg: "rgba(245,158,11,0.08)",
		border: "rgba(245,158,11,0.22)",
	},
	danger: {
		bar: "#dc2626",
		bg: "rgba(220,38,38,0.08)",
		border: "rgba(220,38,38,0.22)",
	},
	note: null,
	question: {
		bar: "#6366f1",
		bg: "rgba(99,102,241,0.08)",
		border: "rgba(99,102,241,0.22)",
	},
	quote: {
		bar: "#6b7280",
		bg: "rgba(107,114,128,0.08)",
		border: "rgba(107,114,128,0.22)",
	},
	bug: {
		bar: "#dc2626",
		bg: "rgba(220,38,38,0.08)",
		border: "rgba(220,38,38,0.22)",
	},
	example: {
		bar: "#8b5cf6",
		bg: "rgba(139,92,246,0.08)",
		border: "rgba(139,92,246,0.22)",
	},
	success: {
		bar: "#10b981",
		bg: "rgba(16,185,129,0.08)",
		border: "rgba(16,185,129,0.22)",
	},
	failure: {
		bar: "#dc2626",
		bg: "rgba(220,38,38,0.08)",
		border: "rgba(220,38,38,0.22)",
	},
	caution: {
		bar: "#f97316",
		bg: "rgba(249,115,22,0.08)",
		border: "rgba(249,115,22,0.22)",
	},
	important: {
		bar: "#7c3aed",
		bg: "rgba(124,58,237,0.08)",
		border: "rgba(124,58,237,0.22)",
	},
};

const CALLOUT_DEFAULT_TITLES = {
	info: "Info",
	tip: "Tip",
	warn: "Warning",
	danger: "Danger",
	note: "Note",
	question: "Question",
	quote: "Quote",
	bug: "Bug",
	example: "Example",
	success: "Success",
	failure: "Failure",
	caution: "Caution",
	important: "Important",
};

const CALLOUT_ICONS = {
	info: "info",
	tip: "lightbulb",
	warn: "triangle-alert",
	danger: "circle-x",
	note: "file",
	question: "help-circle",
	quote: "quote",
	bug: "bug",
	example: "list",
	success: "check",
	failure: "x",
	caution: "alert-circle",
	important: "flame",
};

// ---------------------------------------------------------------------------
// Inline directive processors
// ---------------------------------------------------------------------------
let hashtagIndex = 0;

function _processInlineDirective(node) {
	const name = node.name;
	const attrs = node.attributes || {};
	const text = node.children
		? node.children.map((c) => c.value || "").join("")
		: "";

	switch (name) {
		case "mark": {
			const bg = resolveColor(attrs.color || "yellow");
			const bgAlpha = bg.startsWith("var(")
				? `color-mix(in srgb,${bg} 30%,transparent)`
				: `${bg}55`;
			node.data = {
				hName: "mark",
				hProperties: {
					class: "md-tag-mark",
					style: `--tag-mark-bg:${bgAlpha};--tag-mark-color:${bg}`,
				},
			};
			break;
		}
		case "kbd":
			node.data = { hName: "kbd", hProperties: { class: "md-tag-kbd" } };
			break;
		case "blur":
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-blur",
					onclick: "this.classList.toggle('md-tag-blur--revealed')",
				},
			};
			break;
		case "psw":
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-psw",
					onclick: "this.classList.toggle('md-tag-psw--revealed')",
				},
			};
			break;
		case "u":
			node.data = {
				hName: "u",
				hProperties: {
					class: "md-tag-u",
					style: `--tag-u-color:${resolveColor(attrs.color || "accent")}`,
				},
			};
			break;
		case "emp":
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-emp",
					style: `--tag-emp-color:${resolveColor(attrs.color || "accent")}`,
				},
			};
			break;
		case "wavy":
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-wavy",
					style: `--tag-wavy-color:${resolveColor(attrs.color || "accent")}`,
				},
			};
			break;
		case "del":
			node.data = { hName: "del", hProperties: { class: "md-tag-del" } };
			break;
		case "sup":
			node.data = {
				hName: "sup",
				hProperties: {
					class: "md-tag-sup",
					style: `--tag-sup-color:${resolveColor(attrs.color || "accent")}`,
				},
			};
			break;
		case "sub":
			node.data = {
				hName: "sub",
				hProperties: {
					class: "md-tag-sub",
					style: `--tag-sub-color:${resolveColor(attrs.color || "accent")}`,
				},
			};
			break;
		case "hashtag": {
			let color = attrs.color ? resolveColor(attrs.color) : "";
			if (!color) {
				color = resolveColor(HASHTAG_COLORS[hashtagIndex]);
				hashtagIndex = (hashtagIndex + 1) % HASHTAG_COLORS.length;
			}
			const hashIcon =
				'<svg class="md-hash-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M426.6 64.8c34.8 5.8 58.4 38.8 52.6 73.6l-19.6 117.6h190.2l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6s58.4 38.8 52.6 73.6l-19.4 117.6H896c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-42.6 256H832c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.6-117.4h-190.4l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.4-117.8H128c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l42.6-256H192c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6z m11.6 319.2l-42.6 256h190.2l42.6-256h-190.2z"/></svg>';
			node.data = {
				hName: "a",
				hProperties: {
					href: attrs.href || "#",
					class: "md-tag-hashtag",
					style: `--tag-hash-color:${color}`,
				},
			};
			node.children = [
				{
					type: "html",
					value: `<span class="md-hash-icon">${hashIcon}</span>`,
				},
				{ type: "text", value: text },
			];
			break;
		}
		case "color": {
			const cc = resolveColor(attrs.color || attrs.c || "accent");
			node.data = {
				hName: "span",
				hProperties: { class: "md-tag-color", style: `color:${cc}` },
			};
			break;
		}
		case "step-brackets": {
			const num = text;
			const stepTitle = attrs.title || "";
			node.data = { hName: "div", hProperties: { class: "md-step-brackets" } };
			node.children = [
				{
					type: "html",
					value: `<span class="md-step-badge">${num}</span>`,
				},
			].concat(
				stepTitle
					? [
							{
								type: "html",
								value: `<span class="md-step-title">${stepTitle}</span>`,
							},
						]
					: [],
			);
			break;
		}
		case "checkbox": {
			const chkColor = resolveColor(attrs.color || "blue");
			const symbol = attrs.symbol || "";
			const checked = attrs.checked === "true" || attrs.checked === "";
			const inline = attrs.inline === "true" || attrs.inline === "";
			const chkClasses = ["md-tag-checkbox"];
			if (symbol) {
				chkClasses.push(`md-checkbox-symbol-${symbol}`);
			}
			if (inline) {
				chkClasses.push("md-checkbox-inline");
			}
			node.data = {
				hName: inline ? "span" : "div",
				hProperties: {
					class: chkClasses.join(" "),
					"data-checked": checked ? "true" : "false",
					style: `--checkbox-color:${chkColor}`,
				},
			};
			node.children = [
				{ type: "html", value: '<span class="md-checkbox-box"></span>' },
				{ type: "text", value: text },
			];
			break;
		}
		case "radio": {
			const radColor = resolveColor(attrs.color || "blue");
			const radChecked = attrs.checked === "true" || attrs.checked === "";
			const radInline = attrs.inline === "true" || attrs.inline === "";
			const radClasses = ["md-tag-checkbox", "md-tag-radio"];
			if (radInline) {
				radClasses.push("md-checkbox-inline");
			}
			node.data = {
				hName: radInline ? "span" : "div",
				hProperties: {
					class: radClasses.join(" "),
					"data-checked": radChecked ? "true" : "false",
					style: `--checkbox-color:${radColor}`,
				},
			};
			node.children = [
				{ type: "html", value: '<span class="md-checkbox-box"></span>' },
				{ type: "text", value: text },
			];
			break;
		}
		case "emoji": {
			const height = attrs.height || "1.75em";
			let source = attrs.source;
			let emojiName = attrs.name;
			if (source === undefined) {
				const firstSource = Object.keys(EMOJI_SOURCES)[0];
				if (firstSource) {
					emojiName = text;
					source = firstSource;
				}
			}
			if (!emojiName) {
				emojiName = text;
			}
			if (source && emojiName) {
				const template = EMOJI_SOURCES[source] || source;
				const url = template.replace("{name}", emojiName);
				node.data = {
					hName: "span",
					hProperties: {
						class: "md-tag-emoji",
						style: `--emoji-height:${height}`,
					},
				};
				node.children = [
					{
						type: "html",
						value:
							'<img src="' +
							url +
							'" alt="' +
							emojiName +
							'" loading="lazy" style="height:' +
							height +
							'" />',
					},
				];
			}
			break;
		}
		default:
			break;
	}
	return node;
}

// ---------------------------------------------------------------------------
// Block directive processors
// ---------------------------------------------------------------------------
function processBlockDirective(node, options = {}) {
	const _links = options.links;
	const _screenshotService = options.screenshotService;
	const name = node.name;
	const attrs = node.attributes || {};

	switch (name) {
		// --- Callout (with warn alias for warning) ---
		case "callout":
		case "note":
		case "info":
		case "tip":
		case "warning":
		case "caution":
		case "important":
		case "question":
		case "quote":
		case "bug":
		case "example":
		case "success":
		case "failure":
		case "danger": {
			let type = attrs.type || name;
			if (type === "warning") {
				type = "warn";
			}
			if (name === "callout") {
				type = attrs.type || "info";
			}

			const title = attrs.title || CALLOUT_DEFAULT_TITLES[type] || "Info";
			const iconName = CALLOUT_ICONS[type] || "info";
			const iconSvg = getIconSvg(`lucide:${iconName}`, 16);
			let c = CALLOUT_COLORS[type];

			const bodyHtml = serializeToHtml(node.children);
			// When CALLOUT_COLORS[type] is null (e.g. note), let CSS handle theming via var(--primary).
			// When a custom color attribute is provided, derive bar/bg/border from it.
			let styleAttr = "";
			let extraClass = "";
			if (c === null) {
				if (attrs.color) {
					const customColor = resolveColor(attrs.color);
					styleAttr =
						' style="--callout-bar:' +
						customColor +
						";--callout-bg:color-mix(in srgb," +
						customColor +
						" 8%,var(--card-bg));--callout-border:color-mix(in srgb," +
						customColor +
						' 22%,transparent)"';
				} else {
					extraClass = " md-callout-theme";
				}
			} else if (!c) {
				c = CALLOUT_COLORS.info;
				styleAttr =
					' style="--callout-bar:' +
					c.bar +
					";--callout-bg:" +
					c.bg +
					";--callout-border:" +
					c.border +
					'"';
			} else {
				styleAttr =
					' style="--callout-bar:' +
					c.bar +
					";--callout-bg:" +
					c.bg +
					";--callout-border:" +
					c.border +
					'"';
			}

			const fullHtml =
				'<div class="md-directive md-directive-callout md-callout-' +
				type +
				extraClass +
				'"' +
				styleAttr +
				'><div class="md-callout-inner"><div class="md-callout-title">' +
				iconSvg +
				"<span>" +
				escapeHtml(title) +
				'</span></div><div class="md-callout-body">' +
				bodyHtml +
				"</div></div></div>";

			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: fullHtml }];
			break;
		}

		case "folding":
		case "collapse": {
			const foldTitle = attrs.title || "Details";
			const open = attrs.open === "true" || attrs.open === "";
			const foldColor = resolveColor(attrs.color || "accent");
			node.data = {
				hName: "details",
				hProperties: {
					class: "md-directive md-directive-folding",
					style: `--folding-color:${foldColor}`,
				},
			};
			if (open) {
				node.data.hProperties.open = true;
			}
			node.children = [
				{
					type: "html",
					value:
						'<summary><span class="md-folding-title">' +
						foldTitle +
						'</span><span class="md-folding-arrow">' +
						getIconSvg("lucide:chevron-down", 12) +
						'</span></summary><div class="md-folding-body">',
				},
			]
				.concat(node.children)
				.concat([{ type: "html", value: "</div>" }]);
			break;
		}

		case "folders": {
			const folders = [];
			let currentFolder = null;
			let currentContent = [];
			for (let fi = 0; fi < node.children.length; fi++) {
				const fchild = node.children[fi];
				if (fchild.type === "paragraph") {
					const ftext = fchild.children
						.map((c) => c.value || "")
						.join("")
						.trim();
					if (ftext.startsWith("folder:")) {
						if (currentFolder !== null) {
							folders.push({ title: currentFolder, children: currentContent });
						}
						currentFolder = ftext.slice(7).trim();
						currentContent = [];
						continue;
					}
				}
				if (currentFolder !== null) {
					currentContent.push(fchild);
				}
			}
			if (currentFolder !== null) {
				folders.push({ title: currentFolder, children: currentContent });
			}
			node.data = {
				hName: "div",
				hProperties: { class: "md-directive md-directive-folders" },
			};
			node.children = folders.map((f, i) => {
				const summaryHtml =
					'<summary><span class="md-folder-title">' +
					f.title +
					'</span><span class="md-folder-arrow">' +
					getIconSvg("lucide:chevron-down", 12) +
					"</span></summary>";
				const detailsProps = { class: "md-folder" };
				if (i === 0) {
					detailsProps.open = true;
				}
				return h("details", detailsProps, [
					{ type: "html", value: summaryHtml },
					h("div", { class: "md-folder-body" }, f.children),
				]);
			});
			break;
		}

		case "timeline": {
			const items = [];
			visit(
				{ type: "root", children: node.children },
				"listItem",
				(listItem) => {
					let ttext = "";
					visit(listItem, "text", (t) => {
						ttext += t.value;
					});
					const parts = ttext.split("|").map((s) => s.trim());
					if (parts.length >= 2) {
						items.push({
							date: parts[0],
							title: parts[1],
							desc: parts[2] || "",
						});
					}
				},
			);
			const tlHtml =
				'<ol class="md-directive md-directive-timeline">' +
				items
					.map(
						(item, i) =>
							'<li class="md-timeline-node"><div class="md-timeline-dot' +
							(i === 0 ? " md-timeline-dot-first" : "") +
							'"></div><div class="md-timeline-content"><time>' +
							item.date +
							"</time><h3>" +
							item.title +
							"</h3>" +
							(item.desc ? `<p>${item.desc}</p>` : "") +
							"</div></li>",
					)
					.join("") +
				"</ol>";
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: tlHtml }];
			break;
		}

		case "tabs": {
			const align = attrs.align || "";
			const tabs = [];
			let currentTab = null;
			let currentTabColor = "";
			let currentTabContent = [];
			for (let ti = 0; ti < node.children.length; ti++) {
				const tchild = node.children[ti];
				if (tchild.type === "paragraph") {
					const ttext2 = tchild.children
						.map((c) => c.value || "")
						.join("")
						.trim();
					if (ttext2.startsWith("tab:")) {
						if (currentTab !== null) {
							tabs.push({
								label: currentTab,
								color: currentTabColor,
								children: currentTabContent,
							});
						}
						const raw = ttext2.slice(4).trim();
						const m = raw.match(/^(.+?)\{(color=[^}]+)\}$/);
						currentTab = m ? m[1].trim() : raw;
						currentTabColor = m
							? resolveColor(
									m[2]
										.slice(6)
										.trim()
										.replace(/^['"""]+|['"""]+$/g, ""),
								)
							: "";
						currentTabContent = [];
						continue;
					}
				}
				if (currentTab !== null) {
					currentTabContent.push(tchild);
				}
			}
			if (currentTab !== null) {
				tabs.push({
					label: currentTab,
					color: currentTabColor,
					children: currentTabContent,
				});
			}

			const uid = `tabs-${Math.random().toString(36).slice(2, 7)}`;
			const navHtml = tabs
				.map((t, i) => {
					const isActive = i === 0 ? "md-tab-active" : "";
					const colorStyle = t.color
						? ` style="--tab-active-color:${t.color}"`
						: "";
					const href = `${uid}-pane-${i}`;
					return (
						'<a href="#' +
						href +
						'" role="tab" aria-selected="' +
						(i === 0 ? "true" : "false") +
						'" class="md-tab-btn ' +
						isActive +
						'"' +
						colorStyle +
						' data-tab-index="' +
						i +
						'" data-tabs-id="' +
						uid +
						'">' +
						t.label +
						"</a>"
					);
				})
				.join("");
			const paneEls = tabs.map((t, i) => {
				const isVisible = i === 0 ? "md-tab-visible" : "";
				const paneId = `${uid}-pane-${i}`;
				return h(
					"div",
					{
						id: paneId,
						class: `md-tab-pane ${isVisible}`,
						role: "tabpanel",
						"aria-labelledby": `${uid}-tab-${i}`,
					},
					t.children,
				);
			});
			const tabProps = { id: uid, class: "md-directive md-directive-tabs" };
			if (align) {
				tabProps.align = align;
			}
			node.data = { hName: "div", hProperties: tabProps };
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-tabs-nav" role="tablist">' +
						navHtml +
						'</div><div class="md-tabs-content">',
				},
			]
				.concat(paneEls)
				.concat([{ type: "html", value: "</div>" }]);
			break;
		}

		case "poetry": {
			const pTitle = attrs.title || "";
			const pAuthor = attrs.author || "";
			const pDate = attrs.date || "";
			const pFooter = attrs.footer || "";
			node.data = { hName: "div", hProperties: {} };
			const pMeta = [pAuthor, pDate].filter(Boolean).join(" · ");
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-directive md-directive-poetry"><div class="md-poetry-content">' +
						(pTitle ? `<div class="md-poetry-title">${pTitle}</div>` : "") +
						(pMeta ? `<div class="md-poetry-meta">${pMeta}</div>` : "") +
						'<div class="md-poetry-body">',
				},
			]
				.concat(node.children)
				.concat([
					{
						type: "html",
						value:
							"</div>" +
							(pFooter
								? `<div class="md-poetry-footer">${pFooter}</div>`
								: "") +
							"</div></div>",
					},
				]);
			break;
		}

		case "copy": {
			const copyLabel = attrs.label || "";
			let copyText = "";
			visit({ type: "root", children: node.children }, "text", (t) => {
				copyText += t.value;
			});
			copyText = copyText.trim();
			const copyUid = `copy-${Math.random().toString(36).slice(2, 7)}`;
			const safeText = copyText
				.replace(/"/g, "&quot;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
			const copyIcon = getIconSvg("lucide:copy", 14);
			const copyHtml =
				'<div class="md-directive md-directive-copy" data-md-copy="1">' +
				(copyLabel ? `<span class="md-copy-label">${copyLabel}</span>` : "") +
				'<input id="' +
				copyUid +
				'" readonly value="' +
				safeText +
				'" class="md-copy-input" style="width:' +
				Math.max(copyText.length * 8, 120) +
				'px"><button class="md-copy-btn" data-copy-target="' +
				copyUid +
				'">' +
				copyIcon +
				"</button></div>";
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: copyHtml }];
			break;
		}

		case "grid": {
			const cols = attrs.cols || "";
			const gap = attrs.gap || "16";
			const minw = attrs.minw || "240px";
			const bg = attrs.bg || "card";
			const cells = [];
			let currentCell = [];
			for (let gi = 0; gi < node.children.length; gi++) {
				if (node.children[gi].type === "thematicBreak") {
					cells.push(currentCell);
					currentCell = [];
				} else {
					currentCell.push(node.children[gi]);
				}
			}
			if (currentCell.length) {
				cells.push(currentCell);
			}
			const gridClasses = ["md-directive-grid", `md-grid-bg-${bg}`];
			const gridStyle = `--grid-gap:${gap}px`;
			if (cols) {
				gridClasses.push("md-grid-cols");
				node.data = {
					hName: "div",
					hProperties: {
						class: `md-directive ${gridClasses.join(" ")}`,
						style: `${gridStyle};--grid-cols:${cols}`,
					},
				};
			} else {
				gridClasses.push("md-grid-auto");
				node.data = {
					hName: "div",
					hProperties: {
						class: `md-directive ${gridClasses.join(" ")}`,
						style: `${gridStyle};--grid-minw:${minw}`,
					},
				};
			}
			node.children = cells.map((c) => h("div", { class: "md-grid-cell" }, c));
			break;
		}

		case "blockquote":
		case "quot": {
			const leftQuote = getIconSvg("bxs:quote-left", 28);
			const rightQuote = getIconSvg("bxs:quote-right", 28);
			const qIcon = attrs.icon || "";
			if (qIcon || name === "quot") {
				let qText = "";
				visit({ type: "root", children: node.children }, "text", (t) => {
					qText += t.value;
				});
				qText = qText.trim();
				let qIconHtml = "";
				if (qIcon) {
					if (/^https?:\/\//i.test(qIcon)) {
						qIconHtml =
							'<img class="md-quot-icon" src="' +
							qIcon +
							'" alt="" style="height:28px;width:auto;" />';
					} else {
						const qMatch = qIcon.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
						if (qMatch) {
							qIconHtml =
								'<span class="md-quot-icon">' +
								getIconSvg(qIcon, "1.75rem") +
								"</span>";
						} else {
							const qSvg = getIconSvg(`lucide:${qIcon}`, "1.75rem");
							qIconHtml = qSvg
								? `<span class="md-quot-icon">${qSvg}</span>`
								: `<span class="md-quot-icon">${qIcon}</span>`;
						}
					}
				} else {
					qIconHtml = `<span class="md-quot-icon-default">${leftQuote}</span>`;
				}
				const quotHtml =
					'<div class="md-directive md-directive-quot">' +
					qIconHtml +
					'<p class="md-quot-text">' +
					qText +
					"</p></div>";
				node.data = { hName: "div", hProperties: {} };
				node.children = [{ type: "html", value: quotHtml }];
			} else {
				node.data = {
					hName: "blockquote",
					hProperties: { class: "md-directive md-directive-blockquote" },
				};
				node.children = [
					{
						type: "html",
						value:
							'<span class="md-blockquote-icon md-blockquote-icon-left">' +
							leftQuote +
							"</span>",
					},
				]
					.concat(node.children)
					.concat([
						{
							type: "html",
							value:
								'<span class="md-blockquote-icon md-blockquote-icon-right">' +
								rightQuote +
								"</span>",
						},
					]);
			}
			break;
		}

		case "reel": {
			const reelTitle = attrs.title || "";
			const reelAuthor = attrs.author || "";
			const reelDate = attrs.date || "";
			const reelFooter = attrs.footer || "";
			node.data = {
				hName: "div",
				hProperties: { class: "md-directive md-directive-reel" },
			};
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-reel-content"><div class="md-reel-title">' +
						reelTitle +
						"</div>",
				},
			]
				.concat(
					reelAuthor
						? [
								{
									type: "html",
									value:
										'<div class="md-reel-meta"><span>' +
										reelAuthor +
										"</span></div>",
								},
							]
						: [],
				)
				.concat([
					{
						type: "html",
						value: '<div class="md-reel-body"><div class="md-reel-main">',
					},
				])
				.concat(node.children)
				.concat([{ type: "html", value: "</div></div>" }])
				.concat(
					reelDate
						? [
								{
									type: "html",
									value: `<div class="md-reel-date">${reelDate}</div>`,
								},
							]
						: [],
				)
				.concat([
					{
						type: "html",
						value: `<div class="md-reel-footer">${reelFooter}</div></div>`,
					},
				]);
			break;
		}

		case "paper": {
			const paperStyle = attrs.style || "";
			const paperTitle = attrs.title || "";
			const paperAuthor = attrs.author || "";
			const paperDate = attrs.date || "";
			const paperFooter = attrs.footer || "";
			const paperClasses = ["md-paper-content"];
			if (paperStyle) {
				paperClasses.push(paperStyle);
			}
			const originalChildren = node.children;
			const sectionNodes = [];
			let currentType = "paragraph";
			let currentSectionTitle = "";
			let currentSectionContent = [];
			function flushSection() {
				if (currentSectionContent.length === 0) {
					return;
				}
				if (currentType === "paragraph") {
					sectionNodes.push(
						h("div", { class: "md-paper-paragraph" }, currentSectionContent),
					);
				} else if (currentType === "section") {
					sectionNodes.push(
						h("div", { class: "md-paper-section" }, [
							{
								type: "html",
								value:
									'<div class="md-paper-section-title">' +
									currentSectionTitle +
									"</div>",
							},
							h(
								"div",
								{ class: "md-paper-section-content" },
								currentSectionContent,
							),
						]),
					);
				} else if (currentType === "line") {
					const alignClass =
						currentSectionTitle === "right" ? " md-paper-line-right" : "";
					sectionNodes.push(
						h(
							"div",
							{ class: `md-paper-line${alignClass}` },
							currentSectionContent,
						),
					);
				}
				currentSectionContent = [];
			}
			for (let pi = 0; pi < originalChildren.length; pi++) {
				const pchild = originalChildren[pi];
				let pmatch = null;
				if (pchild.type === "html" && pchild.value) {
					pmatch = pchild.value.match(
						/<!--\s*(paragraph|section|line)(?:\s+(.*?))?\s*-->/,
					);
				}
				if (
					!pmatch &&
					pchild.type === "paragraph" &&
					pchild.children &&
					pchild.children.length > 0
				) {
					const pfirst = pchild.children[0];
					if (pfirst.type === "html" && pfirst.value) {
						pmatch = pfirst.value.match(
							/<!--\s*(paragraph|section|line)(?:\s+(.*?))?\s*-->/,
						);
						if (pmatch && pchild.children.length === 1) {
							continue;
						}
					}
				}
				if (pmatch) {
					flushSection();
					currentType = pmatch[1];
					currentSectionTitle = (pmatch[2] || "").trim();
					continue;
				}
				currentSectionContent.push(pchild);
			}
			flushSection();
			node.data = {
				hName: "div",
				hProperties: { class: "md-directive md-directive-paper" },
			};
			node.children = [
				{
					type: "html",
					value:
						'<div class="' +
						paperClasses.join(" ") +
						'"><div class="md-paper-title">' +
						paperTitle +
						"</div>",
				},
				h("div", { class: "md-paper-body" }, sectionNodes),
				{
					type: "html",
					value:
						'<div class="md-paper-footer">' +
						(paperAuthor || paperDate
							? '<div class="md-paper-author-date">' +
								(paperAuthor
									? `<span class="md-paper-author">${paperAuthor}</span>`
									: "") +
								(paperDate
									? `<span class="md-paper-date">${paperDate}</span>`
									: "") +
								"</div>"
							: "") +
						paperFooter +
						"</div></div>",
				},
			];
			break;
		}

		case "gallery": {
			const gCols = attrs.cols || "3";
			const gGap = attrs.gap || "8";
			const gImages = [];
			visit({ type: "root", children: node.children }, "image", (img) => {
				gImages.push({ src: img.url, alt: img.alt || "" });
			});
			node.data = { hName: "div", hProperties: {} };
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-directive md-directive-gallery" style="--gallery-cols:' +
						gCols +
						";--gallery-gap:" +
						gGap +
						'px">' +
						gImages
							.map(
								(img) =>
									'<div class="md-gallery-item"><img src="' +
									img.src +
									'" alt="' +
									escapeHtml(img.alt) +
									'" loading="lazy" /></div>',
							)
							.join("") +
						"</div>",
				},
			];
			break;
		}

		case "asciinema": {
			const aSrc = attrs.src || "";
			const aCols = attrs.cols || "80";
			const aRows = attrs.rows || "24";
			if (aSrc) {
				node.data = { hName: "div", hProperties: {} };
				node.children = [
					{
						type: "html",
						value:
							'<div class="md-directive md-directive-asciinema"><asciinema-player src="' +
							aSrc +
							'" cols="' +
							aCols +
							'" rows="' +
							aRows +
							'" preload="1"></asciinema-player></div>',
					},
				];
			}
			break;
		}

		case "colors": {
			const colorValues = (attrs.values || "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			if (colorValues.length > 0) {
				node.data = { hName: "div", hProperties: {} };
				node.children = [
					{
						type: "html",
						value:
							'<div class="md-directive md-directive-colors">' +
							colorValues
								.map(
									(c) =>
										'<div class="md-color-swatch" style="background:' +
										c +
										'"><span class="md-color-label">' +
										c +
										"</span></div>",
								)
								.join("") +
							"</div>",
					},
				];
			}
			break;
		}

		default:
			break;
	}
}

// ---------------------------------------------------------------------------
// Card directive processors
// ---------------------------------------------------------------------------
function processCardDirective(node, _options = {}) {
	switch (node.name) {
		case "link-card": {
			const lcHref = attrs.href || attrs.url || "";
			const lcTitle = attrs.title || "";
			const lcDesc = attrs.desc || attrs.description || "";
			const lcImage = attrs.image || attrs.cover || "";
			const lcIcon = attrs.icon || "";
			if (lcHref) {
				const lcImageHtml = lcImage
					? '<div class="md-link-card-image"><img src="' +
						lcImage +
						'" alt="" loading="lazy" /></div>'
					: "";
				const lcIconHtml = lcIcon
					? '<img class="md-link-card-icon" src="' +
						lcIcon +
						'" alt="" loading="lazy" />'
					: "";
				node.data = { hName: "div", hProperties: {} };
				node.children = [
					{
						type: "html",
						value:
							'<a class="md-directive md-directive-link-card" href="' +
							lcHref +
							'" target="_blank" rel="external nofollow noopener noreferrer">' +
							lcImageHtml +
							'<div class="md-link-card-body">' +
							lcIconHtml +
							'<div class="md-link-card-info"><div class="md-link-card-title">' +
							(lcTitle || lcHref) +
							"</div>" +
							(lcDesc ? `<div class="md-link-card-desc">${lcDesc}</div>` : "") +
							"</div></div></a>",
					},
				];
			}
			break;
		}

		case "card": {
			const cardTitle = attrs.title || "";
			const cardIcon = attrs.icon || "";
			const cardHref = attrs.href || "";
			const cardColor = resolveColor(attrs.color || "accent");
			const cardIconHtml = cardIcon
				? getIconSvg(cardIcon, 20) || `<span>${cardIcon}</span>`
				: "";
			const cardWrapperStart = cardHref
				? '<a class="md-directive md-directive-card" href="' +
					cardHref +
					'" target="_blank" rel="external nofollow noopener noreferrer" style="--card-color:' +
					cardColor +
					'">'
				: '<div class="md-directive md-directive-card" style="--card-color:' +
					cardColor +
					'">';
			const cardWrapperEnd = cardHref ? "</a>" : "</div>";
			node.data = { hName: "div", hProperties: {} };
			node.children = [
				{
					type: "html",
					value:
						cardWrapperStart +
						(cardIconHtml
							? `<div class="md-card-icon">${cardIconHtml}</div>`
							: "") +
						(cardTitle ? `<div class="md-card-title">${cardTitle}</div>` : "") +
						'<div class="md-card-body">',
				},
			]
				.concat(node.children)
				.concat([{ type: "html", value: `</div>${cardWrapperEnd}` }]);
			break;
		}

		case "panel": {
			const segments = [];
			let segLeft = "";
			let segRight = "";
			let segContent = [];
			for (let si = 0; si < node.children.length; si++) {
				const schild = node.children[si];
				let smatch = null;
				if (schild.type === "html" && schild.value) {
					smatch = schild.value.match(/<!--\s*label:\s*(.*?)\s*-->/);
				}
				if (
					!smatch &&
					schild.type === "paragraph" &&
					schild.children &&
					schild.children.length > 0
				) {
					const sfirst = schild.children[0];
					if (sfirst.type === "html" && sfirst.value) {
						smatch = sfirst.value.match(/<!--\s*label:\s*(.*?)\s*-->/);
						if (smatch && schild.children.length === 1) {
							continue;
						}
					}
				}
				if (smatch) {
					if (segContent.length > 0) {
						segments.push({
							left: segLeft,
							right: segRight,
							children: segContent,
						});
					}
					const sparts = smatch[1].split("|").map((s) => s.trim());
					segLeft = sparts[0] || "";
					segRight = sparts[1] || "";
					segContent = [];
					continue;
				}
				if (schild.type === "code") {
					const smeta = schild.meta || "";
					const stMatch = smeta.match(/title=["']([^"']+)["']/);
					const srMatch = smeta.match(/right=["']([^"']+)["']/);
					const sLeft = stMatch ? stMatch[1] : schild.lang || "";
					const sRight = srMatch ? srMatch[1] : "";
					if (segContent.length > 0) {
						segments.push({
							left: segLeft,
							right: segRight,
							children: segContent,
						});
						segContent = [];
						segLeft = "";
						segRight = "";
					}
					segments.push({ left: sLeft, right: sRight, children: [schild] });
					continue;
				}
				segContent.push(schild);
			}
			if (segContent.length > 0) {
				segments.push({ left: segLeft, right: segRight, children: segContent });
			}
			const panelUid = `panel-${Math.random().toString(36).slice(2, 7)}`;
			const panelCopyIcon = getIconSvg("lucide:copy", 14);
			const panelChildren = [];
			panelChildren.push({
				type: "html",
				value: '<div class="md-panel-body">',
			});
			for (let segI = 0; segI < segments.length; segI++) {
				const seg = segments[segI];
				const segUid = `${panelUid}-seg-${segI}`;
				let segCopyText = "";
				for (let sci = 0; sci < seg.children.length; sci++) {
					if (seg.children[sci].type === "code") {
						segCopyText = seg.children[sci].value;
					}
				}
				const safeSegCopy = segCopyText
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;");
				const segLeftLabel = seg.left
					? `<span class="md-segment-label-left">${seg.left}</span>`
					: "";
				const segRightHtml = seg.right
					? `<span class="md-segment-right">${seg.right}</span>`
					: "";
				const segCopyHtml = segCopyText
					? '<button class="md-copy-btn md-segment-copy" data-copy-target="' +
						segUid +
						'" aria-label="Copy">' +
						panelCopyIcon +
						"</button>"
					: "";
				const segMetaHtml =
					segRightHtml || segCopyHtml
						? '<div class="md-segment-meta">' +
							segRightHtml +
							segCopyHtml +
							"</div>"
						: "";
				const segHeaderHtml =
					segLeftLabel || segMetaHtml
						? '<div class="md-segment-header">' +
							segLeftLabel +
							segMetaHtml +
							"</div>"
						: "";
				panelChildren.push({
					type: "html",
					value: `<div class="md-panel-segment">${segHeaderHtml}`,
				});
				panelChildren.push.apply(panelChildren, seg.children);
				panelChildren.push({ type: "html", value: "</div>" });
				if (segCopyText) {
					panelChildren.push({
						type: "html",
						value:
							'<textarea id="' +
							segUid +
							'" class="md-copy-source" readonly style="position:absolute;left:-9999px;opacity:0;pointer-events:none;">' +
							safeSegCopy +
							"</textarea>",
					});
				}
				if (segI < segments.length - 1) {
					panelChildren.push({
						type: "html",
						value: '<div class="md-panel-divider"></div>',
					});
				}
			}
			panelChildren.push({ type: "html", value: "</div>" });
			node.data = {
				hName: "div",
				hProperties: { class: "md-directive md-directive-panel" },
			};
			node.children = panelChildren;
			break;
		}

		default:
			break;
	}
}

// ---------------------------------------------------------------------------
// Media directive processors
// ---------------------------------------------------------------------------
function processMediaDirective(node) {
	const name = node.name;
	const attrs = node.attributes || {};

	if (name === "video") {
		const src = attrs.src || "";
		const bilibili = attrs.bilibili || "";
		const youtube = attrs.youtube || "";
		const poster = attrs.poster || "";
		const ratio = attrs.ratio || "16/9";
		const width = attrs.width || "";
		const vAlign = attrs.align || "";
		const autoplay = attrs.autoplay === "true" || attrs.autoplay === "";
		const pip = attrs.pip || "auto";

		function ratioToPadding(r) {
			const parts = r.split("/").map(Number);
			if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
				return `${((parts[1] / parts[0]) * 100).toFixed(4)}%`;
			}
			return "56.25%";
		}
		const ratioPct = ratioToPadding(ratio);
		let containerStyle = `--video-ratio-pct:${ratioPct};`;
		if (width) {
			containerStyle += `--video-width:${width};`;
		}
		if (vAlign) {
			containerStyle += `--video-align:${vAlign};`;
		}

		const vUid = `video-${Math.random().toString(36).slice(2, 7)}`;
		const playIcon = getIconSvg("lucide:play", 36);

		if (src) {
			const pipBtnIcon = getIconSvg("lucide:picture-in-picture", 16);
			const pipBtnHtml =
				pip === "manual"
					? '<button type="button" class="md-video-pip-btn" data-video-pip="' +
						vUid +
						'" aria-label="Picture-in-picture">' +
						pipBtnIcon +
						"</button>"
					: "";
			let videoHtml;
			if (poster) {
				videoHtml =
					'<img class="md-video-poster-img" src="' +
					poster +
					'" alt="" loading="lazy" /><video class="md-video-element" id="' +
					vUid +
					'" src="' +
					src +
					'" preload="metadata" playsinline disablePictureInPicture ' +
					(autoplay ? "autoplay muted " : "") +
					'data-pip-video="' +
					vUid +
					'" data-pip-mode="' +
					pip +
					'"></video><div class="md-video-overlay" data-video-id="' +
					vUid +
					'"><button type="button" class="md-video-play-btn" data-video-play="' +
					vUid +
					'" aria-label="Play">' +
					playIcon +
					"</button></div>" +
					pipBtnHtml;
				node.data = {
					hName: "div",
					hProperties: {
						class: "md-directive md-directive-video md-video-has-poster",
						style: containerStyle,
					},
				};
			} else {
				videoHtml =
					'<video class="md-video-element" id="' +
					vUid +
					'" src="' +
					src +
					'" controls preload="metadata" playsinline disablePictureInPicture ' +
					(autoplay ? "autoplay muted " : "") +
					'data-pip-video="' +
					vUid +
					'" data-pip-mode="' +
					pip +
					'"></video>' +
					pipBtnHtml;
				node.data = {
					hName: "div",
					hProperties: {
						class: "md-directive md-directive-video",
						style: containerStyle,
					},
				};
			}
			node.children = [
				{
					type: "html",
					value: `<div class="md-video-wrap">${videoHtml}</div>`,
				},
			];
		} else if (bilibili) {
			const bvid = bilibili.startsWith("BV") ? bilibili : `BV${bilibili}`;
			node.data = {
				hName: "div",
				hProperties: {
					class: "md-directive md-directive-video md-video-iframe",
					style: containerStyle,
				},
			};
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-video-wrap"><iframe src="//player.bilibili.com/player.html?bvid=' +
						bvid +
						"&autoplay=" +
						(autoplay ? 1 : 0) +
						'&page=1&high_quality=1&as_wide=1" frameborder="0" allowfullscreen scrolling="no" allow="fullscreen" title="Bilibili Video"></iframe></div>',
				},
			];
		} else if (youtube) {
			let ytSrc = `https://www.youtube.com/embed/${youtube}?rel=0`;
			if (autoplay) {
				ytSrc += "&autoplay=1&mute=1";
			}
			node.data = {
				hName: "div",
				hProperties: {
					class: "md-directive md-directive-video md-video-iframe",
					style: containerStyle,
				},
			};
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-video-wrap"><iframe src="' +
						ytSrc +
						'" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="YouTube Video"></iframe></div>',
				},
			];
		} else {
			node.data = {
				hName: "div",
				hProperties: {
					class: "md-directive md-directive-video",
					style: containerStyle,
				},
			};
			node.children = [
				{
					type: "html",
					value:
						'<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a src, bilibili, or youtube attribute</p>',
				},
			];
		}
	}
}

// ---------------------------------------------------------------------------
// Leaf directive processors
// ---------------------------------------------------------------------------
function processLeafDirective(node) {
	const name = node.name;
	const attrs = node.attributes || {};

	switch (name) {
		case "image": {
			const iSrc = attrs.src || "";
			const iAlt = attrs.alt || "";
			node.data = {
				hName: "img",
				hProperties: { src: iSrc, alt: iAlt, loading: "lazy" },
			};
			if (attrs.width) {
				node.data.hProperties.width = attrs.width;
			}
			if (attrs.height) {
				node.data.hProperties.height = attrs.height;
			}
			break;
		}
		case "asciinema": {
			const alSrc = attrs.src || "";
			const alCols = attrs.cols || "80";
			const alRows = attrs.rows || "24";
			if (alSrc) {
				node.data = { hName: "div", hProperties: {} };
				node.children = [
					{
						type: "html",
						value:
							'<div class="md-directive md-directive-asciinema"><asciinema-player src="' +
							alSrc +
							'" cols="' +
							alCols +
							'" rows="' +
							alRows +
							'" preload="1"></asciinema-player></div>',
					},
				];
			}
			break;
		}
		case "colors": {
			const clValues = (attrs.values || "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			if (clValues.length > 0) {
				node.data = { hName: "div", hProperties: {} };
				node.children = [
					{
						type: "html",
						value:
							'<div class="md-directive md-directive-colors">' +
							clValues
								.map(
									(c) =>
										'<div class="md-color-swatch" style="background:' +
										c +
										'"><span class="md-color-label">' +
										c +
										"</span></div>",
								)
								.join("") +
							"</div>",
					},
				];
			}
			break;
		}
		default:
			break;
	}
}

// ---------------------------------------------------------------------------
// Main plugin entry
// ---------------------------------------------------------------------------
export default function remarkContentDirectives(options = {}) {
	const links = options.links;
	const screenshotService = options.screenshotService;
	return (tree) => {
		visit(tree, "leafDirective", (node) => {
			processLeafDirective(node);
		});

		visit(tree, "containerDirective", (node) => {
			const name = node.name;
			const blockNames = [
				"callout",
				"note",
				"info",
				"tip",
				"warning",
				"caution",
				"important",
				"question",
				"quote",
				"bug",
				"example",
				"success",
				"failure",
				"danger",
				"folding",
				"collapse",
				"folders",
				"timeline",
				"tabs",
				"poetry",
				"copy",
				"grid",
				"blockquote",
				"quot",
				"reel",
				"paper",
				"gallery",
				"asciinema",
				"colors",
			];
			const cardNames = ["panel", "link-card", "card"];
			const mediaNames = ["video"];

			if (blockNames.indexOf(name) !== -1) {
				processBlockDirective(node, {
					links: links,
					screenshotService: screenshotService,
				});
			} else if (cardNames.indexOf(name) !== -1) {
				processCardDirective(node, {
					links: links,
					screenshotService: screenshotService,
				});
			} else if (mediaNames.indexOf(name) !== -1) {
				processMediaDirective(node);
			}
		});
	};
}

export { remarkContentDirectives };
