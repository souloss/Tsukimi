<script lang="ts">
import Icon from "@components/atoms/Icon/LocalIcon.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount } from "svelte";
import { contextMenuConfig } from "@/config";

let open = $state(false);
let x = $state(0);
let y = $state(0);
let selectionText = $state("");

function closeMenu() {
	open = false;
}

function placeMenu(event: MouseEvent) {
	const width = 224;
	const height = 164;
	x = Math.max(8, Math.min(event.clientX, window.innerWidth - width - 12));
	y = Math.max(8, Math.min(event.clientY, window.innerHeight - height - 12));
}

async function copyText(text: string) {
	if (!text) return;
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		textarea.remove();
	}
	closeMenu();
}

function copySelection() {
	void copyText(selectionText);
}

function copyLink() {
	void copyText(window.location.href);
}

function backToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
	closeMenu();
}

onMount(() => {
	const handleContextMenu = (event: MouseEvent) => {
		if (!window.matchMedia("(pointer: fine)").matches) return;
		const target = event.target;
		if (
			target instanceof Element &&
			target.closest("input, textarea, select, [contenteditable='true']")
		) {
			return;
		}
		const selection = window.getSelection()?.toString().trim() ?? "";
		selectionText = selection;
		const hasAction =
			(contextMenuConfig.copySelection && Boolean(selectionText)) ||
			contextMenuConfig.backToTop ||
			contextMenuConfig.copyLink;
		if (!hasAction) {
			return;
		}
		event.preventDefault();
		placeMenu(event);
		open = true;
	};
	const handlePointerDown = (event: PointerEvent) => {
		if (
			!(event.target instanceof Element) ||
			!event.target.closest("[data-context-menu]")
		) {
			closeMenu();
		}
	};
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") closeMenu();
	};

	document.addEventListener("contextmenu", handleContextMenu);
	document.addEventListener("pointerdown", handlePointerDown);
	document.addEventListener("keydown", handleKeyDown);
	return () => {
		document.removeEventListener("contextmenu", handleContextMenu);
		document.removeEventListener("pointerdown", handlePointerDown);
		document.removeEventListener("keydown", handleKeyDown);
	};
});
</script>

{#if open}
	<nav
		class="context-menu"
		data-context-menu
		style={`left: ${x}px; top: ${y}px`}
		aria-label="Context menu"
		role="menu"
		oncontextmenu={(event) => event.preventDefault()}
	>
		{#if contextMenuConfig.copySelection && selectionText}
			<button type="button" role="menuitem" onclick={copySelection}>
				<Icon icon="material-symbols:content-copy" />
				<span>{i18n(I18nKey.contextCopySelection)}</span>
			</button>
		{/if}
		{#if contextMenuConfig.backToTop}
			<button type="button" role="menuitem" onclick={backToTop}>
				<Icon icon="material-symbols:vertical-align-top" />
				<span>{i18n(I18nKey.contextBackToTop)}</span>
			</button>
		{/if}
		{#if contextMenuConfig.copyLink}
			<button type="button" role="menuitem" onclick={copyLink}>
				<Icon icon="material-symbols:link" />
				<span>{i18n(I18nKey.contextCopyLink)}</span>
			</button>
		{/if}
	</nav>
{/if}

<style>
	.context-menu {
		position: fixed;
		z-index: 100;
		width: 14rem;
		padding: 0.35rem;
		border: 1px solid var(--line-divider);
		border-radius: var(--shape-md);
		background: var(--float-panel-bg);
		box-shadow: 0 12px 32px rgb(0 0 0 / 0.16);
		backdrop-filter: blur(14px);
	}

	.context-menu button {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 0.6rem;
		padding: 0.6rem 0.7rem;
		border-radius: var(--shape-sm);
		color: var(--text-primary);
		font-size: 0.85rem;
		text-align: left;
	}

	.context-menu button:hover,
	.context-menu button:focus-visible {
		background: var(--btn-regular-bg-hover);
		outline: none;
	}
</style>
