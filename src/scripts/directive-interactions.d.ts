/**
 * Type declarations for directive-interactions.js
 * Client-side JS for interactive markdown directives
 */

/** Initialize all directive interactions (idempotent — guarded against duplicate calls) */
export function initDirectiveInteractions(): void;

/** Re-initialize directives that need per-page setup after Swup transitions */
export function reinitDirectiveInteractions(): void;
