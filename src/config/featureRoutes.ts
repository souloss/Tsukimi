import type { SiteConfig } from "../types/config";

export const featurePageRegistry = {
	anime: { path: "/anime/", page: "src/pages/anime.astro" },
	talking: { path: "/talking/", page: "src/pages/talking.astro" },
	friends: { path: "/friends/", page: "src/pages/friends.astro" },
	projects: { path: "/projects/", page: "src/pages/projects.astro" },
	skills: { path: "/skills/", page: "src/pages/skills.astro" },
	timeline: { path: "/timeline/", page: "src/pages/timeline.astro" },
	albums: { path: "/albums/", page: "src/pages/albums.astro" },
	devices: { path: "/devices/", page: "src/pages/devices.astro" },
	series: { path: "/series/", page: "src/pages/series/index.astro" },
	reposts: { path: "/reposts/", page: "src/pages/reposts.astro" },
	guestbook: { path: "/guestbook/", page: "src/pages/guestbook.astro" },
	sponsor: { path: "/sponsor/", page: "src/pages/sponsor.astro" },
	knowledgeGraph: {
		path: "/knowledge-graph/",
		page: "src/pages/knowledge-graph.astro",
	},
} satisfies Record<
	keyof SiteConfig["featurePages"],
	{ path: string; page: string }
>;

export const featurePageRoutes = Object.fromEntries(
	Object.entries(featurePageRegistry).map(([key, value]) => [key, value.path]),
) as Record<keyof SiteConfig["featurePages"], string>;
