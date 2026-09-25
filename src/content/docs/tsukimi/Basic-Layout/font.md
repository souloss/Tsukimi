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
| enable | boolean | 仅为类型预留；当前界面和字体渲染不读取此字段，因此它不会关闭字体功能。 |
| switchable | boolean | 是否在显示设置中允许访客切换字体。 |
| defaultFont | string | 默认字体项的 id。 |
| selected | string 或 string[] | 仅为类型预留；当前默认选择由 `defaultFont` 决定，访客选择保存在浏览器端。 |
| fonts | FontItem[] 或 Record<string, FontItem> | 字体选项列表。 |
| fallback | string[] | 仅为类型预留；当前渲染使用内置系统字体回退栈。 |
| preload | boolean | 仅为类型预留；当前主题不会根据此字段预加载字体。 |

## FontItem 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 唯一标识；`defaultFont` 应与某个字体项的 id 对应。 |
| name | string | 设置面板中显示的名称。 |
| i18nKey | string | 可选的翻译键。 |
| fontFamily / family | string | ASCII 字符使用的 CSS 字体栈。 |
| cjkFontFamily | string | 可选的中日韩字符回退字体栈。 |
| src | string | 单个字体文件路径或 URL。 |
| localFonts | string[] 或 object[] | 本地字体文件列表；对象可声明 family、src、weight、style。 |
| googleFonts | string | Google Fonts 样式表 URL。 |
| cdnUrl / cdnUrls | string 或 string[] | 外部字体样式表 URL。 |
| weight / fontWeight | string 或 number | 字重。 |
| style | normal、italic 或 oblique | 字体样式。 |
| display | auto、block、swap、fallback 或 optional | font-display 行为。 |
| unicodeRange | string | 可选的 Unicode 子集范围。 |
| format | woff、woff2、truetype 等 | 本地字体格式。 |
| enableCompress | boolean | 是否允许构建脚本对子集进行处理。 |

## 添加本地字体

将字体放到 public/ 后用绝对路径引用，或按项目资源管线放到 src/assets/：

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
      cjkFontFamily: "'My CJK Font', sans-serif",
      localFonts: [
        {
          family: "My Font",
          src: "/assets/font/my-font.woff2",
          weight: 400,
          style: "normal",
        },
      ],
      display: "swap",
    },
  ],
};

export default override;
```

src/config/fontConfig.ts 的默认数组和覆盖文件中的数组是整体替换关系；要保留系统字体项，需要在覆盖数组中一并写出。外部 Google/CDN 字体要评估可访问性、缓存和许可证，不要依赖不可控的临时链接。

## 设置面板与验证

当 switchable 为 true 且存在多个字体项时，访客可以在显示设置中切换，选择会保存在浏览器端。检查步骤：

1. 运行 `pnpm dev`，打开显示设置，确认选项名称和默认字体。
2. 检查浏览器 Network 是否成功加载 src、cdnUrl 或 localFonts。
3. 用 `pnpm build && pnpm preview` 验证生产路径；开发环境的字体缓存可能掩盖路径错误。

如果字体不生效，先检查 id 是否匹配、资源 URL 是否以 / 开头、字体文件是否存在，以及浏览器是否拦截跨域样式表。
