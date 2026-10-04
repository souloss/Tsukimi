# ADR 0002: Feature boundaries and build gates

## Context

Music, comments, search, settings and Live2D contain browser state and optional
third party resources. Importing them from the shared shell makes disabled
features leak into the client bundle.

## Decision

Each feature exposes a stable entrypoint under `src/components/features`,
configuration is validated by `check-config`, and optional islands are checked
against the generated HTML and client artifacts by `check-feature-gates`.
Component dependency and cycle checks run in CI.

## Alternatives

Relying on convention alone was rejected because an Astro route can still
serialize an island even when a config flag is false.

## Consequences

Feature changes must update the entrypoint, gate fixture and relevant browser
test. The checks add a small build step but catch bundle regressions early.

## Verification

`pnpm check-component-boundaries`, `pnpm check-component-cycles`,
`pnpm check-feature-gate-fixtures`, and `pnpm check-feature-gates`.
