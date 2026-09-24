import type { CollectionEntry } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

import { permalinkConfig } from "../config";
import { generatePermalinkSlug } from "./permalink-utils";

/**
 * 移除文件扩展名（.md, .mdx, .markdown）
 * 用于将 Astro v5 Content Layer API 的 id 转换为 URL 友好的 slug
 */
export function removeFileExtension(id: string): string {
	return id.replace(/\.(md|mdx|markdown)$/i, "");
}

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(slug: string): string {
	// 移除文件扩展名（如 .md, .mdx 等）
	const slugWithoutExt = removeFileExtension(slug);
	return url(`/posts/${slugWithoutExt}/`);
}

export function getPostUrlByAlias(alias: string): string {
	// 移除开头的斜杠并确保固定链接在 /posts/ 路径下
	let cleanAlias = alias.replace(/^\/+/, "");
	if (cleanAlias.startsWith("posts/")) {
		cleanAlias = cleanAlias.replace(/^posts\//, "");
	}
	return url(`/posts/${cleanAlias}/`);
}

/**
 * 根据 entry 的文件路径目录部分和 slug 字段构建 URL
 * slug 只覆盖文件名部分，目录保持原样
 * 注意：Astro v5 的 entry.id 是 slugified 的（不含中文/目录），
 * 需要从 filePath 提取目录部分
 * 例如: filePath="src/content/posts/internet-architecture/1-从家到网站全景拓扑.md", slug="from-home-to-website-full-internet-topology"
 * → /posts/internet-architecture/from-home-to-website-full-internet-topology/
 */
function getPostUrlBySlugField(entry: {
	id: string;
	data: { slug: string };
	filePath?: string;
}): string {
	let dir = "";
	if (entry.filePath) {
		const relativePath = entry.filePath.replace(/^src\/content\/posts\//, "");
		const lastSlashIndex = relativePath.lastIndexOf("/");
		dir =
			lastSlashIndex >= 0 ? relativePath.substring(0, lastSlashIndex + 1) : "";
	}
	return url(`/posts/${dir}${entry.data.slug}/`);
}

export function getPostUrl(post: CollectionEntry<"posts">): string;
export function getPostUrl(post: {
	id: string;
	filePath?: string;
	data: { slug?: string; alias?: string; permalink?: string };
}): string;
export function getPostUrl(post: any): string {
	// 如果文章有自定义 permalink，优先使用（在根目录下）
	if (post.data.permalink) {
		const slug = post.data.permalink.replace(/^\/+/, "").replace(/\/+$/, "");
		return url(`/${slug}/`);
	}

	// 如果全局 permalink 功能启用，使用生成的 slug（在根目录下）
	if (permalinkConfig.enable) {
		const slug = generatePermalinkSlug(post);
		return url(`/${slug}/`);
	}

	// 如果文章有 slug，使用 slug 替换文件名部分（目录保持原样）
	if (post.data.slug) {
		return getPostUrlBySlugField(post);
	}

	// 如果文章有 alias，使用 alias（在 /posts/ 下）
	if (post.data.alias) {
		return getPostUrlByAlias(post.data.alias);
	}

	// 否则使用默认的 id 路径
	return getPostUrlBySlug(post.id);
}

export function getTagUrl(tag: string): string {
	if (!tag) {
		return url("/archive/");
	}
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	) {
		return url("/archive/?uncategorized=true");
	}
	return url(`/archive/?category=${encodeURIComponent(category.trim())}`);
}

export function getDir(path: string): string {
	// 移除文件扩展名
	const pathWithoutExt = removeFileExtension(path);
	const lastSlashIndex = pathWithoutExt.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return pathWithoutExt.substring(0, lastSlashIndex + 1);
}

export function getFileDirFromPath(filePath: string): string {
	return filePath.replace(/^src\//, "").replace(/\/[^/]+$/, "");
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
