# Tsukimi 依赖升级记忆

> 本文档是依赖升级的持续记录。每次升级、验证、回退或发现新的兼容性问题，都要在这里更新。

## 基线

- 记录日期：2026-09-05
- 当前代码基线提交：`53e8d3a`
- Node：`v26.4.0`；pnpm：`10.33.0`
- 架构：Astro 静态输出、Svelte 5、Tailwind 4、统一的 Markdown/MDX 插件链、Swup、Pagefind、OG 图片和字体压缩。
- 当前工作区存在用户并行开发的 Markdown 指令、图表渲染与布局改动；依赖和性能批次只精确暂存自身文件，不覆盖这些改动。
- 最新基线验证：`pnpm check`、`pnpm type-check`、148 页主站构建和 584 页内容站构建均通过。

## 执行规则

1. 先完成同主版本安全更新，再进行 Astro 7 大版本迁移。
2. 每个批次必须记录 `pnpm install`、`pnpm check`、`pnpm type-check`、`pnpm build` 和 `pnpm audit` 结果。
3. `oddmisc` 使用 `1.2.11` 时必须从 `oddmisc/astro` 导入 Astro 集成；根路径只保留运行时客户端导出。
4. Svelte 补丁和 Astro/Vite 两个 `postinstall` 内部补丁均为迁移门禁，不能直接带入大版本升级。
5. 任何失败都记录原因、影响范围和恢复方式，不用强制升级掩盖问题。

## 项目清单

| 项目 | 状态 | 说明 |
|---|---|---|
| 基线与依赖用途盘点 | 已完成 | 已区分浏览器运行时、构建工具和数据脚本依赖 |
| 同主版本安全批次 | 已完成 | Astro 6、Astro 集成、astro-icon、Axios、Sharp、HTML 清理、Tailwind 等 |
| Vite 7 安全 override | 已完成（已由 Vite 8 接替） | Astro 7 迁移前曾统一到 `7.3.6`；迁移后移除该 override，由 Astro 7 使用 Vite `8.2.2` |
| `oddmisc` Astro 子路径迁移 | 已完成 | 升至 `1.2.11` 并从 `oddmisc/astro` 导入集成；运行时统计 API 保持兼容 |
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
| KaTeX 0.18.5 | 已完成 | 通过 workspace override 让 `rehype-katex` 使用同一版本；公式渲染和内容仓库构建通过 |
| `l2d-widget` 0.1.2 | 回退/暂缓 | 静态检查和构建通过，但本地 NOIR Cubism 6 模型在新版解析阶段失败；已恢复 0.0.2 |
| TypeScript 依赖归类 | 已完成 | TypeScript 仅供检查/编译使用，已从生产依赖移入开发依赖；生产安装保留 Astro |
| TypeScript 7 | 回退/暂缓 | `tsc` 和构建可通过，但 Astro language server 因 TS 7 API 变化崩溃；等待正式支持 |
| Swup 4.10 兼容刷新 | 已完成 | 保留 `@swup/astro@1.8.0`，在其兼容范围内统一核心及两个插件补丁版；内容站真实转场通过 |
| Swup 适配器替换 | 暂缓 | 当前没有高收益的直接替代；滚动和 morph 插件的新主版本也不强行越过适配器约束 |
| 转场合成层与 CSS 动画属性 | 已完成 | 页面切换期间才启用 `will-change`，并将只涉及位移/透明度的过渡从 `all` 收窄，降低常驻合成层和误动画布局属性的开销。 |
| Svelte/Iconify 首屏离线化 | 已完成 | 53 个交互图标随站点本地打包，旧式自定义元素仅在实际出现时加载远程兼容运行时；提交 `53e8d3a` 已推送。 |
| 外部字体首屏加载 | 待优化（高于 Live2D） | 首页目前仍请求 LXGW Webfont CDN CSS；需比较自托管、按需加载与字体回退的体积和视觉稳定性。 |
| `l2d-widget` 后续升级 | 低优先级暂缓 | 娱乐特性，不占用主依赖、性能和核心用户体验的优化预算；仅在上游修复 MOC3 v5 兼容后复核。 |

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
- 2026-09-05 再次查询 registry：Astro `7.3.1` 和 Vite `8.2.2` 均为最新版本，不存在尚未执行的 Astro 主链升级。
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
- 进一步核对确认模型属于主题仓库 `public/pio/models/NOIR`，两个 `noir.moc3` 副本均为 1,016,384 bytes，文件头为 `MOC3 05 00 00 00`；内容仓库本身不携带 Live2D 模型，而是通过 `overrides/pioConfig.ts` 将 Pio 关闭。
- `0.1.2` 只有自动选择 Cubism core 的路径，没有供项目显式选择旧 core 的配置。并装旧版别名会保留两套运行时且没有收益，替换/重新导出模型又超出依赖升级范围，因此当前最安全且性价比最高的兼容方案仍是保留 `0.0.2`。

