import {
	type DynamicScheme,
	Hct,
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeRainbow,
	SchemeTonalSpot,
	SchemeVibrant,
} from "@material/material-color-utilities";
import { siteConfig } from "@/config/siteConfig";

export const MATERIAL_PALETTE_STYLES = [
	"tonalSpot",
	"vibrant",
	"expressive",
	"content",
	"rainbow",
	"fruitSalad",
	"monochrome",
	"neutral",
	"fidelity",
] as const;

export type MaterialPaletteStyle = (typeof MATERIAL_PALETTE_STYLES)[number];
export type MaterialColorSpec = "2021" | "2025";
export type MaterialColorRole =
	| "primary"
	| "onPrimary"
	| "primaryContainer"
	| "onPrimaryContainer"
	| "secondary"
	| "onSecondary"
	| "secondaryContainer"
	| "onSecondaryContainer"
	| "tertiary"
	| "onTertiary"
	| "tertiaryContainer"
	| "onTertiaryContainer"
	| "error"
	| "onError"
	| "errorContainer"
	| "onErrorContainer"
	| "surface"
	| "surfaceDim"
	| "surfaceBright"
	| "surfaceContainerLowest"
	| "surfaceContainerLow"
	| "surfaceContainer"
	| "surfaceContainerHigh"
	| "surfaceContainerHighest"
	| "onSurface"
	| "surfaceVariant"
	| "onSurfaceVariant"
	| "outline"
	| "outlineVariant"
	| "inverseSurface"
	| "inverseOnSurface"
	| "inversePrimary"
	| "shadow"
	| "scrim"
	| "surfaceTint";

export type MaterialColorScheme = Record<MaterialColorRole, string>;

const ROLE_RESOLVERS = {
	primary: (scheme: DynamicScheme) => scheme.primary,
	onPrimary: (scheme: DynamicScheme) => scheme.onPrimary,
	primaryContainer: (scheme: DynamicScheme) => scheme.primaryContainer,
	onPrimaryContainer: (scheme: DynamicScheme) => scheme.onPrimaryContainer,
	secondary: (scheme: DynamicScheme) => scheme.secondary,
	onSecondary: (scheme: DynamicScheme) => scheme.onSecondary,
	secondaryContainer: (scheme: DynamicScheme) => scheme.secondaryContainer,
	onSecondaryContainer: (scheme: DynamicScheme) => scheme.onSecondaryContainer,
	tertiary: (scheme: DynamicScheme) => scheme.tertiary,
	onTertiary: (scheme: DynamicScheme) => scheme.onTertiary,
	tertiaryContainer: (scheme: DynamicScheme) => scheme.tertiaryContainer,
	onTertiaryContainer: (scheme: DynamicScheme) => scheme.onTertiaryContainer,
	error: (scheme: DynamicScheme) => scheme.error,
	onError: (scheme: DynamicScheme) => scheme.onError,
	errorContainer: (scheme: DynamicScheme) => scheme.errorContainer,
	onErrorContainer: (scheme: DynamicScheme) => scheme.onErrorContainer,
	surface: (scheme: DynamicScheme) => scheme.surface,
	surfaceDim: (scheme: DynamicScheme) => scheme.surfaceDim,
	surfaceBright: (scheme: DynamicScheme) => scheme.surfaceBright,
	surfaceContainerLowest: (scheme: DynamicScheme) =>
		scheme.surfaceContainerLowest,
	surfaceContainerLow: (scheme: DynamicScheme) => scheme.surfaceContainerLow,
	surfaceContainer: (scheme: DynamicScheme) => scheme.surfaceContainer,
	surfaceContainerHigh: (scheme: DynamicScheme) => scheme.surfaceContainerHigh,
	surfaceContainerHighest: (scheme: DynamicScheme) =>
		scheme.surfaceContainerHighest,
	onSurface: (scheme: DynamicScheme) => scheme.onSurface,
	surfaceVariant: (scheme: DynamicScheme) => scheme.surfaceVariant,
	onSurfaceVariant: (scheme: DynamicScheme) => scheme.onSurfaceVariant,
	outline: (scheme: DynamicScheme) => scheme.outline,
	outlineVariant: (scheme: DynamicScheme) => scheme.outlineVariant,
	inverseSurface: (scheme: DynamicScheme) => scheme.inverseSurface,
	inverseOnSurface: (scheme: DynamicScheme) => scheme.inverseOnSurface,
	inversePrimary: (scheme: DynamicScheme) => scheme.inversePrimary,
	shadow: (scheme: DynamicScheme) => scheme.shadow,
	scrim: (scheme: DynamicScheme) => scheme.scrim,
	surfaceTint: (scheme: DynamicScheme) => scheme.surfaceTint,
} satisfies Record<MaterialColorRole, (scheme: DynamicScheme) => number>;

const SCHEME_BUILDERS: Record<
	MaterialPaletteStyle,
	(source: Hct, isDark: boolean, spec: MaterialColorSpec) => DynamicScheme
