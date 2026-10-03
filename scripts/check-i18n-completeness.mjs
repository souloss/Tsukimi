import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const keySource = await readFile(path.join(root, "src/i18n/i18nKey.ts"), "utf8");
const keys = [...keySource.matchAll(/^\s*[A-Za-z0-9_]+\s*=\s*"([^"]+)"/gm)].map((match) => match[1]);
const languages = ["en", "ja", "zh_CN", "zh_TW"];
const errors = [];
for (const language of languages) {
	const source = await readFile(path.join(root, "src/i18n/languages", `${language}.ts`), "utf8");
	const translated = new Set([...source.matchAll(/\[Key\.([A-Za-z0-9_]+)\]/g)].map((match) => match[1]));
	const missing = keys.filter((key) => !translated.has(key));
	if (missing.length > 0) errors.push(`${language}: missing ${missing.join(", ")}`);
	if ([...translated].some((key) => !keys.includes(key))) errors.push(`${language}: contains unknown key`);
}
if (errors.length > 0) {
	console.error(`i18n completeness check failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`i18n completeness check passed (${keys.length} keys, ${languages.length} languages).`);
