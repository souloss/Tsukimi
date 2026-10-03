# Quality dashboard

CI produces the performance matrix at `docs/generated/performance-matrix.json` as an artifact. The same workflow records Astro/type checks, unit coverage, static content/data/link/security checks, Axe markup, Playwright browser results, and production build budgets. Each report includes the command and commit from the workflow run, so a regression can be traced to a page and change.

Local entry points:

- `pnpm test:coverage`
- `pnpm test:e2e`
- `pnpm perf:matrix` and `pnpm perf:budget`
- `pnpm check-docs-render` against a production preview
