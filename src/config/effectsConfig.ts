import type { EffectsConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

// 特效配置
const defaults: EffectsConfig = {
	sakura: {
		enable: false,
		switchable: true,
		config: {
			sakuraNum: 21,
			limitTimes: -1,
			size: {
				min: 0.5,
				max: 1.1,
			},
			opacity: {
				min: 0.3,
				max: 0.9,
			},
			speed: {
				horizontal: {
					min: -1.7,
					max: -1.2,
				},
				vertical: {
					min: 1.5,
					max: 2.2,
				},
				rotation: 0.03,
				fadeSpeed: 0.03,
			},
			zIndex: 100,
		},
	},
};

export const effectsConfig = withOverride("effectsConfig", defaults);
