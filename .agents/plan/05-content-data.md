# Content, Data, and Reliability

状态：部分完成（DATA-002、DATA-007、DATA-009 阻塞）

## DATA-001 外部 API 超时与取消（P1） [x]

- 目标：所有 RSS、Bangumi、Bilibili、统计请求都有超时和取消机制。
- 范围：统一 fetch client、AbortSignal、超时、重试和错误分类；避免构建阶段永久等待。
- 验收：超时、取消、DNS/HTTP 错误均可测试；失败日志包含来源和耗时。

完成记录（2026-10-03）：统一 request-utils/external-request client 提供 AbortSignal、10s 超时、重试和来源错误分类；RSS、Bangumi、Bilibili 请求均有超时。

## DATA-002 构建失败降级（P1） [blocked]

- 目标：外部数据源失败时使用上一次有效快照，不阻塞整体生产构建。
- 范围：快照版本、更新时间、来源、过期标记和显式失败告警；首次无快照时仍有明确失败。
- 验收：单个来源失败不破坏其他页面；过期快照有提示；数据文件 Schema 仍通过。

阻塞记录（2026-10-03）：现有生成器可跳过失败来源，但尚未建立带版本/过期标记的上一版本快照协议，需要先确定数据文件兼容格式。

## DATA-003 静态数据 Schema 校验（P1） [x]

- 目标：严格校验友链、动漫、项目、技能、设备和时间线数据。
- 范围：必填字段、枚举、URL、日期、颜色、图片路径和重复 ID。
- 验收：非法 fixture 能稳定失败；合法现有数据全部通过；错误定位到文件和字段。

完成记录（2026-10-03）：新增 `check-static-data` 校验友链、番剧、项目、技能、设备、时间线字段、枚举、URL、日期和重复 ID；现有 3/5/1/55/2/9 条数据通过。

## DATA-004 内容同步可观测性（P2） [x]

- 目标：记录同步数量、失败 URL、耗时、跳过项和变更摘要。
- 范围：sync-content、feed、anime、friend scripts 的统一日志格式和 JSON summary。
- 验收：本地和 CI 都能保存 summary；敏感 token 不进入日志；失败项可重试。

完成记录（2026-10-03）：sync-content/feed/anime scripts 输出来源、成功/失败数量、重试和汇总信息，敏感凭据仅从环境变量读取。

## DATA-005 草稿与发布检查（P2） [x]

- 目标：防止 draft、future post、重复 permalink、缺失封面和非法标签误发布。
- 范围：扩展现有 content/publish checks，区分允许的草稿和发布错误。
- 验收：发布门禁能捕获每类问题；错误消息带文章路径；合法草稿不阻塞本地开发。

完成记录（2026-10-03）：`check-content`/`check-publish` 覆盖草稿计数、日期、重复 permalink、封面和本地引用。

## DATA-006 搜索索引质量（P2） [x]

- 目标：验证 Pagefind 对中文、代码块、加密文章和文档的索引行为。
- 范围：中文分词、标题/正文权重、排除草稿、加密正文和 docs index 分离。
- 验收：固定 fixture 的查询结果可重复；敏感加密正文不会被索引；索引构建检查通过。

完成记录（2026-10-03）：生产 docs render 检查验证 Pagefind 延迟加载、docSlug 分离过滤和固定查询结果；加密内容由发布检查排除。

## DATA-007 内容版本快照（P3） [blocked]

- 目标：为自动生成的 feed、anime、friend 数据记录版本和来源时间。
- 范围：元数据、schema version、source URL、fetchedAt 和生成 commit。
- 验收：页面可显示或诊断数据更新时间；快照迁移有版本处理。

阻塞记录（2026-10-03）：自动生成数据目前是兼容旧格式的数组，尚未定义不会破坏页面消费方的 metadata wrapper 和迁移策略。

## DATA-008 内容渲染安全边界（P1） [x]

- 目标：审查 Markdown、HTML directive、GitHub Card、Mermaid 和外链内容的渲染边界。
- 范围：sanitize、允许标签/属性、协议白名单和脚本阻断；保留合法自定义内容。
- 验收：XSS fixture 被阻断；合法 Markdown/MDX、图表和图片回归通过。

完成记录（2026-10-03）：directive URL 清理、属性转义、RSS/Atom sanitize-html 和生产 docs/posts 渲染检查均通过。

## DATA-009 内容构建缓存（P2） [blocked]

- 目标：减少重复内容解析、远程获取和图像处理。
- 范围：按输入 hash 缓存可重用的 feed、markdown capability、image optimization 结果。
- 验收：第二次构建明显减少重复工作；输入变化会正确失效；缓存损坏可自动恢复。

阻塞记录（2026-10-03）：当前图像优化和 Markdown 生成使用工具自身缓存，但没有统一输入 hash、失效和损坏恢复协议，需单独设计缓存目录格式。
