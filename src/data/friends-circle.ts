// 朋友圈数据配置
// 用于管理朋友圈页面的RSS聚合数据

export interface FriendsCircleItem {
	title: string;
	author: string;
	date: string;
	link: string;
	content: string;
	avatar?: string;
	siteUrl?: string;
}

interface FriendsCircleData {
	lastUpdated: string;
	items: FriendsCircleItem[];
}

const defaultData: FriendsCircleData = { lastUpdated: "", items: [] };

function loadData(): FriendsCircleData {
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const json = require("./friends-circle.json");
		return json ?? defaultData;
	} catch {
		return defaultData;
	}
}

const data = loadData();

// 获取朋友圈数据
export function getFriendsCircleList(): FriendsCircleItem[] {
	return data.items ?? [];
}

// 获取朋友圈数据最后更新时间
export function getFriendsCircleLastUpdated(): string {
	return data.lastUpdated ?? "";
}
