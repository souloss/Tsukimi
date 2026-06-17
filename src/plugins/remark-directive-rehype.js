import { h } from "hastscript";
import { visit } from "unist-util-visit";

// Single-source directive name registry — imported from remark-content-directives
// so the two files never drift out of sync.
import { CONTENT_DIRECTIVE_NAMES } from "./remark-content-directives.mjs";

export function parseDirectiveNode() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				// Skip directives handled by remark-content-directives
				if (
					CONTENT_DIRECTIVE_NAMES.has(node.name) ||
					node.name === "__md_element__"
				) {
					return;
				}

				// biome-ignore lint/suspicious/noAssignInExpressions: lazily init data object
				const data = node.data || (node.data = {});
				node.attributes = node.attributes || {};
				if (
					node.children?.length > 0 &&
					node.children[0].data &&
					node.children[0].data.directiveLabel
				) {
					// Add a flag to the node to indicate that it has a directive label
					node.attributes["has-directive-label"] = true;
				}
				const hast = h(node.name, node.attributes);

				data.hName = hast.tagName;
				data.hProperties = hast.properties;
			}
		});
	};
}
