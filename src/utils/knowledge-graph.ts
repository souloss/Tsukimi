import type { CollectionEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import { dirname, posix } from "node:path";
import { getPostPublicDescription } from "@utils/post-card-content";
import { getPostUrl } from "@utils/url-utils";
import MarkdownIt from "markdown-it";
import { parse as parseHtml } from "node-html-parser";
import { siteConfig } from "@/config";

export type KnowledgeGraphNode = {
	id: string;
	title: string;
	url: string;
	description: string;
	published: string;
	category: string;
	tags: string[];
	series?: string;
	degree: number;
	radius: number;
};

export type KnowledgeGraphEdgeKind = "reference" | "topic" | "series";

export type KnowledgeGraphEdge = {
	id: string;
	source: string;
	target: string;
	kind: KnowledgeGraphEdgeKind;
	weight: number;
	label?: string;
};

export type KnowledgeGraphData = {
	nodes: KnowledgeGraphNode[];
	edges: KnowledgeGraphEdge[];
	stats: {
		articles: number;
		references: number;
		topicConnections: number;
		isolated: number;
	};
};

const markdownParser = new MarkdownIt({ html: true, linkify: true });

function normalizeRoute(value: string): string {
	let route = value.trim();
	if (!route) return "/";
	try {
		if (/^[a-z][a-z\d+.-]*:/i.test(route)) {
			route = new URL(route).pathname;
		}
	} catch {
		return "";
	}
	route = route.split(/[?#]/, 1)[0] ?? route;
	try {
		route = decodeURIComponent(route);
	} catch {
		// Keep the original path when an author used a malformed escape.
	}
	route = route.replace(/^\.\//, "").replace(/\/+/g, "/");
	route = route.replace(/\.(?:md|mdx|markdown)$/i, "");
	if (!route.startsWith("/")) route = `/${route}`;
	if (route.length > 1) route = route.replace(/\/$/, "");
	return route.toLowerCase();
}

function sourceKey(filePath: string | undefined): string {
	return normalizeRoute((filePath ?? "").replace(/^src\/content\/posts\//, ""));
}

function addRoute(map: Map<string, string>, route: string, id: string) {
	const normalized = normalizeRoute(route);
	if (!normalized) return;
	map.set(normalized, id);
	map.set(`${normalized}/index`, id);
}

function collectHrefs(source: string): string[] {
	const hrefs = new Set<string>();
	try {
		const html = parseHtml(markdownParser.render(source));
		for (const anchor of html.querySelectorAll("a")) {
			const href = anchor.getAttribute("href");
			if (href) hrefs.add(href);
		}
	} catch {
		// An unsupported MDX construct should not prevent the graph from building.
	}
	const proseSource = source
		.replace(/^```[\s\S]*?^```/gm, "")
		.replace(/^(?: {4}|\t).*/gm, "");
	for (const match of proseSource.matchAll(
		/\]\(\s*<?([^\s)>]+)>?(?:\s+['"][^'"]*['"])?\s*\)/g,
	)) {
		if (match[1]) hrefs.add(match[1]);
	}
	return [...hrefs];
}

function resolveInternalTarget(
	href: string,
	post: CollectionEntry<"posts">,
	routeMap: Map<string, string>,
	sourceMap: Map<string, string>,
): string | undefined {
	const trimmed = href.trim();
	if (
		!trimmed ||
		trimmed.startsWith("#") ||
		/^(?:mailto|tel|javascript):/i.test(trimmed)
	) {
		return undefined;
	}
	let candidate = trimmed;
	try {
		if (/^[a-z][a-z\d+.-]*:/i.test(candidate)) {
			const parsed = new URL(candidate);
			const siteOrigin = siteConfig.siteURL
				? new URL(siteConfig.siteURL).origin
				: "";
			if (parsed.origin !== siteOrigin) return undefined;
			candidate = parsed.pathname;
		}
	} catch {
		return undefined;
	}

	const direct = routeMap.get(normalizeRoute(candidate));
	if (direct && direct !== post.id) return direct;

	const currentSource = sourceKey(post.filePath);
	if (currentSource && !candidate.startsWith("/")) {
		const resolvedSource = normalizeRoute(
			posix.join(dirname(currentSource), candidate),
		);
		const sourceTarget = sourceMap.get(resolvedSource);
		if (sourceTarget && sourceTarget !== post.id) return sourceTarget;
	}

	return undefined;
}

function createTopicEdges(
	posts: CollectionEntry<"posts">[],
	nodeIds: Set<string>,
	edges: Map<string, KnowledgeGraphEdge>,
) {
	const candidates = new Map<
		string,
		KnowledgeGraphEdge & { score: number; labels: Set<string> }
	>();
	const addGroupEdges = (
		ids: string[],
		kind: "topic" | "series",
		label: string,
		score: number,
		limit: number,
	) => {
		const uniqueIds = [...new Set(ids)].filter((id) => nodeIds.has(id));
		if (uniqueIds.length < 2 || uniqueIds.length > limit) return;
		for (let i = 0; i < uniqueIds.length; i++) {
			for (let j = i + 1; j < uniqueIds.length; j++) {
				const source = uniqueIds[i];
				const target = uniqueIds[j];
				const key = [source, target].sort().join("::");
				if (edges.get(key)?.kind === "reference") continue;
				const candidate = candidates.get(key) ?? {
					id: key,
					source,
					target,
					kind,
					weight: 0,
					score: 0,
					labels: new Set<string>(),
				};
				candidate.score += score;
				candidate.weight += 1;
				candidate.labels.add(label);
				if (kind === "series") candidate.kind = "series";
				candidates.set(key, candidate);
			}
		}
	};

	const seriesGroups = new Map<string, string[]>();
	const categoryGroups = new Map<string, string[]>();
	const tagGroups = new Map<string, string[]>();
	for (const post of posts) {
		if (post.data.series) {
			const ids = seriesGroups.get(post.data.series) ?? [];
			ids.push(post.id);
			seriesGroups.set(post.data.series, ids);
		}
		const category = post.data.category?.trim();
		if (category) {
			const ids = categoryGroups.get(category) ?? [];
			ids.push(post.id);
			categoryGroups.set(category, ids);
		}
		for (const tag of post.data.tags ?? []) {
			const cleanTag = tag.trim();
			if (!cleanTag) continue;
			const ids = tagGroups.get(cleanTag) ?? [];
			ids.push(post.id);
			tagGroups.set(cleanTag, ids);
		}
	}

	for (const [series, ids] of seriesGroups)
		addGroupEdges(ids, "series", series, 5, 28);
	for (const [category, ids] of categoryGroups)
		addGroupEdges(ids, "topic", category, 1, 16);
	for (const [tag, ids] of tagGroups)
		addGroupEdges(ids, "topic", `#${tag}`, 1.5, 12);

	const neighbors = new Map<string, KnowledgeGraphEdge[]>();
	for (const candidate of candidates.values()) {
		const edge: KnowledgeGraphEdge = {
			id: candidate.id,
			source: candidate.source,
			target: candidate.target,
			kind: candidate.kind,
			weight: candidate.weight,
			label: [...candidate.labels].slice(0, 3).join(", "),
		};
		for (const nodeId of [edge.source, edge.target]) {
			const list = neighbors.get(nodeId) ?? [];
			list.push(edge);
			neighbors.set(nodeId, list);
		}
	}

	const selected = new Set<string>();
	for (const options of neighbors.values()) {
		const ranked = options.sort((a, b) => {
			const aScore = candidates.get(a.id)?.score ?? 0;
			const bScore = candidates.get(b.id)?.score ?? 0;
			return bScore - aScore || a.id.localeCompare(b.id);
		});
		for (const edge of ranked.slice(0, 4)) selected.add(edge.id);
	}
	for (const candidate of candidates.values()) {
		if (!selected.has(candidate.id)) continue;
		edges.set(candidate.id, {
			id: candidate.id,
			source: candidate.source,
			target: candidate.target,
			kind: candidate.kind,
			weight: candidate.weight,
			label: [...candidate.labels].slice(0, 3).join(", "),
		});
	}
}

export async function buildKnowledgeGraph(
	posts: CollectionEntry<"posts">[],
): Promise<KnowledgeGraphData> {
	const routeMap = new Map<string, string>();
	const sourceMap = new Map<string, string>();
	const postsWithUrls = posts.map((post) => ({ post, url: getPostUrl(post) }));
	for (const { post, url } of postsWithUrls) {
		addRoute(routeMap, url, post.id);
		addRoute(routeMap, `/posts/${post.id}`, post.id);
		const path = post.filePath?.replace(/^src\/content\/posts\//, "");
		if (post.data.slug && path) {
			const lastSlash = path.lastIndexOf("/");
			const directory = lastSlash >= 0 ? path.slice(0, lastSlash + 1) : "";
			addRoute(routeMap, `/posts/${directory}${post.data.slug}`, post.id);
		}
		if (post.data.alias) {
			let alias = post.data.alias.replace(/^\/+/, "").replace(/\/+$/, "");
			if (alias.startsWith("posts/")) alias = alias.slice("posts/".length);
			addRoute(routeMap, `/posts/${alias}`, post.id);
		}
		const source = sourceKey(post.filePath);
		if (source) sourceMap.set(source, post.id);
	}

	const sourceEntries = await Promise.all(
		postsWithUrls.map(async ({ post }) => {
			let source = String(post.body ?? "");
			if (
				(!source ||
					source.includes("Content preview not available in dev mode")) &&
				post.filePath
			) {
				try {
					source = await readFile(post.filePath, "utf8");
				} catch {
					// A missing source file should only omit this article's outgoing edges.
				}
			}
			return [post, source] as const;
		}),
	);

	const edges = new Map<string, KnowledgeGraphEdge>();
	for (const [post, source] of sourceEntries) {
		// Keep protected article bodies out of the public relationship index.
		if (post.data.password || post.data.encrypted) continue;
		for (const href of collectHrefs(source)) {
			const target = resolveInternalTarget(href, post, routeMap, sourceMap);
			if (!target || target === post.id) continue;
			const edgeKey = [post.id, target].sort().join("::");
			const existing = edges.get(edgeKey);
			if (existing) {
				if (existing.kind === "reference") existing.weight += 1;
				continue;
			}
			edges.set(edgeKey, {
				id: edgeKey,
				source: post.id,
				target,
				kind: "reference",
				weight: 1,
			});
		}
	}

	const nodeIds = new Set(posts.map((post) => post.id));
	createTopicEdges(posts, nodeIds, edges);

	const degreeMap = new Map<string, number>();
	for (const edge of edges.values()) {
		degreeMap.set(edge.source, (degreeMap.get(edge.source) ?? 0) + edge.weight);
		degreeMap.set(edge.target, (degreeMap.get(edge.target) ?? 0) + edge.weight);
	}
	const maxDegree = Math.max(1, ...degreeMap.values());
	const nodes = posts.map((post) => {
		const category = post.data.category?.trim() || "";
		const degree = degreeMap.get(post.id) ?? 0;
		return {
			id: post.id,
			title: post.data.title,
			url: getPostUrl(post),
			description: getPostPublicDescription(post.data),
			published: post.data.published.toISOString(),
			category,
			tags: (post.data.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
			series: post.data.series,
			degree,
			radius: 5 + Math.min(7, (degree / maxDegree) * 7),
		};
	});

	const edgeList = [...edges.values()];
	return {
		nodes,
		edges: edgeList,
		stats: {
			articles: nodes.length,
			references: edgeList.filter((edge) => edge.kind === "reference").length,
			topicConnections: edgeList.filter((edge) => edge.kind !== "reference")
				.length,
			isolated: nodes.filter((node) => node.degree === 0).length,
		},
	};
}
