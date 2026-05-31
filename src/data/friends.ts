// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
	weight?: number; // 排序权重，数值越大越靠前，默认为0
	enabled?: boolean; // 是否启用，默认为true
	rss?: string; // RSS/Atom feed URL 用于朋友圈动态聚合
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Astro",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "The web framework for content-driven websites",
		siteurl: "https://github.com/withastro/astro",
		tags: ["Framework"],
		weight: 10,
		enabled: true,
	},
	{
		id: 2,
		title: "Vercel",
		imgurl: "https://avatars.githubusercontent.com/u/14985020?v=4&s=640",
		desc: "Develop. Preview. Ship.",
		siteurl: "https://vercel.com",
		tags: ["Hosting", "Cloud"],
		weight: 5,
		enabled: true,
	},
	{
		id: 3,
		title: "Tailwind CSS",
		imgurl: "https://avatars.githubusercontent.com/u/67109815?v=4&s=640",
		desc: "A utility-first CSS framework for rapidly building custom designs",
		siteurl: "https://tailwindcss.com",
		tags: ["CSS", "Framework"],
		enabled: true,
	},
	{
		id: 4,
		title: "TypeScript",
		imgurl: "https://avatars.githubusercontent.com/u/6154722?v=4&s=640",
		desc: "TypeScript is JavaScript with syntax for types",
		siteurl: "https://www.typescriptlang.org",
		tags: ["Language", "JavaScript"],
		enabled: true,
	},
	{
		id: 5,
		title: "React",
		imgurl: "https://avatars.githubusercontent.com/u/6412038?v=4&s=640",
		desc: "A JavaScript library for building user interfaces",
		siteurl: "https://reactjs.org",
		tags: ["Framework", "JavaScript"],
		enabled: true,
	},
	{
		id: 6,
		title: "GitHub",
		imgurl: "https://avatars.githubusercontent.com/u/9919?v=4&s=640",
		desc: "Where the world builds software",
		siteurl: "https://github.com",
		tags: ["Development", "Platform"],
		enabled: true,
	},
	{
		id: 7,
		title: "MDN Web Docs",
		imgurl: "https://avatars.githubusercontent.com/u/7565578?v=4&s=640",
		desc: "The web's most comprehensive resource for web developers",
		siteurl: "https://developer.mozilla.org",
		tags: ["Docs", "Reference"],
		enabled: true,
	},
	{
		id: 8,
		title: "aiHot",
		imgurl: "https://www.google.com/s2/favicons?domain=aihot.virxact.com&sz=64",
		desc: "AI 热点资讯聚合",
		siteurl: "https://aihot.virxact.com",
		tags: ["AI", "News"],
		weight: 15,
		enabled: true,
		rss: "https://aihot.virxact.com/feed/daily.xml",
	},
];

// 获取所有友情链接数据（包含禁用的）
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取已启用的友情链接数据
export function getEnabledFriendsList(): FriendItem[] {
	return friendsData.filter((f) => f.enabled !== false);
}

// 获取按权重排序的友情链接数据（权重降序）
export function getWeightedFriendsList(): FriendItem[] {
	return getEnabledFriendsList().sort(
		(a, b) => (b.weight || 0) - (a.weight || 0),
	);
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...getEnabledFriendsList()];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// 根据配置获取友情链接列表
export function getFriendsListByConfig(randomize: boolean): FriendItem[] {
	if (randomize) {
		return getShuffledFriendsList();
	}
	return getWeightedFriendsList();
}
