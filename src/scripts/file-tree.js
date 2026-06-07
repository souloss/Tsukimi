/**
 * file-tree.js — Client-side JS for file-tree folder icon toggling
 *
 * Identifies folders by their name in the DOM, resolves the open icon
 * from folder-map.json + folder-open-icons.json, and swaps SVGs on
 * <details> toggle. The resolution logic mirrors the server-side plugin.
 */
import folderMap from "../plugins/folder-map.json";
import openIcons from "../plugins/folder-open-icons.json";

function resolveOpenIconName(folderName) {
	const lower = folderName.toLowerCase();
	const closedName = folderMap.folderMap?.[lower];
	if (closedName) {
		const openName = folderMap.folderOpenMap?.[closedName];
		if (openName) return openName;
	}
	return folderMap.defaultFolderOpen || folderMap.defaultFolder;
}

function svgFromEntry(entry) {
	if (!entry) return "";
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${entry.viewBox}">${entry.body}</svg>`;
}

function initFileTree(root = document) {
	const detailsList = root.querySelectorAll(".vp-file-tree details");
	if (!detailsList.length) return;

	for (const details of detailsList) {
		const icon = details.querySelector(":scope > summary .vp-file-tree-icon");
		if (!icon) continue;

		const nameSpan = details.querySelector(":scope > summary .vp-file-tree-name.folder");
		if (!nameSpan) continue;

		const folderName = nameSpan.textContent.trim();
		const openIconName = resolveOpenIconName(folderName);
		const openEntry = openIcons[openIconName];
		if (!openEntry) continue;

		const closedSvg = icon.innerHTML;
		const openSvg = svgFromEntry(openEntry);

		details.addEventListener("toggle", () => {
			icon.innerHTML = details.open ? openSvg : closedSvg;
		});

		if (details.open) {
			icon.innerHTML = openSvg;
		}
	}
}

if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => initFileTree());
	} else {
		initFileTree();
	}
}

document.addEventListener("swup:contentReplaced", () => {
	initFileTree();
});

export { initFileTree };