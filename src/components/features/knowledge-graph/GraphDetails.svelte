<script lang="ts">
import GraphButton from "@components/features/knowledge-graph/GraphButton.svelte";
import type { GroupLayout } from "@components/features/knowledge-graph/graph-layout-utils";
import Icon from "@iconify/svelte";
import type {
	KnowledgeGraphData,
	KnowledgeGraphNode,
} from "@utils/knowledge-graph";

let {
	node,
	graph,
	layout,
	onselect,
	onclose,
}: {
	node: KnowledgeGraphNode;
	graph: KnowledgeGraphData;
	layout: GroupLayout;
	onselect: (id: string) => void;
	onclose: () => void;
} = $props();
const related = $derived.by(() => {
	const edges = graph.edges.filter(
		(edge) => edge.source === node.id || edge.target === node.id,
	);
	const ids = new Set(
		edges.map((edge) => (edge.source === node.id ? edge.target : edge.source)),
	);
	return {
		references: edges.filter((edge) => edge.kind === "reference").length,
		nodes: graph.nodes.filter((item) => ids.has(item.id)),
	};
});
const group = $derived(layout.membership.get(node.id));
</script>

<aside class="knowledge-graph-details" aria-label="文章关系详情">
	<div class="detail-head"><span class="category"><i style:background={group?.color} />{group?.label}</span><GraphButton label="关闭文章详情" icon="material-symbols:close-rounded" onclick={onclose} /></div>
	<h2>{node.title}</h2>
	<p class="meta">{node.published.slice(0, 10)} · {related.references} 条文章引用 · {related.nodes.length} 篇相邻文章</p>
	{#if node.description}<p class="description">{node.description}</p>{/if}
	<div class="tags">{#each node.tags as tag}<span>#{tag}</span>{/each}</div>
	<a class="details-open" href={node.url}>阅读文章 <Icon icon="material-symbols:arrow-forward-rounded" /></a>
	{#if related.nodes.length}<div class="related"><h3>继续探索</h3><div>{#each related.nodes as item}<button type="button" onclick={() => onselect(item.id)}><i style:background={layout.membership.get(item.id)?.color} />{item.title}<Icon icon="material-symbols:chevron-right-rounded" /></button>{/each}</div></div>{/if}
</aside>

<style>
	aside { margin-top:1rem; padding:1.2rem 1.4rem; border:1px solid var(--line-divider); border-radius:.9rem; background:var(--card-bg); }
	.detail-head { display:flex; justify-content:space-between; align-items:center; gap:1rem; }
	.category { display:flex; align-items:center; gap:.5rem; color:var(--text-secondary); font-size:.75rem; }
	i { width:.6rem; height:.6rem; border-radius:50%; flex:none; }
	h2 { margin:.3rem 0 .6rem; font-size:1.35rem; overflow-wrap:anywhere; }
	.meta, .description { color:var(--text-secondary); font-size:.8rem; line-height:1.8; }
	.description { max-width:65ch; }
	.tags { display:flex; flex-wrap:wrap; gap:.6rem; margin:.75rem 0; color:var(--text-secondary); font-size:.75rem; }
	.details-open { display:inline-flex; align-items:center; gap:.5rem; margin-top:.4rem; padding:.6rem 1rem; background:var(--primary); color:var(--card-bg); border-radius:.5rem; font-size:.8rem; font-weight:600; }
	.related { border-top:1px solid var(--line-divider); margin-top:1.2rem; padding-top:.9rem; }
	h3 { font-size:.75rem; color:var(--text-secondary); margin:0 0 .7rem; }
	.related > div { display:flex; flex-wrap:wrap; gap:.5rem; }
	.related button { display:flex; align-items:center; gap:.5rem; max-width:100%; padding:.5rem .7rem; border:1px solid var(--line-divider); border-radius:.5rem; background:var(--bg-muted); color:var(--text-primary); font:inherit; font-size:.75rem; text-align:left; overflow-wrap:anywhere; cursor:pointer; }
	button:focus-visible, a:focus-visible { outline:2px solid var(--primary); outline-offset:3px; }
</style>
