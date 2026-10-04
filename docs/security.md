# Security and deployment boundaries

Static deployments use `public/_headers` for HSTS, referrer and permissions policies, content type protection, cache policy, and a report-only CSP. The CSP remains report-only because the site intentionally supports inline Astro/Svelte bootstrap code and configured third-party services; tighten the policy after collecting reports for the configured deployment.

Markdown directives pass URLs through `sanitizeUrl`, reject `javascript:`/`vbscript:` and unsafe data URLs, and escape generated attributes. RSS and Atom output is sanitized with `sanitize-html`. Third-party widgets are optional and loaded only when their feature is enabled, so core content remains available when a provider fails.

Client-side encrypted posts protect content from casual readers in the browser. The password and key are not a server-side access-control boundary; sensitive material must use a private publishing system.
## 依赖审计豁免

CI 每次运行 `pnpm check-dependencies`。当前 npm advisory 数据包含一组来自 Astro/SVGO/undici/brace-expansion/devalue 的传递依赖告警；它们已记录在脚本默认的 `TSUKIMI_AUDIT_ALLOWLIST` 中，构建仍会打印数量和 advisory 编号。升级依赖时必须重新运行审计并移除已修复编号；任何未列入清单的 high/critical 告警都会使 CI 失败。
