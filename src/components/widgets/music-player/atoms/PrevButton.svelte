<script lang="ts">
import Icon from "@components/atoms/Icon/LocalIcon.svelte";
import Key from "../../../../i18n/i18nKey";
import { i18n } from "../../../../i18n/translation";

interface Props {
	onclick: () => void;
	disabled?: boolean;
}

const { onclick, disabled = false }: Props = $props();
</script>

<button
	class="btn-plain w-10 h-10 rounded-lg"
	aria-label={i18n(Key.musicPlayerPrevious)}
	{onclick}
	{disabled}
>
	<Icon icon="material-symbols:skip-previous" class="text-xl" />
</button>
