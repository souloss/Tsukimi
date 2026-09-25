---
title: 字体配置
createTime: 2026/09/25
permalink: /basic-layout/font/
order: 12
icon: ri:font-size-2
badge:
  type: info
  text: 当前实现
copyright:
  author:
    name: souloss
    url: https://github.com/souloss
---

# 字体配置

字体配置位于 `src/config/fontConfig.ts`，通过 `fontConfig` 导出。它与旧版 asciiFont/cjkFont 结构不同：当前实现用 fonts 数组（或以 ID 为键的对象）描述可切换的字体选项，并由 defaultFont 选择默认项。

## 默认结构

```ts title="src/config/fontConfig.ts"
const defaults: FontConfig = {
  switchable: true,
  defaultFont: "lxgw",
  fonts: [
    {
      id: "system",
      name: "系统默认",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    {
      id: "lxgw",
      name: "霞鹜文楷",
      fontFamily: "'LXGW WenKai', serif",
      cjkFontFamily: "'LXGW WenKai', serif",
      cdnUrls: [
        "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css",
      ],
    },
  ],
};

export const fontConfig = withOverride("fontConfig", defaults);
```

生产站点建议放在 `src/overrides/fontConfig.ts`，这样主题升级时不需要改默认文件。

## FontConfig 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| switchable | boolean | 是否在显示设置中允许访客切换字体。 |
| defaultFont | string | 默认字体项的 id。 |
| fonts | FontItem[] 或 Record<string, FontItem> | 字体选项列表。 |

默认字体由 `defaultFont` 指向的字体项决定；访客切换后的选择保存在浏览器端。CSS 回退字体栈由主题内置，不需要单独配置。

## FontItem 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 唯一标识；`defaultFont` 应与某个字体项的 id 对应。 |
| name | string | 设置面板中显示的名称。 |
| i18nKey | string | 可选的翻译键。 |
| fontFamily / family | string | ASCII 字符使用的 CSS 字体栈。 |
| cjkFontFamily | string | 可选的中日韩字符回退字体栈。 |
| googleFonts | string | Google Fonts 样式表 URL。 |
| cdnUrl / cdnUrls | string 或 string[] | 外部字体样式表 URL。 |

运行时只读取表中这些选项。字体文件本身由 CSS 的 `@font-face` 声明；`src`、`weight`、`style`、`display`、`unicodeRange`、`format` 等字段即使出现在旧类型中，也不会由字体切换器应用。

## 添加本地字体

本地字体需在 CSS 中注册 `@font-face`，再把对应的 `font-family` 配到字体项。将字体文件放在 `public/assets/font/`，并在 `src/styles/main.css`（或自己的全局样式）添加规则：

```css title="src/styles/main.css"
@font-face {
  font-family: "My Font";
  src: url("/assets/font/my-font.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
```

然后在覆盖配置中添加字体选项：

```ts title="src/overrides/fontConfig.ts"
import type { FontConfig } from "@/types/config";
import type { RecursivePartial } from "@/types/utils";

const override: RecursivePartial<FontConfig> = {
  defaultFont: "my-font",
  switchable: true,
  fonts: [
    {
      id: "my-font",
      name: "我的字体",
      fontFamily: "'My Font', sans-serif",
    },
  ],
};

export default override;
```

默认数组和覆盖文件中的 `fonts` 数组是整体替换关系；要保留系统字体项，需要在覆盖数组中一并写出。若希望构建时对子集字体压缩，在字体项中配置 `localFonts` 对象数组，让每项的 `src` 指向 `public/assets/font/` 下的 TTF/OTF 文件：

```ts
localFonts: [{ family: "My Font", src: "my-font.ttf" }],
```

`localFonts` 仅作为构建脚本的压缩输入，不会替代 `@font-face` 声明或自动注册 CSS 字体。`pnpm build` 会尝试生成 WOFF2 并更新匹配的 CSS 引用；发布前检查构建产物和浏览器 Network。外部 Google/CDN 字体要评估可访问性、缓存和许可证，不要依赖不可控的临时链接。

## 设置面板与验证

当 switchable 为 true 且存在多个字体项时，访客可以在显示设置中切换，选择会保存在浏览器端。检查步骤：

1. 运行 `pnpm dev`，打开显示设置，确认选项名称和默认字体。
2. 检查浏览器 Network 是否成功加载字体 CSS 或 `@font-face` 文件。
3. 用 `pnpm build && pnpm preview` 验证生产路径；开发环境的字体缓存可能掩盖路径错误。

如果字体不生效，先检查 id 是否匹配、资源 URL 是否以 / 开头、字体文件是否存在，以及浏览器是否拦截跨域样式表。
