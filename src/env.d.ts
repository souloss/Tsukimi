/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

// Type declaration for side-effect font imports
declare module "@fontsource-variable/jetbrains-mono";

// Type declaration for glob-dev-trim.mjs loader
declare module "*/loaders/glob-dev-trim.mjs" {
	export function devGlob(options: { pattern: string; base: string }): {
		name: string;
		load: (context: unknown) => Promise<void>;
	};
}

// Type declarations for generated JSON data files
declare module "*/friends-circle.json" {
	const data: { lastUpdated: string; items: unknown[] };
	export default data;
}
