import type { RecursivePartial } from "../types/utils";
import { deepMerge } from "./deep-merge";

/**
 * Merge config defaults with an override file from src/overrides/.
 * If no override file exists, returns defaults unchanged.
 * Override files are loaded eagerly at build time via import.meta.glob.
 */
export function withOverride<T extends object>(name: string, defaults: T): T {
	const modules = import.meta.glob<Record<string, RecursivePartial<T>>>(
		"../overrides/*.ts",
		{ eager: true },
	);
	const key = `../overrides/${name}.ts`;
	if (modules[key]) {
		const override = modules[key].default ?? modules[key];
		return deepMerge(defaults, override) as T;
	}
	return defaults;
}
