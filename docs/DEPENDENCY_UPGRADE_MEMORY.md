# Tsukimi 依赖升级记忆

> 本文档是依赖升级的持续记录。每次升级、验证、回退或发现新的兼容性问题，都要在这里更新。

## 基线

- 记录日期：2026-09-04
- 当前提交：`3044f51`
- Node：`v26.4.0`；pnpm：`10.33.0`
- 架构：Astro 静态输出、Svelte 5、Tailwind 4、统一的 Markdown/MDX 插件链、Swup、Pagefind、OG 图片和字体压缩。
- 当前工作区已有未提交修改。本轮只修改依赖、升级脚本、为 Astro 7 修复必要的 PostMeta 模板兼容性，以及本记忆文档，不覆盖其它用户功能文件。
- 基线验证：此前 `pnpm check` 与 `pnpm type-check` 通过；完整构建需要在每个依赖批次后复验。

## 执行规则

1. 先完成同主版本安全更新，再进行 Astro 7 大版本迁移。
2. 每个批次必须记录 `pnpm install`、`pnpm check`、`pnpm type-check`、`pnpm build` 和 `pnpm audit` 结果。
3. `oddmisc` 暂时固定为 `1.2.5`。`1.2.11` 已验证会移除配置使用的命名导出 `oddmisc`。
4. Svelte 补丁和 Astro/Vite 两个 `postinstall` 内部补丁均为迁移门禁，不能直接带入大版本升级。
5. 任何失败都记录原因、影响范围和恢复方式，不用强制升级掩盖问题。

## 项目清单

| 项目 | 状态 | 说明 |
|---|---|---|
| 基线与依赖用途盘点 | 已完成 | 已区分浏览器运行时、构建工具和数据脚本依赖 |
| 同主版本安全批次 | 已完成 | Astro 6、Astro 集成、astro-icon、Axios、Sharp、HTML 清理、Tailwind 等 |
| Vite 7 安全 override | 已完成（已由 Vite 8 接替） | Astro 7 迁移前曾统一到 `7.3.6`；迁移后移除该 override，由 Astro 7 使用 Vite `8.2.2` |
| `oddmisc` 版本固定 | 已完成 | 已固定 `1.2.5`，避免解析到已验证不兼容的 `1.2.11` |
| 构建依赖归类 | 已完成 | 将检查器、数据脚本、静态构建和 RSS 解析专用包移入 `devDependencies` |
| Node/pnpm 运行环境统一 | 已完成 | 增加 engines 与 `.nvmrc`，部署使用 Node 22.12.0，移除 Node 23 矩阵 |
| Fontmin 风险治理 | 已完成 | 已用 `subset-font` 替换 Fontmin，移除 node-gyp/tar 旧链 |
| Astro 7 + Vite 8 | 已完成 | Astro `7.3.1`、Vite `8.2.2`、MDX `8.0.0`、Svelte 集成 `9.0.1`；旧实验配置和私有 postinstall patch 已移除 |
| Svelte 补丁迁移 | 已完成 | 升至 `5.57.0` 后移除 `5.55.5` patch 绑定；开发水合与生产构建均通过 |
| Satori/字体生成链 | 已完成 | Satori `0.33.4`，`subset-font` 替换 Fontmin；fflate 和字体输出均完成安全验证 |
| 传递依赖安全收敛 | 已完成 | 修复版 yaml、brace-expansion、browserslist、svgo、postcss-selector-parser、serialize-javascript 通过 workspace override 统一 |
| 孤立直接依赖清理 | 已完成 | 删除无源码/配置引用的 Roboto、Iconify utils、Rollup YAML 包；PostCSS 插件因配置实际引用而保留 |
| `astro-icon` 本地图标目录 | 已完成 | 增加 `src/icons/.gitkeep`，消除默认目录扫描警告并保留未来自定义 SVG 图标入口 |
| `postcss-import` 17 | 已完成 | 构建期 CSS import 插件升级；Node 22 与 PostCSS 8 peer 条件已满足，完整构建通过 |
| Pako 3 与依赖归类 | 已完成 | PlantUML 编码器改用命名空间导入，Pako 仅用于构建插件，移入 `devDependencies` |
| `@types/markdown-it` 14.2 | 已完成 | 仅类型声明更新；RSS/Atom 相关检查和静态构建均通过 |
| Biome 2.5 | 已完成 | 开发期格式/检查工具升级；受影响文件检查、项目检查和构建均通过 |
| `node-html-parser` 9 | 已完成 | RSS/Atom 构建期解析器升级；图片属性重写和完整静态构建通过 |
| Markdown-it 15 与 linkify-it 6 | 已完成 | RSS/Atom 构建期 Markdown 渲染升级；feed 内容对比和完整静态构建通过 |
| `l2d-widget` 0.1.2 | 回退/暂缓 | 静态检查和构建通过，但本地 NOIR Cubism 6 模型在新版解析阶段失败；已恢复 0.0.2 |
| TypeScript 依赖归类 | 已完成 | TypeScript 仅供检查/编译使用，已从生产依赖移入开发依赖；生产安装保留 Astro |
| TypeScript 7 | 暂缓 | 等 Astro/Svelte 工具链稳定支持 |
| Swup 现代化 | 暂缓 | 当前适配器无对应升级，需单独评估替换成本 |

