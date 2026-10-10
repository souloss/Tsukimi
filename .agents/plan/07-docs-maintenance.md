# Documentation and Long-Term Maintenance

状态：进行中
审计日期：2026-10-05

## DOC-001 架构文档（P1）

- 状态：已完成

- 目标：记录页面、布局、组件、配置、内容集合和构建流程。
- 范围：更新 `AGENTS.md` 或独立 architecture docs，配合真实目录和脚本入口。
- 验收：新 Agent 能从文档定位主要模块、命令和验证入口；文档链接有效。

## DOC-002 ADR 决策记录（P1）

- 状态：已完成

- 目标：记录静态生成、Svelte islands、动态模块边界、图片管线和 feature gate 的设计原因。
- 范围：每份 ADR 包含背景、决策、替代方案、影响和验证方式。
- 验收：关键架构决策至少有一份 ADR；内容与当前代码和配置一致。

## DOC-003 新功能检查清单（P1）

- 状态：已完成

- 目标：防止新增 feature 遗漏类型、配置、导航、组件注册、测试和文档。
- 范围：根据 Sidebar widget 三步规则、feature gate 和内容页面流程制作模板或脚本。
- 验收：新建模拟 feature 时检查能提示遗漏；清单链接加入贡献指南。

## DOC-004 开发环境检查（P2）

- 状态：已完成

- 目标：启动或 CI 早期检查 Node、pnpm、浏览器、字体和环境变量版本。
- 范围：提供 `doctor` 命令，输出修复建议，不泄漏 secrets。
- 验收：正确环境通过；错误版本给出明确非零失败；本地和 CI 行为一致。

## DOC-005 贡献指南（P2）

- 状态：已完成

- 目标：统一组件命名、导入顺序、样式、测试、提交和计划更新规范。
- 范围：补充现有 AGENTS 规则中最容易遗漏的实际示例和命令。
- 验收：贡献指南覆盖常见工作流；命令在干净工作树可执行。

## DOC-006 变更日志（P3）

- 状态：进行中

- 目标：记录版本变更、性能变化、配置变化和破坏性修改。
- 范围：建立 changelog 结构或自动生成脚本，区分 feature、fix、performance、breaking。
- 验收：一次示例发布能生成可读变更日志；链接到验证报告和迁移说明。

## DOC-007 性能与质量仪表板（P3）

- 状态：进行中

- 目标：集中展示 bundle、Web Vitals、Axe、测试和构建时间趋势。
- 范围：复用 CI 产物，定义历史保留、基线和异常标记。
- 验收：指标来源可追溯；异常能链接到 commit 和具体页面。

## DOC-008 计划维护流程（P2）

- 状态：已完成

- 目标：让 `.agents/plan` 长期保持可执行，而不是一次性清单。
- 范围：定义任务状态 `待办/进行中/阻塞/已完成`、负责人、日期、验证命令和后续发现格式。
- 验收：每个计划文件有状态和完成记录；已完成项保留验证证据；新发现不会丢失。

## 审计记录（2026-10-04）

- 已检查：`docs/architecture.md`、`docs/security.md`、`docs/design-system.md`、`docs/quality-dashboard.md`、`CONTRIBUTING.md`；已验证 `pnpm check-doctor`、`pnpm check-route-registry`。在生产预览（4330）与 Playwright Chromium 下运行 `pnpm check-docs-render`，46 项全部通过。
- 已完成项：DOC-001、DOC-002、DOC-003、DOC-004、DOC-005、DOC-008。现有 `docs/adr/0001-static-astro-and-islands.md` 覆盖静态输出和 islands 决策。
- 未完成边界：关键边界 ADR 已补齐；CHANGELOG 发布自动化、质量跨提交历史和负责人字段仍未建立；计划文件现已包含统一状态、审计日期、实施记录和后续发现。

## 后续发现（审计更新）

- 后续发现：DOC-006/007 仍需发布自动化和跨提交历史存储；计划状态与实施记录格式已固定，后续变更沿用当前结构。

## 实施记录（2026-10-04）

- 2026-10-04 实施：新增 ARC/data/performance/content-security ADR，quality dashboard 产物、状态枚举和审计记录格式已建立。DOC-006/007 仍需发布自动化和跨提交历史存储。
