import assert from "node:assert/strict";
import { test } from "node:test";

import { rehypeImageDimensions } from "../src/plugins/rehype-image-dimensions.mjs";

test("adds intrinsic dimensions to local public images", async () => {
	const tree = {
		type: "root",
		children: [
			{
				type: "element",
				tagName: "img",
				properties: { src: "/assets/home/home.webp" },
				children: [],
			},
		],
	};

	await rehypeImageDimensions()(tree);
	assert.equal(tree.children[0].properties.width, 1024);
	assert.equal(tree.children[0].properties.height, 1024);
});

test("adds intrinsic dimensions to local images in raw HTML", async () => {
	const tree = {
		type: "root",
		children: [
			{
				type: "raw",
				value: '<img src="/images/albums/AcgExample/1.webp" alt="example">',
			},
		],
	};

	await rehypeImageDimensions()(tree);
	assert.match(tree.children[0].value, /width="1920"/);
	assert.match(tree.children[0].value, /height="1356"/);
});