## 同主版本批次

目标版本（以执行时 registry 为准）：

- `astro` `6.4.6`
- `@astrojs/check` `0.9.10`
- `@astrojs/markdown-remark` `7.3.0`
- `@astrojs/rss` `4.0.19`
- `@astrojs/sitemap` `3.7.4`
- `@astrojs/ts-plugin` `1.10.11`
- `astro-icon` `1.2.0`
- `@iconify/svelte` `5.2.2`、`@iconify/utils` `3.1.4`
- `axios` `1.20.0`
- `sanitize-html` `2.17.7`
- `sharp` `0.35.4`
- `tailwindcss` 与 `@tailwindcss/vite` `4.3.3`，`@tailwindcss/typography` `0.5.20`
- `dayjs` `1.11.23`、`marked` `18.0.11`
- Biome、Expressive Code、Iconify JSON、XML/代理和 Git hook 工具的小版本更新

执行结果：

- 安装：通过；`Packages: +45 -59`。pnpm 报告 `simple-git-hooks` 构建脚本被忽略，属于 pnpm 10 的审批提示。
- `pnpm check`：通过，358 个文件，`0 errors / 0 warnings / 0 hints`。
- `pnpm type-check`：通过。
- `pnpm build`：通过；148 个页面、Pagefind 主站和文档索引、2 个字体均成功生成。唯一警告是原有 `src/icons/` 目录不存在的 astro-icon 扫描提示。
- 本批次审计由基线 `1 critical / 36 high / 33 moderate / 6 low` 降至 `0 critical / 25 high / 11 moderate / 4 low`；后续 Astro 7、字体链和传递依赖治理已继续收敛到全量/生产均为 0。

本批次落地版本：Astro `6.4.8`、astro-icon `1.2.0`、Axios `1.20.0`、Sharp `0.35.4`、sanitize-html `2.17.7`、Tailwind `4.3.3`，以及对应的 Astro 集成和小版本工具更新。

验证时间：2026-09-04。构建没有启用远程内容同步，数据刷新仍由现有工作区脚本单独控制。

### Vite 7 安全 override

- 在 `pnpm-workspace.yaml` 增加 `overrides.vite: 7.3.6`，未升级 Astro 或 Svelte 集成主版本。
- `pnpm install`：通过；postinstall 的 Vite 超时补丁和数据 store 补丁均成功执行。
- `pnpm list vite`：Astro、`@astrojs/svelte`、Tailwind 统一解析到 `7.3.6`。
- `pnpm check`：通过，358 个文件，`0 errors / 0 warnings / 0 hints`。
- `pnpm type-check`：通过。
- `pnpm build`：通过；148 个页面、两个 Pagefind 索引和字体压缩均成功。
- `pnpm audit --prod`：`0 critical / 24 high / 10 moderate / 4 low`。
- 该 override 只解决 Vite 7 的安全版本线；Astro 7 迁移时必须重新评估并删除或调整它。

### 构建依赖归类

