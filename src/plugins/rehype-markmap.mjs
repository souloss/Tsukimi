import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * 递归提取 HAST 节点树中的所有文本内容
 * @param {import('hast').Node} node 节点
 * @returns {string} 拼接后的文本
 */
function extractText(node) {
	if (node.type === "text") {
		return node.value || "";
	}
	if (node.children) {
		return node.children.map(extractText).join("");
	}
	return "";
}

/**
 * 生成当前 HAST 节点的随机 id，避免同一页多个图表冲突
 * @returns {string}
 */
function generateId() {
	const rand = Math.random().toString(36).slice(2, 8);
	return `markmap-${rand}`;
}

/**
 * 检测是否为开发环境：
 * - 优先检查通过参数传入的 isDev
 * - 否则检查 process.env.npm_lifecycle_event
 * - 最后检查 process.env.NODE_ENV
 */
function isDevMode(options) {
	if (typeof options?.isDev === "boolean") {
		return options.isDev;
	}
	// 通过 npm script 判断
	if (process.env.npm_lifecycle_event) {
		return process.env.npm_lifecycle_event.startsWith("dev");
	}
	// 回退到 NODE_ENV
	return process.env.NODE_ENV !== "production";
}

/**
 * rehype 插件：把 `div.markmap-container`（由 remark-markmap 标记）改写为
 * 可交互的 `.markmap-diagram-container`。客户端渲染脚本由共享
 * `diagram-loader` 按视口统一加载，避免每篇文章重复注入脚本。
 *
 * Dev 模式下跳过脚本注入，仅输出带虚线边框的代码占位符。
 * @returns {(tree: import('hast').Root) => void} rehype transformer
 */
export function rehypeMarkmap(options = {}) {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "div" || !node.properties) {
				return;
			}
			const classProp = node.properties.className;
			const hasMarker = Array.isArray(classProp)
				? classProp.includes("markmap-container")
				: typeof classProp === "string"
					? classProp.split(/\s+/).includes("markmap-container")
					: false;
			if (!hasMarker) {
				return;
			}

			let markmapCode = node.properties["data-markmap-code"] || "";
			if (!markmapCode) {
				markmapCode = extractText(node).trim();
			}
			if (!markmapCode) {
				return;
			}

			// Dev: 跳过客户端脚本注入，仅输出带虚线边框的代码占位符
			if (isDevMode(options)) {
				node.tagName = "div";
				node.properties = {
					class: "markmap-dev-placeholder",
					style:
						"border:1px dashed #ccc;padding:1em;margin:1em 0;background:#f9f9f9;border-radius:4px;",
				};
				node.children = [
					h("strong", "[Markmap mindmap — rendered in production]"),
					h(
						"pre",
						{ style: "margin:0.5em 0 0;font-size:0.85em;" },
						markmapCode,
					),
				];
				return;
			}

			const markmapId = generateId();

			const markmapContainer = h(
				"div",
				{
					class: "markmap-wrapper",
					id: markmapId,
				},
				[
					h(
						"div",
						{
							class: "markmap",
							"data-markmap-code": markmapCode,
						},
						markmapCode,
					),
				],
			);

			node.tagName = "div";
			node.properties = {
				class: "markmap-diagram-container",
				"data-tsukimi-diagram": "markmap",
			};
			node.children = [markmapContainer];
		});
	};
}

export default rehypeMarkmap;
