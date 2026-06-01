import { defineCollection } from "astro:content";
import { z } from "astro/zod";

import { devGlob } from "./loaders/glob-dev-trim.mjs";

const postsCollection = defineCollection({
	loader: devGlob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		comment: z.boolean().optional().default(true),
		priority: z.number().optional(),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),

		/* Page encryption fields */
		encrypted: z.boolean().optional().default(false),
		password: z.string().optional().default(""),
		passwordHint: z.string().optional().default(""),
		hideHomeContent: z.boolean().optional(),

		/* Posts alias - 别名路径 */
		alias: z.string().optional(),

		/* Custom permalink - 自定义固定链接，优先级高于 alias */
		permalink: z.string().optional(),

		/* Slug - URL 路径中的简短文本标识，只覆盖文件名部分 */
		slug: z.string().optional(),

		/* Series fields - 专栏/系列 */
		series: z.string().optional(),
		seriesOrder: z.number().optional().default(0),

		/* OG description override */
		ogDescription: z.string().optional(),

		/* Redirect URL - 跳转到外部/静态资源页面 */
		redirect: z.string().optional(),

		/* Repost fields - 转载 */
		repost: z
			.object({
				originalAuthor: z.string(),
				originalUrl: z.string(),
				originalTitle: z.string().optional(),
				originalSite: z.string().optional(),
				redirect: z.string().optional(),
			})
			.optional(),

		/* Copyright license */
		copyright: z
			.enum([
				"CC BY",
				"CC BY-SA",
				"CC BY-ND",
				"CC BY-NC",
				"CC BY-NC-SA",
				"CC BY-NC-ND",
				"CC0",
				"ARR",
			])
			.optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	loader: devGlob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});
const docsCollection = defineCollection({
	loader: devGlob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
	schema: z.object({
		title: z.string().optional(),
		tagline: z.string().optional(),
		createTime: z.union([z.string(), z.date()]).optional(),
		permalink: z.string().optional(),
		copyright: z.unknown().optional(),
		order: z.number().optional().default(0),
		section: z.string().optional(),
		docSlug: z.string().optional(),
		lang: z.string().optional().default(""),
		description: z.string().optional().default(""),
		isHomepage: z.boolean().optional().default(false),
		icon: z.string().optional(),
		collapsed: z.boolean().optional().default(true),
		image: z.string().optional(),
		actions: z
			.array(
				z.object({
					theme: z.string().optional(),
					text: z.string(),
					link: z.string(),
				}),
			)
			.optional(),
		features: z
			.array(
				z.object({
					title: z.string(),
					icon: z.string().optional(),
					details: z.string().optional(),
				}),
			)
			.optional(),
		badge: z
			.object({
				type: z
					.enum([
						"info",
						"warning",
						"danger",
						"tip",
						"new",
						"recommended",
						"not-recommended",
						"v2",
						"v3",
						"v4",
					])
					.default("info"),
				text: z.string(),
			})
			.optional(),
	}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
	docs: docsCollection,
};
