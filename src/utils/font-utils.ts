import type { FontItem } from "@/types/config";

export interface FontStylesheet {
	id: string;
	href: string;
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
