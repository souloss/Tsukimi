import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { dirname, extname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import YAML from "yaml";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const postsRoot = resolve(projectRoot, "src/content/posts");

const supportedExtensions = new Set([".md", ".mdx"]);

function getFrontmatter(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	return match ? match[1] : null;
}

function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value) {
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}

	if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
		return false;
	}

	const date = new Date(value);
	return !Number.isNaN(date.getTime());
}

function normalizePath(value) {
	if (!isNonEmptyString(value)) return null;
	const normalized = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\/+|\/+$/g, "")
		.replace(/^posts\//, "");
	return normalized || null;
}

function formatPath(filePath) {
	return relative(projectRoot, filePath).split(sep).join("/");
}

function addError(errors, filePath, field, message) {
	errors.push(`${formatPath(filePath)}: ${field} ${message}`);
}

async function pathExists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function checkImagePath(filePath, image) {
	if (!isNonEmptyString(image) || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(image)) {
		return true;
	}

	if (image.startsWith("/")) {
		return pathExists(resolve(projectRoot, "public", image.slice(1)));
	}

	return pathExists(resolve(dirname(filePath), image));
}

function validateFieldTypes(filePath, data, errors) {
	if (!isNonEmptyString(data.title)) {
		addError(errors, filePath, "title", "must be a non-empty string");
	}

	if (!isValidDate(data.published)) {
		addError(errors, filePath, "published", "must be an ISO-like date");
	}

	if (data.updated !== undefined && !isValidDate(data.updated)) {
		addError(errors, filePath, "updated", "must be an ISO-like date");
	}

	if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string"))) {
		addError(errors, filePath, "tags", "must be an array of strings");
	}

	if (data.category !== undefined && data.category !== null && typeof data.category !== "string") {
		addError(errors, filePath, "category", "must be a string or null");
	}

	for (const field of ["draft", "pinned", "comment", "encrypted", "hideHomeContent"]) {
		if (data[field] !== undefined && typeof data[field] !== "boolean") {
			addError(errors, filePath, field, "must be a boolean");
		}
	}

	for (const field of ["priority", "seriesOrder"]) {
		if (data[field] !== undefined && (typeof data[field] !== "number" || !Number.isFinite(data[field]))) {
			addError(errors, filePath, field, "must be a finite number");
		}
	}

	if (data.encrypted === true && !isNonEmptyString(data.password)) {
		addError(errors, filePath, "password", "is required when encrypted is true");
	}

	if (data.image !== undefined && typeof data.image !== "string") {
		addError(errors, filePath, "image", "must be a string");
	}
}

export async function checkContentFiles({ root = postsRoot } = {}) {
	const files = (await glob("**/*", { cwd: root, absolute: true, nodir: true }))
		.filter((filePath) => supportedExtensions.has(extname(filePath).toLowerCase()))
		.sort();
	const errors = [];
	const routeOwners = new Map();

	for (const filePath of files) {
		const source = await readFile(filePath, "utf8");
		const frontmatter = getFrontmatter(source);
		if (frontmatter === null) {
			addError(errors, filePath, "frontmatter", "is required");
			continue;
		}

		const document = YAML.parseDocument(frontmatter, { uniqueKeys: true });
		for (const error of document.errors) {
			addError(errors, filePath, "frontmatter", error.message);
		}
		if (document.errors.length > 0) continue;

		const data = document.toJS();
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			addError(errors, filePath, "frontmatter", "must contain an object");
			continue;
		}

		validateFieldTypes(filePath, data, errors);

		if (data.image && !(await checkImagePath(filePath, data.image))) {
			addError(errors, filePath, "image", `file does not exist: ${data.image}`);
		}

		const routes = [data.permalink, data.alias, data.slug]
			.map(normalizePath)
			.filter(Boolean);
		for (const route of routes) {
			const owner = routeOwners.get(route);
			if (owner && owner !== filePath) {
				addError(errors, filePath, "permalink", `conflicts with ${formatPath(owner)} at ${route}`);
			} else {
				routeOwners.set(route, filePath);
			}
		}
	}

	return { files, errors };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const result = await checkContentFiles();
	if (result.errors.length > 0) {
		console.error(`Content validation failed with ${result.errors.length} error(s):`);
		for (const error of result.errors) console.error(`  - ${error}`);
		process.exitCode = 1;
	} else {
		console.log(`Content validation passed (${result.files.length} post files).`);
	}
}
