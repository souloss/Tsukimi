/**
 * Remark content directives — combined Vergil + Tsukimi implementation.
 *
 * Handles all custom markdown directives (:::callout, :::tabs, :mark[], etc.)
 * using hardcoded Lucide SVG icons (no dynamic imports from @iconify-json).
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { visit } from "unist-util-visit";

// ---------------------------------------------------------------------------
// Hardcoded Lucide icon SVG data (body only, viewBox 0 0 24 24)
// ---------------------------------------------------------------------------
// Lazy-loaded vscode-icons data for code-tree (same as rehype-file-tree)
let _vscodeIconData = null;
function getVscodeIconData() {
	if (!_vscodeIconData) {
		try {
			const __ftDir = dirname(fileURLToPath(import.meta.url));
			_vscodeIconData = JSON.parse(
				readFileSync(join(__ftDir, "file-icons.json"), "utf-8"),
			);
		} catch {
			_vscodeIconData = null;
		}
	}
	return _vscodeIconData;
}

// ---------------------------------------------------------------------------
// Single-source directive name registry
// ---------------------------------------------------------------------------
// All directive names handled by this plugin. Shared with remark-directive-rehype.js
// so the two files never drift out of sync.
const CONTENT_DIRECTIVE_NAMES = new Set([
	// Text (inline) directives
	"mark",
	"kbd",
	"blur",
	"psw",
	"u",
	"wavy",
	"emp",
	"del",
	"hashtag",
	"button",
	"btn",
	"color",
	"sup",
	"sub",
	"checkbox",
	"radio",
	"step-brackets",
	"emoji",
	"badge",
	"anno",
	"abbr",
	// Leaf directives
	"asciinema",
	"colors",
	"image",
	// Container directives
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
	"details",
	"folders",
	"timeline",
	"tabs",
	"code-group",
	"steps",
	"poetry",
	"copy",
	"grid",
	"blockquote",
	"quot",
	"reel",
	"paper",
	"video",
	"audio",
	"gallery",
	"private",
	"ghcard",
	"sites",
	"card",
	"card-grid",
	"banner",
	"yoicard",
	"link",
	// Alignment aliases
	"left",
	"center",
	"right",
	"justify",
	// New container directives
	"npm-to",
	"chat",
	"field",
	"field-group",
	"code-tree",
	"flex",
	"bitmap",
]);

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
	box: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7l8.7 5 8.7-5"/><path d="M12 22V12"/></g>',
	moon: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
	component:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Zm13 0L22 12l-3.5 3.5L15 12l3.5-3.5ZM12 2l3.5 3.5L12 9 8.5 5.5 12 2Zm0 13 3.5 3.5L12 22l-3.5-3.5L12 15Z"/>',
	paintbrush:
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18.37 2.63-9 9a2.13 2.13 0 0 0-.51 2.17l1.43 4.29a1 1 0 0 0 1.9.07l2.38-5.75a2 2 0 0 1 1.07-1.07l5.75-2.38a1 1 0 0 0-.07-1.9l-4.29-1.43a2.13 2.13 0 0 0-2.17.51Z"/>',
	"file-code":
		'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></g>',
	"arrow-left":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 19-7-7 7-7m7 7H5"/>',
	"arrow-right":
		'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7 7 7-7 7"/>',
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
		'" viewBox="0 0 576 512" preserveAspectRatio="xMidYMid meet">' +
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
	// Semantic type aliases for badge/callout use
	tip: "#22c55e",
	info: "#3b82f6",
	note: "#3b82f6",
	warning: "#f97316",
	caution: "#ef4444",
	danger: "#ef4444",
	success: "#22c55e",
	important: "#a855f7",
	question: "#3b82f6",
	quote: "#06b6d4",
	bug: "#ef4444",
	example: "#6b7280",
	failure: "#ef4444",
};

/** Resolve color name to CSS value */
function resolveColor(c) {
	const value = NAMED_COLORS[c] || c || NAMED_COLORS.accent;
	return sanitizeCssValue(value, NAMED_COLORS.accent);
}

