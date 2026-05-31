import type { ShareConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: ShareConfig = {
	enable: true,
};

export const shareConfig = withOverride("shareConfig", defaults);
