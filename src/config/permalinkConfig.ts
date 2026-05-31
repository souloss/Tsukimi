import type { PermalinkConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: PermalinkConfig = {
	enable: false,
	format: "%postname%",
};

export const permalinkConfig = withOverride("permalinkConfig", defaults);