### TypeScript 依赖归类

- TypeScript 没有被源码、Astro 配置或浏览器 bundle 直接导入，仅由 `tsc`、`@astrojs/check`、`@astrojs/svelte` 及相关类型工具使用；已从 `dependencies` 移入 `devDependencies`，版本仍为 `6.0.3`，不改变编译器版本。
- `pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和完整 `pnpm build` 均通过；构建继续生成 148 个页面及 Pagefind/RSS/Atom/字体产物。
- 在独立临时目录执行 `pnpm install --prod --frozen-lockfile --ignore-scripts`：根目录没有 `node_modules/typescript`，但 `astro` 正常安装；说明生产运行时不再声明直接 TypeScript 依赖，同时保留正常构建依赖集合。旧 Swup 适配器链中的传递 `typescript@4.9.5` 仍存在，属于上游依赖范围，后续 Swup 现代化时再处理。
- 本批次没有版本升级；在线 `pnpm audit --prod` 因 registry 无响应在 45 秒超时，沿用此前最近一次全量/生产全 0 审计快照，不将超时视为通过。

### oddmisc 1.2.11 与内容仓库联调

- `oddmisc@1.2.11` 的根入口仅导出 Umami 运行时客户端，Astro 集成迁移到 `oddmisc/astro`；项目原有 `import { oddmisc } from "oddmisc"` 因此不再兼容。
- 已将 `astro.config.mjs` 改为从 `oddmisc/astro` 导入，并将直接依赖从 `1.2.5` 升至 `1.2.11`。新版声明的 Astro peer `>=4.0.0` 与当前 Astro `7.3.1` 满足。
- 在独立工作树中同步 `Tsukimi-Content` `main@77c4906`（不含 `.git`，避免测试触发内容仓库强制 reset），实际接入 490 篇 Markdown，其中 273 篇位于 `_draft`；`pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check` 和完整 `pnpm build` 均通过，生成 584 个静态页面、两套 Pagefind 索引、RSS/Atom、sitemap 和字体产物。
- 预览冒烟覆盖首页、归档、Go 文章、Markdown 扩展和友情链接：全部 HTTP 200、正文正常；`window.oddmisc` 的 `getStats`、`getSiteStats`、`getPageStats` 三个现有调用均存在，应用 console/pageerror 为 0（第三方广告/指纹网络错误已排除）。
- 主工作区的 `pnpm install --offline --frozen-lockfile`、`pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check` 和完整 `pnpm build`（148 页面）均通过；在线 `pnpm audit --prod` 返回 `No known vulnerabilities found`。
- 内容仓库自带格式脚本报告 514 个扫描文件中 278 个存在编辑规范提示，指令脚本报告 25 个错误和 250 个警告，主要来自草稿和既有指令风格；Astro 构建已验证这些内容可以被当前插件链解析，本批次不修改内容文本。
- 本批次未改动 `Tsukimi-Content`，因此无需内容仓库提交；后续内容更新继续以其 `main` 提交为构建输入。

### KaTeX 0.18.5 与内容仓库公式联调

- `katex` 从 `0.16.47` 升至 `0.18.5`；由于 `rehype-katex@7.0.1` 仍声明 `katex: ^0.16.0`，在 `pnpm-workspace.yaml` 增加 `katex: 0.18.5` override，使直接依赖、`remark-math` 使用的链路和 `rehype-katex` 传递依赖只解析出一个 KaTeX 版本。
- 0.18 系列带来 MathML/CSS 和解析器维护更新；当前页面只依赖 `.katex`、`.katex-display` 等公开渲染类名，fixture 与现有文章验证未发现样式选择器回归。0.18.2 的设置原型污染修复也纳入了生产依赖链。
- 内容仓库原始 490 篇 Markdown 的 `pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check` 和完整构建（584 页面）通过。随后在内容副本中临时加入含行内公式、块级公式和 `aligned` 环境的 smoke fixture，585 页面构建及预览浏览器冒烟通过；生成 HTML 含 3 个 `.katex`、2 个 `.katex-display`，按需 CSS、KaTeX 字体和可见布局均正常且无站内 console/pageerror。fixture 未提交到任何仓库。
- 主工作区更新后再次执行 `pnpm install --offline --frozen-lockfile`、`pnpm check`、`pnpm type-check` 和 148 页面完整构建均通过；本次 `pnpm audit --prod` 因 registry 无响应超时，沿用上一个批次最近一次 `No known vulnerabilities found` 快照，不将超时视为通过。

### Swup 4.10 兼容刷新与内容仓库转场联调

- npm registry 中 `@swup/astro` 仍为 `1.8.0`，它声明 `swup: ^4.0.0` 并管理整组 Swup 插件；本批次不替换适配器，而是在现有范围内通过 workspace override 将核心 `4.9.0 -> 4.10.0`、`@swup/a11y-plugin 5.1.0 -> 5.2.1`、`@swup/fragment-plugin 1.3.0 -> 1.3.1`。`pnpm why` 确认三者各只有一个解析版本。
- Swup `4.10.0` 改善浏览器已执行原生 View Transition 时的历史动画处理，并重构失败 visit 的状态逻辑；属于现有 API 范围内的运行时维护更新。官方变更记录：<https://github.com/swup/swup/commit/854ff00c7fbb0251f45e7a1488002a28aa12e07f>。
- 内容仓库 `main@77c4906` 的 490 篇 Markdown 在独立工作树中完成 `pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check` 和完整 `pnpm build`，生成 584 页面、两套 Pagefind 索引、RSS/Atom、sitemap 和字体产物。
- 生产预览中依次执行主页到归档、归档到 `/posts/golang/go-start/`、浏览器后退到归档；每次均完整触发 `visit:start`、`content:replace`、`page:view`，页面标题/正文正确更新，注入的 JS 内存标记全程保留，证明没有退化为整页刷新，站内 console/pageerror 为 0。
- 主工作区再次通过离线冻结安装、`pnpm check`、`pnpm type-check` 和 148 页面完整构建。生产审计请求在 45 秒内无响应而超时，最近一次成功快照仍是 oddmisc 批次的 `No known vulnerabilities found`，本批次不宣称新的审计结果。
- 不强制升级 `@swup/scroll-plugin` 4 或 `swup-morph-plugin` 2：它们超出当前适配器依赖范围。旧 `@swup/plugin@3.0.1 -> microbundle` 链仍会带入传递 `typescript@4.9.5`，只有上游适配器重构后才能无额外维护成本地移除。
- 本批次未修改 `Tsukimi-Content`；兼容措施位于主题依赖解析层，内容仓库保持 `main@77c4906` 干净，无需创建空提交。

### TypeScript 7 实际兼容实验

- 在独立工作树中试装 `typescript@7.0.2`；`@astrojs/check@0.9.10`、`@astrojs/svelte@9.0.1` 和 `svelte2tsx@0.7.55` 均报告只支持 TypeScript 4/5/6 的 peer 范围。
- `pnpm type-check` 与含内容仓库的完整生产构建能够通过，但 `pnpm check` 在 `@astrojs/language-server/dist/check.js` 读取 `fileExists` 时崩溃；运行时探针也确认 TS 7 包不再暴露旧 JS API 的 `createProgram`。因此“能构建”不足以满足项目的开发门禁。
- 继续试验了双编译器方案：保留 `typescript@6.0.3` 供 Astro language server 使用，另以 npm alias 安装 `typescript@7.0.2` 并直接调用其 native CLI。该组合可让 `astro check` 和两套 `tsc --noEmit` 都通过，说明隔离在技术上可行。
- 在完整内容工作树上各运行三次：TS 6 为 3.29–3.38 秒、约 410–412 MiB RSS；TS 7 为 0.57–0.61 秒、约 298–303 MiB RSS。相对约快 5.7 倍，但一次 CI 只节省约 2.7 秒，Astro 的 358 文件检查仍必须走 TS 6，还会增加第二套编译器与非标准调用路径，综合收益不足，未合入。
- Astro 的 TypeScript Native 跟踪明确说明 language service 新 API 尚未稳定：<https://github.com/withastro/roadmap/discussions/1321>；TypeScript 7.1 API 路线图仍把 Astro/Svelte 所需扩展接口列为待完成：<https://github.com/microsoft/typescript-go/issues/4830>。
- 实验后已恢复 `typescript@6.0.3`，内容仓库和主工作区均未留下 TS 7 改动。后续只有当 Astro check、Svelte 集成和 svelte2tsx 明确支持 TS 7 后才值得重试；直接替换会损坏日常诊断，双版本方案当前则是可行但低性价比。

### 剩余升级门禁复核

- `typescript@7.0.2` 已完成实际试装：除 peer 不支持外，`astro check` 会在 language server 内崩溃；继续保留 `6.0.3`，不是仅凭版本范围保守推断。
- `katex@0.18.5` 已通过 workspace override 与 `rehype-katex@7.0.1` 统一解析，内容仓库公式联调通过；后续关注 rehype-katex 官方依赖范围放宽后移除 override 的机会。
- `oddmisc@1.2.11` 已通过改用 `oddmisc/astro` 子路径完成兼容升级；`l2d-widget@0.1.2` 仍因本地 MOC3 v5 模型解析回归回退到 `0.0.2`，内容站通过配置关闭 Pio，无需内容迁移。
- Swup 核心和适配器兼容范围内的插件已安全刷新；仅适配器替换、scroll 4、morph 2 和旧构建链清理继续暂缓。当前真正剩余的升级门禁只有 TypeScript 7、Live2D 0.1.2 与 Swup 适配器主链现代化。

### 转场合成层与 CSS 动画属性优化

- 将 `transition-main`/`transition-leaving` 的 `will-change` 从常驻样式改为仅在 Swup 的 `is-changing`/`is-animating` 生命周期内启用；保留原有移动端位移规则和页面转场时序。
- 将 Swup fade、slide-in、card 和导航动画的 `transition: all` 收窄为 `opacity` 与 `transform`，避免未来布局、尺寸或交互属性变化时触发额外动画和布局/绘制工作。
- 生产浏览器探针（Chromium，桌面 1440x1000、移动 390x844）确认首屏 `#content-wrapper` 的 `will-change` 为 `auto`，转场 `content:replace`/`page:view` 阶段为 `transform, opacity`，转场结束后恢复 `auto`；桌面真实 Swup 跳转至归档成功，应用错误为 0。
- 阻断第三方请求后的本地渲染基线：DOMContentLoaded 约 0.29–0.48 秒（移动/桌面），页面约 1,129–1,142 个元素；本次 CSS 修改不改变页面结构或资源数量。
- `pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check`、完整 `pnpm build`（148 页面）和桌面/移动截图验证均通过。该项不变更依赖版本，审计沿用最近一次成功快照，不把在线审计超时视为新结果。
- 回退方式：仅回退提交 `36f71aa` 即可恢复原有常驻合成提示和 `transition: all` 规则，不影响依赖锁文件或内容仓库。

