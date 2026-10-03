# Architecture and Code Organization

状态：完成

## ARC-001 完整 Atomic Design 层级（P1） [x]

- 目标：明确并落实 `atoms -> molecules -> organisms -> features -> layouts -> pages` 的依赖方向。
- 范围：盘点现有组件目录，补齐缺失的 molecules/organisms，统一 barrel exports，禁止低层组件反向依赖页面或 feature。
- 验收：组件依赖图无反向依赖；`pnpm type-check`、`pnpm astro check`、`pnpm test` 通过；至少为一个重复 UI 模式提供复用证明。

完成记录（2026-10-03）：新增 `src/components/molecules` 与 `src/components/organisms` barrel，使用 `MetaItem` 复用文章元数据结构；`pnpm check-component-boundaries` 扫描组件依赖并接入 CI。验证：`pnpm check-component-boundaries`、`pnpm type-check`、`pnpm astro check`、`pnpm test` 全部通过。

## ARC-002 组件尺寸治理（P1） [x]

- 目标：控制超大 Astro/Svelte 文件的维护成本。
- 范围：找出超过 300 行和 500 行的组件，按职责拆分逻辑、视图、hooks、types、utils；添加文件行数检查脚本。
- 验收：超过 500 行的业务组件有明确豁免说明或已拆分；检查脚本在 CI 中运行；类型和浏览器回归通过。

完成记录（2026-10-03）：新增 `scripts/check-component-size.mjs` 与 `.component-size-exemptions.json`，扫描 `src/components` 和 `src/layouts`，报告超过 300 行文件并要求超过 500 行文件提供逐项理由；检查已接入 CI。验证：`pnpm check-component-size`、`pnpm type-check`、`pnpm astro check`、`pnpm test` 通过。

## ARC-003 Feature Module 边界（P1） [x]

- 目标：让音乐、评论、搜索、设置、Live2D 等功能可独立演进。
- 范围：整理 feature 的入口、类型、状态、服务和组件，减少跨功能直接 import；保留现有路由和配置行为。
- 验收：每个目标功能有稳定入口；禁用功能不影响主页面；专项测试和构建通过。

完成记录（2026-10-03）：新增 comments、live2d、music、search 与统一 features barrel，补齐 Giscus 入口；新增 `tests/feature-modules.test.mjs` 锁定目标入口，保留 Layout 中按配置动态加载可选 island 的行为。验证：`pnpm test`、`pnpm type-check`、`pnpm astro check`、`pnpm check-feature-gates` 通过。

## ARC-004 可选功能启用/禁用产物测试（P1） [x]

- 目标：证明 Music Player、Pio、ContextMenu 的配置边界会影响最终客户端产物。
- 范围：为启用和禁用配置建立临时构建或 fixture，扫描 HTML/JS 产物中的 island 和模块引用。
- 验收：禁用构建不包含对应客户端入口，启用构建包含对应入口；两种构建都能通过 `pnpm check-feature-gates` 和基础页面测试。

完成记录（2026-10-03）：扩展 `check-feature-gates` 扫描客户端产物引用，新增启用/禁用 fixture 与 `check-feature-gate-fixtures`，覆盖 Music Player、Pio、ContextMenu 的 DOM 和 island 模块标记。验证：`pnpm check-feature-gate-fixtures`、`pnpm check-feature-gates`、`pnpm test` 通过。

## ARC-005 配置 Schema 化（P1） [x]

- 目标：统一校验环境变量、配置覆盖和 frontmatter。
- 范围：扩展现有配置检查，明确默认值、覆盖值、枚举、数值边界和错误消息；避免运行时静默接受非法值。
- 验收：非法配置有稳定失败信息；合法配置保留现有行为；`pnpm check-config` 和相关测试通过。

完成记录（2026-10-03）：扩展 `validateConfig` 覆盖语言、站点 URL、色相、布局枚举、布尔开关和数值边界，新增 `validateEnvironment` 校验环境变量类型、URL 和整数边界；测试覆盖非法配置与环境覆盖错误消息。验证：`pnpm check-config`、`pnpm test`、`pnpm type-check` 通过。

## ARC-006 路由注册中心（P2） [x]

- 目标：减少新增页面时同时修改页面、导航、feature gate、SEO 配置的遗漏。
- 范围：建立类型安全的路由元数据，驱动导航、启用状态和基础 SEO 检查；兼容 Astro 文件路由。
- 验收：新增或禁用一个页面只需修改约定入口；导航与页面 gate 一致；链接检查通过。

完成记录（2026-10-03）：将路径与页面文件合并到 `featurePageRegistry`，由其派生导航 route map；新增 `check-route-registry` 验证页面存在、路径格式和页面 feature gate，配置检查继续验证导航一致性。验证：`pnpm check-route-registry`、`pnpm check-config`、`pnpm type-check`、`pnpm astro check` 通过。

## ARC-007 数据访问层（P2） [x]

- 目标：统一 RSS、Bangumi、Bilibili、友链和统计数据访问。
- 范围：抽取超时、取消、重试、缓存、错误降级和结果 Schema 校验；不改变页面数据格式。
- 验收：外部请求异常不会破坏可恢复的构建流程；单测覆盖成功、超时、无效 JSON、缓存命中和降级路径。

完成记录（2026-10-03）：扩展浏览器 `fetchJson` 支持来源标识、重试和网络错误分类，新增脚本侧 `fetchExternalJson` 统一超时、取消、重试与 HTTP 错误，并接入 Bangumi 读取路径；现有 feed/Bilibili 请求保留其兼容代理配置与超时。验证：`pnpm test`、`pnpm type-check`、`pnpm check-config` 通过。

## ARC-008 状态管理边界（P2） [x]

- 目标：明确 Svelte store、页面状态、URL 状态和 localStorage 的职责。
- 范围：盘点 music/settings/theme/search 等状态，删除重复同步和隐式全局状态；为持久化状态定义版本和迁移策略。
- 验收：刷新、Swup 转场和多标签页行为稳定；状态相关单测和 Playwright 交互测试通过。

完成记录（2026-10-03）：新增 `persistent-state` 版本标记与迁移入口，主题、显示设置和音乐音量读取前统一调用，保留现有 localStorage key 以兼容刷新和 Swup 转场；新增迁移单测。验证：`pnpm test`、`pnpm type-check`、`pnpm astro check` 通过。

## ARC-009 依赖循环检查（P2） [x]

- 目标：阻止组件层和工具层出现循环依赖或反向引用。
- 范围：选择适合当前 TypeScript/Astro 的依赖图工具，配置分层规则并加入 CI。
- 验收：当前仓库无未解释循环；新增违规依赖能使检查失败；CI 有清晰错误定位。

完成记录（2026-10-03）：新增 `check-component-cycles`，解析组件相对路径和 `@components` alias 依赖并输出完整环路，已接入 CI；与分层检查共同覆盖反向依赖和循环依赖。验证：`pnpm check-component-cycles`、`pnpm check-component-boundaries`、`pnpm type-check` 通过。

## 后续发现

- 待执行 Agent 补充新的架构风险、豁免项和实际行数统计。
