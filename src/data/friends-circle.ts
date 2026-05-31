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

import friendsCircleJson from "./friends-circle.json";

const data: FriendsCircleData = friendsCircleJson as FriendsCircleData;

// 获取朋友圈数据
export function getFriendsCircleList(): FriendsCircleItem[] {
	return data.items ?? [];
}

// 获取朋友圈数据最后更新时间
export function getFriendsCircleLastUpdated(): string {
	return data.lastUpdated ?? "";
}
