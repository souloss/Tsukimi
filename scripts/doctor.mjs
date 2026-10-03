import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const errors = [];
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 22) errors.push(`Node ${process.versions.node} is below the required >=22 engine`);
let pnpmVersion = "unknown";
try { pnpmVersion = execFileSync("pnpm", ["--version"], { encoding: "utf8" }).trim(); } catch { errors.push("pnpm is not available on PATH"); }
if (pnpmVersion !== "unknown" && !pnpmVersion.startsWith("10.")) errors.push(`pnpm ${pnpmVersion} does not match packageManager ${packageJson.packageManager}`);
if (process.env.TZ !== "UTC") console.log(`doctor: TZ=${process.env.TZ ?? "unset"}; CI uses UTC for deterministic dates`);
console.log(`doctor: Node ${process.versions.node}, pnpm ${pnpmVersion}, package manager ${packageJson.packageManager}`);
if (errors.length) { for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log("Doctor check passed.");