- 移入 `devDependencies`：`@astrojs/check`、`axios`、`markdown-it`、`node-html-parser`、`pagefind`、`sanitize-html`、`satori`、`sharp`。
- 判断依据：这些包只在检查、数据刷新、RSS/Atom 静态生成、OG 图片、Pagefind 或字体/图片构建阶段使用；部署平台均执行普通 `pnpm install`，不会使用 `--prod`，所以构建行为不变。
- `pnpm install --offline --frozen-lockfile`：通过，postinstall/prepare 均通过。
- `pnpm check`：通过，358 个文件，`0 errors / 0 warnings / 0 hints`。
- `pnpm type-check`：通过。
- `pnpm build`：通过；148 个页面、两个 Pagefind 索引和字体压缩均成功。
- `pnpm audit --prod`：生产依赖路径降至 1017 个，`0 critical / 17 high / 8 moderate / 4 low`。
- 没有移动浏览器交互库（Fancyapps、Iconify、Swup、Live2D、Pako、QRCode、OverlayScrollbars 等）或 Svelte 编译链。

### Fontmin 风险治理

- 移除 `fontmin@1.1.1` 及其 `node-gyp`/旧 `tar` 依赖链，改用 `subset-font@2.7.0`。
- `font-compressor.js` 继续按已有字符采集结果子集化，并将 TTF/OTF 直接转换为 WOFF2；输出文件名和 CSS 重写流程保持不变。
- 两套实际字体压缩成功：ZenMaruGothic-Medium 162.93 KB（减少 95.62%），loli 256.28 KB（减少 97.56%），总体减少 97.06%。
- `pnpm check`、`pnpm type-check`、`pnpm build` 和离线冻结安装均通过；审计改善为全量 `0 critical / 14 high / 8 moderate / 4 low`，生产 `0 critical / 11 high / 6 moderate / 4 low`。

### Svelte 补丁迁移

- 将 `svelte` 从精确版本 `5.55.5` 升至 `5.57.0`，移除 `patchedDependencies` 中的 `svelte@5.55.5` 绑定并删除旧 patch 文件。
- `pnpm list svelte` 显示所有 peer 使用者统一到 `5.57.0`；不再依赖本地修改的 Svelte runtime。
- `pnpm check`：358 个文件，`0 errors / 0 warnings / 0 hints`；`pnpm type-check`：通过。
- 真实浏览器冒烟覆盖首页、归档页和 Markdown 文章页：HTTP 200，页面标题和正文正常，console error / pageerror 均为 0；归档页截图已检查布局无重叠。
- `pnpm build`：通过；148 个页面、两个 Pagefind 索引、RSS/Atom、sitemap、OG 相关产物和字体压缩均成功。
- Svelte 相关审计项消失；本阶段审计为全量 `0 critical / 14 high / 4 moderate / 4 low`，生产 `0 critical / 11 high / 2 moderate / 4 low`。

### Astro 7 + Vite 8 迁移

- 升级 `astro@7.3.1`、`@astrojs/mdx@8.0.0`、`@astrojs/svelte@9.0.1`，并同步 `astro-expressive-code` 及其插件到 `0.44.2`；Vite 由 Astro 解析为 `8.2.2`。
- 删除 Astro 7 已默认启用的 `experimental.queuedRendering`，移除只匹配 Astro 6/Vite 7 私有实现的 `patch-data-store-load.js`、`patch-vite-timeout.js` 及 package `postinstall`。
- Astro 7 编译器发现 `PostMeta.astro` 中未闭合根节点和条件表达式包裹 `<script>` 的旧语法；已改为合法根节点、`data-*` 文案参数和顶层 inline script，浏览量查询行为保持不变。
- 页面统计脚本增加全局初始化保护，避免 Swup 多次切换后重复注册监听器；生产预览冒烟验证通过。
- `pnpm install --offline --frozen-lockfile`、`pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check` 均通过。
- `pnpm build`：通过；148 个静态页面、RSS/Atom、sitemap、Pagefind 两套索引、图片和字体压缩均成功。
- Astro 7 开发服务器浏览器冒烟覆盖首页、归档页和 Markdown 文章页：HTTP 200、标题和正文正常，应用 console error/pageerror 为 0；仅 Astro dev-toolbar 的过期优化模块请求被测试脚本排除。
- 自定义 `devGlob` 保留并在开发启动日志中确认按阈值裁剪内容；未强行替换为尚未验证等价的官方 loader。

