import type {
	KnowledgeGraphEdge,
	KnowledgeGraphNode,
} from "@utils/knowledge-graph";
import {
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	forceX,
	forceY,
	type SimulationNodeDatum,
} from "d3-force";

export type GroupMode = "category" | "domain";
export type Relation = "all" | "reference" | "topic";
export type LayoutNode = KnowledgeGraphNode &
	SimulationNodeDatum & { x: number; y: number };
export type Cluster = {
	id: string;
	label: string;
	color: string;
	count: number;
	x: number;
	y: number;
	radius: number;
};
export type GroupLayout = {
	groups: Cluster[];
	membership: Map<string, Cluster>;
};

function hash(value: string) {
	let result = 2166136261;
	for (const char of value)
		result = Math.imul(result ^ char.charCodeAt(0), 16777619);
	return result >>> 0;
}

// A domain is inferred from the existing series or the most widely shared tag.
// Sorting ties makes membership independent of publication order.
export function createGroups(
	nodes: KnowledgeGraphNode[],
	mode: GroupMode,
): GroupLayout {
	const frequencies = new Map<string, number>();
	for (const node of nodes)
		for (const tag of new Set(node.tags))
			frequencies.set(tag, (frequencies.get(tag) ?? 0) + 1);
	const grouped = new Map<string, { label: string; ids: string[] }>();
	for (const node of nodes) {
		const tag = [...node.tags].sort(
			(a, b) =>
				(frequencies.get(b) ?? 0) - (frequencies.get(a) ?? 0) ||
				a.localeCompare(b),
		)[0];
		const category = node.category.trim();
		const label =
			mode === "category"
				? category || "未分类"
				: node.series?.trim() || (tag ? `#${tag}` : category || "未分类");
		const id =
			mode === "category"
				? `category:${category}`
				: node.series?.trim()
					? `series:${node.series.trim()}`
					: tag
						? `tag:${tag}`
						: `category:${category}`;
		const group = grouped.get(id) ?? { label, ids: [] };
		group.ids.push(node.id);
		grouped.set(id, group);
	}
	const entries = [...grouped].sort(([a], [b]) => a.localeCompare(b));
	const columns = Math.max(1, Math.ceil(Math.sqrt(entries.length)));
	const radii = entries.map(
		([, group]) => 50 + Math.sqrt(group.ids.length) * 35,
	);
	const spacing = Math.max(260, ...radii.map((r) => r * 2 + 80));
	const hues: number[] = [];
	const membership = new Map<string, Cluster>();
	const groups = entries.map(([id, group], index) => {
		let hue = hash(id) % 360;
		// Avoid assigning the same hue to neighboring categories; do not recycle six colors.
		const separation = Math.min(42, 280 / Math.max(1, entries.length));
		for (
			let attempt = 0;
			attempt < 360 &&
			hues.some(
				(used) =>
					Math.min(Math.abs(used - hue), 360 - Math.abs(used - hue)) <
					separation,
			);
			attempt++
		)
			hue = (hue + 137) % 360;
		hues.push(hue);
		const cluster: Cluster = {
			id,
			label: group.label,
			count: group.ids.length,
			color: `hsl(${hue} 55% 52%)`,
			x: (index % columns) * spacing,
			y: Math.floor(index / columns) * spacing * 0.8,
			radius: radii[index],
		};
		for (const nodeId of group.ids) membership.set(nodeId, cluster);
		return cluster;
	});
	return { groups, membership };
}

export function seedNodes(
	nodes: KnowledgeGraphNode[],
	layout: GroupLayout,
): LayoutNode[] {
	const offsets = new Map<string, number>();
	return [...nodes]
		.sort((a, b) => a.id.localeCompare(b.id))
		.map((node) => {
			const cluster = layout.membership.get(node.id)!;
			const index = offsets.get(cluster.id) ?? 0;
			offsets.set(cluster.id, index + 1);
			const radius = 30 * Math.sqrt(index);
			const angle = index * 2.399963229728653;
			return {
				...node,
				x: cluster.x + Math.cos(angle) * radius,
				y: cluster.y + Math.sin(angle) * radius,
			};
		});
}

export function matchesRelation(edge: KnowledgeGraphEdge, relation: Relation) {
	return (
		relation === "all" ||
		(relation === "reference"
			? edge.kind === "reference"
			: edge.kind !== "reference")
	);
}

export function createGraphSimulation(
	nodes: LayoutNode[],
	edges: KnowledgeGraphEdge[],
	layout: GroupLayout,
) {
	const sameGroup = (edge: KnowledgeGraphEdge) =>
		layout.membership.get(edge.source)?.id ===
		layout.membership.get(edge.target)?.id;
	// D3 mutates link endpoints. Keep immutable article relationships outside the simulation.
	const links = edges.map((edge) => ({ ...edge, local: sameGroup(edge) }));
	return forceSimulation(nodes)
		.force(
			"link",
			forceLink<LayoutNode, (typeof links)[number]>(links)
				.id((node) => node.id)
				.distance((edge) => (edge.local ? 82 : 290))
				.strength((edge) => (edge.local ? 0.12 : 0.008)),
		)
		.force(
			"charge",
			forceManyBody<LayoutNode>().strength(-210).distanceMax(450),
		)
		.force(
			"collide",
			forceCollide<LayoutNode>()
				.radius((node) => node.radius + 30)
				.iterations(2),
		)
		.force(
			"cluster-x",
			forceX<LayoutNode>((node) => layout.membership.get(node.id)!.x).strength(
				0.24,
			),
		)
		.force(
			"cluster-y",
			forceY<LayoutNode>((node) => layout.membership.get(node.id)!.y).strength(
				0.24,
			),
		)
		.alphaDecay(0.055)
		.velocityDecay(0.38)
		.stop();
}
