import type { RecursivePartial } from "../types/utils";
import { deepMerge } from "./deep-merge";

/**
 * Merge config defaults with an override file from src/overrides/.
 * If no override file exists, returns defaults unchanged.
 * Override files are loaded eagerly at build time via import.meta.glob.
 */
export function withOverride<T extends object>(name: string, defaults: T): T {
	let modules: Record<string, { default: RecursivePartial<T> }> = {};
	try {
		// Vite replaces this call with an eager module map at build time. Node-based
		// config checks do not provide import.meta.glob, so they use the defaults.
		modules = import.meta.glob<{ default: RecursivePartial<T> }>(
			"../overrides/*.ts",
			{ eager: true },
		);
	} catch {
		// Keep config validation and other non-Vite tooling usable without overrides.
	}
	const key = `../overrides/${name}.ts`;
	const module = modules[key];
	if (module) {
		return deepMerge(defaults, module.default) as T;
	}
	return defaults;
}
