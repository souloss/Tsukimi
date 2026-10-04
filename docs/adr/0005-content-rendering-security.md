# ADR 0005: Content rendering security boundary

## Context

Markdown directives intentionally support links, images, embeds, diagrams and
HTML-like attributes. These inputs must not become executable script URLs or
unescaped attributes.

## Decision

Directive URLs pass through protocol and attribute sanitizers, RSS/Atom output
uses `sanitize-html`, and generated artifacts are scanned for executable URL
protocols and likely secrets. Third party embeds remain opt-in and lazy.

## Consequences

Some malformed custom content is rejected or rendered as a safe fallback. A
private publishing system remains required for confidential material.

## Verification

`pnpm check-security`, `pnpm check-deployment-headers`, content validation and
the Markdown rendering tests.
