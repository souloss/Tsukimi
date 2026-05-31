import type { MusicPlayerConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: MusicPlayerConfig = {
	enable: true,
	showFloatingPlayer: true,
	floatingEntryMode: "fab",
	mode: "local",
	meting: {
		api: "https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
		id: "14164869977",
		server: "netease",
		type: "playlist",
	},
};

export const musicPlayerConfig = withOverride("musicConfig", defaults);
