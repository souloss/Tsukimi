import { h } from "hastscript";
import { visit } from "unist-util-visit";

function extractText(node) {
	if (node.type === "text") return node.value || "";
	return node.children ? node.children.map(extractText).join("") : "";
}

/** Convert the remark marker to a stable, accessible Vega-Lite mount point. */
export function rehypeVegaLite() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "div" || !node.properties) return;
			const classes = Array.isArray(node.properties.className)
				? node.properties.className
				: String(node.properties.className || "").split(/\s+/);
			if (!classes.includes("vega-lite-container")) return;

			const spec =
				node.properties["data-vega-lite-spec"] || extractText(node).trim();
			if (!spec) return;

			node.properties = {
				class: "visual-diagram vega-lite-diagram-container",
				"data-tsukimi-diagram": "vega-lite",
				"data-vega-lite-spec": spec,
				role: "group",
				"aria-label": "Vega-Lite data visualization",
			};
			node.children = [
				h("div", { class: "vega-lite-view", "data-vega-lite-mount": "true" }),
				h("details", { class: "visual-diagram-source" }, [
					h("summary", "View source"),
					h("pre", spec),
				]),
			];
		});
	};
}

export default rehypeVegaLite;
