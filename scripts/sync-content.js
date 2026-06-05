import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("已加载 .env 配置文件\n");

// 从环境变量读取配置
const ENABLE_CONTENT_SYNC = process.env.ENABLE_CONTENT_SYNC === "true"; // 默认禁用
const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || "";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, "content");

console.log("开始同步内容...\n");

// 检查是否启用内容分离
if (!ENABLE_CONTENT_SYNC) {
	console.log("内容分离功能未启用");
	console.log("提示：将使用本地内容，不会从远程仓库同步");
	console.log("      若要启用内容分离，请在 .env 中设置：");
	console.log("      ENABLE_CONTENT_SYNC=true");
	console.log("      CONTENT_REPO_URL=<your-repo-url>\n");
	process.exit(0);
}

// 检查内容目录是否存在
if (!fs.existsSync(CONTENT_DIR)) {
	console.log(`内容目录不存在：${CONTENT_DIR}`);
	console.log("将使用独立仓库模式");

	if (!CONTENT_REPO_URL) {
		console.warn("警告：未设置 CONTENT_REPO_URL，将使用本地内容");
		console.log(
			"提示：请设置 CONTENT_REPO_URL 环境变量，或手动创建内容目录",
		);
		process.exit(0);
	}

	try {
		console.log(`正在克隆内容仓库：${CONTENT_REPO_URL}`);
		execSync(`git clone --depth 1 ${CONTENT_REPO_URL} ${CONTENT_DIR}`, {
			stdio: "inherit",
			cwd: rootDir,
		});
		console.log("内容仓库克隆成功");
	} catch (error) {
		console.error("克隆失败：", error.message);
		process.exit(1);
	}
} else {
	console.log(`内容目录已存在：${CONTENT_DIR}`);

	if (fs.existsSync(path.join(CONTENT_DIR, ".git"))) {
		try {
			console.log("正在同步远程内容（强制模式）...");

			// 1. 防止本地修改丢失
			execSync("git stash push --include-untracked -m 'auto-sync'", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 2. 更新远程引用
			execSync("git fetch --all --prune", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 3. 判断分支
			let branch = "main";
			try {
				execSync("git rev-parse --verify origin/main", { cwd: CONTENT_DIR });
			} catch {
				branch = "master";
			}

			// 4. 强制同步
		execSync(`git checkout ${branch}`, { cwd: CONTENT_DIR });
		execSync(`git reset --hard origin/${branch}`, { cwd: CONTENT_DIR });

		console.log(`内容同步成功（分支：${branch}）`);
		} catch (error) {
			console.warn("内容更新失败：", error.message);
		}
	}
}

// 创建符号链接或复制内容
console.log("\n正在建立内容链接...");

const contentMappings = [
	{ src: "posts", dest: "src/content/posts" },
	{ src: "spec", dest: "src/content/spec" },
	{ src: "data", dest: "src/data" },
	{ src: "images", dest: "public/images" },
];

for (const mapping of contentMappings) {
	const srcPath = path.join(CONTENT_DIR, mapping.src);
	const destPath = path.join(rootDir, mapping.dest);

	if (!fs.existsSync(srcPath)) {
		console.log(`跳过不存在的源目录：${mapping.src}`);
		continue;
	}

	// 如果目标已存在且不是符号链接,备份它
	if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isSymbolicLink()) {
		const cacheDir = path.join(rootDir, "cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}
		const backupName = mapping.dest.replace(/\//g, "_") + ".backup";
		const backupPath = path.join(cacheDir, backupName);
		console.log(
			`正在备份已有内容：${mapping.dest} -> cache/${backupName}`,
		);
		if (fs.existsSync(backupPath)) {
			fs.rmSync(backupPath, { recursive: true, force: true });
		}
		fs.renameSync(destPath, backupPath);
	}

	// 删除现有的符号链接
	if (fs.existsSync(destPath)) {
		fs.unlinkSync(destPath);
	}

	// 创建符号链接 (Windows 需要管理员权限,否则复制文件)
	try {
		const relPath = path.relative(path.dirname(destPath), srcPath);
		fs.symlinkSync(relPath, destPath, "junction");
		console.log(`已创建符号链接：${mapping.dest} -> ${mapping.src}`);
	} catch (error) {
		console.log(`符号链接失败，改为复制内容：${mapping.src} -> ${mapping.dest}`);
		copyRecursive(srcPath, destPath);
	}
}

// ── Override files: content/overrides/ → src/overrides/ (copy, not symlink) ──
const overridesSrc = path.join(CONTENT_DIR, "overrides");
const overridesDest = path.join(rootDir, "src/overrides");
if (fs.existsSync(overridesSrc)) {
	if (fs.existsSync(overridesDest)) {
		fs.rmSync(overridesDest, { recursive: true, force: true });
	}
	copyRecursive(overridesSrc, overridesDest);
	console.log("已同步配置覆盖文件");
}

// ── Personal assets: content/assets/ → src/assets/ (merge into existing tree) ──
const assetsSrc = path.join(CONTENT_DIR, "assets");
if (fs.existsSync(assetsSrc)) {
	copyMergeRecursive(assetsSrc, path.join(rootDir, "src/assets"));
	console.log("已同步私人资源文件到 src/assets/");

	// ── Favicon: content/assets/favicon.ico → public/favicon.ico ──
	const faviconSrc = path.join(CONTENT_DIR, "assets/favicon.ico");
	if (fs.existsSync(faviconSrc)) {
		fs.copyFileSync(faviconSrc, path.join(rootDir, "public/favicon.ico"));
		console.log("已同步 favicon");
	}
}

// ── wrangler.toml: content/wrangler.toml → project root ──
const wranglerSrc = path.join(CONTENT_DIR, "wrangler.toml");
if (fs.existsSync(wranglerSrc)) {
	fs.copyFileSync(wranglerSrc, path.join(rootDir, "wrangler.toml"));
	console.log("已同步 wrangler.toml");
}

console.log("\n内容同步完成 ✓");

// 递归复制函数（整体替换目标目录）
function copyRecursive(src, dest) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}
		const files = fs.readdirSync(src);
		for (const file of files) {
			copyRecursive(path.join(src, file), path.join(dest, file));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}

// 递归合并函数（保留目标已有文件，只覆盖同名文件）
function copyMergeRecursive(src, dest) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}
		const files = fs.readdirSync(src);
		for (const file of files) {
			copyMergeRecursive(path.join(src, file), path.join(dest, file));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}
