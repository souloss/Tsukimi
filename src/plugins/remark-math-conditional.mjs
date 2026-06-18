import remarkMath from "remark-math";
import { visit } from "unist-util-visit";

/**
 * Conditional remark-math plugin that reads the `math` frontmatter field
 * to control whether single-dollar inline math ($...$) is parsed.
 *
 * - When `math.inline` is `true`: single-dollar math is parsed.
 * - When `math.inline` is `false` (the default): only $$...$$ display math is parsed.
 *
 * Implementation: Configure remark-math with singleDollarTextMath: true at the
 * processor level, then in a post-process transformer, revert inlineMath nodes
 * back to plain text for files that don't have `math.inline: true` in frontmatter.
 */
export function remarkMathConditional() {
	// Call remark-math as an attacher with singleDollarTextMath: true,
	// binding `this` to the current processor so it can configure micromark extensions.
	remarkMath.call(this, { singleDollarTextMath: true });

	// Return a transformer that conditionally reverts inline math nodes
	return (tree, file) => {
		const mathConfig = file.data?.astro?.frontmatter?.math ?? {
			inline: false,
			display: false,
		};

		// If inline math is enabled, nothing to do
		if (mathConfig.inline === true) {
			return;
		}

		// Otherwise, convert inlineMath nodes back to text
		// to prevent $...$ from being rendered as math
		visit(tree, "inlineMath", (node, index, parent) => {
			if (parent && index !== null && index !== undefined) {
				parent.children.splice(index, 1, {
					type: "text",
					value: `$${node.value}$`,
				});
			}
		});
	};
}
