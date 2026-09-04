<script module lang="ts">
import { addCollection, type IconifyJSON } from "@iconify/svelte";

import { localIconCollections } from "@/generated/svelte-icon-collections";

for (const collection of localIconCollections) {
	addCollection(collection as IconifyJSON);
}
</script>

<script lang="ts">
import BaseIcon, { type IconProps } from "@iconify/svelte";

type Props = IconProps & { class?: string };
const props: Props = $props();
</script>

<BaseIcon {...props} />
