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

为了更好地组织和管理配置，Mizuki 将原来的单一大配置文件拆分为多个独立的配置模块。

---

### 模块化配置结构

配置文件现在位于 `src/config/` 目录下：

```
src/config/
├── index.ts              # 统一导出文件
├── backgroundWallpaper.ts  # 背景壁纸配置
├── effectsConfig.ts       # 特效配置（樱花等）
├── fontConfig.ts          # 字体配置
├── friendsConfig.ts       # 友链页面配置
└── sponsorConfig.ts       # 赞助页面配置
```

---

### 配置模块说明

#### backgroundWallpaper.ts

背景壁纸配置模块，包含：
- Banner 模式配置
- Fullscreen 模式配置
- Overlay 模式配置
- 图片轮播设置
- 波浪动画配置
- 渐变遮罩配置
- 主页文字配置

```typescript
import { backgroundWallpaperConfig } from "@config/backgroundWallpaper";
```

#### effectsConfig.ts

特效配置模块，包含：
- 樱花特效配置

```typescript
import { effectsConfig } from "@config/effectsConfig";
```

#### fontConfig.ts

字体配置模块，包含：
- 字体开关配置
- 默认字体设置
- 多个字体选项（系统默认、Literata、霞鹜文楷、二次元字体）

```typescript
import { fontConfig } from "@config/fontConfig";
```

#### friendsConfig.ts

友链页面配置模块，包含：
- 页面标题和描述
- 自定义内容显示开关
- 评论区开关
- 朋友圈动态开关
- 排序设置
- 朋友圈条目限制

```typescript
import { friendsConfig } from "@config/friendsConfig";
```

#### sponsorConfig.ts

赞助页面配置模块，包含：
- 页面标题和描述
- 赞助用途说明
- 赞助方式列表（二维码或链接）
- 赞助者列表
- 显示开关配置

```typescript
import { sponsorConfig } from "@config/sponsorConfig";
```

---

### 统一导出

所有配置通过 `src/config/index.ts` 统一导出：

```typescript
// 导出所有配置
export { backgroundWallpaperConfig } from "./backgroundWallpaper";
export { effectsConfig } from "./effectsConfig";
export { fontConfig } from "./fontConfig";
export { friendsConfig } from "./friendsConfig";
export { sponsorConfig } from "./sponsorConfig";
```

---

### 使用方式

在 `src/config.ts` 中导入模块：

```typescript
import { backgroundWallpaperConfig } from "./config/backgroundWallpaper";
import { effectsConfig } from "./config/effectsConfig";
import { fontConfig } from "./config/fontConfig";
import { friendsConfig } from "./config/friendsConfig";
import { sponsorConfig } from "./config/sponsorConfig";
```

在组件中使用配置：

```astro
---
import { fontConfig } from "@config/fontConfig";
---

{fontConfig.fonts.map(font => (
    <div>{font.name}</div>
))}
```

---

### 类型定义

所有配置类型定义在 `src/types/config.ts` 中：

```typescript
export type {
    BackgroundWallpaperConfig,
    EffectsConfig,
    FontConfig,
    FriendsPageConfig,
    SakuraConfig,
    SponsorConfig,
} from "../types/config";
```

---

### 迁移说明

如果你从旧版本升级，原来在 `src/config.ts` 中的配置项现在已经移动到对应的模块文件中。

**迁移步骤**：
1. 查看新的模块配置文件结构
2. 将你的自定义配置移动到对应的模块文件
3. 在 `src/config.ts` 中导入这些模块
4. 使用新的模块配置

---

### 添加新的配置模块

需要添加新的配置模块时：

1. 在 `src/config/` 下创建新的配置文件
2. 在 `src/types/config.ts` 中添加对应的类型定义
3. 在 `src/config/index.ts` 中导出新模块
4. 在 `src/config.ts` 中导入并使用

---

### 优势

配置模块化带来以下优势：

1. **更好的组织**：相关配置集中在一起
2. **易于维护**：修改某个功能配置时只需要关注对应的文件
3. **减少冲突**：多人协作时减少对同一文件的修改冲突
4. **清晰的类型**：每个模块有明确的类型定义
5. **可扩展性**：添加新功能配置时不会让单个文件变得臃肿

