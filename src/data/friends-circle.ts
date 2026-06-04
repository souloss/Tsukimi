import friendsCircleData from "./friends-circle.json";

export function getFriendsCircleList() {
	const data = friendsCircleData as {
		lastUpdated: string;
		items: {
			title: string;
			author: string;
			avatar: string;
			siteUrl: string;
			date: string;
			link: string;
			content: string;
		}[];
	};

	if (!data?.items || data.items.length === 0) {
		console.warn(
			"No friends circle data found. Run `pnpm update-feeds` to fetch RSS feeds.",
		);
		return [];
	}

	return data.items.map((item) => ({
		title: item.title,
		link: item.link,
		author: item.author,
		published: item.date,
		summary: item.content,
		siteUrl: item.siteUrl,
		siteName: item.author,
		siteAvatar: item.avatar,
	}));
}

export function getFriendsCircleLastUpdated(): string {
	const data = friendsCircleData as { lastUpdated: string };
	return data?.lastUpdated || "";
}
