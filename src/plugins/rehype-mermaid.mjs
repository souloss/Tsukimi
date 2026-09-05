import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * 递归提取 HAST 节点树中的所有文本内容
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

export function rehypeMermaid(options = {}) {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (
				node.tagName === "div" &&
				node.properties &&
				node.properties.className &&
				node.properties.className.includes("mermaid-container")
			) {
				// 优先使用 data-mermaid-code 属性，为空时从子节点文本提取（MDX 兼容）
				let mermaidCode = node.properties["data-mermaid-code"] || "";
				if (!mermaidCode) {
					mermaidCode = extractText(node).trim();
				}

				// Dev: 跳过渲染脚本注入，仅输出带虚线边框的代码占位符
				if (isDevMode(options)) {
					node.tagName = "div";
					node.properties = {
						class: "mermaid-dev-placeholder",
						style:
							"border:1px dashed #ccc;padding:1em;margin:1em 0;background:#f9f9f9;border-radius:4px;",
					};
					node.children = [
						h("strong", "[Mermaid diagram — rendered in production]"),
						h(
							"pre",
							{ style: "margin:0.5em 0 0;font-size:0.85em;" },
							mermaidCode,
						),
					];
					return;
				}

				const mermaidId = `mermaid-${Math.random().toString(36).slice(-6)}`;

				// 创建 Mermaid 容器
				const mermaidContainer = h(
					"div",
					{ class: "mermaid-wrapper", id: mermaidId },
					[
						h(
							"div",
							{
								class: "mermaid",
								"data-mermaid-code": mermaidCode,
							},
							mermaidCode,
						),
					],
				);

				// 替换原始节点
				node.tagName = "div";
				node.properties = {
					className: ["mermaid-diagram-container"],
					"data-tsukimi-diagram": "mermaid",
				};
				node.children = [mermaidContainer];
			}
		});
	};
}

export default rehypeMermaid;