### Svelte/Iconify 首屏离线化

- 新增构建脚本扫描 48 个 Svelte 文件中的字面量图标名，从本地 Iconify JSON 包生成 53 个最小图标集合；开发和生产构建前都会刷新生成文件，缺失的已知集合图标会直接让构建失败。
- 23 个交互组件统一经过 `LocalIcon.svelte` 注册本地图标集合，搜索、主题切换、显示设置、日历、移动目录和音乐控件不再依赖 Iconify CDN/API 才能显示；用户配置传入的未知图标仍保留 `@iconify/svelte` 在线回退能力。
- 移除 8 个功能页的无条件远程加载调用和重复的 `src/utils/icon-loader.ts`；全局兼容加载器由约 7.3 KB 精简为约 4.2 KB，仅当 DOM 中真实出现旧式 `<iconify-icon>` 时才下载运行时。首页 HTML 同一构建由约 224.9 KB 降至约 222.1 KB。
- 阻断第三方网络的 Chromium 探针中，桌面/移动首屏请求数由 59/58 降至 46/45，减少 13 个 Iconify 脚本/API 请求；本地解码体积净增加约 16 KB、传输体积约增加 5-6 KB，换取图标即时可见、弱网稳定和无多域名握手，收益明显高于成本。
- 桌面和移动端的搜索、主题设置、日历与移动目录均在断网条件下渲染为 SVG，Iconify 请求和应用错误均为 0；受控插入旧式图标后只触发 1 次兼容运行时请求，自定义元素成功升级，证明延迟兼容路径可用。
- 主工作区 `pnpm check`（358 文件，0 error/warning/hint）、`pnpm type-check`、148 页完整构建、两套 Pagefind 索引和字体压缩通过；`pnpm audit --prod` 返回 `No known vulnerabilities found`。一次并发验证因旧预览进程与构建同时访问 `dist` 导致 Pagefind `ENOENT`，停止预览后串行重跑即通过，不是源码兼容失败。
- 独立副本接入 `Tsukimi-Content main@77c4906` 的 501 个内容文件后完整生成 584 页，Pagefind、RSS/Atom、sitemap 和字体压缩均通过；内容站桌面/移动交互探针 Iconify 请求和应用错误为 0，实际内容仓库保持干净。
- 代码提交 `53e8d3a` 已推送 `origin/master`；回退该提交即可恢复原远程图标策略，不涉及内容仓库提交。

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
- **性能与体验维护**：转场合成提示按生命周期启用，动画属性范围明确；53 个交互图标改为本地打包后，首页减少 13 个第三方请求，弱网和离线状态下的搜索、设置、目录等关键控件不再缺图标。下一批优先处理仍在首屏请求的外部字体 CSS。
- **成本与风险**：锁文件变化较大；Astro 7 暴露并修复了一个旧 Astro 模板语法问题；Markdown-it 15 需要配套 `linkify-it` 6 override；`@swup/astro@1.8.0` 仍是维护瓶颈，目前依靠兼容范围内的传递依赖 override，后续 Swup 适配器升级时应移除这些 override 并重新验证页面转场。
- **暂缓项**：TypeScript 7 已证实会破坏 Astro check；Swup 仅暂缓适配器和插件主版本替换，核心 4.10 及兼容插件补丁已完成；Live2D 0.1.2 不能解析当前 NOIR 模型且属于低优先级娱乐特性，不再优先投入。KaTeX 与 `oddmisc` 均已升级并经内容仓库联调验证。
- **维护建议**：每周运行 `pnpm audit`、每月检查 Astro/Svelte/Swup 更新；一旦 `@swup/astro` 发布兼容 Astro 7/Vite 8 的版本，优先删除其相关 override 并执行完整构建与浏览器冒烟。

