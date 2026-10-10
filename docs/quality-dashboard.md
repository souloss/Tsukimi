# Quality dashboard

CI produces the performance matrix at `docs/generated/performance-matrix.json` as an artifact. The same workflow records Astro/type checks, unit coverage, static content/data/link/security checks, Axe markup, Playwright browser results, and production build budgets. Each report includes the command and commit from the workflow run, so a regression can be traced to a page and change.

The `changelog` job creates a commit-range summary artifact for every push and pull request. It groups conventional commit subjects, marks breaking changes, links commits when the remote is GitHub, and redacts common credential-shaped strings. It does not rewrite `CHANGELOG.md`; maintainers review the artifact before preparing a release.

`quality-report.json` also records `ref`, `baseCommit`, and workflow `run` metadata. These fields are the join keys for a future retained history store; a local report uses `local`/`null` values rather than inventing CI provenance.

Local entry points:

- `pnpm test:coverage`
- `pnpm test:e2e`
- `pnpm perf:matrix` and `pnpm perf:budget`
- `pnpm check-docs-render` against a production preview
- `pnpm changelog:generate -- --from <base-ref> --to <head-ref>`
