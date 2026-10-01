/**
 * 配置统一导出入口
 *
 * 所有配置的 TypeScript 接口定义在 src/types/config.ts 中。
 * 修改配置结构时，请同步更新对应的接口定义。
 */

// ─── 互动功能 ───────────────────────────────────────────────
export { announcementConfig } from "./announcementConfig";
// ─── 外观与壁纸 ─────────────────────────────────────────────
// ─── 兼容别名 ───────────────────────────────────────────────
export {
	backgroundWallpaperConfig,
	backgroundWallpaperConfig as backgroundWallpaper,
} from "./backgroundWallpaper";
export { commentConfig } from "./commentConfig";
export { contextMenuConfig } from "./contextMenuConfig";
export { effectsConfig } from "./effectsConfig";
// ─── 代码块 ─────────────────────────────────────────────────
export { expressiveCodeConfig } from "./expressiveCodeConfig";
export { fabConfig } from "./fabConfig";
export { fontConfig } from "./fontConfig";
// ─── 页脚 ───────────────────────────────────────────────────
export { footerConfig } from "./footerConfig";
// ─── 友链 ───────────────────────────────────────────────────
export { friendsConfig } from "./friendsConfig";
// ─── 版权 ───────────────────────────────────────────────────
export { licenseConfig } from "./licenseConfig";
// ─── 插件 ───────────────────────────────────────────────────
export { markmapConfig } from "./markmapConfig";
// ─── 多媒体 ─────────────────────────────────────────────────
export { musicPlayerConfig } from "./musicConfig";
// ─── 导航栏 ─────────────────────────────────────────────────
export { navBarConfig } from "./navBarConfig";
// ─── 链接 ───────────────────────────────────────────────────
export { permalinkConfig } from "./permalinkConfig";
// ─── 特效 ───────────────────────────────────────────────────
export { pioConfig } from "./pioConfig";
export { plantumlConfig } from "./plantumlConfig";
// ─── 个人资料 ───────────────────────────────────────────────
export { profileConfig } from "./profileConfig";
// ─── 文章推荐 ───────────────────────────────────────────────
export { randomPostsConfig } from "./randomPostsConfig";
export { relatedPostsConfig } from "./relatedPostsConfig";
export { shareConfig } from "./shareConfig";
// ─── 布局 ───────────────────────────────────────────────────
export { sidebarLayoutConfig } from "./sidebarConfig";
// ─── 站点核心 ───────────────────────────────────────────────
export { SITE_LANG, siteConfig } from "./siteConfig";
// ─── 赞助 ───────────────────────────────────────────────────
export { sponsorConfig } from "./sponsorConfig";
export { resolveTextureConfig, TEXTURE_PRESETS } from "./textureConfig";

import { effectsConfig as _effects } from "./effectsConfig";
/** @deprecated 使用 effectsConfig.sakura 代替 */
export const sakuraConfig = _effects.sakura;

// ─── Widget 配置聚合 ────────────────────────────────────────
import { backgroundWallpaperConfig } from "./backgroundWallpaper";
import { musicPlayerConfig } from "./musicConfig";

export const widgetConfigs = {
	sakura: _effects.sakura,
	fullscreenWallpaper: backgroundWallpaperConfig.fullscreen,
	musicPlayer: musicPlayerConfig,
};
