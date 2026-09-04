<script lang="ts">
import Icon from "@components/atoms/Icon/LocalIcon.svelte";
import { DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants";
import { getStoredTheme, setTheme } from "@utils/setting-utils";
import { onDestroy, onMount } from "svelte";

import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];
let mode: LIGHT_DARK_MODE = $state(DEFAULT_THEME);
let isChanging = false;
let mounted = $state(false);
let cleanupSwupListener: (() => void) | undefined;

onMount(() => {
	mounted = true;
	mode = getStoredTheme();

	const handleContentReplace = () => {
		requestAnimationFrame(() => {
			const newMode = getStoredTheme();
			if (mode !== newMode) {
				mode = newMode;
			}
		});
	};

	const addSwupListener = () => {
		if ((window as any).swup?.hooks) {
			(window as any).swup.hooks.on("content:replace", handleContentReplace);
		}
	};

	addSwupListener();
	document.addEventListener("swup:enable", addSwupListener);

	cleanupSwupListener = () => {
		if ((window as any).swup?.hooks) {
			(window as any).swup.hooks.off("content:replace", handleContentReplace);
		}
		document.removeEventListener("swup:enable", addSwupListener);
	};
});

onDestroy(() => {
	cleanupSwupListener?.();
});

function switchScheme(
	newMode: LIGHT_DARK_MODE,
	clickCoords?: { x: number; y: number },
) {
	if (isChanging) {
		return;
	}

	isChanging = true;
	mode = newMode;
	setTheme(newMode, clickCoords);

	setTimeout(() => {
		isChanging = false;
	}, 50);
}

function toggleScheme(e: MouseEvent) {
	if (isChanging) {
		return;
	}

	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchScheme(seq[(i + 1) % seq.length], {
		x: e.clientX,
		y: e.clientY,
	});
}
</script>

<button
	aria-label="Light/Dark Mode"
	class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn z-50 transition-opacity"
	class:opacity-50={!mounted}
	class:pointer-events-none={!mounted}
	id="scheme-switch"
	onclick={toggleScheme}
	data-mode={mode}
>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== LIGHT_MODE}
		class:rotate-180={mode !== LIGHT_MODE}
	>
		<Icon
			icon="material-symbols:wb-sunny-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== DARK_MODE}
		class:rotate-180={mode !== DARK_MODE}
	>
		<Icon
			icon="material-symbols:dark-mode-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
</button>

<style>
	.theme-switch-btn::before {
		transition:
			transform 75ms ease-out,
			background-color 0ms !important;
	}
</style>
