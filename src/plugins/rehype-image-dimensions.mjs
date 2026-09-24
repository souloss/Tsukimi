import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import { visit } from "unist-util-visit";

const publicRoot = resolve(
	fileURLToPath(new URL("../../public", import.meta.url)),
);

function resolveLocalImage(src) {
	if (!src?.startsWith("/") || src.startsWith("//")) return null;
	const pathname = src.split(/[?#]/, 1)[0];
	return resolve(publicRoot, `.${pathname}`);
}

export function rehypeImageDimensions() {
	return async (tree) => {
		const images = [];
		visit(tree, "element", (node) => {
			if (
				node.tagName !== "img" ||
				node.properties?.width ||
				node.properties?.height
			)
				return;
			const filePath = resolveLocalImage(String(node.properties?.src ?? ""));
			if (filePath) images.push({ node, filePath });
		});
		const rawImages = [];
		visit(tree, ["raw", "html"], (node) => {
			if (!/<img\b/i.test(node.value)) return;
			const pattern = /<img\b([^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*)>/gi;
			for (const match of node.value.matchAll(pattern)) {
				if (/\bwidth\s*=|\bheight\s*=/i.test(match[1])) continue;
				const filePath = resolveLocalImage(match[2]);
				if (filePath) rawImages.push({ node, match, filePath });
			}
		});

		await Promise.all(
			images.map(async ({ node, filePath }) => {
				try {
					await access(filePath, constants.R_OK);
					const metadata = await sharp(filePath, { failOn: "none" }).metadata();
					if (metadata.width && metadata.height) {
						node.properties.width = metadata.width;
						node.properties.height = metadata.height;
					}
				} catch {
					// External, unsupported, or missing images keep their natural sizing.
				}
			}),
		);
		await Promise.all(
			rawImages.map(async ({ node, match, filePath }) => {
				try {
					await access(filePath, constants.R_OK);
					const metadata = await sharp(filePath, { failOn: "none" }).metadata();
					if (!metadata.width || !metadata.height) return;
					const tag = match[0].replace(
						/\s*\/>$|\s*>$/,
						` width="${metadata.width}" height="${metadata.height}"$&`,
					);
					node.value = node.value.replace(match[0], tag);
				} catch {
					// External, unsupported, or missing images keep their natural sizing.
				}
			}),
		);
	};
}
