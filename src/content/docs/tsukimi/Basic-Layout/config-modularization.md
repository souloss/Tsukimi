---
title: 配置模块化
createTime: 2026/09/25
permalink: /basic-layout/config-modularization/
order: 10
icon: ri:folder-settings-line
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

Tsukimi 不再使用单一的 `src/config.ts`。默认配置按职责拆分在 `src/config/`，统一从 `src/config/index.ts` 导出；类型定义集中在 `src/types/config.ts`。

## 配置目录

```text
src/config/
├── index.ts                 # 统一导出入口
├── siteConfig.ts            # 站点核心、首页和文章页
├── navBarConfig.ts          # 顶部导航
├── sidebarConfig.ts         # 侧栏布局（导出 sidebarLayoutConfig）
├── profileConfig.ts         # 个人资料
├── backgroundWallpaper.ts   # 壁纸模式和图片
├── commentConfig.ts         # 评论系统
├── musicConfig.ts           # 音乐播放器（导出 musicPlayerConfig）
├── effectsConfig.ts         # 樱花等视觉特效
├── expressiveCodeConfig.ts  # 代码块主题与折叠
├── fontConfig.ts            # 字体选项
├── footerConfig.ts          # 页脚 HTML
├── announcementConfig.ts   # 公告
├── friendsConfig.ts         # 友链页面
├── sponsorConfig.ts         # 赞助页面
├── relatedPostsConfig.ts    # 相关文章
├── randomPostsConfig.ts     # 随机文章
├── permalinkConfig.ts       # 全局固定链接
├── pioConfig.ts             # Pio 看板娘
├── licenseConfig.ts         # 许可证
├── markmapConfig.ts         # Markmap
└── plantumlConfig.ts        # PlantUML
```

配置模块的默认值就是可运行的示例值。需要修改时，优先查看对应页面和 `src/types/config.ts`，不要把不属于该模块的字段复制进去。

## 统一导出

主题组件通过别名从入口导入：

```ts
import {
  commentConfig,
  navBarConfig,
  profileConfig,
  siteConfig,
  sidebarLayoutConfig,
} from "@/config";
```

`src/config/index.ts` 还保留了 `sakuraConfig` 兼容别名，但新配置应使用 `effectsConfig.sakura`；`backgroundWallpaperConfig`、`musicPlayerConfig` 和 `sidebarLayoutConfig` 是文件名与导出名不同的常见例子。

## 配置覆盖

大多数用户配置使用 `withOverride()`。在项目根目录的 `src/overrides/` 创建同名文件即可覆盖默认值，不需要修改主题源码：

```ts title="src/overrides/siteConfig.ts"
import type { SiteConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<SiteConfig> = {
  title: "我的博客",
  siteURL: "https://example.com/",
  lang: "zh_CN",
  featurePages: {
    anime: false,
    albums: false,
  },
};

export default override;
```

`withOverride("siteConfig", defaults)` 会在 Vite 构建时读取 `src/overrides/siteConfig.ts`，再与默认对象深度合并。配置覆盖适用于以下模块（括号内是覆盖文件名）：

`siteConfig`、`navBarConfig`、`sidebarConfig`、`profileConfig`、`backgroundWallpaper`、`commentConfig`、`musicConfig`、`effectsConfig`、`fontConfig`、`footerConfig`、`announcementConfig`、`friendsConfig`、`sponsorConfig`、`relatedPostsConfig`、`randomPostsConfig`、`permalinkConfig` 和 `pioConfig`。

迁移旧项目时请注意：`src/config/shareConfig.ts` 虽仍有兼容导出，但当前没有运行时消费者；不要再用它配置分享 UI。文章海报开关位于 `siteConfig.sharePoster`，赞助按钮由 `sponsorConfig.showButtonInPost` 控制，具体行为见[文章分享海报](/docs/tsukimi/feature/share-card/)。

`licenseConfig`、`expressiveCodeConfig`、`markmapConfig` 和 `plantumlConfig` 当前没有接入 `withOverride`，需要直接编辑对应的默认配置文件，或在后续开发中为它们补充覆盖入口。

### 合并规则

- 对象递归合并，只覆盖指定的键。
- 数组整体替换，不会与默认数组拼接。导航 `links`、侧栏组件列表和字体列表尤其需要注意这一点。
- 字符串、数字和布尔值直接替换。

覆盖文件使用 TypeScript，因此可以获得类型提示；`pnpm check` 会连同内容集合一起检查类型错误。覆盖文件通常由 `.gitignore` 忽略，也可以放在独立内容仓库的 `overrides/` 中，通过内容同步注入。

## 新增配置模块

如果要为主题增加可配置功能，遵循以下边界：

1. 在 `src/types/config.ts` 定义配置类型，明确可选字段和联合类型。
2. 在 `src/config/` 添加默认配置，并决定是否使用 `withOverride()`。
3. 在 `src/config/index.ts` 导出模块，保持组件通过 `@/config` 导入。
4. 在对应组件、设置面板和文档中消费配置；避免让组件直接读取另一个模块的内部默认值。
5. 运行 `pnpm check`，必要时运行 `pnpm build` 验证构建期插件或路由。

## 常见误区

- `src/config.ts` 已不存在；不要创建一个新的同名文件来覆盖模块入口。
- `src/config/sidebarConfig.ts` 导出的是 `sidebarLayoutConfig`，覆盖文件名仍是 `sidebarConfig.ts`。
- 修改 `featurePages` 后还要同步检查 `src/config/navBarConfig.ts`，关闭的页面不要继续出现在导航栏。
- 私密凭据不要写进默认配置、公开的覆盖文件或文章示例；使用部署平台的环境变量或私有内容仓库。
