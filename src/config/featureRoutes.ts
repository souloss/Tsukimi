import type { SiteConfig } from "../types/config";

export const featurePageRoutes = {
	anime: "/anime/",
	talking: "/talking/",
	friends: "/friends/",
	projects: "/projects/",
	skills: "/skills/",
	timeline: "/timeline/",
	albums: "/albums/",
	devices: "/devices/",
	series: "/series/",
	reposts: "/reposts/",
	guestbook: "/guestbook/",
	sponsor: "/sponsor/",
} satisfies Record<keyof SiteConfig["featurePages"], string>;
