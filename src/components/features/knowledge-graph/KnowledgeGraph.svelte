<script lang="ts">
import GraphCanvas from "@components/features/knowledge-graph/GraphCanvas.svelte";
import GraphDetails from "@components/features/knowledge-graph/GraphDetails.svelte";
import GraphToolbar from "@components/features/knowledge-graph/GraphToolbar.svelte";
import {
	createGroups,
	type GroupMode,
	matchesRelation,
	type Relation,
} from "@components/features/knowledge-graph/graph-layout-utils";
import Icon from "@iconify/svelte";
import type { KnowledgeGraphData } from "@utils/knowledge-graph";

let { graph }: { graph: KnowledgeGraphData } = $props();
let mode = $state<GroupMode>("category");
let relation = $state<Relation>("all");
let query = $state("");
let activeGroup = $state<string | null>(null);
let selectedId = $state<string | null>(null);
let clickMode = $state<"open" | "inspect">("open");
let showLabels = $state(true);
const layout = $derived(createGroups(graph.nodes, mode));
const visibleIds = $derived(
	new Set(
		graph.nodes
			.filter((node) => {
				const matchesGroup =
					activeGroup === null ||
					layout.membership.get(node.id)?.id === activeGroup;
				const text = [
					node.title,
					node.description,
					node.category,
					node.series ?? "",
					...node.tags,
				]
					.join(" ")
					.toLocaleLowerCase();
				return matchesGroup && text.includes(query.trim().toLocaleLowerCase());
			})
			.map((node) => node.id),
	),
);
const edges = $derived(
	graph.edges.filter((edge) => matchesRelation(edge, relation)),
);
const selected = $derived(graph.nodes.find((node) => node.id === selectedId));

function changeMode(next: GroupMode) {
	mode = next;
	activeGroup = null;
	selectedId = null;
}
function changeGroup(id: string | null) {
	activeGroup = activeGroup === id ? null : id;
	selectedId = null;
}
</script>

<section class="knowledge-graph" aria-label="文章知识图谱">
	<header>
		<div><p class="eyebrow"><Icon icon="material-symbols:hub-outline" /> KNOWLEDGE NETWORK</p><h1>文章知识图谱</h1><p class="intro">让知识彼此连接。沿着一条线索，发现下一篇值得读的文章。</p></div>
		<div class="stats"><span><strong>{graph.stats.articles}</strong>篇文章</span><span><strong>{graph.stats.references}</strong>条引用</span><span><strong>{graph.stats.topicConnections}</strong>条主题关联</span></div>
	</header>
	<GraphToolbar {mode} {changeMode} bind:relation bind:query bind:clickMode bind:showLabels />
	<div class="knowledge-graph-groups" aria-label="分组图例">
		<button type="button" class:active={activeGroup === null} aria-pressed={activeGroup === null} onclick={() => changeGroup(null)}>全部 <small>{graph.nodes.length}</small></button>
		{#each layout.groups as group (group.id)}
			<button type="button" class:active={activeGroup === group.id} aria-pressed={activeGroup === group.id} onclick={() => changeGroup(group.id)}><i style:background={group.color} />{group.label}<small>{group.count}</small></button>
		{/each}
	</div>
	<GraphCanvas {graph} {layout} {edges} {visibleIds} {clickMode} {showLabels} bind:selectedId />
	<div class="graph-note"><span>{mode === "category" ? "同色节点属于同一分类" : "领域按系列、共享标签自动归组，无标签时使用分类"}</span><span>实线：文章引用 · 虚线：共同分类、标签或系列</span></div>
	{#if selected}
		<GraphDetails node={selected} {graph} {layout} onselect={(id) => { selectedId = id; }} onclose={() => { selectedId = null; }} />
	{/if}
	<noscript><p>启用 JavaScript 后可拖动和缩放图谱。你也可以直接阅读文章：</p><ul>{#each graph.nodes as node}<li><a href={node.url}>{node.title}</a></li>{/each}</ul></noscript>
</section>

<style>
	.knowledge-graph { color:var(--text-primary); min-width:0; }
	header { display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1.2rem; padding:.5rem 0 1.6rem; }
	.eyebrow { display:flex; gap:.5rem; align-items:center; margin:0 0 .6rem; font-size:.7rem; color:var(--primary); letter-spacing:.15em; font-weight:700; }
	h1 { font-size:clamp(1.8rem,3vw,2.6rem); margin:0; line-height:1.2; }
	.intro { margin:.8rem 0 0; color:var(--text-secondary); font-size:.85rem; line-height:1.7; }
	.stats { display:flex; gap:1.4rem; color:var(--text-secondary); font-size:.7rem; }
	.stats span { display:flex; flex-direction:column; gap:.2rem; }
	.stats strong { font-size:1.5rem; color:var(--text-primary); font-weight:600; font-variant-numeric:tabular-nums; }
	.knowledge-graph-groups { display:flex; flex-wrap:wrap; gap:.35rem; margin:1rem 0; max-height:7rem; overflow:auto; padding:.2rem; }
	.knowledge-graph-groups button { display:flex; align-items:center; gap:.4rem; padding:.4rem .7rem; min-height:2.25rem; border:1px solid transparent; border-radius:2rem; background:transparent; color:var(--text-secondary); font:inherit; font-size:.75rem; cursor:pointer; }
	.knowledge-graph-groups button:hover, .knowledge-graph-groups button.active { color:var(--text-primary); background:var(--bg-muted); border-color:var(--line-divider); }
	button:focus-visible { outline:2px solid var(--primary); outline-offset:2px; }
	.knowledge-graph-groups i { width:.55rem; height:.55rem; border-radius:50%; flex:none; }
	small { font-size:.65rem; opacity:.7; }
	.graph-note { display:flex; justify-content:space-between; flex-wrap:wrap; gap:.5rem; margin:.85rem .15rem; color:var(--text-secondary); font-size:.7rem; line-height:1.6; }
	@media (max-width:600px) { header { padding-bottom:1rem; } .stats { gap:1.8rem; } .stats strong { font-size:1.25rem; } .intro { font-size:.8rem; } }
</style>
