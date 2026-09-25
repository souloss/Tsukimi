<script lang="ts">
import Icon from "@iconify/svelte";

let {
	label,
	icon,
	onclick,
}: { label: string; icon: string; onclick: () => void } = $props();
</script>

<button type="button" title={label} aria-label={label} {onclick}><Icon {icon} /></button>

<style>
	button { display:grid; place-items:center; flex:none; width:2.5rem; height:2.5rem; border:1px solid var(--line-divider); border-radius:.6rem; color:var(--text-secondary); background:var(--card-bg); cursor:pointer; transition:background .15s, color .15s; }
	button:hover { background:var(--btn-plain-bg-hover); color:var(--primary); }
	button:focus-visible { outline:2px solid var(--primary); outline-offset:3px; }
	button :global(svg) { font-size:1.25rem; }
</style>
