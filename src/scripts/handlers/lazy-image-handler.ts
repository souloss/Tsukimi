/**
 * Image lazy loading handler
 * Uses IntersectionObserver to load images with blur transition effect
 * Works with the rehype-lazy-image plugin that adds data-lazy-src attributes
 */
export class LazyImageHandler {
	private observer: IntersectionObserver | null = null;
	private initialized = false;

	/**
	 * Initialize lazy loading observer
	 */
	init(): void {
		if (this.initialized) {return;}

		// Process any images already in viewport
		this.processImages();

		// Set up IntersectionObserver for remaining images
		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.loadImage(entry.target as HTMLImageElement);
						this.observer?.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: "200px 0px",
				threshold: 0.01,
			},
		);

		this.observeImages();
		this.initialized = true;
	}

	/**
	 * Process all lazy images on the page
	 */
	private processImages(): void {
		const images = document.querySelectorAll<HTMLImageElement>(
			"img.lazy-image:not(.lazy-loaded)",
		);
		images.forEach((img) => {
			if (this.isInViewport(img)) {
				this.loadImage(img);
			}
		});
	}

	/**
	 * Observe lazy images that aren't yet loaded
	 */
	private observeImages(): void {
		if (!this.observer) {return;}

		const images = document.querySelectorAll<HTMLImageElement>(
			"img.lazy-image:not(.lazy-loaded)",
		);
		images.forEach((img) => {
			this.observer!.observe(img);
		});
	}

	/**
	 * Check if element is in viewport
	 */
	private isInViewport(el: HTMLElement): boolean {
		const rect = el.getBoundingClientRect();
		return (
			rect.top < window.innerHeight + 200 &&
			rect.bottom > -200 &&
			rect.left < window.innerWidth + 200 &&
			rect.right > -200
		);
	}

	/**
	 * Load a single lazy image with blur transition
	 */
	private loadImage(img: HTMLImageElement): void {
		const lazySrc = img.getAttribute("data-lazy-src");
		if (!lazySrc) {
			const markLoaded = () => img.classList.add("lazy-loaded");
			if (img.complete) {
				markLoaded();
			} else {
				img.addEventListener("load", markLoaded, { once: true });
			}
			return;
		}

		// Do not schedule a second request when the browser already owns the
		// image lifecycle.
		if (img.src === lazySrc || img.getAttribute("src") === lazySrc) {
			img.classList.add("lazy-loaded");
			return;
		}

		// Create a new image to preload
		const preload = new Image();
		preload.onload = () => {
			img.src = lazySrc;
			img.classList.add("lazy-loaded");
		};
		preload.onerror = () => {
			// Fallback: set src anyway and mark as loaded to remove blur
			img.src = lazySrc;
			img.classList.add("lazy-loaded");
		};
		preload.src = lazySrc;
	}

	/**
	 * Re-observe new images after page transition
	 */
	refresh(): void {
		if (!this.observer) {
			this.init();
			return;
		}
		this.observeImages();
		this.processImages();
	}

	/**
	 * Cleanup observer
	 */
	destroy(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		this.initialized = false;
	}
}

// Global singleton
let globalLazyImageHandler: LazyImageHandler | null = null;

export function getLazyImageHandler(): LazyImageHandler {
	if (!globalLazyImageHandler) {
		globalLazyImageHandler = new LazyImageHandler();
	}
	return globalLazyImageHandler;
}

export function initLazyImages(): void {
	const handler = getLazyImageHandler();
	handler.init();
}

export function refreshLazyImages(): void {
	const handler = getLazyImageHandler();
	handler.refresh();
}