## 回退策略

- 只回退本轮依赖提交；保留用户已有未提交修改。
- 依赖升级前保留 `pnpm-lock.yaml`，失败时使用对应分支的锁文件恢复。
- 不使用破坏性 Git 命令，不删除用户内容或生成物。

## 变更日志

### 2026-09-05

- 复核 npm registry，确认主构建链已处于 Astro `7.3.1`、Vite `8.2.2` 最新版本；Astro 7 迁移遗留兼容问题已完成主站和内容站验证。
- 将 53 个 Svelte 交互图标本地化，移除 8 个功能页的主动 Iconify CDN 加载和重复加载模块；首屏减少 13 个第三方请求，关键交互在断网下仍正常显示。
- 精简旧式 `<iconify-icon>` 兼容加载器并改为 DOM 按需触发；主站 148 页和内容站 584 页完整构建、桌面/移动浏览器交互探针均通过，代码提交 `53e8d3a` 已推送。
- 调整后续优先级：先处理外部字体、核心资源加载与可感知样式/交互问题；Live2D 维持低优先级暂缓。

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
- 初次复核时 TypeScript 7、KaTeX 0.18.5 和 l2d-widget 0.1.2 因 peer 或真实运行时门禁暂缓；随后 `oddmisc@1.2.11` 已迁移至 `oddmisc/astro` 并通过内容仓库完整联调。
- 升级 KaTeX `0.18.5` 并将 `rehype-katex` 传递依赖统一到同一版本；内容仓库原始 584 页面及含公式 fixture 的 585 页面构建和预览冒烟均通过。
- 实际试装 TypeScript `7.0.2`：类型检查和生产构建可通过，但 Astro check 因 language server 调用已移除的 TS API 崩溃；已恢复 `6.0.3` 并明确暂缓条件。
- 验证 TypeScript 6/7 双编译器隔离可行，TS 7 CLI 在项目上约快 5.7 倍，但绝对只节省约 2.7 秒且 Astro 仍依赖 TS 6；判定维护成本高于收益，未合入别名依赖。
- 复核 Live2D 内容兼容：模型来自主题仓库且为 MOC3 v5，内容仓库只关闭 Pio；新版没有可选旧 core 的配置，因此继续保留能正常渲染的 `l2d-widget@0.0.2`。
- 在 `@swup/astro@1.8.0` 兼容范围内统一 Swup `4.10.0`、a11y `5.2.1` 和 fragment `1.3.1`；主站 148 页面、内容站 584 页面构建通过，三次真实无刷新转场的完整钩子序列和内存状态均验证成功。
- 将转场 `will-change` 限定在 Swup 活跃生命周期，并收窄四处 `transition: all`；主站 148 页面构建、桌面/移动浏览器探针和真实归档转场均通过，提交 `36f71aa` 已推送远程。