### Satori 与传递依赖收敛

- `satori` 从 `0.26.0` 升至 `0.33.4`；直接执行带本地字体的 SVG→PNG smoke test（SVG 3612 bytes、PNG 2442 bytes）通过。
- Satori 及 `@shuding/opentype.js` 的旧精确依赖通过 `fflate: 0.8.3` override 统一到修复版；完整 OG/静态构建通过。
- 传递依赖 override：`yaml 2.8.3`、`brace-expansion 1.1.18/2.1.4/5.0.9`、`browserslist 4.28.7`、`svgo 2.8.3`、`postcss-selector-parser 6.1.3/7.1.3`、`linkify-it 6.1.0`、`serialize-javascript 7.0.5`。
- `pnpm audit` 与 `pnpm audit --prod` 最终均为 `0 critical / 0 high / 0 moderate / 0 low`；`serialize-javascript` override 已验证 CommonJS 调用兼容。

### 低风险工具与图标数据更新

- 更新 `@astrojs/ts-plugin@1.10.11`、Iconify FA/Lucide/Material/Simple/Vscode 数据包、`@types/hast@3.0.5`、`fast-xml-parser@5.11.1`、`https-proxy-agent@9.1.0`、`lint-staged@17.4.1`、`postcss-nesting@14.0.1`、`simple-git-hooks@2.14.0` 和 JetBrains Mono 字体包 `5.3.0`。
- 这些更新不改变运行时 API；冻结离线安装、Astro 检查、TypeScript 检查、完整构建和最终审计均通过。
- 未升级 KaTeX、l2d-widget、TypeScript 7 等跨主版本包；l2d-widget 0.1.2 已完成一次真实模型回归但因解析失败回退，KaTeX 与 TypeScript 7 仍受 peer/工具链约束。

### `postcss-import` 17 升级

- 从 `16.1.1` 升至 `17.0.0`；该版本要求 Node `>=22.0.0`，项目的 Node `22.12.0` 约束满足，PostCSS peer 仍为 8.x。
- `pnpm install` 与 `pnpm install --offline --frozen-lockfile`：均通过。
- `pnpm check`：通过，358 个文件，`0 errors / 0 warnings / 0 hints`。
- `pnpm type-check`：通过。
- `pnpm build`：通过；148 个静态页面、Pagefind、RSS/Atom、sitemap、OG 和字体压缩均成功。
- 在线 `pnpm audit` 在 registry 端连续无响应，60 秒有限重试超时；本批次没有新增运行时依赖，升级前最近一次全量/生产审计均为全 0，提交前保留该网络限制记录，不把超时当成审计通过。

### Pako 3 与依赖归类

- 将 `pako` 从 `2.1.0` 升至 `3.0.1`，并从生产 `dependencies` 移入 `devDependencies`；全仓调用仅位于 `src/plugins/plantuml-encoder.js`，属于 Markdown 构建期编码器，静态产物不需要 Pako。
- Pako 3 移除了 ESM 默认导出；编码器改用 `import * as pako`，避免 Astro/Vite 配置加载失败。
- PlantUML 编码样例可通过 `inflateRaw` 无损回读；真实 PlantUML SVG 服务返回 HTTP 200。
- `pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和 `pnpm build` 均通过；包含 PlantUML 示例的文档页浏览器验证图片 `naturalWidth > 0`，console/pageerror 均为 0。
- Pako 3 会产生不同但有效的压缩 URL，已有图示的远程缓存会自然失效一次；不改变图示语义。

### `@types/markdown-it` 14.2 升级

- 从 `14.1.2` 升至 `14.2.0`，仅更新开发期类型声明，不改变运行时代码。
- `pnpm install`、`pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和 `pnpm build` 均通过；148 个页面及 RSS/Atom 产物正常。

### Biome 2.5 升级

