import assert from "node:assert/strict";
import { test } from "node:test";

import { checkContentFiles } from "../scripts/check-content.mjs";

test("content validation reports draft count for the publish gate", async () => {
	const result = await checkContentFiles({ strictPublish: true });
	assert.equal(result.errors.length, 0);
	assert.equal(result.draftCount, 1);
});
