/**
 * LivePhoto handler
 * Uses Apple LivePhotosKit JS to display iOS-style live photos
 * Supports both data attribute and class-based detection
 */
export class LivePhotoHandler {
	private instances: any[] = [];

	/**
	 * Initialize LivePhoto elements on the page
	 */
	async init(): Promise<void> {
		const livePhotoElements = document.querySelectorAll<HTMLElement>(
			".live-photo, [data-live-photo]",
		);
		if (livePhotoElements.length === 0) {return;}

		// Dynamically load LivePhotosKit
		if (!(window as any).LivePhotosKit) {
			await this.loadScript();
		}

		const LivePhotosKit = (window as any).LivePhotosKit;
		if (!LivePhotosKit) {return;}

		livePhotoElements.forEach((el) => {
			try {
				const photoSrc =
					el.getAttribute("data-photo-src") ||
					el.getAttribute("data-img") ||
					"";
				const videoSrc =
					el.getAttribute("data-video-src") ||
					el.getAttribute("data-video") ||
					"";

				if (!photoSrc || !videoSrc) {return;}

				const instance = LivePhotosKit.Player();
				instance.photoSrc = photoSrc;
				instance.videoSrc = videoSrc;
				instance.style.width = el.getAttribute("data-width") || "100%";
				instance.style.height =
					el.getAttribute("data-height") || "auto";

				el.innerHTML = "";
				el.appendChild(instance);
				this.instances.push(instance);
			} catch (e) {
				console.warn("LivePhoto init failed:", e);
			}
		});

	}

	/**
	 * Load LivePhotosKit script dynamically
	 */
	private async loadScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if ((window as any).LivePhotosKit) {
				resolve();
				return;
			}
			const script = document.createElement("script");
			script.src =
				"https://cdn.jsdelivr.net/npm/livephotoskit@1.5.7/dist/livephotoskit.js";
			script.onload = () => resolve();
			script.onerror = () =>
				reject(new Error("Failed to load LivePhotosKit"));
			document.head.appendChild(script);
		});
	}

	/**
	 * Cleanup instances
	 */
	destroy(): void {
		this.instances = [];
	}

	/**
	 * Refresh after page transition
	 */
	async refresh(): Promise<void> {
		this.destroy();
		await this.init();
	}
}

// Global singleton
let globalLivePhotoHandler: LivePhotoHandler | null = null;

export function getLivePhotoHandler(): LivePhotoHandler {
	if (!globalLivePhotoHandler) {
		globalLivePhotoHandler = new LivePhotoHandler();
	}
	return globalLivePhotoHandler;
}

export async function initLivePhoto(): Promise<void> {
	const handler = getLivePhotoHandler();
	await handler.init();
}

export async function refreshLivePhoto(): Promise<void> {
	const handler = getLivePhotoHandler();
	await handler.refresh();
}