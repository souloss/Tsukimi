<script lang="ts">
import type {
	GroupMode,
	Relation,
} from "@components/features/knowledge-graph/graph-layout-utils";
import Icon from "@iconify/svelte";

let {
	mode,
	changeMode,
	relation = $bindable(),
	query = $bindable(),
	showLabels = $bindable(),
}: {
	mode: GroupMode;
	changeMode: (mode: GroupMode) => void;
	relation: Relation;
	query: string;
	showLabels: boolean;
} = $props();
</script>

<div class="toolbar">
	<label class="search"><Icon icon="material-symbols:search-rounded" /><span class="sr-only">搜索文章</span><input type="search" bind:value={query} placeholder="搜索文章、标签、分类…" />{#if query}<button type="button" aria-label="清除搜索" onclick={() => { query = ""; }}><Icon icon="material-symbols:close-rounded" /></button>{/if}</label>
	<div class="options">
		<div class="group-mode" role="group" aria-label="聚类方式"><button type="button" class:active={mode === "category"} aria-pressed={mode === "category"} onclick={() => changeMode("category")}>按分类</button><button type="button" class:active={mode === "domain"} aria-pressed={mode === "domain"} onclick={() => changeMode("domain")}>按标签领域</button></div>
		<label>连线<select aria-label="关系类型" bind:value={relation}><option value="all">全部关系</option><option value="reference">仅文章引用</option><option value="topic">仅主题关联</option></select></label>
		<label class="labels"><input type="checkbox" bind:checked={showLabels} />显示标题</label>
	</div>
</div>

<style>
	.toolbar { padding:.8rem; border:1px solid var(--line-divider); border-radius:.9rem; background:var(--card-bg); }
	.search { display:flex; align-items:center; gap:.5rem; height:2.5rem; padding:0 .75rem; background:var(--bg-muted); border-radius:.5rem; color:var(--text-secondary); }
	.search input { flex:1; min-width:0; background:transparent; color:var(--text-primary); border:0; outline:0; font:inherit; font-size:.85rem; }
	.search:focus-within { outline:2px solid var(--primary); outline-offset:2px; }
	.search button { background:transparent; border:0; color:var(--text-secondary); cursor:pointer; padding:.5rem; }
	.options { display:flex; flex-wrap:wrap; align-items:center; gap:.7rem 1.1rem; margin-top:.7rem; }
	.options label { display:flex; gap:.4rem; align-items:center; color:var(--text-secondary); font-size:.73rem; }
	select { font:inherit; background:var(--bg-muted); color:var(--text-primary); border:1px solid var(--line-divider); border-radius:.4rem; min-height:2.2rem; padding:.3rem; max-width:9rem; }
	.group-mode { display:flex; padding:.2rem; background:var(--bg-muted); border-radius:.5rem; }
	.group-mode button { border:0; border-radius:.35rem; padding:.45rem .65rem; background:transparent; color:var(--text-secondary); font:inherit; font-size:.75rem; cursor:pointer; }
	.group-mode button.active { background:var(--card-bg); color:var(--text-primary); box-shadow:0 1px 4px rgb(0 0 0 / .06); }
	input[type="checkbox"] { accent-color:var(--primary); width:1rem; height:1rem; }
	.labels { margin-left:auto; min-height:2.2rem; }
	button:focus-visible, select:focus-visible, input[type="checkbox"]:focus-visible { outline:2px solid var(--primary); outline-offset:2px; }
	@media (max-width:600px) { .options { gap:.55rem; } .labels { margin-left:0; } .group-mode { width:100%; } .group-mode button { flex:1; } }
</style>
