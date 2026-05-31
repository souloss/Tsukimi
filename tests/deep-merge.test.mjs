// Run with: node --experimental-strip-types tests/deep-merge.test.mjs
const { deepMerge, isPlainObject } = await import("../src/utils/deep-merge.ts");

// Test isPlainObject
console.assert(isPlainObject({}) === true, "isPlainObject: empty object");
console.assert(
	isPlainObject({ a: 1 }) === true,
	"isPlainObject: object with props",
);
console.assert(isPlainObject(null) === false, "isPlainObject: null");
console.assert(isPlainObject([]) === false, "isPlainObject: array");
console.assert(isPlainObject("string") === false, "isPlainObject: string");
console.assert(isPlainObject(42) === false, "isPlainObject: number");

// Test deepMerge — primitives replaced
const result1 = deepMerge({ a: "default", b: 2 }, { a: "override" });
console.assert(result1.a === "override", "deepMerge: primitive override");
console.assert(result1.b === 2, "deepMerge: primitive inherited");

// Test deepMerge — objects merged recursively
const result2 = deepMerge(
	{ banner: { enable: true, interval: 3, switchable: true } },
	{ banner: { enable: false } },
);
console.assert(
	result2.banner.enable === false,
	"deepMerge: nested object override",
);
console.assert(
	result2.banner.interval === 3,
	"deepMerge: nested object inherit",
);
console.assert(
	result2.banner.switchable === true,
	"deepMerge: nested object inherit",
);

// Test deepMerge — arrays replaced entirely
const result3 = deepMerge(
	{ links: [{ name: "GitHub" }, { name: "Twitter" }] },
	{ links: [{ name: "Bilibili" }] },
);
console.assert(result3.links.length === 1, "deepMerge: array replaced");
console.assert(
	result3.links[0].name === "Bilibili",
	"deepMerge: array content replaced",
);

// Test deepMerge — deeply nested
const result4 = deepMerge(
	{ analytics: { umami: { websiteId: "", scriptUrl: "" } } },
	{ analytics: { umami: { websiteId: "abc123" } } },
);
console.assert(
	result4.analytics.umami.websiteId === "abc123",
	"deepMerge: deep override",
);
console.assert(
	result4.analytics.umami.scriptUrl === "",
	"deepMerge: deep inherit",
);

// Test deepMerge — empty source preserves target
const result5 = deepMerge({ a: "default" }, {});
console.assert(
	result5.a === "default",
	"deepMerge: empty source preserves target",
);

// Test deepMerge — new keys added from source
const result6 = deepMerge({ a: 1 }, { b: 2 });
console.assert(result6.a === 1, "deepMerge: preserve target key");
console.assert(result6.b === 2, "deepMerge: add source key");

console.log("All deepMerge tests passed!");
