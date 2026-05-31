import type { FriendsPageConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

// 友链页面配置
const defaults: FriendsPageConfig = {
	// 页面标题
	title: "友情链接",
	// 页面描述
	description: "欢迎来交换友链！",
	// 是否显示自定义内容（friends.md）
	showCustomContent: true,
	// 是否显示评论区
	showComment: false,
	// 是否显示朋友圈动态
	showFriendsCircle: true,
	// 是否打乱排序，如果为 true，将忽略 weight，随机排序
	randomizeSort: true,
	// 朋友圈最多展示条目数
	circleMaxItems: 20,
	// 每个友链最多抓取条目数
	circleMaxItemsPerFriend: 3,
};

export const friendsConfig = withOverride("friendsConfig", defaults);
