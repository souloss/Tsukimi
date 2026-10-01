export type TexturePreset =
	| "none"
	| "starlight"
	| "cyber-dots"
	| "topography"
	| "geometric"
	| "sakura";

export interface TextureConfig {
	enable?: boolean;
	switchable?: boolean;
	defaultPreset?: TexturePreset;
	defaultOpacity?: number;
	allowMotion?: boolean;
}
