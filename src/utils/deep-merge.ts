import type { RecursivePartial } from "../types/utils";

export function isPlainObject(val: unknown): val is Record<string, unknown> {
	return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function deepMerge<T extends object>(
	target: T,
	source: RecursivePartial<T>,
): T {
	const result = { ...target } as Record<string, unknown>;
	for (const key of Object.keys(source as object)) {
		const sourceVal = (source as Record<string, unknown>)[key];
		const targetVal = result[key];
		if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
			result[key] = deepMerge(
				targetVal as Record<string, unknown>,
				sourceVal as RecursivePartial<Record<string, unknown>>,
			);
		} else {
			result[key] = sourceVal;
		}
	}
	return result as T;
}
