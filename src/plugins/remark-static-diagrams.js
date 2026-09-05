import bytefieldModule from "bytefield-svg";
import { fromHtml } from "hast-util-from-html";
import JSON5 from "json5";
import { optimize } from "svgo";
import { visit } from "unist-util-visit";
import wavedrom from "wavedrom";
import darkSkin from "wavedrom/skins/dark.js";
import defaultSkin from "wavedrom/skins/default.js";
import lowkeySkin from "wavedrom/skins/lowkey.js";
import narrowSkin from "wavedrom/skins/narrow.js";
import narrowerSkin from "wavedrom/skins/narrower.js";
import narrowererSkin from "wavedrom/skins/narrowerer.js";

const generateBytefield = bytefieldModule.default ?? bytefieldModule;
const waveSkins = {
	default: defaultSkin.default ?? defaultSkin,
	dark: darkSkin.dark ?? darkSkin,
	narrow: narrowSkin.narrow ?? narrowSkin,
	lowkey: lowkeySkin.lowkey ?? lowkeySkin,
	narrower: narrowerSkin.narrower ?? narrowerSkin,
	narrowerer: narrowererSkin.narrowerer ?? narrowererSkin,
};

const LANGUAGE_ALIASES = {
	bytefield: "bytefield",
	"bytefield-svg": "bytefield",
	wavedrom: "wavedrom",
	wave: "wavedrom",
};
const STATIC_DIAGRAMS = new Set(["bytefield", "wavedrom"]);

function prefixSvgIds(svg, prefix) {
	const ids = new Map();
	const withIds = svg.replace(/\bid="([^"]+)"/g, (_match, id) => {
		const nextId = `${prefix}-${id}`;
		ids.set(id, nextId);
		return `id="${nextId}"`;
	});

	if (ids.size === 0) return withIds;

	return withIds.replace(
		/(["'(])#([\w:.-]+)(?=["')\s])/g,
		(match, start, id) => {
			const nextId = ids.get(id);
			return nextId ? `${start}#${nextId}` : match;
		},
	);
}

function compactSvg(svg) {
	try {
		return optimize(svg, { multipass: true }).data;
	} catch {
		return svg;
	}
}

function wrapSvg(svg, className, label, index) {
	const prefixedSvg = prefixSvgIds(compactSvg(svg), `tsukimi-d${index}`);
	return {
		className,
		label,
		svg: prefixedSvg,
	};
}

function renderWaveDrom(source, index) {
	const parsed = JSON5.parse(source);
	if (!parsed || typeof parsed !== "object") {
		throw new Error("WaveDrom source must evaluate to an object");
	}
	const tree = wavedrom.renderAny(index, parsed, waveSkins);
	const svg = wavedrom.onml.stringify(tree);
	return wrapSvg(
		svg,
		"wavedrom-diagram-container",
		"WaveDrom timing diagram",
		index,
	);
}

function renderBytefield(source, index) {
	const svg = generateBytefield(source, { embedded: true });
	if (typeof svg !== "string" || !svg.trim().startsWith("<svg")) {
		throw new Error("bytefield-svg did not return an embedded SVG");
	}
	return wrapSvg(
		svg,
		"bytefield-diagram-container",
		"Bytefield diagram",
		index,
	);
}

/**
 * Render static DSLs during the Astro build. The generated SVG is embedded in
 * the HTML so these engines add no client-side JavaScript or network request.
 */
export function remarkStaticDiagrams() {
	return (tree, file) => {
		let diagramIndex = 0;
		visit(tree, "code", (node) => {
			const language =
				node.data?.tsukimiDiagram ||
				LANGUAGE_ALIASES[String(node.lang || "").toLowerCase()];
			if (
				!STATIC_DIAGRAMS.has(language) ||
				typeof node.value !== "string" ||
				!node.value.trim()
			) {
				return;
			}

			try {
				const rendered =
					language === "bytefield"
						? renderBytefield(node.value, diagramIndex)
						: renderWaveDrom(node.value, diagramIndex);
				const svgChildren = fromHtml(rendered.svg, { fragment: true }).children;
				node.type = "static-diagram";
				node.data = {
					hName: "figure",
					hProperties: {
						className: ["visual-diagram", rendered.className],
						"aria-label": rendered.label,
					},
					hChildren: [
						{
							type: "element",
							tagName: "div",
							properties: { className: ["visual-diagram-svg"] },
							children: svgChildren,
						},
						{
							type: "element",
							tagName: "figcaption",
							properties: { className: ["sr-only"] },
							children: [{ type: "text", value: rendered.label }],
						},
					],
				};
				node.value = undefined;
				diagramIndex += 1;
			} catch (error) {
				file?.message?.(
					`Unable to render ${language} diagram: ${error instanceof Error ? error.message : String(error)}`,
					node,
				);
			}
		});
	};
}

export default remarkStaticDiagrams;
