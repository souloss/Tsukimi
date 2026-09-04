/**
 * file-tree.js — Client-side JS for file-tree folder icon toggling
 *
 * Identifies folders by their name in the DOM, resolves the open icon
 * from folder-map.json + folder-open-icons.json, and swaps SVGs on
 * <details> toggle. The resolution logic mirrors the server-side plugin.
 */
let folderMap;
let openIcons;
let fileTreeDataPromise;

function loadFileTreeData() {
	if (!fileTreeDataPromise) {
		fileTreeDataPromise = Promise.all([
			import("../plugins/folder-map.json"),
			import("../plugins/folder-open-icons.json"),
		]).then(([folderMapModule, openIconsModule]) => {
			folderMap = folderMapModule.default;
			openIcons = openIconsModule.default;
		});
	}
	return fileTreeDataPromise;
}

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

async function initFileTree(root = document) {
	const detailsList = root.querySelectorAll(".vp-file-tree details");
	if (!detailsList.length) return;
	await loadFileTreeData();

	for (const details of detailsList) {
		if (!details.isConnected) continue;
		if (details.dataset.fileTreeInitialized === "true") continue;
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
		details.dataset.fileTreeInitialized = "true";

		details.addEventListener("toggle", () => {
			icon.innerHTML = details.open ? openSvg : closedSvg;
		});

		if (details.open) {
			icon.innerHTML = openSvg;
		}
	}
}

function scheduleInit(root = document) {
	void initFileTree(root).catch((error) => {
		console.warn("Failed to load file-tree icon data:", error);
	});
}

if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => scheduleInit());
	} else {
		scheduleInit();
	}
}

document.addEventListener("swup:contentReplaced", () => {
	scheduleInit();
});

document.addEventListener("astro:page-load", () => {
	scheduleInit();
});

export { initFileTree };
