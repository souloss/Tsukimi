import { visit } from "unist-util-visit";

const languageAliases = new Map([
	["astro.config.mjs", { lang: "js", title: "astro.config.mjs" }],
	["astro.config.js", { lang: "js", title: "astro.config.js" }],
	["cname", { lang: "txt", title: "CNAME" }],
	["deploy.yml", { lang: "yaml", title: "deploy.yml" }],
	["deploy.yaml", { lang: "yaml", title: "deploy.yaml" }],
	["env", { lang: "bash" }],
	["bytefield", { lang: "clojure", diagram: "bytefield" }],
	["bytefield-svg", { lang: "clojure", diagram: "bytefield" }],
	["wavedrom", { lang: "json", diagram: "wavedrom" }],
	["wave", { lang: "json", diagram: "wavedrom" }],
	["vega-lite", { lang: "json", diagram: "vega-lite" }],
	["vegalite", { lang: "json", diagram: "vega-lite" }],
	["vl", { lang: "json", diagram: "vega-lite" }],
	["redis", { lang: "txt" }],
	["vcl", { lang: "txt" }],
]);

function hasTitle(meta) {
	return Boolean(meta && /\btitle\s*=/.test(meta));
}

function appendTitle(meta, title) {
	if (!title || hasTitle(meta)) {
		return meta;
	}
	const escapedTitle = title.replace(/"/g, "&quot;");
	return meta ? `title="${escapedTitle}" ${meta}` : `title="${escapedTitle}"`;
}

export function remarkCodeLangAliases() {
	return (tree) => {
		visit(tree, "code", (node) => {
			const alias = languageAliases.get((node.lang || "").toLowerCase());
			if (!alias) {
				return;
			}

			node.lang = alias.lang;
			if (alias.diagram) {
				node.data = { ...(node.data || {}), tsukimiDiagram: alias.diagram };
			}
			node.meta = appendTitle(node.meta, alias.title);
		});
	};
}
