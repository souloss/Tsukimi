<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { navigateToPage } from "@utils/navigation-utils";
import { url } from "@utils/url-utils";
import { onDestroy, onMount } from "svelte";

import type { SearchResult } from "@/global";

const {
	pagefindGlobal = "pagefind",
	pagefindLoader = "loadPagefind",
	variant = "icon",
	filters,
	shortcutEnabled = true,
}: {
	pagefindGlobal?: string;
	pagefindLoader?: string;
	variant?: "icon" | "pill" | "sidebar";
	filters?: Record<string, string>;
	shortcutEnabled?: boolean;
} = $props();

let isOpen = $state(false);
let query = $state("");
let results = $state<SearchResult[]>([]);
let activeIndex = $state(-1);
let isLoading = $state(false);
let initialized = $state(false);
let searchUnavailable = $state(false);

let searchIndex: any = null;
let debounceTimer: ReturnType<typeof setTimeout>;
let isComposing = false;
let ignoreNextInput = false;

let portalContainer: HTMLDivElement | null = null;
let overlayEl: HTMLDivElement | null = null;
let modalEl: HTMLDivElement | null = null;
let inputEl: HTMLInputElement | null = null;
let resultsListEl: HTMLUListElement | null = null;

const fakeResults: SearchResult[] = [
	{
		url: url("/"),
		meta: { title: "This Is a Fake Search Result" },
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: { title: "If You Want to Test the Search" },
		excerpt: "Try running <mark>pnpm build && pnpm preview</mark> instead.",
	},
];

async function loadIndex(): Promise<boolean> {
	if (searchIndex) {
		return true;
	}

	if (import.meta.env.DEV) {
		initialized = true;
		searchUnavailable = true;
		return false;
	}

	const globalRef = (window as any)[pagefindGlobal];
	if (globalRef?.search) {
		searchIndex = globalRef;
		initialized = true;
		return true;
	}

	const loaderFn = (window as any)[pagefindLoader];
	if (typeof loaderFn === "function") {
		try {
			await loaderFn();
		} catch {
			// ignore
		}
	}

	const afterLoad = (window as any)[pagefindGlobal];
	if (afterLoad?.search) {
		searchIndex = afterLoad;
		initialized = true;
		return true;
	}

	initialized = true;
	searchUnavailable = true;
	return false;
}

async function doSearch(term: string) {
	if (!term.trim()) {
		results = [];
		return;
	}
	isLoading = true;
	updateModalBody();
	try {
		if (import.meta.env.DEV) {
			results = fakeResults;
			activeIndex = -1;
			updateModalBody();
			return;
		}

		const loaded = await loadIndex();
		if (!loaded || !searchIndex) {
			results = [];
			updateModalBody();
			return;
		}

		const searchOpts: { filters?: Record<string, string> } = {};
		if (filters) {
			searchOpts.filters = JSON.parse(JSON.stringify(filters));
		}
		const response = await searchIndex.search(term, searchOpts);
		const items = await Promise.all(
			response.results.slice(0, 15).map(async (r: any) => {
				try {
					const data = await r.data?.();
					return data ?? r;
				} catch {
					return r;
				}
			}),
		);
		results = items;
		activeIndex = -1;
		updateModalBody();
	} catch (error) {
		console.error("Search error:", error);
		results = [];
		updateModalBody();
	} finally {
		isLoading = false;
		updateModalBody();
	}
}

function onInput(e: Event) {
	if (isComposing) return;
	if (ignoreNextInput) {
		ignoreNextInput = false;
		return;
	}
	const ie = e as InputEvent;
	if (ie.isComposing) return;
	const val = (e.target as HTMLInputElement).value;
	query = val;
	clearTimeout(debounceTimer);
	const hasCJK = /[一-鿿぀-ゟ゠-ヿ가-힯]/.test(val);
	debounceTimer = setTimeout(() => doSearch(val), hasCJK ? 500 : 200);
}

function onCompositionStart() {
	isComposing = true;
	ignoreNextInput = false;
}

