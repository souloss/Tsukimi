import type { FabDevice } from "@/types/fab";

const DEVICE_CLASSES: Record<FabDevice, string> = {
	mobile: "fab-visible-mobile",
	tablet: "fab-visible-tablet",
	desktop: "fab-visible-desktop",
};

export function fabDeviceClasses(devices: readonly FabDevice[]): string {
	const allowed = new Set(devices);
	return (Object.keys(DEVICE_CLASSES) as FabDevice[])
		.filter((device) => !allowed.has(device))
		.map((device) => `fab-hide-${device}`)
		.join(" ");
}
