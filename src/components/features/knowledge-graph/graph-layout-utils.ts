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
	const hues: number[] = [];
	const membership = new Map<string, Cluster>();
	const groups = entries.map(([id, group]) => {
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
		};
		for (const nodeId of group.ids) membership.set(nodeId, cluster);
		return cluster;
	});
	return { groups, membership };
}

export function seedNodes(
	nodes: KnowledgeGraphNode[],
	_layout?: GroupLayout,
): LayoutNode[] {
	// Start in a deterministic spiral so the first frame is readable while the
	// graph forces establish the actual topology. Group membership only affects
	// color and filtering; it must not dictate node positions.
	const spacing = 42 + Math.min(24, Math.sqrt(nodes.length) * 2.5);
	const goldenAngle = Math.PI * (3 - Math.sqrt(5));
	return [...nodes]
		.sort((a, b) => a.id.localeCompare(b.id))
		.map((node, index) => {
			const radius = spacing * Math.sqrt(index + 1);
			const angle = index * goldenAngle;
			return {
				...node,
				x: Math.cos(angle) * radius,
				y: Math.sin(angle) * radius,
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
	_layout?: GroupLayout,
) {
	// D3 mutates link endpoints. Keep immutable article relationships outside the simulation.
	const links = edges.map((edge) => ({ ...edge }));
	return forceSimulation(nodes)
		.force(
			"link",
			forceLink<LayoutNode, (typeof links)[number]>(links)
				.id((node) => node.id)
				.distance((edge) => (edge.kind === "reference" ? 118 : 138))
				.strength((edge) => Math.min(0.3, 0.14 + edge.weight * 0.025)),
		)
		.force(
			"charge",
			forceManyBody<LayoutNode>().strength(-230).distanceMax(650),
		)
		.force(
			"collide",
			forceCollide<LayoutNode>()
				.radius((node) => node.radius + 30)
				.iterations(2),
		)
		.force("center-x", forceX<LayoutNode>(0).strength(0.018))
		.force("center-y", forceY<LayoutNode>(0).strength(0.018))
		.alphaDecay(0.055)
		.velocityDecay(0.38)
		.stop();
}
