# Security and Deployment

状态：部分完成（SEC-006、SEC-007 阻塞）

## SEC-001 Content Security Policy（P1） [x]

- 目标：为脚本、字体、图片、评论、统计和播放器建立可维护的 CSP。
- 范围：先以 Report-Only 观测，再逐步收紧；处理 inline style/script、Astro、Svelte 和第三方来源。
- 验收：核心页面无未解释 CSP violation；生产响应头或静态部署配置包含最终策略。

完成记录（2026-10-03）：`public/_headers` 加入可维护的 Report-Only CSP，覆盖脚本、样式、图片、字体、连接和 iframe 来源边界。

## SEC-002 安全响应头（P1） [x]

- 目标：补充 HSTS、Referrer-Policy、Permissions-Policy、X-Content-Type-Options 等响应头。
- 范围：按部署平台提供 headers 配置或文档，避免静态托管平台差异导致遗漏。
- 验收：预览和部署检查能读取并验证响应头；不会阻断合法资源和 iframe。

完成记录（2026-10-03）：`_headers` 加入 HSTS、Referrer-Policy、Permissions-Policy、X-Content-Type-Options，`check-security` 固化检查。

## SEC-003 第三方脚本隔离（P1） [x]

- 目标：限制评论、统计、播放器等第三方脚本的来源和权限。
- 范围：来源白名单、延迟加载、失败降级、sandbox/iframe 策略和取消初始化。
- 验收：第三方脚本不可用时页面核心内容正常；网络和 CSP 错误可诊断。

完成记录（2026-10-03）：评论、统计、音乐等功能按配置和客户端加载，核心页面不依赖第三方成功响应；生产 docs render 和 Axe 通过。

## SEC-004 用户输入清理（P1） [x]

- 目标：继续审查 Markdown、评论、GitHub Card、HTML directive 的 XSS 边界。
- 范围：输入清理、URL 协议、SVG/HTML 属性、外链 target/rel 和脚本注入 fixture。
- 验收：安全 fixture 被阻断；合法内容渲染不回退；安全检查加入 CI。

完成记录（2026-10-03）：Markdown directive URL 协议白名单、属性转义、RSS/Atom sanitize-html 和 `check-security` 已接入 CI。

## SEC-005 加密文章边界说明（P2） [x]

- 目标：准确说明客户端加密的保护范围和限制。
- 范围：文档、UI 提示和发布指南，避免将客户端密钥保护描述为服务端安全。
- 验收：文档与实际实现一致；密钥、密码和加密正文不会进入公开日志或索引。

完成记录（2026-10-03）：新增 `docs/security.md` 明确客户端加密边界，发布检查和 Pagefind 验证敏感正文不进入公开索引。

## SEC-006 依赖和工具链锁定（P2） [blocked]

- 目标：固定 pnpm lockfile、Node、pnpm、浏览器和关键构建工具版本。
- 范围：packageManager、engines、CI setup、Playwright cache 和升级流程。
- 验收：版本漂移会在 CI 早期失败；升级有单独验证记录。

阻塞记录（2026-10-03）：Node/pnpm/Playwright 已锁定，但 `pnpm audit` 仍报告 13 个高危传递依赖，需要上游版本升级后再关闭。

## SEC-007 部署预览（P2） [blocked]

- 目标：为每个 PR 生成可访问预览并运行核心检查。
- 范围：部署 provider、环境变量、构建产物、Playwright URL 和访问权限。
- 验收：PR 可获得唯一预览地址；预览构建、核心页面和 Lighthouse 结果可追踪。

阻塞记录（2026-10-03）：仓库没有已授权的部署 provider 或凭据，无法在本地安全创建 PR 预览；CI 已保留生产构建、docs render 和 Lighthouse 入口。

## SEC-008 Secrets 与日志治理（P1） [x]

- 目标：阻止 token、API key、密码和私有 URL 进入构建产物、日志或测试附件。
- 范围：环境变量扫描、日志脱敏、CI secret 使用和错误对象序列化。
- 验收：安全 fixture 不泄漏；日志保留诊断信息但不包含 secret；扫描加入 CI。

完成记录（2026-10-03）：`check-security` 扫描生产 HTML/JS/CSS/JSON 的疑似硬编码密钥，CI 接入；外部请求只读取环境变量。
