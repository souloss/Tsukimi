import type { FooterConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: FooterConfig = {
	enable: false,
	customHtml: "",
};

export const footerConfig = withOverride("footerConfig", defaults);
