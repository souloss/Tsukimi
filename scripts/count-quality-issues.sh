#!/bin/bash
# Quality issues benchmark: counts warnings + hints from astro check, tsc, biome

TOTAL=0

# Astro check: parse the summary line like "Result (8 hints, 0 warnings, 0 errors)"
ASTRO_OUTPUT=$(pnpm check 2>&1 || true)
ASTRO_HINTS=$(echo "$ASTRO_OUTPUT" | grep -oP '\d+(?= hints?)' || true)
ASTRO_HINTS=${ASTRO_HINTS:-0}
ASTRO_WARNINGS=$(echo "$ASTRO_OUTPUT" | grep -oP '\d+(?= warnings?)' || true)
ASTRO_WARNINGS=${ASTRO_WARNINGS:-0}
ASTRO_ERRORS=$(echo "$ASTRO_OUTPUT" | grep -oP '\d+(?= errors?)' || true)
ASTRO_ERRORS=${ASTRO_ERRORS:-0}
ASTRO_COUNT=$((ASTRO_HINTS + ASTRO_WARNINGS + ASTRO_ERRORS))
TOTAL=$((TOTAL + ASTRO_COUNT))

# TypeScript check
TSC_OUTPUT=$(pnpm type-check 2>&1 || true)
if echo "$TSC_OUTPUT" | grep -q "error TS"; then
  TSC_COUNT=$(echo "$TSC_OUTPUT" | grep -c "error TS" || true)
  TSC_COUNT=${TSC_COUNT:-0}
else
  TSC_COUNT=0
fi
TOTAL=$((TOTAL + TSC_COUNT))

# Biome check: parse "Found X errors, Y warnings" or "Checked X files. No errors found."
BIOME_OUTPUT=$(pnpm lint 2>&1 || true)
BIOME_WARNINGS=$(echo "$BIOME_OUTPUT" | grep -oP '\d+(?= warnings?)' || true)
BIOME_WARNINGS=${BIOME_WARNINGS:-0}
BIOME_ERRORS=$(echo "$BIOME_OUTPUT" | grep -oP '\d+(?= errors)' || true)
BIOME_ERRORS=${BIOME_ERRORS:-0}
BIOME_COUNT=$((BIOME_WARNINGS + BIOME_ERRORS))
TOTAL=$((TOTAL + BIOME_COUNT))

# Output JSON
echo "{\"primary\": $TOTAL, \"astro_hints\": $ASTRO_COUNT, \"tsc_errors\": $TSC_COUNT, \"biome_warnings\": $BIOME_COUNT, \"total\": $TOTAL}"
