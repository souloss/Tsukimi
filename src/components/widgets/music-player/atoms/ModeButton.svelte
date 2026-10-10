<script lang="ts">
import Icon from "@components/atoms/Icon/LocalIcon.svelte";
import Key from "../../../../i18n/i18nKey";
import { i18n } from "../../../../i18n/translation";

import type { RepeatMode } from "../types";

interface Props {
	mode: "shuffle" | "repeat";
	isActive: boolean;
	repeatMode?: RepeatMode;
	onclick: () => void;
	disabled?: boolean;
}

const {
	mode,
	isActive,
	repeatMode = 0,
	onclick,
	disabled = false,
}: Props = $props();
</script>

{#if mode === "shuffle"}
	<button
		class="w-10 h-10 rounded-lg"
		class:btn-regular={isActive}
		class:btn-plain={!isActive}
		{onclick}
		{disabled}
		aria-label={i18n(Key.musicPlayerShuffle)}
	>
		<Icon icon="material-symbols:shuffle" class="text-lg" />
	</button>
{:else}
	<button
		class="w-10 h-10 rounded-lg"
		class:btn-regular={isActive}
		class:btn-plain={!isActive}
		{onclick}
		aria-label={repeatMode === 1 ? i18n(Key.musicPlayerRepeatOne) : i18n(Key.musicPlayerRepeat)}
	>
		{#if repeatMode === 1}
			<Icon icon="material-symbols:repeat-one" class="text-lg" />
		{:else if repeatMode === 2}
			<Icon icon="material-symbols:repeat" class="text-lg" />
		{:else}
			<Icon icon="material-symbols:repeat" class="text-lg opacity-50" />
		{/if}
	</button>
{/if}
