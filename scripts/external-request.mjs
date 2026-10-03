export class ExternalRequestError extends Error {
	constructor(message, { source, code = "network", cause } = {}) {
		super(`${message} [${source}]`, { cause });
		this.name = "ExternalRequestError";
		this.source = source;
		this.code = code;
	}
}

export async function fetchExternalJson(url, { source, signal, timeoutMs = 10_000, retries = 2, headers } = {}) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	const onAbort = () => controller.abort();
	signal?.addEventListener("abort", onAbort, { once: true });
	try {
		for (let attempt = 0; ; attempt += 1) {
			try {
				const response = await fetch(url, { signal: controller.signal, headers });
				if (!response.ok) throw new ExternalRequestError(`HTTP ${response.status}`, { source, code: "http" });
				const data = await response.json();
				return data;
			} catch (error) {
				if (controller.signal.aborted) {
					throw new ExternalRequestError("Request timed out or was cancelled", { source, code: signal?.aborted ? "aborted" : "timeout", cause: error });
				}
				if (attempt >= retries) {
					if (error instanceof ExternalRequestError) throw error;
					throw new ExternalRequestError("Network request failed", { source, cause: error });
				}
				await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
			}
		}
	} finally {
		clearTimeout(timeout);
		signal?.removeEventListener("abort", onAbort);
	}
}