- 从 `2.4.16` 升至 `2.5.12`，仅更新开发期格式化/静态检查 CLI，不进入站点运行时产物。
- `pnpm install`、`pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和 `pnpm build` 均通过；构建仍生成 148 个页面。
- 受影响的 `package.json` 与源码文件通过只读 Biome 检查；全量扫描唯一已有差异是生成文件 `src/data/friends-circle.json` 使用两空格，而仓库格式配置要求制表符，本批次未自动改写该数据文件。

### `node-html-parser` 9 升级

- 从 `7.1.0` 升至 `9.0.3`；调用面仅为 RSS/Atom 中的 `parse`、`querySelectorAll`、`getAttribute` 和 `setAttribute`。
- `pnpm install`、`pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和 `pnpm build` 均通过；RSS/Atom、图片 URL 重写和 148 个静态页面产物正常。

### Markdown-it 15 与 linkify-it 6 升级

- `markdown-it` 从 `14.2.0` 升至 `15.0.1`；配套将 workspace 中的 `linkify-it` override 从 `5.0.2` 调整为 `6.1.0`，满足 Markdown-it 15 的 ESM 命名导出要求。
- 升级初次验证发现 `linkify-it@5` 导致 `LinkifyIt` 导出缺失；同步 override 后标准 Markdown 渲染恢复，Astro 配置可正常加载。
- RSS feed 构建前后 SHA-256 完全一致；Atom feed 忽略动态 `<updated>` 后内容完全一致。
- `pnpm install`、`pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和 `pnpm build` 均通过；148 个页面、RSS/Atom、Pagefind 和字体压缩均完成。

### l2d-widget 0.1.2 回归与回退

- 试验升级 `l2d-widget` `0.0.2 -> 0.1.2`；新版类型/API 与 `src/components/features/pio/Pio.svelte` 的 `createWidget`、模型、菜单、销毁调用保持兼容，且包声明无运行时依赖。
- 静态门禁通过：`pnpm install`、离线冻结安装、`pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check` 和完整 `pnpm build`（148 页面）均通过。
- 首轮生产浏览器探针未产生模型请求，原因是工作区忽略目录 `src/overrides/pioConfig.ts` 将 Pio 配置为 `enable: false`，并非升级结论；临时打开配置后再测，两个版本均能创建 WebGL Canvas 并请求本地模型资源。
- 新版 `0.1.2` 请求 `noir.model3.json`、`noir.moc3`、physics 和 texture 均为 HTTP 200，但在 `noir.moc3` 解析阶段抛出 `TypeError: et[t[((h + 36) >> 2)]] is not a function`，Canvas 未完成渲染；旧版 `0.0.2` 在完全相同的 Chromium/WebGL 条件下成功渲染 280x280 Canvas，且无 page error。
- 运行时门禁失败，已恢复 `package.json`/`pnpm-lock.yaml` 到 `l2d-widget@0.0.2`；Pio 的原始关闭覆盖配置也已恢复，未改变生产功能开关。后续需等待上游修复 Cubism 6 解析回归或准备模型兼容性迁移后再重试。

### TypeScript 依赖归类

- TypeScript 没有被源码、Astro 配置或浏览器 bundle 直接导入，仅由 `tsc`、`@astrojs/check`、`@astrojs/svelte` 及相关类型工具使用；已从 `dependencies` 移入 `devDependencies`，版本仍为 `6.0.3`，不改变编译器版本。
- `pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和完整 `pnpm build` 均通过；构建继续生成 148 个页面及 Pagefind/RSS/Atom/字体产物。
- 在独立临时目录执行 `pnpm install --prod --frozen-lockfile --ignore-scripts`：根目录没有 `node_modules/typescript`，但 `astro` 正常安装；说明生产运行时不再声明直接 TypeScript 依赖，同时保留正常构建依赖集合。旧 Swup 适配器链中的传递 `typescript@4.9.5` 仍存在，属于上游依赖范围，后续 Swup 现代化时再处理。
- 本批次没有版本升级；在线 `pnpm audit --prod` 因 registry 无响应在 45 秒超时，沿用此前最近一次全量/生产全 0 审计快照，不将超时视为通过。

### 孤立直接依赖清理

