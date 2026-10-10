# Tsukimi Enhancement Plans

这些计划用于按项实施和验证。2026-10-05 已根据当前源码、脚本、CI 和本地构建做过一次完整审计；各项现在标注为“已完成 / 进行中 / 待办”，完成项保留验证证据，未完成项写明缺口和下一步。

## 审计基线（2026-10-05）

本轮基线来自当前工作树，不代表所有目标已经完成：

- 通过：`pnpm type-check`、`pnpm test`（47/47）、`pnpm test:e2e`（20/20）、`pnpm build`。
- 通过：配置、路由注册、组件边界/循环/尺寸、feature gate fixture、静态数据、发布、图片、字体、静态链接、安全、i18n、reduced-motion、性能契约和性能预算检查。
- 构建结果：144 页静态页面；构建后的审计按 142 页资源/无障碍页面统计；Pagefind 双索引和字体压缩成功。
- 已知缺口：此前 `pnpm check` 的 3 个 hint 已清零；Lighthouse 门禁已校准为可配置预算（桌面默认 0.95、移动默认 0.90）；CI 已覆盖 Chromium/Firefox/WebKit。真实部署端 RUM、跨提交历史趋势、PR 可访问预览、完整第三方失败路径和依赖升级仍未闭环。

每个领域文件底部的“审计记录”是本轮判断依据；后续实施应先更新对应任务状态，再补充日期、变更文件和验证命令。

当前 73 项任务中：50 项已完成、22 项进行中、1 项待办。

## 执行约定

1. 一次只领取一个任务编号，先阅读本文件和对应领域计划。
2. 先检查当前工作树和相关代码，再实施最小范围修改。
3. 不回退其他 Agent 或用户已有的修改；遇到冲突先记录影响范围。
4. 任务必须通过对应的验收命令，不能只完成代码修改。
5. 在对应计划中更新状态、完成日期、变更文件和验证结果。
6. 若任务发现新的后续工作，追加到对应计划的“后续发现”，不要扩大当前任务范围。

## 优先级说明

- **P0**：阻塞可用性、无障碍、安全或发布流程，应优先处理。
- **P1**：直接改善架构、性能、测试可靠性或维护成本。
- **P2**：重要体验和工程增强，可在 P0/P1 后处理。
- **P3**：长期维护、文档或趋势建设。

状态只表示当前审计结论，不等同于 Git 提交状态：`已完成` 需要有可复现验证；`进行中` 表示已有部分实现但验收仍有缺口；`待办` 表示尚未开始或没有足够证据。

## 推荐执行顺序

```text
P0 UI/UX 无障碍
  -> P1 CI 浏览器门禁
  -> P1 可选功能产物测试
  -> P1 移动端视觉回归与 Core Web Vitals
  -> P1 真实用户性能监控
  -> P1 架构与组件边界
  -> P1 内容、数据与安全治理
  -> P2/P3 文档、趋势和维护自动化
```

依赖关系不是强制串行关系；Agent 可以并行处理没有共同文件或共同门禁的任务，但提交前必须重新运行全量检查。

## 计划索引

| 文件 | 范围 | 任务编号 |
|---|---|---|
| [01-architecture.md](./01-architecture.md) | 组件架构、模块边界、配置和依赖治理 | ARC-001 ~ ARC-009 |
| [02-performance.md](./02-performance.md) | Lighthouse、Web Vitals、Bundle、资源和缓存 | PERF-001 ~ PERF-013 |
| [03-uiux-a11y.md](./03-uiux-a11y.md) | Axe、键盘、响应式、视觉和动效体验 | UX-001 ~ UX-014 |
| [04-testing-ci.md](./04-testing-ci.md) | CI、浏览器矩阵、交互测试和测试产物 | QA-001 ~ QA-012 |
| [05-content-data.md](./05-content-data.md) | 外部数据、内容校验、搜索索引和发布可靠性 | DATA-001 ~ DATA-009 |
| [06-security-deploy.md](./06-security-deploy.md) | CSP、安全响应头、输入边界和部署一致性 | SEC-001 ~ SEC-008 |
| [07-docs-maintenance.md](./07-docs-maintenance.md) | 架构文档、ADR、贡献流程和趋势维护 | DOC-001 ~ DOC-008 |

## 通用完成标准

- 修改范围与任务编号一致，没有无关重构。
- `pnpm type-check`、`pnpm astro check` 和受影响的专项检查通过。
- 相关单元测试、浏览器测试或构建测试通过。
- 文档、配置和脚本已经同步更新。
- 计划项记录了实际验证命令和结果。

## 最终验证（2026-10-06）

- `pnpm build`：144 页静态页面、Pagefind default/tsukimi 双索引、资源预算和无障碍门禁通过。
- `pnpm check`、`pnpm type-check`：0 errors / 0 warnings / 0 hints。
- `pnpm test`：47/47；`pnpm test:coverage`：lines 57.93%、branches 76.13%、functions 63.97%。
- `pnpm test:e2e`：20/20；`pnpm optimize-images` 暖缓存命中 56/56；`pnpm check-html-structure`、`pnpm check-pagefind-quality`、`pnpm check-security`、`pnpm check-deployment-headers`、`pnpm check-dependencies`、`pnpm check-config-variants` 全部通过。
