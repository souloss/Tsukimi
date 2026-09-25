import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	createGraphSimulation,
	createGroups,
	seedNodes,
} from "../src/components/features/knowledge-graph/graph-layout-utils.ts";
import type {
	KnowledgeGraphEdge,
	KnowledgeGraphNode,
} from "../src/utils/knowledge-graph.ts";

function post(
	id: string,
	category = "",
	tags: string[] = [],
	series?: string,
): KnowledgeGraphNode {
	return {
		id,
		category,
		tags,
		series,
		title: id,
		url: `/posts/${id}/`,
		description: "",
		published: "2026-09-25",
		degree: 0,
		radius: 7,
	};
}

describe("knowledge graph grouping", () => {
	it("handles empty graphs and keeps literal group names distinct from missing categories", () => {
		assert.deepEqual(createGroups([], "category").groups, []);
		const nodes = [post("a"), post("b", "未分类"), post("c", "all")];
		const layout = createGroups(nodes, "category");
		assert.equal(layout.groups.length, 3);
		assert.equal(layout.membership.size, 3);
		assert.notEqual(
			layout.membership.get("a")?.id,
			layout.membership.get("b")?.id,
		);
	});
	it("gives more than six categories distinct colors and deterministic positions", () => {
		const nodes = Array.from({ length: 18 }, (_, i) =>
			post(`article-${i}`, `category-${i}`),
		);
		const first = createGroups(nodes, "category");
		const reversed = createGroups([...nodes].reverse(), "category");
		assert.equal(new Set(first.groups.map((group) => group.color)).size, 18);
		assert.deepEqual(first.groups, reversed.groups);
		assert.deepEqual(
			seedNodes(nodes, first),
			seedNodes([...nodes].reverse(), reversed),
		);
	});
	it("uses series first, then shared tags, and category as a fallback for domain grouping", () => {
		const nodes = [
			post("a", "Frontend", ["React", "JS"]),
			post("b", "Backend", ["JS"]),
			post("c", "Backend", ["JS"], "Compiler"),
			post("d", "Notes"),
		];
		const layout = createGroups(nodes, "domain");
		assert.equal(
			layout.membership.get("a")?.id,
			layout.membership.get("b")?.id,
		);
		assert.equal(layout.membership.get("c")?.label, "Compiler");
		assert.equal(layout.membership.get("d")?.label, "Notes");
		assert.deepEqual(
			createGroups([...nodes].reverse(), "domain").groups,
			layout.groups,
		);
	});
	it("keeps dense cross-category references from collapsing separate clusters", () => {
		const articles = Array.from({ length: 160 }, (_, i) =>
			post(`n${i}`, `category-${Math.floor(i / 20)}`),
		);
		const edges: KnowledgeGraphEdge[] = articles
			.slice(0, -1)
			.map((node, index) => ({
				id: `e${index}`,
				source: node.id,
				target: articles[(index + 23) % articles.length].id,
				kind: "reference",
				weight: 1,
			}));
		const originalEdges = JSON.stringify(edges);
		const layout = createGroups(articles, "category");
		const nodes = seedNodes(articles, layout);
		const simulation = createGraphSimulation(nodes, edges, layout);
		simulation.tick(180).stop();
		for (const node of nodes) {
			assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y));
			const own = layout.membership.get(node.id)!;
			const ownDistance = Math.hypot(node.x - own.x, node.y - own.y);
			const otherDistance = Math.min(
				...layout.groups
					.filter((group) => group.id !== own.id)
					.map((group) => Math.hypot(node.x - group.x, node.y - group.y)),
			);
			assert.ok(ownDistance < otherDistance, `${node.id} left its cluster`);
		}
		assert.equal(
			JSON.stringify(edges),
			originalEdges,
			"D3 must not mutate public edge IDs",
		);
	});
});
