import assert from "node:assert/strict";
import { test } from "node:test";

import {
	migratePersistentState,
	PERSISTENT_STATE_VERSION,
	resetPersistentStateMigrationForTests,
} from "../src/utils/persistent-state.ts";

class MemoryStorage implements Storage {
	private values = new Map<string, string>();
	get length() {
		return this.values.size;
	}
	clear() {
		this.values.clear();
	}
	getItem(key: string) {
		return this.values.get(key) ?? null;
	}
	key(index: number) {
		return [...this.values.keys()][index] ?? null;
	}
	removeItem(key: string) {
		this.values.delete(key);
	}
	setItem(key: string, value: string) {
		this.values.set(key, value);
	}
}

test("persistent settings migration records a version and preserves legacy values", () => {
	const storage = new MemoryStorage();
	storage.setItem("theme", "dark");
	resetPersistentStateMigrationForTests();
	assert.equal(migratePersistentState(storage), PERSISTENT_STATE_VERSION);
	assert.equal(storage.getItem("theme"), "dark");
	assert.equal(storage.getItem("tsukimi:persistent-state-version"), "1");
	assert.equal(migratePersistentState(storage), PERSISTENT_STATE_VERSION);
});
