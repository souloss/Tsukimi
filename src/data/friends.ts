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
		title: "aiHot",
		imgurl: "https://www.google.com/s2/favicons?domain=aihot.virxact.com&sz=64",
		desc: "AI 热点资讯聚合",
		siteurl: "https://aihot.virxact.com",
		tags: ["AI", "News"],
		weight: 20,
		enabled: true,
		rss: "https://aihot.virxact.com/feed/daily.xml",
	},
	{
		id: 2,
		title: "FMHY Blog",
		imgurl: "https://github.com/fmhy.png",
		desc: "The largest collection of free stuff on the internet!",
		siteurl: "https://fmhy.net",
		tags: ["Wiki", "Resources"],
		enabled: true,
		weight: 10,
		rss: "https://fm-hy.top/feed.rss",
	},
	{
		id: 3,
		title: "阮一峰的网络日志",
		imgurl: "https://www.ruanyifeng.com/favicon.ico",
		desc: "Ruan YiFeng's Blog",
		siteurl: "https://www.ruanyifeng.com/blog/",
		tags: ["Blog", "Tech"],
		enabled: true,
		weight: 30,
		rss: "https://feeds.feedburner.com/ruanyifeng",
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
