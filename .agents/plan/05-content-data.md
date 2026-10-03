# Content, Data, and Reliability

状态：待办

## DATA-001 外部 API 超时与取消（P1）

- 目标：所有 RSS、Bangumi、Bilibili、统计请求都有超时和取消机制。
- 范围：统一 fetch client、AbortSignal、超时、重试和错误分类；避免构建阶段永久等待。
- 验收：超时、取消、DNS/HTTP 错误均可测试；失败日志包含来源和耗时。

## DATA-002 构建失败降级（P1）

- 目标：外部数据源失败时使用上一次有效快照，不阻塞整体生产构建。
- 范围：快照版本、更新时间、来源、过期标记和显式失败告警；首次无快照时仍有明确失败。
- 验收：单个来源失败不破坏其他页面；过期快照有提示；数据文件 Schema 仍通过。

## DATA-003 静态数据 Schema 校验（P1）

- 目标：严格校验友链、动漫、项目、技能、设备和时间线数据。
- 范围：必填字段、枚举、URL、日期、颜色、图片路径和重复 ID。
- 验收：非法 fixture 能稳定失败；合法现有数据全部通过；错误定位到文件和字段。

## DATA-004 内容同步可观测性（P2）

- 目标：记录同步数量、失败 URL、耗时、跳过项和变更摘要。
- 范围：sync-content、feed、anime、friend scripts 的统一日志格式和 JSON summary。
- 验收：本地和 CI 都能保存 summary；敏感 token 不进入日志；失败项可重试。

## DATA-005 草稿与发布检查（P2）

- 目标：防止 draft、future post、重复 permalink、缺失封面和非法标签误发布。
- 范围：扩展现有 content/publish checks，区分允许的草稿和发布错误。
- 验收：发布门禁能捕获每类问题；错误消息带文章路径；合法草稿不阻塞本地开发。

## DATA-006 搜索索引质量（P2）

- 目标：验证 Pagefind 对中文、代码块、加密文章和文档的索引行为。
- 范围：中文分词、标题/正文权重、排除草稿、加密正文和 docs index 分离。
- 验收：固定 fixture 的查询结果可重复；敏感加密正文不会被索引；索引构建检查通过。

## DATA-007 内容版本快照（P3）

- 目标：为自动生成的 feed、anime、friend 数据记录版本和来源时间。
- 范围：元数据、schema version、source URL、fetchedAt 和生成 commit。
- 验收：页面可显示或诊断数据更新时间；快照迁移有版本处理。

## DATA-008 内容渲染安全边界（P1）

- 目标：审查 Markdown、HTML directive、GitHub Card、Mermaid 和外链内容的渲染边界。
- 范围：sanitize、允许标签/属性、协议白名单和脚本阻断；保留合法自定义内容。
- 验收：XSS fixture 被阻断；合法 Markdown/MDX、图表和图片回归通过。

## DATA-009 内容构建缓存（P2）

- 目标：减少重复内容解析、远程获取和图像处理。
- 范围：按输入 hash 缓存可重用的 feed、markdown capability、image optimization 结果。
- 验收：第二次构建明显减少重复工作；输入变化会正确失效；缓存损坏可自动恢复。
