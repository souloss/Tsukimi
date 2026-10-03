# Security and deployment boundaries

Static deployments use `public/_headers` for HSTS, referrer and permissions policies, content type protection, cache policy, and a report-only CSP. The CSP remains report-only because the site intentionally supports inline Astro/Svelte bootstrap code and configured third-party services; tighten the policy after collecting reports for the configured deployment.

Markdown directives pass URLs through `sanitizeUrl`, reject `javascript:`/`vbscript:` and unsafe data URLs, and escape generated attributes. RSS and Atom output is sanitized with `sanitize-html`. Third-party widgets are optional and loaded only when their feature is enabled, so core content remains available when a provider fails.

Client-side encrypted posts protect content from casual readers in the browser. The password and key are not a server-side access-control boundary; sensitive material must use a private publishing system.
