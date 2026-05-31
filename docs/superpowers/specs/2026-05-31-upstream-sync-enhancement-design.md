---
name: upstream-sync-enhancement
description: Comprehensive upstream sync and enhancement plan — Biome migration, dependency upgrades, selective upstream fixes
---

# Upstream Sync and Enhancement Design

**Date**: 2026-05-31
**Status**: Approved
**Scope**: Selective sync of upstream (https://github.com/LyraVoid/Tsukimi.git) improvements while maintaining codebase independence

## Executive Summary

This design outlines a three-phase migration to modernize the codebase:
1. Replace ESLint/Prettier with Biome for faster, unified linting
2. Upgrade key dependencies (TypeScript 6, marked 18, remark-directive 4)
3. Selectively adopt upstream bug fixes

Each phase is independently verifiable with a working build before proceeding to the next.

## Phase 1: Biome Migration

### Goal
Replace ESLint + Prettier with Biome for faster, unified linting and formatting.

### Packages to Remove
- `@eslint/js`
- `eslint`
- `eslint-plugin-astro`
- `eslint-plugin-import`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-svelte`
- `astro-eslint-parser`
- `svelte-eslint-parser`
- `typescript-eslint`
- `globals`
- `prettier`
- `prettier-plugin-astro`
- `prettier-plugin-svelte`

### Package to Add
- `@biomejs/biome`: `^2.4.15` (match upstream master)

### Config Changes

1. **Delete**: `eslint.config.js`, `.prettierrc`
2. **Create**: `biome.json` with our preferences:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "includes": [
      "**",
      "!**/src/**/*.css",
      "!**/dist/**/*",
      "!**/node_modules/**/*",
      "!**/.astro/**/*",
      "!**/public/**/*",
      "!**/demo/**/*",
      "!**/scripts/**/*"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 80
  },
  "assist": { "actions": { "source": { "organizeImports": "on" } } },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noParameterAssign": "error",
        "useAsConstAssertion": "error",
        "useDefaultParameterLast": "error",
        "useEnumInitializers": "error",
        "useSelfClosingElements": "error",
        "useSingleVarDeclarator": "error",
        "noUnusedTemplateLiteral": "error",
        "useNumberNamespace": "error",
        "noInferrableTypes": "error",
        "noUselessElse": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all",
      "arrowParentheses": "always"
    }
  },
  "overrides": [
    {
      "includes": ["**/*.svelte", "**/*.astro", "**/*.vue"],
      "linter": {
        "rules": {
          "style": {
            "useConst": "off",
            "useImportType": "off"
          },
          "correctness": {
            "noUnusedVariables": "off",
            "noUnusedImports": "off"
          }
        }
      }
    }
  ]
}
```

### Script Changes
- `format`: `prettier --write ./src` → `biome format --write ./src`
- `lint`: `eslint ./src --fix` → `biome check --write ./src`
- Remove `format:check` (use `biome check ./src` without `--write`)

### Execution Steps
1. Remove old packages from `package.json`
2. Add `@biomejs/biome`
3. Create `biome.json`
4. Update scripts in `package.json`
5. Run `pnpm install`
6. Run `biome check --write ./src` to auto-fix
7. Manually fix any remaining violations
8. Run `pnpm build` to verify
9. Commit: `chore: migrate from ESLint/Prettier to Biome`

### Keep
- `simple-git-hooks` + `lint-staged` — update lint-staged config to use Biome instead of ESLint/Prettier
- Current lint-staged config uses `eslint --fix` + `prettier --write` per file type
- Replace with: `biome check --write --no-errors-on-unmatched` for all file types

---

## Phase 2: Dependency Upgrades

### Sub-phase 2a: TypeScript 5→6

**Upgrade**: `typescript`: `^5.9.3` → `^6.0.3`

**TS 6 Breaking Changes to Watch**:
- Stricter type checking in certain scenarios
- `enum` related changes
- Removed deprecated APIs

**Execution**:
1. Update `typescript` version in `package.json`
2. Run `pnpm install`
3. Run `pnpm type-check` to identify errors
4. Fix type errors iteratively
5. Run `pnpm build` to verify
6. Commit: `chore: upgrade TypeScript to 6.0.3`

### Sub-phase 2b: Markdown Processing

**Upgrades**:
- `marked`: `^16.4.2` → `^18.0.4`
- `remark-directive`: `^3.0.1` → `^4.0.0`
- `remark-directive-rehype`: `^0.4.2` → `^1.0.0`

**Breaking Changes**:
- `remark-directive` v4 has API changes in directive processing
- `marked` v18 may have parsing changes

**Execution**:
1. Update versions in `package.json`
2. Run `pnpm install`
3. Run `pnpm build`
4. Manually verify posts render correctly (admonitions, GitHub cards, custom directives)
5. Fix any rendering issues
6. Commit: `chore: upgrade markdown processing dependencies`

### Sub-phase 2c: Minor/Patch Bumps

**Upgrades**:
- `astro`: `^6.3.7` → `^6.3.8` (pin to match upstream)
- `svelte`: `^5.55.5` → `^5.55.9`
- `katex`: `^0.16.45` → `^0.16.47`
- `overlayscrollbars`: `^2.15.1` → `^2.16.0`
- `@tailwindcss/typography`: `^0.5.19` → match upstream

**Execution**:
1. Update versions
2. Run `pnpm install`
3. Run `pnpm build`
4. Commit: `chore: bump minor/patch versions`

---

## Phase 3: Upstream Code Fixes

### Adopt

1. **TOC depth fix from `bata` branch**
   - Check `src/utils/tocManager.ts` for the same issues
   - Apply fix if applicable

2. **Upstream config patterns**
   - `tsconfig.json` changes for TS 6 compatibility
   - `svelte.config.js` changes if needed
   - `astro.config.mjs` plugin configuration updates

### Skip (Already Implemented Differently)

- Wallpaper mode features — we have CSS variable-driven effects
- Banner page overlay — already implemented
- Theme switch View Transition API — already implemented
- Hydration guard — already implemented
- Archive filtering — fixed with `ArchivePanel.svelte`
- Mermaid optimization — already have lazy loading + skeleton
- Atom feed fixes — already fixed
- Encrypted content — we use `pako`, upstream uses `crypto-js`

### Evaluation Required

- Compare `tsconfig.json` with upstream for TS 6 compatibility
- Compare `svelte.config.js` for Vite/compiler changes
- Compare `astro.config.mjs` for plugin config changes

---

## Success Criteria

1. **Biome migration**: `pnpm lint` and `pnpm format` work with Biome, no ESLint/Prettier packages remain
2. **Dependency upgrades**: `pnpm build` passes, `pnpm type-check` passes, posts render correctly
3. **Upstream fixes**: TOC works correctly on mobile, no regressions in existing features
4. **Codebase cleanliness**: No debug files, no unused dependencies, clean git history

## Rollback Plan

Each phase is a separate commit. If any phase fails:
1. `git revert HEAD` to undo the last commit
2. Investigate the issue
3. Fix and re-commit, or skip the problematic change

## Related

- [[dev-optimization-architecture]]
- [[branch-push-rules]]
