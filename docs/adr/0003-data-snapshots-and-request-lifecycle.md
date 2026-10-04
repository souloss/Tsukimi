# ADR 0003: External data request lifecycle and snapshots

## Context

Build time RSS, Bangumi and Bilibili requests can time out or return invalid
data. A single provider must not erase the last usable generated data.

## Decision

Build adapters use a bounded timeout, one abort path, classified errors and
bounded retries. Successful outputs are written atomically and accompanied by a
local metadata snapshot containing schema version, source, fetched time and
commit. Empty provider responses may use the last valid snapshot.

## Alternatives

Failing the whole build was rejected for optional integrations. Silently
accepting stale data was rejected; summaries and timestamps make staleness
observable.

## Consequences

Generated data remains compatible with existing page shapes, while ignored
snapshot files provide recovery and diagnostics.

## Verification

`pnpm test` and the `external-request` tests cover retry, timeout, cancellation
and parsing paths.
