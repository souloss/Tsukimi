export type FabDevice = "mobile" | "tablet" | "desktop";

export interface FabItemConfig {
	enable?: boolean;
	devices: readonly FabDevice[];
}

export interface FabConfig {
	enable: boolean;
	items: Record<"music" | "toc" | "home" | "top", FabItemConfig>;
}
