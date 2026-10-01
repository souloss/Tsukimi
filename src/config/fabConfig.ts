import type { FabConfig } from "@/types/fab";

/** Device visibility is explicit so each floating action has one responsive policy. */
export const fabConfig: FabConfig = {
	enable: true,
	items: {
		music: { devices: ["mobile", "tablet", "desktop"] },
		// MobileTOC is rendered in the navbar, so the floating TOC starts at tablet.
		toc: { devices: ["tablet", "desktop"] },
		home: { devices: ["mobile", "tablet", "desktop"] },
		top: { devices: ["mobile", "tablet", "desktop"] },
	},
};
