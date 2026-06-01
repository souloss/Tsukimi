import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import http from "http";
import https from "https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRIENDS_DATA_PATH = path.join(__dirname, "../src/data/friends.ts");
const FRIENDS_CONFIG_PATH = path.join(__dirname, "../src/config/friendsConfig.ts");
const OUTPUT_PATH = path.join(__dirname, "../src/data/friends-circle.json");

// 强制不走代理的 httpAgent
const httpAgent = new http.Agent();
const httpsAgent = new https.Agent();

// ========== 配置读取 ==========
async function getCircleConfig() {
	try {
		const configContent = await fs.readFile(FRIENDS_CONFIG_PATH, "utf-8");
		const maxItemsMatch = configContent.match(/circleMaxItems:\s*(\d+)/);
		const maxItemsPerFriendMatch = configContent.match(/circleMaxItemsPerFriend:\s*(\d+)/);
		const showFriendsCircleMatch = configContent.match(/showFriendsCircle:\s*(true|false)/);

		return {
			maxItems: maxItemsMatch ? parseInt(maxItemsMatch[1], 10) : 20,
			maxItemsPerFriend: maxItemsPerFriendMatch ? parseInt(maxItemsPerFriendMatch[1], 10) : 3,
			showFriendsCircle: showFriendsCircleMatch ? showFriendsCircleMatch[1] === "true" : true,
		};
	} catch (error) {
		console.warn("Failed to read circle config, using defaults");
		return {
			maxItems: 20,
			maxItemsPerFriend: 3,
			showFriendsCircle: true,
		};
	}
}

// ========== 友链数据读取 ==========
async function getFriendsWithRss() {
	try {
		const content = await fs.readFile(FRIENDS_DATA_PATH, "utf-8");
		const friends = [];

		// 使用正则解析对象数组，比 eval 更安全
		const objectPattern = /\{[\s\S]*?\}/g;
		let match;
		while ((match = objectPattern.exec(content)) !== null) {
			const objStr = match[0];

			// 跳过空对象
			if (objStr.trim() === "{}") continue;

			// 提取字段
			const rssMatch = objStr.match(/rss:\s*["']([^"']+)["']/);
			if (!rssMatch) continue;

			const idMatch = objStr.match(/id:\s*(\d+)/);
			const titleMatch = objStr.match(/title:\s*["']([^"']+)["']/);
			const imgurlMatch = objStr.match(/imgurl:\s*["']([^"']+)["']/);
			const siteurlMatch = objStr.match(/siteurl:\s*["']([^"']+)["']/);
			const weightMatch = objStr.match(/weight:\s*(\d+)/);
			const enabledMatch = objStr.match(/enabled:\s*(true|false)/);

			// 跳过禁用的友链
			if (enabledMatch && enabledMatch[1] === "false") continue;

			friends.push({
				id: idMatch ? parseInt(idMatch[1], 10) : 0,
				title: titleMatch ? titleMatch[1] : "Unknown",
				imgurl: imgurlMatch ? imgurlMatch[1] : "",
				siteurl: siteurlMatch ? siteurlMatch[1] : "",
				rss: rssMatch[1],
				weight: weightMatch ? parseInt(weightMatch[1], 10) : 0,
			});
		}

		return friends;
	} catch (error) {
		console.error("Failed to read friends data:", error);
		return [];
	}
}

// ========== RSS/Atom 解析 ==========
const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@_",
	textNodeName: "#text",
	isArray: (name) => name === "item" || name === "entry",
});

function stripHTML(html) {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").trim();
}

function normalizeDate(dateStr) {
	if (!dateStr) return new Date().toISOString();
	try {
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return new Date().toISOString();
		return date.toISOString();
	} catch {
		return new Date().toISOString();
	}
}

