<script lang="ts">
import GraphButton from "@components/features/knowledge-graph/GraphButton.svelte";
import {
	createGraphSimulation,
	type GroupLayout,
	type LayoutNode,
	seedNodes,
} from "@components/features/knowledge-graph/graph-layout-utils";
import { useGraphViewport } from "@components/features/knowledge-graph/useGraphViewport.svelte";
import type {
	KnowledgeGraphData,
	KnowledgeGraphEdge,
} from "@utils/knowledge-graph";
import { onMount, untrack } from "svelte";

let {
	graph,
	layout,
	edges,
	visibleIds,
	showLabels,
	focusGroup = null,
	focusRequest = 0,
	selectedId = $bindable(null),
}: {
	graph: KnowledgeGraphData;
	layout: GroupLayout;
	edges: KnowledgeGraphEdge[];
	visibleIds: Set<string>;
	showLabels: boolean;
	focusGroup?: string | null;
	focusRequest?: number;
	selectedId?: string | null;
} = $props();
// D3 owns mutable positions; each tick publishes one snapshot for Svelte.
let simulationNodes: LayoutNode[] = seedNodes(graph.nodes, layout);
let positions = $state.raw<LayoutNode[]>(
	simulationNodes.map((node) => ({ ...node })),
);
let simulation: ReturnType<typeof createGraphSimulation> | undefined;
let mounted = $state(false);
let reducedMotion = $state(false);
let settling = $state(false);
let hoveredId = $state<string | null>(null);
let tooltip = $state<{ x: number; y: number } | null>(null);
let graphViewport: HTMLDivElement;
let graphSvg: SVGSVGElement;
const nodesById = $derived(new Map(positions.map((node) => [node.id, node])));
const focusId = $derived(hoveredId ?? selectedId);
const activeEdges = $derived(
	edges.filter(
		(edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target),
	),
);
const neighbors = $derived.by(() => {
	const ids = new Set(focusId ? [focusId] : []);
	for (const edge of activeEdges) {
		if (edge.source === focusId) ids.add(edge.target);
		if (edge.target === focusId) ids.add(edge.source);
	}
	return ids;
});
const hovered = $derived(hoveredId ? nodesById.get(hoveredId) : undefined);

function publish() {
	positions = simulationNodes.map((node) => ({ ...node }));
}
const viewport = useGraphViewport(
	() => graphSvg,
	(snapshot, point) => {
		const node = simulationNodes.find((item) => item.id === snapshot.id);
		if (!node) return;
		hoveredId = null;
		tooltip = null;
		if (point) {
			node.fx = point.x;
			node.fy = point.y;
			node.x = point.x;
			node.y = point.y;
			if (!reducedMotion) {
				settling = true;
				simulation?.alphaTarget(0.18).restart();
			}
			publish();
		} else {
			node.fx = null;
			node.fy = null;
			if (reducedMotion) {
				simulation?.alpha(0.6).tick(100);
				publish();
			} else simulation?.alphaTarget(0).restart();
		}
	},
);
function fit() {
	viewport.fit(positions.filter((node) => visibleIds.has(node.id)));
}

$effect(() => {
	// Only changes to layout, relation selection, or motion preference restart physics.
	const nextLayout = layout;
	const nextEdges = edges;
	const ready = mounted;
	const reduce = reducedMotion;
	if (!ready) return;
	return untrack(() => {
		simulationNodes = seedNodes(graph.nodes, nextLayout);
		simulation = createGraphSimulation(simulationNodes, nextEdges);
		// Warm up before display so the first frame already reflects the relationships.
		simulation.tick(reduce ? 140 : 45);
		publish();
		viewport.resetInteraction();
		viewport.fit(simulationNodes);
		settling = !reduce;
		simulation.on("tick", publish).on("end", () => {
			settling = false;
		});
		if (!reduce) simulation.restart();
		const current = simulation;
		return () => current.stop();
	});
});

$effect(() => {
	const request = focusRequest;
	const groupId = focusGroup;
	if (!mounted || request === 0) return;
	const frame = requestAnimationFrame(() => {
		const target = untrack(() =>
			simulationNodes.filter(
				(node) =>
					visibleIds.has(node.id) &&
					(groupId === null || layout.membership.get(node.id)?.id === groupId),
			),
		);
		if (target.length) viewport.fit(target, false, groupId ? 2.4 : 1.6);
	});
	return () => cancelAnimationFrame(frame);
});