function onCompositionEnd(e: Event) {
	isComposing = false;
	ignoreNextInput = true;
	const val = (e.target as HTMLInputElement).value;
	query = val;
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => doSearch(val), 300);
}

function navigate(index: number) {
	const r = results[index];
	if (!r) {
		return;
	}
	const targetUrl = r.sub_results?.[0]?.url ?? r.url;
	closeModal();
	navigateToPage(targetUrl);
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === "ArrowDown") {
		e.preventDefault();
		activeIndex = Math.min(activeIndex + 1, results.length - 1);
		updateActiveClass();
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		activeIndex = Math.max(activeIndex - 1, 0);
		updateActiveClass();
	} else if (e.key === "Enter" && activeIndex >= 0) {
		e.preventDefault();
		navigate(activeIndex);
	} else if (e.key === "Escape") {
		closeModal();
	}
}

function updateActiveClass() {
	if (!resultsListEl) return;
	resultsListEl.querySelectorAll(".search-modal-result").forEach((el, j) => {
		el.classList.toggle("active", j === activeIndex);
	});
}

function openModal() {
	isOpen = true;
	query = "";
	results = [];
	activeIndex = -1;
	document.body.style.overflow = "hidden";
	createModal();
}

function closeModal() {
	isOpen = false;
	document.body.style.overflow = "";
	destroyModal();
}

function createModal() {
	if (!portalContainer) {
		portalContainer = document.createElement("div");
		document.body.appendChild(portalContainer);
	}

	portalContainer.innerHTML = "";

	const overlay = document.createElement("div");
	overlay.className = "search-modal-overlay";
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) {
			closeModal();
		}
	});

	const modal = document.createElement("div");
	modal.className = "search-modal";
	modal.addEventListener("click", (e) => e.stopPropagation());

	const inputRow = document.createElement("div");
	inputRow.className = "search-modal-input-row";
	inputRow.innerHTML = `
		<svg class="search-modal-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/>
		</svg>
		<input id="search-modal-input" type="text" placeholder="${i18n(I18nKey.search)}" />
		<button class="search-modal-close-btn" aria-label="Close"><kbd>ESC</kbd></button>
	`;
	inputEl = inputRow.querySelector("input")!;
	const closeBtn = inputRow.querySelector(".search-modal-close-btn")!;
	inputEl.addEventListener("input", onInput);
	inputEl.addEventListener("compositionstart", onCompositionStart);
	inputEl.addEventListener("compositionend", onCompositionEnd);
	inputEl.addEventListener("keydown", onKeyDown);
	inputEl.value = query;
	closeBtn.addEventListener("click", closeModal);

	modal.appendChild(inputRow);

	const body = document.createElement("div");
	body.className = "search-modal-body";
	modal.appendChild(body);

	overlay.appendChild(modal);
	portalContainer.appendChild(overlay);

	overlayEl = overlay;
	modalEl = modal;
	resultsListEl = null;

	updateModalBody();

	requestAnimationFrame(() => {
		inputEl?.focus();
	});
}

function destroyModal() {
	if (portalContainer) {
		portalContainer.innerHTML = "";
	}
	overlayEl = null;
	modalEl = null;
	inputEl = null;
	resultsListEl = null;
}

function updateModalBody() {
	if (!modalEl) return;
	const body = modalEl.querySelector(".search-modal-body");
	if (!body) return;
	body.innerHTML = "";

	if (isLoading) {
		const loadingEl = document.createElement("div");
		loadingEl.className = "search-modal-loading";
		loadingEl.innerHTML = '<div class="search-modal-spinner"></div>';
		body.appendChild(loadingEl);
		return;
	}

	if (results.length > 0) {
		const ul = document.createElement("ul");
		ul.className = "search-modal-results";
		results.forEach((item, i) => {
			const li = document.createElement("li");
			const btn = document.createElement("button");
			btn.className = `search-modal-result${i === activeIndex ? " active" : ""}`;
			btn.addEventListener("click", () => navigate(i));
			btn.addEventListener("mouseenter", () => {
				activeIndex = i;
				ul.querySelectorAll(".search-modal-result").forEach((el, j) => {
					el.classList.toggle("active", j === i);
				});
			});

			const title = document.createElement("span");
			title.className = "search-modal-result-title";
			title.textContent = item.meta?.title ?? "";
			btn.appendChild(title);

			if (item.excerpt) {
				const excerpt = document.createElement("span");
				excerpt.className = "search-modal-result-excerpt";
				excerpt.innerHTML = item.excerpt;
				btn.appendChild(excerpt);
			}

			li.appendChild(btn);
			ul.appendChild(li);
		});
		body.appendChild(ul);
		resultsListEl = ul;
	} else if (query && !isLoading) {
		const emptyEl = document.createElement("div");
		emptyEl.className = "search-modal-empty";
		emptyEl.textContent = i18n(I18nKey.noData);
		body.appendChild(emptyEl);
	}
}

