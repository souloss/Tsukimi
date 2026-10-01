import { markdownCapabilities } from "@/generated/markdown-capabilities";

const runtimeCapabilities = markdownCapabilities.filter(
	(capability) => capability.runtime,
);

/**
 * Detect page features before loading their client resource chunks. The
 * manifest is generated from the Markdown capability registry so adding a
 * syntax entry cannot silently skip its runtime loader.
 */
export function loadMarkdownResources(root: ParentNode = document): void {
	const detected = runtimeCapabilities.filter((capability) =>
		root.querySelector(capability.runtime?.selector ?? ""),
	);

	if (detected.some((capability) => capability.runtime?.loader === "diagram")) {
		void import("./diagram-loader.js");
	}

	for (const capability of detected) {
		document.documentElement.dataset[
		`markdown${capability.id.replace(/(^|-)(\w)/g, (_, _separator, letter) => letter.toUpperCase())}`
		] = "true";
	}
}
