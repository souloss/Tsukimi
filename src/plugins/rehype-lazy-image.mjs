import { visit } from "unist-util-visit";

/**
 * Rehype plugin for image lazy loading
 * Adds data-lazy-src attribute and loading="lazy" to markdown content images
 * for client-side blur transition effect
 */
export function rehypeLazyImage() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "img" && node.properties && node.properties.src) {
				const src = node.properties.src;

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