> = {
	tonalSpot: (source, isDark, _spec) => new SchemeTonalSpot(source, isDark, 0),
	vibrant: (source, isDark, _spec) => new SchemeVibrant(source, isDark, 0),
	expressive: (source, isDark, _spec) =>
		new SchemeExpressive(source, isDark, 0),
	content: (source, isDark, _spec) => new SchemeContent(source, isDark, 0),
	rainbow: (source, isDark, _spec) => new SchemeRainbow(source, isDark, 0),
	fruitSalad: (source, isDark, _spec) =>
		new SchemeFruitSalad(source, isDark, 0),
	monochrome: (source, isDark, _spec) =>
		new SchemeMonochrome(source, isDark, 0),
	neutral: (source, isDark, _spec) => new SchemeNeutral(source, isDark, 0),
	fidelity: (source, isDark, _spec) => new SchemeFidelity(source, isDark, 0),
};

function hexFromArgb(argb: number): string {
	return `#${[16, 8, 0]
		.map((shift) => ((argb >> shift) & 0xff).toString(16).padStart(2, "0"))
		.join("")}`;
}

export function isMaterialPaletteStyle(
	value: string,
): value is MaterialPaletteStyle {
	return (MATERIAL_PALETTE_STYLES as readonly string[]).includes(value);
}

export function getStoredMaterialPaletteStyle(): MaterialPaletteStyle {
	if (typeof localStorage === "undefined") return "tonalSpot";
	const stored = localStorage.getItem("material-theme-style");
	return stored && isMaterialPaletteStyle(stored)
		? stored
		: getDefaultMaterialPaletteStyle();
}

export function getDefaultMaterialPaletteStyle(): MaterialPaletteStyle {
	const configured = siteConfig.themeColor.paletteStyle;
	return configured && isMaterialPaletteStyle(configured)
		? configured
		: "tonalSpot";
}

export function resolveMaterialColorScheme(
	hue: number,
	isDark: boolean,
	style: MaterialPaletteStyle = "tonalSpot",
	spec: MaterialColorSpec = "2025",
): MaterialColorScheme {
	const source = Hct.from(Number.isFinite(hue) ? hue : 250, 60, 50);
	const scheme = SCHEME_BUILDERS[style](source, isDark, spec);
	const colors = {} as MaterialColorScheme;
	for (const [role, resolve] of Object.entries(ROLE_RESOLVERS)) {
		colors[role as MaterialColorRole] = hexFromArgb(resolve(scheme));
	}
	return colors;
}

export function materialColorCssVariables(
	colors: MaterialColorScheme,
): Record<string, string> {
	const variables = Object.fromEntries(
		Object.entries(colors).map(([role, value]) => [
			`--mc-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
			value,
		]),
	);
	return {
		...variables,
		"--primary": "var(--mc-primary)",
		"--secondary": "var(--mc-secondary)",
		"--tertiary": "var(--mc-tertiary)",
		"--accent-color": "var(--mc-primary)",
		"--accent": "var(--mc-primary)",
		"--page-bg": "var(--mc-surface)",
		"--card-bg": "var(--mc-surface-container-low)",
		"--text-primary": "var(--mc-on-surface)",
		"--text-secondary": "var(--mc-on-surface-variant)",
		"--bg-muted": "var(--mc-surface-container-high)",
		"--btn-content": "var(--mc-on-secondary-container)",
		"--btn-regular-bg": "var(--mc-secondary-container)",
		"--btn-regular-bg-hover": "var(--mc-surface-container-high)",
		"--btn-regular-bg-active": "var(--mc-surface-container-highest)",
		"--btn-plain-bg-hover": "var(--mc-surface-container-low)",
		"--btn-plain-bg-active": "var(--mc-surface-container-high)",
		"--btn-card-bg-hover": "var(--mc-surface-container-low)",
		"--btn-card-bg-active": "var(--mc-surface-container-high)",
		"--enter-btn-bg": "var(--mc-primary-container)",
		"--enter-btn-bg-hover": "var(--mc-primary)",
		"--enter-btn-bg-active": "var(--mc-primary)",
		"--deep-text": "var(--mc-on-surface)",
		"--title-active": "var(--mc-primary)",
		"--inline-code-bg": "var(--mc-surface-container-high)",
		"--inline-code-color": "var(--mc-on-surface)",
		"--selection-bg": "var(--mc-primary-container)",
		"--codeblock-bg": "var(--mc-surface-container-low)",
		"--codeblock-topbar-bg": "var(--mc-surface-container)",
		"--link-hover": "var(--mc-primary-container)",
		"--link-active": "var(--mc-primary-container)",
		"--float-panel-bg": "var(--mc-surface-container)",
		"--line-divider": "var(--mc-outline-variant)",
		"--line-color": "var(--mc-outline-variant)",
		"--content-meta": "var(--mc-on-surface-variant)",
		"--toc-badge-bg": "var(--mc-primary-container)",
		"--toc-item-active": "var(--mc-primary)",
	};
}

const styleCache = new Map<string, string>();

export function materialColorSchemeStyle(
	hue: number,
	style: MaterialPaletteStyle,
	spec: MaterialColorSpec,
): string {
	const key = `${hue}:${style}:${spec}`;
	const cached = styleCache.get(key);
	if (cached) return cached;

	const css = ([false, true] as const)
		.map((isDark) => {
			// Match and outrank the legacy :root theme declarations that are
			// emitted later in the bundled stylesheet.
			const selector = isDark ? "html:root.dark" : "html:root:not(.dark)";
			const variables = materialColorCssVariables(
				resolveMaterialColorScheme(hue, isDark, style, spec),
			);
			const declarations = Object.entries(variables)
				.map(([key, value]) => `${key}:${value}`)
				.join(";");
			return `${selector}{${declarations}}`;
		})
		.join("");
	styleCache.set(key, css);
	return css;
}
