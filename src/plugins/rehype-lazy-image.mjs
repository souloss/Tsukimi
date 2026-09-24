import { visit } from "unist-util-visit";

/**
 * Rehype plugin for image lazy loading
 * Adds native loading metadata to markdown content images for consistent
 * lazy loading and blur transition behavior.
 */
export function rehypeLazyImage() {
	return (tree) => {
		visit(tree, ["raw", "html"], (node) => {
			if (!/<img\b/i.test(node.value)) return;
			node.value = node.value.replace(
				/<img\b([^>]*?)(\/?)>/gi,
				(_match, attributes, selfClosing) => {
					let normalized = attributes;
					if (!/\balt(?:\s*=|\s|$)/i.test(normalized)) {
						normalized += ' alt=""';
					}
					if (!/\bloading\s*=/i.test(normalized)) {
						normalized += ' loading="lazy"';
					}
					if (!/\bdecoding\s*=/i.test(normalized)) {
						normalized += ' decoding="async"';
					}
					return `<img${normalized}${selfClosing}>`;
				},
			);
		});

		visit(tree, "element", (node) => {
			if (node.tagName === "img" && node.properties) {
				const src = String(node.properties.src ?? "");

				// Skip images that are already processed or are inline/base64
				if (src.startsWith("data:") || node.properties.dataLazySrc) {
					return;
				}

				// Keep native lazy loading as the single loading mechanism. The previous
				// data-lazy-src mirror caused the client handler to mark already-loaded
				// images immediately and added no actual deferral.
				if (!node.properties.loading) {
					node.properties.loading = "lazy";
				}
				if (!node.properties.decoding) {
					node.properties.decoding = "async";
				}
				node.data = {
					...node.data,
					hProperties: {
						...node.data?.hProperties,
						decoding: "async",
					},
				};

				// Add a class for CSS blur transition
				if (node.properties.className) {
					if (Array.isArray(node.properties.className)) {
						node.properties.className.push("lazy-image");
					} else {
						node.properties.className = [
							node.properties.className,
							"lazy-image",
						];
					}
				} else {
					node.properties.className = ["lazy-image"];
				}
			}
		});
	};
}