- 删除 `@fontsource/roboto`、`@iconify/utils`、`@rollup/plugin-yaml`；全仓源码、Astro/Vite 配置和脚本均无引用。
- 保留 `postcss-import` 与 `postcss-nesting`，因为 `postcss.config.mjs` 显式注册它们。

### Node/pnpm 运行环境统一

- `package.json` 增加 `engines.node >=22.12.0` 和 `engines.pnpm >=10.33.0 <11`。
- 新增 `.nvmrc`：`22.12.0`。
- Pages 部署 workflow 从 Node 20 改为 `22.12.0`；构建矩阵从 `[22, 23]` 改为 `[22, 24]`。
- `pnpm install --offline --frozen-lockfile`：通过。
- `pnpm check`：通过，358 个文件，`0 errors / 0 warnings / 0 hints`。
- `pnpm type-check`：通过。
- YAML 和 JSON 配置解析：通过。Prettier 对现有 workflow/配置有格式提示，但不影响语法，本轮没有进行无关格式化。

### 最终复验（所有批次完成后）

- `pnpm install --offline --frozen-lockfile`：通过，lockfile 与 package manifest 一致。
- `pnpm check`：通过，358 个文件，`0 errors / 0 warnings / 0 hints`。
- `pnpm type-check`：通过。
- `pnpm build`：通过，148 个页面、Pagefind 主站/文档索引、RSS/Atom、sitemap、OG 生成和字体压缩均完成。
- `pnpm audit` 与 `pnpm audit --prod`：均为 `0 info / 0 low / 0 moderate / 0 high / 0 critical`。
- 生产预览浏览器冒烟：首页、归档页、Markdown 文章页均 HTTP 200，标题/正文正常，`console error` 与 `pageerror` 均为 0。
- `git diff --check`：通过；增加 `src/icons/.gitkeep` 后，astro-icon 正常加载本地空集合，缺失目录警告已消除。

## Astro 7 迁移门禁

- [x] 更新 `astro`、`@astrojs/mdx`、`@astrojs/svelte` 及 Vite 兼容版本。
- [x] 删除 `experimental.queuedRendering`；Astro 7 已将其变成默认行为。
- [x] 保留显式 `@astrojs/markdown-remark` + `unified()`，验证所有自定义 remark/rehype 插件。
- [x] 删除或重写 `scripts/patch-vite-timeout.js` 和 `scripts/patch-data-store-load.js`。
- [x] 验证自定义 `devGlob` 是否可替换为官方 `deferRender`，并比较内存峰值；当前实现继续保留，因其直接满足项目的开发内容裁剪需求。
- [x] 验证 Svelte hydration、RSS/Atom、OG 生成链、Pagefind、sitemap 和字体压缩；Swup 仍保留现有适配器，未进行未经验证的替换。
- [x] 通过完整构建、开发浏览器冒烟和审计后再合并。

## 最终评估

- **建议升级并合并**：本轮升级直接覆盖 Astro/Vite/Svelte 主构建链、字体工具链和运行环境约束，最终审计清零，属于高收益、可验证的维护批次。
- **获得的能力**：Astro 7 默认队列渲染和 Vite 8 工具链、Svelte 无本地 runtime patch、Node 22+ 统一 CI/部署、无 node-gyp 的字体子集化、Satori 新版 OG 生成、构建期 Pako 不进入生产安装，以及可重复的 frozen/offline 安装。
- **成本与风险**：锁文件变化较大；Astro 7 暴露并修复了一个旧 Astro 模板语法问题；Markdown-it 15 需要配套 `linkify-it` 6 override；`@swup/astro@1.8.0` 仍是维护瓶颈，目前依靠同主版本传递依赖 override，后续 Swup 适配器升级时应重新移除这些 override 并回归验证页面转场。
- **暂缓项**：TypeScript 7 等待 `@astrojs/check` 与 `@astrojs/svelte` 放宽 peer 范围；Swup 不替换为未经验证的方案；`oddmisc` 继续固定 `1.2.5`，直到上游恢复配置使用的命名导出。
- **维护建议**：每周运行 `pnpm audit`、每月检查 Astro/Svelte/Swup 更新；一旦 `@swup/astro` 发布兼容 Astro 7/Vite 8 的版本，优先删除其相关 override 并执行完整构建与浏览器冒烟。

