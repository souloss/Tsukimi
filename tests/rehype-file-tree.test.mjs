import assert from "node:assert/strict";
import { test } from "node:test";

import astroConfig from "../astro.config.mjs";
import { remarkFileTree } from "../src/plugins/rehype-file-tree.mjs";

function listItem(value, children = []) {
	return {
		type: "listItem",
		children: [
			{ type: "paragraph", children: [{ type: "text", value }] },
			...(children.length > 0 ? [{ type: "list", children }] : []),
		],
	};
}

test("renders nested entries when folder names omit a trailing slash", () => {
	const tree = {
		type: "root",
		children: [
			{
				type: "containerDirective",
				name: "file-tree",
				children: [
					{
						type: "list",
						children: [
							listItem("src", [
								listItem("content", [
									listItem("posts", [listItem("index.md")]),
								]),
							]),
						],
					},
				],
			},
		],
	};

	remarkFileTree()(tree);
	const html = tree.children[0].value;

	for (const name of ["src", "content", "posts", "index.md"]) {
		assert.match(html, new RegExp(`>${name}<`));
	}
	assert.equal((html.match(/vp-file-tree-info folder/g) || []).length, 3);
});

test("renders nested entries through the configured Astro Markdown processor", async () => {
	const renderer = await astroConfig.markdown.processor.createRenderer({
		syntaxHighlight: false,
		gfm: true,
		smartypants: true,
	});
	const result = await renderer.render(`::: file-tree

- src
  - content
    - posts
      - my-first-post
        - index.md
        - cover.jpg

:::`);

	for (const name of [
		"src",
		"content",
		"posts",
		"my-first-post",
		"index.md",
		"cover.jpg",
	]) {
		assert.match(result.code, new RegExp(`>${name}<`));
	}
	assert.match(result.code, /vp-file-tree-name folder">src<\/span>/);
});
