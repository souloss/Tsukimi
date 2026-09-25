import type { LayoutNode } from "@components/features/knowledge-graph/graph-layout-utils";

type Point = { x: number; y: number };
type Pointer = Point & {
	start: Point;
	node?: LayoutNode;
	offset: Point;
	moved: boolean;
};

export function useGraphViewport(
	getSvg: () => SVGSVGElement,
	drag: (node: LayoutNode, point: Point | null) => void,
) {
	const view = $state({ x: 0, y: 0, scale: 1, width: 900, height: 560 });
	const pointers = new Map<number, Pointer>();
	let suppressClick = false;
	let userMoved = false;
	let pinch: { distance: number; scale: number; anchor: Point } | null = null;
	const world = (point: Point) => ({
		x: (point.x - view.x) / view.scale,
		y: (point.y - view.y) / view.scale,
	});
	function local(event: { clientX: number; clientY: number }) {
		const matrix = getSvg().getScreenCTM();
		const point = new DOMPoint(event.clientX, event.clientY);
		return matrix ? point.matrixTransform(matrix.inverse()) : point;
	}
	function zoomAt(scale: number, point: Point) {
		const anchor = world(point);
		view.scale = Math.min(6, Math.max(0.08, scale));
		view.x = point.x - anchor.x * view.scale;
		view.y = point.y - anchor.y * view.scale;
	}
	function zoom(factor: number) {
		userMoved = true;
		zoomAt(view.scale * factor, { x: view.width / 2, y: view.height / 2 });
	}
	function fit(nodes: LayoutNode[], automatic = false) {
		if (!nodes.length || (automatic && userMoved)) return;
		const xs = nodes.map((n) => n.x);
		const ys = nodes.map((n) => n.y);
		const minX = Math.min(...xs) - 85;
		const maxX = Math.max(...xs) + 110;
		const minY = Math.min(...ys) - 100;
		const maxY = Math.max(...ys) + 80;
		view.scale = Math.min(
			1.6,
			Math.max(
				0.08,
				Math.min(
					(view.width - 32) / (maxX - minX),
					(view.height - 72) / (maxY - minY),
				),
			),
		);
		view.x = view.width / 2 - ((minX + maxX) / 2) * view.scale;
		view.y = view.height / 2 - ((minY + maxY) / 2) * view.scale;
	}
	function resize(width: number, height: number) {
		view.x += (width - view.width) / 2;
		view.y += (height - view.height) / 2;
		view.width = width;
		view.height = height;
	}
	function down(event: PointerEvent, node?: LayoutNode) {
		if (event.button !== 0) return;
		event.stopPropagation();
		const point = local(event);
		const target = event.currentTarget as SVGElement;
		// Capture the node link itself, preserving native click and modifier-key navigation.
		target.setPointerCapture(event.pointerId);
		suppressClick = false;
		pointers.set(event.pointerId, {
			...point,
			x: point.x,
			y: point.y,
			start: point,
			node,
			offset: node
				? { x: node.x - world(point).x, y: node.y - world(point).y }
				: { x: 0, y: 0 },
			moved: false,
		});
		if (pointers.size === 2) {
			for (const pointer of pointers.values()) {
				if (pointer.node) drag(pointer.node, null);
				pointer.node = undefined;
				pointer.moved = true;
			}
			const [a, b] = [...pointers.values()];
			pinch = {
				distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
				scale: view.scale,
				anchor: world({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }),
			};
		}
	}
	function move(event: PointerEvent) {
		const pointer = pointers.get(event.pointerId);
		if (!pointer) return;
		const point = local(event);
		const previous = { x: pointer.x, y: pointer.y };
		pointer.x = point.x;
		pointer.y = point.y;
		// The SVG viewport matches its CSS dimensions; the threshold stays at five pixels.
		if (Math.hypot(point.x - pointer.start.x, point.y - pointer.start.y) > 5)
			pointer.moved = true;
		if (!pointer.moved && !pinch) return;
		userMoved = true;
		if (pinch && pointers.size >= 2) {
			const [a, b] = [...pointers.values()];
			view.scale = Math.min(
				6,
				Math.max(
					0.08,
					(pinch.scale * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.distance,
				),
			);
			view.x = (a.x + b.x) / 2 - pinch.anchor.x * view.scale;
			view.y = (a.y + b.y) / 2 - pinch.anchor.y * view.scale;
		} else if (pointer.node) {
			const target = world(point);
			drag(pointer.node, {
				x: target.x + pointer.offset.x,
				y: target.y + pointer.offset.y,
			});
		} else {
			view.x += point.x - previous.x;
			view.y += point.y - previous.y;
		}
	}
	function up(event: PointerEvent) {
		const pointer = pointers.get(event.pointerId);
		if (!pointer) return;
		suppressClick = pointer.moved || event.type === "pointercancel";
		if (pointer.node && pointer.moved) drag(pointer.node, null);
		pointers.delete(event.pointerId);
		pinch = null;
		if (
			event.target instanceof Element &&
			event.target.hasPointerCapture(event.pointerId)
		)
			event.target.releasePointerCapture(event.pointerId);
	}
	function click(event: MouseEvent) {
		if (!suppressClick) return false;
		event.preventDefault();
		event.stopPropagation();
		suppressClick = false;
		return true;
	}
	function wheel(event: WheelEvent) {
		event.preventDefault();
		userMoved = true;
		const delta =
			event.deltaY *
			(event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.height : 1);
		zoomAt(
			view.scale * Math.exp(-Math.max(-160, Math.min(160, delta)) * 0.003),
			local(event),
		);
	}
	function keydown(event: KeyboardEvent) {
		if (event.target !== getSvg()) return;
		if (
			[
				"+",
				"=",
				"-",
				"0",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
			].includes(event.key)
		)
			event.preventDefault();
		if (event.key === "+" || event.key === "=") zoom(1.2);
		if (event.key === "-") zoom(1 / 1.2);
		const step = event.shiftKey ? 100 : 35;
		if (event.key.startsWith("Arrow")) userMoved = true;
		if (event.key === "ArrowUp") view.y += step;
		if (event.key === "ArrowDown") view.y -= step;
		if (event.key === "ArrowLeft") view.x += step;
		if (event.key === "ArrowRight") view.x -= step;
	}
	return {
		view,
		down,
		move,
		up,
		click,
		wheel,
		zoom,
		fit,
		resize,
		keydown,
		resetInteraction: () => {
			userMoved = false;
		},
		isDragging: () => [...pointers.values()].some((p) => p.moved),
	};
}
