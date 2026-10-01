export function initDiagramLoader(): void;
export function registerDiagramEngine(
	name: string,
	loader: () => Promise<unknown>,
): void;
