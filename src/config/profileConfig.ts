import type { ProfileConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: ProfileConfig = {
	avatar: "assets/images/avatar.png",
	name: "Souloss",
	bio: "向下深挖一英里，向上构建一厘米",
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/souloss",
		},
		{
			name: "Bilibili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/15269273",
		},
	],
};

export const profileConfig = withOverride("profileConfig", defaults);
