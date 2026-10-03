# Tsukimi architecture

Astro statically renders routes from `src/pages/`, with `Layout.astro` and `MainGridLayout.astro` composing the site shell. Docs pages use `DocsLayout.astro` and a separate content namespace. The `posts` and `spec` collections are defined in `src/content.config.ts`.

Reusable primitives live under `src/components/atoms`, feature composites under `src/components/features`, page-wide compositions under `src/components/organisms`, and sidebar modules under `src/components/widgets`. Stable feature entrypoints are exported from `src/components/features/index.ts`; component boundary and cycle checks run in CI.

Builds run content synchronization, feed generation, Markdown capability generation, image optimization, Astro static generation, Pagefind, font compression, resource reporting, and performance/a11y gates. `siteConfig.featurePages` and `featurePageRegistry` keep optional pages and routes consistent.
