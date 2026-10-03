export const PERSISTENT_STATE_VERSION = 1;
const VERSION_KEY = "tsukimi:persistent-state-version";
const legacyKeys = [
	"theme",
	"hue",
	"material-theme-style",
	"texturePreset",
	"textureOpacity",
	"reduceMotion",
	"wallpaperMode",
	"postListLayout",
	"selectedFont",
	"stickyNavbar",
	"wavesEnabled",
	"gradientEnabled",
	"sakuraEnabled",
	"bannerTitleEnabled",
	"bannerCarouselEnabled",
	"overlayOpacity",
	"overlayBlur",
	"overlayCardOpacity",
	"musicPlayerVolume",
];
let migrated = false;

export function migratePersistentState(storage?: Storage): number {
	if (migrated || !storage) return PERSISTENT_STATE_VERSION;
	const current = Number.parseInt(storage.getItem(VERSION_KEY) ?? "0", 10);
	if (!Number.isFinite(current) || current < PERSISTENT_STATE_VERSION) {
		for (const key of legacyKeys) {
			const value = storage.getItem(key);
			if (value !== null) storage.setItem(key, value);
		}
		storage.setItem(VERSION_KEY, String(PERSISTENT_STATE_VERSION));
	}
	migrated = true;
	return PERSISTENT_STATE_VERSION;
}

export function ensurePersistentState(): void {
	if (typeof window !== "undefined" && window.localStorage)
		migratePersistentState(window.localStorage);
}

export function resetPersistentStateMigrationForTests(): void {
	migrated = false;
}
