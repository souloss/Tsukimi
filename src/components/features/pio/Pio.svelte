<script lang="ts">
import { onDestroy, onMount } from "svelte";

import { pioConfig } from "@/config";

import type { PioProps } from "./types";

const { config = {} }: { config?: Partial<PioProps["config"]> } = $props();

const merged = $derived({
	mode: config?.mode ?? pioConfig.mode,
	hidden: config?.hiddenOnMobile ?? pioConfig.hiddenOnMobile,
	dialog: config?.dialog ?? pioConfig.dialog ?? {},
	models: config?.models ??
		pioConfig.models ?? ["/pio/models/NOIR/noir.model3.json"],
	tips: config?.tips ?? pioConfig.tips,
	menus: config?.menus ?? pioConfig.menus,
	position: config?.position ?? pioConfig.position,
	hideAboutMenu: config?.hideAboutMenu ?? pioConfig.hideAboutMenu ?? true,
});

let widgetInstance: { destroy: () => Promise<void>; sleep: () => void } | null =
	null;
let removeInteractionListeners: (() => void) | undefined;
let hasStarted = false;

async function initWidget() {
	if (typeof window === "undefined") {
		return;
	}

	try {
		const { createWidget } = await import("l2d-widget");
		type WidgetOptions = Parameters<typeof createWidget>[0];

		const modelPaths = merged.models;
		const modelConfig =
			modelPaths.length === 1
				? { path: modelPaths[0] }
				: modelPaths.map((p: string) => ({ path: p }));

		// Build tips on model config before passing to createWidget
		const tipsData: Record<string, unknown> = {};
		const tipsConfig = merged.tips;
		if (tipsConfig) {
			if (tipsConfig.welcomeMessage) {
				tipsData.welcomeMessage = tipsConfig.welcomeMessage;
			}
			if (tipsConfig.messages) {
				tipsData.messages = tipsConfig.messages;
			}
			if (tipsConfig.duration) {
				tipsData.duration = tipsConfig.duration;
			}
			if (tipsConfig.interval) {
				tipsData.interval = tipsConfig.interval;
			}
		} else if (merged.dialog?.welcome || merged.dialog?.touch) {
			const welcome = merged.dialog.welcome;
			const touch = merged.dialog.touch;
			if (welcome) {
				tipsData.welcomeMessage = Array.isArray(welcome) ? welcome : [welcome];
			}
			if (touch) {
				tipsData.messages = Array.isArray(touch) ? touch : [touch];
			}
		}
		if (Object.keys(tipsData).length > 0) {
			(modelConfig as Record<string, unknown>).tips = tipsData;
		}

		const position =
			merged.position === "right"
				? ("bottom-right" as const)
				: ("bottom-left" as const);

		const options: WidgetOptions = {
			model: modelConfig as WidgetOptions["model"],
			position,
			size: pioConfig.width ?? 280,
			transitionDuration: 1500,
			transitionType: "slide",
		};

		// Map menus config
		const menusConfig = merged.menus;
		if (menusConfig?.items && menusConfig.items.length > 0) {
			const menuActions: Record<
				string,
				(widget: { sleep: () => void }) => void
			> = {
				home: () => (window.location.href = "/"),
				scrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
				sleep: (w) => w.sleep(),
			};

			options.menus = {
				items: menusConfig.items.map((item) => ({
					icon: item.icon,
					label: item.label,
					onClick: menuActions[item.action] ?? (() => {}),
				})),
				...(menusConfig.align && { align: menusConfig.align }),
			};
		}

		widgetInstance = createWidget(options);

		// Hide built-in About menu button if configured
		if (merged.hideAboutMenu) {
			const style = document.createElement("style");
			style.id = "l2d-hide-about";
			style.textContent =
				'div[style*="z-index: 9999"] button[title="About"] { display: none !important; }';
			document.head.appendChild(style);
		}
	} catch (e) {
		console.error("Failed to initialize Live2D widget:", e);
	}
}

onMount(() => {
	if (!pioConfig.enable) {
		return;
	}

	if (
		pioConfig.hiddenOnMobile &&
		window.matchMedia("(max-width: 1280px)").matches
	) {
		return;
	}

	// Live2D downloads megabytes of model data. Wait for an explicit interaction
	// so it never competes with the initial page render.
	const startAfterInteraction = () => {
		if (hasStarted) return;
		hasStarted = true;
		removeInteractionListeners?.();
		removeInteractionListeners = undefined;
		if ("requestIdleCallback" in window) {
			(
				window as unknown as { requestIdleCallback: typeof requestIdleCallback }
			).requestIdleCallback(() => initWidget(), { timeout: 1500 });
		} else {
			setTimeout(initWidget, 250);
		}
	};
	document.addEventListener("pointerdown", startAfterInteraction, {
		once: true,
		passive: true,
	});
	document.addEventListener("keydown", startAfterInteraction, { once: true });
	removeInteractionListeners = () => {
		document.removeEventListener("pointerdown", startAfterInteraction);
		document.removeEventListener("keydown", startAfterInteraction);
	};
});

onDestroy(async () => {
	if (widgetInstance) {
		try {
			await widgetInstance.destroy();
		} catch {
			// Widget may already be destroyed
		}
		widgetInstance = null;
	}
	if (typeof document !== "undefined") {
		document.getElementById("l2d-hide-about")?.remove();
	}
	removeInteractionListeners?.();
});
</script>

{#if pioConfig.enable}
	<div id="pio-container"></div>
{/if}

<style>
	#pio-container {
		position: fixed;
		z-index: 999;
	}
</style>
