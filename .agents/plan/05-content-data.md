# Content, Data, and Reliability

状态：进行中
审计日期：2026-10-05

## DATA-001 外部 API 超时与取消（P1）

- 状态：已完成

- 目标：所有 RSS、Bangumi、Bilibili、统计请求都有超时和取消机制。
- 范围：统一 fetch client、AbortSignal、超时、重试和错误分类；避免构建阶段永久等待。
- 验收：超时、取消、DNS/HTTP 错误均可测试；失败日志包含来源和耗时。

## DATA-002 构建失败降级（P1）

- 状态：已完成

- 目标：外部数据源失败时使用上一次有效快照，不阻塞整体生产构建。
- 范围：快照版本、更新时间、来源、过期标记和显式失败告警；首次无快照时仍有明确失败。
- 验收：单个来源失败不破坏其他页面；过期快照有提示；数据文件 Schema 仍通过。

## DATA-003 静态数据 Schema 校验（P1）

- 状态：已完成

- 目标：严格校验友链、动漫、项目、技能、设备和时间线数据。
- 范围：必填字段、枚举、URL、日期、颜色、图片路径和重复 ID。
- 验收：非法 fixture 能稳定失败；合法现有数据全部通过；错误定位到文件和字段。

## DATA-004 内容同步可观测性（P2）

- 状态：已完成

- 目标：记录同步数量、失败 URL、耗时、跳过项和变更摘要。
- 范围：sync-content、feed、anime、friend scripts 的统一日志格式和 JSON summary。
- 验收：本地和 CI 都能保存 summary；敏感 token 不进入日志；失败项可重试。

## DATA-005 草稿与发布检查（P2）

- 状态：已完成

- 目标：防止 draft、future post、重复 permalink、缺失封面和非法标签误发布。
- 范围：扩展现有 content/publish checks，区分允许的草稿和发布错误。
- 验收：发布门禁能捕获每类问题；错误消息带文章路径；合法草稿不阻塞本地开发。

## DATA-006 搜索索引质量（P2）

- 状态：已完成

- 目标：验证 Pagefind 对中文、代码块、加密文章和文档的索引行为。
- 范围：中文分词、标题/正文权重、排除草稿、加密正文和 docs index 分离。
- 验收：固定 fixture 的查询结果可重复；敏感加密正文不会被索引；索引构建检查通过。

## DATA-007 内容版本快照（P3）

- 状态：已完成

- 目标：为自动生成的 feed、anime、friend 数据记录版本和来源时间。
- 范围：元数据、schema version、source URL、fetchedAt 和生成 commit。
- 验收：页面可显示或诊断数据更新时间；快照迁移有版本处理。

## DATA-008 内容渲染安全边界（P1）

- 状态：已完成

- 目标：审查 Markdown、HTML directive、GitHub Card、Mermaid 和外链内容的渲染边界。
- 范围：sanitize、允许标签/属性、协议白名单和脚本阻断；保留合法自定义内容。
- 验收：XSS fixture 被阻断；合法 Markdown/MDX、图表和图片回归通过。

## DATA-009 内容构建缓存（P2）

- 状态：已完成

- 目标：减少重复内容解析、远程获取和图像处理。
- 范围：按输入 hash 缓存可重用的 feed、markdown capability、image optimization 结果。
- 验收：第二次构建明显减少重复工作；输入变化会正确失效；缓存损坏可自动恢复。

## 审计记录（2026-10-04）

- 已验证：`pnpm check-static-data`（友链/番剧/项目/技能/时间线）、`pnpm check-content`、`pnpm check-publish`（8 posts，1 draft）、`pnpm test`、`pnpm build`。Bangumi、朋友 RSS 请求已有超时/重试或单源回退；Markdown directive、RSS/Atom 已有 URL/HTML 清理实现。
- 已完成项：DATA-001、DATA-002、DATA-003、DATA-004、DATA-005、DATA-006、DATA-007、DATA-008。
- 未完成边界：GitHub Card 和部分浏览器端请求仍使用独立生命周期；Pagefind 当前以双索引、片段解压和密码哨兵检查边界，固定查询 fixture 与缓存命中率仍需补充；数据快照 schema/source/fetchedAt/commit 和失败 summary 已落地。

## 后续发现（审计更新）

- 后续发现：DATA-001/002/004/006/007/008 已有协议和 CI 证据；GitHub Card 生命周期仍使用独立的浏览器端请求路径，后续可单独统一。

## 实施记录（2026-10-04）

- 2026-10-04 实施：统一外部请求生命周期，生成带 schema/source/fetchedAt/commit 的快照与 summary；Pagefind 双索引质量检查和 directive URL 安全 fixture 已加入 CI。DATA-009 的跨构建缓存命中率仍需单独度量。
- 2026-10-06 实施：`scripts/image-cache.mjs` 为图像源字节和编码配置生成版本化 SHA-256 键；`optimize-images.mjs` 校验 AVIF/WebP 输出完整性，自动恢复缺失或损坏衍生图，并持久化缓存条目。冷启动接管 56 张图约 5 秒，第二次运行命中 56/56；源内容或编码配置变化会失效，缓存文件损坏会回退到冷构建。验证：`pnpm optimize-images`、`pnpm test`（47/47）、`pnpm build`。