function nodeClick(event: MouseEvent, node: LayoutNode) {
	if (viewport.click(event)) return;
	if (!visibleIds.has(node.id)) {
		event.preventDefault();
		return;
	}
}
function hover(event: PointerEvent, node: LayoutNode) {
	if (
		!visibleIds.has(node.id) ||
		viewport.isDragging() ||
		event.pointerType === "touch"
	)
		return;
	const box = graphViewport.getBoundingClientRect();
	hoveredId = node.id;
	tooltip = {
		x: Math.max(10, Math.min(box.width - 250, event.clientX - box.left + 14)),
		y: Math.max(10, Math.min(box.height - 100, event.clientY - box.top + 14)),
	};
}
function nodeKey(event: KeyboardEvent, node: LayoutNode) {
	if (event.key === " ") {
		event.preventDefault();
		selectedId = node.id;
	}
}
function canvasKey(event: KeyboardEvent) {
	viewport.keydown(event);
	if (event.target === graphSvg && event.key === "0") fit();
	if (event.key === "Escape") {
		selectedId = null;
		hoveredId = null;
		tooltip = null;
	}
}

onMount(() => {
	const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const updateMotion = () => {
		reducedMotion = motion.matches;
	};
	updateMotion();
	motion.addEventListener("change", updateMotion);
	const resize = () => {
		const box = graphViewport.getBoundingClientRect();
		viewport.resize(box.width, box.height);
		viewport.fit(simulationNodes, true);
	};
	resize();
	const observer = new ResizeObserver(resize);
	observer.observe(graphViewport);
	const wheel = (event: WheelEvent) => {
		tooltip = null;
		viewport.wheel(event);
	};
	graphSvg.addEventListener("wheel", wheel, { passive: false });
	mounted = true;
	return () => {
		observer.disconnect();
		simulation?.stop();
		motion.removeEventListener("change", updateMotion);
		graphSvg.removeEventListener("wheel", wheel);
	};
});
</script>