function parseRSS2(xmlText, friendInfo) {
	const parsed = parser.parse(xmlText);
	const channel = parsed.rss?.channel || parsed.RDF?.channel || parsed.channel;
	if (!channel) return [];

	const items = Array.isArray(channel.item) ? channel.item : (channel.item ? [channel.item] : []);
	const feedTitle = channel.title || friendInfo.title;

	return items.map((item) => {
		const content = item.description || item.content?.["#text"] || item.summary || "";
		let link = item.link;
		if (typeof link === "object" && link?.["@_href"]) {
			link = link["@_href"];
		}
		const dateStr = item.pubDate || item.date || item.published || "";
		const title = item.title?.["#text"] || item.title || "";

		return {
			title: stripHTML(title),
			author: feedTitle,
			avatar: friendInfo.imgurl,
			siteUrl: friendInfo.siteurl,
			date: normalizeDate(dateStr),
			link: typeof link === "string" ? link : "",
			content: stripHTML(content).substring(0, 300),

		};
	});
}

function parseAtom(xmlText, friendInfo) {
	const parsed = parser.parse(xmlText);
	const feed = parsed.feed;
	if (!feed) return [];

	const entries = Array.isArray(feed.entry) ? feed.entry : (feed.entry ? [feed.entry] : []);
	const feedTitle = feed.title?.["#text"] || feed.title || friendInfo.title;

	return entries.map((entry) => {
		const content = entry.content?.["#text"] || entry.summary?.["#text"] || entry.content || entry.summary || "";
		let link = "";
		if (Array.isArray(entry.link)) {
			const firstLink = entry.link.find((l) => l?.["@_rel"] === "alternate" || !l?.["@_rel"]) || entry.link[0];
			link = firstLink?.["@_href"] || "";
		} else if (entry.link?.["@_href"]) {
			link = entry.link["@_href"];
		}
		const dateStr = entry.published || entry.updated || entry.issued || "";
		const title = entry.title?.["#text"] || entry.title || "";

		return {
			title: stripHTML(title),
			author: feedTitle,
			avatar: friendInfo.imgurl,
			siteUrl: friendInfo.siteurl,
			date: normalizeDate(dateStr),
			link: link,
			content: stripHTML(content).substring(0, 300),

		};
	});
}

function parseFeed(xmlText, friendInfo) {
	try {
		if (xmlText.includes("<rss") || xmlText.includes("<RDF")) {
			return parseRSS2(xmlText, friendInfo);
		}
		if (xmlText.includes("<feed")) {
			return parseAtom(xmlText, friendInfo);
		}
		const rssItems = parseRSS2(xmlText, friendInfo);
		if (rssItems.length > 0) return rssItems;
		return parseAtom(xmlText, friendInfo);
	} catch (error) {
		console.warn(`  Failed to parse feed for ${friendInfo.title}:`, error.message);
		return [];
	}
}

