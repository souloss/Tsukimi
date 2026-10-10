# ADR 0004: Performance budgets and opt-in real user metrics

## Context

Static bundle size, browser metrics and third party loading regressions need
different signals and must not make every local build depend on an analytics
service.

## Decision

Build budgets and route resource reports run without network access. Lighthouse
is an explicit opt-in matrix. Real user metrics use the existing
`performance-observer` and are disabled by default; when enabled, sampling and
an explicit endpoint are required and only metric metadata is sent. Observers
are capability-detected, cleaned up on navigation, and batched before using
`sendBeacon` or a guarded keepalive request.

## Consequences

Local builds remain private and deterministic. Deployments that opt in must
document endpoint retention and privacy policy.

## Verification

`pnpm perf:budget`, `pnpm perf:matrix`, Playwright performance assertions,
`initSampledPerformanceReporting` tests/usage, and the opt-in queue transport
in `Layout.astro`.