<div class="canvas-wrap" bind:this={graphViewport} data-ready={mounted}>
	<div class="canvas-caption" aria-live="polite"><span><i class:settling />{settling ? "正在整理关系" : "探索知识之间的联系"}</span><span>{visibleIds.size} / {graph.nodes.length} 篇文章</span></div>
	<svg bind:this={graphSvg} viewBox={`0 0 ${viewport.view.width} ${viewport.view.height}`} role="group" aria-label="文章知识网络图" aria-describedby="graph-controls-help" tabindex="0" onpointerdown={(event) => viewport.down(event)} onpointermove={viewport.move} onpointerup={viewport.up} onpointercancel={viewport.up} onlostpointercapture={viewport.up} onkeydown={canvasKey}>
		<g class="graph-world" transform={`translate(${viewport.view.x} ${viewport.view.y}) scale(${viewport.view.scale})`}>
			<g class="edges" aria-hidden="true">{#each activeEdges as edge (edge.id)}{@const source = nodesById.get(edge.source)}{@const target = nodesById.get(edge.target)}{#if source && target}<line class:reference={edge.kind === "reference"} class:topic={edge.kind !== "reference"} class:highlighted={edge.source === focusId || edge.target === focusId} class:dimmed={Boolean(focusId && edge.source !== focusId && edge.target !== focusId)} x1={source.x} y1={source.y} x2={target.x} y2={target.y} vector-effect="non-scaling-stroke" />{/if}{/each}</g>
			<g class="nodes">{#each positions as node (node.id)}
				{@const group = layout.membership.get(node.id)}
				<a class="node" href={node.url} data-node-id={node.id} data-group={group?.id} class:dimmed={!visibleIds.has(node.id) || Boolean(focusId && !neighbors.has(node.id))} class:selected={selectedId === node.id} transform={`translate(${node.x} ${node.y})`} style:color={group?.color} tabindex={visibleIds.has(node.id) ? 0 : -1} aria-label={`${node.title}，${group?.label}`} aria-hidden={!visibleIds.has(node.id)} style:pointer-events={visibleIds.has(node.id) ? undefined : "none"} onpointerdown={(event) => viewport.down(event, node)} onclick={(event) => nodeClick(event, node)} onkeydown={(event) => nodeKey(event, node)} onpointerenter={(event) => hover(event, node)} onpointermove={(event) => hover(event, node)} onpointerleave={() => { hoveredId = null; tooltip = null; }} onfocus={() => { hoveredId = node.id; }} onblur={() => { hoveredId = null; }}>
					<circle class="hit-area" r={Math.max(20, node.radius + 9)} />
					<circle class="node-halo" r={node.radius + 6} />
					<circle class="node-dot" r={node.radius} />
					{#if (showLabels && (positions.length < 80 || viewport.view.scale > 1 || node.degree > 3)) || focusId === node.id || selectedId === node.id}<text class="node-label" text-anchor="middle" y={node.radius + 20}>{node.title.length > 20 && focusId !== node.id ? `${node.title.slice(0, 20)}…` : node.title}</text>{/if}
				</a>
			{/each}</g>
		</g>
	</svg>
	{#if !graph.nodes.length || !visibleIds.size}<div class="empty" role="status"><strong>{graph.nodes.length ? "没有找到匹配的文章" : "知识网络等待第一篇文章"}</strong><span>{graph.nodes.length ? "试试其他关键词，或切换到全部分组。" : "文章发布后会自动出现在这里。"}</span></div>{/if}
	{#if tooltip && hovered}<div class="tooltip" style:left={`${tooltip.x}px`} style:top={`${tooltip.y}px`}><strong>{hovered.title}</strong><span>{layout.membership.get(hovered.id)?.label} · {hovered.degree} 个连接</span><small>点击阅读文章 · 拖动探索关联 · 空格键查看详情</small></div>{/if}
	<div class="canvas-controls"><span class="zoom-level">{Math.round(viewport.view.scale * 100)}%</span><GraphButton label="缩小" icon="material-symbols:remove-rounded" onclick={() => viewport.zoom(1 / 1.25)} /><GraphButton label="放大" icon="material-symbols:add-rounded" onclick={() => viewport.zoom(1.25)} /><GraphButton label="适应视图" icon="material-symbols:fit-screen-rounded" onclick={fit} /></div>
	<p id="graph-controls-help" class="controls-help">拖动节点 / 空白处平移 · 滚轮 / 双指缩放<span> · 方向键平移，＋ / －缩放，0 复位</span></p>
</div>

<style>
	.canvas-wrap { position:relative; height:36rem; min-width:0; overflow:hidden; border:1px solid var(--line-divider); border-radius:.9rem; background:color-mix(in srgb,var(--card-bg) 65%,var(--bg-muted)); }
	svg { display:block; width:100%; height:100%; touch-action:none; cursor:grab; }
	svg:active { cursor:grabbing; }
	svg:focus-visible { outline:2px solid var(--primary); outline-offset:-4px; }
	.canvas-caption { position:absolute; top:1rem; left:1.2rem; right:1.2rem; display:flex; justify-content:space-between; gap:.5rem; font-size:.7rem; color:var(--text-secondary); pointer-events:none; }
	.canvas-caption span:first-child { display:flex; align-items:center; gap:.4rem; }
	.canvas-caption i { width:.4rem; height:.4rem; border-radius:50%; background:var(--primary); opacity:.6; }
	i.settling { animation:pulse 1s ease-in-out infinite alternate; }
	.edges { pointer-events:none; }
	.edges line { stroke:var(--text-secondary); stroke-width:1.2; opacity:.3; transition:opacity .15s; }
	.edges .topic { stroke-dasharray:3 5; opacity:.24; }
	.edges .reference { stroke-width:1.5; opacity:.5; }
	.edges line.highlighted { stroke:var(--primary); opacity:.95; stroke-width:2; }
	.edges line.dimmed { opacity:.06; }
	.node { cursor:pointer; outline:none; transition:opacity .15s; }
	.node.dimmed { opacity:.12; }
	.hit-area { fill:transparent; pointer-events:all; }
	.node-halo { fill:currentColor; opacity:0; stroke:currentColor; stroke-width:1; }
	.node-dot { fill:currentColor; stroke:var(--card-bg); stroke-width:2; }
	.node:hover .node-halo, .node:focus-visible .node-halo, .node.selected .node-halo { opacity:.3; }
	.node:focus-visible .node-halo { stroke-width:3; opacity:.65; }
	.node-label { fill:var(--text-secondary); font-size:11px; stroke:var(--card-bg); stroke-width:3px; stroke-linejoin:round; paint-order:stroke; }
	.node:hover .node-label, .node:focus-visible .node-label { fill:var(--text-primary); }
	.tooltip { position:absolute; width:235px; max-width:calc(100% - 20px); padding:.7rem .8rem; border:1px solid var(--line-divider); border-radius:.6rem; background:var(--card-bg); box-shadow:0 8px 28px rgb(0 0 0 / .1); pointer-events:none; }
	.tooltip strong, .tooltip span, .tooltip small { display:block; overflow-wrap:anywhere; }
	.tooltip strong { font-size:.8rem; }
	.tooltip span { margin-top:.3rem; color:var(--text-secondary); font-size:.7rem; }
	.tooltip small { margin-top:.6rem; color:var(--text-secondary); font-size:.65rem; }
	.canvas-controls { position:absolute; right:1rem; bottom:1rem; display:flex; align-items:center; gap:.3rem; }
	.zoom-level { margin-right:.4rem; font-size:.7rem; color:var(--text-secondary); font-variant-numeric:tabular-nums; }
	.controls-help { position:absolute; left:1.2rem; bottom:4rem; margin:0; max-width:calc(100% - 2.4rem); font-size:.65rem; color:var(--text-secondary); pointer-events:none; }
	.controls-help span { display:block; margin-top:.3rem; }
	.empty { position:absolute; top:45%; left:5%; right:5%; display:grid; gap:.6rem; text-align:center; pointer-events:none; background:var(--card-bg); padding:1.2rem; border-radius:.7rem; }
	.empty strong { font-size:1rem; }.empty span { color:var(--text-secondary); font-size:.8rem; }
	@keyframes pulse { to { opacity:1; } }
	@media (max-width:600px) { .canvas-wrap { height:31rem; } .controls-help span { display:none; } }
	@media (prefers-reduced-motion:reduce) { i.settling { animation:none; } .node, .edges line { transition:none; } }
</style>
