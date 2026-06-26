import { definePlugin } from "@expressive-code/core";

/**
 * Expressive Code plugin that reads the `collapse` meta option from code blocks
 * and adds a `data-force-collapse` attribute to the rendered HTML element.
 *
 * This allows authors to force-collapse specific code blocks from markdown:
 *
 * ```go collapse
 * package main
 * // ... long code ...
 * ```
 *
 * The runtime `CodeBlockCollapser` script detects this attribute and
 * forces the block to start in a collapsed state, regardless of line threshold
 * or `defaultCollapsed` config.
 */
export function pluginCodeCollapse() {
	return definePlugin({
		name: "Code Collapse",
		hooks: {
			postprocessRenderedBlock: ({ codeBlock, renderData }) => {
				const forceCollapse = codeBlock.metaOptions.getBoolean("collapse");
				if (forceCollapse && renderData.blockAst.properties) {
					renderData.blockAst.properties["data-force-collapse"] = "";
				}
			},
		},
	});
}
