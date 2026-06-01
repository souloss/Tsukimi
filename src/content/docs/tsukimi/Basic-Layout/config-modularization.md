---
title: 配置模块化
createTime: 2025/05/20 00:00:00
permalink: /basic-layout/config-modularization/
order: 10
icon: ri:folder-settings-line
badge:
  type: warning
  text: 新
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

## 配置模块化

Tsukimi 将配置拆分为多个独立模块，每个模块负责一个功能领域。同时支持**配置覆盖系统**，允许在不修改源码的情况下自定义配置。

---

### 模块化配置结构

配置文件位于 `src/config/` 目录下：

```
src/config/
├── index.ts              # 统一导出
├── announcementConfig.ts  # 公告栏
├── backgroundWallpaper.ts # 背景壁纸
├── commentConfig.ts       # 评论系统
├── effectsConfig.ts       # 特效（樱花等）
├── expressiveCodeConfig.ts # 代码块样式
├── fontConfig.ts          # 字体
├── footerConfig.ts        # 页脚
├── friendsConfig.ts       # 友链页面
├── licenseConfig.ts       # 版权
├── markmapConfig.ts       # 思维导图
├── musicConfig.ts         # 音乐播放器
├── navBarConfig.ts        # 导航栏
├── permalinkConfig.ts     # 永久链接
├── pioConfig.ts           # 看板娘
├── plantumlConfig.ts      # PlantUML
├── profileConfig.ts       # 个人资料
├── randomPostsConfig.ts   # 随机文章
├── relatedPostsConfig.ts  # 相关文章
├── shareConfig.ts         # 分享
├── sidebarConfig.ts       # 侧边栏布局
├── siteConfig.ts          # 站点核心配置
└── sponsorConfig.ts       # 赞助
```

---

### 统一导出

所有配置通过 `src/config/index.ts` 统一导出：

```typescript
// 在组件中导入
import { siteConfig, navBarConfig, profileConfig } from "@/config";
```

---

### 使用方式

在组件中使用配置：

```astro
---
import { fontConfig } from "@/config";
---

{fontConfig.fonts.map(font => (
    <div>{font.name}</div>
))}
```

---

### 配置覆盖系统

配置覆盖系统允许通过 `src/overrides/` 目录中的文件，在不修改源码的情况下自定义配置。

#### 原理

每个配置模块使用 `withOverride()` 函数，在构建时自动检查 `src/overrides/` 目录是否存在同名覆盖文件：

```typescript
// src/config/siteConfig.ts
import { withOverride } from "@/utils/config-override";

export const siteConfig = withOverride("siteConfig", {
  // 默认配置...
});
```

如果 `src/overrides/siteConfig.ts` 存在，其内容会通过 `deepMerge` 深度合并到默认配置上。

#### 覆盖文件格式

覆盖文件使用 `RecursivePartial<T>` 类型，只写需要覆盖的字段：

```typescript
// src/overrides/siteConfig.ts
import type { RecursivePartial } from "@/types/utils";
import type { SiteConfig } from "@/types/config";

const override: RecursivePartial<SiteConfig> = {
  title: "我的博客",
  description: "自定义描述",
};

export default override;
```

#### 合并行为

- **对象**: 递归合并，只覆盖指定的嵌套字段
- **数组**: 整体替换（不会拼接）
- **原始值**: 直接替换

例如，默认配置有 `navbar: { links: [a, b] }`，覆盖文件写 `navbar: { links: [c] }`，结果是 `[c]` 而不是 `[a, b, c]`。

#### 当前覆盖文件

`src/overrides/` 目录（已加入 `.gitignore`，由内容同步脚本填充）：

| 文件 | 对应配置 |
|------|---------|
| `backgroundWallpaper.ts` | 背景壁纸 |
| `commentConfig.ts` | 评论系统 |
| `musicConfig.ts` | 音乐播放器 |
| `pioConfig.ts` | 看板娘 |
| `profileConfig.ts` | 个人资料 |
| `siteConfig.ts` | 站点核心配置 |

---

### 类型定义

所有配置类型定义在 `src/types/config.ts` 中：

```typescript
export type {
    SiteConfig,
    NavBarConfig,
    ProfileConfig,
    CommentConfig,
    FontConfig,
    EffectsConfig,
    BackgroundWallpaperConfig,
    FriendsPageConfig,
    MusicPlayerConfig,
    SponsorConfig,
    // ... 更多类型
} from "../types/config";
```

覆盖相关类型：

```typescript
// src/types/utils.ts
export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<RecursivePartial<U>>
        : T[P] extends object
          ? RecursivePartial<T[P]>
          : T[P];
};
```

---

### 添加新的配置模块

1. 在 `src/config/` 下创建新的配置文件
2. 如果需要支持覆盖，使用 `withOverride()`：
   ```typescript
   import { withOverride } from "@/utils/config-override";
   export const newConfig = withOverride("newConfig", { /* 默认值 */ });
   ```
3. 在 `src/types/config.ts` 中添加对应的类型定义
4. 在 `src/config/index.ts` 中导出新模块

---

### 优势

1. **模块化组织**: 相关配置集中在一起，职责清晰
2. **配置覆盖**: 不修改源码即可自定义，通过 `src/overrides/` 独立管理
3. **类型安全**: 每个模块有明确的类型定义和覆盖类型约束
4. **内容分离**: 覆盖文件可通过内容同步从私有仓库注入，私人配置不暴露
5. **可扩展**: 添加新配置模块不会让单个文件变得臃肿