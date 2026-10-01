export interface ImageProps {
	id?: string;
	src: string;
	class?: string;
	alt?: string;
	position?: string;
	basePath?: string;
	loading?: "eager" | "lazy";
	fetchpriority?: "high" | "low" | "auto";
	width?: number;
	height?: number;
	widths?: number[];
	sizes?: string;
	placeholder?: string;
	fit?: "cover" | "contain";
	aspectRatio?: string;
}
