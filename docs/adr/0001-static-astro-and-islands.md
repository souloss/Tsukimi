# ADR 0001: Static Astro pages with Svelte islands

## Context

Tsukimi is primarily a content site. Most pages can be generated once, while search, settings, music, comments, and navigation need browser state.

## Decision

Use Astro static output for route HTML and hydrate Svelte only for interactive islands. Keep feature availability in configuration and validate route gates during CI.

## Alternatives

A server-rendered application would simplify request-time data but add hosting state and runtime cost. A client-only application would reduce server templates but ship more JavaScript and weaken static SEO.

## Consequences

Build-time content and Pagefind are fast and cacheable. External data must have timeouts and graceful fallback, and browser state must be migrated explicitly.

## Verification

`pnpm build`, `pnpm check-feature-gates`, `pnpm perf:budget`, and the Playwright/docs render checks validate the decision.
