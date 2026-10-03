import { friendsData } from "../src/data/friends";
import localAnimeList from "../src/data/anime";
import { devicesData } from "../src/data/devices";
import { projectsData } from "../src/data/projects";
import { skillsData } from "../src/data/skills";
import { timelineData } from "../src/data/timeline";

const errors: string[] = [];
const url = (value: unknown) => typeof value === "string" && /^(?:https?:\/\/|\/)/.test(value);
const date = (value: unknown) => typeof value === "string" && !Number.isNaN(Date.parse(value));
const ids = new Set<string>();
for (const [index, item] of friendsData.entries()) {
	if (!Number.isInteger(item.id) || !item.title || !url(item.siteurl) || !Array.isArray(item.tags)) errors.push(`friends[${index}] has invalid required fields`);
	if (ids.has(String(item.id))) errors.push(`friends[${index}] duplicates id ${item.id}`);
	ids.add(String(item.id));
}
for (const [index, item] of localAnimeList.entries()) {
	if (!item.title || !["watching", "completed", "planned"].includes(item.status) || !url(item.cover) || !url(item.link) || !date(`${item.startDate}-01`)) errors.push(`anime[${index}] has invalid fields`);
	if (item.rating < 0 || item.rating > 10 || item.progress < 0 || item.totalEpisodes < 0 || item.progress > item.totalEpisodes) errors.push(`anime[${index}] has invalid rating/progress`);
}
for (const [index, item] of projectsData.entries()) {
	if (!item.id || !item.title || !["web", "mobile", "desktop", "other"].includes(item.category) || !["completed", "in-progress", "planned"].includes(item.status) || !date(item.startDate)) errors.push(`projects[${index}] has invalid fields`);
	if (ids.has(item.id)) errors.push(`projects[${index}] duplicates id ${item.id}`);
	ids.add(item.id);
}
for (const [index, item] of skillsData.entries()) {
	if (!item.id || !item.name || !item.description || !item.icon || !item.experience || item.experience.years < 0 || item.experience.months < 0 || item.experience.months > 11) errors.push(`skills[${index}] has invalid fields`);
}
for (const [category, devices] of Object.entries(devicesData)) {
	for (const [index, item] of devices.entries()) if (!item.name || !url(item.image) || !item.specs || !url(item.link)) errors.push(`devices.${category}[${index}] has invalid fields`);
}
for (const [index, item] of timelineData.entries()) {
	if (!item.id || !item.title || !item.description || !date(item.startDate) || (item.endDate && !date(item.endDate))) errors.push(`timeline[${index}] has invalid fields`);
	if (ids.has(item.id)) errors.push(`timeline[${index}] duplicates id ${item.id}`);
	ids.add(item.id);
}
if (errors.length) {
	console.error(`Static data check failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`Static data check passed (${friendsData.length} friends, ${localAnimeList.length} anime, ${projectsData.length} projects, ${skillsData.length} skills, ${timelineData.length} timeline entries).`);
