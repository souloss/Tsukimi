import { visit } from "unist-util-visit";

const LANGUAGES = new Set(["vega-lite", "vegalite", "vl"]);

/** Mark Vega-Lite blocks for the shared viewport-aware diagram loader. */
export function remarkVegaLite() {
	return (tree) => {
		visit(tree, "code", (node) => {
			const language =
				node.data?.tsukimiDiagram || String(node.lang || "").toLowerCase();
			if (
				!LANGUAGES.has(language) ||
				typeof node.value !== "string" ||
				!node.value.trim()
			) {
				return;
			}

			node.type = "vega-lite";
			node.data = {
				hName: "div",
				hProperties: {
					className: ["vega-lite-container"],
					"data-vega-lite-spec": node.value,
				},
				hChildren: [{ type: "text", value: node.value }],
			};
			node.value = undefined;
		});
	};
}

export default remarkVegaLite;
