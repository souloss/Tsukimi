export class RequestLifecycleError extends Error {
	readonly code:
		| "aborted"
		| "timeout"
		| "stale"
		| "http"
		| "invalid"
		| "network";

	constructor(
		message: string,
		code: "aborted" | "timeout" | "stale" | "http" | "invalid" | "network",
	) {
		super(message);
		this.name = "RequestLifecycleError";
		this.code = code;
	}
}

declare global {
	interface Window {
		__tsukimiRequestGeneration?: number;
	}
}

let pageGeneration = 0;
const activeControllers = new Set<AbortController>();
const inFlight = new Map<string, Promise<unknown>>();

export function getRequestGeneration(): number {
	return pageGeneration;
}

/** Abort requests belonging to the page that is being replaced. */
export function advanceRequestGeneration(): number {
	pageGeneration += 1;
	for (const controller of activeControllers) controller.abort();
	activeControllers.clear();
	inFlight.clear();
	if (typeof window !== "undefined") {
		window.__tsukimiRequestGeneration = pageGeneration;
		window.dispatchEvent(
			new CustomEvent("tsukimi:page-generation", {
				detail: { generation: pageGeneration },
			}),
		);
	}
	return pageGeneration;
}

export interface RequestJsonOptions<T> {
	timeoutMs?: number;
	signal?: AbortSignal;
	dedupeKey?: string;
	validate?: (value: unknown) => value is T;
	retries?: number;
	retryDelayMs?: number;
	source?: string;
}

export async function fetchJson<T = unknown>(
	input: RequestInfo | URL,
	options: RequestJsonOptions<T> = {},
): Promise<T> {
	const key = options.dedupeKey ?? String(input);
	const existing = inFlight.get(key) as Promise<T> | undefined;
	if (existing) return existing;

	const generation = pageGeneration;
	const controller = new AbortController();
	activeControllers.add(controller);
	let timedOut = false;
	const timeout = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, options.timeoutMs ?? 10_000);
	const onAbort = () => controller.abort();
	options.signal?.addEventListener("abort", onAbort, { once: true });

	const request = (async () => {
		const retries = Math.max(0, options.retries ?? 0);
		let attempt = 0;
		try {
			while (true) {
				try {
					const response = await fetch(input, { signal: controller.signal });
					if (!response.ok) {
						throw new RequestLifecycleError(
							`Request failed with HTTP ${response.status}${options.source ? ` (${options.source})` : ""}`,
							"http",
						);
					}
					const contentType = response.headers.get("content-type") ?? "";
					if (contentType && !contentType.includes("json")) {
						throw new RequestLifecycleError(
							`Expected JSON response, received ${contentType}`,
							"invalid",
						);
					}
					const value: unknown = await response.json();
					if (generation !== pageGeneration) {
						throw new RequestLifecycleError(
							"Request belongs to a replaced page",
							"stale",
						);
					}
					if (options.validate && !options.validate(value)) {
						throw new RequestLifecycleError(
							"Response shape validation failed",
							"invalid",
						);
					}
					return value as T;
				} catch (error) {
					if (
						error instanceof RequestLifecycleError &&
						!["http", "network"].includes(error.code)
					)
						throw error;
					if (controller.signal.aborted) throw error;
					if (attempt >= retries) throw error;
					attempt += 1;
					await new Promise((resolve) =>
						setTimeout(resolve, options.retryDelayMs ?? 100 * attempt),
					);
				}
			}
		} catch (error) {
			if (error instanceof RequestLifecycleError) throw error;
			if (controller.signal.aborted) {
				const code =
					generation !== pageGeneration
						? "stale"
						: timedOut
							? "timeout"
							: "aborted";
				throw new RequestLifecycleError(
					code === "stale"
						? "Request belongs to a replaced page"
						: code === "timeout"
							? "Request timed out"
							: "Request aborted",
					code,
				);
			}
			throw error instanceof RequestLifecycleError
				? error
				: new RequestLifecycleError(
						`Request failed${options.source ? ` (${options.source})` : ""}`,
						"network",
					);
		} finally {
			clearTimeout(timeout);
			options.signal?.removeEventListener("abort", onAbort);
			activeControllers.delete(controller);
		}
	})();

	inFlight.set(key, request);
	void request.then(
		() => {
			if (inFlight.get(key) === request) inFlight.delete(key);
		},
		() => {
			if (inFlight.get(key) === request) inFlight.delete(key);
		},
	);
	return request;
}
