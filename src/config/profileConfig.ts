import type { ProfileConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: ProfileConfig = {
	avatar: "assets/images/avatar.webp",
	name: "Souloss",
	bio: "一直很担心会什么都没有做就这样长大",
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
