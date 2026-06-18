import type { SponsorConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

// 赞助页面配置
const defaults: SponsorConfig = {
	// 页面标题
	title: "支持与赞助",
	// 页面描述
	description: "觉得有用的话，可以请杯咖啡 ☕",
	// 赞助用途说明
	usage: "你的支持将用于服务器维护、域名续费等开支，让项目能够持续运行下去。",
	// 赞助方式列表
	methods: [
		{
			name: "支付宝",
			icon: "fa7-brands:alipay",
			qrCode: "/sponsor/alipay.png",
			enabled: true,
		},
		{
			name: "微信支付",
			icon: "fa7-brands:weixin",
			qrCode: "/sponsor/wx.png",
			enabled: true,
		},
	],
	// 赞助者列表（可选）
	sponsors: [
		{
			name: "支持者A",
			amount: "50元",
			date: "2025-01-01",
		},
	],
	// 是否显示赞助者列表
	showSponsorsList: true,
	// 是否显示评论区
	showComment: false,
	// 是否在文章详情页底部显示赞助按钮
	showButtonInPost: true,
};

export const sponsorConfig = withOverride("sponsorConfig", defaults);
