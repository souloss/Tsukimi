import type { FontItem } from "@/types/config";

const FALLBACK_FONT_FAMILIES = [
	"system-ui",
	"-apple-system",
	"BlinkMacSystemFont",
	"'Segoe UI'",
	"Roboto",
	"sans-serif",
] as const;

export interface FontStylesheet {
	id: string;
	href: string;
}

export function getFontFamily(font: FontItem): string {
	const familyParts: string[] = [];
	const mainFamily = font.fontFamily ?? font.family;
	if (mainFamily) {
		familyParts.push(mainFamily);
	}
	if (font.cjkFontFamily) {
		familyParts.push(font.cjkFontFamily);
	}
	familyParts.push(...FALLBACK_FONT_FAMILIES);
	return familyParts.join(", ");
}

export function getFontStylesheets(font: FontItem): FontStylesheet[] {
	const stylesheets = [
		...(font.googleFonts
			? [{ id: `${font.id}-gfonts`, href: font.googleFonts }]
			: []),
		...(font.cdnUrls ?? []).map((href, index) => ({
			id: `${font.id}-cdn-${index}`,
			href,
		})),
		...(font.cdnUrl ? [{ id: `${font.id}-cdn`, href: font.cdnUrl }] : []),
	];
	const seen = new Set<string>();
	return stylesheets.filter(({ href }) => {
		if (seen.has(href)) return false;
		seen.add(href);
		return true;
	});
}
