import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * 检测是否为开发环境：
 * - 优先检查通过参数传入的 isDev
 * - 否则检查 process.env.npm_lifecycle_event
 * - 最后检查 process.env.NODE_ENV
 */
function isDevMode(options = {}) {
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
 * 从 HAST 节点递归提取所有文本内容，作为 `<img>` 的 alt 回退文案。
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
 * 生成当前 HAST 节点的随机 id，避免同一页多个图表冲突。
 * @returns {string}
 */
function generateId() {
	const rand = Math.random().toString(36).slice(2, 8);
	return `plantuml-${rand}`;
}

/**
 * rehype 插件：把 `div.plantuml-container`（由 remark-plantuml 标记）改写为
 * 可交互的 `.plantuml-diagram-container`。客户端渲染脚本由共享
 * `diagram-loader` 按视口统一加载，负责主题切换、加载失败降级与缩放/全屏控制。
 *
 * Dev 模式下跳过脚本注入，仅输出带虚线边框的静态占位符。
 * @returns {(tree: import('hast').Root) => void} rehype transformer
 */
export function rehypePlantuml(options = {}) {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "div" || !node.properties) {
				return;
			}
			const classProp = node.properties.className;
			const hasMarker = Array.isArray(classProp)
				? classProp.includes("plantuml-container")
				: typeof classProp === "string"
					? classProp.split(/\s+/).includes("plantuml-container")
					: false;
			if (!hasMarker) {
				return;
			}

			// Dev: 跳过客户端脚本注入，仅输出带虚线边框的静态占位符
			if (isDevMode(options)) {
				let altText =
					node.properties["data-plantuml-alt"] ||
					node.properties.dataPlantumlAlt ||
					"";
				if (!altText) {
					altText = extractText(node).trim().slice(0, 200);
				}

				const lightSrc =
					node.properties["data-plantuml-light"] ||
					node.properties.dataPlantumlLight ||
					"";

				node.tagName = "div";
				node.properties = {
					class: "plantuml-dev-placeholder",
					style:
						"border:1px dashed #ccc;padding:1em;margin:1em 0;background:#f9f9f9;border-radius:4px;text-align:center;",
				};
				node.children = [
					h("strong", "[PlantUML diagram — interactive in production]"),
					lightSrc
						? h("img", {
								src: lightSrc,
								alt: altText || "PlantUML diagram (dev preview)",
								style: "max-width:100%;margin-top:0.5em;",
								loading: "lazy",
							})
						: h(
								"p",
								{ style: "color:#888;margin-top:0.5em;" },
								"(Image not available in dev preview)",
							),
				];
				return;
			}

			const lightSrc =
				node.properties["data-plantuml-light"] ||
				node.properties.dataPlantumlLight ||
				"";
			const darkSrc =
				node.properties["data-plantuml-dark"] ||
				node.properties.dataPlantumlDark ||
				lightSrc;
			let altText =
				node.properties["data-plantuml-alt"] ||
				node.properties.dataPlantumlAlt ||
				"";
			if (!altText) {
				altText = extractText(node).trim().slice(0, 200);
			}

			if (!lightSrc) {
				return;
			}

			const diagramId = generateId();

			const img = h("img", {
				class: "plantuml-image",
				alt: altText || "PlantUML diagram",
				src: lightSrc,
				"data-light-src": lightSrc,
				"data-dark-src": darkSrc,
				loading: "lazy",
				decoding: "async",
			});

			const wrapper = h(
				"div",
				{
					class: "plantuml-wrapper",
					id: diagramId,
				},
				[img],
			);

			node.tagName = "div";
			node.properties = {
				class: "plantuml-diagram-container",
				"data-tsukimi-diagram": "plantuml",
			};
			node.children = [wrapper];
		});
	};
}

export default rehypePlantuml;
