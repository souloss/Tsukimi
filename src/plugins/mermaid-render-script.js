(() => {
	if (window.mermaidInitialized) {
		return;
	}
	window.mermaidInitialized = true;

	let currentTheme = null;
	let renderIdCounter = 0;
	let retryCount = 0;
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000;
	let renderObserver = null;
	let panZoomObserver = null;
	const renderedElements = new WeakSet();

	// Abort controller for cancelling in-flight theme re-renders
	let themeChangeAbort = null;

	function waitForMermaid(timeout = 10000) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			function check() {
				if (window.mermaid && typeof window.mermaid.initialize === "function") {
					resolve(window.mermaid);
				} else if (Date.now() - startTime > timeout) {
					reject(new Error("Mermaid library failed to load within timeout"));
				} else {
					setTimeout(check, 100);
				}
			}
			check();
		});
	}

	function yieldToMain() {
		return new Promise((resolve) => setTimeout(resolve, 0));
	}

	function getThemeConfig(theme) {
		const isDark = theme === "dark";
		return {
			startOnLoad: false,
			theme: theme,
			themeVariables: {
				fontFamily: "inherit",
				fontSize: "16px",
				primaryColor: isDark ? "#ffffff" : "#000000",
				primaryTextColor: isDark ? "#ffffff" : "#000000",
				primaryBorderColor: isDark ? "#ffffff" : "#000000",
				lineColor: isDark ? "#ffffff" : "#000000",
				secondaryColor: isDark ? "#333333" : "#f0f0f0",
				tertiaryColor: isDark ? "#555555" : "#e0e0e0",
			},
			securityLevel: "loose",
			errorLevel: "warn",
			logLevel: "error",
		};
	}

	function injectSkeletons() {
		document
			.querySelectorAll(".mermaid-diagram-container")
			.forEach((container) => {
				if (container.querySelector(".mermaid-skeleton")) {
					return;
				}
				const skeleton = document.createElement("div");
				skeleton.className = "mermaid-skeleton";
				skeleton.innerHTML =
					'<div class="skeleton-icon"></div><div class="skeleton-lines"><span></span><span></span><span></span></div>';
				container.insertBefore(skeleton, container.firstChild);
			});
	}

	function removeSkeleton(container) {
		const skeleton = container.querySelector(".mermaid-skeleton");
		if (skeleton) {
			skeleton.remove();
		}
	}

	function setupLazyRenderObserver() {
		if (renderObserver) {
			renderObserver.disconnect();
		}
		renderObserver = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const container = entry.target;
						obs.unobserve(container);
						renderDiagramInContainer(container);
					}
				});
			},
			{ rootMargin: "200px" },
		);
		injectSkeletons();
		document
			.querySelectorAll(".mermaid-diagram-container")
			.forEach((container) => {
				const mermaidEl = container.querySelector(
					".mermaid[data-mermaid-code]",
				);
				if (mermaidEl && !renderedElements.has(mermaidEl)) {
					renderObserver.observe(container);
				}
			});
	}

	async function renderDiagramInContainer(container) {
		const mermaidEl = container.querySelector(".mermaid[data-mermaid-code]");
		if (!mermaidEl || renderedElements.has(mermaidEl)) {
			return;
		}
		renderedElements.add(mermaidEl);
		await renderSingleDiagram(mermaidEl, currentTheme);
		removeSkeleton(container);
		await yieldToMain();
		setupPanZoomObserver(container);
	}

	async function renderSingleDiagram(element, theme, signal) {
		await yieldToMain();

		let attempts = 0;
		const maxAttempts = 3;

		while (attempts < maxAttempts) {
			// Check if this render has been cancelled
			if (signal?.aborted) {
				return;
			}

			try {
				const code = element.getAttribute("data-mermaid-code");
				if (!code) {
					break;
				}

				const id = `mermaid-${renderIdCounter++}`;
				const { svg } = await window.mermaid.render(id, code);

				if (signal?.aborted) {
					return;
				}

				element.innerHTML = svg;
				const svgElement = element.querySelector("svg");
				if (svgElement) {
					svgElement.setAttribute("width", "100%");
					svgElement.removeAttribute("height");
					svgElement.style.maxWidth = "100%";
					svgElement.style.height = "auto";
					if (theme === "dark") {
						svgElement.style.filter = "brightness(0.9) contrast(1.1)";
					} else {
						svgElement.style.filter = "none";
					}
				}
				element.setAttribute("data-mermaid-rendered", "true");
				break;
			} catch (error) {
				attempts++;
				console.warn(`Mermaid rendering attempt ${attempts} failed:`, error);
				if (attempts >= maxAttempts) {
					console.error(
						`Failed to render Mermaid diagram after ${maxAttempts} attempts:`,
						error,
					);
					renderedElements.delete(element);
					element.innerHTML = `
						<div class="mermaid-error">
							<p>Failed to render diagram after ${maxAttempts} attempts.</p>
							<button onclick="location.reload()" style="margin-top: 8px; padding: 4px 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
								Retry Page
							</button>
						</div>
					`;
					const container = element.closest(".mermaid-diagram-container");
					if (container) {
						removeSkeleton(container);
					}
				} else {
					await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
				}
			}
		}
	}

	// Theme change handler: re-render all diagrams with new theme
	async function onThemeChange(newTheme) {
		// Abort any in-flight theme re-render
		if (themeChangeAbort) {
			themeChangeAbort.abort();
		}
		themeChangeAbort = new AbortController();
		const signal = themeChangeAbort.signal;

		currentTheme = newTheme;
		document.dispatchEvent(new CustomEvent("mermaid:render:start"));

		destroyAllPanZoom();

		try {
			// Initialize mermaid with new theme
			window.mermaid.initialize(getThemeConfig(newTheme));

			const mermaidElements = document.querySelectorAll(
				".mermaid[data-mermaid-code]",
			);
			if (mermaidElements.length === 0) {
				document.dispatchEvent(new CustomEvent("mermaid:render:done"));
				return;
			}

			// Batch DOM writes: collect all rendered SVGs, then apply in one paint
			const results = [];
			for (let i = 0; i < mermaidElements.length; i++) {
				if (signal.aborted) return;

				const element = mermaidElements[i];
				const code = element.getAttribute("data-mermaid-code");
				if (!code) continue;

				// Only re-render elements that were previously rendered
				if (
					element.getAttribute("data-mermaid-rendered") !== "true" &&
					!renderedElements.has(element)
				) {
					continue;
				}

				try {
					const id = `mermaid-${renderIdCounter++}`;
					const { svg } = await window.mermaid.render(id, code);
					if (signal.aborted) return;
					results.push({ element, svg });
				} catch (error) {
					console.warn("Mermaid theme re-render failed for element:", error);
				}

				// Yield to main thread every diagram to keep UI responsive
				await yieldToMain();
			}

			// Apply all SVG updates in a single batch
			if (signal.aborted) return;
			for (const { element, svg } of results) {
				element.innerHTML = svg;
				const svgElement = element.querySelector("svg");
				if (svgElement) {
					svgElement.setAttribute("width", "100%");
					svgElement.removeAttribute("height");
					svgElement.style.maxWidth = "100%";
					svgElement.style.height = "auto";
					if (newTheme === "dark") {
						svgElement.style.filter = "brightness(0.9) contrast(1.1)";
					} else {
						svgElement.style.filter = "none";
					}
				}
				element.setAttribute("data-mermaid-rendered", "true");
				renderedElements.add(element);
			}

			retryCount = 0;
		} catch (error) {
			console.error("Error in mermaid theme change:", error);
		} finally {
			// Only clear abort if we're the latest theme change
			if (themeChangeAbort && themeChangeAbort.signal === signal) {
				themeChangeAbort = null;
			}
			document.dispatchEvent(new CustomEvent("mermaid:render:done"));

			// Re-initialize pan-zoom controls for all visible containers
			document
				.querySelectorAll(".mermaid-diagram-container")
				.forEach((container) => {
					const svgEl = container.querySelector(".mermaid svg");
					if (svgEl?.getAttribute("viewBox")) {
						initPanZoomForContainer(container);
					}
				});
		}
	}

	function setupPanZoomObserver(container) {
		if (!panZoomObserver) {
			panZoomObserver = new IntersectionObserver(
				(entries, obs) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const c = entry.target;
							obs.unobserve(c);
							initPanZoomForContainer(c);
						}
					});
				},
				{ rootMargin: "100px" },
			);
		}
		if (!container.hasAttribute("data-panzoom-init")) {
			panZoomObserver.observe(container);
		}
	}

	function destroyAllPanZoom() {
		const containers = document.querySelectorAll(
			".mermaid-diagram-container[data-panzoom-init]",
		);
		containers.forEach((container) => {
			if (container._panZoomInstance) {
				try {
					container._panZoomInstance.destroy();
				} catch (_e) {
					// ignore
				}
				container._panZoomInstance = null;
			}
			const controls = container.querySelector(".mermaid-controls");
			if (controls) {
				controls.remove();
			}
			container.removeAttribute("data-panzoom-init");
		});
	}

	/**
	 * Size an SVG element to fit within a container using its viewBox aspect ratio.
	 * Returns { width, height } in pixels, or null if viewBox is missing.
	 */
	function sizeSvgToFitContainer(svgElement, containerWidth, containerHeight) {
		const viewBox = svgElement.getAttribute("viewBox");
		if (!viewBox) return null;

		const [, , vbWidth, vbHeight] = viewBox.split(/\s+/).map(Number);
		if (!vbWidth || !vbHeight) return null;

		const svgAspectRatio = vbWidth / vbHeight;
		const containerAspectRatio = containerWidth / containerHeight;

		let width;
		let height;
		if (svgAspectRatio > containerAspectRatio) {
			// SVG is wider relative to container — fit by width
			width = containerWidth;
			height = containerWidth / svgAspectRatio;
		} else {
			// SVG is taller relative to container — fit by height
			height = containerHeight;
			width = containerHeight * svgAspectRatio;
		}

		svgElement.setAttribute("width", `${width}px`);
		svgElement.setAttribute("height", `${height}px`);
		svgElement.style.maxWidth = "none";
		svgElement.style.maxHeight = "none";
		svgElement.style.width = "";
		svgElement.style.height = "";

		return { width, height };
	}

	function initPanZoomForContainer(container) {
		if (typeof window.svgPanZoom !== "function") {
			return;
		}
		if (container.hasAttribute("data-panzoom-init")) {
			return;
		}
		const svgElement = container.querySelector(".mermaid svg");
		if (!svgElement) {
			return;
		}
		if (!svgElement.getAttribute("viewBox")) {
			return;
		}

		// Measure the container's available space
		const wrapperEl = container.querySelector(".mermaid-wrapper");
		const availWidth = wrapperEl
			? wrapperEl.clientWidth
			: container.clientWidth;
		const availHeight = wrapperEl
			? wrapperEl.clientHeight
			: container.clientHeight;

		// Size SVG to fit within the container
		sizeSvgToFitContainer(svgElement, availWidth, availHeight);

		try {
			const panZoomInstance = window.svgPanZoom(svgElement, {
				panEnabled: true,
				zoomEnabled: true,
				controlIconsEnabled: false,
				mouseWheelZoomEnabled: true,
				dblClickZoomEnabled: true,
				minZoom: 0.5,
				maxZoom: 5,
				fit: true,
				center: true,
				zoomScaleSensitivity: 0.3,
			});
			container._panZoomInstance = panZoomInstance;
			container.setAttribute("data-panzoom-init", "true");

			const controlsDiv = document.createElement("div");
			controlsDiv.className = "mermaid-controls";
			const buttons = [
				{
					label: "+",
					title: "放大",
					action: () => panZoomInstance.zoomIn(),
				},
				{
					label: "−",
					title: "缩小",
					action: () => panZoomInstance.zoomOut(),
				},
				{
					label: "↺",
					title: "重置",
					action: () => {
						panZoomInstance.resetZoom();
						panZoomInstance.resetPan();
						panZoomInstance.center();
					},
				},
				{
					label: "⛶",
					title: "全屏",
					action: () => openFullscreen(container),
				},
			];
			buttons.forEach((btn) => {
				const button = document.createElement("button");
				button.className = "mermaid-ctrl-btn";
				button.textContent = btn.label;
				button.title = btn.title;
				button.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					btn.action();
				});
				controlsDiv.appendChild(button);
			});
			container.appendChild(controlsDiv);
		} catch (e) {
			console.warn("Failed to initialize svg-pan-zoom for a diagram:", e);
		}
	}

	function openFullscreen(container) {
		const svgElement = container.querySelector(".mermaid svg");
		if (!svgElement) {
			return;
		}
		const overlay = document.createElement("div");
		overlay.className = "mermaid-fullscreen-overlay";
		const content = document.createElement("div");
		content.className = "mermaid-fs-content";
		const clonedSvg = svgElement.cloneNode(true);
		clonedSvg.style.filter = "";
		content.appendChild(clonedSvg);

		const fsControls = document.createElement("div");
		fsControls.className = "mermaid-fs-controls";
		let fsInstance = null;

		const closeOverlay = () => {
			if (fsInstance) {
				try {
					fsInstance.destroy();
				} catch (_e) {
					// ignore
				}
			}
			overlay.remove();
			document.removeEventListener("keydown", escHandler);
		};
		const escHandler = (e) => {
			if (e.key === "Escape") {
				closeOverlay();
			}
		};

		const fsButtons = [
			{
				label: "+",
				title: "放大",
				action: () => fsInstance?.zoomIn(),
			},
			{
				label: "−",
				title: "缩小",
				action: () => fsInstance?.zoomOut(),
			},
			{
				label: "↺",
				title: "重置",
				action: () => {
					if (fsInstance) {
						fsInstance.resetZoom();
						fsInstance.resetPan();
						fsInstance.center();
					}
				},
			},
			{ label: "✕", title: "关闭", action: closeOverlay },
		];
		fsButtons.forEach((btn) => {
			const button = document.createElement("button");
			button.className = "mermaid-ctrl-btn";
			button.textContent = btn.label;
			button.title = btn.title;
			button.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				btn.action();
			});
			fsControls.appendChild(button);
		});

		overlay.appendChild(content);
		overlay.appendChild(fsControls);
		document.body.appendChild(overlay);
		overlay.addEventListener("click", (e) => {
			if (e.target === overlay) {
				closeOverlay();
			}
		});
		document.addEventListener("keydown", escHandler);

		requestAnimationFrame(() => {
			// Size the cloned SVG to fill the fullscreen content area
			const contentWidth = content.clientWidth;
			const contentHeight = content.clientHeight;
			sizeSvgToFitContainer(clonedSvg, contentWidth, contentHeight);

			try {
				fsInstance = window.svgPanZoom(clonedSvg, {
					panEnabled: true,
					zoomEnabled: true,
					controlIconsEnabled: false,
					mouseWheelZoomEnabled: true,
					dblClickZoomEnabled: true,
					minZoom: 0.3,
					maxZoom: 10,
					fit: true,
					center: true,
					zoomScaleSensitivity: 0.3,
				});
			} catch (e) {
				console.warn("Failed to initialize fullscreen pan-zoom:", e);
			}
		});
	}

	async function loadMermaid() {
		if (typeof window.mermaid !== "undefined") {
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src =
				"https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.12.0/mermaid.min.js";
			script.onload = () => resolve();
			script.onerror = () => {
				const fallbackScript = document.createElement("script");
				fallbackScript.src =
					"https://unpkg.com/mermaid@11.12.0/dist/mermaid.min.js";
				fallbackScript.onload = () => resolve();
				fallbackScript.onerror = () =>
					reject(new Error("Failed to load Mermaid from both CDNs"));
				document.head.appendChild(fallbackScript);
			};
			document.head.appendChild(script);
		});
	}

	async function loadSvgPanZoom() {
		if (typeof window.svgPanZoom !== "undefined") {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src =
				"https://unpkg.com/svg-pan-zoom@3.6.2/dist/svg-pan-zoom.min.js";
			script.onload = () => resolve();
			script.onerror = () => {
				const fallbackScript = document.createElement("script");
				fallbackScript.src =
					"https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.2/dist/svg-pan-zoom.min.js";
				fallbackScript.onload = () => resolve();
				fallbackScript.onerror = () => {
					console.warn(
						"Failed to load svg-pan-zoom, pan/zoom features unavailable",
					);
					resolve();
				};
				document.head.appendChild(fallbackScript);
			};
			document.head.appendChild(script);
		});
	}

	async function initializeMermaid() {
		try {
			await waitForMermaid();
			window.mermaid.initialize(getThemeConfig(currentTheme));
			setupLazyRenderObserver();
		} catch (error) {
			console.error("Failed to initialize Mermaid:", error);
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(() => initializeMermaid(), RETRY_DELAY * retryCount);
			}
		}
	}

	function setupEventListeners() {
		document.addEventListener("astro:page-load", () => {
			retryCount = 0;
			setupLazyRenderObserver();
		});
		document.addEventListener("tsukimi:page:loaded", () => {
			retryCount = 0;
			setupLazyRenderObserver();
		});
	}

	async function initialize() {
		try {
			injectSkeletons();
			await Promise.all([loadMermaid(), loadSvgPanZoom()]);

			// Subscribe to coordinator for theme changes
			const coordinator = window.__diagramThemeCoordinator;
			if (coordinator) {
				currentTheme = coordinator.getTheme();
				coordinator.subscribe(onThemeChange);
			} else {
				// Fallback: read theme directly
				currentTheme = document.documentElement.classList.contains("dark")
					? "dark"
					: "default";
			}

			setupEventListeners();
			await initializeMermaid();
		} catch (error) {
			console.error("Failed to initialize Mermaid system:", error);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
})();