/** HTML escape */
function escapeHtml(text) {
	if (text == null) return "";
	return String(text)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** Keep user-provided values safe when they are placed in an inline style. */
function sanitizeCssValue(value, fallback = "") {
	const text = String(value ?? "").trim();
	if (!text || /[<>`'";{}\r\n]/.test(text)) return fallback;
	return text;
}

/** Convert an AST subtree to plain text for directive metadata. */
function getInlineText(nodes) {
	if (!Array.isArray(nodes)) return "";
	return nodes
		.map((node) => {
			if (!node) return "";
			if (node.type === "text" || node.type === "inlineCode")
				return node.value || "";
			if (node.type === "break") return "\n";
			return getInlineText(node.children);
		})
		.join("");
}

function sanitizeClassToken(value, fallback = "") {
	const token = String(value ?? "").trim();
	return /^[A-Za-z0-9_-]+$/.test(token) ? token : fallback;
}

function normalizeCssLength(value, fallback, unit = "px") {
	const text = sanitizeCssValue(value, "");
	if (!text) return fallback;
	if (/^-?(?:\d+|\d*\.\d+)$/.test(text)) return `${text}${unit}`;
	return /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vw|vh|ch)$/.test(text)
		? text
		: fallback;
}

function normalizeInteger(value, fallback, min = 1, max = 1000) {
	const parsed = Number.parseInt(String(value ?? ""), 10);
	return Number.isFinite(parsed) && parsed >= min && parsed <= max
		? parsed
		: fallback;
}

/** Extract a lossless text grid from a bitmap directive body. */
function getBitmapSource(children) {
	const code = (children || []).find((child) => child?.type === "code");
	if (code?.value) return code.value;

	return (children || [])
		.map((child) => {
			if (child?.type === "paragraph") return getInlineText(child.children);
			if (child?.type === "text") return child.value || "";
			return "";
		})
		.filter(Boolean)
		.join("\n");
}

/** Render a small ASCII pixel grid as an accessible, theme-friendly SVG. */
function renderBitmapDirective(node) {
	const attrs = node.attributes || {};
	const rawSource = getBitmapSource(node.children)
		.replace(/\r\n?/g, "\n")
		.replace(/\t/g, "    ");
	const rows = rawSource.split("\n");
	while (rows.length && !rows[0].trim()) rows.shift();
	while (rows.length && !rows.at(-1).trim()) rows.pop();
	if (rows.length === 0) return "";

	const maxSize = 256;
	const height = Math.min(rows.length, maxSize);
	const width = Math.min(
		Math.max(...rows.slice(0, height).map((row) => row.length)),
		maxSize,
	);
	if (!width || !height) return "";

	const palette = String(attrs.palette || "")
		.split(/[\s,]+/)
		.map((color) => color.trim())
		.filter(Boolean)
		.slice(0, 16)
		.map((color) => resolveColor(color));
	const fallbackColor = resolveColor(attrs.color || "var(--primary,#4a7c59)");
	const symbols = [
		...new Set(
			rows
				.slice(0, height)
				.join("")
				.slice(0, maxSize * maxSize)
				.split("")
				.filter((symbol) => symbol !== " " && symbol !== "."),
		),
	];
	const colorBySymbol = new Map(
		symbols.map((symbol, index) => [symbol, palette[index] || fallbackColor]),
	);
	const rects = [];
	for (let y = 0; y < height; y++) {
		const row = rows[y].slice(0, width).padEnd(width, " ");
		for (let x = 0; x < width; x++) {
			const symbol = row[x];
			if (symbol === " " || symbol === ".") continue;
			rects.push(
				`<rect x="${x}" y="${y}" width="1" height="1" fill="${escapeHtml(colorBySymbol.get(symbol) || fallbackColor)}"/>`,
			);
		}
	}

	const scale = normalizeInteger(attrs.scale, 8, 1, 32);
	const title = String(attrs.title || attrs.alt || "Bitmap image").trim();
	const background = attrs.background
		? `<rect width="${width}" height="${height}" fill="${escapeHtml(resolveColor(attrs.background))}"/>`
		: "";
	return `<div class="md-directive md-directive-bitmap"><svg class="md-bitmap-svg" role="img" aria-label="${escapeHtml(title)}" width="${width * scale}" height="${height * scale}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges"><title>${escapeHtml(title)}</title>${background}${rects.join("")}</svg></div>`;
}

function sanitizeUrl(value, fallback = "") {
	const text = String(value ?? "").trim();
	if (
		!text ||
		Array.from(text).some((char) => {
			const code = char.charCodeAt(0);
			return code <= 31 || code === 127;
		})
	) {
		return fallback;
	}
	if (/^(?:javascript|vbscript):/i.test(text)) return fallback;
	if (/^data:/i.test(text) && !/^data:(?:image|audio|video)\//i.test(text)) {
		return fallback;
	}
	return text;
}

function serializeHtmlProperties(properties) {
	return Object.entries(properties || {})
		.filter(([, value]) => value !== false && value != null && value !== "")
		.map(([key, value]) => {
			const name =
				key === "className" ? "class" : key === "htmlFor" ? "for" : key;
			return value === true
				? ` ${name}`
				: ` ${name}="${escapeHtml(Array.isArray(value) ? value.join(" ") : value)}"`;
		})
		.join("");
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
			if (node.type === "textDirective" && node.data?.hName) {
				const tag = sanitizeClassToken(node.data.hName, "span");
				const properties = serializeHtmlProperties(node.data.hProperties);
				return `<${tag}${properties}>${serializeToHtml(node.children || [])}</${tag}>`;
			}
			switch (node.type) {
				case "text":
					return escapeHtml(node.value || "");
				case "inlineCode":
					return `<code>${escapeHtml(node.value || "")}</code>`;
				case "strong":
					return `<strong>${serializeToHtml(node.children || [])}</strong>`;
				case "emphasis":
					return `<em>${serializeToHtml(node.children || [])}</em>`;
				case "delete":
					return `<del>${serializeToHtml(node.children || [])}</del>`;
				case "link":
					return (
						'<a href="' +
						escapeHtml(sanitizeUrl(node.url || "", "#")) +
						'">' +
						serializeToHtml(node.children || []) +
						"</a>"
					);
				case "image":
					return (
						'<img src="' +
						escapeHtml(sanitizeUrl(node.url || "")) +
						'" alt="' +
						escapeHtml(node.alt || "") +
						'" loading="lazy" />'
					);
				case "break":
					return "<br>";
				case "paragraph":
					return `<p>${serializeToHtml(node.children || [])}</p>`;
				case "heading":
					return (
						"<h" +
						(node.depth || 2) +
						">" +
						serializeToHtml(node.children || []) +
						"</h" +
						(node.depth || 2) +
						">"
					);
				case "code":
					return (
						'<pre><code class="language-' +
						escapeHtml(node.lang || "") +
						'">' +
						escapeHtml(node.value || "") +
						"</code></pre>"
					);
				case "blockquote":
					return `<blockquote>${serializeToHtml(node.children || [])}</blockquote>`;
				case "linkReference":
					return serializeToHtml(node.children || []);
				case "textDirective":
					return serializeToHtml(node.children || []);
				case "table": {
					const rows = node.children || [];
					const align = node.align || [];
					return `<table><thead>${serializeToHtml(
						rows[0]
							? {
									type: "tableRow",
									children: rows[0].children,
									_header: true,
									align,
								}
							: { type: "tableRow", children: [], _header: true, align },
					)}</thead><tbody>${serializeToHtml(
						rows.slice(1).map((row) => ({ ...row, align })),
					)}</tbody></table>`;
				}
				case "tableRow": {
					const cells = node.children || [];
					return `<tr>${cells
						.map((cell, index) => {
							const tag = node._header ? "th" : "td";
							const alignment = node.align?.[index];
							const alignAttr = alignment ? ` align="${alignment}"` : "";
							return `<${tag}${alignAttr}>${serializeToHtml(cell.children || [])}</${tag}>`;
						})
						.join("")}</tr>`;
				}
				case "tableCell":
					return serializeToHtml(node.children || []);
				case "list": {
					const tag = node.ordered ? "ol" : "ul";
					return (
						"<" +
						tag +
						">" +
						(node.children || [])
							.map((item) => `<li>${serializeToHtml(item.children || [])}</li>`)
							.join("") +
						"</" +
						tag +
						">"
					);
				}
				case "listItem":
					return serializeToHtml(node.children || []);
				case "thematicBreak":
					return "<hr>";
				case "html":
					return node.value || "";
				case "container":
					return serializeToHtml(node.children || []);
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

// Common emoji name → unicode codepoint mapping for twemoji source
const EMOJI_UNICODE_MAP = {
	heart: "2764",
	red_heart: "2764",
	orange_heart: "1f9e1",
	yellow_heart: "1f49b",
	green_heart: "1f49a",
	blue_heart: "1f499",
	purple_heart: "1f49c",
	rocket: "1f680",
	fire: "1f525",
	star: "2b50",
	star2: "1f31f",
	thumbsup: "1f44d",
	thumbsdown: "1f44e",
	"+1": "1f44d",
	"-1": "1f44e",
	check: "2705",
	x: "274c",
	warning: "26a0",
	info: "2139",
	joy: "1f602",
	smile: "1f604",
	grin: "1f601",
	laugh: "1f606",
	wink: "1f609",
	blush: "1f60a",
	heart_eyes: "1f60d",
	kissing_heart: "1f618",
	thinking: "1f914",
	neutral_face: "1f610",
	expressionless: "1f611",
	unamused: "1f612",
	sweat: "1f613",
	disappointed: "1f61e",
	angry: "1f621",
	cry: "1f622",
	sob: "1f62d",
	scream: "1f631",
	skull: "1f480",
	party: "1f389",
	tada: "1f389",
	clap: "1f44f",
	pray: "1f64f",
	muscle: "1f4aa",
	eyes: "1f440",
	100: "1f4af",
	sparkles: "2728",
	bug: "1f41b",
	construction: "1f6a7",
	memo: "1f4dd",
	pencil: "270f",
	link: "1f517",
	lock: "1f512",
	unlock: "1f513",
	key: "1f511",
	zap: "26a1",
	boom: "1f4a5",
	bomb: "1f4a3",
	crown: "1f451",
	gem: "1f48e",
	trophy: "1f3c6",
	medal: "1f3c5",
	ribbon: "1f380",
	gift: "1f381",
	balloon: "1f388",
	cake: "1f382",
	coffee: "2615",
	beer: "1f37a",
	pizza: "1f355",
	hamburger: "1f354",
	apple: "1f34e",
	cat: "1f431",
	dog: "1f436",
	mouse: "1f42d",
	rabbit: "1f430",
	unicorn: "1f984",
	dragon: "1f409",
	snake: "1f40d",
	whale: "1f40b",
	sun: "2600",
	moon: "1f319",
	rainbow: "1f308",
	cloud: "2601",
	umbrella: "2614",
	snowflake: "2744",
	bolt: "26a1",
	tornado: "1f32a",
	computer: "1f4bb",
	phone: "1f4f1",
	keyboard: "2328",
	mouse2: "1f5b1",
	globe: "1f30d",
	earth: "1f30d",
	airplane: "2708",
	car: "1f697",
	train: "1f685",
	bike: "1f6b2",
	boat: "26f5",
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

const CALLOUT_TYPES = new Set(Object.keys(CALLOUT_DEFAULT_TITLES));

function normalizeCalloutType(value) {
	const type = String(value || "info").toLowerCase();
	if (type === "warning") return "warn";
	return CALLOUT_TYPES.has(type) ? type : "info";
}

// ---------------------------------------------------------------------------
// Inline directive processors
// ---------------------------------------------------------------------------
// hashtagIndex is scoped inside the plugin function to avoid state leaking
// between multiple invocations of remarkContentDirectives.

function _processInlineDirective(node, parent, index, hashtagCounter) {
	// Skip directives inside headings — render as inline code
	// Walk up the parent chain to check for heading ancestors
	let _ancestor = parent;
	let _inHeading = false;
	while (_ancestor) {
		if (_ancestor.type === "heading") {
			_inHeading = true;
			break;
		}
		_ancestor = _ancestor._parent || null;
	}
	const _directHeading = parent && parent.type === "heading";
	if (_inHeading || _directHeading) {
		const text = node.children ? getInlineText(node.children) : "";
		// Render directive syntax as inline code in headings:
		// :name[text] → `:name[text]`, :name → `:name`
		const codeText = text ? `:${node.name}[${text}]` : `:${node.name}`;
		node.type = "inlineCode";
		node.value = codeText;
		delete node.children;
		delete node.data;
		delete node.attributes;
		delete node.name;
		delete node._skipProcessing;
		return;
	}
	const name = node.name;
	const attrs = node.attributes || {};
	const text = node.children ? getInlineText(node.children) : "";

	switch (name) {
		case "mark": {
			const bg = resolveColor(attrs.color || "yellow");
			const bgAlpha = `color-mix(in srgb,${bg} 30%,transparent)`;
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
					tabindex: "0",
					role: "button",
					"aria-expanded": "false",
				},
			};
			break;
		case "psw":
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-psw",
					tabindex: "0",
					role: "button",
					"aria-expanded": "false",
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
				color = resolveColor(HASHTAG_COLORS[hashtagCounter.value]);
				hashtagCounter.value =
					(hashtagCounter.value + 1) % HASHTAG_COLORS.length;
			}
			const hashIcon =
				'<svg class="md-hash-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M426.6 64.8c34.8 5.8 58.4 38.8 52.6 73.6l-19.6 117.6h190.2l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6s58.4 38.8 52.6 73.6l-19.4 117.6H896c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-42.6 256H832c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.6-117.4h-190.4l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.4-117.8H128c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l42.6-256H192c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6z m11.6 319.2l-42.6 256h190.2l42.6-256h-190.2z"/></svg>';
			node.data = {
				hName: "a",
				hProperties: {
					href: sanitizeUrl(attrs.href || "#", "#"),
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
			const num = escapeHtml(text);
			const stepTitle = escapeHtml(attrs.title || "");
			node.data = { hName: "span", hProperties: { class: "md-step-brackets" } };
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
			// Determine checked state: from attrs.checked, or from text content like "checked"/"unchecked"
			const checkedKeywords = [
				"checked",
				"true",
				"done",
				"yes",
				"x",
				"v",
				"✓",
				"✅",
			];
			const uncheckedKeywords = ["unchecked", "false", "todo", "no", " ", "☐"];
			let isChecked = attrs.checked === "true" || attrs.checked === "";
			let chkDisplayText = text;
			if (!isChecked && !attrs.checked) {
				const lowerText = text.toLowerCase().trim();
				if (checkedKeywords.includes(lowerText)) {
					isChecked = true;
					chkDisplayText = "";
				} else if (uncheckedKeywords.includes(lowerText)) {
					isChecked = false;
					chkDisplayText = "";
				}
			}
			const inline = attrs.inline !== "false";
			const chkClasses = ["md-tag-checkbox"];
			const safeSymbol = sanitizeClassToken(symbol);
			if (safeSymbol) {
				chkClasses.push(`md-checkbox-symbol-${safeSymbol}`);
			}
			if (inline) {
				chkClasses.push("md-checkbox-inline");
			}
			node.data = {
				hName: "span",
				hProperties: {
					class: chkClasses.join(" "),
					"data-checked": isChecked ? "true" : "false",
					style: `--checkbox-color:${chkColor}`,
				},
			};
			node.children = [
				{ type: "html", value: '<span class="md-checkbox-box"></span>' },
				...(chkDisplayText ? [{ type: "text", value: chkDisplayText }] : []),
			];
			break;
		}
		case "radio": {
			const radColor = resolveColor(attrs.color || "blue");
			// Determine selected state: from attrs.checked, or from text content
			const radSelectedKeywords = [
				"selected",
				"checked",
				"true",
				"yes",
				"✓",
				"✅",
			];
			const radUnselectedKeywords = [
				"unselected",
				"unchecked",
				"false",
				"no",
				"☐",
			];
			let isRadChecked = attrs.checked === "true" || attrs.checked === "";
			let radDisplayText = text;
			if (!isRadChecked && !attrs.checked) {
				const lowerText = text.toLowerCase().trim();
				if (radSelectedKeywords.includes(lowerText)) {
					isRadChecked = true;
					radDisplayText = "";
				} else if (radUnselectedKeywords.includes(lowerText)) {
					isRadChecked = false;
					radDisplayText = "";
				}
			}
			const radInline = attrs.inline !== "false";
			const radClasses = ["md-tag-checkbox", "md-tag-radio"];
			if (radInline) {
				radClasses.push("md-checkbox-inline");
			}
			node.data = {
				hName: "span",
				hProperties: {
					class: radClasses.join(" "),
					"data-checked": isRadChecked ? "true" : "false",
					style: `--checkbox-color:${radColor}`,
				},
			};
			node.children = [
				{ type: "html", value: '<span class="md-checkbox-box"></span>' },
				...(radDisplayText ? [{ type: "text", value: radDisplayText }] : []),
			];
			break;
		}
		case "emoji": {
			const height = attrs.height || "1.75em";
			let source = attrs.source;
			let emojiName = attrs.name;
			if (source === undefined) {
				emojiName = text;
				source = "twemoji";
			}
			if (!emojiName) {
				emojiName = text;
			}
			if (source && emojiName) {
				// For twemoji source, resolve emoji names to unicode codepoints
				let resolvedName = emojiName;
				if (
					(source === "twemoji" || source === "default") &&
					EMOJI_UNICODE_MAP[emojiName.toLowerCase()]
				) {
					resolvedName = EMOJI_UNICODE_MAP[emojiName.toLowerCase()];
				}
				const template = EMOJI_SOURCES[source] || source;
				const url = sanitizeUrl(template.replace("{name}", resolvedName));
				if (!url) break;
				const safeHeight = sanitizeCssValue(height, "1.75em");
				node.data = {
					hName: "span",
					hProperties: {
						class: "md-tag-emoji",
						style: `--emoji-height:${safeHeight}`,
					},
				};
				node.children = [
					{
						type: "html",
						value:
							'<img src="' +
							escapeHtml(url) +
							'" alt="' +
							escapeHtml(emojiName) +
							'" loading="lazy" style="height:' +
							safeHeight +
							'" />',
					},
				];
			}
			break;
		}
		case "abbr": {
			let abbrTitle = attrs.title || attrs.desc || "";
			// Check children for (title) pattern from plume compat: :abbr[HTML](Full Name)
			if (!abbrTitle && node.children && node.children.length > 1) {
				const lastChild = node.children[node.children.length - 1];
				if (lastChild.type === "text") {
					const parenMatch = lastChild.value.match(/^\(([^)]+)\)$/);
					if (parenMatch) {
						abbrTitle = parenMatch[1];
						node.children.pop();
					}
				}
			}
			if (!abbrTitle && node.children && node.children.length > 0) {
				const firstChild = node.children[0];
				if (firstChild.type === "text") {
					const parenMatch = firstChild.value.match(/^(.+?)\(([^)]+)\)$/);
					if (parenMatch) {
						firstChild.value = parenMatch[1];
						abbrTitle = parenMatch[2];
					}
				}
			}
			// Check NEXT SIBLING text node for (title) — remark-parse splits
			// :abbr[HTML](Full Name) into directive + text "(Full Name)"
			if (!abbrTitle && parent && Array.isArray(parent.children)) {
				const nextSibling = parent.children[index + 1];
				if (nextSibling && nextSibling.type === "text") {
					const sibMatch = nextSibling.value.match(/^\(([^)]+)\)/);
					if (sibMatch) {
						abbrTitle = sibMatch[1];
						nextSibling.value = nextSibling.value.slice(sibMatch[0].length);
					}
				}
			}
			node.data = {
				hName: "abbr",
				hProperties: abbrTitle
					? { title: abbrTitle, class: "md-tag-abbr" }
					: { class: "md-tag-abbr" },
			};
			// Keep node.children — they contain the abbreviation text (e.g., "HTML")
			break;
		}
		case "badge": {
			const badgeColor = resolveColor(attrs.color || attrs.type || "blue");
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-badge",
					style: `--badge-color:${badgeColor}`,
				},
			};
			break;
		}
		case "anno": {
			let annoContent = attrs.content || attrs.desc || "";
			// Check children for (explanation) pattern from plume compat
			if (!annoContent && node.children && node.children.length > 1) {
				const lastChild = node.children[node.children.length - 1];
				if (lastChild.type === "text") {
					const parenMatch = lastChild.value.match(/^\(([^)]+)\)$/);
					if (parenMatch) {
						annoContent = parenMatch[1];
						node.children.pop();
					}
				}
			}
			if (!annoContent && node.children && node.children.length > 0) {
				const firstChild = node.children[0];
				if (firstChild.type === "text") {
					const parenMatch = firstChild.value.match(/^(.+?)\(([^)]+)\)$/);
					if (parenMatch) {
						firstChild.value = parenMatch[1];
						annoContent = parenMatch[2];
					}
				}
			}
			// Check NEXT SIBLING text node for (content) — remark-parse splits
			// :anno[text](content) into directive + text "(content)"
			if (!annoContent && parent && Array.isArray(parent.children)) {
				const nextSibling = parent.children[index + 1];
				if (nextSibling && nextSibling.type === "text") {
					const sibMatch = nextSibling.value.match(/^\(([^)]+)\)/);
					if (sibMatch) {
						annoContent = sibMatch[1];
						nextSibling.value = nextSibling.value.slice(sibMatch[0].length);
					}
				}
			}
			node.data = {
				hName: "span",
				hProperties: {
					class: "md-tag-annotation",
					"data-annotation": annoContent,
					tabindex: "0",
				},
			};
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
function processBlockDirective(node) {
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
			const type = normalizeCalloutType(
				name === "callout" ? attrs.type : attrs.type || name,
			);

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
		case "collapse":
		case "details": {
			const foldTitle = escapeHtml(attrs.title || "Details");
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

		case "code-group": {
			const uid = `cg-${Math.random().toString(36).slice(2, 8)}`;
			const codeTabs = [];

			if (node.children) {
				node.children.forEach((child, i) => {
					if (child.type === "code") {
						const lang = child.lang || "";
						const meta = child.meta || "";
						// Extract label from [label] in meta
						const labelMatch = meta.match(/\[([^\]]+)\]/);
						const label = labelMatch ? labelMatch[1] : lang || `Tab ${i + 1}`;
						codeTabs.push({
							label,
							child,
							active: /(?:^|\s):active(?:\s|$)/.test(meta),
						});
					}
				});
			}

			if (codeTabs.length === 0) break;
			const requestedActiveIndex = codeTabs.findIndex((tab) => tab.active);
			const activeIndex = requestedActiveIndex >= 0 ? requestedActiveIndex : 0;
			const tabItems = codeTabs.map((tab, i) => {
				const active = i === activeIndex;
				return `<button type="button" id="${uid}-tab-${i}" class="md-tab-btn${active ? " md-tab-active" : ""}" data-tabs-id="${uid}" data-tab-index="${i}" role="tab" aria-selected="${active}" aria-controls="${uid}-pane-${i}" tabindex="${active ? "0" : "-1"}">${escapeHtml(tab.label)}</button>`;
			});
			// Keep code nodes in the AST so Expressive Code can highlight them.
			const paneChildren = codeTabs.map((tab, i) =>
				h(
					"div",
					{
						class: `md-tab-pane${i === activeIndex ? " md-tab-visible" : ""}`,
						id: `${uid}-pane-${i}`,
						role: "tabpanel",
						"aria-labelledby": `${uid}-tab-${i}`,
						"aria-hidden": i === activeIndex ? "false" : "true",
					},
					[tab.child],
				),
			);

			const codeGroupDiv = h(
				"div",
				{ class: "md-directive md-code-group", id: uid },
				[
					{
						type: "html",
						value: `<div class="md-tabs-nav" role="tablist">${tabItems.join("")}</div>`,
					},
					...paneChildren,
				],
			);

			node.data = { hName: "div", hProperties: {} };
			node.children = [codeGroupDiv];
			break;
		}

		case "folders": {
			const isAccordion = attrs.accordion === "true" || attrs.accordion === "";
			const folders = [];
			let currentFolder = null;
			let currentContent = [];
			for (let fi = 0; fi < node.children.length; fi++) {
				const fchild = node.children[fi];
				if (fchild.type === "paragraph") {
					const ftext = getInlineText(fchild.children).trim();
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
			if (folders.length === 0) {
				node.data = {
					hName: "div",
					hProperties: { class: "md-directive md-directive-folders" },
				};
				return;
			}
			const foldersClass = isAccordion
				? "md-directive md-directive-folders md-folders-accordion"
				: "md-directive md-directive-folders";
			node.data = {
				hName: "div",
				hProperties: { class: foldersClass },
			};
			node.children = folders.map((f, i) => {
				const summaryHtml =
					'<summary><span class="md-folder-title">' +
					escapeHtml(f.title) +
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
					const ttext = getInlineText(listItem.children).trim();
					const parts = ttext.split("|").map((s) => s.trim());
					if (parts.length >= 2) {
						items.push({
							date: parts[0],
							title: parts[1],
							desc: parts.slice(2).join(" | "),
						});
					} else {
						const firstSpace = ttext.indexOf(" ");
						if (firstSpace > 0) {
							items.push({
								date: ttext.slice(0, firstSpace).trim(),
								title: ttext.slice(firstSpace + 1).trim(),
								desc: "",
							});
						}
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
							escapeHtml(item.date) +
							"</time><h3>" +
							escapeHtml(item.title) +
							"</h3>" +
							(item.desc ? `<p>${escapeHtml(item.desc)}</p>` : "") +
							"</div></li>",
					)
					.join("") +
				"</ol>";
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: tlHtml }];
			break;
		}

		case "tabs": {
			const align = ["left", "center", "right"].includes(attrs.align)
				? attrs.align
				: "";
			const tabs = [];
			let currentTab = null;
			let currentTabColor = "";
			let currentTabContent = [];
			for (let ti = 0; ti < node.children.length; ti++) {
				const tchild = node.children[ti];
				if (
					tchild.type === "section" &&
					tchild.children?.[0]?.type === "heading"
				) {
					tabs.push({
						label: getInlineText(tchild.children[0].children).trim(),
						color: "",
						children: tchild.children.slice(1),
					});
					continue;
				}
				if (tchild.type === "heading") {
					if (currentTab !== null) {
						tabs.push({
							label: currentTab,
							color: currentTabColor,
							children: currentTabContent,
						});
					}
					currentTab = getInlineText(tchild.children).trim();
					currentTabColor = "";
					currentTabContent = [];
					continue;
				}
				if (tchild.type === "paragraph") {
					const ttext2 = getInlineText(tchild.children).trim();
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
										.replace(/^[\\"'“”]+|[\\"'“”]+$/gu, ""),
								)
							: "";
						currentTabContent = [];
						continue;
					}
					if (/^\[.+\]/.test(ttext2)) {
						if (currentTab !== null) {
							tabs.push({
								label: currentTab,
								color: currentTabColor,
								children: currentTabContent,
							});
						}
						const bracketMatch = ttext2.match(/^\[(.+?)\](.*)/);
						if (bracketMatch) {
							currentTab = bracketMatch[1].trim();
							currentTabColor = "";
							currentTabContent = [];
							const afterBracket = bracketMatch[2].trim();
							if (afterBracket) {
								currentTabContent.push({
									type: "paragraph",
									children: [{ type: "text", value: afterBracket }],
								});
							}
						}
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
			if (tabs.length === 0) {
				node.data = {
					hName: "div",
					hProperties: { class: "md-directive md-directive-tabs" },
				};
				return;
			}

			const uid = `tabs-${Math.random().toString(36).slice(2, 7)}`;
			const navHtml = tabs
				.map((t, i) => {
					const isActive = i === 0;
					const colorStyle = t.color
						? ` style="--tab-active-color:${t.color}"`
						: "";
					return (
						'<button type="button" id="' +
						uid +
						"-tab-" +
						i +
						'" role="tab" aria-selected="' +
						(isActive ? "true" : "false") +
						'" aria-controls="' +
						uid +
						"-pane-" +
						i +
						'" class="md-tab-btn ' +
						(isActive ? "md-tab-active" : "") +
						'"' +
						colorStyle +
						' data-tab-index="' +
						i +
						'" data-tabs-id="' +
						uid +
						'" tabindex="' +
						(isActive ? "0" : "-1") +
						'">' +
						escapeHtml(t.label) +
						"</button>"
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
						"aria-hidden": i === 0 ? "false" : "true",
					},
					t.children,
				);
			});
			const tabProps = { id: uid, class: "md-directive md-directive-tabs" };
			if (align) {
				tabProps.align = align;
			}
			const syncId = attrs.sync || "";
			if (syncId) {
				tabProps["data-tabs-sync"] = syncId;
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
			const pTitle = escapeHtml(attrs.title || "");
			const pAuthor = escapeHtml(attrs.author || "");
			const pDate = escapeHtml(attrs.date || "");
			const pFooter = escapeHtml(attrs.footer || "");
			const pMeta = [pAuthor, pDate].filter(Boolean).join(" · ");
			const bodyHtml = serializeToHtml(node.children);
			const poetryHtml =
				'<div class="md-directive md-directive-poetry"><div class="md-poetry-content">' +
				(pTitle ? `<div class="md-poetry-title">${pTitle}</div>` : "") +
				(pMeta ? `<div class="md-poetry-meta">${pMeta}</div>` : "") +
				`<div class="md-poetry-body">${bodyHtml}</div>` +
				(pFooter ? `<div class="md-poetry-footer">${pFooter}</div>` : "") +
				"</div></div>";
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: poetryHtml }];
			break;
		}

		case "copy": {
			const copyLabel = escapeHtml(attrs.label || attrs.title || "");
			let copyText = "";
			visit({ type: "root", children: node.children }, "code", (codeNode) => {
				copyText += codeNode.value || "";
			});
			if (!copyText) {
				visit({ type: "root", children: node.children }, "text", (t) => {
					copyText += t.value;
				});
			}
			copyText = copyText.trim();
			const copyUid = `copy-${Math.random().toString(36).slice(2, 7)}`;
			const safeText = escapeHtml(copyText);
			const copyIcon = getIconSvg("lucide:copy", 14);
			const copyHtml =
				'<div class="md-directive md-directive-copy" data-md-copy="1">' +
				(copyLabel ? `<span class="md-copy-label">${copyLabel}</span>` : "") +
				'<input id="' +
				copyUid +
				'" readonly value="' +
				safeText +
				'" class="md-copy-input"><button type="button" class="md-copy-btn" aria-label="Copy" title="Copy" data-copy-target="' +
				copyUid +
				'">' +
				copyIcon +
				"</button></div>";
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: copyHtml }];
			break;
		}

		case "grid": {
			const cols = attrs.cols ? normalizeInteger(attrs.cols, 2, 1, 12) : "";
			const gap = normalizeCssLength(attrs.gap || "16", "16px");
			const minw = normalizeCssLength(attrs.minw || "240px", "240px");
			const bg = ["card", "box", "none"].includes(attrs.bg) ? attrs.bg : "card";
			const cells = [];
			let currentCell = [];
			for (let gi = 0; gi < node.children.length; gi++) {
				const child = node.children[gi];
				// Split cells on thematicBreak (---)
				if (child.type === "thematicBreak") {
					if (currentCell.length) cells.push(currentCell);
					currentCell = [];
				}
				// Split cells on containerDirective/leafDirective boundaries (e.g. :::card)
				else if (
					child.type === "containerDirective" ||
					child.type === "leafDirective"
				) {
					if (currentCell.length) {
						cells.push(currentCell);
						currentCell = [];
					}
					cells.push([child]);
				} else {
					currentCell.push(child);
				}
			}
			if (currentCell.length) {
				cells.push(currentCell);
			}
			const gridClasses = ["md-directive-grid", `md-grid-bg-${bg}`];
			const gridStyle = `--grid-gap:${gap}`;
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

		case "steps": {
			const steps = [];
			// Collect step items from ordered list or paragraph format
			for (let si = 0; si < node.children.length; si++) {
				const schild = node.children[si];
				// Handle remark-parsed ordered list: list > listItem > paragraph
				if (schild.type === "list" && schild.ordered) {
					for (const li of schild.children) {
						if (li.type === "listItem" && li.children?.length) {
							// First child is the step title paragraph
							const titlePara = li.children[0];
							const titleText = getInlineText(titlePara?.children).trim();
							// Remaining children are the step body
							const bodyChildren = li.children.slice(1);
							steps.push({ title: titleText, children: bodyChildren });
						}
					}
					continue;
				}
				// Fallback: paragraph starting with "N. Title"
				if (schild.type === "paragraph") {
					const stext = getInlineText(schild.children).trim();
					if (/^\d+\.\s/.test(stext)) {
						const stepTitle = stext.replace(/^\d+\.\s*/, "").trim();
						steps.push({ title: stepTitle, children: [] });
						continue;
					}
				}
				// Content after a step title belongs to the last step
				if (steps.length > 0) {
					steps[steps.length - 1].children.push(schild);
				}
			}
			if (steps.length === 0) break;
			const stepsHtml = steps
				.map((s, i) => {
					const num = i + 1;
					const titleHtml = s.title
						? `<div class="md-step-title">${escapeHtml(s.title)}</div>`
						: "";
					const bodyHtml = serializeToHtml(s.children);
					return `<div class="md-step-item"><div class="md-step-number">${num}</div><div class="md-step-content">${titleHtml}<div class="md-step-body">${bodyHtml}</div></div></div>`;
				})
				.join("");
			node.data = { hName: "div", hProperties: {} };
			node.children = [
				{
					type: "html",
					value: `<div class="md-directive md-directive-steps">${stepsHtml}</div>`,
				},
			];
			break;
		}

		case "bitmap": {
			const bitmapHtml = renderBitmapDirective(node);
			if (!bitmapHtml) break;
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: bitmapHtml }];
			break;
		}

		case "field": {
			// The field name comes from the directive attribute key itself:
			//   :::field{port}  → attrs = { port: "" }  → name = "port"
			//   :::field{name="host"} → attrs = { name: "host" } → name = "host"
			// We pick the first non-@ attribute key as the field name,
			// using its value only if explicitly set (non-empty).
			let fieldName = "";
			const metaKeys = new Set([
				"@type",
				"@required",
				"@default",
				"@deprecated",
				"@optional",
				"@description",
			]);
			if ("name" in attrs && attrs.name !== "") {
				fieldName = attrs.name;
			} else if ("title" in attrs && attrs.title !== "") {
				fieldName = attrs.title;
			} else {
				for (const [key, val] of Object.entries(attrs)) {
					if (!key.startsWith("@") && !metaKeys.has(key)) {
						fieldName = val || key;
						break;
					}
				}
			}
			const fieldMeta = {
				name: fieldName,
				type: "",
				required: false,
				default: "",
				deprecated: false,
				optional: false,
				description: "",
			};
			for (const [key, val] of Object.entries(attrs)) {
				if (key.startsWith("@type")) fieldMeta.type = val || key.slice(5);
				else if (key === "@required") fieldMeta.required = true;
				else if (key.startsWith("@default")) fieldMeta.default = val;
				else if (key === "@deprecated") fieldMeta.deprecated = true;
				else if (key === "@optional") fieldMeta.optional = true;
				else if (key.startsWith("@description"))
					fieldMeta.description = val || key.slice(11);
			}
			if (!fieldMeta.type && node.children?.length) {
				let rawText = "";
				for (const child of node.children) {
					if (child.type === "paragraph" && child.children) {
						for (const gc of child.children) {
							if (gc.type === "text" || gc.type === "inlineCode")
								rawText += `${gc.value} `;
						}
						rawText += "\n";
					} else if (child.type === "text") {
						rawText += `${child.value}\n`;
					}
				}
				for (const rawLine of rawText.split("\n")) {
					const line = rawLine.trim();
					if (!line) continue;
					if (line.startsWith("@type ")) fieldMeta.type = line.slice(6).trim();
					else if (line === "@required") fieldMeta.required = true;
					else if (line.startsWith("@default "))
						fieldMeta.default = line.slice(9).trim();
					else if (line === "@deprecated") fieldMeta.deprecated = true;
					else if (line === "@optional") fieldMeta.optional = true;
					else if (line.startsWith("@description "))
						fieldMeta.description = line.slice(12).trim();
				}
			}
			const fieldHtml =
				'<div class="md-directive md-directive-field' +
				(fieldMeta.required ? " md-field-required" : "") +
				(fieldMeta.deprecated ? " md-field-deprecated" : "") +
				(fieldMeta.optional ? " md-field-optional" : "") +
				'">' +
				'<p class="md-field-header"><span class="md-field-name">' +
				escapeHtml(fieldMeta.name) +
				"</span>" +
				(fieldMeta.required
					? '<span class="md-field-badge md-field-badge-required">Required</span>'
					: "") +
				(fieldMeta.optional
					? '<span class="md-field-badge md-field-badge-optional">Optional</span>'
					: "") +
				(fieldMeta.deprecated
					? '<span class="md-field-badge md-field-badge-deprecated">Deprecated</span>'
					: "") +
				(fieldMeta.type
					? '<span class="md-field-type"><code>' +
						escapeHtml(fieldMeta.type) +
						"</code></span>"
					: "") +
				"</p>" +
				(fieldMeta.default
					? '<p class="md-field-default-row"><span class="md-field-default-label">default: </span><code class="md-field-default-value">' +
						escapeHtml(fieldMeta.default) +
						"</code></p>"
					: "") +
				(fieldMeta.description
					? '<div class="md-field-description">' +
						escapeHtml(fieldMeta.description) +
						"</div>"
					: "") +
				"</div>";
			// Render field HTML directly without a wrapper div,
			// so .md-directive-field becomes a direct child of .md-directive-field-group
			node.type = "html";
			node.value = fieldHtml;
			delete node.children;
			delete node.data;
			delete node.attributes;
			delete node.name;
			delete node._skipProcessing;
			break;
		}
		case "field-group": {
			node.data = {
				hName: "div",
				hProperties: { class: "md-directive md-directive-field-group" },
			};
			break;
		}

		case "code-tree": {
			// Directory import: if dir attribute is provided, scan the directory
			// and inject code blocks from files found within it
			const dirPath = attrs.dir || "";
			if (dirPath) {
				try {
					const projectRoot = process.cwd();
					const fullDirPath = join(projectRoot, dirPath);
					const dirFiles = [];
					function scanDir(dirPath, base) {
						const entries = readdirSync(dirPath, { withFileTypes: true });
						for (const entry of entries) {
							if (entry.name.startsWith(".") || entry.name === "node_modules")
								continue;
							const fp = join(dirPath, entry.name);
							const rp = base ? `${base}/${entry.name}` : entry.name;
							if (entry.isDirectory()) {
								scanDir(fp, rp);
							} else if (entry.isFile()) {
								dirFiles.push({ path: rp, fullPath: fp });
							}
						}
					}
					scanDir(fullDirPath, "");
					const langMap = {
						ts: "typescript",
						js: "javascript",
						tsx: "tsx",
						jsx: "jsx",
						mjs: "javascript",
						cjs: "javascript",
					};
					const codeNodes = dirFiles.map((f) => {
						const content = readFileSync(f.fullPath, "utf-8");
						const ext = f.path.split(".").pop() || "";
						const lang = langMap[ext] || ext;
						return {
							type: "code",
							lang: lang,
							meta: `title="${f.path}"`,
							value: content,
						};
					});
					node.children = [...codeNodes, ...node.children];
				} catch (err) {
					console.warn(
						'[code-tree] Failed to read directory "' +
							dirPath +
							'": ' +
							err.message,
					);
				}
			}
			// Use vscode-icons for file/folder icons (same as :::file-tree)
			const vsData = getVscodeIconData();
			const chevronSvg = LUCIDE_ICONS["chevron-down"];
			function ftSvgHtml(iconBody, extraClass, viewBox) {
				if (!iconBody)
					return '<svg class="vp-file-tree-blank" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"></svg>';
				const cls = extraClass ? ` class="${extraClass}"` : "";
				const vb = viewBox || "0 0 24 24";
				return (
					"<svg" +
					cls +
					' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="' +
					vb +
					'">' +
					iconBody +
					"</svg>"
				);
			}
			function ftResolveVscodeIcon(name, isFolder) {
				if (!vsData) return null;
				const map = isFolder ? vsData.folderMap : vsData.fileMap;
				const lookupName = name.toLowerCase();
				// Try full filename first, then extension
				if (map[lookupName]) return map[lookupName];
				const dotIdx = lookupName.lastIndexOf(".");
				if (dotIdx >= 0) {
					const ext = lookupName.slice(dotIdx + 1);
					if (map[ext]) return map[ext];
				}
				return null;
			}
			function ftGetFileIconHtml(name) {
				if (vsData) {
					const iconKey = ftResolveVscodeIcon(name, false);
					if (iconKey && vsData.icons[iconKey]) {
						const icon = vsData.icons[iconKey];
						return ftSvgHtml(icon.body, "vp-file-tree-icon", icon.viewBox);
					}
					// Fallback to default file icon
					if (vsData.icons[vsData.defaultFile]) {
						const icon = vsData.icons[vsData.defaultFile];
						return ftSvgHtml(icon.body, "vp-file-tree-icon", icon.viewBox);
					}
				}
				// Fallback to Lucide
				return ftSvgHtml(
					LUCIDE_ICONS["file-code"] || LUCIDE_ICONS.file,
					"vp-file-tree-icon",
				);
			}
			function ftGetFolderIconHtml(name, isOpen) {
				if (vsData) {
					const iconKey = ftResolveVscodeIcon(name, true);
					const defaultKey = isOpen
						? vsData.defaultFolderOpen
						: vsData.defaultFolder;
					const resolvedKey = iconKey || defaultKey;
					if (resolvedKey && vsData.icons[resolvedKey]) {
						const icon = vsData.icons[resolvedKey];
						return ftSvgHtml(icon.body, "vp-file-tree-icon", icon.viewBox);
					}
				}
				// Fallback to Lucide
				return ftSvgHtml(LUCIDE_ICONS.folder, "vp-file-tree-icon");
			}
			function ftGetChevronHtml() {
				if (vsData?.chevron) {
					return ftSvgHtml(
						vsData.chevron.body,
						"vp-file-tree-arrow-icon",
						vsData.chevron.viewBox,
					);
				}
				return ftSvgHtml(chevronSvg, "vp-file-tree-arrow-icon");
			}
			const treeTitle = attrs.title || "";
			const entry = attrs.entry || "";
			const treeHeight = attrs.height
				? normalizeCssLength(attrs.height, "480px")
				: "";
			const files = [];
			let activeIndex = 0;
			visit({ type: "root", children: node.children }, "code", (codeNode) => {
				const metaStr = codeNode.meta || "";
				const titleMatch = metaStr.match(/title=["']([^"']+)["']/);
				const fileTitle = titleMatch ? titleMatch[1] : "";
				const isActive = metaStr.includes(":active");
				if (isActive) activeIndex = files.length;
				files.push({
					name: fileTitle || `file-${files.length + 1}`,
					lang: codeNode.lang || "",
					codeNode,
					active: isActive,
				});
			});
			if (entry) {
				const entryIdx = files.findIndex((f) => f.name === entry);
				if (entryIdx >= 0) activeIndex = entryIdx;
			}
			if (files.length === 0) break;
			const uid = `ct-${Math.random().toString(36).slice(2, 7)}`;
			const treeRoot = {
				name: "",
				children: [],
				isFile: false,
				codeIndex: -1,
				path: "",
			};
			for (let fi = 0; fi < files.length; fi++) {
				const parts = files[fi].name.split("/");
				let current = treeRoot;
				for (let pi = 0; pi < parts.length; pi++) {
					const part = parts[pi];
					const isFile = pi === parts.length - 1;
					let child = current.children.find(
						(c) => c.name === part && c.isFile === isFile,
					);
					if (!child) {
						child = {
							name: part,
							children: [],
							isFile,
							codeIndex: isFile ? fi : -1,
							path: parts.slice(0, pi + 1).join("/"),
							expanded: false,
						};
						current.children.push(child);
					}
					current = child;
				}
			}
			function markExpanded(n) {
				if (n.isFile && n.codeIndex === activeIndex) return true;
				for (const ch of n.children) {
					if (markExpanded(ch)) {
						n.expanded = true;
						return true;
					}
				}
				return false;
			}
			markExpanded(treeRoot);
			function renderTree(n, level) {
				if (n.isFile) {
					const idx = n.codeIndex;
					const isActive = idx === activeIndex;
					const levelStyle = `--file-tree-level: -${level};`;
					// File icon from vscode-icons
					const infoClasses = ["vp-file-tree-info", "file"];
					if (isActive) infoClasses.push("md-code-tree-file-active");
					return (
						'<div class="vp-file-tree-node"><button type="button" id="' +
						uid +
						"-file-" +
						idx +
						'" role="tab" aria-controls="' +
						uid +
						"-panel-" +
						idx +
						'" aria-selected="' +
						(isActive ? "true" : "false") +
						'" tabindex="' +
						(isActive ? "0" : "-1") +
						'" class="' +
						infoClasses.join(" ") +
						'" style="' +
						levelStyle +
						'" data-ct-id="' +
						uid +
						'" data-ct-index="' +
						idx +
						'"><span class="vp-file-tree-diff-indicator"></span><span class="vp-file-tree-arrow-spacer"></span><span class="vp-file-tree-icon">' +
						ftGetFileIconHtml(n.name) +
						'</span><span class="vp-file-tree-name file">' +
						escapeHtml(n.name) +
						"</span></button></div>"
					);
				}
				const isExpanded = n.expanded;
				const hasChildren = n.children.length > 0;
				const levelStyle = `--file-tree-level: -${level};`;
				// Folder icons from vscode-icons
				const infoClasses = ["vp-file-tree-info", "folder"];
				if (isExpanded) infoClasses.push("expanded");
				const infoKids =
					'<span class="vp-file-tree-diff-indicator"></span>' +
					(hasChildren
						? '<span class="vp-file-tree-arrow">' +
							ftGetChevronHtml() +
							"</span>"
						: '<span class="vp-file-tree-arrow-spacer"></span>') +
					'<span class="vp-file-tree-icon">' +
					ftGetFolderIconHtml(n.name, false) +
					'</span><span class="vp-file-tree-name folder">' +
					escapeHtml(n.name) +
					"</span>";
				if (!hasChildren)
					return (
						'<div class="vp-file-tree-node"><span class="' +
						infoClasses.join(" ") +
						'" style="' +
						levelStyle +
						'">' +
						infoKids +
						"</span></div>"
					);
				const childHtml = n.children
					.map((c) => renderTree(c, level + 1))
					.join("");
				return (
					'<div class="vp-file-tree-node"><details' +
					(isExpanded ? " open" : "") +
					'><summary><span class="' +
					infoClasses.join(" ") +
					'" style="' +
					levelStyle +
					'">' +
					infoKids +
					'</span></summary><div class="vp-file-tree-group" style="--file-tree-level: -' +
					(level + 1) +
					';">' +
					childHtml +
					"</div></details></div>"
				);
			}
			const sidebarHtml = treeRoot.children
				.map((c) => renderTree(c, 0))
				.join("");
			const panelChildren = [];
			for (let pi = 0; pi < files.length; pi++) {
				const f = files[pi];
				const isActive = pi === activeIndex;
				panelChildren.push(
					h(
						"div",
						{
							class:
								"md-code-tree-panel" +
								(isActive ? " md-code-tree-panel-active" : ""),
							id: `${uid}-panel-${pi}`,
							role: "tabpanel",
							"aria-labelledby": `${uid}-file-${pi}`,
							"aria-hidden": isActive ? "false" : "true",
						},
						[f.codeNode],
					),
				);
			}
			const codeTreeDiv = h(
				"div",
				{
					class: "md-directive md-directive-code-tree",
					id: uid,
					style: treeHeight ? `--code-tree-height:${treeHeight}` : "",
				},
				[
					{
						type: "html",
						value:
							(treeTitle
								? `<div class="md-code-tree-title">${escapeHtml(treeTitle)}</div>`
								: "") +
							'<div class="md-code-tree-body"><div class="md-code-tree-sidebar vp-file-tree" role="tablist" aria-label="Files">' +
							sidebarHtml +
							"</div>" +
							'<div class="md-code-tree-panels">',
					},
					...panelChildren,
					{ type: "html", value: "</div></div></div>" },
				],
			);
			node.data = { hName: "div", hProperties: {} };
			node.children = [codeTreeDiv];
			break;
		}

		case "flex": {
			const gap = normalizeCssLength(attrs.gap || "1rem", "1rem");
			const column = attrs.column === "true" || attrs.column === "" || false;
			const justifyValue = attrs.justify || attrs.main || "";
			const alignValue = attrs.align || attrs.cross || "";
			const justify = [
				"start",
				"center",
				"end",
				"between",
				"around",
				"evenly",
			].includes(justifyValue)
				? justifyValue
				: "";
			const align = ["start", "center", "end", "stretch", "baseline"].includes(
				alignValue,
			)
				? alignValue
				: "";
			const style = `--flex-gap:${gap};`;
			const cssClasses = ["md-directive", "md-directive-flex"];
			if (column) cssClasses.push("md-flex-column");
			if (justify) cssClasses.push(`md-flex-justify-${justify}`);
			if (align) cssClasses.push(`md-flex-align-${align}`);
			node.data = {
				hName: "div",
				hProperties: { class: cssClasses.join(" "), style },
			};
			break;
		}

		case "chat": {
			const chatTitle = attrs.title || "";
			const messages = [];
			let currentUser = null;
			const chatLines = [];

			for (const child of node.children) {
				if (child.type === "paragraph") {
					// Check if this paragraph contains textDirective nodes (from {:date} syntax)
					const hasDirective = child.children?.some(
						(c) => c.type === "textDirective",
					);
					if (hasDirective) {
						// Reconstruct the {:...} text from text + textDirective children
						const text = child.children
							.map((c) =>
								c.type === "textDirective"
									? `:${c.name}${getInlineText(c.children)}`
									: getInlineText([c]),
							)
							.join("");
						// The reconstructed text will be like "{:2025-06-17 14:30}"
						chatLines.push(text);
					} else {
						const text = getInlineText(child.children);
						chatLines.push(text);
					}
				}
			}

			for (const line of chatLines) {
				const trimmed = line.trim();
				if (!trimmed) continue;

				// Date separator: {:date} or {:2025-03-24 10:15:00}
				const chatDateMatch = trimmed.match(/^\{:(.+?)\}\s*$/);
				if (chatDateMatch) {
					const dateText = chatDateMatch[1].trim();
					messages.push({
						type: "date",
						text: dateText === "date" ? "" : dateText,
					});
					continue;
				}

				// Brace sender: {.} or {username}
				const chatBraceMatch = trimmed.match(/^\{(.+?)\}\s*(.*)/);
				if (chatBraceMatch) {
					const senderName = chatBraceMatch[1];
					currentUser = senderName === "." ? "self" : senderName;
					const chatAfterBrace = chatBraceMatch[2].trim();
					if (chatAfterBrace && currentUser) {
						messages.push({
							type: "msg",
							sender: currentUser,
							text: chatAfterBrace,
						});
					}
					continue;
				}

				// Bracket sender: [self] or [username] (existing syntax)
				const chatBracketMatch = trimmed.match(/^\[(.+?)\]\s*(.*)/);
				if (chatBracketMatch) {
					const senderName = chatBracketMatch[1];
					currentUser =
						senderName === "自己" || senderName === "self"
							? "self"
							: senderName;
					const chatAfterBracket = chatBracketMatch[2].trim();
					if (chatAfterBracket && currentUser) {
						messages.push({
							type: "msg",
							sender: currentUser,
							text: chatAfterBracket,
						});
					}
					continue;
				}
				if (currentUser) {
					messages.push({ type: "msg", sender: currentUser, text: trimmed });
				}
			}
			const chatHtml =
				'<div class="md-directive md-directive-chat">' +
				(chatTitle
					? '<div class="md-chat-header"><span class="md-chat-title">' +
						escapeHtml(chatTitle) +
						"</span></div>"
					: "") +
				messages
					.map((m) => {
						if (m.type === "date") {
							return (
								'<div class="md-chat-date-separator">' +
								(m.text ? `<span>${escapeHtml(m.text)}</span>` : "") +
								"</div>"
							);
						}
						const isSelf = m.sender === "self" || m.sender === "自己";
						return (
							'<div class="md-chat-msg' +
							(isSelf ? " md-chat-msg-self" : " md-chat-msg-other") +
							'">' +
							(!isSelf
								? '<div class="md-chat-sender">' +
									escapeHtml(m.sender) +
									"</div>"
								: "") +
							'<div class="md-chat-bubble">' +
							escapeHtml(m.text) +
							"</div></div>"
						);
					})
					.join("") +
				"</div>";
			// Convert containerDirective to html node to preserve raw HTML
			// (remark-rehype strips raw html inside containerDirective nodes)
			delete node.name;
			delete node.attributes;
			delete node.children;
			node.type = "html";
			node.value = chatHtml;
			break;
		}

		case "npm-to": {
			const requestedTabs = (attrs.tabs || "npm,pnpm,yarn,bun")
				.split(",")
				.map((s) => s.trim().toLowerCase())
				.filter((pm) => ["npm", "pnpm", "yarn", "bun"].includes(pm));
			const tabList = requestedTabs.length
				? [...new Set(requestedTabs)]
				: ["npm", "pnpm", "yarn", "bun"];
			let npmCode = "";
			let codeLang = "bash";
			visit({ type: "root", children: node.children }, "code", (codeNode) => {
				npmCode = codeNode.value || "";
				if (codeNode.lang) codeLang = codeNode.lang;
			});
			if (!npmCode) {
				npmCode = getInlineText(node.children);
			}
			if (!npmCode && attrs.package) {
				npmCode = `npm install ${attrs.package}`;
				codeLang = "bash";
			}
			const converted = tabList.map((pm) => ({
				pm,
				code: convertNpmCommands(npmCode, pm),
			}));
			const uid = `npm-${Math.random().toString(36).slice(2, 7)}`;
			const navHtml = converted
				.map(
					(c, i) =>
						'<button type="button" id="' +
						uid +
						"-tab-" +
						i +
						'" class="md-tab-btn' +
						(i === 0 ? " md-tab-active" : "") +
						'" data-tabs-id="' +
						uid +
						'" data-tab-index="' +
						i +
						'" role="tab" aria-selected="' +
						(i === 0 ? "true" : "false") +
						'" aria-controls="' +
						uid +
						"-pane-" +
						i +
						'" tabindex="' +
						(i === 0 ? "0" : "-1") +
						'">' +
						escapeHtml(c.pm) +
						"</button>",
				)
				.join("");
			// Create code AST nodes so expressive-code can process them
			// (adds syntax highlighting, language badge, copy button)
			const paneChildren = converted.map((c, i) => {
				const isActive = i === 0;
				const codeNode = {
					type: "code",
					lang: codeLang,
					meta: "",
					value: c.code,
				};
				return h(
					"div",
					{
						class: `md-tab-pane${isActive ? " md-tab-visible" : ""}`,
						id: `${uid}-pane-${i}`,
						role: "tabpanel",
						"aria-labelledby": `${uid}-tab-${i}`,
						"aria-hidden": isActive ? "false" : "true",
					},
					[codeNode],
				);
			});
			const npmToDiv = h(
				"div",
				{
					class: "md-directive md-directive-tabs md-directive-npm-to",
					id: uid,
				},
				[
					{
						type: "html",
						value: `<div class="md-tabs-nav" role="tablist">${navHtml}</div>`,
					},
					...paneChildren,
				],
			);
			node.data = { hName: "div", hProperties: {} };
			node.children = [npmToDiv];
			break;
		}

		case "left":
		case "center":
		case "right":
		case "justify": {
			const alignClass = `md-directive-align-${node.name}`;
			node.data = {
				hName: "div",
				hProperties: { class: `md-directive ${alignClass}` },
			};
			break;
		}

		case "blockquote":
		case "quot": {
			const leftQuote = getIconSvg("bxs:quote-left", 28);
			const rightQuote = getIconSvg("bxs:quote-right", 28);
			const qIcon = attrs.icon || "";
			if (qIcon || name === "quot") {
				const qText = getInlineText(node.children).trim();
				let qIconHtml = "";
				if (qIcon) {
					if (/^https?:\/\//i.test(qIcon)) {
						const qIconUrl = sanitizeUrl(qIcon);
						qIconHtml =
							'<img class="md-quot-icon" src="' +
							escapeHtml(qIconUrl) +
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
								: `<span class="md-quot-icon">${escapeHtml(qIcon)}</span>`;
						}
					}
				} else {
					qIconHtml = `<span class="md-quot-icon-default">${leftQuote}</span>`;
				}
				const quotHtml =
					'<div class="md-directive md-directive-quot">' +
					qIconHtml +
					'<p class="md-quot-text">' +
					escapeHtml(qText) +
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
			const reelTitle = escapeHtml(attrs.title || "");
			const reelAuthor = escapeHtml(attrs.author || "");
			const reelDate = escapeHtml(attrs.date || "");
			const reelFooter = escapeHtml(attrs.footer || "");
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
			const paperStyle = sanitizeClassToken(attrs.style || "");
			const paperTitle = escapeHtml(attrs.title || "");
			const paperAuthor = escapeHtml(attrs.author || "");
			const paperDate = escapeHtml(attrs.date || "");
			const paperFooter = escapeHtml(attrs.footer || "");
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
									escapeHtml(currentSectionTitle) +
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
			const gCols = normalizeInteger(attrs.cols, 3, 1, 8);
			const gGap = normalizeCssLength(attrs.gap || "8", "8px");
			const gImages = [];
			visit({ type: "root", children: node.children }, "image", (img) => {
				const src = sanitizeUrl(img.url);
				if (src) gImages.push({ src, alt: img.alt || "" });
			});
			if (gImages.length === 0) {
				node.data = {
					hName: "div",
					hProperties: { class: "md-directive md-directive-gallery" },
				};
				return;
			}
			node.data = { hName: "div", hProperties: {} };
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-directive md-directive-gallery" style="--gallery-cols:' +
						gCols +
						";--gallery-gap:" +
						gGap +
						'">' +
						gImages
							.map(
								(img) =>
									'<button type="button" class="md-gallery-cell" data-fancybox="markdown-gallery" data-src="' +
									escapeHtml(img.src) +
									'" aria-label="View image"><img class="md-gallery-image" src="' +
									escapeHtml(img.src) +
									'" alt="' +
									escapeHtml(img.alt) +
									'" loading="lazy" /></button>',
							)
							.join("") +
						"</div>",
				},
			];
			break;
		}

		case "asciinema": {
			const aSrc = sanitizeUrl(attrs.src || "");
			const aCols = normalizeInteger(attrs.cols, 80, 1, 500);
			const aRows = normalizeInteger(attrs.rows, 24, 1, 200);
			if (aSrc) {
				const aUid = `asciinema-${Math.random().toString(36).slice(2, 7)}`;
				node.children = [
					{
						type: "html",
						value:
							'<div class="md-directive md-directive-asciinema"><div id="' +
							aUid +
							'" class="md-asciinema-container" data-src="' +
							escapeHtml(aSrc) +
							'" data-cols="' +
							aCols +
							'" data-rows="' +
							aRows +
							'" data-preload="1"></div></div>',
					},
				];
			}
			break;
		}

		case "colors": {
			const colorValues = (attrs.values || "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
				.map((label) => ({ label, color: resolveColor(label) }));
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
										c.color +
										'"><span class="md-color-label">' +
										escapeHtml(c.label) +
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
function processCardDirective(node) {
	const attrs = node.attributes || {};
	switch (node.name) {
		case "card": {
			const cardTitle = attrs.title || "";
			const cardIcon = attrs.icon || "";
			const cardHref = sanitizeUrl(attrs.href || "");
			const cardColor = resolveColor(attrs.color || "accent");
			const cardImage = sanitizeUrl(attrs.image || attrs.cover || "");
			const cardDesc = attrs.desc || attrs.description || "";
			const cardIconHtml = cardIcon
				? getIconSvg(cardIcon, 20) || `<span>${escapeHtml(cardIcon)}</span>`
				: "";
			// Link-card style when image is provided
			if (cardImage && cardHref) {
				const linkCardHtml =
					'<a class="md-directive md-directive-card md-card-has-image" href="' +
					escapeHtml(cardHref) +
					'" target="_blank" rel="external nofollow noopener noreferrer" style="--card-color:' +
					cardColor +
					'">' +
					'<div class="md-card-cover"><img src="' +
					escapeHtml(cardImage) +
					'" alt="" loading="lazy" /></div>' +
					'<div class="md-card-content">' +
					(cardTitle
						? `<div class="md-card-title">${escapeHtml(cardTitle)}</div>`
						: "") +
					(cardDesc
						? `<div class="md-card-desc">${escapeHtml(cardDesc)}</div>`
						: "") +
					"</div></a>";
				node.data = { hName: "div", hProperties: {} };
				node.children = [{ type: "html", value: linkCardHtml }];
				break;
			}
			const cardHeaderHtml =
				cardIconHtml || cardTitle
					? '<div class="md-card-header">' +
						(cardIconHtml
							? `<div class="md-card-icon">${cardIconHtml}</div>`
							: "") +
						(cardTitle
							? `<div class="md-card-title">${escapeHtml(cardTitle)}</div>`
							: "") +
						"</div>"
					: "";
			// Standard card layout — serialize all content into a single HTML block
			// to avoid display:contents breaking the card border/padding
			const cardTag = cardHref ? "a" : "div";
			const cardHrefAttr = cardHref
				? ' href="' +
					escapeHtml(cardHref) +
					'" target="_blank" rel="external nofollow noopener noreferrer"'
				: "";
			const cardBodyHtml = serializeToHtml(node.children);
			const cardHtml =
				"<" +
				cardTag +
				' class="md-directive md-directive-card" style="--card-color:' +
				cardColor +
				'"' +
				cardHrefAttr +
				">" +
				cardHeaderHtml +
				'<div class="md-card-body">' +
				cardBodyHtml +
				"</div>" +
				"</" +
				cardTag +
				">";
			node.data = { hName: "div", hProperties: {} };
			node.children = [{ type: "html", value: cardHtml }];
			break;
		}

		case "card-grid": {
			node.data = {
				hName: "div",
				hProperties: { class: "md-directive md-directive-card-grid" },
			};
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
		const src = sanitizeUrl(attrs.src || "");
		const bilibili = String(attrs.bilibili || "").replace(/[^A-Za-z0-9]/g, "");
		const youtube = String(attrs.youtube || "").replace(/[^A-Za-z0-9_-]/g, "");
		const poster = sanitizeUrl(attrs.poster || "");
		const ratio = attrs.ratio || "16/9";
		const width = attrs.width ? normalizeCssLength(attrs.width, "100%") : "";
		const vAlign = ["left", "center", "right"].includes(attrs.align)
			? attrs.align
			: "";
		const autoplay = attrs.autoplay === "true" || attrs.autoplay === "";
		const pip = attrs.pip === "manual" ? "manual" : "auto";

		function ratioToPadding(r) {
			const parts = r.split("/").map(Number);
			if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
				return `${((parts[1] / parts[0]) * 100).toFixed(4)}%`;
			}
			return "56.25%";
		}
		const ratioPct = ratioToPadding(ratio);
		let containerStyle = `--video-ratio-pct:${ratioPct};`;
		const alignClass = vAlign ? ` md-video-align-${vAlign}` : "";
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
					escapeHtml(poster) +
					'" alt="" loading="lazy" /><video class="md-video-element" id="' +
					vUid +
					'" src="' +
					escapeHtml(src) +
					'" preload="metadata" playsinline' +
					(autoplay ? " autoplay muted" : "") +
					' data-pip-video="' +
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
						class: `md-directive md-directive-video md-video-has-poster${alignClass}`,
						style: containerStyle,
					},
				};
			} else {
				videoHtml =
					'<video class="md-video-element" id="' +
					vUid +
					'" src="' +
					escapeHtml(src) +
					'" controls preload="metadata" playsinline' +
					(autoplay ? " autoplay muted" : "") +
					' data-pip-video="' +
					vUid +
					'" data-pip-mode="' +
					pip +
					'"></video>' +
					pipBtnHtml;
				node.data = {
					hName: "div",
					hProperties: {
						class: `md-directive md-directive-video${alignClass}`,
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
					class: `md-directive md-directive-video md-video-iframe${alignClass}`,
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
						'&page=1&high_quality=1&as_wide=1" scrolling="no" allow="fullscreen" title="Bilibili Video"></iframe></div>',
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
					class: `md-directive md-directive-video md-video-iframe${alignClass}`,
					style: containerStyle,
				},
			};
			node.children = [
				{
					type: "html",
					value:
						'<div class="md-video-wrap"><iframe src="' +
						ytSrc +
						'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="YouTube Video"></iframe></div>',
				},
			];
		} else {
			node.data = {
				hName: "div",
				hProperties: {
					class: `md-directive md-directive-video${alignClass}`,
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
			const iSrc = sanitizeUrl(attrs.src || "");
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
			const alSrc = sanitizeUrl(attrs.src || "");
			const alCols = normalizeInteger(attrs.cols, 80, 1, 500);
			const alRows = normalizeInteger(attrs.rows, 24, 1, 200);
			if (alSrc) {
				const alUid = `asciinema-${Math.random().toString(36).slice(2, 7)}`;
				node.children = [
					{
						type: "html",
						value:
							'<div class="md-directive md-directive-asciinema"><div id="' +
							alUid +
							'" class="md-asciinema-container" data-src="' +
							escapeHtml(alSrc) +
							'" data-cols="' +
							alCols +
							'" data-rows="' +
							alRows +
							'" data-preload="1"></div></div>',
					},
				];
			}
			break;
		}
		case "colors": {
			const clValues = (attrs.values || "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
				.map((label) => ({ label, color: resolveColor(label) }));
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
										c.color +
										'"><span class="md-color-label">' +
										escapeHtml(c.label) +
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
// NPM command converter (for :::npm-to directive)
// ---------------------------------------------------------------------------
function convertNpmCommands(code, pm) {
	if (pm === "npm") return code;
	return code
		.replace(/npm install -D\s/g, () =>
			pm === "yarn"
				? "yarn add -D "
				: pm === "bun"
					? "bun add -D "
					: "pnpm add -D ",
		)
		.replace(/npm install --save-dev\s/g, () =>
			pm === "yarn"
				? "yarn add -D "
				: pm === "bun"
					? "bun add -D "
					: "pnpm add -D ",
		)
		.replace(/npm install -g\s/g, () =>
			pm === "yarn"
				? "yarn global add "
				: pm === "bun"
					? "bun add -g "
					: "pnpm add -g ",
		)
		.replace(/npm install\s/g, () =>
			pm === "yarn" ? "yarn add " : pm === "bun" ? "bun add " : "pnpm add ",
		)
		.replace(/npm run\s/g, () =>
			pm === "yarn" ? "yarn run " : pm === "bun" ? "bun run " : "pnpm run ",
		)
		.replace(/npm init\s/g, () =>
			pm === "yarn" ? "yarn init " : pm === "bun" ? "bun init " : "pnpm init ",
		)
		.replace(/npm create\s/g, () =>
			pm === "yarn"
				? "yarn create "
				: pm === "bun"
					? "bun create "
					: "pnpm create ",
		)
		.replace(/npx\s/g, () =>
			pm === "yarn" ? "yarn dlx " : pm === "bun" ? "bunx " : "pnpm dlx ",
		)
		.replace(/npm uninstall\s/g, () =>
			pm === "yarn"
				? "yarn remove "
				: pm === "bun"
					? "bun remove "
					: "pnpm remove ",
		)
		.replace(/npm ci\b/g, () =>
			pm === "yarn"
				? "yarn install --immutable"
				: pm === "bun"
					? "bun install --frozen-lockfile"
					: "pnpm install --frozen-lockfile",
		);
}

export default function remarkContentDirectives(_options = {}) {
	return (tree) => {
		// Scoped counter for hashtag color cycling — avoids state leaking
		// between multiple invocations of this plugin.
		const hashtagCounter = { value: 0 };

		// Add parent references to all nodes for ancestor walking
		visit(tree, (node, _i, parent) => {
			if (parent) node._parent = parent;
		});

		visit(tree, "textDirective", (node, _index, parent) => {
			_processInlineDirective(node, parent, _index, hashtagCounter);
		});

		// Clean up parent references after processing
		visit(tree, (node) => {
			delete node._parent;
		});

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
				"details",
				"code-group",
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
				"left",
				"center",
				"right",
				"justify",
				"npm-to",
				"chat",
				"field",
				"field-group",
				"code-tree",
				"flex",
				"bitmap",
				"steps",
			];
			const cardNames = ["card", "card-grid"];
			const mediaNames = ["video"];

			if (blockNames.indexOf(name) !== -1) {
				processBlockDirective(node);
			} else if (cardNames.indexOf(name) !== -1) {
				processCardDirective(node);
			} else if (mediaNames.indexOf(name) !== -1) {
				processMediaDirective(node);
			}
		});
	};
}

export { CONTENT_DIRECTIVE_NAMES, remarkContentDirectives };
