# 性能监控指南

本文档记录 Tsukimi 当前可执行的性能检查方式，以及后续接入浏览器实测时的边界。构建体积基线保存在本地 `.codex/iteration/`，不会提交到远程仓库。

## 当前指标

| 层级 | 工具 | 用途 |
|------|------|------|
| 构建产物 | `performance-baseline.mjs` | 记录页面数量、HTML、JS/CSS、JSON 和字体体积 |
| 运行时 | `performance-observer.ts` | 可选收集 CLS、LCP、INP 等 Web Vitals |
| 浏览器实测 | Lighthouse/Playwright（可选） | 需要显式安装浏览器运行器后再接入 |

当前仓库不内置 Lighthouse 配置或浏览器依赖，因此文档不会把未安装的命令当作 CI 必需步骤。

## 静态构建基线

先生成生产构建，再写入本地基线：

```bash
pnpm build
pnpm perf:baseline
```

`pnpm perf:baseline` 会检查 `dist/`，采集首页、文章页、文档页和第一个实际生成的特色页，并写入：

```text
.codex/iteration/performance-baseline.json
```

检查当前构建是否相对基线增长超过 10%：

```bash
pnpm perf:check
```

也可以通过环境变量指定另一份基线：

```bash
TSUKIMI_PERFORMANCE_BASELINE=/path/to/baseline.json pnpm perf:check
```

基线文件包含 `pageCount`、`totalTrackedBytes`、`fileCounts` 和各采样页面的 HTML/JS/CSS 数据。它用于本机和 AI Agent 的持续迭代检查，不作为公开项目配置。

## 运行时 Web Vitals

`src/utils/performance-observer.ts` 提供 CLS、LCP、FID、INP、FCP、TTFB 等观察器。调用方负责决定是否上报，以及上报到哪个分析服务；默认不产生额外网络请求。

接入新的页面或分析服务时，应确认：

- 页面卸载或 Swup 导航时执行观察器返回的清理函数；
- 不在每次指标变化时发送高频请求，优先批量或采样；
- 不把文章内容、用户输入等敏感数据放进指标上报载荷；
- 指标名称和阈值与 Chrome/Web Vitals 当前定义保持一致。

## 浏览器实测（可选）

需要 FCP、LCP、CLS 等真实浏览器数据时，可以在本地单独安装 Lighthouse 或 Playwright，并使用生产预览：

```bash
pnpm build
pnpm preview
```

浏览器实测应覆盖 `/`、一篇文章、`/docs/tsukimi/` 和一个实际启用的特色页。测试配置和依赖只有在确定要纳入项目质量门禁后，才添加到仓库及 CI；否则会给贡献者增加浏览器下载和环境配置成本。

## CI 约束

当前 CI 已执行：

- `pnpm check`
- `pnpm type-check`
- `pnpm test`
- `pnpm check-content`
- `pnpm check-config`
- `pnpm build`

CI 不读取本地 `.codex/iteration/performance-baseline.json`，也不强制运行浏览器测试。这样可以保证构建结构和内容契约稳定，同时避免因运行环境差异造成无依据的性能失败。

## 常见问题

### 为什么 `pnpm perf:check` 找不到基线？

先运行 `pnpm build && pnpm perf:baseline`。基线位于被 Git 忽略的 `.codex/iteration/`，只在当前开发工作区可用。

### 为什么特色页显示为 route not found？

特色页受 `siteConfig.featurePages` 控制。脚本会在全部特色路由中选择第一个实际生成的页面；如果所有特色页都关闭，才会显示找不到路由。

### 静态体积增长是否一定是回归？

不一定。新增页面、字体或内容都会增加构建产物。超过 10% 时应查看基线中的 `fileCounts` 和采样页面数据，再决定是否更新基线。

## 相关资源

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse 性能评分](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
