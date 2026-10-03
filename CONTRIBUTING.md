# Contributing

Use Node 22 and pnpm 10.33.0. Run `pnpm install`, then `pnpm astro check`, `pnpm type-check`, and `pnpm test` before opening a change. UI changes should also run `pnpm test:e2e`; content changes should run `pnpm check-content` and `pnpm check-publish`.

For a new feature page, update its feature gate, `featurePageRegistry`, navigation, and route page together. A new sidebar widget must declare its type, appear in `sidebarLayoutConfig.components`, and be registered in both sidebar renderers. Reuse existing atoms and feature barrels before creating a new component.

Use CSS variables from `src/styles/variables.styl` and `src/styles/motion-tokens.css` for shared visual values. Add a plan completion record with the date, changed files, and validation commands.
