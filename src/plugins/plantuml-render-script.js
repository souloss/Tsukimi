(() => {
	if (window.plantumlInitialized) {
		return;
	}
	window.plantumlInitialized = true;

	const MIN_SCALE = 0.5;
	const MAX_SCALE = 5;
	const SCALE_STEP = 1.2;
	const CACHE_NAME = "plantuml-diagrams";
	const fullscreenOverlays = new Set();

	// Debounce timer for applyTheme
	let applyThemeTimer = null;
	let pendingApplyTheme = null;

	async function getImageFromCache(url) {
		try {
			const cache = await caches.open(CACHE_NAME);
			const response = await cache.match(url);
			if (response) {
				const blob = await response.blob();
				return URL.createObjectURL(blob);
			}
		} catch (_e) {
			// Cache API not available or error
		}
		return null;
	}

	async function saveImageToCache(url) {
		try {
			const cache = await caches.open(CACHE_NAME);
			const existing = await cache.match(url);
			if (existing) {
				return;
			}
			const response = await fetch(url);
			if (response.ok) {
				await cache.put(url, response);
			}
		} catch (_e) {
			// Network error or Cache API unavailable
		}
	}

	async function applyThemeNow(isDark) {
		const images = document.querySelectorAll(".plantuml-image");
		for (const img of images) {
			const light = img.getAttribute("data-light-src") || "";
			const dark = img.getAttribute("data-dark-src") || light;
			const next = isDark ? dark : light;
			if (!next || img.getAttribute("src") === next) {
				continue;
			}

			// Try cache first
			const cachedUrl = await getImageFromCache(next);
			if (cachedUrl) {
				// Cache hit — verify theme hasn't changed while we awaited cache
				const currentIsDark =
					document.documentElement.classList.contains("dark");
				if (currentIsDark !== isDark) {
					URL.revokeObjectURL(cachedUrl);
					continue;
				}
				img.setAttribute("src", cachedUrl);
				// Revoke old objectURL if it was one
				const oldSrc = img.getAttribute("data-obj-url");
				if (oldSrc?.startsWith("blob:")) {
					URL.revokeObjectURL(oldSrc);
				}
				img.setAttribute("data-obj-url", cachedUrl);
				const container = img.closest(".plantuml-diagram-container");
				if (container) {
					bindLoadHandler(img, container);
				}
			} else {
				// Cache miss — set src normally, save to cache in background
				img.setAttribute("src", next);
				const oldSrc = img.getAttribute("data-obj-url");
				if (oldSrc?.startsWith("blob:")) {
					URL.revokeObjectURL(oldSrc);
				}
				img.removeAttribute("data-obj-url");
				saveImageToCache(next);
				const container = img.closest(".plantuml-diagram-container");
				if (container) {
					bindLoadHandler(img, container);
				}
			}

			// Remove loading="lazy" on visible images so they update immediately
			if (img.getBoundingClientRect().top < window.innerHeight) {
				img.removeAttribute("loading");
			}
		}
	}

	function debouncedApplyTheme(isDark) {
		pendingApplyTheme = isDark;
		clearTimeout(applyThemeTimer);
		applyThemeTimer = setTimeout(() => {
			if (pendingApplyTheme !== null) {
				applyThemeNow(pendingApplyTheme);
				pendingApplyTheme = null;
			}
		}, 300);
	}

	function bindErrorHandler(img, container) {
		if (img.dataset.errorBound === "true") {
			return;
		}
		img.dataset.errorBound = "true";
		img.addEventListener("error", () => {
			if (container.dataset.errorShown === "true") {
				return;
			}
			container.dataset.errorShown = "true";
			// Clear interactionInit so pan-zoom can reinitialize after retry
			delete container.dataset.interactionInit;
			const wrapper = container.querySelector(".plantuml-wrapper");
			if (!wrapper) {
				return;
			}
			wrapper.innerHTML = "";
			const errorBox = document.createElement("div");
			errorBox.className = "plantuml-error";
			const msg = document.createElement("p");
			msg.textContent = "PlantUML 图表加载失败，请检查网络或服务器状态";
			const retry = document.createElement("button");
			retry.type = "button";
			retry.textContent = "重试";
			retry.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				delete container.dataset.errorShown;
				wrapper.innerHTML = "";
				const newImg = new Image();
				newImg.className = "plantuml-image";
				newImg.alt = img.alt;
				newImg.setAttribute(
					"data-light-src",
					img.getAttribute("data-light-src") || "",
				);
				newImg.setAttribute(
					"data-dark-src",
					img.getAttribute("data-dark-src") || "",
				);
				wrapper.appendChild(newImg);
				bindErrorHandler(newImg, container);
				bindLoadHandler(newImg, container);
				const isDark = document.documentElement.classList.contains("dark");
				applyThemeNow(isDark);
			});
			errorBox.appendChild(msg);
			errorBox.appendChild(retry);
			wrapper.appendChild(errorBox);
		});
	}

	function bindLoadHandler(img, container) {
		const onLoad = () => initInteraction(container);
		if (img.complete && img.naturalWidth > 0) {
			queueMicrotask(onLoad);
		} else {
			// Remove old listener if any, add new one
			if (img._loadHandler) {
				img.removeEventListener("load", img._loadHandler);
			}
			img._loadHandler = onLoad;
			img.addEventListener("load", onLoad, { once: true });
		}
	}

	function initInteraction(container) {
		if (container.dataset.interactionInit === "true") {
			return;
		}
		const img = container.querySelector(".plantuml-image");
		if (!img) {
			return;
		}
		if (!img.complete || img.naturalWidth === 0) {
			return;
		}
		container.dataset.interactionInit = "true";

		const state = { scale: 1, translateX: 0, translateY: 0 };
		const applyTransform = () => {
			img.style.transformOrigin = "center center";
			img.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
		};
		const clampScale = (next) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
		const reset = () => {
			state.scale = 1;
			state.translateX = 0;
			state.translateY = 0;
			applyTransform();
		};
		const zoomBy = (factor, originX, originY) => {
			const prev = state.scale;
			const next = clampScale(prev * factor);
			if (next === prev) {
				return;
			}
			if (typeof originX === "number" && typeof originY === "number") {
				const rect = img.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = originX - cx;
				const dy = originY - cy;
				const ratio = next / prev;
				state.translateX = state.translateX - dx * (ratio - 1);
				state.translateY = state.translateY - dy * (ratio - 1);
			}
			state.scale = next;
			applyTransform();
		};

		const controls = document.createElement("div");
		controls.className = "plantuml-controls";
		const buttons = [
			{
				label: "+",
				title: "放大",
				action: () => zoomBy(SCALE_STEP),
			},
			{
				label: "−",
				title: "缩小",
				action: () => zoomBy(1 / SCALE_STEP),
			},
			{ label: "↺", title: "重置", action: reset },
			{
				label: "⛶",
				title: "全屏",
				action: () => openFullscreen(container),
			},
		];
		buttons.forEach((btn) => {
			const el = document.createElement("button");
			el.type = "button";
			el.className = "plantuml-ctrl-btn";
			el.textContent = btn.label;
			el.title = btn.title;
			el.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				btn.action();
			});
			controls.appendChild(el);
		});
		container.appendChild(controls);

		// Wheel zoom — only intercept Ctrl/Meta+wheel
		container.addEventListener(
			"wheel",
			(event) => {
				if (!event.ctrlKey && !event.metaKey) {
					return;
				}
				event.preventDefault();
				const factor = event.deltaY < 0 ? SCALE_STEP : 1 / SCALE_STEP;
				zoomBy(factor, event.clientX, event.clientY);
			},
			{ passive: false },
		);

		let isDragging = false;
		let startX = 0;
		let startY = 0;
		let startTx = 0;
		let startTy = 0;
		const onPointerDown = (event) => {
			if (event.button !== 0 && event.pointerType !== "touch") {
				return;
			}
			if (event.target.closest(".plantuml-controls")) {
				return;
			}
			isDragging = true;
			startX = event.clientX;
			startY = event.clientY;
			startTx = state.translateX;
			startTy = state.translateY;
			container.setPointerCapture?.(event.pointerId);
			container.style.cursor = "grabbing";
		};
		const onPointerMove = (event) => {
			if (!isDragging) {
				return;
			}
			state.translateX = startTx + (event.clientX - startX);
			state.translateY = startTy + (event.clientY - startY);
			applyTransform();
		};
		const onPointerUp = (event) => {
			if (!isDragging) {
				return;
			}
			isDragging = false;
			container.releasePointerCapture?.(event.pointerId);
			container.style.cursor = "";
		};
		container.addEventListener("pointerdown", onPointerDown);
		container.addEventListener("pointermove", onPointerMove);
		container.addEventListener("pointerup", onPointerUp);
		container.addEventListener("pointercancel", onPointerUp);

		container.addEventListener("dblclick", (event) => {
			if (event.target.closest(".plantuml-controls")) {
				return;
			}
			if (state.scale !== 1) {
				reset();
			} else {
				zoomBy(SCALE_STEP * SCALE_STEP, event.clientX, event.clientY);
			}
		});

		applyTransform();
	}

	function openFullscreen(container) {
		const sourceImg = container.querySelector(".plantuml-image");
		if (!sourceImg) {
			return;
		}
		const overlay = document.createElement("div");
		overlay.className = "plantuml-fullscreen-overlay";
		const content = document.createElement("div");
		content.className = "plantuml-fs-content";
		const img = document.createElement("img");
		img.src = sourceImg.src;
		img.alt = sourceImg.alt;
		img.draggable = false;
		content.appendChild(img);

		const fsControls = document.createElement("div");
		fsControls.className = "plantuml-fs-controls";
		const state = { scale: 1, tx: 0, ty: 0 };
		const apply = () => {
			img.style.transformOrigin = "center center";
			img.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
		};
		const zoom = (factor, originX, originY) => {
			const prev = state.scale;
			const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
			if (next === prev) {
				return;
			}
			if (typeof originX === "number" && typeof originY === "number") {
				const rect = img.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = originX - cx;
				const dy = originY - cy;
				const ratio = next / prev;
				state.tx = state.tx - dx * (ratio - 1);
				state.ty = state.ty - dy * (ratio - 1);
			}
			state.scale = next;
			apply();
		};
		const resetState = () => {
			state.scale = 1;
			state.tx = 0;
			state.ty = 0;
			apply();
		};
		const close = () => {
			document.removeEventListener("keydown", onKeyDown);
			overlay.remove();
			fullscreenOverlays.delete(overlay);
		};
		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				close();
			}
		};

		const fsButtons = [
			{ label: "+", title: "放大", action: () => zoom(SCALE_STEP) },
			{
				label: "−",
				title: "缩小",
				action: () => zoom(1 / SCALE_STEP),
			},
			{ label: "↺", title: "重置", action: resetState },
			{ label: "✕", title: "关闭", action: close },
		];
		fsButtons.forEach((btn) => {
			const el = document.createElement("button");
			el.type = "button";
			el.className = "plantuml-ctrl-btn";
			el.textContent = btn.label;
			el.title = btn.title;
			el.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				btn.action();
			});
			fsControls.appendChild(el);
		});

		content.addEventListener(
			"wheel",
			(event) => {
				event.preventDefault();
				const factor = event.deltaY < 0 ? SCALE_STEP : 1 / SCALE_STEP;
				zoom(factor, event.clientX, event.clientY);
			},
			{ passive: false },
		);

		let dragging = false;
		let sx = 0;
		let sy = 0;
		let stx = 0;
		let sty = 0;
		content.addEventListener("pointerdown", (event) => {
			if (event.target.closest(".plantuml-fs-controls")) {
				return;
			}
			dragging = true;
			sx = event.clientX;
			sy = event.clientY;
			stx = state.tx;
			sty = state.ty;
			content.setPointerCapture?.(event.pointerId);
		});
		content.addEventListener("pointermove", (event) => {
			if (!dragging) {
				return;
			}
			state.tx = stx + (event.clientX - sx);
			state.ty = sty + (event.clientY - sy);
			apply();
		});
		const endDrag = (event) => {
			if (!dragging) {
				return;
			}
			dragging = false;
			content.releasePointerCapture?.(event.pointerId);
		};
		content.addEventListener("pointerup", endDrag);
		content.addEventListener("pointercancel", endDrag);

		overlay.addEventListener("click", (event) => {
			if (event.target === overlay) {
				close();
			}
		});
		overlay.appendChild(content);
		overlay.appendChild(fsControls);
		document.body.appendChild(overlay);
		fullscreenOverlays.add(overlay);
		document.addEventListener("keydown", onKeyDown);
	}

	function closeAllOverlays() {
		fullscreenOverlays.forEach((overlay) => {
			overlay.remove();
		});
		fullscreenOverlays.clear();
	}

	function initAll() {
		const containers = document.querySelectorAll(".plantuml-diagram-container");
		containers.forEach((container) => {
			const img = container.querySelector(".plantuml-image");
			if (!img) {
				return;
			}
			bindErrorHandler(img, container);
			bindLoadHandler(img, container);
		});

		// Keep browser-level lazy loading effective: cache only diagrams that are
		// close to the viewport instead of fetching every image on the page.
		const cacheVisibleImages = (images) => {
			const isDark = document.documentElement.classList.contains("dark");
			images.forEach((img) => {
				const src = img.getAttribute("src");
				if (src) saveImageToCache(src);
				const light = img.getAttribute("data-light-src") || "";
				const dark = img.getAttribute("data-dark-src") || light;
				const opposite = isDark ? light : dark;
				if (opposite && opposite !== src) saveImageToCache(opposite);
			});
		};
		const images = [...document.querySelectorAll(".plantuml-image")];
		if (typeof IntersectionObserver === "function") {
			const cacheObserver = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						observer.unobserve(entry.target);
						cacheVisibleImages([entry.target]);
					});
				},
				{ rootMargin: "300px 0px" },
			);
			images.forEach((img) => {
				cacheObserver.observe(img);
			});
		} else {
			cacheVisibleImages(
				images.filter(
					(img) => img.getBoundingClientRect().top < window.innerHeight + 300,
				),
			);
		}
	}

	// Theme change handler from coordinator
	function onThemeChange(newTheme) {
		const isDark = newTheme === "dark";
		debouncedApplyTheme(isDark);
	}

	document.addEventListener("astro:before-preparation", closeAllOverlays);
	document.addEventListener("astro:page-load", () => {
		closeAllOverlays();
		initAll();
	});

	// Subscribe to coordinator
	const coordinator = window.__diagramThemeCoordinator;
	if (coordinator) {
		coordinator.subscribe(onThemeChange);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initAll, {
			once: true,
		});
	} else {
		initAll();
	}
})();
