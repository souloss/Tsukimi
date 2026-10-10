# Performance and Runtime Efficiency

状态：进行中
审计日期：2026-10-05

## PERF-001 Lighthouse 多页面矩阵（P1）

- 状态：已完成

- 目标：从单一首页检查扩展到真实核心页面。
- 范围：覆盖首页、文章、归档、标签、文档和至少一个功能页；同时覆盖 desktop 与 mobile profile。
- 验收：每个页面生成可追踪报告；性能、无障碍、最佳实践和 SEO 阈值可配置；CI 失败能指出具体页面和类别。

## PERF-002 Core Web Vitals 门禁（P1）

- 状态：已完成

- 目标：建立 LCP、CLS、INP、TTFB、FCP 的明确预算。
- 范围：在 Playwright 或 Lighthouse 中采集指标，区分本地稳定阈值和 CI 阈值，记录波动原因。
- 验收：核心页面有 LCP/CLS/INP/TTFB/FCP 报告；超预算时构建或 CI 失败；无随机等待型测试。

## PERF-003 路由级 Bundle Budget（P1）

- 状态：已完成

- 目标：阻止单个功能扩大公共 JS/CSS 包。
- 范围：按路由统计 JS、CSS、图片、字体和第三方代码；增加公共包和页面包的预算。
- 验收：报告列出最大页面和变化来源；超预算有稳定失败；禁用功能不进入公共包。

## PERF-004 真实用户性能监控（P1）

- 状态：进行中

- 目标：接通现有 `performance-observer`，收集真实浏览器指标。
- 范围：采集 LCP、CLS、INP、长任务、资源错误和导航耗时；尊重隐私并支持关闭上报。
- 验收：本地可查看采集事件；采样、失败和关闭配置有测试；不阻塞页面主线程或渲染。

## PERF-005 第三方资源治理（P1）

- 状态：进行中

- 目标：降低评论、统计、RSS、播放器等第三方资源对首屏的影响。
- 范围：统一延迟加载、超时、取消、失败 UI 和来源白名单；记录加载耗时。
- 验收：第三方不可用时核心内容仍可用；网络错误不产生未处理异常；Lighthouse 和 Playwright 通过。

## PERF-006 关键资源预加载（P2）

- 状态：进行中

- 目标：精确预加载首屏字体、头像、首屏图片和主要 CSS。
- 范围：只为当前路由首屏真正需要的资源添加 preload，避免过度预加载。
- 验收：资源优先级有测量依据；无重复 preload；LCP 和请求瀑布改善或不回退。

## PERF-007 图片策略细化（P2）

- 状态：进行中

- 目标：为不同布局生成准确的 `sizes`、`srcset`、AVIF/WebP fallback 和低质量占位图。
- 范围：覆盖首页卡片、文章封面、头像、相册和友链图片；保留固有尺寸防止布局偏移。
- 验收：图片审计通过；关键图片请求体积下降；Playwright 无缺图和横向溢出。

## PERF-008 字体继续裁剪（P2）

- 状态：已完成

- 目标：减少 CJK 字体首屏成本。
- 范围：按语言、页面或字符集拆分字体，保留 fallback 和字体加载失败路径。
- 验收：字体压缩脚本、视觉回归和字体审计通过；文字无闪烁或乱码。

## PERF-009 页面转场性能（P2）

- 状态：进行中

- 目标：消除 Swup 转场中的强制布局、重复初始化和长任务。
- 范围：审计转场钩子、组件清理、事件监听器和 DOM 测量；确保客户端 island 不重复挂载。
- 验收：连续转场无内存增长或重复事件；转场 Playwright 测试和长任务预算通过。

## PERF-010 缓存策略（P2）

- 状态：已完成

- 目标：为静态资源、Pagefind 索引、图片和 API 数据设置可解释的缓存策略。
- 范围：根据部署平台完善 Cache-Control、ETag、版本化资源和数据更新策略。
- 验收：缓存命中/失效行为有测试或 curl 证据；更新内容不会被旧索引永久遮蔽。

## PERF-011 构建可重复性（P3）

- 状态：进行中

- 目标：让相同 commit 的构建尽量得到稳定产物。
- 范围：固定 Node、pnpm、浏览器和外部数据快照；隔离时间、随机数和远程 feed 对产物的影响。
- 验收：重复构建差异有白名单；非白名单差异会报警；文档说明需要更新快照的步骤。

