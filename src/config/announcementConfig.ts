import type { AnnouncementConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: AnnouncementConfig = {
	title: "",
	content: "欢迎来到我的博客！这是一条示例公告",
	closable: true,
	link: {
		enable: true,
		text: "Learn More",
		url: "/about/",
		external: false,
	},
};

export const announcementConfig = withOverride("announcementConfig", defaults);