// ========== 全局：清除代理环境变量，避免代理缓存导致 304 ==========
const proxyKeys = ["http_proxy", "https_proxy", "HTTP_PROXY", "HTTPS_PROXY", "no_proxy", "NO_PROXY"];
proxyKeys.forEach((k) => {
	if (process.env[k]) {
		console.log(`Clearing proxy env: ${k}=${process.env[k]}`);
		delete process.env[k];
	}
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFeed(url) {
	try {
		const headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			"Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
			"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
			"Cache-Control": "no-cache, no-store, must-revalidate",
			"Pragma": "no-cache",
		};

		let data = null;

		// 尝试 1：直接请求
		const response = await axios.get(url, {
			timeout: 15000,
			headers,
			httpAgent,
			httpsAgent,
			proxy: false,
		});

		if (response.status === 200 && response.data && typeof response.data === "string" && response.data.trim().length > 0) {
			data = response.data;
		}

		// 尝试 2：加随机参数绕过 CDN 缓存
		if (!data) {
			console.log(`  Retrying with cache-busting param...`);
			const retryResponse = await axios.get(`${url}?_=${Date.now()}`, {
				timeout: 15000,
				headers,
				httpAgent,
				httpsAgent,
				proxy: false,
			});
			if (retryResponse.status === 200 && retryResponse.data && typeof retryResponse.data === "string" && retryResponse.data.trim().length > 0) {
				data = retryResponse.data;
			}
		}

		if (data) {
			return data;
		}

		console.warn(`  No content received (HTTP ${response.status}): ${url}`);
		return null;
	} catch (error) {
		console.warn(`  Failed to fetch: ${url}`, error.message);
		return null;
	}
}

// ========== 主逻辑 ==========
async function main() {
	console.log("=== Friends Circle RSS Aggregator ===");

	// 读取配置
	const config = await getCircleConfig();
	if (!config.showFriendsCircle) {
		console.log("Friends circle is disabled, skipping.");
		const emptyData = { lastUpdated: new Date().toISOString(), items: [] };
		const dir = path.dirname(OUTPUT_PATH);
		try {
			await fs.access(dir);
		} catch {
			await fs.mkdir(dir, { recursive: true });
		}
		await fs.writeFile(OUTPUT_PATH, JSON.stringify(emptyData, null, 2));
		return;
	}

	// 获取有 RSS 的友链
	const friendsWithRss = await getFriendsWithRss();
	if (friendsWithRss.length === 0) {
		console.log("No friends with RSS found.");
		const emptyData = { lastUpdated: new Date().toISOString(), items: [] };
		const dir = path.dirname(OUTPUT_PATH);
		try {
			await fs.access(dir);
		} catch {
			await fs.mkdir(dir, { recursive: true });
		}
		await fs.writeFile(OUTPUT_PATH, JSON.stringify(emptyData, null, 2));
		return;
	}

	console.log(`Found ${friendsWithRss.length} friends with RSS`);

	// 抓取所有 feed
	let allItems = [];
	let successCount = 0;
	let failCount = 0;

	for (const friend of friendsWithRss) {
		console.log(`\nFetching: ${friend.title}`);
		console.log(`  RSS: ${friend.rss}`);

		const xmlText = await fetchFeed(friend.rss);
		if (!xmlText) {
			failCount++;
			continue;
		}

		const items = parseFeed(xmlText, friend);
		console.log(`  Got ${items.length} items`);
		if (items.length > 0) {
			const limited = items.slice(0, config.maxItemsPerFriend);
			allItems = allItems.concat(limited);
			successCount++;
		} else {
			failCount++;
		}

		await delay(500);
	}

	console.log(`\n=== Summary ===`);
	console.log(`Success: ${successCount}, Failed: ${failCount}`);
	console.log(`Total items before filtering: ${allItems.length}`);

	// 按发布时间降序排序
	allItems.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	// 去除内部字段，保留前 N 条
	const finalItems = allItems
		.map((item) => {
			const { ...rest } = item;
			return rest;
		})
		.slice(0, config.maxItems);

	console.log(`Final items: ${finalItems.length}`);

	// 如果本次抓取全部失败，保留已有数据不覆盖
	if (finalItems.length === 0) {
		try {
			const existing = await fs.readFile(OUTPUT_PATH, "utf-8");
			const existingData = JSON.parse(existing);
			if (existingData.items && existingData.items.length > 0) {
				console.log(`All feeds failed, keeping existing ${existingData.items.length} items`);
				console.log("=== Done ===");
				return;
			}
		} catch {
			// 文件不存在或解析失败，继续写入空数据
		}
	}

	// 写入输出
	const output = {
		lastUpdated: new Date().toISOString(),
		items: finalItems,
	};

	const dir = path.dirname(OUTPUT_PATH);
	try {
		await fs.access(dir);
	} catch {
		await fs.mkdir(dir, { recursive: true });
	}

	await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2));
	console.log(`Written to: ${OUTPUT_PATH}`);
	console.log("=== Done ===");
}

main().catch((err) => {
	console.error("\n✘ Script execution error:");
	console.error(err);
	process.exit(1);
});