onMount(() => {
	if (!shortcutEnabled) {
		return;
	}
	function onKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			if (isOpen) {
				closeModal();
			} else {
				openModal();
			}
		}
	}
	document.addEventListener("keydown", onKeydown);
	return () => document.removeEventListener("keydown", onKeydown);
});

onDestroy(() => {
	if (isOpen) {
		document.body.style.overflow = "";
	}
	clearTimeout(debounceTimer);
	if (portalContainer) {
		portalContainer.remove();
		portalContainer = null;
	}
});
</script>

<!-- Trigger buttons (rendered by Svelte in component's DOM position) -->
{#if variant === "icon"}
	<button
		class="search-modal-icon-btn btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
		onclick={openModal}
		aria-label={i18n(I18nKey.search)}
		title="{i18n(I18nKey.search)} (⌘K)"
	>
		<Icon icon="material-symbols:search" class="text-[1.25rem]" />
	</button>
{:else if variant === "pill"}
	<button
		class="search-modal-pill-btn"
		onclick={openModal}
		aria-label={i18n(I18nKey.search)}
		title="{i18n(I18nKey.search)} (⌘K)"
	>
		<Icon icon="material-symbols:search-rounded" width="20" height="20" />
		<span class="search-modal-pill-hint">
			<kbd>⌘</kbd><kbd>K</kbd>
		</span>
	</button>
{:else}
	<button
		class="search-modal-sidebar-btn"
		onclick={openModal}
		aria-label={i18n(I18nKey.search)}
	>
		<Icon icon="material-symbols:search-rounded" width="18" height="18" />
		<span>{i18n(I18nKey.search)}</span>
		<kbd class="search-modal-kbd">⌘K</kbd>
	</button>
{/if}

<style>
	/* ---------- Icon trigger (navbar) ---------- */
	.search-modal-icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border: none;
		background: transparent;
	}

	/* ---------- Pill trigger (docs navbar) ---------- */
	.search-modal-pill-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border-radius: 0.5rem;
		border: 1px solid var(--line-color);
		background: var(--card-bg);
		color: var(--text-75);
		font-size: 0.8125rem;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
		white-space: nowrap;
	}
	.search-modal-pill-btn:hover {
		border-color: var(--primary);
		background: var(--btn-plain-bg-hover);
	}
	.search-modal-pill-hint {
		display: inline-flex;
		gap: 0.125rem;
		color: var(--text-30);
		font-size: 0.6875rem;
		line-height: 1;
	}
	.search-modal-pill-hint kbd {
		padding: 0.1rem 0.25rem;
		border-radius: 0.25rem;
		border: 1px solid var(--line-color);
		background: var(--btn-card-bg-hover);
		font-family: inherit;
		font-size: inherit;
	}
	@media (max-width: 768px) {
		.search-modal-pill-btn {
			padding: 0.25rem;
		}
		.search-modal-pill-hint {
			display: none;
		}
	}

	/* ---------- Sidebar trigger ---------- */
	.search-modal-sidebar-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--entry-border, var(--line-color));
		border-radius: 0.5rem;
		background: var(--card-bg);
		color: var(--text-50);
		font-size: 0.8125rem;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}
	.search-modal-sidebar-btn:hover {
		border-color: var(--primary);
		background: var(--btn-plain-bg-hover);
	}
	.search-modal-sidebar-btn span {
		flex: 1;
		text-align: left;
		color: var(--text-30);
	}
	.search-modal-kbd {
		padding: 0.1rem 0.375rem;
		border-radius: 0.25rem;
		border: 1px solid var(--line-color);
		background: var(--btn-card-bg-hover);
		color: var(--text-30);
		font-family: inherit;
		font-size: 0.6875rem;
	}

	/* ---------- Modal overlay — :global for body-level rendering ---------- */
	:global(.search-modal-overlay) {
		position: fixed !important;
		inset: 0 !important;
		z-index: 9999 !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	:global(.search-modal-icon) {
		color: var(--text-50);
		flex-shrink: 0;
	}

	/* ---------- Modal container ---------- */
	:global(.search-modal) {
		width: min(560px, 90vw);
		max-height: 70vh;
		display: flex;
		flex-direction: column;
		border-radius: 0.75rem;
		border: 1px solid var(--line-color);
		background: var(--card-bg);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		overflow: hidden;
	}

	/* ---------- Input row ---------- */
	:global(.search-modal-input-row) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--line-color);
		color: var(--text-50);
	}
	:global(.search-modal-input-row input) {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--text-75);
		font-size: 0.9375rem;
		outline: none;
	}
	:global(.search-modal-input-row input::placeholder) {
		color: var(--text-30);
	}
	:global(.search-modal-close-btn) {
		padding: 0.15rem 0.4rem;
		border-radius: 0.25rem;
		border: 1px solid var(--line-color);
		background: var(--btn-card-bg-hover);
		color: var(--text-30);
		font-size: 0.6875rem;
		cursor: pointer;
	}
	:global(.search-modal-close-btn kbd) {
		font-family: inherit;
	}

	/* ---------- Modal body (scrollable area) ---------- */
	:global(.search-modal-body) {
		overflow-y: auto;
		flex: 1;
		scrollbar-width: thin;
		scrollbar-color: var(--scrollbar-bg) transparent;
	}

	:global(.search-modal-body::-webkit-scrollbar) {
		width: 6px;
	}
	:global(.search-modal-body::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(.search-modal-body::-webkit-scrollbar-thumb) {
		background: var(--scrollbar-bg);
		border-radius: 3px;
	}
	:global(.search-modal-body::-webkit-scrollbar-thumb:hover) {
		background: var(--primary);
	}
	:global(.search-modal-body::-webkit-scrollbar-thumb:active) {
		background: var(--scrollbar-bg-active);
	}

	/* ---------- Loading spinner ---------- */
	:global(.search-modal-loading) {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	:global(.search-modal-spinner) {
		width: 1.5rem;
		height: 1.5rem;
		border: 2px solid var(--line-color);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: search-modal-spin 0.6s linear infinite;
	}
	@keyframes search-modal-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ---------- Results list ---------- */
	:global(.search-modal-results) {
		list-style: none;
		margin: 0;
		padding: 0.5rem;
	}
	:global(.search-modal-result) {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
		padding: 0.625rem 0.75rem;
		border-radius: 0.5rem;
		border: none;
		background: transparent;
		color: var(--text-75);
		text-align: left;
		cursor: pointer;
		transition: background 0.15s;
	}
	:global(.search-modal-result:hover),
	:global(.search-modal-result.active) {
		background: var(--btn-plain-bg-hover);
	}
	:global(.search-modal-result-title) {
		display: inline-flex;
		align-items: center;
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text-75);
	}
	:global(.search-modal-result-excerpt) {
		font-size: 0.75rem;
		color: var(--text-30);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	:global(.search-modal mark) {
		color: var(--primary);
		font-weight: 600;
		background: color-mix(in srgb, var(--primary) 15%, transparent);
		border-radius: 0.125rem;
		padding: 0 0.1em;
	}

	/* ---------- Empty state ---------- */
	:global(.search-modal-empty) {
		padding: 2rem;
		text-align: center;
		color: var(--text-30);
		font-size: 0.875rem;
	}
</style>
