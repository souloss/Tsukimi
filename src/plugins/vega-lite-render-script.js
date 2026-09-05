import embed from "vega-embed";

const rendered = new WeakSet();
const instances = new WeakMap();
let unsubscribeTheme;

function isDark() {
	return document.documentElement.classList.contains("dark");
}

function themeConfig() {
	const dark = isDark();
	const text = dark ? "#e5e7eb" : "#1f2937";
	const grid = dark ? "#374151" : "#d1d5db";
	return {
		background: "transparent",
		axis: {
			domainColor: grid,
			gridColor: grid,
			labelColor: text,
			titleColor: text,
		},
		legend: { labelColor: text, titleColor: text },
		title: { color: text },
		view: { stroke: "transparent" },
	};
}

function parseSpec(container) {
	const source = container.getAttribute("data-vega-lite-spec") || "";
	if (source.length > 256 * 1024) {
		throw new Error("Vega-Lite spec exceeds the 256 KB limit");
	}
	const spec = JSON.parse(source);
	if (!spec || typeof spec !== "object" || Array.isArray(spec)) {
		throw new Error("Vega-Lite spec must be a JSON object");
	}
	return spec;
}

function renderError(container, error) {
	container.setAttribute("data-tsukimi-diagram-state", "error");
	const view = container.querySelector("[data-vega-lite-mount]");
	if (!view) return;
	view.innerHTML = "";
	const message = document.createElement("p");
	message.className = "visual-diagram-error";
	message.textContent = "Visualization could not be rendered.";
	message.title = error instanceof Error ? error.message : String(error);
	view.append(message);
}

function destroyDiagram(container) {
	const instance = instances.get(container);
	if (!instance) return;
	instance.resizeObserver?.disconnect();
	instance.view?.finalize();
	instances.delete(container);
	rendered.delete(container);
}

export async function renderDiagram(container) {
	if (rendered.has(container)) return;
	const view = container.querySelector("[data-vega-lite-mount]");
	if (!view) return;

	try {
		const spec = parseSpec(container);
		const responsiveSpec = { ...spec };
		if (responsiveSpec.width === undefined) responsiveSpec.width = "container";
		if (responsiveSpec.autosize === undefined) {
			responsiveSpec.autosize = { type: "fit", contains: "padding" };
		}
		const result = await embed(view, responsiveSpec, {
			actions: { export: true, source: false, compiled: false, editor: false },
			renderer: "svg",
			tooltip: true,
			config: themeConfig(),
		});
		let resizeFrame;
		const resizeObserver =
			typeof ResizeObserver === "function"
				? new ResizeObserver(() => {
						cancelAnimationFrame(resizeFrame);
						resizeFrame = requestAnimationFrame(() => {
							void result.view.resize().runAsync();
						});
					})
				: null;
		resizeObserver?.observe(view);
		instances.set(container, { resizeObserver, view: result.view });
		rendered.add(container);
		container.setAttribute("data-tsukimi-diagram-state", "loaded");
	} catch (error) {
		renderError(container, error);
		throw error;
	}
}

async function rerender() {
	const containers = document.querySelectorAll(
		".vega-lite-diagram-container[data-tsukimi-diagram-state=loaded]",
	);
	for (const container of containers) {
		destroyDiagram(container);
		const view = container.querySelector("[data-vega-lite-mount]");
		if (view) view.replaceChildren();
		try {
			await renderDiagram(container);
		} catch {
			// The rendered error state is already visible to the reader.
		}
	}
}

function initThemeSubscription() {
	const coordinator = window.__diagramThemeCoordinator;
	if (coordinator && !unsubscribeTheme) {
		unsubscribeTheme = coordinator.subscribe(() => void rerender());
	}
}

document.addEventListener("astro:page-load", initThemeSubscription);
document.addEventListener("astro:before-preparation", () => {
	document
		.querySelectorAll(".vega-lite-diagram-container")
		.forEach(destroyDiagram);
});
initThemeSubscription();
