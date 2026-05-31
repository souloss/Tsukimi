import type { PioConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: PioConfig = {
	enable: true,
	models: ["/pio/models/NOIR/noir.model3.json"],
	position: "left",
	width: 280,
	height: 250,
	mode: "draggable",
	hiddenOnMobile: true,
	hideAboutMenu: false,
	dialog: {
		welcome: "Welcome to souloss Blog!",
		touch: [
			"What are you doing?",
			"Stop touching me!",
			"HENTAI!",
			"Don't bully me like that!",
		],
		home: "Click here to go back to homepage!",
		skin: ["Want to see my new outfit?", "The new outfit looks great~"],
		close: "QWQ See you next time~",
		link: "https://github.com/souloss/tsukimi",
	},
};

export const pioConfig = withOverride("pioConfig", defaults);
