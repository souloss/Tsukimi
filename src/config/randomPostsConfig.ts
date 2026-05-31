import type { RandomPostsConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: RandomPostsConfig = {
	enable: true,
	maxCount: 5,
};

export const randomPostsConfig = withOverride("randomPostsConfig", defaults);