## PERF-012 性能趋势报告（P3）

- 状态：进行中

- 目标：长期跟踪包体积和 Web Vitals 趋势。
- 范围：在 CI 保存历史报告，展示页面、指标、预算和 commit 变化。
- 验收：PR 能看到与基线的差异；报告可下载；没有敏感数据。

## PERF-013 移动端性能基线（P1）

- 状态：已完成

- 目标：为 375px、390px、768px 建立低端移动设备性能基线。
- 范围：模拟 CPU、网络和 viewport，覆盖首页、文章、归档及导航打开路径。
- 验收：移动 profile 有稳定预算；页面无横向滚动；报告能区分桌面和移动回归。

## 审计记录（2026-10-04）

- 已验证：`pnpm build`、`pnpm perf:budget`（142 页，33.8 MiB/45.0 MiB）、`pnpm perf:matrix`（6 路由、4 profile）、`pnpm perf:contracts`、`pnpm check-images`、`pnpm check-fonts`、`pnpm check-motion-tokens`、`pnpm test:e2e`（18/18）。移动 Lighthouse（`pnpm perf:lighthouse:mobile`）通过，性能 0.99、无障碍/最佳实践/SEO 均为 1。
- 已完成项：PERF-003、PERF-008、PERF-010。
- 未完成边界：性能矩阵目前是构建体积和预算元数据，不是每条路由的真实 Lighthouse/Web Vitals 采集；`performance-observer` 已支持默认关闭、采样率和 endpoint 的 opt-in 上报；第三方请求、转场内存、可重复构建和历史趋势仍没有完整 CI 门禁。图片审计中的外部/动态图片继续作为显式例外统计。Lighthouse 已改为可配置预算，默认桌面 0.95、移动 0.90。

## 后续发现（审计更新）

- 后续发现：Lighthouse 预算和重试已落地；下一步是把多路由矩阵、RUM 样本和历史报告接入同一保留策略。

## 实施记录（2026-10-04）

- 2026-10-04 实施：Playwright 已采集 FCP/LCP/CLS/TTFB/INP 预算并覆盖 375/390/768/1024；新增可配置 Lighthouse 路由矩阵和 opt-in sampled reporting。PERF-001/004/005/006/007/009/011/012 仍需真实部署或历史数据闭环。
- 2026-10-10 实施：图片审计区分本地和外部/动态图片尺寸缺口；当前生产构建 248 张图片中本地图片固有尺寸缺口为 0，19 个缺口均为外部 URL、PlantUML 或动态 Markdown 资源并保留计数。验证：`pnpm check-images`、`pnpm test`。

## 实施记录（2026-10-10）

- PERF-001 验收完成：Lighthouse 矩阵覆盖首页、文章、归档、标签、文档和已启用的友链功能页，并分别执行 desktop 与 mobile profile。六路由均达到性能门禁（desktop >= 0.95、mobile >= 0.90）、无障碍 1、最佳实践 1；可抓取路由首页和文章 SEO 为 1，`robots.txt` 明确禁止抓取的归档、标签、文档和友链页按 0.66 预期值校验。桌面和移动报告分别写入 `.lighthouseci/matrix.json` 与 `.lighthouseci/mobile-matrix.json`，矩阵记录 `expectedSeo` 与 `crawlable` 字段。
- 矩阵脚本增加构建路由存在性检查，功能页默认使用当前已启用的 `/friends/`，避免禁用功能路由被误当成 Lighthouse/preview 故障；preview readiness 改为直连 HTTP 检查并允许较慢的本地启动。
- 验证：`pnpm build`（144 页、33.8 MiB/45.0 MiB）、`pnpm perf:lighthouse:matrix`、`pnpm perf:lighthouse:matrix:mobile`；两套矩阵均完成 6/6 路由。
- PERF-004 部分实施：运行时观察器增加 entry type 能力检测、完整清理、CLS 增量和 INP 去重；页面入口改为采样队列批量上报，优先 `sendBeacon`，网络失败不产生未处理 rejection。验证：`pnpm type-check`、`pnpm check`、`pnpm test`（53/53）。真实部署样本、endpoint 可用性和隐私留存仍需部署环境闭环，任务保持进行中。
