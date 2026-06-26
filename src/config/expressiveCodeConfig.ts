import type { ExpressiveCodeConfig } from "../types/config";

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	darkTheme: "github-dark",
	lightTheme: "github-light",
	hideDuringThemeTransition: true,
	pluginCollapsible: {
		enable: true,
		lineThreshold: 10,
		previewLines: 5,
		defaultCollapsed: false,
	},
};
