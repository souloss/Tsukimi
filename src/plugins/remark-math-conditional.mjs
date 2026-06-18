import remarkMath from "remark-math";

/**
 * Conditional remark-math plugin that reads the `math` frontmatter field
 * to control whether single-dollar inline math ($...$) is parsed.
 *
 * - When `math.inline` is `true`: single-dollar math is parsed.
 * - When `math.inline` is `false` (the default): only $$...$$ display math is parsed.
 *
 * The `math.display` flag is reserved for future use (e.g., to completely
 * disable math parsing). For now, display math ($$...$$) always works.
 */
export function remarkMathConditional() {
	return (tree, file) => {
		const mathConfig = file.data?.astro?.frontmatter?.math ?? {
			inline: false,
			display: false,
		};

		return remarkMath({
			singleDollarTextMath: mathConfig.inline === true,
		})(tree, file);
	};
}