## 回退策略

- 只回退本轮依赖提交；保留用户已有未提交修改。
- 依赖升级前保留 `pnpm-lock.yaml`，失败时使用对应分支的锁文件恢复。
- 不使用破坏性 Git 命令，不删除用户内容或生成物。

## 变更日志

### 2026-09-04

- 创建本文档，记录依赖升级路线和验证门禁。
- 发现 pnpm 10 会忽略 `package.json` 中的旧 `pnpm` 配置；当前补丁配置以 `pnpm-workspace.yaml` 为准。
- 发现工作区存在用户已有未提交改动，本轮不触碰这些文件。
- 完成同主版本安全批次：检查、类型检查、完整静态构建和 Pagefind/字体压缩均通过。
- 审计快照改善为 `0 critical / 25 high / 11 moderate / 4 low`；没有直接升级 Svelte、TypeScript、Astro 7 或 Swup。
- 构建发现 `src/icons/` 缺失警告，暂不扩大范围处理。
- 追加 Vite `7.3.6` workspace override，完整构建再次通过，审计改善为 `0 critical / 24 high / 10 moderate / 4 low`。
- 完成构建依赖归类，冻结锁文件安装、检查、类型检查和完整构建均通过；生产审计路径进一步降至 `0 critical / 17 high / 8 moderate / 4 low`。
- 统一 Node/pnpm 版本约束，部署和 CI 不再使用低于 Astro 要求的 Node 20/23。
- 用 `subset-font@2.7.0` 替换 `fontmin`：真实压缩两套字体成功，完整构建通过；全量审计改善为 `0 critical / 14 high / 8 moderate / 4 low`。
- 将 Svelte 升至 `5.57.0` 并移除旧 patch；check、type-check、浏览器水合冒烟和完整构建均通过，审计进一步改善为全量 `0 critical / 14 high / 4 moderate / 4 low`、生产 `0 critical / 11 high / 2 moderate / 4 low`。
- 完成 Astro 7/Vite 8 迁移、Satori `0.33.4` 升级和传递依赖修复版 override；最终全量与生产审计均为 `0 critical / 0 high / 0 moderate / 0 low`。
- 完成低风险工具、类型、图标数据和字体包更新；再次冻结安装、检查、类型检查和完整构建均通过，审计仍保持全量/生产全 0。
- 增加 `src/icons/.gitkeep`，完成 astro-icon 默认本地图标目录治理；构建加载本地空集合，原缺失目录警告消失，148 页面构建通过。
- 升级 `postcss-import` 至 `17.0.0`；冻结安装、检查、类型检查和完整构建通过。在线审计因 registry 无响应超时，沿用升级前最近一次全 0 快照并记录限制。
- 升级 Pako 至 `3.0.1` 并移入开发依赖，修复命名空间导入；PlantUML 编码、真实 SVG 服务、文档页浏览器加载和完整构建均通过。在线审计仍受 registry 无响应限制。
- 升级 `@types/markdown-it` 至 `14.2.0`；冻结安装、Astro/TypeScript 检查和完整构建均通过。
- 升级 Biome 至 `2.5.12`；受影响文件检查、Astro/TypeScript 检查和完整构建均通过，全量扫描保留生成 JSON 的既有格式差异。
- 升级 `node-html-parser` 至 `9.0.3`；冻结安装、Astro/TypeScript 检查和完整构建均通过，RSS/Atom 图片处理保持正常。
- 升级 Markdown-it 至 `15.0.1` 并将 `linkify-it` override 调整至 `6.1.0`；标准渲染、RSS/Atom 内容对比和完整构建均通过。
- 试验升级 `l2d-widget` 至 `0.1.2`；静态门禁和构建通过，但本地 NOIR 模型解析回归，已在相同 WebGL 条件下与 `0.0.2` 对照并回退，暂不合并新版。
- 将 TypeScript `6.0.3` 从生产依赖移入开发依赖；生产安装验证无根目录 TypeScript 且保留 Astro，检查、类型检查和完整构建通过；在线生产审计因 registry 无响应超时。
