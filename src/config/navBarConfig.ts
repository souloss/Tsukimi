import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{
			name: "Content",
			url: "/archive/",
			icon: "material-symbols:folder-open",
			children: [
				LinkPreset.Archive,
				{
					name: "Tags",
					url: "/tags/",
					icon: "material-symbols:label",
				},
				{
					name: "Categories",
					url: "/categories/",
					icon: "material-symbols:category",
				},
				{
					name: "Series",
					url: "/series/",
					icon: "material-symbols:list-alt-rounded",
				},
				{
					name: "Reposts",
					url: "/reposts/",
					icon: "material-symbols:content-copy",
				},
				{
					name: "Docs",
					url: "/docs/",
					icon: "material-symbols:book-2",
				},
			],
		},
		{
			name: "Interaction",
			url: "/guestbook/",
			icon: "material-symbols:interactive-space",
			children: [
				{
					name: "Guestbook",
					url: "/guestbook/",
					icon: "material-symbols:chat",
				},
				{
					name: "Friends",
					url: "/friends/",
					icon: "material-symbols:group",
				},
			],
		},
		{
			name: "My",
			url: "/anime/",
			icon: "material-symbols:person",
			children: [
				{
					name: "Anime",
					url: "/anime/",
					icon: "material-symbols:movie",
				},
				{
					name: "Talking",
					url: "/talking/",
					icon: "material-symbols:chat-bubble",
				},
				{
					name: "Gallery",
					url: "/albums/",
					icon: "material-symbols:photo-library",
				},
				{
					name: "Projects",
					url: "/projects/",
					icon: "material-symbols:work",
				},
				{
					name: "Skills",
					url: "/skills/",
					icon: "material-symbols:psychology",
				},
				{
					name: "Devices",
					url: "/devices/",
					icon: "material-symbols:devices",
				},
				{
					name: "Timeline",
					url: "/timeline/",
					icon: "material-symbols:timeline",
				},
			],
		},
		{
			name: "About",
			url: "/about/",
			icon: "material-symbols:info",
			children: [
				{
					name: "About",
					url: "/about/",
					icon: "material-symbols:person",
				},
				{
					name: "Sponsor",
					url: "/sponsor/",
					icon: "material-symbols:favorite",
				},
			],
		},
		{
			name: "Links",
			url: "#",
			icon: "material-symbols:link",
			children: [
				{
					name: "GitHub",
					url: "https://github.com/souloss/Mizuki",
					external: true,
					icon: "fa7-brands:github",
				},
				{
					name: "Bilibili",
					url: "https://space.bilibili.com/15269273",
					external: true,
					icon: "fa7-brands:bilibili",
				},
			],
		},
	],
};
