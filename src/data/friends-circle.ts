import friendsCircleData from "./friends-circle.json";

export interface FriendsCircleItem {
	title: string;
	author: string;
	avatar: string;
	siteUrl: string;
	date: string;
	link: string;
	content: string;
}

export function getFriendsCircleList(): FriendsCircleItem[] {
	const data = friendsCircleData as {
		lastUpdated: string;
		items: FriendsCircleItem[];
	};

	if (!data?.items || data.items.length === 0) {
		console.warn(
			"No friends circle data found. Run `pnpm update-feeds` to fetch RSS feeds.",
		);
		return [];
	}

	return data.items;
}

export function getFriendsCircleLastUpdated(): string {
	const data = friendsCircleData as { lastUpdated: string };
	return data?.lastUpdated || "";
}
