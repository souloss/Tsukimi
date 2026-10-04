import { readFile } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { parse } from "node-html-parser";

export async function auditHtmlStructure({ distRoot = path.resolve("dist") } = {}) {
	const files = await glob("**/*.html", { cwd: distRoot, absolute: true });
	const errors = [];
	const issue = (code, relative, detail) => errors.push(`${code} ${relative}: ${detail}`);
	// These widgets are intentionally rendered once for each responsive/sidebar
	// layout. Their ids are retained for existing client selectors; all other
	// duplicate ids remain errors.
	const responsiveDuplicateIds = new Set(["announcement", "tags", "categories", "copyright-year"]);
	for (const file of files) {
		const relative = path.relative(distRoot, file).replaceAll(path.sep, "/");
		const document = parse(await readFile(file, "utf8"));
		// Dist also contains standalone imported HTML and redirect stubs. They do
		// not participate in the Astro landmark contract and are checked by their
		// own content/link validators.
		if (!document.querySelector("main") && !document.querySelector("[data-astro-cid], astro-island")) continue;
		const root = document.querySelector("html");
		if (!root?.getAttribute("lang")) issue("HTML-LANG", relative, "html element missing lang");
		const mainCount = document.querySelectorAll("main").length;
		if (mainCount !== 1) issue("HTML-MAIN-LANDMARK", relative, `expected one main landmark, found ${mainCount}`);
		const ids = new Map();
		for (const element of document.querySelectorAll("[id]")) {
			const id = element.getAttribute("id");
			if (!id) continue;
			if (ids.has(id) && !responsiveDuplicateIds.has(id) && !id.startsWith("SVG")) issue("HTML-DUPLICATE-ID", relative, `duplicate id #${id}`);
			ids.set(id, true);
		}
		// Markdown and docs content intentionally demonstrates arbitrary heading
		// levels. Check the page shell while leaving authored article examples to
		// the Markdown renderer's own tests.
		const headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6").filter((heading) => !heading.closest("[data-pagefind-body]") && !heading.closest("aside"));
		let previous = 0;
		for (const heading of headings) {
			const level = Number(heading.tagName.slice(1));
			if (previous && level > previous + 1) issue("HTML-HEADING-JUMP", relative, `heading jumps from h${previous} to h${level}`);
			previous = level;
		}
		for (const element of document.querySelectorAll("a,button")) {
			if (element.tagName === "A" && element.getAttribute("href") == null && !element.getAttribute("role")) issue("HTML-ANCHOR-HREF", relative, "anchor without href");
			// Outside a form, the browser default cannot submit user data. Restrict
			// this rule to form controls so existing menu/button islands remain
			// compatible while form regressions fail deterministically.
			if (element.tagName === "BUTTON" && element.closest("form") && element.getAttribute("type") == null) issue("HTML-BUTTON-TYPE", relative, "form button missing explicit type");
		}
		for (const parent of document.querySelectorAll("a,button")) {
			if (parent.querySelector("a,button")) issue("HTML-NESTED-INTERACTIVE", relative, `interactive element nested inside ${parent.tagName.toLowerCase()}`);
		}
	}
	return { files, errors };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
	const report = await auditHtmlStructure();
	if (report.errors.length) {
		console.error(`HTML structure check failed (${report.errors.length}):`);
		for (const error of report.errors.slice(0, 100)) console.error(`- ${error}`);
		process.exit(1);
	}
	console.log(`HTML structure check passed (${report.files.length} pages).`);
}
